'use client';

import { sanitizeHtml } from '@/utils/sanitize';
import { SUBJECT_ICONS } from '@/data/constants';

/* Carte « fiche bristol » partagée par le dashboard et la page publique : carte crème lignée
   (interligne 32 px), marge rouge, perforations, bandeau à la couleur de l'UE. Le même dessin
   est repris par l'export PDF (src/utils/fichePdf.js). */

export const ACCENT_HEX = {
  indigo: '#4f46e5', primary: '#4f46e5', emerald: '#059669', violet: '#7c3aed', cyan: '#0891b2',
  amber: '#d97706', rose: '#e11d48', sky: '#0284c7', teal: '#0d9488', fuchsia: '#c026d3',
};

export function readingMinutes(html) {
  const words = (html || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const LINE = 32;

export default function BristolCard({ fiche, subject, isRead = false, titleTag = 'h1' }) {
  const accent = ACCENT_HEX[subject?.color] || ACCENT_HEX.primary;
  const iconPath = SUBJECT_ICONS[fiche.subject]?.path || '';
  const mins = readingMinutes(fiche.content);
  const Title = titleTag;
  return (
    <article style={{ position: 'relative', background: '#fffdf6', borderRadius: 18, border: '1px solid #ece6d3', boxShadow: '0 1px 0 #fff inset, 0 18px 40px -20px rgba(66,50,10,0.25), 0 2px 6px rgba(66,50,10,0.06)', overflow: 'hidden' }}>
      {/* bandeau de l'UE */}
      <div style={{ background: accent, color: '#fff', padding: '12px 28px 12px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {iconPath && <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d={iconPath} /></svg>}
          <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subject?.name || 'Fiche'}</span>
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.9, whiteSpace: 'nowrap' }}>{mins} min de lecture{isRead ? ' · lue' : ''}</span>
      </div>
      {/* perforations */}
      <div aria-hidden="true" style={{ position: 'absolute', left: 22, top: 70, bottom: 26, width: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
        {[0, 1, 2, 3, 4, 5].map((i) => <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: '#f3f4f8', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.18)' }} />)}
      </div>
      {/* marge rouge */}
      <div aria-hidden="true" style={{ position: 'absolute', left: 52, top: 46, bottom: 0, width: 2, background: '#f2b8b8', pointerEvents: 'none' }} />
      {/* lignes */}
      <div className="bristol-body" style={{ position: 'relative', padding: '26px 28px 30px 74px', backgroundImage: `repeating-linear-gradient(transparent 0, transparent ${LINE - 1}px, #e6e2d3 ${LINE - 1}px, #e6e2d3 ${LINE}px)`, backgroundPosition: '0 12px' }}>
        <Title className="font-jakarta" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.15, color: '#0f1020', margin: '0 0 8px' }}>{fiche.title}</Title>
        {fiche.summary && <p style={{ fontSize: 14.5, fontStyle: 'italic', color: '#6b6a5e', margin: '0 0 20px', lineHeight: 1.6 }}>{fiche.summary}</p>}
        <div className="fiche-bristol-content" style={{ fontSize: 15, lineHeight: `${LINE}px`, color: '#1f2030' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(fiche.content) }} />
        <style>{`
          .fiche-bristol-content h3 { font-size: 20px; font-weight: 800; color: #0f1020; margin: 24px 0 8px; line-height: ${LINE}px; }
          .fiche-bristol-content h4 { font-size: 16px; font-weight: 700; color: ${accent}; margin: 16px 0 0; line-height: ${LINE}px; text-transform: none; }
          .fiche-bristol-content p { margin: 0 0 8px; line-height: ${LINE}px; }
          .fiche-bristol-content ul { margin: 0 0 8px; padding-left: 20px; list-style: disc outside; }
          .fiche-bristol-content li { line-height: ${LINE}px; margin: 0; display: list-item; }
          .fiche-bristol-content strong { color: #0f1020; }
          .fiche-bristol-content div[class*="rounded-xl"] { background: #fff; border: 1px dashed ${accent}; border-radius: 12px; padding: 12px 16px; margin: 16px 0 8px; line-height: 24px; }
          .fiche-bristol-content div[class*="rounded-xl"] p { line-height: 24px; margin: 0; font-size: 14px; }
          @media (max-width: 640px) { .bristol-body { padding-left: 62px !important; padding-right: 18px !important; } }
        `}</style>
      </div>
    </article>
  );
}
