'use client';

import { useCallback, useEffect } from 'react';
import HeroNuee from './HeroNuee';

/* Calque canvas du hero. À chaque changement d'UE, met à jour la tuile [data-nuee-tuile]
   (fond, encre, icône) et la couleur des lettres [data-lettre] du titre. */
export default function HeroNueeCanvas() {
  const onChange = useCallback((th) => {
    const tile = document.querySelector('[data-nuee-tuile]');
    if (tile) {
      tile.style.background = `linear-gradient(145deg, ${th.fond[0]}, ${th.fond[1]})`;
      const svg = tile.querySelector('svg'); if (svg) svg.setAttribute('stroke', th.encre);
      const path = tile.querySelector('path'); if (path) path.setAttribute('d', th.formes[0]);
    }
    document.querySelectorAll('[data-lettre]').forEach((el) => { el.style.color = th.lettre; });
    // couleur courante exposée au reste de la page (le header en teinte sa capsule)
    const rgb = [th.lettre.slice(1, 3), th.lettre.slice(3, 5), th.lettre.slice(5, 7)].map((h) => parseInt(h, 16)).join(',');
    document.documentElement.style.setProperty('--nuee-rgb', rgb);
  }, []);
  useEffect(() => () => { document.documentElement.style.removeProperty('--nuee-rgb'); }, []);
  return <HeroNuee onChange={onChange} />;
}
