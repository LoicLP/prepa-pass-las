import Link from 'next/link';
import { FACS, MCC } from '@/data/facs';
import { FAC_EXAMS, fmtMinutes } from '@/data/facExams';
import { SUBJECTS } from '@/data/subjects';
import { baremeById } from '@/lib/profile';

export const metadata = {
  title: 'Les facultés PASS/LAS : programme, barème, épreuves — 2026-2027',
  description: 'Pour chaque faculté de médecine : programme et UE, barème de notation des QCM, durée et format des épreuves, note-seuil, dates de partiels. D’après les MCC officielles, avec les sources.',
  alternates: { canonical: '/facs' },
};

const siteUrl = 'https://prepa-pass-las.fr';
const NO_PASS = { nice: 'LAS', caen: 'LAS', poitiers: 'LAS', reims: 'LAS', strasbourg: 'L1 SpS', upec: 'LSPS / LAS', angers: 'PluriPASS' };
const CONF = { officiel: ['MCC officielles', 'bg-emerald-50 text-emerald-700'], secondaire: ['prépa / tutorat', 'bg-amber-50 text-amber-700'], temoignage: ['témoignages', 'bg-amber-50 text-amber-700'] };
const subjName = (id) => SUBJECTS.find((s) => s.id === id)?.name || id;
const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

/* Résumé structuré d'une fac, calculé à partir des données MCC et épreuves. */
function describe(f) {
  const m = MCC[f.id]; const ex = FAC_EXAMS[f.id]; const exams = ex?.exams || [];
  const b = m?.bareme ? baremeById(m.bareme) : null;
  const conf = m ? CONF[m.confidence] : null;
  const order = []; for (const e of exams) if (!order.includes(e.subject)) order.push(e.subject);
  const minutes = exams.map((e) => e.minutes).filter(Boolean);
  const questions = exams.map((e) => e.questions).filter(Boolean);
  const fm = ex?.formats || {};
  const particularites = [
    fm.propositions && fm.propositions !== 4 ? `${fm.propositions} propositions` : null,
    fm.itemF ? 'item F « toutes fausses »' : null,
    fm.qcd ? 'vrai / faux (QCD)' : null,
    Array.isArray(fm.qru) && fm.qru.length ? `réponse unique en ${fm.qru.map(subjName).join(', ')}` : null,
    Array.isArray(fm.qroc) && fm.qroc.length ? 'QROC' : null,
    Array.isArray(fm.toutOuRien) && fm.toutOuRien.length ? `tout ou rien en ${fm.toutOuRien.map(subjName).join(', ')}` : null,
    exams.some((e) => /qr$/.test(e.format || '')) ? 'partie rédactionnelle' : null,
    ex?.threshold ? `note-seuil ${ex.threshold}/20` : null,
  ].filter(Boolean);
  return { m, b, conf, order, minutes, questions, particularites, dates: ex?.dates || null, exams };
}

export default function FacsIndexPage() {
  const facs = FACS.filter((f) => f.id !== 'autre').sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  const nBareme = facs.filter((f) => MCC[f.id]?.bareme).length;
  const nProg = facs.filter((f) => FAC_EXAMS[f.id]?.exams?.length).length;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Facultés PASS/LAS : programme, barème et épreuves', url: `${siteUrl}/facs`, itemListElement: facs.map((f, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteUrl}/facs/${f.id}`, name: f.name })) };

  const Row = ({ k, children }) => (
    <div className="flex gap-3 text-[13px] leading-snug">
      <span className="w-24 shrink-0 text-[11px] font-bold uppercase tracking-wider text-gray-400 pt-0.5">{k}</span>
      <span className="min-w-0 flex-1 text-gray-700">{children}</span>
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="gradient-hero noise-overlay dot-grid pt-28 pb-10 md:pt-36 md:pb-14 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-4">Les facult&eacute;s, <span className="programme-gradient-text">une par une</span></h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">Programme, notation des QCM, dur&eacute;e des &eacute;preuves, dates : ce que chaque facult&eacute; publie dans ses MCC, avec la source.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-white/80 border border-primary-200 px-3 py-1 text-primary-700">{facs.length} facult&eacute;s</span>
            <span className="rounded-full bg-white/80 border border-gray-200 px-3 py-1 text-gray-600">{nBareme} bar&egrave;mes connus</span>
            <span className="rounded-full bg-white/80 border border-gray-200 px-3 py-1 text-gray-600">{nProg} programmes renseign&eacute;s</span>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-4">
            {facs.map((f) => {
              const d = describe(f);
              const voie = NO_PASS[f.id] || 'PASS';
              return (
                <Link key={f.id} href={`/facs/${f.id}`} className="group block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-300 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h2 className="font-bold text-gray-900 leading-snug group-hover:text-indigo-700 transition-colors">{f.name}</h2>
                      <p className="text-xs text-gray-400 mt-0.5">{f.city}{f.city ? ' · ' : ''}{voie}</p>
                    </div>
                    {d.conf ? <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${d.conf[1]}`}>{d.conf[0]}</span> : <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-500">non document&eacute;e</span>}
                  </div>
                  <div className="space-y-1.5">
                    <Row k="Notation">{d.b ? <><strong className="text-gray-900">{d.b.label}</strong> <span className="text-gray-500">· {d.b.desc.toLowerCase()}</span></> : <span className="text-gray-500">bar&egrave;me non publi&eacute;{d.m ? ' par la faculté' : ''}</span>}</Row>
                    <Row k="Programme">{d.order.length ? <><strong className="text-gray-900">{d.order.length} UE</strong> <span className="text-gray-500">· {d.order.map((id) => d.exams.find((e) => e.subject === id)?.label || subjName(id)).slice(0, 4).join(', ')}{d.order.length > 4 ? '…' : ''}</span></> : <span className="text-gray-500">maquette non publi&eacute;e, programme complet propos&eacute;</span>}</Row>
                    <Row k="&Eacute;preuves">{d.minutes.length ? <>{d.minutes.length} &eacute;preuves de <strong className="text-gray-900">{fmtMinutes(Math.min(...d.minutes))}{Math.max(...d.minutes) !== Math.min(...d.minutes) ? ` à ${fmtMinutes(Math.max(...d.minutes))}` : ''}</strong>{d.questions.length ? <span className="text-gray-500"> · {Math.min(...d.questions)}{Math.max(...d.questions) !== Math.min(...d.questions) ? ` à ${Math.max(...d.questions)}` : ''} QCM</span> : null}</> : <span className="text-gray-500">dur&eacute;es non publi&eacute;es</span>}</Row>
                    {d.particularites.length > 0 && <Row k="Sp&eacute;cificit&eacute;s">{d.particularites.join(' · ')}</Row>}
                    {d.dates && (d.dates.s1 || d.dates.s2) && <Row k="Partiels">{d.dates.s1 ? `S1 ${fmtDate(d.dates.s1)}` : ''}{d.dates.s1 && d.dates.s2 ? ' · ' : ''}{d.dates.s2 ? `S2 ${fmtDate(d.dates.s2)}` : ''}{d.dates.approx ? <span className="text-gray-400"> (d&apos;apr&egrave;s 2025-2026)</span> : null}</Row>}
                  </div>
                  <p className="mt-3 text-xs font-bold text-indigo-600">Voir la fiche →</p>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 rounded-3xl bg-slate-900 text-white p-8 md:p-10 text-center">
            <h2 className="text-2xl font-black mb-2">R&eacute;vise dans les conditions de ta fac</h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-6">Renseigne ta facult&eacute; : programme, bar&egrave;me, dur&eacute;e et nombre de QCM de tes MCC s&apos;appliquent &agrave; tes QCM et &agrave; tes examens blancs.</p>
            <Link href="/inscription" className="inline-flex items-center px-6 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-indigo-50 transition-colors">Cr&eacute;er mon compte — 7 jours Premium offerts</Link>
          </div>
        </div>
      </section>
    </>
  );
}
