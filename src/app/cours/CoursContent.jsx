'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loadCoursForFiche } from '@/data/cours';
import { usePremium } from '@/contexts/PremiumContext';
import { FICHES_DATA } from '@/data/fiches';
import { SUBJECTS } from '@/data/subjects';
import { SUBJECT_COLORS, getSubjectName } from '@/data/constants';

const SUBJECT_ICONS = {
  anatomie: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z',
  chimie: 'M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5',
  biocell: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z',
  biostats: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  biophysique: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
  ssh: 'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
};

export default function CoursContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { isPremium, isLoaded } = usePremium();

  const [cours, setCours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const sectionsRef = useRef([]);

  const fiche = FICHES_DATA.find(f => f.id === id);
  const subjectId = fiche?.subject;
  const subjectName = subjectId ? getSubjectName(subjectId) : '';
  const subjectObj = subjectId ? SUBJECTS.find(s => s.id === subjectId) : null;
  const colors = SUBJECT_COLORS[subjectObj?.color] || SUBJECT_COLORS.indigo;
  const iconPath = subjectId ? SUBJECT_ICONS[subjectId] || '' : '';

  /* ---------- Load cours data ---------- */
  useEffect(() => {
    if (!id || !isPremium || !isLoaded) return;
    setLoading(true);
    loadCoursForFiche(id).then((data) => {
      setCours(data);
      setLoading(false);
    }).catch(() => {
      setCours(null);
      setLoading(false);
    });
  }, [id, isPremium, isLoaded]);

  /* ---------- Scroll progress bar ---------- */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ---------- TOC IntersectionObserver ---------- */
  useEffect(() => {
    if (!cours?.sections) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );

    const sectionEls = document.querySelectorAll('[data-cours-section]');
    sectionEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [cours]);

  /* ---------- GUARDS ---------- */
  if (!isLoaded) {
    return (
      <div className="pt-28 pb-16 text-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
          <div className="w-64 h-6 bg-gray-200 rounded-lg" />
          <div className="w-96 h-4 bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  /* No id */
  if (!id || !fiche) {
    return (
      <section className="pt-28 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">Cours introuvable</h1>
          <p className="text-gray-500 mb-8">Le cours demande n&apos;existe pas.</p>
          <Link href="/fiches" className="inline-flex px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
            Retour aux fiches
          </Link>
        </div>
      </section>
    );
  }

  /* Premium wall */
  if (!isPremium) {
    return (
      <section className="pt-28 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">Contenu reserve aux membres Premium</h1>
          <p className="text-gray-500 mb-8">Les cours detailles sont accessibles uniquement avec un abonnement Premium. Profitez d&apos;explications approfondies pour chaque sujet.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tarifs" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
              Voir les offres Premium
            </Link>
            <Link href="/fiches" className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-colors">
              Retour aux fiches
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* Loading */
  if (loading) {
    return (
      <div className="pt-28 pb-16 text-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
          <div className="w-64 h-6 bg-gray-200 rounded-lg" />
          <div className="w-96 h-4 bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  /* No cours data */
  if (!cours) {
    return (
      <section className="pt-28 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">Cours bientot disponible</h1>
          <p className="text-gray-500 mb-8">Le cours detaille pour &laquo; {fiche.title} &raquo; est en cours de redaction. Revenez bientot !</p>
          <Link href="/fiches" className="inline-flex px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
            Retour aux fiches
          </Link>
        </div>
      </section>
    );
  }

  /* ====== MAIN RENDER ====== */
  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-[64px] left-0 right-0 z-40 h-1 bg-gray-100">
        <div
          className="h-full bg-indigo-500 rounded-r-full transition-[width] duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ====== HERO ====== */}
      <section className="relative pt-24 pb-10 md:pt-28 md:pb-14 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #3730a3 70%, #4338ca 100%)' }}>
        {/* Decorative blobs */}
        <div className="absolute w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] -top-[100px] -right-[100px] pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] -bottom-[80px] -left-[80px] pointer-events-none" />
        <div className="absolute w-44 h-44 rounded-full border-[1.5px] border-white/[0.06] top-20 right-[8%] hidden lg:block pointer-events-none" />
        <div className="absolute w-64 h-64 rounded-full border-[1.5px] border-dashed border-white/[0.08] -bottom-20 left-[4%] hidden lg:block pointer-events-none" />
        <div className="absolute w-20 h-20 rounded-full border-[1.5px] border-white/[0.06] bottom-16 right-[30%] hidden lg:block pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6">
            <Link
              href="/fiches"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70 hover:text-white bg-white/[0.08] border border-white/[0.12] backdrop-blur-lg hover:bg-white/[0.12] transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Fiches
            </Link>
            <svg className="w-3.5 h-3.5 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70 bg-white/[0.08] border border-white/[0.12] backdrop-blur-lg">
              <svg className={`w-3.5 h-3.5 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
              </svg>
              {subjectName}
            </span>
          </nav>

          <div className="grid lg:grid-cols-[1fr,auto] gap-8 items-end">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/15 text-amber-300 text-xs font-bold rounded-full border border-amber-400/20">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Premium
                </span>
                <span className="px-3 py-1 bg-white/[0.08] text-white/60 text-xs font-semibold rounded-full border border-white/10">
                  {subjectName}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-3">
                {fiche.title}
              </h1>
              <p className="text-white/50 text-sm md:text-base max-w-2xl leading-relaxed">
                {cours.introduction || fiche.summary}
              </p>
            </div>

            {/* Stats pills (desktop) */}
            <div className="hidden lg:flex flex-col gap-3">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10">
                <svg className="w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <div>
                  <p className="text-white text-sm font-bold">~{cours.readTime || 15} min</p>
                  <p className="text-white/40 text-[10px]">Temps de lecture</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10">
                <svg className="w-4 h-4 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <div>
                  <p className="text-white text-sm font-bold">{cours.sections.length} sections</p>
                  <p className="text-white/40 text-[10px]">Chapitres du cours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile stats */}
          <div className="flex items-center gap-4 mt-5 lg:hidden">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10">
              <svg className="w-3.5 h-3.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span className="text-white/70 text-xs font-medium">~{cours.readTime || 15} min</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10">
              <svg className="w-3.5 h-3.5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <span className="text-white/70 text-xs font-medium">{cours.sections.length} sections</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== MOBILE TOC (horizontal scroll) ====== */}
      <div className="lg:hidden sticky top-[68px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 px-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          {cours.sections.map((sec, i) => {
            const sectionId = `section-${i}`;
            const isActive = activeSection === sectionId;
            return (
              <a
                key={sectionId}
                href={`#${sectionId}`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                  isActive
                    ? `${colors.bg} ${colors.text} ${colors.border} border`
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`w-4 h-4 rounded-md ${isActive ? colors.bg : 'bg-gray-100'} flex items-center justify-center text-[9px] font-bold`}>
                  {i + 1}
                </span>
                {sec.title.length > 20 ? sec.title.substring(0, 20) + '\u2026' : sec.title}
              </a>
            );
          })}
        </div>
      </div>

      {/* ====== CONTENT ====== */}
      <section className="py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar TOC (desktop) */}
            <aside className="hidden lg:block w-60 shrink-0">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <svg className={`w-4 h-4 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Sommaire</p>
                      <p className="text-[10px] text-gray-400">{cours.sections.length} chapitres</p>
                    </div>
                  </div>
                  <nav className="space-y-0.5">
                    {cours.sections.map((sec, i) => {
                      const sectionId = `section-${i}`;
                      const isActive = activeSection === sectionId;
                      return (
                        <a
                          key={sectionId}
                          href={`#${sectionId}`}
                          className={`group flex items-center gap-3 pl-4 py-2 text-sm border-l-2 rounded-r-lg transition-all hover:translate-x-1 ${
                            isActive
                              ? 'border-l-indigo-600 text-indigo-600 font-bold'
                              : 'border-l-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                            isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 group-hover:bg-gray-200 text-gray-400 group-hover:text-gray-600'
                          }`}>
                            {i + 1}
                          </span>
                          <span className="truncate">{sec.title}</span>
                        </a>
                      );
                    })}
                  </nav>
                </div>

                {/* Back button */}
                <div className="mt-4">
                  <Link
                    href="/fiches"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm hover:shadow-md"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Retour aux fiches
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">
              {cours.sections.map((sec, i) => (
                <div
                  key={i}
                  id={`section-${i}`}
                  data-cours-section
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6 hover:shadow-md transition-shadow"
                  style={{ scrollMarginTop: '100px' }}
                >
                  <div className="flex items-start gap-4 mb-5">
                    <span className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border-2 flex items-center justify-center text-sm font-black ${colors.text} shrink-0`}>
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">{sec.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">Section {i + 1} sur {cours.sections.length}</p>
                    </div>
                  </div>
                  <div
                    className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-[15px] pl-0 md:pl-14"
                    dangerouslySetInnerHTML={{ __html: sec.content }}
                  />
                </div>
              ))}

              {/* Bottom navigation */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                  <Link
                    href="/fiches"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all text-sm shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Toutes les fiches
                  </Link>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all text-sm shadow-lg shadow-gray-900/10"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg>
                    Revenir en haut
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
