import FichesPage from './FichesClient';
import { FICHES_DATA } from '@/data/fiches';

export const metadata = {
  title: 'Fiches de révision PASS/LAS - Toutes les matières',
  description: 'Fiches synthétiques par matière pour réviser le programme PASS et LAS : anatomie, chimie, biologie cellulaire, biostatistiques, biophysique et SSH. Téléchargeables en PDF.',
  alternates: { canonical: '/fiches' },
};

const siteUrl = 'https://prepa-pass-las.fr';

const subjectLabels = {
  anatomie: 'Anatomie',
  chimie: 'Chimie & Biochimie',
  biocell: 'Biologie cellulaire',
  biostats: 'Biostatistiques',
  biophysique: 'Biophysique',
  ssh: 'Sciences Humaines et Sociales',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Fiches de révision PASS/LAS',
  description: 'Fiches synthétiques par matière pour réviser efficacement le programme PASS et LAS',
  url: `${siteUrl}/fiches`,
  itemListElement: FICHES_DATA.map((fiche, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'LearningResource',
      '@id': `${siteUrl}/fiches#${fiche.id}`,
      name: fiche.title,
      description: fiche.summary,
      url: `${siteUrl}/fiches`,
      educationalLevel: 'Bac+1',
      learningResourceType: 'Fiche de révision',
      about: subjectLabels[fiche.subject] || fiche.subject,
      inLanguage: 'fr-FR',
      keywords: `PASS, LAS, médecine, ${subjectLabels[fiche.subject] || fiche.subject}, révision`,
      provider: {
        '@type': 'Organization',
        name: 'Prépa PASS/LAS',
        url: siteUrl,
      },
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
      <FichesPage />
    </>
  );
}
