'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

/* Liste des facultés par région, avec recherche instantanée. Données pré-calculées côté serveur. */
const CONF_STYLE = {
  officiel: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  secondaire: 'bg-amber-50 text-amber-700 border-amber-100',
  temoignage: 'bg-amber-50 text-amber-700 border-amber-100',
  none: 'bg-gray-100 text-gray-500 border-gray-200',
};
const norm = (s) => (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const initials = (name) => name.split(/[\s·-]+/).filter((w) => w && w[0] === w[0].toUpperCase()).slice(0, 2).map((w) => w[0]).join('') || name.slice(0, 2).toUpperCase();

function Fact({ label, value, muted }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="w-[74px] shrink-0 text-[10.5px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <span className={`text-[13.5px] leading-snug ${muted ? 'text-gray-400' : 'text-gray-700'}`}>{value}</span>
    </div>
  );
}

export default function FacsList({ facs, regions }) {
  const [q, setQ] = useState('');
  const [onlyKnown, setOnlyKnown] = useState(false);
  const nq = norm(q.trim());
  const groups = useMemo(() => regions.map((r) => ({
    ...r,
    items: facs.filter((f) => f.region === r.id && (!onlyKnown || f.bareme) && (!nq || norm(f.name).includes(nq) || norm(f.city).includes(nq) || norm(f.short).includes(nq))),
  })).filter((g) => g.items.length > 0), [facs, regions, nq, onlyKnown]);
  const total = groups.reduce((a, g) => a + g.items.length, 0);

  return (
    <>
      {/* Recherche + filtre */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white pl-4 pr-3 py-2 flex-1 shadow-[0_1px_2px_rgba(15,16,32,0.04)] focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.12)] transition-all">
          <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ta fac ou ta ville… ex. « Lyon », « Sorbonne »" className="flex-1 min-w-0 text-[15px] text-gray-800 placeholder-gray-400 outline-none bg-transparent py-1.5" />
          {q && <button onClick={() => setQ('')} className="text-xs font-semibold text-gray-400 hover:text-gray-700">Effacer</button>}
        </div>
        <button onClick={() => setOnlyKnown((v) => !v)} className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-[13px] font-semibold transition-colors ${onlyKnown ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
          <span className={`w-4 h-4 rounded border flex items-center justify-center ${onlyKnown ? 'bg-white/20 border-white/40' : 'border-gray-300'}`}>{onlyKnown && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}</span>
          Bar&egrave;me connu
        </button>
      </div>

      {/* Accès rapide par région */}
      {!nq && (
        <div className="mt-4 flex flex-wrap gap-2">
          {groups.map((g) => (
            <a key={g.id} href={`#region-${g.id}`} className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-3 py-1.5 text-[12.5px] font-semibold text-gray-700 hover:border-gray-300 transition-colors">
              <span className="w-2 h-2 rounded-full" style={{ background: g.color }} />{g.name}<span className="text-gray-400 font-medium">{g.items.length}</span>
            </a>
          ))}
        </div>
      )}

      {total === 0 ? (
        <p className="text-center text-gray-500 py-16">Aucune facult&eacute; ne correspond. Essaie le nom de la ville.</p>
      ) : (
        <div className="mt-10 space-y-12">
          {groups.map((g) => (
            <section key={g.id} id={`region-${g.id}`} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} />
                <h2 className="font-jakarta text-[20px] font-extrabold text-gray-900 tracking-tight">{g.name}</h2>
                <span className="text-sm text-gray-400">{g.items.length} facult&eacute;{g.items.length > 1 ? 's' : ''}</span>
                <span className="flex-1 h-px bg-gray-200 ml-2" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {g.items.map((f) => (
                  <Link key={f.id} href={`/facs/${f.id}`} className="group flex flex-col bg-white rounded-2xl border border-gray-200 p-5 hover:border-indigo-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-16px_rgba(79,70,229,0.35)] transition-all">
                    <div className="flex items-start gap-3">
                      <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-jakarta text-[13px] font-extrabold text-white" style={{ background: g.color, boxShadow: `0 4px 10px ${g.color}44` }}>{initials(f.short)}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-jakarta text-[16px] font-extrabold text-gray-900 leading-tight group-hover:text-indigo-700 transition-colors">{f.short}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{f.city ? `${f.city} · ` : ''}{f.voie}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 flex-1">
                      <Fact label="Notation" value={f.bareme ? <strong className="font-bold text-gray-900">{f.bareme}</strong> : 'non publiée'} muted={!f.bareme} />
                      <Fact label="&Eacute;preuves" value={f.epreuves || 'durées non publiées'} muted={!f.epreuves} />
                      <Fact label="Programme" value={f.ue ? `${f.ue} UE${f.partiels ? ` · partiels ${f.partiels}` : ''}` : 'maquette non publiée'} muted={!f.ue} />
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${CONF_STYLE[f.conf || 'none']}`}>{f.confLabel}</span>
                      <span className="text-[12.5px] font-bold text-indigo-600 flex items-center gap-1">Voir la fiche <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
