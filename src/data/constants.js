/**
 * Shared subject colors and icons for the Next.js app.
 * Unified from qcm.js, examen.js, annales.js, cours.js, and dashboard.js.
 */

/* ========== COLOR MAPPING BY COLOR NAME ========== */
/* Maps color names (from SUBJECTS[].color) to Tailwind utility classes.
 * This is the superset of all color properties used across qcm, examen,
 * annales, cours and dashboard views. */
export const SUBJECT_COLORS = {
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    badge: 'bg-indigo-100 text-indigo-700',
    bar: 'bg-indigo-500',
    icon: 'text-indigo-500',
    ring: 'ring-indigo-200',
    accent: '#4f46e5',
    barHex: '#6366f1',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    bar: 'bg-emerald-500',
    icon: 'text-emerald-500',
    ring: 'ring-emerald-200',
    accent: '#059669',
    barHex: '#10b981',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-700',
    bar: 'bg-violet-500',
    icon: 'text-violet-500',
    ring: 'ring-violet-200',
    accent: '#7c3aed',
    barHex: '#8b5cf6',
    gradient: 'from-violet-500 to-violet-600',
  },
  cyan: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    badge: 'bg-cyan-100 text-cyan-700',
    bar: 'bg-cyan-500',
    icon: 'text-cyan-500',
    ring: 'ring-cyan-200',
    accent: '#0891b2',
    barHex: '#06b6d4',
    gradient: 'from-cyan-500 to-cyan-600',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    bar: 'bg-amber-500',
    icon: 'text-amber-500',
    ring: 'ring-amber-200',
    accent: '#d97706',
    barHex: '#f59e0b',
    gradient: 'from-amber-500 to-amber-600',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    bar: 'bg-rose-500',
    icon: 'text-rose-500',
    ring: 'ring-rose-200',
    accent: '#e11d48',
    barHex: '#f43f5e',
    gradient: 'from-rose-500 to-rose-600',
  },
  primary: {
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    text: 'text-primary-700',
    badge: 'bg-primary-100 text-primary-700',
    bar: 'bg-primary-500',
    icon: 'text-primary-500',
    ring: 'ring-primary-200',
    accent: '#4f46e5',
    barHex: '#6366f1',
    gradient: 'from-primary-500 to-primary-600',
  },
};

/**
 * Get the color set for a subject by its color name, falling back to primary.
 * @param {string} colorName - The color name from SUBJECTS (e.g. 'indigo', 'emerald').
 * @returns {object} The color class set.
 */
export function getSubjectColors(colorName) {
  return SUBJECT_COLORS[colorName] || SUBJECT_COLORS.primary;
}

/* ========== SUBJECT ICONS (SVG path data) ========== */
export const SUBJECT_ICONS = {
  anatomie: {
    path: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z',
  },
  chimie: {
    path: 'M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5',
  },
  biocell: {
    path: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z',
  },
  biostats: {
    path: 'M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605',
  },
  biophysique: {
    path: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
  },
  ssh: {
    path: 'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
  },
};

/**
 * Get the readable name for a subject ID.
 * @param {string} subjectId
 * @returns {string}
 */
export function getSubjectName(subjectId) {
  const names = {
    anatomie: 'Anatomie',
    chimie: 'Chimie / Biochimie',
    biocell: 'Biologie cellulaire',
    biostats: 'Biostatistiques',
    biophysique: 'Biophysique',
    ssh: 'SSH / Éthique',
  };
  return names[subjectId] || subjectId;
}
