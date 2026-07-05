'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Prochaines sessions de concours connues (même référentiel que Pico côté dashboard)
const CONCOURS_DATES = ['2026-12-14', '2027-05-17'];

function daysToNextConcours() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const d of CONCOURS_DATES) {
    const diff = Math.round((new Date(d) - today) / 86400000);
    if (diff >= 0) return diff;
  }
  return null;
}

/**
 * Bandeau d'ancrage concours pour les pages publiques.
 * Urgence légitime (vraie deadline), masqué pour les utilisateurs connectés.
 * Calculé côté client pour éviter tout décalage d'hydratation.
 */
export default function ConcoursBanner() {
  const { user } = useAuth();
  const [days, setDays] = useState(null);

  useEffect(() => {
    setDays(daysToNextConcours());
  }, []);

  if (user || days == null) return null;

  return (
    <section className="py-5" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #7c3aed 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1.5 text-sm font-black text-white tabular-nums shrink-0">
              🎯 J-{days}
            </span>
            <p className="text-sm text-indigo-100 font-medium">
              avant le prochain concours — <strong className="text-white">ton futur toi te remerciera d&apos;avoir commencé aujourd&apos;hui.</strong>
            </p>
          </div>
          <Link
            href="/connexion"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/30"
          >
            Commencer gratuitement
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
