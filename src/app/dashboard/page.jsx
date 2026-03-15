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
  const colors = SUBJECT_COLORS[subject?.color] || SUBJECT_COLORS.primary;
  return colors;
}

/* ========== MAIN PAGE ========== */
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('qcm');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Auth guard : rediriger si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion');
    }
  }, [authLoading, user, router]);

  const [qcmStats] = useLocalStorage('prepa-qcm-stats', { sessions: [], totalCorrect: 0, totalAnswered: 0 });
  const [examStats] = useLocalStorage('prepa-examen-stats', { sessions: [], totalCorrect: 0, totalAnswered: 0 });
  const [annalesStats] = useLocalStorage('prepa-annales-stats', { sessions: [], totalCorrect: 0, totalAnswered: 0 });

  const { isEssentiel, isPremiumPlus, isLoaded } = usePremium();

  const allSessions = useMemo(() => [
    ...qcmStats.sessions,
    ...examStats.sessions,
    ...annalesStats.sessions,
  ], [qcmStats.sessions, examStats.sessions, annalesStats.sessions]);

  const totalSessions = allSessions.length;
  const avgScore = totalSessions > 0
    ? Math.round(allSessions.reduce((sum, s) => sum + (s.percentage || 0), 0) / totalSessions)
    : 0;
  const totalQuestions = allSessions.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalTime = allSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  const tabs = [
    { id: 'qcm', label: 'QCM', premium: false, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg> },
    { id: 'examens', label: 'Examens', premium: false, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg> },
    { id: 'stats', label: 'Statistiques', premium: false, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg> },
    { id: 'progression', label: 'Progression', premium: true, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg> },
    { id: 'classement', label: 'Classement', premium: true, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.52.587 6.023 6.023 0 0 1-2.52-.587" /></svg> },
  ];

  // Afficher un spinner pendant la vérification d'authentification
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

  return (
    <>
      {/* Hero */}
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
            Suivez votre progression, consultez vos historiques et analysez vos performances.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Sessions totales"
            value={totalSessions}
            icon={<svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg>}
          />
          <StatCard
            label="Score moyen"
            value={`${avgScore}%`}
            icon={<svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>}
          />
          <StatCard
            label="Questions totales"
            value={totalQuestions}
            icon={<svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>}
          />
          <StatCard
            label="Temps total"
            value={formatDuration(totalTime)}
            icon={<svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-8">
          <nav className="flex gap-1 overflow-x-auto sm:justify-center">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const showLock = tab.premium && !isPremiumPlus;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {showLock && (
                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'qcm' && <QcmTab sessions={qcmStats.sessions} />}
          {activeTab === 'examens' && <ExamensTab sessions={examStats.sessions} />}
          {activeTab === 'stats' && <StatistiquesTab qcmSessions={qcmStats.sessions} examSessions={examStats.sessions} annalesSessions={annalesStats.sessions} />}
          {activeTab === 'progression' && <ProgressionTab isPremium={isPremiumPlus} qcmSessions={qcmStats.sessions} examSessions={examStats.sessions} annalesSessions={annalesStats.sessions} />}
          {activeTab === 'classement' && <ClassementTab isPremium={isPremiumPlus} qcmSessions={qcmStats.sessions} examSessions={examStats.sessions} annalesSessions={annalesStats.sessions} />}
        </div>
      </div>
    </>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:-translate-y-[2px] transition-transform">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
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
      {/* Blurred fake content */}
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
      {/* Lock overlay */}
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
   QCM TAB
   ============================================================ */
function QcmTab({ sessions }) {
  if (sessions.length === 0) {
    return <EmptyState title="Aucun QCM effectu&eacute;" description="Commencez un QCM pour voir votre historique ici." ctaHref="/qcm" ctaLabel="Commencer un QCM" />;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Mati&egrave;re</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Th&egrave;me</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Score</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Dur&eacute;e</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => {
              const colors = getSubjectBadgeColors(s.subject);
              const pct = s.percentage || Math.round((s.correct / s.total) * 100);
              return (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-sm text-gray-500">{formatDate(s.date)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                      {s.subjectName || getSubjectName(s.subject)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{s.topic || '\u2014'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${scoreBarClass(pct)}`} style={{ width: `${pct}%` }}></div>
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
    </div>
  );
}

/* ============================================================
   EXAMENS TAB
   ============================================================ */
function ExamensTab({ sessions }) {
  if (sessions.length === 0) {
    return <EmptyState title="Aucun examen effectu&eacute;" description="Passez un examen pour voir votre historique ici." ctaHref="/examen" ctaLabel="Passer un examen" />;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Mati&egrave;re</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Score</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">R&eacute;sultat</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Dur&eacute;e</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => {
              const colors = getSubjectBadgeColors(s.subject);
              const pct = s.percentage || Math.round((s.correct / s.total) * 100);
              return (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-sm text-gray-500">{formatDate(s.date)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                      {s.subjectName || getSubjectName(s.subject)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${scoreBarClass(pct)}`} style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className={`text-sm font-bold ${scoreClass(pct)}`}>{pct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{s.correct}/{s.total}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{formatDuration(s.duration)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   STATISTIQUES TAB
   ============================================================ */
function StatistiquesTab({ qcmSessions, examSessions, annalesSessions }) {
  const allSessions = [...qcmSessions, ...examSessions, ...annalesSessions];

  if (allSessions.length === 0) {
    return <EmptyState title="Aucune statistique disponible" description="Effectuez des QCM ou examens pour voir vos statistiques." ctaHref="/qcm" ctaLabel="Commencer un QCM" />;
  }

  // Aggregate by subject
  const subjectData = {};
  SUBJECTS.forEach(s => {
    subjectData[s.id] = { name: s.name, sessions: 0, totalScore: 0, bestScore: 0, totalTime: 0 };
  });

  allSessions.forEach(s => {
    const id = s.subject;
    if (!subjectData[id]) return;
    subjectData[id].sessions++;
    const pct = s.percentage || Math.round((s.correct / s.total) * 100);
    subjectData[id].totalScore += pct;
    subjectData[id].bestScore = Math.max(subjectData[id].bestScore, pct);
    subjectData[id].totalTime += (s.duration || 0);
  });

  const maxSessions = Math.max(...Object.values(subjectData).map(d => d.sessions), 1);

  // Score trend: last 10 sessions
  const recentSessions = [...allSessions]
    .filter(s => s.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
    .reverse();

  return (
    <div className="space-y-8">
      {/* Bar chart by subject */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-5">R&eacute;partition par mati&egrave;re</h3>
        {SUBJECTS.map(s => {
          const data = subjectData[s.id];
          const colors = SUBJECT_COLORS[s.color] || SUBJECT_COLORS.primary;
          const avg = data.sessions > 0 ? Math.round(data.totalScore / data.sessions) : 0;
          const barWidth = Math.round((data.sessions / maxSessions) * 100);
          return (
            <div key={s.id} className="flex items-center gap-3 mb-3">
              <span className="w-28 text-sm font-medium text-gray-700 text-right truncate">{s.name}</span>
              <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden relative">
                <div className={`h-full rounded-full ${colors.bar} transition-all`} style={{ width: `${barWidth}%` }}></div>
                <span className={`absolute inset-y-0 left-3 flex items-center text-xs font-bold ${data.sessions > 0 ? 'text-white' : 'text-gray-400'}`}>
                  {data.sessions} session{data.sessions > 1 ? 's' : ''}
                </span>
              </div>
              <span className={`w-14 text-sm font-bold ${scoreClass(avg)} text-right`}>
                {avg > 0 ? `${avg}%` : '\u2014'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Score trend */}
      {recentSessions.length > 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Tendance des scores (10 derni&egrave;res sessions)</h3>
          <div className="flex items-end gap-2 h-40">
            {recentSessions.map((s, i) => {
              const pct = s.percentage || Math.round((s.correct / s.total) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className={`text-[10px] font-bold ${scoreClass(pct)}`}>{pct}%</span>
                  <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '120px' }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-t-lg ${scoreBarClass(pct)} transition-all`}
                      style={{ height: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subject detail cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUBJECTS.map(s => {
          const data = subjectData[s.id];
          const colors = SUBJECT_COLORS[s.color] || SUBJECT_COLORS.primary;
          const avg = data.sessions > 0 ? Math.round(data.totalScore / data.sessions) : 0;
          return (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <span className="text-sm" dangerouslySetInnerHTML={{ __html: s.icon }}></span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">{s.name}</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sessions</span>
                  <span className="font-semibold text-gray-900">{data.sessions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Score moyen</span>
                  <span className={`font-semibold ${scoreClass(avg)}`}>{avg > 0 ? `${avg}%` : '\u2014'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Meilleur score</span>
                  <span className={`font-semibold ${scoreClass(data.bestScore)}`}>{data.bestScore > 0 ? `${data.bestScore}%` : '\u2014'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Temps total</span>
                  <span className="font-semibold text-gray-900">{formatDuration(data.totalTime)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   MINI PROGRESS RING (for objectives)
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
        <circle
          cx="40" cy="40" r={radius} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-gray-900">
        {pct}%
      </span>
    </div>
  );
}

/* ============================================================
   PROGRESSION TAB (PREMIUM)
   ============================================================ */
function ProgressionTab({ isPremium, qcmSessions, examSessions, annalesSessions }) {
  if (!isPremium) {
    return <PremiumLock title="Suivi de progression avancé" description="Visualisez l'évolution de vos scores et votre calendrier d'activité avec Premium+." />;
  }

  const allSessions = useMemo(() =>
    [...qcmSessions, ...examSessions, ...annalesSessions]
      .filter(s => s.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [qcmSessions, examSessions, annalesSessions]
  );

  const data = useMemo(() => {
    const today = new Date();

    // --- Score Evolution (last 20 sessions) ---
    const last20 = allSessions.slice(-20);
    const last5Avg = last20.length >= 5
      ? Math.round(last20.slice(-5).reduce((s, x) => s + (x.percentage || 0), 0) / 5)
      : null;
    const prev5Avg = last20.length >= 10
      ? Math.round(last20.slice(-10, -5).reduce((s, x) => s + (x.percentage || 0), 0) / 5)
      : null;
    const trend = (last5Avg !== null && prev5Avg !== null)
      ? (last5Avg > prev5Avg + 2 ? 'up' : last5Avg < prev5Avg - 2 ? 'down' : 'stable')
      : 'neutral';

    // --- Study Streak ---
    const dateSet = new Set(allSessions.map(s => s.date?.split('T')[0]).filter(Boolean));
    let currentStreak = 0;
    const d = new Date(today);
    if (!dateSet.has(d.toISOString().split('T')[0])) {
      d.setDate(d.getDate() - 1);
    }
    while (dateSet.has(d.toISOString().split('T')[0])) {
      currentStreak++;
      d.setDate(d.getDate() - 1);
    }
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

    // --- Subject Stats / Strengths & Weaknesses ---
    const subjectStats = {};
    SUBJECTS.forEach(s => {
      const sess = allSessions.filter(x => x.subject === s.id);
      const avg = sess.length > 0
        ? Math.round(sess.reduce((sum, x) => sum + (x.percentage || 0), 0) / sess.length)
        : 0;
      subjectStats[s.id] = { id: s.id, name: s.name, color: s.color, avg, count: sess.length };
    });
    const withSessions = Object.values(subjectStats).filter(s => s.count > 0);
    const sorted = [...withSessions].sort((a, b) => b.avg - a.avg);
    const strengths = sorted.slice(0, 2);
    const weaknesses = sorted.length > 2 ? sorted.slice(-2).reverse() : [];

    // --- Session Type Breakdown ---
    const qcmCount = qcmSessions.length;
    const examCount = examSessions.length;
    const annalesCount = annalesSessions.length;
    const totalTypeCount = qcmCount + examCount + annalesCount;

    // --- Weekly Study Time ---
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    startOfThisWeek.setHours(0, 0, 0, 0);
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const thisWeekTime = allSessions
      .filter(s => new Date(s.date) >= startOfThisWeek)
      .reduce((sum, s) => sum + (s.duration || 0), 0);
    const lastWeekTime = allSessions
      .filter(s => { const dd = new Date(s.date); return dd >= startOfLastWeek && dd < startOfThisWeek; })
      .reduce((sum, s) => sum + (s.duration || 0), 0);

    // --- Objectives ---
    const thisWeekSessions = allSessions.filter(s => new Date(s.date) >= startOfThisWeek).length;
    const overallAvg = allSessions.length > 0
      ? Math.round(allSessions.reduce((s, x) => s + (x.percentage || 0), 0) / allSessions.length)
      : 0;
    const targetScore = Math.min(100, Math.ceil((overallAvg + 5) / 5) * 5);

    // --- Heatmap (90 days, GitHub-style) ---
    const dayMap = {};
    allSessions.forEach(s => {
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

    return {
      last20, last5Avg, prev5Avg, trend,
      currentStreak, bestStreak,
      subjectStats, strengths, weaknesses,
      qcmCount, examCount, annalesCount, totalTypeCount,
      thisWeekTime, lastWeekTime,
      thisWeekSessions, overallAvg, targetScore,
      weeks, maxHeatCount,
    };
  }, [allSessions, qcmSessions, examSessions, annalesSessions]);

  if (allSessions.length === 0) {
    return <EmptyState title="Aucune donnée de progression" description="Effectuez des QCM ou examens pour suivre votre progression." ctaHref="/qcm" ctaLabel="Commencer un QCM" />;
  }

  const streakMessage = data.currentStreak === 0
    ? "Commence une session aujourd'hui !"
    : data.currentStreak < 3
      ? 'Bon début, continue comme ça !'
      : data.currentStreak < 7
        ? 'Belle série ! Tu prends le rythme.'
        : data.currentStreak < 14
          ? 'Impressionnant ! La régularité paie.'
          : 'Incroyable ! Tu es inarrêtable !';

  // Donut chart conic-gradient
  const segments = [
    { label: 'QCM', count: data.qcmCount, color: '#6366f1' },
    { label: 'Examens', count: data.examCount, color: '#8b5cf6' },
    { label: 'Annales', count: data.annalesCount, color: '#06b6d4' },
  ];
  let cumulative = 0;
  const conicStops = segments.map(seg => {
    const start = cumulative;
    const end = cumulative + (seg.count / Math.max(data.totalTypeCount, 1)) * 100;
    cumulative = end;
    return `${seg.color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className="space-y-6">

      {/* ===== 1. Score Evolution ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Évolution des scores</h3>
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
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
              Stable
            </span>
          )}
        </div>
        <div className="flex items-end gap-1 h-44">
          {data.last20.map((s, i) => {
            const pct = s.percentage || Math.round((s.correct / s.total) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                <span className={`text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity ${scoreClass(pct)}`}>{pct}%</span>
                <div className="w-full bg-gray-100 rounded-t-md relative" style={{ height: '140px' }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t-md transition-all ${scoreBarClass(pct)}`}
                    style={{ height: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {data.last5Avg !== null && data.prev5Avg !== null && (
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-gray-500">5 dernières :</span>
              <span className={`font-bold ${scoreClass(data.last5Avg)}`}>{data.last5Avg}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-gray-500">5 précédentes :</span>
              <span className={`font-bold ${scoreClass(data.prev5Avg)}`}>{data.prev5Avg}%</span>
            </div>
            <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              data.last5Avg >= data.prev5Avg ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
            }`}>
              {data.last5Avg >= data.prev5Avg ? '+' : ''}{data.last5Avg - data.prev5Avg}%
            </span>
          </div>
        )}
      </div>

      {/* ===== 2. Streak + Weekly Time ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Streak */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Streak d&apos;étude</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-4xl font-black text-gray-900 flex items-center justify-center gap-1">
                {data.currentStreak > 0 && <span className="text-2xl">🔥</span>}
                {data.currentStreak}
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">jours</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary-600 flex items-center justify-center gap-1">
                <span className="text-2xl">⭐</span>
                {data.bestStreak}
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">record</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-4 pt-4 border-t border-gray-100">{streakMessage}</p>
        </div>

        {/* Weekly time */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Temps d&apos;étude</h3>
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cette semaine</p>
            <p className="text-3xl font-black text-gray-900">{formatDuration(data.thisWeekTime)}</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-sm text-gray-500">Semaine précédente :</span>
              <span className="text-sm font-bold text-gray-700">{formatDuration(data.lastWeekTime)}</span>
              {data.lastWeekTime > 0 && (
                <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                  data.thisWeekTime >= data.lastWeekTime ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {data.thisWeekTime >= data.lastWeekTime ? '↑' : '↓'}
                  {Math.abs(Math.round(((data.thisWeekTime - data.lastWeekTime) / Math.max(data.lastWeekTime, 1)) * 100))}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== 3. Strengths & Weaknesses ===== */}
      {Object.values(data.subjectStats).filter(s => s.count > 0).length >= 2 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Points forts & axes d&apos;amélioration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
                Points forts
              </h4>
              <div className="space-y-3">
                {data.strengths.map(s => {
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
                À améliorer
              </h4>
              <div className="space-y-3">
                {data.weaknesses.map(s => {
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
        </div>
      )}

      {/* ===== 4. Session Type Breakdown + Objectives ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Répartition par type</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: data.totalTypeCount > 0
                    ? `conic-gradient(${conicStops})`
                    : '#e5e7eb'
                }}
              />
              <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                <span className="text-lg font-black text-gray-900">{data.totalTypeCount}</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {segments.map(seg => (
                <div key={seg.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
                  <span className="text-sm text-gray-700">{seg.label}</span>
                  <span className="text-sm font-bold text-gray-900">{seg.count}</span>
                  <span className="text-xs text-gray-400">
                    ({data.totalTypeCount > 0 ? Math.round((seg.count / data.totalTypeCount) * 100) : 0}%)
                  </span>
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

      {/* ===== 5. Subject Mastery (enhanced) ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Maîtrise par matière</h3>
        <div className="space-y-4">
          {SUBJECTS
            .map(s => ({ ...s, ...(data.subjectStats[s.id] || { avg: 0, count: 0 }) }))
            .sort((a, b) => b.count - a.count)
            .map(s => {
              const colors = SUBJECT_COLORS[s.color] || SUBJECT_COLORS.primary;
              const aboveAvg = s.avg > data.overallAvg;
              return (
                <div key={s.id}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{s.name}</span>
                      <span className="text-[10px] text-gray-400">{s.count} session{s.count > 1 ? 's' : ''}</span>
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

      {/* ===== 6. Activity Heatmap (90 days, GitHub-style) ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Activité des 90 derniers jours</h3>
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
                    <div
                      key={di}
                      className={`w-[14px] h-[14px] rounded-sm ${bg}`}
                      title={`${day.date.getDate()}/${day.date.getMonth() + 1} : ${day.count} session${day.count > 1 ? 's' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
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
    </div>
  );
}

/* ============================================================
   CLASSEMENT TAB (PREMIUM)
   ============================================================ */
function ClassementTab({ isPremium, qcmSessions, examSessions, annalesSessions }) {
  if (!isPremium) {
    return <PremiumLock title="Classement et comparaison" description="Comparez vos performances avec les autres &eacute;tudiants gr&acirc;ce &agrave; Premium+." />;
  }

  const allSessions = [...qcmSessions, ...examSessions, ...annalesSessions];
  const userAvg = allSessions.length > 0
    ? Math.round(allSessions.reduce((sum, s) => sum + (s.percentage || 0), 0) / allSessions.length)
    : 0;
  const userSessionCount = allSessions.length;

  const fakeUsers = [
    { name: 'Emma L.', avg: 88, sessions: 142 },
    { name: 'Lucas M.', avg: 85, sessions: 128 },
    { name: 'Chlo\u00e9 B.', avg: 82, sessions: 115 },
    { name: 'Hugo D.', avg: 79, sessions: 98 },
    { name: 'L\u00e9a R.', avg: 76, sessions: 87 },
    { name: 'Nathan P.', avg: 73, sessions: 76 },
    { name: 'Camille V.', avg: 70, sessions: 65 },
    { name: 'Th\u00e9o G.', avg: 67, sessions: 54 },
    { name: 'Manon S.', avg: 63, sessions: 42 },
    { name: 'Rapha\u00ebl K.', avg: 58, sessions: 31 },
  ];

  const allRanked = [...fakeUsers, { name: 'Vous', avg: userAvg, sessions: userSessionCount, isUser: true }]
    .sort((a, b) => b.avg - a.avg);

  const userRank = allRanked.findIndex(u => u.isUser) + 1;
  const totalParticipants = allRanked.length;
  const percentile = Math.round(((totalParticipants - userRank) / totalParticipants) * 100);

  const medals = ['\ud83e\udd47', '\ud83e\udd48', '\ud83e\udd49'];

  return (
    <div className="space-y-6">
      {/* Position summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
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

      {/* Leaderboard table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">Rang</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">&Eacute;tudiant</th>
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

      <p className="text-xs text-gray-400 text-center italic">* Classement simul&eacute; &agrave; des fins de d&eacute;monstration</p>
    </div>
  );
}
