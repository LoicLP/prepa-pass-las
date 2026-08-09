'use client';

import DOMPurify from 'dompurify';

export function sanitizeHtml(dirty) {
  if (typeof window === 'undefined') return dirty;
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'code', 'pre', 'span', 'div', 'sub', 'sup',
      'figure', 'figcaption',
      // Schémas pédagogiques en SVG inline (cours)
      'svg', 'g', 'defs', 'title', 'desc', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon',
      'text', 'tspan', 'marker', 'linearGradient', 'radialGradient', 'stop', 'clipPath', 'use', 'symbol',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel',
      // Attributs SVG (aucun gestionnaire d'événement : DOMPurify bloque on* par défaut)
      'viewBox', 'xmlns', 'width', 'height', 'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width',
      'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-opacity', 'opacity', 'transform',
      'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'dx', 'dy',
      'text-anchor', 'dominant-baseline', 'font-size', 'font-weight', 'font-family', 'letter-spacing',
      'offset', 'stop-color', 'stop-opacity', 'gradientUnits', 'gradientTransform',
      'marker-end', 'marker-start', 'orient', 'refX', 'refY', 'markerWidth', 'markerHeight', 'markerUnits',
      'id', 'clip-path', 'preserveAspectRatio', 'aria-label', 'role',
    ],
    ALLOW_DATA_ATTR: false,
  });
}
