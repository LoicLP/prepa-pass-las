import ConnexionPage from './ConnexionClient';

export const metadata = {
  title: 'Se connecter',
  description: 'Connectez-vous \u00e0 votre espace Pr\u00e9pa PASS/LAS pour acc\u00e9der \u00e0 vos QCM, fiches de r\u00e9vision et suivre votre progression.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/connexion' },
};

export default function Page() {
  return <ConnexionPage />;
}
