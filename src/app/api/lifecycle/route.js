import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendMail, layout, summarize, canEmail, SITE, esc } from '@/lib/mailer';
import { isPromoActive, HEADLINE } from '@/lib/promo';
import { facById } from '@/data/facs';
import { facExams, fmtMinutes } from '@/data/facExams';

/* Cron quotidien (vercel.json, 17 h UTC). Une séquence d'e-mails alignée sur
   l'essai de 7 jours, plus deux rappels indépendants de l'âge du compte.
   Chaque envoi est marqué dans app_metadata.lifecycle pour ne jamais être
   renvoyé. `?dry=1` liste sans envoyer. */

const TRIAL_DAYS = 7;
const PROMO_REMINDERS = ['2026-10-24', '2026-10-30'];
const DAY = 86400000;
const parisToday = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });

const offerLine = () => (isPromoActive()
  ? `L'offre de rentrée court toujours : <strong>Premium à ${HEADLINE.monthlyPromo} €/mois</strong> au lieu de ${HEADLINE.monthlyFull} €, à vie tant que tu restes abonné — jusqu'au 31 octobre.`
  : `Le Premium est à <strong>${HEADLINE.monthlyFull} €/mois</strong>, ou ${HEADLINE.yearTotal} € l'année, sans engagement, résiliable en un clic.`);

function build(stage, firstName, st) {
  const n = firstName;
  const dash = { href: `${SITE}/dashboard`, label: 'Ouvrir mon tableau de bord' };
  const tarifs = { href: `${SITE}/tarifs`, label: 'Voir les offres' };
  switch (stage) {
    case 'j1': return { subject: `${n}, ta série n'a pas encore commencé 🔥`, html: layout({ title: 'Pico t’attend toujours…', paragraphs: [
      `Salut ${esc(n)} 👋`,
      `Tu as créé ton compte sur Prépa PASS/LAS… mais ta <strong>série de révisions 🔥 n'a pas encore commencé</strong>.`,
      `Bonne nouvelle : <strong>5 minutes suffisent</strong>. Cinq questions, ta série démarre, tes premiers XP tombent — et Pico calibre tes recommandations.`,
      `Tu as encore <strong style="color:#7c3aed;">${TRIAL_DAYS - 1} jours de Premium offerts</strong> : QCM illimités, examens blancs, tout est débloqué.`,
    ], cta: { href: `${SITE}/dashboard`, label: 'Faire mes 5 premières questions →' }, footnote: 'La PASS se gagne 5 minutes à la fois. On est avec toi 💪' }) };
    case 'j3': return { subject: `${n}, ton bilan de 3 jours 📈`, html: layout({ title: 'Trois jours, un premier bilan', emoji: '📈', paragraphs: [
      `Salut ${esc(n)} 👋`,
      `Depuis ton arrivée : <strong>${st.total} session${st.total > 1 ? 's' : ''}</strong>${st.avg != null ? `, <strong>${st.avg} %</strong> de moyenne` : ''}${st.best ? `, et ton point fort c'est <strong>${esc(st.best[0])}</strong> (${st.best[1]} %)` : ''}.`,
      st.worst ? `<strong>${esc(st.worst[0])}</strong> te freine (${st.worst[1]} %) : trois QCM ciblés cette semaine et tu passes la barre.` : `Ajoute une deuxième matière à ton entraînement : Pico y trouvera tes vrais points faibles.`,
      st.pile > 0 ? `Ta pile « À consolider » contient <strong>${st.pile} question${st.pile > 1 ? 's' : ''}</strong> — c'est là que les points se gagnent.` : `Il te reste ${TRIAL_DAYS - 3} jours de Premium offert pour tester les examens blancs.`,
    ], cta: dash }) };
    case 'j6': return { subject: `Demain, ton Premium offert se termine`, html: layout({ title: 'Plus qu’un jour de Premium', emoji: '⏳', paragraphs: [
      `Salut ${esc(n)} 👋`,
      `Ton essai Premium se termine <strong>demain</strong>. Après, ton compte repasse en plan Découverte : un QCM par jour, toutes les fiches — mais plus d'examens blancs, de QCM illimités ni de progression détaillée.`,
      st.recent > 0 ? `En ${st.daysActive} jour${st.daysActive > 1 ? 's' : ''} d'entraînement tu as fait ${st.recent} session${st.recent > 1 ? 's' : ''}${st.avg != null ? ` à ${st.avg} % de moyenne` : ''}. Ce rythme, c'est exactement ce que le Premium sert à tenir.` : `Tu n'as pas encore lancé de session : profite de cette dernière journée pour tester un examen blanc, c'est le meilleur aperçu du jour J.`,
      offerLine(),
    ], cta: tarifs }) };
    case 'end': return { subject: `${n}, ton essai est terminé — et maintenant ?`, html: layout({ title: 'Ton essai Premium est terminé', emoji: '🎓', paragraphs: [
      `Salut ${esc(n)} 👋`,
      `Ton compte est repassé en plan Découverte : un QCM par jour, toutes les fiches, ton historique et ta série sont conservés.`,
      st.pile > 0 ? `Ta pile « À consolider » t'attend avec <strong>${st.pile} question${st.pile > 1 ? 's' : ''}</strong>. Elle reste accessible.` : `Rien n'est perdu : tes XP, ta série et tes statistiques sont là.`,
      `Pour continuer à ton rythme : ${offerLine()}`,
    ], cta: { href: `${SITE}/tarifs`, label: 'Continuer en Premium' } }) };
    case 'post3': return { subject: `Trois jours sans Premium : ça change quoi ?`, html: layout({ title: 'Ce qui te manque depuis trois jours', emoji: '🦉', paragraphs: [
      `Salut ${esc(n)} 👋`,
      `Un QCM par jour, c'est un entretien. Pour progresser, il faut le volume : les QCM illimités, les examens blancs chronométrés et la courbe par matière.`,
      st.worst ? `Ton point faible reste <strong>${esc(st.worst[0])}</strong> (${st.worst[1]} %). C'est précisément ce que le coach de progression travaille avec toi.` : `Pico a besoin de sessions pour te dire quoi travailler — c'est le cœur du Premium.`,
      offerLine(),
    ], cta: { href: `${SITE}/tarifs`, label: 'Reprendre en Premium' } }) };
    case 'pile': return { subject: `${st.pile} questions t'attendent dans ta pile 🔁`, html: layout({ title: 'Ta pile « À consolider » déborde', emoji: '🔁', paragraphs: [
      `Salut ${esc(n)} 👋`,
      `<strong>${st.pile} questions</strong> que tu as ratées attendent d'être rejouées. C'est la répétition espacée : chaque question réussie deux fois sort de la pile pour de bon.`,
      `Cinq minutes suffisent pour en faire une dizaine.`,
    ], cta: { href: `${SITE}/dashboard`, label: 'Rejouer ma pile' } }) };
    case 'promo': return { subject: `Dernière ligne droite pour le Premium à −50 % à vie`, html: layout({ title: 'L’offre de rentrée se termine le 31 octobre', emoji: '🎓', paragraphs: [
      `Salut ${esc(n)} 👋`,
      `Jusqu'au 31 octobre, le Premium est à <strong>${HEADLINE.monthlyPromo} €/mois</strong> au lieu de ${HEADLINE.monthlyFull} € — et ce prix reste le tien tant que tu restes abonné. Après, il repasse au tarif plein.`,
      `Sans engagement, résiliable en un clic. Tes XP, ta série et ton historique restent tels quels.`,
    ], cta: { href: `${SITE}/tarifs`, label: 'Profiter de l’offre' } }) };
    case 'j30': {
      const fac = facById(st.facId); const ex = facExams(st.facId)?.exams?.filter((e) => e.minutes) || [];
      const fmt = fac && ex.length ? ` À ${fac.name}, ${ex.slice(0, 3).map((e) => `${e.label.toLowerCase()} en ${fmtMinutes(e.minutes)}`).join(', ')}… : entraîne-toi dans ce format avec les épreuves par UE.` : '';
      return { subject: `J-30 avant tes partiels${fac?.city ? ` à ${fac.city}` : ''} ⏳`, html: layout({ title: 'Un mois avant tes partiels', emoji: '⏳', paragraphs: [
        `Salut ${esc(n)} 👋`,
        `Tes partiels sont dans <strong>30 jours</strong> (${esc(st.examLabel)}).${esc(fmt)}`,
        `Le bon rythme pour le dernier mois : une épreuve par UE par semaine au barème de ta fac, et ta pile « À consolider » vidée chaque soir. Les points clés, pas les détails.`,
      ], cta: { href: `${SITE}/examen`, label: 'Lancer une épreuve par UE' } }) };
    }
    case 'fac': return { subject: `${n}, dans quelle fac prépares-tu le concours ?`, html: layout({ title: 'Une info pour noter tes examens blancs comme ta fac', emoji: '🎓', paragraphs: [
      `Salut ${esc(n)} 👋`,
      `Nouveau sur Prépa PASS/LAS : les <strong>examens blancs par UE</strong> sont notés sur 20 <strong>au barème de ta faculté</strong> (points négatifs, différences, tout ou rien…), et les questions s'adaptent au style de ses annales.`,
      `Il nous manque une seule chose pour l'activer : ta faculté. Ça prend 30 secondes dans « Mon compte », et tu pourras corriger le barème si tes MCC ont changé.`,
    ], cta: { href: `${SITE}/dashboard?section=account`, label: 'Renseigner ma faculté' } }) };
    default: return null;
  }
}

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
  const ids = users.map((u) => u.id);
  const { data: profils } = await admin.from('user_profiles').select('id, tier, session_count, qcm_stats').in('id', ids);
  const P = Object.fromEntries((profils || []).map((p) => [p.id, p]));
  const now = Date.now(); const today = parisToday();

  const plan = [];
  for (const u of users) {
    if (!canEmail(u)) continue;
    const p = P[u.id] || {}; const lc = u.app_metadata?.lifecycle || {};
    const age = (now - new Date(u.created_at).getTime()) / DAY;
    const paid = p.tier === 'premium+' || p.tier === 'essentiel';
    const st = summarize(p, 14);
    const firstName = (u.user_metadata?.full_name || u.email).split(/[ @]/)[0];
    let stage = null;
    if (!paid) {
      if (!lc.j1 && !u.app_metadata?.relance_j1 && age >= 0.8 && age < 3 && st.total === 0) stage = 'j1';
      else if (!lc.j3 && age >= 3 && age < 5 && st.total > 0) stage = 'j3';
      else if (!lc.j6 && age >= TRIAL_DAYS - 1 && age < TRIAL_DAYS) stage = 'j6';
      else if (!lc.end && age >= TRIAL_DAYS && age < TRIAL_DAYS + 2) stage = 'end';
      else if (!lc.post3 && age >= TRIAL_DAYS + 3 && age < TRIAL_DAYS + 5 && st.total > 0) stage = 'post3';
      else if (isPromoActive() && PROMO_REMINDERS.includes(today) && !lc[`promo_${today}`] && age >= TRIAL_DAYS) stage = 'promo';
    }
    // J-30 avant la date de concours renseignée (tous les comptes, une fois par date)
    const exam = u.user_metadata?.exam_date;
    if (!stage && exam) {
      const dTo = Math.round((new Date(exam).getTime() - now) / DAY);
      if (dTo >= 29 && dTo <= 31 && !lc[`j30_${exam}`]) { stage = 'j30'; st.facId = u.user_metadata?.profile?.fac || null; st.examLabel = new Date(exam).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }); }
    }
    if (!stage && st.pile >= 10 && (!lc.pile || now - new Date(lc.pile).getTime() > 7 * DAY) && age >= 2) stage = 'pile';
    // Comptes sans faculté renseignée (créés avant le profil de révision) : une seule fois, aux comptes qui ont déjà révisé ou récents.
    if (!stage && !lc.fac && !u.user_metadata?.profile?.fac && age >= 1 && ((p.session_count || 0) > 0 || age < 30)) stage = 'fac';
    if (stage) plan.push({ u, stage, firstName, st });
  }

  if (dry) return NextResponse.json({ dry: true, count: plan.length, plan: plan.map((x) => ({ email: x.u.email, stage: x.stage })) });

  let sent = 0; const erreurs = [];
  for (const { u, stage, firstName, st } of plan) {
    const mail = build(stage, firstName, st); if (!mail) continue;
    try {
      await sendMail({ to: u.email, ...mail });
      const key = stage === 'promo' ? `promo_${today}` : stage === 'j30' ? `j30_${u.user_metadata?.exam_date}` : stage;
      await admin.auth.admin.updateUserById(u.id, { app_metadata: { ...u.app_metadata, lifecycle: { ...(u.app_metadata?.lifecycle || {}), [key]: new Date().toISOString() } } });
      sent++;
    } catch (e) { erreurs.push(`${u.email} (${stage}): ${e.message}`); }
  }
  return NextResponse.json({ count: plan.length, sent, erreurs, dry: false });
}
