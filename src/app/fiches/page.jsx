import FichesPage from './FichesClient';
import { FICHES_DATA } from '@/data/fiches';

export const metadata = {
  title: `${FICHES_DATA.length} fiches de révision PASS/LAS gratuites, 9 UE`,
  description: `${FICHES_DATA.length} fiches de révision gratuites pour le concours PASS/LAS : anatomie, chimie-biochimie, biologie cellulaire, biostatistiques, biophysique, SSH, physiologie, médicament, histologie-embryologie. Points clés, QCM et PDF.`,
  alternates: { canonical: '/fiches' },
  openGraph: { type: 'website', locale: 'fr_FR', siteName: 'Prépa PASS/LAS', url: 'https://prepa-pass-las.fr/fiches', title: `${FICHES_DATA.length} fiches de révision PASS/LAS gratuites`, description: 'Toutes les fiches du tronc commun PASS/LAS, par UE, avec leurs points clés du concours.' },
};

const siteUrl = 'https://prepa-pass-las.fr';

import { SUBJECTS } from '@/data/subjects';
const subjectLabels = Object.fromEntries(SUBJECTS.map((s) => [s.id, s.name]));

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
