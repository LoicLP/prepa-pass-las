/* ===== COURS DÉTAILLÉ ENGINE ===== */

const coursColors = {
  'indigo': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500', icon: 'text-indigo-500', accent: '#4f46e5' },
  'primary': { bg: 'bg-primary-50', border: 'border-primary-200', text: 'text-primary-700', badge: 'bg-primary-100 text-primary-700', bar: 'bg-primary-500', icon: 'text-primary-500', accent: '#4f46e5' },
  'emerald': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', icon: 'text-emerald-500', accent: '#059669' },
  'violet': { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500', icon: 'text-violet-500', accent: '#7c3aed' },
  'cyan': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700', bar: 'bg-cyan-500', icon: 'text-cyan-500', accent: '#0891b2' },
  'amber': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500', icon: 'text-amber-500', accent: '#d97706' },
  'rose': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700', bar: 'bg-rose-500', icon: 'text-rose-500', accent: '#e11d48' },
};

const coursIcons = {
  'anatomie': '<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>',
  'chimie': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
  'biocell': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/>',
  'biostats': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>',
  'biophysique': '<path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"/>',
  'ssh': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>',
};

function initCours() {
  // Check premium
  if (!isPremium()) {
    renderPremiumWall();
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const ficheId = params.get('id');

  if (!ficheId) {
    window.location.href = 'fiches.html';
    return;
  }

  const fiche = FICHES_DATA.find(f => f.id === ficheId);
  const cours = COURS_DATA[ficheId];

  if (!fiche) {
    window.location.href = 'fiches.html';
    return;
  }

  if (!cours) {
    renderNoCours(fiche);
    return;
  }

  renderCours(fiche, cours);
  initScrollProgress();
  initTocHighlight();
}

function renderPremiumWall() {
  const app = document.getElementById('cours-app');
  app.innerHTML = `
    <section class="pt-28 pb-20">
      <div class="max-w-lg mx-auto px-4 text-center">
        <div class="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-black text-gray-900 mb-3">Contenu réservé aux membres Premium</h1>
        <p class="text-gray-500 mb-8">Les cours détaillés sont accessibles uniquement avec un abonnement Premium. Profitez d'explications approfondies pour chaque sujet.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="tarifs.html" class="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
            Voir les offres Premium
          </a>
          <a href="fiches.html" class="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors">
            Retour aux fiches
          </a>
        </div>
      </div>
    </section>
  `;
}

function renderNoCours(fiche) {
  const subject = SUBJECTS.find(s => s.id === fiche.subject);
  const app = document.getElementById('cours-app');
  app.innerHTML = `
    <section class="pt-28 pb-20">
      <div class="max-w-lg mx-auto px-4 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-black text-gray-900 mb-3">Cours bientôt disponible</h1>
        <p class="text-gray-500 mb-8">Le cours détaillé pour « ${fiche.title} » est en cours de rédaction. Revenez bientôt !</p>
        <a href="fiches.html" class="inline-flex px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
          Retour aux fiches
        </a>
      </div>
    </section>
  `;
}

function renderCours(fiche, cours) {
  const subject = SUBJECTS.find(s => s.id === fiche.subject);
  const colors = coursColors[subject?.color] || coursColors['primary'];
  const icon = coursIcons[fiche.subject] || '';
  const accentColor = colors.accent || '#4f46e5';

  // Build table of contents from sections
  const tocItems = cours.sections.map((sec, i) => `
    <a href="#section-${i}" class="toc-link group flex items-center gap-3 pl-4 py-2 text-sm text-gray-500 border-l-2 border-gray-200 hover:text-gray-900 hover:border-gray-400 rounded-r-lg" data-section="section-${i}">
      <span class="w-5 h-5 rounded-md bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:text-gray-600 shrink-0 transition-colors">${i + 1}</span>
      <span class="truncate">${sec.title}</span>
    </a>
  `).join('');

  // Build sections content
  const sectionsHtml = cours.sections.map((sec, i) => `
    <div id="section-${i}" class="cours-section section-card p-6 md:p-8 mb-6" style="animation-delay:${i * 0.08}s">
      <div class="flex items-start gap-4 mb-5">
        <span class="w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border-2 flex items-center justify-center text-sm font-black ${colors.text} shrink-0">${i + 1}</span>
        <div>
          <h3 class="text-lg md:text-xl font-bold text-gray-900 leading-tight">${sec.title}</h3>
          <p class="text-xs text-gray-400 mt-1">Section ${i + 1} sur ${cours.sections.length}</p>
        </div>
      </div>
      <div class="prose prose-gray max-w-none text-gray-700 leading-relaxed text-[15px] pl-0 md:pl-14">
        ${sec.content}
      </div>
    </div>
  `).join('');

  // Navigation dots for mobile TOC
  const mobileDotsHtml = cours.sections.map((sec, i) => `
    <a href="#section-${i}" class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors
      ${i === 0 ? colors.bg + ' ' + colors.text + ' ' + colors.border + ' border' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}"
      data-mobile-dot="section-${i}">
      <span class="w-4 h-4 rounded-md ${i === 0 ? colors.bg : 'bg-gray-100'} flex items-center justify-center text-[9px] font-bold">${i + 1}</span>
      ${sec.title.length > 20 ? sec.title.substring(0, 20) + '…' : sec.title}
    </a>
  `).join('');

  const app = document.getElementById('cours-app');
  app.innerHTML = `
    <!-- Hero dark -->
    <section class="cours-hero-dark relative pt-24 pb-10 md:pt-28 md:pb-14 overflow-hidden">
      <!-- Decorative elements -->
      <div class="cours-blob w-[400px] h-[400px] bg-indigo-500/10 top-[-100px] right-[-100px]"></div>
      <div class="cours-blob w-[300px] h-[300px] bg-violet-500/10 bottom-[-80px] left-[-80px]"></div>
      <div class="cours-geo-circle w-44 h-44 top-20 right-[8%] hidden lg:block"></div>
      <div class="cours-geo-ring w-64 h-64 -bottom-20 left-[4%] hidden lg:block"></div>
      <div class="cours-geo-circle w-20 h-20 bottom-16 right-[30%] hidden lg:block"></div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 mb-6">
          <a href="fiches.html" class="breadcrumb-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70 hover:text-white hover:bg-white/12 transition-all">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
            Fiches
          </a>
          <svg class="w-3.5 h-3.5 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
          <span class="breadcrumb-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70">
            <svg class="w-3.5 h-3.5 ${colors.icon}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">${icon}</svg>
            ${subject?.name || ''}
          </span>
        </nav>

        <div class="grid lg:grid-cols-[1fr,auto] gap-8 items-end">
          <div>
            <!-- Badges -->
            <div class="flex flex-wrap items-center gap-2 mb-4">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/15 text-amber-300 text-xs font-bold rounded-full border border-amber-400/20">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                Premium
              </span>
              <span class="px-3 py-1 bg-white/8 text-white/60 text-xs font-semibold rounded-full border border-white/10">${subject?.name || ''}</span>
            </div>

            <!-- Title -->
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-3">${fiche.title}</h1>
            <p class="text-white/50 text-sm md:text-base max-w-2xl leading-relaxed">${cours.introduction || fiche.summary}</p>
          </div>

          <!-- Stats pills (desktop) -->
          <div class="hidden lg:flex flex-col gap-3">
            <div class="hero-stat-pill flex items-center gap-3 px-4 py-2.5 rounded-xl">
              <svg class="w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
              <div>
                <p class="text-white text-sm font-bold">~${cours.readTime || 15} min</p>
                <p class="text-white/40 text-[10px]">Temps de lecture</p>
              </div>
            </div>
            <div class="hero-stat-pill flex items-center gap-3 px-4 py-2.5 rounded-xl">
              <svg class="w-4 h-4 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
              <div>
                <p class="text-white text-sm font-bold">${cours.sections.length} sections</p>
                <p class="text-white/40 text-[10px]">Chapitres du cours</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile stats -->
        <div class="flex items-center gap-4 mt-5 lg:hidden">
          <div class="hero-stat-pill flex items-center gap-2 px-3 py-2 rounded-lg">
            <svg class="w-3.5 h-3.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
            <span class="text-white/70 text-xs font-medium">~${cours.readTime || 15} min</span>
          </div>
          <div class="hero-stat-pill flex items-center gap-2 px-3 py-2 rounded-lg">
            <svg class="w-3.5 h-3.5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
            <span class="text-white/70 text-xs font-medium">${cours.sections.length} sections</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Mobile TOC (horizontal scroll) -->
    <div class="lg:hidden sticky top-[68px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 px-4 overflow-x-auto">
      <div class="flex items-center gap-2" id="mobile-toc">
        ${mobileDotsHtml}
      </div>
    </div>

    <!-- Content -->
    <section class="py-8 md:py-10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-8">
          <!-- Sidebar TOC (desktop) -->
          <aside class="hidden lg:block w-60 shrink-0">
            <div class="sticky top-24">
              <div class="toc-card p-5">
                <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                  <div class="w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center">
                    <svg class="w-4 h-4 ${colors.icon}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">${icon}</svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-900">Sommaire</p>
                    <p class="text-[10px] text-gray-400">${cours.sections.length} chapitres</p>
                  </div>
                </div>
                <nav class="space-y-0.5" id="toc-nav">
                  ${tocItems}
                </nav>
              </div>
              <div class="mt-4">
                <a href="fiches.html" class="back-fab flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
                  Retour aux fiches
                </a>
              </div>
            </div>
          </aside>

          <!-- Main content -->
          <main class="flex-1 min-w-0 cours-content">
            ${sectionsHtml}

            <!-- Bottom nav -->
            <div class="mt-8 pt-8 border-t border-gray-200">
              <div class="flex flex-col sm:flex-row gap-3 justify-between">
                <a href="fiches.html" class="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all text-sm shadow-sm">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
                  Toutes les fiches
                </a>
                <button onclick="window.scrollTo({top:0,behavior:'smooth'})" class="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all text-sm shadow-lg shadow-gray-900/10">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"/></svg>
                  Revenir en haut
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  `;
}

/* ===== SCROLL PROGRESS BAR ===== */
function initScrollProgress() {
  window.addEventListener('scroll', () => {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    bar.style.width = progress + '%';
  });
}

/* ===== TOC HIGHLIGHT ON SCROLL ===== */
function initTocHighlight() {
  const tocLinks = document.querySelectorAll('#toc-nav .toc-link');
  if (tocLinks.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`#toc-nav [data-section="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-100px 0px -60% 0px', threshold: 0 });

  document.querySelectorAll('.cours-section').forEach(section => {
    observer.observe(section);
  });
}

document.addEventListener('DOMContentLoaded', initCours);
