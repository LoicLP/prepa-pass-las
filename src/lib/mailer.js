import nodemailer from 'nodemailer';

/* Envoi d'e-mails transactionnels (SMTP, mêmes variables que la relance J+1)
   et gabarit commun : en-tête indigo avec Pico, corps, bouton, pied de page. */

const SITE = 'https://www.prepa-pass-las.fr';

export function getTransporter() {
  const pass = process.env.SMTP_PASSWORD_B64
    ? Buffer.from(process.env.SMTP_PASSWORD_B64, 'base64').toString('utf-8')
    : process.env.SMTP_PASSWORD;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass },
  });
}

export async function sendMail({ to, subject, html }) {
  const transporter = getTransporter();
  return transporter.sendMail({ from: `"Pico · Prépa PASS/LAS" <${process.env.SMTP_USER}>`, to, subject, html });
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Gabarit : `paragraphs` = tableau de chaînes HTML (déjà échappées si besoin). */
export function layout({ title, emoji = '🦉', paragraphs = [], cta, footnote, unsub = 'Tu reçois cet email car tu as un compte sur prepa-pass-las.fr' }) {
  const body = paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:15px;color:#374151;line-height:1.6;">${p}</p>`).join('');
  const button = cta ? `
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-top:8px;">
          <a href="${esc(cta.href)}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:14px;">${esc(cta.label)}</a>
        </td></tr></table>` : '';
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;padding:40px 16px;"><tr><td align="center">
    <table width="100%" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(79,70,229,0.08);">
      <tr><td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4f46e5 100%);padding:36px 32px;text-align:center;">
        <div style="font-size:44px;margin-bottom:10px;">${emoji}</div>
        <h1 style="margin:0;font-size:24px;font-weight:900;color:#ffffff;">${esc(title)}</h1>
      </td></tr>
      <tr><td style="padding:32px;">${body}${button}
        ${footnote ? `<p style="margin:24px 0 0;font-size:12px;color:#9ca3af;text-align:center;">${footnote}</p>` : ''}
      </td></tr>
      <tr><td style="background:#f8fafc;padding:18px 32px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#9ca3af;">${unsub}</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

/** Statistiques simples d'un profil, pour personnaliser les mails. */
export function summarize(profile, days = 7) {
  const sessions = (profile?.qcm_stats?.sessions || []).filter((s) => s.date);
  const cutoff = Date.now() - days * 86400000;
  const recent = sessions.filter((s) => new Date(s.date).getTime() >= cutoff);
  const pct = (s) => (Number.isFinite(s.percentage) ? s.percentage : s.total > 0 ? Math.round((s.correct / s.total) * 100) : null);
  const scored = recent.map(pct).filter((x) => x != null);
  const avg = scored.length ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : null;
  const bySubject = {};
  for (const s of recent) {
    const p = pct(s); if (p == null || !s.subjectName || s.subject === 'review' || s.subject === 'custom') continue;
    (bySubject[s.subjectName] ||= []).push(p);
  }
  const ranked = Object.entries(bySubject).map(([n, v]) => [n, Math.round(v.reduce((a, b) => a + b, 0) / v.length)]).sort((a, b) => b[1] - a[1]);
  const daysActive = new Set(recent.map((s) => s.date.slice(0, 10))).size;
  const pile = (profile?.qcm_stats?.reviewQueue || []).length;
  return { total: sessions.length, recent: recent.length, avg, best: ranked[0] || null, worst: ranked.length > 1 ? ranked[ranked.length - 1] : null, daysActive, pile };
}

export { SITE, esc };
