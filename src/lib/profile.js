import { facById, mccFor } from '@/data/facs';
import { facExams } from '@/data/facExams';

/* Profil de révision, stocké dans user.user_metadata.profile.
   Tout est optionnel : le site fonctionne sans, il s'adapte avec. */

export const VOIES = [
  { id: 'pass', label: 'PASS', desc: 'Majeure santé + mineure' },
  { id: 'las', label: 'LAS', desc: 'Licence + option santé' },
];

export const BAREMES = [
  { id: 'partiel', label: 'Points partiels', desc: 'Chaque proposition bien jugée rapporte une fraction de point.' },
  { id: 'differences', label: 'Dégressif 1 · 0,7 · 0,1 · 0', desc: '1 pt sans erreur, 0,7 avec une, 0,1 avec deux, 0 au-delà. Jamais négatif.' },
  { id: 'degressif', label: 'Dégressif 1 · 0,5 · 0,2 · 0', desc: '1 pt sans erreur, 0,5 avec une, 0,2 avec deux, 0 au-delà. Jamais négatif.' },
  { id: 'degressif75', label: 'Dégressif 1 · 0,75 · 0,5 · 0', desc: '1 pt sans erreur, 0,75 avec une, 0,5 avec deux, 0 au-delà. Jamais négatif.' },
  { id: 'degressif50', label: 'Dégressif 1 · 0,5 · 0', desc: '1 pt sans erreur, 0,5 avec une, 0 dès deux erreurs. Jamais négatif.' },
  { id: 'degressif80', label: 'Dégressif 1 · 0,8 · 0,25 · 0', desc: '1 pt sans erreur, 0,8 avec une, 0,25 avec deux, 0 au-delà. Jamais négatif.' },
  { id: 'item_02_01', label: '+0,2 / −0,1 par item', desc: 'Chaque proposition juste rapporte 0,2, chaque fausse retire 0,1 ; la question ne descend pas sous zéro.' },
  { id: 'negatif', label: 'Points négatifs', desc: 'Une proposition fausse retire des points ; la question ne descend pas sous zéro.' },
  { id: 'tout_ou_rien', label: 'Tout ou rien', desc: 'Le point n’est acquis que si toutes les propositions sont justes.' },
];
export const baremeById = (id) => BAREMES.find((b) => b.id === id) || BAREMES[0];

export const CONCOURS_DATES = [
  { id: '2026-12-14', label: 'Déc. 2026', sub: 'Écrits du S1' },
  { id: '2027-05-17', label: 'Mai 2027', sub: 'Écrits du S2' },
];

export const DEFAULT_PROFILE = { fac: null, voie: null, mineure: '', bareme: 'partiel', placement: null, placementAt: null, level: null };

export function getProfile(user) {
  const p = user?.user_metadata?.profile || {};
  return { ...DEFAULT_PROFILE, ...p };
}

/** Barème indicatif de la fac du profil (d'après ses MCC), ou null. */
export function facMcc(profile) {
  return mccFor(profile?.fac);
}

export function facName(profile) {
  const f = facById(profile?.fac);
  return f ? f.name : null;
}

/** Moment du parcours par rapport à la date de concours. */
export function momentFor(examDate, now = new Date()) {
  if (!examDate) return null;
  const days = Math.round((new Date(examDate) - now) / 86400000);
  if (days >= 0 && days <= 10) return { id: 'veille', days };
  if (days < 0 && days >= -21) return { id: 'rebond', days };
  return null;
}

/** Style transmis au générateur de questions. */
export function styleFor(profile) {
  if (!profile) return null;
  const fac = facName(profile);
  if (!fac && !profile.bareme) return null;
  const formats = facExams(profile.fac)?.formats || null;
  return { fac, bareme: profile.bareme || 'partiel', voie: profile.voie || null, formats };
}
