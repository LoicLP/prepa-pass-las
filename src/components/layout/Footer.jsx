import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">Prépa <span className="text-primary-400">PASS/LAS</span></span>
            </div>
            <p className="text-sm leading-relaxed">La plateforme d&apos;entraînement de référence pour la réussite du concours PASS/LAS en première année de santé.</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Ressources Santé</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/programme" className="hover:text-primary-400 transition-colors">Programme PASS 2025-2026</Link></li>
              <li><Link href="/blog" className="hover:text-primary-400 transition-colors">Guide PASS vs LAS</Link></li>
              <li><Link href="/qcm" className="hover:text-primary-400 transition-colors">QCM d&apos;entraînement</Link></li>
              <li><Link href="/fiches" className="hover:text-primary-400 transition-colors">Fiches de révision</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Légal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Mentions légales</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">CGV</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          &copy; 2026 Prépa PASS/LAS. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
