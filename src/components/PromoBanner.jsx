'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PROMO, isPromoActive, promoDaysLeft } from '@/lib/promo';

/**
 * Bandeau « Offre de rentrée -50 % » pour les pages publiques.
 * Le compte à rebours est calculé après montage : la home étant statique,
 * un calcul au rendu serveur serait figé à la date du build.
 */
export default function PromoBanner({ compact = false }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (isPromoActive()) setState({ days: promoDaysLeft() });
  }, []);

  if (!state) return null;

  const deadline = PROMO.endsAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

  return (
    <section
      className={compact ? 'py-3' : 'py-4'}
      style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 55%, #7c3aed 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 bg-amber-300 text-indigo-950 rounded-full px-3.5 py-1.5 text-sm font-black shrink-0">
            🎓 {PROMO.discountLabel}{' '}&agrave; vie
          </span>
          <p className="text-sm text-indigo-100 font-medium">
            <strong className="text-white">Offre de rentr&eacute;e</strong> — Premium &agrave;{' '}
            <strong className="text-white">12,49 &euro;/mois</strong>{' '}au lieu de 24,99 &euro;, tant que
            tu restes abonn&eacute;. Jusqu&apos;au {deadline}{' '}
            <span className="text-amber-200 font-bold">(J-{state.days})</span>.
          </p>
          <Link
            href="/tarifs"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/30"
          >
            J&apos;en profite
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
