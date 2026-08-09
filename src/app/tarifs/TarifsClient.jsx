'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePremium } from '@/contexts/PremiumContext';
import { useAuth } from '@/contexts/AuthContext';
import { PROMO, isPromoActive, promoDaysLeft } from '@/lib/promo';

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left">
        <span className="text-base font-semibold text-gray-900">{question}</span>
        <svg className={`faq-chevron w-5 h-5 text-gray-400 shrink-0 ml-4 ${open ? 'open' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
      </button>
      <div className={`faq-answer px-6 text-sm text-gray-600 leading-relaxed ${open ? 'open' : ''}`}>
        {answer}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
  );
}

function CrossIcon() {
  return (
    <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
  );
}

function PremiumCheckIcon() {
  return (
    <svg className="w-4 h-4 text-accent-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
  );
}

const BILLING_PERIODS = [
  { id: 'monthly', label: 'Mensuel' },
  { id: 'yearly', label: 'Annuel', badge: '-50%' },
];

// Tarifs normaux (hors offre de rentrée)
const PREMIUM_PRICING = {
  monthly: { display: '24,99', suffix: '/mois', note: 'sans engagement, annulable à tout moment' },
  yearly: { display: '12,50', suffix: '/mois', note: 'facturé 149,99 € par an', strike: '24,99', badge: '-150 €/an' },
};

// Tarifs pendant l'offre de rentrée (-50 % conservés tant que l'abonnement reste actif)
const PROMO_PRICING = {
  monthly: { display: '12,49', suffix: '/mois', strike: '24,99', badge: '-50 % à vie', note: 'à vie · sans engagement, annulable à tout moment' },
  yearly: { display: '6,25', suffix: '/mois', strike: '12,50', badge: '-75 % au total', note: 'facturé 74,99 € par an (au lieu de 149,99 €), à vie' },
};

export default function TarifsPage() {
  const { tier, isLoaded } = usePremium();
  const { user, accessToken } = useAuth();
  const [billing, setBilling] = useState('yearly');
  // Évalué dès le rendu : évite d'afficher un instant le prix plein avant le prix promo
  const [promo] = useState(() => (isPromoActive() ? { days: promoDaysLeft() } : null));
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleSubscribe = async (plan) => {
    if (!user) {
      window.location.href = '/connexion?redirect=/tarifs';
      return;
    }
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ plan, period: billing }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur lors de la création du paiement');
      }
    } catch {
      alert('Erreur réseau, veuillez réessayer.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePortal = async () => {
    setLoadingPlan('portal');
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Erreur réseau, veuillez réessayer.');
    } finally {
      setLoadingPlan(null);
    }
  };
  const pricing = (promo ? PROMO_PRICING : PREMIUM_PRICING)[billing];
  const isPaidTier = tier === 'essentiel' || tier === 'premium+';

  return (
    <>
      {/* Hero (compact) */}
      <section className="gradient-hero noise-overlay dot-grid pt-24 pb-8 md:pt-28 md:pb-10 relative overflow-hidden">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-3.5 py-1.5 rounded-full border border-violet-200 mb-4">
            <span className="text-sm leading-none">💎</span>
            <span className="text-xs font-semibold text-violet-700">Un seul plan, z&eacute;ro prise de t&ecirc;te</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-4">
            Tout illimit&eacute;, <span className="tarif-gradient-text">un seul prix</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Sans engagement, annulable &agrave; tout moment — et{' '}
            <strong className="text-gray-900">2 jours de Premium offerts</strong>{' '}
            &agrave; l&apos;inscription, sans carte bancaire.
          </p>

          {/* Bandeau offre de rentrée */}
          {promo && (
            <div
              className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl px-5 py-3.5 text-white shadow-xl shadow-indigo-500/25"
              style={{ background: 'linear-gradient(135deg, #1e1b4b, #4f46e5 60%, #7c3aed)' }}
            >
              <span className="inline-flex items-center gap-1.5 bg-amber-300 text-indigo-950 rounded-full px-3 py-1 text-xs font-black">
                🎓 {PROMO.discountLabel}{' '}&Agrave; VIE
              </span>
              <span className="text-sm font-semibold">
                Offre de rentr&eacute;e — la remise est conserv&eacute;e tant que tu restes abonn&eacute;
              </span>
              <span className="text-xs font-bold text-amber-200">
                Jusqu&apos;au {PROMO.endsAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} · J-{promo.days}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="formules" className="py-16 md:py-20 -mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Billing Toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center bg-white border border-gray-200 shadow-sm rounded-full p-1">
              {BILLING_PERIODS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setBilling(p.id)}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    billing === p.id
                      ? 'text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={billing === p.id ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' } : undefined}
                >
                  {p.label}
                  {p.badge && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      billing === p.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {p.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">

            {/* FREE */}
            <div className="pricing-card bg-white rounded-2xl border-2 border-gray-200 p-7">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              </div>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">D&eacute;couverte</h3>
                <p className="text-sm text-gray-500 mt-1">Pour tester la plateforme</p>
              </div>
              <div className="mb-5">
                <span className="text-4xl font-black text-gray-900">Gratuit</span>
              </div>
              {isLoaded && tier === 'gratuit' ? (
                <button className="block w-full py-3 text-center bg-gray-200 text-gray-700 font-bold rounded-xl mb-2 cursor-default">
                  Plan actuel &#10003;
                </button>
              ) : isLoaded && user ? (
                <Link
                  href="/dashboard"
                  className="block w-full py-3 text-center bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors mb-2"
                >
                  Tableau de bord →
                </Link>
              ) : (
                <Link
                  href="/inscription"
                  className="block w-full py-3 text-center bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors mb-2"
                >
                  Commencer gratuitement
                </Link>
              )}
              <div className="mb-3" />
              <div className="border-t border-gray-100 pt-5">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    <span><strong>2 jours de Premium offerts</strong>{' '}&agrave; l&apos;inscription</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    1 QCM par jour, corrections d&eacute;taill&eacute;es
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    <span><strong>Toutes les fiches</strong> accessibles</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    Dashboard, Pico, XP &amp; s&eacute;rie &#128293;
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CrossIcon />
                    QCM illimit&eacute;s g&eacute;n&eacute;r&eacute;s par IA
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CrossIcon />
                    Cours complets &amp; fiches PDF
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CrossIcon />
                    Examens blancs format concours
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CrossIcon />
                    Progression, Objectifs &amp; Classement
                  </li>
                </ul>
              </div>
            </div>

            {/* PREMIUM — plan unique */}
            <div className="relative">
              {/* Halo lumineux */}
              <div
                className="absolute -inset-2.5 rounded-3xl opacity-30 blur-2xl pointer-events-none"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              ></div>
            <div className="pricing-card popular bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-primary-500 p-7 text-white relative shadow-xl shadow-primary-500/20 h-full">
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-white text-xs font-bold rounded-full"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              >
                Recommandé
              </div>
              <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" /></svg>
              </div>
              <div className="mb-5">
                <h3 className="text-lg font-bold">Premium</h3>
                <p className="text-sm text-gray-400 mt-1">Tout illimit&eacute;, jusqu&apos;au concours</p>
              </div>
              <div className="mb-1">
                {pricing.strike && (
                  <span className="text-lg text-gray-500 line-through mr-2">{pricing.strike}&euro;</span>
                )}
                <span className="text-4xl font-black">{pricing.display}&euro;</span>
                <span className="text-sm text-gray-400">{pricing.suffix}</span>
                {pricing.badge && (
                  <span className="ml-2 inline-flex px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
                    {pricing.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-5">{pricing.note}</p>
              {isLoaded && isPaidTier ? (
                <>
                  <button className="block w-full py-3 text-center bg-accent-500 text-white font-bold rounded-xl mb-2 cursor-default">
                    Premium activ&eacute; &#10003;
                  </button>
                  <button
                    onClick={handlePortal}
                    disabled={loadingPlan === 'portal'}
                    className="block w-full py-2 text-center text-xs text-gray-400 hover:text-white transition-colors mb-5"
                  >
                    {loadingPlan === 'portal' ? 'Chargement...' : 'Gérer mon abonnement →'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleSubscribe('premium+')}
                  disabled={loadingPlan === 'premium+'}
                  className="block w-full py-3 text-center font-bold rounded-xl transition-opacity hover:opacity-90 mb-5 disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-900/40"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                >
                  {loadingPlan === 'premium+' ? 'Chargement...' : 'Passer Premium'}
                </button>
              )}
              <div className="border-t border-gray-700 pt-5">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <PremiumCheckIcon />
                    <span><strong className="text-white">QCM illimit&eacute;s</strong>{' '}g&eacute;n&eacute;r&eacute;s par IA</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <PremiumCheckIcon />
                    <span>Pile «&nbsp;&Agrave; consolider&nbsp;» — <strong className="text-white">r&eacute;p&eacute;tition espac&eacute;e</strong></span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <PremiumCheckIcon />
                    <span><strong className="text-white">Examens blancs</strong> format concours (40 q / 60 min)</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <PremiumCheckIcon />
                    <span><strong className="text-white">Cours complets</strong> + fiches PDF</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <PremiumCheckIcon />
                    <strong className="text-white">Progression, Objectifs &amp; Classement</strong>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <PremiumCheckIcon />
                    Pico, XP, d&eacute;fis &amp; s&eacute;rie — la gamification compl&egrave;te
                  </li>
                </ul>
              </div>
            </div>
            </div>
          </div>

          {/* Réassurance */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
              <span className="text-base leading-none">🔒</span> Paiement s&eacute;curis&eacute; via Stripe
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
              <span className="text-base leading-none">↩️</span> Annulable en 2 clics
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
              <span className="text-base leading-none">🎁</span> 2 jours d&apos;essai — sans carte bancaire
            </span>
          </div>

          {/* Ancrage : comparaison prépa privée */}
          <div
            className="mt-12 max-w-3xl mx-auto rounded-2xl border border-indigo-100 px-6 py-6 md:px-8 text-center"
            style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #faf9ff 60%)' }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Pour situer</p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Une pr&eacute;pa priv&eacute;e co&ucirc;te{' '}
              <strong className="text-gray-900">2 000 &agrave; 6 000 &euro; l&apos;ann&eacute;e</strong>.
              Ton QG de r&eacute;vision complet — QCM illimit&eacute;s, examens blancs, coach de
              progression — c&apos;est{' '}
              <strong className="text-indigo-600">
                {promo ? '74,99 € l’année' : '149,99 € l’année'}
              </strong>
              {promo ? ' pendant l’offre de rentrée.' : '.'}
            </p>
          </div>

          {/* FAQ Tarifs */}
          <div className="mt-20 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full border border-primary-200 mb-4">
                <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>
                <span className="text-sm font-semibold text-primary-700">FAQ Tarifs</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900">Questions sur les tarifs</h2>
            </div>
            <div className="space-y-4">
              <FaqItem
                question="Que se passe-t-il à la fin des 2 jours offerts ?"
                answer="Ton compte repasse automatiquement en plan Découverte — rien à faire, aucune carte bancaire n'est demandée. Tes XP, ta série et tes statistiques sont conservés, et tu peux passer Premium quand tu veux."
              />
              <FaqItem
                question="Puis-je passer du mensuel à l'annuel (et inversement) ?"
                answer="Oui, à tout moment depuis « Gérer mon abonnement » dans ton tableau de bord. Le changement prend effet immédiatement et la facturation est ajustée au prorata."
              />
              <FaqItem
                question="Y a-t-il un engagement de durée ?"
                answer="Non, aucun engagement. Tu peux résilier en 2 clics depuis ton tableau de bord. Ton accès reste actif jusqu'à la fin de la période payée."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
