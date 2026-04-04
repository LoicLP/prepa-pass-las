import Link from 'next/link';

export const metadata = {
  title: 'Paiement annulé - Prépa PASS/LAS',
};

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Paiement annulé</h1>
        <p className="text-gray-500 mb-8">
          Ton paiement a été annulé. Tu peux reprendre à tout moment depuis la page des tarifs.
        </p>
        <div className="space-y-3">
          <Link
            href="/tarifs"
            className="block w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Voir les formules →
          </Link>
          <Link
            href="/"
            className="block w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
