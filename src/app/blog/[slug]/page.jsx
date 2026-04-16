import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_ARTICLES } from '@/data/blog';

const categoryColors = {
  'Orientation': 'bg-blue-100 text-blue-700',
  'Méthodologie': 'bg-purple-100 text-purple-700',
  'Conseils': 'bg-green-100 text-green-700',
  'Bien-être': 'bg-pink-100 text-pink-700',
  'Actualités': 'bg-amber-100 text-amber-700',
};

const categoryIcons = {
  'Orientation': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  ),
  'Méthodologie': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
    </svg>
  ),
  'Conseils': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  'Bien-être': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  ),
  'Actualités': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z" />
    </svg>
  ),
};

const BASE_URL = 'https://prepa-pass-las.fr';

export function generateStaticParams() {
  return BLOG_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    return { title: 'Article introuvable - Prépa PASS/LAS' };
  }
  const url = `${BASE_URL}/blog/${article.slug}`;
  return {
    title: `${article.title}`,
    description: article.metaDescription || article.summary,
    keywords: article.keywords,
    authors: [{ name: article.author }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.metaDescription || article.summary,
      publishedTime: article.date,
      authors: [article.author],
      siteName: 'Prépa PASS/LAS',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription || article.summary,
    },
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const formattedDate = new Date(article.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const colorClass = categoryColors[article.category] || 'bg-gray-100 text-gray-700';
  const icon = categoryIcons[article.category] || null;

  const relatedArticles = BLOG_ARTICLES.filter(
    (a) => a.category === article.category && a.id !== article.id
  ).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription || article.summary,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Organization',
      name: article.author || 'Prépa PASS/LAS',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Prépa PASS/LAS',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${article.slug}`,
    },
    keywords: (article.keywords || []).join(', '),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${BASE_URL}/blog/${article.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="gradient-hero noise-overlay pt-28 pb-12 md:pt-36 md:pb-16 relative overflow-hidden">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-primary-600 transition-colors">Accueil</Link></li>
              <li aria-hidden="true" className="text-slate-300">/</li>
              <li><Link href="/blog" className="hover:text-primary-600 transition-colors">Blog</Link></li>
              <li aria-hidden="true" className="text-slate-300">/</li>
              <li className="text-slate-700 font-medium truncate max-w-[200px]" aria-current="page">{article.title}</li>
            </ol>
          </nav>

          {/* Category badge */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colorClass} text-xs font-bold rounded-full`}>
              {icon}
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-black text-gray-900 leading-[1.15] tracking-tight mb-4">
            {article.title}
          </h1>

          {/* Summary */}
          <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
            {article.summary}
          </p>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 pt-5 border-t border-white/40">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-black">
                {(article.author || 'P').charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 leading-tight">{article.author}</div>
                <div className="text-xs text-gray-500">{formattedDate}</div>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* Reading time */}
            {article.readingTime && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>{article.readingTime} min de lecture</span>
              </div>
            )}

            {/* Keywords preview */}
            {article.keywords && article.keywords.length > 0 && (
              <>
                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                  {article.keywords.slice(0, 2).map((kw) => (
                    <span key={kw} className="text-xs bg-white/70 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Article */}
      <article className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

          {/* Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share / Back bar */}
          <div className="mt-14 pt-8 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Tous les articles
            </Link>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colorClass} text-xs font-bold rounded-full`}>
              {icon}
              {article.category}
            </span>
          </div>
        </div>
      </article>

      {/* CTA inline */}
      <div className="bg-gradient-to-r from-primary-600 to-violet-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-black text-lg">Entraînez-vous avec des QCM générés par IA</div>
            <div className="text-primary-100 text-sm">Accès gratuit · Aucune carte bancaire requise</div>
          </div>
          <Link
            href="/inscription"
            className="shrink-0 bg-white text-primary-700 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors text-sm"
          >
            Commencer gratuitement →
          </Link>
        </div>
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 bg-primary-500 rounded-full"></div>
              <h2 className="text-2xl font-black text-slate-900">Articles similaires</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {relatedArticles.map((a) => {
                const date = new Date(a.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
                const relColor = categoryColors[a.category] || 'bg-gray-100 text-gray-700';
                return (
                  <Link
                    key={a.id}
                    href={`/blog/${a.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="h-1.5 bg-gradient-to-r from-primary-500 to-violet-500"></div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2.5 py-1 ${relColor} text-xs font-bold rounded-full`}>{a.category}</span>
                        <span className="text-xs text-slate-400">{a.readingTime} min</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-primary-600 transition-colors">
                        {a.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{a.summary}</p>
                      <div className="mt-3 flex items-center gap-1 text-primary-600 text-xs font-semibold">
                        Lire
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="py-14 md:py-20 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse"></span>
            Plateforme de révision PASS/LAS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-4 leading-tight">
            Préparez votre PASS/LAS<br className="hidden sm:block" /> avec méthode et efficacité
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
            QCM illimités générés par IA, fiches de révision structurées, mode examen blanc et suivi de progression personnalisé.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Commencer gratuitement
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/programme"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Voir le programme
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
