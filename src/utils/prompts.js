/**
 * Gemini prompt builders for QCM and Examen question generation.
 * Extracted from qcm.js and examen.js.
 */

/**
 * Subject-specific context strings for AI-generated questions.
 * Merged from qcmSubjectPrompts (qcm.js) and subjectPrompts (examen.js / annales.js).
 */
export const SUBJECT_PROMPTS = {
  anatomie:
    "Anatomie humaine pour PASS/LAS : anatomie descriptive, topographique et fonctionnelle (ost\u00e9ologie, myologie, angiologie, neuroanatomie, splanchnologie). Inclure les rapports anatomiques, les innervations, les vascularisations, les pi\u00e8ges classiques sur les structures similaires.",
  chimie:
    "Chimie g\u00e9n\u00e9rale, chimie organique et Biochimie pour PASS/LAS : atomistique, liaisons chimiques, thermodynamique, cin\u00e9tique, st\u00e9r\u00e9ochimie, r\u00e9actions organiques, enzymologie (Michaelis-Menten, inhibitions), m\u00e9tabolisme (glycolyse, cycle de Krebs, \u03b2-oxydation, n\u00e9oglucogen\u00e8se), biochimie structurale (prot\u00e9ines, glucides, lipides, acides nucl\u00e9iques).",
  biocell:
    "Biologie cellulaire et mol\u00e9culaire pour PASS/LAS : structure cellulaire (membrane, organites, cytosquelette), communication cellulaire (r\u00e9cepteurs, voies de signalisation), cycle cellulaire (mitose, m\u00e9iose, r\u00e9gulation), g\u00e9n\u00e9tique mol\u00e9culaire (r\u00e9plication, transcription, traduction, r\u00e9gulation de l'expression g\u00e9nique), techniques de biologie mol\u00e9culaire (PCR, Western blot, CRISPR).",
  biostats:
    "Biostatistiques et \u00e9pid\u00e9miologie pour PASS/LAS : statistiques descriptives, probabilit\u00e9s, lois de distribution (normale, binomiale, Poisson), tests d'hypoth\u00e8ses (Student, Chi\u00b2, ANOVA), intervalles de confiance, mesures \u00e9pid\u00e9miologiques (RR, OR, pr\u00e9valence, incidence), essais cliniques, sensibilit\u00e9/sp\u00e9cificit\u00e9, courbes ROC, r\u00e9gression.",
  biophysique:
    "Biophysique pour PASS/LAS : optique (lentilles, miroirs, \u0153il), ondes (son, ultrasons), radioactivit\u00e9 (d\u00e9croissance, isotopes, applications m\u00e9dicales), imagerie m\u00e9dicale (radiographie, scanner, IRM, scintigraphie, TEP), pH et solutions tampons, RMN, potentiels membranaires, \u00e9lectrophysiologie (ECG, EEG), dosim\u00e9trie, laser m\u00e9dical.",
  ssh:
    "Sciences Humaines et Sociales / \u00c9thique m\u00e9dicale pour PASS/LAS : \u00e9thique m\u00e9dicale (principes, Beauchamp & Childress), droit de la sant\u00e9 (loi Kouchner 2002, loi Claeys-Leonetti), bio\u00e9thique (PMA, fin de vie, consentement), histoire de la m\u00e9decine, philosophie des sciences, sociologie de la sant\u00e9 (in\u00e9galit\u00e9s, d\u00e9terminants), psychologie m\u00e9dicale, syst\u00e8me de sant\u00e9 fran\u00e7ais, \u00e9conomie de la sant\u00e9, sant\u00e9 publique.",
};

/**
 * Build the prompt for generating QCM questions from a fiche topic.
 * @param {object} topic - { subject, subjectName, title, summary }
 * @param {number} count - Number of questions to generate.
 * @returns {string} The full prompt text.
 */
export function buildFichePrompt(topic, count) {
  const subjectContext = SUBJECT_PROMPTS[topic.subject] || '';
  return `Tu es un professeur d'universit\u00e9 sp\u00e9cialis\u00e9 en ${topic.subjectName || ''} pour les concours PASS/LAS (Parcours Acc\u00e8s Sant\u00e9 Sp\u00e9cifique / Licence Acc\u00e8s Sant\u00e9) en France.

G\u00e9n\u00e8re exactement ${count} questions QCM de niveau concours PASS/LAS sur le sujet suivant :
**${topic.title}**
${topic.summary || ''}

Contexte de la mati\u00e8re : ${subjectContext}

CONSIGNES STRICTES :
- Chaque question doit avoir exactement 4 options de r\u00e9ponse
- Une seule bonne r\u00e9ponse par question
- Les questions doivent \u00eatre de niveau universitaire premi\u00e8re ann\u00e9e de m\u00e9decine
- Inclure des pi\u00e8ges classiques des concours (formulations ambigu\u00ebs, confusions courantes)
- Les explications doivent \u00eatre d\u00e9taill\u00e9es, p\u00e9dagogiques et scientifiquement rigoureuses
- Les distracteurs (mauvaises r\u00e9ponses) doivent \u00eatre plausibles
- Varier la difficult\u00e9

R\u00e9ponds UNIQUEMENT avec un tableau JSON valide (pas de texte avant ou apr\u00e8s) au format suivant :
[
  {
    "question": "Texte de la question ?",
    "options": [
      {"text": "Option A", "correct": false},
      {"text": "Option B", "correct": true},
      {"text": "Option C", "correct": false},
      {"text": "Option D", "correct": false}
    ],
    "explanation": "Explication d\u00e9taill\u00e9e de la bonne r\u00e9ponse et pourquoi les autres sont fausses."
  }
]

IMPORTANT : Exactement ${count} questions, chaque question avec exactement 4 options dont une seule correcte. JSON valide uniquement.`;
}

/**
 * Build the prompt for generating QCM questions from a custom text topic.
 * @param {string} customText - Free-form topic description.
 * @param {number} count - Number of questions to generate.
 * @returns {string} The full prompt text.
 */
export function buildCustomPrompt(customText, count) {
  return `Tu es un professeur d'universit\u00e9 expert pour les concours PASS/LAS (Parcours Acc\u00e8s Sant\u00e9 Sp\u00e9cifique / Licence Acc\u00e8s Sant\u00e9) en France.

G\u00e9n\u00e8re exactement ${count} questions QCM de niveau concours PASS/LAS sur le sujet suivant :
${customText}

CONSIGNES STRICTES :
- Chaque question doit avoir exactement 4 options de r\u00e9ponse
- Une seule bonne r\u00e9ponse par question
- Les questions doivent \u00eatre de niveau universitaire premi\u00e8re ann\u00e9e de m\u00e9decine
- Inclure des pi\u00e8ges classiques des concours (formulations ambigu\u00ebs, confusions courantes)
- Les explications doivent \u00eatre d\u00e9taill\u00e9es, p\u00e9dagogiques et scientifiquement rigoureuses
- Les distracteurs (mauvaises r\u00e9ponses) doivent \u00eatre plausibles
- Varier la difficult\u00e9

R\u00e9ponds UNIQUEMENT avec un tableau JSON valide (pas de texte avant ou apr\u00e8s) au format suivant :
[
  {
    "question": "Texte de la question ?",
    "options": [
      {"text": "Option A", "correct": false},
      {"text": "Option B", "correct": true},
      {"text": "Option C", "correct": false},
      {"text": "Option D", "correct": false}
    ],
    "explanation": "Explication d\u00e9taill\u00e9e de la bonne r\u00e9ponse et pourquoi les autres sont fausses."
  }
]

IMPORTANT : Exactement ${count} questions, chaque question avec exactement 4 options dont une seule correcte. JSON valide uniquement.`;
}

/**
 * Build the appropriate prompt based on the topic type.
 * @param {object} topic - The topic object (with type, subject, title, summary, customText).
 * @param {number} count - Number of questions.
 * @returns {string} The prompt.
 */
export function buildPrompt(topic, count) {
  if (topic.type === 'fiche') {
    return buildFichePrompt(topic, count);
  }
  return buildCustomPrompt(topic.customText, count);
}
