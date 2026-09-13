'use client';

/* Aperçu décoratif pour la page Fiches & Cours : deux fiches bristol superposées, la première
   annotée au surligneur (jaune, rose, vert) comme une vraie fiche d'étudiant. Purement visuel. */

const LINE = 26;
const HL = {
  yellow: 'linear-gradient(104deg, rgba(255,240,66,0) 0.9%, rgba(255,240,66,0.85) 2.4%, rgba(255,240,66,0.55) 5.8%, rgba(255,240,66,0.15) 93%, rgba(255,240,66,0.7) 96%, rgba(255,240,66,0) 98%)',
  pink: 'linear-gradient(104deg, rgba(255,120,190,0) 0.9%, rgba(255,120,190,0.7) 2.4%, rgba(255,120,190,0.45) 5.8%, rgba(255,120,190,0.12) 93%, rgba(255,120,190,0.6) 96%, rgba(255,120,190,0) 98%)',
  green: 'linear-gradient(104deg, rgba(110,240,140,0) 0.9%, rgba(110,240,140,0.8) 2.4%, rgba(110,240,140,0.5) 5.8%, rgba(110,240,140,0.14) 93%, rgba(110,240,140,0.65) 96%, rgba(110,240,140,0) 98%)',
};
const Mark = ({ c = 'yellow', children }) => (
  <mark style={{ background: HL[c], backgroundSize: '100% 78%', backgroundRepeat: 'no-repeat', backgroundPosition: '0 60%', color: 'inherit', padding: '0 3px', margin: '0 -3px', borderRadius: 3, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>{children}</mark>
);

function Card({ accent, subject, title, rotate, z, children, style }) {
  return (
    <div style={{ position: 'absolute', width: 340, background: '#fffdf6', borderRadius: 16, border: '1px solid #ece6d3', boxShadow: '0 24px 50px -22px rgba(66,50,10,0.45), 0 2px 6px rgba(66,50,10,0.08)', overflow: 'hidden', transform: `rotate(${rotate}deg)`, zIndex: z, ...style }}>
      <div style={{ background: accent, color: '#fff', padding: '8px 16px 8px 44px', fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
        <span>{subject}</span><span style={{ opacity: 0.85 }}>3 min</span>
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', left: 14, top: 46, bottom: 16, width: 9, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {[0, 1, 2, 3].map((i) => <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: '#f3f4f8', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.18)' }} />)}
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', left: 36, top: 34, bottom: 0, width: 2, background: '#f2b8b8' }} />
      <div style={{ padding: '14px 18px 18px 50px', backgroundImage: `repeating-linear-gradient(transparent 0, transparent ${LINE - 1}px, #e6e2d3 ${LINE - 1}px, #e6e2d3 ${LINE}px)`, backgroundPosition: '0 10px', fontSize: 12, lineHeight: `${LINE}px`, color: '#1f2030' }}>
        <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3, color: '#0f1020', lineHeight: `${LINE}px` }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

export default function BristolHero() {
  return (
    <div className="relative hidden lg:block" style={{ height: 360 }} aria-hidden="true">
      <Card accent="#0891b2" subject="Biostatistiques" title="Sensibilité et spécificité" rotate={5} z={1} style={{ right: 10, top: 34, opacity: 0.9 }}>
        <div>Se = VP / (VP + FN) · Sp = VN / (VN + FP)</div>
        <div>VPP dépend de la prévalence ; Se et Sp non.</div>
        <div style={{ color: '#6b6a5e' }}>Courbe ROC : Se en fonction de 1 − Sp.</div>
      </Card>
      <Card accent="#4f46e5" subject="Anatomie" title="Ostéologie et arthrologie" rotate={-4} z={2} style={{ left: 0, top: 70 }}>
        <div><Mark>206 os</Mark> chez l’adulte : axial (80) et appendiculaire (126).</div>
        <div>Os longs, courts, plats, irréguliers.</div>
        <div>Le <Mark c="pink">cartilage de conjugaison</Mark> assure la croissance en longueur.</div>
        <div>Ossification <Mark c="green">endochondrale</Mark> (os longs) ou membraneuse (crâne).</div>
        <div style={{ marginTop: 6, background: '#fff', border: '1px dashed #4f46e5', borderRadius: 8, padding: '4px 10px', fontSize: 10.5, lineHeight: '16px', color: '#3730a3', fontWeight: 600 }}>Point clé : sa fermeture marque la fin de la croissance.</div>
      </Card>
      <div style={{ position: 'absolute', left: 300, top: 16, transform: 'rotate(12deg)', zIndex: 3, width: 14, height: 92, borderRadius: 4, background: 'linear-gradient(#ffe94a 0 70%, #d9c400 70%)', boxShadow: '0 6px 14px rgba(0,0,0,0.18)' }}>
        <div style={{ position: 'absolute', bottom: -10, left: 2, width: 10, height: 12, background: '#ffe94a', clipPath: 'polygon(0 0, 100% 0, 60% 100%, 40% 100%)' }} />
      </div>
    </div>
  );
}
