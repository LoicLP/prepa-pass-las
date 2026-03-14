/* ===== TABLEAU DE BORD ===== */

/* ========== DATA ========== */
function getDashQcmStats() {
  try { return JSON.parse(localStorage.getItem('prepa-qcm-stats')) || { sessions: [] }; }
  catch { return { sessions: [] }; }
}

function getDashExamStats() {
  try { return JSON.parse(localStorage.getItem('prepa-examen-stats')) || { sessions: [] }; }
  catch { return { sessions: [] }; }
}

/* ========== COLORS ========== */
const dashColors = {
  'anatomie':   { bg: 'bg-indigo-50',  text: 'text-indigo-700',  badge: 'bg-indigo-100 text-indigo-700',  bar: 'bg-indigo-500',  barHex: '#6366f1' },
  'chimie':     { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', barHex: '#10b981' },
  'biocell':    { bg: 'bg-violet-50',  text: 'text-violet-700',  badge: 'bg-violet-100 text-violet-700',  bar: 'bg-violet-500',  barHex: '#8b5cf6' },
  'biostats':   { bg: 'bg-cyan-50',    text: 'text-cyan-700',    badge: 'bg-cyan-100 text-cyan-700',    bar: 'bg-cyan-500',    barHex: '#06b6d4' },
  'biophysique':{ bg: 'bg-amber-50',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700',   bar: 'bg-amber-500',   barHex: '#f59e0b' },
  'ssh':        { bg: 'bg-rose-50',    text: 'text-rose-700',    badge: 'bg-rose-100 text-rose-700',    bar: 'bg-rose-500',    barHex: '#f43f5e' },
};

/* ========== HELPERS ========== */
function dashFormatDuration(seconds) {
  if (!seconds || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}min ${s}s` : `${m}min`;
}

function dashFormatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function dashScoreClass(pct) {
  if (pct >= 70) return 'text-emerald-600';
  if (pct >= 50) return 'text-amber-600';
  return 'text-red-500';
}

function dashScoreBarClass(pct) {
  if (pct >= 70) return 'bg-emerald-500';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function dashGetSubjectName(id) {
  const s = SUBJECTS.find(s => s.id === id);
  return s ? s.name : id;
}

/* ========== STATE ========== */
let dashActiveTab = 'qcm';

/* ========== MAIN RENDER ========== */
function renderDashboard() {
  const app = document.getElementById('dashboard-app');
  if (!app) return;

  const qcmStats = getDashQcmStats();
  const examStats = getDashExamStats();
  const allSessions = [...qcmStats.sessions, ...examStats.sessions];

  // Compute overview
  const totalQcm = qcmStats.sessions.length;
  const totalExam = examStats.sessions.length;
  const avgScore = allSessions.length > 0
    ? Math.round(allSessions.reduce((sum, s) => sum + (s.percentage || 0), 0) / allSessions.length)
    : 0;
  const totalTime = allSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  app.innerHTML = `
    <!-- Stats Overview -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      ${renderStatCard('QCM effectués', totalQcm, `<svg class="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"/></svg>`)}
      ${renderStatCard('Examens passés', totalExam, `<svg class="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"/></svg>`)}
      ${renderStatCard('Score moyen', avgScore + '%', `<svg class="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/></svg>`)}
      ${renderStatCard('Temps total', dashFormatDuration(totalTime), `<svg class="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`)}
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-8">
      <nav class="flex gap-1 overflow-x-auto sm:justify-center" id="dash-tabs">
        ${renderTab('qcm', 'QCM', false, '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"/></svg>')}
        ${renderTab('examens', 'Examens', false, '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"/></svg>')}
        ${renderTab('stats', 'Statistiques', false, '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>')}
        ${renderTab('progression', 'Progression', true, '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/></svg>')}
        ${renderTab('classement', 'Classement', true, '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.52.587 6.023 6.023 0 0 1-2.52-.587"/></svg>')}
      </nav>
    </div>

    <!-- Tab Content -->
    <div id="dash-tab-content"></div>
  `;

  // Bind tab clicks
  document.querySelectorAll('[data-dash-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      dashActiveTab = btn.dataset.dashTab;
      document.querySelectorAll('[data-dash-tab]').forEach(b => {
        b.classList.remove('bg-primary-600', 'text-white', 'shadow-md', 'shadow-primary-600/20');
        b.classList.add('text-gray-500', 'hover:bg-gray-50', 'hover:text-gray-700');
      });
      btn.classList.add('bg-primary-600', 'text-white', 'shadow-md', 'shadow-primary-600/20');
      btn.classList.remove('text-gray-500', 'hover:bg-gray-50', 'hover:text-gray-700');
      renderTabContent();
    });
  });

  renderTabContent();
}

/* ========== STAT CARD ========== */
function renderStatCard(label, value, iconSvg) {
  return `
    <div class="dash-stat bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div class="flex items-center gap-3 mb-2">
        ${iconSvg}
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">${label}</span>
      </div>
      <p class="text-2xl font-black text-gray-900">${value}</p>
    </div>
  `;
}

/* ========== TAB BUTTON ========== */
function renderTab(id, label, premium, icon) {
  const isActive = dashActiveTab === id;
  const activeClass = isActive
    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700';
  const lock = premium && !isPremium() ? '<svg class="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/></svg>' : '';
  return `<button data-dash-tab="${id}" class="dash-tab flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${activeClass}">${icon}<span>${label}</span>${lock}</button>`;
}

/* ========== TAB CONTENT ROUTER ========== */
function renderTabContent() {
  const container = document.getElementById('dash-tab-content');
  if (!container) return;

  switch (dashActiveTab) {
    case 'qcm': container.innerHTML = renderQcmHistory(); break;
    case 'examens': container.innerHTML = renderExamHistory(); break;
    case 'stats': container.innerHTML = renderStatistics(); break;
    case 'progression': container.innerHTML = renderProgression(); break;
    case 'classement': container.innerHTML = renderClassement(); break;
  }
}

/* ========== QCM HISTORY ========== */
function renderQcmHistory() {
  const sessions = getDashQcmStats().sessions;
  if (sessions.length === 0) {
    return renderEmptyState('Aucun QCM effectué', 'Commencez un QCM pour voir votre historique ici.', 'qcm.html');
  }

  const rows = sessions.map(s => {
    const colors = dashColors[s.subject] || dashColors['anatomie'];
    const pct = s.percentage || Math.round((s.correct / s.total) * 100);
    return `
      <tr class="border-b border-gray-50 hover:bg-gray-50/50">
        <td class="py-3 px-4 text-sm text-gray-500">${dashFormatDate(s.date)}</td>
        <td class="py-3 px-4"><span class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge}">${s.subjectName || dashGetSubjectName(s.subject)}</span></td>
        <td class="py-3 px-4 text-sm text-gray-700">${s.topic || '—'}</td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-2">
            <div class="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full ${dashScoreBarClass(pct)}" style="width:${pct}%"></div>
            </div>
            <span class="text-sm font-bold ${dashScoreClass(pct)}">${pct}%</span>
          </div>
        </td>
        <td class="py-3 px-4 text-sm text-gray-500">${dashFormatDuration(s.duration)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-100">
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Matière</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Thème</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Score</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Durée</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

/* ========== EXAM HISTORY ========== */
function renderExamHistory() {
  const sessions = getDashExamStats().sessions;
  if (sessions.length === 0) {
    return renderEmptyState('Aucun examen effectué', 'Passez un examen pour voir votre historique ici.', 'examen.html');
  }

  const rows = sessions.map(s => {
    const colors = dashColors[s.subject] || dashColors['anatomie'];
    const pct = s.percentage || Math.round((s.correct / s.total) * 100);
    return `
      <tr class="border-b border-gray-50 hover:bg-gray-50/50">
        <td class="py-3 px-4 text-sm text-gray-500">${dashFormatDate(s.date)}</td>
        <td class="py-3 px-4"><span class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge}">${s.subjectName || dashGetSubjectName(s.subject)}</span></td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-2">
            <div class="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full ${dashScoreBarClass(pct)}" style="width:${pct}%"></div>
            </div>
            <span class="text-sm font-bold ${dashScoreClass(pct)}">${pct}%</span>
          </div>
        </td>
        <td class="py-3 px-4 text-sm text-gray-500">${s.correct}/${s.total}</td>
        <td class="py-3 px-4 text-sm text-gray-500">${dashFormatDuration(s.duration)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-100">
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Matière</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Score</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Résultat</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Durée</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

/* ========== STATISTICS ========== */
function renderStatistics() {
  const qcmSessions = getDashQcmStats().sessions;
  const examSessions = getDashExamStats().sessions;
  const allSessions = [...qcmSessions, ...examSessions];

  if (allSessions.length === 0) {
    return renderEmptyState('Aucune statistique disponible', 'Effectuez des QCM ou examens pour voir vos statistiques.', 'qcm.html');
  }

  // Aggregate by subject
  const subjectData = {};
  SUBJECTS.forEach(s => {
    subjectData[s.id] = { name: s.name, sessions: 0, totalScore: 0, bestScore: 0, totalTime: 0 };
  });

  allSessions.forEach(s => {
    const id = s.subject;
    if (!subjectData[id]) return;
    subjectData[id].sessions++;
    const pct = s.percentage || Math.round((s.correct / s.total) * 100);
    subjectData[id].totalScore += pct;
    subjectData[id].bestScore = Math.max(subjectData[id].bestScore, pct);
    subjectData[id].totalTime += (s.duration || 0);
  });

  // Find max sessions for bar chart scaling
  const maxSessions = Math.max(...Object.values(subjectData).map(d => d.sessions), 1);

  // Bar chart
  const bars = SUBJECTS.map(s => {
    const data = subjectData[s.id];
    const colors = dashColors[s.id];
    const avg = data.sessions > 0 ? Math.round(data.totalScore / data.sessions) : 0;
    const barWidth = Math.round((data.sessions / maxSessions) * 100);
    return `
      <div class="flex items-center gap-3 mb-3">
        <span class="w-28 text-sm font-medium text-gray-700 text-right truncate">${s.name}</span>
        <div class="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden relative">
          <div class="h-full rounded-full ${colors.bar} transition-all" style="width:${barWidth}%"></div>
          <span class="absolute inset-y-0 left-3 flex items-center text-xs font-bold ${data.sessions > 0 ? 'text-white' : 'text-gray-400'}">${data.sessions} session${data.sessions > 1 ? 's' : ''}</span>
        </div>
        <span class="w-14 text-sm font-bold ${dashScoreClass(avg)} text-right">${avg > 0 ? avg + '%' : '—'}</span>
      </div>
    `;
  }).join('');

  // Subject detail cards
  const cards = SUBJECTS.map(s => {
    const data = subjectData[s.id];
    const colors = dashColors[s.id];
    const avg = data.sessions > 0 ? Math.round(data.totalScore / data.sessions) : 0;
    return `
      <div class="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center">
            <span class="text-sm">${s.icon}</span>
          </div>
          <h4 class="text-sm font-bold text-gray-900">${s.name}</h4>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Sessions</span>
            <span class="font-semibold text-gray-900">${data.sessions}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Score moyen</span>
            <span class="font-semibold ${dashScoreClass(avg)}">${avg > 0 ? avg + '%' : '—'}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Meilleur score</span>
            <span class="font-semibold ${dashScoreClass(data.bestScore)}">${data.bestScore > 0 ? data.bestScore + '%' : '—'}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Temps total</span>
            <span class="font-semibold text-gray-900">${dashFormatDuration(data.totalTime)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="space-y-8">
      <!-- Bar chart -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-5">Répartition par matière</h3>
        ${bars}
      </div>
      <!-- Detail cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${cards}
      </div>
    </div>
  `;
}

/* ========== PROGRESSION (PREMIUM+) ========== */
function renderProgression() {
  if (!isPremium()) {
    return renderPremiumLock('Suivi de progression avancé', 'Visualisez l\'évolution de vos scores et votre calendrier d\'activité avec Premium+.');
  }

  const qcmSessions = getDashQcmStats().sessions;
  const examSessions = getDashExamStats().sessions;
  const allSessions = [...qcmSessions, ...examSessions]
    .filter(s => s.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (allSessions.length === 0) {
    return renderEmptyState('Aucune donnée de progression', 'Effectuez des QCM ou examens pour suivre votre progression.', 'qcm.html');
  }

  // SVG line chart
  const chartWidth = 700;
  const chartHeight = 200;
  const padding = 40;
  const innerW = chartWidth - padding * 2;
  const innerH = chartHeight - padding * 2;

  const points = allSessions.map((s, i) => {
    const x = padding + (allSessions.length > 1 ? (i / (allSessions.length - 1)) * innerW : innerW / 2);
    const pct = s.percentage || Math.round((s.correct / s.total) * 100);
    const y = padding + innerH - (pct / 100) * innerH;
    return { x, y, pct, date: s.date };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  // Moving average (3 sessions)
  const movingAvg = points.map((p, i) => {
    const start = Math.max(0, i - 2);
    const slice = points.slice(start, i + 1);
    const avg = slice.reduce((sum, pt) => sum + pt.pct, 0) / slice.length;
    const y = padding + innerH - (avg / 100) * innerH;
    return `${p.x},${y}`;
  }).join(' ');

  // Activity heatmap (last 30 days)
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 29);
  const dayMap = {};
  allSessions.forEach(s => {
    const d = new Date(s.date).toISOString().split('T')[0];
    dayMap[d] = (dayMap[d] || 0) + 1;
  });

  const heatmapDays = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split('T')[0];
    const count = dayMap[key] || 0;
    heatmapDays.push({ date: d, count, key });
  }

  const maxCount = Math.max(...heatmapDays.map(d => d.count), 1);
  const heatmapCells = heatmapDays.map(d => {
    let bg = 'bg-gray-100';
    if (d.count > 0) {
      const intensity = d.count / maxCount;
      if (intensity > 0.66) bg = 'bg-primary-500';
      else if (intensity > 0.33) bg = 'bg-primary-300';
      else bg = 'bg-primary-100';
    }
    return `<div class="w-6 h-6 rounded ${bg}" title="${d.date.getDate()}/${d.date.getMonth()+1} : ${d.count} session${d.count > 1 ? 's' : ''}"></div>`;
  }).join('');

  return `
    <div class="space-y-8">
      <!-- Score evolution chart -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Évolution des scores</h3>
        <div class="overflow-x-auto">
          <svg viewBox="0 0 ${chartWidth} ${chartHeight}" class="w-full" style="min-width:400px">
            <!-- Grid lines -->
            <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + innerH}" stroke="#e5e7eb" stroke-width="1"/>
            <line x1="${padding}" y1="${padding + innerH}" x2="${padding + innerW}" y2="${padding + innerH}" stroke="#e5e7eb" stroke-width="1"/>
            ${[0, 25, 50, 75, 100].map(v => {
              const y = padding + innerH - (v / 100) * innerH;
              return `<line x1="${padding}" y1="${y}" x2="${padding + innerW}" y2="${y}" stroke="#f3f4f6" stroke-width="1"/>
                      <text x="${padding - 8}" y="${y + 4}" text-anchor="end" fill="#9ca3af" font-size="11">${v}%</text>`;
            }).join('')}
            <!-- Moving average -->
            <polyline points="${movingAvg}" fill="none" stroke="#c7d2fe" stroke-width="2.5" stroke-dasharray="6,4"/>
            <!-- Score line -->
            <polyline points="${polyline}" fill="none" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Points -->
            ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#4f46e5" stroke="white" stroke-width="2"/>`).join('')}
          </svg>
        </div>
        <div class="flex items-center gap-6 mt-3 text-xs text-gray-400">
          <span class="flex items-center gap-1.5"><span class="w-4 h-0.5 bg-primary-600 rounded"></span>Score par session</span>
          <span class="flex items-center gap-1.5"><span class="w-4 h-0.5 bg-primary-200 rounded" style="border:1px dashed #c7d2fe"></span>Moyenne mobile</span>
        </div>
      </div>

      <!-- Activity heatmap -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Activité des 30 derniers jours</h3>
        <div class="flex flex-wrap gap-1.5">
          ${heatmapCells}
        </div>
        <div class="flex items-center gap-3 mt-4 text-xs text-gray-400">
          <span>Moins</span>
          <div class="flex gap-1">
            <div class="w-4 h-4 rounded bg-gray-100"></div>
            <div class="w-4 h-4 rounded bg-primary-100"></div>
            <div class="w-4 h-4 rounded bg-primary-300"></div>
            <div class="w-4 h-4 rounded bg-primary-500"></div>
          </div>
          <span>Plus</span>
        </div>
      </div>
    </div>
  `;
}

/* ========== CLASSEMENT (PREMIUM+) ========== */
function renderClassement() {
  if (!isPremium()) {
    return renderPremiumLock('Classement et comparaison', 'Comparez vos performances avec les autres étudiants grâce à Premium+.');
  }

  const qcmSessions = getDashQcmStats().sessions;
  const examSessions = getDashExamStats().sessions;
  const allSessions = [...qcmSessions, ...examSessions];

  const userAvg = allSessions.length > 0
    ? Math.round(allSessions.reduce((sum, s) => sum + (s.percentage || 0), 0) / allSessions.length)
    : 0;
  const userSessions = allSessions.length;

  // Simulated leaderboard
  const fakeUsers = [
    { name: 'Emma L.', avg: 88, sessions: 142 },
    { name: 'Lucas M.', avg: 85, sessions: 128 },
    { name: 'Chloé B.', avg: 82, sessions: 115 },
    { name: 'Hugo D.', avg: 79, sessions: 98 },
    { name: 'Léa R.', avg: 76, sessions: 87 },
    { name: 'Nathan P.', avg: 73, sessions: 76 },
    { name: 'Camille V.', avg: 70, sessions: 65 },
    { name: 'Théo G.', avg: 67, sessions: 54 },
    { name: 'Manon S.', avg: 63, sessions: 42 },
    { name: 'Raphaël K.', avg: 58, sessions: 31 },
  ];

  // Insert user into ranking
  const allRanked = [...fakeUsers, { name: 'Vous', avg: userAvg, sessions: userSessions, isUser: true }]
    .sort((a, b) => b.avg - a.avg);

  const userRank = allRanked.findIndex(u => u.isUser) + 1;
  const totalParticipants = allRanked.length;
  const percentile = Math.round(((totalParticipants - userRank) / totalParticipants) * 100);

  const rows = allRanked.map((u, i) => {
    const rank = i + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`;
    const highlight = u.isUser ? 'bg-primary-50 border-primary-200 font-bold' : 'border-gray-50';
    return `
      <tr class="border-b ${highlight} hover:bg-gray-50/50">
        <td class="py-3 px-4 text-center text-lg">${medal}</td>
        <td class="py-3 px-4 text-sm ${u.isUser ? 'text-primary-700 font-bold' : 'text-gray-700'}">${u.name}</td>
        <td class="py-3 px-4">
          <span class="text-sm font-bold ${dashScoreClass(u.avg)}">${u.avg}%</span>
        </td>
        <td class="py-3 px-4 text-sm text-gray-500">${u.sessions}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="space-y-6">
      <!-- Your position -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Votre position</p>
            <p class="text-3xl font-black text-gray-900">${userRank}<span class="text-lg text-gray-400">/${totalParticipants}</span></p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Percentile</p>
            <p class="text-3xl font-black text-primary-600">Top ${100 - percentile}%</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Score moyen</p>
            <p class="text-3xl font-black ${dashScoreClass(userAvg)}">${userAvg}%</p>
          </div>
        </div>
      </div>

      <!-- Leaderboard -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50/80 border-b border-gray-100">
                <th class="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">Rang</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Étudiant</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Score moy.</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sessions</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>

      <p class="text-xs text-gray-400 text-center italic">* Classement simulé à des fins de démonstration</p>
    </div>
  `;
}

/* ========== PREMIUM LOCK OVERLAY ========== */
function renderPremiumLock(title, description) {
  return `
    <div class="relative">
      <!-- Blurred fake content behind -->
      <div class="premium-blur">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-64">
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div class="h-3 bg-gray-100 rounded w-full mb-2"></div>
          <div class="h-3 bg-gray-100 rounded w-5/6 mb-2"></div>
          <div class="h-3 bg-gray-100 rounded w-2/3 mb-6"></div>
          <div class="grid grid-cols-3 gap-3">
            <div class="h-16 bg-gray-100 rounded-lg"></div>
            <div class="h-16 bg-gray-100 rounded-lg"></div>
            <div class="h-16 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
      <!-- Lock overlay -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-8 max-w-sm mx-4">
          <div class="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">${title}</h3>
          <p class="text-sm text-gray-500 mb-5">${description}</p>
          <a href="tarifs.html" class="inline-flex px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25">
            Découvrir Premium+
          </a>
        </div>
      </div>
    </div>
  `;
}

/* ========== EMPTY STATE ========== */
function renderEmptyState(title, description, ctaHref) {
  return `
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"/>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">${title}</h3>
      <p class="text-sm text-gray-500 mb-5">${description}</p>
      <a href="${ctaHref}" class="inline-flex px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25">
        Commencer maintenant
      </a>
    </div>
  `;
}

/* ========== INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
});
