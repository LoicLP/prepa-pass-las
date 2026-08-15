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
  indigo:  { bg: '#eef2ff', accent: '#4f46e5', accentDark: '#3730a3', badgeText: '#3730a3', light: '#c7d2fe', lighter: '#e0e7ff' },
  primary: { bg: '#eef2ff', accent: '#4f46e5', accentDark: '#3730a3', badgeText: '#3730a3', light: '#c7d2fe', lighter: '#e0e7ff' },
  emerald: { bg: '#ecfdf5', accent: '#059669', accentDark: '#065f46', badgeText: '#065f46', light: '#a7f3d0', lighter: '#d1fae5' },
  violet:  { bg: '#f5f3ff', accent: '#7c3aed', accentDark: '#5b21b6', badgeText: '#5b21b6', light: '#ddd6fe', lighter: '#ede9fe' },
  cyan:    { bg: '#ecfeff', accent: '#0891b2', accentDark: '#155e75', badgeText: '#155e75', light: '#a5f3fc', lighter: '#cffafe' },
  amber:   { bg: '#fffbeb', accent: '#d97706', accentDark: '#92400e', badgeText: '#92400e', light: '#fde68a', lighter: '#fef3c7' },
  rose:    { bg: '#fff1f2', accent: '#e11d48', accentDark: '#9f1239', badgeText: '#9f1239', light: '#fecdd3', lighter: '#ffe4e6' },
};

// Format A4 (mm)
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 12;
const MARGIN_Y = 8;

/** Remplace les classes Tailwind du contenu par des styles inline imprimables. */
function inlineContentStyles(content, c) {
  return (content || '')
    .replace(/class="[^"]*text-xl font-bold[^"]*"/g,
      `style="font-size:16px;font-weight:700;color:${c.accentDark};margin:24px 0 10px 0;padding:10px 0 8px 14px;border-left:3px solid ${c.accent};letter-spacing:-0.2px;"`)
    .replace(/class="[^"]*text-lg font-semibold[^"]*"/g,
      'style="font-size:14px;font-weight:600;color:#1f2937;margin:18px 0 8px 0;"')
    // `list-style` et `display:list-item` sont réaffirmés : le reset Tailwind
    // (preflight) supprime les puces, et le rendu se fait dans la page.
    .replace(/class="[^"]*list-disc[^"]*"/g,
      'style="list-style:disc outside;padding-left:22px;margin:0 0 14px 0;"')
    .replace(/class="[^"]*mb-3[^"]*"/g, 'style="margin:0 0 10px 0;line-height:1.7;"')
    .replace(/class="[^"]*mb-4[^"]*"/g, 'style="margin:0 0 14px 0;line-height:1.7;"')
    .replace(/<li>/g, '<li style="display:list-item;margin:0 0 4px 0;line-height:1.65;font-size:12.5px;">')
    .replace(/class="[^"]*bg-[a-z]+-50 border border-[a-z]+-200 rounded-xl p-4[^"]*"/g,
      `style="background:${c.bg};border:1.5px solid ${c.light};border-radius:10px;padding:14px 18px;margin-top:16px;margin-bottom:8px;"`)
    .replace(/class="[^"]*text-sm font-semibold text-[a-z]+-800[^"]*"/g,
      `style="font-size:11.5px;font-weight:600;color:${c.badgeText};margin:0;line-height:1.55;"`)
    // Les attributs class résiduels sont retirés : le rendu ne doit dépendre
    // que des styles inline, jamais d'une règle Tailwind qui pourrait changer.
    .replace(/\sclass="[^"]*"/g, '');
}

/** Markup d'une fiche, entièrement en styles inline. */
function ficheMarkup(fiche, subject) {
  const c = PDF_COLORS[subject?.color] || PDF_COLORS.primary;
  return `<div style="width:700px;margin:0 auto;font-family:Inter,Helvetica,Arial,sans-serif;color:#1f2937;background:#fff;">
    <div style="background:${c.accent};padding:32px 36px 28px;color:#fff;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:18px;"><tr>
        <td style="padding:0;">
          <span style="display:inline-block;padding:5px 14px;background:rgba(255,255,255,0.15);font-size:10px;font-weight:700;border-radius:999px;letter-spacing:0.5px;text-transform:uppercase;margin-right:8px;">${subject?.name || ''}</span>
          <span style="display:inline-block;padding:5px 12px;background:rgba(255,255,255,0.08);font-size:10px;font-weight:600;border-radius:999px;color:rgba(255,255,255,0.7);">Fiche de révision</span>
        </td>
        <td style="padding:0;text-align:right;">
          <span style="font-size:10px;font-weight:700;opacity:0.5;letter-spacing:1px;">PRÉPA PASS/LAS</span>
        </td>
      </tr></table>
      <h1 style="font-size:26px;font-weight:900;margin:0 0 8px 0;letter-spacing:-0.4px;line-height:1.2;color:#fff;">${fiche.title}</h1>
      <p style="font-size:12px;color:rgba(255,255,255,0.6);margin:0;line-height:1.5;">${fiche.summary || ''}</p>
    </div>
    <div style="height:3px;background:${c.light};"></div>
    <div style="padding:28px 36px 20px;font-size:12.5px;line-height:1.75;color:#374151;">
      ${inlineContentStyles(fiche.content, c)}
    </div>
    <table style="width:calc(100% - 72px);margin:0 36px;padding:0;border-collapse:collapse;border-top:2px solid ${c.lighter};">
      <tr>
        <td style="padding:16px 0 10px;vertical-align:middle;">
          <table style="border-collapse:collapse;"><tr>
            <td style="padding:0 8px 0 0;vertical-align:middle;">
              <div style="width:24px;height:24px;background:${c.accent};border-radius:6px;text-align:center;line-height:24px;">
                <span style="color:#fff;font-size:10px;font-weight:900;">P</span>
              </div>
            </td>
            <td style="padding:0;vertical-align:middle;">
              <span style="font-size:9px;font-weight:700;color:#374151;display:block;">Prépa PASS/LAS</span>
              <span style="font-size:8px;color:#9ca3af;">Usage personnel uniquement</span>
            </td>
          </tr></table>
        </td>
        <td style="padding:16px 0 10px;text-align:right;vertical-align:middle;">
          <span style="font-size:9px;color:${c.accent};font-weight:700;display:block;">prepa-pass-las.fr</span>
          <span style="font-size:8px;color:#9ca3af;">${subject?.name || ''}</span>
        </td>
      </tr>
    </table>
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
  holder.style.cssText = 'position:fixed;left:-10000px;top:0;width:700px;background:#fff;z-index:-1;';
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
