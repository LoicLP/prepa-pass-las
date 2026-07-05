/* ============================================================
   GAMIFICATION — XP, grades, streak à jokers, défis du jour
   ------------------------------------------------------------
   Tout est DÉRIVÉ des sessions existantes (qcm_stats/examen_stats) :
   aucun stockage supplémentaire, cohérent entre appareils, et
   rétroactif pour les utilisateurs existants.

   Pondération pédagogique :
   - question consolidée (session « À consolider ») : 6 XP  (×3)
   - question en session éclair                     : 4 XP  (×2)
   - question normale                               : 2 XP
   - bonus de complétion : +10 XP par session
   - plafond quotidien : 200 XP de sessions (anti-grind)
   ============================================================ */

export const XP_DAILY_CAP = 200;

export const GRADES = [
  { id: 'bizuth',  name: 'Bizuth',            emoji: '🐣', min: 0 },
  { id: 'carabin', name: 'Carabin',           emoji: '🤓', min: 500 },
  { id: 'externe', name: 'Externe',           emoji: '🩺', min: 1500 },
  { id: 'interne', name: 'Interne',           emoji: '🥼', min: 3000 },
  { id: 'chef',    name: 'Chef de clinique',  emoji: '⚕️', min: 5000 },
  { id: 'major',   name: 'Major de promo',    emoji: '👑', min: 8000 },
];

const dayKeyOf = (iso) => (iso || '').split('T')[0];

export function xpForSession(s) {
  const correct = s.correct || 0;
  const perQuestion = s.subject === 'review' ? 6 : s.flash ? 4 : 2;
  return correct * perQuestion + 10;
}

/* ---------- Défis du jour ----------
   3 quêtes déterministes par jour (seed = date), complétion dérivée
   des sessions du jour. ctx = { weakId, weakName } (matière faible). */
export const QUEST_POOL = [
  { id: 'flash',      xp: 20, label: () => 'Termine 1 session éclair',
    test: (day) => day.some(s => s.flash) },
  { id: 'consolide5', xp: 30, label: () => 'Consolide 5 questions de ta pile',
    test: (day) => day.filter(s => s.subject === 'review').reduce((a, s) => a + (s.correct || 0), 0) >= 5 },
  { id: 'weak60',     xp: 40, label: (ctx) => `Fais 60 %+ sur un QCM de ${ctx?.weakName || 'ta matière faible'}`,
    test: (day, ctx) => !!ctx?.weakId && day.some(s => s.subject === ctx.weakId && (s.percentage || 0) >= 60) },
  { id: 'sessions2',  xp: 25, label: () => 'Termine 2 sessions',
    test: (day) => day.length >= 2 },
  { id: 'q20',        xp: 25, label: () => 'Réponds à 20 questions',
    test: (day) => day.reduce((a, s) => a + (s.total || 0), 0) >= 20 },
  { id: 'score80',    xp: 30, label: () => 'Termine une session à 80 %+',
    test: (day) => day.some(s => (s.percentage || 0) >= 80) },
];

function dayIndexOf(dateKey) {
  return Math.floor(new Date(`${dateKey}T00:00:00Z`).getTime() / 86400000);
}

// 3 défis du jour : un défi « outil » (éclair/consolidation), un défi
// « matière faible » un jour sur deux, complétés par les génériques.
export function dailyQuests(dateKey, ctx) {
  const idx = dayIndexOf(dateKey);
  const byId = Object.fromEntries(QUEST_POOL.map(q => [q.id, q]));
  const picks = [];
  picks.push(idx % 2 === 0 ? byId.flash : byId.consolide5);
  if (ctx?.weakId && idx % 2 === 0) picks.push(byId.weak60);
  const generics = [byId.sessions2, byId.q20, byId.score80];
  let g = idx % generics.length;
  while (picks.length < 3) {
    const cand = generics[g % generics.length];
    if (!picks.includes(cand)) picks.push(cand);
    g++;
  }
  return picks;
}

export function questStatus(sessions, dateKey, ctx) {
  const day = sessions.filter(s => dayKeyOf(s.date) === dateKey);
  return dailyQuests(dateKey, ctx).map(q => ({
    id: q.id,
    label: q.label(ctx),
    xp: q.xp,
    done: q.test(day, ctx),
  }));
}

/* ---------- XP total ---------- */
export function computeXP(sessions, ctx, todayKey) {
  const byDay = {};
  for (const s of sessions) {
    const k = dayKeyOf(s.date);
    if (!k) continue;
    (byDay[k] = byDay[k] || []).push(s);
  }
  let total = 0;
  let today = 0;
  for (const [k, day] of Object.entries(byDay)) {
    const sessionXP = Math.min(XP_DAILY_CAP, day.reduce((a, s) => a + xpForSession(s), 0));
    const questXP = dailyQuests(k, ctx).reduce((a, q) => a + (q.test(day, ctx) ? q.xp : 0), 0);
    const dayXP = sessionXP + questXP;
    total += dayXP;
    if (k === todayKey) today = dayXP;
  }
  return { total, today };
}

export function gradeForXP(xp) {
  let i = 0;
  while (i + 1 < GRADES.length && xp >= GRADES[i + 1].min) i++;
  const grade = GRADES[i];
  const next = GRADES[i + 1] || null;
  const span = next ? next.min - grade.min : 1;
  return {
    grade,
    gradeIndex: i,
    next,
    progress: next ? Math.min(1, (xp - grade.min) / span) : 1,
    xpToNext: next ? next.min - xp : 0,
  };
}

/* ---------- Streak avec jokers ----------
   2 jours « joker » par mois civil : un jour manqué ne casse pas la
   série tant qu'il reste des jokers pour le mois de ce jour. */
export function computeStreakWithJokers(sessions, todayKey, jokersPerMonth = 2) {
  const dateSet = new Set(sessions.map(s => dayKeyOf(s.date)).filter(Boolean));
  const used = {}; // 'YYYY-MM' -> jokers consommés
  const d = new Date(`${todayKey}T00:00:00Z`);
  let streak = 0;
  // Aujourd'hui non joué ne consomme pas de joker (la journée n'est pas finie)
  if (!dateSet.has(todayKey)) d.setUTCDate(d.getUTCDate() - 1);

  for (;;) {
    const key = d.toISOString().split('T')[0];
    if (dateSet.has(key)) {
      streak++;
    } else {
      const month = key.slice(0, 7);
      if ((used[month] || 0) < jokersPerMonth) used[month] = (used[month] || 0) + 1;
      else break;
    }
    d.setUTCDate(d.getUTCDate() - 1);
    if (streak > 3660) break; // garde-fou
  }

  const thisMonth = todayKey.slice(0, 7);
  return {
    streak,
    jokersLeft: Math.max(0, jokersPerMonth - (used[thisMonth] || 0)),
    jokersUsed: used,
  };
}

/* ---------- Garde-robe de Pico ----------
   unlock({ gradeIndex, streak, badges }) → bool */
export const PICO_OUTFITS = [
  { id: 'classic', name: 'Classique',     emoji: '🦉', desc: 'La tenue de toujours',   unlock: () => true },
  { id: 'glasses', name: 'Studieux',      emoji: '🤓', desc: 'Grade Carabin',          unlock: (c) => c.gradeIndex >= 1 },
  { id: 'blouse',  name: 'Blouse blanche', emoji: '🥼', desc: 'Grade Externe',          unlock: (c) => c.gradeIndex >= 2 },
  { id: 'gold',    name: 'Stétho doré',   emoji: '⚕️', desc: 'Grade Interne',          unlock: (c) => c.gradeIndex >= 3 },
  { id: 'toque',   name: 'Toque de major', emoji: '🎓', desc: 'Grade Major de promo',   unlock: (c) => c.gradeIndex >= 5 },
  { id: 'crown',   name: 'Couronne',      emoji: '👑', desc: '30 jours de streak',     unlock: (c) => c.streak >= 30 },
];
