import Link from 'next/link';
import { PROGRAMME_DATA } from '@/data/programme';
import QuestionDuJour from '@/components/home/QuestionDuJour';
import FaqSection from '@/components/home/FaqSection';
import RevealObserver from '@/components/home/RevealObserver';
import ConcoursBanner from '@/components/ConcoursBanner';
import PromoBanner from '@/components/PromoBanner';
import PromoPriceLine from '@/components/PromoPriceLine';

// Régénération horaire : le bandeau promo disparaît de lui-même après l'échéance
export const revalidate = 3600;

export const metadata = {
  title: {
    absolute: 'Prépa PASS/LAS - Réussissez votre première année de médecine',
  },
  description:
    'La plateforme de révision pour réussir le concours PASS/LAS : QCM illimités corrigés, révisions espacées, examens blancs, 150 fiches et un coach de progression.',
  alternates: { canonical: '/' },
};

/* ============================================================
   Briques visuelles (langage de l'accueil CRFPA, palette indigo)
============================================================ */
function GridBackground({ opacity = 0.05 }) {
  return (
    <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden="true">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(30,27,75,${opacity}) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,27,75,${opacity}) 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
        }}
      />
    </div>
  );
}

function CheckIcon({ className = 'w-4 h-4 text-emerald-500' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function ArrowIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

// Couleurs par UE (frise et cartes du programme)
const UE_TONES = {
  indigo: { bg: 'bg-indigo-500', soft: 'bg-indigo-50 text-indigo-700 border-indigo-100', dot: 'bg-indigo-500' },
  emerald: { bg: 'bg-emerald-500', soft: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
  violet: { bg: 'bg-violet-500', soft: 'bg-violet-50 text-violet-700 border-violet-100', dot: 'bg-violet-500' },
  cyan: { bg: 'bg-cyan-500', soft: 'bg-cyan-50 text-cyan-700 border-cyan-100', dot: 'bg-cyan-500' },
  amber: { bg: 'bg-amber-500', soft: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
  rose: { bg: 'bg-rose-500', soft: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' },
};
const UE_CODES = { chimie: 'UE1', biocell: 'UE2', biophysique: 'UE3', biostats: 'UE4', anatomie: 'UE5', ssh: 'UE6' };

export default function Home() {
  const totalCoeff = PROGRAMME_DATA.reduce((a, u) => a + (u.coeff || 0), 0);
  const totalHours = PROGRAMME_DATA.reduce((a, u) => a + (u.hours || 0), 0);
  const byCode = [...PROGRAMME_DATA].sort((a, b) => (UE_CODES[a.id] || '').localeCompare(UE_CODES[b.id] || ''));

  return (
    <div className="bg-white">
      <RevealObserver />

      {/* Bandeau offre de rentrée — rendu serveur, s'éteint seul à l'échéance */}
      <PromoBanner />

      {/* ================================================================
          HERO — centré, grille de fond, typographie serrée
      ================================================================ */}
      <section id="accueil" className="relative pt-28 pb-24 md:pt-36 md:pb-32 overflow-hidden bg-gradient-to-b from-[#eef2ff] via-white to-[#f5f3ff]">
        <GridBackground opacity={0.06} />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-indigo-600/[0.07] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute top-10 right-[-8%] w-[400px] h-[400px] bg-violet-300/[0.16] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute top-32 left-[-6%] w-[350px] h-[350px] bg-indigo-300/[0.16] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="hero-seq-1 inline-flex items-center justify-center mb-8">
            <div className="relative float-soft">
              <div className="absolute inset-0 bg-indigo-600/10 rounded-2xl blur-lg" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="hero-seq-2 text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] mb-8">
            Réussis le concours<br />
            <span className="text-indigo-600">PASS/LAS</span>
          </h1>

          <p className="hero-seq-3 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Le QG de révision qui te fait tenir jusqu&apos;au concours : QCM illimités corrigés, révisions espacées de tes erreurs,
            examens blancs en conditions réelles — et un coach qui récompense ta régularité, jour après jour.
          </p>

          <div className="hero-seq-4 flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link href="/inscription" className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
              Commencer gratuitement
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="#methode" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-slate-900 font-semibold rounded-full border border-slate-200 hover:border-slate-300 transition-colors">
              Découvrir la méthode
            </Link>
          </div>

          <div className="hero-seq-5">
            <PromoPriceLine />
          </div>

          <div className="hero-seq-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <div className="inline-flex items-center gap-1.5"><CheckIcon /> 2 jours de Premium offerts</div>
            <div className="inline-flex items-center gap-1.5"><CheckIcon /> Sans carte bancaire</div>
            <div className="inline-flex items-center gap-1.5"><CheckIcon /> 150 fiches en accès libre</div>
          </div>

          <div className="mt-16 flex justify-center">
            <svg className="w-6 h-6 text-slate-300 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* ================================================================
          PASS OU LAS — deux voies, une même destination
      ================================================================ */}
      <section id="parcours" className="py-20 md:py-28 bg-[#f8f9fc] border-t border-indigo-100/60 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[5%] w-[350px] h-[350px] bg-violet-200/[0.28] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div data-reveal className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5">PASS ou LAS&nbsp;?</h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Depuis la réforme, deux voies mènent aux études de santé. Elles n&apos;ont ni le même rythme ni le même filet de sécurité — mais le programme du tronc commun, lui, est le même. C&apos;est celui que tu révises ici.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              {
                name: 'PASS', full: "Parcours d'Accès Spécifique Santé", tag: 'Voie majoritaire', highlight: true,
                rows: [
                  ['Structure', 'Majeure santé + mineure disciplinaire'],
                  ['Chances de candidater', 'Une seule — pas de redoublement'],
                  ['Volume santé', 'Dense dès le premier semestre'],
                  ['En cas d’échec', 'Réorientation en L1, LAS possible'],
                ],
              },
              {
                name: 'LAS', full: 'Licence avec Accès Santé', tag: 'Voie sécurisée', highlight: false,
                rows: [
                  ['Structure', 'Licence classique + option santé'],
                  ['Chances de candidater', 'Deux, en L1, L2 ou L3'],
                  ['Volume santé', 'Réduit, en mineure'],
                  ['En cas d’échec', 'Poursuite de licence garantie'],
                ],
              },
            ].map((v, i) => (
              <div
                data-reveal data-reveal-delay={i + 1} key={v.name}
                className={`relative rounded-2xl p-7 border transition-all ${v.highlight ? 'bg-gradient-to-br from-[#eef2ff] to-white border-indigo-600/20 shadow-lg shadow-indigo-600/5' : 'bg-white border-slate-200'}`}
              >
                <span className={`absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full ${v.highlight ? 'bg-indigo-600' : 'bg-emerald-600'}`}>{v.tag}</span>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{v.name}</h3>
                <p className={`text-xs font-bold uppercase tracking-wider mb-6 ${v.highlight ? 'text-indigo-600' : 'text-emerald-600'}`}>{v.full}</p>
                <dl className="space-y-4">
                  {v.rows.map(([k, val]) => (
                    <div key={k}>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{k}</dt>
                      <dd className="text-sm font-semibold text-slate-800">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-10 flex flex-col items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Les deux mènent aux mêmes portes</p>
            <p className="text-lg md:text-xl font-bold text-slate-900 text-center">Médecine · Pharmacie · Maïeutique · Odontologie · Kinésithérapie</p>
          </div>
        </div>
      </section>

      {/* ================================================================
          QUESTION DU JOUR — outil gratuit, sans inscription
      ================================================================ */}
      <section id="question-du-jour" className="py-16 md:py-20 bg-[#f8f9fc] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div data-reveal className="relative overflow-hidden rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-white via-[#eef2ff]/60 to-white shadow-xl shadow-indigo-200/20">
            <GridBackground opacity={0.04} />
            <div className="absolute top-[-40%] right-[-10%] w-[380px] h-[380px] bg-violet-200/[0.35] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center p-8 md:p-12">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                  100 % gratuit · sans inscription
                </span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">
                  Une question de <span className="text-indigo-600">concours</span> chaque jour
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-7">
                  Tirée du programme du tronc commun, corrigée et expliquée. Trente secondes pour savoir où tu en es — et une bonne excuse pour revenir demain.
                </p>
                <span className="text-sm text-slate-400 font-medium">Nouvelle question à minuit · correction immédiate</span>
              </div>
              <div data-reveal data-reveal-delay="1" className="relative">
                <QuestionDuJour />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          LA MÉTHODE — 5 outils, en rangées numérotées avec mini-écrans
      ================================================================ */}
      <section id="methode" className="py-20 md:py-28 bg-gradient-to-b from-[#eef2ff] via-[#f5f3ff] to-[#eef2ff] relative overflow-hidden border-t border-indigo-100/60">
        <GridBackground opacity={0.04} />
        <div className="absolute top-[5%] left-[-5%] w-[400px] h-[400px] bg-indigo-200/[0.25] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[10%] right-[-5%] w-[380px] h-[380px] bg-violet-200/[0.22] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div data-reveal className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5">
              Une boucle simple<br />pour progresser chaque jour
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Tu t&apos;entraînes, tes erreurs sont capturées, tu les consolides, tu valides en conditions concours — et tu vois ta courbe monter.
            </p>
          </div>

          <div className="space-y-8">
            <FeatureRow num="1" label="S'entraîner · toutes les UE" title="QCM illimités, corrigés" subtitle="Par matière, par fiche ou sur un thème libre : autant de questions que tu veux, dans le format du concours."
              bullets={['Réponses multiples et pièges, comme le jour J', 'Correction détaillée à chaque question, pas seulement la bonne réponse', 'Les 6 UE du tronc commun, du premier au dernier chapitre']}
              href="/qcm" cta="Lancer un QCM" mockup={<MockQCM />} />
            <FeatureRow num="2" flip label="Consolider · révisions espacées" title="La pile « À consolider »" subtitle="Chaque erreur rejoint ta pile. Tu la rejoues jusqu'à la maîtriser, puis elle disparaît : c'est la répétition espacée, sans y penser."
              bullets={['Rien ne se perd : une question ratée revient au bon moment', 'Une question réussie deux fois sort de la pile', 'Session de 5 minutes possible entre deux cours']}
              href="/qcm" cta="Voir comment ça marche" mockup={<MockConsolider />} />
            <FeatureRow num="3" label="Valider · conditions concours" title="Examens blancs chronométrés" subtitle="40 questions mélangées, 60 minutes, grille de réponses. Le stress du jour J, avant le jour J."
              bullets={['Toutes les UE mélangées, comme au concours', 'Grille de réponses et chrono qui tourne', 'Correction complète et score par matière à la fin']}
              href="/examen" cta="Passer un examen blanc" mockup={<MockExamen />} />
            <FeatureRow num="4" flip label="Réviser · 150 fiches et cours" title="Fiches suivies, cours complets" subtitle="Chaque fiche a son temps de lecture, son sommaire et son QCM ciblé. Tu sais toujours ce qui est lu, et ce qui reste."
              bullets={['150 fiches synthétiques, 25 par UE, en accès libre', 'Cours détaillés avec schémas pour aller plus loin', 'Téléchargement PDF pour réviser hors ligne']}
              href="/fiches" cta="Parcourir les fiches" mockup={<MockFiches />} />
            <FeatureRow num="5" label="Progresser · coach de révision" title="Un coach qui te dit quoi faire" subtitle="Courbe par matière, objectifs de la semaine et une recommandation claire à chaque connexion."
              bullets={['« L’Anatomie te freine : 3 QCM ciblés et tu passes la barre »', 'Objectifs hebdo modifiables : sessions, temps, jours actifs', 'Parcours vers ta date de concours, jour par jour']}
              href="/inscription" cta="Créer mon compte" mockup={<MockProgression />} />
          </div>
        </div>
      </section>

      {/* ================================================================
          PROGRAMME — les 6 UE du tronc commun, pondérées par coefficient
      ================================================================ */}
      <section id="programme" className="py-20 md:py-28 bg-gradient-to-b from-white via-[#f8f9fc] to-white border-t border-slate-100 relative overflow-hidden">
        <div className="absolute top-[20%] right-[0%] w-[320px] h-[320px] bg-violet-200/[0.16] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div data-reveal className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5">Le programme du tronc commun</h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Six unités d&apos;enseignement, {totalHours}{' '}heures de cours, des coefficients qui ne se valent pas. La frise donne le poids de chaque UE dans le concours&nbsp;: c&apos;est là que se joue ton temps de révision.
            </p>
          </div>

          <div data-reveal className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">6</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tronc commun · S1 et S2</p>
                <p className="font-bold text-slate-900">Poids de chaque UE dans la note finale</p>
              </div>
              <div className="ml-auto text-sm text-slate-500 font-mono hidden sm:block">{totalHours}h · coef. {totalCoeff}</div>
            </div>
            <div className="grid gap-1.5 rounded-2xl overflow-hidden bg-slate-100 p-1" style={{ gridTemplateColumns: `repeat(${totalCoeff}, minmax(0, 1fr))` }}>
              {byCode.map((ue) => {
                const t = UE_TONES[ue.color] || UE_TONES.indigo;
                return (
                  <div key={ue.id} className={`${t.bg} rounded-xl px-1.5 sm:px-3 py-2 sm:py-3 min-w-0 text-center sm:text-left`} style={{ gridColumn: `span ${ue.coeff}` }}>
                    <p className="text-[10px] font-bold uppercase tracking-normal sm:tracking-wider text-white/80 mb-0.5 truncate"><span className="sm:hidden">{UE_CODES[ue.id]}</span><span className="hidden sm:inline">{UE_CODES[ue.id]} · coef. {ue.coeff}</span></p>
                    <p className="text-xs font-bold text-white leading-tight truncate hidden sm:block">{ue.name}</p>
                    <p className="text-[10px] font-bold text-white/80 sm:hidden">×{ue.coeff}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {byCode.map((ue, i) => {
              const t = UE_TONES[ue.color] || UE_TONES.indigo;
              return (
                <Link data-reveal data-reveal-delay={(i % 3) + 1} key={ue.id} href={`/programme#ue-${ue.id}`} className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-0.5 transition-all block">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-2 text-[11px] font-bold px-2.5 py-1 rounded-full border ${t.soft}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />{UE_CODES[ue.id]}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{ue.hours}h · coef. {ue.coeff}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">{ue.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{ue.description}</p>
                  <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 group-hover:gap-2.5 transition-all">
                    25 fiches · QCM illimités <ArrowIcon className="w-3.5 h-3.5" />
                  </p>
                </Link>
              );
            })}
          </div>

          <div data-reveal className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>En PASS, tu n&apos;as qu&apos;une chance</strong>{' '}: pas de redoublement possible. C&apos;est la raison d&apos;être des révisions espacées et des examens blancs — ne rien laisser au hasard avant le jour J.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          RESTE MOTIVÉ — Pico, grades, classement + aperçu du tableau de bord
      ================================================================ */}
      <section id="motivation" className="py-20 md:py-28 bg-gradient-to-br from-[#eef2ff] via-[#f8f9fc] to-[#f5f3ff] border-t border-indigo-100/60 relative overflow-hidden">
        <GridBackground opacity={0.04} />
        <div className="absolute top-[10%] left-[-4%] w-[360px] h-[360px] bg-violet-200/[0.22] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[5%] right-[-4%] w-[340px] h-[340px] bg-emerald-200/[0.16] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div data-reveal>
              <div className="inline-flex items-center gap-2 bg-white border border-indigo-600/15 rounded-full px-4 py-1.5 text-sm font-medium text-indigo-600 mb-6 shadow-sm">
                <span className="text-base leading-none">🦉</span> Pico, ton coach de révision
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5 leading-tight">
                Tenir jusqu&apos;au bout,<br className="hidden md:block" />{' '}c&apos;est un système.
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                La première année se gagne sur la régularité, pas sur un sprint. Tout est construit pour que tu aies envie de revenir demain.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { title: 'Pico connaît ta date de concours', desc: 'Il célèbre tes progrès, te rappelle ta pile « À consolider » et te souffle un conseil par jour. Toujours là, jamais lourd.' },
                  { title: 'Des grades de carabin, de Bizuth à Major de promo', desc: 'Chaque bonne réponse rapporte des XP. Ton grade reflète le travail accompli, avec une série de jours et des jokers pour les jours sans.' },
                  { title: 'Un classement hebdomadaire', desc: 'Ton score combine précision et régularité sur 7 jours — pas le volume. Remis en jeu chaque jour, pour que chacun ait sa chance.' },
                ].map((f) => (
                  <li key={f.title} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm mb-0.5">{f.title}</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/inscription" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                Voir où tu te places <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>

            <div data-reveal data-reveal-delay="1" className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-600/10 via-violet-400/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />
              <MockDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          TÉMOIGNAGES
      ================================================================ */}
      <section id="temoignages" className="py-20 md:py-28 bg-gradient-to-b from-white via-[#f5f3ff] to-white border-t border-slate-100 relative overflow-hidden">
        <div className="absolute top-[15%] left-[3%] w-[300px] h-[300px] bg-violet-200/[0.15] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[10%] right-[3%] w-[300px] h-[300px] bg-indigo-200/[0.18] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div data-reveal className="max-w-2xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm font-medium text-slate-700 mb-5 shadow-sm">
              <div className="flex -space-x-1.5">
                {['M', 'S', 'L', 'A'].map((l, i) => (
                  <span key={l} className={`w-6 h-6 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center ${['bg-indigo-500', 'bg-violet-500', 'bg-cyan-500', 'bg-emerald-500'][i]}`}>{l}</span>
                ))}
              </div>
              +2&nbsp;500 étudiants inscrits
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">Ils révisent avec nous</h2>
            <p className="text-slate-500 text-lg">Ce que disent les étudiants qui préparent le concours sur la plateforme.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Léa', role: 'PASS · Lyon Est', quote: "La pile À consolider a changé ma façon de réviser. Mes erreurs ne se perdent plus, je les retravaille jusqu'à les connaître.", gradient: 'from-indigo-500 to-violet-500' },
              { name: 'Adam', role: 'LAS Droit · Bordeaux', quote: "Le streak et Pico me font ouvrir l'appli même les jours sans motivation. C'est bête, mais ça marche.", gradient: 'from-violet-500 to-fuchsia-500' },
              { name: 'Inès', role: 'PASS · Paris Cité', quote: "Les examens blancs m'ont enlevé la peur du chrono. Le jour du concours, j'avais déjà fait dix fois le format.", gradient: 'from-cyan-500 to-indigo-500' },
            ].map((t, i) => (
              <div data-reveal data-reveal-delay={i + 1} key={t.name} className="bg-white rounded-2xl p-7 border border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
                <div className="flex items-center gap-0.5 text-amber-400 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.961a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.363 1.118l1.285 3.96c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.285-3.96a1 1 0 00-.363-1.118L2.05 9.388c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69l1.286-3.961z" /></svg>
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 flex-1 text-[15px]">&laquo;&nbsp;{t.quote}&nbsp;&raquo;</p>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold shrink-0`}>{t.name.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm leading-tight">{t.name}</p>
                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FAQ + bandeau concours (visiteurs)
      ================================================================ */}
      <FaqSection />
      <ConcoursBanner />

      {/* ================================================================
          CTA FINAL — sombre, minimal
      ================================================================ */}
      <section id="tarifs" className="py-24 md:py-32 bg-slate-900 relative overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none" />
        <div data-reveal className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-[1.05]">Prêt à réussir ta première année&nbsp;?</h2>
          <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Rejoins les +2&nbsp;500 étudiants qui préparent le concours PASS/LAS avec un coach dans la poche.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/inscription" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors shadow-xl shadow-black/20">
              Commencer gratuitement <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/tarifs" className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
              Voir les tarifs
            </Link>
          </div>
          <div className="mb-4"><PromoPriceLine variant="dark" /></div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <div className="inline-flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-emerald-400" /> 2 jours de Premium offerts</div>
            <div className="inline-flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-emerald-400" /> Sans carte bancaire</div>
            <div className="inline-flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-emerald-400" /> Résiliation en 1 clic</div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   FeatureRow — texte numéroté + mini-écran, en alternance
============================================================ */
function FeatureRow({ num, flip = false, label, title, subtitle, bullets, href, cta, mockup }) {
  return (
    <div className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center ${flip ? 'md:[direction:rtl]' : ''}`}>
      <div data-reveal className={flip ? 'md:[direction:ltr]' : ''}>
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-sm">{num}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
        </div>
        <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4 leading-tight">{title}</h3>
        <p className="text-slate-500 text-lg leading-relaxed mb-5">{subtitle}</p>
        <ul className="space-y-2.5 mb-6">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-slate-700">
              <CheckIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span>{b}</span>
            </li>
          ))}
        </ul>
        <Link href={href} className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold text-sm hover:underline">
          {cta} <ArrowIcon className="w-4 h-4" />
        </Link>
      </div>
      <div data-reveal data-reveal-delay="1" className={`relative ${flip ? 'md:[direction:ltr]' : ''}`}>
        <div className="absolute -inset-4 bg-gradient-to-br from-indigo-600/10 via-violet-400/[0.04] to-transparent rounded-3xl blur-2xl pointer-events-none" />
        <div className="relative">{mockup}</div>
      </div>
    </div>
  );
}

/* ============================================================
   MOCKUPS — mini-écrans produit
============================================================ */
function MockFrame({ label, badge, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/[0.06] border border-slate-200/60 overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
        <span className="w-2 h-2 rounded-full bg-red-300" /><span className="w-2 h-2 rounded-full bg-amber-300" /><span className="w-2 h-2 rounded-full bg-emerald-300" />
        <span className="ml-3 text-[11px] text-slate-400 font-mono truncate">{label}</span>
        {badge && <span className="ml-auto text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold">{badge}</span>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function MockQCM() {
  const options = [
    { t: 'La cystéine, grâce à son groupement thiol', ok: true },
    { t: 'La méthionine, grâce à son thioéther', ok: false },
    { t: 'La sérine, grâce à son hydroxyle', ok: false },
    { t: 'La thréonine', ok: false },
  ];
  return (
    <MockFrame label="QCM · Chimie / Biochimie · 7/10" badge="UE1">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Question 7</p>
      <p className="text-[13px] font-semibold text-slate-800 leading-snug mb-3">Quel acide aminé peut former des ponts disulfure&nbsp;?</p>
      <div className="space-y-1.5">
        {options.map((o, i) => (
          <div key={o.t} className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[11.5px] ${o.ok ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold' : 'bg-white border-slate-200 text-slate-600'}`}>
            <span className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 ${o.ok ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{['A', 'B', 'C', 'D'][i]}</span>
            <span className="truncate">{o.t}</span>
            {o.ok && <CheckIcon className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />}
          </div>
        ))}
      </div>
      <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-lg p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 mb-1">Correction</p>
        <p className="text-[11px] text-indigo-900 leading-snug">Seule la cystéine porte un thiol (–SH) capable de former un pont S–S. La méthionine contient du soufre, mais sous forme thioéther.</p>
      </div>
    </MockFrame>
  );
}

function MockConsolider() {
  const items = [
    { s: 'Anatomie', q: 'Nerf crânien de la mimique', due: "Aujourd'hui", tone: 'text-rose-600 bg-rose-50' },
    { s: 'Biophysique', q: 'Loi de Beer-Lambert', due: 'Demain', tone: 'text-amber-600 bg-amber-50' },
    { s: 'Chimie', q: 'pH d’un acide fort 0,01 M', due: 'Dans 3 j', tone: 'text-slate-500 bg-slate-100' },
  ];
  return (
    <MockFrame label="À consolider · 12 questions" badge="5 min">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tes erreurs à revoir</p>
        <span className="text-[10px] font-bold text-emerald-600">3 sorties de la pile cette semaine</span>
      </div>
      <div className="space-y-1.5">
        {items.map((it) => (
          <div key={it.q} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md shrink-0">{it.s}</span>
            <span className="text-[11.5px] text-slate-700 truncate flex-1">{it.q}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${it.tone}`}>{it.due}</span>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full bg-indigo-600 text-white text-[11px] font-semibold py-2.5 rounded-lg inline-flex items-center justify-center gap-1.5">Rejouer mes 12 questions <ArrowIcon className="w-3 h-3" /></button>
    </MockFrame>
  );
}

function MockExamen() {
  const grid = Array.from({ length: 40 }, (_, i) => (i < 23 ? 'done' : i === 23 ? 'current' : 'todo'));
  return (
    <MockFrame label="Examen blanc · 40 questions" badge="37:12">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grille de réponses</p>
        <span className="text-[10px] font-bold text-slate-500">23 / 40 répondues</span>
      </div>
      <div className="grid grid-cols-10 gap-1.5 mb-3">
        {grid.map((g, i) => (
          <span key={i} className={`h-6 rounded-md text-[9px] font-bold flex items-center justify-center ${g === 'done' ? 'bg-indigo-600 text-white' : g === 'current' ? 'bg-amber-400 text-white ring-2 ring-amber-200' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[['UE1', 'Chimie', '7'], ['UE5', 'Anatomie', '8'], ['UE4', 'Biostats', '5']].map(([c, n, k]) => (
          <div key={c} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{c} · {n}</p>
            <p className="text-sm font-bold text-slate-900">{k} <span className="text-[10px] text-slate-400 font-normal">questions</span></p>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

function MockFiches() {
  const fiches = [
    { t: 'Ostéologie et arthrologie', min: 4, read: true },
    { t: 'Myologie', min: 3, read: true },
    { t: 'Angiologie', min: 5, read: false },
    { t: 'Neuroanatomie', min: 6, read: false },
  ];
  return (
    <MockFrame label="Fiches · Anatomie · UE5" badge="18 / 25 lues">
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3"><div className="anim-bar h-full bg-indigo-600 rounded-full" style={{ width: '72%' }} /></div>
      <div className="space-y-1.5">
        {fiches.map((f) => (
          <div key={f.t} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${f.read ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}>{f.read && <CheckIcon className="w-3 h-3 text-white" />}</span>
            <span className={`text-[11.5px] flex-1 truncate ${f.read ? 'text-slate-500' : 'text-slate-800 font-semibold'}`}>{f.t}</span>
            <span className="text-[10px] text-slate-400 font-mono shrink-0">{f.min} min</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px]">
        <span className="text-slate-400">Cours complet + schémas · PDF</span>
        <span className="text-indigo-600 font-semibold">QCM sur cette fiche →</span>
      </div>
    </MockFrame>
  );
}

function MockProgression() {
  const bars = [
    { n: 'Chimie / Biochimie', v: 82, c: 'bg-emerald-500' },
    { n: 'Biologie cellulaire', v: 74, c: 'bg-emerald-500' },
    { n: 'Biostatistiques', v: 61, c: 'bg-amber-500' },
    { n: 'Anatomie', v: 48, c: 'bg-rose-500' },
  ];
  return (
    <MockFrame label="Progression · 4 semaines" badge="↑ +9 pts">
      <div className="space-y-2.5 mb-4">
        {bars.map((b) => (
          <div key={b.n}>
            <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-600 font-medium">{b.n}</span><span className="text-slate-400 font-mono">{b.v}%</span></div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className={`anim-bar h-full ${b.c} rounded-full`} style={{ width: `${b.v}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="bg-violet-50 border border-violet-100 rounded-lg p-3 flex gap-2.5 items-start">
        <span className="text-lg leading-none">🦉</span>
        <p className="text-[11px] text-violet-900 leading-snug"><strong>L&apos;Anatomie te freine</strong>{' '}(48 %). Trois QCM ciblés cette semaine et tu passes la barre des 60 %.</p>
      </div>
    </MockFrame>
  );
}

function MockDashboard() {
  return (
    <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50">
        <span className="w-2.5 h-2.5 rounded-full bg-red-300" /><span className="w-2.5 h-2.5 rounded-full bg-amber-300" /><span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
        <span className="ml-3 text-xs text-slate-400 font-mono">Tableau de bord · J-134</span>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-black text-slate-900">Bonsoir Emma</p>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-800 bg-slate-50 border border-slate-100 rounded-full px-2 py-1">🤓 Carabin</span>
            <span className="text-[11px] font-bold text-slate-800 bg-slate-50 border border-slate-100 rounded-full px-2 py-1">🔥 7</span>
          </div>
        </div>
        <div className="relative mx-1" style={{ height: 30 }}>
          <div className="absolute left-0 right-6 top-[15px]" style={{ height: 3, borderRadius: 3, background: 'repeating-linear-gradient(90deg, #d7d9e8 0 5px, transparent 5px 11px)' }} />
          <div className="anim-bar absolute left-0 top-[15px]" style={{ height: 3, width: '58%', borderRadius: 3, background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }} />
          <span className="absolute text-lg" style={{ left: '58%', top: -4, transform: 'translateX(-50%)' }}>🧑‍🎓</span>
          <span className="absolute right-0 top-[2px] text-lg">🏁</span>
        </div>
        <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wide mx-1 -mt-2"><span>Départ</span><span>Le concours · 15 nov.</span></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl p-3 text-white" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
            <p className="text-base leading-none mb-1.5">🔁</p><p className="text-[10.5px] font-bold leading-tight">À consolider</p><p className="text-[9px] opacity-80 mt-0.5">12 questions</p>
          </div>
          <div className="rounded-xl p-3 bg-indigo-50 border border-indigo-100"><p className="text-base leading-none mb-1.5">✅</p><p className="text-[10.5px] font-bold text-slate-900 leading-tight">QCM</p><p className="text-[9px] text-slate-500 mt-0.5">Toutes UE</p></div>
          <div className="rounded-xl p-3 bg-amber-50 border border-amber-100"><p className="text-base leading-none mb-1.5">⚡</p><p className="text-[10.5px] font-bold text-slate-900 leading-tight">Éclair</p><p className="text-[9px] text-slate-500 mt-0.5">5 min</p></div>
        </div>
        <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="text-2xl leading-none">🦉</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-violet-600 mb-0.5">Pico · Conseil du jour</p>
            <p className="text-[12px] text-slate-800 leading-snug">Sept jours d&apos;affilée, Emma. Dix minutes sur l&apos;Anatomie et tu gardes ta série&nbsp;🔥</p>
          </div>
        </div>
      </div>
    </div>
  );
}
