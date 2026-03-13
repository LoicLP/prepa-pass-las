/* ===== MODE EXAMEN ENGINE — GEMINI AI ===== */

/* ========== CLE API GEMINI ========== */
const GEMINI_API_KEY = 'VOTRE_CLE_API_ICI'; // <- Remplacer par votre cle Google AI Studio
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/* ========== STATE ========== */
let examState = {
  currentView: 'hero',
  subjectFilter: 'all',
  searchQuery: '',
  selectedSubject: null,
  questions: [],
  answers: [],
  currentQ: 0,
  timerInterval: null,
  timerSeconds: 0,
  startTime: null,
  examDuration: 30,
  isGenerating: false,
  selectedTopic: null,
};

let pendingFicheTopic = null;

/* ========== SUBJECT CONFIG ========== */
const examColors = {
  'indigo': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500', icon: 'text-indigo-500', ring: 'ring-indigo-200' },
  'primary': { bg: 'bg-primary-50', border: 'border-primary-200', text: 'text-primary-700', badge: 'bg-primary-100 text-primary-700', bar: 'bg-primary-500', icon: 'text-primary-500', ring: 'ring-primary-200' },
  'emerald': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', icon: 'text-emerald-500', ring: 'ring-emerald-200' },
  'violet': { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500', icon: 'text-violet-500', ring: 'ring-violet-200' },
  'cyan': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700', bar: 'bg-cyan-500', icon: 'text-cyan-500', ring: 'ring-cyan-200' },
  'amber': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500', icon: 'text-amber-500', ring: 'ring-amber-200' },
  'rose': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700', bar: 'bg-rose-500', icon: 'text-rose-500', ring: 'ring-rose-200' },
};

const examIcons = {
  'anatomie': '<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>',
  'chimie': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
  'biocell': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/>',
  'biostats': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>',
  'biophysique': '<path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"/>',
  'ssh': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>',
};

const subjectPrompts = {
  'anatomie': "Anatomie humaine pour PASS/LAS : anatomie descriptive, topographique et fonctionnelle (osteologie, myologie, angiologie, neuroanatomie, splanchnologie). Inclure les rapports anatomiques, les innervations, les vascularisations, les pieges classiques sur les structures similaires.",
  'chimie': "Chimie generale, chimie organique et Biochimie pour PASS/LAS : atomistique, liaisons chimiques, thermodynamique, cinetique, stereochimie, reactions organiques, enzymologie (Michaelis-Menten, inhibitions), metabolisme (glycolyse, cycle de Krebs, beta-oxydation, neoglucogenese), biochimie structurale (proteines, glucides, lipides, acides nucleiques).",
  'biocell': "Biologie cellulaire et moleculaire pour PASS/LAS : structure cellulaire (membrane, organites, cytosquelette), communication cellulaire (recepteurs, voies de signalisation), cycle cellulaire (mitose, meiose, regulation), genetique moleculaire (replication, transcription, traduction, regulation de l'expression genique), techniques de biologie moleculaire (PCR, Western blot, CRISPR).",
  'biostats': "Biostatistiques et epidemiologie pour PASS/LAS : statistiques descriptives, probabilites, lois de distribution (normale, binomiale, Poisson), tests d'hypotheses (Student, Chi2, ANOVA), intervalles de confiance, mesures epidemiologiques (RR, OR, prevalence, incidence), essais cliniques, sensibilite/specificite, courbes ROC, regression.",
  'biophysique': "Biophysique pour PASS/LAS : optique (lentilles, miroirs, oeil), ondes (son, ultrasons), radioactivite (decroissance, isotopes, applications medicales), imagerie medicale (radiographie, scanner, IRM, scintigraphie, TEP), pH et solutions tampons, RMN, potentiels membranaires, electrophysiologie (ECG, EEG), dosimetrie, laser medical.",
  'ssh': "Sciences Humaines et Sociales / Ethique medicale pour PASS/LAS : ethique medicale (principes, Beauchamp & Childress), droit de la sante (loi Kouchner 2002, loi Claeys-Leonetti), bioethique (PMA, fin de vie, consentement), histoire de la medecine, philosophie des sciences, sociologie de la sante (inegalites, determinants), psychologie medicale, systeme de sante francais, economie de la sante, sante publique."
};

/* ========== STATS ========== */
function getExamStats() {
  try { return JSON.parse(localStorage.getItem('prepa-examen-stats')) || { sessions: [] }; }
  catch { return { sessions: [] }; }
}
function saveExamSession(session) {
  const stats = getExamStats();
  stats.sessions.unshift(session);
  if (stats.sessions.length > 50) stats.sessions = stats.sessions.slice(0, 50);
  localStorage.setItem('prepa-examen-stats', JSON.stringify(stats));
}

/* ========== VIEW TRANSITION HELPER ========== */
function transitionView(renderFn) {
  const app = document.getElementById('examen-app');
  app.classList.add('exam-view-exit');
  setTimeout(() => {
    renderFn();
    app.classList.remove('exam-view-exit');
    app.classList.add('exam-view-enter');
    requestAnimationFrame(() => {
      setTimeout(() => app.classList.remove('exam-view-enter'), 400);
    });
  }, 250);
}

/* ========== GEMINI AI -- QUESTION GENERATION ========== */
async function generateExamQuestions(source) {
  let prompt;

  if (source.type === 'fiche') {
    const fiche = source.fiche;
    const subjectContext = subjectPrompts[fiche.subject] || '';
    const ficheContent = fiche.content ? `\n\nContenu de la fiche :\n${fiche.content}` : '';

    prompt = `Tu es un professeur d'universite specialise en ${fiche.subjectName || ''} pour les concours PASS/LAS (Parcours Acces Sante Specifique / Licence Acces Sante) en France.

Génère exactement 20 questions QCM de niveau concours PASS/LAS sur le sujet suivant :
**${fiche.title}**
${fiche.summary || ''}
${ficheContent}

Contexte de la matière : ${subjectContext}

CONSIGNES STRICTES :
- Chaque question doit avoir exactement 4 options de reponse
- Une seule bonne reponse par question
- Les questions doivent etre de niveau universitaire premiere annee de medecine
- Inclure des pieges classiques des concours (formulations ambigues, confusions courantes)
- Les explications doivent être détaillées, pédagogiques et scientifiquement rigoureuses
- Varier les thématiques au sein du sujet (ne pas se répéter)
- Varier la difficulte (quelques questions faciles, majorite moyennes, quelques difficiles)
- Les distracteurs (mauvaises reponses) doivent etre plausibles et correspondre a des erreurs courantes des etudiants

Reponds UNIQUEMENT avec un tableau JSON valide (pas de texte avant ou apres) au format suivant :
[
  {
    "question": "Texte de la question ?",
    "options": [
      {"text": "Option A", "correct": false},
      {"text": "Option B", "correct": true},
      {"text": "Option C", "correct": false},
      {"text": "Option D", "correct": false}
    ],
    "explanation": "Explication détaillée de la bonne réponse et pourquoi les autres sont fausses."
  }
]

IMPORTANT : Exactement 20 questions, chaque question avec exactement 4 options dont une seule correcte. JSON valide uniquement.`;

  } else if (source.type === 'custom') {
    prompt = `Tu es un professeur d'universite expert pour les concours PASS/LAS (Parcours Acces Sante Specifique / Licence Acces Sante) en France.

Génère exactement 20 questions QCM de niveau concours PASS/LAS sur le sujet suivant :
${source.topic}

CONSIGNES STRICTES :
- Chaque question doit avoir exactement 4 options de reponse
- Une seule bonne reponse par question
- Les questions doivent etre de niveau universitaire premiere annee de medecine
- Inclure des pieges classiques des concours (formulations ambigues, confusions courantes)
- Les explications doivent être détaillées, pédagogiques et scientifiquement rigoureuses
- Varier les thématiques au sein du sujet (ne pas se répéter)
- Varier la difficulte (quelques questions faciles, majorite moyennes, quelques difficiles)
- Les distracteurs (mauvaises reponses) doivent etre plausibles et correspondre a des erreurs courantes des etudiants

Reponds UNIQUEMENT avec un tableau JSON valide (pas de texte avant ou apres) au format suivant :
[
  {
    "question": "Texte de la question ?",
    "options": [
      {"text": "Option A", "correct": false},
      {"text": "Option B", "correct": true},
      {"text": "Option C", "correct": false},
      {"text": "Option D", "correct": false}
    ],
    "explanation": "Explication détaillée de la bonne réponse et pourquoi les autres sont fausses."
  }
]

IMPORTANT : Exactement 20 questions, chaque question avec exactement 4 options dont une seule correcte. JSON valide uniquement.`;

  } else if (source.type === 'mixed') {
    // Examen complet : 40 questions mélangées sur toutes les matières
    const allSubjects = Object.entries(subjectPrompts).map(([id, ctx]) => {
      const subject = SUBJECTS.find(s => s.id === id);
      return `**${subject?.name || id}** : ${ctx}`;
    }).join('\n\n');

    prompt = `Tu es un professeur d'université expert pour les concours PASS/LAS (Parcours Accès Santé Spécifique / Licence Accès Santé) en France.

Génère exactement 40 questions QCM de niveau concours PASS/LAS, réparties de manière équilibrée sur les 6 matières du tronc commun suivantes :

${allSubjects}

CONSIGNES STRICTES :
- Exactement 40 questions au total, environ 6 à 7 questions par matière
- Les questions doivent être mélangées (ne pas regrouper par matière)
- Chaque question doit avoir exactement 4 options de réponse
- Une seule bonne réponse par question
- Les questions doivent être de niveau universitaire première année de médecine
- Inclure des pièges classiques des concours (formulations ambiguës, confusions courantes)
- Les explications doivent être détaillées, pédagogiques et scientifiquement rigoureuses
- Varier la difficulté (quelques questions faciles, majorité moyennes, quelques difficiles)
- Les distracteurs (mauvaises réponses) doivent être plausibles et correspondre à des erreurs courantes des étudiants

Réponds UNIQUEMENT avec un tableau JSON valide (pas de texte avant ou après) au format suivant :
[
  {
    "question": "Texte de la question ?",
    "options": [
      {"text": "Option A", "correct": false},
      {"text": "Option B", "correct": true},
      {"text": "Option C", "correct": false},
      {"text": "Option D", "correct": false}
    ],
    "explanation": "Explication détaillée de la bonne réponse et pourquoi les autres sont fausses."
  }
]

IMPORTANT : Exactement 40 questions, chaque question avec exactement 4 options dont une seule correcte. JSON valide uniquement.`;

  } else {
    // Fallback: legacy subjectId-based generation
    const subjectId = source.subjectId;
    const subject = SUBJECTS.find(s => s.id === subjectId);
    const subjectContext = subjectPrompts[subjectId] || subject?.name || subjectId;

    prompt = `Tu es un professeur d'universite specialise en ${subject?.name || subjectId} pour les concours PASS/LAS (Parcours Acces Sante Specifique / Licence Acces Sante) en France.

Génère exactement 20 questions QCM de niveau concours PASS/LAS sur le thème suivant :
${subjectContext}

CONSIGNES STRICTES :
- Chaque question doit avoir exactement 4 options de reponse
- Une seule bonne reponse par question
- Les questions doivent etre de niveau universitaire premiere annee de medecine
- Inclure des pieges classiques des concours (formulations ambigues, confusions courantes)
- Les explications doivent être détaillées, pédagogiques et scientifiquement rigoureuses
- Varier les thématiques au sein de la matière (ne pas se répéter)
- Varier la difficulte (quelques questions faciles, majorite moyennes, quelques difficiles)
- Les distracteurs (mauvaises reponses) doivent etre plausibles et correspondre a des erreurs courantes des etudiants

Reponds UNIQUEMENT avec un tableau JSON valide (pas de texte avant ou apres) au format suivant :
[
  {
    "question": "Texte de la question ?",
    "options": [
      {"text": "Option A", "correct": false},
      {"text": "Option B", "correct": true},
      {"text": "Option C", "correct": false},
      {"text": "Option D", "correct": false}
    ],
    "explanation": "Explication détaillée de la bonne réponse et pourquoi les autres sont fausses."
  }
]

IMPORTANT : Exactement 20 questions, chaque question avec exactement 4 options dont une seule correcte. JSON valide uniquement.`;
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: source.type === 'mixed' ? 32768 : 16384,
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Erreur API Gemini (${response.status}): ${err}`);
  }

  const data = await response.json();

  // Extract generated text
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Reponse vide de Gemini');

  // Parse JSON
  let questions;
  try {
    questions = JSON.parse(text);
  } catch (e) {
    // Try to extract JSON from the response if it has extra text
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      questions = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Format de reponse invalide');
    }
  }

  // Validate structure
  const isMixed = source.type === 'mixed';
  const targetCount = isMixed ? 40 : 20;
  const minRequired = isMixed ? 20 : 10;

  if (!Array.isArray(questions) || questions.length < minRequired) {
    throw new Error(`Nombre insuffisant de questions reçues (${questions?.length || 0})`);
  }

  // Sanitize and validate each question
  const validated = questions.slice(0, targetCount).filter(q => {
    return q.question &&
           Array.isArray(q.options) &&
           q.options.length === 4 &&
           q.options.filter(o => o.correct).length === 1 &&
           q.explanation;
  });

  if (validated.length < minRequired) {
    throw new Error(`Trop peu de questions valides (${validated.length}/${targetCount})`);
  }

  return validated;
}

/* ========== INIT ========== */
function initExamen() {
  renderHero();
}

/* ========== STEP 1 : HERO ========== */
function renderHero() {
  examState.currentView = 'hero';
  examState.selectedSubject = null;
  examState.selectedTopic = null;
  examState.isGenerating = false;
  const app = document.getElementById('examen-app');
  const stats = getExamStats();
  const totalDone = stats.sessions.length;
  const avgScore = totalDone > 0 ? Math.round(stats.sessions.reduce((a, s) => a + s.percentage, 0) / totalDone) : 0;

  app.innerHTML = `
    <!-- Hero -->
    <section class="gradient-hero noise-overlay dot-grid pt-28 pb-14 md:pt-36 md:pb-20 relative overflow-hidden">
      <div class="blob-1"></div>
      <div class="blob-2"></div>
      <div class="absolute w-[280px] h-[280px] bg-violet-300/10 rounded-full blur-[80px] top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"></div>
      <div class="geo-circle-light w-40 h-40 top-24 right-[10%] hidden lg:block"></div>
      <div class="geo-ring-light w-64 h-64 -bottom-16 left-[5%] hidden lg:block"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <!-- Left: Text -->
          <div>
            <div class="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-primary-200 mb-6">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span class="text-sm font-semibold text-primary-700">Questions illimitées</span>
            </div>
            <h1 class="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-5">
              Entraînez-vous en <span class="exam-gradient-text">conditions réelles</span>
            </h1>
            <p class="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
              Une <strong class="text-gray-900">infinité de questions</strong> uniques de niveau concours, un chronomètre et une <strong class="text-gray-900">correction détaillée</strong> à la fin. Épreuve classique de 20 questions en 30 min ou <strong class="text-gray-900">examen complet</strong> de 40 questions en 60 min.
            </p>
            <!-- Stats row -->
            <div class="flex flex-wrap items-center gap-5 sm:gap-6 mb-8">
              <div class="exam-stat flex items-center gap-3">
                <div class="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>
                </div>
                <div>
                  <div class="text-xl font-black text-gray-900">&infin;</div>
                  <div class="text-xs font-medium text-gray-500">Questions</div>
                </div>
              </div>
              <div class="w-px h-10 bg-gray-200/60 hidden sm:block"></div>
              <div class="exam-stat flex items-center gap-3">
                <div class="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                </div>
                <div>
                  <div class="text-xl font-black text-gray-900">30-60 min</div>
                  <div class="text-xs font-medium text-gray-500">Par épreuve</div>
                </div>
              </div>
              <div class="w-px h-10 bg-gray-200/60 hidden sm:block"></div>
              <div class="exam-stat flex items-center gap-3">
                <div class="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"/></svg>
                </div>
                <div>
                  <div class="text-xl font-black text-gray-900">6</div>
                  <div class="text-xs font-medium text-gray-500">Matières</div>
                </div>
              </div>
            </div>
            <!-- CTA Button -->
            <button onclick="transitionView(() => renderModeChoice())" class="group px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 flex items-center gap-3 text-lg">
              Commencer une épreuve
              <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
            </button>
          </div>
          <!-- Right: Mock exam preview -->
          <div class="flex justify-center lg:justify-end">
            <div class="w-full max-w-sm">
              <!-- Mock exam card -->
              <div class="mock-float bg-white rounded-2xl shadow-xl shadow-primary-500/10 border border-gray-100 p-5 mb-4">
                <div class="flex items-center justify-between mb-4">
                  <span class="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">Anatomie</span>
                  <div class="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <svg class="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                    <span class="text-sm font-mono font-bold text-gray-700 timer-tick">24:37</span>
                  </div>
                </div>
                <p class="text-sm font-bold text-gray-900 mb-3 leading-relaxed">Quel muscle est responsable de la flexion de l'avant-bras sur le bras ?</p>
                <div class="space-y-2">
                  <div class="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-medium text-gray-600 flex items-center gap-2">
                    <span class="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">A</span>
                    Triceps brachial
                  </div>
                  <div class="px-4 py-2.5 rounded-xl border-2 border-primary-500 bg-primary-50 text-xs font-medium text-primary-700 flex items-center gap-2">
                    <span class="w-5 h-5 rounded bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700">B</span>
                    Biceps brachial
                  </div>
                  <div class="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-medium text-gray-600 flex items-center gap-2">
                    <span class="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">C</span>
                    Deltoide
                  </div>
                </div>
                <div class="flex justify-center gap-1.5 mt-4">
                  <span class="w-5 h-5 rounded bg-primary-100 text-primary-700 text-[9px] font-bold flex items-center justify-center">1</span>
                  <span class="w-5 h-5 rounded bg-primary-100 text-primary-700 text-[9px] font-bold flex items-center justify-center">2</span>
                  <span class="w-5 h-5 rounded bg-primary-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">3</span>
                  <span class="w-5 h-5 rounded bg-gray-100 text-gray-400 text-[9px] font-bold flex items-center justify-center">4</span>
                  <span class="w-5 h-5 rounded bg-gray-100 text-gray-400 text-[9px] font-bold flex items-center justify-center">5</span>
                  <span class="text-[9px] text-gray-400 flex items-center">...</span>
                  <span class="w-5 h-5 rounded bg-gray-100 text-gray-400 text-[9px] font-bold flex items-center justify-center">20</span>
                </div>
              </div>
              <!-- Stats card if user has history -->
              ${totalDone > 0 ? `
              <div class="mock-float mock-float-delay bg-white rounded-2xl shadow-lg shadow-primary-500/5 border border-gray-100 p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900">${totalDone} épreuve${totalDone > 1 ? 's' : ''}</p>
                      <p class="text-xs text-gray-500">Score moyen : <strong class="${avgScore >= 70 ? 'text-emerald-600' : avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}">${avgScore}%</strong></p>
                    </div>
                  </div>
                  <svg class="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
                </div>
              </div>` : `
              <div class="mock-float mock-float-delay bg-gradient-to-br from-primary-600 to-violet-600 rounded-2xl shadow-lg shadow-primary-500/20 p-4 text-white">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-bold">Questions uniques a chaque fois</p>
                    <p class="text-xs text-white/70">De nouvelles questions sont générées à chaque épreuve</p>
                  </div>
                </div>
              </div>`}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  document.getElementById('site-footer').style.display = '';
}

/* ========== STEP 2 : MODE CHOICE ========== */
function renderModeChoice() {
  examState.currentView = 'choice';
  const app = document.getElementById('examen-app');
  const fichesCount = typeof FICHES_DATA !== 'undefined' ? FICHES_DATA.length : 150;

  app.innerHTML = `
    <section class="pt-24 pb-16 md:pt-28 md:pb-20 min-h-screen bg-slate-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back -->
        <button onclick="transitionView(() => renderHero())" class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium mb-8 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
          Retour
        </button>

        <!-- Title -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full border border-primary-200 mb-5">
            <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>
            <span class="text-sm font-semibold text-primary-700">Nouvelle épreuve</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-3">Comment souhaitez-vous réviser ?</h2>
          <p class="text-gray-500 text-base max-w-lg mx-auto">Choisissez votre mode de révision pour commencer.</p>
        </div>

        <!-- Three choice cards -->
        <div class="grid md:grid-cols-2 gap-5 mb-8">
          <!-- Card 1: Nos fiches -->
          <button onclick="transitionView(() => renderFichesSelection())" class="mode-card group bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10 transition-all">
            <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/></svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">À partir de nos fiches</h3>
            <p class="text-sm text-gray-500 leading-relaxed mb-4">Générez une épreuve à partir de nos fiches de révision et de nos cours, classés par matière.</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>
                  ${fichesCount} fiches
                </span>
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                  20 questions · 30 min
                </span>
              </div>
              <svg class="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
            </div>
          </button>

          <!-- Card 2: Sujet libre -->
          <button onclick="transitionView(() => renderCustomSelection())" class="mode-card group bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10 transition-all">
            <div class="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/></svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">À partir d'un sujet libre</h3>
            <p class="text-sm text-gray-500 leading-relaxed mb-4">Générez une épreuve à partir de votre propre thème, sur mesure pour vos révisions.</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>
                  Thème libre
                </span>
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                  20 questions · 30 min
                </span>
              </div>
              <svg class="w-5 h-5 text-gray-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
            </div>
          </button>
        </div>

        <!-- Card 3: Examen complet (full width) -->
        <div class="mb-8">
          <button onclick="showMixedExamConfirmation()" class="mode-card group bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all w-full">
            <div class="flex items-start gap-5">
              <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.996.436-1.75 1.35-1.75 2.514 0 .956.433 1.811 1.114 2.378.06.05.132.076.204.076a.517.517 0 0 0 .391-.177c.204-.23.372-.489.505-.771.132-.283.22-.584.258-.898.04-.313.012-.63-.058-.932A2.45 2.45 0 0 0 5.25 4.236ZM18.75 4.236c.996.436 1.75 1.35 1.75 2.514 0 .956-.433 1.811-1.114 2.378a.351.351 0 0 1-.204.076.517.517 0 0 1-.391-.177 3.076 3.076 0 0 1-.505-.771 3.076 3.076 0 0 1-.258-.898c-.04-.313-.012-.63.058-.932.067-.3.182-.583.33-.84.15-.256.333-.484.334-.35Z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-lg font-bold text-gray-900">Examen complet</h3>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wide">Concours</span>
                </div>
                <p class="text-sm text-gray-500 leading-relaxed mb-3">Épreuve de 40 questions mélangées sur l'ensemble des matières du tronc commun. Conditions proches du concours.</p>
                <div class="flex items-center justify-between">
                  <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                    40 questions · 60 min
                  </span>
                  <svg class="w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  `;

  document.getElementById('site-footer').style.display = '';
}

/* ========== STEP 3a : FICHES SELECTION ========== */
function renderFichesSelection() {
  examState.currentView = 'fiches';
  const app = document.getElementById('examen-app');

  app.innerHTML = `
    <section class="pt-24 pb-16 md:pt-28 md:pb-20 min-h-screen bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back -->
        <button onclick="transitionView(() => renderModeChoice())" class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium mb-8 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
          Retour
        </button>

        <!-- Title -->
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-2">Choisissez votre fiche</h2>
          <p class="text-gray-500 text-base max-w-lg mx-auto">Sélectionnez un sujet parmi nos fiches de révision pour générer votre épreuve de 20 questions.</p>
        </div>

        <!-- Exam info banner (instead of question count selector) -->
        <div class="bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl border-2 border-primary-200 p-5 mb-8 max-w-lg mx-auto relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-primary-100/50 rounded-full -translate-y-8 translate-x-8 pointer-events-none"></div>
          <div class="relative flex items-center gap-4">
            <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900">20 questions &middot; 30 minutes &middot; Correction à la fin</p>
              <p class="text-xs text-gray-500 mt-0.5">Épreuve en conditions réelles de concours</p>
            </div>
          </div>
        </div>

        <!-- Search + filters -->
        <div class="max-w-5xl mx-auto mb-6">
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div class="relative flex-1 w-full">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
              <input type="text" id="exam-search" placeholder="Rechercher un sujet..." class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" value="${examState.searchQuery}">
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mt-3">
            <button onclick="setExamSubjectFilter('all')" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 ${examState.subjectFilter === 'all' ? 'active' : ''}">Toutes</button>
            ${SUBJECTS.map(s => `
              <button onclick="setExamSubjectFilter('${s.id}')" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 ${examState.subjectFilter === s.id ? 'active' : ''}">${s.name}</button>
            `).join('')}
          </div>
          <p id="fiches-counter" class="hidden text-xs text-gray-400 font-medium mt-2 text-center"></p>
        </div>

        <!-- Fiches grid -->
        <div id="fiches-grid" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto"></div>
      </div>
    </section>
  `;

  document.getElementById('site-footer').style.display = '';
  renderExamFichesGrid();
  bindExamSearchEvents();
}

/* ========== STEP 3b : CUSTOM SELECTION ========== */
function renderCustomSelection() {
  examState.currentView = 'custom';
  const app = document.getElementById('examen-app');

  app.innerHTML = `
    <section class="pt-24 pb-16 md:pt-28 md:pb-20 min-h-screen bg-slate-50">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back -->
        <button onclick="transitionView(() => renderModeChoice())" class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium mb-8 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
          Retour
        </button>

        <!-- Title -->
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-2">Sujet personnalise</h2>
          <p class="text-gray-500 text-base max-w-lg mx-auto">Décrivez votre thème de révision et générez une épreuve de 20 questions sur mesure.</p>
        </div>

        <!-- Exam info banner (instead of question count selector) -->
        <div class="bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl border-2 border-primary-200 p-5 mb-8 max-w-lg mx-auto relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-primary-100/50 rounded-full -translate-y-8 translate-x-8 pointer-events-none"></div>
          <div class="relative flex items-center gap-4">
            <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900">20 questions &middot; 30 minutes &middot; Correction à la fin</p>
              <p class="text-xs text-gray-500 mt-0.5">Épreuve en conditions réelles de concours</p>
            </div>
          </div>
        </div>

        <!-- Custom topic card -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/></svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">Votre sujet</h3>
              <p class="text-xs text-gray-500">Soyez precis pour des questions de meilleure qualite</p>
            </div>
          </div>
          <textarea id="custom-topic" rows="4" placeholder="Ex: Les reactions d'oxydoreduction en chimie organique, mecanismes SN1 et SN2, stereochimie des produits..." class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none mb-4"></textarea>
          <button onclick="startCustomExam()" class="w-full px-6 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            Lancer l'épreuve
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/></svg>
          </button>
          <div class="flex flex-wrap gap-2 mt-4">
            <span class="text-xs text-gray-400">Suggestions :</span>
            <button onclick="fillExamCustomTopic('La mitose et la meiose : phases, regulation et anomalies')" class="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">Mitose & meiose</button>
            <button onclick="fillExamCustomTopic('Pharmacocinetique : absorption, distribution, metabolisme et elimination des medicaments')" class="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">Pharmacocinetique</button>
            <button onclick="fillExamCustomTopic('Le systeme nerveux autonome : sympathique et parasympathique')" class="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">Systeme nerveux</button>
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById('site-footer').style.display = '';
}

/* ========== EVENT BINDINGS ========== */
function bindExamSearchEvents() {
  const searchInput = document.getElementById('exam-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      examState.searchQuery = e.target.value;
      renderExamFichesGrid();
    });
  }
}

/* ========== FICHES GRID ========== */
function getExamFilteredFiches() {
  let fiches = typeof FICHES_DATA !== 'undefined' ? FICHES_DATA : [];
  if (examState.subjectFilter !== 'all') {
    fiches = fiches.filter(f => f.subject === examState.subjectFilter);
  }
  if (examState.searchQuery) {
    const q = examState.searchQuery.toLowerCase();
    fiches = fiches.filter(f =>
      f.title.toLowerCase().includes(q) ||
      f.summary.toLowerCase().includes(q)
    );
  }
  return fiches;
}

function renderExamFichesGrid() {
  const container = document.getElementById('fiches-grid');
  if (!container) return;
  const fiches = getExamFilteredFiches();
  const totalFiches = typeof FICHES_DATA !== 'undefined' ? FICHES_DATA.length : 0;

  // Update counter
  const counterEl = document.getElementById('fiches-counter');
  if (counterEl) {
    if (examState.searchQuery || examState.subjectFilter !== 'all') {
      counterEl.textContent = `${fiches.length} fiche${fiches.length > 1 ? 's' : ''} trouvee${fiches.length > 1 ? 's' : ''} sur ${totalFiches}`;
      counterEl.classList.remove('hidden');
    } else {
      counterEl.classList.add('hidden');
    }
  }

  if (fiches.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
        <p class="text-sm text-gray-400 font-medium">Aucune fiche ne correspond a votre recherche.</p>
      </div>
    `;
    return;
  }

  if (examState.subjectFilter === 'all' && !examState.searchQuery) {
    let html = '';
    SUBJECTS.forEach(s => {
      const subjectFiches = fiches.filter(f => f.subject === s.id);
      if (subjectFiches.length === 0) return;
      const colors = examColors[s.color] || examColors['primary'];
      const icon = examIcons[s.id] || '';
      html += `
        <div class="col-span-full mt-6 first:mt-0">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-8 h-8 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center">
              <svg class="w-4 h-4 ${colors.icon}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">${icon}</svg>
            </div>
            <h3 class="font-bold text-gray-900">${s.name}</h3>
            <span class="text-xs text-gray-400 font-medium">${subjectFiches.length} sujets</span>
          </div>
        </div>
      `;
      html += subjectFiches.map(f => renderExamFicheCard(f)).join('');
    });
    container.innerHTML = html;
  } else {
    container.innerHTML = fiches.map(f => renderExamFicheCard(f)).join('');
  }
}

function renderExamFicheCard(f) {
  const subject = SUBJECTS.find(s => s.id === f.subject);
  const colors = examColors[subject?.color] || examColors['primary'];
  return `
    <button onclick="selectExamFiche('${f.id}')" class="topic-card bg-white rounded-xl p-4 text-left border border-gray-200">
      <div class="flex items-center justify-between mb-2">
        <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded ${colors.badge}">${subject?.name || ''}</span>
        <svg class="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/></svg>
      </div>
      <h4 class="text-sm font-bold text-gray-900 mb-1 leading-snug">${f.title}</h4>
      <p class="text-xs text-gray-500 line-clamp-2">${f.summary}</p>
    </button>
  `;
}

/* ========== FILTER ========== */
function setExamSubjectFilter(subjectId) {
  examState.subjectFilter = subjectId;
  document.querySelectorAll('.filter-pill').forEach(p => {
    const isAll = p.textContent.trim() === 'Toutes';
    const match = (subjectId === 'all' && isAll) || SUBJECTS.find(s => s.id === subjectId && s.name === p.textContent.trim());
    p.classList.toggle('active', !!match);
  });
  renderExamFichesGrid();
}

function fillExamCustomTopic(text) {
  const textarea = document.getElementById('custom-topic');
  if (textarea) textarea.value = text;
}

/* ========== CONFIRMATION MODAL BEFORE START ========== */
function selectExamFiche(ficheId) {
  const fiches = typeof FICHES_DATA !== 'undefined' ? FICHES_DATA : [];
  const fiche = fiches.find(f => f.id === ficheId);
  if (!fiche) return;
  const subject = SUBJECTS.find(s => s.id === fiche.subject);
  pendingFicheTopic = {
    type: 'fiche',
    fiche: {
      subject: fiche.subject,
      subjectName: subject?.name || '',
      title: fiche.title,
      summary: fiche.summary,
      content: fiche.content || '',
    }
  };
  showExamStartConfirmation(fiche, subject);
}

function showExamStartConfirmation(fiche, subject) {
  const colors = examColors[subject?.color] || examColors['primary'];
  const icon = examIcons[subject?.id] || examIcons['anatomie'];
  const modal = document.createElement('div');
  modal.id = 'start-confirm-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" onclick="closeExamStartConfirm()"></div>
    <div class="relative bg-white rounded-2xl border border-gray-200 p-6 max-w-sm w-full shadow-xl confirm-modal-enter">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center">
          <svg class="w-5 h-5 ${colors.icon}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">${icon}</svg>
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-500">${subject?.name || 'Sujet libre'}</p>
          <h3 class="font-bold text-gray-900 text-sm">${fiche.title}</h3>
        </div>
      </div>
      <p class="text-sm text-gray-500 mb-5 leading-relaxed">${fiche.summary}</p>
      <div class="flex items-center justify-between mb-5 px-1">
        <span class="text-sm text-gray-500">Format :</span>
        <span class="font-bold text-gray-900">20 questions &middot; 30 min</span>
      </div>
      <div class="flex gap-3">
        <button onclick="closeExamStartConfirm()" class="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 text-sm hover:border-gray-300 transition-colors">
          Annuler
        </button>
        <button onclick="confirmExamStart()" class="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
          Commencer
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeExamStartConfirm() {
  const modal = document.getElementById('start-confirm-modal');
  if (modal) modal.remove();
}

function confirmExamStart() {
  closeExamStartConfirm();
  if (pendingFicheTopic) launchExam(pendingFicheTopic);
  pendingFicheTopic = null;
}

function startCustomExam() {
  const textarea = document.getElementById('custom-topic');
  if (!textarea || !textarea.value.trim()) {
    textarea?.focus();
    return;
  }
  launchExam({
    type: 'custom',
    topic: textarea.value.trim(),
  });
}

/* ========== MIXED EXAM CONFIRMATION MODAL ========== */
function showMixedExamConfirmation() {
  const subjectsList = SUBJECTS.map(s => {
    const icon = examIcons[s.id] || '';
    const colors = examColors[s.color] || examColors['primary'];
    return `
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center">
          <svg class="w-3.5 h-3.5 ${colors.icon}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">${icon}</svg>
        </div>
        <span class="text-xs font-medium text-gray-700">${s.name}</span>
      </div>
    `;
  }).join('');

  const modal = document.createElement('div');
  modal.id = 'mixed-confirm-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" onclick="closeMixedExamConfirm()"></div>
    <div class="relative bg-white rounded-2xl border border-gray-200 p-6 max-w-sm w-full shadow-xl confirm-modal-enter">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
          <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.996.436-1.75 1.35-1.75 2.514 0 .956.433 1.811 1.114 2.378.06.05.132.076.204.076a.517.517 0 0 0 .391-.177c.204-.23.372-.489.505-.771.132-.283.22-.584.258-.898.04-.313.012-.63-.058-.932A2.45 2.45 0 0 0 5.25 4.236ZM18.75 4.236c.996.436 1.75 1.35 1.75 2.514 0 .956-.433 1.811-1.114 2.378a.351.351 0 0 1-.204.076.517.517 0 0 1-.391-.177 3.076 3.076 0 0 1-.505-.771 3.076 3.076 0 0 1-.258-.898c-.04-.313-.012-.63.058-.932.067-.3.182-.583.33-.84.15-.256.333-.484.334-.35Z"/>
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold text-emerald-600">Épreuve complète</p>
          <h3 class="font-bold text-gray-900 text-sm">Examen complet</h3>
        </div>
      </div>
      <p class="text-sm text-gray-500 mb-4 leading-relaxed">40 questions mélangées couvrant l'ensemble des matières du tronc commun. Conditions proches du concours.</p>

      <div class="grid grid-cols-2 gap-2 mb-4">
        ${subjectsList}
      </div>

      <div class="flex items-center justify-between mb-5 px-1 py-2 bg-emerald-50 rounded-lg">
        <span class="text-sm text-gray-600 ml-2">Format :</span>
        <span class="font-bold text-emerald-700 mr-2">40 questions &middot; 60 min</span>
      </div>
      <div class="flex gap-3">
        <button onclick="closeMixedExamConfirm()" class="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 text-sm hover:border-gray-300 transition-colors">
          Annuler
        </button>
        <button onclick="confirmMixedExamStart()" class="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
          Commencer
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeMixedExamConfirm() {
  const modal = document.getElementById('mixed-confirm-modal');
  if (modal) modal.remove();
}

function confirmMixedExamStart() {
  closeMixedExamConfirm();
  launchExam({ type: 'mixed' });
}

/* ========== LOADING SCREEN ========== */
function renderLoadingScreen(source) {
  let topicTitle = '';
  let subjectName = '';
  let colors = examColors['primary'];

  if (source.type === 'fiche') {
    topicTitle = source.fiche.title;
    subjectName = source.fiche.subjectName || '';
    const subject = SUBJECTS.find(s => s.id === source.fiche.subject);
    colors = examColors[subject?.color] || examColors['primary'];
  } else if (source.type === 'custom') {
    topicTitle = source.topic.length > 60 ? source.topic.substring(0, 57) + '...' : source.topic;
    subjectName = 'Sujet libre';
  } else if (source.type === 'mixed') {
    topicTitle = 'Toutes les matières du tronc commun';
    subjectName = 'Examen complet';
    colors = examColors['emerald'];
  } else if (source.subjectId) {
    const subject = SUBJECTS.find(s => s.id === source.subjectId);
    topicTitle = subject?.name || source.subjectId;
    subjectName = subject?.name || '';
    colors = examColors[subject?.color] || examColors['primary'];
  }

  const app = document.getElementById('examen-app');
  document.getElementById('site-footer').style.display = 'none';

  app.innerHTML = `
    <div class="min-h-screen bg-slate-100 flex items-center justify-center pt-16">
      <div class="max-w-md mx-auto px-4 text-center">
        <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <!-- Animated AI icon -->
          <div class="mb-6">
            <div class="w-20 h-20 mx-auto rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center ai-pulse">
              <svg class="w-10 h-10 ${colors.icon}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"/>
              </svg>
            </div>
          </div>
          <h2 class="text-xl font-black text-gray-900 mb-2">Préparation de l'épreuve...</h2>
          <p class="text-sm text-gray-500 mb-1"><strong>${source.type === 'mixed' ? '40' : '20'} questions</strong> sur :</p>
          <p class="text-sm text-gray-700 font-semibold mb-6">${topicTitle}</p>

          <!-- Progress dots -->
          <div class="flex justify-center gap-2 mb-4" id="loading-dots">
            <span class="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0s"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0.15s"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0.3s"></span>
          </div>

          <p class="text-xs text-gray-400" id="loading-status">Preparation des questions...</p>

          <button onclick="cancelGeneration()" class="mt-6 text-sm text-gray-400 hover:text-gray-600 font-medium">Annuler</button>
        </div>
      </div>
    </div>
    <style>
      .ai-pulse {
        animation: aiPulse 2s ease-in-out infinite;
      }
      @keyframes aiPulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99,102,241,0.3); }
        50% { transform: scale(1.05); box-shadow: 0 0 20px 8px rgba(99,102,241,0.15); }
      }
    </style>
  `;
}

/* ========== ERROR SCREEN ========== */
function renderErrorScreen(source, errorMsg) {
  let topicTitle = '';
  if (source.type === 'fiche') topicTitle = source.fiche.title;
  else if (source.type === 'custom') topicTitle = source.topic.length > 60 ? source.topic.substring(0, 57) + '...' : source.topic;
  else if (source.type === 'mixed') topicTitle = 'Examen complet — Toutes les matières';
  else if (source.subjectId) {
    const subject = SUBJECTS.find(s => s.id === source.subjectId);
    topicTitle = subject?.name || source.subjectId;
  }

  const app = document.getElementById('examen-app');
  document.getElementById('site-footer').style.display = '';

  app.innerHTML = `
    <div class="min-h-screen bg-slate-100 flex items-center justify-center pt-16">
      <div class="max-w-md mx-auto px-4 text-center">
        <div class="bg-white rounded-2xl border border-red-200 p-8 shadow-sm">
          <div class="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
            </svg>
          </div>
          <h2 class="text-xl font-black text-gray-900 mb-2">Erreur de generation</h2>
          <p class="text-sm text-gray-500 mb-4">Impossible de générer les questions pour <strong>${topicTitle}</strong></p>
          <div class="bg-red-50 rounded-lg p-3 mb-6">
            <p class="text-xs text-red-600 font-mono break-all">${errorMsg}</p>
          </div>
          <div class="flex flex-col gap-2">
            <button onclick="launchExam(examState.selectedTopic)" class="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
              Reessayer
            </button>
            <button onclick="transitionView(() => renderHero())" class="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors">
              Retour a l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ========== LAUNCH EXAM ========== */
async function launchExam(source) {
  if (examState.isGenerating) return;
  examState.isGenerating = true;
  examState.selectedTopic = source;

  // Determine subject for stats
  if (source.type === 'fiche') {
    examState.selectedSubject = source.fiche.subject;
    examState.examDuration = 30;
  } else if (source.type === 'custom') {
    examState.selectedSubject = 'custom';
    examState.examDuration = 30;
  } else if (source.type === 'mixed') {
    examState.selectedSubject = 'mixed';
    examState.examDuration = 60;
  } else if (source.subjectId) {
    examState.selectedSubject = source.subjectId;
    examState.examDuration = 30;
  }

  renderLoadingScreen(source);

  // Update loading status
  const statusEl = () => document.getElementById('loading-status');
  setTimeout(() => { if (statusEl()) statusEl().textContent = 'Analyse du programme...'; }, 2000);
  setTimeout(() => { if (statusEl()) statusEl().textContent = 'Redaction des questions...'; }, 5000);
  setTimeout(() => { if (statusEl()) statusEl().textContent = 'Verification des reponses...'; }, 10000);
  setTimeout(() => { if (statusEl()) statusEl().textContent = 'Finalisation de l\'épreuve...'; }, 15000);

  try {
    const questions = await generateExamQuestions(source);

    // Check if user cancelled during generation
    if (!examState.isGenerating) return;

    examState.questions = questions;
    examState.answers = new Array(questions.length).fill(null);
    examState.currentQ = 0;
    examState.timerSeconds = examState.examDuration * 60;
    examState.startTime = Date.now();
    examState.currentView = 'exam';
    examState.isGenerating = false;

    startCountdown();
    renderExamQuestion();
  } catch (error) {
    console.error('Erreur generation IA:', error);
    examState.isGenerating = false;
    renderErrorScreen(source, error.message);
  }
}

function cancelGeneration() {
  examState.isGenerating = false;
  transitionView(() => renderHero());
}

/* ========== COUNTDOWN TIMER ========== */
function startCountdown() {
  if (examState.timerInterval) clearInterval(examState.timerInterval);
  examState.timerInterval = setInterval(() => {
    examState.timerSeconds--;
    updateTimerDisplay();
    if (examState.timerSeconds <= 0) {
      clearInterval(examState.timerInterval);
      finishExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('countdown-display');
  if (!el) return;
  const m = Math.floor(examState.timerSeconds / 60);
  const s = examState.timerSeconds % 60;
  el.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  if (examState.timerSeconds <= 300) {
    el.classList.add('timer-warning', 'text-red-600');
  } else {
    el.classList.remove('timer-warning', 'text-red-600');
  }
}

/* ========== RENDER EXAM QUESTION ========== */
function renderExamQuestion() {
  const q = examState.questions[examState.currentQ];
  const total = examState.questions.length;
  const answered = examState.answers.filter(a => a !== null).length;
  const app = document.getElementById('examen-app');

  // Get topic name for badge
  let badgeText = '';
  if (examState.selectedTopic?.type === 'fiche') {
    const subject = SUBJECTS.find(s => s.id === examState.selectedTopic.fiche.subject);
    badgeText = subject?.name || '';
  } else if (examState.selectedTopic?.type === 'custom') {
    badgeText = 'Sujet libre';
  } else if (examState.selectedTopic?.type === 'mixed') {
    badgeText = 'Examen complet';
  } else if (examState.selectedTopic?.subjectId) {
    const subject = SUBJECTS.find(s => s.id === examState.selectedTopic.subjectId);
    badgeText = subject?.name || '';
  }

  app.innerHTML = `
    <div class="min-h-screen bg-slate-100 pt-20 pb-8">
      <div class="max-w-3xl mx-auto px-4">
        <!-- Top bar -->
        <div class="flex items-center justify-between mb-4">
          <button onclick="quitExam()" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 font-medium">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
            Quitter
          </button>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
              <span class="text-sm font-mono font-bold text-gray-700" id="countdown-display"></span>
            </div>
            <span class="text-sm font-semibold text-gray-500">${answered}/${total}</span>
          </div>
        </div>

        <!-- Question pills -->
        <div class="flex flex-wrap gap-1.5 mb-5 justify-center">
          ${examState.questions.map((_, i) => {
            let cls = 'unanswered';
            if (i === examState.currentQ) cls = 'current';
            else if (examState.answers[i] !== null) cls = 'answered';
            return `<button onclick="goToQuestion(${i})" class="pill-btn ${cls} w-8 h-8 rounded-lg text-xs font-bold">${i + 1}</button>`;
          }).join('')}
        </div>

        <!-- Question card -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <span class="text-sm font-medium text-gray-500">Question ${examState.currentQ + 1}/${total}</span>
            <span class="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">${badgeText}</span>
          </div>
          <p class="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-relaxed">${q.question}</p>
          <div class="space-y-3 mb-6">
            ${q.options.map((opt, i) => {
              const selected = examState.answers[examState.currentQ] === i;
              return `
              <button onclick="selectExamOption(${i})" class="quiz-option-btn ${selected ? 'selected' : ''} w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 text-sm md:text-base font-medium text-gray-700 flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg ${selected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'} flex items-center justify-center text-sm font-bold shrink-0">${String.fromCharCode(65 + i)}</span>
                ${opt.text}
              </button>`;
            }).join('')}
          </div>

          <!-- Nav buttons -->
          <div class="flex items-center justify-between gap-3">
            <button onclick="prevQuestion()" class="px-5 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors text-sm ${examState.currentQ === 0 ? 'invisible' : ''}" ${examState.currentQ === 0 ? 'disabled' : ''}>
              Precedent
            </button>
            ${examState.currentQ === total - 1 ? `
              <button onclick="confirmFinish()" class="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors text-sm flex items-center gap-2">
                Terminer l'épreuve
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
              </button>
            ` : `
              <button onclick="nextExamQuestion()" class="px-5 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm flex items-center gap-2">
                Suivante
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
  updateTimerDisplay();
}

/* ========== EXAM INTERACTIONS ========== */
function selectExamOption(index) {
  examState.answers[examState.currentQ] = index;
  renderExamQuestion();
}

function goToQuestion(index) {
  examState.currentQ = index;
  renderExamQuestion();
}

function prevQuestion() {
  if (examState.currentQ > 0) { examState.currentQ--; renderExamQuestion(); }
}

function nextExamQuestion() {
  if (examState.currentQ < examState.questions.length - 1) { examState.currentQ++; renderExamQuestion(); }
}

function confirmFinish() {
  const unanswered = examState.answers.filter(a => a === null).length;
  if (unanswered > 0) {
    if (!confirm(`Vous avez ${unanswered} question${unanswered > 1 ? 's' : ''} sans reponse. Terminer quand meme ?`)) return;
  }
  finishExam();
}

function quitExam() {
  if (confirm('Quitter l\'épreuve ? Votre progression sera perdue.')) {
    clearInterval(examState.timerInterval);
    transitionView(() => renderHero());
  }
}

/* ========== FINISH & RESULTS ========== */
function finishExam() {
  clearInterval(examState.timerInterval);
  examState.currentView = 'results';
  const elapsed = Math.round((Date.now() - examState.startTime) / 1000);

  // Determine subject info for display
  let subjectName = '';
  let subjectId = examState.selectedSubject;
  if (examState.selectedTopic?.type === 'fiche') {
    subjectName = examState.selectedTopic.fiche.subjectName || '';
    subjectId = examState.selectedTopic.fiche.subject;
  } else if (examState.selectedTopic?.type === 'custom') {
    subjectName = 'Sujet libre';
    subjectId = 'custom';
  } else if (examState.selectedTopic?.type === 'mixed') {
    subjectName = 'Examen complet';
    subjectId = 'mixed';
  } else if (examState.selectedTopic?.subjectId) {
    const subject = SUBJECTS.find(s => s.id === examState.selectedTopic.subjectId);
    subjectName = subject?.name || '';
  }

  let correct = 0;
  const details = examState.questions.map((q, i) => {
    const sel = examState.answers[i];
    const correctIdx = q.options.findIndex(o => o.correct);
    const isCorrect = sel === correctIdx;
    if (isCorrect) correct++;
    return { question: q, selected: sel, correctIndex: correctIdx, isCorrect };
  });

  const pct = Math.round((correct / examState.questions.length) * 100);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  saveExamSession({
    subject: subjectId,
    subjectName: subjectName,
    correct,
    total: examState.questions.length,
    percentage: pct,
    duration: elapsed,
    date: new Date().toISOString(),
  });

  const circumference = 2 * Math.PI * 56;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

  document.getElementById('site-footer').style.display = '';
  const app = document.getElementById('examen-app');
  app.innerHTML = `
    <section class="py-24 md:py-28">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-2">Résultats de l'épreuve</h2>
          <p class="text-gray-500">${subjectName} — Mode Examen</p>
        </div>

        <div class="flex justify-center mb-8">
          <div class="score-circle">
            <svg width="140" height="140">
              <circle cx="70" cy="70" r="56" fill="none" class="score-circle-bg" stroke-width="12"/>
              <circle cx="70" cy="70" r="56" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"
                stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" class="score-circle-fill"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-black" style="color:${color}">${pct}%</span>
              <span class="text-xs text-gray-500">${correct}/${examState.questions.length}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-4 mb-8">
          <div class="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p class="text-base font-bold text-gray-900">${subjectName}</p>
            <p class="text-xs text-gray-500">Matière</p>
          </div>
          <div class="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p class="text-base font-bold text-gray-900">${minutes}m ${seconds.toString().padStart(2, '0')}s</p>
            <p class="text-xs text-gray-500">Duree</p>
          </div>
          <div class="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p class="text-base font-bold text-gray-900">${examState.questions.length - examState.answers.filter(a => a === null).length}/${examState.questions.length}</p>
            <p class="text-xs text-gray-500">Repondues</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 class="font-bold text-gray-900 mb-5 text-lg">Correction détaillée</h3>
          <div class="space-y-4">
            ${details.map((d, i) => `
              <div class="p-4 rounded-xl border ${d.isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}">
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full ${d.isCorrect ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center shrink-0 mt-0.5">
                    ${d.isCorrect
                      ? '<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>'
                      : '<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>'}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-gray-900">Q${i + 1}. ${d.question.question}</p>
                    ${d.selected !== null ? `
                      <p class="text-xs mt-1 ${d.isCorrect ? 'text-green-700' : 'text-red-700'}">
                        Votre reponse : <strong>${d.question.options[d.selected].text}</strong>
                        ${!d.isCorrect ? ` — Bonne reponse : <strong>${d.question.options[d.correctIndex].text}</strong>` : ''}
                      </p>
                    ` : `<p class="text-xs mt-1 text-gray-500">Non repondue — Bonne reponse : <strong>${d.question.options[d.correctIndex].text}</strong></p>`}
                    <p class="text-xs text-gray-600 mt-2 leading-relaxed">${d.question.explanation}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button onclick="transitionView(() => renderModeChoice())" class="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>
            Nouvelle épreuve
          </button>
          <button onclick="transitionView(() => renderHero())" class="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors">
            Retour a l'accueil
          </button>
        </div>
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', initExamen);
