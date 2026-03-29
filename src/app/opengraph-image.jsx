import { ImageResponse } from 'next/og';

export const alt = 'Prépa PASS/LAS - Réussissez votre première année de médecine';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', width: '500px', height: '500px',
          borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)',
          top: '-150px', right: '-150px',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', width: '350px', height: '350px',
          borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)',
          bottom: '-100px', left: '-80px',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', width: '200px', height: '200px',
          borderRadius: '50%', background: 'rgba(99,102,241,0.3)',
          top: '80px', left: '80px',
          filter: 'blur(60px)',
          display: 'flex',
        }} />

        {/* Icon */}
        <div style={{
          width: '100px', height: '100px',
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
        </div>

        {/* Title */}
        <div style={{
          fontSize: '64px',
          fontWeight: '900',
          color: 'white',
          letterSpacing: '-1px',
          display: 'flex',
          gap: '0px',
        }}>
          Prépa{' '}
          <span style={{ color: '#a5b4fc', marginLeft: '16px' }}>PASS/LAS</span>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '26px',
          color: 'rgba(199,210,254,0.85)',
          marginTop: '20px',
          textAlign: 'center',
          maxWidth: '700px',
          lineHeight: '1.4',
          display: 'flex',
        }}>
          Réussissez votre première année de médecine
        </div>

        {/* Pills */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '40px',
        }}>
          {['QCM illimités', 'Fiches de cours', 'Mode Examen'].map((label) => (
            <div key={label} style={{
              padding: '10px 22px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '100px',
              color: 'white',
              fontSize: '18px',
              display: 'flex',
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{
          position: 'absolute',
          bottom: '36px',
          color: 'rgba(165,180,252,0.6)',
          fontSize: '18px',
          display: 'flex',
        }}>
          prepa-pass-las.fr
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
