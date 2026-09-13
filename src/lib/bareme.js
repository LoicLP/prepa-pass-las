/* Notation d'une question selon le barème choisi par l'étudiant. Résultat dans [0, 1].
   - partiel      : chaque proposition bien jugée rapporte 1/n
   - negatif      : (justes − fausses)/n, plancher zéro
   - tout_ou_rien : 1 si tout est juste, sinon 0
   - differences  : selon le nombre de propositions mal jugées (0 → 1, 1 → 0,7, 2 → 0,1, ≥ 3 → 0),
                    grille des MCC PASS d'Université Paris Cité
   - degressif    : même principe, grille 1 / 0,5 / 0,2 / 0 (Lyon, Marseille… d'après les tutorats)
   - degressif75  : grille 1 / 0,75 / 0,5 / 0 (Montpellier, d'après les prépas)
   - item_02_01   : +0,2 par item juste, −0,1 par item faux, plancher zéro (Toulouse, d'après les prépas) */
export const SCALES = { differences: [1, 0.7, 0.1], degressif: [1, 0.5, 0.2], degressif75: [1, 0.75, 0.5] };

export function scoreAnswer(q, a, bareme = 'partiel') {
  const opts = q?.options || []; const n = opts.length || 1;
  const correctIdx = opts.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0);
  const answered = Array.isArray(a) ? a.length > 0 : a != null;
  if (!answered) return 0;
  if (!q.multi) {
    return a === correctIdx[0] ? 1 : 0; // une seule réponse : plancher zéro quel que soit le barème
  }
  const sel = new Set(a);
  let right = 0;
  opts.forEach((o, i) => { if (sel.has(i) === !!o.correct) right += 1; });
  const wrong = n - right;
  if (bareme === 'tout_ou_rien') return right === n ? 1 : 0;
  if (bareme === 'negatif') return Math.max(0, (right - wrong) / n);
  if (bareme === 'item_02_01') return Math.max(0, (2 * right - wrong) / (2 * n));
  if (SCALES[bareme]) return SCALES[bareme][wrong] ?? 0;
  return right / n;
}
export function noteSur20(questions, answers, bareme) {
  if (!questions?.length) return 0;
  const pts = questions.reduce((acc, q, i) => acc + scoreAnswer(q, answers[i], bareme), 0);
  return Math.round((pts / questions.length) * 200) / 10;
}
