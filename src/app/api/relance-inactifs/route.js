import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Relance J+1 : email aux inscrits de 20 h à 72 h qui n'ont fait aucune session.
// Appelée chaque jour par le cron Vercel (vercel.json). `?dry=1` liste sans envoyer.

const INTERNES = new Set(['test.local@prepa-pass-las.fr', 'loic.gautier11@outlook.fr', 'admin.lplabs@gmail.com']);

function emailHtml(firstName, trialLeftHours) {
  const trialLine = trialLeftHours > 0
    ? `Bonus : il te reste <strong style="color:#7c3aed;">${trialLeftHours} h de Premium offert</strong> — QCM illimités, examens blancs, tout est encore débloqué.`
    : `Ton dashboard est prêt : QCM corrigés, fiches par matière, et Pico pour te guider.`;
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;padding:40px 16px;"><tr><td align="center">
    <table width="100%" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(79,70,229,0.08);">
      <tr><td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4f46e5 100%);padding:36px 32px;text-align:center;">
        <div style="font-size:44px;margin-bottom:10px;">🦉</div>
        <h1 style="margin:0;font-size:24px;font-weight:900;color:#ffffff;">Pico t'attend toujours…</h1>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="margin:0 0 14px;font-size:15px;color:#374151;line-height:1.6;">Salut ${firstName} 👋</p>
        <p style="margin:0 0 14px;font-size:15px;color:#374151;line-height:1.6;">
          Tu as créé ton compte sur Prépa PASS/LAS… mais ta <strong>série de révisions 🔥 n'a pas encore commencé</strong>.
        </p>
        <p style="margin:0 0 14px;font-size:15px;color:#374151;line-height:1.6;">
          Bonne nouvelle : <strong>5 minutes suffisent</strong>. Cinq questions, ta série démarre, tes premiers XP tombent — et Pico calibre tes recommandations.
        </p>
        <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">${trialLine}</p>
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
          <a href="https://www.prepa-pass-las.fr/dashboard" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;font-size:16px;font-weight:700;padding:14px 32px;border-radius:14px;text-decoration:none;">
            Faire mes 5 premières questions →
          </a>
        </td></tr></table>
        <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;text-align:center;">
          La PASS se gagne 5 minutes à la fois. On est avec toi 💪
        </p>
      </td></tr>
      <tr><td style="background:#f8fafc;padding:18px 32px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#9ca3af;">Tu reçois cet email car tu as créé un compte sur prepa-pass-las.fr</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

export async function GET(request) {
  // Auth cron : Vercel envoie `Authorization: Bearer ${CRON_SECRET}`
  const auth = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const dry = new URL(request.url).searchParams.get('dry') === '1';

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const now = Date.now();
  const H = 3600 * 1000;

  // 1) Inscrits dans la fenêtre 20 h → 72 h, jamais relancés
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 500 });
  if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 });

  const candidats = list.users.filter(u => {
    if (!u.email || INTERNES.has(u.email)) return false;
    if (u.app_metadata?.relance_j1) return false;
    const age = now - new Date(u.created_at).getTime();
    return age >= 20 * H && age <= 72 * H;
  });

  if (candidats.length === 0) return NextResponse.json({ eligible: 0, sent: 0, dry });

  // 2) Garder ceux qui n'ont fait AUCUNE session
  const ids = candidats.map(u => u.id);
  const { data: profils } = await admin
    .from('user_profiles')
    .select('id, session_count, qcm_stats')
    .in('id', ids);
  const parId = Object.fromEntries((profils || []).map(p => [p.id, p]));
  const sansSession = candidats.filter(u => {
    const p = parId[u.id];
    if (!p) return true; // pas de profil → jamais rien fait
    const sessions = p.qcm_stats?.sessions?.length || 0;
    return (p.session_count || 0) === 0 && sessions === 0;
  });

  if (dry) {
    return NextResponse.json({
      eligible: sansSession.length,
      emails: sansSession.map(u => u.email),
      dry: true,
    });
  }

  // 3) Envoi
  const smtpPassword = process.env.SMTP_PASSWORD_B64
    ? Buffer.from(process.env.SMTP_PASSWORD_B64, 'base64').toString('utf-8')
    : process.env.SMTP_PASSWORD;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: smtpPassword },
  });

  let sent = 0;
  const erreurs = [];
  for (const u of sansSession) {
    const firstName = (u.user_metadata?.full_name || u.email).split(/[ @]/)[0];
    const trialLeftHours = Math.max(0, Math.round((new Date(u.created_at).getTime() + 48 * H - now) / H));
    try {
      await transporter.sendMail({
        from: `"Pico · Prépa PASS/LAS" <${process.env.SMTP_USER}>`,
        to: u.email,
        subject: `${firstName}, ta série n'a pas encore commencé 🔥`,
        html: emailHtml(firstName, trialLeftHours),
      });
      await admin.auth.admin.updateUserById(u.id, {
        app_metadata: { ...u.app_metadata, relance_j1: new Date().toISOString() },
      });
      sent++;
    } catch (e) {
      erreurs.push(`${u.email}: ${e.message}`);
    }
  }

  return NextResponse.json({ eligible: sansSession.length, sent, erreurs, dry: false });
}
