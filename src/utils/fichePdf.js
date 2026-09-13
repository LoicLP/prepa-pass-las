/**
 * Export PDF des fiches de révision.
 *
 * La capture utilise `html2canvas-pro` : la version d'origine ne sait pas lire
 * les couleurs `oklch()`/`lab()` que Tailwind v4 pose sur `*` et échoue sur
 * « unsupported color function ». C'est ce qui obligeait l'ancienne version à
 * remplacer `document.body` puis à recharger la page.
 *
 * La fiche est rendue hors écran dans un conteneur dédié, entièrement en styles
 * inline : la page en cours n'est jamais modifiée. Depuis le dashboard,
 * l'utilisateur garde sa session, ses filtres et sa position de défilement.
 */

const PDF_COLORS = {
  indigo:  { accent: '#4f46e5', accentDark: '#3730a3' },
  primary: { accent: '#4f46e5', accentDark: '#3730a3' },
  emerald: { accent: '#059669', accentDark: '#065f46' },
  violet:  { accent: '#7c3aed', accentDark: '#5b21b6' },
  cyan:    { accent: '#0891b2', accentDark: '#155e75' },
  amber:   { accent: '#d97706', accentDark: '#92400e' },
  rose:    { accent: '#e11d48', accentDark: '#9f1239' },
  sky:     { accent: '#0284c7', accentDark: '#075985' },
  teal:    { accent: '#0d9488', accentDark: '#115e59' },
  fuchsia: { accent: '#c026d3', accentDark: '#86198f' },
};

// Format A4 (mm)
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 12;
const MARGIN_Y = 8;

/* Design « fiche bristol », identique à la page du dashboard : carte crème lignée (interligne 32 px),
   marge rouge, perforations, bandeau à la couleur de l'UE. Tout est en styles inline. */
const LINE = 32; // interligne des lignes de la fiche
const CREAM = '#fffdf6';
const RULE = '#ddd8c8';
// Lignes horizontales : une image SVG répétée (html2canvas la rend fidèlement, contrairement aux dégradés répétés)
const RULES_BG = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='4' height='${LINE}'><rect x='0' y='${LINE - 1}' width='4' height='1' fill='${RULE}'/></svg>`)}")`;

/** Remplace les classes Tailwind du contenu par des styles inline alignés sur les lignes. */
function inlineContentStyles(content, c) {
  return (content || '')
    .replace(/class="[^"]*text-xl font-bold[^"]*"/g,
      `style="font-size:20px;font-weight:800;color:#0f1020;margin:${LINE * 0.75}px 0 8px 0;line-height:${LINE}px;letter-spacing:-0.2px;"`)
    .replace(/class="[^"]*text-lg font-semibold[^"]*"/g,
      `style="font-size:16px;font-weight:700;color:${c.accent};margin:16px 0 0 0;line-height:${LINE}px;"`)
    // `list-style` et `display:list-item` sont réaffirmés : le reset Tailwind supprime les puces.
    .replace(/class="[^"]*list-disc[^"]*"/g,
      'style="list-style:disc outside;padding-left:20px;margin:0 0 8px 0;"')
    .replace(/class="[^"]*mb-3[^"]*"/g, `style="margin:0 0 8px 0;line-height:${LINE}px;"`)
    .replace(/class="[^"]*mb-4[^"]*"/g, `style="margin:0 0 8px 0;line-height:${LINE}px;"`)
    .replace(/<li>/g, `<li style="display:list-item;margin:0;line-height:${LINE}px;font-size:15px;">`)
    .replace(/class="[^"]*bg-[a-z]+-50 border border-[a-z]+-200 rounded-xl p-4[^"]*"/g,
      `style="background:#fff;border:1px dashed ${c.accent};border-radius:12px;padding:12px 16px;margin:16px 0 8px 0;line-height:24px;"`)
    .replace(/class="[^"]*text-sm font-semibold text-[a-z]+-800[^"]*"/g,
      `style="font-size:14px;font-weight:600;color:${c.accentDark};margin:0;line-height:24px;"`)
    .replace(/<strong>/g, '<strong style="color:#0f1020;">')
    // Les attributs class résiduels sont retirés : le rendu ne dépend que des styles inline.
    .replace(/\sclass="[^"]*"/g, '');
}

/** Temps de lecture approximatif (200 mots/min). */
function readingMinutes(html) {
  const words = (html || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Markup de la fiche bristol, entièrement en styles inline. */
function ficheMarkup(fiche, subject) {
  const c = PDF_COLORS[subject?.color] || PDF_COLORS.primary;
  const holes = [0, 1, 2, 3, 4, 5].map(() => `<div style="width:12px;height:12px;border-radius:50%;background:#f3f4f8;border:1px solid #d9dbe6;"></div>`).join('<div style="flex:1;"></div>');
  return `<div style="width:760px;margin:0 auto;font-family:Inter,Helvetica,Arial,sans-serif;color:#1f2030;background:#fff;padding:6px;">
    <div style="position:relative;background:${CREAM};border:1px solid #ece6d3;border-radius:18px;overflow:hidden;">
      <div style="background:${c.accent};color:#fff;padding:12px 28px 12px 64px;">
        <table style="width:100%;border-collapse:collapse;"><tr>
          <td style="padding:0;font-size:11.5px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#fff;">${subject?.name || 'Fiche'}</td>
          <td style="padding:0;text-align:right;font-size:11.5px;font-weight:700;color:rgba(255,255,255,0.9);">${readingMinutes(fiche.content)} min de lecture · Prépa PASS/LAS</td>
        </tr></table>
      </div>
      <div style="position:absolute;left:22px;top:70px;bottom:26px;width:12px;display:flex;flex-direction:column;">${holes}</div>
      <div style="position:absolute;left:52px;top:46px;bottom:0;width:2px;background:#f2b8b8;"></div>
      <div style="padding:26px 36px 30px 74px;background-image:${RULES_BG};background-repeat:repeat;background-position:0 12px;">
        <h1 style="font-size:28px;font-weight:800;letter-spacing:-0.6px;line-height:1.15;color:#0f1020;margin:0 0 8px 0;">${fiche.title}</h1>
        ${fiche.summary ? `<p style="font-size:14.5px;font-style:italic;color:#6b6a5e;margin:0 0 20px 0;line-height:1.6;">${fiche.summary}</p>` : ''}
        <div style="font-size:15px;line-height:${LINE}px;color:#1f2030;">${inlineContentStyles(fiche.content, c)}</div>
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-top:10px;"><tr>
      <td style="padding:0 6px;font-size:9px;font-weight:700;color:#374151;">Prépa PASS/LAS <span style="font-weight:400;color:#9ca3af;">· usage personnel uniquement</span></td>
      <td style="padding:0 6px;text-align:right;font-size:9px;font-weight:700;color:${c.accent};">prepa-pass-las.fr</td>
    </tr></table>
  </div>`;
}

/**
 * Attend un cycle de mise en page.
 *
 * `requestAnimationFrame` ne se déclenche pas quand l'onglet est en arrière-plan
 * (`visibilityState === 'hidden'`) : on double d'un `setTimeout` pour que
 * l'export aboutisse même si l'utilisateur change d'onglet pendant la création.
 */
function waitForLayout() {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    requestAnimationFrame(() => requestAnimationFrame(finish));
    setTimeout(finish, 60);
  });
}

/** Découpe le rendu d'une fiche en pages A4 et les ajoute au PDF. */
function addCanvasPages(pdf, canvas) {
  const contentW = PAGE_W - 2 * MARGIN_X;
  const contentH = PAGE_H - 2 * MARGIN_Y;
  const pxPerMm = canvas.width / contentW;
  const pageHpx = Math.floor(contentH * pxPerMm);

  let offset = 0;
  let firstPage = true;
  while (offset < canvas.height) {
    const sliceH = Math.min(pageHpx, canvas.height - offset);
    const slice = document.createElement('canvas');
    slice.width = canvas.width;
    slice.height = sliceH;
    const ctx = slice.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(canvas, 0, offset, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

    if (!firstPage) pdf.addPage();
    pdf.addImage(slice.toDataURL('image/jpeg', 0.95), 'JPEG', MARGIN_X, MARGIN_Y, contentW, sliceH / pxPerMm);

    firstPage = false;
    offset += sliceH;
  }
}

/**
 * Génère et télécharge le PDF d'une fiche.
 *
 * @param {object} fiche
 * @param {object} subject  la matière de la fiche (couleur et intitulé)
 */
export async function downloadFichePdf(fiche, subject) {
  if (!fiche) return;

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas-pro'),
    import('jspdf'),
  ]);

  // Conteneur hors écran : la page affichée n'est jamais modifiée.
  const holder = document.createElement('div');
  holder.setAttribute('data-pdf-holder', '');
  holder.style.cssText = 'position:fixed;left:-10000px;top:0;width:760px;background:#fff;z-index:-1;';
  holder.innerHTML = ficheMarkup(fiche, subject);
  document.body.appendChild(holder);

  try {
    // Laisse le navigateur calculer la mise en page avant la capture.
    await waitForLayout();

    const el = holder.firstElementChild;
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: el.scrollWidth,
      height: el.scrollHeight,
    });

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    addCanvasPages(pdf, canvas);

    const slug = String(fiche.id || 'fiche').replace(/[^a-z0-9-]/gi, '-');
    pdf.save(`fiche-${slug}.pdf`);
  } finally {
    holder.remove();
  }
}
