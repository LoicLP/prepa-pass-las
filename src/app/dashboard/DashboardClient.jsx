'use client';

import { useState, useMemo, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabaseStats } from '@/hooks/useSupabaseStats';
import { usePremium } from '@/contexts/PremiumContext';
import { useAuth } from '@/contexts/AuthContext';
import { SUBJECTS } from '@/data/subjects';
import { SUBJECT_COLORS, getSubjectName } from '@/data/constants';
import { formatDate, formatDuration, scoreClass, scoreBarClass } from '@/utils/format';

/* ========== HELPERS ========== */
function getSubjectBadgeColors(subjectId) {
  const subject = SUBJECTS.find(s => s.id === subjectId);
  return SUBJECT_COLORS[subject?.color] || SUBJECT_COLORS.primary;
}

const TYPE_BADGE = {
  QCM: 'bg-primary-100 text-primary-700',
  Examen: 'bg-violet-100 text-violet-700',
};

/* ========== SIDEBAR MENU ITEMS ========== */
const MENU_ITEMS = [
  {
    id: 'overview', label: 'Vue d\'ensemble', premium: false, color: 'primary',
    activeClasses: 'bg-primary-50 text-primary-700 border-primary-600',
    iconActiveClass: 'text-primary-600',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /></svg>,
  },
  {
    id: 'historique', label: 'Historique', premium: false, color: 'amber',
    activeClasses: 'bg-amber-50 text-amber-700 border-amber-600',
    iconActiveClass: 'text-amber-600',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg>,
  },
  {
    id: 'progression', label: 'Progression', premium: true, color: 'emerald',
    activeClasses: 'bg-emerald-50 text-emerald-700 border-emerald-600',
    iconActiveClass: 'text-emerald-600',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>,
  },
  {
    id: 'objectifs', label: 'Objectifs', premium: true, color: 'violet',
    activeClasses: 'bg-violet-50 text-violet-700 border-violet-600',
    iconActiveClass: 'text-violet-600',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>,
  },
  {
    id: 'classement', label: 'Classement', premium: true, color: 'rose',
    activeClasses: 'bg-rose-50 text-rose-700 border-rose-600',
    iconActiveClass: 'text-rose-600',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.52.587 6.023 6.023 0 0 1-2.52-.587" /></svg>,
  },
];

/* ========== MAIN PAGE ========== */
export default function DashboardPage() {
  const { user, loading: authLoading, accessToken } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(10);
  const [chartMode, setChartMode] = useState('epreuves');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion');
    }
  }, [authLoading, user, router]);

  const [qcmStats] = useSupabaseStats(user?.id, 'qcm_stats');
  const [examStats] = useSupabaseStats(user?.id, 'examen_stats');

  const { isPremiumPlus, tier } = usePremium();

  // ---- Tag sessions with type ----
  const allSessions = useMemo(() => [
    ...qcmStats.sessions.map(s => ({ ...s, _type: 'QCM' })),
    ...examStats.sessions.map(s => ({ ...s, _type: 'Examen' })),
  ], [qcmStats.sessions, examStats.sessions]);

  // ---- Sync aggregate stats in user_profiles for the leaderboard ----
  useEffect(() => {
    if (!user?.id) return;
    const avg = allSessions.length > 0
      ? Math.round(allSessions.reduce((s, x) => s + (x.percentage || 0), 0) / allSessions.length)
      : 0;
    const displayName = user.user_metadata?.full_name || user.displayName || null;
    if (!accessToken) return;
    fetch('/api/sync-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId: user.id,
        displayName,
        avgScore: avg,
        sessionCount: allSessions.length,
      }),
    }).catch(() => {});
  }, [allSessions, user?.id, accessToken, user?.user_metadata?.full_name, user?.displayName]);

  // ---- Centralized data computation ----
  const data = useMemo(() => {
    const today = new Date();
    const sorted = [...allSessions].filter(s => s.date).sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalSessions = allSessions.length;
    const avgScore = totalSessions > 0
      ? Math.round(allSessions.reduce((sum, s) => sum + (s.percentage || 0), 0) / totalSessions)
      : 0;
    const totalTime = allSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Streak
    const dateSet = new Set(sorted.map(s => s.date?.split('T')[0]).filter(Boolean));
    let currentStreak = 0;
    const d = new Date(today);
    if (!dateSet.has(d.toISOString().split('T')[0])) d.setDate(d.getDate() - 1);
    while (dateSet.has(d.toISOString().split('T')[0])) { currentStreak++; d.setDate(d.getDate() - 1); }

    let bestStreak = 0, tempStreak = 0, prevDate = null;
    const sortedDates = [...dateSet].sort();
    for (const ds of sortedDates) {
      const dt = new Date(ds);
      if (prevDate && (dt - prevDate) === 86400000) tempStreak++; else tempStreak = 1;
      bestStreak = Math.max(bestStreak, tempStreak);
      prevDate = dt;
    }

    // Trend
    const last10 = sorted.slice(-10);
    const last5Avg = last10.length >= 5 ? Math.round(last10.slice(-5).reduce((s, x) => s + (x.percentage || 0), 0) / 5) : null;
    const prev5Avg = last10.length >= 10 ? Math.round(last10.slice(0, 5).reduce((s, x) => s + (x.percentage || 0), 0) / 5) : null;
    const trend = (last5Avg !== null && prev5Avg !== null) ? (last5Avg > prev5Avg + 2 ? 'up' : last5Avg < prev5Avg - 2 ? 'down' : 'stable') : 'neutral';

    // This week
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    startOfThisWeek.setHours(0, 0, 0, 0);
    const thisWeekSessions = sorted.filter(s => new Date(s.date) >= startOfThisWeek).length;
    const thisWeekTime = sorted.filter(s => new Date(s.date) >= startOfThisWeek).reduce((sum, s) => sum + (s.duration || 0), 0);
    const startOfLastWeek = new Date(startOfThisWeek); startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const lastWeekTime = sorted.filter(s => { const dd = new Date(s.date); return dd >= startOfLastWeek && dd < startOfThisWeek; }).reduce((sum, s) => sum + (s.duration || 0), 0);

    // Subject stats
    const subjectStats = {};
    SUBJECTS.forEach(s => {
      const sess = allSessions.filter(x => x.subject === s.id);
      const avg = sess.length > 0 ? Math.round(sess.reduce((sum, x) => sum + (x.percentage || 0), 0) / sess.length) : 0;
      const bestScore = sess.length > 0 ? Math.max(...sess.map(x => x.percentage || 0)) : 0;
      subjectStats[s.id] = { id: s.id, name: s.name, color: s.color, avg, count: sess.length, bestScore, totalTime: sess.reduce((sum, x) => sum + (x.duration || 0), 0) };
    });
    const withSessions = Object.values(subjectStats).filter(s => s.count > 0);
    const sortedByAvg = [...withSessions].sort((a, b) => b.avg - a.avg);
    const strengths = sortedByAvg.slice(0, Math.min(2, Math.ceil(sortedByAvg.length / 2)));
    const strengthIds = new Set(strengths.map(s => s.id));
    const weaknesses = sortedByAvg.filter(s => !strengthIds.has(s.id)).slice(-2).reverse();

    // Recommendations (weakest subjects with sessions, up to 4)
    const recommendations = [...withSessions]
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 4)
      .map(s => ({
        ...s,
        scoreColor: s.avg < 50 ? 'rose' : s.avg < 65 ? 'amber' : 'sky',
        reason: s.avg < 50 ? 'À retravailler en priorité' : s.avg < 65 ? 'Score à consolider' : 'Bonne maîtrise — maintenir',
      }));

    // Recent 5
    const recent5 = [...allSessions].filter(s => s.date).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    // Score evolution (last 20)
    const last20 = sorted.slice(-20);
    const last5AvgFull = last20.length >= 5 ? Math.round(last20.slice(-5).reduce((s, x) => s + (x.percentage || 0), 0) / 5) : null;
    const prev5AvgFull = last20.length >= 10 ? Math.round(last20.slice(-10, -5).reduce((s, x) => s + (x.percentage || 0), 0) / 5) : null;

    // Type counts
    const qcmCount = qcmStats.sessions.length;
    const examCount = examStats.sessions.length;

    // Heatmap (90 days)
    const dayMap = {};
    sorted.forEach(s => { if (!s.date) return; const dk = new Date(s.date).toISOString().split('T')[0]; dayMap[dk] = (dayMap[dk] || 0) + 1; });
    const heatStart = new Date(today); heatStart.setDate(today.getDate() - 89);
    while (heatStart.getDay() !== 1) heatStart.setDate(heatStart.getDate() - 1);
    const heatmapDays = []; const hd = new Date(heatStart);
    while (hd <= today) { const key = hd.toISOString().split('T')[0]; heatmapDays.push({ date: new Date(hd), count: dayMap[key] || 0, key }); hd.setDate(hd.getDate() + 1); }
    const maxHeatCount = Math.max(...heatmapDays.map(x => x.count), 1);
    const weeks = []; for (let i = 0; i < heatmapDays.length; i += 7) weeks.push(heatmapDays.slice(i, i + 7));

    // This week heatmap
    const thisWeekStart = new Date(today); thisWeekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7)); thisWeekStart.setHours(0, 0, 0, 0);
    const thisWeekDays = [];
    for (let i = 0; i < 7; i++) { const dd = new Date(thisWeekStart); dd.setDate(dd.getDate() + i); const key = dd.toISOString().split('T')[0]; thisWeekDays.push({ date: new Date(dd), count: dayMap[key] || 0, key, label: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i] }); }
    const thisWeekActiveDays = thisWeekDays.filter(d => d.count > 0).length;

    const overallAvg = avgScore;
    const targetScore = Math.min(100, Math.ceil((overallAvg + 5) / 5) * 5);

    return {
      totalSessions, avgScore, totalTime, currentStreak, bestStreak, trend,
      thisWeekSessions, thisWeekTime, lastWeekTime,
      subjectStats, strengths, weaknesses,
      recent5, last20, last5Avg: last5AvgFull, prev5Avg: prev5AvgFull,
      qcmCount, examCount,
      weeks, maxHeatCount, thisWeekDays, thisWeekActiveDays,
      overallAvg, targetScore,
      hasAnySessions: totalSessions > 0,
      hasMultipleSubjects: withSessions.length >= 2,
      recommendations,
    };
  }, [allSessions, qcmStats.sessions, examStats.sessions]);

  // ---- Filtered history ----
  const filteredHistory = useMemo(() => {
    let sessions = allSessions;
    if (historyFilter !== 'all') {
      const filterMap = { qcm: 'QCM', examen: 'Examen' };
      sessions = sessions.filter(s => s._type === filterMap[historyFilter]);
    }
    return sessions.filter(s => s.date).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allSessions, historyFilter]);

  useEffect(() => { setVisibleCount(10); }, [historyFilter]);

  // ---- Chart data for score evolution ----
  const chartData = useMemo(() => {
    const sorted = [...allSessions].filter(s => s.date).sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sorted.length === 0) return [];

    if (chartMode === 'epreuves') {
      const sessions = isPremiumPlus ? sorted.slice(-20) : sorted.slice(-10);
      return sessions.map(s => ({
        label: new Date(s.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        value: s.percentage || Math.round((s.correct / s.total) * 100),
      }));
    }

    if (chartMode === 'jours') {
      const dayMap = {};
      sorted.forEach(s => {
        const key = s.date.split('T')[0];
        if (!dayMap[key]) dayMap[key] = [];
        dayMap[key].push(s.percentage || Math.round((s.correct / s.total) * 100));
      });
      const days = Object.entries(dayMap).sort(([a], [b]) => a.localeCompare(b));
      const sliced = isPremiumPlus ? days.slice(-30) : days.slice(-14);
      return sliced.map(([key, scores]) => ({
        label: new Date(key).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        value: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      }));
    }

    if (chartMode === 'semaines') {
      const weekMap = {};
      sorted.forEach(s => {
        const d = new Date(s.date);
        const monday = new Date(d);
        monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
        const key = monday.toISOString().split('T')[0];
        if (!weekMap[key]) weekMap[key] = [];
        weekMap[key].push(s.percentage || Math.round((s.correct / s.total) * 100));
      });
      const weeks = Object.entries(weekMap).sort(([a], [b]) => a.localeCompare(b));
      const sliced = isPremiumPlus ? weeks.slice(-12) : weeks.slice(-8);
      return sliced.map(([key, scores]) => ({
        label: new Date(key).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        value: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      }));
    }

    return [];
  }, [allSessions, chartMode, isPremiumPlus]);

  // Dynamic subtitle
  const heroSubtitle = !data.hasAnySessions
    ? 'Commencez votre premiere session pour suivre votre progression !'
    : data.currentStreak > 0
      ? `${data.currentStreak} jour${data.currentStreak > 1 ? 's' : ''} consécutif${data.currentStreak > 1 ? 's' : ''} — continue !`
      : 'Reprenez la ou vous vous etes arrete.';

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin w-10 h-10 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  // Donut chart data
  const segments = [
    { label: 'QCM', count: data.qcmCount, color: '#6366f1' },
    { label: 'Examens', count: data.examCount, color: '#8b5cf6' },
  ];
  let cumulative = 0;
  const totalTypeCount = data.qcmCount + data.examCount;
  const conicStops = segments.map(seg => {
    const start = cumulative;
    const end = cumulative + (seg.count / Math.max(totalTypeCount, 1)) * 100;
    cumulative = end;
    return `${seg.color} ${start}% ${end}%`;
  }).join(', ');

  const todaySubject = data.recommendations.length > 0 ? data.recommendations[0] : null;

  return (
    <div style={{ background: '#f6f5fb', height: '100vh', overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '100vh' }}>

        {/* ===== SIDEBAR ===== */}
        <DashboardSideNav
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isPremiumPlus={isPremiumPlus}
          tier={tier}
        />

        {/* ===== MAIN CONTENT ===== */}
        <main style={{ flex: 1, padding: '20px 36px', minWidth: 0, maxWidth: '100%', overflowY: 'auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>

          {/* GREETING */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexShrink: 0 }}>
            <div>
              <p style={{ fontSize: 13, color: '#5f6280', marginBottom: 4 }}>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <h1 className="font-jakarta" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, margin: 0, color: '#0f1020' }}>
                Bonjour {user.displayName ? user.displayName.split(' ')[0] : ''}
              </h1>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ece9ff', color: '#4f46e5', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
              {(user.displayName?.[0] || user.email?.[0] || '?').toUpperCase()}
            </div>
          </div>

          {/* ===== VUE D'ENSEMBLE ===== */}
          {activeSection === 'overview' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: 14, overflow: 'hidden' }}>
              {data.hasAnySessions
                ? <HeroFocusFilled todaySubject={todaySubject} weekSessions={data.thisWeekSessions} currentStreak={data.currentStreak} />
                : <HeroFocusEmpty />
              }
              <StatStripBar data={data} />
              {data.hasAnySessions ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 220px', gap: 14, flex: 1, minHeight: 0, overflow: 'hidden' }}>
                  <RecoListVertical recommendations={data.recommendations} />
                  <QuickActionCards />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 14, flex: 1, minHeight: 0, overflow: 'hidden' }}>
                  <SubjectPickerCard />
                  <QuickActionCards />
                </div>
              )}
              {/* Contact bas de page */}
              <Link href="/contact" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderRadius: 14, background: 'linear-gradient(to right, #fffbeb, #fff7ed)', border: '1px solid #fde68a', textDecoration: 'none', color: 'inherit' }} className="hover:border-amber-300 hover:shadow-sm transition-all group">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, background: '#fef3c7', borderRadius: 10, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f1020', margin: 0 }}>Un bug ou une suggestion ?</p>
                    <p style={{ fontSize: 11.5, color: '#5f6280', margin: 0 }}>Aidez-nous à améliorer la plateforme</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-amber-400 group-hover:text-amber-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>
          )}

          {/* Sections non-overview */}
          <div className={activeSection !== 'overview' ? 'space-y-6' : 'hidden'} style={{ flex: 1, minHeight: 0 }}>

            {/* ===== HISTORIQUE ===== */}
            {activeSection === 'historique' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 pb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Historique des sessions</h3>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { key: 'all', label: 'Tout', count: allSessions.length },
                      { key: 'qcm', label: 'QCM', count: data.qcmCount },
                      { key: 'examen', label: 'Examens', count: data.examCount },
                    ].map(f => (
                      <button key={f.key} onClick={() => setHistoryFilter(f.key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${historyFilter === f.key ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {f.label} ({f.count})
                      </button>
                    ))}
                  </div>
                </div>
                {filteredHistory.length === 0 ? (
                  <div className="px-6 pb-6">
                    <EmptyState title="Aucune session" description="Aucune session trouvee pour ce filtre." ctaHref="/qcm" ctaLabel="Commencer un QCM" />
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-100">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Matiere</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Theme</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Score</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Duree</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredHistory.slice(0, visibleCount).map((s, i) => {
                            const colors = getSubjectBadgeColors(s.subject);
                            const pct = s.percentage || Math.round((s.correct / s.total) * 100);
                            return (
                              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <td className="py-3 px-4 text-sm text-gray-500">{formatDate(s.date)}</td>
                                <td className="py-3 px-4"><span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${TYPE_BADGE[s._type] || TYPE_BADGE.QCM}`}>{s._type}</span></td>
                                <td className="py-3 px-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>{s.subjectName || getSubjectName(s.subject)}</span></td>
                                <td className="py-3 px-4 text-sm text-gray-700 hidden md:table-cell">{s.topic || '\u2014'}</td>
                                <td className="py-3 px-4"><div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${scoreBarClass(pct)}`} style={{ width: `${pct}%` }} /></div><span className={`text-sm font-bold ${scoreClass(pct)}`}>{pct}%</span></div></td>
                                <td className="py-3 px-4 text-sm text-gray-500">{formatDuration(s.duration)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {visibleCount < filteredHistory.length && (
                      <div className="p-4 text-center border-t border-gray-100">
                        <button onClick={() => setVisibleCount(v => v + 10)} className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                          Voir plus ({Math.min(visibleCount + 10, filteredHistory.length)} / {filteredHistory.length})
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ===== PROGRESSION (Premium) ===== */}
            {activeSection === 'progression' && (
              !isPremiumPlus ? (
                <PremiumLock title="Progression detaillee" description="Visualisez votre courbe de progression, vos points forts et axes d'amelioration avec Premium+." />
              ) : !data.hasAnySessions || data.last20.length < 2 ? (
                  <EmptyState title="Pas assez de donnees" description="Effectuez plusieurs sessions pour voir votre progression." ctaHref="/qcm" ctaLabel="Commencer un QCM" />
                ) : (
                  <>
                    {/* Score evolution */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Evolution des scores</h3>
                        <div className="flex items-center gap-2">
                          {data.trend === 'up' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>En progression</span>}
                          {data.trend === 'down' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 5.834 5.46l2.63 1.326m0 0 .311-6.228m-.311 6.228-5.94-2.281" /></svg>En baisse</span>}
                          {data.trend === 'stable' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Stable</span>}
                        </div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        {[
                          { key: 'epreuves', label: 'Par epreuve' },
                          { key: 'jours', label: 'Par jour' },
                          { key: 'semaines', label: 'Par semaine' },
                        ].map(f => (
                          <button key={f.key} onClick={() => setChartMode(f.key)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                              chartMode === f.key ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                      <ScoreLineChart points={chartData} />
                      {isPremiumPlus && data.last5Avg !== null && data.prev5Avg !== null && (
                        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-sm"><span className="text-gray-500">5 dernieres :</span><span className={`font-bold ${scoreClass(data.last5Avg)}`}>{data.last5Avg}%</span></div>
                          <div className="flex items-center gap-1.5 text-sm"><span className="text-gray-500">5 precedentes :</span><span className={`font-bold ${scoreClass(data.prev5Avg)}`}>{data.prev5Avg}%</span></div>
                          <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${data.last5Avg >= data.prev5Avg ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{data.last5Avg >= data.prev5Avg ? '+' : ''}{data.last5Avg - data.prev5Avg}%</span>
                        </div>
                      )}
                      {!isPremiumPlus && data.last20.length > 10 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                          <Link href="/tarifs" className="text-xs font-semibold text-primary-600 hover:text-primary-700">Voir les 20 dernieres sessions avec Premium+ →</Link>
                        </div>
                      )}
                    </div>

                    {/* Points forts & faiblesses */}
                    {data.hasMultipleSubjects && (
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>Points forts & axes d&apos;amelioration</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
                              Points forts
                            </h4>
                            <div className="space-y-3">
                              {(isPremiumPlus ? data.strengths : data.strengths.slice(0, 1)).map(s => {
                                const colors = SUBJECT_COLORS[s.color] || SUBJECT_COLORS.primary;
                                return (<div key={s.id} className={`p-3 rounded-xl border ${colors.border} ${colors.bg}`}><div className="flex justify-between items-center"><span className={`text-sm font-bold ${colors.text}`}>{s.name}</span><span className={`text-lg font-black ${scoreClass(s.avg)}`}>{s.avg}%</span></div><p className="text-[10px] text-gray-400 mt-0.5">{s.count} session{s.count > 1 ? 's' : ''}</p></div>);
                              })}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                              A ameliorer
                            </h4>
                            <div className="space-y-3">
                              {(isPremiumPlus ? data.weaknesses : data.weaknesses.slice(0, 1)).map(s => {
                                const colors = SUBJECT_COLORS[s.color] || SUBJECT_COLORS.primary;
                                return (<div key={s.id} className={`p-3 rounded-xl border ${colors.border} ${colors.bg}`}><div className="flex justify-between items-center"><span className={`text-sm font-bold ${colors.text}`}>{s.name}</span><span className={`text-lg font-black ${scoreClass(s.avg)}`}>{s.avg}%</span></div><p className="text-[10px] text-gray-400 mt-0.5">{s.count} session{s.count > 1 ? 's' : ''}</p></div>);
                              })}
                            </div>
                            {data.weaknesses.length > 0 && (
                              <Link href="/qcm" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700">
                                Travailler {data.weaknesses[0]?.name}
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                              </Link>
                            )}
                          </div>
                        </div>
                        {!isPremiumPlus && data.strengths.length > 1 && (
                          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                            <Link href="/tarifs" className="text-xs font-semibold text-primary-600 hover:text-primary-700">Voir l&apos;analyse complete avec Premium+ →</Link>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )
            )}

            {/* ===== OBJECTIFS (Premium) ===== */}
            {activeSection === 'objectifs' && (
              !isPremiumPlus ? (
                <PremiumLock title="Objectifs et statistiques detaillees" description="Suivez vos objectifs et visualisez la repartition de vos sessions avec Premium+." />
              ) : !data.hasAnySessions ? (
                <EmptyState title="Aucune donnee" description="Effectuez des sessions pour voir vos objectifs." ctaHref="/qcm" ctaLabel="Commencer un QCM" />
              ) : (
                <div className="space-y-6">
                  {/* Carte 1 : Objectifs de la semaine */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                      Objectifs de la semaine
                    </h3>
                    <div className="space-y-4">
                      {(() => {
                        const pct = Math.min(100, Math.round((data.thisWeekSessions / 5) * 100));
                        return (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Sessions réalisées</span>
                              <span className="text-sm font-bold text-gray-900">{data.thisWeekSessions}/5 {pct >= 100 && <span className="text-emerald-500">✓</span>}</span>
                            </div>
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })()}
                      {(() => {
                        const mins = Math.round(data.thisWeekTime / 60000);
                        const target = 120;
                        const pct = Math.min(100, Math.round((mins / target) * 100));
                        return (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Temps d&apos;étude</span>
                              <span className="text-sm font-bold text-gray-900">
                                {mins >= 60 ? `${Math.floor(mins / 60)}h${mins % 60 > 0 ? String(mins % 60).padStart(2, '0') : ''}` : `${mins} min`} / 2h
                                {pct >= 100 && <span className="text-emerald-500 ml-1">✓</span>}
                              </span>
                            </div>
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })()}
                      {(() => {
                        const pct = Math.min(100, Math.round((data.thisWeekActiveDays / 5) * 100));
                        return (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Jours actifs</span>
                              <span className="text-sm font-bold text-gray-900">{data.thisWeekActiveDays}/5 {pct >= 100 && <span className="text-emerald-500">✓</span>}</span>
                            </div>
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Carte 2 : Régularité */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                      Régularité
                    </h3>
                    <div className="flex justify-center">
                      <div className="bg-violet-50 rounded-xl p-4 text-center w-full">
                        <p className="text-3xl font-black text-violet-700">{data.currentStreak}</p>
                        <p className="text-xs font-medium text-violet-500 mt-1">Jours consécutifs</p>
                        <p className="text-xs text-gray-400 mt-1">Record : {data.bestStreak} jours</p>
                      </div>
                    </div>
                  </div>

                  {/* Carte 3 : Objectif score */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Objectif score
                    </h3>
                    <div className="flex items-center gap-6">
                      <MiniProgressRing value={data.overallAvg} max={data.targetScore} color="#8b5cf6" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">Score moyen : {data.overallAvg}%</p>
                        <p className="text-sm text-gray-500">Prochain palier : {data.targetScore}%</p>
                        {data.last5Avg !== null && data.prev5Avg !== null && (
                          <p className={`text-xs font-semibold mt-2 ${data.last5Avg > data.prev5Avg ? 'text-emerald-600' : data.last5Avg < data.prev5Avg ? 'text-red-500' : 'text-amber-600'}`}>
                            {data.last5Avg > data.prev5Avg
                              ? `En progression (+${data.last5Avg - data.prev5Avg} pts)`
                              : data.last5Avg < data.prev5Avg
                                ? `En baisse (${data.last5Avg - data.prev5Avg} pts)`
                                : 'Score stable'}
                          </p>
                        )}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>0%</span><span>Objectif 80%</span><span>100%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, data.overallAvg)}%` }} />
                            <div className="absolute top-0 h-full w-0.5 bg-gray-400" style={{ left: '80%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Carte 4 : Maîtrise par matière */}
                  {data.hasMultipleSubjects && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                        Maîtrise par matière
                      </h3>
                      <div className="space-y-3">
                        {Object.values(data.subjectStats)
                          .filter(s => s.count > 0)
                          .sort((a, b) => b.avg - a.avg)
                          .map(s => (
                            <div key={s.id}>
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                                  <span className="text-sm font-medium text-gray-700">{s.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">Record : {s.bestScore}%</span>
                                  <span className="text-sm font-bold text-gray-900">{s.avg}%</span>
                                </div>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.avg}%`, background: s.color }} />
                                <div className="absolute top-0 h-full w-0.5 bg-gray-300" style={{ left: '70%' }} />
                              </div>
                            </div>
                          ))}
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          <span className="w-3 h-0.5 bg-gray-300 inline-block"></span> Seuil recommandé : 70%
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Carte 5 : Répartition QCM / Examen */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                      Répartition des sessions
                    </h3>
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 shrink-0">
                        <div className="w-full h-full rounded-full" style={{ background: totalTypeCount > 0 ? `conic-gradient(${conicStops})` : '#e5e7eb' }} />
                        <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center"><span className="text-base font-black text-gray-900">{totalTypeCount}</span></div>
                      </div>
                      <div className="space-y-2">
                        {segments.map(seg => (
                          <div key={seg.label} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
                            <span className="text-sm text-gray-700">{seg.label}</span>
                            <span className="text-sm font-bold text-gray-900">{seg.count}</span>
                            <span className="text-xs text-gray-400">({totalTypeCount > 0 ? Math.round((seg.count / totalTypeCount) * 100) : 0}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* ===== CLASSEMENT (Premium) ===== */}
            {activeSection === 'classement' && (
              !isPremiumPlus ? (
                <PremiumLock title="Classement et comparaison" description="Comparez vos performances avec les autres etudiants grace a Premium+." />
              ) : (
                <ClassementSection allSessions={allSessions} userId={user?.id} accessToken={accessToken} />
              )
            )}

          </div>

        {/* ===== BANNIERE CONTACT ===== */}
        {activeSection !== 'overview' && (
          <div className="mt-8">
            <Link href="/contact" className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-50/80 to-orange-50/50 rounded-2xl border border-amber-100/60 shadow-sm hover:border-amber-200 hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152-6.135c-.22-2.057-1.907-3.555-3.967-3.555H8.912c-2.06 0-3.747 1.498-3.967 3.555A23.867 23.867 0 0 1 3.793 14.19c2.56-.932 5.324-1.44 8.207-1.44ZM12 6a2.25 2.25 0 1 0 0-4.5A2.25 2.25 0 0 0 12 6Z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Un bug ou une suggestion ?</p>
                  <p className="text-xs text-gray-500">Aidez-nous a ameliorer la plateforme.</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD SIDE NAV
   ============================================================ */
const UE_SIDEBAR = [
  { code: 'UE1', name: 'Chimie / Biochimie', id: 'chimie' },
  { code: 'UE2', name: 'Biologie cellulaire', id: 'biocell' },
  { code: 'UE3', name: 'Biophysique', id: 'biophysique' },
  { code: 'UE4', name: 'Biostatistiques', id: 'biostats' },
  { code: 'UE5', name: 'Anatomie', id: 'anatomie' },
  { code: 'UE6', name: 'SSH / Éthique', id: 'ssh' },
];

function DashboardSideNav({ activeSection, setActiveSection, isPremiumPlus, tier }) {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const { user, logOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try { await logOut(); router.push('/'); } catch (e) { console.error(e); }
  };

  const navItems = [
    {
      id: 'overview', label: "Vue d'ensemble",
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /></svg>,
    },
    {
      id: 'courses', label: 'Fiches & Cours', expandable: true, badge: '6 UE',
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5zM19 18v3H6" /></svg>,
    },
    {
      id: 'qcm', label: 'QCM', href: '/qcm',
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
    },
    {
      id: 'examen', label: 'Mode Examen', href: '/examen',
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h12l4 4v12H4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 13h8M8 17h6" /></svg>,
    },
    {
      id: 'historique', label: 'Historique',
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg>,
    },
    {
      id: 'progression', label: 'Progression', locked: !isPremiumPlus,
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>,
    },
    {
      id: 'objectifs', label: 'Objectifs', locked: !isPremiumPlus,
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>,
    },
    {
      id: 'classement', label: 'Classement', locked: !isPremiumPlus,
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172" /></svg>,
    },
  ];

  return (
    <nav
      className="hidden md:flex flex-col shrink-0"
      style={{ width: 220, background: '#fff', borderRight: '1px solid #eef0f7', padding: '0 16px 24px', minHeight: '100vh', position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh', overflowY: 'auto' }}
    >
      {/* ── Logo ── */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 10px 18px', textDecoration: 'none', borderBottom: '1px solid #eef0f7', marginBottom: 16 }}>
        <div style={{ width: 34, height: 34, background: '#4f46e5', borderRadius: 10, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
        </div>
        <div>
          <div className="font-jakarta" style={{ fontSize: 13.5, fontWeight: 800, color: '#0f1020', lineHeight: 1.2 }}>Prépa <span style={{ color: '#4f46e5' }}>PASS/LAS</span></div>
          <div style={{ fontSize: 9.5, letterSpacing: 0.8, color: '#8a8ea8', fontWeight: 600, textTransform: 'uppercase', marginTop: 1 }}>Tableau de bord</div>
        </div>
      </Link>

      <div style={{ fontSize: 10.5, letterSpacing: 1.4, fontWeight: 700, color: '#8a8ea8', padding: '0 10px 10px' }}>NAVIGATION</div>

      {navItems.map(item => {
        const isActive = activeSection === item.id;
        const isCourses = item.id === 'courses';

        if (item.href) {
          return (
            <Link key={item.id} href={item.href}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'transparent', color: '#2a2c44', fontSize: 14, fontWeight: 500, textDecoration: 'none', marginBottom: 2 }}
              className="hover:bg-gray-50 transition-colors"
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        }

        return (
          <Fragment key={item.id}>
            <button
              onClick={() => isCourses ? setCoursesOpen(o => !o) : (!item.locked && setActiveSection(item.id))}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, marginBottom: 2,
                background: isActive ? '#4f46e5' : 'transparent',
                color: isActive ? '#fff' : '#2a2c44',
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                border: 'none', cursor: item.locked ? 'default' : 'pointer',
                textAlign: 'left',
              }}
              className={isActive ? '' : 'hover:bg-gray-50 transition-colors'}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: isActive ? 'rgba(255,255,255,0.2)' : '#ece9ff', color: isActive ? '#fff' : '#4f46e5' }}>
                  {item.badge}
                </span>
              )}
              {isCourses && (
                <svg className="w-3 h-3 shrink-0 transition-transform" style={{ transform: coursesOpen ? 'rotate(90deg)' : 'rotate(0deg)', color: isActive ? '#fff' : '#8a8ea8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              )}
              {item.locked && (
                <svg className="w-3.5 h-3.5 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              )}
            </button>

            {isCourses && coursesOpen && (
              <div style={{ marginLeft: 24, borderLeft: '1px solid #eef0f7', paddingLeft: 4, marginBottom: 6 }}>
                {UE_SIDEBAR.map(ue => (
                  <Link key={ue.code} href={`/fiches`}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, fontSize: 12.5, color: '#2a2c44', textDecoration: 'none' }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <span style={{ fontFamily: 'monospace', fontSize: 10.5, fontWeight: 700, color: '#4f46e5', minWidth: 24 }}>{ue.code}</span>
                    <span>{ue.name}</span>
                  </Link>
                ))}
                <Link href="/fiches" style={{ display: 'block', padding: '6px 10px', fontSize: 12, fontWeight: 600, color: '#4f46e5', textDecoration: 'none' }}>
                  Toutes les fiches →
                </Link>
              </div>
            )}
          </Fragment>
        );
      })}

      {/* Espace + bas de sidebar */}
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        {/* Premium upsell card */}
        {tier === 'gratuit' && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #4f46e5 0%, #8257f9 100%)', color: '#fff' }}>
              <div style={{ fontSize: 11, letterSpacing: 1.2, fontWeight: 700, opacity: 0.8, marginBottom: 4 }}>PLAN GRATUIT</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, lineHeight: 1.3 }}>Débloquez Progression, Objectifs & Classement</div>
              <Link href="/tarifs" style={{ display: 'block', background: '#fff', color: '#4f46e5', borderRadius: 8, padding: 8, fontWeight: 700, fontSize: 12, textAlign: 'center', textDecoration: 'none' }}>
                Passer Premium →
              </Link>
            </div>
          </div>
        )}

        {/* Séparateur + déconnexion */}
        <div style={{ borderTop: '1px solid #eef0f7', paddingTop: 12 }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '0 10px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#ece9ff', color: '#4f46e5', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                {(user.displayName?.[0] || user.email?.[0] || '?').toUpperCase()}
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: '#2a2c44', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || user.email}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, background: 'transparent', border: 'none', color: '#e45770', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}
            className="hover:bg-rose-50 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Se déconnecter
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ============================================================
   HERO FOCUS CARDS
   ============================================================ */
function HeroFocusEmpty() {
  return (
    <div style={{ borderRadius: 18, padding: '20px 28px', flexShrink: 0, background: 'linear-gradient(135deg, #312c6e 0%, #4f46e5 60%, #8257f9 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 10.5, letterSpacing: 1.6, fontWeight: 700, opacity: 0.75, marginBottom: 8 }}>BIENVENUE</div>
        <div className="font-jakarta" style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.6, marginBottom: 8 }}>
          Par quelle matière voulez-vous commencer ?
        </div>
        <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.45, maxWidth: 520 }}>
          Choisissez une UE ci-dessous — on lance directement un entraînement personnalisé.
        </div>
      </div>
    </div>
  );
}

function HeroFocusFilled({ todaySubject, weekSessions, currentStreak }) {
  const weekTarget = 10;
  const weekPct = Math.min(1, weekSessions / weekTarget);
  const circumference = 2 * Math.PI * 32;

  return (
    <div style={{ borderRadius: 18, padding: '20px 28px', flexShrink: 0, background: 'linear-gradient(135deg, #312c6e 0%, #4f46e5 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24, alignItems: 'center' }}>
        <div>
          {currentStreak > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span>🔥</span>
              <span style={{ fontSize: 10.5, letterSpacing: 1.4, fontWeight: 700, opacity: 0.9 }}>JOUR {currentStreak} · STREAK</span>
            </div>
          )}
          <div className="font-jakarta" style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.6, marginBottom: 8 }}>
            {todaySubject
              ? `Aujourd'hui : 30 min sur ${todaySubject.name}`
              : 'Continuez sur votre lancée !'}
          </div>
          <div style={{ fontSize: 13.5, opacity: 0.85, lineHeight: 1.45, maxWidth: 480, marginBottom: 16 }}>
            {todaySubject
              ? `Basé sur vos scores, c'est la matière qui vous bloque le plus. Objectif : passer de ${todaySubject.avg}% à ${Math.min(100, todaySubject.avg + 13)}% cette semaine.`
              : 'Votre progression est sur la bonne voie. Continuez à pratiquer régulièrement.'}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/qcm" style={{ background: '#fff', color: '#4f46e5', borderRadius: 10, padding: '9px 18px', fontWeight: 700, fontSize: 13.5, textDecoration: 'none', display: 'inline-block' }}>
              {todaySubject ? `Réviser — ${todaySubject.name} →` : 'Lancer un QCM →'}
            </Link>
            <Link href="/qcm" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 10, padding: '9px 14px', fontWeight: 500, fontSize: 13.5, textDecoration: 'none', display: 'inline-block' }}>
              Changer de sujet
            </Link>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10.5, letterSpacing: 1.2, fontWeight: 700, opacity: 0.8, marginBottom: 10 }}>OBJECTIF DE LA SEMAINE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <svg width="72" height="72" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
              <circle cx="40" cy="40" r="32" fill="none" stroke="#fff" strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - weekPct)}
                strokeLinecap="round" transform="rotate(-90 40 40)" />
              <text x="40" y="46" textAnchor="middle" fontSize="18" fontWeight="800" fill="#fff">{weekSessions}/{weekTarget}</text>
            </svg>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Sessions effectuées</div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                {weekTarget - weekSessions > 0
                  ? `Plus que ${weekTarget - weekSessions} pour l'objectif`
                  : 'Objectif atteint 🎉'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STAT STRIP (horizontal bar)
   ============================================================ */
function StatStripBar({ data }) {
  const stats = [
    {
      icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /></svg>,
      iconColor: '#e8a948', iconBg: '#fdf4e2',
      label: 'Streak', value: data.currentStreak > 0 ? `${data.currentStreak}j` : '0j',
      delta: data.currentStreak > 0 ? `Record ${data.bestStreak}j` : null,
    },
    {
      icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>,
      iconColor: '#3eb489', iconBg: '#e0f3eb',
      label: 'Score moyen', value: data.hasAnySessions ? `${data.avgScore}%` : '—',
      delta: data.hasAnySessions && data.last5Avg !== null && data.prev5Avg !== null
        ? `${data.last5Avg >= data.prev5Avg ? '+' : ''}${data.last5Avg - data.prev5Avg}%`
        : null,
    },
    {
      icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>,
      iconColor: '#4f8ff7', iconBg: '#e4edff',
      label: 'Cette semaine', value: `${data.thisWeekSessions}`,
      delta: data.thisWeekSessions > 0 ? `sessions` : null,
    },
    {
      icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
      iconColor: '#4f46e5', iconBg: '#ece9ff',
      label: 'Temps total', value: data.hasAnySessions ? formatDuration(data.totalTime) : '—',
      delta: null,
    },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eef0f7', flexShrink: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {stats.map((s, i) => (
        <div key={i} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderRight: i < 3 ? '1px solid #eef0f7' : 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: s.iconBg, color: s.iconColor, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            {s.icon}
          </div>
          <div>
            <div style={{ fontSize: 10.5, letterSpacing: 0.8, fontWeight: 600, color: '#5f6280', textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span className="font-jakarta" style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.5, color: '#0f1020' }}>{s.value}</span>
              {s.delta && <span style={{ fontSize: 10.5, fontWeight: 700, color: '#3eb489' }}>{s.delta}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   RECO LIST VERTICAL
   ============================================================ */
function RecoListVertical({ recommendations }) {
  const colorMap = {
    rose:  { bg: '#fbe5ea', fg: '#e45770' },
    amber: { bg: '#fdf4e2', fg: '#e8a948' },
    sky:   { bg: '#e4edff', fg: '#4f8ff7' },
  };

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eef0f7', padding: 6, gridColumn: 'span 2', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="font-jakarta" style={{ fontSize: 16, fontWeight: 700, color: '#0f1020' }}>À revoir cette semaine</div>
          <div style={{ fontSize: 12.5, color: '#5f6280' }}>Sélectionné pour vous · mis à jour à chaque session</div>
        </div>
        <Link href="/qcm" style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
          Tout travailler →
        </Link>
      </div>
      {recommendations.map((rec, i) => {
        const c = colorMap[rec.scoreColor] || colorMap.sky;
        const colors = SUBJECT_COLORS[rec.color] || SUBJECT_COLORS.primary;
        return (
          <Link href="/qcm" key={i}
            style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 14, alignItems: 'center', padding: '12px 14px', borderRadius: 10, textDecoration: 'none', color: 'inherit' }}
            className="hover:bg-gray-50 transition-colors"
          >
            <div style={{ width: 42, height: 42, borderRadius: 10, background: c.bg, color: c.fg, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
              {rec.avg}%
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f1020' }}>{rec.name}</div>
              <div style={{ fontSize: 12, color: '#5f6280', marginTop: 2 }}>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold mr-1 ${colors.badge}`}>{rec.count} session{rec.count > 1 ? 's' : ''}</span>
                {rec.reason}
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: '#5f6280' }}>~20 min</div>
            <div style={{ background: '#f4f2ff', color: '#4f46e5', borderRadius: 8, padding: '8px 14px', fontWeight: 600, fontSize: 12.5, flexShrink: 0 }}>
              Réviser
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ============================================================
   QUICK ACTION CARDS (sidebar column)
   ============================================================ */
function QuickActionCards() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Link href="/qcm"
        style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #eef0f7', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}
        className="hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ece9ff', color: '#4f46e5', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        </div>
        <div>
          <div className="font-jakarta" style={{ fontSize: 13.5, fontWeight: 700, color: '#0f1020' }}>Lancer un QCM</div>
          <div style={{ fontSize: 11.5, color: '#5f6280' }}>Entraînement libre</div>
        </div>
      </Link>
      <Link href="/examen"
        style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #eef0f7', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}
        className="hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fbe5ea', color: '#e45770', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg>
        </div>
        <div>
          <div className="font-jakarta" style={{ fontSize: 13.5, fontWeight: 700, color: '#0f1020' }}>Examen blanc</div>
          <div style={{ fontSize: 11.5, color: '#5f6280' }}>Conditions réelles</div>
        </div>
      </Link>
    </div>
  );
}

/* ============================================================
   HOW IT WORKS (empty state card)
   ============================================================ */
function HowItWorksCard() {
  const steps = [
    { n: 1, t: 'Passez le QCM de calibrage', d: '20 questions réparties sur les 6 matières' },
    { n: 2, t: 'Recevez votre plan personnalisé', d: 'On identifie vos points faibles et vos priorités' },
    { n: 3, t: 'Révisez chaque jour', d: '30 min suffisent pour progresser et maintenir votre streak' },
  ];
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eef0f7', padding: '18px 20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="font-jakarta" style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#0f1020' }}>Comment ça marche</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: 'flex', gap: 12, padding: '11px 0', borderTop: i === 0 ? 'none' : '1px solid #f3f4f8' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#ece9ff', color: '#4f46e5', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12.5, flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: '#0f1020' }}>{s.t}</div>
              <div style={{ fontSize: 12, color: '#5f6280', marginTop: 2 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SUBJECT PICKER CARD (onboarding empty state)
   ============================================================ */
const SUBJECT_PICKER_DATA = [
  { code: 'UE1', id: 'chimie',      name: 'Chimie / Biochimie',  accent: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  { code: 'UE2', id: 'biocell',     name: 'Biologie cellulaire', accent: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  { code: 'UE3', id: 'biophysique', name: 'Biophysique',          accent: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  { code: 'UE4', id: 'biostats',    name: 'Biostatistiques',      accent: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
  { code: 'UE5', id: 'anatomie',    name: 'Anatomie',             accent: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
  { code: 'UE6', id: 'ssh',         name: 'SSH / Éthique',        accent: '#e11d48', bg: '#fff1f2', border: '#fecdd3' },
];

function SubjectPickerCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eef0f7', padding: '18px 20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="font-jakarta" style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#0f1020' }}>Choisissez votre UE</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {SUBJECT_PICKER_DATA.map(({ code, id, name, accent, bg, border }) => (
          <Link
            key={id}
            href={`/qcm?subject=${id}`}
            style={{ padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${border}`, background: bg, textDecoration: 'none', display: 'block' }}
            className="hover:-translate-y-0.5 hover:shadow-sm transition-all"
          >
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: accent, marginBottom: 3 }}>{code}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f1020' }}>{name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */
function StatCard({ label, value, icon, badge, trend, sublabel, tint, hint }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm hover:-translate-y-[2px] transition-transform flex flex-col justify-between min-h-[112px] ${tint || 'bg-white border-gray-100'}`}>
      <div className="flex items-center gap-2.5 mb-3">
        {icon}
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{label}</span>
        {badge && <span className="text-base ml-auto">{badge}</span>}
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
          {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
          {trend === 'up' && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">↑</span>}
          {trend === 'down' && <span className="text-xs font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded-full">↓</span>}
          {trend === 'stable' && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">→</span>}
        </div>
        {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
      </div>
    </div>
  );
}

/* ============================================================
   RECOMMENDATION CARD
   ============================================================ */
function RecommendationCard({ rec }) {
  const colorConfig = {
    rose:  { bg: 'bg-rose-50',   border: 'border-rose-100',  badge: 'bg-rose-100 text-rose-700',   ring: 'bg-rose-100 text-rose-600',   score: 'text-rose-600'   },
    amber: { bg: 'bg-amber-50',  border: 'border-amber-100', badge: 'bg-amber-100 text-amber-700', ring: 'bg-amber-100 text-amber-600', score: 'text-amber-600'  },
    sky:   { bg: 'bg-sky-50',    border: 'border-sky-100',   badge: 'bg-sky-100 text-sky-700',     ring: 'bg-sky-100 text-sky-600',     score: 'text-sky-600'    },
  };
  const c = colorConfig[rec.scoreColor] || colorConfig.sky;
  const colors = SUBJECT_COLORS[rec.color] || SUBJECT_COLORS.primary;

  return (
    <Link
      href="/qcm"
      className={`group ${c.bg} border ${c.border} rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-md transition-all`}
    >
      <span className={`self-start text-xs font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>
        {rec.name}
      </span>
      <div className="flex-1">
        <p className="text-xs text-gray-500 mt-1">{rec.count} session{rec.count > 1 ? 's' : ''} effectuée{rec.count > 1 ? 's' : ''}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 font-medium">{rec.reason}</p>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black ${c.ring}`}>
          {rec.avg}%
        </div>
      </div>
    </Link>
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
function EmptyState({ title, description, ctaHref, ctaLabel, userName }) {
  const displayTitle = userName ? `Prêt${userName ? ' ' + userName : ''} ?` : title;
  const displayDesc = userName
    ? 'Lancez un premier QCM pour calibrer votre niveau. Vos stats s\'afficheront ici en temps réel.'
    : description;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{userName ? displayTitle : title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{userName ? displayDesc : description}</p>
      {ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex px-6 py-3 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
        >
          {ctaLabel || 'Commencer maintenant'}
        </Link>
      )}
    </div>
  );
}

/* ============================================================
   PREMIUM LOCK
   ============================================================ */
function PremiumLock({ title, description }) {
  return (
    <div className="relative">
      <div className="pointer-events-none select-none" style={{ filter: 'blur(5px)' }}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-64">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-5/6 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-3 gap-3"><div className="h-16 bg-gray-100 rounded-lg"></div><div className="h-16 bg-gray-100 rounded-lg"></div><div className="h-16 bg-gray-100 rounded-lg"></div></div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-8 max-w-sm mx-4">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-5">{description}</p>
          <Link href="/tarifs" className="inline-flex px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25">Passer au Premium+</Link>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MINI PROGRESS RING
   ============================================================ */
function MiniProgressRing({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative w-20 h-20 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-gray-900">{pct}%</span>
    </div>
  );
}

/* ============================================================
   SCORE LINE CHART
   ============================================================ */
function ScoreLineChart({ points }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!points || points.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">Pas assez de donnees pour afficher le graphique.</p>;
  }

  const W = 600;
  const H = 200;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 24;
  const padBottom = 32;
  const chartW = W - padLeft - padRight;
  const chartH = H - padTop - padBottom;

  const minVal = 0;
  const maxVal = 100;

  const getX = (i) => padLeft + (points.length === 1 ? chartW / 2 : (i / (points.length - 1)) * chartW);
  const getY = (v) => padTop + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const linePoints = points.map((p, i) => `${getX(i)},${getY(p.value)}`).join(' ');
  const areaPath = `M${getX(0)},${getY(points[0].value)} ${points.map((p, i) => `L${getX(i)},${getY(p.value)}`).join(' ')} L${getX(points.length - 1)},${padTop + chartH} L${getX(0)},${padTop + chartH} Z`;

  const yTicks = [0, 25, 50, 75, 100];

  // Show fewer X labels on small datasets
  const maxLabels = points.length <= 10 ? points.length : Math.min(points.length, 8);
  const labelStep = Math.max(1, Math.ceil(points.length / maxLabels));

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet" onMouseLeave={() => setHoveredIndex(null)}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines */}
        {yTicks.map(tick => (
          <g key={tick}>
            <line x1={padLeft} y1={getY(tick)} x2={W - padRight} y2={getY(tick)} stroke="#e5e7eb" strokeWidth="1" strokeDasharray={tick === 0 ? 'none' : '4 4'} />
            <text x={padLeft - 6} y={getY(tick) + 4} textAnchor="end" className="text-[10px]" fill="#9ca3af">{tick}%</text>
          </g>
        ))}

        {/* Filled area under curve */}
        <path d={areaPath} fill="url(#chartGradient)" />

        {/* Main curve line */}
        <polyline points={linePoints} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points + hover zones */}
        {points.map((p, i) => {
          const cx = getX(i);
          const cy = getY(p.value);
          const isHovered = hoveredIndex === i;
          return (
            <g key={i} onMouseEnter={() => setHoveredIndex(i)} style={{ cursor: 'pointer' }}>
              {/* Invisible wider hit area */}
              <circle cx={cx} cy={cy} r={16} fill="transparent" />
              {/* Visible point */}
              <circle cx={cx} cy={cy} r={isHovered ? 5.5 : 3.5} fill={isHovered ? '#6366f1' : '#fff'} stroke="#6366f1" strokeWidth="2" style={{ transition: 'r 0.15s ease' }} />
              {/* Tooltip */}
              {isHovered && (
                <g>
                  <rect x={cx - 24} y={cy - 28} width="48" height="20" rx="6" fill="#1f2937" />
                  <text x={cx} y={cy - 15} textAnchor="middle" fill="#fff" className="text-[11px]" fontWeight="700">{p.value}%</text>
                </g>
              )}
            </g>
          );
        })}

        {/* X-axis labels */}
        {points.map((p, i) => {
          if (i % labelStep !== 0 && i !== points.length - 1) return null;
          return (
            <text key={i} x={getX(i)} y={H - 6} textAnchor="middle" className="text-[10px]" fill="#9ca3af">{p.label}</text>
          );
        })}
      </svg>
    </div>
  );
}

/* ============================================================
   FAKE USERS DATA (120 utilisateurs simulés)
   ============================================================ */
// drift > 0 : tendance à la hausse sur les semaines | drift < 0 : tendance à la baisse
// weekAmplitude : amplitude du cycle hebdomadaire (±N points), défaut 5
const BASE_USERS = [
  // Top performers (~20) — avg 58-75, sessions 80-250
  { name: 'Emma L.',     baseAvg: 75, baseSessions: 230, growth: 0.18 },
  { name: 'Lucas M.',    baseAvg: 73, baseSessions: 210, growth: 0.16, drift: -0.8 },  // ↘ glisse doucement
  { name: 'Jade F.',     baseAvg: 72, baseSessions: 195, growth: 0.17, drift: 0.6 },   // ↗ progresse
  { name: 'Hugo D.',     baseAvg: 71, baseSessions: 185, growth: 0.15 },
  { name: 'Chloé B.',    baseAvg: 70, baseSessions: 178, growth: 0.14, weekAmplitude: 10 }, // volatile
  { name: 'Arthur C.',   baseAvg: 69, baseSessions: 165, growth: 0.15, drift: -1.2 },  // ↘ chute notable
  { name: 'Léa R.',      baseAvg: 68, baseSessions: 158, growth: 0.13, drift: 1.0 },   // ↗ forte progression
  { name: 'Inès T.',     baseAvg: 67, baseSessions: 148, growth: 0.14 },
  { name: 'Raphaël K.',  baseAvg: 66, baseSessions: 140, growth: 0.12, weekAmplitude: 9 }, // volatile
  { name: 'Alice G.',    baseAvg: 65, baseSessions: 132, growth: 0.13, drift: 0.5 },   // ↗ légère hausse
  { name: 'Gabriel N.',  baseAvg: 64, baseSessions: 125, growth: 0.11 },
  { name: 'Lina P.',     baseAvg: 63, baseSessions: 120, growth: 0.12, drift: -0.6 },  // ↘ légère baisse
  { name: 'Théo A.',     baseAvg: 63, baseSessions: 115, growth: 0.11, drift: 1.2 },   // ↗ montée rapide
  { name: 'Margot V.',   baseAvg: 62, baseSessions: 110, growth: 0.10 },
  { name: 'Noah S.',     baseAvg: 61, baseSessions: 105, growth: 0.11, weekAmplitude: 11 }, // très volatile
  { name: 'Zoé H.',      baseAvg: 61, baseSessions: 98,  growth: 0.10, drift: 0.4 },
  { name: 'Adam B.',     baseAvg: 60, baseSessions: 95,  growth: 0.09 },
  { name: 'Juliette M.', baseAvg: 59, baseSessions: 92,  growth: 0.10, drift: -0.9 }, // ↘ baisse
  { name: 'Louis R.',    baseAvg: 59, baseSessions: 88,  growth: 0.09, drift: 0.7 },   // ↗
  { name: 'Rose D.',     baseAvg: 58, baseSessions: 85,  growth: 0.08 },
  // Mid-range bons (~35) — avg 43-57, sessions 40-100
  { name: 'Nathan P.',   baseAvg: 56, baseSessions: 95,  growth: 0.08, drift: 1.3 },   // ↗ forte montée
  { name: 'Camille V.',  baseAvg: 55, baseSessions: 90,  growth: 0.08 },
  { name: 'Jules A.',    baseAvg: 55, baseSessions: 88,  growth: 0.07, drift: -1.0 },  // ↘
  { name: 'Sarah H.',    baseAvg: 54, baseSessions: 85,  growth: 0.08, weekAmplitude: 8 },
  { name: 'Mathis L.',   baseAvg: 54, baseSessions: 82,  growth: 0.07, drift: 0.8 },
  { name: 'Eva P.',      baseAvg: 53, baseSessions: 78,  growth: 0.07 },
  { name: 'Léo T.',      baseAvg: 52, baseSessions: 76,  growth: 0.06, drift: -0.7 },
  { name: 'Anaïs M.',    baseAvg: 52, baseSessions: 74,  growth: 0.07, drift: 1.1 },   // ↗
  { name: 'Tom B.',      baseAvg: 51, baseSessions: 72,  growth: 0.06 },
  { name: 'Clara D.',    baseAvg: 51, baseSessions: 70,  growth: 0.06, weekAmplitude: 9 },
  { name: 'Maxime R.',   baseAvg: 50, baseSessions: 68,  growth: 0.05, drift: -0.5 },
  { name: 'Manon S.',    baseAvg: 50, baseSessions: 66,  growth: 0.06 },
  { name: 'Enzo C.',     baseAvg: 49, baseSessions: 64,  growth: 0.05, drift: 0.9 },   // ↗
  { name: 'Charlotte F.',baseAvg: 49, baseSessions: 62,  growth: 0.06 },
  { name: 'Axel N.',     baseAvg: 48, baseSessions: 60,  growth: 0.05, drift: -1.1 },  // ↘
  { name: 'Ambre G.',    baseAvg: 48, baseSessions: 58,  growth: 0.05, weekAmplitude: 10 },
  { name: 'Victor J.',   baseAvg: 47, baseSessions: 56,  growth: 0.04 },
  { name: 'Océane K.',   baseAvg: 47, baseSessions: 55,  growth: 0.05, drift: 0.6 },
  { name: 'Paul E.',     baseAvg: 46, baseSessions: 53,  growth: 0.04 },
  { name: 'Mila B.',     baseAvg: 46, baseSessions: 52,  growth: 0.05, drift: -0.4 },
  { name: 'Antoine L.',  baseAvg: 45, baseSessions: 50,  growth: 0.04, drift: 1.0 },   // ↗
  { name: 'Clémence R.', baseAvg: 45, baseSessions: 48,  growth: 0.04 },
  { name: 'Alexandre D.',baseAvg: 44, baseSessions: 47,  growth: 0.04, weekAmplitude: 8 },
  { name: 'Lucie S.',    baseAvg: 44, baseSessions: 46,  growth: 0.04 },
  { name: 'Romain H.',   baseAvg: 44, baseSessions: 45,  growth: 0.03, drift: -0.8 },
  { name: 'Pauline T.',  baseAvg: 43, baseSessions: 44,  growth: 0.04 },
  { name: 'Émile V.',    baseAvg: 43, baseSessions: 43,  growth: 0.03, drift: 0.7 },
  { name: 'Yasmine A.',  baseAvg: 43, baseSessions: 42,  growth: 0.04 },
  { name: 'Bastien M.',  baseAvg: 43, baseSessions: 41,  growth: 0.03, drift: 1.2 },   // ↗ forte montée
  { name: 'Noémie C.',   baseAvg: 43, baseSessions: 40,  growth: 0.03 },
  { name: 'Valentin P.', baseAvg: 43, baseSessions: 40,  growth: 0.03, weekAmplitude: 7 },
  { name: 'Marine F.',   baseAvg: 43, baseSessions: 40,  growth: 0.03 },
  { name: 'Simon G.',    baseAvg: 43, baseSessions: 40,  growth: 0.03, drift: -0.6 },
  { name: 'Elisa B.',    baseAvg: 43, baseSessions: 40,  growth: 0.03 },
  { name: 'Tristan K.',  baseAvg: 43, baseSessions: 40,  growth: 0.03 },
  // Mid-range moyens (~30) — avg 27-42, sessions 20-50
  { name: 'Maëlys D.',   baseAvg: 41, baseSessions: 48,  growth: 0.03, drift: 0.8 },   // ↗
  { name: 'Corentin R.', baseAvg: 40, baseSessions: 45,  growth: 0.03 },
  { name: 'Justine L.',  baseAvg: 39, baseSessions: 43,  growth: 0.02, drift: -0.9 },  // ↘
  { name: 'Dylan M.',    baseAvg: 38, baseSessions: 42,  growth: 0.03, weekAmplitude: 9 },
  { name: 'Agathe S.',   baseAvg: 38, baseSessions: 40,  growth: 0.02 },
  { name: 'Kylian T.',   baseAvg: 37, baseSessions: 38,  growth: 0.02, drift: 1.0 },   // ↗
  { name: 'Léonie V.',   baseAvg: 37, baseSessions: 37,  growth: 0.02 },
  { name: 'Mattéo F.',   baseAvg: 36, baseSessions: 36,  growth: 0.02, drift: -0.5 },
  { name: 'Alicia N.',   baseAvg: 36, baseSessions: 35,  growth: 0.02 },
  { name: 'Robin H.',    baseAvg: 35, baseSessions: 34,  growth: 0.02, weekAmplitude: 8 },
  { name: 'Célia P.',    baseAvg: 35, baseSessions: 33,  growth: 0.02 },
  { name: 'Nolan G.',    baseAvg: 34, baseSessions: 32,  growth: 0.02, drift: 0.6 },
  { name: 'Laura J.',    baseAvg: 34, baseSessions: 31,  growth: 0.01 },
  { name: 'Sacha B.',    baseAvg: 33, baseSessions: 30,  growth: 0.02, drift: -1.0 },  // ↘
  { name: 'Capucine E.', baseAvg: 33, baseSessions: 29,  growth: 0.01 },
  { name: 'Thibault A.', baseAvg: 32, baseSessions: 28,  growth: 0.02, drift: 0.8 },
  { name: 'Lola K.',     baseAvg: 32, baseSessions: 27,  growth: 0.01 },
  { name: 'Quentin D.',  baseAvg: 31, baseSessions: 26,  growth: 0.01, weekAmplitude: 7 },
  { name: 'Romane C.',   baseAvg: 31, baseSessions: 25,  growth: 0.01 },
  { name: 'Baptiste L.', baseAvg: 30, baseSessions: 25,  growth: 0.01, drift: -0.7 },
  { name: 'Margaux V.',  baseAvg: 30, baseSessions: 24,  growth: 0.01 },
  { name: 'Alexis R.',   baseAvg: 29, baseSessions: 23,  growth: 0.01, drift: 0.5 },
  { name: 'Héloïse M.',  baseAvg: 29, baseSessions: 23,  growth: 0.01 },
  { name: 'Florian T.',  baseAvg: 28, baseSessions: 22,  growth: 0.01 },
  { name: 'Salomé H.',   baseAvg: 28, baseSessions: 22,  growth: 0.01, weekAmplitude: 8 },
  { name: 'Aurélien F.', baseAvg: 27, baseSessions: 21,  growth: 0.01, drift: 0.9 },   // ↗ de bas en haut
  { name: 'Nina S.',     baseAvg: 27, baseSessions: 21,  growth: 0.01 },
  // Débutants/casuals (~20) — avg 10-22, sessions 8-25
  { name: 'Timothée P.', baseAvg: 22, baseSessions: 22,  growth: 0.01, drift: 1.1 },   // ↗ surprise
  { name: 'Élise G.',    baseAvg: 21, baseSessions: 20,  growth: 0.01 },
  { name: 'Dorian B.',   baseAvg: 20, baseSessions: 19,  growth: 0.01, drift: -0.4 },
  { name: 'Maëlle J.',   baseAvg: 19, baseSessions: 18,  growth: 0.01 },
  { name: 'Kévin N.',    baseAvg: 19, baseSessions: 17,  growth: 0.005, weekAmplitude: 9 },
  { name: 'Lilou D.',    baseAvg: 18, baseSessions: 16,  growth: 0.01, drift: 0.6 },
  { name: 'Rémi A.',     baseAvg: 17, baseSessions: 15,  growth: 0.005 },
  { name: 'Apolline C.', baseAvg: 17, baseSessions: 15,  growth: 0.005, drift: -0.5 },
  { name: 'Erwan K.',    baseAvg: 16, baseSessions: 14,  growth: 0.005 },
  { name: 'Constance L.',baseAvg: 15, baseSessions: 13,  growth: 0.005, drift: 0.7 },
  { name: 'Gabin R.',    baseAvg: 15, baseSessions: 12,  growth: 0.005 },
  { name: 'Adèle V.',    baseAvg: 14, baseSessions: 12,  growth: 0.005, weekAmplitude: 8 },
  { name: 'Mathieu T.',  baseAvg: 13, baseSessions: 11,  growth: 0.003 },
  { name: 'Victoire F.', baseAvg: 13, baseSessions: 10,  growth: 0.005, drift: -0.6 },
  { name: 'Clément S.',  baseAvg: 12, baseSessions: 10,  growth: 0.003 },
  { name: 'Alix M.',     baseAvg: 11, baseSessions: 9,   growth: 0.003, drift: 0.8 },
  { name: 'Loïs H.',     baseAvg: 11, baseSessions: 9,   growth: 0.003 },
  { name: 'Diane P.',    baseAvg: 10, baseSessions: 8,   growth: 0.003 },
  { name: 'Eliott B.',   baseAvg: 10, baseSessions: 8,   growth: 0.003, weekAmplitude: 10 },
  { name: 'Faustine G.', baseAvg: 10, baseSessions: 8,   growth: 0.003 },
  // Inactifs (~15) — avg 4-15, sessions 1-10, pas de croissance
  { name: 'Timéo H.',    baseAvg: 15, baseSessions: 8,   growth: 0 },
  { name: 'Léna F.',     baseAvg: 13, baseSessions: 7,   growth: 0 },
  { name: 'Malo R.',     baseAvg: 12, baseSessions: 6,   growth: 0 },
  { name: 'Iris D.',     baseAvg: 11, baseSessions: 5,   growth: 0 },
  { name: 'Ethan J.',    baseAvg: 10, baseSessions: 5,   growth: 0 },
  { name: 'Lison V.',    baseAvg: 9,  baseSessions: 4,   growth: 0 },
  { name: 'Oscar T.',    baseAvg: 8,  baseSessions: 4,   growth: 0 },
  { name: 'Célestine B.',baseAvg: 7,  baseSessions: 3,   growth: 0 },
  { name: 'Ismaël K.',   baseAvg: 7,  baseSessions: 3,   growth: 0 },
  { name: 'Colombe A.',  baseAvg: 6,  baseSessions: 3,   growth: 0 },
  { name: 'Ruben M.',    baseAvg: 6,  baseSessions: 2,   growth: 0 },
  { name: 'Éléonore S.', baseAvg: 5,  baseSessions: 2,   growth: 0 },
  { name: 'Naël C.',     baseAvg: 5,  baseSessions: 2,   growth: 0 },
  { name: 'Blanche L.',  baseAvg: 4,  baseSessions: 1,   growth: 0 },
  { name: 'Solal P.',    baseAvg: 4,  baseSessions: 1,   growth: 0 },
];

// Pool de prénoms pour la génération des 440 utilisateurs supplémentaires
const EXTRA_FIRST_NAMES = [
  'Axelle','Brice','Carla','Damien','Elisa','Florent','Gwen','Hadrien','Ilona','Julien',
  'Karine','Lenny','Maud','Nicolas','Ophélie','Pierre','Quintine','Rachel','Sébastien','Tatiana',
  'Ugo','Vanessa','William','Xénia','Yann','Zélie','Adrien','Bérénice','Cyril','Delphine',
  'Edouard','Fanny','Grégoire','Hannah','Idriss','Jessica','Kevin','Lucie','Mélodie','Noé',
  'Oriane','Patrick','Quentin','Roxane','Stéphane','Thibaut','Ulrike','Véronique','Xavier','Yoann',
  'Anaëlle','Baptiste','Céleste','Dimitri','Estelle','Fabien','Gaëlle','Hugo','Isabelle','Jordan',
  'Kévin','Laure','Mickaël','Nora','Océane','Pauline','Quentin','Rayan','Sylvain','Théodore',
  'Ursula','Valentine','Walid','Yolande','Zohra','Arnaud','Bénédicte','Christophe','Daphné',
];
const EXTRA_INITIALS = ['A.','B.','C.','D.','E.','F.','G.','H.','J.','K.','L.','M.','N.','P.','R.','S.','T.','V.'];

function generateFakeUsers() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today - startOfYear) / 86400000);
  const weekOfYear = Math.floor(dayOfYear / 7);

  // — Utilisateurs nommés (BASE_USERS) —
  const namedUsers = BASE_USERS.map((u, i) => {
    const seed = Math.sin((dayOfYear + 1) * (i + 1) * 9301) * 10000;
    const rand = Math.abs(seed - Math.floor(seed));

    // Cycle hebdomadaire unique par utilisateur (phase décalée)
    const amp = u.weekAmplitude ?? 5;
    const phase = (i * 2.3 + weekOfYear * 1.7) % (2 * Math.PI);
    const weekCycle = Math.round(Math.sin(phase) * amp);

    // Variation journalière ±2
    const dayVar = Math.round((rand - 0.5) * 4);

    // Tendance long terme : plafonnée à ±15 pts
    const driftEffect = u.drift
      ? Math.max(-15, Math.min(15, Math.round(weekOfYear * u.drift * 0.4)))
      : 0;

    const avg = Math.max(10, Math.min(98, u.baseAvg + weekCycle + dayVar + driftEffect));

    const sessionGrowth = Math.floor(dayOfYear * u.growth);
    const sessionVar = Math.floor(rand * 3);
    const sessions = u.baseSessions + sessionGrowth + sessionVar;

    return { name: u.name, avg, sessions };
  });

  // — 440 utilisateurs supplémentaires générés (total ≈ 560) —
  const extraUsers = [];
  const extraCount = 440;
  for (let i = 0; i < extraCount; i++) {
    const idx = namedUsers.length + i;
    const seed = Math.sin((dayOfYear + 1) * (idx + 1) * 9301) * 10000;
    const rand = Math.abs(seed - Math.floor(seed));

    // Nom pseudo-aléatoire déterministe
    const fnSeed = Math.abs(Math.sin(idx * 7919) * 10000);
    const lnSeed = Math.abs(Math.sin(idx * 3571) * 10000);
    const firstName = EXTRA_FIRST_NAMES[Math.floor(fnSeed % EXTRA_FIRST_NAMES.length)];
    const initial  = EXTRA_INITIALS[Math.floor(lnSeed % EXTRA_INITIALS.length)];

    // Score de base : distribution concentrée entre 10 et 50
    const baseSeed = Math.abs(Math.sin(idx * 1301) * 10000);
    const baseAvg = 10 + Math.floor((baseSeed % 10000) / 10000 * 40);

    // Cycle hebdomadaire ±5
    const phase = (idx * 2.3 + weekOfYear * 1.7) % (2 * Math.PI);
    const weekCycle = Math.round(Math.sin(phase) * 5);
    const dayVar = Math.round((rand - 0.5) * 4);

    // Quelques-uns ont un drift (≈ 1 sur 4)
    const hasDrift = (idx % 4 === 0);
    const driftVal = hasDrift ? (idx % 8 < 4 ? 0.5 : -0.5) : 0;
    const driftEffect = hasDrift
      ? Math.max(-10, Math.min(10, Math.round(weekOfYear * driftVal * 0.4)))
      : 0;

    const avg = Math.max(10, Math.min(98, baseAvg + weekCycle + dayVar + driftEffect));

    // Sessions entre 5 et 120
    const baseSessions = 5 + Math.floor((baseSeed % 10000) / 10000 * 115);
    const sessions = baseSessions + Math.floor(rand * 5);

    extraUsers.push({ name: `${firstName} ${initial}`, avg, sessions });
  }

  return [...namedUsers, ...extraUsers];
}

/* ============================================================
   SCORE LISSÉ (moyenne bayésienne)
   Pondère le score par le nombre de sessions pour éviter qu'un
   utilisateur avec 1 seul QCM parfait se retrouve en tête.
   Formule : (n * avg + C * globalAvg) / (n + C)
   C = 20 sessions de confiance, globalAvg = 52 %
   ============================================================ */
const BAYES_C = 20;       // sessions de confiance
const BAYES_AVG = 52;     // moyenne globale estimée

function smoothedScore(avg, sessions) {
  if (sessions === 0) return 0;
  const bayes = (sessions * avg + BAYES_C * BAYES_AVG) / (sessions + BAYES_C);
  return Math.min(avg, bayes); // jamais au-dessus de la vraie moyenne
}

/* ============================================================
   CLASSEMENT SECTION
   ============================================================ */
function ClassementSection({ allSessions, userId, accessToken }) {
  const userAvg = allSessions.length > 0 ? Math.round(allSessions.reduce((sum, s) => sum + (s.percentage || 0), 0) / allSessions.length) : 0;
  const userSessionCount = allSessions.length;
  const [expandedGaps, setExpandedGaps] = useState(new Set());
  const [realUsers, setRealUsers] = useState([]);

  // Charger les vrais utilisateurs depuis Supabase (authentifié)
  useEffect(() => {
    if (!accessToken) return;
    fetch('/api/leaderboard', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
      .then(r => r.json())
      .then(d => setRealUsers(d.users || []))
      .catch(() => {});
  }, [accessToken]);

  const fakeUsers = generateFakeUsers();

  // Formater les vrais utilisateurs (prénom + initiale) en excluant l'utilisateur courant
  const realFormatted = realUsers
    .filter(u => u.id !== userId)
    .map(u => {
      const parts = (u.display_name || 'Anonyme').trim().split(' ');
      const firstName = parts[0];
      const initial = parts[1] ? parts[1][0].toUpperCase() + '.' : '';
      return {
        name: initial ? `${firstName} ${initial}` : firstName,
        avg: Math.round(u.avg_score || 0),
        sessions: u.session_count || 0,
        isReal: true,
      };
    });

  // Fusionner faux + vrais utilisateurs, calculer le score lissé une seule fois
  const allRanked = [...fakeUsers, ...realFormatted, { name: 'Vous', avg: userAvg, sessions: userSessionCount, isUser: true }]
    .map(u => ({ ...u, score: Math.round(smoothedScore(u.avg, u.sessions)) }))
    .sort((a, b) => b.score - a.score);
  const userRank = allRanked.findIndex(u => u.isUser) + 1;
  const totalParticipants = allRanked.length;
  const percentile = Math.round(((totalParticipants - userRank) / totalParticipants) * 100);
  const medals = ['🥇', '🥈', '🥉'];

  // Afficher les 10 premiers + les 5 autour de l'utilisateur + les 3 derniers
  const baseVisible = new Set();
  for (let i = 0; i < Math.min(10, allRanked.length); i++) baseVisible.add(i);
  const userIdx = userRank - 1;
  for (let i = Math.max(0, userIdx - 3); i <= Math.min(allRanked.length - 1, userIdx + 3); i++) baseVisible.add(i);
  for (let i = Math.max(0, allRanked.length - 3); i < allRanked.length; i++) baseVisible.add(i);
  const baseIndices = [...baseVisible].sort((a, b) => a - b);

  // Identifier les gaps et ajouter les indices des gaps expandés
  const gaps = [];
  for (let p = 1; p < baseIndices.length; p++) {
    if (baseIndices[p] - baseIndices[p - 1] > 1) {
      const from = baseIndices[p - 1] + 1;
      const to = baseIndices[p] - 1;
      gaps.push({ from, to, key: `${from}-${to}` });
    }
  }

  const visibleSet = new Set(baseVisible);
  for (const gap of gaps) {
    if (expandedGaps.has(gap.key)) {
      for (let i = gap.from; i <= gap.to; i++) visibleSet.add(i);
    }
  }
  const visibleIndices = [...visibleSet].sort((a, b) => a - b);

  const toggleGap = (gapKey) => {
    setExpandedGaps(prev => {
      const next = new Set(prev);
      if (next.has(gapKey)) next.delete(gapKey);
      else next.add(gapKey);
      return next;
    });
  };

  // Construire les lignes du tableau
  const rows = [];
  let gapIdx = 0;
  for (let pos = 0; pos < visibleIndices.length; pos++) {
    const idx = visibleIndices[pos];
    // Vérifier s'il y a un gap avant cette ligne
    if (pos > 0 && visibleIndices[pos - 1] < idx - 1) {
      const gap = gaps.find(g => g.from === visibleIndices[pos - 1] + 1);
      if (gap) {
        rows.push({ type: 'gap', gap });
      }
    }
    rows.push({ type: 'user', idx, user: allRanked[idx] });
  }

  return (
    <div className="space-y-6">
      {/* Explication du classement */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <div className="text-sm text-amber-800 leading-relaxed">
          <p className="font-semibold mb-1">Comment fonctionne le classement ?</p>
          <p>Le score affiché est <span className="font-semibold">pondéré par ton nombre de sessions</span> — un résultat isolé ne suffit pas à grimper en tête. Plus tu t'entraînes régulièrement, plus ton score reflète fidèlement ton niveau réel. Le classement se met à jour à chaque connexion.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Classement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Votre position</p><p className="text-3xl font-black text-gray-900">{userRank}<span className="text-lg text-gray-400">/{totalParticipants}</span></p></div>
          <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Percentile</p><p className="text-3xl font-black text-primary-600">Top {Math.max(1, 100 - percentile)}%</p></div>
          <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Score moyen</p><p className={`text-3xl font-black ${scoreClass(userAvg)}`}>{userAvg}%</p></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">Rang</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Étudiant</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Score</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sessions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                if (row.type === 'gap') {
                  const isExpanded = expandedGaps.has(row.gap.key);
                  const hiddenCount = row.gap.to - row.gap.from + 1;
                  return (
                    <tr key={`gap-${row.gap.key}`} onClick={() => toggleGap(row.gap.key)} className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <td colSpan="4" className="py-2 text-center text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                          {isExpanded ? (
                            <>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                              Masquer
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                              Afficher {hiddenCount} étudiant{hiddenCount > 1 ? 's' : ''}
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                }
                const u = row.user;
                const rank = row.idx + 1;
                const medal = rank <= 3 ? medals[rank - 1] : `${rank}`;
                return (
                  <tr key={row.idx} className={`border-b hover:bg-gray-50/50 ${u.isUser ? 'bg-primary-50 border-primary-200 font-bold' : 'border-gray-50'}`}>
                    <td className="py-3 px-4 text-center text-lg">{medal}</td>
                    <td className={`py-3 px-4 text-sm ${u.isUser ? 'text-primary-700 font-bold' : 'text-gray-700'}`}>{u.name}</td>
                    <td className="py-3 px-4"><span className={`text-sm font-bold ${scoreClass(u.avg)}`}>{u.avg}%</span></td>
                    <td className="py-3 px-4 text-sm text-gray-500">{u.sessions}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}