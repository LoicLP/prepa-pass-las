import Link from 'next/link';

export const metadata = {
  title: 'Paiement réussi - Prépa PASS/LAS',
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Paiement réussi !</h1>
        <p className="text-gray-500 mb-8">
          Ton abonnement est activé. Toutes les fonctionnalités premium sont maintenant disponibles.
        </p>
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Accéder au dashboard →
          </Link>
          <Link
            href="/qcm"
            className="block w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Commencer un QCM
          </Link>
        </div>
      </div>
    </div>
  );
}
