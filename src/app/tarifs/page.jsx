import TarifsPage from './TarifsClient';

export const metadata = {
  title: 'Tarifs PASS/LAS - Gratuit ou Premium tout illimité',
  description: 'Un plan unique Premium \u00e0 24,99\u00a0\u20ac/mois ou 149,99\u00a0\u20ac/an (6 mois offerts)\u00a0: QCM illimit\u00e9s par IA, examens blancs, cours complets, progression et objectifs. Sans engagement, 7 jours offerts \u00e0 l\u2019inscription.',
  alternates: { canonical: '/tarifs' },
};

export default function Page() {
  return <TarifsPage />;
}
