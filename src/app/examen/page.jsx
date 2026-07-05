import Link from 'next/link';
import RedirectIfAuthed from '@/components/RedirectIfAuthed';
import ConcoursBanner from '@/components/ConcoursBanner';

export const metadata = {
  title: 'Mode Examen PASS/LAS - Conditions réelles',
  description:
    'Simulez un examen PASS/LAS en conditions réelles : 40 questions, 60 minutes chronométrées, grille de réponses et correction détaillée.',
  alternates: { canonical: '/examen' },
};

const FEATURES = [
  {
    icon: '⏱',
    bg: 'bg-rose-50',
    title: '60 minutes chronométrées',
    desc: 'Chrono circulaire qui passe à l’orange puis au rouge — la pression du vrai concours.',
  },
  {
    icon: '🧬',
    bg: 'bg-indigo-50',
    title: '40 questions, toutes les UE',
    desc: 'Épreuve mélangée sur les 6 UE du tronc commun, comme le jour J.',
  },
  {
    icon: '☑️',
    bg: 'bg-violet-50',
    title: 'Réponses multiples',
    desc: '1 à 3 bonnes réponses par question, notation tout-ou-rien : le vrai format concours.',
  },
  {
    icon: '📋',
    bg: 'bg-amber-50',
    title: 'Grille de réponses & drapeaux',
    desc: 'Navigue entre les questions, marque celles à revoir, gère ton temps.',
  },
  {
    icon: '🌙',
    bg: 'bg-gray-100',
    title: 'Mode focus sombre',
    desc: 'Un environnement sans distraction pour rester concentré du début à la fin.',
  },
  {
    icon: '📝',
    bg: 'bg-emerald-50',
    title: 'Copie rendue & correction',
    desc: 'Écran de fin façon concours, puis correction détaillée question par question.',
  },
];

export default function Page() {
  return (
    <>
      {/* Utilisateur connecté → dashboard, module examen ouvert */}
      <RedirectIfAuthed to="/dashboard?open=examen" />

      {/* ===== HERO ===== */}
      <section className="gradient-hero noise-overlay dot-grid pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-rose-200 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span className="text-sm font-semibold text-rose-700">Format concours</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-5">
                Le jour J,{' '}
                <span className="bg-gradient-to-r from-rose-600 via-violet-600 to-primary-600 bg-clip-text text-transparent">
                  tu l&apos;auras déjà vécu
                </span>
                .
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                Des examens blancs en <strong className="text-gray-900">conditions réelles</strong> :
                40 questions mélangées, 60 minutes chronométrées, réponses multiples et grille de
                réponses. Entraîne-toi jusqu&apos;à ce que le format ne te fasse plus peur.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/connexion"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white text-base font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/30 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                >
                  Créer mon compte
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/tarifs"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 text-base font-bold rounded-2xl border-2 border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all"
                >
                  Voir les formules
                </Link>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Inscription gratuite · sans carte bancaire —{' '}
                <strong className="text-violet-600">2 jours de Premium offerts</strong> pour tout
                tester, mode examen inclus.
              </p>
            </div>

            {/* Aperçu statique de l'épreuve */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 bg-rose-400/10 rounded-[2.5rem] filter blur-2xl"></div>
                <div className="relative bg-white/95 backdrop-blur rounded-3xl border border-gray-100 shadow-2xl shadow-rose-500/10 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Examen blanc · toutes UE
                    </span>
                    <span className="relative inline-flex items-center justify-center w-12 h-12">
                      <svg viewBox="0 0 48 48" className="w-12 h-12 -rotate-90">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="#f3f4f6" strokeWidth="5" />
                        <circle cx="24" cy="24" r="20" fill="none" stroke="#e11d48" strokeWidth="5" strokeLinecap="round" strokeDasharray="126" strokeDashoffset="38" />
                      </svg>
                      <span className="absolute text-[10px] font-black text-gray-900 tabular-nums">42:10</span>
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 mb-1.5">Question 23/40 · Biophysique</p>
                  <p className="text-sm font-bold text-gray-900 mb-4 leading-snug">
                    Concernant les rayonnements ionisants, quelles propositions sont exactes ?
                  </p>
                  <div className="space-y-2 mb-5">
                    {['Le becquerel mesure l’activité d’une source', 'Les rayons α sont les plus pénétrants', 'La dose absorbée s’exprime en gray'].map((opt, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[12.5px] font-medium ${
                          i !== 1 ? 'border-indigo-300 bg-indigo-50/60 text-gray-900' : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded border flex items-center justify-center text-[9px] font-black ${i !== 1 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'}`}>
                          {i !== 1 ? '✓' : ''}
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <span
                          key={i}
                          className={`w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center ${
                            i < 5 ? 'bg-indigo-600 text-white' : i === 5 ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {i + 21}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">🚩 2 à revoir</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Tout le stress du concours, sans l&apos;enjeu
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Chaque détail du format est reproduit pour que le jour J ne soit qu&apos;une
              répétition de plus.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BANDEAU CONCOURS ===== */}
      <ConcoursBanner />

      {/* ===== CTA ===== */}
      <section className="py-16 gradient-dark noise-overlay text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Prêt à passer ton premier blanc ?</h2>
          <p className="text-primary-200 text-lg mb-8">
            Crée ton compte, découvre les QCM gratuits — et passe au mode examen quand tu te sens
            prêt.
          </p>
          <Link
            href="/connexion"
            className="inline-flex items-center gap-2 px-8 py-4 text-white text-base font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-xl shadow-indigo-900/40"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          >
            Commencer gratuitement
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
