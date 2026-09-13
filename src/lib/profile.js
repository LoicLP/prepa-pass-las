import { facById } from '@/data/facs';

/* Profil de révision, stocké dans user.user_metadata.profile.
   Tout est optionnel : le site fonctionne sans, il s'adapte avec. */

export const VOIES = [
  { id: 'pass', label: 'PASS', desc: 'Majeure santé + mineure' },
  { id: 'las', label: 'LAS', desc: 'Licence + option santé' },
];

export const HOURS = [
  { id: 2, label: '≈ 2 h / semaine', desc: 'Entretien' },
  { id: 4, label: '≈ 4 h / semaine', desc: 'Rythme régulier' },
  { id: 7, label: '7 h et plus', desc: 'Préparation intensive' },
];

export const BAREMES = [
  { id: 'partiel', label: 'Points partiels', desc: 'Chaque proposition bien jugée rapporte une fraction de point.' },
  { id: 'negatif', label: 'Points négatifs', desc: 'Une proposition fausse retire des points ; la question ne descend pas sous zéro.' },
  { id: 'tout_ou_rien', label: 'Tout ou rien', desc: 'Le point n’est acquis que si toutes les propositions sont justes.' },
];

export const CONCOURS_DATES = [
  { id: '2026-12-14', label: 'Déc. 2026', sub: 'Écrits du S1' },
  { id: '2027-05-17', label: 'Mai 2027', sub: 'Écrits du S2' },
];

export const DEFAULT_PROFILE = { fac: null, voie: null, mineure: '', hoursPerWeek: null, bareme: 'partiel', placement: null, placementAt: null, level: null };

export function getProfile(user) {
  const p = user?.user_metadata?.profile || {};
  return { ...DEFAULT_PROFILE, ...p };
}

/** Heures hebdo effectives : profil, sinon 2 h en LAS, 4 h en PASS. */
export function effectiveHours(profile) {
  if (profile?.hoursPerWeek) return profile.hoursPerWeek;
  return profile?.voie === 'las' ? 2 : 4;
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
  return { fac, bareme: profile.bareme || 'partiel', voie: profile.voie || null };
}
