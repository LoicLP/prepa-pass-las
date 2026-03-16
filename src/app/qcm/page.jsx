import QCMPage from './QCMClient';

export const metadata = {
  title: 'QCM PASS/LAS - Entra\u00eenement illimit\u00e9',
  description: 'Entra\u00eenez-vous avec des QCM conformes au programme PASS et LAS. Questions par mati\u00e8re, corrections d\u00e9taill\u00e9es et suivi de progression.',
  alternates: { canonical: '/qcm' },
};

export default function Page() {
  return <QCMPage />;
}
