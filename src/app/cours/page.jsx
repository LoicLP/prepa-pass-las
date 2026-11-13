import { permanentRedirect } from 'next/navigation';
import { FICHES_DATA } from '@/data/fiches';
import CoursPage from './CoursClient';

/* /cours n'existe qu'avec ?id=<fiche> : sans identifiant valide la page était vide côté serveur
   (Soft 404 pour Google). On redirige vers /fiches, et chaque cours déclare la fiche comme canonique. */
export async function generateMetadata({ searchParams }) {
  const { id } = await searchParams;
  const fiche = FICHES_DATA.find((f) => f.id === id);
  return {
    title: fiche ? `${fiche.title} — Cours complet PASS/LAS` : 'Cours détaillés PASS/LAS - Anatomie, Chimie, Biologie',
    description: fiche?.summary || 'Cours complets et structurés par matière pour réussir le concours PASS et LAS.',
    alternates: { canonical: fiche ? `/fiches/${fiche.id}` : '/fiches' },
  };
}

const siteUrl = 'https://www.prepa-pass-las.fr';

const courses = [
  { id: 'anatomie', name: 'Anatomie', description: 'Cours complet d\'anatomie humaine : ostéologie, myologie, angiologie, neuroanatomie et splanchnologie.' },
  { id: 'chimie', name: 'Chimie & Biochimie', description: 'Atomistique, thermodynamique, chimie organique, biochimie structurale, enzymologie et métabolisme.' },
  { id: 'biocell', name: 'Biologie cellulaire', description: 'Membrane plasmique, organites, cycle cellulaire, signalisation et biologie moléculaire.' },
  { id: 'biostats', name: 'Biostatistiques', description: 'Statistiques descriptives, tests d\'hypothèses, intervalles de confiance et épidémiologie.' },
  { id: 'biophysique', name: 'Biophysique', description: 'Mécanique des fluides, optique, électricité, radioactivité et imagerie médicale.' },
  { id: 'ssh', name: 'Sciences Humaines et Sociales', description: 'Psychologie, sociologie, éthique médicale et santé publique.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Cours PASS/LAS',
  description: 'Cours complets par matière pour le programme PASS et LAS',
  url: `${siteUrl}/cours`,
  itemListElement: courses.map((course, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Course',
      '@id': `${siteUrl}/cours#${course.id}`,
      name: `${course.name} - PASS/LAS`,
      description: course.description,
      url: `${siteUrl}/cours`,
      provider: {
        '@type': 'Organization',
        name: 'Prépa PASS/LAS',
        url: siteUrl,
      },
      educationalLevel: 'Bac+1',
      inLanguage: 'fr-FR',
      keywords: `PASS, LAS, médecine, ${course.name}`,
      audience: {
        '@type': 'EducationalAudience',
        educationalRole: 'student',
      },
    },
  })),
};

export default async function Page({ searchParams }) {
  const { id } = await searchParams;
  if (!id || !FICHES_DATA.some((f) => f.id === id)) permanentRedirect('/fiches');
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CoursPage />
    </>
  );
}
