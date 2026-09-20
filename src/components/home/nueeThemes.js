import { SUBJECTS } from '@/data/subjects';
import { SUBJECT_ICONS } from '@/data/constants';

/* Thèmes de la nuée du hero : une UE = une tuile (fond, encre, formes) et une couleur de titre.
   Module sans 'use client' pour être importable côté serveur (tuile initiale) et côté client. */
const HEX = { indigo: '#4f46e5', emerald: '#059669', violet: '#7c3aed', cyan: '#0891b2', amber: '#d97706', rose: '#e11d48', sky: '#0284c7', teal: '#0d9488', fuchsia: '#c026d3' };
const LIGHT = { indigo: ['#e0e7ff', '#c7d2fe'], emerald: ['#d1fae5', '#a7f3d0'], violet: ['#ddd6fe', '#c4b5fd'], cyan: ['#cffafe', '#a5f3fc'], amber: ['#fef3c7', '#fde68a'], rose: ['#ffe4e6', '#fecdd3'], sky: ['#e0f2fe', '#bae6fd'], teal: ['#ccfbf1', '#99f6e4'], fuchsia: ['#f5d0fe', '#f0abfc'] };
const DARK = { indigo: ['#4f46e5', '#3730a3'], emerald: ['#059669', '#065f46'], violet: ['#7c3aed', '#5b21b6'], cyan: ['#0891b2', '#155e75'], amber: ['#d97706', '#b45309'], rose: ['#e11d48', '#9f1239'], sky: ['#0284c7', '#075985'], teal: ['#0d9488', '#115e59'], fuchsia: ['#c026d3', '#86198f'] };

/* Thèmes : une UE = une tuile (fond, encre, formes) et une couleur pour les lettres du titre. */
export const NUEE_THEMES = SUBJECTS.map((s, i) => {
  const solid = i % 2 === 0;
  return { id: s.id, fond: solid ? DARK[s.color] : LIGHT[s.color], encre: solid ? '#ffffff' : HEX[s.color], formes: [SUBJECT_ICONS[s.id]?.path || ''], lettre: HEX[s.color] || HEX.indigo };
});

