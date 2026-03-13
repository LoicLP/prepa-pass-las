/* ===== SHARED COMPONENTS ===== */

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

function getNavActiveClass(page) {
  return currentPage === page ? 'text-primary-600 font-semibold' : 'text-gray-600 font-medium hover:text-primary-600 transition-colors';
}

function renderHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  header.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-18">
        <a href="index.html" class="flex items-center gap-2.5">
          <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
          <div>
            <span class="text-xl font-extrabold text-gray-900">Prépa <span class="text-primary-600">PASS/LAS</span></span>
            <p class="text-[10px] font-semibold text-gray-400 tracking-wider uppercase -mt-0.5">Votre réussite en santé</p>
          </div>
        </a>
        <nav class="hidden md:flex items-center gap-8">
          <a href="index.html" class="text-sm ${getNavActiveClass('index.html')}">Accueil</a>
          <a href="qcm.html" class="text-sm ${getNavActiveClass('qcm.html')}">QCM</a>
          <a href="fiches.html" class="text-sm ${getNavActiveClass('fiches.html')}">Fiches/Cours</a>
          <a href="examen.html" class="text-sm ${getNavActiveClass('examen.html')}">Mode Examen</a>
          <a href="programme.html" class="text-sm ${getNavActiveClass('programme.html')}">Programme</a>
          <a href="blog.html" class="text-sm ${getNavActiveClass('blog.html')}">Blog</a>
          <a href="tarifs.html" class="text-sm ${getNavActiveClass('tarifs.html')}">Tarifs</a>
        </nav>
        <div class="flex items-center gap-3">
          <a href="dashboard.html" class="hidden sm:inline-flex px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25">
            Mon tableau de bord
          </a>
          <button id="mobile-menu-btn" class="md:hidden p-2 text-gray-600 hover:text-primary-600" aria-label="Menu">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-gray-100 px-4 pb-4">
      <a href="index.html" class="block py-3 text-sm font-medium text-gray-700 hover:text-primary-600">Accueil</a>
      <a href="qcm.html" class="block py-3 text-sm font-medium text-gray-700 hover:text-primary-600">QCM</a>
      <a href="fiches.html" class="block py-3 text-sm font-medium text-gray-700 hover:text-primary-600">Fiches/Cours</a>
      <a href="examen.html" class="block py-3 text-sm font-medium text-gray-700 hover:text-primary-600">Mode Examen</a>
      <a href="programme.html" class="block py-3 text-sm font-medium text-gray-700 hover:text-primary-600">Programme</a>
      <a href="blog.html" class="block py-3 text-sm font-medium text-gray-700 hover:text-primary-600">Blog</a>
      <a href="tarifs.html" class="block py-3 text-sm font-medium text-gray-700 hover:text-primary-600">Tarifs</a>
      <a href="dashboard.html" class="block mt-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl text-center">Mon tableau de bord</a>
    </div>
  `;
  // Mobile menu toggle
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => menu.classList.add('hidden'));
    });
  }
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-3 gap-10">
        <div>
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <span class="text-lg font-bold text-white">Prépa <span class="text-primary-400">PASS/LAS</span></span>
          </div>
          <p class="text-sm leading-relaxed">La plateforme d'entraînement de référence pour la réussite du concours PASS/LAS en première année de santé.</p>
        </div>
        <div>
          <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4">Ressources Santé</h4>
          <ul class="space-y-2.5 text-sm">
            <li><a href="programme.html" class="hover:text-primary-400 transition-colors">Programme PASS 2025-2026</a></li>
            <li><a href="blog.html" class="hover:text-primary-400 transition-colors">Guide PASS vs LAS</a></li>
            <li><a href="qcm.html" class="hover:text-primary-400 transition-colors">QCM d'entraînement</a></li>
            <li><a href="fiches.html" class="hover:text-primary-400 transition-colors">Fiches de révision</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4">Légal</h4>
          <ul class="space-y-2.5 text-sm">
            <li><a href="#" class="hover:text-primary-400 transition-colors">Mentions légales</a></li>
            <li><a href="#" class="hover:text-primary-400 transition-colors">Politique de confidentialité</a></li>
            <li><a href="#" class="hover:text-primary-400 transition-colors">CGV</a></li>
          </ul>
        </div>
      </div>
      <div class="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; 2026 Prépa PASS/LAS. Tous droits réservés.
      </div>
    </div>
  `;
}

/* ===== FAQ TOGGLE ===== */
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const chevron = btn.querySelector('.faq-chevron');
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-chevron').forEach(c => c.classList.remove('open'));
  if (!isOpen) {
    answer.classList.add('open');
    chevron.classList.add('open');
  }
}

/* ===== STATS HELPERS ===== */
function getStats() {
  return JSON.parse(localStorage.getItem('prepa-stats') || '{"sessions":[],"totalCorrect":0,"totalAnswered":0}');
}

function saveSession(session) {
  const stats = getStats();
  stats.sessions.unshift(session);
  if (stats.sessions.length > 20) stats.sessions = stats.sessions.slice(0, 20);
  stats.totalCorrect += session.correct;
  stats.totalAnswered += session.total;
  localStorage.setItem('prepa-stats', JSON.stringify(stats));
}

/* ===== PREMIUM HELPERS ===== */
function isPremium() {
  return localStorage.getItem('prepa-premium') === 'true';
}

function setPremium(value) {
  localStorage.setItem('prepa-premium', value ? 'true' : 'false');
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
});
