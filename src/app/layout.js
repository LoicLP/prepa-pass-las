import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PremiumProvider } from '@/contexts/PremiumContext';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://prepa-pass-las.fr'),
  title: {
    default: 'Prépa PASS/LAS - Réussissez votre première année de médecine',
    template: '%s | Prépa PASS/LAS',
  },
  description: 'La plateforme de révision n°1 pour réussir le concours PASS/LAS. QCM illimités, fiches de cours, mode examen et suivi de progression.',
  keywords: ['PASS', 'LAS', 'médecine', 'QCM', 'fiches de révision', 'concours santé', 'première année médecine', 'prépa médecine', 'examen PASS', 'révision LAS'],
  authors: [{ name: 'LP Labs' }],
  creator: 'LP Labs',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://prepa-pass-las.fr',
    siteName: 'Prépa PASS/LAS',
    title: 'Prépa PASS/LAS - Réussissez votre première année de médecine',
    description: 'La plateforme de révision n°1 pour réussir le concours PASS/LAS. QCM illimités, fiches de cours, mode examen et suivi de progression.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Prépa PASS/LAS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prépa PASS/LAS - Réussissez votre première année de médecine',
    description: 'La plateforme de révision n°1 pour réussir le concours PASS/LAS. QCM illimités, fiches de cours, mode examen.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://prepa-pass-las.fr',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-slate-50 text-gray-900 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Prépa PASS/LAS',
              url: 'https://prepa-pass-las.fr',
              logo: 'https://prepa-pass-las.fr/icon.svg',
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'support@prepa-pass-las.fr',
                contactType: 'customer service',
                availableLanguage: 'French',
              },
              description: 'La plateforme de révision n°1 pour réussir le concours PASS/LAS. QCM illimités, fiches de cours, mode examen et suivi de progression.',
              sameAs: [],
            }),
          }}
        />
        <AuthProvider>
          <PremiumProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </PremiumProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
