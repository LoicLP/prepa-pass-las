'use client';

import Link from 'next/link';

const TIER_CONFIG = {
  essentiel: {
    title: 'Passez \u00e0 l\u2019Essentiel',
    description: 'Cette fonctionnalit\u00e9 est r\u00e9serv\u00e9e aux membres Essentiel. D\u00e9bloquez les QCM illimit\u00e9s, les cours, le mode examen et bien plus.',
    buttonText: 'D\u00e9couvrir l\u2019Essentiel',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    buttonBg: 'bg-primary-600 hover:bg-primary-700',
  },
  'premium+': {
    title: 'Passez au Premium+',
    description: 'Cette fonctionnalit\u00e9 est r\u00e9serv\u00e9e aux membres Premium+. Acc\u00e9dez au mode examen complet, au suivi de progression avanc\u00e9 et au classement.',
    buttonText: 'D\u00e9couvrir le Premium+',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    buttonBg: 'bg-gray-900 hover:bg-gray-800',
  },
};

export default function UpgradeModal({ onClose, requiredTier = 'essentiel' }) {
  const config = TIER_CONFIG[requiredTier] || TIER_CONFIG.essentiel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-6 max-w-sm w-full shadow-xl animate-[modalEnter_0.25s_ease-out]">
        <div className="text-center mb-5">
          <div className={`w-14 h-14 mx-auto ${config.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
            <svg className={`w-7 h-7 ${config.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">{config.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{config.description}</p>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <Link
            href="/tarifs"
            className={`w-full py-3 ${config.buttonBg} text-white font-bold rounded-xl transition-colors text-sm text-center flex items-center justify-center gap-2`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
            {config.buttonText}
          </Link>
        </div>

        <button
          onClick={onClose}
          className="w-full text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
