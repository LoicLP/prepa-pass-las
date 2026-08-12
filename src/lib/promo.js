// Source unique de vérité pour l'offre de rentrée.
// Utilisée par la home, la page Tarifs et la création de session Stripe.

export const PROMO = {
  id: 'rentree-2026',
  label: 'Offre de rentrée',
  discountLabel: '-50 %',
  // Dernier instant où l'on peut souscrire (heure de Paris, UTC+2 en octobre)
  endsAt: new Date('2026-10-31T23:59:59+01:00'),
  // La remise est conservée tant que l'abonnement reste actif
  lifetime: true,
};

/** L'offre est-elle encore ouverte ? (à évaluer côté client pour éviter le cache statique) */
export function isPromoActive(now = new Date()) {
  return now < PROMO.endsAt;
}

/** Jours restants avant la fin de l'offre (0 si terminée). */
export function promoDaysLeft(now = new Date()) {
  return Math.max(0, Math.ceil((PROMO.endsAt - now) / 86400000));
}

/**
 * Accroche commerciale : on met en avant l'offre annuelle, la plus attractive.
 * 74,99 € / 12 mois = 6,25 €/mois. Toujours accompagner le prix mensualisé
 * du montant réellement facturé (obligation d'information + clarté).
 */
export const HEADLINE = {
  perMonth: '6,25',      // équivalent mensuel de l'annuel promo
  yearTotal: '74,99',    // montant réellement facturé
  yearFull: '149,99',    // prix annuel hors offre
  monthlyPromo: '12,49', // prix du mensuel avec l'offre
  monthlyFull: '24,99',  // prix du mensuel hors offre
};

/** Tarifs affichés — `full` = prix normal, `promo` = prix avec l'offre. */
export const PRICING = {
  monthly: {
    full: '24,99',
    promo: '12,49',
    suffix: '/mois',
    noteFull: 'sans engagement, annulable à tout moment',
    notePromo: 'à vie · sans engagement, annulable à tout moment',
  },
  yearly: {
    // Affichage ramené au mois pour la comparaison
    full: '12,50',
    promo: '6,25',
    suffix: '/mois',
    noteFull: 'facturé 149,99 € par an',
    notePromo: 'facturé 74,99 € la 1re année, puis 74,99 €/an',
    badge: '-75 % au total',
  },
};
