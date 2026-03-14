/* ===== PROMPT BUILDERS FOR GEMINI QCM GENERATION ===== */

const SUBJECT_CONTEXT = {
  anatomie: "Anatomie humaine descriptive, topographique et fonctionnelle telle qu'enseignée en PASS/LAS : ostéologie (os du squelette axial et appendiculaire), arthrologie (classification et biomécanique des articulations), myologie (muscles, insertions, actions, innervation), neuroanatomie (SNC, SNP, nerfs crâniens, voies sensitives et motrices), angiologie (artères, veines, circulation systémique et pulmonaire), splanchnologie (organes thoraciques, abdominaux, pelviens avec rapports anatomiques). Niveau attendu : connaître les rapports anatomiques précis, les innervations segmentaires, les vascularisations artérielles et veineuses, les variations anatomiques fréquentes.",
  chimie: "Chimie générale et organique du programme PASS/LAS : atomistique (configuration électronique, classification périodique, liaisons chimiques, orbitales moléculaires), thermodynamique chimique (enthalpie, entropie, énergie libre de Gibbs, constantes d'équilibre), cinétique chimique (ordres de réaction, énergie d'activation, catalyse enzymatique Michaelis-Menten), solutions aqueuses (pH, tampons, acides/bases faibles et forts), chimie organique (nomenclature IUPAC, stéréochimie R/S et E/Z, réactions de substitution SN1/SN2, élimination E1/E2, addition, mécanismes réactionnels), biochimie structurale et métabolique (acides aminés et structure des protéines, enzymologie, glycolyse, cycle de Krebs, chaîne respiratoire, beta-oxydation, néoglucogenèse).",
  biocell: "Biologie cellulaire et moléculaire du programme PASS/LAS : ultrastructure cellulaire (membrane plasmique avec modèle de Singer et Nicolson, réticulum endoplasmique, appareil de Golgi, lysosomes, mitochondries, noyau et enveloppe nucléaire), cytosquelette (microfilaments d'actine, microtubules, filaments intermédiaires), communication cellulaire (récepteurs membranaires, voies de signalisation MAPK/Ras, seconds messagers AMPc/IP3/DAG, récepteurs nucléaires), cycle cellulaire (phases G1/S/G2/M, points de contrôle, cyclines et CDK, apoptose), division cellulaire (mitose et méiose avec crossing-over), génétique moléculaire (structure de l'ADN, réplication semi-conservative, transcription avec épissage, traduction avec code génétique, régulation de l'expression génique, mutations et réparation de l'ADN), techniques de biologie moléculaire (PCR, Western blot, électrophorèse, séquençage).",
  biostats: "Biostatistiques et probabilités du programme PASS/LAS : statistiques descriptives (moyenne, médiane, mode, variance, écart-type, quartiles, représentations graphiques), probabilités (axiomes de Kolmogorov, probabilités conditionnelles, théorème de Bayes, indépendance), lois de probabilité discrètes (binomiale, Poisson) et continues (normale, Student), estimation ponctuelle et par intervalle de confiance, tests d'hypothèses paramétriques et non paramétriques (test Z, test t de Student, Chi-2 de conformité et d'indépendance, ANOVA à un facteur, tests de rang), risques alpha et bêta, puissance d'un test, épidémiologie (prévalence, incidence, taux de mortalité, risque relatif, odds ratio, sensibilité, spécificité, VPP, VPN, courbes ROC), lecture critique d'article et méthodologie des essais cliniques (randomisation, double aveugle, critères de jugement, biais).",
  biophysique: "Biophysique du programme PASS/LAS : optique géométrique et physiologique (lentilles minces convergentes et divergentes, dioptres, systèmes optiques centrés, oeil réduit, amétropies et corrections), mécanique des fluides (statique des fluides, pression hydrostatique, théorème de Bernoulli, viscosité, loi de Poiseuille, applications circulatoires), électrophysiologie (potentiel de repos, potentiel d'action, conduction nerveuse, électrocardiogramme, électroencéphalogramme), radioactivité (désintégrations alpha/bêta/gamma, période radioactive, activité, dosimétrie avec gray et sievert, radioprotection), imagerie médicale par RMN et IRM (moment magnétique nucléaire, temps de relaxation T1/T2, séquences d'acquisition, pondération), ultrasons et échographie (impédance acoustique, réflexion, effet Doppler, modes A/B/TM), rayons X et tomodensitométrie (production des rayons X, atténuation, coefficient d'atténuation linéique, unités Hounsfield).",
  ssh: "Sciences humaines et sociales en santé du programme PASS/LAS : éthique médicale et bioéthique (principes de Beauchamp et Childress : autonomie, bienfaisance, non-malfaisance, justice ; éthique narrative, éthique du care, consentement éclairé, directives anticipées, personne de confiance), histoire de la médecine (d'Hippocrate à la médecine fondée sur les preuves, grandes découvertes : vaccination, antisepsie, antibiotiques, imagerie), droit de la santé (lois de bioéthique françaises, loi Kouchner 2002, droits des patients, secret médical, responsabilité médicale civile et pénale), relation médecin-patient (modèles paternaliste/autonomiste/délibératif, annonce diagnostique, éducation thérapeutique), psychologie médicale (mécanismes de défense, deuil, observance, effet placebo), sociologie de la santé (déterminants sociaux de santé, inégalités sociales de santé, parcours de soins, système de santé français), santé publique (prévention primaire/secondaire/tertiaire, dépistage, promotion de la santé, indicateurs de santé publique).",
};

const PASS_LAS_CONTEXT = `
CONTEXTE ACADÉMIQUE IMPORTANT :
Tu génères des questions pour des étudiants inscrits en PASS (Parcours d'Accès Spécifique Santé) ou LAS (Licence avec option Accès Santé) dans les universités françaises.
Ces formations préparent aux études de médecine, pharmacie, odontologie, maïeutique et kinésithérapie.
Le niveau requis est celui de la première année d'études supérieures en santé (Bac+1), conforme au programme national des universités françaises.
Les questions doivent correspondre au niveau réellement posé dans les épreuves universitaires PASS/LAS, PAS au niveau d'un interne ou d'un médecin confirmé.
Utilise la terminologie française officielle du programme universitaire.
`;

const JSON_FORMAT_INSTRUCTIONS = `
Tu dois répondre UNIQUEMENT avec un tableau JSON valide, sans aucun texte avant ou après.
Chaque élément du tableau doit respecter EXACTEMENT ce format :
{
  "question": "L'énoncé de la question",
  "options": [
    { "text": "Proposition A", "correct": false },
    { "text": "Proposition B", "correct": true },
    { "text": "Proposition C", "correct": false },
    { "text": "Proposition D", "correct": false }
  ],
  "explanation": "Explication détaillée de la bonne réponse (2-3 phrases)"
}

RÈGLES STRICTES :
- Exactement 4 options par question
- Exactement UNE option correcte (correct: true), les 3 autres à false
- La position de la bonne réponse doit varier aléatoirement
- Les explications doivent être pédagogiques et détaillées
- Pas de markdown, pas de commentaires, JUSTE le tableau JSON
`;

export function buildQCMPrompt(subject, subjectName, count, ficheTopic = null) {
  const context = SUBJECT_CONTEXT[subject] || null;
  const topicLine = ficheTopic
    ? `\nSujet spécifique : ${ficheTopic}\nTOUTES les questions doivent porter EXCLUSIVEMENT sur ce sujet précis, au niveau PASS/LAS. Ne génère PAS de questions sur d'autres thèmes.\n`
    : '';
  const domainLine = context ? `\nDomaine : ${context}` : '';

  return `Tu es un professeur universitaire expert qui enseigne en PASS/LAS (première année de santé) dans une faculté de médecine française.

${PASS_LAS_CONTEXT}

Génère ${count} questions à choix multiples (QCM) d'ENTRAÎNEMENT de niveau PASS/LAS.

Matière : ${subjectName}${domainLine}${topicLine}

Niveau de difficulté : Questions d'entraînement de niveau PASS/LAS (facile à intermédiaire pour ce cursus).
- Les questions doivent correspondre à ce qu'un étudiant de PASS/LAS rencontre dans ses TD, ses annales d'entraînement et ses colles
- Couvrir différents aspects du ${ficheTopic ? 'sujet spécifique' : 'programme PASS/LAS'}
- Tester à la fois les connaissances fondamentales et la compréhension des mécanismes

Consignes pédagogiques :
- Questions claires, précises, conformes au programme universitaire PASS/LAS français
- Distracteurs (mauvaises réponses) plausibles : erreurs classiques que font les étudiants de PASS/LAS
- ${ficheTopic ? `Varier les aspects au sein du sujet "${ficheTopic}"` : 'Varier les thèmes au sein de la matière'}
- Utiliser la terminologie médicale/scientifique française officielle enseignée en PASS/LAS
- Les explications doivent aider l'étudiant à comprendre POURQUOI c'est la bonne réponse, avec les rappels de cours pertinents
- Ne PAS poser de questions de niveau internat, ECN/EDN ou spécialité médicale

${JSON_FORMAT_INSTRUCTIONS}

Génère exactement ${count} questions.`;
}

export function buildExamenPrompt(subject, subjectName, count, ficheTopic = null) {
  const context = SUBJECT_CONTEXT[subject] || null;
  const topicLine = ficheTopic
    ? `\nSujet spécifique : ${ficheTopic}\nTOUTES les questions doivent porter EXCLUSIVEMENT sur ce sujet précis, au niveau PASS/LAS. Ne génère PAS de questions sur d'autres thèmes.\n`
    : '';
  const domainLine = context ? `\nDomaine : ${context}` : '';

  return `Tu es un professeur universitaire expert qui prépare un EXAMEN BLANC de PASS/LAS dans une faculté de médecine française.

${PASS_LAS_CONTEXT}

Génère ${count} questions à choix multiples (QCM) de niveau EXAMEN PASS/LAS.

Matière : ${subjectName}${domainLine}${topicLine}

Niveau de difficulté : Questions d'EXAMEN de niveau PASS/LAS (intermédiaire à difficile pour ce cursus).
Ces questions doivent simuler un vrai partiel ou examen terminal de PASS/LAS :
- Questions du même niveau que celles posées aux examens des facultés de médecine françaises en première année
- Certaines questions à raisonnement qui testent la compréhension des mécanismes (pas uniquement du par cœur)
- Distracteurs subtils reproduisant les erreurs classiques des étudiants de PASS/LAS
- ${ficheTopic ? `Approfondir différents aspects de "${ficheTopic}" au niveau PASS/LAS` : 'Intégration de plusieurs notions dans une même question quand c\'est pertinent'}
- Quelques questions pièges classiques des examens de PASS/LAS (confusions fréquentes, inversions, exceptions)

Consignes :
- Questions rigoureuses et précises, identiques au style des épreuves universitaires PASS/LAS
- Les distracteurs doivent être subtils et crédibles pour un étudiant de première année
- Varier les niveaux de difficulté (60% intermédiaire, 40% difficile, toujours dans le cadre PASS/LAS)
- Utiliser la terminologie exacte du programme officiel PASS/LAS français
- Les explications doivent être complètes, pédagogiques, avec les rappels de cours utiles
- Ne PAS poser de questions de niveau internat, ECN/EDN ou spécialité médicale

${JSON_FORMAT_INSTRUCTIONS}

Génère exactement ${count} questions.`;
}
