'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { FICHES_DATA } from '@/data/fiches';
import { SUBJECTS } from '@/data/subjects';
import { usePremium } from '@/contexts/PremiumContext';
import { useAuth } from '@/contexts/AuthContext';
import { SUBJECT_COLORS } from '@/data/constants';
import LoginRequiredModal from '@/components/ui/LoginRequiredModal';
import UpgradeModal from '@/components/ui/UpgradeModal';

const SUBJECT_ICONS = {
  anatomie: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z',
  chimie: 'M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5',
  biocell: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z',
  biostats: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  biophysique: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
  ssh: 'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
};

/* Color map keyed by subject color name (from SUBJECTS data) */
const subjectColorMap = {
  indigo: { badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500', ring: 'ring-indigo-500/20', icon: 'text-indigo-500', light: 'bg-indigo-50', border: 'border-indigo-100' },
  primary: { badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500', ring: 'ring-indigo-500/20', icon: 'text-indigo-500', light: 'bg-indigo-50', border: 'border-indigo-100' },
  emerald: { badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', ring: 'ring-emerald-500/20', icon: 'text-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-100' },
  violet: { badge: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500', ring: 'ring-violet-500/20', icon: 'text-violet-500', light: 'bg-violet-50', border: 'border-violet-100' },
  cyan: { badge: 'bg-cyan-100 text-cyan-700', bar: 'bg-cyan-500', ring: 'ring-cyan-500/20', icon: 'text-cyan-500', light: 'bg-cyan-50', border: 'border-cyan-100' },
  amber: { badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500', ring: 'ring-amber-500/20', icon: 'text-amber-500', light: 'bg-amber-50', border: 'border-amber-100' },
  rose: { badge: 'bg-rose-100 text-rose-700', bar: 'bg-rose-500', ring: 'ring-rose-500/20', icon: 'text-rose-500', light: 'bg-rose-50', border: 'border-rose-100' },
};

function getColors(subject) {
  return subjectColorMap[subject?.color] || subjectColorMap.primary;
}

/* Floating subject cards — 4 fixed slots, 6 subjects rotating one at a time */
const CARD_STYLES = {
  indigo: { bg: 'bg-indigo-100', icon: 'text-indigo-600', label: 'text-indigo-700', border: 'border-indigo-100/50', shadow: 'shadow-indigo-500/10', barBg: 'bg-indigo-100', barLight: 'bg-indigo-50' },
  emerald: { bg: 'bg-emerald-100', icon: 'text-emerald-600', label: 'text-emerald-700', border: 'border-emerald-100/50', shadow: 'shadow-emerald-500/10', barBg: 'bg-emerald-100', barLight: 'bg-emerald-50' },
  violet: { bg: 'bg-violet-100', icon: 'text-violet-600', label: 'text-violet-700', border: 'border-violet-100/50', shadow: 'shadow-violet-500/10', barBg: 'bg-violet-100', barLight: 'bg-violet-50' },
  cyan: { bg: 'bg-cyan-100', icon: 'text-cyan-600', label: 'text-cyan-700', border: 'border-cyan-100/50', shadow: 'shadow-cyan-500/10', barBg: 'bg-cyan-100', barLight: 'bg-cyan-50' },
  amber: { bg: 'bg-amber-100', icon: 'text-amber-600', label: 'text-amber-700', border: 'border-amber-100/50', shadow: 'shadow-amber-500/10', barBg: 'bg-amber-100', barLight: 'bg-amber-50' },
  rose: { bg: 'bg-rose-100', icon: 'text-rose-600', label: 'text-rose-700', border: 'border-rose-100/50', shadow: 'shadow-rose-500/10', barBg: 'bg-rose-100', barLight: 'bg-rose-50' },
};

/* 4 positions that NEVER overlap — corners of the container */
const SLOT_POSITIONS = [
  { top: 0, left: 8 },       /* top-left */
  { top: 12, right: 0 },     /* top-right */
  { bottom: 40, left: 0 },   /* bottom-left */
  { bottom: 0, right: 16 },  /* bottom-right */
];

function FloatingSubjectCards() {
  const allSubjects = useMemo(() =>
    SUBJECTS.map(s => ({
      id: s.id,
      name: s.name,
      icon: SUBJECT_ICONS[s.id],
      color: s.color,
      count: FICHES_DATA.filter(f => f.subject === s.id).length,
    })),
  []);

  /* slots[i] = index into allSubjects shown in slot i */
  const [slots, setSlots] = useState(() => {
    const indices = [0, 1, 2, 3, 4, 5];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, 4);
  });

  /* Track which slot is currently fading out (-1 = none) */
  const [fadingSlot, setFadingSlot] = useState(-1);

  /* Cycle: pick a slot to swap, fade it out, then swap subject & fade in */
  useEffect(() => {
    let nextSlot = 0; /* round-robin through slots for predictable pacing */
    const interval = setInterval(() => {
      const slotToSwap = nextSlot % 4;
      nextSlot++;

      /* Phase 1: fade out */
      setFadingSlot(slotToSwap);

      /* Phase 2: after fade-out, swap the subject and fade in */
      setTimeout(() => {
        setSlots(prev => {
          const usedIndices = new Set(prev);
          const available = allSubjects
            .map((_, i) => i)
            .filter(i => !usedIndices.has(i));
          if (available.length === 0) return prev;
          const pick = available[Math.floor(Math.random() * available.length)];
          const next = [...prev];
          next[slotToSwap] = pick;
          return next;
        });
        setFadingSlot(-1);
      }, 500); /* matches CSS fade-out duration */
    }, 3500);

    return () => clearInterval(interval);
  }, [allSubjects]);

  return (
    <div className="hidden lg:block relative h-[340px]">
      {slots.map((subjectIdx, slotIdx) => {
        const subject = allSubjects[subjectIdx];
        if (!subject) return null;
        const style = CARD_STYLES[subject.color] || CARD_STYLES.indigo;
        const pos = SLOT_POSITIONS[slotIdx];
        const isFading = fadingSlot === slotIdx;

        return (
          <div
            key={`slot-${slotIdx}-${subject.id}`}
            className={`absolute w-52 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border p-5 ${style.border} ${style.shadow} transition-all duration-500 ease-in-out ${isFading ? 'opacity-0 scale-90' : 'opacity-100 scale-100 animate-[cardFadeIn_0.5s_ease-out]'}`}
            style={{
              top: pos.top !== undefined ? pos.top : undefined,
              left: pos.left !== undefined ? pos.left : undefined,
              right: pos.right !== undefined ? pos.right : undefined,
              bottom: pos.bottom !== undefined ? pos.bottom : undefined,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 ${style.bg} rounded-lg flex items-center justify-center`}>
                <svg className={`w-4 h-4 ${style.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={subject.icon} />
                </svg>
              </div>
              <div>
                <div className={`text-xs font-bold ${style.label}`}>{subject.name}</div>
                <div className="text-[10px] text-gray-400">{subject.count} fiches</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className={`h-2 ${style.barBg} rounded-full w-full`} />
              <div className={`h-2 ${style.barLight} rounded-full w-4/5`} />
              <div className={`h-2 ${style.barLight} rounded-full w-3/5`} />
            </div>
          </div>
        );
      })}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-indigo-100/40 rounded-2xl rotate-12 blur-[2px] pointer-events-none" />
    </div>
  );
}

/* ================================================================
   FICHE CARD
   ================================================================ */
function FicheCard({ fiche, index, onOpen, premiumUser, user, onLoginRequired, onUpgradeRequired }) {
  const subject = SUBJECTS.find(s => s.id === fiche.subject);
  const colors = getColors(subject);
  const iconPath = SUBJECT_ICONS[fiche.subject] || '';

  return (
    <article
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-gray-200/60 hover:border-gray-300 transition-all duration-300"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
      onClick={() => onOpen(fiche)}
    >
      <div className={`h-1 ${colors.bar}`} />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-9 h-9 rounded-xl ${colors.light} ${colors.border} border flex items-center justify-center shrink-0`}>
            <svg className={`w-[18px] h-[18px] ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${colors.icon}`}>{subject?.name || ''}</span>
            <h3 className="text-[15px] font-bold text-gray-900 leading-snug mt-0.5 group-hover:text-indigo-700 transition-colors">{fiche.title}</h3>
          </div>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{fiche.summary}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-bold group-hover:gap-2.5 transition-all">
            Lire la fiche
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
          {premiumUser ? (
            <Link
              href={`/cours?id=${fiche.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
              </svg>
              Cours
            </Link>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); !user ? onLoginRequired() : onUpgradeRequired(); }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              Cours
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* ================================================================
   FICHE MODAL
   ================================================================ */
function FicheModal({ fiche, onClose, premiumUser, user, onLoginRequired, onUpgradeRequired }) {
  const subject = SUBJECTS.find(s => s.id === fiche.subject);
  const colors = getColors(subject);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleDownloadPDF = useCallback(async () => {
    if (!user) {
      onLoginRequired();
      return;
    }
    if (!premiumUser) {
      onUpgradeRequired();
      return;
    }
    try {
      const mod = await import('html2pdf.js');
      const html2pdf = mod.default || mod;

      const pdfHexColors = {
        indigo:  { bg: '#eef2ff', accent: '#4f46e5', accentDark: '#3730a3', accentDeep: '#1e1b4b', badge: '#e0e7ff', badgeText: '#3730a3', light: '#c7d2fe', lighter: '#e0e7ff' },
        primary: { bg: '#eef2ff', accent: '#4f46e5', accentDark: '#3730a3', accentDeep: '#1e1b4b', badge: '#e0e7ff', badgeText: '#3730a3', light: '#c7d2fe', lighter: '#e0e7ff' },
        emerald: { bg: '#ecfdf5', accent: '#059669', accentDark: '#065f46', accentDeep: '#022c22', badge: '#d1fae5', badgeText: '#065f46', light: '#a7f3d0', lighter: '#d1fae5' },
        violet:  { bg: '#f5f3ff', accent: '#7c3aed', accentDark: '#5b21b6', accentDeep: '#2e1065', badge: '#ede9fe', badgeText: '#5b21b6', light: '#ddd6fe', lighter: '#ede9fe' },
        cyan:    { bg: '#ecfeff', accent: '#0891b2', accentDark: '#155e75', accentDeep: '#083344', badge: '#cffafe', badgeText: '#155e75', light: '#a5f3fc', lighter: '#cffafe' },
        amber:   { bg: '#fffbeb', accent: '#d97706', accentDark: '#92400e', accentDeep: '#451a03', badge: '#fef3c7', badgeText: '#92400e', light: '#fde68a', lighter: '#fef3c7' },
        rose:    { bg: '#fff1f2', accent: '#e11d48', accentDark: '#9f1239', accentDeep: '#4c0519', badge: '#ffe4e6', badgeText: '#9f1239', light: '#fecdd3', lighter: '#ffe4e6' },
      };
      const c = pdfHexColors[subject?.color] || pdfHexColors.primary;

      let processedContent = (fiche.content || '')
        .replace(/class="[^"]*text-xl font-bold[^"]*"/g,
          `style="font-size:16px;font-weight:700;color:${c.accentDark};margin:24px 0 10px 0;padding:10px 0 8px 14px;border-left:3px solid ${c.accent};letter-spacing:-0.2px;"`)
        .replace(/class="[^"]*text-lg font-semibold[^"]*"/g,
          `style="font-size:14px;font-weight:600;color:#1f2937;margin:18px 0 8px 0;"`)
        .replace(/class="[^"]*list-disc[^"]*"/g, 'style="padding-left:20px;margin:0 0 14px 0;"')
        .replace(/class="[^"]*mb-3[^"]*"/g, 'style="margin:0 0 10px 0;line-height:1.7;"')
        .replace(/class="[^"]*mb-4[^"]*"/g, 'style="margin:0 0 14px 0;line-height:1.7;"')
        .replace(/<li>/g, '<li style="margin:0 0 4px 0;line-height:1.65;font-size:12.5px;">')
        .replace(/class="[^"]*bg-[a-z]+-50 border border-[a-z]+-200 rounded-xl p-4[^"]*"/g,
          `style="background:${c.bg};border:1.5px solid ${c.light};border-radius:10px;padding:14px 18px;margin-top:16px;margin-bottom:8px;"`)
        .replace(/class="[^"]*text-sm font-semibold text-[a-z]+-800[^"]*"/g,
          `style="font-size:11.5px;font-weight:600;color:${c.badgeText};margin:0;line-height:1.55;"`);

      // Save current page state then replace body with clean PDF-only HTML
      // (same technique as the original vanilla JS version — avoids Tailwind v4 lab() colors)
      const savedHTML = document.body.innerHTML;
      const savedScroll = window.scrollY;
      const savedOverflow = document.body.style.overflow;
      const savedBg = document.body.style.background;

      const pdfHTML = `<div id="pdf-export" style="width:700px;margin:0 auto;font-family:Inter,Helvetica,Arial,sans-serif;color:#1f2937;background:#fff;">
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
          <p style="font-size:12px;color:rgba(255,255,255,0.6);margin:0;line-height:1.5;">${fiche.summary}</p>
        </div>
        <div style="height:3px;background:${c.light};"></div>
        <div style="padding:28px 36px 20px;font-size:12.5px;line-height:1.75;color:#374151;">
          ${processedContent}
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

      // Replace body entirely so html2canvas sees no Tailwind lab() colors
      document.body.innerHTML = pdfHTML;
      document.body.style.overflow = 'auto';
      document.body.style.background = '#fff';
      // Strip Tailwind v4 stylesheets that use lab() color functions
      document.querySelectorAll('style, link[rel="stylesheet"]').forEach(s => s.remove());
      document.documentElement.style.background = '#fff';
      window.scrollTo(0, 0);

      const pdfEl = document.getElementById('pdf-export');

      await html2pdf().set({
        margin: [8, 12, 8, 12],
        filename: `fiche-${fiche.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, scrollX: 0, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }).from(pdfEl).save();

      // Restore the page — React will re-hydrate via full reload
      window.location.reload();
    } catch (err) {
      console.error('PDF generation error:', err);
    }
  }, [fiche, subject, premiumUser, user, onLoginRequired, onUpgradeRequired]);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal content */}
      <div className="relative z-10 max-w-3xl mx-auto mt-20 mb-10 mx-4">
        <div className="bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* Sticky header */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <span className={`px-3 py-1 ${colors.badge} text-xs font-bold rounded-full`}>
              {subject?.name || ''}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                title="Telecharger en PDF"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span className="hidden sm:inline">PDF</span>
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 md:px-8 py-6" id="fiche-modal-content">
            <h2 className="text-2xl font-black text-gray-900 mb-6">{fiche.title}</h2>
            <div
              className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: fiche.content }}
            />

            {/* Cours CTA */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {premiumUser ? (
                <Link
                  href={`/cours?id=${fiche.id}`}
                  className="flex items-center justify-between w-full px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200 rounded-2xl hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-900">Acceder au cours complet</p>
                      <p className="text-xs text-amber-600">Cours detaille avec explications approfondies</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              ) : (
                <button
                  onClick={() => !user ? onLoginRequired() : onUpgradeRequired()}
                  className="flex items-center justify-between w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-500">Cours complet</p>
                      <p className="text-xs text-gray-400">R&eacute;serv&eacute; aux membres Essentiel</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">Essentiel</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function FichesPage() {
  const { isEssentiel } = usePremium();
  const { user } = useAuth();
  const [currentSubject, setCurrentSubject] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedFiche, setSelectedFiche] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  /* ---------- Filtering ---------- */
  const filteredFiches = (() => {
    let fiches = currentSubject === 'all'
      ? FICHES_DATA
      : FICHES_DATA.filter(f => f.subject === currentSubject);
    if (search) {
      const q = search.toLowerCase();
      fiches = fiches.filter(f =>
        f.title.toLowerCase().includes(q) || f.summary.toLowerCase().includes(q)
      );
    }
    return fiches;
  })();

  /* ---------- Results counter text ---------- */
  const resultsText = (() => {
    if (search) {
      return filteredFiches.length === 0
        ? 'Aucune fiche trouvee'
        : `${filteredFiches.length} fiche${filteredFiches.length > 1 ? 's' : ''} trouvee${filteredFiches.length > 1 ? 's' : ''}`;
    }
    if (currentSubject === 'all') {
      return `${filteredFiches.length} fiches -- toutes les matieres`;
    }
    const sub = SUBJECTS.find(s => s.id === currentSubject);
    return `${filteredFiches.length} fiches en ${sub?.name || ''}`;
  })();

  /* ---------- Grouped vs flat rendering ---------- */
  const showGrouped = currentSubject === 'all' && !search;

  return (
    <>
      {/* ====== HERO ====== */}
      <section className="gradient-hero pt-28 pb-14 md:pt-36 md:pb-20 relative overflow-hidden">
        <div className="absolute w-[250px] h-[250px] bg-violet-300/10 rounded-full blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-indigo-200 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
                </span>
                <span className="text-sm font-semibold text-indigo-700">{FICHES_DATA.length} fiches disponibles</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-5">
                Fiches et{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  cours complets
                </span>{' '}
                en un clic
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                Revisez efficacement avec des <strong className="text-gray-900">fiches de revision</strong> synthetiques et des{' '}
                <strong className="text-gray-900">cours detailles</strong> couvrant le{' '}
                <strong className="text-gray-900">tronc commun</strong> du programme PASS/LAS. Chaque fiche est{' '}
                <strong className="text-gray-900">telechargeable en PDF</strong>.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-900">{FICHES_DATA.length}</div>
                    <div className="text-xs font-medium text-gray-500">Fiches &amp; cours</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200/60 hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-900">{SUBJECTS.length}</div>
                    <div className="text-xs font-medium text-gray-500">UE couvertes</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200/60 hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-900">PDF</div>
                    <div className="text-xs font-medium text-gray-500">Telechargeable</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: floating cards (decorative, desktop only) */}
            <FloatingSubjectCards />
          </div>
        </div>
      </section>

      {/* ====== SEARCH + FILTERS ====== */}
      <section className="py-4 -mt-6 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 p-4 md:p-5">
            {/* Search bar */}
            <div className="relative mb-3">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une fiche par titre ou mot-cle..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-[3px] focus:ring-indigo-500/15 transition-all"
              />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCurrentSubject('all')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  currentSubject === 'all'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
                </svg>
                Toutes
                <span className={`text-xs px-2 py-0.5 rounded-full ${currentSubject === 'all' ? 'bg-white/20' : 'text-gray-400'}`}>
                  {FICHES_DATA.length}
                </span>
              </button>
              {SUBJECTS.map((sub) => {
                const count = FICHES_DATA.filter(f => f.subject === sub.id).length;
                const isActive = currentSubject === sub.id;
                const iconPath = SUBJECT_ICONS[sub.id] || '';
                return (
                  <button
                    key={sub.id}
                    onClick={() => setCurrentSubject(sub.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                    </svg>
                    {sub.name}
                    <span className={`text-xs font-normal ${isActive ? 'text-white/70' : 'text-gray-400'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ====== RESULTS COUNTER ====== */}
      <section className="pt-1 pb-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 font-medium">{resultsText}</p>
        </div>
      </section>

      {/* ====== FICHES GRID ====== */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFiches.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Aucune fiche ne correspond a votre recherche</p>
              <p className="text-sm text-gray-400 mt-1">Essayez avec d&apos;autres mots-cles</p>
            </div>
          ) : showGrouped ? (
            /* Grouped by subject */
            SUBJECTS.map((sub) => {
              const subFiches = filteredFiches.filter(f => f.subject === sub.id);
              if (subFiches.length === 0) return null;
              const colors = getColors(sub);
              const iconPath = SUBJECT_ICONS[sub.id] || '';
              return (
                <div key={sub.id} className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${colors.light} ${colors.border} border flex items-center justify-center`}>
                      <svg className={`w-5 h-5 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{sub.name}</h2>
                      <p className="text-xs text-gray-500">{subFiches.length} fiches</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subFiches.map((f, i) => (
                      <FicheCard
                        key={f.id}
                        fiche={f}
                        index={i}
                        onOpen={setSelectedFiche}
                        premiumUser={isEssentiel} user={user} onLoginRequired={() => setShowLoginModal(true)} onUpgradeRequired={() => setShowUpgradeModal(true)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            /* Flat grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiches.map((f, i) => (
                <FicheCard
                  key={f.id}
                  fiche={f}
                  index={i}
                  onOpen={setSelectedFiche}
                  premiumUser={isEssentiel} user={user} onLoginRequired={() => setShowLoginModal(true)} onUpgradeRequired={() => setShowUpgradeModal(true)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====== MODAL ====== */}
      {selectedFiche && (
        <FicheModal
          fiche={selectedFiche}
          onClose={() => setSelectedFiche(null)}
          premiumUser={isEssentiel} user={user} onLoginRequired={() => setShowLoginModal(true)} onUpgradeRequired={() => setShowUpgradeModal(true)}
        />
      )}

      {/* Auth & Upgrade modals */}
      {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
      {showUpgradeModal && <UpgradeModal requiredTier="essentiel" onClose={() => setShowUpgradeModal(false)} />}
    </>
  );
}
