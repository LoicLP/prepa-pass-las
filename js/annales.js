/* ===== ANNALES ENGINE — GEMINI AI ===== */

/* ========== CLÉ API GEMINI ========== */
const GEMINI_API_KEY = 'VOTRE_CLE_API_ICI'; // ← Remplacer par votre clé Google AI Studio
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/* ========== STATE ========== */
let annaleState = {
  currentView: 'subjects',
  selectedSubject: null,
  questions: [],
  answers: [],
  currentQ: 0,
  timerInterval: null,
  timerSeconds: 0,
  startTime: null,
  examDuration: 30,
  isGenerating: false,
};

/* ========== SUBJECT CONFIG ========== */
const annaleColors = {
  'indigo': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500', icon: 'text-indigo-500' },
  'primary': { bg: 'bg-primary-50', border: 'border-primary-200', text: 'text-primary-700', badge: 'bg-primary-100 text-primary-700', bar: 'bg-primary-500', icon: 'text-primary-500' },
  'emerald': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', icon: 'text-emerald-500' },
  'violet': { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500', icon: 'text-violet-500' },
  'cyan': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700', bar: 'bg-cyan-500', icon: 'text-cyan-500' },
  'amber': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500', icon: 'text-amber-500' },
  'rose': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700', bar: 'bg-rose-500', icon: 'text-rose-500' },
};

const annaleIcons = {
  'anatomie': '<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>',
  'chimie': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
  'biocell': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/>',
  'biostats': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>',
  'biophysique': '<path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"/>',
  'ssh': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>',
};

const subjectPrompts = {
  'anatomie': "Anatomie humaine pour PASS/LAS : anatomie descriptive, topographique et fonctionnelle (ostéologie, myologie, angiologie, neuroanatomie, splanchnologie). Inclure les rapports anatomiques, les innervations, les vascularisations, les pièges classiques sur les structures similaires.",
  'chimie': "Chimie générale, chimie organique et Biochimie pour PASS/LAS : atomistique, liaisons chimiques, thermodynamique, cinétique, stéréochimie, réactions organiques, enzymologie (Michaelis-Menten, inhibitions), métabolisme (glycolyse, cycle de Krebs, β-oxydation, néoglucogenèse), biochimie structurale (protéines, glucides, lipides, acides nucléiques).",
  'biocell': "Biologie cellulaire et moléculaire pour PASS/LAS : structure cellulaire (membrane, organites, cytosquelette), communication cellulaire (récepteurs, voies de signalisation), cycle cellulaire (mitose, méiose, régulation), génétique moléculaire (réplication, transcription, traduction, régulation de l'expression génique), techniques de biologie moléculaire (PCR, Western blot, CRISPR).",
  'biostats': "Biostatistiques et épidémiologie pour PASS/LAS : statistiques descriptives, probabilités, lois de distribution (normale, binomiale, Poisson), tests d'hypothèses (Student, Chi², ANOVA), intervalles de confiance, mesures épidémiologiques (RR, OR, prévalence, incidence), essais cliniques, sensibilité/spécificité, courbes ROC, régression.",
  'biophysique': "Biophysique pour PASS/LAS : optique (lentilles, miroirs, œil), ondes (son, ultrasons), radioactivité (décroissance, isotopes, applications médicales), imagerie médicale (radiographie, scanner, IRM, scintigraphie, TEP), pH et solutions tampons, RMN, potentiels membranaires, électrophysiologie (ECG, EEG), dosimétrie, laser médical.",
  'ssh': "Sciences Humaines et Sociales / Éthique médicale pour PASS/LAS : éthique médicale (principes, Beauchamp & Childress), droit de la santé (loi Kouchner 2002, loi Claeys-Leonetti), bioéthique (PMA, fin de vie, consentement), histoire de la médecine, philosophie des sciences, sociologie de la santé (inégalités, déterminants), psychologie médicale, système de santé français, économie de la santé, santé publique."
};

/* ========== STATS ========== */
function getAnnalesStats() {
  try { return JSON.parse(localStorage.getItem('prepa-annales-stats')) || { sessions: [] }; }
  catch { return { sessions: [] }; }
}
function saveAnnalesSession(session) {
  const stats = getAnnalesStats();
  stats.sessions.unshift(session);
  if (stats.sessions.length > 50) stats.sessions = stats.sessions.slice(0, 50);
  localStorage.setItem('prepa-annales-stats', JSON.stringify(stats));
}

/* ========== GEMINI AI — QUESTION GENERATION ========== */
async function generateQuestionsWithAI(subjectId) {
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const subjectContext = subjectPrompts[subjectId] || subject?.name || subjectId;

  const prompt = `Tu es un professeur d'université spécialisé en ${subject?.name || subjectId} pour les concours PASS/LAS (Parcours Accès Santé Spécifique / Licence Accès Santé) en France.

Génère exactement 20 questions QCM de niveau concours PASS/LAS sur le thème suivant :
${subjectContext}

CONSIGNES STRICTES :
- Chaque question doit avoir exactement 4 options de réponse
- Une seule bonne réponse par question
- Les questions doivent être de niveau universitaire première année de médecine
- Inclure des pièges classiques des concours (formulations ambiguës, confusions courantes)
- Les explications doivent être détaillées, pédagogiques et scientifiquement rigoureuses
- Varier les thématiques au sein de la matière (ne pas se répéter)
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

IMPORTANT : Exactement 20 questions, chaque question avec exactement 4 options dont une seule correcte. JSON valide uniquement.`;

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
    throw new Error(`Erreur API Gemini (${response.status}): ${err}`);
  }

  const data = await response.json();

  // Extract generated text
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Réponse vide de Gemini');

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
      throw new Error('Format de réponse invalide');
    }
  }

  // Validate structure
  if (!Array.isArray(questions) || questions.length < 10) {
    throw new Error(`Nombre insuffisant de questions reçues (${questions?.length || 0})`);
  }

  // Sanitize and validate each question
  const validated = questions.slice(0, 20).filter(q => {
    return q.question &&
           Array.isArray(q.options) &&
           q.options.length === 4 &&
           q.options.filter(o => o.correct).length === 1 &&
           q.explanation;
  });

  if (validated.length < 10) {
    throw new Error(`Trop peu de questions valides (${validated.length}/20)`);
  }

  return validated;
}

/* ========== INIT ========== */
function initAnnales() {
  renderSubjectSelection();
}

/* ========== SUBJECT SELECTION ========== */
function renderSubjectSelection() {
  annaleState.currentView = 'subjects';
  annaleState.selectedSubject = null;
  annaleState.isGenerating = false;
  const app = document.getElementById('annales-app');
  const stats = getAnnalesStats();
  const totalDone = stats.sessions.length;
  const avgScore = totalDone > 0 ? Math.round(stats.sessions.reduce((a, s) => a + s.percentage, 0) / totalDone) : 0;

  app.innerHTML = `
    <!-- Hero -->
    <section class="gradient-hero noise-overlay dot-grid pt-24 pb-10 md:pt-28 md:pb-12 relative overflow-hidden">
      <div class="blob-1"></div>
      <div class="blob-2"></div>
      <div class="geo-circle-light w-40 h-40 top-24 right-[10%] hidden lg:block"></div>
      <div class="geo-ring-light w-64 h-64 -bottom-16 left-[5%] hidden lg:block"></div>
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div class="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full border border-primary-200 mb-4">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <span class="text-sm font-semibold text-primary-700">Propulsé par l'IA</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-black text-gray-900 mb-2">
          <span class="text-primary-600">Annales</span> générées par IA
        </h1>
        <p class="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-5">
          20 questions uniques générées par intelligence artificielle, en conditions d'examen : 30 minutes, correction détaillée. Chaque épreuve est différente.
        </p>
        <div class="flex flex-wrap justify-center gap-3 md:gap-5">
          <div class="bg-white/70 backdrop-blur-sm border border-primary-100 rounded-xl px-4 py-2.5">
            <div class="flex items-center justify-center gap-1.5">
              <svg class="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"/></svg>
              <span class="text-xl md:text-2xl font-black text-primary-600">IA</span>
            </div>
            <div class="text-[11px] font-semibold text-gray-500">Gemini</div>
          </div>
          <div class="bg-white/70 backdrop-blur-sm border border-primary-100 rounded-xl px-4 py-2.5">
            <div class="text-xl md:text-2xl font-black text-primary-600">30</div>
            <div class="text-[11px] font-semibold text-gray-500">Minutes par épreuve</div>
          </div>
          <div class="bg-white/70 backdrop-blur-sm border border-primary-100 rounded-xl px-4 py-2.5">
            <div class="text-xl md:text-2xl font-black text-primary-600">&infin;</div>
            <div class="text-[11px] font-semibold text-gray-500">Questions possibles</div>
          </div>
        </div>
      </div>
    </section>

    ${totalDone > 0 ? `
    <section class="py-4">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-primary-50 border border-primary-200 rounded-2xl p-4 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          <div class="text-center">
            <p class="text-xl font-black text-primary-700">${totalDone}</p>
            <p class="text-xs font-medium text-primary-500">Épreuves terminées</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-black text-accent-600">${avgScore}%</p>
            <p class="text-xs font-medium text-accent-600">Score moyen</p>
          </div>
        </div>
      </div>
    </section>` : ''}

    <section class="py-6">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-lg font-bold text-gray-900 mb-1">Choisissez une matière</h2>
        <p class="text-sm text-gray-500 mb-4">L'IA génère 20 questions uniques de niveau concours. Chaque épreuve est différente.</p>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${SUBJECTS.map(s => {
            const colors = annaleColors[s.color] || annaleColors['primary'];
            const icon = annaleIcons[s.id] || '';
            const done = stats.sessions.filter(ss => ss.subject === s.id).length;
            const best = stats.sessions.filter(ss => ss.subject === s.id).reduce((max, ss) => Math.max(max, ss.percentage), 0);
            return `
            <button onclick="launchExam('${s.id}')" class="exam-card bg-white rounded-2xl p-5 text-left border-2 border-gray-200 hover:border-primary-300 transition-all hover:shadow-lg" id="btn-${s.id}">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center">
                  <svg class="w-5 h-5 ${colors.icon}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">${icon}</svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900">${s.name}</h3>
                  <p class="text-xs text-gray-500">Questions générées par IA</p>
                </div>
              </div>
              <div class="flex items-center gap-3 text-xs text-gray-400 mb-3">
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                  30 min
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/></svg>
                  20 questions
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center gap-1.5 text-sm font-bold text-gray-900">
                  Lancer l'épreuve
                  <svg class="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/></svg>
                </span>
                ${done > 0 ? `<span class="text-xs font-bold ${best >= 70 ? 'text-green-600' : best >= 50 ? 'text-amber-600' : 'text-red-600'}">Meilleur : ${best}%</span>` : ''}
              </div>
            </button>`;
          }).join('')}
        </div>
      </div>
    </section>
  `;
  document.getElementById('site-footer').style.display = '';
}

/* ========== LOADING SCREEN ========== */
function renderLoadingScreen(subjectId) {
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const colors = annaleColors[subject?.color] || annaleColors['primary'];
  const app = document.getElementById('annales-app');
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
          <h2 class="text-xl font-black text-gray-900 mb-2">Génération en cours...</h2>
          <p class="text-sm text-gray-500 mb-6">L'IA prépare 20 questions de <strong>${subject?.name || ''}</strong> de niveau concours PASS/LAS</p>

          <!-- Progress dots -->
          <div class="flex justify-center gap-2 mb-4" id="loading-dots">
            <span class="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0s"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0.15s"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0.3s"></span>
          </div>

          <p class="text-xs text-gray-400" id="loading-status">Connexion à Gemini...</p>

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
function renderErrorScreen(subjectId, errorMsg) {
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const app = document.getElementById('annales-app');
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
          <p class="text-sm text-gray-500 mb-4">Impossible de générer les questions pour <strong>${subject?.name || ''}</strong></p>
          <div class="bg-red-50 rounded-lg p-3 mb-6">
            <p class="text-xs text-red-600 font-mono break-all">${errorMsg}</p>
          </div>
          <div class="flex flex-col gap-2">
            <button onclick="launchExam('${subjectId}')" class="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
              Réessayer
            </button>
            <button onclick="renderSubjectSelection()" class="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors">
              Retour aux matières
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ========== LAUNCH EXAM ========== */
async function launchExam(subjectId) {
  if (annaleState.isGenerating) return;
  annaleState.isGenerating = true;
  annaleState.selectedSubject = subjectId;

  renderLoadingScreen(subjectId);

  // Update loading status
  const statusEl = () => document.getElementById('loading-status');
  setTimeout(() => { if (statusEl()) statusEl().textContent = 'Analyse du programme...'; }, 2000);
  setTimeout(() => { if (statusEl()) statusEl().textContent = 'Rédaction des questions...'; }, 5000);
  setTimeout(() => { if (statusEl()) statusEl().textContent = 'Vérification des réponses...'; }, 10000);
  setTimeout(() => { if (statusEl()) statusEl().textContent = 'Finalisation de l\'épreuve...'; }, 15000);

  try {
    const questions = await generateQuestionsWithAI(subjectId);

    // Check if user cancelled during generation
    if (!annaleState.isGenerating) return;

    annaleState.questions = questions;
    annaleState.answers = new Array(questions.length).fill(null);
    annaleState.currentQ = 0;
    annaleState.timerSeconds = annaleState.examDuration * 60;
    annaleState.startTime = Date.now();
    annaleState.currentView = 'exam';
    annaleState.isGenerating = false;

    startCountdown();
    renderExamQuestion();
  } catch (error) {
    console.error('Erreur génération IA:', error);
    annaleState.isGenerating = false;
    renderErrorScreen(subjectId, error.message);
  }
}

function cancelGeneration() {
  annaleState.isGenerating = false;
  renderSubjectSelection();
}

/* ========== COUNTDOWN TIMER ========== */
function startCountdown() {
  if (annaleState.timerInterval) clearInterval(annaleState.timerInterval);
  annaleState.timerInterval = setInterval(() => {
    annaleState.timerSeconds--;
    updateTimerDisplay();
    if (annaleState.timerSeconds <= 0) {
      clearInterval(annaleState.timerInterval);
      finishExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('countdown-display');
  if (!el) return;
  const m = Math.floor(annaleState.timerSeconds / 60);
  const s = annaleState.timerSeconds % 60;
  el.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  if (annaleState.timerSeconds <= 300) {
    el.classList.add('timer-warning', 'text-red-600');
  } else {
    el.classList.remove('timer-warning', 'text-red-600');
  }
}

/* ========== RENDER EXAM QUESTION ========== */
function renderExamQuestion() {
  const q = annaleState.questions[annaleState.currentQ];
  const subject = SUBJECTS.find(s => s.id === annaleState.selectedSubject);
  const total = annaleState.questions.length;
  const answered = annaleState.answers.filter(a => a !== null).length;
  const app = document.getElementById('annales-app');

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
          ${annaleState.questions.map((_, i) => {
            let cls = 'unanswered';
            if (i === annaleState.currentQ) cls = 'current';
            else if (annaleState.answers[i] !== null) cls = 'answered';
            return `<button onclick="goToQuestion(${i})" class="pill-btn ${cls} w-8 h-8 rounded-lg text-xs font-bold">${i + 1}</button>`;
          }).join('')}
        </div>

        <!-- Question card -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <span class="text-sm font-medium text-gray-500">Question ${annaleState.currentQ + 1}/${total}</span>
            <span class="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">${subject?.name || ''}</span>
          </div>
          <p class="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-relaxed">${q.question}</p>
          <div class="space-y-3 mb-6">
            ${q.options.map((opt, i) => {
              const selected = annaleState.answers[annaleState.currentQ] === i;
              return `
              <button onclick="selectExamOption(${i})" class="quiz-option-btn ${selected ? 'selected' : ''} w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 text-sm md:text-base font-medium text-gray-700 flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg ${selected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'} flex items-center justify-center text-sm font-bold shrink-0">${String.fromCharCode(65 + i)}</span>
                ${opt.text}
              </button>`;
            }).join('')}
          </div>

          <!-- Nav buttons -->
          <div class="flex items-center justify-between gap-3">
            <button onclick="prevQuestion()" class="px-5 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors text-sm ${annaleState.currentQ === 0 ? 'invisible' : ''}" ${annaleState.currentQ === 0 ? 'disabled' : ''}>
              Précédent
            </button>
            ${annaleState.currentQ === total - 1 ? `
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
  annaleState.answers[annaleState.currentQ] = index;
  renderExamQuestion();
}

function goToQuestion(index) {
  annaleState.currentQ = index;
  renderExamQuestion();
}

function prevQuestion() {
  if (annaleState.currentQ > 0) { annaleState.currentQ--; renderExamQuestion(); }
}

function nextExamQuestion() {
  if (annaleState.currentQ < annaleState.questions.length - 1) { annaleState.currentQ++; renderExamQuestion(); }
}

function confirmFinish() {
  const unanswered = annaleState.answers.filter(a => a === null).length;
  if (unanswered > 0) {
    if (!confirm(`Vous avez ${unanswered} question${unanswered > 1 ? 's' : ''} sans réponse. Terminer quand même ?`)) return;
  }
  finishExam();
}

function quitExam() {
  if (confirm('Quitter l\'épreuve ? Votre progression sera perdue.')) {
    clearInterval(annaleState.timerInterval);
    renderSubjectSelection();
  }
}

/* ========== FINISH & RESULTS ========== */
function finishExam() {
  clearInterval(annaleState.timerInterval);
  annaleState.currentView = 'results';
  const subject = SUBJECTS.find(s => s.id === annaleState.selectedSubject);
  const elapsed = Math.round((Date.now() - annaleState.startTime) / 1000);

  let correct = 0;
  const details = annaleState.questions.map((q, i) => {
    const sel = annaleState.answers[i];
    const correctIdx = q.options.findIndex(o => o.correct);
    const isCorrect = sel === correctIdx;
    if (isCorrect) correct++;
    return { question: q, selected: sel, correctIndex: correctIdx, isCorrect };
  });

  const pct = Math.round((correct / annaleState.questions.length) * 100);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  saveAnnalesSession({
    subject: annaleState.selectedSubject,
    subjectName: subject?.name || '',
    correct,
    total: annaleState.questions.length,
    percentage: pct,
    duration: elapsed,
    date: new Date().toISOString(),
  });

  const circumference = 2 * Math.PI * 56;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

  document.getElementById('site-footer').style.display = '';
  const app = document.getElementById('annales-app');
  app.innerHTML = `
    <section class="py-24 md:py-28">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-2">Résultats de l'épreuve</h2>
          <p class="text-gray-500">${subject?.name} — Générée par IA</p>
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
              <span class="text-xs text-gray-500">${correct}/${annaleState.questions.length}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-4 mb-8">
          <div class="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p class="text-base font-bold text-gray-900">${subject?.name}</p>
            <p class="text-xs text-gray-500">Matière</p>
          </div>
          <div class="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p class="text-base font-bold text-gray-900">${minutes}m ${seconds.toString().padStart(2, '0')}s</p>
            <p class="text-xs text-gray-500">Durée</p>
          </div>
          <div class="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p class="text-base font-bold text-gray-900">${annaleState.questions.length - annaleState.answers.filter(a => a === null).length}/${annaleState.questions.length}</p>
            <p class="text-xs text-gray-500">Répondues</p>
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
                        Votre réponse : <strong>${d.question.options[d.selected].text}</strong>
                        ${!d.isCorrect ? ` — Bonne réponse : <strong>${d.question.options[d.correctIndex].text}</strong>` : ''}
                      </p>
                    ` : `<p class="text-xs mt-1 text-gray-500">Non répondue — Bonne réponse : <strong>${d.question.options[d.correctIndex].text}</strong></p>`}
                    <p class="text-xs text-gray-600 mt-2 leading-relaxed">${d.question.explanation}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button onclick="launchExam('${annaleState.selectedSubject}')" class="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>
            Nouvelle épreuve (IA)
          </button>
          <button onclick="renderSubjectSelection()" class="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors">
            Changer de matière
          </button>
        </div>
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', initAnnales);
