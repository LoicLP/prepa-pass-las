import ContactPage from './ContactClient';

export const metadata = {
  title: 'Contact - Pr\u00e9pa PASS/LAS',
  description: 'Contactez l\'\u00e9quipe Pr\u00e9pa PASS/LAS. Signalez un bug, posez une question ou envoyez une suggestion.',
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return <ContactPage />;
}
