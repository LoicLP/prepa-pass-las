import Stripe from 'stripe';

// Lazy initialization pour éviter les erreurs au build
let _stripe;
export function getStripe() {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY manquant');
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' });
  }
  return _stripe;
}

// Identifiant unique de ce site sur le dashboard Stripe
export const SITE_METADATA = {
  site: 'prepa-pass-las',
  site_name: 'Prépa PASS/LAS',
};

// Map billing period → Stripe price ID (env vars)
export const PRICE_IDS = {
  essentiel: {
    monthly:   () => process.env.STRIPE_PRICE_ESSENTIEL_MONTHLY,
    quarterly: () => process.env.STRIPE_PRICE_ESSENTIEL_QUARTERLY,
    yearly:    () => process.env.STRIPE_PRICE_ESSENTIEL_YEARLY,
  },
  'premium+': {
    monthly:   () => process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
    quarterly: () => process.env.STRIPE_PRICE_PREMIUM_QUARTERLY,
    yearly:    () => process.env.STRIPE_PRICE_PREMIUM_YEARLY,
  },
};

export function getPriceId(plan, period) {
  return PRICE_IDS[plan]?.[period]?.()?.trim() || null;
}

// Clés de recherche des tarifs Premium en vigueur (créées sur le produit Stripe « Premium — Prépa PASS/LAS »).
// Elles priment sur les variables d'environnement : changer de prix = créer un tarif avec la clé
// (option « transférer la clé ») sans toucher à Vercel.
const LOOKUP_KEYS = {
  'premium+': { monthly: 'pass-las-premium-monthly', yearly: 'pass-las-premium-yearly' },
};

/** Identifiant du tarif Stripe à facturer : lookup_key d'abord, variable d'environnement sinon. */
export async function resolvePriceId(plan, period) {
  const key = LOOKUP_KEYS[plan]?.[period];
  if (key && process.env.STRIPE_SECRET_KEY) {
    try {
      const res = await fetch(`https://api.stripe.com/v1/prices?active=true&limit=1&lookup_keys[]=${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
      });
      const data = await res.json();
      const id = res.ok ? data?.data?.[0]?.id : null;
      if (id) return id;
    } catch { /* repli ci-dessous */ }
  }
  return getPriceId(plan, period);
}
