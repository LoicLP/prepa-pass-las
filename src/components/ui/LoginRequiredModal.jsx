'use client';

import Link from 'next/link';

export default function LoginRequiredModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-6 max-w-sm w-full shadow-xl animate-[modalEnter_0.25s_ease-out]">
        <div className="text-center mb-5">
          <div className="w-14 h-14 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Connexion requise</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Connectez-vous pour acc&eacute;der aux QCM et suivre votre progression.
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <Link
            href="/connexion"
            className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors text-sm text-center flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Se connecter
          </Link>
          <Link
            href="/inscription"
            className="w-full py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors text-sm text-center"
          >
            Cr&eacute;er un compte
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
