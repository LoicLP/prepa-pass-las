'use client';

import { useState, useMemo, useEffect, useRef, Fragment, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabaseStats } from '@/hooks/useSupabaseStats';
import { usePremium } from '@/contexts/PremiumContext';
import { useAuth } from '@/contexts/AuthContext';
import { SUBJECTS } from '@/data/subjects';
import { SUBJECT_COLORS, getSubjectName } from '@/data/constants';
import { formatDate, formatDuration, scoreClass, scoreBarClass } from '@/utils/format';
import QCMPage from '@/app/qcm/QCMClient';
import ExamenPage from '@/app/examen/ExamenClient';
import { FICHES_DATA } from '@/data/fiches';
import { sanitizeHtml } from '@/utils/sanitize';
import { loadCoursForFiche } from '@/data/cours';
import { supabase } from '@/lib/supabase';
import { computeXP, gradeForXP, computeStreakWithJokers, questStatus, GRADES, PICO_OUTFITS } from '@/lib/gamification';
import { PROMO, isPromoActive, promoDaysLeft } from '@/lib/promo';

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
  const { user, loading: authLoading, accessToken, logOut } = useAuth();
  const router = useRouter();
  const mainRef = useRef(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(10);
  const [chartMode, setChartMode] = useState('epreuves');
  const [progSubject, setProgSubject] = useState('all'); // filtre matière de la courbe de progression
  const [editGoals, setEditGoals] = useState(false);     // édition des objectifs hebdo
  const [goalsDraft, setGoalsDraft] = useState({ sessions: 5, timeMin: 120, days: 5 });
  const [goalsSaving, setGoalsSaving] = useState(false);
  const [goalsOverride, setGoalsOverride] = useState(null); // valeurs optimistes après sauvegarde
  const [activeQCM, setActiveQCM] = useState(null);     // config pour overlay QCM embarqué
  const [qcmView, setQcmView] = useState(null);         // vue interne du QCM (pour masquer la sidebar en immersion)
  const [examenView, setExamenView] = useState(null);   // vue interne de l'examen (idem)
  const [activeExamen, setActiveExamen] = useState(false); // booléen pour overlay Examen
  const [activeFicheSubject, setActiveFicheSubject] = useState(null); // filtre matière fiches
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // tiroir mobile
  const [statsRefresh, setStatsRefresh] = useState(0); // recharge les stats après une session
  const [onboardOn, setOnboardOn] = useState(false); // checklist « Bien démarrer »
  const [gradeOpen, setGradeOpen] = useState(false); // popover « Mon grade »
  const [fichesSeen, setFichesSeen] = useState(false); // étape onboarding : fiches visitées
  const [picoSignal, setPicoSignal] = useState(0); // force l'ouverture de la bulle Pico
  const [resumeState, setResumeState] = useState(null); // session QCM interrompue à reprendre

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion');
    }
  }, [authLoading, user, router]);

  // Remettre le scroll à zéro quand on change de section
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [activeSection]);

  const [qcmStats, , qcmLoaded] = useSupabaseStats(user?.id, 'qcm_stats', statsRefresh);
  const [examStats, , examLoaded] = useSupabaseStats(user?.id, 'examen_stats', statsRefresh);

  const closeQCM = () => { setActiveQCM(null); setQcmView(null); setStatsRefresh(k => k + 1); };

  // Ouvre un module d'entraînement. Deux pièges évités ici :
  //  - QCMClient ne lit initialConfig qu'au montage → une nouvelle clé force le remontage,
  //    sinon changer de mode alors qu'un QCM est déjà ouvert ne produisait aucun effet ;
  //  - les deux overlays partagent le même z-index → on ferme systématiquement l'autre.
  const [qcmKey, setQcmKey] = useState(0);
  const openQCM = (cfg) => {
    setActiveExamen(false); setExamenView(null);
    setQcmView(null); setActiveQCM(cfg); setQcmKey(k => k + 1);
  };
  const openExamen = () => {
    setActiveQCM(null); setQcmView(null);
    setExamenView(null); setActiveExamen(true);
  };
  // Vues de « sélection » du QCM où l'on garde la sidebar visible ; les autres (quiz/loading/résultats) passent en immersion
  const QCM_SELECTION_VIEWS = ['hero', 'modeChoice', 'subjectSelection', 'fichesSelection', 'customSelection', 'reviewCount', 'countChoice', 'flashIntro'];
  const effectiveQcmView = qcmView || activeQCM?.initialView || 'quiz';
  const qcmImmersive = !QCM_SELECTION_VIEWS.includes(effectiveQcmView);
  const closeExamen = () => { setActiveExamen(false); setExamenView(null); setStatsRefresh(k => k + 1); };
  // Vues de « sélection » de l'examen où l'on garde la sidebar visible ; l'épreuve elle-même passe en immersion
  const EXAMEN_SELECTION_VIEWS = ['hero', 'modeChoice', 'fichesSelection', 'customSelection'];
  const examImmersive = !EXAMEN_SELECTION_VIEWS.includes(examenView || 'modeChoice');

  // Ouverture directe d'un module via /dashboard?open=qcm|examen (redirections des pages publiques)
  useEffect(() => {
    const open = new URLSearchParams(window.location.search).get('open');
    if (!open) return;
    if (open === 'qcm') openQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' });
    else if (open === 'examen') openExamen();
    else if (open === 'fiches') setActiveSection('fiches');
    window.history.replaceState(null, '', '/dashboard');
  }, []);

  // Objectifs hebdomadaires (éditables, persistés dans user_metadata)
  const weeklyGoals = goalsOverride || {
    sessions: user?.user_metadata?.weekly_goals?.sessions ?? 5,
    timeMin: user?.user_metadata?.weekly_goals?.timeMin ?? 120,
    days: user?.user_metadata?.weekly_goals?.days ?? 5,
  };
  const openEditGoals = () => { setGoalsDraft({ ...weeklyGoals }); setEditGoals(true); };
  const saveWeeklyGoals = async () => {
    setGoalsSaving(true);
    const clean = {
      sessions: Math.max(1, Math.min(50, Math.round(goalsDraft.sessions) || 5)),
      timeMin: Math.max(15, Math.min(1200, Math.round(goalsDraft.timeMin) || 120)),
      days: Math.max(1, Math.min(7, Math.round(goalsDraft.days) || 5)),
    };
    if (supabase) { try { await supabase.auth.updateUser({ data: { weekly_goals: clean } }); } catch (e) { console.warn('save weekly_goals', e); } }
    setGoalsOverride(clean);
    setGoalsSaving(false);
    setEditGoals(false);
  };

  // ---- À consolider : toutes les réponses fausses en attente ----
  const reviewDue = useMemo(() => qcmStats.reviewQueue || [], [qcmStats.reviewQueue]);

  // ---- Onboarding : activé une seule fois, pour les comptes sans session ----
  useEffect(() => {
    if (!qcmLoaded || !examLoaded) return;
    if (localStorage.getItem('onboard_dismissed')) return;
    if (localStorage.getItem('onboard_active')) { setOnboardOn(true); setFichesSeen(!!localStorage.getItem('onboard_fiches')); return; }
    const total = (qcmStats.sessions?.length || 0) + (examStats.sessions?.length || 0);
    if (total === 0) { localStorage.setItem('onboard_active', '1'); setOnboardOn(true); }
  }, [qcmLoaded, examLoaded, qcmStats.sessions, examStats.sessions]);

  useEffect(() => {
    if (activeSection === 'fiches' && !fichesSeen) {
      localStorage.setItem('onboard_fiches', '1');
      setFichesSeen(true);
    }
  }, [activeSection, fichesSeen]);

  const dismissOnboard = () => { localStorage.setItem('onboard_dismissed', '1'); setOnboardOn(false); };

  // ---- Reprise de session QCM interrompue ----
  useEffect(() => {
    if (activeQCM || activeExamen) return; // pas pendant une session en cours
    try {
      const raw = localStorage.getItem('qcm_resume');
      if (!raw) { setResumeState(null); return; }
      const st = JSON.parse(raw);
      const fresh = st?.savedAt && (Date.now() - st.savedAt) < 24 * 60 * 60 * 1000;
      const unfinished = st?.questions?.length && st.answers?.some(a => a === null);
      setResumeState(fresh && unfinished ? st : null);
      if (!fresh) localStorage.removeItem('qcm_resume');
    } catch { setResumeState(null); }
  }, [activeQCM, activeExamen, statsRefresh]);

  const resumeQcmSession = () => { setResumeState(null); openQCM({ type: 'resume', resumeState }); };
  const dismissResume = () => { try { localStorage.removeItem('qcm_resume'); } catch {}; setResumeState(null); };

  const launchReview = () => openQCM({
    type: 'review',
    reviewQuestions: reviewDue,
    subjectName: 'À consolider',
    title: 'À consolider',
  });

  const { isPremiumPlus, tier, trialActive, trialEndsAt } = usePremium();

  // Bandeau « essai terminé » : visible pendant 5 jours après l'expiration, refermable.
  // Initialisé masqué puis révélé après lecture du localStorage (évite le flash si déjà fermé).
  const [trialEndDismissed, setTrialEndDismissed] = useState(true);
  useEffect(() => {
    setTrialEndDismissed(localStorage.getItem('ppl-trial-ended-dismissed') === '1');
  }, []);
  // Offre de rentrée (affichée aux comptes gratuits)
  const [promoInfo] = useState(() => isPromoActive()
    ? { days: promoDaysLeft(), deadline: PROMO.endsAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) }
    : null);

  const trialEndedRecently = tier === 'gratuit' && trialEndsAt && !trialActive
    && Date.now() > trialEndsAt.getTime()
    && Date.now() < trialEndsAt.getTime() + 5 * 24 * 3600 * 1000;

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
    // Stats par chapitre (topic) au sein de chaque matière
    const topicStats = {};
    SUBJECTS.forEach(s => {
      const map = {};
      allSessions.filter(x => x.subject === s.id && x.topic).forEach(x => {
        if (!map[x.topic]) map[x.topic] = { topic: x.topic, scores: [] };
        map[x.topic].scores.push(x.percentage || 0);
      });
      topicStats[s.id] = Object.values(map)
        .map(t => ({ topic: t.topic, count: t.scores.length, avg: Math.round(t.scores.reduce((a, b) => a + b, 0) / t.scores.length) }))
        .sort((a, b) => a.avg - b.avg);
    });

    const withSessions = Object.values(subjectStats).filter(s => s.count > 0);
    const subjectsExplored = withSessions.length;
    const bestSessionPct = allSessions.reduce((m, s) => Math.max(m, s.percentage || 0), 0);
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
      subjectStats, strengths, weaknesses, topicStats, subjectsExplored, bestSessionPct,
      recent5, last20, last5Avg: last5AvgFull, prev5Avg: prev5AvgFull,
      qcmCount, examCount,
      weeks, maxHeatCount, thisWeekDays, thisWeekActiveDays,
      overallAvg, targetScore,
      hasAnySessions: totalSessions > 0,
      hasMultipleSubjects: withSessions.length >= 2,
      recommendations,
    };
  }, [allSessions, qcmStats.sessions, examStats.sessions]);

  // ---- Gamification : XP, grade, streak à jokers, défis du jour ----
  const gam = useMemo(() => {
    const todayKey = new Date().toISOString().split('T')[0];
    const weakRec = data.recommendations.length > 0 ? data.recommendations[0] : null;
    const ctx = weakRec ? { weakId: weakRec.id, weakName: weakRec.name } : null;
    const xp = computeXP(allSessions, ctx, todayKey);
    return {
      ...xp,
      ...gradeForXP(xp.total),
      streakInfo: computeStreakWithJokers(allSessions, todayKey),
      quests: questStatus(allSessions, todayKey, ctx),
      todayKey,
    };
  }, [allSessions, data.recommendations]);

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
    // Score valide d'une session (null si pas calculable → exclu du graphe)
    const scoreOf = (s) => Number.isFinite(s.percentage) ? s.percentage : (s.total > 0 ? Math.round((s.correct / s.total) * 100) : null);
    const baseAll = progSubject === 'all' ? allSessions : allSessions.filter(s => s.subject === progSubject);
    const base = baseAll.filter(s => s.date && scoreOf(s) != null);
    const sorted = [...base].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sorted.length === 0) return [];

    if (chartMode === 'epreuves') {
      const sessions = isPremiumPlus ? sorted.slice(-20) : sorted.slice(-10);
      return sessions.map(s => ({
        label: new Date(s.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        value: scoreOf(s),
      }));
    }

    if (chartMode === 'jours') {
      const dayMap = {};
      sorted.forEach(s => {
        const key = s.date.split('T')[0];
        if (!dayMap[key]) dayMap[key] = [];
        dayMap[key].push(scoreOf(s));
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
        weekMap[key].push(scoreOf(s));
      });
      const weeks = Object.entries(weekMap).sort(([a], [b]) => a.localeCompare(b));
      const sliced = isPremiumPlus ? weeks.slice(-12) : weeks.slice(-8);
      return sliced.map(([key, scores]) => ({
        label: new Date(key).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        value: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      }));
    }

    return [];
  }, [allSessions, chartMode, isPremiumPlus, progSubject]);

  // Dynamic subtitle
  // Premier QCM de bienvenue : à la toute première visite d'un compte sans aucune session,
  // on ouvre automatiquement l'écran « Tes 5 premières questions » (une seule fois, flag localStorage).
  useEffect(() => {
    if (!qcmLoaded || !examLoaded || data.hasAnySessions) return;
    if (activeQCM || activeExamen) return;
    if (localStorage.getItem('ppl-welcome-qcm-shown') === '1') return;
    localStorage.setItem('ppl-welcome-qcm-shown', '1');
    openQCM({ welcome: true, subjectName: 'Bienvenue', title: 'Bienvenue' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qcmLoaded, examLoaded, data.hasAnySessions]);

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

  // ---- Étapes de l'onboarding (présentent chacune une fonction du dashboard) ----
  const onboardSteps = onboardOn ? [
    {
      id: 'date', label: 'Renseigne ta date de partiels',
      desc: 'Pico 🦉 t\'affichera un compte à rebours et adaptera ses conseils',
      done: !!user.user_metadata?.exam_date,
      cta: () => setPicoSignal(k => k + 1), ctaLabel: 'Répondre à Pico',
    },
    {
      id: 'calibrage', label: 'Passe ton QCM de calibrage',
      desc: '20 questions sur les 6 matières — active tes recommandations et ton focus du jour',
      done: data.totalSessions >= 1,
      cta: () => openQCM({ type: 'custom', subject: null, subjectName: 'Calibrage', title: '', count: 20 }), ctaLabel: 'Go (~10 min)',
    },
    {
      id: 'fiches', label: 'Explore les Fiches & Cours',
      desc: 'Des fiches de révision par matière, chacune avec son QCM ciblé',
      done: fichesSeen,
      cta: () => { setActiveFicheSubject(null); setActiveSection('fiches'); }, ctaLabel: 'Explorer',
    },
    {
      id: 'flash', label: 'Lance une session éclair',
      desc: '8 questions chrono en 5 minutes — parfait entre deux cours',
      done: allSessions.some(s => s.flash),
      cta: () => { const s = todaySubject || SUBJECTS[1]; openQCM({ type: 'custom', subject: s.id, subjectName: s.name, title: s.name, count: 8, flash: true }); }, ctaLabel: '⚡ 5 min',
    },
  ] : [];
  const onboardVisible = onboardOn && !onboardSteps.every(s => s.done);

  return (
    <div style={{ background: '#f6f5fb', height: '100vh', overflow: 'hidden' }}>

      {/* ===== OVERLAY EXAMEN EMBARQUÉ ===== */}
      {/* Sidebar visible pendant la sélection (left:220px sur desktop), plein écran pendant l'épreuve. */}
      {activeExamen && (
        <div
          className={examImmersive ? 'left-0' : 'left-0 md:left-[220px]'}
          style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 200, background: '#f8fafc', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #eef0f7', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={closeExamen} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: '#5f6280', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, transition: 'all .15s' }} className="hover:bg-gray-100 hover:text-gray-900">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
              Retour au tableau de bord
            </button>
            <div style={{ width: 1, height: 20, background: '#e2e4f0' }} />
            <span style={{ fontSize: 13, color: '#9ca3af' }}>Mode Examen</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <Suspense fallback={null}>
              <ExamenPage onBack={closeExamen} onViewChange={setExamenView} />
            </Suspense>
          </div>
        </div>
      )}

      {/* ===== OVERLAY QCM EMBARQUÉ ===== */}
      {/* Pendant la sélection (mode/matière/fiche/sujet), l'overlay laisse la sidebar visible sur desktop (left:220px).
          Pendant le quiz, il passe en plein écran immersif (left:0). */}
      {activeQCM && (
        <div
          className={qcmImmersive ? 'left-0' : 'left-0 md:left-[220px]'}
          style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 200, background: '#f8fafc', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
        >
          {/* Barre de navigation overlay */}
          <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #eef0f7', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <button onClick={closeQCM} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: '#5f6280', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, transition: 'all .15s' }} className="hover:bg-gray-100 hover:text-gray-900">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
              Retour au tableau de bord
            </button>
            <div style={{ width: 1, height: 20, background: '#e2e4f0' }} />
            <span style={{ fontSize: 13, color: '#9ca3af' }}>QCM · {activeQCM.subjectName || activeQCM.title}</span>
          </div>
          {/* QCM embarqué */}
          <div style={{ flex: 1 }}>
            <Suspense fallback={null}>
              <QCMPage key={qcmKey} initialConfig={activeQCM} onBack={closeQCM} onViewChange={setQcmView} />
            </Suspense>
          </div>
        </div>
      )}

      {/* ===== BARRE MOBILE HAUTE ===== */}
      <div className="md:hidden flex items-center justify-between" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #eef0f7', padding: '0 16px', height: 56 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, background: '#4f46e5', borderRadius: 8, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0f1020' }}>Prépa <span style={{ color: '#4f46e5' }}>PASS/LAS</span></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#ece9ff', color: '#4f46e5', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>
            {(user.displayName?.[0] || user.email?.[0] || '?').toUpperCase()}
          </div>
          <button onClick={() => setMobileMenuOpen(true)} style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#2a2c44', display: 'flex' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* ===== TIROIR DE NAVIGATION MOBILE ===== */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150, display: 'flex' }}>
          {/* Backdrop */}
          <div className="drawer-backdrop" style={{ position: 'absolute', inset: 0, background: 'rgba(15,16,32,0.45)', backdropFilter: 'blur(2px)', animation: 'drawerBackdropIn .2s ease-out' }} onClick={() => setMobileMenuOpen(false)} />
          {/* Drawer */}
          <div className="drawer-panel" style={{ position: 'relative', width: 300, maxWidth: '85vw', background: '#fff', height: '100%', overflowY: 'auto', padding: '16px 14px calc(16px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', zIndex: 1, borderRadius: '0 20px 20px 0', animation: 'drawerSlideIn .22s cubic-bezier(0.16,1,0.3,1)' }}>

            {/* En-tête : identité + gamification (tap → Mon compte) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
              <button
                onClick={() => { setActiveSection('account'); setMobileMenuOpen(false); }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 11, padding: '10px 11px', borderRadius: 14, background: 'linear-gradient(135deg, #f2f0fe, #faf9ff)', border: '1px solid #e8e6f5', cursor: 'pointer', textAlign: 'left', minWidth: 0 }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#4f46e5', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                  {(user.displayName?.[0] || user.email?.[0] || '?').toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: '#0f1020', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.displayName || user.email}</p>
                  {data.hasAnySessions ? (
                    <p style={{ fontSize: 11, color: '#5f6280', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{gam.grade.emoji} {gam.grade.name}</span>
                      <span style={{ color: '#c9cbdd' }}>·</span>
                      <span>🔥 {gam.streakInfo.streak}</span>
                    </p>
                  ) : (
                    <p style={{ fontSize: 11, color: '#8a8ea8', margin: '3px 0 0' }}>{tier === 'gratuit' ? 'Compte gratuit' : 'Premium'} · Mon compte</p>
                  )}
                </div>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#8a8ea8" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Fermer le menu" style={{ padding: 8, borderRadius: 10, background: '#f5f5f8', border: 'none', cursor: 'pointer', color: '#5f6280', display: 'flex', marginTop: 2 }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Actions rapides : grille de tuiles colorées */}
            <div style={{ fontSize: 10.5, letterSpacing: 1.2, fontWeight: 700, color: '#8a8ea8', textTransform: 'uppercase', marginBottom: 8 }}>Actions rapides</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'QCM', sub: 'Entraînement', bg: '#ece9ff', color: '#4f46e5',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
                  onClick: () => { openQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' }); setMobileMenuOpen(false); } },
                { label: 'Examen blanc', sub: 'Conditions réelles', bg: '#fdeaef', color: '#e45770',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
                  onClick: () => { openExamen(); setMobileMenuOpen(false); } },
                { label: 'Session éclair', sub: '8 questions · 5 min', bg: '#fdf3e0', color: '#e8a948',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />,
                  onClick: () => { const s = todaySubject || SUBJECTS[1]; openQCM({ type: 'custom', subject: s.id, subjectName: s.name, title: s.name, count: 8, flash: true }); setMobileMenuOpen(false); } },
                { label: 'À consolider', sub: reviewDue.length > 0 ? `${reviewDue.length} question${reviewDue.length > 1 ? 's' : ''}` : 'Tout est à jour', bg: '#e0f3eb', color: '#3eb489', disabled: reviewDue.length === 0, badge: reviewDue.length || null,
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />,
                  onClick: () => { launchReview(); setMobileMenuOpen(false); } },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={a.disabled ? undefined : a.onClick}
                  disabled={a.disabled}
                  style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 7, padding: '11px 12px', borderRadius: 14, background: a.bg, border: 'none', cursor: a.disabled ? 'default' : 'pointer', textAlign: 'left', opacity: a.disabled ? 0.55 : 1 }}
                >
                  <span style={{ width: 28, height: 28, borderRadius: 9, background: a.color, color: '#fff', display: 'grid', placeItems: 'center' }}>
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">{a.icon}</svg>
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#0f1020', lineHeight: 1.2 }}>{a.label}</span>
                    <span style={{ display: 'block', fontSize: 10.5, color: '#5f6280', marginTop: 2 }}>{a.sub}</span>
                  </span>
                  {a.badge && (
                    <span style={{ position: 'absolute', top: 9, right: 10, fontSize: 10, fontWeight: 800, color: '#fff', background: a.color, borderRadius: 20, padding: '2px 7px' }}>{a.badge}</span>
                  )}
                </button>
              ))}
            </div>
            {[
              { group: 'Réviser', items: [
                { id: 'overview', label: "Vue d'ensemble", accent: '#4f46e5', accentBg: '#f2f0fe', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /> },
                { id: 'fiches', label: 'Fiches & Cours', accent: '#7c3aed', accentBg: '#f3edff', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5zM19 18v3H6" /> },
              ]},
              { group: 'Progresser', items: [
                { id: 'historique', label: 'Historique', accent: '#3eb489', accentBg: '#e5f6ee', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /> },
                { id: 'progression', label: 'Progression', locked: !isPremiumPlus, accent: '#4f8ff7', accentBg: '#e4edff', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /> },
                { id: 'objectifs', label: 'Objectifs', locked: !isPremiumPlus, accent: '#7c3aed', accentBg: '#f3edff', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /> },
                { id: 'classement', label: 'Classement', locked: !isPremiumPlus, accent: '#e8a948', accentBg: '#fdf4e2', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172" /> },
              ]},
            ].map(section => (
              <Fragment key={section.group}>
                <div style={{ fontSize: 10.5, letterSpacing: 1.2, fontWeight: 700, color: '#8a8ea8', textTransform: 'uppercase', margin: '4px 0 6px' }}>{section.group}</div>
                {section.items.map(item => {
                  const isAct = item.id === 'fiches' ? activeSection === 'fiches' : activeSection === item.id;
                  return (
                    <button key={item.id}
                      onClick={() => {
                        if (item.id === 'fiches') { setActiveFicheSubject(null); setActiveSection('fiches'); }
                        else { setActiveSection(item.id); }
                        setMobileMenuOpen(false);
                      }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '8px 9px', borderRadius: 12, marginBottom: 3, background: isAct ? item.accentBg : 'transparent', color: isAct ? item.accent : '#2a2c44', fontSize: 14, fontWeight: isAct ? 700 : 500, border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      className={isAct ? '' : 'hover:bg-gray-50 transition-colors'}
                    >
                      <span style={{ width: 30, height: 30, borderRadius: 9, background: isAct ? item.accent : item.accentBg, color: isAct ? '#fff' : item.accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">{item.icon}</svg>
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.locked && <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#8a8ea8" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>}
                    </button>
                  );
                })}
              </Fragment>
            ))}
            {/* Upgrade premium (mobile) */}
            {!isPremiumPlus && (
              <Link
                href="/tarifs"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0', padding: '14px 16px', borderRadius: 14, background: 'linear-gradient(135deg, #4f46e5 0%, #8257f9 100%)', textDecoration: 'none' }}
              >
                <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>Passer Premium</p>
                  <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', margin: '2px 0 0' }}>Progression, Objectifs & Classement</p>
                </div>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}

            {/* Déconnexion */}
            <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #eef0f7' }}>
              <button
                onClick={async () => { try { await logOut(); router.push('/'); } catch (e) { console.error(e); } }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'transparent', border: 'none', color: '#e45770', fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}
                className="hover:bg-rose-50 transition-colors"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== BARRE DE NAVIGATION MOBILE BASSE ===== */}
      <div className="md:hidden flex items-stretch" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(14px)', borderTop: '1px solid #eef0f7', height: 'calc(62px + env(safe-area-inset-bottom))', paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -6px 20px rgba(15,16,32,0.05)' }}>
        {[
          { id: 'overview', label: 'Accueil', icon: <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /></svg> },
          { id: 'fiches', label: 'Fiches', icon: <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5zM19 18v3H6" /></svg> },
          { id: 'qcm', label: 'QCM', fab: true },
          { id: 'historique', label: 'Historique', icon: <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg> },
          { id: 'menu', label: 'Menu', badge: reviewDue.length || null, icon: <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg> },
        ].map(item => {
          const isAct = item.id === 'menu' || item.fab ? false : (item.id === 'fiches' ? activeSection === 'fiches' : activeSection === item.id);
          const onTap = () => {
            if (item.id === 'menu') { setMobileMenuOpen(true); return; }
            if (item.id === 'qcm') { openQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' }); return; }
            if (item.id === 'fiches') { setActiveFicheSubject(null); setActiveSection('fiches'); return; }
            setActiveSection(item.id);
          };

          {/* Bouton central QCM : FAB surélevé en dégradé */}
          if (item.fab) {
            return (
              <button key={item.id} onClick={onTap} aria-label="Lancer un QCM"
                style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 7, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <span style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 8px 20px rgba(79,70,229,0.38), 0 0 0 4px #fff', display: 'grid', placeItems: 'center', color: '#fff' }}
                  className="active:scale-95 transition-transform"
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.2, color: '#4f46e5' }}>{item.label}</span>
              </button>
            );
          }

          return (
            <button key={item.id} onClick={onTap}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', color: isAct ? '#4f46e5' : '#8a8ea8', padding: '5px 0 7px', transition: 'color .15s' }}
            >
              <span style={{ position: 'relative', width: 44, height: 27, borderRadius: 14, background: isAct ? '#ece9ff' : 'transparent', display: 'grid', placeItems: 'center', transition: 'background .15s' }}>
                {item.icon}
                {item.badge && (
                  <span style={{ position: 'absolute', top: -3, right: 2, minWidth: 15, height: 15, borderRadius: 8, background: '#4f46e5', color: '#fff', fontSize: 9, fontWeight: 800, display: 'grid', placeItems: 'center', padding: '0 3px', boxShadow: '0 0 0 2px #fff' }}>
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </span>
              <span style={{ fontSize: 10, fontWeight: isAct ? 700 : 500, letterSpacing: 0.2 }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', height: '100vh' }}>

        {/* ===== SIDEBAR ===== */}
        <DashboardSideNav
          activeSection={activeSection}
          setActiveSection={(s) => { if (activeQCM) closeQCM(); if (activeExamen) closeExamen(); setActiveSection(s); }}
          isPremiumPlus={isPremiumPlus}
          tier={tier}
          onLaunchQCM={() => openQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })}
          onLaunchExamen={() => openExamen()}
          onOpenFiches={(subjectId) => { if (activeQCM) closeQCM(); if (activeExamen) closeExamen(); setActiveFicheSubject(subjectId || null); setActiveSection('fiches'); }}
          onLaunchFlash={todaySubject ? () => openQCM({ type: 'custom', subject: todaySubject.id, subjectName: todaySubject.name, title: todaySubject.name, count: 8, flash: true }) : null}
          onLaunchReview={launchReview}
          reviewCount={reviewDue.length}
          gam={data.hasAnySessions ? gam : null}
          onShowGrade={() => { setActiveSection('overview'); setGradeOpen(true); }}
        />

        {/* ===== MAIN CONTENT ===== */}
        <main ref={mainRef} className="md:pt-5 md:px-9 pt-[72px] px-4 pb-[80px] md:pb-5" style={{ flex: 1, minWidth: 0, maxWidth: '100%', overflowY: 'auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>

          {/* GREETING */}
          <div className="hidden md:flex" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexShrink: 0 }}>
            <div>
              <p style={{ fontSize: 13, color: '#5f6280', marginBottom: 4 }}>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              {activeSection === 'overview' && (
                <h1 className="font-jakarta" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, margin: 0, color: '#0f1020' }}>
                  Bonjour {user.displayName ? user.displayName.split(' ')[0] : ''}
                </h1>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {data.hasAnySessions && (
                <>
                  {/* Grade + progression XP (cliquable → popover explicatif) */}
                  <GradePill gam={gam} open={gradeOpen} setOpen={setGradeOpen} />
                  {/* Streak + jokers */}
                  <div title={`${gam.streakInfo.streak} jour${gam.streakInfo.streak > 1 ? 's' : ''} d'affilée · ${gam.streakInfo.jokersLeft} joker${gam.streakInfo.jokersLeft > 1 ? 's' : ''} restant${gam.streakInfo.jokersLeft > 1 ? 's' : ''} ce mois-ci (un joker protège ta série un jour manqué)`}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #eef0f7', borderRadius: 20, padding: '6px 12px' }}>
                    <span style={{ fontSize: 13 }}>🔥</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0f1020' }}>{gam.streakInfo.streak}</span>
                    <span style={{ fontSize: 10.5, color: '#8a8ea8' }}>j</span>
                    <span style={{ fontSize: 10.5, color: '#8a8ea8', marginLeft: 2 }}>{'🧊'.repeat(gam.streakInfo.jokersLeft)}</span>
                  </div>
                </>
              )}
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ece9ff', color: '#4f46e5', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                {(user.displayName?.[0] || user.email?.[0] || '?').toUpperCase()}
              </div>
            </div>
          </div>
          {/* Mobile greeting (compact) */}
          <div className="md:hidden" style={{ marginBottom: 12, flexShrink: 0 }}>
            <p style={{ fontSize: 11, color: '#8a8ea8', marginBottom: 2, textTransform: 'capitalize' }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              {activeSection === 'overview' && (
                <h1 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.6, margin: 0, color: '#0f1020' }}>
                  Bonjour {user.displayName ? user.displayName.split(' ')[0] : ''} 👋
                </h1>
              )}
              {data.hasAnySessions && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <GradePill gam={gam} open={gradeOpen} setOpen={setGradeOpen} compact />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: '#fff', border: '1px solid #eef0f7', borderRadius: 16, padding: '4px 9px', fontSize: 11.5, fontWeight: 700, color: '#0f1020' }}>🔥 {gam.streakInfo.streak}</span>
                </div>
              )}
            </div>
          </div>

          {/* ===== VUE D'ENSEMBLE ===== */}
          {activeSection === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Bandeau essai Premium (48 h après inscription) */}
              {trialActive && trialEndsAt && (() => {
                const hoursLeft = Math.max(1, Math.ceil((trialEndsAt - new Date()) / 3600000));
                const daysLeft = Math.ceil(hoursLeft / 24);
                return (
                  <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4f46e5 70%, #7c3aed)', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 18 }}>🎁</span>
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: '#fff' }}>
                        Premium offert — encore {hoursLeft >= 24 ? `${daysLeft} jour${daysLeft > 1 ? 's' : ''}` : `${hoursLeft} h`} pour tout tester
                      </div>
                      <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)' }}>
                        QCM illimités, examens blancs, progression, classement… tout est débloqué.
                      </div>
                    </div>
                    <Link href="/tarifs" style={{ flexShrink: 0, background: '#fff', color: '#4f46e5', borderRadius: 9, padding: '8px 14px', fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }} className="hover:bg-indigo-50 transition-colors">
                      Garder Premium →
                    </Link>
                  </div>
                );
              })()}
              {/* Bandeau essai terminé (fenêtre de 5 jours, refermable) */}
              {trialEndedRecently && !trialEndDismissed && (
                <div style={{ background: 'linear-gradient(135deg, #312e81, #6d28d9)', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 18 }}>🔓</span>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#fff' }}>Ton essai Premium est terminé</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.78)' }}>
                      Tes XP, ta série 🔥 et tes stats sont conservés. Repasse Premium pour retrouver les QCM illimités et ta progression.
                    </div>
                  </div>
                  <Link href="/tarifs" style={{ flexShrink: 0, background: '#fff', color: '#6d28d9', borderRadius: 9, padding: '8px 14px', fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }} className="hover:bg-indigo-50 transition-colors">
                    Repasser Premium — 12,50 €/mois
                  </Link>
                  <button
                    onClick={() => { localStorage.setItem('ppl-trial-ended-dismissed', '1'); setTrialEndDismissed(true); }}
                    aria-label="Fermer"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 3, display: 'flex', flexShrink: 0 }}
                    className="hover:text-white"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}
              {/* Offre de rentrée — comptes gratuits uniquement (masqué pendant l'essai,
                  qui a déjà son propre bandeau) */}
              {promoInfo && tier === 'gratuit' && !trialActive && (
                <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4f46e5 55%, #7c3aed)', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ background: '#fcd34d', color: '#1e1b4b', borderRadius: 999, padding: '4px 11px', fontSize: 12, fontWeight: 900, flexShrink: 0 }}>
                    🎓 -50 % À VIE
                  </span>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#fff' }}>
                      Offre de rentrée — Premium à 12,49 €/mois au lieu de 24,99 €
                    </div>
                    <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.78)' }}>
                      La remise est conservée tant que tu restes abonné · jusqu&apos;au {promoInfo.deadline} (J-{promoInfo.days})
                    </div>
                  </div>
                  <Link href="/tarifs" style={{ flexShrink: 0, background: '#fff', color: '#4f46e5', borderRadius: 9, padding: '8px 14px', fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }} className="hover:bg-indigo-50 transition-colors">
                    J&apos;en profite →
                  </Link>
                </div>
              )}
              {resumeState && (() => {
                const done = resumeState.answers.filter(a => a != null).length;
                const tot = resumeState.questions.length;
                return (
                  <div style={{ background: 'linear-gradient(to right, #eef2ff, #f5f3ff)', border: '1px solid #c7d2fe', borderRadius: 14, padding: '11px 15px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: '#4f46e5', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 15 }}>💾</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f1020' }}>Session en cours : {resumeState.selectedTopic?.title || resumeState.selectedTopic?.subjectName || 'QCM'} · {done}/{tot}</div>
                      <div style={{ fontSize: 11.5, color: '#5f6280' }}>Tu peux reprendre là où tu t'es arrêté.</div>
                    </div>
                    <button onClick={resumeQcmSession} style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 9, padding: '8px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }} className="hover:bg-indigo-700 transition-colors">Reprendre →</button>
                    <button onClick={dismissResume} aria-label="Abandonner la session" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a8ea8', padding: 3, display: 'flex', flexShrink: 0 }} className="hover:text-gray-600">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                );
              })()}
              {onboardVisible && (
                <OnboardingChecklist steps={onboardSteps} onDismiss={dismissOnboard} />
              )}
              <ActionHub
                todaySubject={todaySubject}
                reviewDue={reviewDue}
                subjects={SUBJECTS}
                onLaunchQCM={setActiveQCM}
                onLaunchExamen={() => openExamen()}
                onOpenFiches={() => { setActiveFicheSubject(null); setActiveSection('fiches'); }}
                onLaunchReview={launchReview}
                quests={gam.quests}
                showQuests={data.hasAnySessions}
              />
              {/* Parcours vers le concours */}
              <ConcoursPath examDate={user.user_metadata?.exam_date || null} onSetDate={() => setPicoSignal(k => k + 1)} />
              {/* Contact bas de page — lien discret, masqué sur mobile */}
              <Link href="/contact" style={{ flexShrink: 0, marginTop: 4, textDecoration: 'none' }} className="hidden md:flex items-center justify-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10.5h8M8 14h5m-9 5.5 3.5-3H18a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v13z" /></svg>
                <span style={{ fontSize: 12.5 }}>Un bug ou une suggestion ? <span style={{ color: '#7c3aed', fontWeight: 600 }}>Signale-le</span></span>
              </Link>
            </div>
          )}

          {/* Sections non-overview */}
          <div className={`${activeSection !== 'overview' ? 'space-y-6' : 'hidden'} md:flex-1 md:min-h-0`}>

            {/* ===== FICHES & COURS ===== */}
            {activeSection === 'fiches' && (
              <FichesSection initialSubject={activeFicheSubject} onLaunchQCM={setActiveQCM} />
            )}

            {/* ===== HISTORIQUE ===== */}
            {activeSection === 'historique' && (() => {
              const pctOf = (s) => Number.isFinite(s.percentage) ? s.percentage : (s.total > 0 ? Math.round((s.correct / s.total) * 100) : null);
              const valid = filteredHistory.map(pctOf).filter(x => x != null);
              const avg = valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 0;
              const best = valid.length ? Math.max(...valid) : 0;
              const totalSec = filteredHistory.reduce((a, s) => a + (s.duration || 0), 0);
              const fmtTot = (sec) => { if (!sec) return '\u2014'; const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60); return h ? `${h}h${m ? ` ${m}min` : ''}` : `${m}min`; };
              const relDate = (iso) => { if (!iso) return '\u2014'; const d = new Date(iso), now = new Date(); const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()), nn = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const diff = Math.round((nn - dd) / 864e5); if (diff === 0) return "Aujourd'hui"; if (diff === 1) return 'Hier'; return formatDate(iso); };
              const timeOf = (iso) => { try { return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
              const stats = [
                { label: 'Sessions', value: String(filteredHistory.length), cls: 'text-gray-900' },
                { label: 'Score moyen', value: `${avg}%`, cls: scoreClass(avg) },
                { label: 'Meilleur score', value: `${best}%`, cls: 'text-emerald-600' },
                { label: 'Temps total', value: fmtTot(totalSec), cls: 'text-gray-900' },
              ];
              return (
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
                    <EmptyState title="Aucune session" description="Aucune session trouv\u00e9e pour ce filtre." onCta={() => openQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })} ctaLabel="Commencer un QCM" />
                  </div>
                ) : (
                  <>
                    {/* Bandeau de statistiques */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 border-y border-gray-100">
                      {stats.map(st => (
                        <div key={st.label} className="bg-white px-5 py-3.5">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{st.label}</div>
                          <div className={`text-xl font-black tabular-nums ${st.cls}`}>{st.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50/60 border-b border-gray-100">
                            <th className="text-left py-2.5 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="text-left py-2.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="text-left py-2.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Session</th>
                            <th className="text-left py-2.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Score</th>
                            <th className="text-right py-2.5 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Durée</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredHistory.slice(0, visibleCount).map((s, i) => {
                            const colors = getSubjectBadgeColors(s.subject);
                            const pct = pctOf(s);
                            const name = s.subjectName || getSubjectName(s.subject);
                            const hasTopic = s.topic && s.topic !== name;
                            return (
                              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                <td className="py-3 px-5 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-700">{relDate(s.date)}</div>
                                  <div className="text-[11px] text-gray-400 tabular-nums">{timeOf(s.date)}</div>
                                </td>
                                <td className="py-3 px-4"><span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${TYPE_BADGE[s._type] || TYPE_BADGE.QCM}`}>{s._type}</span></td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>{name}</span>
                                  {hasTopic && <div className="text-[11px] text-gray-400 mt-1 truncate max-w-[220px]">{s.topic}</div>}
                                </td>
                                <td className="py-3 px-4">
                                  {pct == null ? (
                                    <span className="text-sm text-gray-300">&mdash;</span>
                                  ) : (
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden shrink-0"><div className={`h-full rounded-full ${scoreBarClass(pct)}`} style={{ width: `${pct}%` }} /></div>
                                      <span className={`text-sm font-bold tabular-nums ${scoreClass(pct)}`}>{pct}%</span>
                                      {s.total > 0 && <span className="text-[11px] text-gray-400 tabular-nums hidden sm:inline">{s.correct}/{s.total}</span>}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-5 text-sm text-gray-500 text-right whitespace-nowrap tabular-nums">{formatDuration(s.duration)}</td>
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
              );
            })()}

            {/* ===== PROGRESSION (Premium) ===== */}
            {activeSection === 'progression' && (
              <PremiumBlurGate
                locked={!isPremiumPlus}
                title="Progression détaillée"
                description="Visualisez votre courbe de progression, vos points forts et axes d'amélioration."
              >
              {!data.hasAnySessions || data.last20.length < 2 ? (
                  <EmptyState title="Pas assez de donn&eacute;es" description="Effectuez plusieurs sessions pour voir votre progression." onCta={() => openQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })} ctaLabel="Commencer un QCM" />
                ) : (() => {
                  const w = data.weaknesses[0];
                  const delta = (data.last5Avg != null && data.prev5Avg != null) ? data.last5Avg - data.prev5Avg : null;
                  const coachHead = data.trend === 'up' ? 'Belle dynamique, tu progresses' : data.trend === 'down' ? 'Petit coup de mou récemment' : 'Rythme régulier';
                  const filterSubjects = Object.values(data.subjectStats).filter(s => s.count > 0).sort((a, b) => b.avg - a.avg);
                  const chip = (on) => `px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${on ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`;
                  return (
                  <div className="space-y-5">
                    {/* Bandeau coach */}
                    <div className="rounded-2xl border border-violet-100 shadow-sm p-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg,#f4f1fe 0%,#ffffff 55%)' }}>
                      <div className="w-11 h-11 rounded-full bg-violet-100 grid place-items-center text-2xl shrink-0">🦉</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-black text-gray-900 tracking-tight">{coachHead}{delta != null && data.trend !== 'stable' ? ` (${delta >= 0 ? '+' : ''}${delta} pts)` : ''}</div>
                        <div className="text-[12.5px] text-gray-600 mt-0.5">
                          {w
                            ? <>Moyenne de <strong>{data.avgScore}%</strong> sur {data.totalSessions} sessions. <strong>{w.name}</strong> reste ton point faible ({w.avg}%) — quelques QCM cibl&eacute;s et tu passes la barre.</>
                            : <>Moyenne de <strong>{data.avgScore}%</strong> sur {data.totalSessions} sessions. Continue comme &ccedil;a&nbsp;!</>}
                        </div>
                      </div>
                      {w && (
                        <button onClick={() => openQCM({ type: 'custom', subject: w.id, subjectName: w.name, title: w.name, count: 10 })} className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 px-3.5 py-2 rounded-lg transition-colors shrink-0">
                          Travailler {w.name}
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        </button>
                      )}
                    </div>

                    {/* Bandeau KPI */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
                        {[
                          { label: 'Score moyen', value: `${data.avgScore}%`, cls: scoreClass(data.avgScore) },
                          { label: 'Sessions', value: String(data.totalSessions), cls: 'text-gray-900' },
                          { label: 'Meilleur score', value: `${data.bestSessionPct}%`, cls: 'text-emerald-600' },
                          { label: 'Régularité', value: `${gam.streakInfo.streak} j`, cls: 'text-amber-600' },
                        ].map(st => (
                          <div key={st.label} className="bg-white px-5 py-3.5">
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{st.label}</div>
                            <div className={`text-xl font-black tabular-nums ${st.cls}`}>{st.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Évolution des scores + filtre matière */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>&Eacute;volution des scores</h3>
                        <div className="flex items-center gap-2">
                          {data.trend === 'up' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>En progression</span>}
                          {data.trend === 'down' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 5.834 5.46l2.63 1.326m0 0 .311-6.228m-.311 6.228-5.94-2.281" /></svg>En baisse</span>}
                          {data.trend === 'stable' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Stable</span>}
                        </div>
                      </div>
                      {filterSubjects.length > 1 && (
                        <div className="flex gap-2 flex-wrap mb-3">
                          <button onClick={() => setProgSubject('all')} className={chip(progSubject === 'all')}>Toutes</button>
                          {filterSubjects.map(s => (
                            <button key={s.id} onClick={() => setProgSubject(s.id)} className={chip(progSubject === s.id)}>{s.name}</button>
                          ))}
                        </div>
                      )}
                      <div className="mt-1">
                        <ScoreLineChart points={chartData} target={data.targetScore} />
                      </div>
                      {progSubject === 'all' && data.last5Avg !== null && data.prev5Avg !== null && (
                        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-sm"><span className="text-gray-500">5 derni&egrave;res :</span><span className={`font-bold ${scoreClass(data.last5Avg)}`}>{data.last5Avg}%</span></div>
                          <div className="flex items-center gap-1.5 text-sm"><span className="text-gray-500">5 pr&eacute;c&eacute;dentes :</span><span className={`font-bold ${scoreClass(data.prev5Avg)}`}>{data.prev5Avg}%</span></div>
                          <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${data.last5Avg >= data.prev5Avg ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{data.last5Avg >= data.prev5Avg ? '+' : ''}{data.last5Avg - data.prev5Avg}%</span>
                        </div>
                      )}
                    </div>

                    {/* Performance par matière */}
                    {data.hasMultipleSubjects && (
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>Performance par mati&egrave;re</h3>
                        <div className="space-y-3.5">
                          {Object.values(data.subjectStats).filter(s => s.count > 0).sort((a, b) => b.avg - a.avg).map(s => (
                            <div key={s.id} className="flex items-center gap-3">
                              <div className="w-28 sm:w-40 shrink-0 text-[13px] font-semibold text-gray-800 truncate">{s.name}</div>
                              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${scoreBarClass(s.avg)}`} style={{ width: `${s.avg}%` }} /></div>
                              <div className={`w-11 text-right text-sm font-bold tabular-nums ${scoreClass(s.avg)}`}>{s.avg}%</div>
                              <div className="w-14 text-right text-[11px] text-gray-400 tabular-nums hidden sm:block">{s.count} sess.</div>
                            </div>
                          ))}
                        </div>
                        {data.weaknesses.length > 0 && (
                          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                            <span className="text-[13px] text-gray-500">&Agrave; renforcer en priorit&eacute; : <strong className="text-gray-800">{data.weaknesses[0].name}</strong> <span className="tabular-nums">({data.weaknesses[0].avg}%)</span></span>
                            <button onClick={() => openQCM({ type: 'custom', subject: data.weaknesses[0].id, subjectName: data.weaknesses[0].name, title: data.weaknesses[0].name, count: 10 })} className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-lg transition-colors">
                              Travailler {data.weaknesses[0].name}
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  );
                })()}
              </PremiumBlurGate>
            )}

            {/* ===== OBJECTIFS (Premium) ===== */}
            {activeSection === 'objectifs' && (
              <PremiumBlurGate
                locked={!isPremiumPlus}
                title="Objectifs & Statistiques"
                description="Suivez vos objectifs hebdomadaires et visualisez la répartition de vos sessions."
              >
              {!data.hasAnySessions ? (
                <EmptyState title="Aucune donn&eacute;e" description="Effectuez des sessions pour voir vos objectifs." onCta={() => openQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })} ctaLabel="Commencer un QCM" />
              ) : (() => {
                const streak = gam.streakInfo.streak;
                const record = Math.max(data.bestStreak || 0, streak);
                const weekMins = Math.round((data.thisWeekTime || 0) / 60); // durées en secondes → minutes
                const fmtMin = (m) => m >= 60 ? `${Math.floor(m / 60)}h${m % 60 > 0 ? String(m % 60).padStart(2, '0') : ''}` : `${m} min`;
                const sessPct = Math.min(100, Math.round((data.thisWeekSessions / weeklyGoals.sessions) * 100));
                const timePct = Math.min(100, Math.round((weekMins / weeklyGoals.timeMin) * 100));
                const daysPct = Math.min(100, Math.round((data.thisWeekActiveDays / weeklyGoals.days) * 100));
                const goalsMet = [sessPct >= 100, timePct >= 100, daysPct >= 100].filter(Boolean).length;
                const weekOverall = Math.round((sessPct + timePct + daysPct) / 3);
                const subjects = Object.values(data.subjectStats).filter(s => s.count > 0).sort((a, b) => b.avg - a.avg);
                const friseN = Math.min(Math.max(record, 7), 12);
                const scoreDelta = (data.last5Avg !== null && data.prev5Avg !== null) ? data.last5Avg - data.prev5Avg : null;
                const goals = [
                  { name: 'Sessions', val: `${data.thisWeekSessions} / ${weeklyGoals.sessions}`, pct: sessPct, color: '#7c3aed' },
                  { name: 'Temps d’étude', val: `${fmtMin(weekMins)} / ${fmtMin(weeklyGoals.timeMin)}`, pct: timePct, color: '#4f46e5' },
                  { name: 'Jours actifs', val: `${data.thisWeekActiveDays} / ${weeklyGoals.days}`, pct: daysPct, color: '#a855f7' },
                ];
                return (
                <div className="space-y-5">
                  {/* Objectif de la semaine + Régularité */}
                  <div className="grid md:grid-cols-3 gap-5">
                    <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-violet-500"></span>Objectif de la semaine</h3>
                        {editGoals ? (
                          <span className="text-xs font-semibold text-gray-400">D&eacute;finis tes objectifs</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">{goalsMet}/3 atteints</span>
                            <button onClick={openEditGoals} title="Modifier mes objectifs" className="text-gray-400 hover:text-violet-600 transition-colors p-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" /></svg>
                            </button>
                          </div>
                        )}
                      </div>
                      {editGoals ? (
                        <div className="space-y-2.5">
                          {[
                            { key: 'sessions', label: 'Sessions', min: 1, max: 50, step: 1, fmt: (v) => `${v}` },
                            { key: 'timeMin', label: 'Temps d’étude', min: 30, max: 600, step: 30, fmt: (v) => fmtMin(v) },
                            { key: 'days', label: 'Jours actifs', min: 1, max: 7, step: 1, fmt: (v) => `${v}` },
                          ].map(f => (
                            <div key={f.key} className="flex items-center justify-between gap-3 py-1">
                              <span className="text-[13px] text-gray-700 font-medium">{f.label} <span className="text-gray-400">/ semaine</span></span>
                              <div className="flex items-center gap-2">
                                <button onClick={() => setGoalsDraft(d => ({ ...d, [f.key]: Math.max(f.min, (d[f.key] || f.min) - f.step) }))} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600 grid place-items-center text-lg font-bold transition-colors" aria-label="Diminuer">&minus;</button>
                                <span className="w-16 text-center text-sm font-bold text-gray-900 tabular-nums">{f.fmt(goalsDraft[f.key])}</span>
                                <button onClick={() => setGoalsDraft(d => ({ ...d, [f.key]: Math.min(f.max, (d[f.key] || f.min) + f.step) }))} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600 grid place-items-center text-lg font-bold transition-colors" aria-label="Augmenter">+</button>
                              </div>
                            </div>
                          ))}
                          <div className="flex gap-2 pt-2">
                            <button onClick={saveWeeklyGoals} disabled={goalsSaving} className="flex-1 py-2 rounded-lg bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 disabled:opacity-60 transition-colors">{goalsSaving ? 'Enregistrement…' : 'Enregistrer'}</button>
                            <button onClick={() => setEditGoals(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">Annuler</button>
                          </div>
                        </div>
                      ) : (
                      <div className="flex items-center gap-6">
                        <div className="relative w-[104px] h-[104px] shrink-0">
                          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#eef0f6" strokeWidth="12" />
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#7c3aed" strokeWidth="12" strokeLinecap="round" strokeDasharray="314" strokeDashoffset={314 * (1 - weekOverall / 100)} style={{ transition: 'stroke-dashoffset .6s ease' }} />
                          </svg>
                          <div className="absolute inset-0 grid place-items-center text-center">
                            <div><div className="text-2xl font-black text-gray-900 tabular-nums">{weekOverall}%</div><div className="text-[8px] font-bold text-gray-400 tracking-wider">SEMAINE</div></div>
                          </div>
                        </div>
                        <div className="flex-1 space-y-3">
                          {goals.map(g => (
                            <div key={g.name}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[12.5px] text-gray-600 font-medium">{g.name}</span>
                                <span className="text-[12.5px] font-bold text-gray-900 tabular-nums">{g.val} {g.pct >= 100 && <span className="text-emerald-500">&#10003;</span>}</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${g.pct}%`, background: g.color }} /></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col" style={{ background: 'linear-gradient(135deg,#f4f1fe 0%,#ffffff 72%)' }}>
                      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-violet-500"></span>R&eacute;gularit&eacute;</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-violet-700 tabular-nums">&#128293; {streak}</span>
                        <span className="text-[12.5px] text-gray-500 font-semibold">jours d&rsquo;affil&eacute;e</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Record : {record} jours{streak >= record ? ' · record égalé !' : ` · encore ${record - streak} pour l'égaler`}</p>
                      <div className="flex gap-1 mt-auto pt-4">
                        {Array.from({ length: friseN }).map((_, i) => (
                          <span key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i < streak ? '#7c3aed' : '#e4ddfb' }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Objectif score + Répartition */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Objectif score</h3>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-3xl font-black tabular-nums ${scoreClass(data.overallAvg)}`}>{data.overallAvg}%</span>
                        <span className="text-[12.5px] text-gray-400 font-semibold">&rarr; objectif {data.targetScore}%</span>
                      </div>
                      {scoreDelta !== null && (
                        <span className={`inline-flex items-center gap-1 mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${scoreDelta > 0 ? 'bg-emerald-100 text-emerald-700' : scoreDelta < 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                          {scoreDelta > 0 ? `▲ En progression (+${scoreDelta} pts)` : scoreDelta < 0 ? `▼ En baisse (${scoreDelta} pts)` : 'Score stable'}
                        </span>
                      )}
                      <div className="mt-4">
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
                          <div className={`h-full rounded-full transition-all duration-500 ${scoreBarClass(data.overallAvg)}`} style={{ width: `${Math.min(100, data.overallAvg)}%` }} />
                          <div className="absolute -top-1 h-4.5 w-0.5 bg-gray-500" style={{ left: `${data.targetScore}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-semibold mt-1.5"><span>0</span><span>Objectif {data.targetScore}%</span><span>100</span></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>R&eacute;partition des sessions</h3>
                      <div className="flex items-center gap-5">
                        <div className="relative w-[88px] h-[88px] shrink-0">
                          <div className="w-full h-full rounded-full" style={{ background: totalTypeCount > 0 ? `conic-gradient(${conicStops})` : '#e5e7eb' }} />
                          <div className="absolute inset-[11px] bg-white rounded-full flex items-center justify-center"><span className="text-base font-black text-gray-900">{totalTypeCount}</span></div>
                        </div>
                        <div className="space-y-2">
                          {segments.map(seg => (
                            <div key={seg.label} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
                              <span className="text-[13px] text-gray-700">{seg.label}</span>
                              <span className="text-[13px] font-bold text-gray-900 tabular-nums">{seg.count}</span>
                              <span className="text-[11px] text-gray-400 tabular-nums">({totalTypeCount > 0 ? Math.round((seg.count / totalTypeCount) * 100) : 0}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Maîtrise par matière */}
                  {data.hasMultipleSubjects && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>Ma&icirc;trise par mati&egrave;re</h3>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1.5"><span className="w-3 h-0.5 bg-gray-300 inline-block"></span> seuil vis&eacute; 70%</span>
                      </div>
                      <div className="space-y-3.5">
                        {subjects.map(s => (
                          <div key={s.id} className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                            <span className="w-28 sm:w-36 shrink-0 text-[13px] font-semibold text-gray-800 truncate">{s.name}</span>
                            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.avg}%`, background: s.color }} />
                              <div className="absolute top-0 h-full w-0.5 bg-gray-300" style={{ left: '70%' }} />
                            </div>
                            <span className={`w-11 text-right text-sm font-bold tabular-nums ${scoreClass(s.avg)}`}>{s.avg}%</span>
                            <span className="w-20 text-right text-[11px] text-gray-400 tabular-nums hidden sm:block">record {s.bestScore}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                );
              })()}
              </PremiumBlurGate>
            )}

            {/* ===== CLASSEMENT (Premium) ===== */}
            {activeSection === 'classement' && (
              <PremiumBlurGate
                locked={!isPremiumPlus}
                title="Classement hebdomadaire"
                description="Compare tes performances des 7 derniers jours avec les autres étudiants et grimpe dans le classement de la semaine."
              >
                <ClassementSection allSessions={allSessions} userId={user?.id} accessToken={accessToken} />
              </PremiumBlurGate>
            )}

            {/* ===== MON COMPTE ===== */}
            {activeSection === 'account' && (
              <AccountSection user={user} tier={tier} isPremiumPlus={isPremiumPlus} accessToken={accessToken} gam={data.hasAnySessions ? gam : null} data={data} />
            )}

          </div>
        </main>
      </div>

      {/* ===== MASCOTTE PICO ===== */}
      <PicoMascot
        data={data}
        todaySubject={todaySubject}
        firstName={user.displayName ? user.displayName.split(' ')[0] : ''}
        onLaunchQCM={setActiveQCM}
        statsLoaded={qcmLoaded && examLoaded}
        hidden={Boolean(activeQCM) || activeExamen}
        examDate={user.user_metadata?.exam_date || null}
        reviewDue={reviewDue}
        quests={gam.quests}
        gradeInfo={gam}
        picoOutfit={user.user_metadata?.pico_outfit || 'classic'}
        outfitContext={{ gradeIndex: gam.gradeIndex, streak: gam.streakInfo.streak }}
        openSignal={picoSignal}
        onShowGrade={() => setGradeOpen(true)}
      />
    </div>
  );
}

/* ============================================================
   GRADE — PASTILLE + POPOVER EXPLICATIF
   ============================================================ */
function GradePill({ gam, open, setOpen, compact = false }) {
  const XP_RULES = [
    { icon: '🔁', label: 'Question consolidée', xp: '6 XP' },
    { icon: '⚡', label: 'Question en session éclair', xp: '4 XP' },
    { icon: '✅', label: 'Bonne réponse classique', xp: '2 XP' },
    { icon: '🏁', label: 'Session terminée', xp: '+10 XP' },
    { icon: '🎯', label: 'Défi du jour validé', xp: '+20 à 40 XP' },
  ];
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Voir mon grade et le fonctionnement des XP"
        aria-expanded={open}
        title="Comment fonctionnent les XP ?"
        style={{ display: 'flex', alignItems: 'center', gap: compact ? 4 : 8, background: '#fff', border: '1px solid #eef0f7', borderRadius: compact ? 16 : 20, padding: compact ? '4px 9px' : '6px 13px', cursor: 'pointer' }}
        className="hover:border-violet-300 transition-colors"
      >
        <span style={{ fontSize: compact ? 12 : 14 }}>{gam.grade.emoji}</span>
        {!compact && <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0f1020' }}>{gam.grade.name}</span>}
        {!compact && (
          <div style={{ width: 54, height: 5, background: '#eef0f7', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${Math.round(gam.progress * 100)}%`, height: '100%', background: '#7c3aed', borderRadius: 3 }} />
          </div>
        )}
        <span style={{ fontSize: compact ? 11.5 : 10.5, color: compact ? '#0f1020' : '#8a8ea8', fontWeight: compact ? 700 : 600 }}>{gam.total} XP</span>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 60 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 61, width: 320, maxWidth: 'calc(100vw - 32px)', background: '#fff', border: '1px solid #e4ddfb', borderRadius: 16, boxShadow: '0 14px 36px rgba(124,58,237,0.16)', padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 26 }}>{gam.grade.emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f1020' }}>{gam.grade.name} · {gam.total.toLocaleString('fr-FR')} XP</div>
                <div style={{ fontSize: 11, color: '#8a8ea8' }}>
                  {gam.next ? `Encore ${gam.xpToNext.toLocaleString('fr-FR')} XP avant le grade ${gam.next.name}` : 'Grade maximum atteint — chapeau bas !'}
                </div>
              </div>
            </div>
            <div style={{ height: 7, background: '#eef0f7', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ width: `${Math.round(gam.progress * 100)}%`, height: '100%', background: '#7c3aed', borderRadius: 4 }} />
            </div>

            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: '#8a8ea8', marginBottom: 7 }}>Le parcours du carabin</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 14 }}>
              {GRADES.map((g, i) => {
                const isCurrent = i === gam.gradeIndex;
                const isDone = i < gam.gradeIndex;
                return (
                  <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 7, background: isCurrent ? '#f4f1fe' : 'transparent', border: isCurrent ? '1px solid #e4ddfb' : '1px solid transparent' }}>
                    <span style={{ fontSize: 13 }}>{g.emoji}</span>
                    <span style={{ flex: 1, fontSize: 12, fontWeight: isCurrent ? 700 : 400, color: isCurrent ? '#0f1020' : isDone ? '#8a8ea8' : '#5f6280', textDecoration: isDone ? 'line-through' : 'none' }}>{g.name}</span>
                    {isDone ? <span style={{ fontSize: 10.5, color: '#3eb489', fontWeight: 700 }}>✓</span>
                      : isCurrent ? <span style={{ fontSize: 10.5, color: '#7c3aed', fontWeight: 700 }}>tu es ici</span>
                      : <span style={{ fontSize: 10.5, color: '#8a8ea8' }}>{g.min.toLocaleString('fr-FR')} XP</span>}
                  </div>
                );
              })}
            </div>

            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: '#8a8ea8', marginBottom: 7 }}>Comment gagner des XP</div>
            <div style={{ background: '#fafafe', border: '1px solid #eef0f7', borderRadius: 10, padding: '10px 12px' }}>
              {XP_RULES.map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#2a2c44', lineHeight: 1.9 }}>
                  <span>{r.icon} {r.label}</span>
                  <strong style={{ color: '#7c3aed' }}>{r.xp}</strong>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 10, color: '#8a8ea8', margin: '9px 0 0', lineHeight: 1.5 }}>
              💡 Corriger ses erreurs rapporte 3× plus que réviser ce qu'on sait déjà — c'est voulu ! (max 200 XP/jour de sessions)
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
   ONBOARDING — CHECKLIST « BIEN DÉMARRER »
   ============================================================ */
function OnboardingChecklist({ steps, onDismiss }) {
  const doneCount = steps.filter(s => s.done).length;
  const next = steps.find(s => !s.done);
  return (
    <div style={{ background: '#fff', border: '1px solid #e4ddfb', borderRadius: 14, padding: '15px 17px', position: 'relative' }}>
      <button onClick={onDismiss} aria-label="Masquer le guide de démarrage" title="Masquer définitivement" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#c9cad6', padding: 2, display: 'flex' }} className="hover:text-gray-500 transition-colors">
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 4 }}>
        <div style={{ flexShrink: 0 }}><PicoOwlSvg size={40} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="font-jakarta" style={{ fontSize: 14.5, fontWeight: 700, color: '#0f1020' }}>Bien démarrer avec Pico</div>
          <div style={{ fontSize: 11.5, color: '#8a8ea8' }}>Ton QG de révisions : entraîne-toi, révise tes fiches, consolide tes erreurs.</div>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#7c3aed', flexShrink: 0, marginRight: 20 }}>{doneCount}/{steps.length}</div>
      </div>
      <div style={{ height: 6, background: '#eef0f7', borderRadius: 4, overflow: 'hidden', margin: '8px 0 10px' }}>
        <div style={{ width: `${Math.round((doneCount / steps.length) * 100)}%`, height: '100%', background: '#7c3aed', borderRadius: 4, transition: 'width .4s ease' }} />
      </div>
      {steps.map((s, i) => (
        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < steps.length - 1 ? '1px solid #f3f4f8' : 'none' }}>
          {s.done ? (
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#3eb489', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            </span>
          ) : (
            <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${s === next ? '#7c3aed' : '#d5d7e4'}`, flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: s.done ? 400 : 600, color: s.done ? '#8a8ea8' : '#0f1020', textDecoration: s.done ? 'line-through' : 'none' }}>{s.label}</div>
            {!s.done && <div style={{ fontSize: 11, color: '#8a8ea8', marginTop: 1 }}>{s.desc}</div>}
          </div>
          {!s.done && s.cta && (
            <button onClick={s.cta} style={{ background: s === next ? '#7c3aed' : '#f4f2ff', color: s === next ? '#fff' : '#7c3aed', border: 'none', borderRadius: 8, padding: '6px 13px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }} className="hover:opacity-90 transition-opacity">
              {s.ctaLabel}
            </button>
          )}
        </div>
      ))}
      <p style={{ fontSize: 10.5, color: '#8a8ea8', margin: '9px 0 0', lineHeight: 1.5 }}>
        💡 Ensuite : chaque question ratée rejoindra ta pile <strong>« À consolider »</strong> — réponds-y juste pour la faire disparaître, c'est comme ça qu'on mémorise.
      </p>
    </div>
  );
}

/* ============================================================
   HUB D'ACTIONS (vue d'ensemble)
   ============================================================ */
const HUB_PATHS = {
  sparkles: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z',
  bolt: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
  qcm: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  book: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
  exam: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z',
  refresh: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99',
};

function HubIcon({ name, size = 20, sw = 1.75 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={HUB_PATHS[name]} />
    </svg>
  );
}

const HUB_ICONS = {
  sparkles: <HubIcon name="sparkles" size={13} sw={2} />,
  bolt: <HubIcon name="bolt" />,
  qcm: <HubIcon name="qcm" />,
  book: <HubIcon name="book" />,
  exam: <HubIcon name="exam" />,
  refresh: <HubIcon name="refresh" />,
};

/* Rangée compacte du bento : pastel plein + icône filigrane dans le coin */
function BentoRow({ icon, bg, solid, titleColor, subColor, title, subtitle, onClick, rightSlot = null, disabled = false }) {
  const Tag = disabled ? 'div' : 'button';
  return (
    <Tag
      onClick={disabled ? undefined : onClick}
      style={{ width: '100%', height: '100%', background: bg, border: 'none', borderRadius: 16, padding: '14px 15px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', overflow: 'hidden', cursor: disabled ? 'default' : 'pointer', textAlign: 'left', opacity: disabled ? 0.8 : 1 }}
      className={disabled ? '' : 'hover:-translate-y-0.5 hover:shadow-md transition-all'}
    >
      <div style={{ position: 'absolute', right: -16, bottom: -20, color: solid, opacity: 0.09, pointerEvents: 'none' }}>
        <HubIcon name={icon} size={84} sw={1.5} />
      </div>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: solid, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <HubIcon name={icon} size={18} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="font-jakarta" style={{ fontSize: 13.5, fontWeight: 700, color: titleColor }}>{title}</div>
        <div style={{ fontSize: 11.5, color: subColor, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</div>
      </div>
      {rightSlot}
    </Tag>
  );
}

/* Carte vedette du bento : indigo plein, filigrane géant, bouton d'action */
function BentoFeatured({ icon, title, badge = null, description, ctaLabel, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ width: '100%', height: '100%', background: '#4f46e5', border: 'none', borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative', overflow: 'hidden', cursor: 'pointer', textAlign: 'left', boxShadow: '0 4px 14px rgba(79,70,229,0.25)' }}
      className="hover:-translate-y-0.5 hover:shadow-lg transition-all"
    >
      <div style={{ position: 'absolute', right: -24, bottom: -28, color: '#fff', opacity: 0.1, pointerEvents: 'none' }}>
        <HubIcon name={icon} size={140} sw={1.5} />
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'grid', placeItems: 'center', marginBottom: 13 }}>
        <HubIcon name={icon} size={21} />
      </div>
      <div className="font-jakarta" style={{ fontSize: 16.5, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: -0.2 }}>
        {title}
        {badge != null && <span style={{ background: '#fff', color: '#4f46e5', fontSize: 11.5, fontWeight: 700, padding: '1px 9px', borderRadius: 20 }}>{badge}</span>}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4, lineHeight: 1.5 }}>{description}</div>
      <div style={{ marginTop: 'auto', paddingTop: 14 }}>
        <span style={{ display: 'inline-block', background: '#fff', color: '#4f46e5', fontSize: 12.5, fontWeight: 700, padding: '9px 18px', borderRadius: 10 }}>{ctaLabel}</span>
      </div>
    </button>
  );
}

/* ========== PARCOURS VERS LE CONCOURS ========== */
function ConcoursPath({ examDate, onSetDate = null }) {
  const days = daysToNextConcours(examDate);
  if (days == null) return null;
  const WINDOW = 365; // fenêtre de « prépa » d'un an
  const progress = Math.max(5, Math.min(93, Math.round(((WINDOW - Math.min(days, WINDOW)) / WINDOW) * 100)));
  const dateLabel = examDate
    ? new Date(examDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Prochain concours';

  const LINE = 34; // ordonnée de la piste
  const milestones = [25, 50, 75];
  return (
    <div style={{ position: 'relative', border: '1px solid #e9e7f7', borderRadius: 14, padding: '15px 18px 14px', flexShrink: 0, overflow: 'hidden', background: 'linear-gradient(120deg, #ffffff 0%, #ffffff 55%, #f6f4fe 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 13 }}>🎯</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0f1020' }}>Ton parcours vers le concours</span>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', padding: '3px 10px', borderRadius: 20, boxShadow: '0 2px 8px rgba(79,70,229,0.28)' }}>J-{days}</span>
      </div>

      {/* Chemin */}
      <div style={{ position: 'relative', height: 52, margin: '0 34px 0 4px' }}>
        {/* piste pointillée (fond) */}
        <div style={{ position: 'absolute', left: 4, right: 0, top: LINE, height: 4, borderRadius: 4, background: 'repeating-linear-gradient(90deg, #d7d9e8 0 5px, transparent 5px 11px)' }} />
        {/* portion parcourue (dégradé plein) */}
        <div style={{ position: 'absolute', left: 4, top: LINE, height: 4, width: `calc(${progress}% - 4px)`, borderRadius: 4, background: 'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
        {/* jalons */}
        {milestones.map(m => (
          <div key={m} style={{ position: 'absolute', left: `${m}%`, top: LINE - 1, transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: m <= progress ? '#7c3aed' : '#fff', border: `2px solid ${m <= progress ? '#7c3aed' : '#d7d9e8'}` }} />
        ))}
        {/* départ */}
        <div style={{ position: 'absolute', left: 0, top: LINE - 3, width: 10, height: 10, borderRadius: '50%', background: '#4f46e5', border: '2px solid #fff', boxShadow: '0 0 0 1.5px #c7d2fe' }} />
        {/* marqueur de position sur la piste */}
        <div style={{ position: 'absolute', left: `${progress}%`, top: LINE - 3, transform: 'translateX(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#7c3aed', border: '2px solid #fff', boxShadow: '0 0 0 3px rgba(124,58,237,0.18)' }} />
        {/* personnage (pin) */}
        <div style={{ position: 'absolute', left: `${progress}%`, top: -3, animation: 'walkBob 1.4s ease-in-out infinite' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff', border: '1px solid #e4ddfb', borderRadius: 20, padding: '2px 8px 2px 4px', boxShadow: '0 4px 12px rgba(79,70,229,0.18)', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 15, lineHeight: 1 }}>🧑‍🎓</span>
            <span style={{ fontSize: 8.5, fontWeight: 800, color: '#7c3aed', letterSpacing: 0.4 }}>TOI</span>
          </div>
          <div style={{ width: 8, height: 8, background: '#fff', borderRight: '1px solid #e4ddfb', borderBottom: '1px solid #e4ddfb', transform: 'translateX(-50%) rotate(45deg)', margin: '-4px 0 0 50%' }} />
        </div>
        {/* arrivée : le concours */}
        <div style={{ position: 'absolute', left: '100%', top: LINE - 15, transform: 'translateX(-40%)' }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#7c3aed', animation: 'concoursPulse 1.8s ease-out infinite' }} />
          <div style={{ position: 'relative', width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'grid', placeItems: 'center', boxShadow: '0 4px 12px rgba(79,70,229,0.4)', border: '2px solid #fff' }}>
            <span style={{ fontSize: 15, display: 'inline-block', animation: 'flagWave 1.8s ease-in-out infinite', transformOrigin: 'bottom left' }}>🏁</span>
          </div>
        </div>
      </div>

      {/* Légende départ / arrivée */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#b0b3c6', textTransform: 'uppercase', letterSpacing: 0.4 }}>Départ</span>
        {examDate ? (
          <span><span style={{ fontSize: 11, fontWeight: 800, color: '#0f1020' }}>Le concours</span><span style={{ fontSize: 10.5, color: '#8a8ea8', marginLeft: 6 }}>{dateLabel}</span></span>
        ) : (
          <button onClick={() => onSetDate?.()} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 11, fontWeight: 700, color: '#7c3aed' }} className="hover:underline">
            📅 Ajoute ta date de concours →
          </button>
        )}
      </div>
    </div>
  );
}

function ActionHub({ todaySubject, reviewDue = [], subjects = [], onLaunchQCM, onLaunchExamen, onOpenFiches, onLaunchReview, quests = [], showQuests = false }) {
  const [flashMenu, setFlashMenu] = useState(false);
  const hasReview = reviewDue.length > 0;
  // Sans recommandation calculée (compte neuf), on retombe sur une matière par défaut
  // pour que la session éclair reste toujours accessible.
  const flashSubject = todaySubject || subjects[0] || null;
  const launchFlash = (subj) => { setFlashMenu(false); onLaunchQCM({ type: 'custom', subject: subj.id, subjectName: subj.name, title: subj.name, count: 8, flash: true }); };

  const primaryBtn = { background: '#7c3aed', color: '#fff', fontSize: 13, fontWeight: 700, padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' };
  const ghostBtn = { background: '#fff', color: '#7c3aed', fontSize: 13, fontWeight: 600, padding: '9px 16px', borderRadius: 10, border: '1px solid #e4ddfb', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Bande de focus du jour — carte claire tintée */}
      <div style={{ background: '#f4f1fe', border: '1px solid #e4ddfb', borderRadius: 14, padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        {todaySubject ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: '#ede9fe', color: '#7c3aed', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <HubIcon name="sparkles" size={19} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: '#7c3aed', marginBottom: 2 }}>Focus du jour</div>
                <div className="font-jakarta" style={{ fontSize: 15, fontWeight: 800, color: '#0f1020', letterSpacing: -0.2 }}>On reprend {/^[aeiouyàâäéèêëîïôöùûü]/i.test(todaySubject.name.trim()) ? <>l&apos;{todaySubject.name}</> : <>la {todaySubject.name}</>}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => onLaunchQCM({ type: 'custom', subject: todaySubject.id, subjectName: todaySubject.name, title: todaySubject.name })} style={primaryBtn} className="hover:bg-violet-700 transition-colors">Réviser 30 min</button>
              <button onClick={() => launchFlash(todaySubject)} style={ghostBtn} className="hover:bg-violet-50 transition-colors"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg> Éclair 5 min</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: '#ede9fe', color: '#7c3aed', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <HubIcon name="sparkles" size={19} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: '#7c3aed', marginBottom: 2 }}>Bienvenue</div>
                <div className="font-jakarta" style={{ fontSize: 15, fontWeight: 800, color: '#0f1020', letterSpacing: -0.2 }}>Commence ton entraînement</div>
              </div>
            </div>
            <button onClick={() => onLaunchQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })} style={primaryBtn} className="hover:bg-violet-700 transition-colors">Commencer un QCM</button>
          </>
        )}
      </div>

      {/* Défis du jour */}
      {showQuests && quests.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #eef0f7', borderRadius: 12, padding: '11px 15px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <span style={{ fontSize: 13 }}>🎯</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: '#5f6280' }}>Défis du jour</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: quests.every(q => q.done) ? '#3eb489' : '#8a8ea8' }}>
              {quests.filter(q => q.done).length}/{quests.length}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
            {quests.map(q => (
              <span key={q.id} title={q.done ? 'Défi validé !' : `+${q.xp} XP à gagner`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 500, padding: '4px 11px', borderRadius: 16, background: q.done ? '#e0f3eb' : '#f6f5fb', color: q.done ? '#1d7a4f' : '#5f6280', border: `1px solid ${q.done ? '#b5e3ca' : '#e8e6f5'}`, textDecoration: q.done ? 'line-through' : 'none' }}>
                {q.done ? '✓' : '○'} {q.label}
                <span style={{ fontSize: 10, fontWeight: 700, color: q.done ? '#3eb489' : '#e8a948' }}>+{q.xp}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontSize: 13, fontWeight: 600, color: '#5f6280', marginTop: 18 }}>Que veux-tu faire&nbsp;?</div>

      <div className="flex flex-col md:flex-row" style={{ gap: 12, alignItems: 'stretch' }}>

        {/* Carte vedette : À consolider s'il y a des questions, sinon l'entraînement */}
        <div className="md:w-[37%]" style={{ display: 'flex' }}>
          {hasReview ? (
            <BentoFeatured
              icon="refresh"
              title="À consolider"
              badge={reviewDue.length}
              description="Tes réponses fausses t'attendent — réponds juste pour les faire disparaître de la pile."
              ctaLabel={`Consolider (${reviewDue.length})`}
              onClick={onLaunchReview}
            />
          ) : (
            <BentoFeatured
              icon="qcm"
              title="Entraînement QCM"
              description="Teste-toi sur la matière de ton choix et repère tes points faibles."
              ctaLabel="Lancer un QCM"
              onClick={() => onLaunchQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })}
            />
          )}
        </div>

        {/* Rangées d'actions — toutes de taille identique */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:auto-rows-fr" style={{ gap: 12 }}>
          {hasReview && (
            <BentoRow icon="qcm" bg="#ece9ff" solid="#4f46e5" titleColor="#3730a3" subColor="#6d64c8" title="Entraînement QCM" subtitle="Teste-toi, matière au choix" onClick={() => onLaunchQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })} />
          )}
          <BentoRow icon="book" bg="#f3edff" solid="#7c3aed" titleColor="#4a1d96" subColor="#8d6cc9" title="Fiches & Cours" subtitle="Révise tes fiches par matière" onClick={onOpenFiches} />
          <BentoRow icon="exam" bg="#fdeaef" solid="#e45770" titleColor="#93293e" subColor="#cb7488" title="Examen blanc" subtitle="QCM en conditions réelles" onClick={onLaunchExamen} />

          {!hasReview && (
            <BentoRow icon="refresh" bg="#e0f3eb" solid="#3eb489" titleColor="#1d6b47" subColor="#5f9e81" title="À consolider" subtitle="Rien à revoir — tout est à jour !" disabled />
          )}

        {/* Session éclair : toujours visible, même sans recommandation calculée (nouveau compte) */}
        {flashSubject && (
          <div style={{ position: 'relative', display: 'flex' }}>
            <BentoRow
              icon="bolt" bg="#fdf3e0" solid="#e8a948" titleColor="#7a5410" subColor="#bd8f45"
              title="Session éclair" subtitle={`8 questions · 5 min · ${flashSubject.name}`}
              onClick={() => launchFlash(flashSubject)}
              rightSlot={
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); setFlashMenu(o => !o); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setFlashMenu(o => !o); } }}
                  aria-label="Choisir la matière de la session éclair"
                  aria-expanded={flashMenu}
                  style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(232,169,72,0.18)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#a5762a', flexShrink: 0, position: 'relative', zIndex: 1 }}
                  className="hover:bg-amber-200/60 transition-colors"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ transform: flashMenu ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                </span>
              }
            />
            {flashMenu && (
              <>
                <div onClick={() => setFlashMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 41, background: '#fff', border: '1px solid #e8e6f5', borderRadius: 12, boxShadow: '0 12px 32px rgba(79,70,229,0.16)', padding: 6 }}>
                  <div style={{ fontSize: 10.5, letterSpacing: 1, fontWeight: 700, color: '#8a8ea8', textTransform: 'uppercase', padding: '6px 10px 4px' }}>Matière éclair</div>
                  {subjects.map(subj => {
                    const isWeak = !!todaySubject && subj.id === todaySubject.id;
                    return (
                      <button
                        key={subj.id}
                        onClick={() => launchFlash(subj)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12.5, fontWeight: 500, color: '#2a2c44' }}
                        className="hover:bg-indigo-50 transition-colors"
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subj.name}</span>
                        {isWeak && <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: '#4f46e5', background: '#ece9ff', padding: '2px 7px', borderRadius: 8 }}>faible</span>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   RÉVISIONS ESPACÉES — BANDEAU « À CONSOLIDER »
   ============================================================ */
function ReviewPileBanner({ entries, onLaunch }) {
  // Répartition par matière (max 3 affichées)
  const bySubject = {};
  entries.forEach(e => {
    const name = e.subjectName || 'Autre';
    bySubject[name] = (bySubject[name] || 0) + 1;
  });
  const chips = Object.entries(bySubject).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const n = entries.length;

  return (
    <div style={{ flexShrink: 0, background: 'linear-gradient(to right, #eef2ff, #f5f3ff)', border: '1px solid #c7d2fe', borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: '#4f46e5', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
      </div>
      <div style={{ flex: 1, minWidth: 180 }}>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: '#0f1020', margin: 0 }}>
          {n} question{n > 1 ? 's' : ''} à consolider aujourd'hui
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
          {chips.map(([name, count]) => (
            <span key={name} style={{ fontSize: 10.5, fontWeight: 600, background: '#fff', border: '1px solid #ddd6fe', color: '#4f46e5', padding: '2px 8px', borderRadius: 10 }}>
              {name} · {count}
            </span>
          ))}
          <span style={{ fontSize: 10.5, color: '#8a8ea8', alignSelf: 'center' }}>ratées récemment — les revoir maintenant, c'est les retenir pour le concours</span>
        </div>
      </div>
      <button
        onClick={onLaunch}
        style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
        className="hover:bg-indigo-700 transition-colors"
      >
        Consolider ({n}) →
      </button>
    </div>
  );
}

/* ============================================================
   PICO — MASCOTTE QUOTIDIENNE
   ============================================================ */
const PICO_LAUNCH_ALL = { initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' };

// Badges débloquables — tous dérivés des stats, donc identiques sur tous les appareils
const PICO_BADGES = [
  { id: 'first-session', emoji: '🎬', name: 'Premier pas', desc: 'Première session terminée', test: d => d.totalSessions >= 1 },
  { id: 'streak-3', emoji: '🔥', name: 'En rythme', desc: '3 jours d\'affilée', test: d => d.bestStreak >= 3 },
  { id: 'streak-7', emoji: '🌋', name: 'Inarrêtable', desc: '7 jours d\'affilée', test: d => d.bestStreak >= 7 },
  { id: 'sessions-10', emoji: '📚', name: 'Habitué', desc: '10 sessions terminées', test: d => d.totalSessions >= 10 },
  { id: 'sessions-50', emoji: '🎓', name: 'Marathonien', desc: '50 sessions terminées', test: d => d.totalSessions >= 50 },
  { id: 'explorer', emoji: '🧭', name: 'Explorateur', desc: 'Les 6 matières travaillées', test: d => d.subjectsExplored >= 6 },
  { id: 'score-90', emoji: '🎯', name: 'Précision', desc: 'Une session à 90 % ou plus', test: d => d.bestSessionPct >= 90 },
  { id: 'perfect', emoji: '💎', name: 'Sans faute', desc: 'Une session à 100 %', test: d => d.bestSessionPct >= 100 },
];

// Dates génériques de secours (partiels S1 / S2) quand l'étudiant n'a pas renseigné sa date
const PICO_CONCOURS_DATES = ['2026-12-14', '2027-05-17'];

function daysToNextConcours(examDate) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  // Date personnelle de l'étudiant prioritaire
  if (examDate) {
    const diff = Math.round((new Date(examDate) - today) / 86400000);
    if (diff >= 0) return diff;
  }
  for (const d of PICO_CONCOURS_DATES) {
    const diff = Math.round((new Date(d) - today) / 86400000);
    if (diff >= 0) return diff;
  }
  return null;
}

function buildPicoReaction(session, reviewDue = []) {
  // Débrief spécifique aux sessions « À consolider » (banque de réponses fausses)
  if (session.subject === 'review') {
    const total = session.total || 0;
    const mastered = session.correct || 0;   // questions réussies → retirées de la pile
    const remaining = reviewDue.length;       // pile après la session (déjà à jour)
    const relaunchReview = { type: 'review', reviewQuestions: reviewDue, subjectName: 'À consolider', title: 'À consolider' };

    if (remaining === 0) {
      return {
        text: `Pile « À consolider » vidée ! 🎉 Plus aucune question en attente${mastered > 0 ? ` — ${mastered} maîtrisée${mastered > 1 ? 's' : ''} sur ce coup` : ''}. Ton futur toi en blouse blanche te remercie 🩺`,
        ctaLabel: null, ctaConfig: null,
      };
    }
    if (mastered > 0) {
      return {
        text: `Bonne séance de consolidation ! ${mastered} question${mastered > 1 ? 's' : ''} sortie${mastered > 1 ? 's' : ''} de ta pile, ${remaining} encore à revoir. On finit le travail ?`,
        ctaLabel: `Reprendre À consolider (${remaining}) →`, ctaConfig: relaunchReview,
      };
    }
    return {
      text: `Ces ${remaining} question${remaining > 1 ? 's' : ''} te résistent encore — c'est exactement là qu'il faut appuyer. Relis la fiche, puis retente à froid 💪`,
      ctaLabel: `Reprendre À consolider (${remaining}) →`, ctaConfig: relaunchReview,
    };
  }

  const pct = session.percentage || Math.round((session.correct / session.total) * 100) || 0;
  const matiere = session.subjectName || getSubjectName(session.subject) || 'cette matière';
  const relaunch = session.subject
    ? { type: 'custom', subject: session.subject, subjectName: matiere, title: matiere }
    : PICO_LAUNCH_ALL;
  if (pct >= 80) {
    return {
      text: `${pct}% en ${matiere} — excellent ! 🎯 À ce niveau, c'est de la consolidation. Garde ce rythme !`,
      ctaLabel: null, ctaConfig: null,
    };
  }
  if (pct >= 60) {
    return {
      text: `${pct}% en ${matiere}, c'est solide ! Encore quelques sessions et ces notions seront automatiques.`,
      ctaLabel: 'Enchaîner une session →', ctaConfig: relaunch,
    };
  }
  return {
    text: `${pct}% en ${matiere}. Pas de panique : les questions ratées sont tes meilleures profs. On les retravaille à chaud ?`,
    ctaLabel: `Retravailler ${matiere} →`, ctaConfig: relaunch,
  };
}

function PicoOwlSvg({ size = 44, outfit = 'classic' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#ece9ff" />
      <ellipse cx="20" cy="25" rx="10" ry="10" fill="#4f46e5" />
      <ellipse cx="11" cy="27" rx="4.5" ry="6.5" fill="#3730a3" transform="rotate(-10 11 27)" />
      <ellipse cx="29" cy="27" rx="4.5" ry="6.5" fill="#3730a3" transform="rotate(10 29 27)" />
      {/* Blouse blanche (grade Externe) */}
      {outfit === 'blouse' && (
        <>
          <path d="M13.5 26 Q20 30.5 26.5 26 L26.5 34 Q20 37.5 13.5 34 Z" fill="#fff" opacity="0.96" />
          <line x1="20" y1="27.5" x2="20" y2="35.5" stroke="#d5d7e4" strokeWidth="0.8" />
          <path d="M17.5 26.5 L20 29 L22.5 26.5" stroke="#d5d7e4" strokeWidth="0.8" fill="none" />
        </>
      )}
      <circle cx="20" cy="18" r="8" fill="#ede9fe" />
      <circle cx="17" cy="17" r="3" fill="#fff" /><circle cx="23" cy="17" r="3" fill="#fff" />
      <circle cx="17.5" cy="17.5" r="1.5" fill="#1c1410" /><circle cx="23.5" cy="17.5" r="1.5" fill="#1c1410" />
      <circle cx="17.8" cy="17" r="0.5" fill="#fff" /><circle cx="23.8" cy="17" r="0.5" fill="#fff" />
      {/* Lunettes (grade Carabin) */}
      {outfit === 'glasses' && (
        <>
          <circle cx="17" cy="17" r="3.7" fill="none" stroke="#1c1410" strokeWidth="0.9" />
          <circle cx="23" cy="17" r="3.7" fill="none" stroke="#1c1410" strokeWidth="0.9" />
          <line x1="19.4" y1="16.6" x2="20.6" y2="16.6" stroke="#1c1410" strokeWidth="0.9" />
        </>
      )}
      <path d="M18.5 20.5 L21.5 20.5 L20 22.5 Z" fill="#d97706" />
      <path d="M14 10 L16.5 14.5 L11.5 14.5 Z" fill="#4f46e5" />
      <path d="M26 10 L28.5 14.5 L23.5 14.5 Z" fill="#4f46e5" />
      {/* Stéthoscope : doré (grade Interne) ou bleu classique */}
      {outfit === 'gold' ? (
        <>
          <path d="M27 28 Q30 25 30 22 Q30 19 27 19" stroke="#eab308" strokeWidth="1.6" fill="none" />
          <circle cx="26.5" cy="28.5" r="2" fill="#eab308" />
        </>
      ) : (
        <>
          <path d="M27 28 Q30 25 30 22 Q30 19 27 19" stroke="#60a5fa" strokeWidth="1.2" fill="none" />
          <circle cx="26.5" cy="28.5" r="1.5" fill="#60a5fa" />
        </>
      )}
      {/* Toque de diplômé (grade Major) */}
      {outfit === 'toque' && (
        <>
          <path d="M11.5 10.5 L20 6.5 L28.5 10.5 L20 14.5 Z" fill="#1c1410" />
          <path d="M16.5 11.8 L23.5 11.8 L23.5 13.6 Q20 15.2 16.5 13.6 Z" fill="#2a2c44" />
          <line x1="28.5" y1="10.5" x2="28.5" y2="15" stroke="#eab308" strokeWidth="0.9" />
          <circle cx="28.5" cy="15.7" r="1" fill="#eab308" />
        </>
      )}
      {/* Couronne (streak 30 jours) */}
      {outfit === 'crown' && (
        <path d="M14 11 L15.3 6.8 L17.8 9.4 L20 5.8 L22.2 9.4 L24.7 6.8 L26 11 Q20 13.6 14 11 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5" />
      )}
    </svg>
  );
}

function getPicoMessage(data, todaySubject, firstName, examDate, reviewDue = [], quests = []) {
  const prenom = firstName ? ` ${firstName}` : '';
  const launchSubject = todaySubject
    ? { type: 'custom', subject: todaySubject.id, subjectName: todaySubject.name, title: todaySubject.name }
    : PICO_LAUNCH_ALL;
  const launchReview = { type: 'review', reviewQuestions: reviewDue, subjectName: 'À consolider', title: 'Révisions espacées' };

  // Grosse pile de consolidation : message prioritaire
  if (reviewDue.length >= 5) {
    return {
      text: `${reviewDue.length} questions ratées récemment t'attendent${prenom} — les revoir aujourd'hui, c'est le moment exact où ton cerveau les grave pour de bon 🧠`,
      ctaLabel: `Consolider (${reviewDue.length}) →`,
      ctaConfig: launchReview,
    };
  }

  // Échéance imminente : message prioritaire
  const jours = daysToNextConcours(examDate);
  if (jours !== null && jours === 0) {
    return {
      text: `C'est le grand jour${prenom} ! Respire, relis tranquillement quelques fiches, et fais-toi confiance. Tu as fait le travail 🍀`,
      ctaLabel: null, ctaConfig: null,
    };
  }
  if (jours !== null && jours <= 14) {
    return {
      text: `J-${jours} avant l'échéance ! C'est le moment de consolider tes points faibles plutôt que d'ouvrir de nouveaux chapitres. Chaque question compte 💪`,
      ctaLabel: todaySubject ? `Consolider ${todaySubject.name} →` : 'Lancer un QCM →',
      ctaConfig: launchSubject,
    };
  }

  if (!data.hasAnySessions) {
    return {
      text: `Salut${prenom} ! Moi c'est Pico 🦉 Je serai là chaque jour pour t'accompagner dans ta prépa. On lance ta toute première session ?`,
      ctaLabel: 'Mon premier QCM →',
      ctaConfig: PICO_LAUNCH_ALL,
    };
  }

  const variants = [];

  if (reviewDue.length > 0) {
    variants.push({
      text: `${reviewDue.length} question${reviewDue.length > 1 ? 's' : ''} t'attend${reviewDue.length > 1 ? 'ent' : ''} dans ta pile « À consolider ». Réponds-y juste pour les faire disparaître 🧠`,
      ctaLabel: `Consolider (${reviewDue.length}) →`,
      ctaConfig: launchReview,
    });
  }
  const pendingQuests = quests.filter(q => !q.done);
  if (quests.length > 0 && pendingQuests.length > 0 && pendingQuests.length < quests.length) {
    const totalXP = pendingQuests.reduce((a, q) => a + q.xp, 0);
    variants.push({
      text: `Plus que ${pendingQuests.length} défi${pendingQuests.length > 1 ? 's' : ''} du jour à valider (+${totalXP} XP) : « ${pendingQuests[0].label} ». Tu les finis ?`,
      ctaLabel: 'Relever le défi →',
      ctaConfig: launchSubject,
    });
  }
  if (todaySubject) {
    variants.push({
      text: `Ta matière à renforcer aujourd'hui : ${todaySubject.name} (${todaySubject.avg}% de moyenne). Une session ciblée et tu grattes des points !`,
      ctaLabel: `Réviser ${todaySubject.name} →`,
      ctaConfig: launchSubject,
    });
  }
  if (data.currentStreak >= 2) {
    variants.push({
      text: `${data.currentStreak} jours d'affilée${prenom}, tu es lancé ! Ne casse pas la série aujourd'hui 🔥`,
      ctaLabel: 'Continuer la série →',
      ctaConfig: launchSubject,
    });
  }
  if (data.currentStreak === 0) {
    variants.push({
      text: `On reprend le rythme${prenom} ? Même 15 minutes aujourd'hui font une vraie différence sur la durée.`,
      ctaLabel: 'Reprendre →',
      ctaConfig: launchSubject,
    });
  }
  if (data.last5Avg !== null && data.prev5Avg !== null && data.last5Avg > data.prev5Avg) {
    variants.push({
      text: `+${data.last5Avg - data.prev5Avg} pts sur tes 5 dernières sessions — ta régularité paie ! On confirme ça aujourd'hui ?`,
      ctaLabel: 'On confirme →',
      ctaConfig: launchSubject,
    });
  }
  if (data.thisWeekSessions >= 3) {
    variants.push({
      text: `Déjà ${data.thisWeekSessions} sessions cette semaine, belle cadence ! Ton futur toi en blouse blanche te dit merci 🩺`,
      ctaLabel: 'Une de plus →',
      ctaConfig: launchSubject,
    });
  }
  // Échéance à moins d'un mois : variante dans la rotation
  if (jours !== null && jours <= 30) {
    variants.unshift({
      text: `L'échéance approche (J-${jours}). Un rythme régulier maintenant vaut mieux qu'un sprint la dernière semaine !`,
      ctaLabel: todaySubject ? `Consolider ${todaySubject.name} →` : 'Lancer un QCM →',
      ctaConfig: launchSubject,
    });
  }

  // Filet de sécurité : toujours au moins un message générique
  variants.push({
    text: `Chaque question travaillée aujourd'hui, c'est une question de moins qui te surprendra le jour J. On s'y met${prenom} ?`,
    ctaLabel: 'Lancer un QCM →',
    ctaConfig: launchSubject,
  });

  // Rotation quotidienne déterministe
  const dayIndex = Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000);
  return variants[dayIndex % variants.length];
}

function PicoCalendar({ value, onChange }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // semaine qui commence lundi
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthLabel = firstDay.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const goPrev = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1);
  };
  const goNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const navBtnStyle = (enabled) => ({ width: 26, height: 26, borderRadius: 8, border: 'none', background: enabled ? '#ece9ff' : '#f5f5f8', color: enabled ? '#4f46e5' : '#c9cad6', cursor: enabled ? 'pointer' : 'default', display: 'grid', placeItems: 'center', padding: 0 });

  return (
    <div style={{ border: '1px solid #e8e6f5', borderRadius: 12, padding: 10, marginBottom: 10, background: '#fbfaff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button type="button" onClick={goPrev} disabled={!canGoPrev} aria-label="Mois précédent" style={navBtnStyle(canGoPrev)}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
        </button>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0f1020', textTransform: 'capitalize' }}>{monthLabel}</span>
        <button type="button" onClick={goNext} aria-label="Mois suivant" style={navBtnStyle(true)}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 9.5, fontWeight: 700, color: '#8a8ea8' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const dateObj = new Date(viewYear, viewMonth, d);
          const isPast = dateObj < today;
          const isSelected = value === dateKey;
          const isToday = dateObj.getTime() === today.getTime();
          return (
            <button
              key={i}
              type="button"
              onClick={() => !isPast && onChange(dateKey)}
              disabled={isPast}
              style={{ aspectRatio: '1 / 1', borderRadius: 8, border: isToday && !isSelected ? '1px solid #c7d2fe' : 'none', background: isSelected ? '#4f46e5' : 'transparent', color: isSelected ? '#fff' : isPast ? '#c9cad6' : '#2a2c44', fontSize: 11.5, fontWeight: isSelected ? 700 : 500, cursor: isPast ? 'default' : 'pointer', padding: 0 }}
              className={!isPast && !isSelected ? 'hover:bg-indigo-100 transition-colors' : ''}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PicoMascot({ data, todaySubject, firstName, onLaunchQCM, statsLoaded, hidden, examDate, reviewDue = [], quests = [], gradeInfo = null, picoOutfit = 'classic', onSelectOutfit = null, outfitContext = null, openSignal = 0, onShowGrade = null }) {
  const [open, setOpen] = useState(false);
  const [seenToday, setSeenToday] = useState(true);
  const [reaction, setReaction] = useState(null);
  const [dateDraft, setDateDraft] = useState('');
  const [dateSaved, setDateSaved] = useState(false);
  const [dateSaving, setDateSaving] = useState(false);
  const [dateError, setDateError] = useState(null);
  const [dateAskSnoozed, setDateAskSnoozed] = useState(false);
  const [celebration, setCelebration] = useState(null); // badge fraîchement débloqué
  const [gradeUp, setGradeUp] = useState(null); // nouveau grade fraîchement atteint
  const [xpIntro, setXpIntro] = useState(false); // explication des XP au premier gain
  const [wardrobeOpen, setWardrobeOpen] = useState(false); // garde-robe de Pico
  const [outfitLocal, setOutfitLocal] = useState(null); // tenue choisie (optimiste)
  const autoOpened = useRef(false);

  const currentOutfit = outfitLocal || picoOutfit || 'classic';

  // Ouverture commandée de l'extérieur (ex. étape onboarding « Répondre à Pico »)
  useEffect(() => {
    if (openSignal > 0) { setOpen(true); setWardrobeOpen(false); }
  }, [openSignal]);

  // ---- Montée de grade : célébration ----
  useEffect(() => {
    if (!statsLoaded || !gradeInfo || !data.hasAnySessions) return;
    const stored = localStorage.getItem('pico_grade_seen');
    if (stored === null) {
      // Première visite depuis l'ajout des grades : on enregistre sans fanfare
      localStorage.setItem('pico_grade_seen', String(gradeInfo.gradeIndex));
      return;
    }
    if (gradeInfo.gradeIndex > parseInt(stored, 10)) {
      setGradeUp(gradeInfo.grade);
      setOpen(true);
      localStorage.setItem('pico_grade_seen', String(gradeInfo.gradeIndex));
    }
  }, [statsLoaded, gradeInfo, data.hasAnySessions]);

  // ---- Premiers XP : explication de la gamification, une seule fois ----
  useEffect(() => {
    if (!statsLoaded || !gradeInfo || !data.hasAnySessions) return;
    if ((gradeInfo.total || 0) <= 0) return;
    if (localStorage.getItem('pico_xp_intro_seen')) return;
    if (reaction || celebration || gradeUp) return; // priorité aux autres moments
    setXpIntro(true);
    setOpen(true);
    localStorage.setItem('pico_xp_intro_seen', '1');
  }, [statsLoaded, gradeInfo, data.hasAnySessions, reaction, celebration, gradeUp]);

  // ---- Choix de tenue (persisté dans les métadonnées du compte) ----
  const saveOutfit = async (id) => {
    setOutfitLocal(id);
    setWardrobeOpen(false);
    if (supabase) {
      const { error } = await supabase.auth.updateUser({ data: { pico_outfit: id } });
      if (error) console.error('[Pico] Erreur tenue :', error.message);
    }
  };

  // ---- Badges : détection des nouveaux succès ----
  const earnedBadges = useMemo(() => PICO_BADGES.filter(b => b.test(data)), [data]);

  useEffect(() => {
    if (!statsLoaded || !data.hasAnySessions) return;
    const seen = JSON.parse(localStorage.getItem('pico_badges_seen') || '[]');
    const fresh = earnedBadges.filter(b => !seen.includes(b.id));
    if (fresh.length === 0) return;
    // Historique existant jamais célébré (1ʳᵉ visite depuis l'ajout des badges) : on marque tout vu sans fanfare
    if (seen.length === 0 && fresh.length > 1) {
      localStorage.setItem('pico_badges_seen', JSON.stringify(earnedBadges.map(b => b.id)));
      return;
    }
    setCelebration(fresh[0]);
    setOpen(true);
    localStorage.setItem('pico_badges_seen', JSON.stringify([...seen, ...fresh.map(b => b.id)]));
  }, [statsLoaded, earnedBadges, data.hasAnySessions]);

  // Date d'examen valide = renseignée et pas encore passée
  const validExamDate = useMemo(() => {
    if (!examDate) return null;
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return new Date(examDate) >= t ? examDate : null;
  }, [examDate]);

  // Faut-il demander la date des partiels ?
  const askExamDate = useMemo(() => {
    if (!statsLoaded || validExamDate || dateAskSnoozed || dateSaved) return false;
    if (typeof window === 'undefined') return false;
    const snooze = localStorage.getItem('pico_examdate_snooze');
    return !snooze || snooze <= new Date().toISOString().split('T')[0];
  }, [statsLoaded, validExamDate, dateAskSnoozed, dateSaved]);

  const saveExamDate = async () => {
    if (!dateDraft || !supabase) return;
    setDateSaving(true);
    setDateError(null);
    const { error } = await supabase.auth.updateUser({ data: { exam_date: dateDraft } });
    setDateSaving(false);
    if (!error) setDateSaved(true);
    else setDateError(error.message);
  };

  const snoozeExamDate = () => {
    const d = new Date(); d.setDate(d.getDate() + 7);
    localStorage.setItem('pico_examdate_snooze', d.toISOString().split('T')[0]);
    setDateAskSnoozed(true);
  };

  // Ouverture automatique une fois par jour (après chargement des stats)
  useEffect(() => {
    if (!statsLoaded || autoOpened.current) return;
    autoOpened.current = true;
    const todayKey = new Date().toISOString().split('T')[0];
    if (localStorage.getItem('pico_last_seen') !== todayKey) {
      setSeenToday(false);
      const t = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, [statsLoaded]);

  // Réaction après une session : détecte une nouvelle session récente
  useEffect(() => {
    if (!statsLoaded) return;
    const stored = parseInt(localStorage.getItem('pico_session_count') ?? '-1', 10);
    const total = data.totalSessions;
    if (stored >= 0 && total > stored) {
      const last = data.recent5[0];
      const isFresh = last?.date && (Date.now() - new Date(last.date).getTime()) < 10 * 60 * 1000;
      if (isFresh) {
        setReaction(buildPicoReaction(last, reviewDue));
        setOpen(true);
      }
    }
    if (total > stored) localStorage.setItem('pico_session_count', String(total));
  }, [statsLoaded, data.totalSessions, data.recent5]);

  const message = useMemo(
    () => getPicoMessage(data, todaySubject, firstName, validExamDate, reviewDue, quests),
    [data, todaySubject, firstName, validExamDate, reviewDue, quests]
  );

  // Objectif du jour : 1 session
  const todayKey = new Date().toISOString().split('T')[0];
  const sessionsToday = (data.thisWeekDays || []).find(d => d.key === todayKey)?.count || 0;
  const goalDone = sessionsToday >= 1;

  const shown = reaction || message;

  const markSeen = () => {
    localStorage.setItem('pico_last_seen', new Date().toISOString().split('T')[0]);
    setSeenToday(true);
  };
  const close = () => { setOpen(false); setReaction(null); setCelebration(null); setGradeUp(null); setWardrobeOpen(false); setXpIntro(false); markSeen(); };

  return (
    <>
      <style>{`
        @keyframes picoPop { from { opacity: 0; transform: translateY(12px) scale(.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes picoBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes picoFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @media (prefers-reduced-motion: reduce) { @keyframes picoFloat { 0%, 100% { transform: none; } } }
      `}</style>

      {/* Confettis de célébration */}
      {!hidden && open && (celebration || gradeUp) && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 95 }} aria-hidden="true">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${(i * 137) % 100}%`,
                top: '-5%',
                width: 9,
                height: 9,
                borderRadius: i % 3 === 0 ? '50%' : 2,
                backgroundColor: ['#4f46e5', '#3eb489', '#e8a948', '#e45770', '#7c3aed', '#4f8ff7'][i % 6],
                animation: `confettiFall ${2.2 + (i % 5) * 0.4}s ease-in ${(i % 7) * 0.18}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Bulle message */}
      {!hidden && open && (
        <div
          className="bottom-[140px] md:bottom-[88px]"
          style={{ position: 'fixed', right: 20, zIndex: 90, width: 290, maxWidth: 'calc(100vw - 40px)', background: '#fff', border: '1px solid #e8e6f5', borderRadius: 16, boxShadow: '0 12px 36px rgba(79,70,229,0.18)', padding: '14px 16px', animation: 'picoPop .25s ease-out' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 10.5, letterSpacing: 1, fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase' }}>
              {wardrobeOpen ? 'Pico · Garde-robe' : gradeUp ? 'Pico · Nouveau grade !' : celebration ? 'Pico · Nouveau badge !' : xpIntro ? 'Pico · Tes premiers XP !' : reaction ? 'Pico · Débrief' : (askExamDate || dateSaved) ? 'Pico · Tes partiels' : 'Pico · Conseil du jour'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => setWardrobeOpen(o => !o)} aria-label="Garde-robe de Pico" title="Changer la tenue de Pico" style={{ background: wardrobeOpen ? '#ece9ff' : 'none', border: 'none', cursor: 'pointer', padding: '1px 4px', borderRadius: 6, fontSize: 12, lineHeight: 1 }}>
                👕
              </button>
              <button onClick={close} aria-label="Fermer" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a8ea8', padding: 2, display: 'flex' }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {wardrobeOpen ? (
            /* Garde-robe : choisir la tenue de Pico */
            <div>
              <p style={{ fontSize: 12, color: '#5f6280', margin: '0 0 10px' }}>Les tenues se débloquent avec tes grades et ton streak.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {PICO_OUTFITS.map(o => {
                  const unlocked = o.unlock(outfitContext || { gradeIndex: 0, streak: 0 });
                  const selected = currentOutfit === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => unlocked && saveOutfit(o.id)}
                      disabled={!unlocked}
                      title={unlocked ? o.name : `${o.name} — ${o.desc}`}
                      style={{ background: selected ? '#ece9ff' : '#fafafe', border: selected ? '2px solid #4f46e5' : '1px solid #eef0f7', borderRadius: 12, padding: '8px 4px 6px', cursor: unlocked ? 'pointer' : 'default', textAlign: 'center', opacity: unlocked ? 1 : 0.45, filter: unlocked ? 'none' : 'grayscale(1)' }}
                    >
                      <PicoOwlSvg size={34} outfit={o.id} />
                      <div style={{ fontSize: 9.5, fontWeight: 600, color: '#2a2c44', marginTop: 3 }}>{o.name}</div>
                      <div style={{ fontSize: 8.5, color: '#8a8ea8' }}>{unlocked ? (selected ? 'Portée' : '') : `🔒 ${o.desc}`}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : gradeUp ? (
            /* Célébration : nouveau grade atteint */
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '4px auto 8px', display: 'grid', placeItems: 'center', fontSize: 30, background: 'linear-gradient(135deg, #f4f1fe, #e4ddfb)', border: '2px solid #7c3aed', animation: 'picoBounce 1s ease-in-out 2' }}>
                {gradeUp.emoji}
              </div>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#0f1020', margin: '0 0 2px' }}>Grade {gradeUp.name} !</p>
              <p style={{ fontSize: 12.5, color: '#2a2c44', margin: '0 0 10px', lineHeight: 1.5 }}>
                Félicitations{firstName ? ` ${firstName}` : ''} ! 🎉 Ta régularité paie — tu montes en grade.
                {gradeInfo?.next ? ` Prochain palier : ${gradeInfo.next.name} à ${gradeInfo.next.min} XP.` : ' Tu es au sommet !'}
              </p>
              <p style={{ fontSize: 11.5, color: '#8a8ea8', margin: 0 }}>
                👕 De nouvelles tenues t'attendent peut-être dans ma garde-robe !
              </p>
            </div>
          ) : celebration ? (
            /* Célébration : nouveau badge débloqué */
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '4px auto 8px', display: 'grid', placeItems: 'center', fontSize: 30, background: 'linear-gradient(135deg, #ece9ff, #ddd6fe)', border: '2px solid #4f46e5', animation: 'picoBounce 1s ease-in-out 2' }}>
                {celebration.emoji}
              </div>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#0f1020', margin: '0 0 2px' }}>{celebration.name}</p>
              <p style={{ fontSize: 12, color: '#5f6280', margin: '0 0 10px' }}>{celebration.desc}</p>
              <p style={{ fontSize: 12.5, color: '#2a2c44', margin: '0 0 10px', lineHeight: 1.5 }}>
                Bravo{firstName ? ` ${firstName}` : ''} ! 🎉 {earnedBadges.length}/{PICO_BADGES.length} badges débloqués.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
                {PICO_BADGES.map(b => {
                  const got = earnedBadges.some(e => e.id === b.id);
                  return (
                    <span key={b.id} title={`${b.name} — ${b.desc}`} style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 13, background: got ? '#ece9ff' : '#f3f3f6', border: got ? '1.5px solid #4f46e5' : '1.5px solid #e5e5ec', filter: got ? 'none' : 'grayscale(1)', opacity: got ? 1 : 0.45 }}>
                      {b.emoji}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : xpIntro ? (
            /* Explication des XP au premier gain */
            <div>
              <p style={{ fontSize: 13, color: '#2a2c44', lineHeight: 1.55, margin: '0 0 10px' }}>
                {gradeInfo ? `${gradeInfo.total.toLocaleString('fr-FR')} XP au compteur` : 'Tes premiers XP sont là'} 🎉 Chaque bonne réponse t'en rapporte — et <strong>3× plus</strong> quand tu corriges une question de ta pile « À consolider ». Accumule-les pour grimper de Bizuth 🐣 jusqu'à Major de promo 👑 !
              </p>
              {onShowGrade && (
                <button
                  onClick={() => { close(); onShowGrade(); }}
                  style={{ width: '100%', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  className="hover:bg-indigo-700 transition-colors"
                >
                  Voir mon grade →
                </button>
              )}
            </div>
          ) : !reaction && dateSaved ? (
            /* Confirmation après enregistrement de la date */
            <p style={{ fontSize: 13, color: '#2a2c44', lineHeight: 1.5, margin: 0 }}>
              Noté ! J-{daysToNextConcours(dateDraft)} avant tes partiels. On s'y prépare ensemble, un jour à la fois 💪
            </p>
          ) : !reaction && askExamDate ? (
            /* Question : date des partiels */
            <>
              <p style={{ fontSize: 13, color: '#2a2c44', lineHeight: 1.5, margin: '0 0 10px' }}>
                Au fait{firstName ? ` ${firstName}` : ''}… quand sont tes prochains partiels ? 📅 Je pourrai te faire un compte à rebours personnalisé.
              </p>
              <PicoCalendar value={dateDraft} onChange={setDateDraft} />
              {dateDraft && (
                <p style={{ fontSize: 11.5, color: '#4f46e5', fontWeight: 600, margin: '0 0 10px', textAlign: 'center', textTransform: 'capitalize' }}>
                  📅 {new Date(`${dateDraft}T00:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={saveExamDate}
                  disabled={!dateDraft || dateSaving}
                  style={{ flex: 1, background: dateDraft && !dateSaving ? '#4f46e5' : '#c9c6f0', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: dateDraft && !dateSaving ? 'pointer' : 'default' }}
                  className={dateDraft && !dateSaving ? 'hover:bg-indigo-700 transition-colors' : ''}
                >
                  {dateSaving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
                <button
                  onClick={snoozeExamDate}
                  style={{ background: 'transparent', color: '#5f6280', border: '1px solid #d5d7e4', borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  Plus tard
                </button>
              </div>
              {!dateDraft && !dateError && (
                <p style={{ fontSize: 11, color: '#8a8ea8', margin: '8px 0 0' }}>Choisis d'abord une date pour activer l'enregistrement.</p>
              )}
              {dateError && (
                <p style={{ fontSize: 11.5, color: '#e45770', margin: '8px 0 0' }}>Oups, l'enregistrement a échoué ({dateError}). Réessaie dans un instant.</p>
              )}
            </>
          ) : (
            /* Message du jour ou débrief */
            <>
              <p style={{ fontSize: 13, color: '#2a2c44', lineHeight: 1.5, margin: '0 0 10px' }}>{shown.text}</p>
              {/* Objectif du jour */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 10, background: goalDone ? '#e0f3eb' : '#f5f5f8', marginBottom: shown.ctaLabel ? 10 : 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, display: 'grid', placeItems: 'center', background: goalDone ? '#3eb489' : '#fff', border: goalDone ? 'none' : '1.5px solid #d5d7e4' }}>
                  {goalDone && (
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  )}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: goalDone ? '#236637' : '#5f6280' }}>
                  {goalDone ? 'Objectif du jour atteint !' : 'Objectif du jour : 1 session'}
                </span>
              </div>
              {shown.ctaLabel && (
                <button
                  onClick={() => { close(); onLaunchQCM(shown.ctaConfig); }}
                  style={{ width: '100%', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  className="hover:bg-indigo-700 transition-colors"
                >
                  {shown.ctaLabel}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Bouton flottant */}
      {!hidden && (
        <button
          onClick={() => { if (open) { close(); } else { setOpen(true); markSeen(); } }}
          aria-label="Ouvrir le conseil du jour de Pico"
          className="bottom-[76px] md:bottom-6"
          style={{ position: 'fixed', right: 20, zIndex: 90, width: 52, height: 52, borderRadius: '50%', border: '2px solid #fff', background: '#ece9ff', cursor: 'pointer', padding: 0, boxShadow: '0 6px 20px rgba(79,70,229,0.3)', display: 'grid', placeItems: 'center', animation: open ? 'none' : (!seenToday ? 'picoBounce 2s ease-in-out infinite' : 'picoFloat 3.2s ease-in-out infinite') }}
        >
          <PicoOwlSvg size={48} outfit={currentOutfit} />
          {!seenToday && !open && (
            <span style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: '#e45770', border: '2px solid #fff' }} />
          )}
        </button>
      )}
    </>
  );
}

/* ============================================================
   FICHES SECTION (embedded in dashboard)
   ============================================================ */
const FICHES_SUBJECT_COLORS = {
  indigo:  { badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500', icon: 'text-indigo-500', light: 'bg-indigo-50', border: 'border-indigo-100', pill: 'bg-indigo-600 text-white', pillIdle: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
  primary: { badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500', icon: 'text-indigo-500', light: 'bg-indigo-50', border: 'border-indigo-100', pill: 'bg-indigo-600 text-white', pillIdle: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
  emerald: { badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', icon: 'text-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-100', pill: 'bg-emerald-600 text-white', pillIdle: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
  violet:  { badge: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500', icon: 'text-violet-500', light: 'bg-violet-50', border: 'border-violet-100', pill: 'bg-violet-600 text-white', pillIdle: 'bg-violet-50 text-violet-700 hover:bg-violet-100' },
  cyan:    { badge: 'bg-cyan-100 text-cyan-700', bar: 'bg-cyan-500', icon: 'text-cyan-500', light: 'bg-cyan-50', border: 'border-cyan-100', pill: 'bg-cyan-600 text-white', pillIdle: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100' },
  amber:   { badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500', icon: 'text-amber-500', light: 'bg-amber-50', border: 'border-amber-100', pill: 'bg-amber-600 text-white', pillIdle: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
  rose:    { badge: 'bg-rose-100 text-rose-700', bar: 'bg-rose-500', icon: 'text-rose-500', light: 'bg-rose-50', border: 'border-rose-100', pill: 'bg-rose-600 text-white', pillIdle: 'bg-rose-50 text-rose-700 hover:bg-rose-100' },
};

// Temps de lecture estimé d'une fiche (≈200 mots/min)
function ficheReadingTime(html) {
  if (!html) return 1;
  const words = html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Accent hex par couleur de matière (pour les cartes de matières)
const FICHES_ACCENT_HEX = {
  indigo: '#4f46e5', primary: '#4f46e5', emerald: '#059669',
  violet: '#7c3aed', cyan: '#0891b2', amber: '#d97706', rose: '#e11d48',
};

const FICHES_SUBJECT_ICONS = {
  anatomie:    'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z',
  chimie:      'M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5',
  biocell:     'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z',
  biostats:    'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  biophysique: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
  ssh:         'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
};

/* ===== COURS MODAL (full-screen, reste dans le dashboard) ===== */
function CoursModal({ fiche, onClose }) {
  const { isEssentiel, isLoaded } = usePremium();
  const [cours, setCours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const scrollRef = useRef(null);

  const sub = SUBJECTS.find(s => s.id === fiche.subject);
  const cols = FICHES_SUBJECT_COLORS[sub?.color] || FICHES_SUBJECT_COLORS.primary;
  const iconPath = FICHES_SUBJECT_ICONS[fiche.subject] || '';

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!fiche?.id || !isEssentiel || !isLoaded) { setLoading(false); return; }
    setLoading(true);
    loadCoursForFiche(fiche.id).then((data) => {
      setCours(data);
      setLoading(false);
    }).catch(() => {
      setCours(null);
      setLoading(false);
    });
  }, [fiche?.id, isEssentiel, isLoaded]);

  useEffect(() => {
    if (!cours?.sections || !scrollRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { root: scrollRef.current, rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    const els = scrollRef.current.querySelectorAll('[data-cours-section]');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [cours]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: '#f8f9fb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, height: 56, padding: '0 20px', borderBottom: '1px solid #eef0f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', boxShadow: '0 1px 4px rgba(15,16,32,0.06)' }}>
        <button
          onClick={onClose}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 10, background: '#f3f4f6', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#374151' }}
          className="hover:bg-gray-200 transition-colors"
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Retour aux fiches
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={`w-7 h-7 rounded-lg ${cols.light} flex items-center justify-center`} style={{ flexShrink: 0 }}>
            <svg className={`w-3.5 h-3.5 ${cols.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f1020', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fiche.title}</span>
        </div>
        <div style={{ width: 120 }} />
      </div>

      {/* Content */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '28px 16px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 16 }}>
              <div style={{ width: 36, height: 36, border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: '#6b7280', fontSize: 14 }}>Chargement du cours...</p>
            </div>
          )}

          {/* Pas de cours disponible */}
          {!loading && !cours && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ width: 56, height: 56, background: '#f3f4f6', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Cours bientôt disponible</p>
              <p style={{ fontSize: 13.5, color: '#6b7280', maxWidth: 360, margin: '0 auto' }}>Le cours détaillé pour &laquo;&nbsp;{fiche.title}&nbsp;&raquo; est en cours de rédaction.</p>
            </div>
          )}

          {/* Cours */}
          {!loading && cours && (
            <>
              {/* Hero */}
              <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 60%, #4338ca 100%)', borderRadius: 18, padding: '28px 28px 24px', marginBottom: 24, color: '#fff' }}>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4`} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}>
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#fbbf24' }}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Premium · {sub?.name || ''}
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 10px', letterSpacing: -0.5, lineHeight: 1.25 }}>{fiche.title}</h1>
                {cours.introduction && <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.6 }}>{cours.introduction}</p>}
                <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    ~{cours.readTime || 15} min
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    {cours.sections.length} sections
                  </div>
                </div>
              </div>

              {/* Sections */}
              {cours.sections.map((sec, i) => {
                const sectionId = `modal-section-${i}`;
                const isAct = activeSection === sectionId;
                return (
                  <div
                    key={i}
                    id={sectionId}
                    data-cours-section
                    style={{ background: '#fff', borderRadius: 16, border: `1.5px solid ${isAct ? '#c7d2fe' : '#eef0f7'}`, padding: '22px 24px', marginBottom: 14, scrollMarginTop: 80, transition: 'border-color 0.2s' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <span className={`w-9 h-9 rounded-xl ${cols.light} ${cols.border} border flex items-center justify-center text-sm font-black ${cols.icon}`} style={{ flexShrink: 0 }}>{i + 1}</span>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f1020', margin: 0 }}>{sec.title}</h3>
                        <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>Section {i + 1} sur {cours.sections.length}</p>
                      </div>
                    </div>
                    <div
                      className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(sec.content) }}
                    />
                  </div>
                );
              })}

              {/* Footer */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #eef0f7', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <button
                  onClick={onClose}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#fff', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#374151', cursor: 'pointer' }}
                  className="hover:border-indigo-300 hover:text-indigo-600 transition-all"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                  Retour aux fiches
                </button>
                <button
                  onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#0f1020', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer' }}
                  className="hover:bg-gray-800 transition-colors"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" /></svg>
                  Haut de page
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FichesSection({ initialSubject, onLaunchQCM }) {
  const [currentSubject, setCurrentSubject] = useState(initialSubject || 'all');
  const [search, setSearch] = useState('');
  const [selectedFiche, setSelectedFiche] = useState(null);
  const [activeCours, setActiveCours] = useState(null);
  const [readIds, setReadIds] = useState(() => new Set());
  const { isEssentiel } = usePremium();
  const { user } = useAuth();

  // Sync subject filter when prop changes (e.g. clicking different UEs in sidebar)
  useEffect(() => {
    setCurrentSubject(initialSubject || 'all');
  }, [initialSubject]);

  // Fiches déjà lues (marqueur local par appareil)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('fiches_read');
      if (raw) setReadIds(new Set(JSON.parse(raw)));
    } catch {}
  }, []);
  const markRead = (id) => {
    setReadIds(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev); next.add(id);
      try { localStorage.setItem('fiches_read', JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  // Comptes par matière (total + lues) pour les cartes de matières
  const subjectStats = useMemo(() => {
    const m = {};
    FICHES_DATA.forEach(f => {
      const s = (m[f.subject] = m[f.subject] || { total: 0, read: 0 });
      s.total++;
      if (readIds.has(f.id)) s.read++;
    });
    return m;
  }, [readIds]);

  const SUBJECT_ORDER = ['chimie', 'biocell', 'biophysique', 'biostats', 'anatomie', 'ssh'];

  const filteredFiches = useMemo(() => {
    let fiches = currentSubject === 'all' ? FICHES_DATA : FICHES_DATA.filter(f => f.subject === currentSubject);
    if (search) {
      const q = search.toLowerCase();
      fiches = fiches.filter(f => f.title.toLowerCase().includes(q) || f.summary.toLowerCase().includes(q));
    }
    // Tri par matière (ordre UE1 → UE6)
    fiches = [...fiches].sort((a, b) => {
      const ia = SUBJECT_ORDER.indexOf(a.subject);
      const ib = SUBJECT_ORDER.indexOf(b.subject);
      return ia - ib;
    });
    return fiches;
  }, [currentSubject, search]);

  const activeSubjectObj = SUBJECTS.find(s => s.id === currentSubject);
  const activeCols = activeSubjectObj ? (FICHES_SUBJECT_COLORS[activeSubjectObj.color] || FICHES_SUBJECT_COLORS.primary) : null;

  return (
    <div style={{ minHeight: 0 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f1020', margin: 0, letterSpacing: -0.4 }}>Fiches &amp; Cours</h2>
          <p style={{ fontSize: 13, color: '#5f6280', margin: '4px 0 0' }}>{filteredFiches.length} fiche{filteredFiches.length > 1 ? 's' : ''}{currentSubject !== 'all' && activeSubjectObj ? ` · ${activeSubjectObj.name}` : ' · toutes les matières'}</p>
        </div>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8a8ea8' }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher une fiche..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-[220px]"
            style={{ paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 13, border: '1px solid #eef0f7', borderRadius: 10, outline: 'none', background: '#fff', color: '#2a2c44' }}
          />
        </div>
      </div>

      {/* Cartes de matières */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7" style={{ gap: 10, marginBottom: 20 }}>
        {/* Toutes */}
        {(() => {
          const totalAll = FICHES_DATA.length;
          const readAll = FICHES_DATA.filter(f => readIds.has(f.id)).length;
          const isSel = currentSubject === 'all';
          const pct = totalAll ? Math.round((readAll / totalAll) * 100) : 0;
          return (
            <button
              onClick={() => setCurrentSubject('all')}
              style={{ background: '#fff', borderRadius: 14, padding: 12, cursor: 'pointer', textAlign: 'left', border: `1.5px solid ${isSel ? '#4f46e5' : '#eef0f7'}`, boxShadow: isSel ? '0 0 0 3px #ece9ff' : 'none', transition: 'all .15s' }}
              className="hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#ece9ff', display: 'grid', placeItems: 'center', marginBottom: 8 }}>
                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f1020', lineHeight: 1.2 }}>Toutes</div>
              <div style={{ fontSize: 10, color: '#8a8ea8', marginTop: 1 }}>{totalAll} fiches{readAll > 0 ? ` · ${readAll} lues` : ''}</div>
              <div style={{ height: 4, background: '#eef0f7', borderRadius: 3, overflow: 'hidden', marginTop: 8 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#4f46e5', borderRadius: 3 }} />
              </div>
            </button>
          );
        })()}
        {SUBJECTS.map(sub => {
          const accent = FICHES_ACCENT_HEX[sub.color] || FICHES_ACCENT_HEX.primary;
          const cols = FICHES_SUBJECT_COLORS[sub.color] || FICHES_SUBJECT_COLORS.primary;
          const iconPath = FICHES_SUBJECT_ICONS[sub.id] || '';
          const st = subjectStats[sub.id] || { total: 0, read: 0 };
          const pct = st.total ? Math.round((st.read / st.total) * 100) : 0;
          const isSel = currentSubject === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setCurrentSubject(sub.id)}
              style={{ background: '#fff', borderRadius: 14, padding: 12, cursor: 'pointer', textAlign: 'left', border: `1.5px solid ${isSel ? accent : '#eef0f7'}`, boxShadow: isSel ? `0 0 0 3px ${accent}22` : 'none', transition: 'all .15s' }}
              className="hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div className={`${cols.light} ${cols.border} border`} style={{ width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', marginBottom: 8 }}>
                <svg className={`w-4 h-4 ${cols.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d={iconPath} /></svg>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f1020', lineHeight: 1.2 }}>{sub.name}</div>
              <div style={{ fontSize: 10, color: '#8a8ea8', marginTop: 1 }}>{st.total} fiche{st.total > 1 ? 's' : ''}{st.read > 0 ? ` · ${st.read} lue${st.read > 1 ? 's' : ''}` : ''}</div>
              <div style={{ height: 4, background: '#eef0f7', borderRadius: 3, overflow: 'hidden', marginTop: 8 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: accent, borderRadius: 3 }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Fiches grid */}
      {filteredFiches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: '#5f6280' }}>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Aucune fiche trouvée</p>
          <p style={{ fontSize: 13 }}>Essayez un autre terme de recherche ou changez de matière.</p>
        </div>
      ) : (() => {
        const renderCard = (fiche) => {
          const sub = SUBJECTS.find(s => s.id === fiche.subject);
          const cols = FICHES_SUBJECT_COLORS[sub?.color] || FICHES_SUBJECT_COLORS.primary;
          const iconPath = FICHES_SUBJECT_ICONS[fiche.subject] || '';
          const isRead = readIds.has(fiche.id);
          const mins = ficheReadingTime(fiche.content);
          return (
            <button
              key={fiche.id}
              onClick={() => { markRead(fiche.id); setSelectedFiche(fiche); }}
              style={{ position: 'relative', background: '#fff', borderRadius: 16, border: '1px solid #e5e7f0', overflow: 'hidden', cursor: 'pointer', textAlign: 'left', padding: 0, transition: 'all .2s', display: 'flex', flexDirection: 'column' }}
              className="hover:shadow-lg hover:border-gray-300 transition-all group"
            >
              <div className={`h-1 ${cols.bar}`} />
              {isRead && (
                <span style={{ position: 'absolute', top: 12, right: 12, display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9.5, fontWeight: 700, color: '#1d7a4f', background: '#e0f3eb', border: '1px solid #b5e3ca', padding: '2px 7px', borderRadius: 10 }}>
                  <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  Lue
                </span>
              )}
              <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div className={`w-8 h-8 rounded-xl ${cols.light} ${cols.border} border flex items-center justify-center shrink-0`}>
                    <svg className={`w-4 h-4 ${cols.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                    </svg>
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${cols.icon}`}>{sub?.name || ''}</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f1020', lineHeight: 1.35, marginBottom: 8, flex: 1 }} className="group-hover:text-indigo-700 transition-colors">{fiche.title}</h3>
                <p style={{ fontSize: 12.5, color: '#5f6280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 12 }}>{fiche.summary}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>
                    {isRead ? 'Relire' : 'Lire la fiche'}
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                  </span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>⏱ {mins} min</span>
                </div>
              </div>
            </button>
          );
        };

        // Groupement par matière quand « Toutes »
        if (currentSubject === 'all') {
          const groups = SUBJECT_ORDER
            .map(sid => ({ sub: SUBJECTS.find(s => s.id === sid), items: filteredFiches.filter(f => f.subject === sid) }))
            .filter(g => g.items.length > 0);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
              {groups.map(({ sub, items }) => {
                const cols = FICHES_SUBJECT_COLORS[sub?.color] || FICHES_SUBJECT_COLORS.primary;
                return (
                  <div key={sub.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span className={`w-6 h-6 rounded-lg ${cols.light} ${cols.border} border flex items-center justify-center shrink-0`}>
                        <svg className={`w-3.5 h-3.5 ${cols.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d={FICHES_SUBJECT_ICONS[sub.id] || ''} /></svg>
                      </span>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f1020', margin: 0 }}>{sub.name}</h3>
                      <span style={{ fontSize: 11.5, color: '#8a8ea8' }}>{items.length} fiche{items.length > 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                      {items.map(renderCard)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {filteredFiches.map(renderCard)}
          </div>
        );
      })()}

      {/* Fiche detail modal */}
      {selectedFiche && (
        <FicheDetailModal
          fiche={selectedFiche}
          fiches={filteredFiches}
          isRead={readIds.has(selectedFiche.id)}
          onNavigate={(f) => { markRead(f.id); setSelectedFiche(f); }}
          onClose={() => setSelectedFiche(null)}
          isEssentiel={isEssentiel}
          user={user}
          onLaunchQCM={onLaunchQCM}
          onOpenCours={(fiche) => { setActiveCours(fiche); setSelectedFiche(null); }}
        />
      )}

      {/* Cours full-screen overlay */}
      {activeCours && (
        <CoursModal
          fiche={activeCours}
          onClose={() => setActiveCours(null)}
        />
      )}
    </div>
  );
}

function FicheDetailModal({ fiche, fiches = [], isRead = false, onNavigate = null, onClose, isEssentiel, user, onLaunchQCM, onOpenCours }) {
  const sub = SUBJECTS.find(s => s.id === fiche.subject);
  const cols = FICHES_SUBJECT_COLORS[sub?.color] || FICHES_SUBJECT_COLORS.primary;
  const accent = FICHES_ACCENT_HEX[sub?.color] || FICHES_ACCENT_HEX.primary;
  const iconPath = FICHES_SUBJECT_ICONS[fiche.subject] || '';
  const mins = ficheReadingTime(fiche.content);

  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [toc, setToc] = useState([]);
  const [activeH, setActiveH] = useState(null);

  const idx = fiches.findIndex(f => f.id === fiche.id);
  const nextFiche = idx >= 0 && idx < fiches.length - 1 ? fiches[idx + 1] : null;

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Sommaire : extraire les titres du contenu et remettre le scroll en haut
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setProgress(0);
    const el = contentRef.current;
    if (!el) { setToc([]); return; }
    const heads = [...el.querySelectorAll('h3, h4')];
    const items = heads.map((h, i) => {
      const id = `fiche-h-${i}`;
      h.id = id;
      return { id, text: h.textContent, level: h.tagName === 'H3' ? 3 : 4 };
    });
    setToc(items);
  }, [fiche.id]);

  const onScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const max = scrollHeight - clientHeight;
    setProgress(max > 0 ? Math.min(100, Math.round((scrollTop / max) * 100)) : 100);
    // Titre actif
    const heads = contentRef.current ? [...contentRef.current.querySelectorAll('h3, h4')] : [];
    let cur = null;
    for (const h of heads) { if (h.offsetTop <= scrollTop + 90) cur = h.id; }
    setActiveH(cur);
  };

  const scrollToHeading = (id) => {
    const h = contentRef.current?.querySelector(`#${id}`);
    if (h && scrollRef.current) scrollRef.current.scrollTo({ top: h.offsetTop - 12, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 16px 24px' }}>
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,16,32,0.45)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

      {/* Panel */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 780, background: '#fff', borderRadius: 20, boxShadow: '0 32px 80px rgba(15,16,32,0.18)', maxHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Sticky header */}
        <div style={{ flexShrink: 0, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className={`w-8 h-8 rounded-xl ${cols.light} ${cols.border} border flex items-center justify-center`}>
              <svg className={`w-4 h-4 ${cols.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
              </svg>
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${cols.icon}`}>{sub?.name || ''}</span>
            <span style={{ fontSize: 11.5, color: '#9ca3af' }}>· ⏱ {mins} min</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Launch QCM on this subject */}
            <button
              onClick={() => { onLaunchQCM({ type: 'custom', subject: fiche.subject, subjectName: sub?.name || '', title: sub?.name || '' }); onClose(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#ece9ff', color: '#4f46e5', border: 'none', cursor: 'pointer' }}
              className="hover:bg-indigo-100 transition-colors"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
              <span className="hidden sm:inline">Tester par QCM</span>
            </button>
            <button onClick={onClose} style={{ padding: 7, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#8a8ea8', display: 'flex' }} className="hover:bg-gray-100 transition-colors">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Barre de progression de lecture */}
        <div style={{ flexShrink: 0, height: 3, background: '#eef0f7' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: accent, transition: 'width .1s linear' }} />
        </div>

        {/* Corps : contenu + sommaire */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          {/* Scrollable content */}
          <div ref={scrollRef} onScroll={onScroll} style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '24px 28px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f1020', marginBottom: 12, letterSpacing: -0.4 }}>{fiche.title}</h2>
            <p style={{ fontSize: 13.5, color: '#5f6280', marginBottom: 24, lineHeight: 1.55 }}>{fiche.summary}</p>

            {fiche.content ? (
              <div
                ref={contentRef}
                className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(fiche.content) }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#5f6280' }}>
                <p>Contenu non disponible.</p>
            </div>
          )}

          {/* Cours CTA */}
          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #eef0f7' }}>
            {isEssentiel ? (
              <button
                onClick={() => onOpenCours(fiche)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 20px', background: 'linear-gradient(to right, #fffbeb, #fef3c7)', border: '2px solid #fde68a', borderRadius: 14, cursor: 'pointer', textAlign: 'left' }}
                className="hover:border-amber-300 hover:shadow transition-all group"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: '#fde68a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#92400e" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: '#78350f', margin: 0 }}>Accéder au cours complet</p>
                    <p style={{ fontSize: 12, color: '#b45309', margin: '2px 0 0' }}>Cours détaillé avec explications approfondies</p>
                  </div>
                </div>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: '#e5e7eb', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: '#6b7280', margin: 0 }}>Cours complet</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>Réservé aux membres Premium</p>
                  </div>
                </div>
                <Link href="/tarifs" style={{ padding: '6px 14px', background: '#ece9ff', color: '#4f46e5', borderRadius: 999, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                  Premium →
                </Link>
              </div>
            )}
          </div>
          </div>

          {/* Sommaire */}
          {toc.length >= 3 && (
            <aside className="hidden md:block" style={{ width: 168, flexShrink: 0, borderLeft: '1px solid #f0f0f5', padding: '20px 14px', overflowY: 'auto' }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#b0b3c6', marginBottom: 8 }}>Sommaire</div>
              {toc.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, lineHeight: 1.35, padding: '4px 0', paddingLeft: item.level === 4 ? 10 : 0, color: activeH === item.id ? accent : '#5f6280', fontWeight: activeH === item.id ? 700 : 500 }}
                  className="hover:text-gray-900 transition-colors"
                >
                  {item.text}
                </button>
              ))}
            </aside>
          )}
        </div>

        {/* Bas de page : fiche lue + fiche suivante */}
        <div style={{ flexShrink: 0, borderTop: '1px solid #eef0f7', padding: '11px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: '#fff' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#1d7a4f' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            Fiche lue
          </span>
          {nextFiche && onNavigate ? (
            <button onClick={() => onNavigate(nextFiche)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 9, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', maxWidth: '72%' }} className="hover:bg-indigo-700 transition-colors">
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Suivante : {nextFiche.title}</span>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </button>
          ) : (
            <button onClick={onClose} style={{ background: '#f4f2ff', color: '#4f46e5', border: 'none', borderRadius: 9, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Terminer</button>
          )}
        </div>
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

function DashboardSideNav({ activeSection, setActiveSection, isPremiumPlus, tier, onLaunchQCM, onLaunchExamen, onOpenFiches, onLaunchFlash, onLaunchReview, reviewCount = 0, gam = null, onShowGrade = null }) {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const { user, logOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try { await logOut(); router.push('/'); } catch (e) { console.error(e); }
  };

  const navItems = [
    {
      id: 'overview', label: "Vue d'ensemble", group: 'reviser', accent: '#4f46e5', accentBg: '#f2f0fe',
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /></svg>,
    },
    {
      id: 'courses', label: 'Fiches & Cours', expandable: true, badge: '6 UE', group: 'reviser', accent: '#7c3aed', accentBg: '#f3edff',
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5zM19 18v3H6" /></svg>,
    },
    {
      id: 'training', label: 'Entraînement', expandableTraining: true, group: 'reviser', accent: '#e8a948', accentBg: '#fdf4e2',
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>,
    },
    {
      id: 'historique', label: 'Historique', group: 'progresser', accent: '#3eb489', accentBg: '#e5f6ee',
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg>,
    },
    {
      id: 'progression', label: 'Progression', locked: !isPremiumPlus, group: 'progresser', accent: '#4f8ff7', accentBg: '#e4edff',
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>,
    },
    {
      id: 'objectifs', label: 'Objectifs', locked: !isPremiumPlus, group: 'progresser', accent: '#7c3aed', accentBg: '#f3edff',
      icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>,
    },
    {
      id: 'classement', label: 'Classement', locked: !isPremiumPlus, group: 'progresser', accent: '#e8a948', accentBg: '#fdf4e2',
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

      {navItems.map((item, idx) => {
        const isCourses = item.id === 'courses';
        const isTraining = item.id === 'training';
        const isExpandable = isCourses || isTraining;
        const isActive = isCourses ? activeSection === 'fiches' : (isTraining ? false : activeSection === item.id);
        const isOpen = isCourses ? coursesOpen : (isTraining ? trainingOpen : false);
        const showGroupLabel = idx === 0 || navItems[idx - 1].group !== item.group;
        const iconColor = item.locked ? '#c1c3d4' : item.accent;

        return (
          <Fragment key={item.id}>
            {showGroupLabel && (
              <div style={{ fontSize: 9.5, letterSpacing: 1.4, fontWeight: 700, color: '#b0b3c6', textTransform: 'uppercase', padding: '0 10px 6px', marginTop: idx === 0 ? 0 : 14 }}>
                {item.group === 'reviser' ? 'Réviser' : 'Progresser'}
              </div>
            )}
            <button
              onClick={() => {
                if (isCourses) { setCoursesOpen(o => !o); onOpenFiches(null); }
                else if (isTraining) { setTrainingOpen(o => !o); }
                else { setActiveSection(item.id); }
              }}
              style={{
                position: 'relative',
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10, marginBottom: 2,
                background: isActive ? item.accentBg : 'transparent',
                color: isActive ? item.accent : '#2a2c44',
                fontSize: 14, fontWeight: isActive ? 700 : 500,
                border: 'none', cursor: 'pointer',
                textAlign: 'left',
              }}
              className={isActive ? '' : 'hover:bg-gray-50 transition-colors'}
            >
              {/* Barre d'accent à gauche quand actif */}
              {isActive && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: '0 3px 3px 0', background: item.accent }} />}
              <span style={{ display: 'flex', color: iconColor, opacity: item.locked ? 0.7 : 1 }}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: item.accentBg, color: item.accent }}>
                  {item.badge}
                </span>
              )}
              {isExpandable && (
                <svg className="w-3 h-3 shrink-0 transition-transform" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', color: isActive ? item.accent : '#c1c3d4' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
                  <button key={ue.code}
                    onClick={() => onOpenFiches(ue.id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, fontSize: 12.5, color: '#2a2c44', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <span style={{ fontFamily: 'monospace', fontSize: 10.5, fontWeight: 700, color: '#4f46e5', minWidth: 24 }}>{ue.code}</span>
                    <span>{ue.name}</span>
                  </button>
                ))}
                <button
                  onClick={() => onOpenFiches(null)}
                  style={{ width: '100%', display: 'block', padding: '6px 10px', fontSize: 12, fontWeight: 600, color: '#4f46e5', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  Toutes les fiches →
                </button>
              </div>
            )}

            {isTraining && trainingOpen && (
              <div style={{ marginLeft: 24, borderLeft: '1px solid #eef0f7', paddingLeft: 4, marginBottom: 6 }}>
                <button
                  onClick={onLaunchQCM}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, fontSize: 12.5, color: '#2a2c44', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" style={{ color: '#4f46e5' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  <span>Entraînement QCM</span>
                </button>
                <button
                  onClick={onLaunchExamen}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, fontSize: 12.5, color: '#2a2c44', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" style={{ color: '#e45770' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg>
                  <span>Examen blanc</span>
                </button>
                {onLaunchFlash && (
                  <button
                    onClick={onLaunchFlash}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, fontSize: 12.5, color: '#2a2c44', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" style={{ color: '#e8a948' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
                    <span>Session éclair</span>
                  </button>
                )}
                <button
                  onClick={reviewCount > 0 ? onLaunchReview : undefined}
                  disabled={reviewCount === 0}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, fontSize: 12.5, color: '#2a2c44', background: 'transparent', border: 'none', cursor: reviewCount > 0 ? 'pointer' : 'default', textAlign: 'left', opacity: reviewCount > 0 ? 1 : 0.5 }}
                  className={reviewCount > 0 ? 'hover:bg-gray-50 transition-colors' : ''}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" style={{ color: '#4f46e5' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                  <span className="flex-1">À consolider</span>
                  {reviewCount > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20, background: '#ece9ff', color: '#4f46e5' }}>{reviewCount}</span>
                  )}
                </button>
              </div>
            )}
          </Fragment>
        );
      })}

      {/* Espace + bas de sidebar */}
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        {/* Premium upsell card */}
        {!isPremiumPlus && (
          <div style={{ marginBottom: 12 }}>
            <Link href="/tarifs" style={{ display: 'block', padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #4f46e5 0%, #8257f9 100%)', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.9)" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                <span style={{ fontSize: 10.5, letterSpacing: 1.1, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                  {tier === 'gratuit' ? 'PLAN GRATUIT' : 'PLAN PREMIUM'}
                </span>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', marginBottom: 10, lineHeight: 1.35 }}>
                Débloque tout : QCM illimités, examens blancs, progression…
              </div>
              <div style={{ background: '#fff', color: '#4f46e5', borderRadius: 8, padding: '7px 10px', fontWeight: 700, fontSize: 12, textAlign: 'center' }}>
                Passer Premium →
              </div>
            </Link>
          </div>
        )}

        {/* Séparateur + déconnexion */}
        <div style={{ borderTop: '1px solid #eef0f7', paddingTop: 12 }}>
          {user && (
            <button
              onClick={() => setActiveSection('account')}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '6px 10px', borderRadius: 10, background: activeSection === 'account' ? '#f3f4f6' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              className="hover:bg-gray-50 transition-colors"
              title="Mon compte"
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#ece9ff', color: '#4f46e5', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                {(user.displayName?.[0] || user.email?.[0] || '?').toUpperCase()}
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: '#2a2c44', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {user.displayName || user.email}
              </span>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#8a8ea8" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
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
          Prêt pour votre premier QCM ?
        </div>
        <div style={{ fontSize: 13.5, opacity: 0.85, lineHeight: 1.45, maxWidth: 520 }}>
          Choisissez ci-dessous si vous voulez réviser par matière ou à partir d'une fiche de cours.
        </div>
      </div>
    </div>
  );
}

function HeroFocusFilled({ todaySubject, weekSessions, currentStreak, onLaunchQCM }) {
  const weekTarget = 10;
  const weekPct = Math.min(1, weekSessions / weekTarget);
  const circumference = 2 * Math.PI * 32;

  return (
    <div style={{ borderRadius: 18, padding: '20px 28px', flexShrink: 0, background: 'linear-gradient(135deg, #312c6e 0%, #4f46e5 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px]" style={{ position: 'relative', gap: 24, alignItems: 'center' }}>
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
            <button
              onClick={() => onLaunchQCM(todaySubject
                ? { type: 'custom', subject: todaySubject.id, subjectName: todaySubject.name, title: todaySubject.name }
                : { initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' }
              )}
              style={{ background: '#fff', color: '#4f46e5', borderRadius: 10, padding: '9px 18px', fontWeight: 700, fontSize: 13.5, border: 'none', cursor: 'pointer' }}
            >
              {todaySubject ? `Réviser — ${todaySubject.name} →` : 'Lancer un QCM →'}
            </button>
            <button
              onClick={() => onLaunchQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })}
              style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 10, padding: '9px 14px', fontWeight: 500, fontSize: 13.5, cursor: 'pointer' }}
            >
              Changer de sujet
            </button>
          </div>
        </div>
        <div className="hidden md:block">
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
    <div className="overflow-x-auto" style={{ background: '#fff', borderRadius: 14, border: '1px solid #eef0f7', flexShrink: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(140px, 1fr))' }}>
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
    </div>
  );
}

/* ============================================================
   RECO LIST VERTICAL
   ============================================================ */
function RecoListVertical({ recommendations, onLaunchQCM, topicStats = {} }) {
  const [expanded, setExpanded] = useState(null); // id de la matière dépliée
  const colorMap = {
    rose:  { bg: '#fbe5ea', fg: '#e45770' },
    amber: { bg: '#fdf4e2', fg: '#e8a948' },
    sky:   { bg: '#e4edff', fg: '#4f8ff7' },
  };
  const barColor = (avg) => avg < 50 ? '#e45770' : avg < 65 ? '#e8a948' : '#3eb489';

  return (
    <div className="md:col-span-2 md:overflow-y-auto" style={{ background: '#fff', borderRadius: 14, border: '1px solid #eef0f7', padding: 6, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="font-jakarta" style={{ fontSize: 16, fontWeight: 700, color: '#0f1020' }}>À revoir cette semaine</div>
          <div style={{ fontSize: 12.5, color: '#5f6280' }}>Cliquez sur une matière pour le détail par chapitre</div>
        </div>
        <button onClick={() => onLaunchQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })} style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
          Tout travailler →
        </button>
      </div>
      {recommendations.map((rec, i) => {
        const c = colorMap[rec.scoreColor] || colorMap.sky;
        const colors = SUBJECT_COLORS[rec.color] || SUBJECT_COLORS.primary;
        const isOpen = expanded === rec.id;
        const topics = (topicStats[rec.id] || []).slice(0, 5);
        const weakestTopic = topics[0];
        return (
          <Fragment key={i}>
            <div
              onClick={() => setExpanded(isOpen ? null : rec.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setExpanded(isOpen ? null : rec.id); }}
              style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto', gap: 14, alignItems: 'center', padding: '12px 14px', borderRadius: 10, cursor: 'pointer', width: '100%', textAlign: 'left', background: isOpen ? '#fafafe' : 'none' }}
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
              <button
                onClick={(e) => { e.stopPropagation(); onLaunchQCM({ type: 'custom', subject: rec.id, subjectName: rec.name, title: rec.name }); }}
                style={{ background: '#f4f2ff', color: '#4f46e5', borderRadius: 8, padding: '8px 14px', fontWeight: 600, fontSize: 12.5, flexShrink: 0, border: 'none', cursor: 'pointer' }}
                className="hover:bg-indigo-100 transition-colors"
              >
                Réviser
              </button>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#8a8ea8" strokeWidth="2.5" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            {/* Détail par chapitre */}
            {isOpen && (
              <div style={{ margin: '0 14px 10px', padding: '12px 16px', background: '#fafafe', border: '1px solid #eef0f7', borderRadius: 10 }}>
                {topics.length === 0 ? (
                  <p style={{ fontSize: 12, color: '#5f6280', margin: 0 }}>
                    Pas encore de détail par chapitre — lancez des QCM depuis les <strong>fiches</strong> de cette matière pour l'obtenir.
                  </p>
                ) : (
                  <>
                    <div style={{ fontSize: 10.5, letterSpacing: 1, fontWeight: 700, color: '#8a8ea8', textTransform: 'uppercase', marginBottom: 8 }}>Par chapitre</div>
                    {topics.map((t, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: '#2a2c44', width: '38%', minWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={t.topic}>{t.topic}</span>
                        <div style={{ flex: 1, height: 7, background: '#eef0f7', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${t.avg}%`, height: '100%', borderRadius: 4, background: barColor(t.avg) }} />
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: barColor(t.avg), width: 34, textAlign: 'right' }}>{t.avg}%</span>
                        <span style={{ fontSize: 10.5, color: '#8a8ea8', width: 44 }}>{t.count} sess.</span>
                      </div>
                    ))}
                    {weakestTopic && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10, paddingTop: 10, borderTop: '1px solid #eef0f7' }}>
                        <span style={{ fontSize: 12, color: '#5f6280' }}>
                          🎯 Priorité : <strong style={{ color: '#0f1020' }}>{weakestTopic.topic}</strong> ({weakestTopic.avg}%)
                        </span>
                        <button
                          onClick={() => onLaunchQCM({ type: 'custom', subject: rec.id, subjectName: rec.name, title: weakestTopic.topic })}
                          style={{ background: '#4f46e5', color: '#fff', borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: 11.5, border: 'none', cursor: 'pointer', flexShrink: 0 }}
                          className="hover:bg-indigo-700 transition-colors"
                        >
                          Cibler ce chapitre →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

/* ============================================================
   QUICK ACTION CARDS (sidebar column)
   ============================================================ */
function QuickActionCards({ onLaunchQCM, onLaunchExamen, todaySubject, subjects = [] }) {
  const [flashMenuOpen, setFlashMenuOpen] = useState(false);
  const launchFlash = (subj) => {
    setFlashMenuOpen(false);
    onLaunchQCM({ type: 'custom', subject: subj.id, subjectName: subj.name, title: subj.name, count: 8, flash: true });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {todaySubject && (
        <div style={{ position: 'relative' }}>
          <div
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: 14, display: 'flex', alignItems: 'stretch', boxShadow: '0 4px 14px rgba(79,70,229,0.25)', overflow: 'hidden' }}
            className="hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            {/* Zone principale : lance sur la matière la plus faible */}
            <button
              onClick={() => launchFlash(todaySubject)}
              style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', padding: '14px 8px 14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 17 }}>
                ⚡
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="font-jakarta" style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>Session éclair</div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>5 min · 8 questions · {todaySubject.name}</div>
              </div>
            </button>
            {/* Chevron : ouvre le sélecteur de matière */}
            <button
              onClick={() => setFlashMenuOpen(o => !o)}
              aria-label="Choisir la matière de la session éclair"
              aria-expanded={flashMenuOpen}
              style={{ flexShrink: 0, width: 40, background: 'rgba(255,255,255,0.12)', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#fff' }}
              className="hover:bg-white/20 transition-colors"
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ transform: flashMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* Menu déroulant des matières */}
          {flashMenuOpen && (
            <>
              <div onClick={() => setFlashMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 41, background: '#fff', border: '1px solid #e8e6f5', borderRadius: 12, boxShadow: '0 12px 32px rgba(79,70,229,0.16)', padding: 6, overflow: 'hidden' }}>
                <div style={{ fontSize: 10, letterSpacing: 1, fontWeight: 700, color: '#8a8ea8', textTransform: 'uppercase', padding: '6px 10px 4px' }}>Matière éclair</div>
                {subjects.map(subj => {
                  const isWeak = subj.id === todaySubject.id;
                  return (
                    <button
                      key={subj.id}
                      onClick={() => launchFlash(subj)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12.5, fontWeight: 500, color: '#2a2c44' }}
                      className="hover:bg-indigo-50 transition-colors"
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subj.name}</span>
                      {isWeak && <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: '#4f46e5', background: '#ece9ff', padding: '2px 7px', borderRadius: 8 }}>🎯 faible</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
      <button
        onClick={() => onLaunchQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })}
        style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #eef0f7', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}
        className="hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ece9ff', color: '#4f46e5', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        </div>
        <div>
          <div className="font-jakarta" style={{ fontSize: 13.5, fontWeight: 700, color: '#0f1020' }}>Lancer un QCM</div>
          <div style={{ fontSize: 11.5, color: '#5f6280' }}>Entraînement libre</div>
        </div>
      </button>
      <button
        onClick={onLaunchExamen}
        style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #eef0f7', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}
        className="hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fbe5ea', color: '#e45770', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg>
        </div>
        <div>
          <div className="font-jakarta" style={{ fontSize: 13.5, fontWeight: 700, color: '#0f1020' }}>Examen blanc</div>
          <div style={{ fontSize: 11.5, color: '#5f6280' }}>Conditions réelles</div>
        </div>
      </button>
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

function OnboardingPickerCard({ onLaunchQCM }) {
  const [tab, setTab] = useState('subject');
  const [customTopic, setCustomTopic] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [qCount, setQCount] = useState(10);

  const TABS = [
    { key: 'subject', label: 'Par matière' },
    { key: 'fiche',   label: 'Par fiche de cours' },
    { key: 'custom',  label: 'Sujet libre' },
  ];

  const handleCustomSubmit = () => {
    if (!customTopic.trim()) return;
    onLaunchQCM({ type: 'custom', subject: null, subjectName: customTopic.trim(), title: customTopic.trim() });
  };

  const handleSubjectLaunch = () => {
    if (!selectedSubject) return;
    const s = SUBJECT_PICKER_DATA.find(x => x.id === selectedSubject);
    onLaunchQCM({ type: 'custom', subject: selectedSubject, subjectName: s?.name || selectedSubject, title: s?.name || selectedSubject, count: qCount });
  };

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eef0f7', padding: '14px 18px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Phrase d'intro */}
      <p style={{ fontSize: 12.5, color: '#5f6280', margin: '0 0 12px', lineHeight: 1.5, flexShrink: 0 }}>
        Lancez votre premier QCM <strong style={{ color: '#0f1020' }}>par matière</strong>, à partir d'une <strong style={{ color: '#0f1020' }}>fiche de cours</strong> ou sur un <strong style={{ color: '#0f1020' }}>sujet de votre choix</strong>.
      </p>

      {/* Onglets */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexShrink: 0, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setSelectedSubject(null); }} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all .15s', background: tab === t.key ? '#4f46e5' : '#f3f4f8', color: tab === t.key ? '#fff' : '#5f6280' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenu onglet Matière */}
      {tab === 'subject' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          {/* Grille de sélection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {SUBJECT_PICKER_DATA.map(({ code, id, name, accent, bg, border }) => {
              const isSelected = selectedSubject === id;
              return (
                <button key={id} onClick={() => setSelectedSubject(isSelected ? null : id)}
                  style={{ padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${isSelected ? accent : border}`, background: isSelected ? accent : bg, textDecoration: 'none', display: 'block', textAlign: 'left', cursor: 'pointer', transition: 'all .15s', boxShadow: isSelected ? `0 2px 8px ${accent}33` : 'none' }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: isSelected ? 'rgba(255,255,255,0.75)' : accent, marginBottom: 2 }}>{code}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? '#fff' : '#0f1020' }}>{name}</div>
                </button>
              );
            })}
          </div>

          {/* Panneau de configuration (visible quand une matière est sélectionnée) */}
          {selectedSubject && (() => {
            const s = SUBJECT_PICKER_DATA.find(x => x.id === selectedSubject);
            return (
              <div style={{ background: '#f7f8ff', borderRadius: 10, border: '1.5px solid #e2e4f8', padding: '11px 14px', display: 'flex', flexDirection: 'column', gap: 9, flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: 12, color: '#5f6280', lineHeight: 1.45 }}>
                  Le QCM portera sur <strong style={{ color: '#0f1020' }}>l'ensemble de la matière {s.name}</strong>. Combien de questions ?
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[5, 10, 20, 30].map(n => (
                    <button key={n} onClick={() => setQCount(n)}
                      style={{ flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 12.5, fontWeight: 700, border: `1.5px solid ${qCount === n ? s.accent : '#e2e4f0'}`, background: qCount === n ? s.accent : '#fff', color: qCount === n ? '#fff' : '#5f6280', cursor: 'pointer', transition: 'all .15s' }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button onClick={handleSubjectLaunch}
                  style={{ padding: '9px 0', borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: s.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'opacity .15s' }}
                  className="hover:opacity-90"
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>
                  Lancer le QCM · {qCount} questions
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Contenu onglet Fiche */}
      {tab === 'fiche' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {SUBJECT_PICKER_DATA.map(({ code, id, name, accent, bg, border }) => (
              <button key={id}
                onClick={() => onLaunchQCM({ initialView: 'fichesSelection', initialSubjectFilter: id, subjectName: name, title: name })}
                style={{ padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${border}`, background: bg, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', textAlign: 'left', transition: 'all .15s' }}
                className="hover:-translate-y-0.5 hover:shadow-sm transition-all"
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: accent, minWidth: 28 }}>{code}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0f1020', lineHeight: 1.3 }}>{name}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => onLaunchQCM({ initialView: 'fichesSelection', subjectName: 'Toutes les fiches', title: 'Toutes les fiches' })}
            style={{ marginTop: 2, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Voir toutes les fiches →
          </button>
        </div>
      )}

      {/* Contenu onglet Sujet libre */}
      {tab === 'custom' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 12.5, color: '#5f6280', margin: 0, lineHeight: 1.5 }}>
            Entrez n'importe quel sujet du programme — l'IA génère un QCM ciblé.
          </p>
          <input
            type="text"
            placeholder="Ex : cycle de Krebs, loi de Beer-Lambert…"
            value={customTopic}
            onChange={e => setCustomTopic(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCustomSubmit(); }}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e4f0', fontSize: 13, color: '#0f1020', outline: 'none', background: '#fafafa', boxSizing: 'border-box', transition: 'border-color .15s' }}
            onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.borderColor = '#e2e4f0'; e.target.style.background = '#fafafa'; }}
          />
          <button
            onClick={handleCustomSubmit}
            disabled={!customTopic.trim()}
            style={{ padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: customTopic.trim() ? 'pointer' : 'not-allowed', background: customTopic.trim() ? '#4f46e5' : '#e9eaf3', color: customTopic.trim() ? '#fff' : '#a0a3bb', transition: 'all .15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>
            Générer mon QCM
          </button>
        </div>
      )}
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
function EmptyState({ title, description, ctaHref, ctaLabel, onCta, userName }) {
  const displayTitle = userName ? `Prêt${userName ? ' ' + userName : ''} ?` : title;
  const displayDesc = userName
    ? 'Lancez un premier QCM pour calibrer votre niveau. Vos stats s\'afficheront ici en temps réel.'
    : description;

  const ctaClass = "inline-flex px-6 py-3 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{userName ? displayTitle : title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{userName ? displayDesc : description}</p>
      {onCta && (
        <button onClick={onCta} className={ctaClass}>
          {ctaLabel || 'Commencer maintenant'}
        </button>
      )}
      {!onCta && ctaHref && (
        <Link href={ctaHref} className={ctaClass}>
          {ctaLabel || 'Commencer maintenant'}
        </Link>
      )}
    </div>
  );
}

/* ============================================================
   ACCOUNT SECTION
   ============================================================ */
function AccountSection({ user, tier, isPremiumPlus, accessToken, gam = null, data = null }) {
  const { logOut } = useAuth();
  const router = useRouter();
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState(null);

  // Date du concours
  const [examDraft, setExamDraft] = useState(user?.user_metadata?.exam_date || '');
  const [examLoading, setExamLoading] = useState(false);
  const [examMsg, setExamMsg] = useState(null);

  const handleExamSave = async (e) => {
    e.preventDefault();
    if (!examDraft) return;
    setExamLoading(true); setExamMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ data: { exam_date: examDraft } });
      if (error) throw error;
      setExamMsg({ type: 'success', text: 'Date du concours enregistrée.' });
    } catch (err) {
      setExamMsg({ type: 'error', text: err.message || 'Erreur lors de l\'enregistrement.' });
    } finally { setExamLoading(false); }
  };

  const handleLogout = async () => { try { await logOut(); router.push('/'); } catch (e) { console.error(e); } };

  // Tenue de Pico
  const [outfit, setOutfit] = useState(user?.user_metadata?.pico_outfit || 'classic');
  const outfitCtx = { gradeIndex: gam ? Math.max(0, GRADES.findIndex(g => g.name === gam.grade.name)) : 0, streak: gam?.streakInfo?.streak || 0 };
  const saveOutfit = async (id) => {
    setOutfit(id);
    if (supabase) { try { await supabase.auth.updateUser({ data: { pico_outfit: id } }); } catch (e) { console.warn('pico_outfit', e); } }
  };

  // Suppression de compte
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'SUPPRIMER') return;
    setDeleteLoading(true); setDeleteError(null);
    try {
      const res = await fetch('/api/delete-account', { method: 'POST', headers: { 'Authorization': `Bearer ${accessToken}` } });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || 'Échec de la suppression.');
      await logOut();
      router.push('/');
    } catch (e) { setDeleteError(e.message || 'Erreur.'); setDeleteLoading(false); }
  };

  // Email
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMsg, setEmailMsg] = useState(null); // { type: 'success'|'error', text }

  // Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // Détecter si l'utilisateur est connecté via OAuth (Google) → pas de mot de passe
  const isOAuth = user?.app_metadata?.provider === 'google' ||
    (user?.identities?.length > 0 && user.identities.every(id => id.provider !== 'email'));

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!newEmail || newEmail === user?.email) return;
    setEmailLoading(true);
    setEmailMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setEmailMsg({ type: 'success', text: 'Un lien de confirmation a été envoyé à votre nouvelle adresse e-mail.' });
      setNewEmail('');
    } catch (err) {
      setEmailMsg({ type: 'error', text: err.message || 'Erreur lors de la mise à jour.' });
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères.' });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMsg({ type: 'success', text: 'Mot de passe mis à jour avec succès.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Erreur lors de la mise à jour.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const tierLabel = tier === 'gratuit' ? 'Gratuit' : 'Premium';
  const tierColor = tier === 'gratuit' ? { bg: '#f3f4f6', text: '#374151' } : { bg: '#ede9fe', text: '#5b21b6' };

  const PREMIUM_FEATURES = ['QCM illimités par IA', 'Examens blancs format concours', 'Cours complets + fiches PDF', 'Progression, Objectifs & Classement'];
  const tierFeatures = {
    gratuit: ['1 QCM par jour', 'Toutes les fiches de révision', 'Dashboard, Pico & série', 'Historique des sessions'],
    essentiel: PREMIUM_FEATURES,
    'premium+': PREMIUM_FEATURES,
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPortalError(data.error || 'Erreur lors de la redirection.');
        setPortalLoading(false);
      }
    } catch {
      setPortalError('Erreur de connexion. Réessayez.');
      setPortalLoading(false);
    }
  };

  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '—';
  const heroStats = gam ? [
    { l: 'Grade', v: `${gam.grade.emoji} ${gam.grade.name}` },
    { l: 'XP total', v: `${gam.total.toLocaleString('fr-FR')}` },
    { l: 'Série', v: `🔥 ${gam.streakInfo.streak} j` },
    { l: 'Membre depuis', v: memberSince, cap: true },
  ] : null;

  return (
    <div className="space-y-5 pb-12">
      {/* Profil — en-tête enrichi */}
      <div className="rounded-2xl border border-indigo-100 shadow-sm overflow-hidden" style={{ background: 'linear-gradient(135deg,#eef2ff 0%,#faf9ff 62%)' }}>
        <div className="p-6 flex items-center gap-5">
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 27, flexShrink: 0, boxShadow: '0 6px 18px rgba(79,70,229,0.3)' }}>
            {(user?.displayName?.[0] || user?.email?.[0] || '?').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-black text-gray-900 truncate tracking-tight">{user?.displayName || 'Utilisateur'}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 7, padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: tierColor.bg, color: tierColor.text }}>
              {tier === 'premium+' && <span>✦</span>}{tierLabel}
            </span>
          </div>
        </div>
        {heroStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 bg-white/50 border-t border-indigo-100/70">
            {heroStats.map((s, i) => (
              <div key={s.l} className={`px-4 py-3 ${i > 0 ? 'border-l border-indigo-100/70' : ''} ${i === 2 ? 'sm:border-l border-t sm:border-t-0 border-indigo-100/70' : ''} ${i === 3 ? 'border-l border-t sm:border-t-0 border-indigo-100/70' : ''}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{s.l}</div>
                <div className={`text-sm font-black text-gray-900 truncate ${s.cap ? 'capitalize' : ''}`}>{s.v}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rangée 1 : abonnement + tenue de Pico (hauteurs égales) */}
      <div className="grid lg:grid-cols-2 gap-5 items-stretch">
      {/* Abonnement */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500"></span>
          Mon abonnement
        </h3>

        {/* Plan actuel */}
        <div style={{ padding: '16px 18px', borderRadius: 14, background: tier === 'premium+' ? 'linear-gradient(135deg, #1e1b4b, #4f46e5)' : tier === 'essentiel' ? 'linear-gradient(135deg, #fffbeb, #fef3c7)' : '#f9fafb', border: tier === 'gratuit' ? '1.5px solid #e5e7eb' : 'none', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: tier === 'premium+' ? '#fff' : tier === 'essentiel' ? '#92400e' : '#374151', letterSpacing: 0.3 }}>
              Plan {tierLabel}
            </span>
            {tier !== 'gratuit' && (
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: tier === 'premium+' ? 'rgba(255,255,255,0.15)' : '#fde68a', color: tier === 'premium+' ? '#fff' : '#92400e' }}>
                Actif
              </span>
            )}
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {(tierFeatures[tier] || tierFeatures.gratuit).map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: tier === 'premium+' ? 'rgba(255,255,255,0.85)' : '#4b5563', marginBottom: 4 }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={tier === 'premium+' ? 'rgba(255,255,255,0.7)' : '#6d28d9'} strokeWidth="2.5" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        {tier === 'gratuit' ? (
          <Link href="/tarifs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', background: 'linear-gradient(135deg, #4f46e5, #8257f9)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 6px 20px rgba(79,70,229,0.3)' }} className="hover:opacity-90 transition-opacity">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
            Passer à un plan payant
          </Link>
        ) : (
          <div className="space-y-3">
            {!isPremiumPlus && (
              <Link href="/tarifs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 20px', background: 'linear-gradient(135deg, #4f46e5, #8257f9)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none' }} className="hover:opacity-90 transition-opacity">
                Passer Premium →
              </Link>
            )}
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 20px', background: '#f3f4f6', color: '#374151', borderRadius: 12, fontWeight: 600, fontSize: 14, border: 'none', cursor: portalLoading ? 'wait' : 'pointer' }}
              className="hover:bg-gray-200 transition-colors"
            >
              {portalLoading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 21Z" /></svg>
              )}
              {portalLoading ? 'Redirection…' : 'Gérer mon abonnement (facturation)'}
            </button>
            {portalError && <p style={{ fontSize: 12, color: '#dc2626', textAlign: 'center' }}>{portalError}</p>}
          </div>
        )}
      </div>
      {/* Préférences : tenue de Pico */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500"></span>
          Tenue de Pico
        </h3>
        <p className="text-sm text-gray-400 mb-4">Personnalise ta mascotte. Les tenues se débloquent avec tes grades et ta série.</p>
        <div className="grid grid-cols-3 gap-2.5">
          {PICO_OUTFITS.map(o => {
            const unlocked = o.unlock(outfitCtx);
            const selected = outfit === o.id;
            return (
              <button
                key={o.id}
                onClick={() => unlocked && saveOutfit(o.id)}
                disabled={!unlocked}
                title={unlocked ? o.name : `${o.name} — ${o.desc}`}
                className="rounded-xl px-1 py-2.5 text-center transition-all"
                style={{ background: selected ? '#ece9ff' : '#fafafe', border: selected ? '2px solid #4f46e5' : '1px solid #eef0f7', cursor: unlocked ? 'pointer' : 'default', opacity: unlocked ? 1 : 0.45, filter: unlocked ? 'none' : 'grayscale(1)' }}
              >
                <PicoOwlSvg size={38} outfit={o.id} />
                <div style={{ fontSize: 10, fontWeight: 700, color: '#2a2c44', marginTop: 4 }}>{o.name}</div>
                <div style={{ fontSize: 9, color: selected ? '#4f46e5' : '#8a8ea8', fontWeight: selected ? 700 : 400 }}>{unlocked ? (selected ? 'Portée' : 'Dispo') : `🔒 ${o.desc}`}</div>
              </button>
            );
          })}
        </div>
      </div>
      </div>

      {/* Rangée 2 : e-mail + mot de passe (hauteurs égales) */}
      <div className="grid lg:grid-cols-2 gap-5 items-stretch">
      {/* Modifier l'adresse e-mail */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-500"></span>
          Adresse e-mail
        </h3>
        <p className="text-sm text-gray-400 mb-4">Actuelle : <span className="font-medium text-gray-600">{user?.email}</span></p>
        <form onSubmit={handleEmailUpdate} className="space-y-3">
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Nouvelle adresse e-mail</label>
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="nouvelle@email.com"
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, color: '#0f1020', outline: 'none', boxSizing: 'border-box' }}
              className="focus:border-indigo-400 transition-colors"
            />
          </div>
          {emailMsg && (
            <p style={{ fontSize: 12.5, color: emailMsg.type === 'success' ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
              {emailMsg.type === 'success' ? '✓' : '✕'} {emailMsg.text}
            </p>
          )}
          <button
            type="submit"
            disabled={emailLoading || !newEmail}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#4f46e5', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 13.5, border: 'none', cursor: emailLoading || !newEmail ? 'not-allowed' : 'pointer', opacity: !newEmail ? 0.5 : 1 }}
            className="hover:bg-indigo-700 transition-colors"
          >
            {emailLoading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
            {emailLoading ? 'Mise à jour…' : 'Mettre à jour l\'e-mail'}
          </button>
        </form>
      </div>

      {/* Modifier le mot de passe */}
      {!isOAuth ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Mot de passe
          </h3>
          <p className="text-sm text-gray-400 mb-4">Choisissez un mot de passe d'au moins 8 caractères.</p>
          <form onSubmit={handlePasswordUpdate} className="space-y-3">
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, color: '#0f1020', outline: 'none', boxSizing: 'border-box' }}
                  className="focus:border-indigo-400 transition-colors"
                />
                <button type="button" onClick={() => setShowNewPwd(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                  {showNewPwd
                    ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  }
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Confirmer le mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPwd ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10, border: `1.5px solid ${confirmPassword && newPassword !== confirmPassword ? '#f87171' : '#e5e7eb'}`, fontSize: 14, color: '#0f1020', outline: 'none', boxSizing: 'border-box' }}
                  className="focus:border-indigo-400 transition-colors"
                />
                <button type="button" onClick={() => setShowConfirmPwd(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                  {showConfirmPwd
                    ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  }
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p style={{ fontSize: 11.5, color: '#ef4444', marginTop: 4 }}>Les mots de passe ne correspondent pas</p>
              )}
            </div>
            {passwordMsg && (
              <p style={{ fontSize: 12.5, color: passwordMsg.type === 'success' ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                {passwordMsg.type === 'success' ? '✓' : '✕'} {passwordMsg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={passwordLoading || !newPassword || newPassword !== confirmPassword}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#059669', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 13.5, border: 'none', cursor: passwordLoading || !newPassword || newPassword !== confirmPassword ? 'not-allowed' : 'pointer', opacity: !newPassword || newPassword !== confirmPassword ? 0.5 : 1 }}
              className="hover:bg-emerald-700 transition-colors"
            >
              {passwordLoading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
              {passwordLoading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Mot de passe
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Connexion via Google — gestion du mot de passe désactivée.</p>
          </div>
        </div>
      )}
      </div>

      {/* Rangée 3 : date du concours + zone de danger (hauteurs égales) */}
      <div className="grid lg:grid-cols-2 gap-5 items-stretch">
      {/* Date du concours */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          Date du concours
        </h3>
        <p className="text-sm text-gray-400 mb-4">Sert au compte à rebours et à ton parcours sur l&apos;accueil.</p>
        <form onSubmit={handleExamSave} className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <div className="flex-1">
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Ta date d&apos;examen</label>
            <input
              type="date"
              value={examDraft}
              onChange={e => { setExamDraft(e.target.value); setExamMsg(null); }}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, color: '#0f1020', outline: 'none', boxSizing: 'border-box' }}
              className="focus:border-indigo-400 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={examLoading || !examDraft || examDraft === user?.user_metadata?.exam_date}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 18px', background: '#4f46e5', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 13.5, border: 'none', cursor: (examLoading || !examDraft || examDraft === user?.user_metadata?.exam_date) ? 'not-allowed' : 'pointer', opacity: (!examDraft || examDraft === user?.user_metadata?.exam_date) ? 0.5 : 1, whiteSpace: 'nowrap' }}
            className="hover:bg-indigo-700 transition-colors"
          >
            {examLoading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
            Enregistrer
          </button>
        </form>
        {examMsg && (
          <p style={{ fontSize: 12.5, marginTop: 10, color: examMsg.type === 'success' ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
            {examMsg.type === 'success' ? '✓' : '✕'} {examMsg.text}
          </p>
        )}
      </div>

      {/* Zone de danger : suppression du compte */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          Suppression du compte
        </h3>
        <p className="text-sm text-gray-400 mb-4">La suppression est <strong className="text-gray-600">définitive</strong> : compte, progression et données sont effacés.</p>
        {!deleteOpen ? (
          <button onClick={() => { setDeleteOpen(true); setDeleteError(null); setDeleteConfirm(''); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-semibold text-sm hover:bg-rose-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
            Supprimer mon compte
          </button>
        ) : (
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
            <p className="text-sm text-gray-700 mb-3">Pour confirmer, tape <strong className="text-rose-600 tracking-wide">SUPPRIMER</strong> ci-dessous.</p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="SUPPRIMER"
              autoFocus
              style={{ width: '100%', maxWidth: 260, padding: '9px 13px', borderRadius: 10, border: '1.5px solid #fecaca', fontSize: 14, color: '#0f1020', outline: 'none', boxSizing: 'border-box' }}
              className="focus:border-rose-400 transition-colors mb-3 block"
            />
            {deleteError && <p className="text-xs text-rose-600 mb-3">✕ {deleteError}</p>}
            <div className="flex gap-2">
              <button onClick={handleDeleteAccount} disabled={deleteConfirm !== 'SUPPRIMER' || deleteLoading} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {deleteLoading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                {deleteLoading ? 'Suppression…' : 'Supprimer définitivement'}
              </button>
              <button onClick={() => setDeleteOpen(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">Annuler</button>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Déconnexion */}
      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 bg-white text-rose-600 font-semibold text-sm hover:bg-rose-50 hover:border-rose-200 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
        Se déconnecter
      </button>
    </div>
  );
}

/* ============================================================
   PREMIUM LOCK
   ============================================================ */
/* ============================================================
   PREMIUM BLUR GATE — affiche le contenu flouté si locked=true
   ============================================================ */
function PremiumBlurGate({ locked, title, description, children }) {
  if (!locked) return children;
  return (
    <div style={{ position: 'relative' }}>
      {/* Contenu flouté */}
      <div style={{ filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.85 }}>
        {children}
      </div>
      {/* Overlay central */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '16px' }}>
        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)', borderRadius: 20, border: '1px solid #eef0f7', boxShadow: '0 24px 64px rgba(15,16,32,0.18)', padding: '32px 36px', maxWidth: 340, width: '100%' }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #4f46e5 0%, #8257f9 100%)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f1020', marginBottom: 8, letterSpacing: -0.3 }}>{title}</h3>
          <p style={{ fontSize: 13.5, color: '#5f6280', marginBottom: 22, lineHeight: 1.55 }}>{description}</p>
          <Link
            href="/tarifs"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 28px', background: 'linear-gradient(135deg, #4f46e5 0%, #8257f9 100%)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 6px 20px rgba(79,70,229,0.35)' }}
            className="hover:opacity-90 transition-opacity"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
            Passer Premium
          </Link>
        </div>
      </div>
    </div>
  );
}

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
function ScoreLineChart({ points, target = 70 }) {
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

  // Courbe lissée (Catmull-Rom → Bézier), avec bornage vertical pour éviter les débordements
  const pts = points.map((p, i) => [getX(i), getY(p.value)]);
  const clampY = (v) => Math.max(padTop, Math.min(padTop + chartH, v));
  const curvePath = (() => {
    if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : '';
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = clampY(p1[1] + (p2[1] - p0[1]) / 6);
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = clampY(p2[1] - (p3[1] - p1[1]) / 6);
      d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
    }
    return d;
  })();
  const areaPath = `${curvePath} L${getX(points.length - 1)},${padTop + chartH} L${getX(0)},${padTop + chartH} Z`;
  const objY = getY(target);

  const yTicks = [0, 25, 50, 75, 100];

  // Show fewer X labels on small datasets
  const maxLabels = points.length <= 10 ? points.length : Math.min(points.length, 8);
  const labelStep = Math.max(1, Math.ceil(points.length / maxLabels));

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet" onMouseLeave={() => setHoveredIndex(null)}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines */}
        {yTicks.map(tick => (
          <g key={tick}>
            <line x1={padLeft} y1={getY(tick)} x2={W - padRight} y2={getY(tick)} stroke="#eef0f6" strokeWidth="1" strokeDasharray={tick === 0 ? 'none' : '4 4'} />
            <text x={padLeft - 6} y={getY(tick) + 4} textAnchor="end" className="text-[10px]" fill="#9ca3af">{tick}%</text>
          </g>
        ))}

        {/* Filled area under curve */}
        <path d={areaPath} fill="url(#chartGradient)" />

        {/* Ligne d'objectif 70% */}
        <line x1={padLeft} y1={objY} x2={W - padRight} y2={objY} stroke="#7c3aed" strokeWidth="1.4" strokeDasharray="5 5" opacity="0.5" />
        <text x={W - padRight} y={objY - 5} textAnchor="end" className="text-[10px]" fontWeight="700" fill="#7c3aed" opacity="0.9">Objectif {target}%</text>

        {/* Main curve line */}
        <path d={curvePath} fill="none" stroke="#7c3aed" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />

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
              <circle cx={cx} cy={cy} r={isHovered ? 5.5 : (i === points.length - 1 ? 4.5 : 3)} fill={isHovered || i === points.length - 1 ? '#7c3aed' : '#fff'} stroke="#7c3aed" strokeWidth="2" style={{ transition: 'r 0.15s ease' }} />
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

        {/* X-axis labels — on montre les ticks réguliers + le dernier, sans les coller */}
        {points.map((p, i) => {
          const isLast = i === points.length - 1;
          if (!isLast && (i % labelStep !== 0 || i > points.length - 1 - Math.ceil(labelStep / 2))) return null;
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
// drift : tendance de fond lente sur l'année (↗ / ↘). L'évolution jour-à-jour vient de
// la marche « jour actif » ci-dessous : chaque jour, seuls les étudiants tirés « actifs »
// voient leur moyenne bouger (dans le plus comme dans le moins), avec une amplitude
// d'autant plus faible qu'ils ont de sessions, et un rappel vers leur niveau de base.
// weekAmplitude : conservé pour compat (non utilisé).

// Hash déterministe -> [0,1)  (pas de Math.random : rendu stable pour une date donnée)
function hash01(a, b) {
  const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Marche « mean-reverting » : somme des petits mouvements des jours actifs récents,
// avec rappel vers la base. Un gros volume de sessions => moyenne plus stable.
function dailyWalk(seed, day, activity, sessions) {
  const WINDOW = 70;      // au-delà de 70 jours la contribution est négligeable
  const REVERT = 0.055;   // rappel vers le niveau de base
  const step = 3.4 / (1 + sessions / 28); // volume élevé => petits pas => stable
  let w = 0;
  for (let d = day - WINDOW; d <= day; d++) {
    w *= (1 - REVERT);
    if (hash01(seed, d) < activity) {               // seulement les jours « actifs »
      w += (hash01(seed + 101, d) - 0.5) * 2 * step; // mouvement + ou −
    }
  }
  return w;
}

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

  // — Utilisateurs nommés (BASE_USERS) —
  const namedUsers = BASE_USERS.map((u, i) => {
    const seed = i + 1;
    const sessions = u.baseSessions + Math.floor(dayOfYear * u.growth);
    // Fréquence d'entraînement : les gros bosseurs sont « actifs » plus souvent ;
    // les inactifs (growth 0) ne bougent quasiment jamais.
    const activity = u.growth === 0 ? 0.03 : Math.min(0.6, 0.14 + u.baseSessions / 480);
    // Tendance de fond lente sur l'année (↗ / ↘)
    const driftTrend = u.drift ? Math.max(-12, Math.min(12, u.drift * dayOfYear * 0.03)) : 0;
    const walk = dailyWalk(seed, dayOfYear, activity, sessions);
    const avg = Math.max(6, Math.min(96, Math.round(u.baseAvg + driftTrend + walk)));
    return { name: u.name, avg, sessions };
  });

  // — 440 utilisateurs supplémentaires générés (total ≈ 560) —
  const extraUsers = [];
  const extraCount = 440;
  for (let i = 0; i < extraCount; i++) {
    const idx = namedUsers.length + i;
    const seed = idx + 1;

    // Nom pseudo-aléatoire déterministe
    const fnSeed = Math.abs(Math.sin(idx * 7919) * 10000);
    const lnSeed = Math.abs(Math.sin(idx * 3571) * 10000);
    const firstName = EXTRA_FIRST_NAMES[Math.floor(fnSeed % EXTRA_FIRST_NAMES.length)];
    const initial  = EXTRA_INITIALS[Math.floor(lnSeed % EXTRA_INITIALS.length)];

    // Distribution en cloche (triangulaire) centrée ~47, queues jusqu'à ~12 et ~82
    const bell = (hash01(idx, 1.1) + hash01(idx, 2.2)) / 2;
    const baseAvg = Math.round(12 + bell * 70);

    // Sessions : corrélées un peu au sérieux (meilleur score => en moyenne plus de sessions)
    const baseSessions = 4 + Math.floor(hash01(idx, 5.5) * 80 + (baseAvg - 12) * 0.7);
    const sessions = baseSessions + Math.floor(dayOfYear * (baseAvg > 55 ? 0.05 : 0.02));

    const activity = Math.min(0.55, 0.1 + baseSessions / 380);
    const walk = dailyWalk(seed, dayOfYear, activity, sessions);
    const avg = Math.max(6, Math.min(96, Math.round(baseAvg + walk)));

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
  // Classement hebdomadaire : seules les sessions des 7 derniers jours comptent
  const weekSessions = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 3600 * 1000;
    return allSessions.filter(s => s.date && new Date(s.date).getTime() >= cutoff);
  }, [allSessions]);
  const userAvg = weekSessions.length > 0 ? Math.round(weekSessions.reduce((sum, s) => sum + (s.percentage || 0), 0) / weekSessions.length) : 0;
  const userSessionCount = weekSessions.length;
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

  const fakeUsers = useMemo(() => generateFakeUsers(), []);

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

  // Le top 3 est affiché sur le podium ; la liste démarre au rang 4
  // Afficher les rangs 4-10 + les 5 autour de l'utilisateur + les 3 derniers
  const baseVisible = new Set();
  for (let i = 3; i < Math.min(10, allRanked.length); i++) baseVisible.add(i);
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

  const podium = allRanked.slice(0, 3);
  const nextUp = userRank > 1 ? allRanked[userRank - 2] : null;
  const gapToNext = nextUp ? Math.max(0, nextUp.score - allRanked[userRank - 1].score) : 0;
  const AVATAR_COLORS = ['#4f46e5', '#7c3aed', '#059669', '#0891b2', '#d97706', '#e11d48', '#2563eb', '#db2777', '#0d9488'];
  const avatarFor = (name) => {
    const initials = (name || '?').split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
    let h = 0; for (const c of (name || '?')) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return { initials, color: AVATAR_COLORS[h % AVATAR_COLORS.length] };
  };
  const Avatar = ({ name, isUser, size = 32 }) => {
    const { initials, color } = avatarFor(name);
    return (
      <span style={{ width: size, height: size, borderRadius: '50%', background: isUser ? '#4f46e5' : color, color: '#fff', display: 'inline-grid', placeItems: 'center', fontSize: size * 0.4, fontWeight: 800, flexShrink: 0 }}>{initials}</span>
    );
  };
  const podiumStyles = [
    { bar: 'linear-gradient(180deg,#fde68a,#f59e0b)', ring: '#f59e0b', h: 68 }, // or
    { bar: 'linear-gradient(180deg,#e5e7eb,#9ca3af)', ring: '#9ca3af', h: 50 }, // argent
    { bar: 'linear-gradient(180deg,#fcd9b6,#c2803f)', ring: '#c2803f', h: 40 }, // bronze
  ];

  return (
    <div className="space-y-5">
      {/* En-tête de section */}
      <div>
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <span>🏆</span> Classement hebdomadaire
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Ta semaine face à la promo — remise en jeu chaque jour.
        </p>
      </div>

      {/* Explication du classement */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <div className="text-sm text-amber-800 leading-relaxed">
          <p className="font-semibold mb-1">Comment fonctionne le classement hebdomadaire ?</p>
          <p>Ton score combine <span className="font-semibold">précision et régularité sur tes 7 derniers jours</span> — pas seulement le volume. Un résultat isolé ne suffit pas à grimper en tête, et le classement <span className="font-semibold">évolue chaque jour</span> : ta place se défend toute la semaine.</p>
        </div>
      </div>

      {/* KPI */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-3 gap-px bg-gray-100">
          {[
            { l: 'Ta position', v: <>{userRank}<span className="text-base text-gray-400">/{totalParticipants}</span></>, cls: 'text-gray-900' },
            { l: 'Percentile', v: `Top ${Math.max(1, 100 - percentile)}%`, cls: 'text-indigo-600' },
            { l: 'Score moyen · 7 j', v: `${userAvg}%`, cls: scoreClass(userAvg) },
          ].map(st => (
            <div key={st.l} className="bg-white px-5 py-3.5 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{st.l}</div>
              <div className={`text-2xl font-black tabular-nums ${st.cls}`}>{st.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Podium top 3 */}
      {podium.length === 3 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              🏆 Top de la semaine
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-1">
              📈 Évolue chaque jour
            </span>
          </div>
          <div className="flex items-end justify-center gap-3 sm:gap-6">
            {[{ u: podium[1], rank: 2 }, { u: podium[0], rank: 1 }, { u: podium[2], rank: 3 }].map(({ u, rank }) => {
              const ps = podiumStyles[rank - 1];
              return (
                <div key={rank} className="flex flex-col items-center" style={{ width: rank === 1 ? 108 : 92 }}>
                  <div className="relative mb-2">
                    <span style={{ display: 'block', borderRadius: '50%', padding: 2, background: '#fff', boxShadow: `0 0 0 2.5px ${ps.ring}` }}>
                      <Avatar name={u.name} isUser={u.isUser} size={rank === 1 ? 52 : 42} />
                    </span>
                    <span style={{ position: 'absolute', bottom: -4, right: -4, fontSize: rank === 1 ? 22 : 18 }}>{medals[rank - 1]}</span>
                  </div>
                  <div className={`text-[13px] font-bold text-center leading-tight truncate w-full ${u.isUser ? 'text-indigo-700' : 'text-gray-900'}`}>{u.isUser ? 'Vous' : u.name}</div>
                  <div className={`text-sm font-black tabular-nums ${scoreClass(u.avg)}`}>{u.avg}%</div>
                  <div className="text-[10px] text-gray-400 mb-2 tabular-nums">{u.sessions} sessions</div>
                  <div className="w-full rounded-t-xl flex items-start justify-center pt-1.5 text-white font-black text-sm" style={{ height: ps.h, background: ps.bar }}>{rank}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accroche : écart au rang supérieur */}
      {userRank === 1 ? (
        <div className="bg-gradient-to-r from-amber-50 to-white border border-amber-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
          <span className="text-xl">🏆</span>
          <span className="text-sm font-semibold text-amber-800">Tu es en tête du classement cette semaine — reste régulier pour garder ta place&nbsp;!</span>
        </div>
      ) : nextUp && (
        <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-2xl px-5 py-3.5 flex items-center gap-3">
          <span className="text-xl">🎯</span>
          <span className="text-sm text-gray-700">
            {gapToNext > 0
              ? <>Plus que <strong className="text-indigo-700">{gapToNext} pt{gapToNext > 1 ? 's' : ''}</strong> pour dépasser <strong>{nextUp.isUser ? 'toi' : nextUp.name}</strong> et passer <strong>{userRank - 1}<sup>e</sup></strong>.</>
              : <>Tu es au coude-à-coude avec <strong>{nextUp.name}</strong> pour la <strong>{userRank - 1}<sup>e</sup></strong> place&nbsp;!</>}
          </span>
        </div>
      )}

      {/* Liste (rang 4 et suivants) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100">
                <th className="text-center py-2.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-14">Rang</th>
                <th className="text-left py-2.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Étudiant</th>
                <th className="text-left py-2.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Score</th>
                <th className="text-right py-2.5 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sessions · 7 j</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                if (row.type === 'gap') {
                  const isExpanded = expandedGaps.has(row.gap.key);
                  const hiddenCount = row.gap.to - row.gap.from + 1;
                  return (
                    <tr key={`gap-${row.gap.key}`} onClick={() => toggleGap(row.gap.key)} className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <td colSpan="4" className="py-2 text-center text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                          {isExpanded ? (
                            <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>Masquer</>
                          ) : (
                            <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>Afficher {hiddenCount} étudiant{hiddenCount > 1 ? 's' : ''}</>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                }
                const u = row.user;
                const rank = row.idx + 1;
                return (
                  <tr key={row.idx} className={`border-b last:border-0 transition-colors ${u.isUser ? 'bg-indigo-50/70 border-indigo-100' : 'border-gray-50 hover:bg-gray-50/50'}`} style={u.isUser ? { boxShadow: 'inset 3px 0 0 #4f46e5' } : undefined}>
                    <td className="py-2.5 px-4 text-center"><span className={`text-sm font-bold tabular-nums ${u.isUser ? 'text-indigo-700' : 'text-gray-500'}`}>{rank}</span></td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.name} isUser={u.isUser} size={30} />
                        <span className={`text-sm ${u.isUser ? 'text-indigo-700 font-bold' : 'text-gray-800 font-medium'}`}>{u.isUser ? 'Vous' : u.name}</span>
                        {u.isUser && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-md">TOI</span>}
                      </div>
                    </td>
                    <td className="py-2.5 px-4"><span className={`text-sm font-bold tabular-nums ${scoreClass(u.avg)}`}>{u.avg}%</span></td>
                    <td className="py-2.5 px-5 text-right text-sm text-gray-500 tabular-nums">{u.sessions}</td>
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