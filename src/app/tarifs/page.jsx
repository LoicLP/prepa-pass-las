import TarifsPage from './TarifsClient';

export const metadata = {
  title: 'Tarifs PASS/LAS - Formules Gratuit, Essentiel & Premium+',
  description: 'Choisissez la formule adapt\u00e9e \u00e0 votre pr\u00e9paration PASS/LAS\u00a0: D\u00e9couverte gratuite, Essentiel (fiches + cours) ou Premium+ (tout inclus, examens blancs). Sans engagement, r\u00e9siliable \u00e0 tout moment.',
  alternates: { canonical: '/tarifs' },
};

export default function Page() {
  return <TarifsPage />;
}
