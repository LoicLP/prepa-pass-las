'use client';

import { useState } from 'react';
import { HEADLINE, isPromoActive } from '@/lib/promo';

/**
 * Ligne de réassurance tarifaire, adaptée selon que l'offre de rentrée est active.
 * `variant` : 'hero' (fond clair) ou 'dark' (section CTA sombre).
 * Évalué dès le rendu pour éviter d'afficher un instant la version hors offre.
 */
export default function PromoPriceLine({ variant = 'hero' }) {
  const [promo] = useState(() => isPromoActive());

  const dark = variant === 'dark';
  const base = dark ? 'text-sm text-indigo-200' : 'text-xs text-gray-400 -mt-4 mb-8';
  const accent = dark ? 'text-amber-300' : 'text-violet-600';

  if (!promo) {
    return (
      <p className={base}>
        Gratuit · sans carte bancaire ·{' '}
        <strong className={accent}>2 jours de Premium offerts</strong> à l&apos;inscription
      </p>
    );
  }

  return (
    <p className={base}>
      Gratuit · sans carte bancaire ·{' '}
      <strong className={accent}>2 jours de Premium offerts</strong>, puis{' '}
      <strong className={accent}>-50 % à vie</strong> — dès {HEADLINE.perMonth} €/mois en annuel
      ({HEADLINE.yearTotal} €/an au lieu de {HEADLINE.yearFull} €)
    </p>
  );
}
