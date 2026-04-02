import CoursPage from './CoursClient';

export const metadata = {
  title: 'Cours détaillés PASS/LAS - Anatomie, Chimie, Biologie',
  description: 'Cours complets et structurés par matière pour réussir le concours PASS et LAS : anatomie, chimie, biologie cellulaire, biostatistiques, biophysique et SSH.',
  alternates: { canonical: '/cours' },
};

const siteUrl = 'https://prepa-pass-las.fr';

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

export default function Page() {
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
