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
          // Récupérer l'éventuel abonnement précédent AVANT de le remplacer
          const { data: profile } = await supabaseAdmin
            .from('user_profiles').select('stripe_subscription_id').eq('id', userId).single();
          const previousSub = profile?.stripe_subscription_id;

          await updateUserTier(userId, plan, subscriptionId, period);
          console.log(`[Stripe] Abonnement activé: user=${userId} plan=${plan} period=${period}`);

          // Changement de formule : annuler l'ancien abonnement pour éviter la double facturation.
          // (Son événement `deleted` sera ignoré car il n'est plus l'abonnement courant.)
          if (previousSub && previousSub !== subscriptionId) {
            try {
              await getStripe().subscriptions.cancel(previousSub);
              console.log(`[Stripe] Ancien abonnement annulé: ${previousSub} (remplacé par ${subscriptionId})`);
            } catch (e) {
              console.warn(`[Stripe] Annulation de l'ancien abonnement ${previousSub} impossible: ${e.message}`);
            }
          }
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

      // Abonnement annulé ou expiré → rétrograder vers gratuit,
      // UNIQUEMENT si c'est bien l'abonnement courant de l'utilisateur.
      // (Sinon, l'annulation d'un ancien abonnement après un changement de formule
      //  écraserait le nouveau — c'est le bug qui a rétrogradé un client Premium+.)
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          const { data: profile } = await supabaseAdmin
            .from('user_profiles').select('stripe_subscription_id').eq('id', userId).single();
          const current = profile?.stripe_subscription_id;

          if (!current || current === subscription.id) {
            await updateUserTier(userId, 'gratuit', null, null);
            console.log(`[Stripe] Abonnement annulé: user=${userId} → gratuit`);
          } else {
            console.log(`[Stripe] deleted ignoré: ${subscription.id} n'est pas l'abonnement courant (${current}) de user=${userId}`);
          }
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
          // N'appliquer que si c'est l'abonnement courant (ou qu'aucun n'est enregistré)
          const { data: profile } = await supabaseAdmin
            .from('user_profiles').select('stripe_subscription_id').eq('id', userId).single();
          const current = profile?.stripe_subscription_id;

          if (!current || current === subscription.id) {
            await updateUserTier(userId, plan, subscription.id, period);
            console.log(`[Stripe] Abonnement mis à jour: user=${userId} plan=${plan}`);
          } else {
            console.log(`[Stripe] updated ignoré: ${subscription.id} n'est pas l'abonnement courant (${current}) de user=${userId}`);
          }
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
