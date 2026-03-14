'use client';

import { useState } from 'react';
import Link from 'next/link';

const FAQ_ITEMS = [
  {
    question: 'Quelle est la différence entre PASS et LAS ?',
    answer: (
      <>
        Le PASS est une année dédiée aux matières de santé avec une option mineure. Vous
        n&apos;avez qu&apos;une seule chance. Le LAS est une licence classique avec une option
        santé. Vous pouvez candidater deux fois. Les deux voies mènent aux mêmes filières :
        médecine, pharmacie, maïeutique, odontologie et kinésithérapie.{' '}
        <Link href="/blog" className="text-primary-600 font-semibold underline">
          En savoir plus
        </Link>
      </>
    ),
  },
  {
    question: 'La plateforme est-elle adaptée à toutes les universités ?',
    answer:
      'Oui, notre contenu couvre le tronc commun national du programme PASS/LAS. Les matières fondamentales sont communes à toutes les universités.',
  },
  {
    question: 'Puis-je utiliser la plateforme dès la terminale ?',
    answer:
      'Absolument ! Commencer dès la terminale est un excellent moyen de prendre de l\'avance sur les matières et le format QCM.',
  },
  {
    question: 'Comment fonctionne le système de QCM ?',
    answer: (
      <>
        Notre système génère des QCM adaptés par matière avec corrections détaillées.
        L&apos;algorithme identifie vos points faibles pour progresser efficacement.{' '}
        <Link href="/qcm" className="text-primary-600 font-semibold underline">
          Essayer maintenant
        </Link>
      </>
    ),
  },
  {
    question: 'Combien de temps dois-je consacrer aux révisions ?',
    answer:
      'En PASS, 8 à 10h par jour. Notre plateforme aide à optimiser ce temps avec des sessions QCM ciblées de 30 min à 1h en complément. La régularité est la clé.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-indigo-50/40 dot-grid relative overflow-hidden">
      <div className="geo-ring-light w-56 h-56 -top-16 right-[8%] hidden lg:block"></div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">
          Questions fréquentes
        </h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-200">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-base font-semibold text-gray-900">{item.question}</span>
                <svg
                  className={`faq-chevron w-5 h-5 text-gray-400 shrink-0 ml-4 ${
                    openIndex === index ? 'open' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              <div
                className={`faq-answer px-6 text-sm text-gray-600 leading-relaxed ${
                  openIndex === index ? 'open' : ''
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
