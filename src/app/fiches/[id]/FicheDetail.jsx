'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/contexts/PremiumContext';
import { sanitizeHtml } from '@/utils/sanitize';

const SUBJECT_ICONS = {
  anatomie: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z',
  chimie: 'M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5',
  biocell: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z',
  biostats: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  biophysique: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
  ssh: 'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
};

const COLOR_MAP = {
  indigo:     { badge: 'bg-indigo-100 text-indigo-700', icon: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  emerald:    { badge: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  violet:     { badge: 'bg-violet-100 text-violet-700', icon: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  cyan:       { badge: 'bg-cyan-100 text-cyan-700', icon: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
  amber:      { badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  rose:       { badge: 'bg-rose-100 text-rose-700', icon: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  primary:    { badge: 'bg-indigo-100 text-indigo-700', icon: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
};

export default function FicheDetail({ fiche, subject, related }) {
  const { user } = useAuth();
  const { isPremiumPlus } = usePremium();
  const colors = COLOR_MAP[subject?.color] || COLOR_MAP.primary;
  const iconPath = SUBJECT_ICONS[fiche.subject] || SUBJECT_ICONS.anatomie;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100" aria-label="Fil d'Ariane">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-primary-600 transition-colors">Accueil</Link></li>
            <li><span className="text-gray-300">/</span></li>
            <li><Link href="/fiches" className="hover:text-primary-600 transition-colors">Fiches</Link></li>
            <li><span className="text-gray-300">/</span></li>
            <li><span className={`font-medium ${colors.icon}`}>{subject?.name || fiche.subject}</span></li>
            <li><span className="text-gray-300">/</span></li>
            <li className="text-gray-700 font-medium truncate max-w-[200px]">{fiche.title}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">

          {/* ===== MAIN CONTENT ===== */}
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${colors.bg} ${colors.border} border rounded-xl flex items-center justify-center shrink-0`}>
                  <svg className={`w-5 h-5 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                  </svg>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>
                  {subject?.name || fiche.subject}
                </span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 leading-tight mb-3">{fiche.title}</h1>
              <p className="text-gray-500 text-base leading-relaxed">{fiche.summary}</p>
            </div>

            {/* Content — visible par tous pour le SEO */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <div
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(fiche.content) }}
              />
            </div>

            {/* CTA selon état de connexion */}
            {user ? (
              <div className="mt-6 bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-base">Entraîne-toi sur cette matière</p>
                    <p className="text-primary-200 text-sm mt-0.5">QCM illimités, mode examen et suivi de progression.</p>
                  </div>
                  <Link href="/qcm" className="shrink-0 px-5 py-2.5 bg-white text-primary-700 text-sm font-bold rounded-xl hover:bg-primary-50 transition-colors shadow-sm">
                    Faire un QCM →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
                <p className="font-bold text-gray-900 mb-1">Prêt à t&apos;entraîner ?</p>
                <p className="text-sm text-gray-500 mb-4">Crée ton compte gratuit pour accéder aux QCM, fiches et mode examen.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/inscription" className="px-6 py-3 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition-colors">
                    Créer un compte gratuit →
                  </Link>
                  <Link href="/connexion" className="px-6 py-3 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors">
                    Se connecter
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation entre fiches */}
            <div className="mt-4 flex gap-3">
              <Link
                href="/fiches"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Toutes les fiches
              </Link>
            </div>
          </div>

          {/* ===== SIDEBAR ===== */}
          <aside className="space-y-5">

            {/* PDF + Cours Premium */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Aller plus loin</h2>
              <div className="space-y-2">
                {/* Cours détaillé */}
                {isPremiumPlus ? (
                  <Link
                    href="/cours"
                    className={`flex items-center gap-3 p-3 ${colors.bg} ${colors.border} border rounded-xl hover:opacity-80 transition-opacity`}
                  >
                    <svg className={`w-4 h-4 ${colors.icon} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    <span className={`text-sm font-semibold ${colors.icon}`}>Cours détaillé</span>
                  </Link>
                ) : (
                  <Link
                    href="/tarifs"
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-400 flex-1">Cours détaillé</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Premium+</span>
                  </Link>
                )}
                {/* Télécharger PDF */}
                {isPremiumPlus ? (
                  <button
                    onClick={() => window.print()}
                    className={`w-full flex items-center gap-3 p-3 ${colors.bg} ${colors.border} border rounded-xl hover:opacity-80 transition-opacity`}
                  >
                    <svg className={`w-4 h-4 ${colors.icon} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span className={`text-sm font-semibold ${colors.icon}`}>Télécharger en PDF</span>
                  </button>
                ) : (
                  <Link
                    href="/tarifs"
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-400 flex-1">Télécharger en PDF</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Premium+</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Fiches de la même matière */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${colors.bg.replace('bg-', 'bg-').replace('-50', '-500')}`}></span>
                  Autres fiches — {subject?.name}
                </h2>
                <ul className="space-y-2">
                  {related.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/fiches/${r.id}`}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className={`w-7 h-7 ${colors.bg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
                          <svg className={`w-3.5 h-3.5 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors leading-snug">{r.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/fiches"
                  className={`mt-3 block text-center text-xs font-semibold ${colors.icon} hover:underline`}
                >
                  Voir toutes les fiches →
                </Link>
              </div>
            )}

            {/* CTA compact */}
            <div className={`${colors.bg} ${colors.border} border rounded-2xl p-5`}>
              <div className={`w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
                <svg className={`w-4.5 h-4.5 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">Prépa PASS/LAS</p>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">QCM, cours détaillés, mode examen et suivi de progression pour réussir ton concours.</p>
              <Link
                href="/inscription"
                className="block text-center px-4 py-2.5 bg-primary-600 text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition-colors"
              >
                Commencer gratuitement
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </>
  );
}
