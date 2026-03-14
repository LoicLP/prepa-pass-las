'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { href: '/qcm', label: 'QCM' },
  { href: '/fiches', label: 'Fiches/Cours' },
  { href: '/examen', label: 'Mode Examen' },
  { href: '/blog', label: 'Blog' },
  { href: '/tarifs', label: 'Tarifs' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logOut } = useAuth();

  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (err) {
      console.error('Erreur de déconnexion:', err);
    }
  };

  // Initiale de l'utilisateur
  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : '?';

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 fixed top-0 inset-x-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold text-gray-900">Prépa <span className="text-primary-600">PASS/LAS</span></span>
              <p className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase -mt-0.5">Votre réussite en santé</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm ${isActive(link.href) ? 'text-primary-600 font-semibold' : 'text-gray-600 font-medium hover:text-primary-600 transition-colors'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  /* ---- Connecté ---- */
                  <div className="hidden sm:flex items-center gap-3">
                    {/* Avatar initiale */}
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-700">{userInitial}</span>
                    </div>
                    {/* Dashboard */}
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
                    >
                      Mon tableau de bord
                    </Link>
                    {/* Déconnexion */}
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                      title="Se déconnecter"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  /* ---- Déconnecté ---- */
                  <div className="hidden sm:flex items-center gap-2">
                    <Link
                      href="/connexion"
                      className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/inscription"
                      className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
                    >
                      Inscription
                    </Link>
                  </div>
                )}
              </>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
          {!loading && (
            <>
              {user ? (
                /* ---- Mobile : Connecté ---- */
                <>
                  <div className="flex items-center gap-3 py-3 border-t border-gray-100 mt-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-700">{userInitial}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.displayName || user.email}</span>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block mt-1 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl text-center"
                  >
                    Mon tableau de bord
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="block w-full mt-2 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl text-center transition-colors"
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                /* ---- Mobile : Déconnecté ---- */
                <>
                  <Link
                    href="/connexion"
                    onClick={() => setMenuOpen(false)}
                    className="block mt-2 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-primary-600 text-center border border-gray-200 rounded-xl"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/inscription"
                    onClick={() => setMenuOpen(false)}
                    className="block mt-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl text-center"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}
