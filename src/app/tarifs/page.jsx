'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePremium } from '@/contexts/PremiumContext';

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

export default function TarifsPage() {
  const { tier, setSubscription, isLoaded } = usePremium();

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero noise-overlay dot-grid pt-28 pb-10 md:pt-36 md:pb-14 relative overflow-hidden">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-4">
            Des tarifs <span className="tarif-gradient-text">adapt&eacute;s</span> &agrave; chaque &eacute;tudiant
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Choisissez la formule qui correspond &agrave; votre rythme. <strong className="text-gray-900">Sans engagement</strong>, annulable &agrave; tout moment.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="formules" className="py-16 md:py-20 -mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">

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
                <button className="block w-full py-3 text-center bg-accent-500 text-white font-bold rounded-xl mb-2 cursor-default">
                  Plan actuel &#10003;
                </button>
              ) : (
                <button
                  onClick={() => setSubscription('gratuit')}
                  className="block w-full py-3 text-center bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors mb-2"
                >
                  R&eacute;initialiser (Simulation)
                </button>
              )}
              <div className="mb-3" />
              <div className="border-t border-gray-100 pt-5">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    1 QCM par jour
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    <strong>Toutes les fiches</strong> accessibles
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    Corrections d&eacute;taill&eacute;es
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CrossIcon />
                    Fiches t&eacute;l&eacute;chargeables en PDF
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CrossIcon />
                    Acc&egrave;s aux cours
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CrossIcon />
                    Mode Examen
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CrossIcon />
                    Mode Examen complet
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CrossIcon />
                    Suivi de progression avanc&eacute;
                  </li>
                </ul>
              </div>
            </div>

            {/* ESSENTIEL */}
            <div className="pricing-card popular bg-white rounded-2xl border-2 border-primary-500 p-7 relative shadow-xl shadow-primary-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                Le plus populaire
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
              </div>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">Essentiel</h3>
                <p className="text-sm text-gray-500 mt-1">Pour une pr&eacute;paration compl&egrave;te</p>
              </div>
              <div className="mb-5">
                <span className="text-4xl font-black text-gray-900">19,90&euro;</span>
                <span className="text-sm text-gray-500">/mois</span>
              </div>
              {isLoaded && tier === 'essentiel' ? (
                <>
                  <button className="block w-full py-3 text-center bg-accent-500 text-white font-bold rounded-xl mb-2 cursor-default">
                    Essentiel activ&eacute; &#10003;
                  </button>
                  <button
                    onClick={() => setSubscription('gratuit')}
                    className="block w-full py-2 text-center text-xs text-gray-500 hover:text-red-400 transition-colors mb-3"
                  >
                    D&eacute;sactiver (simulation)
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSubscription('essentiel')}
                  className="block w-full py-3 text-center bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25 mb-5"
                >
                  Activer Essentiel (Simulation)
                </button>
              )}
              <div className="border-t border-primary-100 pt-5">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    <strong>QCM illimit&eacute;s</strong>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    Fiches t&eacute;l&eacute;chargeables en <strong>PDF</strong>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    <strong>Acc&egrave;s aux cours</strong> d&eacute;taill&eacute;s
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    <strong>Mode Examen</strong> chronom&eacute;tr&eacute;
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    Corrections d&eacute;taill&eacute;es
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CrossIcon />
                    Mode Examen complet
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CrossIcon />
                    Suivi de progression avanc&eacute;
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <CrossIcon />
                    Classement et comparaison
                  </li>
                </ul>
              </div>
            </div>

            {/* PREMIUM+ */}
            <div className="pricing-card bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-gray-700 p-7 text-white">
              <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" /></svg>
              </div>
              <div className="mb-5">
                <h3 className="text-lg font-bold">Premium+</h3>
                <p className="text-sm text-gray-400 mt-1">La pr&eacute;paration ultime</p>
              </div>
              <div className="mb-5">
                <span className="text-4xl font-black">39,90&euro;</span>
                <span className="text-sm text-gray-400">/mois</span>
              </div>
              {isLoaded && tier === 'premium+' ? (
                <>
                  <button className="block w-full py-3 text-center bg-accent-500 text-white font-bold rounded-xl mb-2 cursor-default">
                    Premium+ activ&eacute; &#10003;
                  </button>
                  <button
                    onClick={() => setSubscription('gratuit')}
                    className="block w-full py-2 text-center text-xs text-gray-500 hover:text-red-400 transition-colors mb-5"
                  >
                    D&eacute;sactiver (simulation)
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSubscription('premium+')}
                  className="block w-full py-3 text-center bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors mb-5"
                >
                  Activer Premium+ (Simulation)
                </button>
              )}
              <div className="border-t border-gray-700 pt-5">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <PremiumCheckIcon />
                    <strong className="text-white">Tout de l&apos;Essentiel</strong>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <PremiumCheckIcon />
                    <strong className="text-white">Mode Examen complet</strong>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <PremiumCheckIcon />
                    <strong className="text-white">Suivi de progression avanc&eacute;</strong>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <PremiumCheckIcon />
                    <strong className="text-white">Classement et comparaison</strong>
                  </li>
                </ul>
              </div>
            </div>
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
                question="Puis-je changer de formule \u00e0 tout moment ?"
                answer="Oui, vous pouvez passer d&#39;une formule \u00e0 l&#39;autre \u00e0 tout moment. Le changement prend effet imm\u00e9diatement et votre facturation est ajust\u00e9e au prorata."
              />
              <FaqItem
                question="Y a-t-il un engagement de dur\u00e9e ?"
                answer="Non, aucun engagement. Vous pouvez r\u00e9silier \u00e0 tout moment depuis votre tableau de bord. Votre acc\u00e8s reste actif jusqu&#39;\u00e0 la fin de la p\u00e9riode pay\u00e9e."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
