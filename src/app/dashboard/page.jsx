'use client';

import { useState, useMemo, useEffect } from 'react';
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
  Annale: 'bg-cyan-100 text-cyan-700',
};

/* ========== MAIN PAGE ========== */
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [historyFilter, setHistoryFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion');
    }
  }, [authLoading, user, router]);

  const [qcmStats] = useLocalStorage('prepa-qcm-stats', { sessions: [], totalCorrect: 0, totalAnswered: 0 });
  const [examStats] = useLocalStorage('prepa-examen-stats', { sessions: [], totalCorrect: 0, totalAnswered: 0 });
  const [annalesStats] = useLocalStorage('prepa-annales-stats', { sessions: [], totalCorrect: 0, totalAnswered: 0 });

  const { isPremiumPlus } = usePremium();

  // ---- Tag sessions with type ----
  const allSessions = useMemo(() => [
    ...qcmStats.sessions.map(s => ({ ...s, _type: 'QCM' })),
    ...examStats.sessions.map(s => ({ ...s, _type: 'Examen' })),
    ...annalesStats.sessions.map(s => ({ ...s, _type: 'Annale' })),
  ], [qcmStats.sessions, examStats.sessions, annalesStats.sessions]);

  // ---- Centralized data computation ----
  const data = useMemo(() => {
    const today = new Date();
    const sorted = [...allSessions].filter(s => s.date).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Global stats
    const totalSessions = allSessions.length;
    const avgScore = totalSessions > 0
      ? Math.round(allSessions.reduce((sum, s) => sum + (s.percentage || 0), 0) / totalSessions)
      : 0;
    const totalTime = allSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Streak
    const dateSet = new Set(sorted.map(s => s.date?.split('T')[0]).filter(Boolean));
    let currentStreak = 0;
    const d = new Date(today);
    if (!dateSet.has(d.toISOString().split('T')[0])) {
      d.setDate(d.getDate() - 1);
    }
    while (dateSet.has(d.toISOString().split('T')[0])) {
      currentStreak++;
      d.setDate(d.getDate() - 1);
    }

    // Trend (last 5 vs prev 5)
    const last10 = sorted.slice(-10);
    const last5Avg = last10.length >= 5
      ? Math.round(last10.slice(-5).reduce((s, x) => s + (x.percentage || 0), 0) / 5)
      : null;
    const prev5Avg = last10.length >= 10
      ? Math.round(last10.slice(0, 5).reduce((s, x) => s + (x.percentage || 0), 0) / 5)
      : null;
    const trend = (last5Avg !== null && prev5Avg !== null)
      ? (last5Avg > prev5Avg + 2 ? 'up' : last5Avg < prev5Avg - 2 ? 'down' : 'stable')
      : 'neutral';

    // This week sessions
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    startOfThisWeek.setHours(0, 0, 0, 0);
    const thisWeekSessions = sorted.filter(s => new Date(s.date) >= startOfThisWeek).length;
    const thisWeekTime = sorted.filter(s => new Date(s.date) >= startOfThisWeek).reduce((sum, s) => sum + (s.duration || 0), 0);
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
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
    const strengths = sortedByAvg.slice(0, 2);
    const weaknesses = sortedByAvg.length > 2 ? sortedByAvg.slice(-2).reverse() : [];

    // Recent 5 sessions
    const recent5 = [...allSessions].filter(s => s.date).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    // Score evolution (last 20)
    const last20 = sorted.slice(-20);
    const last5AvgFull = last20.length >= 5
      ? Math.round(last20.slice(-5).reduce((s, x) => s + (x.percentage || 0), 0) / 5)
      : null;
    const prev5AvgFull = last20.length >= 10
      ? Math.round(last20.slice(-10, -5).reduce((s, x) => s + (x.percentage || 0), 0) / 5)
      : null;

    // Type counts
    const qcmCount = qcmStats.sessions.length;
    const examCount = examStats.sessions.length;
    const annalesCount = annalesStats.sessions.length;

    // Heatmap (90 days)
    const dayMap = {};
    sorted.forEach(s => {
      if (!s.date) return;
      const dk = new Date(s.date).toISOString().split('T')[0];
      dayMap[dk] = (dayMap[dk] || 0) + 1;
    });
    const heatStart = new Date(today);
    heatStart.setDate(today.getDate() - 89);
    while (heatStart.getDay() !== 1) heatStart.setDate(heatStart.getDate() - 1);
    const heatmapDays = [];
    const hd = new Date(heatStart);
    while (hd <= today) {
      const key = hd.toISOString().split('T')[0];
      heatmapDays.push({ date: new Date(hd), count: dayMap[key] || 0, key });
      hd.setDate(hd.getDate() + 1);
    }
    const maxHeatCount = Math.max(...heatmapDays.map(x => x.count), 1);
    const weeks = [];
    for (let i = 0; i < heatmapDays.length; i += 7) {
      weeks.push(heatmapDays.slice(i, i + 7));
    }

    // This week heatmap (free teaser)
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    thisWeekStart.setHours(0, 0, 0, 0);
    const thisWeekDays = [];
    for (let i = 0; i < 7; i++) {
      const dd = new Date(thisWeekStart);
      dd.setDate(dd.getDate() + i);
      const key = dd.toISOString().split('T')[0];
      thisWeekDays.push({ date: new Date(dd), count: dayMap[key] || 0, key, label: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i] });
    }

    // Objectives
    const overallAvg = avgScore;
    const targetScore = Math.min(100, Math.ceil((overallAvg + 5) / 5) * 5);

    // Best streak
    let bestStreak = 0, tempStreak = 0, prevDate = null;
    const sortedDates = [...dateSet].sort();
    for (const ds of sortedDates) {
      const dt = new Date(ds);
      if (prevDate && (dt - prevDate) === 86400000) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      bestStreak = Math.max(bestStreak, tempStreak);
      prevDate = dt;
    }

    return {
      totalSessions, avgScore, totalTime,
      currentStreak, bestStreak, trend,
      thisWeekSessions, thisWeekTime, lastWeekTime,
      subjectStats, strengths, weaknesses,
      recent5, last20, last5Avg: last5AvgFull, prev5Avg: prev5AvgFull,
      qcmCount, examCount, annalesCount,
      weeks, maxHeatCount, thisWeekDays,
      overallAvg, targetScore,
      hasAnySessions: totalSessions > 0,
      hasMultipleSubjects: withSessions.length >= 2,
    };
  }, [allSessions, qcmStats.sessions, examStats.sessions, annalesStats.sessions]);

  // ---- Filtered history ----
  const filteredHistory = useMemo(() => {
    let sessions = allSessions;
    if (historyFilter !== 'all') {
      const filterMap = { qcm: 'QCM', examen: 'Examen', annale: 'Annale' };
      sessions = sessions.filter(s => s._type === filterMap[historyFilter]);
    }
    return sessions.filter(s => s.date).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allSessions, historyFilter]);

  // Reset visible count on filter change
  useEffect(() => { setVisibleCount(10); }, [historyFilter]);

  // Dynamic subtitle
  const heroSubtitle = !data.hasAnySessions
    ? 'Commencez votre premiere session pour suivre votre progression !'
    : data.currentStreak > 0
      ? `Streak de ${data.currentStreak} jour${data.currentStreak > 1 ? 's' : ''} — continue !`
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

  // Donut chart
  const segments = [
    { label: 'QCM', count: data.qcmCount, color: '#6366f1' },
    { label: 'Examens', count: data.examCount, color: '#8b5cf6' },
    { label: 'Annales', count: data.annalesCount, color: '#06b6d4' },
  ];
  let cumulative = 0;
  const totalTypeCount = data.qcmCount + data.examCount + data.annalesCount;
  const conicStops = segments.map(seg => {
    const start = cumulative;
    const end = cumulative + (seg.count / Math.max(totalTypeCount, 1)) * 100;
    cumulative = end;
    return `${seg.color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <>
      {/* ===== 1. HERO ===== */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* ===== 2. ACTIONS RAPIDES ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/qcm" className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-primary-300 hover:shadow-lg hover:shadow-primary-600/10 hover:-translate-y-[2px] transition-all">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-200 transition-colors">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">Lancer un QCM</p>
              <p className="text-xs text-gray-500 mt-0.5">Entrainez-vous librement</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>

          <Link href="/examen" className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-violet-300 hover:shadow-lg hover:shadow-violet-600/10 hover:-translate-y-[2px] transition-all">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-violet-200 transition-colors">
              <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 group-hover:text-violet-700 transition-colors">Passer un examen</p>
              <p className="text-xs text-gray-500 mt-0.5">Conditions reelles</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-violet-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>

          <Link href="/annales" className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-600/10 hover:-translate-y-[2px] transition-all">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-cyan-200 transition-colors">
              <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">Annales</p>
              <p className="text-xs text-gray-500 mt-0.5">Sujets des annees precedentes</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-cyan-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>

        {/* ===== 3. METRIQUES CLES ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Streak"
            value={data.currentStreak > 0 ? `${data.currentStreak}j` : '0j'}
            badge={data.currentStreak > 0 ? '🔥' : null}
            icon={<svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /></svg>}
          />
          <StatCard
            label="Score moyen"
            value={data.hasAnySessions ? `${data.avgScore}%` : '--'}
            trend={data.trend}
            icon={<svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>}
          />
          <StatCard
            label="Cette semaine"
            value={`${data.thisWeekSessions}`}
            sublabel={data.thisWeekSessions === 1 ? 'session' : 'sessions'}
            icon={<svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>}
          />
          <StatCard
            label="Temps total"
            value={data.hasAnySessions ? formatDuration(data.totalTime) : '--'}
            icon={<svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
          />
        </div>

        {/* ===== 4. MAITRISE PAR MATIERE ===== */}
        {data.hasAnySessions && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Maitrise par matiere</h3>
            <div className="space-y-4">
              {SUBJECTS
                .map(s => ({ ...s, ...(data.subjectStats[s.id] || { avg: 0, count: 0 }) }))
                .sort((a, b) => b.count - a.count)
                .map(s => {
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
                          {s.count > 0 && (
                            <span className={`text-[10px] font-semibold ${aboveAvg ? 'text-emerald-500' : 'text-red-400'}`}>
                              {aboveAvg ? '▲' : '▼'}
                            </span>
                          )}
                          <span className={`text-sm font-bold ${scoreClass(s.avg)}`}>
                            {s.avg > 0 ? `${s.avg}%` : '\u2014'}
                          </span>
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
        )}

        {/* ===== 5. DERNIERES SESSIONS ===== */}
        {!data.hasAnySessions ? (
          <EmptyState
            title="Aucune session effectuee"
            description="Lancez un QCM ou un examen pour commencer a suivre votre progression."
            ctaHref="/qcm"
            ctaLabel="Commencer un QCM"
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Dernieres sessions</h3>
            <div className="space-y-3">
              {data.recent5.map((s, i) => {
                const subjectColors = getSubjectBadgeColors(s.subject);
                const pct = s.percentage || Math.round((s.correct / s.total) * 100);
                return (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${TYPE_BADGE[s._type] || TYPE_BADGE.QCM}`}>
                        {s._type}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${subjectColors.badge}`}>
                        {s.subjectName || getSubjectName(s.subject)}
                      </span>
                      {s.topic && <span className="text-xs text-gray-500 truncate max-w-[200px]">{s.topic}</span>}
                    </div>
                    <div className="flex items-center gap-3 sm:ml-auto">
                      <div className="flex items-center gap-2 flex-1 sm:flex-none">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${scoreBarClass(pct)}`} style={{ width: `${pct}%` }} />
                        </div>
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
        )}

        {/* ===== 6. EVOLUTION DES SCORES ===== */}
        {data.hasAnySessions && data.last20.length > 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Evolution des scores</h3>
              {data.trend === 'up' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
                  En progression
                </span>
              )}
              {data.trend === 'down' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 5.834 5.46l2.63 1.326m0 0 .311-6.228m-.311 6.228-5.94-2.281" /></svg>
                  En baisse
                </span>
              )}
              {data.trend === 'stable' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                  Stable
                </span>
              )}
            </div>
            <div className="flex items-end gap-1 h-44">
              {(isPremiumPlus ? data.last20 : data.last20.slice(-10)).map((s, i) => {
                const pct = s.percentage || Math.round((s.correct / s.total) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                    <span className={`text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity ${scoreClass(pct)}`}>{pct}%</span>
                    <div className="w-full bg-gray-100 rounded-t-md relative" style={{ height: '140px' }}>
                      <div className={`absolute bottom-0 w-full rounded-t-md transition-all ${scoreBarClass(pct)}`} style={{ height: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Premium: detailed comparison */}
            {isPremiumPlus && data.last5Avg !== null && data.prev5Avg !== null && (
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-gray-500">5 dernieres :</span>
                  <span className={`font-bold ${scoreClass(data.last5Avg)}`}>{data.last5Avg}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-gray-500">5 precedentes :</span>
                  <span className={`font-bold ${scoreClass(data.prev5Avg)}`}>{data.prev5Avg}%</span>
                </div>
                <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  data.last5Avg >= data.prev5Avg ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                }`}>
                  {data.last5Avg >= data.prev5Avg ? '+' : ''}{data.last5Avg - data.prev5Avg}%
                </span>
              </div>
            )}
            {/* Free teaser */}
            {!isPremiumPlus && data.last20.length > 10 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                <Link href="/tarifs" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                  Voir les 20 dernieres sessions et comparaison detaillee avec Premium+ →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ===== 7. POINTS FORTS & AXES D'AMELIORATION ===== */}
        {data.hasMultipleSubjects && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Points forts & axes d&apos;amelioration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Strengths */}
              <div>
                <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
                  Points forts
                </h4>
                <div className="space-y-3">
                  {(isPremiumPlus ? data.strengths : data.strengths.slice(0, 1)).map(s => {
                    const colors = SUBJECT_COLORS[s.color] || SUBJECT_COLORS.primary;
                    return (
                      <div key={s.id} className={`p-3 rounded-xl border ${colors.border} ${colors.bg}`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-bold ${colors.text}`}>{s.name}</span>
                          <span className={`text-lg font-black ${scoreClass(s.avg)}`}>{s.avg}%</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">{s.count} session{s.count > 1 ? 's' : ''}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Weaknesses */}
              <div>
                <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                  A ameliorer
                </h4>
                <div className="space-y-3">
                  {(isPremiumPlus ? data.weaknesses : data.weaknesses.slice(0, 1)).map(s => {
                    const colors = SUBJECT_COLORS[s.color] || SUBJECT_COLORS.primary;
                    return (
                      <div key={s.id} className={`p-3 rounded-xl border ${colors.border} ${colors.bg}`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-bold ${colors.text}`}>{s.name}</span>
                          <span className={`text-lg font-black ${scoreClass(s.avg)}`}>{s.avg}%</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">{s.count} session{s.count > 1 ? 's' : ''}</p>
                      </div>
                    );
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
                <Link href="/tarifs" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                  Voir l&apos;analyse complete (2+2 matieres) avec Premium+ →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ===== 8. HEATMAP D'ACTIVITE ===== */}
        {data.hasAnySessions && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Activite</h3>

            {/* Free: This week mini heatmap */}
            <div className="flex items-center gap-2 mb-4">
              {data.thisWeekDays.map((day, i) => {
                let bg = 'bg-gray-100';
                if (day.count > 0) {
                  if (day.count >= 3) bg = 'bg-primary-500';
                  else if (day.count >= 2) bg = 'bg-primary-300';
                  else bg = 'bg-primary-100';
                }
                const isToday = day.key === new Date().toISOString().split('T')[0];
                return (
                  <div key={i} className="flex-1 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">{day.label}</p>
                    <div
                      className={`w-full aspect-square rounded-lg ${bg} ${isToday ? 'ring-2 ring-primary-400' : ''}`}
                      title={`${day.count} session${day.count > 1 ? 's' : ''}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Premium: full 90-day heatmap */}
            {isPremiumPlus ? (
              <>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3">90 derniers jours</p>
                  <div className="overflow-x-auto">
                    <div className="flex gap-[3px]">
                      <div className="flex flex-col gap-[3px] mr-1">
                        {['', 'Lun', '', 'Mer', '', 'Ven', ''].map((label, i) => (
                          <div key={i} className="h-[14px] text-[9px] text-gray-400 flex items-center">{label}</div>
                        ))}
                      </div>
                      {data.weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-[3px]">
                          {week.map((day, di) => {
                            let bg = 'bg-gray-100';
                            if (day.count > 0) {
                              const intensity = day.count / data.maxHeatCount;
                              if (intensity > 0.66) bg = 'bg-primary-500';
                              else if (intensity > 0.33) bg = 'bg-primary-300';
                              else bg = 'bg-primary-100';
                            }
                            return (
                              <div key={di} className={`w-[14px] h-[14px] rounded-sm ${bg}`}
                                title={`${day.date.getDate()}/${day.date.getMonth() + 1} : ${day.count} session${day.count > 1 ? 's' : ''}`} />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span>Moins</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-sm bg-gray-100"></div>
                      <div className="w-4 h-4 rounded-sm bg-primary-100"></div>
                      <div className="w-4 h-4 rounded-sm bg-primary-300"></div>
                      <div className="w-4 h-4 rounded-sm bg-primary-500"></div>
                    </div>
                    <span>Plus</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="pt-4 border-t border-gray-100 text-center">
                <div className="relative">
                  <div className="pointer-events-none select-none" style={{ filter: 'blur(4px)' }}>
                    <div className="flex gap-[3px] justify-center">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className="flex flex-col gap-[3px]">
                          {Array.from({ length: 7 }, (_, j) => (
                            <div key={j} className={`w-[14px] h-[14px] rounded-sm ${Math.random() > 0.6 ? 'bg-primary-200' : 'bg-gray-100'}`} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Link href="/tarifs" className="px-4 py-2 bg-white/95 rounded-xl border border-gray-200 shadow-sm text-xs font-semibold text-primary-600 hover:text-primary-700">
                      Voir les 90 derniers jours avec Premium+ →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== 9. HISTORIQUE UNIFIE ===== */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Historique des sessions</h3>
            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: 'Tout', count: allSessions.length },
                { key: 'qcm', label: 'QCM', count: data.qcmCount },
                { key: 'examen', label: 'Examens', count: data.examCount },
                { key: 'annale', label: 'Annales', count: data.annalesCount },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setHistoryFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    historyFilter === f.key
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                title="Aucune session"
                description="Aucune session trouvee pour ce filtre."
                ctaHref="/qcm"
                ctaLabel="Commencer un QCM"
              />
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
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${TYPE_BADGE[s._type] || TYPE_BADGE.QCM}`}>
                              {s._type}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                              {s.subjectName || getSubjectName(s.subject)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 hidden md:table-cell">{s.topic || '\u2014'}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${scoreBarClass(pct)}`} style={{ width: `${pct}%` }} />
                              </div>
                              <span className={`text-sm font-bold ${scoreClass(pct)}`}>{pct}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">{formatDuration(s.duration)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {visibleCount < filteredHistory.length && (
                <div className="p-4 text-center border-t border-gray-100">
                  <button
                    onClick={() => setVisibleCount(v => v + 10)}
                    className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Voir plus ({Math.min(visibleCount + 10, filteredHistory.length)} / {filteredHistory.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ===== 10. REPARTITION + OBJECTIFS (Premium) ===== */}
        {data.hasAnySessions && (
          isPremiumPlus ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Donut */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Repartition par type</h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-28 h-28 shrink-0">
                    <div className="w-full h-full rounded-full" style={{ background: totalTypeCount > 0 ? `conic-gradient(${conicStops})` : '#e5e7eb' }} />
                    <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                      <span className="text-lg font-black text-gray-900">{totalTypeCount}</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
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
              {/* Objectives */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Mes objectifs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <MiniProgressRing value={data.thisWeekSessions} max={5} color="#6366f1" />
                    <p className="text-xs font-medium text-gray-500 mt-2">Sessions / semaine</p>
                    <p className="text-sm font-bold text-gray-900">{data.thisWeekSessions}/5</p>
                  </div>
                  <div className="text-center">
                    <MiniProgressRing value={data.overallAvg} max={data.targetScore} color="#10b981" />
                    <p className="text-xs font-medium text-gray-500 mt-2">Score moyen</p>
                    <p className="text-sm font-bold text-gray-900">{data.overallAvg}% → {data.targetScore}%</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Repartition des sessions</h3>
              <div className="flex flex-wrap gap-4">
                {segments.map(seg => (
                  <div key={seg.label} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: seg.color }} />
                    <span className="text-sm text-gray-700">{seg.label} :</span>
                    <span className="text-sm font-bold text-gray-900">{seg.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                <Link href="/tarifs" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                  Graphiques detailles et objectifs avec Premium+ →
                </Link>
              </div>
            </div>
          )
        )}

        {/* ===== 11. CLASSEMENT (Premium) ===== */}
        {isPremiumPlus ? (
          <ClassementSection allSessions={allSessions} />
        ) : (
          <PremiumLock title="Classement et comparaison" description="Comparez vos performances avec les autres etudiants grace a Premium+." />
        )}

        {/* ===== 12. BANNIERE CONTACT ===== */}
        <div className="pt-2">
          <Link
            href="/contact"
            className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-primary-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152-6.135c-.22-2.057-1.907-3.555-3.967-3.555H8.912c-2.06 0-3.747 1.498-3.967 3.555A23.867 23.867 0 0 1 3.793 14.19c2.56-.932 5.324-1.44 8.207-1.44ZM12 6a2.25 2.25 0 1 0 0-4.5A2.25 2.25 0 0 0 12 6Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Un bug ou une suggestion ?</p>
                <p className="text-xs text-gray-500">Aidez-nous a ameliorer la plateforme en nous signalant un probleme.</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   STAT CARD (enhanced with badge & trend)
   ============================================================ */
function StatCard({ label, value, icon, badge, trend, sublabel }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:-translate-y-[2px] transition-transform">
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
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-5">{description}</p>
      {ctaHref && (
        <Link href={ctaHref} className="inline-flex px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25">
          {ctaLabel || 'Commencer maintenant'}
        </Link>
      )}
    </div>
  );
}

/* ============================================================
   PREMIUM LOCK OVERLAY
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
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 bg-gray-100 rounded-lg"></div>
            <div className="h-16 bg-gray-100 rounded-lg"></div>
            <div className="h-16 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-8 max-w-sm mx-4">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-5">{description}</p>
          <Link href="/tarifs" className="inline-flex px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25">
            Passer au Premium+
          </Link>
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
        <circle cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-gray-900">{pct}%</span>
    </div>
  );
}

/* ============================================================
   CLASSEMENT SECTION (Premium)
   ============================================================ */
function ClassementSection({ allSessions }) {
  const userAvg = allSessions.length > 0
    ? Math.round(allSessions.reduce((sum, s) => sum + (s.percentage || 0), 0) / allSessions.length)
    : 0;
  const userSessionCount = allSessions.length;

  const fakeUsers = [
    { name: 'Emma L.', avg: 88, sessions: 142 },
    { name: 'Lucas M.', avg: 85, sessions: 128 },
    { name: 'Chloe B.', avg: 82, sessions: 115 },
    { name: 'Hugo D.', avg: 79, sessions: 98 },
    { name: 'Lea R.', avg: 76, sessions: 87 },
    { name: 'Nathan P.', avg: 73, sessions: 76 },
    { name: 'Camille V.', avg: 70, sessions: 65 },
    { name: 'Theo G.', avg: 67, sessions: 54 },
    { name: 'Manon S.', avg: 63, sessions: 42 },
    { name: 'Raphael K.', avg: 58, sessions: 31 },
  ];

  const allRanked = [...fakeUsers, { name: 'Vous', avg: userAvg, sessions: userSessionCount, isUser: true }]
    .sort((a, b) => b.avg - a.avg);

  const userRank = allRanked.findIndex(u => u.isUser) + 1;
  const totalParticipants = allRanked.length;
  const percentile = Math.round(((totalParticipants - userRank) / totalParticipants) * 100);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Classement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Votre position</p>
            <p className="text-3xl font-black text-gray-900">{userRank}<span className="text-lg text-gray-400">/{totalParticipants}</span></p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Percentile</p>
            <p className="text-3xl font-black text-primary-600">Top {100 - percentile}%</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Score moyen</p>
            <p className={`text-3xl font-black ${scoreClass(userAvg)}`}>{userAvg}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">Rang</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Etudiant</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Score moy.</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sessions</th>
              </tr>
            </thead>
            <tbody>
              {allRanked.map((u, i) => {
                const rank = i + 1;
                const medal = rank <= 3 ? medals[rank - 1] : `${rank}`;
                return (
                  <tr key={i} className={`border-b hover:bg-gray-50/50 ${u.isUser ? 'bg-primary-50 border-primary-200 font-bold' : 'border-gray-50'}`}>
                    <td className="py-3 px-4 text-center text-lg">{medal}</td>
                    <td className={`py-3 px-4 text-sm ${u.isUser ? 'text-primary-700 font-bold' : 'text-gray-700'}`}>{u.name}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-bold ${scoreClass(u.avg)}`}>{u.avg}%</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{u.sessions}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center italic">* Classement simule a des fins de demonstration</p>
    </div>
  );
}
