import { notFound } from 'next/navigation';
import { FICHES_DATA } from '@/data/fiches';
import { SUBJECTS } from '@/data/subjects';
import FicheDetail from './FicheDetail';

const siteUrl = 'https://prepa-pass-las.fr';

const subjectLabels = {
  anatomie: 'Anatomie',
  chimie: 'Chimie & Biochimie',
  biocell: 'Biologie cellulaire',
  biostats: 'Biostatistiques',
  biophysique: 'Biophysique',
  ssh: 'Sciences Humaines et Sociales',
};

export async function generateStaticParams() {
  return FICHES_DATA.map((fiche) => ({ id: fiche.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const fiche = FICHES_DATA.find((f) => f.id === id);
  if (!fiche) return {};
  const subject = subjectLabels[fiche.subject] || fiche.subject;
  return {
    title: `${fiche.title} — Fiche PASS/LAS`,
    description: `${fiche.summary} Fiche de révision ${subject} pour le concours PASS/LAS.`,
    alternates: { canonical: `/fiches/${fiche.id}` },
    openGraph: {
      title: `${fiche.title} — Fiche PASS/LAS`,
      description: fiche.summary,
      url: `${siteUrl}/fiches/${fiche.id}`,
    },
  };
}

export default async function FichePage({ params }) {
  const { id } = await params;
  const fiche = FICHES_DATA.find((f) => f.id === id);
  if (!fiche) notFound();

  const subject = SUBJECTS.find((s) => s.id === fiche.subject);
  const related = FICHES_DATA.filter((f) => f.subject === fiche.subject && f.id !== fiche.id).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': `${siteUrl}/fiches/${fiche.id}`,
    name: fiche.title,
    description: fiche.summary,
    url: `${siteUrl}/fiches/${fiche.id}`,
    educationalLevel: 'Bac+1',
    learningResourceType: 'Fiche de révision',
    about: subjectLabels[fiche.subject] || fiche.subject,
    inLanguage: 'fr-FR',
    keywords: `PASS, LAS, médecine, ${subjectLabels[fiche.subject] || fiche.subject}, ${fiche.title}, révision`,
    provider: {
      '@type': 'Organization',
      name: 'Prépa PASS/LAS',
      url: siteUrl,
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Fiches', item: `${siteUrl}/fiches` },
        { '@type': 'ListItem', position: 3, name: fiche.title, item: `${siteUrl}/fiches/${fiche.id}` },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FicheDetail fiche={fiche} subject={subject} related={related} />
    </>
  );
}
