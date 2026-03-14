import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PremiumProvider } from '@/contexts/PremiumContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Prépa PASS/LAS - Réussissez votre première année de médecine',
  description: 'La plateforme de révision n°1 pour réussir le concours PASS/LAS. QCM illimités, fiches de cours, mode examen.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-slate-50 text-gray-900 antialiased`}>
        <PremiumProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </PremiumProvider>
      </body>
    </html>
  );
}
