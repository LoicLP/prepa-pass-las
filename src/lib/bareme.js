/* Notation d'une question selon le barème choisi par l'étudiant. Résultat dans [0, 1]. */
export function scoreAnswer(q, a, bareme = 'partiel') {
  const opts = q?.options || []; const n = opts.length || 1;
  const correctIdx = opts.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0);
  const answered = Array.isArray(a) ? a.length > 0 : a != null;
  if (!answered) return 0;
  if (!q.multi) {
    const ok = a === correctIdx[0];
    if (bareme === 'negatif') return ok ? 1 : 0; // une seule réponse : plancher zéro
    return ok ? 1 : 0;
  }
  const sel = new Set(a);
  let right = 0;
  opts.forEach((o, i) => { if (sel.has(i) === !!o.correct) right += 1; });
  const wrong = n - right;
  if (bareme === 'tout_ou_rien') return right === n ? 1 : 0;
  if (bareme === 'negatif') return Math.max(0, (right - wrong) / n);
  return right / n;
}
export function noteSur20(questions, answers, bareme) {
  if (!questions?.length) return 0;
  const pts = questions.reduce((acc, q, i) => acc + scoreAnswer(q, answers[i], bareme), 0);
  return Math.round((pts / questions.length) * 200) / 10;
}
