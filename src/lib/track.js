/* Événements produit envoyés à l'Analytics Hub (tracker chargé dans layout.js).
   Silencieux si le tracker n'est pas là : ne doit jamais casser l'interface. */
export function track(name, props) {
  try { if (typeof window !== 'undefined' && window.ahub?.track) window.ahub.track(name, props || {}); } catch {}
}
