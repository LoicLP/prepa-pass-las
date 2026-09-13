/* Carte de maîtrise : un score 0-100 par matière et par chapitre (fiche),
   pondéré vers les sessions récentes, amorcé par le positionnement s'il existe. */

export const LEVELS = [
  { id: 'decouverte', label: 'Découverte', max: 40, tone: 'rose' },
  { id: 'en_route', label: 'En route', max: 70, tone: 'amber' },
  { id: 'solide', label: 'Solide', max: 101, tone: 'emerald' },
];
export const levelOf = (score) => (score == null ? LEVELS[0] : LEVELS.find((l) => score < l.max) || LEVELS[2]);

const pctOf = (s) => (Number.isFinite(s.percentage) ? s.percentage : s.total > 0 ? Math.round((s.correct / s.total) * 100) : null);

export function computeMastery(sessions = [], placement = null, now = Date.now()) {
  const bySubject = {}; const byTopic = {};
  const add = (bucket, key, pct, weight, name) => {
    if (pct == null || !key) return;
    const b = (bucket[key] ||= { sum: 0, w: 0, n: 0, name });
    b.sum += pct * weight; b.w += weight; b.n += 1;
  };
  for (const s of sessions) {
    if (!s?.date) continue;
    const pct = pctOf(s); if (pct == null) continue;
    const ageDays = (now - new Date(s.date).getTime()) / 86400000;
    const weight = Math.exp(-ageDays / 21); // demi-vie ≈ 3 semaines
    if (s.subject && !['review', 'custom', 'mixed'].includes(s.subject)) {
      add(bySubject, s.subject, pct, weight, s.subjectName);
      if (s.topic && s.topic !== s.subjectName) add(byTopic, s.topic, pct, weight, s.topic);
    }
  }
  // Positionnement : une session synthétique de poids modéré par matière
  if (placement) for (const [sub, pct] of Object.entries(placement)) add(bySubject, sub, pct, 0.6, sub);
  const finish = (bucket) => Object.fromEntries(Object.entries(bucket).map(([k, b]) => {
    const score = Math.round(b.sum / b.w); return [k, { score, level: levelOf(score), n: b.n, name: b.name }];
  }));
  const subjects = finish(bySubject); const topics = finish(byTopic);
  const ranked = Object.entries(subjects).sort((a, b) => a[1].score - b[1].score);
  return { subjects, topics, weakest: ranked[0]?.[0] || null, strongest: ranked[ranked.length - 1]?.[0] || null, known: ranked.length };
}
