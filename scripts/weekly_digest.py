#!/usr/bin/env python3
"""
Bilan hebdomadaire Prépa PASS/LAS — envoyé chaque dimanche soir par Pico 🦉

Pour chaque étudiant actif cette semaine (≥ 1 session sur 7 jours) :
  - sessions, score moyen de la semaine (et écart vs semaine précédente)
  - streak en cours
  - matière la plus faible de la semaine → recommandation
  - questions en attente dans la pile « À consolider »

Réutilise la config SES de ~/mailing-aws (config.ini + .venv + suppressions.csv).

Usage :
  # Aperçu sans envoi : génère des .html dans /tmp/weekly_digest_preview/
  python3 scripts/weekly_digest.py --dry-run

  # Aperçu avec données factices (ne touche pas Supabase)
  python3 scripts/weekly_digest.py --sample

  # Envoi de test à une seule adresse (avec les données réelles de ce compte)
  python3 scripts/weekly_digest.py --test moi@exemple.fr

  # Envoi réel à tous les étudiants actifs
  python3 scripts/weekly_digest.py --send

Cron (dimanche 19h) :
  0 19 * * 0 /Users/loicgautier/mailing-aws/.venv/bin/python /Users/loicgautier/prepa-pass-las/scripts/weekly_digest.py --send >> /tmp/weekly_digest.log 2>&1
"""

import argparse
import configparser
import csv
import json
import os
import sys
import time
import urllib.request
from datetime import datetime, timedelta, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(HERE)
MAILING_DIR = os.path.expanduser("~/mailing-aws")
PREVIEW_DIR = "/tmp/weekly_digest_preview"

SUBJECT_NAMES = {
    "chimie": "Chimie / Biochimie",
    "biocell": "Biologie cellulaire",
    "biophysique": "Biophysique",
    "biostats": "Biostatistiques",
    "anatomie": "Anatomie",
    "ssh": "SSH / Éthique",
}


# ---------------------------------------------------------------- config
def load_env_local():
    env = {}
    path = os.path.join(PROJECT, ".env.local")
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()
    return env


def load_ses_config():
    cfg = configparser.ConfigParser()
    cfg.read(os.path.join(MAILING_DIR, "config.ini"))
    return cfg


def load_suppressions():
    path = os.path.join(MAILING_DIR, "suppressions.csv")
    out = set()
    if os.path.exists(path):
        with open(path) as f:
            for row in csv.reader(f):
                if row and "@" in row[0]:
                    out.add(row[0].strip().lower())
    return out


# ---------------------------------------------------------------- supabase
def sb_get(env, path):
    url = env["NEXT_PUBLIC_SUPABASE_URL"] + path
    req = urllib.request.Request(url, headers={
        "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
        "Authorization": "Bearer " + env["SUPABASE_SERVICE_ROLE_KEY"],
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def fetch_users(env):
    """Tous les comptes (id → email) via l'API admin, paginée."""
    users, page = {}, 1
    while True:
        data = sb_get(env, f"/auth/v1/admin/users?page={page}&per_page=200")
        batch = data.get("users", [])
        if not batch:
            break
        for u in batch:
            if u.get("email"):
                users[u["id"]] = u["email"]
        if len(batch) < 200:
            break
        page += 1
    return users


def fetch_profiles(env):
    return sb_get(env, "/rest/v1/user_profiles?select=id,display_name,qcm_stats,examen_stats")


# ---------------------------------------------------------------- stats
def compute_week_stats(profile, now=None):
    """Stats de la semaine écoulée pour un profil. None si inactif."""
    now = now or datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)
    two_weeks_ago = now - timedelta(days=14)

    sessions = []
    for key in ("qcm_stats", "examen_stats"):
        blob = profile.get(key) or {}
        sessions.extend(blob.get("sessions") or [])

    def parse(d):
        try:
            return datetime.fromisoformat(d.replace("Z", "+00:00"))
        except Exception:
            return None

    dated = [(parse(s.get("date", "")), s) for s in sessions]
    dated = [(d, s) for d, s in dated if d]

    this_week = [s for d, s in dated if d >= week_ago]
    last_week = [s for d, s in dated if two_weeks_ago <= d < week_ago]
    if not this_week:
        return None

    avg = round(sum(s.get("percentage", 0) for s in this_week) / len(this_week))
    prev_avg = (round(sum(s.get("percentage", 0) for s in last_week) / len(last_week))
                if last_week else None)

    # Streak (jours consécutifs jusqu'à aujourd'hui ou hier)
    days = {d.date() for d, _ in dated}
    cursor = now.date()
    if cursor not in days:
        cursor -= timedelta(days=1)
    streak = 0
    while cursor in days:
        streak += 1
        cursor -= timedelta(days=1)

    # Matière la plus faible de la semaine (≥ 2 sessions)
    by_subject = {}
    for s in this_week:
        sub = s.get("subject")
        if sub and sub in SUBJECT_NAMES:
            by_subject.setdefault(sub, []).append(s.get("percentage", 0))
    weakest = None
    candidates = [(sum(v) / len(v), k) for k, v in by_subject.items() if len(v) >= 1]
    if candidates:
        score, sub = min(candidates)
        weakest = {"name": SUBJECT_NAMES[sub], "avg": round(score)}

    # Pile « À consolider »
    queue = (profile.get("qcm_stats") or {}).get("reviewQueue") or []
    today = now.date().isoformat()
    due = len([e for e in queue if e.get("dueDate", "9999") <= today])

    total_minutes = round(sum(s.get("duration", 0) for s in this_week) / 60)

    return {
        "count": len(this_week),
        "avg": avg,
        "delta": (avg - prev_avg) if prev_avg is not None else None,
        "streak": streak,
        "weakest": weakest,
        "review_due": due,
        "minutes": total_minutes,
    }


# ---------------------------------------------------------------- email
def render_email(first_name, st):
    delta_html = ""
    if st["delta"] is not None:
        color = "#1d7a4f" if st["delta"] >= 0 else "#b91c46"
        sign = "+" if st["delta"] >= 0 else ""
        delta_html = f'<span style="color:{color};font-weight:700;font-size:13px"> ({sign}{st["delta"]} pts vs semaine dernière)</span>'

    streak_row = ""
    if st["streak"] >= 2:
        streak_row = f"""<tr><td style="padding:6px 0;font-size:14px;color:#2a2c44">🔥 <strong>{st['streak']} jours d'affilée</strong> — belle régularité, ne lâche pas !</td></tr>"""

    weakest_row = ""
    if st["weakest"]:
        weakest_row = f"""<tr><td style="padding:6px 0;font-size:14px;color:#2a2c44">🎯 Semaine prochaine, cible la <strong>{st['weakest']['name']}</strong> ({st['weakest']['avg']}% cette semaine) : c'est là que tu as le plus de points à gagner.</td></tr>"""

    review_row = ""
    if st["review_due"] > 0:
        review_row = f"""<tr><td style="padding:6px 0;font-size:14px;color:#2a2c44">🔁 <strong>{st['review_due']} question{'s' if st['review_due'] > 1 else ''}</strong> t'attendent dans ta pile « À consolider ».</td></tr>"""

    prenom = f" {first_name}" if first_name else ""
    return f"""<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f5fb;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5fb;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%">
  <tr><td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:16px 16px 0 0;padding:22px 28px">
    <span style="font-size:26px">🦉</span>
    <span style="color:#fff;font-size:17px;font-weight:800;vertical-align:middle">&nbsp;Ta semaine de révisions</span><br>
    <span style="color:rgba(255,255,255,.75);font-size:12px">Le bilan de Pico · Prépa PASS/LAS</span>
  </td></tr>
  <tr><td style="background:#ffffff;padding:24px 28px;border:1px solid #e8e6f5;border-top:none;border-radius:0 0 16px 16px">
    <p style="font-size:14.5px;color:#2a2c44;margin:0 0 16px">Salut{prenom} ! Voici ce que tu as accompli cette semaine :</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5fb;border-radius:12px;margin-bottom:16px">
      <tr>
        <td align="center" style="padding:14px 6px">
          <div style="font-size:22px;font-weight:800;color:#0f1020">{st['count']}</div>
          <div style="font-size:11px;color:#8a8ea8;text-transform:uppercase;letter-spacing:.06em">Sessions</div>
        </td>
        <td align="center" style="padding:14px 6px;border-left:1px solid #e8e6f5">
          <div style="font-size:22px;font-weight:800;color:#0f1020">{st['avg']}%</div>
          <div style="font-size:11px;color:#8a8ea8;text-transform:uppercase;letter-spacing:.06em">Score moyen</div>
        </td>
        <td align="center" style="padding:14px 6px;border-left:1px solid #e8e6f5">
          <div style="font-size:22px;font-weight:800;color:#0f1020">{st['minutes']}<span style="font-size:13px">min</span></div>
          <div style="font-size:11px;color:#8a8ea8;text-transform:uppercase;letter-spacing:.06em">Travaillées</div>
        </td>
      </tr>
    </table>
    {f'<p style="font-size:14px;color:#2a2c44;margin:0 0 4px">📈 Score moyen : <strong>{st["avg"]}%</strong>{delta_html}</p>' if st['delta'] is not None else ''}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px">
      {streak_row}{weakest_row}{review_row}
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr><td style="background:#4f46e5;border-radius:10px">
      <a href="https://www.prepa-pass-las.fr/dashboard" style="display:inline-block;padding:12px 26px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none">Reprendre mes révisions →</a>
    </td></tr></table>
    <p style="font-size:11px;color:#8a8ea8;margin:20px 0 0;text-align:center">
      Tu reçois ce bilan car tu as un compte Prépa PASS/LAS et tu as révisé cette semaine.<br>
      Pour ne plus le recevoir, réponds simplement « stop » à cet email.
    </p>
  </td></tr>
</table>
</td></tr></table>
</body></html>"""


SAMPLE_STATS = {"count": 6, "avg": 71, "delta": 4, "streak": 5,
                "weakest": {"name": "Biologie cellulaire", "avg": 58},
                "review_due": 7, "minutes": 142}


# ---------------------------------------------------------------- envoi
def send_ses(cfg, to_email, subject, html):
    import boto3
    client = boto3.client("sesv2", region_name=cfg.get("aws", "region", fallback="eu-west-1"))
    from_name = cfg.get("sender", "from_name", fallback="Prépa PASS/LAS")
    from_email = cfg.get("sender", "from_email")
    kwargs = {
        "FromEmailAddress": f"{from_name} <{from_email}>",
        "Destination": {"ToAddresses": [to_email]},
        "Content": {"Simple": {
            "Subject": {"Data": subject, "Charset": "UTF-8"},
            "Body": {"Html": {"Data": html, "Charset": "UTF-8"}},
        }},
    }
    config_set = cfg.get("aws", "configuration_set", fallback="").strip()
    if config_set:
        kwargs["ConfigurationSetName"] = config_set
    client.send_email(**kwargs)


def main():
    ap = argparse.ArgumentParser(description="Bilan hebdo Prépa PASS/LAS")
    mode = ap.add_mutually_exclusive_group(required=True)
    mode.add_argument("--dry-run", action="store_true", help="génère les .html sans envoyer")
    mode.add_argument("--sample", action="store_true", help="aperçu avec données factices (sans Supabase)")
    mode.add_argument("--test", metavar="EMAIL", help="envoie uniquement à cette adresse")
    mode.add_argument("--send", action="store_true", help="envoi réel à tous les actifs")
    args = ap.parse_args()

    subject = "🦉 Ta semaine de révisions — le bilan de Pico"

    os.makedirs(PREVIEW_DIR, exist_ok=True)
    if args.sample:
        html = render_email("Loic", SAMPLE_STATS)
        path = os.path.join(PREVIEW_DIR, "sample.html")
        with open(path, "w") as f:
            f.write(html)
        print(f"Aperçu généré : {path}")
        return

    env = load_env_local()
    cfg = load_ses_config()
    suppressed = load_suppressions()

    print("Chargement des utilisateurs…")
    users = fetch_users(env)
    profiles = fetch_profiles(env)
    print(f"{len(users)} comptes, {len(profiles)} profils")

    sent = skipped = 0
    for p in profiles:
        email_addr = users.get(p["id"], "").lower()
        if not email_addr or email_addr in suppressed:
            continue
        st = compute_week_stats(p)
        if st is None:
            skipped += 1
            continue
        first_name = (p.get("display_name") or "").split(" ")[0]
        html = render_email(first_name, st)

        if args.dry_run:
            path = os.path.join(PREVIEW_DIR, f"{email_addr.replace('@', '_at_')}.html")
            with open(path, "w") as f:
                f.write(html)
            print(f"[dry-run] {email_addr} — {st['count']} sessions, {st['avg']}%")
        elif args.test:
            if email_addr != args.test.lower():
                continue
            send_ses(cfg, email_addr, subject, html)
            print(f"[test] envoyé à {email_addr}")
            return
        else:
            send_ses(cfg, email_addr, subject, html)
            print(f"envoyé à {email_addr} — {st['count']} sessions, {st['avg']}%")
            time.sleep(1)  # cadence sandbox SES : 1 mail/s max
        sent += 1

    print(f"\nTerminé : {sent} bilan(s) {'généré(s)' if args.dry_run else 'envoyé(s)'}, {skipped} inactif(s) ignoré(s)")


if __name__ == "__main__":
    main()
