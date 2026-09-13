import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FACS, MCC, facById } from '@/data/facs';
import { FAC_EXAMS, fmtMinutes } from '@/data/facExams';
import { SUBJECTS } from '@/data/subjects';
import { baremeById } from '@/lib/profile';
import { strategyFor } from '@/lib/bareme';
import { facStats } from '@/lib/facStats';

const siteUrl = 'https://prepa-pass-las.fr';
export const revalidate = 3600;

export async function generateStaticParams() {
  return FACS.filter((f) => f.id !== 'autre').map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const f = facById(id); if (!f || id === 'autre') return {};
  const m = MCC[id]; const b = m?.bareme ? baremeById(m.bareme) : null;
  const title = `Barème des QCM PASS à ${f.name} : notation, épreuves, dates`;
  const description = b
    ? `À ${f.name}, les QCM sont notés « ${b.label.toLowerCase()} » (${b.desc.toLowerCase()}) d’après ${m.confidence === 'officiel' ? 'les MCC officielles' : 'les sources étudiantes'} ${m.year}. Durée des épreuves, coefficients et conseils de stratégie.`
    : `Format des épreuves PASS/LAS à ${f.name} d’après les MCC ${m?.year || '2025-2026'} : durées, coefficients, dates. Le barème des QCM n’est pas publié : voici ce qu’on sait.`;
  return { title, description, alternates: { canonical: `/facs/${id}` }, openGraph: { title, description, url: `${siteUrl}/facs/${id}` } };
}

const CONF = { officiel: 'D’après les MCC officielles', secondaire: 'D’après une source non officielle (prépa, tutorat)', temoignage: 'D’après des témoignages d’étudiants' };
const FORMAT_LABEL = { qcm: 'QCM', qru: 'QRU (réponse unique)', 'qcm+qr': 'QCM + rédactionnel', 'qcm+qroc': 'QCM + QROC', qroc: 'QROC' };
const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export default async function FacPage({ params }) {
  const { id } = await params;
  const f = facById(id); if (!f || id === 'autre') notFound();
  const m = MCC[id] || null; const b = m?.bareme ? baremeById(m.bareme) : null;
  const ex = FAC_EXAMS[id] || null; const exams = ex?.exams || [];
  const strat = b ? strategyFor(b.id) : null;
  let stats = null; try { stats = await facStats(id); } catch {}
  const confirmed = b && stats?.votes?.[b.id] ? stats.votes[b.id] : 0;
  const subjName = (sid) => SUBJECTS.find((s) => s.id === sid)?.name || sid;
  const others = FACS.filter((x) => x.id !== id && x.id !== 'autre' && MCC[x.id]?.bareme).slice(0, 8);
  const fmts = ex?.formats || {};
  const particularites = [
    fmts.propositions && fmts.propositions !== 4 && `QCM à ${fmts.propositions} propositions`,
    fmts.itemF && 'un item « toutes les propositions précédentes sont fausses »',
    fmts.qcd && 'des questions vrai/faux (QCD)',
    Array.isArray(fmts.qru) && fmts.qru.length > 0 && `réponse unique en ${fmts.qru.map(subjName).join(' et ')}`,
    Array.isArray(fmts.qroc) && fmts.qroc.length > 0 && `des QROC en ${fmts.qroc.map(subjName).join(', ')}`,
    Array.isArray(fmts.toutOuRien) && fmts.toutOuRien.length > 0 && `tout ou rien en ${fmts.toutOuRien.map(subjName).join(', ')}`,
  ].filter(Boolean);
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: `Barème des QCM PASS à ${f.name}`, url: `${siteUrl}/facs/${id}`, about: { '@type': 'CollegeOrUniversity', name: f.name, address: f.city }, ...(m ? { citation: m.source } : {}) };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="gradient-hero noise-overlay dot-grid pt-28 pb-12 md:pt-36 md:pb-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/facs" className="text-sm font-semibold text-primary-700 hover:underline">← Toutes les facult&eacute;s</Link>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-4">Le bar&egrave;me des QCM &agrave; <span className="programme-gradient-text">{f.name}</span></h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">{b ? <>QCM not&eacute;s <strong className="text-gray-900">{b.label.toLowerCase()}</strong> : {b.desc.toLowerCase()}</> : <>Le bar&egrave;me n&apos;est pas publi&eacute; par l&apos;universit&eacute;. Voici le format des &eacute;preuves et ce que disent les sources.</>}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
            {m && <span className={`rounded-full px-3 py-1 ${m.confidence === 'officiel' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{CONF[m.confidence]} · {m.year}</span>}
            {confirmed > 0 && <span className="rounded-full px-3 py-1 bg-indigo-50 text-indigo-700">✓ Confirm&eacute; par {confirmed} &eacute;tudiant{confirmed > 1 ? 's' : ''}</span>}
            {ex?.threshold && <span className="rounded-full px-3 py-1 bg-rose-50 text-rose-700">Note-seuil {ex.threshold}/20</span>}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {m && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8" style={{ borderTopWidth: 3, borderTopColor: '#4f46e5' }}>
              <h2 className="text-xl font-black text-gray-900 mb-3">Ce que dit la source</h2>
              <blockquote className="border-l-4 border-indigo-200 pl-4 text-gray-700 italic mb-4">« {m.quote} »</blockquote>
              <p className="text-sm text-gray-600 mb-3">{m.note}</p>
              <p className="text-xs text-gray-400">Source : <a href={m.source} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold hover:underline">{m.sourceLabel}</a>. Les MCC changent chaque ann&eacute;e : v&eacute;rifie sur ton intranet.</p>
            </div>
          )}

          {strat && (
            <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6 md:p-8">
              <h2 className="text-xl font-black text-indigo-950 mb-1">{strat.title}</h2>
              <p className="text-sm text-indigo-900/70 mb-4">La bonne strat&eacute;gie de r&eacute;ponse d&eacute;pend enti&egrave;rement du bar&egrave;me.</p>
              <ul className="space-y-2 text-[15px] text-indigo-950/90 list-disc pl-5">{strat.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
          )}

          {exams.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-black text-gray-900 mb-1">Les &eacute;preuves</h2>
              <p className="text-sm text-gray-500 mb-4">D&apos;apr&egrave;s les MCC {m?.year || '2025-2026'}, rattach&eacute;es &agrave; nos six mati&egrave;res. Indicatif.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100"><th className="py-2 pr-3">&Eacute;preuve</th><th className="py-2 pr-3">Mati&egrave;re</th><th className="py-2 pr-3">Questions</th><th className="py-2 pr-3">Dur&eacute;e</th><th className="py-2 pr-3">Coef.</th><th className="py-2">Format</th></tr></thead>
                  <tbody>
                    {exams.map((e, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-2.5 pr-3 font-semibold text-gray-900">{e.label}</td>
                        <td className="py-2.5 pr-3 text-gray-600">{subjName(e.subject)}</td>
                        <td className="py-2.5 pr-3 text-gray-600">{e.questions || '—'}</td>
                        <td className="py-2.5 pr-3 text-gray-600">{e.minutes ? fmtMinutes(e.minutes) : '—'}</td>
                        <td className="py-2.5 pr-3 text-gray-600">{e.coeff || '—'}</td>
                        <td className="py-2.5 text-gray-600">{FORMAT_LABEL[e.format] || e.format}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {particularites.length > 0 && <p className="text-sm text-gray-600 mt-4"><strong>Particularit&eacute;s :</strong> {particularites.join(' · ')}.</p>}
              {ex?.threshold && <p className="text-sm text-gray-600 mt-2"><strong>Note-seuil :</strong> une note sous {ex.threshold}/20 est &eacute;liminatoire sur certaines UE.</p>}
            </div>
          )}

          {ex?.dates && (ex.dates.s1 || ex.dates.s2) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-black text-gray-900 mb-1">Dates des partiels</h2>
              <p className="text-sm text-gray-500 mb-4">{ex.dates.approx ? 'Extrapolées du calendrier 2025-2026, à confirmer sur ton intranet.' : 'Calendrier officiel.'}</p>
              <ul className="space-y-1.5 text-[15px] text-gray-800">
                {ex.dates.s1 && <li><strong>Semestre 1 :</strong> semaine du {fmtDate(ex.dates.s1)}</li>}
                {ex.dates.s2 && <li><strong>Semestre 2 :</strong> semaine du {fmtDate(ex.dates.s2)}</li>}
              </ul>
            </div>
          )}

          <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-10">
            <h2 className="text-2xl font-black mb-2">R&eacute;vise au format de {f.name}</h2>
            <ul className="text-slate-300 space-y-1.5 mb-6 list-disc pl-5">
              <li>Examens blancs par UE avec {exams.some((e) => e.minutes) ? 'la durée et le nombre de QCM de ta fac' : 'la durée de ton choix'}, not&eacute;s sur 20 {b ? `au barème « ${b.label.toLowerCase()} »` : 'au barème que tu choisis'}.</li>
              <li>Conseils de strat&eacute;gie et analyse des cases coch&eacute;es en trop apr&egrave;s chaque &eacute;preuve.</li>
              <li>Questions g&eacute;n&eacute;r&eacute;es dans le style de ta fac{particularites.length ? ` (${particularites[0]})` : ''}.</li>
              <li>150 fiches, QCM illimit&eacute;s, r&eacute;visions espac&eacute;es.</li>
            </ul>
            <Link href="/inscription" className="inline-flex items-center px-6 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-indigo-50 transition-colors">Cr&eacute;er mon compte — 7 jours Premium offerts</Link>
          </div>

          {others.length > 0 && (
            <div>
              <h2 className="text-base font-black text-gray-900 mb-3">Autres facult&eacute;s</h2>
              <div className="flex flex-wrap gap-2">{others.map((o) => <Link key={o.id} href={`/facs/${o.id}`} className="rounded-full bg-white border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-700">{o.name}</Link>)}<Link href="/facs" className="rounded-full bg-white border border-gray-200 px-3 py-1.5 text-sm font-semibold text-indigo-700 hover:border-indigo-300">Toutes →</Link></div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
