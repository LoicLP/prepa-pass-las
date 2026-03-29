import BlogPage from './BlogClient';
import { BLOG_ARTICLES } from '@/data/blog';

export const metadata = {
  title: 'Blog PASS/LAS - Conseils et actualités',
  description: 'Articles, guides et conseils pour réussir votre PASS ou LAS. Stratégies de révision, retours d\'expérience et actualités.',
  alternates: { canonical: '/blog' },
};

const siteUrl = 'https://prepa-pass-las-kappa.vercel.app';

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
      '@id': `${siteUrl}/blog#article-${article.id}`,
      headline: article.title,
      description: article.summary,
      datePublished: article.date,
      url: `${siteUrl}/blog`,
      author: {
        '@type': 'Organization',
        name: 'Prépa PASS/LAS',
        url: siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Prépa PASS/LAS',
        url: siteUrl,
      },
      keywords: `PASS, LAS, médecine, ${article.category}`,
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
