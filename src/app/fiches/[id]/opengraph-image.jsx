import { ImageResponse } from 'next/og';
import { FICHES_DATA } from '@/data/fiches';
import { SUBJECTS } from '@/data/subjects';

/* Image de partage par fiche, dans le style bristol : bandeau à la couleur de l'UE, titre, résumé. */
export const alt = 'Fiche de révision PASS/LAS';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const ACCENT = { indigo: '#4f46e5', emerald: '#059669', violet: '#7c3aed', cyan: '#0891b2', amber: '#d97706', rose: '#e11d48', sky: '#0284c7', teal: '#0d9488', fuchsia: '#c026d3' };

export default async function Image({ params }) {
  const { id } = await params;
  const fiche = FICHES_DATA.find((f) => f.id === id);
  const subject = SUBJECTS.find((s) => s.id === fiche?.subject);
  const accent = ACCENT[subject?.color] || '#4f46e5';
  const title = fiche?.title || 'Fiche de révision';
  const summary = fiche?.summary || '';
  const lines = Array.from({ length: 9 });
  return new ImageResponse(
    (
      <div style={{ width: '1200px', height: '630px', background: '#eef0f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ width: '1080px', height: '540px', background: '#fffdf6', borderRadius: '28px', border: '2px solid #ece6d3', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', boxShadow: '0 30px 60px rgba(66,50,10,0.18)' }}>
          <div style={{ background: accent, color: '#fff', padding: '22px 44px 22px 100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '22px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
            <span>{subject?.name || 'Fiche'}</span>
            <span style={{ opacity: 0.9, fontSize: '20px', letterSpacing: '0px', textTransform: 'none', fontWeight: 700 }}>Fiche de révision · Prépa PASS/LAS</span>
          </div>
          {/* perforations */}
          <div style={{ position: 'absolute', left: 34, top: 110, bottom: 40, width: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: '#e9eaf1', border: '2px solid #d9dbe6', display: 'flex' }} />)}
          </div>
          {/* marge rouge */}
          <div style={{ position: 'absolute', left: 86, top: 78, bottom: 0, width: 3, background: '#f2b8b8', display: 'flex' }} />
          {/* lignes */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 128, display: 'flex', flexDirection: 'column' }}>
            {lines.map((_, i) => <div key={i} style={{ height: 1, background: '#e6e2d3', marginBottom: 47, display: 'flex' }} />)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '44px 56px 40px 120px', flex: 1 }}>
            <div style={{ fontSize: title.length > 48 ? '44px' : '54px', fontWeight: 800, color: '#0f1020', lineHeight: 1.12, letterSpacing: '-1px', display: 'flex' }}>{title}</div>
            {summary && <div style={{ marginTop: '22px', fontSize: '26px', color: '#6b6a5e', fontStyle: 'italic', lineHeight: 1.4, display: 'flex' }}>{summary.length > 150 ? summary.slice(0, 147) + '…' : summary}</div>}
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '14px', fontSize: '22px', color: accent, fontWeight: 800 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: accent, display: 'flex' }} />
              prepa-pass-las.fr
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
