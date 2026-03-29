import Link from 'next/link';

export const metadata = {
  title: 'Page introuvable - Prépa PASS/LAS',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <h1 className="text-6xl font-black text-gray-900 mb-3">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Page introuvable</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Cette page n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil ou explorez nos contenus.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/qcm"
          className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Faire un QCM
        </Link>
      </div>
    </div>
  );
}
