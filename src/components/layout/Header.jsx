'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { href: '/fiches', label: 'Fiches/Cours' },
  { href: '/qcm', label: 'QCM' },
  { href: '/examen', label: 'Mode Examen' },
  { href: '/facs', label: 'Facultés' },
  { href: '/blog', label: 'Blog' },
  { href: '/tarifs', label: 'Tarifs' },
];

const CapIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
  </svg>
);

/* Header en pastille flottante (inspiré de prepa-police.fr) : capsule translucide centrée,
   logo animé (pompon qui se balance, lancer de chapeau au survol), liens en gras,
   action principale en pilule noire. Une barre fine en haut suit l'avancement de la lecture. */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logOut } = useAuth();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Le dashboard a son propre layout avec sidebar — pas de header global
  if (pathname?.startsWith('/dashboard')) return null;

  const isActive = (href) => pathname === href || (href !== '/' && pathname?.startsWith(href + '/'));
  const handleLogout = async () => {
    try { await logOut(); router.push('/'); } catch (err) { console.error('Erreur de déconnexion:', err); }
  };
  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <>
      {/* Desktop : capsule flottante (mêmes cotes que la référence : 60 px de haut, 1060 px max, gris translucide) */}
      <nav className="nav-teinte hidden md:flex fixed left-1/2 top-6 -translate-x-1/2 z-50 h-[60px] w-[min(1060px,calc(100vw-32px))] items-center gap-x-3 lg:gap-x-5 rounded-full backdrop-blur-xl px-4 lg:px-6 py-2">
        <Link href="/" className="nav-logo flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-80" aria-label="Accueil Prépa PASS/LAS">
          <span className="nav-logo-cap nav-teinte-cap relative text-white p-1.5 rounded-xl shadow-sm flex items-center justify-center">
            <span className="nav-logo-tassel" aria-hidden="true" />
            <CapIcon className="w-6 h-6" />
          </span>
          <span className="hidden lg:inline font-black text-lg tracking-tight text-slate-900">Prépa <span className="nav-teinte-texte">PASS/LAS</span></span>
        </Link>

        <div className="flex items-center gap-x-1 mx-auto">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`px-2.5 lg:px-3.5 py-2 whitespace-nowrap text-[0.95rem] font-bold transition-opacity hover:opacity-80 ${isActive(link.href) ? 'nav-teinte-texte' : 'text-[#0d0d0d]'}`}>
              {link.label}
            </Link>
          ))}
        </div>

        {!loading && (user ? (
          <div className="flex items-center gap-x-3 lg:gap-x-5 shrink-0">
            <Link href="/dashboard" className="inline-flex items-center justify-center h-[44px] bg-[#141414] hover:bg-black/80 text-white text-[0.95rem] font-bold px-4 rounded-full transition-colors whitespace-nowrap">Mon tableau de bord</Link>
            <button onClick={handleLogout} className="w-9 h-9 rounded-full flex items-center justify-center text-[#0d0d0d] hover:opacity-70 transition-opacity" title="Se déconnecter" aria-label="Se déconnecter">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-x-3 lg:gap-x-5 shrink-0">
            <Link href="/connexion" className="w-fit text-[0.95rem] font-bold text-[#0d0d0d] transition-opacity hover:opacity-80">Connexion</Link>
            <Link href="/inscription" className="inline-flex items-center justify-center h-[44px] bg-[#141414] hover:bg-black/80 text-white text-[0.95rem] font-bold px-4 rounded-full transition-colors">Inscription</Link>
          </div>
        ))}
      </nav>

      {/* Mobile : barre pleine largeur */}
      <nav className="md:hidden fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5 px-5 h-14 flex items-center justify-between">
        <Link href="/" className="nav-logo flex items-center gap-2" aria-label="Accueil Prépa PASS/LAS">
          <span className="nav-logo-cap nav-teinte-cap relative text-white p-1 rounded-lg flex items-center justify-center">
            <span className="nav-logo-tassel nav-logo-tassel-sm" aria-hidden="true" />
            <CapIcon className="w-5 h-5" />
          </span>
          <span className="font-black text-base tracking-tight text-slate-900">Prépa <span className="nav-teinte-texte">PASS/LAS</span></span>
        </Link>
        <button onClick={() => setMenuOpen((v) => !v)} className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-[#0d0d0d]" aria-label="Menu" aria-expanded={menuOpen}>
          {menuOpen
            ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>}
        </button>
      </nav>
      {menuOpen && (
        <div className="md:hidden fixed top-14 inset-x-0 z-50 bg-white border-b border-black/5 px-5 pb-5 pt-2 shadow-[0_20px_40px_-24px_rgba(15,16,32,0.35)]">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`block py-3 text-[15px] font-bold ${isActive(link.href) ? 'text-indigo-600' : 'text-[#0d0d0d]'}`}>{link.label}</Link>
          ))}
          {!loading && (user ? (
            <div className="mt-2 pt-3 border-t border-black/5">
              <div className="flex items-center gap-3 py-2">
                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">{userInitial}</span>
                <span className="text-sm font-medium text-gray-700 truncate">{user.displayName || user.email}</span>
              </div>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block mt-1 h-[44px] leading-[44px] bg-[#141414] text-white text-[0.95rem] font-bold rounded-full text-center">Mon tableau de bord</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full mt-2 py-2.5 text-sm font-semibold text-red-600 text-center">Se déconnecter</button>
            </div>
          ) : (
            <div className="mt-2 pt-3 border-t border-black/5 grid grid-cols-2 gap-2">
              <Link href="/connexion" onClick={() => setMenuOpen(false)} className="h-[44px] leading-[42px] text-[0.95rem] font-bold text-[#0d0d0d] text-center border border-black/10 rounded-full">Connexion</Link>
              <Link href="/inscription" onClick={() => setMenuOpen(false)} className="h-[44px] leading-[44px] bg-[#141414] text-white text-[0.95rem] font-bold rounded-full text-center">Inscription</Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
