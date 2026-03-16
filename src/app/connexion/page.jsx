import ConnexionPage from './ConnexionClient';

export const metadata = {
  title: 'Connexion - Pr\u00e9pa PASS/LAS',
  description: 'Connectez-vous \u00e0 votre espace de r\u00e9vision Pr\u00e9pa PASS/LAS.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/connexion' },
};

export default function Page() {
  return <ConnexionPage />;
}
