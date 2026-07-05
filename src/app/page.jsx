import { Fragment } from 'react';
import Link from 'next/link';
import { PROGRAMME_DATA } from '@/data/programme';
import QuestionDuJour from '@/components/home/QuestionDuJour';
import FaqSection from '@/components/home/FaqSection';
import ConcoursBanner from '@/components/ConcoursBanner';

export const metadata = {
  title: {
    absolute: 'Prépa PASS/LAS - Réussissez votre première année de médecine',
  },
  description: 'La plateforme de révision n°1 pour réussir le concours PASS/LAS. QCM illimités, fiches de cours, mode examen et suivi de progression.',
  alternates: { canonical: '/' },
};

function StarIcon() {
  return (
    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <div className="w-5 h-5 min-w-[20px] min-h-[20px] bg-accent-400/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
      <svg
        className="w-3 h-3 text-accent-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    </div>
  );
}

const UE_BG_COLORS = {
  indigo: 'bg-indigo-500/30',
  emerald: 'bg-emerald-500/30',
  violet: 'bg-violet-500/30',
  cyan: 'bg-cyan-500/30',
  amber: 'bg-amber-500/30',
  rose: 'bg-rose-500/30',
};

// Codes UE officiels (identiques à ceux utilisés dans l'application)
const UE_CODES = {
  chimie: 'UE1',
  biocell: 'UE2',
  biophysique: 'UE3',
  biostats: 'UE4',
  anatomie: 'UE5',
  ssh: 'UE6',
};

// Couleurs pleines par UE (rail + pastille) pour la section programme
const UE_SOLID_COLORS = {
  indigo: '#818cf8',
  emerald: '#34d399',
  violet: '#a78bfa',
  cyan: '#22d3ee',
  amber: '#fbbf24',
  rose: '#fb7185',
};

// Palette par étape de la méthode (classes Tailwind complètes → détectées par le JIT)
const METHODE_COLORS = {
  indigo: { rail: 'from-indigo-500 to-violet-500', iconBg: 'bg-indigo-50', icon: 'text-indigo-600', num: 'text-indigo-500', border: 'hover:border-indigo-300', arrow: 'text-indigo-600' },
  violet: { rail: 'from-violet-500 to-fuchsia-500', iconBg: 'bg-violet-50', icon: 'text-violet-600', num: 'text-violet-500', border: 'hover:border-violet-300', arrow: 'text-violet-600' },
  amber: { rail: 'from-amber-400 to-orange-500', iconBg: 'bg-amber-50', icon: 'text-amber-600', num: 'text-amber-500', border: 'hover:border-amber-300', arrow: 'text-amber-600' },
  rose: { rail: 'from-rose-500 to-pink-500', iconBg: 'bg-rose-50', icon: 'text-rose-600', num: 'text-rose-500', border: 'hover:border-rose-300', arrow: 'text-rose-600' },
  emerald: { rail: 'from-emerald-500 to-teal-500', iconBg: 'bg-emerald-50', icon: 'text-emerald-600', num: 'text-emerald-500', border: 'hover:border-emerald-300', arrow: 'text-emerald-600' },
};

const METHODE_STEPS = [
  {
    href: '/qcm', color: 'indigo',
    icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    title: 'QCM illimités par IA',
    desc: <>Générés <strong>par matière, fiche ou thème libre</strong> — corrections détaillées et réponses multiples, comme au concours.</>,
  },
  {
    href: '/qcm', color: 'violet', isNew: true,
    icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99',
    title: 'À consolider',
    desc: <>Chaque erreur rejoint ta <strong>pile de révision</strong>. Tu la rejoues jusqu&apos;à la maîtriser : c&apos;est la répétition espacée.</>,
  },
  {
    href: '/qcm', color: 'amber', isNew: true,
    icon: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
    title: 'Session éclair',
    desc: <><strong>8 questions chrono en 5 minutes.</strong> Parfait entre deux cours, dans le bus, avant de dormir.</>,
  },
  {
    href: '/examen', color: 'rose',
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    title: 'Examen blanc concours',
    desc: <><strong>40 questions mélangées, 60 min</strong>, grille de réponses et chrono : les vraies conditions du jour J.</>,
  },
  {
    href: '/fiches', color: 'indigo',
    icon: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
    title: 'Fiches & cours trackés',
    desc: <><strong>150 fiches</strong> avec temps de lecture, sommaire et suivi «&nbsp;lue&nbsp;» — tu sais toujours où tu en es.</>,
  },
  {
    href: '/dashboard', color: 'emerald', isNew: true,
    icon: 'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941',
    title: 'Coach de progression',
    desc: <>Courbe par matière, objectifs hebdo et une reco claire :{' '}<strong>«&nbsp;l&apos;Anatomie te freine, 3 QCM et tu passes la barre&nbsp;»</strong>.</>,
  },
];

const METHODE_LOOP = ["S'entraîner", 'Consolider', 'Valider', 'Progresser'];

export default function Home() {
  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <section
        id="accueil"
        className="relative gradient-hero noise-overlay dot-grid pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
      >
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="absolute w-[350px] h-[350px] bg-violet-200/20 rounded-full filter blur-[80px] top-1/2 left-1/3 -translate-y-1/2 hidden lg:block"></div>
        {/* Geometric decorations */}
        <div className="geo-circle-light w-40 h-40 top-24 right-[10%] hidden lg:block"></div>
        <div className="geo-ring-light w-64 h-64 -bottom-16 left-[5%] hidden lg:block"></div>
        <div className="geo-circle-light w-20 h-20 top-[60%] right-[25%] hidden lg:block"></div>
        <div className="geo-ring-light w-32 h-32 top-16 left-[20%] hidden lg:block"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-violet-200 mb-6">
                <span className="text-base leading-none">🦉</span>
                <span className="text-sm font-semibold text-violet-700">
                  Avec Pico, ton coach de révision
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
                Le QG de révision qui te fait{' '}
                <span className="home-gradient-text">tenir jusqu&apos;au concours</span>.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl">
                QCM illimités corrigés, <strong className="text-gray-900">révisions espacées</strong> de
                tes erreurs, <strong className="text-gray-900">examens blancs</strong> en conditions
                concours — et un système de progression qui récompense ta{' '}
                <strong className="text-gray-900">régularité</strong>, jour après jour.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/connexion"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white text-base font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/30 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                >
                  Commencer gratuitement
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                    />
                  </svg>
                </Link>
                <Link
                  href="#methode"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 text-base font-bold rounded-2xl border-2 border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all"
                >
                  Voir la méthode ↓
                </Link>
              </div>
              <p className="text-xs text-gray-400 -mt-4 mb-8">
                Gratuit · sans carte bancaire · <strong className="text-violet-600">2 jours de Premium offerts</strong>{' '}à l&apos;inscription
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8">
                <div className="home-stat flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">150</p>
                    <p className="text-xs text-gray-500 font-medium">Cours détaillés</p>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
                <div className="home-stat flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-violet-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">&infin;</p>
                    <p className="text-xs text-gray-500 font-medium">QCM illimités</p>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
                <div className="home-stat flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">6</p>
                    <p className="text-xs text-gray-500 font-medium">UE couvertes</p>
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 border border-gray-100 w-fit">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    M
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    S
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    L
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    A
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                  </div>
                  <p className="text-sm text-gray-600">
                    Rejoignez <strong className="text-gray-900">+2 500</strong> étudiants
                  </p>
                </div>
              </div>
            </div>

            {/* Right: aperçu du tableau de bord (avec Pico) */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                {/* Glow derrière */}
                <div className="absolute -inset-4 bg-primary-400/15 rounded-[2.5rem] filter blur-2xl animate-pulse"></div>
                {/* Petits éléments flottants */}
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-violet-400/30 rounded-full filter blur-sm pricing-float"></div>
                <div className="absolute -bottom-2 -left-3 w-5 h-5 bg-primary-400/25 rounded-full filter blur-sm pricing-float pricing-float-delay"></div>

                <div className="relative bg-white/95 backdrop-blur rounded-3xl border border-indigo-100 shadow-2xl shadow-primary-500/15 p-5 sm:p-6">
                  {/* En-tête aperçu */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Ton tableau de bord
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-extrabold text-white px-2.5 py-1 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                    >
                      🎯 J-134
                    </span>
                  </div>

                  {/* Salutation + gamification */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <p className="text-lg font-black text-gray-900">Bonjour Emma 👋</p>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-800 bg-gray-50 border border-gray-100 rounded-full px-2 py-1">
                        🤓 Carabin
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-800 bg-gray-50 border border-gray-100 rounded-full px-2 py-1">
                        🔥 7
                      </span>
                    </div>
                  </div>

                  {/* Focus du jour */}
                  <div className="rounded-2xl px-4 py-3 mb-3 flex items-center justify-between gap-3 bg-violet-50 border border-violet-100">
                    <div className="min-w-0">
                      <p className="text-[9.5px] font-bold uppercase tracking-wide text-violet-600 mb-0.5">
                        Focus du jour
                      </p>
                      <p className="text-sm font-extrabold text-gray-900 truncate">
                        On reprend l&apos;Anatomie
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] font-bold text-white bg-violet-600 rounded-lg px-3 py-1.5">
                      Réviser 30 min
                    </span>
                  </div>

                  {/* Modules */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div
                      className="rounded-xl p-3 text-white"
                      style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                    >
                      <p className="text-base leading-none mb-1.5">🔁</p>
                      <p className="text-[10.5px] font-bold leading-tight">À consolider</p>
                      <p className="text-[9px] opacity-80 mt-0.5">5 questions</p>
                    </div>
                    <div className="rounded-xl p-3 bg-indigo-50 border border-indigo-100">
                      <p className="text-base leading-none mb-1.5">✅</p>
                      <p className="text-[10.5px] font-bold text-gray-900 leading-tight">QCM</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">Toutes UE</p>
                    </div>
                    <div className="rounded-xl p-3 bg-amber-50 border border-amber-100">
                      <p className="text-base leading-none mb-1.5">⚡</p>
                      <p className="text-[10.5px] font-bold text-gray-900 leading-tight">Éclair</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">5 min</p>
                    </div>
                  </div>

                  {/* Parcours vers le concours */}
                  <div className="relative mx-1" style={{ height: 30 }}>
                    <div
                      className="absolute left-0 right-6 top-[15px]"
                      style={{
                        height: 3,
                        borderRadius: 3,
                        background:
                          'repeating-linear-gradient(90deg, #d7d9e8 0 5px, transparent 5px 11px)',
                      }}
                    ></div>
                    <div
                      className="absolute left-0 top-[15px]"
                      style={{
                        height: 3,
                        width: '58%',
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                      }}
                    ></div>
                    <span
                      className="absolute text-lg"
                      style={{ left: '58%', top: -4, transform: 'translateX(-50%)' }}
                    >
                      🧑‍🎓
                    </span>
                    <span className="absolute right-0 top-[2px] text-lg">🏁</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wide mx-1">
                    <span>Départ</span>
                    <span>Le concours</span>
                  </div>

                  {/* Pico */}
                  <div
                    className="absolute -bottom-4 -right-3 w-14 h-14 rounded-full bg-violet-100 border-4 border-white shadow-lg shadow-indigo-500/25 flex items-center justify-center text-3xl pricing-float"
                    aria-hidden="true"
                  >
                    🦉
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== QUESTION DU JOUR ==================== */}
      <section
        className="py-14 md:py-16"
        style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 30%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
              Teste-toi avec la question du jour
            </h2>
            <p className="text-gray-500">Une nouvelle question de concours chaque jour, corrigée.</p>
          </div>
          <div className="max-w-lg mx-auto">
            <div className="phone-mockup w-full shadow-2xl shadow-primary-500/15 relative">
              <QuestionDuJour />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WAVE: Question du jour -> PASS vs LAS ==================== */}
      <div className="wave-divider" style={{ marginBottom: '-1px' }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {/* Voile indigo en retrait, derrière la vague pleine */}
          <path
            d="M0,30 C320,58 640,10 960,34 C1120,46 1320,26 1440,32 L1440,80 L0,80 Z"
            fill="#e0e7ff"
            opacity="0.45"
          />
          {/* Vague pleine : exactement la couleur de tête de la section suivante */}
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            fill="#f1f5f9"
          />
        </svg>
      </div>

      {/* ==================== PARCOURS PASS VS LAS ==================== */}
      <section
        className="py-16 md:py-24 relative overflow-hidden dot-grid"
        style={{ background: 'linear-gradient(180deg, #f1f5f9 0%, #ffffff 45%, #f8fafc 100%)' }}
      >
        {/* Halos duo-ton : indigo côté PASS, émeraude côté LAS */}
        <div className="absolute w-[420px] h-[420px] bg-indigo-300/30 rounded-full filter blur-[110px] top-28 -left-28 pointer-events-none"></div>
        <div className="absolute w-[420px] h-[420px] bg-emerald-300/25 rounded-full filter blur-[110px] bottom-12 -right-28 pointer-events-none"></div>
        <div className="geo-ring-light w-40 h-40 top-16 right-[10%] hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-gray-200 mb-6">
            <svg
              className="w-4 h-4 text-primary-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
              />
            </svg>
            <span className="text-sm font-semibold text-gray-600">Votre parcours</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Quelle voie choisir ?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
            Deux voies d&apos;accès aux études de santé existent depuis la réforme. Choisissez
            celle qui correspond à votre profil.
          </p>
          <div className="relative grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Badge VS central */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-gray-900 text-white items-center justify-center text-sm font-black border-4 border-white shadow-xl">
              VS
            </div>

            {/* PASS Card */}
            <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-500/10 p-8 text-left relative overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }}
              ></div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-3xl font-black text-gray-900">PASS</h3>
                <span
                  className="text-[10px] font-extrabold uppercase tracking-wide text-white px-2.5 py-1 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                >
                  Voie majoritaire
                </span>
              </div>
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-7">
                Parcours d&apos;Accès Spécifique Santé
              </p>
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Structure</p>
                  <p className="text-sm font-semibold text-gray-800">Majeure santé + mineure disciplinaire</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Chances de candidater</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    ⚠️ 1 seule chance
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Volume santé</p>
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '85%', background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }}></div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 whitespace-nowrap">Important dès le S1</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">En cas d&apos;échec</p>
                  <p className="text-sm font-semibold text-gray-800">Réorientation en L1 (LAS possible)</p>
                </div>
              </div>
            </div>

            {/* LAS Card */}
            <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-500/10 p-8 text-left relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-emerald-500"></div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-3xl font-black text-gray-900">LAS</h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-white bg-emerald-600 px-2.5 py-1 rounded-full">
                  Voie sécurisée
                </span>
              </div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-7">
                Licence avec Accès Santé
              </p>
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Structure</p>
                  <p className="text-sm font-semibold text-gray-800">Licence classique + option santé</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Chances de candidater</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    ✓ 2 chances (L1, L2 ou L3)
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Volume santé</p>
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: '40%' }}></div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 whitespace-nowrap">Réduit (mineure)</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">En cas d&apos;échec</p>
                  <p className="text-sm font-semibold text-gray-800">Poursuite de licence garantie</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom : destination commune */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-gray-400">
              <span className="h-px w-16 bg-gray-300"></span>
              <span className="text-xs font-bold uppercase tracking-widest">Les deux mènent aux mêmes portes</span>
              <span className="h-px w-16 bg-gray-300"></span>
            </div>
            <div
              className="rounded-2xl px-8 py-5 inline-flex items-center gap-4 shadow-xl shadow-indigo-900/20"
              style={{ background: 'linear-gradient(135deg, #111827 0%, #1e1b4b 60%, #312e81 100%)' }}
            >
              <div className="w-10 h-10 min-w-[40px] min-h-[40px] bg-accent-500 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-accent-400 uppercase tracking-wider">
                  Accès aux études de
                </p>
                <p className="text-xl md:text-2xl font-black text-white">
                  Médecine, Pharma, Maïeutique, Odonto, Kiné
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WAVE: PASS vs LAS -> Programme ==================== */}
      <div className="wave-divider" style={{ background: '#14122f', marginTop: '-1px' }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,28 C360,56 720,8 1080,36 C1260,48 1380,32 1440,28 L1440,0 L0,0 Z"
            fill="#f8fafc"
            fillOpacity="0.45"
          />
          <path
            d="M0,40 C480,0 960,80 1440,40 L1440,0 L0,0 Z"
            fill="#f8fafc"
          />
        </svg>
      </div>

      {/* ==================== PROGRAMME ==================== */}
      <section
        id="programme"
        className="py-16 md:py-24 noise-overlay text-white relative overflow-hidden"
        style={{
          background:
            'radial-gradient(1000px 520px at 88% -12%, rgba(124,58,237,0.4), transparent 62%), radial-gradient(800px 480px at -12% 112%, rgba(59,130,246,0.28), transparent 60%), radial-gradient(620px 380px at 50% 118%, rgba(79,70,229,0.35), transparent 65%), linear-gradient(160deg, #14122f 0%, #1e1b4b 55%, #2a2470 100%)',
        }}
      >
        {/* Constellation de points */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        ></div>
        {/* Geometric shapes */}
        <div className="geo-circle w-32 h-32 top-20 left-[8%] hidden lg:block"></div>
        <div className="geo-diamond w-16 h-16 bottom-24 right-[12%] hidden lg:block"></div>
        <div className="geo-cross top-1/2 left-[3%] hidden lg:block"></div>
        <div className="geo-circle w-20 h-20 bottom-12 left-[45%] hidden lg:block"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20 mb-6">
            <svg
              className="w-4 h-4 text-primary-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span className="text-sm font-semibold text-primary-200">Programme</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Les matières du concours</h2>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto mb-4">
            Retrouvez les UE du tronc commun au programme de la première année de santé.
          </p>
          <Link
            href="/programme"
            className="text-sm text-primary-300 hover:text-white font-semibold underline underline-offset-4 mb-12 inline-block"
          >
            Voir le programme complet &rarr;
          </Link>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {PROGRAMME_DATA.map((ue, i) => {
              const solid = UE_SOLID_COLORS[ue.color] || UE_SOLID_COLORS.indigo;
              return (
                <Link
                  key={ue.id}
                  href={`/programme#ue-${ue.id}`}
                  className="group bg-white/[0.07] backdrop-blur border border-white/10 rounded-2xl p-6 pl-7 text-left hover:bg-white/[0.13] hover:-translate-y-1 hover:border-white/25 transition-all duration-200 block relative overflow-hidden"
                >
                  {/* Rail coloré */}
                  <span
                    className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full"
                    style={{ background: solid }}
                  ></span>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${UE_BG_COLORS[ue.color] || 'bg-indigo-500/30'} rounded-xl flex items-center justify-center`}
                      dangerouslySetInnerHTML={{ __html: ue.icon }}
                    />
                    <span
                      className="text-[10px] font-extrabold tracking-widest px-2 py-1 rounded-md text-gray-900"
                      style={{ background: solid }}
                    >
                      {UE_CODES[ue.id] || `UE${i + 1}`}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{ue.name}</h3>
                  <p className="text-sm text-primary-200 leading-relaxed">{ue.description}</p>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-primary-300">
                      25 fiches · QCM illimités
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white/70 group-hover:text-white group-hover:gap-2 transition-all">
                      Explorer
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== WAVE: Programme -> Méthode ==================== */}
      <div className="wave-divider" style={{ background: '#e9edfe', marginTop: '-1px' }}>
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,50 C320,66 640,26 960,50 C1120,62 1320,42 1440,48 L1440,0 L0,0 Z"
            fill="#2a2470"
            fillOpacity="0.45"
          />
          <path
            d="M0,34 C360,70 720,6 1080,38 C1260,52 1380,40 1440,34 L1440,0 L0,0 Z"
            fill="#2a2470"
          />
        </svg>
      </div>

      {/* ==================== METHODE ==================== */}
      <section
        id="methode"
        className="py-16 md:py-24 bg-indigo-100/70 grid-pattern relative overflow-hidden"
      >
        <div className="geo-circle-light w-48 h-48 -top-12 -right-12 hidden lg:block"></div>
        <div className="geo-ring-light w-32 h-32 bottom-8 left-[6%] hidden lg:block"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-indigo-200 mb-5">
            <span className="text-sm font-semibold text-indigo-700">La méthode</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Une boucle simple pour réussir votre concours
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Tu t&apos;entraînes, tes <strong>erreurs sont capturées</strong>, tu les consolides,
            tu valides en <strong>conditions concours</strong> — et tu vois ta progression monter.
          </p>

          {/* Mini-stepper : la boucle en 4 temps */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 mb-14">
            {METHODE_LOOP.map((step, i) => (
              <Fragment key={step}>
                <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-2.5 pr-4 py-1.5 shadow-sm">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center">{i + 1}</span>
                  <span className="text-sm font-bold text-gray-700">{step}</span>
                </span>
                <svg className={`w-4 h-4 text-indigo-400 ${i === METHODE_LOOP.length - 1 ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Fragment>
            ))}
            <span className="text-sm font-bold text-indigo-600">on recommence 🔁</span>
          </div>

          {/* Les 6 briques de la méthode, numérotées */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {METHODE_STEPS.map((s, i) => {
              const c = METHODE_COLORS[s.color];
              return (
                <Link
                  key={s.title}
                  href={s.href}
                  className={`group relative bg-white border border-gray-200 ${c.border} rounded-2xl p-7 pt-8 text-left block overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200`}
                >
                  {/* Accent supérieur */}
                  <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.rail}`}></span>
                  {s.isNew && (
                    <span className="absolute top-4 right-4 text-[10px] font-extrabold uppercase tracking-wide text-white px-2 py-0.5 rounded-md" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                      Nouveau
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-14 h-14 ${c.iconBg} rounded-2xl flex items-center justify-center shrink-0`}>
                      <svg className={`w-7 h-7 ${c.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                      </svg>
                    </div>
                    <span className={`text-4xl font-black leading-none ${c.num} opacity-25 group-hover:opacity-40 transition-opacity`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                    {s.title}
                    <svg className={`w-4 h-4 ${c.arrow} opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== WAVE: Méthode -> Reste motivé ==================== */}
      <div className="wave-divider" style={{ marginTop: '-1px' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,42 C320,58 640,20 960,44 C1120,54 1320,36 1440,42 L1440,0 L0,0 Z"
            fill="#e9edfe"
            fillOpacity="0.5"
          />
          <path
            d="M0,28 C360,58 720,4 1080,32 C1260,44 1380,32 1440,28 L1440,0 L0,0 Z"
            fill="#e9edfe"
          />
        </svg>
      </div>

      {/* ==================== RESTE MOTIVÉ (gamification + Pico) ==================== */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute w-[420px] h-[420px] bg-violet-200/25 rounded-full filter blur-[100px] -top-24 -right-24"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-violet-50 px-4 py-2 rounded-full border border-violet-200 mb-5">
              <span className="text-base leading-none">🦉</span>
              <span className="text-sm font-semibold text-violet-700">Pico &amp; la gamification</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Reste motivé jusqu&apos;au bout
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              La PASS se gagne sur la <strong>régularité</strong>. On a construit tout un système
              pour que tu aies envie de revenir chaque jour.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Pico */}
            <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-3xl p-7 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-4xl shadow-lg shadow-violet-500/20 pricing-float">
                  🦉
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Pico, ton compagnon de prépa</h3>
                  <p className="text-sm text-violet-600 font-semibold">Toujours là, jamais lourd.</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                Il connaît ta <strong>date de concours</strong>, célèbre tes progrès, te rappelle ta
                pile «&nbsp;À consolider&nbsp;» et te souffle un conseil chaque jour. Il change même
                de tenue quand tu montes en grade.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                  🔥 Série de jours + jokers 🧊
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                  🎯 Défis du jour (+XP)
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
                  🧭 Parcours vers le concours
                </span>
              </div>
            </div>

            {/* Grades */}
            <div className="bg-white border border-gray-200 rounded-3xl p-7 flex flex-col">
              <h3 className="text-xl font-black text-gray-900 mb-1">Monte en grade de carabin</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Chaque bonne réponse rapporte des <strong>XP</strong>. De Bizuth à{' '}
                <strong>Major de promo</strong>, ton grade reflète le travail accompli — et
                débloque les tenues de Pico.
              </p>
              <div className="flex items-center gap-1.5 mt-auto">
                {[
                  { e: '🐣', n: 'Bizuth' },
                  { e: '🤓', n: 'Carabin' },
                  { e: '🥼', n: 'Externe' },
                  { e: '⚕️', n: 'Interne' },
                  { e: '👨‍⚕️', n: 'Chef' },
                  { e: '🎓', n: 'Major' },
                ].map((g, i) => (
                  <div key={g.n} className="flex-1 flex items-center gap-1.5">
                    <div className="flex-1 text-center">
                      <div className={`text-2xl ${i === 1 ? 'scale-125' : ''}`}>{g.e}</div>
                      <div className={`text-[10px] font-bold mt-1 ${i === 1 ? 'text-violet-700' : 'text-gray-400'}`}>{g.n}</div>
                    </div>
                    {i < 5 && (
                      <div
                        className="h-0.5 w-3 shrink-0"
                        style={{
                          background:
                            i < 1
                              ? 'linear-gradient(90deg,#4f46e5,#7c3aed)'
                              : 'repeating-linear-gradient(90deg,#d7d9e8 0 3px,transparent 3px 6px)',
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-5 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: '34%', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)' }}
                ></div>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                1 407 XP · prochain grade : <strong className="text-gray-600">Externe 🥼</strong>
              </p>
            </div>
          </div>

          {/* Classement : mesure-toi aux autres */}
          <div className="max-w-5xl mx-auto mt-6 relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-[#1e1b4b] to-indigo-950 p-7 md:p-10">
            <div className="absolute w-72 h-72 bg-indigo-500/20 rounded-full filter blur-[90px] -top-20 -right-16 pointer-events-none"></div>
            <div className="absolute w-56 h-56 bg-violet-500/15 rounded-full filter blur-[80px] -bottom-16 left-1/4 pointer-events-none"></div>
            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Texte */}
              <div className="text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2 rounded-full mb-5">
                  <span className="text-base leading-none">🏆</span>
                  <span className="text-sm font-semibold text-indigo-200">Classement hebdomadaire</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                  Mesure-toi aux autres carabins
                </h3>
                <p className="text-sm md:text-base text-indigo-200/90 leading-relaxed mb-6">
                  Ton score combine <strong className="text-white">précision et régularité</strong>{' '}
                  sur tes 7 derniers jours — pas seulement le volume. Grimpe dans le top,
                  d&eacute;fends ta place, et vois exactement o&ugrave; tu te situes dans la promo.
                </p>
                <div className="flex flex-wrap gap-2 mb-7">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-100 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full">
                    👥 563 participants cette semaine
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-100 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full">
                    📈 Évolue chaque jour
                  </span>
                </div>
                <Link
                  href="/connexion"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-indigo-900/50"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                >
                  Voir o&ugrave; tu te places
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>

              {/* Mini-classement */}
              <div className="bg-white/[0.06] backdrop-blur border border-white/10 rounded-2xl p-4 md:p-5">
                <div className="flex items-center justify-between px-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                    Top de la semaine
                  </span>
                  <span className="text-[10px] font-bold text-indigo-300/70">Score</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { medal: '🥇', name: 'Emma L.', grade: '⚕️', score: '92 %', ring: 'border-amber-300/40 bg-amber-400/10' },
                    { medal: '🥈', name: 'Hugo M.', grade: '👨‍⚕️', score: '89 %', ring: 'border-slate-300/30 bg-slate-300/10' },
                    { medal: '🥉', name: 'Léa B.', grade: '🥼', score: '87 %', ring: 'border-orange-300/30 bg-orange-400/10' },
                  ].map((r) => (
                    <div key={r.name} className={`flex items-center gap-3 rounded-xl border ${r.ring} px-3.5 py-2.5`}>
                      <span className="text-xl leading-none">{r.medal}</span>
                      <span className="text-sm font-bold text-white flex-1">{r.name}</span>
                      <span className="text-sm">{r.grade}</span>
                      <span className="text-sm font-black text-white tabular-nums">{r.score}</span>
                    </div>
                  ))}
                  <div className="text-center text-indigo-300/60 text-sm font-black leading-none py-1">⋯</div>
                  <div
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 border border-transparent"
                    style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.35), rgba(124,58,237,0.35))', boxShadow: 'inset 0 0 0 1.5px rgba(165,180,252,0.4)' }}
                  >
                    <span className="w-7 h-7 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-sm font-black text-white">?</span>
                    <span className="text-sm font-bold text-white flex-1">Toi</span>
                    <span className="text-xs font-bold text-indigo-100">Ta place t&apos;attend 👀</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PREUVE SOCIALE ==================== */}
      <section
        className="py-12 md:py-14"
        style={{ background: 'linear-gradient(180deg, #ffffff 0%, #eef1f6 22%, #eef1f6 78%, #f4f5fe 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 text-center">
              <p className="text-3xl font-black text-indigo-600 tabular-nums">12 400</p>
              <p className="text-xs text-gray-500 font-medium mt-1">QCM répondus cette semaine</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 text-center">
              <p className="text-3xl font-black text-violet-600 tabular-nums">+2 500</p>
              <p className="text-xs text-gray-500 font-medium mt-1">étudiants inscrits</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 text-center">
              <p className="text-3xl font-black text-emerald-600 tabular-nums">563</p>
              <p className="text-xs text-gray-500 font-medium mt-1">au classement cette semaine</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto mt-4">
            <figure className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
              <blockquote className="text-sm text-gray-700 leading-relaxed">
                «&nbsp;La pile À consolider a changé ma façon de réviser. Mes erreurs ne se perdent
                plus, je les retravaille jusqu&apos;à les connaître.&nbsp;»
              </blockquote>
              <figcaption className="mt-3 text-xs font-bold text-gray-500">
                Léa · PASS, Lyon Est
              </figcaption>
            </figure>
            <figure className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
              <blockquote className="text-sm text-gray-700 leading-relaxed">
                «&nbsp;Le streak et Pico me font ouvrir l&apos;appli même les jours sans motivation.
                C&apos;est bête, mais ça marche.&nbsp;»
              </blockquote>
              <figcaption className="mt-3 text-xs font-bold text-gray-500">
                Adam · LAS Droit, Bordeaux
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ==================== WAVE: Preuve sociale -> FAQ ==================== */}
      <div className="wave-divider" style={{ background: '#f4f5fe', marginTop: '-1px' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
            fill="#eef2ff"
            fillOpacity="0.55"
          />
        </svg>
      </div>

      {/* ==================== FAQ ==================== */}
      <FaqSection />

      {/* ==================== BANDEAU CONCOURS (visiteurs) ==================== */}
      <ConcoursBanner />

      {/* ==================== CTA SECTION ==================== */}
      <section
        id="tarifs"
        className="py-16 md:py-24 gradient-dark noise-overlay text-white relative overflow-hidden"
      >
        <div className="geo-circle w-24 h-24 top-8 left-[10%] hidden lg:block"></div>
        <div className="geo-diamond w-12 h-12 top-16 right-[15%] hidden lg:block"></div>
        <div className="geo-cross bottom-12 right-[8%] hidden lg:block"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Découvrez nos formules d&apos;accompagnement
          </h2>
          <p className="text-primary-200 text-lg max-w-xl mx-auto mb-8">
            Sans engagement ou jusqu&apos;au concours, trouvez le rythme qui correspond à votre
            objectif en santé.
          </p>
          <Link
            href="/tarifs"
            className="inline-flex items-center gap-2 px-8 py-4 text-white text-base font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-xl shadow-primary-600/30"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          >
            Voir les tarifs en détail
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
