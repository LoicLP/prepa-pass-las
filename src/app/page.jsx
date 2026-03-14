import Link from 'next/link';
import { PROGRAMME_DATA } from '@/data/programme';
import QuestionDuJour from '@/components/home/QuestionDuJour';
import FaqSection from '@/components/home/FaqSection';

function StarIcon() {
  return (
    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-accent-400 shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

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
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-primary-200 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                </span>
                <span className="text-sm font-semibold text-primary-700">
                  Spécial Terminale &amp; Bac+1
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
                Réussissez votre{' '}
                <span className="home-gradient-text">PASS/LAS</span> sans stress.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl">
                La première plateforme de révision conçue exclusivement pour les étudiants en
                santé. Maîtrisez les <strong className="text-gray-900">QCM</strong>, les{' '}
                <strong className="text-gray-900">cours</strong> et le{' '}
                <strong className="text-gray-900">mode examen</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/qcm"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white text-base font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20"
                >
                  Commencer l&apos;entraînement
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
                  href="/programme"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 text-base font-bold rounded-2xl border-2 border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all"
                >
                  Découvrir le programme
                </Link>
              </div>

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

            {/* Right: Question du jour */}
            <div className="flex justify-center lg:justify-end">
              <div className="phone-mockup w-full max-w-lg shadow-2xl shadow-primary-500/10">
                <QuestionDuJour />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WAVE: Hero -> PASS vs LAS ==================== */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            fill="#e2e8f0"
          />
          <path
            d="M0,56 C320,72 640,32 960,56 C1120,68 1320,48 1440,56 L1440,80 L0,80 Z"
            fill="#e2e8f0"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* ==================== PARCOURS PASS VS LAS ==================== */}
      <section className="py-16 md:py-24 bg-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* PASS Card */}
            <div className="bg-primary-600 rounded-3xl p-8 text-white text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full -mr-10 -mt-10 opacity-50"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold mb-2">PASS</h3>
                <p className="text-sm font-semibold text-primary-200 uppercase tracking-wider mb-4">
                  Parcours d&apos;Accès Spécifique Santé
                </p>
                <ul className="space-y-2.5 text-sm text-primary-100">
                  <li className="flex items-start gap-2">
                    <CheckIcon />
                    Majeure santé + mineure disciplinaire
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon />
                    1 seule chance de candidater
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon />
                    Volume santé important dès le S1
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon />
                    Réorientation en L1 en cas d&apos;échec
                  </li>
                </ul>
              </div>
            </div>

            {/* LAS Card */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800 rounded-full -mr-10 -mt-10 opacity-50"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold mb-2">LAS</h3>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Licence avec Accès Santé
                </p>
                <ul className="space-y-2.5 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckIcon />
                    Licence classique + option santé
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon />
                    2 chances de candidater (L1, L2 ou L3)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon />
                    Volume santé réduit (option mineure)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon />
                    Poursuite de licence garantie
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom arrow + result */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
              />
            </svg>
            <div className="bg-gray-900 rounded-2xl px-8 py-5 inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-accent-400 uppercase tracking-wider">
                  Accès aux études de
                </p>
                <p className="text-2xl font-black text-white">
                  Médecine, Pharma, Maïeutique, Odonto, Kiné
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WAVE: PASS vs LAS -> Programme ==================== */}
      <div className="wave-divider" style={{ marginTop: '-1px' }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,40 C480,0 960,80 1440,40 L1440,0 L0,0 Z"
            fill="#eef2ff"
            fillOpacity="0.5"
          />
          <path
            d="M0,28 C360,56 720,8 1080,36 C1260,48 1380,32 1440,28 L1440,0 L0,0 Z"
            fill="#eef2ff"
            fillOpacity="0.3"
          />
        </svg>
      </div>

      {/* ==================== PROGRAMME ==================== */}
      <section
        id="programme"
        className="py-16 md:py-24 gradient-dark noise-overlay text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
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
            {PROGRAMME_DATA.map((ue) => (
              <Link
                key={ue.id}
                href={`/programme#ue-${ue.id}`}
                className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-6 text-left hover:bg-white/15 transition-colors block"
              >
                <div
                  className={`w-12 h-12 bg-${ue.color}-500/30 rounded-xl flex items-center justify-center mb-4`}
                  dangerouslySetInnerHTML={{ __html: ue.icon }}
                />
                <h3 className="font-bold text-lg mb-1">{ue.name}</h3>
                <p className="text-sm text-primary-200">{ue.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== METHODE ==================== */}
      <section
        id="methode"
        className="py-16 md:py-24 bg-indigo-100/70 grid-pattern relative overflow-hidden"
      >
        <div className="geo-circle-light w-48 h-48 -top-12 -right-12 hidden lg:block"></div>
        <div className="geo-ring-light w-32 h-32 bottom-8 left-[6%] hidden lg:block"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            La méthode pour réussir votre concours
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
            Grâce à notre outil d&apos;entraînement développé sur mesure pour maîtriser chaque
            UE du tronc commun !
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* QCM illimités */}
            <Link
              href="/qcm"
              className="feature-card bg-white border border-gray-200 rounded-2xl p-7 text-left block"
            >
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-5">
                <svg
                  className="w-7 h-7 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">QCM illimités</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Notre algorithme génère des{' '}
                <strong>QCM par matière</strong> à l&apos;infini avec des corrections détaillées
                et des explications pédagogiques.
              </p>
            </Link>

            {/* Fiches de cours */}
            <Link
              href="/fiches"
              className="feature-card bg-white border border-gray-200 rounded-2xl p-7 text-left block"
            >
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
                <svg
                  className="w-7 h-7 text-indigo-600"
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">Fiches de cours</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Des fiches synthétiques et des cours détaillés sur{' '}
                <strong>chaque UE</strong> du tronc commun pour réviser efficacement.
              </p>
            </Link>

            {/* Mode Examen */}
            <Link
              href="/examen"
              className="feature-card bg-white border border-gray-200 rounded-2xl p-7 text-left block"
            >
              <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-5">
                <svg
                  className="w-7 h-7 text-violet-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mode Examen</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Entraînez-vous en{' '}
                <strong>conditions réelles</strong> avec une infinité de questions uniques, un
                chronomètre de 30 min et une correction détaillée.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== WAVE: Méthode -> FAQ ==================== */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
            fill="#eef2ff"
            fillOpacity="0.4"
          />
        </svg>
      </div>

      {/* ==================== FAQ ==================== */}
      <FaqSection />

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
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white text-base font-bold rounded-2xl hover:bg-primary-400 transition-colors shadow-xl shadow-primary-600/30"
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
