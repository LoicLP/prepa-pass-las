/* ===== QCM ENGINE — QUESTIONS ILLIMITÉES — UX AMÉLIORÉE ===== */

/* ========== CLÉ API GEMINI ========== */
const GEMINI_API_KEY = 'VOTRE_CLE_API_ICI';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/* ========== STATE ========== */
let qcmState = {
  currentView: 'hero',
  questionCount: 10,
  subjectFilter: 'all',
  searchQuery: '',
  selectedTopic: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  answers: [],
  selectedAnswer: null,
  isValidated: false,
  timerInterval: null,
  timerSeconds: 0,
  isGenerating: false,
  streak: 0,
  maxStreak: 0,
};

let pendingFicheTopic = null;

/* ========== SUBJECT CONFIG ========== */
const qcmColors = {
  'indigo': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700', icon: 'text-indigo-500', ring: 'ring-indigo-200' },
  'primary': { bg: 'bg-primary-50', border: 'border-primary-200', text: 'text-primary-700', badge: 'bg-primary-100 text-primary-700', icon: 'text-primary-500', ring: 'ring-primary-200' },
  'emerald': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-500', ring: 'ring-emerald-200' },
  'violet': { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700', icon: 'text-violet-500', ring: 'ring-violet-200' },
  'cyan': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700', icon: 'text-cyan-500', ring: 'ring-cyan-200' },
  'amber': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500', ring: 'ring-amber-200' },
  'rose': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700', icon: 'text-rose-500', ring: 'ring-rose-200' },
};

const qcmIcons = {
  'anatomie': '<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>',
  'chimie': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
  'biocell': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"/>',
  'biostats': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>',
  'biophysique': '<path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"/>',
  'ssh': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>',
};

const qcmSubjectPrompts = {
  'anatomie': "Anatomie humaine pour PASS/LAS : anatomie descriptive, topographique et fonctionnelle (ostéologie, myologie, angiologie, neuroanatomie, splanchnologie). Inclure les rapports anatomiques, les innervations, les vascularisations.",
  'chimie': "Chimie générale, chimie organique et Biochimie pour PASS/LAS : atomistique, liaisons chimiques, thermodynamique, cinétique, stéréochimie, réactions organiques, enzymologie, métabolisme, biochimie structurale.",
  'biocell': "Biologie cellulaire et moléculaire pour PASS/LAS : structure cellulaire, communication cellulaire, cycle cellulaire, génétique moléculaire, techniques de biologie moléculaire.",
  'biostats': "Biostatistiques et épidémiologie pour PASS/LAS : statistiques descriptives, probabilités, lois de distribution, tests d'hypothèses, intervalles de confiance, mesures épidémiologiques, essais cliniques, régression.",
  'biophysique': "Biophysique pour PASS/LAS : optique, ondes, radioactivité, imagerie médicale, pH et solutions tampons, RMN, potentiels membranaires, électrophysiologie, dosimétrie.",
  'ssh': "Sciences Humaines et Sociales / Éthique médicale pour PASS/LAS : éthique médicale, droit de la santé, bioéthique, histoire de la médecine, philosophie des sciences, sociologie de la santé, système de santé français.",
};

/* ========== STATS ========== */
function getQcmStats() {
  try { return JSON.parse(localStorage.getItem('prepa-qcm-stats')) || { sessions: [] }; }
  catch { return { sessions: [] }; }
}

function saveQcmSession(session) {
  const stats = getQcmStats();
  stats.sessions.unshift(session);
  if (stats.sessions.length > 50) stats.sessions = stats.sessions.slice(0, 50);
  localStorage.setItem('prepa-qcm-stats', JSON.stringify(stats));
}

/* ========== VIEW TRANSITION HELPER ========== */
function transitionView(renderFn) {
  const app = document.getElementById('qcm-app');
  app.classList.add('qcm-view-exit');
  setTimeout(() => {
    renderFn();
    app.classList.remove('qcm-view-exit');
    app.classList.add('qcm-view-enter');
    requestAnimationFrame(() => {
      setTimeout(() => app.classList.remove('qcm-view-enter'), 400);
    });
  }, 250);
}

/* ========== AI QUESTION GENERATION ========== */
async function generateQcmQuestions(topic, count) {
  let prompt;

  if (topic.type === 'fiche') {
    const subjectContext = qcmSubjectPrompts[topic.subject] || '';
    prompt = `Tu es un professeur d'université spécialisé en ${topic.subjectName || ''} pour les concours PASS/LAS (Parcours Accès Santé Spécifique / Licence Accès Santé) en France.

Génère exactement ${count} questions QCM de niveau concours PASS/LAS sur le sujet suivant :
**${topic.title}**
${topic.summary || ''}

Contexte de la matière : ${subjectContext}

CONSIGNES STRICTES :
- Chaque question doit avoir exactement 4 options de réponse
- Une seule bonne réponse par question
- Les questions doivent être de niveau universitaire première année de médecine
- Inclure des pièges classiques des concours (formulations ambiguës, confusions courantes)
- Les explications doivent être détaillées, pédagogiques et scientifiquement rigoureuses
- Les distracteurs (mauvaises réponses) doivent être plausibles
- Varier la difficulté

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

IMPORTANT : Exactement ${count} questions, chaque question avec exactement 4 options dont une seule correcte. JSON valide uniquement.`;
  } else {
    prompt = `Tu es un professeur d'université expert pour les concours PASS/LAS (Parcours Accès Santé Spécifique / Licence Accès Santé) en France.

Génère exactement ${count} questions QCM de niveau concours PASS/LAS sur le sujet suivant :
${topic.customText}

CONSIGNES STRICTES :
- Chaque question doit avoir exactement 4 options de réponse
- Une seule bonne réponse par question
- Les questions doivent être de niveau universitaire première année de médecine
- Inclure des pièges classiques des concours (formulations ambiguës, confusions courantes)
- Les explications doivent être détaillées, pédagogiques et scientifiquement rigoureuses
- Les distracteurs (mauvaises réponses) doivent être plausibles
- Varier la difficulté

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

IMPORTANT : Exactement ${count} questions, chaque question avec exactement 4 options dont une seule correcte. JSON valide uniquement.`;
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 16384,
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Erreur serveur (${response.status})`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Réponse vide du serveur');

  let questions;
  try {
    questions = JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      questions = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Format de réponse invalide');
    }
  }

  if (!Array.isArray(questions) || questions.length < Math.min(count, 3)) {
    throw new Error(`Nombre insuffisant de questions (${questions?.length || 0})`);
  }

  const validated = questions.slice(0, count).filter(q => {
    return q.question &&
           Array.isArray(q.options) &&
           q.options.length === 4 &&
           q.options.filter(o => o.correct).length === 1 &&
           q.explanation;
  });

  if (validated.length < Math.min(count, 3)) {
    throw new Error(`Trop peu de questions valides (${validated.length}/${count})`);
  }

  return validated;
}

/* ========== INIT ========== */
function initQCM() {
  renderHero();
}

/* ========== STEP 1 : HERO ========== */
function renderHero() {
  qcmState.currentView = 'hero';
  qcmState.isGenerating = false;
  qcmState.selectedAnswer = null;
  qcmState.isValidated = false;
  document.removeEventListener('keydown', handleQuizKeydown);
  const app = document.getElementById('qcm-app');
  const stats = getQcmStats();
  const totalDone = stats.sessions.length;
  const avgScore = totalDone > 0 ? Math.round(stats.sessions.reduce((a, s) => a + s.percentage, 0) / totalDone) : 0;
  const fichesCount = typeof FICHES_DATA !== 'undefined' ? FICHES_DATA.length : 150;

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
              QCM <span class="qcm-gradient-text">illimités</span>
            </h1>
            <p class="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
              Entraînez-vous avec des QCM générés sur mesure parmi nos <strong class="text-gray-900">${fichesCount} fiches</strong> ou sur votre propre thème. <strong class="text-gray-900">Correction immédiate</strong> avec explications détaillées.
            </p>
            <!-- Stats row -->
            <div class="flex flex-wrap items-center gap-5 sm:gap-6 mb-8">
              <div class="qcm-stat flex items-center gap-3">
                <div class="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>
                </div>
                <div>
                  <div class="text-xl font-black text-gray-900">&infin;</div>
                  <div class="text-xs font-medium text-gray-500">Questions</div>
                </div>
              </div>
              <div class="w-px h-10 bg-gray-200/60 hidden sm:block"></div>
              <div class="qcm-stat flex items-center gap-3">
                <div class="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                </div>
                <div>
                  <div class="text-xl font-black text-gray-900">Direct</div>
                  <div class="text-xs font-medium text-gray-500">Correction</div>
                </div>
              </div>
              <div class="w-px h-10 bg-gray-200/60 hidden sm:block"></div>
              <div class="qcm-stat flex items-center gap-3">
                <div class="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/></svg>
                </div>
                <div>
                  <div class="text-xl font-black text-gray-900">${fichesCount}</div>
                  <div class="text-xs font-medium text-gray-500">Sujets</div>
                </div>
              </div>
            </div>
            <!-- CTA Button -->
            <button onclick="transitionView(() => renderModeChoice())" class="group px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 flex items-center gap-3 text-lg">
              Commencer un QCM
              <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
            </button>
          </div>
          <!-- Right: Mock QCM card -->
          <div class="flex justify-center lg:justify-end">
            <div class="w-full max-w-sm">
              <div class="qcm-float bg-white rounded-2xl shadow-xl shadow-primary-500/10 border border-gray-100 p-5 mb-4">
                <div class="flex items-center justify-between mb-3">
                  <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Chimie / Biochimie</span>
                  <span class="text-xs font-mono font-semibold text-gray-400">Q3/10</span>
                </div>
                <div class="w-full h-1.5 bg-gray-100 rounded-full mb-3">
                  <div class="h-1.5 bg-primary-500 rounded-full" style="width:30%"></div>
                </div>
                <p class="text-sm font-bold text-gray-900 mb-3">Quel est le bilan net en ATP de la glycolyse ?</p>
                <div class="space-y-1.5">
                  <div class="px-3 py-2 rounded-lg border border-gray-200 text-[11px] font-medium text-gray-500 flex items-center gap-2">
                    <span class="w-4 h-4 rounded bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500">A</span>4 ATP
                  </div>
                  <div class="px-3 py-2 rounded-lg border-2 border-emerald-400 bg-emerald-50 text-[11px] font-medium text-emerald-700 flex items-center gap-2">
                    <span class="w-4 h-4 rounded bg-emerald-100 flex items-center justify-center text-[9px] font-bold text-emerald-700">B</span>2 ATP
                    <svg class="w-3 h-3 ml-auto text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                  </div>
                  <div class="px-3 py-2 rounded-lg border-2 border-red-300 bg-red-50 text-[11px] font-medium text-red-600 flex items-center gap-2">
                    <span class="w-4 h-4 rounded bg-red-100 flex items-center justify-center text-[9px] font-bold text-red-600">C</span>36 ATP
                    <svg class="w-3 h-3 ml-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
                  </div>
                </div>
                <div class="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p class="text-[10px] text-emerald-700 leading-relaxed"><strong>Bonne réponse !</strong> La glycolyse produit 4 ATP bruts mais en consomme 2, soit un bilan net de 2 ATP...</p>
                </div>
              </div>
              ${totalDone > 0 ? `
              <div class="qcm-float qcm-float-delay bg-white rounded-2xl shadow-lg shadow-primary-500/5 border border-gray-100 p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900">${totalDone} session${totalDone > 1 ? 's' : ''}</p>
                      <p class="text-xs text-gray-500">Score moyen : <strong class="${avgScore >= 70 ? 'text-emerald-600' : avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}">${avgScore}%</strong></p>
                    </div>
                  </div>
                </div>
              </div>` : `
              <div class="qcm-float qcm-float-delay bg-gradient-to-br from-primary-600 to-violet-600 rounded-2xl shadow-lg shadow-primary-500/20 p-4 text-white">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-bold">Correction immédiate</p>
                    <p class="text-xs text-white/70">Explications détaillées après chaque question</p>
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
  qcmState.currentView = 'choice';
  const app = document.getElementById('qcm-app');
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
            <span class="text-sm font-semibold text-primary-700">Nouveau QCM</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-3">Comment souhaitez-vous réviser ?</h2>
          <p class="text-gray-500 text-base max-w-lg mx-auto">Choisissez votre mode de révision pour commencer.</p>
        </div>

        <!-- Two choice cards -->
        <div class="grid md:grid-cols-2 gap-5 mb-8">
          <!-- Card 1: Nos sujets -->
          <button onclick="transitionView(() => renderFichesSelection())" class="mode-card group bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10 transition-all">
            <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/></svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">À partir de nos fiches</h3>
            <p class="text-sm text-gray-500 leading-relaxed mb-4">Générez un QCM à partir de nos fiches de révision et de nos cours, classés par matière.</p>
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>
                ${fichesCount} fiches disponibles
              </span>
              <svg class="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
            </div>
          </button>

          <!-- Card 2: Sujet libre -->
          <button onclick="transitionView(() => renderCustomSelection())" class="mode-card group bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10 transition-all">
            <div class="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/></svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">À partir d'un sujet libre</h3>
            <p class="text-sm text-gray-500 leading-relaxed mb-4">Générez un QCM à partir de votre propre thème, sur mesure pour vos révisions.</p>
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>
                Thème libre
              </span>
              <svg class="w-5 h-5 text-gray-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
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
  qcmState.currentView = 'fiches';
  const app = document.getElementById('qcm-app');

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
          <p class="text-gray-500 text-base max-w-lg mx-auto">Sélectionnez un sujet parmi nos fiches de révision et nos cours pour générer votre QCM.</p>
        </div>

        <!-- Question count -->
        <div class="bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl border-2 border-primary-200 p-6 mb-8 max-w-lg mx-auto relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-primary-100/50 rounded-full -translate-y-8 translate-x-8 pointer-events-none"></div>
          <div class="relative">
            <div class="flex items-center gap-3 mb-1">
              <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"/></svg>
              </div>
              <div>
                <p class="text-base font-bold text-gray-900">Combien de questions ?</p>
              </div>
            </div>
            <p class="text-xs text-gray-500 mb-4 ml-[52px]">Sélectionnez le nombre de questions pour votre QCM</p>
            <div class="flex flex-wrap gap-2.5">
              ${[5, 10, 15, 20, 30, 50].map(n => `
                <button onclick="setQuestionCount(${n})" data-count="${n}" class="count-pill flex-1 min-w-[56px] py-3 rounded-xl text-sm font-bold border-2 border-white bg-white text-gray-600 shadow-sm hover:border-primary-300 ${n === qcmState.questionCount ? 'active' : ''}">${n}</button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Search + filters -->
        <div class="max-w-5xl mx-auto mb-6">
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div class="relative flex-1 w-full">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
              <input type="text" id="qcm-search" placeholder="Rechercher un sujet..." class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" value="${qcmState.searchQuery}">
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mt-3">
            <button onclick="setSubjectFilter('all')" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 ${qcmState.subjectFilter === 'all' ? 'active' : ''}">Toutes</button>
            ${SUBJECTS.map(s => `
              <button onclick="setSubjectFilter('${s.id}')" class="filter-pill px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 ${qcmState.subjectFilter === s.id ? 'active' : ''}">${s.name}</button>
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
  renderFichesGrid();
  bindQcmEvents();
}

/* ========== STEP 3b : CUSTOM SELECTION ========== */
function renderCustomSelection() {
  qcmState.currentView = 'custom';
  const app = document.getElementById('qcm-app');

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
          <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-2">Sujet personnalisé</h2>
          <p class="text-gray-500 text-base max-w-lg mx-auto">Décrivez votre thème de révision et générez un QCM sur mesure.</p>
        </div>

        <!-- Question count -->
        <div class="bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl border-2 border-primary-200 p-6 mb-8 max-w-lg mx-auto relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-primary-100/50 rounded-full -translate-y-8 translate-x-8 pointer-events-none"></div>
          <div class="relative">
            <div class="flex items-center gap-3 mb-1">
              <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"/></svg>
              </div>
              <div>
                <p class="text-base font-bold text-gray-900">Combien de questions ?</p>
              </div>
            </div>
            <p class="text-xs text-gray-500 mb-4 ml-[52px]">Sélectionnez le nombre de questions pour votre QCM</p>
            <div class="flex flex-wrap gap-2.5">
              ${[5, 10, 15, 20, 30, 50].map(n => `
                <button onclick="setQuestionCount(${n})" data-count="${n}" class="count-pill flex-1 min-w-[56px] py-3 rounded-xl text-sm font-bold border-2 border-white bg-white text-gray-600 shadow-sm hover:border-primary-300 ${n === qcmState.questionCount ? 'active' : ''}">${n}</button>
              `).join('')}
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
              <p class="text-xs text-gray-500">Soyez précis pour des questions de meilleure qualité</p>
            </div>
          </div>
          <textarea id="custom-topic" rows="4" placeholder="Ex: Les réactions d'oxydoréduction en chimie organique, mécanismes SN1 et SN2, stéréochimie des produits..." class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none mb-4"></textarea>
          <button onclick="startCustomQuiz()" class="w-full px-6 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            Lancer le QCM
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/></svg>
          </button>
          <div class="flex flex-wrap gap-2 mt-4">
            <span class="text-xs text-gray-400">Suggestions :</span>
            <button onclick="fillCustomTopic('La mitose et la méiose : phases, régulation et anomalies')" class="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">Mitose & méiose</button>
            <button onclick="fillCustomTopic('Pharmacocinétique : absorption, distribution, métabolisme et élimination des médicaments')" class="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">Pharmacocinétique</button>
            <button onclick="fillCustomTopic('Le système nerveux autonome : sympathique et parasympathique')" class="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">Système nerveux</button>
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById('site-footer').style.display = '';
}

/* ========== EVENT BINDINGS ========== */
function bindQcmEvents() {
  const searchInput = document.getElementById('qcm-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      qcmState.searchQuery = e.target.value;
      renderFichesGrid();
    });
  }
}

/* ========== FICHES GRID ========== */
function getFilteredFiches() {
  let fiches = typeof FICHES_DATA !== 'undefined' ? FICHES_DATA : [];
  if (qcmState.subjectFilter !== 'all') {
    fiches = fiches.filter(f => f.subject === qcmState.subjectFilter);
  }
  if (qcmState.searchQuery) {
    const q = qcmState.searchQuery.toLowerCase();
    fiches = fiches.filter(f =>
      f.title.toLowerCase().includes(q) ||
      f.summary.toLowerCase().includes(q)
    );
  }
  return fiches;
}

function renderFichesGrid() {
  const container = document.getElementById('fiches-grid');
  if (!container) return;
  const fiches = getFilteredFiches();
  const totalFiches = typeof FICHES_DATA !== 'undefined' ? FICHES_DATA.length : 0;

  // Update counter
  const counterEl = document.getElementById('fiches-counter');
  if (counterEl) {
    if (qcmState.searchQuery || qcmState.subjectFilter !== 'all') {
      counterEl.textContent = `${fiches.length} fiche${fiches.length > 1 ? 's' : ''} trouvée${fiches.length > 1 ? 's' : ''} sur ${totalFiches}`;
      counterEl.classList.remove('hidden');
    } else {
      counterEl.classList.add('hidden');
    }
  }

  if (fiches.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
        <p class="text-sm text-gray-400 font-medium">Aucune fiche ne correspond à votre recherche.</p>
      </div>
    `;
    return;
  }

  if (qcmState.subjectFilter === 'all' && !qcmState.searchQuery) {
    let html = '';
    SUBJECTS.forEach(s => {
      const subjectFiches = fiches.filter(f => f.subject === s.id);
      if (subjectFiches.length === 0) return;
      const colors = qcmColors[s.color] || qcmColors['primary'];
      const icon = qcmIcons[s.id] || '';
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
      html += subjectFiches.map(f => renderFicheCard(f)).join('');
    });
    container.innerHTML = html;
  } else {
    container.innerHTML = fiches.map(f => renderFicheCard(f)).join('');
  }
}

function renderFicheCard(f) {
  const subject = SUBJECTS.find(s => s.id === f.subject);
  const colors = qcmColors[subject?.color] || qcmColors['primary'];
  return `
    <button onclick="selectFiche('${f.id}')" class="topic-card bg-white rounded-xl p-4 text-left border border-gray-200">
      <div class="flex items-center justify-between mb-2">
        <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded ${colors.badge}">${subject?.name || ''}</span>
        <svg class="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/></svg>
      </div>
      <h4 class="text-sm font-bold text-gray-900 mb-1 leading-snug">${f.title}</h4>
      <p class="text-xs text-gray-500 line-clamp-2">${f.summary}</p>
    </button>
  `;
}

/* ========== FILTER / COUNT ========== */
function setSubjectFilter(subjectId) {
  qcmState.subjectFilter = subjectId;
  document.querySelectorAll('.filter-pill').forEach(p => {
    const isAll = p.textContent.trim() === 'Toutes';
    const match = (subjectId === 'all' && isAll) || SUBJECTS.find(s => s.id === subjectId && s.name === p.textContent.trim());
    p.classList.toggle('active', !!match);
  });
  renderFichesGrid();
}

function setQuestionCount(count) {
  qcmState.questionCount = count;
  document.querySelectorAll('.count-pill').forEach(p => {
    p.classList.toggle('active', parseInt(p.dataset.count) === count);
  });
}

function fillCustomTopic(text) {
  const textarea = document.getElementById('custom-topic');
  if (textarea) textarea.value = text;
}

/* ========== CONFIRMATION MODAL BEFORE START ========== */
function selectFiche(ficheId) {
  const fiches = typeof FICHES_DATA !== 'undefined' ? FICHES_DATA : [];
  const fiche = fiches.find(f => f.id === ficheId);
  if (!fiche) return;
  const subject = SUBJECTS.find(s => s.id === fiche.subject);
  pendingFicheTopic = {
    type: 'fiche',
    subject: fiche.subject,
    subjectName: subject?.name || '',
    title: fiche.title,
    summary: fiche.summary,
  };
  showStartConfirmation(fiche, subject);
}

function showStartConfirmation(fiche, subject) {
  const colors = qcmColors[subject?.color] || qcmColors['primary'];
  const icon = qcmIcons[subject?.id] || qcmIcons['anatomie'];
  const modal = document.createElement('div');
  modal.id = 'start-confirm-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" onclick="closeStartConfirm()"></div>
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
        <span class="text-sm text-gray-500">Questions :</span>
        <span class="font-bold text-gray-900">${qcmState.questionCount}</span>
      </div>
      <div class="flex gap-3">
        <button onclick="closeStartConfirm()" class="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 text-sm hover:border-gray-300 transition-colors">
          Annuler
        </button>
        <button onclick="confirmStart()" class="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
          Commencer
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeStartConfirm() {
  const modal = document.getElementById('start-confirm-modal');
  if (modal) modal.remove();
}

function confirmStart() {
  closeStartConfirm();
  if (pendingFicheTopic) startQuiz(pendingFicheTopic);
  pendingFicheTopic = null;
}

function startCustomQuiz() {
  const textarea = document.getElementById('custom-topic');
  if (!textarea || !textarea.value.trim()) {
    textarea?.focus();
    return;
  }
  startQuiz({
    type: 'custom',
    subject: null,
    subjectName: 'Sujet libre',
    title: textarea.value.trim().length > 60 ? textarea.value.trim().substring(0, 57) + '...' : textarea.value.trim(),
    customText: textarea.value.trim(),
  });
}

/* ========== START QUIZ ========== */
async function startQuiz(topic) {
  if (qcmState.isGenerating) return;
  qcmState.isGenerating = true;
  qcmState.selectedTopic = topic;

  renderLoadingScreen(topic);

  const statusEl = () => document.getElementById('loading-status');
  setTimeout(() => { if (statusEl()) statusEl().textContent = 'Sélection des thèmes...'; }, 2000);
  setTimeout(() => { if (statusEl()) statusEl().textContent = 'Rédaction des questions...'; }, 5000);
  setTimeout(() => { if (statusEl()) statusEl().textContent = 'Vérification des réponses...'; }, 10000);
  setTimeout(() => { if (statusEl()) statusEl().textContent = 'Finalisation...'; }, 15000);

  try {
    const questions = await generateQcmQuestions(topic, qcmState.questionCount);
    if (!qcmState.isGenerating) return;

    qcmState.questions = questions;
    qcmState.currentIndex = 0;
    qcmState.score = 0;
    qcmState.answers = new Array(questions.length).fill(null);
    qcmState.selectedAnswer = null;
    qcmState.isValidated = false;
    qcmState.timerSeconds = 0;
    qcmState.streak = 0;
    qcmState.maxStreak = 0;
    qcmState.currentView = 'quiz';
    qcmState.isGenerating = false;

    document.addEventListener('keydown', handleQuizKeydown);
    startQcmTimer();
    transitionView(() => renderQuestion());
  } catch (error) {
    console.error('Erreur génération:', error);
    qcmState.isGenerating = false;
    renderErrorScreen(topic, error.message);
  }
}

function cancelGeneration() {
  qcmState.isGenerating = false;
  transitionView(() => renderHero());
}

/* ========== LOADING SCREEN ========== */
function renderLoadingScreen(topic) {
  const subject = topic.subject ? SUBJECTS.find(s => s.id === topic.subject) : null;
  const colors = qcmColors[subject?.color] || qcmColors['primary'];
  const app = document.getElementById('qcm-app');
  document.getElementById('site-footer').style.display = 'none';

  app.innerHTML = `
    <div class="min-h-screen bg-slate-100 flex items-center justify-center pt-16">
      <div class="max-w-md mx-auto px-4 text-center">
        <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div class="mb-6">
            <div class="w-20 h-20 mx-auto rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center loading-pulse">
              <svg class="w-10 h-10 ${colors.icon}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/>
              </svg>
            </div>
          </div>
          <h2 class="text-xl font-black text-gray-900 mb-2">Préparation du QCM...</h2>
          <p class="text-sm text-gray-500 mb-1"><strong>${qcmState.questionCount} questions</strong> sur :</p>
          <p class="text-sm text-gray-700 font-semibold mb-6">${topic.title}</p>

          <div class="flex justify-center gap-2 mb-4">
            <span class="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0s"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0.15s"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0.3s"></span>
          </div>

          <p class="text-xs text-gray-400" id="loading-status">Préparation des questions...</p>
          <button onclick="cancelGeneration()" class="mt-6 text-sm text-gray-400 hover:text-gray-600 font-medium">Annuler</button>
        </div>
      </div>
    </div>
  `;
}

/* ========== ERROR SCREEN ========== */
function renderErrorScreen(topic, errorMsg) {
  const app = document.getElementById('qcm-app');
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
          <h2 class="text-xl font-black text-gray-900 mb-2">Erreur de génération</h2>
          <p class="text-sm text-gray-500 mb-4">Impossible de générer les questions</p>
          <div class="bg-red-50 rounded-lg p-3 mb-6">
            <p class="text-xs text-red-600 font-mono break-all">${errorMsg}</p>
          </div>
          <div class="flex flex-col gap-2">
            <button onclick="startQuiz(qcmState.selectedTopic)" class="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
              Réessayer
            </button>
            <button onclick="transitionView(() => renderHero())" class="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors">
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ========== TIMER (COUNTING UP) ========== */
function startQcmTimer() {
  qcmState.timerSeconds = 0;
  if (qcmState.timerInterval) clearInterval(qcmState.timerInterval);
  qcmState.timerInterval = setInterval(() => {
    qcmState.timerSeconds++;
    const el = document.getElementById('timer-display');
    if (el) {
      const m = Math.floor(qcmState.timerSeconds / 60);
      const s = qcmState.timerSeconds % 60;
      el.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

function stopQcmTimer() {
  if (qcmState.timerInterval) clearInterval(qcmState.timerInterval);
}

/* ========== KEYBOARD SHORTCUTS ========== */
function handleQuizKeydown(e) {
  if (qcmState.currentView !== 'quiz') return;
  // Don't capture if modal is open
  if (document.getElementById('quit-confirm-modal')) return;
  const key = e.key.toUpperCase();

  if (!qcmState.isValidated) {
    const map = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, '1': 0, '2': 1, '3': 2, '4': 3 };
    if (key in map) {
      e.preventDefault();
      answerQuestion(map[key]);
      return;
    }
  }

  if (qcmState.isValidated && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    const answeredCount = qcmState.answers.filter(a => a !== null).length;
    if (answeredCount >= qcmState.questions.length) {
      showResults();
    } else {
      nextQuestion();
    }
    return;
  }

  if (e.key === 'Escape') {
    e.preventDefault();
    quitQuiz();
  }
}

/* ========== RENDER QUESTION ========== */
function renderQuestion() {
  const q = qcmState.questions[qcmState.currentIndex];
  const total = qcmState.questions.length;
  const answeredCount = qcmState.answers.filter(a => a !== null).length;
  const prevProgress = Math.max(0, (answeredCount - (qcmState.isValidated ? 1 : 0)) / total) * 100;
  const topicName = qcmState.selectedTopic?.title || '';
  const subject = qcmState.selectedTopic?.subject ? SUBJECTS.find(s => s.id === qcmState.selectedTopic.subject) : null;
  const badgeText = subject?.name || 'Sujet libre';
  const colors = qcmColors[subject?.color] || qcmColors['primary'];
  const app = document.getElementById('qcm-app');
  const alreadyAnswered = qcmState.answers[qcmState.currentIndex];

  qcmState.selectedAnswer = alreadyAnswered ? alreadyAnswered.selected : null;
  qcmState.isValidated = !!alreadyAnswered;

  // Streak badge
  const streakHtml = qcmState.streak >= 2
    ? `<div class="streak-badge flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold">
         <span class="text-sm">&#128293;</span> ${qcmState.streak}
       </div>`
    : '';

  // Question pills
  const pillsHtml = qcmState.questions.map((_, i) => {
    let cls = 'unanswered';
    if (i === qcmState.currentIndex) cls = 'current';
    else if (qcmState.answers[i] !== null) {
      cls = qcmState.answers[i].correct ? 'answered-correct' : 'answered-incorrect';
    }
    const canClick = qcmState.answers[i] !== null || i === qcmState.currentIndex;
    return `<button onclick="goToQcmQuestion(${i})" class="pill-btn ${cls} w-8 h-8 rounded-lg text-xs font-bold" ${!canClick ? 'disabled' : ''}>${i + 1}</button>`;
  }).join('');

  app.innerHTML = `
    <div class="min-h-screen bg-slate-100 pt-20 pb-8">
      <div class="max-w-3xl mx-auto px-4">
        <!-- Top bar -->
        <div class="flex items-center justify-between mb-4">
          <button onclick="quitQuiz()" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 font-medium">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
            Quitter
          </button>
          <div class="flex items-center gap-3">
            ${streakHtml}
            <div class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
              <span class="text-sm font-mono font-bold text-gray-700" id="timer-display">00:00</span>
            </div>
            <span class="text-sm font-semibold text-gray-900">${qcmState.currentIndex + 1}/${total}</span>
          </div>
        </div>

        <!-- Progress bar (smooth) -->
        <div class="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div class="progress-bar h-2 bg-primary-500 rounded-full" id="progress-fill" style="width: ${prevProgress}%"></div>
        </div>

        <!-- Question pills -->
        <div class="flex flex-wrap gap-1.5 mb-5 justify-center">
          ${pillsHtml}
        </div>

        <!-- Question card -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm quiz-card">
          <div class="flex items-center justify-between mb-5">
            <span class="text-sm font-medium text-gray-500">Question ${qcmState.currentIndex + 1}</span>
            <span class="px-3 py-1 ${colors.badge} text-xs font-bold rounded-full">${badgeText}</span>
          </div>
          <p class="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-relaxed">${q.question}</p>

          <div class="space-y-3 mb-6" id="options-container">
            ${q.options.map((opt, i) => {
              let optClasses = 'quiz-option-btn option-entrance';
              let badgeClasses = 'bg-gray-100 text-gray-500';
              let disabled = '';

              if (alreadyAnswered) {
                disabled = 'disabled';
                const correctIdx = q.options.findIndex(o => o.correct);
                if (i === correctIdx) {
                  optClasses = 'quiz-option-btn correct';
                  badgeClasses = 'bg-emerald-100 text-emerald-700';
                } else if (i === alreadyAnswered.selected && !alreadyAnswered.correct) {
                  optClasses = 'quiz-option-btn incorrect';
                  badgeClasses = 'bg-red-100 text-red-700';
                } else {
                  optClasses = 'quiz-option-btn';
                }
              }

              return `
              <button onclick="answerQuestion(${i})" id="opt-${i}" class="${optClasses} w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 text-sm md:text-base font-medium text-gray-700 flex items-center gap-3" style="${!alreadyAnswered ? `animation-delay: ${i * 80}ms` : ''}" ${disabled}>
                <span class="w-8 h-8 rounded-lg ${badgeClasses} flex items-center justify-center text-sm font-bold shrink-0" id="badge-${i}">${String.fromCharCode(65 + i)}</span>
                ${opt.text}
              </button>
            `}).join('')}
          </div>

          <!-- Next button (hidden until answered) -->
          <button onclick="${answeredCount >= total ? 'showResults()' : 'nextQuestion()'}" id="next-btn" class="${alreadyAnswered ? '' : 'hidden'} w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
            ${answeredCount >= total ? 'Voir les résultats' : 'Question suivante'}
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
          </button>

          <!-- Keyboard hints (desktop only) -->
          <div class="hidden sm:flex items-center justify-center gap-4 mt-3 text-[10px] text-gray-400">
            <span><kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[9px]">A-D</kbd> Choisir</span>
            <span><kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[9px]">Entrée</kbd> Suivante</span>
            <span><kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[9px]">Esc</kbd> Quitter</span>
          </div>

          <div id="explanation-box" class="${alreadyAnswered ? '' : 'hidden'} mt-4 ${alreadyAnswered ? (alreadyAnswered.correct ? 'p-4 rounded-xl text-sm font-medium bg-green-50 text-green-700 border border-green-200' : 'p-4 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200') : ''}">
            ${alreadyAnswered ? `<strong>${alreadyAnswered.correct ? 'Bonne réponse !' : 'Mauvaise réponse.'}</strong> ${q.explanation}` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  // Animate progress bar
  if (!alreadyAnswered) {
    requestAnimationFrame(() => {
      const bar = document.getElementById('progress-fill');
      if (bar) bar.style.width = `${(answeredCount / total) * 100}%`;
    });
  }
}

/* ========== ANSWER QUESTION (INSTANT FEEDBACK) ========== */
function answerQuestion(index) {
  if (qcmState.isValidated) return;
  qcmState.isValidated = true;
  qcmState.selectedAnswer = index;
  const q = qcmState.questions[qcmState.currentIndex];
  const correctIndex = q.options.findIndex(o => o.correct);
  const isCorrect = index === correctIndex;

  if (isCorrect) {
    qcmState.score++;
    qcmState.streak++;
    if (qcmState.streak > qcmState.maxStreak) qcmState.maxStreak = qcmState.streak;
  } else {
    qcmState.streak = 0;
  }

  qcmState.answers[qcmState.currentIndex] = { question: q, selected: index, correct: isCorrect, correctIndex };

  // Style options
  document.querySelectorAll('.quiz-option-btn').forEach((btn, i) => {
    btn.disabled = true;
    btn.classList.remove('selected', 'option-entrance');
    const badge = document.getElementById(`badge-${i}`);
    if (i === correctIndex) {
      btn.classList.add('correct');
      if (badge) {
        badge.classList.remove('bg-gray-100', 'text-gray-500', 'bg-primary-100', 'text-primary-700');
        badge.classList.add('bg-emerald-100', 'text-emerald-700');
      }
    }
    if (i === index && !isCorrect) {
      btn.classList.add('incorrect');
      if (badge) {
        badge.classList.remove('bg-gray-100', 'text-gray-500', 'bg-primary-100', 'text-primary-700');
        badge.classList.add('bg-red-100', 'text-red-700');
      }
    }
  });

  // Show explanation with animation
  setTimeout(() => {
    const box = document.getElementById('explanation-box');
    if (box) {
      box.classList.remove('hidden');
      box.className = `explanation-reveal mt-4 p-4 rounded-xl text-sm font-medium ${isCorrect ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`;
      box.innerHTML = `<strong>${isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse.'}</strong> ${q.explanation}`;
    }
  }, 150);

  // Show next button
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.classList.remove('hidden');
    const answeredCount = qcmState.answers.filter(a => a !== null).length;
    const isAllAnswered = answeredCount >= qcmState.questions.length;
    nextBtn.innerHTML = isAllAnswered
      ? 'Voir les résultats <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>'
      : 'Question suivante <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>';
    nextBtn.onclick = isAllAnswered ? showResults : nextQuestion;
  }

  // Update pills
  updatePills();

  // Update streak badge in top bar
  updateStreakBadge();

  // Animate progress bar
  const bar = document.getElementById('progress-fill');
  const answeredCount = qcmState.answers.filter(a => a !== null).length;
  if (bar) bar.style.width = `${(answeredCount / qcmState.questions.length) * 100}%`;
}

function updatePills() {
  document.querySelectorAll('.pill-btn').forEach((pill, i) => {
    pill.className = 'pill-btn w-8 h-8 rounded-lg text-xs font-bold';
    if (i === qcmState.currentIndex) {
      pill.classList.add('current');
    } else if (qcmState.answers[i] !== null) {
      pill.classList.add(qcmState.answers[i].correct ? 'answered-correct' : 'answered-incorrect');
    } else {
      pill.classList.add('unanswered');
    }
    pill.disabled = !(qcmState.answers[i] !== null || i === qcmState.currentIndex);
  });
}

function updateStreakBadge() {
  // Find the streak container in the top bar
  const topBar = document.querySelector('.flex.items-center.gap-3');
  if (!topBar) return;
  const existing = topBar.querySelector('.streak-badge');
  if (qcmState.streak >= 2) {
    if (existing) {
      existing.querySelector('span:last-child') || existing;
      existing.innerHTML = `<span class="text-sm">&#128293;</span> ${qcmState.streak}`;
    } else {
      const badge = document.createElement('div');
      badge.className = 'streak-badge flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold';
      badge.innerHTML = `<span class="text-sm">&#128293;</span> ${qcmState.streak}`;
      topBar.insertBefore(badge, topBar.firstChild);
    }
  } else if (existing) {
    existing.remove();
  }
}

/* ========== QUESTION NAVIGATION ========== */
function goToQcmQuestion(index) {
  if (index > qcmState.answers.length) return;
  // Can only go to answered questions or current unanswered
  if (qcmState.answers[index] === null && index !== findNextUnanswered()) return;
  qcmState.currentIndex = index;
  renderQuestion();
}

function findNextUnanswered() {
  for (let i = 0; i < qcmState.answers.length; i++) {
    if (qcmState.answers[i] === null) return i;
  }
  return qcmState.answers.length;
}

function nextQuestion() {
  const next = findNextUnanswered();
  if (next < qcmState.questions.length) {
    qcmState.currentIndex = next;
    renderQuestion();
  } else {
    showResults();
  }
}

/* ========== QUIT QUIZ (STYLED MODAL) ========== */
function quitQuiz() {
  const answered = qcmState.answers.filter(a => a !== null).length;
  const total = qcmState.questions.length;
  const minutes = Math.floor(qcmState.timerSeconds / 60);
  const seconds = qcmState.timerSeconds % 60;

  const modal = document.createElement('div');
  modal.id = 'quit-confirm-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" onclick="closeQuitModal()"></div>
    <div class="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl confirm-modal-enter">
      <div class="text-center mb-5">
        <div class="w-12 h-12 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
          </svg>
        </div>
        <h3 class="font-bold text-gray-900 text-lg mb-1">Quitter le QCM ?</h3>
        <p class="text-sm text-gray-500">Votre progression sera perdue.</p>
      </div>
      <div class="bg-gray-50 rounded-xl p-3 mb-5 flex justify-around text-center">
        <div>
          <p class="text-lg font-bold text-gray-900">${answered}/${total}</p>
          <p class="text-xs text-gray-500">Répondues</p>
        </div>
        <div class="w-px bg-gray-200"></div>
        <div>
          <p class="text-lg font-bold text-gray-900">${qcmState.score}</p>
          <p class="text-xs text-gray-500">Correctes</p>
        </div>
        <div class="w-px bg-gray-200"></div>
        <div>
          <p class="text-lg font-bold text-gray-900">${minutes}:${seconds.toString().padStart(2, '0')}</p>
          <p class="text-xs text-gray-500">Temps</p>
        </div>
      </div>
      <div class="flex gap-3">
        <button onclick="closeQuitModal()" class="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 text-sm hover:border-gray-300 transition-colors">
          Continuer
        </button>
        <button onclick="confirmQuit()" class="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
          Quitter
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeQuitModal() {
  const modal = document.getElementById('quit-confirm-modal');
  if (modal) modal.remove();
}

function confirmQuit() {
  closeQuitModal();
  stopQcmTimer();
  document.removeEventListener('keydown', handleQuizKeydown);
  transitionView(() => renderHero());
}

/* ========== RESULTS ========== */
function showResults() {
  stopQcmTimer();
  document.removeEventListener('keydown', handleQuizKeydown);
  qcmState.currentView = 'results';
  const topic = qcmState.selectedTopic;
  const subject = topic?.subject ? SUBJECTS.find(s => s.id === topic.subject) : null;
  const validAnswers = qcmState.answers.filter(a => a !== null);
  const pct = Math.round((qcmState.score / validAnswers.length) * 100);
  const minutes = Math.floor(qcmState.timerSeconds / 60);
  const seconds = qcmState.timerSeconds % 60;

  // Comparison with last session on same topic
  const stats = getQcmStats();
  const lastSame = stats.sessions.find(s => s.topic === topic?.title);
  let comparisonHtml = '';
  if (lastSame) {
    const diff = pct - lastSame.percentage;
    if (diff > 0) {
      comparisonHtml = `<div class="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mt-2">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"/></svg>
        +${diff}% vs dernier essai
      </div>`;
    } else if (diff < 0) {
      comparisonHtml = `<div class="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold mt-2">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25"/></svg>
        ${diff}% vs dernier essai
      </div>`;
    } else {
      comparisonHtml = `<div class="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold mt-2">= Même score que le dernier essai</div>`;
    }
  }

  saveQcmSession({
    subject: topic?.subject || 'custom',
    subjectName: topic?.subjectName || 'Sujet libre',
    topic: topic?.title || '',
    correct: qcmState.score,
    total: validAnswers.length,
    percentage: pct,
    duration: qcmState.timerSeconds,
    date: new Date().toISOString(),
  });

  const circumference = 2 * Math.PI * 56;
  const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
  const incorrectCount = validAnswers.filter(a => !a.correct).length;

  document.getElementById('site-footer').style.display = '';
  const app = document.getElementById('qcm-app');
  app.innerHTML = `
    <section class="py-24 md:py-28">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-2">Résultats du QCM</h2>
          <p class="text-gray-500">${topic?.title || 'Sujet libre'}</p>
        </div>

        <div class="flex flex-col items-center justify-center mb-8">
          <div class="score-circle">
            <svg width="140" height="140">
              <circle cx="70" cy="70" r="56" fill="none" class="score-circle-bg" stroke-width="12"/>
              <circle cx="70" cy="70" r="56" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"
                stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" class="score-circle-fill" id="score-fill"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-black" style="color:${color}">${pct}%</span>
              <span class="text-xs text-gray-500">${qcmState.score}/${validAnswers.length}</span>
            </div>
          </div>
          ${comparisonHtml}
        </div>

        <div class="flex flex-wrap justify-center gap-4 mb-8">
          <div class="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p class="text-base font-bold text-gray-900">${subject?.name || 'Libre'}</p>
            <p class="text-xs text-gray-500">Matière</p>
          </div>
          <div class="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p class="text-base font-bold text-gray-900">${minutes}m ${seconds.toString().padStart(2, '0')}s</p>
            <p class="text-xs text-gray-500">Durée</p>
          </div>
          <div class="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p class="text-base font-bold text-gray-900">${validAnswers.length}</p>
            <p class="text-xs text-gray-500">Questions</p>
          </div>
          ${qcmState.maxStreak >= 2 ? `
          <div class="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p class="text-base font-bold text-gray-900">&#128293; ${qcmState.maxStreak}</p>
            <p class="text-xs text-gray-500">Meilleure série</p>
          </div>` : ''}
        </div>

        <!-- Filter tabs -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-gray-900 text-lg">Correction détaillée</h3>
            <div class="flex gap-2">
              <button onclick="filterResults('all')" id="filter-all" class="results-filter active px-3 py-1.5 rounded-lg text-xs font-bold">
                Toutes (${validAnswers.length})
              </button>
              ${incorrectCount > 0 ? `
              <button onclick="filterResults('incorrect')" id="filter-incorrect" class="results-filter px-3 py-1.5 rounded-lg text-xs font-bold">
                Erreurs (${incorrectCount})
              </button>` : ''}
            </div>
          </div>
          <div id="corrections-container" class="space-y-4">
            ${validAnswers.map((a, i) => renderCorrectionItem(a, i)).join('')}
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button onclick="startQuiz(qcmState.selectedTopic)" class="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"/></svg>
            Recommencer
          </button>
          <button onclick="transitionView(() => renderHero())" class="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors">
            Nouveau QCM
          </button>
        </div>
      </div>
    </section>
  `;

  // Animate score circle
  requestAnimationFrame(() => {
    const fill = document.getElementById('score-fill');
    if (fill) {
      const offset = circumference - (pct / 100) * circumference;
      fill.style.transition = 'stroke-dashoffset 1s ease';
      fill.style.strokeDashoffset = offset;
    }
  });
}

function renderCorrectionItem(a, i) {
  const questionIndex = qcmState.answers.indexOf(a);
  const num = questionIndex >= 0 ? questionIndex + 1 : i + 1;
  return `
    <div class="p-4 rounded-xl border ${a.correct ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}">
      <div class="flex items-start gap-3">
        <div class="w-6 h-6 rounded-full ${a.correct ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center shrink-0 mt-0.5">
          ${a.correct
            ? '<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>'
            : '<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>'}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-gray-900">Q${num}. ${a.question.question}</p>
          <p class="text-xs mt-1 ${a.correct ? 'text-green-700' : 'text-red-700'}">
            Votre réponse : <strong>${a.question.options[a.selected].text}</strong>
            ${!a.correct ? ` — Bonne réponse : <strong>${a.question.options[a.question.options.findIndex(o => o.correct)].text}</strong>` : ''}
          </p>
          <p class="text-xs text-gray-600 mt-2 leading-relaxed">${a.question.explanation}</p>
        </div>
      </div>
    </div>
  `;
}

function filterResults(mode) {
  const allBtn = document.getElementById('filter-all');
  const incorrectBtn = document.getElementById('filter-incorrect');
  if (allBtn) allBtn.classList.toggle('active', mode === 'all');
  if (incorrectBtn) incorrectBtn.classList.toggle('active', mode === 'incorrect');

  const container = document.getElementById('corrections-container');
  if (!container) return;
  const validAnswers = qcmState.answers.filter(a => a !== null);
  const filtered = mode === 'incorrect'
    ? validAnswers.filter(a => !a.correct)
    : validAnswers;
  container.innerHTML = filtered.map((a, i) => renderCorrectionItem(a, i)).join('');
}

document.addEventListener('DOMContentLoaded', initQCM);
