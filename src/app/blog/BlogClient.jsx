'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BLOG_ARTICLES } from '@/data/blog';

/* Identité visuelle par catégorie : dégradé de couverture, chip, emoji */
const CATEGORY_STYLE = {
  'Orientation': { grad: 'linear-gradient(135deg, #3b82f6, #6366f1)', chip: 'bg-blue-100 text-blue-700', emoji: '🧭' },
  'Méthodologie': { grad: 'linear-gradient(135deg, #8b5cf6, #c026d3)', chip: 'bg-purple-100 text-purple-700', emoji: '🧠' },
  'Conseils': { grad: 'linear-gradient(135deg, #10b981, #14b8a6)', chip: 'bg-emerald-100 text-emerald-700', emoji: '💡' },
  'Bien-être': { grad: 'linear-gradient(135deg, #ec4899, #f43f5e)', chip: 'bg-pink-100 text-pink-700', emoji: '🌿' },
  'Actualités': { grad: 'linear-gradient(135deg, #f59e0b, #f97316)', chip: 'bg-amber-100 text-amber-700', emoji: '📰' },
};
const DEFAULT_STYLE = { grad: 'linear-gradient(135deg, #4f46e5, #7c3aed)', chip: 'bg-indigo-100 text-indigo-700', emoji: '📚' };

const styleFor = (category) => CATEGORY_STYLE[category] || DEFAULT_STYLE;

const formatDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

/* Motif de points décoratif pour les couvertures */
const COVER_DOTS = {
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
};

export default function BlogPage() {
  const [currentFilter, setCurrentFilter] = useState('all');

  const categories = [...new Set(BLOG_ARTICLES.map(a => a.category))];
  const countFor = (cat) => BLOG_ARTICLES.filter(a => a.category === cat).length;

  /* Tri par date décroissante ; le plus récent devient l'article à la une */
  const sorted = useMemo(
    () => [...BLOG_ARTICLES].sort((a, b) => new Date(b.date) - new Date(a.date)),
    []
  );
  const showFeatured = currentFilter === 'all';
  const featured = sorted[0];
  const gridArticles = showFeatured
    ? sorted.slice(1)
    : sorted.filter(a => a.category === currentFilter);

  const fStyle = styleFor(featured?.category);

  return (
    <>
      {/* ====== HERO (compact) ====== */}
      <section className="gradient-hero noise-overlay dot-grid pt-24 pb-10 md:pt-28 md:pb-12 relative overflow-hidden">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="geo-circle-light w-40 h-40 top-20 right-[8%] hidden lg:block"></div>
        <div className="geo-ring-light w-56 h-56 -bottom-16 left-[4%] hidden lg:block"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-3.5 py-1.5 rounded-full border border-primary-200 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-xs font-semibold text-primary-700">Ressources &amp; actualit&eacute;s</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-4">
            Le blog qui te fait gagner{' '}
            <span className="blog-gradient-text">des points</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Guides pratiques, <strong className="text-gray-900">m&eacute;thodes de travail</strong>{' '}et
            actualit&eacute;s de la r&eacute;forme — tout pour aborder ta{' '}
            <strong className="text-gray-900">premi&egrave;re ann&eacute;e de sant&eacute;</strong>{' '}
            avec un coup d&apos;avance.
          </p>
        </div>
      </section>

      {/* ====== FILTRES ====== */}
      <section className="py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentFilter('all')}
              className={`cat-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                currentFilter === 'all'
                  ? 'text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
              }`}
              style={currentFilter === 'all' ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' } : undefined}
            >
              Tous
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${currentFilter === 'all' ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                {BLOG_ARTICLES.length}
              </span>
            </button>
            {categories.map((cat) => {
              const active = currentFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCurrentFilter(cat)}
                  className={`cat-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    active
                      ? 'text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
                  }`}
                  style={active ? { background: styleFor(cat).grad } : undefined}
                >
                  <span className="text-sm leading-none">{styleFor(cat).emoji}</span>
                  {cat}
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                    {countFor(cat)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== ARTICLE À LA UNE ====== */}
      {showFeatured && featured && (
        <section className="pb-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid md:grid-cols-[2fr_3fr] bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              {/* Couverture */}
              <div className="relative min-h-[180px] md:min-h-[240px] overflow-hidden" style={{ background: fStyle.grad }}>
                <div className="absolute inset-0" style={COVER_DOTS}></div>
                <span className="absolute -bottom-6 -right-3 text-[110px] leading-none opacity-25 rotate-[-8deg] group-hover:scale-110 transition-transform duration-300 select-none">
                  {fStyle.emoji}
                </span>
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur text-gray-900 text-[11px] font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-full">
                  ⭐ &Agrave; la une
                </span>
              </div>
              {/* Contenu */}
              <div className="p-6 md:p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 ${fStyle.chip} text-xs font-bold rounded-full`}>{featured.category}</span>
                  <span className="text-xs text-gray-400">{formatDate(featured.date)}</span>
                  {featured.readingTime && (
                    <span className="text-xs text-gray-400">&middot; ⏱ {featured.readingTime} min</span>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-snug mb-3 group-hover:text-primary-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-3 mb-4">{featured.summary}</p>
                <div className="mt-auto flex items-center gap-1.5 text-primary-600 text-sm font-bold">
                  Lire l&apos;article
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ====== GRILLE D'ARTICLES ====== */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {gridArticles.length === 0 ? (
            <p className="text-center text-gray-500 py-12">Aucun article dans cette cat&eacute;gorie pour le moment.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridArticles.map((a) => {
                const st = styleFor(a.category);
                return (
                  <Link
                    key={a.id}
                    href={`/blog/${a.slug}`}
                    className="blog-card group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col"
                  >
                    <article className="flex flex-col flex-1">
                      {/* Couverture dégradée */}
                      <div className="relative h-28 overflow-hidden shrink-0" style={{ background: st.grad }}>
                        <div className="absolute inset-0" style={COVER_DOTS}></div>
                        <span className="absolute -bottom-4 -right-2 text-[68px] leading-none opacity-25 rotate-[-8deg] group-hover:scale-110 transition-transform duration-300 select-none">
                          {st.emoji}
                        </span>
                        {a.readingTime && (
                          <span className="absolute bottom-3 left-4 inline-flex items-center gap-1 bg-black/25 backdrop-blur text-white text-[10.5px] font-bold px-2 py-1 rounded-full">
                            ⏱ {a.readingTime} min
                          </span>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 ${st.chip} text-xs font-bold rounded-full`}>{a.category}</span>
                          <span className="text-xs text-gray-400">{formatDate(a.date)}</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                          {a.title}
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{a.summary}</p>
                        <div className="mt-auto pt-4 flex items-center gap-1 text-primary-600 text-sm font-semibold">
                          Lire l&apos;article
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
