import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { ImapFlow } from 'imapflow';

/* Cron quotidien (vercel.json) : lit les rapports de non-remise reçus dans la boîte support
   (même compte que le SMTP) et met en liste de suppression les adresses en échec définitif.
   La suppression est stockée sur l'utilisateur Supabase (app_metadata.mail) et lue par
   canEmail() avant tout mail automatique. Les rapports traités reçoivent le mot-clé IMAP
   $Bounced pour ne pas être relus. `?dry=1` liste sans rien modifier. */

export const maxDuration = 60;
const KEYWORD = '$Bounced';
const IMAP_HOST = process.env.IMAP_HOST || 'mail.infomaniak.com';

function smtpPassword() {
  return process.env.SMTP_PASSWORD_B64 ? Buffer.from(process.env.SMTP_PASSWORD_B64, 'base64').toString('utf-8') : process.env.SMTP_PASSWORD;
}

/* Extrait les champs DSN (RFC 3464) d'un rapport : destinataire, action, statut, diagnostic, sujet d'origine. */
function parseBounce(source) {
  const s = source.toString('utf8');
  const rcpt = (s.match(/(?:Final|Original)-Recipient:\s*rfc822;\s*<?([^\s>]+)/i) || [])[1] || null;
  const action = ((s.match(/^Action:\s*(\w+)/im) || [])[1] || '').toLowerCase();
  const status = (s.match(/^Status:\s*([\d.]+)/im) || [])[1] || null;
  const diag = ((s.match(/^Diagnostic-Code:\s*([^\r\n]*(?:\r?\n[ \t][^\r\n]*)*)/im) || [])[1] || '').replace(/\s+/g, ' ').trim().slice(0, 240);
  const subjects = [...s.matchAll(/^Subject:\s*(.*)$/gim)].map((m) => m[1].trim());
  return { rcpt: rcpt ? rcpt.toLowerCase() : null, action, status, diag, origSubject: subjects[1] || null };
}

export async function GET(request) {
  const auth = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const dry = new URL(request.url).searchParams.get('dry') === '1';
  if (!process.env.SMTP_USER || !smtpPassword()) return NextResponse.json({ error: 'SMTP non configuré' }, { status: 500 });

  const client = new ImapFlow({ host: IMAP_HOST, port: 993, secure: true, auth: { user: process.env.SMTP_USER, pass: smtpPassword() }, logger: false });
  const reports = [];
  await client.connect();
  try {
    const lock = await client.getMailboxLock('INBOX');
    try {
      // La recherche FROM du serveur ne trouve pas MAILER-DAEMON : on filtre sur l'enveloppe côté client.
      const candidates = await client.search({ unKeyword: KEYWORD }, { uid: true });
      const isDsn = (env) => /mailer-daemon|postmaster/i.test(env?.from?.[0]?.address || '') || /undelivered mail|delayed mail|delivery status|mail delivery/i.test(env?.subject || '');
      const uids = [];
      if (candidates.length) for await (const msg of client.fetch(candidates, { uid: true, envelope: true }, { uid: true })) if (isDsn(msg.envelope)) uids.push(msg.uid);
      if (uids.length) for await (const msg of client.fetch(uids, { uid: true, envelope: true, source: true }, { uid: true })) {
        reports.push({ uid: msg.uid, date: msg.envelope?.date?.toISOString() || null, subject: msg.envelope?.subject || '', ...parseBounce(msg.source) });
      }
    } finally { lock.release(); }
  } catch (e) {
    await client.logout().catch(() => {});
    return NextResponse.json({ error: `IMAP : ${e.message}` }, { status: 500 });
  }

  // Décision par adresse : un échec définitif suffit ; les simples retards ne font qu'incrémenter le compteur.
  const byEmail = {};
  for (const r of reports) {
    if (!r.rcpt) continue;
    const b = (byEmail[r.rcpt] ||= { failed: 0, delayed: 0, last: null, diag: null, subjects: [] });
    if (r.action === 'failed') b.failed++; else if (r.action === 'delayed') b.delayed++;
    if (!b.last || (r.date && r.date > b.last)) { b.last = r.date; b.diag = r.diag || b.diag; }
    if (r.origSubject && !b.subjects.includes(r.origSubject)) b.subjects.push(r.origSubject);
  }
  const plan = Object.entries(byEmail).map(([email, b]) => ({ email, suppress: b.failed > 0, ...b }));
  if (dry) return NextResponse.json({ dry: true, reports: reports.length, plan });

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  const users = [];
  if (plan.length) {
    for (let page = 1; page < 20; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 500 });
      if (error) { await client.logout().catch(() => {}); return NextResponse.json({ error: error.message }, { status: 500 }); }
      users.push(...data.users); if (data.users.length < 500) break;
    }
  }
  const byAddress = Object.fromEntries(users.filter((u) => u.email).map((u) => [u.email.toLowerCase(), u]));

  const updated = []; const inconnus = []; const erreurs = [];
  for (const p of plan) {
    const u = byAddress[p.email];
    if (!u) { inconnus.push(p.email); continue; }
    const prev = u.app_metadata?.mail || {};
    const mail = {
      ...prev,
      suppressed: Boolean(prev.suppressed || p.suppress),
      bounces: (prev.bounces || 0) + p.failed + p.delayed,
      failed: (prev.failed || 0) + p.failed,
      lastBounceAt: p.last || new Date().toISOString(),
      reason: p.diag || prev.reason || null,
      ...(p.suppress && !prev.suppressed ? { suppressedAt: new Date().toISOString() } : {}),
    };
    try {
      const { error } = await admin.auth.admin.updateUserById(u.id, { app_metadata: { ...u.app_metadata, mail } });
      if (error) throw error;
      updated.push({ email: p.email, suppressed: mail.suppressed, failed: p.failed, delayed: p.delayed });
    } catch (e) { erreurs.push(`${p.email}: ${e.message}`); }
  }

  // Marquer les rapports comme traités (y compris ceux d'adresses inconnues ou sans destinataire lisible)
  let flagged = 0;
  try {
    const lock = await client.getMailboxLock('INBOX');
    try {
      const uids = reports.map((r) => r.uid);
      if (uids.length) { await client.messageFlagsAdd(uids, [KEYWORD], { uid: true }); flagged = uids.length; }
    } finally { lock.release(); }
  } catch (e) { erreurs.push(`flag: ${e.message}`); }
  await client.logout().catch(() => {});

  return NextResponse.json({ dry: false, reports: reports.length, flagged, updated, inconnus, erreurs });
}
