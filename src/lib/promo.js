// Tarifs Premium — source unique de vérité pour la home, la page Tarifs et les e-mails.
// Aucune offre en cours : `isPromoActive()` reste pour les anciens appels et renvoie toujours false.

export const PROMO = {
  id: 'rentree-2026',
  label: 'Offre de rentrée',
  discountLabel: '-50 %',
  // Offre clôturée (les anciens abonnés conservent leur tarif chez Stripe)
  endsAt: new Date('2026-09-20T00:00:00+02:00'),
  lifetime: true,
};

/** Aucune offre en cours. */
export function isPromoActive() {
  return false;
}

/** Jours restants avant la fin de l'offre (toujours 0). */
export function promoDaysLeft() {
  return 0;
}

/** Montants affichés (TTC). L'annuel est aussi ramené au mois pour la comparaison. */
export const HEADLINE = {
  perMonth: '7,50',       // équivalent mensuel de l'annuel (89,99 / 12)
  yearTotal: '89,99',     // montant réellement facturé par an
  yearFull: '89,99',
  monthlyPromo: '12,99',
  monthlyFull: '12,99',
};

export const PRICING = {
  monthly: { full: '12,99', promo: '12,99', suffix: '/mois', noteFull: 'sans engagement, annulable à tout moment', notePromo: 'sans engagement, annulable à tout moment' },
  yearly: { full: '7,50', promo: '7,50', suffix: '/mois', noteFull: 'facturé 89,99 € par an', notePromo: 'facturé 89,99 € par an', badge: '' },
};
