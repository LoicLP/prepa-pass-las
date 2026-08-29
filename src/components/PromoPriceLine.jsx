/**
 * Ligne de réassurance affichée sous les boutons d'inscription.
 * `variant` : 'hero' (fond clair) ou 'dark' (section CTA sombre).
 *
 * Volontairement sans montants : le chiffrage de l'offre vit sur la page
 * Tarifs, la ligne ne porte que la promesse d'entrée (essai sans carte).
 */
export default function PromoPriceLine({ variant = 'hero' }) {
  const dark = variant === 'dark';
  const base = dark ? 'text-sm text-indigo-200' : 'text-xs text-gray-400 -mt-4 mb-8';
  const accent = dark ? 'text-amber-300' : 'text-violet-600';

  return (
    <p className={base}>
      Gratuit · sans carte bancaire ·{' '}
      <strong className={accent}>2 jours de Premium offerts</strong>
    </p>
  );
}
