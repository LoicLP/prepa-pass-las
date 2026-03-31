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
