'use client';

import { useState, useMemo, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
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
  const { user, loading: authLoading } = useAuth();
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

  const [qcmStats] = useLocalStorage('prepa-qcm-stats', { sessions: [], totalCorrect: 0, totalAnswered: 0 });
  const [examStats] = useLocalStorage('prepa-examen-stats', { sessions: [], totalCorrect: 0, totalAnswered: 0 });

  const { isPremiumPlus } = usePremium();

  // ---- Tag sessions with type ----
  const allSessions = useMemo(() => [
    ...qcmStats.sessions.map(s => ({ ...s, _type: 'QCM' })),
    ...examStats.sessions.map(s => ({ ...s, _type: 'Examen' })),
  ], [qcmStats.sessions, examStats.sessions]);

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

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="gradient-hero noise-overlay dot-grid pt-28 pb-10 md:pt-36 md:pb-14 relative overflow-hidden">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-4">
            {user.displayName ? (
              <>Bonjour <span className="bg-gradient-to-r from-primary-600 via-violet-500 to-primary-600 bg-clip-text text-transparent">{user.displayName.split(' ')[0]}</span> !</>
            ) : (
              <>Mon <span className="bg-gradient-to-r from-primary-600 via-violet-500 to-primary-600 bg-clip-text text-transparent">tableau de bord</span></>
            )}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {data.currentStreak > 0 && <span className="mr-1">🔥</span>}
            {heroSubtitle}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ===== ACTIONS RAPIDES ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/qcm" className="group flex items-center gap-4 p-5 bg-gradient-to-br from-primary-50/40 to-white rounded-2xl border border-primary-100/50 shadow-sm hover:border-primary-300 hover:shadow-lg hover:shadow-primary-600/10 hover:-translate-y-[2px] transition-all">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-200 transition-colors">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">Lancer un QCM</p>
              <p className="text-xs text-gray-500 mt-0.5">Entrainez-vous librement</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>
          <Link href="/examen" className="group flex items-center gap-4 p-5 bg-gradient-to-br from-violet-50/40 to-white rounded-2xl border border-violet-100/50 shadow-sm hover:border-violet-300 hover:shadow-lg hover:shadow-violet-600/10 hover:-translate-y-[2px] transition-all">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-violet-200 transition-colors">
              <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 group-hover:text-violet-700 transition-colors">Passer un examen</p>
              <p className="text-xs text-gray-500 mt-0.5">Conditions reelles</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-violet-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>

        {/* ===== METRIQUES CLES ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Jours consecutifs" value={data.currentStreak > 0 ? `${data.currentStreak}j` : '0j'} badge={data.currentStreak > 0 ? '🔥' : null} tint="bg-amber-50/60 border-amber-100" icon={<svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /></svg>} />
          <StatCard label="Score moyen" value={data.hasAnySessions ? `${data.avgScore}%` : '--'} trend={data.trend} tint="bg-emerald-50/60 border-emerald-100" icon={<svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>} />
          <StatCard label="Cette semaine" value={`${data.thisWeekSessions}`} sublabel={data.thisWeekSessions === 1 ? 'session' : 'sessions'} tint="bg-primary-50/60 border-primary-100" icon={<svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>} />
          <StatCard label="Temps total" value={data.hasAnySessions ? formatDuration(data.totalTime) : '--'} tint="bg-violet-50/60 border-violet-100" icon={<svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} />
        </div>

        {/* ===== MOBILE: HORIZONTAL PILLS ===== */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
          {MENU_ITEMS.map(item => {
            const isActive = activeSection === item.id;
            const showLock = item.premium && !isPremiumPlus;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? `${item.activeClasses} shadow-sm border border-current/10`
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {showLock && (
                  <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                )}
              </button>
            );
          })}
        </div>

        {/* ===== SIDEBAR + CONTENT ===== */}
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <nav className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-1">
              <div className="px-3 py-2 mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Navigation</p>
              </div>
              {MENU_ITEMS.map(item => {
                const isActive = activeSection === item.id;
                const showLock = item.premium && !isPremiumPlus;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                      isActive
                        ? `${item.activeClasses} font-semibold border-l-[3px] pl-[9px]`
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={isActive ? item.iconActiveClass : 'text-gray-400'}>{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {showLock && (
                      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main content area */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* ===== VUE D'ENSEMBLE ===== */}
            {activeSection === 'overview' && (
              <>
                {!data.hasAnySessions ? (
                  <EmptyState title="Aucune session effectuee" description="Lancez un QCM ou un examen pour commencer a suivre votre progression." ctaHref="/qcm" ctaLabel="Commencer un QCM" />
                ) : (
                  <>
                    {/* Maitrise par matiere */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-500"></span>Maitrise par matiere</h3>
                      <div className="space-y-4">
                        {SUBJECTS.map(s => ({ ...s, ...(data.subjectStats[s.id] || { avg: 0, count: 0 }) })).sort((a, b) => b.count - a.count).map(s => {
                          const colors = SUBJECT_COLORS[s.color] || SUBJECT_COLORS.primary;
                          const aboveAvg = s.avg > data.avgScore;
                          return (
                            <div key={s.id}>
                              <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-700">{s.name}</span>
                                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{s.count} session{s.count > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {s.count > 0 && <span className={`text-[10px] font-semibold ${aboveAvg ? 'text-emerald-500' : 'text-red-400'}`}>{aboveAvg ? '▲' : '▼'}</span>}
                                  <span className={`text-sm font-bold ${scoreClass(s.avg)}`}>{s.avg > 0 ? `${s.avg}%` : '\u2014'}</span>
                                </div>
                              </div>
                              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${colors.bar} transition-all`} style={{ width: `${s.avg}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dernieres sessions */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-400"></span>Dernieres sessions</h3>
                      <div className="space-y-3">
                        {data.recent5.map((s, i) => {
                          const subjectColors = getSubjectBadgeColors(s.subject);
                          const pct = s.percentage || Math.round((s.correct / s.total) * 100);
                          return (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${TYPE_BADGE[s._type] || TYPE_BADGE.QCM}`}>{s._type}</span>
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${subjectColors.badge}`}>{s.subjectName || getSubjectName(s.subject)}</span>
                                {s.topic && <span className="text-xs text-gray-500 truncate max-w-[200px]">{s.topic}</span>}
                              </div>
                              <div className="flex items-center gap-3 sm:ml-auto">
                                <div className="flex items-center gap-2 flex-1 sm:flex-none">
                                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${scoreBarClass(pct)}`} style={{ width: `${pct}%` }} /></div>
                                  <span className={`text-sm font-bold ${scoreClass(pct)} min-w-[36px]`}>{pct}%</span>
                                </div>
                                <span className="text-xs text-gray-400">{formatDate(s.date)}</span>
                                <span className="text-xs text-gray-400">{formatDuration(s.duration)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-violet-50 rounded-xl p-4 text-center">
                        <p className="text-3xl font-black text-violet-700">{data.currentStreak}</p>
                        <p className="text-xs font-medium text-violet-500 mt-1">Jours consécutifs</p>
                        <p className="text-xs text-gray-400 mt-1">Record : {data.bestStreak} jours</p>
                      </div>
                      <div className="bg-indigo-50 rounded-xl p-4 text-center">
                        {(() => {
                          const thisW = Math.round(data.thisWeekTime / 60000);
                          const lastW = Math.round(data.lastWeekTime / 60000);
                          const diff = lastW > 0 ? Math.round(((thisW - lastW) / lastW) * 100) : (thisW > 0 ? 100 : 0);
                          return (
                            <>
                              <p className="text-3xl font-black text-indigo-700">
                                {thisW >= 60 ? `${Math.floor(thisW / 60)}h${thisW % 60 > 0 ? String(thisW % 60).padStart(2, '0') : ''}` : `${thisW}m`}
                              </p>
                              <p className="text-xs font-medium text-indigo-500 mt-1">Cette semaine</p>
                              <p className={`text-xs mt-1 font-semibold ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                {diff > 0 ? `↑ +${diff}%` : diff < 0 ? `↓ ${diff}%` : '→ Identique'} vs sem. passée
                              </p>
                            </>
                          );
                        })()}
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
                <ClassementSection allSessions={allSessions} />
              )
            )}
          </div>
        </div>

        {/* ===== BANNIERE CONTACT ===== */}
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
      </div>
    </>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */
function StatCard({ label, value, icon, badge, trend, sublabel, tint }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm hover:-translate-y-[2px] transition-transform ${tint || 'bg-white border-gray-100'}`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        {badge && <span className="text-base">{badge}</span>}
      </div>
      <div className="flex items-center gap-2">
        <p className="text-2xl font-black text-gray-900">{value}</p>
        {sublabel && <span className="text-xs text-gray-400 mt-1">{sublabel}</span>}
        {trend === 'up' && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">↑</span>}
        {trend === 'down' && <span className="text-xs font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded-full">↓</span>}
        {trend === 'stable' && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">→</span>}
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
function EmptyState({ title, description, ctaHref, ctaLabel }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" /></svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-5">{description}</p>
      {ctaHref && <Link href={ctaHref} className="inline-flex px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25">{ctaLabel || 'Commencer maintenant'}</Link>}
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
const BASE_USERS = [
  // Top performers (~20) — avg 78-95, sessions 80-250
  { name: 'Emma L.', baseAvg: 94, baseSessions: 230, growth: 0.18 },
  { name: 'Lucas M.', baseAvg: 92, baseSessions: 210, growth: 0.16 },
  { name: 'Jade F.', baseAvg: 91, baseSessions: 195, growth: 0.17 },
  { name: 'Hugo D.', baseAvg: 89, baseSessions: 185, growth: 0.15 },
  { name: 'Chloé B.', baseAvg: 88, baseSessions: 178, growth: 0.14 },
  { name: 'Arthur C.', baseAvg: 87, baseSessions: 165, growth: 0.15 },
  { name: 'Léa R.', baseAvg: 86, baseSessions: 158, growth: 0.13 },
  { name: 'Inès T.', baseAvg: 85, baseSessions: 148, growth: 0.14 },
  { name: 'Raphaël K.', baseAvg: 84, baseSessions: 140, growth: 0.12 },
  { name: 'Alice G.', baseAvg: 83, baseSessions: 132, growth: 0.13 },
  { name: 'Gabriel N.', baseAvg: 82, baseSessions: 125, growth: 0.11 },
  { name: 'Lina P.', baseAvg: 82, baseSessions: 120, growth: 0.12 },
  { name: 'Théo A.', baseAvg: 81, baseSessions: 115, growth: 0.11 },
  { name: 'Margot V.', baseAvg: 80, baseSessions: 110, growth: 0.10 },
  { name: 'Noah S.', baseAvg: 80, baseSessions: 105, growth: 0.11 },
  { name: 'Zoé H.', baseAvg: 79, baseSessions: 98, growth: 0.10 },
  { name: 'Adam B.', baseAvg: 79, baseSessions: 95, growth: 0.09 },
  { name: 'Juliette M.', baseAvg: 78, baseSessions: 92, growth: 0.10 },
  { name: 'Louis R.', baseAvg: 78, baseSessions: 88, growth: 0.09 },
  { name: 'Rose D.', baseAvg: 78, baseSessions: 85, growth: 0.08 },
  // Mid-range bons (~35) — avg 65-77, sessions 40-100
  { name: 'Nathan P.', baseAvg: 77, baseSessions: 95, growth: 0.08 },
  { name: 'Camille V.', baseAvg: 76, baseSessions: 90, growth: 0.08 },
  { name: 'Jules A.', baseAvg: 76, baseSessions: 88, growth: 0.07 },
  { name: 'Sarah H.', baseAvg: 75, baseSessions: 85, growth: 0.08 },
  { name: 'Mathis L.', baseAvg: 75, baseSessions: 82, growth: 0.07 },
  { name: 'Eva P.', baseAvg: 74, baseSessions: 78, growth: 0.07 },
  { name: 'Léo T.', baseAvg: 74, baseSessions: 76, growth: 0.06 },
  { name: 'Anaïs M.', baseAvg: 73, baseSessions: 74, growth: 0.07 },
  { name: 'Tom B.', baseAvg: 73, baseSessions: 72, growth: 0.06 },
  { name: 'Clara D.', baseAvg: 72, baseSessions: 70, growth: 0.06 },
  { name: 'Maxime R.', baseAvg: 72, baseSessions: 68, growth: 0.05 },
  { name: 'Manon S.', baseAvg: 71, baseSessions: 66, growth: 0.06 },
  { name: 'Enzo C.', baseAvg: 71, baseSessions: 64, growth: 0.05 },
  { name: 'Charlotte F.', baseAvg: 70, baseSessions: 62, growth: 0.06 },
  { name: 'Axel N.', baseAvg: 70, baseSessions: 60, growth: 0.05 },
  { name: 'Ambre G.', baseAvg: 69, baseSessions: 58, growth: 0.05 },
  { name: 'Victor J.', baseAvg: 69, baseSessions: 56, growth: 0.04 },
  { name: 'Océane K.', baseAvg: 68, baseSessions: 55, growth: 0.05 },
  { name: 'Paul E.', baseAvg: 68, baseSessions: 53, growth: 0.04 },
  { name: 'Mila B.', baseAvg: 68, baseSessions: 52, growth: 0.05 },
  { name: 'Antoine L.', baseAvg: 67, baseSessions: 50, growth: 0.04 },
  { name: 'Clémence R.', baseAvg: 67, baseSessions: 48, growth: 0.04 },
  { name: 'Alexandre D.', baseAvg: 66, baseSessions: 47, growth: 0.04 },
  { name: 'Lucie S.', baseAvg: 66, baseSessions: 46, growth: 0.04 },
  { name: 'Romain H.', baseAvg: 66, baseSessions: 45, growth: 0.03 },
  { name: 'Pauline T.', baseAvg: 65, baseSessions: 44, growth: 0.04 },
  { name: 'Émile V.', baseAvg: 65, baseSessions: 43, growth: 0.03 },
  { name: 'Yasmine A.', baseAvg: 65, baseSessions: 42, growth: 0.04 },
  { name: 'Bastien M.', baseAvg: 65, baseSessions: 41, growth: 0.03 },
  { name: 'Noémie C.', baseAvg: 65, baseSessions: 40, growth: 0.03 },
  { name: 'Valentin P.', baseAvg: 65, baseSessions: 40, growth: 0.03 },
  { name: 'Marine F.', baseAvg: 65, baseSessions: 40, growth: 0.03 },
  { name: 'Simon G.', baseAvg: 65, baseSessions: 40, growth: 0.03 },
  { name: 'Elisa B.', baseAvg: 65, baseSessions: 40, growth: 0.03 },
  { name: 'Tristan K.', baseAvg: 65, baseSessions: 40, growth: 0.03 },
  // Mid-range moyens (~30) — avg 50-64, sessions 20-50
  { name: 'Maëlys D.', baseAvg: 64, baseSessions: 48, growth: 0.03 },
  { name: 'Corentin R.', baseAvg: 63, baseSessions: 45, growth: 0.03 },
  { name: 'Justine L.', baseAvg: 63, baseSessions: 43, growth: 0.02 },
  { name: 'Dylan M.', baseAvg: 62, baseSessions: 42, growth: 0.03 },
  { name: 'Agathe S.', baseAvg: 62, baseSessions: 40, growth: 0.02 },
  { name: 'Kylian T.', baseAvg: 61, baseSessions: 38, growth: 0.02 },
  { name: 'Léonie V.', baseAvg: 61, baseSessions: 37, growth: 0.02 },
  { name: 'Mattéo F.', baseAvg: 60, baseSessions: 36, growth: 0.02 },
  { name: 'Alicia N.', baseAvg: 60, baseSessions: 35, growth: 0.02 },
  { name: 'Robin H.', baseAvg: 59, baseSessions: 34, growth: 0.02 },
  { name: 'Célia P.', baseAvg: 59, baseSessions: 33, growth: 0.02 },
  { name: 'Nolan G.', baseAvg: 58, baseSessions: 32, growth: 0.02 },
  { name: 'Laura J.', baseAvg: 58, baseSessions: 31, growth: 0.01 },
  { name: 'Sacha B.', baseAvg: 57, baseSessions: 30, growth: 0.02 },
  { name: 'Capucine E.', baseAvg: 57, baseSessions: 29, growth: 0.01 },
  { name: 'Thibault A.', baseAvg: 56, baseSessions: 28, growth: 0.02 },
  { name: 'Lola K.', baseAvg: 56, baseSessions: 27, growth: 0.01 },
  { name: 'Quentin D.', baseAvg: 55, baseSessions: 26, growth: 0.01 },
  { name: 'Romane C.', baseAvg: 55, baseSessions: 25, growth: 0.01 },
  { name: 'Baptiste L.', baseAvg: 54, baseSessions: 25, growth: 0.01 },
  { name: 'Margaux V.', baseAvg: 54, baseSessions: 24, growth: 0.01 },
  { name: 'Alexis R.', baseAvg: 53, baseSessions: 23, growth: 0.01 },
  { name: 'Héloïse M.', baseAvg: 52, baseSessions: 23, growth: 0.01 },
  { name: 'Florian T.', baseAvg: 52, baseSessions: 22, growth: 0.01 },
  { name: 'Salomé H.', baseAvg: 51, baseSessions: 22, growth: 0.01 },
  { name: 'Aurélien F.', baseAvg: 51, baseSessions: 21, growth: 0.01 },
  { name: 'Nina S.', baseAvg: 50, baseSessions: 21, growth: 0.01 },
  // Débutants/casuals (~20) — avg 35-49, sessions 8-25
  { name: 'Timothée P.', baseAvg: 49, baseSessions: 22, growth: 0.01 },
  { name: 'Élise G.', baseAvg: 48, baseSessions: 20, growth: 0.01 },
  { name: 'Dorian B.', baseAvg: 47, baseSessions: 19, growth: 0.01 },
  { name: 'Maëlle J.', baseAvg: 46, baseSessions: 18, growth: 0.01 },
  { name: 'Kévin N.', baseAvg: 46, baseSessions: 17, growth: 0.005 },
  { name: 'Lilou D.', baseAvg: 45, baseSessions: 16, growth: 0.01 },
  { name: 'Rémi A.', baseAvg: 44, baseSessions: 15, growth: 0.005 },
  { name: 'Apolline C.', baseAvg: 44, baseSessions: 15, growth: 0.005 },
  { name: 'Erwan K.', baseAvg: 43, baseSessions: 14, growth: 0.005 },
  { name: 'Constance L.', baseAvg: 42, baseSessions: 13, growth: 0.005 },
  { name: 'Gabin R.', baseAvg: 41, baseSessions: 12, growth: 0.005 },
  { name: 'Adèle V.', baseAvg: 40, baseSessions: 12, growth: 0.005 },
  { name: 'Mathieu T.', baseAvg: 39, baseSessions: 11, growth: 0.003 },
  { name: 'Victoire F.', baseAvg: 39, baseSessions: 10, growth: 0.005 },
  { name: 'Clément S.', baseAvg: 38, baseSessions: 10, growth: 0.003 },
  { name: 'Alix M.', baseAvg: 37, baseSessions: 9, growth: 0.003 },
  { name: 'Loïs H.', baseAvg: 37, baseSessions: 9, growth: 0.003 },
  { name: 'Diane P.', baseAvg: 36, baseSessions: 8, growth: 0.003 },
  { name: 'Eliott B.', baseAvg: 35, baseSessions: 8, growth: 0.003 },
  { name: 'Faustine G.', baseAvg: 35, baseSessions: 8, growth: 0.003 },
  // Inactifs (~15) — avg 20-40, sessions 1-10, pas de croissance
  { name: 'Timéo H.', baseAvg: 40, baseSessions: 8, growth: 0 },
  { name: 'Léna F.', baseAvg: 38, baseSessions: 7, growth: 0 },
  { name: 'Malo R.', baseAvg: 36, baseSessions: 6, growth: 0 },
  { name: 'Iris D.', baseAvg: 35, baseSessions: 5, growth: 0 },
  { name: 'Ethan J.', baseAvg: 34, baseSessions: 5, growth: 0 },
  { name: 'Lison V.', baseAvg: 33, baseSessions: 4, growth: 0 },
  { name: 'Oscar T.', baseAvg: 31, baseSessions: 4, growth: 0 },
  { name: 'Célestine B.', baseAvg: 30, baseSessions: 3, growth: 0 },
  { name: 'Ismaël K.', baseAvg: 29, baseSessions: 3, growth: 0 },
  { name: 'Colombe A.', baseAvg: 28, baseSessions: 3, growth: 0 },
  { name: 'Ruben M.', baseAvg: 26, baseSessions: 2, growth: 0 },
  { name: 'Éléonore S.', baseAvg: 25, baseSessions: 2, growth: 0 },
  { name: 'Naël C.', baseAvg: 24, baseSessions: 2, growth: 0 },
  { name: 'Blanche L.', baseAvg: 22, baseSessions: 1, growth: 0 },
  { name: 'Solal P.', baseAvg: 20, baseSessions: 1, growth: 0 },
];

function generateFakeUsers() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today - startOfYear) / 86400000);

  return BASE_USERS.map((u, i) => {
    // Seed déterministe : même résultat pour tous les visiteurs le même jour
    const seed = Math.sin((dayOfYear + 1) * (i + 1) * 9301) * 10000;
    const rand = Math.abs(seed - Math.floor(seed)); // 0 à 1

    // Variation du score : ±3 points max par jour
    const avgVariation = Math.round((rand - 0.5) * 6);
    const avg = Math.max(15, Math.min(98, u.baseAvg + avgVariation));

    // Sessions : croissance progressive + petite variation quotidienne
    const sessionGrowth = Math.floor(dayOfYear * u.growth);
    const sessionVariation = Math.floor(rand * 3);
    const sessions = u.baseSessions + sessionGrowth + sessionVariation;

    return { name: u.name, avg, sessions };
  });
}

/* ============================================================
   CLASSEMENT SECTION
   ============================================================ */
function ClassementSection({ allSessions }) {
  const userAvg = allSessions.length > 0 ? Math.round(allSessions.reduce((sum, s) => sum + (s.percentage || 0), 0) / allSessions.length) : 0;
  const userSessionCount = allSessions.length;

  const fakeUsers = generateFakeUsers();

  const allRanked = [...fakeUsers, { name: 'Vous', avg: userAvg, sessions: userSessionCount, isUser: true }].sort((a, b) => b.avg - a.avg);
  const userRank = allRanked.findIndex(u => u.isUser) + 1;
  const totalParticipants = allRanked.length;
  const percentile = Math.round(((totalParticipants - userRank) / totalParticipants) * 100);
  const medals = ['🥇', '🥈', '🥉'];

  // Afficher les 10 premiers + les 5 autour de l'utilisateur + les 3 derniers
  const visibleSet = new Set();
  // Top 10
  for (let i = 0; i < Math.min(10, allRanked.length); i++) visibleSet.add(i);
  // Autour de l'utilisateur (±3)
  const userIdx = userRank - 1;
  for (let i = Math.max(0, userIdx - 3); i <= Math.min(allRanked.length - 1, userIdx + 3); i++) visibleSet.add(i);
  // Derniers 3
  for (let i = Math.max(0, allRanked.length - 3); i < allRanked.length; i++) visibleSet.add(i);
  const visibleIndices = [...visibleSet].sort((a, b) => a - b);

  return (
    <div className="space-y-6">
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
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Score moy.</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sessions</th>
              </tr>
            </thead>
            <tbody>
              {visibleIndices.map((idx, pos) => {
                const u = allRanked[idx];
                const rank = idx + 1;
                const medal = rank <= 3 ? medals[rank - 1] : `${rank}`;
                const showSeparator = pos > 0 && visibleIndices[pos - 1] < idx - 1;
                return (
                  <Fragment key={idx}>
                    {showSeparator && (
                      <tr><td colSpan="4" className="py-1 text-center text-xs text-gray-300">• • •</td></tr>
                    )}
                    <tr className={`border-b hover:bg-gray-50/50 ${u.isUser ? 'bg-primary-50 border-primary-200 font-bold' : 'border-gray-50'}`}>
                      <td className="py-3 px-4 text-center text-lg">{medal}</td>
                      <td className={`py-3 px-4 text-sm ${u.isUser ? 'text-primary-700 font-bold' : 'text-gray-700'}`}>{u.name}</td>
                      <td className="py-3 px-4"><span className={`text-sm font-bold ${scoreClass(u.avg)}`}>{u.avg}%</span></td>
                      <td className="py-3 px-4 text-sm text-gray-500">{u.sessions}</td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
