import ExamenPage from './ExamenClient';

export const metadata = {
  title: 'Mode Examen PASS/LAS - Conditions r\u00e9elles',
  description: 'Simulez un examen PASS/LAS en conditions r\u00e9elles : chronom\u00e9tr\u00e9, multi-mati\u00e8res, avec correction d\u00e9taill\u00e9e.',
  alternates: { canonical: '/examen' },
};

export default function Page() {
  return <ExamenPage />;
}
