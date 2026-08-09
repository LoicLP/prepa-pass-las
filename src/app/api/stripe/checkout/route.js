import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SITE_METADATA, getPriceId } from '@/lib/stripe';
import { isPromoActive } from '@/lib/promo';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function encodeParams(params) {
  // Les clés ne sont PAS encodées (Stripe a besoin des crochets bruts : line_items[0][price])
  // Seules les valeurs sont encodées
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
}

async function stripeRequest(path, params) {
  const key = process.env.STRIPE_SECRET_KEY;
  const encodedBody = encodeParams(params);
  console.log(`[Stripe] POST ${path}`, encodedBody.substring(0, 300));
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: encodedBody,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`[Stripe] Error ${res.status}:`, JSON.stringify(data?.error));
    throw new Error(data?.error?.message || `Stripe error ${res.status}`);
  }
  console.log(`[Stripe] OK ${path} → id:${data.id} url:${data.url}`);
  return data;
}

export async function POST(request) {
  // Auth
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }
  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }

  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Body invalide' }, { status: 400 });
  }

  const { plan, period } = body;
  const validPlans = ['essentiel', 'premium+'];
  const validPeriods = ['monthly', 'quarterly', 'yearly'];
  if (!validPlans.includes(plan) || !validPeriods.includes(period)) {
    return NextResponse.json({ error: 'Plan ou période invalide' }, { status: 400 });
  }

  const priceId = getPriceId(plan, period);
  if (!priceId) {
    return NextResponse.json({ error: `Price ID manquant pour ${plan}/${period}` }, { status: 500 });
  }

  try {
    // Récupérer le customer ID existant
    let customerId = null;
    try {
      const { data: profile } = await supabaseAdmin
        .from('user_profiles').select('stripe_customer_id').eq('id', user.id).single();
      customerId = profile?.stripe_customer_id || null;
    } catch { /* colonne pas encore créée */ }

    // Créer le customer Stripe si besoin
    const createCustomer = async () => {
      const customer = await stripeRequest('/customers', {
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        'metadata[site]': SITE_METADATA.site,
        'metadata[site_name]': SITE_METADATA.site_name,
        'metadata[user_id]': user.id,
      });
      try {
        await supabaseAdmin.from('user_profiles').upsert({
          id: user.id, stripe_customer_id: customer.id, updated_at: new Date().toISOString(),
        });
      } catch { /* best effort */ }
      return customer.id;
    };

    if (!customerId) {
      customerId = await createCustomer();
    } else {
      // Le customer enregistré peut avoir disparu (suppression, bascule test/live) :
      // sans ce contrôle, l'utilisateur serait définitivement bloqué au paiement.
      const check = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
      });
      const checkData = await check.json().catch(() => ({}));
      if (!check.ok || checkData?.deleted) {
        console.warn(`[Stripe] Customer ${customerId} introuvable → recréation pour user=${user.id}`);
        customerId = await createCustomer();
      }
    }

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://prepa-pass-las.fr').trim();

    // Offre de rentrée : coupon appliqué automatiquement tant que l'offre est ouverte.
    // `discounts` et `allow_promotion_codes` étant exclusifs chez Stripe, on bascule
    // sur le champ de saisie de code promo dès que l'offre est terminée.
    const promoCoupon = isPromoActive() ? (process.env.STRIPE_PROMO_COUPON || '').trim() : '';
    const promoParams = promoCoupon
      ? { 'discounts[0][coupon]': promoCoupon }
      : { allow_promotion_codes: 'true' };

    // Créer la session Checkout
    const session = await stripeRequest('/checkout/sessions', {
      customer: customerId,
      mode: 'subscription',
      'payment_method_types[0]': 'card',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      success_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/tarifs`,
      ...promoParams,
      'metadata[site]': SITE_METADATA.site,
      'metadata[site_name]': SITE_METADATA.site_name,
      'metadata[plan]': plan,
      'metadata[billing_period]': period,
      'metadata[user_id]': user.id,
      'subscription_data[metadata][site]': SITE_METADATA.site,
      'subscription_data[metadata][site_name]': SITE_METADATA.site_name,
      'subscription_data[metadata][plan]': plan,
      'subscription_data[metadata][billing_period]': period,
      'subscription_data[metadata][user_id]': user.id,
      ...(promoCoupon ? { 'subscription_data[metadata][promo]': 'rentree-2026' } : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const msg = err?.message || 'Erreur inconnue';
    console.error('[Stripe Checkout Error]', msg);
    return NextResponse.json({ error: `[DEBUG] ${msg}` }, { status: 500 });
  }
}
