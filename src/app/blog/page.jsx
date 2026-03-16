import BlogPage from './BlogClient';

export const metadata = {
  title: 'Blog PASS/LAS - Conseils et actualit\u00e9s',
  description: 'Articles, guides et conseils pour r\u00e9ussir votre PASS ou LAS. Strat\u00e9gies de r\u00e9vision, retours d\'exp\u00e9rience et actualit\u00e9s.',
  alternates: { canonical: '/blog' },
};

export default function Page() {
  return <BlogPage />;
}
