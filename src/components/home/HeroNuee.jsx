'use client';

import { useEffect, useRef } from 'react';
import { SUBJECTS } from '@/data/subjects';
import { SUBJECT_ICONS } from '@/data/constants';

/* Nuée du hero — transcription fidèle de l'animation de prepa-police.fr.
   Le canvas couvre toute la section. La tuile ([data-nuee-tuile]) est échantillonnée en
   mosaïque de 34 × 34 cases (fond dégradé + icône) : chaque case est une particule. Entre
   deux UE, les cases se dispersent selon un effet (éclat, tourbillon, vague, chute, implosion,
   rideau) puis se réassemblent ; la vraie tuile réapparaît par-dessus la mosaïque. Une poussière
   ambiante dérive sur tout le hero, masquée autour des zones de texte ([data-nuee-texte]). */

import { NUEE_THEMES } from './nueeThemes';

const U = 34;                 // cases par côté
const T = 4 * U;              // taille du canvas d'échantillonnage (4 px par case)
const DUREE_THEME = 5;        // secondes par UE
const ENCRE_AMBIANTE = [13, 13, 13];

const clamp = (e) => Math.min(1, Math.max(0, e));
const easeInOut = (e) => (e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2);
const mixRgb = (a, b, t) => `${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)}`;

export default function HeroNuee({ onChange }) {
  const ref = useRef(null);
  const onChangeRef = useRef(onChange); onChangeRef.current = onChange;

  useEffect(() => {
    const themes = NUEE_THEMES;
    const canvas = ref.current; const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tile = document.querySelector('[data-nuee-tuile]');
    const roundedSquare = (c, x, y, size) => { const r = 0.273 * size; c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + size, y, x + size, y + size, r); c.arcTo(x + size, y + size, x, y + size, r); c.arcTo(x, y + size, x, y, r); c.arcTo(x, y, x + size, y, r); c.closePath(); };
    const off = document.createElement('canvas'); const oc = off.getContext('2d', { willReadFrequently: true });

    let W = 0, H = 0, N = 200, tileX = 0, tileY = 0, v = 0, j = 0, k = 2.6;
    let cells = [], colors = [], colorStr = [], nCells = 0, textZones = [], parts = [];
    let inkFlag = [], orderAlong = [];
    const accentRgb = themes.map((th) => [parseInt(th.lettre.slice(1, 3), 16), parseInt(th.lettre.slice(3, 5), 16), parseInt(th.lettre.slice(5, 7), 16)]); // par thème : la case appartient-elle au trait ? position (0..1) le long du tracé
    let sampled = false;

    // moyenne 4 × 4 d'un bloc de pixels → [r, g, b, alpha 0..255]
    const avg = (img, cx, cy) => { let r = 0, g = 0, b = 0, a = 0; for (let oy = 0; oy < 4; oy++) for (let ox = 0; ox < 4; ox++) { const i = ((4 * cy + oy) * T + 4 * cx + ox) * 4; const al = img[i + 3]; r += img[i] * al; g += img[i + 1] * al; b += img[i + 2] * al; a += al; } return a ? [Math.round(r / a), Math.round(g / a), Math.round(b / a), a / 16] : [255, 255, 255, 0]; };

    const sample = () => {
      off.width = off.height = T;
      oc.clearRect(0, 0, T, T); roundedSquare(oc, 0, 0, T); oc.fillStyle = '#000'; oc.fill();
      const mask = oc.getImageData(0, 0, T, T).data; cells = [];
      for (let cy = 0; cy < U; cy++) for (let cx = 0; cx < U; cx++) if (avg(mask, cx, cy)[3] > 128) cells.push([cx, cy]);
      nCells = cells.length;
      colors = themes.map((th) => {
        oc.clearRect(0, 0, T, T); roundedSquare(oc, 0, 0, T);
        const ang = (145 * Math.PI) / 180; const sn = Math.sin(ang), cs = -Math.cos(ang); const half = (T * (Math.abs(sn) + Math.abs(cs))) / 2;
        const grad = oc.createLinearGradient(T / 2 - sn * half, T / 2 - cs * half, T / 2 + sn * half, T / 2 + cs * half); grad.addColorStop(0, th.fond[0]); grad.addColorStop(1, th.fond[1]);
        oc.fillStyle = grad; oc.fill();
        oc.save(); oc.translate(T / 4, T / 4); oc.scale(T / 48, T / 48); oc.strokeStyle = th.encre; oc.lineWidth = 2.2; oc.lineCap = 'round'; oc.lineJoin = 'round';
        for (const f of th.formes) { if (typeof f === 'string') oc.stroke(new Path2D(f)); else { oc.beginPath(); oc.arc(f[0], f[1], f[2], 0, 6.2832); oc.stroke(); } }
        oc.restore();
        const img = oc.getImageData(0, 0, T, T).data; return cells.map(([cx, cy]) => avg(img, cx, cy));
      });
      colorStr = colors.map((arr) => arr.map((c) => `rgb(${c[0]},${c[1]},${c[2]})`));
      // Ordre de tracé : on échantillonne le chemin SVG de l'icône, chaque case d'encre prend la position
      // de son point le plus proche le long du trait (variante « crayon » des transitions).
      const svgNS = 'http://www.w3.org/2000/svg'; const svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('viewBox', '0 0 24 24'); svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'; const pathEl = document.createElementNS(svgNS, 'path'); svg.appendChild(pathEl); document.body.appendChild(svg);
      inkFlag = []; orderAlong = [];
      themes.forEach((th, ti) => {
        const enc = th.encre.startsWith('#') ? [parseInt(th.encre.slice(1, 3), 16), parseInt(th.encre.slice(3, 5), 16), parseInt(th.encre.slice(5, 7), 16)] : [255, 255, 255];
        const pts = []; for (const f of th.formes) { if (typeof f !== 'string') continue; pathEl.setAttribute('d', f); const len = pathEl.getTotalLength(); const n = 420; for (let q = 0; q < n; q++) { const pt = pathEl.getPointAtLength((len * q) / (n - 1)); pts.push([(T / 4 + (pt.x * T) / 48) / 4, (T / 4 + (pt.y * T) / 48) / 4, q / (n - 1)]); } }
        inkFlag[ti] = colors[ti].map((c) => Math.hypot(c[0] - enc[0], c[1] - enc[1], c[2] - enc[2]) < 70);
        orderAlong[ti] = cells.map(([cx, cy], i) => { if (!inkFlag[ti][i]) return 1; let best = 1, bd = 1e9; for (const [px, py, fr] of pts) { const d = (px - cx - 0.5) ** 2 + (py - cy - 0.5) ** 2; if (d < bd) { bd = d; best = fr; } } return best; });
      });
      document.body.removeChild(svg);
      sampled = true;
    };

    const layout = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cr = canvas.getBoundingClientRect(); const tr = tile?.getBoundingClientRect();
      N = tr ? tr.width : 200;
      tileX = Math.round((tr ? tr.left - cr.left : W / 2 - N / 2) * dpr) / dpr; tileY = Math.round((tr ? tr.top - cr.top : H / 2 - N / 2) * dpr) / dpr;
      v = tileX + N / 2; j = tileY + N / 2;
      if (!sampled) sample();
      k = (N / U) * 0.45;
      textZones = [...document.querySelectorAll('[data-nuee-texte]')].map((el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - cr.left, y: r.top + r.height / 2 - cr.top, rx: 0.6 * r.width, ry: Math.max(0.62 * r.height, 34) }; });
      const total = nCells + Math.max(300, Math.min(2000, Math.round((W * H) / 480)));
      parts = Array.from({ length: total }, (_, i) => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.26, phase: Math.random() * Math.PI * 2, lot: i % 3, elu: i < nCells, eclat: 0.08 + 0.24 * Math.random(), alea: Math.random() }));
    };

    const L = DUREE_THEME * themes.length; const S = L + 2.2 + 1.2;
    // poids de vignette et masque autour des textes (pour la poussière et l'arrivée des cases)
    const vignette = (x, y) => (1 - clamp((Math.hypot((x / W - 0.5) / 0.75, (y / H - 0.45) / 0.7) - 0.3) / 0.7)) * clamp((H - y) / 160);
    const textMask = (x, y) => textZones.reduce((m, z) => Math.max(m, 0.85 * (1 - clamp((Math.hypot((x - z.x) / z.rx, (y - z.y) / z.ry) - 0.45) / 0.65))), 0);

    // poussière ambiante + masques
    const drawDust = (fade) => {
      ctx.clearRect(0, 0, W, H);
      for (let lot = 0; lot < 3; lot++) {
        ctx.beginPath();
        for (const p of parts) { if (p.elu || p.lot !== lot) continue; ctx.moveTo(p.x + 1.4, p.y); ctx.arc(p.x, p.y, 1.4, 0, 6.2832); }
        ctx.fillStyle = `rgba(13,13,13,${((0.16 + 0.07 * lot) * (1 - 0.4 * fade)).toFixed(3)})`; ctx.fill();
      }
      for (const z of textZones) {
        ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.translate(z.x, z.y); ctx.scale(1, z.ry / z.rx);
        const g = ctx.createRadialGradient(0, 0, 0.45 * z.rx, 0, 0, 1.1 * z.rx); g.addColorStop(0, 'rgba(0,0,0,0.85)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(-(1.2 * z.rx), -(1.2 * z.rx), 2.4 * z.rx, 2.4 * z.rx); ctx.restore();
      }
      ctx.save(); ctx.globalCompositeOperation = 'destination-in'; ctx.translate(0.5 * W, 0.45 * H); ctx.scale(1, (0.7 * H) / (0.75 * W));
      const rg = ctx.createRadialGradient(0, 0, 0.75 * W * 0.3, 0, 0, 0.75 * W); rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg; ctx.fillRect(-(2 * W), -(4 * W), 4 * W, 8 * W); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'destination-in';
      const lg = ctx.createLinearGradient(0, H - 160, 0, H); lg.addColorStop(0, 'rgba(0,0,0,1)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H); ctx.restore();
    };

    layout();
    if (reduce) {
      const still = () => { layout(); drawDust(1); if (tile) tile.style.opacity = '1'; };
      still(); window.addEventListener('resize', still);
      return () => window.removeEventListener('resize', still);
    }

    let raf = 0, lastIdx = -1; const t0 = performance.now();
    const frame = (now) => {
      const sec = now / 1000;
      for (const p of parts) { p.x += p.vx + 0.12 * Math.sin(0.6 * sec + p.phase); p.y += p.vy + 0.1 * Math.cos(0.5 * sec + p.phase); if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10; if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10; }
      const tGlobal = (now - t0) / 1000 + S - 1.2;
      const e = tGlobal % S, cycle = Math.floor(tGlobal / S);
      const ending = e >= L; const idx = ending ? themes.length - 1 : Math.floor(e / DUREE_THEME); const l = ending ? e - L : e - DUREE_THEME * idx;
      drawDust(ending ? 1 - clamp(l / 2.2) : idx === 0 ? clamp(l / 2.2) : 1);
      const o = ending ? 0 : clamp((l - 1.6) / 0.6) * (1 - clamp((l - 4.4) / 0.6));
      if (tile) tile.style.opacity = o.toFixed(3);
      if (o < 1) {
        const d = N / U; const geo = { v, j, N };
        for (let i = 0; i < nCells; i++) {
          const p = parts[i]; const [cx, cy] = cells[i];
          const ox = tileX + (cx + 0.5) * d, oy = tileY + (cy + 0.5) * d;
          let x = ox, y = oy, prog = 1, rf = 1, col = colorStr[idx][i];
          if (ending || idx === 0) {
            const t = easeInOut(clamp((l - (i / nCells) * 0.9) / 1.3)); prog = ending ? 1 - t : t;
            x = p.x + (ox - p.x) * prog; y = p.y + (oy - p.y) * prog;
            if (prog < 1) { const w = 0.2 * vignette(p.x, p.y) * (1 - textMask(p.x, p.y)); col = `rgba(${mixRgb(ENCRE_AMBIANTE, colors[idx][i], prog)},${(w + (1 - w) * prog).toFixed(3)})`; }
          } else {
            // Transition « crayon » : l'ancienne mosaïque s'efface, puis les cases d'encre apparaissent
            // dans l'ordre du trait avec une pointe qui brille, enfin le fond se remplit.
            const s = clamp(l / 1.45);
            if (s < 1) {
              const from = colors[idx - 1][i], to = colors[idx][i];
              if (s < 0.22) { col = `rgba(${from[0]},${from[1]},${from[2]},${(1 - s / 0.22).toFixed(2)})`; }
              else {
                const u = (s - 0.22) / 0.78;
                if (inkFlag[idx][i]) {
                  const o = orderAlong[idx][i] * 0.68; const t = clamp((u - o) / 0.05); const tip = clamp(1 - Math.abs(u - o - 0.02) / 0.07);
                  if (t <= 0) continue; rf = 1 + 0.7 * tip;
                  // le trait se dessine dans la couleur de l'UE, puis rejoint sa couleur réelle (blanc sur tuile foncée) quand le fond arrive
                  const acc = accentRgb[idx]; const m = clamp((u - 0.7) / 0.3);
                  col = `rgba(${mixRgb(acc, to, m)},${t.toFixed(2)})`;
                } else {
                  const t = clamp((u - 0.7) / 0.3); if (t <= 0) continue; col = `rgba(${to[0]},${to[1]},${to[2]},${t.toFixed(2)})`;
                }
              }
            }
          }
          const rad = (1.4 + (k - 1.4) * prog) * rf;
          if (rad >= 0.1) { ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fillStyle = col; ctx.fill(); }
        }
      }
      const cur = ending ? -1 : idx;
      if (cur >= 0 && cur !== lastIdx) { lastIdx = cur; onChangeRef.current?.(themes[cur], cur); }
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting && !raf) raf = requestAnimationFrame(frame); else if (!en.isIntersecting) { cancelAnimationFrame(raf); raf = 0; } });
    io.observe(canvas);
    window.addEventListener('resize', layout);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', layout); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}
