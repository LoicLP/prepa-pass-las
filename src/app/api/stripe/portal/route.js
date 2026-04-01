import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function encodeParams(params) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
}

async function stripeRequest(path, params) {
  const key = process.env.STRIPE_SECRET_KEY;
  const body = encodeParams(params);
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Stripe error ${res.status}`);
  return data;
}

export async function POST(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }
  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin
    .from('user_profiles').select('stripe_customer_id').eq('id', user.id).single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'Aucun abonnement Stripe trouvé' }, { status: 404 });
  }

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://prepa-pass-las.fr').trim();

  try {
    const session = await stripeRequest('/billing_portal/sessions', {
      customer: profile.stripe_customer_id,
      return_url: `${baseUrl}/dashboard`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[Stripe Portal Error]', err?.message);
    return NextResponse.json({ error: err?.message || 'Erreur portail facturation' }, { status: 500 });
  }
}
