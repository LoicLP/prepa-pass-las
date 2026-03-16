import InscriptionPage from './InscriptionClient';

export const metadata = {
  title: 'Inscription gratuite - Pr\u00e9pa PASS/LAS',
  description: 'Cr\u00e9ez votre compte Pr\u00e9pa PASS/LAS gratuitement et commencez \u00e0 r\u00e9viser d\u00e8s maintenant.',
  alternates: { canonical: '/inscription' },
};

export default function Page() {
  return <InscriptionPage />;
}
