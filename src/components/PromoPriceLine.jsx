'use client';

import { useEffect, useState } from 'react';
import { isPromoActive } from '@/lib/promo';

/**
 * Ligne de réassurance tarifaire, adaptée selon que l'offre de rentrée est active.
 * `variant` : 'hero' (fond clair) ou 'dark' (section CTA sombre).
 * L'état est résolu après montage — la home est statique, un calcul de date
 * au rendu serveur serait figé à la date du build.
 */
export default function PromoPriceLine({ variant = 'hero' }) {
  const [promo, setPromo] = useState(false);
  useEffect(() => { setPromo(isPromoActive()); }, []);

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
      <strong className={accent}>-50 % à vie</strong> (12,49 €/mois au lieu de 24,99 €)
    </p>
  );
}
