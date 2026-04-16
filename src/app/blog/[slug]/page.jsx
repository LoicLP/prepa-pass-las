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

  // Articles relatifs (même catégorie, différent id)
  const relatedArticles = BLOG_ARTICLES.filter(
    (a) => a.category === article.category && a.id !== article.id
  ).slice(0, 3);

  // JSON-LD structured data for SEO
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="gradient-hero noise-overlay pt-28 pb-10 md:pt-36 md:pb-14 relative overflow-hidden">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-primary-600 transition-colors">Accueil</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-primary-600 transition-colors">Blog</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-700 font-medium truncate max-w-[200px]" aria-current="page">
                {article.title}
              </li>
            </ol>
          </nav>

          {/* Category + date + reading time */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-3 py-1 ${colorClass} text-xs font-bold rounded-full`}>
              {article.category}
            </span>
            <span className="text-sm text-slate-500">{formattedDate}</span>
            {article.readingTime && (
              <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {article.readingTime} min de lecture
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-[1.15] tracking-tight mb-5">
            {article.title}
          </h1>
          <div className="w-12 h-1 bg-primary-500 rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 leading-relaxed">{article.summary}</p>

          {article.author && (
            <div className="mt-8 flex items-center gap-3 pt-6 border-t border-white/30">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                {article.author.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">{article.author}</div>
                <div className="text-xs text-slate-500">Publié le {formattedDate}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Article content */}
      <article className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="blog-content prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Back button */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Retour à tous les articles
            </Link>
          </div>
        </div>
      </article>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8">
              Articles similaires
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((a) => {
                const date = new Date(a.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });
                const relColor = categoryColors[a.category] || 'bg-gray-100 text-gray-700';
                return (
                  <Link
                    key={a.id}
                    href={`/blog/${a.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="h-2 bg-primary-500"></div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 ${relColor} text-xs font-bold rounded-full`}>
                          {a.category}
                        </span>
                        <span className="text-xs text-slate-400">{date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                        {a.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{a.summary}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 md:py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-4">
            Préparez votre PASS/LAS avec méthode
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            QCM illimités générés par IA, fiches de révision, mode examen blanc et suivi de progression. Tout ce qu&apos;il faut pour réussir votre première année.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Commencer gratuitement
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
