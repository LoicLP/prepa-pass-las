import InscriptionPage from './InscriptionClient';

export const metadata = {
  title: 'Inscription gratuite',
  description: 'Cr\u00e9ez votre compte Pr\u00e9pa PASS/LAS gratuitement en 30 secondes. Acc\u00e9dez imm\u00e9diatement aux QCM, fiches de r\u00e9vision et cours pour r\u00e9ussir le concours PASS/LAS.',
  alternates: { canonical: '/inscription' },
};

export default function Page() {
  return <InscriptionPage />;
}
