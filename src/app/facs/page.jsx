import Link from 'next/link';
import { FACS, MCC } from '@/data/facs';
import { FAC_EXAMS } from '@/data/facExams';
import { baremeById } from '@/lib/profile';

export const metadata = {
  title: 'Barème des QCM par faculté — PASS/LAS 2026-2027',
  description: 'Barème de notation des QCM, durée des épreuves, coefficients et dates de partiels pour chaque faculté de médecine : Paris Cité, Sorbonne, Lyon, Marseille, Lille, Toulouse… d’après les MCC officielles.',
  alternates: { canonical: '/facs' },
};

const siteUrl = 'https://prepa-pass-las.fr';
const CONF = { officiel: ['MCC officielles', 'bg-emerald-50 text-emerald-700'], secondaire: ['source prépa / tutorat', 'bg-amber-50 text-amber-700'], temoignage: ['témoignages étudiants', 'bg-amber-50 text-amber-700'] };

export default function FacsIndexPage() {
  const facs = FACS.filter((f) => f.id !== 'autre');
  const withBareme = facs.filter((f) => MCC[f.id]?.bareme);
  const without = facs.filter((f) => !MCC[f.id]?.bareme);
  const jsonLd = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Barème des QCM par faculté PASS/LAS', url: `${siteUrl}/facs`, itemListElement: facs.map((f, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteUrl}/facs/${f.id}`, name: f.name })) };
  const Card = ({ f }) => {
    const m = MCC[f.id]; const b = m?.bareme ? baremeById(m.bareme) : null; const conf = m ? CONF[m.confidence] : null;
    const ex = FAC_EXAMS[f.id];
    return (
      <Link href={`/facs/${f.id}`} className="group block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-300 hover:shadow-md transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors leading-snug">{f.name}</h3>
            {f.city && <p className="text-xs text-gray-400 mt-0.5">{f.city}</p>}
          </div>
          {conf && <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${conf[1]}`}>{conf[0]}</span>}
        </div>
        <p className="mt-3 text-sm text-gray-700">{b ? <><span className="font-semibold">Barème :</span> {b.label.toLowerCase()}</> : <span className="text-gray-500">Barème non publié : format et durées des épreuves</span>}</p>
        {ex?.exams?.length > 0 && <p className="text-xs text-gray-400 mt-1">{ex.exams.filter((e) => e.minutes).length} épreuves renseignées{ex.threshold ? ` · note-seuil ${ex.threshold}/20` : ''}{ex.dates ? ' · dates des partiels' : ''}</p>}
      </Link>
    );
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="gradient-hero noise-overlay dot-grid pt-28 pb-12 md:pt-36 md:pb-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-primary-200 mb-6"><span className="text-sm font-semibold text-primary-700">{facs.length} facultés · MCC 2025-2026</span></div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-5">Le bar&egrave;me des QCM, <span className="programme-gradient-text">fac par fac</span></h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">Points n&eacute;gatifs, notation d&eacute;gressive par discordance, tout ou rien&hellip; chaque facult&eacute; note ses QCM &agrave; sa mani&egrave;re, et &ccedil;a change la strat&eacute;gie le jour J. Nous avons lu les MCC de chaque universit&eacute; : voici ce qu&apos;elles disent, avec la source, et ce qu&apos;il manque.</p>
        </div>
      </section>
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-black text-gray-900 mb-1">Bar&egrave;me connu</h2>
          <p className="text-sm text-gray-500 mb-5">D&apos;apr&egrave;s les MCC officielles quand elles le publient, sinon d&apos;apr&egrave;s les tutorats et pr&eacute;pas locales, toujours avec la source.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">{withBareme.map((f) => <Card key={f.id} f={f} />)}</div>
          <h2 className="text-xl font-black text-gray-900 mb-1">Bar&egrave;me non publi&eacute;</h2>
          <p className="text-sm text-gray-500 mb-5">Les MCC fixent le format et les dur&eacute;es sans donner la r&egrave;gle de notation. Les &eacute;tudiants inscrits peuvent la confirmer depuis leur profil.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{without.map((f) => <Card key={f.id} f={f} />)}</div>
          <div className="mt-12 rounded-3xl bg-slate-900 text-white p-8 md:p-10 text-center">
            <h2 className="text-2xl font-black mb-2">Des &eacute;preuves blanches au format de ta fac</h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-6">Renseigne ta facult&eacute; : le bar&egrave;me, la dur&eacute;e et le nombre de QCM de tes MCC s&apos;appliquent &agrave; tes examens blancs, avec une note sur 20 comparable &agrave; la vraie.</p>
            <Link href="/inscription" className="inline-flex items-center px-6 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-indigo-50 transition-colors">Cr&eacute;er mon compte — 7 jours Premium offerts</Link>
          </div>
        </div>
      </section>
    </>
  );
}
