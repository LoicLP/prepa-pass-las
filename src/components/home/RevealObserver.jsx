'use client';

import { useEffect } from 'react';

/* Observe tous les éléments [data-reveal] et ajoute .revealed quand ils entrent
   dans le viewport (même mécanique que l'accueil CRFPA). IntersectionObserver
   en voie principale, repli géométrique sur scroll/resize/visibilitychange :
   certains navigateurs gèlent l'IO quand l'onglet est en arrière-plan. */
export default function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;
    document.documentElement.classList.add('js-reveal');
    const pending = new Set(els);
    const reveal = (el) => { el.classList.add('revealed'); pending.delete(el); observer?.unobserve(el); };
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) reveal(e.target); }); },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    const check = () => {
      if (!pending.size) return;
      const vh = window.innerHeight;
      pending.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < vh - 60 && r.bottom > 0) reveal(el); });
    };
    const t = setTimeout(check, 350);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    document.addEventListener('visibilitychange', check);
    return () => {
      clearTimeout(t); observer.disconnect();
      window.removeEventListener('scroll', check); window.removeEventListener('resize', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);
  return null;
}
