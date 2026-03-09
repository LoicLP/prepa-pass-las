/* ===== QCM ENGINE ===== */
let currentSubject = null;
let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let answers = [];
let timerInterval = null;
let timerSeconds = 0;
let selectedAnswer = null;
let isValidated = false;

/* ===== SUBJECT SELECTION ===== */
function initQCM() {
  renderSubjectSelection();
  renderHistory();
}

function renderSubjectSelection() {
  const main = document.getElementById('qcm-main');
  const stats = getStats();
  const totalPct = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;

  main.innerHTML = `
    <div class="text-center mb-10">
      <h1 class="text-3xl md:text-4xl font-black text-gray-900 mb-3">Entraînement QCM</h1>
      <p class="text-gray-600 text-lg">Choisissez une matière pour commencer votre session d'entraînement.</p>
    </div>

    <!-- Stats banner -->
    ${stats.totalAnswered > 0 ? `
    <div class="bg-primary-50 border border-primary-200 rounded-2xl p-5 mb-10 flex flex-wrap items-center justify-center gap-8">
      <div class="text-center">
        <p class="text-2xl font-black text-primary-700">${stats.totalAnswered}</p>
        <p class="text-xs font-medium text-primary-500">Questions répondues</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-black text-accent-600">${totalPct}%</p>
        <p class="text-xs font-medium text-accent-600">Taux de réussite</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-black text-gray-700">${stats.sessions.length}</p>
        <p class="text-xs font-medium text-gray-500">Sessions terminées</p>
      </div>
    </div>` : ''}

    <!-- Subject cards -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <button onclick="startQuiz('all')" class="subject-card bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-6 text-left text-white border-2 border-transparent">
        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 text-2xl">&#x1F3AF;</div>
        <h3 class="font-bold text-lg mb-1">Toutes les matières</h3>
        <p class="text-sm text-primary-200">${QUESTIONS.length} questions disponibles</p>
      </button>
      ${SUBJECTS.map(s => {
        const count = QUESTIONS.filter(q => q.subject === s.id).length;
        return `
        <button onclick="startQuiz('${s.id}')" class="subject-card bg-white rounded-2xl p-6 text-left border-2 border-gray-200">
          <div class="w-12 h-12 bg-${s.color}-50 rounded-xl flex items-center justify-center mb-3 text-2xl">${s.icon}</div>
          <h3 class="font-bold text-lg text-gray-900 mb-1">${s.name}</h3>
          <p class="text-sm text-gray-500">${count} questions</p>
        </button>`;
      }).join('')}
    </div>
  `;
}

/* ===== START QUIZ ===== */
function startQuiz(subject) {
  currentSubject = subject;
  const pool = subject === 'all' ? [...QUESTIONS] : QUESTIONS.filter(q => q.subject === subject);
  // Shuffle
  quizQuestions = pool.sort(() => Math.random() - 0.5).slice(0, 10);
  currentIndex = 0;
  score = 0;
  answers = [];
  selectedAnswer = null;
  isValidated = false;
  startTimer();
  renderQuestion();
}

/* ===== TIMER ===== */
function startTimer() {
  timerSeconds = 0;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerSeconds++;
    const el = document.getElementById('timer-display');
    if (el) {
      const m = Math.floor(timerSeconds / 60);
      const s = timerSeconds % 60;
      el.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

/* ===== RENDER QUESTION ===== */
function renderQuestion() {
  const main = document.getElementById('qcm-main');
  const q = quizQuestions[currentIndex];
  const subjectName = currentSubject === 'all' ? SUBJECTS.find(s => s.id === q.subject)?.name || '' : SUBJECTS.find(s => s.id === currentSubject)?.name || '';
  const progress = ((currentIndex) / quizQuestions.length) * 100;

  selectedAnswer = null;
  isValidated = false;

  main.innerHTML = `
    <!-- Top bar -->
    <div class="flex items-center justify-between mb-6">
      <button onclick="quitQuiz()" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
        Quitter
      </button>
      <div class="flex items-center gap-4">
        <span class="text-sm font-mono font-bold text-gray-600" id="timer-display">00:00</span>
        <span class="text-sm font-semibold text-gray-900">${currentIndex + 1}/${quizQuestions.length}</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="w-full h-2 bg-gray-200 rounded-full mb-8">
      <div class="progress-bar h-2 bg-primary-500 rounded-full" style="width: ${progress}%"></div>
    </div>

    <!-- Question card -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm quiz-card">
      <div class="flex items-center justify-between mb-5">
        <span class="text-sm font-medium text-gray-500">Question ${currentIndex + 1}</span>
        <span class="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">${subjectName}</span>
      </div>
      <p class="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-relaxed">${q.question}</p>

      <div class="space-y-3 mb-6" id="options-container">
        ${q.options.map((opt, i) => `
          <button onclick="selectOption(${i})" id="opt-${i}" class="quiz-option-btn w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 text-sm md:text-base font-medium text-gray-700 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">${String.fromCharCode(65 + i)}</span>
            ${opt.text}
          </button>
        `).join('')}
      </div>

      <button onclick="validateAnswer()" id="validate-btn" class="w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed" disabled>
        Valider ma réponse
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
      </button>

      <div id="explanation-box" class="hidden mt-4"></div>
    </div>
  `;
}

/* ===== SELECT OPTION ===== */
function selectOption(index) {
  if (isValidated) return;
  selectedAnswer = index;
  document.querySelectorAll('.quiz-option-btn').forEach((btn, i) => {
    btn.classList.remove('selected');
    if (i === index) btn.classList.add('selected');
  });
  document.getElementById('validate-btn').disabled = false;
}

/* ===== VALIDATE ===== */
function validateAnswer() {
  if (selectedAnswer === null || isValidated) return;
  isValidated = true;
  const q = quizQuestions[currentIndex];
  const correctIndex = q.options.findIndex(o => o.correct);
  const isCorrect = selectedAnswer === correctIndex;

  if (isCorrect) score++;
  answers.push({ question: q, selected: selectedAnswer, correct: isCorrect });

  // Style options
  document.querySelectorAll('.quiz-option-btn').forEach((btn, i) => {
    btn.disabled = true;
    btn.classList.remove('selected');
    if (i === correctIndex) btn.classList.add('correct');
    if (i === selectedAnswer && !isCorrect) btn.classList.add('incorrect');
  });

  // Show explanation
  const box = document.getElementById('explanation-box');
  box.classList.remove('hidden');
  box.className = `mt-4 p-4 rounded-xl text-sm font-medium ${isCorrect ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`;
  box.innerHTML = `<strong>${isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse.'}</strong> ${q.explanation}`;

  // Change button to "Next"
  const btn = document.getElementById('validate-btn');
  const isLast = currentIndex === quizQuestions.length - 1;
  btn.disabled = false;
  btn.innerHTML = isLast ? 'Voir les résultats <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>' : 'Question suivante <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>';
  btn.onclick = isLast ? showResults : nextQuestion;
}

/* ===== NEXT QUESTION ===== */
function nextQuestion() {
  currentIndex++;
  renderQuestion();
}

/* ===== SHOW RESULTS ===== */
function showResults() {
  stopTimer();
  const pct = Math.round((score / quizQuestions.length) * 100);
  const subjectName = currentSubject === 'all' ? 'Toutes les matières' : SUBJECTS.find(s => s.id === currentSubject)?.name || '';
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  // Save session
  saveSession({
    subject: currentSubject,
    subjectName,
    correct: score,
    total: quizQuestions.length,
    percentage: pct,
    duration: timerSeconds,
    date: new Date().toISOString(),
  });

  const circumference = 2 * Math.PI * 56;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

  const main = document.getElementById('qcm-main');
  main.innerHTML = `
    <div class="text-center quiz-card">
      <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-8">Résultats de votre session</h2>

      <!-- Score circle -->
      <div class="flex justify-center mb-8">
        <div class="score-circle">
          <svg width="140" height="140">
            <circle cx="70" cy="70" r="56" fill="none" class="score-circle-bg" stroke-width="12"/>
            <circle cx="70" cy="70" r="56" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"
              stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" class="score-circle-fill"/>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-3xl font-black" style="color:${color}">${pct}%</span>
            <span class="text-xs text-gray-500">${score}/${quizQuestions.length}</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="flex justify-center gap-6 mb-8">
        <div class="bg-gray-50 rounded-xl px-5 py-3 text-center">
          <p class="text-lg font-bold text-gray-900">${subjectName}</p>
          <p class="text-xs text-gray-500">Matière</p>
        </div>
        <div class="bg-gray-50 rounded-xl px-5 py-3 text-center">
          <p class="text-lg font-bold text-gray-900">${minutes}m ${seconds.toString().padStart(2, '0')}s</p>
          <p class="text-xs text-gray-500">Durée</p>
        </div>
      </div>

      <!-- Detail -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 text-left mb-8">
        <h3 class="font-bold text-gray-900 mb-4">Détail des réponses</h3>
        <div class="space-y-3">
          ${answers.map((a, i) => `
            <div class="flex items-start gap-3 p-3 rounded-lg ${a.correct ? 'bg-green-50' : 'bg-red-50'}">
              <div class="w-6 h-6 rounded-full ${a.correct ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center shrink-0 mt-0.5">
                ${a.correct ? '<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>' : '<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>'}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900">${a.question.question}</p>
                <p class="text-xs ${a.correct ? 'text-green-600' : 'text-red-600'} mt-1">
                  ${a.correct ? 'Correct' : `Votre réponse : ${a.question.options[a.selected].text} — Bonne réponse : ${a.question.options.find(o=>o.correct).text}`}
                </p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button onclick="startQuiz('${currentSubject}')" class="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
          Recommencer
        </button>
        <button onclick="renderSubjectSelection(); renderHistory();" class="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors">
          Changer de matière
        </button>
      </div>
    </div>
  `;

  renderHistory();
}

/* ===== QUIT QUIZ ===== */
function quitQuiz() {
  stopTimer();
  renderSubjectSelection();
  renderHistory();
}

/* ===== RENDER HISTORY ===== */
function renderHistory() {
  const container = document.getElementById('qcm-history');
  if (!container) return;
  const stats = getStats();

  if (stats.sessions.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-400">
        <p class="text-sm">Aucune session terminée pour le moment.</p>
        <p class="text-xs mt-1">Lancez un QCM pour commencer !</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <h3 class="text-lg font-bold text-gray-900 mb-4">Historique des sessions</h3>
    <div class="space-y-3">
      ${stats.sessions.slice(0, 8).map(s => {
        const date = new Date(s.date);
        const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        const color = s.percentage >= 70 ? 'text-green-600 bg-green-50' : s.percentage >= 50 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
        return `
        <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
          <div>
            <p class="text-sm font-semibold text-gray-900">${s.subjectName}</p>
            <p class="text-xs text-gray-400">${dateStr} — ${s.correct}/${s.total}</p>
          </div>
          <span class="px-2.5 py-1 rounded-lg text-sm font-bold ${color}">${s.percentage}%</span>
        </div>`;
      }).join('')}
    </div>
    ${stats.sessions.length > 0 ? `
    <button onclick="if(confirm('Supprimer tout l\\'historique ?')){localStorage.removeItem('prepa-stats');renderSubjectSelection();renderHistory();}" class="mt-4 text-xs text-gray-400 hover:text-red-500 transition-colors">
      Effacer l'historique
    </button>` : ''}
  `;
}

document.addEventListener('DOMContentLoaded', initQCM);
