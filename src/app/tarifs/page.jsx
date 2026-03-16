import TarifsPage from './TarifsClient';

export const metadata = {
  title: 'Tarifs - Pr\u00e9pa PASS/LAS',
  description: 'D\u00e9couvrez nos formules d\'abonnement : D\u00e9couverte (gratuit), Essentiel (19,90\u20ac/mois) et Premium+ (39,90\u20ac/mois). Sans engagement.',
  alternates: { canonical: '/tarifs' },
};

export default function Page() {
  return <TarifsPage />;
}
