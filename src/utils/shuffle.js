/**
 * Mélange des propositions de réponse.
 *
 * Dans la banque statique, la bonne réponse est presque toujours en 2e ou 3e
 * position : sans mélange, l'étudiant peut deviner sans lire. Les questions
 * générées par IA présentent souvent le même biais.
 *
 * On mélange donc les options au lancement de chaque session. L'indicateur
 * `correct` étant porté par l'option elle-même, aucun index n'est à recalculer.
 */

/** Copie mélangée d'un tableau (Fisher-Yates). */
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Copie d'une question dont les propositions sont mélangées. */
export function shuffleQuestionOptions(question) {
  if (!question || !Array.isArray(question.options) || question.options.length < 2) return question;
  return { ...question, options: shuffleArray(question.options) };
}

/** Applique le mélange à une liste de questions. */
export function shuffleAllOptions(questions) {
  return (questions || []).map(shuffleQuestionOptions);
}
