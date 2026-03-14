/**
 * Formatting and display helpers extracted from dashboard.js.
 */

/**
 * Format a duration in seconds to a human-readable string.
 * @param {number} seconds
 * @returns {string} e.g. "5min 30s", "45s", or a dash for invalid input.
 */
export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '\u2014';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}min ${s}s` : `${m}min`;
}

/**
 * Format an ISO date string to a French short date.
 * @param {string} isoString
 * @returns {string} e.g. "15 fev. 2026" or a dash for invalid input.
 */
export function formatDate(isoString) {
  if (!isoString) return '\u2014';
  const d = new Date(isoString);
  const months = ['jan.', 'f\u00e9v.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'ao\u00fbt', 'sept.', 'oct.', 'nov.', 'd\u00e9c.'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Return a Tailwind text color class based on a percentage score.
 * @param {number} percentage 0-100
 * @returns {string} Tailwind class name.
 */
export function scoreClass(percentage) {
  if (percentage >= 70) return 'text-emerald-600';
  if (percentage >= 50) return 'text-amber-600';
  return 'text-red-500';
}

/**
 * Return a Tailwind background color class for a score progress bar.
 * @param {number} percentage 0-100
 * @returns {string} Tailwind class name.
 */
export function scoreBarClass(percentage) {
  if (percentage >= 70) return 'bg-emerald-500';
  if (percentage >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}
