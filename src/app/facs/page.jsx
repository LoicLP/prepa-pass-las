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

import FacsList from './FacsList';

const SHORT_BAREME = { differences: 'Dégressif 1 · 0,7 · 0,1', degressif: 'Dégressif 1 · 0,5 · 0,2', degressif75: 'Dégressif 1 · 0,75 · 0,5', degressif50: 'Dégressif 1 · 0,5 · 0', degressif80: 'Dégressif 1 · 0,8 · 0,25', item_02_01: '+0,2 / −0,1 par item', negatif: 'Points négatifs', tout_ou_rien: 'Tout ou rien', partiel: 'Points partiels' };
const CONF_LABEL = { officiel: 'MCC officielles', secondaire: 'prépa / tutorat', temoignage: 'témoignages' };
// Regroupement géographique pour la lecture (ordre d'affichage = ordre ci-dessous)
export const REGIONS = [
  { id: 'idf', name: 'Île-de-France', color: '#4f46e5', ids: ['paris-cite', 'sorbonne', 'paris-saclay', 'upec', 'versailles'] },
  { id: 'nord-est', name: 'Nord & Est', color: '#0891b2', ids: ['lille', 'amiens', 'reims', 'nancy', 'strasbourg', 'dijon', 'besancon'] },
  { id: 'ouest', name: 'Ouest & Normandie', color: '#059669', ids: ['nantes', 'rennes', 'brest', 'angers', 'tours', 'rouen', 'caen', 'poitiers'] },
  { id: 'sud-ouest', name: 'Sud-Ouest & Occitanie', color: '#d97706', ids: ['bordeaux', 'toulouse', 'limoges', 'montpellier'] },
  { id: 'sud-est', name: 'Sud-Est & Centre', color: '#e11d48', ids: ['lyon-est', 'lyon-sud', 'saint-etienne', 'grenoble', 'clermont', 'marseille', 'nice'] },
  { id: 'outre-mer', name: 'Outre-mer', color: '#7c3aed', ids: ['antilles', 'reunion'] },
];

export default function FacsIndexPage() {
  const facs = FACS.filter((f) => f.id !== 'autre').sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  const nBareme = facs.filter((f) => MCC[f.id]?.bareme).length;
  const nProg = facs.filter((f) => FAC_EXAMS[f.id]?.exams?.length).length;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Facultés PASS/LAS : programme, barème et épreuves', url: `${siteUrl}/facs`, itemListElement: facs.map((f, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteUrl}/facs/${f.id}`, name: f.name })) };

  // Données plates pour la liste cliente
  const rows = facs.map((f) => {
    const d = describe(f);
    return {
      id: f.id, name: f.name, short: f.name.replace(/^Université (de |d’|d')?/i, ''), city: f.city || '', voie: NO_PASS[f.id] || 'PASS',
      conf: d.m ? d.m.confidence : null, confLabel: d.m ? CONF_LABEL[d.m.confidence] : 'non documentée',
      bareme: d.b ? (SHORT_BAREME[d.b.id] || d.b.label) : null,
      epreuves: d.minutes.length ? `${d.minutes.length} épreuve${d.minutes.length > 1 ? 's' : ''} · ${fmtMinutes(Math.min(...d.minutes))}${Math.max(...d.minutes) !== Math.min(...d.minutes) ? ` à ${fmtMinutes(Math.max(...d.minutes))}` : ''}` : null,
      ue: d.order.length, partiels: d.dates?.s1 ? fmtDate(d.dates.s1) : null,
      region: (REGIONS.find((r) => r.ids.includes(f.id)) || REGIONS[REGIONS.length - 1]).id,
    };
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="gradient-hero noise-overlay dot-grid pt-28 pb-10 md:pt-36 md:pb-14 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-4">Ta fac, <span className="programme-gradient-text">ses r&egrave;gles</span></h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">Comment tes QCM sont not&eacute;s, combien de temps durent les &eacute;preuves, quand tombent les partiels. Pour {facs.length} facult&eacute;s, d&rsquo;apr&egrave;s ce qu&rsquo;elles publient, avec la source.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-white/80 border border-primary-200 px-3 py-1 text-primary-700">{facs.length} facult&eacute;s</span>
            <span className="rounded-full bg-white/80 border border-emerald-200 px-3 py-1 text-emerald-700">{nBareme} bar&egrave;mes connus</span>
            <span className="rounded-full bg-white/80 border border-gray-200 px-3 py-1 text-gray-600">{nProg} programmes renseign&eacute;s</span>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FacsList facs={rows} regions={REGIONS.map(({ id, name, color }) => ({ id, name, color }))} />

          <p className="mt-6 text-[12.5px] text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> MCC officielles : document de l&rsquo;universit&eacute;</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> pr&eacute;pa, tutorat ou t&eacute;moignages : &agrave; confirmer sur l&rsquo;intranet</span>
          </p>

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
