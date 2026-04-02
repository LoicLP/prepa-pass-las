import ContactPage from './ContactClient';

export const metadata = {
  title: 'Nous contacter',
  description: 'Contactez l\'\u00e9quipe Pr\u00e9pa PASS/LAS pour toute question, signalement de bug ou suggestion d\u2019am\u00e9lioration. R\u00e9ponse sous 24h.',
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return <ContactPage />;
}
