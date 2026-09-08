import Link from 'next/link';
import { PROMO, isPromoActive, promoDaysLeft } from '@/lib/promo';

/**
 * Bandeau « Offre de rentrée -50 % » en haut des pages publiques.
 * Rendu côté serveur (pas de flash au chargement) ; les pages qui l'utilisent
 * déclarent `revalidate` pour que l'offre s'éteigne d'elle-même à l'échéance.
 *
 * Le header du site est `fixed` (h-16 / md:h-18) : la classe `promo-banner`
 * ajoute la compensation et réduit d'autant le padding du hero suivant (globals.css).
 * Même langage que le CTA final de l'accueil : fond ardoise, grille fine, halo indigo.
 */
export default function PromoBanner() {
  if (!isPromoActive()) return null;

  const days = promoDaysLeft();
  const deadline = PROMO.endsAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

  return (
    <section className="promo-banner pt-16 md:pt-18 relative z-10 bg-slate-900 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '44px 44px' }}
        aria-hidden="true"
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[220px] bg-indigo-600/40 rounded-full blur-[90px] pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 bg-amber-300 text-slate-900 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider">
              {PROMO.discountLabel}{' '}à vie
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-indigo-100 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" aria-hidden="true" />
              J-{days}
            </span>
          </span>
          <p className="text-sm text-slate-300">
            <strong className="text-white font-semibold">Offre de rentrée</strong>{' '}— le Premium à moitié prix, tant que tu restes abonné. Jusqu&apos;au {deadline}.
          </p>
          <Link
            href="/tarifs"
            className="group shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors shadow-lg shadow-black/20"
          >
            J&apos;en profite
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
