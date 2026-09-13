'use client';

import { sanitizeHtml } from '@/utils/sanitize';
import { SUBJECT_ICONS } from '@/data/constants';
import { ACCENT_HEX } from '@/components/fiches/BristolCard';

/* Cours complet sur papier bristol : même carte crème lignée que la fiche, avec un sommaire
   et des chapitres numérotés dans la marge. Partagé par le dashboard et la page publique. */

const LINE = 32;

export default function CoursBristol({ fiche, subject, cours, idPrefix = 'cours', titleTag = 'h1' }) {
  const accent = ACCENT_HEX[subject?.color] || ACCENT_HEX.primary;
  const iconPath = SUBJECT_ICONS[fiche.subject]?.path || '';
  const sections = cours?.sections || [];
  const Title = titleTag;
  return (
    <article style={{ position: 'relative', background: '#fffdf6', borderRadius: 18, border: '1px solid #ece6d3', boxShadow: '0 1px 0 #fff inset, 0 18px 40px -20px rgba(66,50,10,0.25), 0 2px 6px rgba(66,50,10,0.06)', overflow: 'hidden' }}>
      {/* bandeau */}
      <div style={{ background: accent, color: '#fff', padding: '12px 28px 12px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {iconPath && <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d={iconPath} /></svg>}
          <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subject?.name || 'Cours'} · Cours complet</span>
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.9, whiteSpace: 'nowrap' }}>{cours?.readTime || 15} min · {sections.length} section{sections.length > 1 ? 's' : ''}</span>
      </div>
      {/* perforations */}
      <div aria-hidden="true" style={{ position: 'absolute', left: 22, top: 70, bottom: 26, width: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
        {Array.from({ length: 10 }).map((_, i) => <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: '#f3f4f8', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.18)' }} />)}
      </div>
      {/* marge rouge */}
      <div aria-hidden="true" style={{ position: 'absolute', left: 52, top: 46, bottom: 0, width: 2, background: '#f2b8b8', pointerEvents: 'none' }} />
      {/* corps ligné */}
      <div className="bristol-body" style={{ position: 'relative', padding: '26px 28px 34px 74px', backgroundImage: `repeating-linear-gradient(transparent 0, transparent ${LINE - 1}px, #e6e2d3 ${LINE - 1}px, #e6e2d3 ${LINE}px)`, backgroundPosition: '0 12px' }}>
        <Title className="font-jakarta" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.15, color: '#0f1020', margin: '0 0 8px' }}>{fiche.title}</Title>
        {cours?.introduction && <p style={{ fontSize: 14.5, fontStyle: 'italic', color: '#6b6a5e', margin: '0 0 16px', lineHeight: 1.6 }}>{cours.introduction}</p>}

        {/* sommaire */}
        {sections.length > 1 && (
          <nav aria-label="Sommaire" style={{ margin: '0 0 20px', background: '#fff', border: `1px dashed ${accent}`, borderRadius: 12, padding: '10px 16px', lineHeight: '24px' }}>
            <p style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: accent, margin: '0 0 4px' }}>Sommaire</p>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', columns: sections.length > 4 ? 2 : 1, columnGap: 24 }}>
              {sections.map((sec, i) => (
                <li key={i} style={{ breakInside: 'avoid' }}>
                  <a href={`#${idPrefix}-${i}`} style={{ fontSize: 13.5, color: '#1f2030', textDecoration: 'none', display: 'flex', gap: 8 }} className="hover:underline">
                    <span style={{ color: accent, fontWeight: 800, minWidth: 18 }}>{i + 1}.</span><span>{sec.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* chapitres */}
        {sections.map((sec, i) => (
          <section key={i} id={`${idPrefix}-${i}`} data-cours-section style={{ position: 'relative', scrollMarginTop: 90, marginTop: i === 0 ? 0 : LINE }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, lineHeight: `${LINE}px`, marginBottom: 4 }}>
              <span aria-hidden="true" style={{ position: 'absolute', left: -46, top: 3, width: 26, height: 26, borderRadius: '50%', background: accent, color: '#fff', fontSize: 12, fontWeight: 800, display: 'grid', placeItems: 'center' }}>{i + 1}</span>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f1020', margin: 0, lineHeight: `${LINE}px`, letterSpacing: -0.3 }}>{sec.title}</h2>
            </div>
            <div className="fiche-bristol-content" style={{ fontSize: 15, lineHeight: `${LINE}px`, color: '#1f2030' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(sec.content) }} />
          </section>
        ))}

        <style>{`
          .fiche-bristol-content h3 { font-size: 20px; font-weight: 800; color: #0f1020; margin: 24px 0 8px; line-height: ${LINE}px; }
          .fiche-bristol-content h4 { font-size: 16px; font-weight: 700; color: ${accent}; margin: 16px 0 0; line-height: ${LINE}px; text-transform: none; }
          .fiche-bristol-content p { margin: 0 0 8px; line-height: ${LINE}px; }
          .fiche-bristol-content ul { margin: 0 0 8px; padding-left: 20px; list-style: disc outside; }
          .fiche-bristol-content li { line-height: ${LINE}px; margin: 0; display: list-item; }
          .fiche-bristol-content strong { color: #0f1020; }
          .fiche-bristol-content sub, .fiche-bristol-content sup { line-height: 0; }
          .fiche-bristol-content div[class*="rounded-xl"] { background: #fff; border: 1px dashed ${accent}; border-radius: 12px; padding: 12px 16px; margin: 16px 0 8px; line-height: 24px; }
          .fiche-bristol-content div[class*="rounded-xl"] p { line-height: 24px; margin: 0; font-size: 14px; }
          .fiche-bristol-content figure { background: #fff; border: 1px solid #e6e2d3; border-radius: 12px; padding: 14px 16px; margin: 16px 0 12px; line-height: 20px; }
          .fiche-bristol-content figure figcaption { font-size: 10.5px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: ${accent}; margin-bottom: 10px; }
          .fiche-bristol-content figure p { font-size: 12.5px; line-height: 19px; color: #5f6280; margin: 10px 0 0; }
          .fiche-bristol-content .overflow-x-auto { background: #fff; border-radius: 12px; margin: 12px 0; }
          .fiche-bristol-content table { width: 100%; border-collapse: collapse; font-size: 13.5px; line-height: 20px; background: #fff; border: 1px solid #e6e2d3; border-radius: 12px; overflow: hidden; }
          .fiche-bristol-content th { text-align: left; padding: 8px 10px; font-weight: 700; color: #0f1020; background: #f7f5ec; border-bottom: 1px solid #e6e2d3; }
          .fiche-bristol-content td { padding: 8px 10px; vertical-align: top; border-top: 1px solid #efece2; color: #1f2030; }
          @media (max-width: 640px) { .bristol-body { padding-left: 62px !important; padding-right: 16px !important; } }
        `}</style>
      </div>
    </article>
  );
}
