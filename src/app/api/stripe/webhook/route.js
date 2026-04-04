import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getStripe } from '@/lib/stripe';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Désactiver le body parser par défaut de Next.js (Stripe a besoin du raw body)
export const config = { api: { bodyParser: false } };

async function updateUserTier(userId, tier, subscriptionId, period) {
  await supabaseAdmin
    .from('user_profiles')
    .upsert({
      id: userId,
      tier,
      stripe_subscription_id: subscriptionId,
      subscription_period: period || null,
      updated_at: new Date().toISOString(),
    });
}

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret manquant' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[Stripe Webhook] Signature invalide:', err.message);
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Event: ${event.type}`);

  try {
    switch (event.type) {
      // Paiement réussi → activer l'abonnement
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;
        const period = session.metadata?.billing_period;
        const subscriptionId = session.subscription;

        if (userId && plan) {
          await updateUserTier(userId, plan, subscriptionId, period);
          console.log(`[Stripe] Abonnement activé: user=${userId} plan=${plan} period=${period}`);
        }
        break;
      }

      // Renouvellement réussi
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        if (invoice.billing_reason === 'subscription_cycle') {
          const subscription = await getStripe().subscriptions.retrieve(invoice.subscription);
          const userId = subscription.metadata?.user_id;
          const plan = subscription.metadata?.plan;
          const period = subscription.metadata?.billing_period;

          if (userId && plan) {
            await updateUserTier(userId, plan, invoice.subscription, period);
            console.log(`[Stripe] Renouvellement: user=${userId} plan=${plan}`);
          }
        }
        break;
      }

      // Échec de paiement → ne pas rétrograder immédiatement (Stripe réessaie)
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.warn(`[Stripe] Échec paiement: subscription=${invoice.subscription}`);
        break;
      }

      // Abonnement annulé ou expiré → rétrograder vers gratuit
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          await updateUserTier(userId, 'gratuit', null, null);
          console.log(`[Stripe] Abonnement annulé: user=${userId} → gratuit`);
        }
        break;
      }

      // Changement de plan (upgrade/downgrade)
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;
        const plan = subscription.metadata?.plan;
        const period = subscription.metadata?.billing_period;

        if (userId && plan && subscription.status === 'active') {
          await updateUserTier(userId, plan, subscription.id, period);
          console.log(`[Stripe] Abonnement mis à jour: user=${userId} plan=${plan}`);
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error('[Stripe Webhook] Erreur traitement:', err);
    return NextResponse.json({ error: 'Erreur traitement webhook' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
