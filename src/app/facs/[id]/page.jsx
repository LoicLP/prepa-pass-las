import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FACS, MCC, facById } from '@/data/facs';
import { FAC_EXAMS, fmtMinutes } from '@/data/facExams';
import { SUBJECTS } from '@/data/subjects';
import { baremeById } from '@/lib/profile';
import { strategyFor, SCALES } from '@/lib/bareme';
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
    ? `À ${f.name}, les QCM sont notés « ${b.label.toLowerCase()} » (${b.desc.toLowerCase()}) d’après ${m.confidence === 'officiel' ? 'les MCC officielles' : 'les sources étudiantes'} ${m.year}. Épreuves, durées, coefficients et dates des partiels.`
    : `Format des épreuves PASS/LAS à ${f.name} d’après les MCC ${m?.year || '2025-2026'} : durées, coefficients, dates. Le barème des QCM n’est pas publié : voici ce qu’on sait.`;
  return { title, description, alternates: { canonical: `/facs/${id}` }, openGraph: { title, description, url: `${siteUrl}/facs/${id}` } };
}

const NO_PASS = { nice: 'LAS', caen: 'LAS', poitiers: 'LAS', reims: 'LAS', strasbourg: 'L1 SpS', upec: 'LSPS / LAS', angers: 'PluriPASS' };
const CONF = { officiel: ['MCC officielles', 'bg-emerald-50 text-emerald-700 border-emerald-100'], secondaire: ['source non officielle (prépa, tutorat)', 'bg-amber-50 text-amber-700 border-amber-100'], temoignage: ['témoignages d’étudiants', 'bg-amber-50 text-amber-700 border-amber-100'] };
const FORMAT_LABEL = { qcm: 'QCM', qru: 'QRU · réponse unique', 'qcm+qr': 'QCM + rédactionnel', 'qcm+qroc': 'QCM + QROC', qroc: 'QROC' };
const ACCENT = { indigo: '#4f46e5', emerald: '#059669', violet: '#7c3aed', cyan: '#0891b2', amber: '#d97706', rose: '#e11d48', sky: '#0284c7', teal: '#0d9488', fuchsia: '#c026d3' };
const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const fmtShort = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
const fr = (n) => String(n).replace('.', ',');

/* Exemple chiffré d'une question à 5 propositions selon le barème : ce que rapporte 0, 1, 2 ou 3 erreurs. */
function baremeExample(id) {
  if (SCALES[id]) return [0, 1, 2, 3].map((k) => ({ k, v: fr(SCALES[id][k] ?? 0) }));
  if (id === 'partiel') return [0, 1, 2, 3].map((k) => ({ k, v: fr(Math.round(((5 - k) / 5) * 100) / 100) }));
  if (id === 'negatif') return [0, 1, 2, 3].map((k) => ({ k, v: fr(Math.max(0, Math.round(((5 - 2 * k) / 5) * 100) / 100)) }));
  if (id === 'item_02_01') return [0, 1, 2, 3].map((k) => ({ k, v: fr(Math.max(0, Math.round(((2 * (5 - k) - k) / 10) * 100) / 100)) }));
  if (id === 'tout_ou_rien') return [0, 1, 2, 3].map((k) => ({ k, v: k === 0 ? '1' : '0' }));
  return null;
}

export default async function FacPage({ params }) {
  const { id } = await params;
  const f = facById(id); if (!f || id === 'autre') notFound();
  const m = MCC[id] || null; const b = m?.bareme ? baremeById(m.bareme) : null;
  const ex = FAC_EXAMS[id] || null; const exams = ex?.exams || [];
  const strat = b ? strategyFor(b.id) : null;
  const example = b ? baremeExample(b.id) : null;
  let stats = null; try { stats = await facStats(id); } catch {}
  const confirmed = b && stats?.votes?.[b.id] ? stats.votes[b.id] : 0;
  const subj = (sid) => SUBJECTS.find((s) => s.id === sid);
  const subjName = (sid) => subj(sid)?.name || sid;
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
  const minutes = exams.map((e) => e.minutes).filter(Boolean);
  const ueIds = [...new Set(exams.map((e) => e.subject))];
  const voie = NO_PASS[id] || 'PASS';
  const shortName = f.name.replace(/^Université (de |d’|d')?/i, '');
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: `Barème des QCM PASS à ${f.name}`, url: `${siteUrl}/facs/${id}`, about: { '@type': 'CollegeOrUniversity', name: f.name, address: f.city }, ...(m ? { citation: m.source } : {}) };

  const Tile = ({ label, value, sub, tone = 'indigo' }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="font-jakarta text-[17px] font-extrabold text-gray-900 leading-tight mt-1.5">{value}</p>
      {sub && <p className="text-[12px] text-gray-500 mt-1 leading-snug">{sub}</p>}
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* En-tête */}
      <section className="gradient-hero noise-overlay dot-grid pt-28 pb-8 md:pt-36 md:pb-10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/facs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Toutes les facult&eacute;s
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-full bg-white/80 border border-primary-200 px-3 py-1 text-primary-700">{voie}</span>
            {f.city && <span className="rounded-full bg-white/80 border border-gray-200 px-3 py-1 text-gray-600">{f.city}</span>}
            {m && <span className={`rounded-full border px-3 py-1 ${CONF[m.confidence][1]}`}>D&rsquo;apr&egrave;s les {CONF[m.confidence][0]} · {m.year}</span>}
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-gray-900 leading-[1.1]">{f.name}</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-2xl">
            {b
              ? <>Ici, une question de QCM vaut <strong className="text-gray-900">1 point sans erreur</strong>{example ? <>, <strong className="text-gray-900">{example[1].v}</strong> avec une seule erreur</> : null}. Voici comment on te note, ce que tu passes, et quand.</>
              : <>La facult&eacute; ne publie pas le d&eacute;tail de la notation des QCM. Voici ce qu&rsquo;on sait de ses &eacute;preuves, et ce qu&rsquo;il te reste &agrave; v&eacute;rifier sur ton intranet.</>}
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* En bref */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Tile label="Notation" value={b ? b.label : 'Non publiée'} sub={b ? (confirmed > 0 ? `Confirmée par ${confirmed} étudiant${confirmed > 1 ? 's' : ''}` : 'Aucun point négatif'.replace('Aucun point négatif', b.id === 'negatif' ? 'Points négatifs' : 'Jamais négatif')) : 'À vérifier sur l’intranet'} />
            <Tile label="Programme" value={ueIds.length ? `${ueIds.length} UE` : 'Tronc commun'} sub={ueIds.length ? ueIds.slice(0, 3).map(subjName).join(', ') + (ueIds.length > 3 ? '…' : '') : 'Maquette non publiée'} />
            <Tile label="&Eacute;preuves" value={minutes.length ? `${fmtMinutes(Math.min(...minutes))}${Math.max(...minutes) !== Math.min(...minutes) ? ` à ${fmtMinutes(Math.max(...minutes))}` : ''}` : 'Durées non publiées'} sub={minutes.length ? `${exams.length} épreuve${exams.length > 1 ? 's' : ''}${ex?.threshold ? ` · note-seuil ${ex.threshold}/20` : ''}` : (ex?.threshold ? `Note-seuil ${ex.threshold}/20` : null)} />
            <Tile label="Partiels" value={ex?.dates?.s1 ? `S1 ${fmtShort(ex.dates.s1)}` : 'Dates non publiées'} sub={ex?.dates?.s2 ? `S2 ${fmtShort(ex.dates.s2)}${ex.dates.approx ? ' · à confirmer' : ''}` : (ex?.dates?.s1 && ex.dates.approx ? 'À confirmer' : null)} />
          </div>

          {/* Notation */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8" style={{ boxShadow: '0 1px 2px rgba(15,16,32,0.04), 0 24px 48px -24px rgba(79,70,229,0.18)' }}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 mb-2">Comment tes QCM sont not&eacute;s</p>
            {b ? (
              <>
                <h2 className="font-jakarta text-2xl md:text-[28px] font-black text-gray-900 tracking-tight leading-tight">{b.label}</h2>
                <p className="text-[15px] text-gray-600 mt-2 leading-relaxed">{b.desc}</p>

                {example && (
                  <div className="mt-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">Exemple sur une question &agrave; 5 propositions</p>
                    <div className="grid grid-cols-4 gap-2.5">
                      {example.map(({ k, v }) => (
                        <div key={k} className={`rounded-2xl border py-3.5 text-center ${k === 0 ? 'border-emerald-200 bg-emerald-50' : v === '0' ? 'border-gray-200 bg-slate-50' : 'border-gray-200 bg-white'}`}>
                          <span className={`font-jakarta block text-xl font-black leading-none ${k === 0 ? 'text-emerald-700' : v === '0' ? 'text-gray-400' : 'text-gray-900'}`}>{v} pt</span>
                          <span className="block text-[11px] text-gray-400 mt-1.5">{k === 0 ? 'sans erreur' : `${k} erreur${k > 1 ? 's' : ''}${k === 3 ? ' ou plus' : ''}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {strat && (
                  <div className="mt-6 rounded-2xl bg-indigo-50 border border-indigo-100 p-5">
                    <p className="text-[14px] font-bold text-indigo-950 mb-2.5">{strat.title}</p>
                    <ul className="space-y-2">
                      {strat.tips.map((t, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[14px] text-indigo-950/85 leading-snug">
                          <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg></span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="font-jakarta text-2xl md:text-[28px] font-black text-gray-900 tracking-tight leading-tight">Bar&egrave;me non publi&eacute;</h2>
                <p className="text-[15px] text-gray-600 mt-2 leading-relaxed">{m?.note || 'La faculté ne détaille pas la notation des QCM dans ses documents publics. Demande à ton tutorat ou vérifie les MCC sur ton intranet, puis renseigne ton barème dans « Mon compte » : tes examens blancs seront notés avec.'}</p>
              </>
            )}

            {m && (
              <details className="mt-6 group">
                <summary className="cursor-pointer select-none text-[13px] font-semibold text-gray-500 hover:text-gray-900 list-none flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                  Voir la source
                </summary>
                <div className="mt-3 pl-5">
                  <blockquote className="border-l-2 border-indigo-200 pl-4 text-[14px] text-gray-600 italic">« {m.quote} »</blockquote>
                  {b && m.note && <p className="text-[13px] text-gray-500 mt-3">{m.note}</p>}
                  <p className="text-[12px] text-gray-400 mt-3">Source : <a href={m.source} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold hover:underline">{m.sourceLabel}</a>. Les MCC changent chaque ann&eacute;e, v&eacute;rifie sur ton intranet.</p>
                </div>
              </details>
            )}
          </div>

          {/* Programme et épreuves */}
          {exams.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8" style={{ boxShadow: '0 1px 2px rgba(15,16,32,0.04)' }}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 mb-2">Ce que tu passes</p>
              <h2 className="font-jakarta text-2xl md:text-[28px] font-black text-gray-900 tracking-tight leading-tight">{ueIds.length} UE, {exams.length} &eacute;preuve{exams.length > 1 ? 's' : ''}</h2>
              <p className="text-[14px] text-gray-500 mt-1.5">D&rsquo;apr&egrave;s les MCC {m?.year || '2025-2026'}. Indicatif, la maquette peut bouger d&rsquo;une ann&eacute;e sur l&rsquo;autre.</p>
              <div className="mt-5 rounded-2xl border border-gray-200 overflow-hidden">
                {exams.map((e, i) => {
                  const s = subj(e.subject); const col = ACCENT[s?.color] || ACCENT.indigo;
                  const meta = [e.questions ? `${e.questions} QCM` : null, e.minutes ? fmtMinutes(e.minutes) : null, e.coeff ? `coef. ${e.coeff}` : null].filter(Boolean);
                  return (
                    <div key={i} className={`flex items-center gap-3.5 px-4 sm:px-5 py-3.5 ${i < exams.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: col }} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-bold text-gray-900 leading-tight">{e.label}</span>
                        <span className="block text-xs text-gray-400 mt-0.5">{s?.name || e.subject}{e.format && e.format !== 'qcm' ? ` · ${FORMAT_LABEL[e.format] || e.format}` : ''}</span>
                      </span>
                      <span className="text-right shrink-0 text-[13px] font-semibold text-gray-600 tabular-nums">{meta.length ? meta.join(' · ') : <span className="text-gray-300 font-medium">format non publi&eacute;</span>}</span>
                    </div>
                  );
                })}
              </div>
              {(particularites.length > 0 || ex?.threshold) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {particularites.map((p) => <span key={p} className="rounded-lg bg-slate-50 border border-gray-200 px-2.5 py-1 text-[12.5px] font-semibold text-gray-700">{p}</span>)}
                  {ex?.threshold && <span className="rounded-lg bg-rose-50 border border-rose-100 px-2.5 py-1 text-[12.5px] font-semibold text-rose-700">note-seuil {ex.threshold}/20 : &eacute;liminatoire en dessous</span>}
                </div>
              )}
            </div>
          )}

          {/* Dates */}
          {ex?.dates && (ex.dates.s1 || ex.dates.s2) && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8" style={{ boxShadow: '0 1px 2px rgba(15,16,32,0.04)' }}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 mb-2">Quand</p>
              <h2 className="font-jakarta text-2xl md:text-[28px] font-black text-gray-900 tracking-tight leading-tight">Les partiels</h2>
              <p className="text-[14px] text-gray-500 mt-1.5">{ex.dates.approx ? 'Extrapolés du calendrier 2025-2026, à confirmer sur ton intranet.' : 'Calendrier officiel.'}</p>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {ex.dates.s1 && <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4"><p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Semestre 1</p><p className="font-jakarta text-[17px] font-extrabold text-gray-900 mt-1">Semaine du {fmtDate(ex.dates.s1)}</p></div>}
                {ex.dates.s2 && <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4"><p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Semestre 2</p><p className="font-jakarta text-[17px] font-extrabold text-gray-900 mt-1">Semaine du {fmtDate(ex.dates.s2)}</p></div>}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-3xl bg-slate-900 text-white p-7 md:p-10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-2">Sur Pr&eacute;pa PASS/LAS</p>
            <h2 className="font-jakarta text-2xl md:text-3xl font-black tracking-tight leading-tight mb-5">R&eacute;vise au format de {shortName}</h2>
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              {[
                ['Examens blancs', exams.some((e) => e.minutes) ? 'Durée et nombre de QCM de ta fac, par UE.' : 'Par UE, durée au choix.'],
                ['Note sur 20', b ? `Au barème « ${b.label.toLowerCase()} », avec la stratégie qui va avec.` : 'Au barème que tu renseignes.'],
                ['Questions au bon format', particularites.length ? particularites[0].charAt(0).toUpperCase() + particularites[0].slice(1) + '.' : 'QCM illimités, 170 fiches sur 9 UE.'],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-[14px] font-bold text-white">{t}</p>
                  <p className="text-[13px] text-slate-400 mt-1 leading-snug">{d}</p>
                </div>
              ))}
            </div>
            <Link href="/inscription" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-indigo-50 transition-colors">
              Cr&eacute;er mon compte — 7 jours Premium offerts
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>

          {others.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Autres facult&eacute;s</p>
              <div className="flex flex-wrap gap-2">{others.map((o) => <Link key={o.id} href={`/facs/${o.id}`} className="rounded-full bg-white border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors">{o.name.replace(/^Université (de |d’|d')?/i, '')}</Link>)}</div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
