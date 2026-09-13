import { effectiveHours } from '@/lib/profile';

/* Plan de la semaine, déterministe pour une semaine donnée : dérivé des heures
   disponibles, de la maîtrise par matière, des coefficients et du moment. */

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
export const weekKey = (d = new Date()) => { const x = new Date(d); const day = (x.getDay() + 6) % 7; x.setDate(x.getDate() - day); return x.toISOString().slice(0, 10); };
const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };

export function buildWeeklyPlan({ profile, mastery, subjects, coeffs = {}, pile = 0, moment = null, week = weekKey() }) {
  const hours = effectiveHours(profile);
  const sessionMin = 20;
  const total = Math.max(2, Math.round((hours * 60) / sessionMin));
  const seed = hash(week + (profile?.fac || ''));
  const items = [];

  // Poids par matière : coefficient × (1 − maîtrise), les inconnues comptent comme 50
  const weights = subjects.map((s) => {
    const m = mastery?.subjects?.[s.id]?.score; const gap = m == null ? 0.5 : (100 - m) / 100;
    return { s, w: (coeffs[s.id] || 3) * (0.35 + gap) };
  });
  const sumW = weights.reduce((a, x) => a + x.w, 0);

  let slots = total;
  if (pile >= 5) { items.push({ kind: 'pile', label: 'Rejouer ta pile « À consolider »', minutes: 10, count: Math.min(pile, 12) }); slots -= 1; }
  if (moment?.id === 'veille') {
    // Veille : on consolide ce qu'on sait et on rejoue la pile, pas de nouveauté
    const strong = [...weights].sort((a, b) => (mastery?.subjects?.[b.s.id]?.score || 0) - (mastery?.subjects?.[a.s.id]?.score || 0)).slice(0, 3);
    strong.forEach((x, i) => items.push({ kind: 'qcm', subject: x.s.id, subjectName: x.s.name, label: `Points clés · ${x.s.name}`, minutes: 15, count: 8, day: DAYS[(seed + i) % 7] }));
    return { week, hours, mode: 'veille', items, focus: items[1] || items[0] || null };
  }
  const order = weights.map((x) => ({ ...x, n: Math.max(x.w / sumW * slots, 0) }));
  // Répartition entière (plus grands restes)
  let assigned = order.map((x) => ({ ...x, k: Math.floor(x.n) }));
  let rest = slots - assigned.reduce((a, x) => a + x.k, 0);
  assigned.sort((a, b) => (b.n - Math.floor(b.n)) - (a.n - Math.floor(a.n)));
  for (let i = 0; i < assigned.length && rest > 0; i++, rest--) assigned[i].k += 1;
  if (moment?.id === 'rebond') assigned = assigned.map((x) => ({ ...x, k: Math.max(0, Math.round(x.k * 0.7)) })); // reprise en douceur
  let dayIdx = seed % 7;
  for (const x of assigned.sort((a, b) => b.k - a.k)) {
    for (let i = 0; i < x.k; i++) {
      const topic = Object.entries(mastery?.topics || {}).filter(([, t]) => true).sort((a, b) => a[1].score - b[1].score).find(([name]) => name && (mastery?.topics?.[name]))?.[0];
      items.push({ kind: 'qcm', subject: x.s.id, subjectName: x.s.name, label: `QCM · ${x.s.name}`, minutes: sessionMin, count: 10, day: DAYS[dayIdx % 7] });
      dayIdx += Math.max(1, Math.floor(7 / Math.max(1, slots)));
    }
  }
  if (hours >= 4 && subjects.length && mastery?.weakest) {
    const s = subjects.find((z) => z.id === mastery.weakest);
    if (s) items.push({ kind: 'examen', subject: s.id, subjectName: s.name, label: `Examen blanc · ${s.name}`, minutes: 45, day: 'Dim' });
  }
  const focus = items.find((i) => i.kind === 'qcm') || items[0] || null;
  return { week, hours, mode: moment?.id || 'normal', items, focus };
}

/** Sessions de la semaine courante déjà faites, par matière. */
export function doneThisWeek(sessions = [], week = weekKey()) {
  const start = new Date(week).getTime(); const done = {};
  for (const s of sessions) { if (!s?.date) continue; if (new Date(s.date).getTime() >= start) done[s.subject] = (done[s.subject] || 0) + 1; }
  return done;
}
