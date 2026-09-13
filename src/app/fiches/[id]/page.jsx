import { notFound } from 'next/navigation';
import { FICHES_DATA } from '@/data/fiches';
import { SUBJECTS } from '@/data/subjects';
import FicheDetail from './FicheDetail';

const siteUrl = 'https://prepa-pass-las.fr';

const subjectLabels = Object.fromEntries(SUBJECTS.map((s) => [s.id, s.name]));
const SITE_NAME = 'Prépa PASS/LAS';
const CONTENT_DATE = '2026-09-14';

/* Texte brut du contenu (pour la description et les points abordés). */
const strip = (html) => (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const headings = (html) => [...(html || '').matchAll(/<h[34][^>]*>(.*?)<\/h[34]>/g)].map((m) => strip(m[1])).filter(Boolean);
const readMinutes = (html) => Math.max(1, Math.round(strip(html).split(' ').length / 200));

export async function generateStaticParams() {
  return FICHES_DATA.map((fiche) => ({ id: fiche.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const fiche = FICHES_DATA.find((f) => f.id === id);
  if (!fiche) return {};
  const subject = subjectLabels[fiche.subject] || fiche.subject;
  const title = `${fiche.title} — Fiche ${subject} PASS/LAS`;
  const cut = (t, n) => (t.length <= n ? t : t.slice(0, n).replace(/\s+\S*$/, '') + '…');
  const description = cut(`${fiche.summary} Fiche de révision ${subject} pour le concours PASS/LAS : points clés du concours, QCM pour se tester, PDF.`, 155);
  const url = `${siteUrl}/fiches/${fiche.id}`;
  return {
    title: { absolute: title },
    description,
    keywords: ['PASS', 'LAS', 'fiche de révision', subject, fiche.title, 'médecine', 'première année santé', ...headings(fiche.content).slice(0, 6)],
    alternates: { canonical: `/fiches/${fiche.id}` },
    openGraph: {
      type: 'article',
      locale: 'fr_FR',
      siteName: SITE_NAME,
      title,
      description: fiche.summary,
      url,
      section: subject,
      tags: ['PASS', 'LAS', subject],
      modifiedTime: CONTENT_DATE,
    },
    twitter: { card: 'summary_large_image', title, description: fiche.summary },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  };
}

export default async function FichePage({ params }) {
  const { id } = await params;
  const fiche = FICHES_DATA.find((f) => f.id === id);
  if (!fiche) notFound();

  const subject = SUBJECTS.find((s) => s.id === fiche.subject);
  const related = FICHES_DATA.filter((f) => f.subject === fiche.subject && f.id !== fiche.id).slice(0, 4);

  const sameSubject = FICHES_DATA.filter((f) => f.subject === fiche.subject);
  const idx = sameSubject.findIndex((f) => f.id === fiche.id);
  const prev = idx > 0 ? sameSubject[idx - 1] : null;
  const next = idx < sameSubject.length - 1 ? sameSubject[idx + 1] : null;
  const subjectName = subjectLabels[fiche.subject] || fiche.subject;
  const url = `${siteUrl}/fiches/${fiche.id}`;
  const teaches = headings(fiche.content);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': ['LearningResource', 'Article'],
      '@id': url,
      mainEntityOfPage: url,
      headline: fiche.title,
      name: fiche.title,
      description: fiche.summary,
      url,
      image: `${url}/opengraph-image`,
      inLanguage: 'fr-FR',
      isAccessibleForFree: true,
      educationalLevel: 'Bac+1',
      learningResourceType: 'Fiche de révision',
      educationalUse: 'révision',
      timeRequired: `PT${readMinutes(fiche.content)}M`,
      about: { '@type': 'Thing', name: subjectName },
      teaches: teaches.length ? teaches : undefined,
      keywords: ['PASS', 'LAS', 'médecine', subjectName, fiche.title, 'révision'].join(', '),
      datePublished: '2025-09-01',
      dateModified: CONTENT_DATE,
      author: { '@type': 'Organization', name: SITE_NAME, url: siteUrl },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: siteUrl, logo: { '@type': 'ImageObject', url: `${siteUrl}/opengraph-image` } },
      provider: { '@type': 'Organization', name: SITE_NAME, url: siteUrl },
      isPartOf: { '@type': 'Collection', name: `Fiches ${subjectName} PASS/LAS`, url: `${siteUrl}/fiches` },
      audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Fiches', item: `${siteUrl}/fiches` },
        { '@type': 'ListItem', position: 3, name: subjectName, item: `${siteUrl}/fiches` },
        { '@type': 'ListItem', position: 4, name: fiche.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FicheDetail fiche={fiche} subject={subject} related={related} prev={prev} next={next} />
    </>
  );
}
