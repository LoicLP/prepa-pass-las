/* Notation d'une question selon le barème choisi par l'étudiant. Résultat dans [0, 1].
   - partiel      : chaque proposition bien jugée rapporte 1/n
   - negatif      : (justes − fausses)/n, plancher zéro
   - tout_ou_rien : 1 si tout est juste, sinon 0
   - differences  : selon le nombre de propositions mal jugées (0 → 1, 1 → 0,7, 2 → 0,1, ≥ 3 → 0),
                    grille des MCC PASS d'Université Paris Cité
   - degressif    : même principe, grille 1 / 0,5 / 0,2 / 0 (Lyon, Marseille… d'après les tutorats)
   - degressif75  : grille 1 / 0,75 / 0,5 / 0 (Montpellier, d'après les prépas)
   - degressif50  : grille 1 / 0,5 / 0 (Nice, MCC officielles)
   - degressif80  : grille 1 / 0,8 / 0,25 / 0 (Tours, d'après le tutorat)
   - item_02_01   : +0,2 par item juste, −0,1 par item faux, plancher zéro (Toulouse, d'après les prépas) */
export const SCALES = { differences: [1, 0.7, 0.1], degressif: [1, 0.5, 0.2], degressif75: [1, 0.75, 0.5], degressif50: [1, 0.5], degressif80: [1, 0.8, 0.25] };

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

/* Conseils de stratégie selon le barème : le comportement optimal change du tout au tout. */
export const STRATEGY = {
  partiel: { title: 'Points partiels : coche ce que tu penses vrai', tips: ['Chaque proposition bien jugée rapporte, même si la question n’est pas parfaite : ne laisse jamais une question vide.', 'Traite chaque proposition indépendamment, comme un vrai/faux.', 'Une hésitation coûte au pire une fraction de point : tranche.'] },
  negatif: { title: 'Points négatifs : ne coche que ce dont tu es sûr', tips: ['Une case fausse annule une case juste : sur une proposition incertaine, mieux vaut ne rien cocher.', 'Le plancher est à zéro par question : ne t’acharne pas sur une question ratée, passe à la suivante.', 'Relis les négations et les unités : c’est là que les points partent.'] },
  item_02_01: { title: '+0,2 / −0,1 : coche dès que tu es à plus de 1 chance sur 3', tips: ['Une proposition rapporte 0,2 si elle est juste et coûte 0,1 si elle est fausse : dès que tu la penses plus probablement juste que fausse, coche.', 'La question ne descend pas sous zéro : une erreur sur une question déjà mauvaise ne coûte rien de plus.', 'Ne laisse pas de question vide.'] },
  differences: { title: 'Par différences : vise le zéro faute, tolère une erreur', tips: ['0,7 point avec une seule différence, mais 0,1 avec deux : la deuxième erreur coûte presque tout.', 'Sur une proposition très incertaine, demande-toi si tu as déjà une erreur probable dans la question.', 'Aucun point négatif : une question sans réponse vaut 0, tente toujours.'] },
  degressif: { title: 'Dégressif 1 · 0,5 · 0,2 · 0 : sécurise les certitudes', tips: ['La première erreur divise le point par deux : le zéro discordance rapporte gros.', 'Aucun point négatif : réponds à tout, même de façon incomplète.', 'Sur une proposition incertaine, coche-la seulement si tu n’as pas déjà de doute ailleurs dans la question.'] },
  degressif75: { title: 'Dégressif 1 · 0,75 · 0,5 · 0 : les petites erreurs coûtent peu', tips: ['Une erreur ne coûte que 0,25 point : coche ce que tu penses vrai sans trop te censurer.', 'Au-delà de deux erreurs la question vaut 0 : ne coche pas au hasard.', 'Si un item F « toutes les propositions sont fausses » existe, il annule tout autre choix : ne le coche qu’en étant sûr.'] },
  degressif50: { title: 'Dégressif 1 · 0,5 · 0 : une erreur maximum', tips: ['Deux discordances et la question vaut 0 : chaque case cochée en trop est aussi grave qu’un oubli.', 'En cas de doute sur deux propositions, ne tranche que l’une des deux.', 'Aucun point négatif : réponds à toutes les questions.'] },
  degressif80: { title: 'Dégressif 1 · 0,8 · 0,25 · 0 : une erreur pardonne, pas deux', tips: ['0,8 avec une erreur, 0,25 avec deux : la deuxième erreur coûte presque tout.', 'Les QCS (une seule réponse) sont notés 1 ou 0 : prends le temps d’éliminer.', 'Aucun point négatif : réponds à tout.'] },
  tout_ou_rien: { title: 'Tout ou rien : la précision avant tout', tips: ['Une seule case fausse ou manquante et la question vaut 0 : relis chaque proposition avant de valider.', 'Sur une question où tu doutes d’une proposition, la probabilité d’avoir le point est faible : ne passe pas trop de temps dessus.', 'Aucun point négatif : réponds quand même, ça ne coûte rien.'] },
};
export const strategyFor = (bareme) => STRATEGY[bareme] || STRATEGY.partiel;

/* Ce que coûtent les cases cochées en trop et les oublis, au barème choisi.
   `answers[i]` : index (question simple) ou tableau d'index (question multiple). */
export function analyzeAnswers(questions, answers, bareme = 'partiel') {
  let over = 0, missed = 0, lostToOver = 0, lostToMissed = 0, multi = 0, perfect = 0;
  questions.forEach((q, i) => {
    if (!q?.multi) return;
    const a = Array.isArray(answers[i]) ? answers[i] : [];
    if (!a.length) return;
    multi += 1;
    const correct = new Set((q.options || []).map((o, j) => (o.correct ? j : -1)).filter((j) => j >= 0));
    const extra = a.filter((j) => !correct.has(j));
    const miss = [...correct].filter((j) => !a.includes(j));
    if (!extra.length && !miss.length) perfect += 1;
    const base = scoreAnswer(q, a, bareme);
    if (extra.length) { over += extra.length; lostToOver += scoreAnswer(q, a.filter((j) => correct.has(j)), bareme) - base; }
    if (miss.length) { missed += miss.length; lostToMissed += scoreAnswer(q, [...a, ...miss], bareme) - base; }
  });
  const r = (x) => Math.round(x * 10) / 10;
  return { multi, perfect, over, missed, lostToOver: r(lostToOver), lostToMissed: r(lostToMissed) };
}
