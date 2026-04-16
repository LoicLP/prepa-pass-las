import BlogPage from './BlogClient';
import { BLOG_ARTICLES } from '@/data/blog';

export const metadata = {
  title: 'Blog PASS/LAS - Conseils, méthodes et actualités pour réussir le concours',
  description: 'Guides pratiques, conseils méthodologiques et actualités pour réussir votre PASS ou LAS. Choix du parcours, organisation des révisions, gestion du stress, débouchés : tout ce qu\'il faut savoir.',
  keywords: ['blog PASS LAS', 'conseils première année santé', 'méthode PASS', 'réussir PASS LAS', 'orientation médecine', 'révisions concours santé'],
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: 'Blog PASS/LAS - Conseils, méthodes et actualités pour réussir le concours',
    description: 'Guides pratiques, conseils méthodologiques et actualités pour réussir votre PASS ou LAS.',
  },
};

const siteUrl = 'https://prepa-pass-las.fr';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Articles de blog PASS/LAS',
  description: 'Conseils, guides et actualités pour réussir votre PASS ou LAS',
  url: `${siteUrl}/blog`,
  itemListElement: BLOG_ARTICLES.map((article, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'BlogPosting',
      '@id': `${siteUrl}/blog/${article.slug}`,
      headline: article.title,
      description: article.metaDescription || article.summary,
      datePublished: article.date,
      url: `${siteUrl}/blog/${article.slug}`,
      author: {
        '@type': 'Organization',
        name: article.author || 'Prépa PASS/LAS',
        url: siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Prépa PASS/LAS',
        url: siteUrl,
      },
      keywords: (article.keywords || []).join(', '),
      inLanguage: 'fr-FR',
    },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPage />
    </>
  );
}
