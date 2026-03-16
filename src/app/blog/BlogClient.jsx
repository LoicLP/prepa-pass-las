'use client';

import { useState, useEffect, useCallback } from 'react';
import { BLOG_ARTICLES } from '@/data/blog';

const categoryColors = {
  'Orientation': 'bg-blue-100 text-blue-700',
  'M\u00e9thodologie': 'bg-purple-100 text-purple-700',
  'Conseils': 'bg-green-100 text-green-700',
  'Bien-\u00eatre': 'bg-pink-100 text-pink-700',
  'Actualit\u00e9s': 'bg-amber-100 text-amber-700',
};

export default function BlogPage() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [openArticleId, setOpenArticleId] = useState(null);

  const categories = [...new Set(BLOG_ARTICLES.map(a => a.category))];
  const filteredArticles = currentFilter === 'all'
    ? BLOG_ARTICLES
    : BLOG_ARTICLES.filter(a => a.category === currentFilter);

  const openArticle = useCallback((id) => {
    setOpenArticleId(id);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeArticle = useCallback(() => {
    setOpenArticleId(null);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeArticle();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [closeArticle]);

  const activeArticle = openArticleId ? BLOG_ARTICLES.find(a => a.id === openArticleId) : null;

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero noise-overlay dot-grid pt-28 pb-14 md:pt-36 md:pb-20 relative overflow-hidden">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="absolute w-[250px] h-[250px] bg-purple-300/8 rounded-full blur-[80px] top-1/3 right-1/4 pointer-events-none"></div>
        <div className="geo-circle-light w-40 h-40 top-24 right-[10%] hidden lg:block"></div>
        <div className="geo-ring-light w-56 h-56 -bottom-12 left-[5%] hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-primary-200 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                </span>
                <span className="text-sm font-semibold text-primary-700">Ressources &amp; actualit&eacute;s</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-5">
                Blog &amp; <span className="blog-gradient-text">Conseils</span> PASS/LAS
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                Guides pratiques, <strong className="text-gray-900">conseils m&eacute;thodologiques</strong> et actualit&eacute;s pour maximiser vos chances de r&eacute;ussite en <strong className="text-gray-900">premi&egrave;re ann&eacute;e de sant&eacute;</strong>.
              </p>
              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                <div className="blog-stat flex items-center gap-3">
                  <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z" /></svg>
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-900">{BLOG_ARTICLES.length}</div>
                    <div className="text-xs font-medium text-gray-500">Articles</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200/60 hidden sm:block"></div>
                <div className="blog-stat flex items-center gap-3">
                  <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-900">{categories.length}</div>
                    <div className="text-xs font-medium text-gray-500">Cat&eacute;gories</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200/60 hidden sm:block"></div>
                <div className="blog-stat flex items-center gap-3">
                  <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-900">5 min</div>
                    <div className="text-xs font-medium text-gray-500">Lecture moyenne</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Floating blog category cards */}
            <div className="hidden lg:block relative h-[320px]">
              {/* Card 1 - Orientation (blue) */}
              <div className="blog-float absolute top-0 left-4 w-[220px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 border border-blue-100/50 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue-700">Orientation</div>
                    <div className="text-[10px] text-gray-400">PASS ou LAS ?</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-blue-100 rounded-full w-full"></div>
                  <div className="h-2 bg-blue-50 rounded-full w-3/4"></div>
                </div>
              </div>

              {/* Card 2 - Methodologie (purple) */}
              <div className="blog-float-reverse absolute top-4 right-0 w-[220px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-purple-500/10 border border-purple-100/50 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-purple-700">M&eacute;thodologie</div>
                    <div className="text-[10px] text-gray-400">5 erreurs &agrave; &eacute;viter</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-purple-100 rounded-full w-full"></div>
                  <div className="h-2 bg-purple-50 rounded-full w-4/5"></div>
                </div>
              </div>

              {/* Card 3 - Conseils (green) */}
              <div className="blog-float absolute bottom-10 -left-1 w-[220px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-green-500/10 border border-green-100/50 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-green-700">Conseils</div>
                    <div className="text-[10px] text-gray-400">Organiser ses r&eacute;visions</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-green-100 rounded-full w-full"></div>
                  <div className="h-2 bg-green-50 rounded-full w-2/3"></div>
                </div>
              </div>

              {/* Card 4 - Bien-etre (pink) */}
              <div className="blog-float-reverse absolute bottom-0 right-6 w-[220px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-pink-500/10 border border-pink-100/50 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-pink-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-pink-700">Bien-&ecirc;tre</div>
                    <div className="text-[10px] text-gray-400">G&eacute;rer le stress</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-pink-100 rounded-full w-full"></div>
                  <div className="h-2 bg-pink-50 rounded-full w-5/6"></div>
                </div>
              </div>

              {/* Decorative center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary-100/30 rounded-2xl rotate-12 blur-[2px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentFilter('all')}
              className={`cat-btn px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                currentFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCurrentFilter(cat)}
                className={`cat-btn px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  currentFilter === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((a) => {
              const date = new Date(a.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
              const colorClass = categoryColors[a.category] || 'bg-gray-100 text-gray-700';
              return (
                <article
                  key={a.id}
                  className="blog-card bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer"
                  onClick={() => openArticle(a.id)}
                >
                  <div className="h-2 bg-primary-500"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 ${colorClass} text-xs font-bold rounded-full`}>{a.category}</span>
                      <span className="text-xs text-gray-400">{date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{a.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{a.summary}</p>
                    <div className="mt-4 flex items-center gap-1 text-primary-600 text-sm font-semibold">
                      Lire l&apos;article
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50">
          <div className="modal-backdrop absolute inset-0" onClick={closeArticle}></div>
          <div className="relative z-10 max-w-3xl mx-auto mt-20 mb-10 mx-4">
            <div className="bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <span className={`px-3 py-1 ${categoryColors[activeArticle.category] || 'bg-gray-100 text-gray-700'} text-xs font-bold rounded-full`}>
                  {activeArticle.category}
                </span>
                <button onClick={closeArticle} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 md:px-8 py-6">
                <h2 className="text-2xl font-black text-gray-900 mb-2">{activeArticle.title}</h2>
                <p className="text-sm text-gray-400 mb-6">
                  {new Date(activeArticle.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <div
                  className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: activeArticle.content }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
