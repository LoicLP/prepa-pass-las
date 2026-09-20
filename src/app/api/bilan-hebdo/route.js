import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendMail, layout, summarize, canEmail, SITE, esc } from '@/lib/mailer';

/* Cron du dimanche (vercel.json). Bilan de la semaine aux comptes actifs
   dans les 14 derniers jours : sessions, moyenne, point fort, pile à rejouer. */

export async function GET(request) {
  const auth = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const dry = new URL(request.url).searchParams.get('dry') === '1';
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  const users = [];
  for (let page = 1; page < 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 500 });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    users.push(...data.users); if (data.users.length < 500) break;
  }
  const { data: profils } = await admin.from('user_profiles').select('id, tier, qcm_stats').in('id', users.map((u) => u.id));
  const P = Object.fromEntries((profils || []).map((p) => [p.id, p]));
  const plan = [];
  for (const u of users) {
    if (!canEmail(u)) continue;
    const p = P[u.id]; if (!p) continue;
    const week = summarize(p, 7); const fortnight = summarize(p, 14);
    if (fortnight.recent === 0) continue;
    plan.push({ u, week, firstName: (u.user_metadata?.full_name || u.email).split(/[ @]/)[0] });
  }
  if (dry) return NextResponse.json({ dry: true, count: plan.length, emails: plan.map((x) => x.u.email) });
  let sent = 0; const erreurs = [];
  for (const { u, week, firstName } of plan) {
    const paragraphs = [`Salut ${esc(firstName)} 👋`];
    if (week.recent > 0) {
      paragraphs.push(`Cette semaine : <strong>${week.recent} session${week.recent > 1 ? 's' : ''}</strong> sur ${week.daysActive} jour${week.daysActive > 1 ? 's' : ''}${week.avg != null ? `, <strong>${week.avg} %</strong> de moyenne` : ''}.`);
      if (week.best) paragraphs.push(`Point fort : <strong>${esc(week.best[0])}</strong> (${week.best[1]} %)${week.worst ? ` · à travailler : <strong>${esc(week.worst[0])}</strong> (${week.worst[1]} %)` : ''}.`);
    } else {
      paragraphs.push(`Aucune session cette semaine — ta série est en pause, pas perdue. Une session de cinq minutes la relance.`);
    }
    if (week.pile > 0) paragraphs.push(`<strong>${week.pile} question${week.pile > 1 ? 's' : ''}</strong> t'attendent dans « À consolider ».`);
    try {
      await sendMail({ to: u.email, subject: week.recent > 0 ? `Ta semaine : ${week.recent} session${week.recent > 1 ? 's' : ''}${week.avg != null ? `, ${week.avg} %` : ''} 📊` : `Ta série est en pause — cinq minutes pour la relancer`, html: layout({ title: 'Ton bilan de la semaine', emoji: '📊', paragraphs, cta: { href: `${SITE}/dashboard`, label: 'Voir mon tableau de bord' } }) });
      sent++;
    } catch (e) { erreurs.push(`${u.email}: ${e.message}`); }
  }
  return NextResponse.json({ count: plan.length, sent, erreurs, dry: false });
}
