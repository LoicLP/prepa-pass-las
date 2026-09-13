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
import { downloadFichePdf } from '@/utils/fichePdf';
import BristolCard from '@/components/fiches/BristolCard';
import CoursBristol from '@/components/fiches/CoursBristol';
import { sanitizeHtml } from '@/utils/sanitize';
import { loadCoursForFiche } from '@/data/cours';
import { supabase } from '@/lib/supabase';
import { track } from '@/lib/track';
import { getProfile, momentFor, BAREMES, VOIES, facName, programFor, baremeById } from '@/lib/profile';
import { FACS, mccFor, facById } from '@/data/facs';
import { facExams, facCoeffs, fmtMinutes } from '@/data/facExams';
import { computeMastery } from '@/lib/mastery';
import { PROGRAMME_DATA } from '@/data/programme';
import { computeXP, gradeForXP, computeStreakWithJokers, questStatus, GRADES } from '@/lib/gamification';

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
];

/* ========== MAIN PAGE ========== */
/* Salutation adaptée au moment de la journée (même découpage que le dashboard CRFPA). */
function greetingForNow() {
  const h = new Date().getHours();
  if (h < 6) return 'Bonne nuit';
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export default function DashboardPage() {
  const { user, loading: authLoading, accessToken, logOut } = useAuth();
  const router = useRouter();
  const mainRef = useRef(null);
  const [activeSection, setActiveSection] = useState('overview');
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('section');
    if (s && ['overview', 'fiches', 'progression', 'objectifs', 'historique', 'account'].includes(s)) setActiveSection(s);
  }, []);
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

  const { isPremiumPlus, isPaid, tier, trialActive, trialEndsAt, trialDaysLeft } = usePremium();
  // Statut de l'essai affiché en en-tête tant que le compte ne paie pas (pattern CRFPA)
  const trialLabel = trialDaysLeft > 0 ? `Essai : ${trialDaysLeft}j restant${trialDaysLeft > 1 ? 's' : ''}` : 'Essai expiré';

  // Bandeau « essai terminé » : visible pendant 5 jours après l'expiration, refermable.
  // Initialisé masqué puis révélé après lecture du localStorage (évite le flash si déjà fermé).
  const [trialEndDismissed, setTrialEndDismissed] = useState(true);
  // Invitation à renseigner sa faculté (comptes créés avant le profil de révision) : refermable 30 jours.
  const [facNudgeDismissed, setFacNudgeDismissed] = useState(true);
  useEffect(() => {
    setTrialEndDismissed(localStorage.getItem('ppl-trial-ended-dismissed') === '1');
    const until = Number(localStorage.getItem('ppl-fac-nudge-until') || 0);
    setFacNudgeDismissed(until > Date.now());
  }, []);
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
  const profile = useMemo(() => getProfile(user), [user]);
  const coeffs = useMemo(() => facCoeffs(profile.fac), [profile.fac]);
  const prog = useMemo(() => programFor(profile), [profile]); // UE de la fac d'abord
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
    // Priorité : l'écart à 100 pondéré par le coefficient de la fac quand on le connaît
    const weightOf = (id) => (coeffs && coeffs[id]) || 1;
    const recommendations = [...withSessions].filter(s => prog.has(s.id))
      .sort((a, b) => (100 - b.avg) * weightOf(b.id) - (100 - a.avg) * weightOf(a.id))
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
  }, [allSessions, qcmStats.sessions, examStats.sessions, coeffs, prog]);

  // ---- Adaptation à l'étudiant : carte de maîtrise, moment du parcours ----
  const mastery = useMemo(() => computeMastery(qcmStats.sessions || [], profile.placement), [qcmStats.sessions, profile.placement]);
  const examDateStr = user?.user_metadata?.exam_date || null;
  const moment = useMemo(() => momentFor(examDateStr), [examDateStr]);
  const todaySubject = data.recommendations.length > 0 ? data.recommendations[0] : null;

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
  const totalTypeCount = data.qcmCount + data.examCount;


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
  ] : [];
  const onboardVisible = onboardOn && !onboardSteps.every(s => s.done);

  return (
    <div style={{ background: '#f6f5fb', height: '100vh', overflow: 'hidden' }}>

      {/* ===== OVERLAY EXAMEN EMBARQUÉ ===== */}
      {/* Sidebar visible pendant la sélection (left:120px sur desktop, largeur du rail), plein écran pendant l'épreuve. */}
      {activeExamen && (
        <div
          className={examImmersive ? 'left-0' : 'left-0 md:left-[120px]'}
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
      {/* Pendant la sélection (mode/matière/fiche/sujet), l'overlay laisse la sidebar visible sur desktop (left:120px).
          Pendant le quiz, il passe en plein écran immersif (left:0). */}
      {activeQCM && (
        <div
          className={qcmImmersive ? 'left-0' : 'left-0 md:left-[120px]'}
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
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
                  <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', margin: '2px 0 0' }}>Progression & Objectifs</p>
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
          onOpenFiches={(subjectId) => { if (activeQCM) closeQCM(); if (activeExamen) closeExamen(); setActiveFicheSubject(subjectId || null); setActiveSection('fiches'); }}
        />

        {/* ===== MAIN CONTENT ===== */}
        <main ref={mainRef} className="md:pt-[34px] md:px-9 pt-[72px] px-4 pb-[80px] md:pb-12" style={{ flex: 1, minWidth: 0, maxWidth: '100%', overflowY: 'auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>

          {/* GREETING — accueil uniquement. Mise en page CRFPA : date + actions sur une ligne, salutation en dessous */}
          {activeSection === 'overview' && (
          <div className="hidden md:flex" style={{ flexDirection: 'column', gap: 14, marginBottom: 14, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, paddingBottom: 4 }}>
              <span style={{ fontSize: 13, color: '#8a8ea8' }}>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Grade + progression XP (cliquable → popover explicatif). La série de jours
                  n'est plus affichée ici : elle reste visible dans le menu mobile et la Progression. */}
              <FacPill profile={profile} prog={prog} onEdit={() => setActiveSection('account')} />
              {data.hasAnySessions && <GradePill gam={gam} open={gradeOpen} setOpen={setGradeOpen} />}
              {!isPaid && (
                <>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: trialDaysLeft > 0 ? '#eef2ff' : '#fff1f2', border: `1px solid ${trialDaysLeft > 0 ? '#c7d2fe' : '#fecdd3'}`, borderRadius: 999, padding: '8px 14px', fontSize: 13, fontWeight: 800, color: trialDaysLeft > 0 ? '#4f46e5' : '#e11d48', whiteSpace: 'nowrap' }}>
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    {trialLabel}
                  </span>
                  <Link
                    href="/tarifs"
                    style={{ display: 'inline-flex', alignItems: 'center', background: '#0f1020', color: '#fff', borderRadius: 14, padding: '10px 18px', fontSize: 13.5, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' }}
                    className="hover:opacity-90 transition-opacity"
                  >
                    Devenir premium
                  </Link>
                </>
              )}
              </div>
            </div>
            <h1 className="font-jakarta" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, margin: 0, color: '#0f1020' }}>
              {greetingForNow()} {user.displayName ? user.displayName.split(' ')[0] : ''}
            </h1>
          </div>
          )}
          {/* Mobile greeting (compact) — accueil uniquement */}
          {activeSection === 'overview' && (
          <div className="md:hidden" style={{ marginBottom: 12, flexShrink: 0 }}>
            <p style={{ fontSize: 11, color: '#8a8ea8', marginBottom: 2, textTransform: 'capitalize' }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <h1 className="font-jakarta" style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.6, margin: 0, color: '#0f1020' }}>
                  {greetingForNow()} {user.displayName ? user.displayName.split(' ')[0] : ''} 👋
                </h1>
                <FacLine profile={profile} onEdit={() => setActiveSection('account')} compact />
              </div>
              {!isPaid && (
                <Link href="/tarifs" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: trialDaysLeft > 0 ? '#eef2ff' : '#fff1f2', border: `1px solid ${trialDaysLeft > 0 ? '#c7d2fe' : '#fecdd3'}`, borderRadius: 999, padding: '4px 9px', fontSize: 11, fontWeight: 800, color: trialDaysLeft > 0 ? '#4f46e5' : '#e11d48', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  ⏱ {trialDaysLeft > 0 ? `Essai : ${trialDaysLeft}j` : 'Essai expiré'}
                </Link>
              )}
              {data.hasAnySessions && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <GradePill gam={gam} open={gradeOpen} setOpen={setGradeOpen} compact />
                </div>
              )}
            </div>
          </div>
          )}

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
                        QCM illimités, examens blancs, progression, objectifs… tout est débloqué.
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
              {/* Faculté manquante : on ne peut pas appliquer le barème des MCC */}
              {!profile.fac && !facNudgeDismissed && (
                <div style={{ background: 'linear-gradient(to right, #eef2ff, #f5f3ff)', border: '1px solid #c7d2fe', borderRadius: 14, padding: '11px 15px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#4f46e5', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 15 }}>🎓</div>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f1020' }}>Dans quelle fac pr&eacute;pares-tu le concours ?</div>
                    <div style={{ fontSize: 11.5, color: '#5f6280' }}>On applique le bar&egrave;me de tes MCC &agrave; tes examens blancs et on adapte le style des questions. 30 secondes.</div>
                  </div>
                  <button onClick={() => { track('fac_nudge_click'); setActiveSection('account'); }} style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 9, padding: '8px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }} className="hover:bg-indigo-700 transition-colors">Renseigner ma facult&eacute; →</button>
                  <button onClick={() => { localStorage.setItem('ppl-fac-nudge-until', String(Date.now() + 30 * 86400000)); setFacNudgeDismissed(true); }} aria-label="Plus tard" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a8ea8', padding: 3, display: 'flex', flexShrink: 0 }} className="hover:text-gray-600">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}
              {/* Parcours vers le concours */}
              <ConcoursPath examDate={user.user_metadata?.exam_date || null} facId={profile.fac} />
              <ActionHub
                moment={moment}
                onLaunchMoment={(m) => {
                  if (m === 'veille') { const s = SUBJECTS.find(x => x.id === mastery.strongest) || SUBJECTS[0]; return openQCM({ type: 'custom', subject: s.id, subjectName: s.name, title: `Points clés · ${s.name}`, count: 8, flash: true }); }
                  const w = SUBJECTS.find(x => x.id === mastery.weakest) || SUBJECTS[0]; return openQCM({ type: 'custom', subject: w.id, subjectName: w.name, title: `Rebond · ${w.name}`, count: 8 });
                }}
                todaySubject={todaySubject}
                reviewDue={reviewDue}
                subjects={prog.subjects}
                onLaunchQCM={setActiveQCM}
                onLaunchExamen={() => openExamen()}
                onOpenFiches={() => { setActiveFicheSubject(null); setActiveSection('fiches'); }}
                onLaunchReview={launchReview}
                quests={gam.quests}
                showQuests={data.hasAnySessions}
              />
              {/* Contact bas de page — lien discret, masqué sur mobile */}
              <Link href="/contact" style={{ flexShrink: 0, marginTop: 4, textDecoration: 'none' }} className="hidden md:flex items-center justify-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10.5h8M8 14h5m-9 5.5 3.5-3H18a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v13z" /></svg>
                <span style={{ fontSize: 12.5 }}>Un bug ou une suggestion ? <span style={{ color: '#7c3aed', fontWeight: 600 }}>Signale-le</span></span>
              </Link>
            </div>
          )}

          {/* Sections non-overview */}
          {/* Hauteur naturelle (pas de flex-1/min-h-0) : sinon le contenu déborde de la boîte et
              le padding bas de <main> tombe avant la fin des cartes. */}
          <div className={activeSection !== 'overview' ? 'space-y-6 pb-10' : 'hidden'}>

            {/* ===== FICHES & COURS ===== */}
            {activeSection === 'fiches' && (
              <FichesSection initialSubject={activeFicheSubject} onLaunchQCM={setActiveQCM} subjectOrder={[...prog.subjects, ...prog.others].map(s => s.id)} />
            )}

            {/* ===== HISTORIQUE ===== */}
            {/* ===== HISTORIQUE ===== */}
            {activeSection === 'historique' && (() => {
              const pctOf = (s) => Number.isFinite(s.percentage) ? s.percentage : (s.total > 0 ? Math.round((s.correct / s.total) * 100) : null);
              const valid = filteredHistory.map(pctOf).filter(x => x != null);
              const avg = valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 0;
              const totalSec = filteredHistory.reduce((a, s) => a + (s.duration || 0), 0);
              const fmtTot = (sec) => { if (!sec) return null; const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60); return h ? `${h}h${m ? String(m).padStart(2, '0') : ''}` : `${m} min`; };
              const relDate = (iso) => { if (!iso) return '—'; const d = new Date(iso), now = new Date(); const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()), nn = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const diff = Math.round((nn - dd) / 86400000); if (diff === 0) return "Aujourd'hui"; if (diff === 1) return 'Hier'; if (diff < 7) return d.toLocaleDateString('fr-FR', { weekday: 'long' }); return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); };
              const timeOf = (iso) => { try { return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
              return (
              <div>
                <SectionHeader
                  lead="Ton" word="historique"
                  chips={[
                    { label: `${allSessions.length} session${allSessions.length > 1 ? 's' : ''}` },
                    valid.length > 0 && { label: `${avg}% de moyenne` },
                    fmtTot(totalSec) && { label: `${fmtTot(totalSec)} d'entraînement`, tone: 'amber' },
                  ]}
                />
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ borderTopWidth: 3, borderTopColor: '#4f46e5' }}>
                  <div className="p-6 pb-4">
                    <SegmentedPills
                      value={historyFilter} onChange={setHistoryFilter}
                      options={[
                        { key: 'all', label: `Tout (${allSessions.length})` },
                        { key: 'qcm', label: `QCM (${data.qcmCount})` },
                        { key: 'examen', label: `Examens (${data.examCount})` },
                      ]}
                    />
                  </div>
                  {filteredHistory.length === 0 ? (
                    <div className="px-6 pb-6">
                      <EmptyState title="Aucune session" description="Aucune session trouvée pour ce filtre." onCta={() => openQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })} ctaLabel="Commencer un QCM" />
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                              {['Date', 'Type', 'Session', 'Score'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>)}
                              <th className="text-right py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Durée</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredHistory.slice(0, visibleCount).map((s, i) => {
                              const colors = getSubjectBadgeColors(s.subject);
                              const pct = pctOf(s);
                              const name = s.subjectName || getSubjectName(s.subject);
                              const hasTopic = s.topic && s.topic !== name;
                              return (
                                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-indigo-50/40 transition-colors">
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">{relDate(s.date)}</div>
                                    <div className="text-[11px] text-gray-400 tabular-nums">{timeOf(s.date)}</div>
                                  </td>
                                  <td className="py-3 px-4"><span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${TYPE_BADGE[s._type] || TYPE_BADGE.QCM}`}>{s._type}</span></td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>{name}</span>
                                    {hasTopic && <div className="text-[11px] text-gray-400 mt-1 truncate max-w-[220px]">{s.topic}</div>}
                                  </td>
                                  <td className="py-3 px-4">
                                    {pct == null ? <span className="text-sm text-gray-300">&mdash;</span> : (
                                      <div className="flex items-center gap-2">
                                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden shrink-0"><div className={`h-full rounded-full ${scoreBarClass(pct)}`} style={{ width: `${pct}%` }} /></div>
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
                          <button onClick={() => setVisibleCount(v => v + 10)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:border-indigo-200 hover:text-indigo-600 transition-colors">
                            Voir plus ({Math.min(visibleCount + 10, filteredHistory.length)} / {filteredHistory.length})
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              );
            })()}

            {/* ===== PROGRESSION (Premium) ===== */}
            {activeSection === 'progression' && (
              <PremiumBlurGate locked={!isPremiumPlus} title="Progression détaillée" description="Visualise ta courbe de progression, tes points forts et tes axes d'amélioration.">
                <div>
                  <SectionHeader
                    lead="Ton" word="relevé de notes"
                    chips={[
                      { label: `${data.totalSessions} session${data.totalSessions > 1 ? 's' : ''}` },
                      data.hasAnySessions && { label: `${data.avgScore}% de moyenne` },
                      data.hasAnySessions && data.trend === 'up' && { label: '↑ En progression', tone: 'emerald' },
                      data.hasAnySessions && data.trend === 'down' && { label: '↓ En baisse', tone: 'red' },
                      data.hasAnySessions && data.trend === 'stable' && { label: '→ Stable', tone: 'amber' },
                    ]}
                  />
                  {!data.hasAnySessions || data.last20.length < 2 ? (
                    <EmptyState title="Pas assez de donn&eacute;es" description="Effectue plusieurs sessions pour voir ta progression." onCta={() => openQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })} ctaLabel="Commencer un QCM" />
                  ) : (() => {
                    const filterSubjects = Object.values(data.subjectStats).filter(s => s.count > 0).sort((a, b) => b.avg - a.avg);
                    // Deux colonnes disjointes : la moitié haute du classement en points forts,
                    // la moitié basse (du plus faible au moins faible) à améliorer.
                    const half = Math.ceil(filterSubjects.length / 2);
                    const strengths = filterSubjects.slice(0, Math.min(3, half));
                    const toImprove = filterSubjects.slice(half).reverse().slice(0, 3);
                    const w = data.weaknesses[0];
                    return (
                    <div className="space-y-5">
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" style={{ borderTopWidth: 3, borderTopColor: '#4f46e5' }}>
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                          <h3 className="font-jakarta text-base font-bold text-gray-900 flex items-center gap-2"><svg width="26" height="14" viewBox="0 0 52 20" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"><path d="M0 12h9l3-7 5 14 5-16 4 9h9l2-3 3 3h12" /></svg>&Eacute;volution des scores</h3>
                          {filterSubjects.length > 1 && (
                            <SegmentedPills value={progSubject} onChange={setProgSubject} options={[{ key: 'all', label: 'Toutes' }, ...filterSubjects.map(s => ({ key: s.id, label: s.name }))]} />
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-3">Une session par point, sur papier millimétr&eacute; : un petit carreau vaut 5 %. Le pointill&eacute; rouge marque ton seuil, la note sur 20 se lit &agrave; droite.</p>
                        <ScoreLineChart points={chartData} target={data.targetScore} />
                        {progSubject === 'all' && data.last5Avg !== null && data.prev5Avg !== null && (
                          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-1.5 text-sm"><span className="text-gray-500">5 derni&egrave;res :</span><span className={`font-bold ${scoreClass(data.last5Avg)}`}>{data.last5Avg}%</span></div>
                            <div className="flex items-center gap-1.5 text-sm"><span className="text-gray-500">5 pr&eacute;c&eacute;dentes :</span><span className={`font-bold ${scoreClass(data.prev5Avg)}`}>{data.prev5Avg}%</span></div>
                            <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${data.last5Avg >= data.prev5Avg ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                              {data.last5Avg >= data.prev5Avg ? '+' : ''}{data.last5Avg - data.prev5Avg} pts
                            </span>
                          </div>
                        )}
                      </div>

                      <Bulletin data={data} coeffs={coeffs} prog={prog} profile={profile} user={user} onWork={(sub) => openQCM({ type: 'custom', subject: sub.id, subjectName: sub.name, title: sub.name, count: 10 })} />

                      {(() => {
                        const agg = (qcmStats.sessions || []).reduce((a, s) => { if (s.errNature) { a.lecture += s.errNature.lecture || 0; a.connaissance += s.errNature.connaissance || 0; a.idk += s.errNature.idk || 0; a.n += 1; } return a; }, { lecture: 0, connaissance: 0, idk: 0, n: 0 });
                        const tot = agg.lecture + agg.connaissance + agg.idk;
                        if (!tot) return null;
                        const pctL = Math.round(agg.lecture / tot * 100), pctC = Math.round(agg.connaissance / tot * 100), pctI = 100 - pctL - pctC;
                        const advice = pctL >= 35 ? 'Une erreur sur trois vient d’une lecture trop rapide : relis chaque proposition en cherchant la négation ou l’unité avant de répondre.' : pctI >= 35 ? 'Beaucoup de « je ne sais pas » : c’est honnête et utile — ce sont des chapitres à lire avant de les rejouer, pas des pièges.' : 'Tes erreurs sont surtout des notions à revoir : la pile « À consolider » est faite pour ça.';
                        return (
                          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-jakarta text-base font-bold text-gray-900 mb-1">Tes erreurs, par nature</h3>
                            <p className="text-xs text-gray-400 mb-4">Sur {agg.n} session{agg.n > 1 ? 's' : ''} chronom&eacute;tr&eacute;e{agg.n > 1 ? 's' : ''} par question.</p>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              {[['Lecture', pctL, 'réponse rapide et fausse', 'text-amber-600', 'bg-amber-50'], ['Connaissance', pctC, 'fausse au rythme normal', 'text-rose-600', 'bg-rose-50'], ['Non su', pctI, '« je ne sais pas »', 'text-slate-600', 'bg-slate-100']].map(([l, v, d, tc, bc]) => (
                                <div key={l} className={`rounded-xl p-3 text-center ${bc}`}><p className={`font-jakarta text-2xl font-black ${tc}`}>{v} %</p><p className="text-xs font-semibold text-gray-800 mt-0.5">{l}</p><p className="text-[11px] text-gray-400">{d}</p></div>
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">{advice}</p>
                          </div>
                        );
                      })()}
                    </div>
                    );
                  })()}
                </div>
              </PremiumBlurGate>
            )}

            {/* ===== OBJECTIFS (Premium) ===== */}
            {activeSection === 'objectifs' && (
              <PremiumBlurGate locked={!isPremiumPlus} title="Objectifs & Statistiques" description="Suis tes objectifs hebdomadaires et visualise la répartition de tes sessions.">
                {(() => {
                  const streak = gam.streakInfo.streak;
                  const record = Math.max(data.bestStreak || 0, streak);
                  const weekMins = Math.round((data.thisWeekTime || 0) / 60);
                  const lastWeekMins = Math.round((data.lastWeekTime || 0) / 60);
                  const fmtMin = (m) => m >= 60 ? `${Math.floor(m / 60)}h${m % 60 > 0 ? String(m % 60).padStart(2, '0') : ''}` : `${m} min`;
                  const subjects = Object.values(data.subjectStats).filter(s => s.count > 0).sort((a, b) => b.avg - a.avg);
                  const goals = [
                    { label: 'Sessions réalisées', color: '#4f46e5', bg: '#eef2ff', value: data.thisWeekSessions, target: weeklyGoals.sessions, display: `${data.thisWeekSessions}/${weeklyGoals.sessions}`,
                      icon: <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /> },
                    { label: "Temps d'étude", color: '#f59e0b', bg: '#fef3c7', value: weekMins, target: weeklyGoals.timeMin, display: `${fmtMin(weekMins)} / ${fmtMin(weeklyGoals.timeMin)}`,
                      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
                    { label: 'Jours actifs', color: '#10b981', bg: '#d1fae5', value: data.thisWeekActiveDays, target: weeklyGoals.days, display: `${data.thisWeekActiveDays}/${weeklyGoals.days}`,
                      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /> },
                  ];
                  return (
                  <div>
                    <PencilDefs />
                    <SectionHeader
                      lead="Ton" word="carnet de la semaine"
                      chips={[
                        { label: `${data.thisWeekSessions} session${data.thisWeekSessions > 1 ? 's' : ''} cette semaine` },
                        streak > 0 && { label: `🔥 ${streak} jour${streak > 1 ? 's' : ''} d'affilée`, tone: 'amber' },
                      ]}
                    />
                    {!data.hasAnySessions ? (
                      <EmptyState title="Aucune donn&eacute;e" description="Effectue des sessions pour voir tes objectifs." onCta={() => openQCM({ initialView: 'modeChoice', subjectName: 'QCM', title: 'QCM' })} ctaLabel="Commencer un QCM" />
                    ) : (
                    <div className="space-y-5">
                      {/* Objectifs de la semaine : fiche de suivi tamponnée */}
                      {(() => { const pcts = goals.map(g => Math.min(100, Math.round((g.value / g.target) * 100))); const weekPct = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length); const allDone = pcts.every(x => x >= 100); return (
                      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7f0', boxShadow: '0 2px 6px rgba(15,16,32,0.04)' }}>
                       <div style={{ margin: 10, border: '1px solid #c7c9dc', outline: '1px solid #e9eaf3', outlineOffset: 3, borderRadius: 10, padding: '20px 24px 18px' }}>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <p style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: '#8a8ea8', margin: 0 }}>Fiche de suivi · semaine en cours</p>
                            <h3 className="font-jakarta text-base font-bold text-gray-900" style={{ marginTop: 4 }}>Objectifs de la semaine</h3>
                          </div>
                          <div className="flex items-center gap-3">
                            <Stamp top={allDone ? 'Semaine' : 'Avancement'} big={allDone ? '✓' : `${weekPct} %`} sub={allDone ? 'validée' : 'des objectifs'} color={allDone ? '#15803d' : '#4f46e5'} size={92} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span style={{ fontSize: 11, color: '#8a8ea8' }}>Coche-les au fil de la semaine : chaque session compte.</span>
                          {!editGoals && (
                            <button onClick={openEditGoals} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600 transition-colors">
                              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                              Modifier
                            </button>
                          )}
                        </div>
                        {editGoals ? (
                          <div className="space-y-2.5">
                            {[
                              { key: 'sessions', label: 'Sessions', min: 1, max: 50, step: 1, fmt: (v) => `${v}` },
                              { key: 'timeMin', label: "Temps d'étude", min: 30, max: 600, step: 30, fmt: (v) => fmtMin(v) },
                              { key: 'days', label: 'Jours actifs', min: 1, max: 7, step: 1, fmt: (v) => `${v}` },
                            ].map(f => (
                              <div key={f.key} className="flex items-center justify-between gap-3 py-1">
                                <span className="text-[13px] text-gray-700 font-medium">{f.label} <span className="text-gray-400">/ semaine</span></span>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setGoalsDraft(d => ({ ...d, [f.key]: Math.max(f.min, (d[f.key] || f.min) - f.step) }))} className="w-8 h-8 rounded-full border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors font-bold">−</button>
                                  <span className="w-16 text-center text-sm font-bold text-gray-900 tabular-nums">{f.fmt(goalsDraft[f.key])}</span>
                                  <button onClick={() => setGoalsDraft(d => ({ ...d, [f.key]: Math.min(f.max, (d[f.key] || f.min) + f.step) }))} className="w-8 h-8 rounded-full border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors font-bold">+</button>
                                </div>
                              </div>
                            ))}
                            <div className="flex gap-2 pt-2">
                              <button onClick={saveWeeklyGoals} disabled={goalsSaving} className="flex-1 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition-colors">{goalsSaving ? 'Enregistrement…' : 'Enregistrer'}</button>
                              <button onClick={() => setEditGoals(false)} className="px-4 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">Annuler</button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-5">
                            {goals.map(goal => {
                              const pct = Math.min(100, Math.round((goal.value / goal.target) * 100));
                              const done = pct >= 100;
                              return (
                                <div key={goal.label}>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2.5">
                                      <PencilCheck done={done} />
                                      <span className={`text-sm font-semibold ${done ? 'text-gray-500 line-through decoration-gray-400' : 'text-gray-800'}`}>{goal.label}</span>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 text-sm font-bold ${done ? 'text-emerald-600' : 'text-gray-900'}`}>
                                      {goal.display}
                                      {done && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                                    </span>
                                  </div>
                                  <PencilBar pct={pct} done={done} />
                                </div>
                              );
                            })}
                          </div>
                        )}
                       </div>
                      </div>
                      ); })()}

                      {/* Régularité */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-jakarta text-base font-bold text-gray-900 mb-4">R&eacute;gularit&eacute;</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: '#fbfbff', border: '1px solid #e5e7f0' }}>
                            <Stamp top="Série" big={String(streak)} sub={`jour${streak > 1 ? 's' : ''} d'affilée`} color="#b45309" size={92} rotate={-6} />
                            <div>
                              <p className="text-sm font-bold text-gray-900">Assiduit&eacute;</p>
                              <p className="text-xs text-gray-500 mt-0.5">Record : {record} jour{record > 1 ? 's' : ''}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Une session par jour suffit &agrave; garder la s&eacute;rie.</p>
                            </div>
                          </div>
                          <div className="rounded-xl p-4" style={{ background: '#fbfbff', border: '1px solid #e5e7f0' }}>
                            <p className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400">Temps de travail</p>
                            <p className="font-jakarta text-3xl font-black text-gray-900 mt-1">{fmtMin(weekMins)}</p>
                            <p className="text-xs font-semibold text-gray-600 mt-1">Cette semaine</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {lastWeekMins > 0 ? (weekMins >= lastWeekMins ? `+${fmtMin(weekMins - lastWeekMins)} vs semaine dernière` : `${fmtMin(weekMins)} sur ${fmtMin(lastWeekMins)} la semaine dernière`) : 'Première semaine mesurée'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Objectif score + Répartition */}
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                          <h3 className="font-jakarta text-base font-bold text-gray-900 mb-4">Objectif score</h3>
                          <div className="flex items-center gap-6">
                            <PencilRing segments={[{ pct: Math.min(100, Math.round((data.overallAvg / Math.max(1, data.targetScore)) * 100)), color: data.overallAvg >= data.targetScore ? '#15803d' : '#4f46e5' }]} center={`${Math.round((data.overallAvg / 100) * 20 * 10) / 10}`.replace('.', ',')} sub="/ 20" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900">Moyenne : {data.overallAvg} %</p>
                              <p className="text-sm text-gray-500">Palier vis&eacute; : <span className="font-semibold" style={{ color: '#dc2626' }}>{data.targetScore} %</span> <span className="text-gray-400">({(Math.round((data.targetScore / 100) * 20 * 10) / 10).toString().replace('.', ',')}/20)</span></p>
                              <p className="text-xs text-gray-400 mt-1.5">Le palier progresse avec toi : atteins-le pour en d&eacute;bloquer un nouveau.</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                          <h3 className="font-jakarta text-base font-bold text-gray-900 mb-4">R&eacute;partition des sessions</h3>
                          <div className="flex items-center gap-6">
                            <PencilRing segments={segments.map(seg => ({ pct: totalTypeCount > 0 ? (seg.count / totalTypeCount) * 100 : 0, color: seg.color }))} center={totalTypeCount} sub="sessions" />
                            <div className="space-y-2">
                              {segments.map(seg => (
                                <div key={seg.label} className="flex items-center gap-2">
                                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0"><rect x="1.5" y="1.5" width="11" height="11" rx="2" fill={seg.color} opacity="0.85" filter="url(#pencilG)" /></svg>
                                  <span className="text-sm text-gray-700">{seg.label}</span>
                                  <span className="text-sm font-bold text-gray-900 tabular-nums">{seg.count}</span>
                                  <span className="text-xs text-gray-400 tabular-nums">({totalTypeCount > 0 ? Math.round((seg.count / totalTypeCount) * 100) : 0}%)</span>
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
                            <h3 className="font-jakarta text-base font-bold text-gray-900">Ma&icirc;trise par mati&egrave;re</h3>
                            <span className="text-[11px] text-gray-400 flex items-center gap-1.5"><span className="w-3 h-0.5 inline-block" style={{ borderTop: '2px dashed #dc2626' }}></span> seuil vis&eacute; 70 %</span>
                          </div>
                          <div className="space-y-3.5">
                            {subjects.map(s => (
                              <div key={s.id} className="flex items-center gap-3">
                                <span className="w-28 sm:w-36 shrink-0 text-[13px] font-semibold text-gray-800 truncate">{s.name}</span>
                                <div className="flex-1"><PencilBar pct={s.avg} done={s.avg >= 70} seuil={70} height={12} /></div>
                                <span className={`w-11 text-right text-sm font-bold tabular-nums ${scoreClass(s.avg)}`}>{s.avg}%</span>
                                <span className="w-20 text-right text-[11px] text-gray-400 tabular-nums hidden sm:block">record {s.bestScore}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    )}
                  </div>
                  );
                })()}
              </PremiumBlurGate>
            )}


            {/* ===== MON COMPTE ===== */}
            {activeSection === 'account' && (
              <AccountSection user={user} tier={tier} isPremiumPlus={isPremiumPlus} accessToken={accessToken} />
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
function ConcoursPath({ examDate, facId = null }) {
  /* Édition de la date directement dans la carte. La sauvegarde passe par
     supabase.auth.updateUser : l'AuthContext reçoit USER_UPDATED et `examDate`
     se met à jour tout seul, sans rechargement. */
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const openEditor = () => { setDraft(examDate || ''); setError(null); setEditing(true); };
  const saveDate = async () => {
    if (!draft || !supabase) return;
    setSaving(true); setError(null);
    const { error: err } = await supabase.auth.updateUser({ data: { exam_date: draft } });
    setSaving(false);
    if (err) setError(err.message); else setEditing(false);
  };

  const facDates = facExams(facId)?.dates || null;
  const facLabel = facById(facId)?.city || facById(facId)?.name || null;
  const suggestions = (facDates ? [['S1', facDates.s1], ['S2', facDates.s2]] : [['S1', PICO_CONCOURS_DATES[0]], ['S2', PICO_CONCOURS_DATES[1]]])
    .filter(([, d]) => d && new Date(d) >= new Date())
    .map(([k, d]) => ({ k, d, label: new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) }));
  const pickDate = async (d) => { if (!supabase) return; setSaving(true); const { error: err } = await supabase.auth.updateUser({ data: { exam_date: d } }); setSaving(false); if (err) setError(err.message); else setEditing(false); };
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
        {editing ? (
          <form onSubmit={(e) => { e.preventDefault(); saveDate(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <input
              type="date"
              value={draft}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              style={{ fontSize: 11.5, padding: '4px 8px', border: '1px solid #c7d2fe', borderRadius: 8, color: '#0f1020', background: '#fff', outline: 'none' }}
            />
            <button type="submit" disabled={saving || !draft} style={{ fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 8, border: 'none', background: '#4f46e5', color: '#fff', cursor: saving || !draft ? 'default' : 'pointer', opacity: saving || !draft ? 0.6 : 1 }}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button type="button" onClick={() => setEditing(false)} style={{ fontSize: 11, fontWeight: 600, padding: '5px 8px', borderRadius: 8, border: 'none', background: 'none', color: '#8a8ea8', cursor: 'pointer' }}>
              Annuler
            </button>
            {error && <span style={{ fontSize: 10.5, color: '#dc2626', width: '100%', textAlign: 'right' }}>{error}</span>}
          </form>
        ) : examDate ? (
          <span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#0f1020' }}>Le concours</span>
            <span style={{ fontSize: 10.5, color: '#8a8ea8', marginLeft: 6 }}>{dateLabel}</span>
            <button onClick={openEditor} title="Modifier la date du concours" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 6px', fontSize: 10.5, color: '#7c3aed', fontWeight: 700 }} className="hover:underline">modifier</button>
          </span>
        ) : suggestions.length ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 10.5, color: '#8a8ea8' }}>{facLabel ? `Partiels à ${facLabel}${facDates?.approx ? ' (d’après 2025-2026)' : ''} :` : 'Partiels :'}</span>
            {suggestions.map(sg => (
              <button key={sg.d} onClick={() => pickDate(sg.d)} disabled={saving} style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4f46e5', cursor: 'pointer' }} className="hover:bg-indigo-100">{sg.k} · {sg.label}</button>
            ))}
            <button onClick={openEditor} title="Autre date" style={{ fontSize: 11, fontWeight: 600, background: 'none', border: 'none', color: '#8a8ea8', cursor: 'pointer', padding: 0 }} className="hover:text-indigo-600">autre…</button>
          </span>
        ) : (
          <button onClick={openEditor} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 11, fontWeight: 700, color: '#7c3aed' }} className="hover:underline">
            📅 Ajoute ta date de concours →
          </button>
        )}
      </div>
    </div>
  );
}

/* Éléments « au crayon » partagés par Objectifs : filtres et hachures définis une fois par section. */
function PencilDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="pencilG" x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id="hatchG" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#3b3a4f" strokeWidth="1" opacity="0.45" />
        </pattern>
        <pattern id="hatchRed" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#dc2626" strokeWidth="1" opacity="0.5" />
        </pattern>
        <pattern id="hatchGreen" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#15803d" strokeWidth="1" opacity="0.55" />
        </pattern>
      </defs>
    </svg>
  );
}
/* Barre de progression hachurée au crayon, sur une règle millimétrée ; `seuil` trace un repère rouge. */
function PencilBar({ pct, done = false, seuil = null, height = 14 }) {
  const w = 300; const p = Math.max(0, Math.min(100, pct));
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }} aria-hidden="true">
      <rect x="0.5" y="0.5" width={w - 1} height={height - 1} rx="2" fill="#fbfbff" stroke="#c7cbe8" strokeWidth="1" />
      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(t => <line key={t} x1={(w * t) / 100} y1="1" x2={(w * t) / 100} y2={height - 1} stroke="#c7cbe8" strokeWidth={t % 50 === 0 ? 1 : 0.5} opacity="0.7" />)}
      {p > 0 && <rect x="1" y="1" width={(w * p) / 100 - 1} height={height - 2} fill={done ? 'url(#hatchGreen)' : 'url(#hatchG)'} filter="url(#pencilG)" />}
      {p > 0 && <line x1={(w * p) / 100} y1="0" x2={(w * p) / 100} y2={height} stroke={done ? '#15803d' : '#3b3a4f'} strokeWidth="1.6" filter="url(#pencilG)" />}
      {seuil != null && <line x1={(w * seuil) / 100} y1="-1" x2={(w * seuil) / 100} y2={height + 1} stroke="#dc2626" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.8" filter="url(#pencilG)" />}
    </svg>
  );
}
/* Anneau tracé au crayon : `segments` = [{pct, color}] (cumul ≤ 100). Le centre affiche `center`. */
function PencilRing({ segments, center, sub, size = 96 }) {
  const r = 38; const c = 2 * Math.PI * r; let acc = 0;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#c7cbe8" strokeWidth="9" strokeDasharray="1.5 2.5" opacity="0.8" />
        {segments.filter(sg => sg.pct > 0).map((sg, i) => {
          const len = (Math.min(100, sg.pct) / 100) * c; const off = -(acc / 100) * c; acc += sg.pct;
          return <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={sg.color} strokeWidth="8" strokeLinecap={segments.length > 1 ? 'butt' : 'round'} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={off} transform="rotate(-90 50 50)" filter="url(#pencilG)" opacity="0.9" />;
        })}
        <circle cx="50" cy="50" r={r - 7} fill="none" stroke="#3b3a4f" strokeWidth="0.8" opacity="0.35" filter="url(#pencilG)" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <span className="font-jakarta" style={{ fontSize: size * 0.2, fontWeight: 900, color: '#0f1020', lineHeight: 1 }}>{center}</span>
        {sub && <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8a8ea8', marginTop: 3 }}>{sub}</span>}
      </div>
    </div>
  );
}
/* Case à cocher tracée à la main. */
function PencilCheck({ done }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="2.5" y="2.5" width="15" height="15" rx="2" fill={done ? '#f0fdf4' : '#fff'} stroke="#3b3a4f" strokeWidth="1.4" filter="url(#pencilG)" />
      {done && <path d="M5 10.5 8.5 14 15.5 6" fill="none" stroke="#15803d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" filter="url(#pencilG)" />}
    </svg>
  );
}
/* Tampon rond incliné (moyenne, série…). */
function Stamp({ top, big, sub, color = '#4f46e5', size = 104, rotate = -8 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, transform: `rotate(${rotate}deg)` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `3px double ${color}`, opacity: 0.85 }} />
      <div style={{ position: 'absolute', inset: 7, borderRadius: '50%', border: `1px dashed ${color}`, opacity: 0.7 }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color, textAlign: 'center', padding: 10 }}>
        {top && <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>{top}</span>}
        <span className="font-jakarta" style={{ fontSize: size * 0.24, fontWeight: 900, lineHeight: 1.05, letterSpacing: -0.5 }}>{big}</span>
        {sub && <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>{sub}</span>}
      </div>
    </div>
  );
}

/* Bulletin de notes façon relevé universitaire : en-tête tamponné, table des UE avec note /20,
   coefficient (de la fac quand on le connaît), appréciation et moyenne pondérée. */
const NOTE20 = (pct) => Math.round(pct * 2) / 10;
const APPRECIATION = (n) => (n >= 16 ? ['Très bien', '#065f46', '#d1fae5'] : n >= 14 ? ['Bien', '#047857', '#ecfdf5'] : n >= 12 ? ['Assez bien', '#1d4ed8', '#eff6ff'] : n >= 10 ? ['Passable', '#b45309', '#fffbeb'] : ['À renforcer', '#b91c1c', '#fef2f2']);
function Bulletin({ data, coeffs, prog, profile, user, onWork }) {
  const fac = facById(profile?.fac);
  const subjects = prog?.known ? prog.subjects : SUBJECTS;
  const rows = subjects.map(sub => {
    const st = data.subjectStats[sub.id];
    const coeff = (coeffs && coeffs[sub.id]) || PROGRAMME_DATA.find(u => u.id === sub.id)?.coeff || 3;
    return { ...sub, coeff, st, note: st?.count > 0 ? NOTE20(st.avg) : null };
  });
  const graded = rows.filter(r => r.note != null);
  const weighted = graded.length ? Math.round((graded.reduce((a, r) => a + r.note * r.coeff, 0) / graded.reduce((a, r) => a + r.coeff, 0)) * 10) / 10 : null;
  const best = graded.length ? [...graded].sort((a, b) => b.note - a.note)[0] : null;
  const weak = graded.length > 1 ? [...graded].sort((a, b) => a.note - b.note)[0] : null;
  const mention = weighted != null ? APPRECIATION(weighted) : null;
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const name = user?.displayName || user?.email?.split('@')[0] || 'Étudiant';
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7f0', boxShadow: '0 2px 6px rgba(15,16,32,0.04)', overflow: 'hidden' }}>
      {/* cadre « document officiel » */}
      <div style={{ margin: 10, border: '1px solid #c7c9dc', outline: '1px solid #e9eaf3', outlineOffset: 3, borderRadius: 10, padding: '22px 26px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 18 }}>
          <div>
            <p style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: '#8a8ea8', margin: 0 }}>Prépa PASS/LAS · Relevé de notes</p>
            <h3 className="font-jakarta" style={{ fontSize: 20, fontWeight: 800, color: '#0f1020', margin: '4px 0 2px', letterSpacing: -0.4 }}>{name}</h3>
            <p style={{ fontSize: 12.5, color: '#5f6280', margin: 0 }}>{fac ? fac.name : 'Faculté non renseignée'}{profile?.voie ? ` · ${profile.voie.toUpperCase()}` : ''} · établi le {today}</p>
          </div>
          {/* tampon */}
          <div style={{ position: 'relative', width: 118, height: 118, flexShrink: 0, transform: 'rotate(-8deg)' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px double #4f46e5', opacity: 0.85 }} />
            <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '1px dashed #4f46e5', opacity: 0.7 }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
              <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>Moyenne</span>
              <span className="font-jakarta" style={{ fontSize: 28, fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>{weighted != null ? String(weighted).replace('.', ',') : '—'}</span>
              <span style={{ fontSize: 9, fontWeight: 700 }}>/ 20 pondérée</span>
              {mention && <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginTop: 3 }}>{mention[0]}</span>}
            </div>
          </div>
        </div>

        {/* table des UE */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8a8ea8', borderBottom: '2px solid #0f1020' }}>
                <th style={{ textAlign: 'left', padding: '6px 8px 8px 0' }}>Unité d’enseignement</th>
                <th style={{ textAlign: 'center', padding: '6px 8px 8px' }}>Coef.</th>
                <th style={{ textAlign: 'center', padding: '6px 8px 8px' }}>Sessions</th>
                <th style={{ textAlign: 'right', padding: '6px 8px 8px' }}>Note</th>
                <th style={{ textAlign: 'left', padding: '6px 0 8px 12px', minWidth: 120 }}>Appréciation</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const app = r.note != null ? APPRECIATION(r.note) : null;
                return (
                  <tr key={r.id} style={{ borderBottom: '1px dashed #e5e7f0' }}>
                    <td style={{ padding: '9px 8px 9px 0' }}>
                      <div style={{ fontWeight: 700, color: '#0f1020' }}>{r.name}</div>
                      {r.facLabel && <div style={{ fontSize: 11, color: '#8a8ea8' }}>{r.facLabel}</div>}
                    </td>
                    <td style={{ textAlign: 'center', padding: '9px 8px', color: '#5f6280', fontVariantNumeric: 'tabular-nums' }}>{r.coeff}</td>
                    <td style={{ textAlign: 'center', padding: '9px 8px', color: '#5f6280', fontVariantNumeric: 'tabular-nums' }}>{r.st?.count || 0}</td>
                    <td style={{ textAlign: 'right', padding: '9px 8px', fontVariantNumeric: 'tabular-nums' }}>
                      {r.note != null ? <><span className="font-jakarta" style={{ fontSize: 16, fontWeight: 800, color: '#0f1020' }}>{String(r.note).replace('.', ',')}</span><span style={{ fontSize: 11, color: '#8a8ea8' }}> /20</span></> : <span style={{ color: '#c3c5d5' }}>—</span>}
                    </td>
                    <td style={{ padding: '9px 0 9px 12px' }}>
                      {app ? <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, color: app[1], background: app[2], borderRadius: 6, padding: '3px 8px' }}>{app[0]}</span> : <button onClick={() => onWork(r)} style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} className="hover:underline">Commencer →</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* observations */}
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '2px solid #0f1020', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <p style={{ fontSize: 12.5, color: '#5f6280', margin: 0 }}>
            <strong style={{ color: '#0f1020' }}>Observations :</strong>{' '}
            {graded.length === 0 ? 'aucune note pour l’instant, lance une session pour remplir ton relevé.' : <>{best ? <>point fort en <strong style={{ color: '#0f1020' }}>{best.name}</strong>{' '}({String(best.note).replace('.', ',')}/20)</> : null}{weak ? <>, à renforcer en <strong style={{ color: '#0f1020' }}>{weak.name}</strong> ({String(weak.note).replace('.', ',')}/20)</> : null}. {coeffs ? 'Coefficients de ta fac.' : 'Coefficients indicatifs du tronc commun.'}</>}
          </p>
          {weak && (
            <button onClick={() => onWork(weak)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0f1020', color: '#fff', border: 'none', borderRadius: 999, padding: '8px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }} className="hover:bg-gray-800 transition-colors">Travailler {weak.name} →</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* Pastille « Ta fac » dans l'en-tête : nom court, détails au clic ou au survol. */
function FacPill({ profile, prog, onEdit }) {
  // Survol : ouverture temporaire. Clic : épinglé jusqu'à un clic ailleurs ou un nouveau clic.
  const [pinned, setPinned] = useState(false);
  const [hover, setHover] = useState(false);
  const open = pinned || hover;
  const ref = useRef(null);
  useEffect(() => {
    if (!pinned) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setPinned(false); };
    document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close);
  }, [pinned]);
  const fac = facById(profile?.fac);
  const ICON = <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg>;
  const pillBase = { display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #ddd9fb', borderRadius: 999, padding: '8px 13px', fontSize: 13, fontWeight: 800, color: '#0f1020', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(15,16,32,0.04)' };
  if (!fac) {
    return (
      <button onClick={onEdit} style={{ ...pillBase, color: '#4f46e5', borderStyle: 'dashed' }} className="hover:bg-indigo-50 transition-colors">
        {ICON} Renseigner ma faculté
      </button>
    );
  }
  const voie = VOIES.find(v => v.id === profile?.voie)?.label || null;
  const stripped = fac.name.replace(/^Université (de la |de |d’|d')?/i, '');
  const short = stripped.length <= 22 ? stripped : (fac.city || stripped);
  const mcc = mccFor(fac.id); const ex = facExams(fac.id);
  const bar = baremeById(profile.bareme || 'partiel');
  const nExams = (ex?.exams || []).filter(e => e.minutes).length;
  const d = ex?.dates; const fmtD = (x) => new Date(x).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  const rows = [
    ['Barème', `${bar.label}${mcc?.confidence && mcc.confidence !== 'officiel' ? ' · à confirmer' : ''}`],
    ['Épreuves', nExams ? `${nExams} UE au format de ta fac` : 'format à renseigner'],
    ['Programme', prog.known ? `${prog.subjects.length} UE${prog.others.length ? ` · ${prog.others.map(o => o.name.toLowerCase()).join(', ')} hors programme` : ''}` : '9 UE'],
    d?.s1 ? ['Partiels', `S1 ${fmtD(d.s1)}${d.s2 ? ` · S2 ${fmtD(d.s2)}` : ''}${d.approx ? ' (à confirmer)' : ''}`] : ex?.threshold ? ['Note-seuil', `${ex.threshold}/20`] : null,
  ].filter(Boolean);
  return (
    <div ref={ref} style={{ position: 'relative' }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button onClick={() => setPinned(p => !p)} aria-expanded={open} style={{ ...pillBase, ...(pinned ? { borderColor: '#4f46e5' } : {}) }} className="hover:border-indigo-300 transition-colors">
        <span style={{ color: '#4f46e5', display: 'flex' }}>{ICON}</span>
        {short}{voie ? <span style={{ color: '#8a8ea8', fontWeight: 600 }}>· {voie}</span> : null}
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#8a8ea8" strokeWidth="2.5" style={{ transition: 'transform .15s', transform: open ? 'rotate(180deg)' : 'none' }}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 300, background: '#fff', border: '1px solid #e4e2f6', borderRadius: 12, boxShadow: '0 12px 30px rgba(15,16,32,0.12)', padding: '12px 14px', zIndex: 40, fontSize: 12, lineHeight: 1.5 }}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6, color: '#0f1020' }}>{fac.name}{voie ? <span style={{ color: '#8a8ea8', fontWeight: 500 }}> · {voie}</span> : null}</div>
          {rows.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '3px 0', borderBottom: '1px dashed #eef0f7' }}>
              <span style={{ color: '#8a8ea8', flexShrink: 0 }}>{k}</span><span style={{ textAlign: 'right', color: '#0f1020' }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href={`/facs/${fac.id}`} style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }} className="hover:underline">Fiche de la fac →</Link>
            <button onClick={() => { setPinned(false); setHover(false); onEdit(); }} style={{ background: 'none', border: 'none', color: '#8a8ea8', cursor: 'pointer', fontSize: 12, padding: 0 }} className="hover:text-indigo-600">modifier ✎</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Faculté et voie sous la salutation (mobile) ; lien vers le profil si rien n'est renseigné. */
function FacLine({ profile, onEdit, compact = false }) {
  const fac = facById(profile?.fac);
  const voie = VOIES.find(v => v.id === profile?.voie)?.label || null;
  const fs = compact ? 12 : 13.5;
  const ICON = <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg>;
  if (!fac) {
    return (
      <button onClick={onEdit} style={{ background: 'none', border: 'none', padding: 0, marginTop: compact ? 2 : -4, fontSize: fs, fontWeight: 600, color: '#4f46e5', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }} className="hover:underline">
        {ICON}
        Renseigner ma faculté
      </button>
    );
  }
  // Faits appliqués au compte, en une ligne discrète : barème, format, programme, partiels
  const mcc = mccFor(fac.id); const ex = facExams(fac.id); const prog = programFor(profile);
  const bar = baremeById(profile.bareme || 'partiel');
  const nExams = (ex?.exams || []).filter(e => e.minutes).length;
  const d = ex?.dates; const fmtD = (x) => new Date(x).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  const facts = [
    `Barème ${bar.label.toLowerCase()}${mcc?.confidence && mcc.confidence !== 'officiel' ? ' (à confirmer)' : ''}`,
    nExams ? `${nExams} UE au format de ta fac` : null,
    prog.known ? `programme de ${prog.subjects.length} UE` : null,
    d?.s1 ? `partiels S1 ${fmtD(d.s1)}${d.s2 ? ` · S2 ${fmtD(d.s2)}` : ''}` : ex?.threshold ? `note-seuil ${ex.threshold}/20` : null,
  ].filter(Boolean);
  return (
    <div style={{ marginTop: compact ? 4 : -2, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: compact ? 13 : 15, color: '#0f1020', minWidth: 0 }}>
        <span style={{ color: '#4f46e5', display: 'flex' }}>{ICON}</span>
        <span style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fac.name}</span>
        {voie && <span style={{ color: '#8a8ea8', fontWeight: 500 }}>· {voie}</span>}
        <Link href={`/facs/${fac.id}`} style={{ fontSize: 11.5, fontWeight: 600, color: '#4f46e5', textDecoration: 'none', marginLeft: 4, whiteSpace: 'nowrap' }} className="hover:underline">fiche de la fac</Link>
        <button onClick={onEdit} aria-label="Modifier ma faculté" style={{ background: 'none', border: 'none', padding: 2, color: '#8a8ea8', cursor: 'pointer', display: 'flex', flexShrink: 0 }} className="hover:text-indigo-600">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
        </button>
      </div>
      {!compact && facts.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2px 10px', marginTop: 3, fontSize: 12, color: '#5f6280' }}>
          {facts.map((f, i) => <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>{i > 0 && <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#c7c9d9', display: 'inline-block' }} />}{f.charAt(0).toUpperCase() + f.slice(1)}</span>)}
        </div>
      )}
    </div>
  );
}

function ActionHub({ todaySubject, reviewDue = [], subjects = [], onLaunchQCM, onLaunchExamen, onOpenFiches, onLaunchReview, quests = [], showQuests = false, moment = null, onLaunchMoment = null }) {
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


      {moment && onLaunchMoment && (
        <button onClick={() => onLaunchMoment(moment.id)} style={{ marginTop: 18, width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, color: '#fff', background: moment.id === 'veille' ? 'linear-gradient(135deg, #b45309, #d97706)' : 'linear-gradient(135deg, #0f766e, #14b8a6)', boxShadow: '0 10px 24px rgba(15,16,32,0.12)' }}>
          <span style={{ fontSize: 26, lineHeight: 1 }}>{moment.id === 'veille' ? '🎯' : '🌱'}</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: 0.8, opacity: 0.85, textTransform: 'uppercase' }}>{moment.id === 'veille' ? `J-${moment.days} · veille de concours` : 'Après le partiel'}</span>
            <span style={{ display: 'block', fontSize: 15, fontWeight: 800 }}>{moment.id === 'veille' ? 'Consolider, pas découvrir' : 'On repart en douceur'}</span>
            <span style={{ display: 'block', fontSize: 12, opacity: 0.9, marginTop: 2 }}>{moment.id === 'veille' ? 'Points clés de ta matière la plus solide et ta pile — rien de nouveau avant le jour J.' : 'Huit questions sur la matière qui t’a coûté le plus, sans chrono, pour reprendre pied.'}</span>
          </span>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
        </button>
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

function PicoMascot({ data, todaySubject, firstName, onLaunchQCM, statsLoaded, hidden, examDate, reviewDue = [], quests = [], gradeInfo = null, openSignal = 0, onShowGrade = null }) {
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
  const autoOpened = useRef(false);


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
              {gradeUp ? 'Pico · Nouveau grade !' : celebration ? 'Pico · Nouveau badge !' : xpIntro ? 'Pico · Tes premiers XP !' : reaction ? 'Pico · Débrief' : (askExamDate || dateSaved) ? 'Pico · Tes partiels' : 'Pico · Conseil du jour'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={close} aria-label="Fermer" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a8ea8', padding: 2, display: 'flex' }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {gradeUp ? (
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
          <PicoOwlSvg size={48} />
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
  sky:     { badge: 'bg-sky-100 text-sky-700', bar: 'bg-sky-500', icon: 'text-sky-500', light: 'bg-sky-50', border: 'border-sky-100', pill: 'bg-sky-600 text-white', pillIdle: 'bg-sky-50 text-sky-700 hover:bg-sky-100' },
  teal:    { badge: 'bg-teal-100 text-teal-700', bar: 'bg-teal-500', icon: 'text-teal-500', light: 'bg-teal-50', border: 'border-teal-100', pill: 'bg-teal-600 text-white', pillIdle: 'bg-teal-50 text-teal-700 hover:bg-teal-100' },
  fuchsia: { badge: 'bg-fuchsia-100 text-fuchsia-700', bar: 'bg-fuchsia-500', icon: 'text-fuchsia-500', light: 'bg-fuchsia-50', border: 'border-fuchsia-100', pill: 'bg-fuchsia-600 text-white', pillIdle: 'bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100' },
};

// Temps de lecture estimé d'une fiche (≈200 mots/min)
function ficheReadingTime(html) {
  if (!html) return 1;
  const words = html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Accent hex par couleur de matière (pour les cartes de matières)
/* Couleurs « surligneur » par UE, pour les mini-fiches bristol du dashboard. */
const FLUO_HEX = {
  indigo: '#a5b4ff', primary: '#a5b4ff', emerald: '#7dffa0', violet: '#d69bff', cyan: '#6ff2ff',
  amber: '#ffd84a', rose: '#ff7ac3', sky: '#7cd4ff', teal: '#6ff5d8', fuchsia: '#ff8ae8',
};
const FICHES_ACCENT_HEX = {
  indigo: '#4f46e5', primary: '#4f46e5', emerald: '#059669',
  violet: '#7c3aed', cyan: '#0891b2', amber: '#d97706', rose: '#e11d48',
  sky: '#0284c7', teal: '#0d9488', fuchsia: '#c026d3',
};

const FICHES_SUBJECT_ICONS = {
  anatomie:    'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z',
  chimie:      'M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5',
  biocell:     'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z',
  biostats:    'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  biophysique: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
  ssh:         'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
  physiologie: 'M3 12h3l2.5-6 3 12 2.5-6h3l1.5 3 1.5-3h2',
  medicament:  'm9.75 3.104 5.25 5.25m-9.5 4.5 5.25 5.25M5.5 12.5l7-7a3.5 3.5 0 1 1 4.95 4.95l-7 7a3.5 3.5 0 1 1-4.95-4.95Z',
  histo:       'M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm0 0v18M3 12h18M6 6.5c2 1.5 4 2.5 6 2.5s4-1 6-2.5M6 17.5c2-1.5 4-2.5 6-2.5s4 1 6 2.5',
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
              <CoursBristol fiche={fiche} subject={sub} cours={cours} idPrefix="modal-section" />

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

function FichesSection({ initialSubject, onLaunchQCM, subjectOrder = null }) {
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
  // Une fiche ouverte est une page à part entière : URL ?fiche=…, bouton retour du navigateur, pas de fenêtre.
  const scrollTop = () => { const m = [...document.querySelectorAll('main')].find(x => x.style.overflowY === 'auto'); (m || window).scrollTo({ top: 0, behavior: 'instant' }); };
  const openFiche = (f, push = true) => { markRead(f.id); setSelectedFiche(f); if (push) window.history.pushState({ fiche: f.id }, '', `?section=fiches&fiche=${f.id}`); scrollTop(); };
  const closeFiche = () => { setSelectedFiche(null); window.history.pushState({}, '', '?section=fiches'); scrollTop(); };
  useEffect(() => {
    const fromUrl = () => { const id = new URLSearchParams(window.location.search).get('fiche'); return id ? FICHES_DATA.find(x => x.id === id) || null : null; };
    const first = fromUrl(); if (first) openFiche(first, false);
    const onPop = () => { const f = fromUrl(); setSelectedFiche(f); if (f) markRead(f.id); scrollTop(); };
    window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const SUBJECT_ORDER = subjectOrder || ['chimie', 'biocell', 'biophysique', 'biostats', 'anatomie', 'ssh', 'physiologie', 'medicament', 'histo'];

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
      <style>{`.fiche-bristol-mini:hover { transform: translateY(-3px) rotate(-0.6deg); box-shadow: 0 14px 28px -14px rgba(15,16,32,0.25); }`}</style>
      {selectedFiche ? (
        <FicheBristolPage
          fiche={selectedFiche}
          fiches={filteredFiches}
          isRead={readIds.has(selectedFiche.id)}
          onNavigate={(f) => openFiche(f)}
          onClose={closeFiche}
          isEssentiel={isEssentiel}
          onLaunchQCM={onLaunchQCM}
          onOpenCours={(fiche) => setActiveCours(fiche)}
        />
      ) : (<>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f1020', margin: 0, letterSpacing: -0.4 }}>Fiches &amp; Cours</h2>
          <p style={{ fontSize: 13, color: '#5f6280', margin: '4px 0 0' }}>{filteredFiches.length} fiche{filteredFiches.length > 1 ? 's' : ''}{currentSubject !== 'all' && activeSubjectObj ? ` · ${activeSubjectObj.name}` : ''}{readIds.size > 0 ? ` · ${[...readIds].filter(id => filteredFiches.some(f => f.id === id)).length} lue${[...readIds].filter(id => filteredFiches.some(f => f.id === id)).length > 1 ? 's' : ''}` : ''}</p>
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

      {/* Matières : petits rectangles, nom surligné au fluo de l'UE, UE de la fac d'abord */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
        {(() => {
          const totalAll = FICHES_DATA.length; const isSel = currentSubject === 'all';
          return (
            <button onClick={() => setCurrentSubject('all')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', border: `1px solid ${isSel ? '#0f1020' : '#e5e7f0'}`, background: isSel ? '#0f1020' : '#fff', color: isSel ? '#fff' : '#2a2c44' }} className="transition-colors hover:border-gray-400">
              Toutes <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>{totalAll}</span>
            </button>
          );
        })()}
        {SUBJECT_ORDER.map(id => SUBJECTS.find(s => s.id === id)).filter(Boolean).map(sub => {
          const fluo = FLUO_HEX[sub.color] || FLUO_HEX.primary;
          const st = subjectStats[sub.id] || { total: 0, read: 0 };
          const isSel = currentSubject === sub.id;
          const done = st.total > 0 && st.read === st.total;
          const stroke = `linear-gradient(104deg, ${fluo}00 0.9%, ${fluo}${isSel ? 'e6' : '99'} 2.4%, ${fluo}${isSel ? 'bf' : '73'} 5.8%, ${fluo}${isSel ? '66' : '26'} 93%, ${fluo}${isSel ? 'cc' : '8c'} 96%, ${fluo}00 98%)`;
          return (
            <button key={sub.id} onClick={() => setCurrentSubject(sub.id)} title={`${st.read}/${st.total} lues`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', border: `1px solid ${isSel ? '#c9cbe0' : '#e5e7f0'}`, background: '#fff', color: '#0f1020', boxShadow: isSel ? '0 0 0 2px #eef0f7' : 'none' }} className="transition-colors hover:border-gray-400">
              <span style={{ background: stroke, backgroundSize: '100% 62%', backgroundRepeat: 'no-repeat', backgroundPosition: '0 70%', padding: '0 4px', margin: '0 -4px', borderRadius: 2 }}>{sub.name}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#8a8ea8' }}>{done ? '✓' : st.read > 0 ? `${st.read}/${st.total}` : st.total}</span>
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
          const accent = FICHES_ACCENT_HEX[sub?.color] || FICHES_ACCENT_HEX.primary;
          const fluo = FLUO_HEX[sub?.color] || FLUO_HEX.primary;
          const isRead = readIds.has(fiche.id);
          const mins = ficheReadingTime(fiche.content);
          const open = () => openFiche(fiche);
          // Petite fiche bristol : papier crème ligné, onglet de couleur, titre surligné au fluo, ruban adhésif.
          return (
            <div key={fiche.id} role="button" tabIndex={0} onClick={open} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}
              className="fiche-bristol-mini group"
              style={{ position: 'relative', background: '#fff', borderRadius: 14, border: '1px solid #e5e7f0', cursor: 'pointer', padding: '14px 16px 12px 22px', display: 'flex', flexDirection: 'column', gap: 6, transition: 'transform .18s, box-shadow .18s', boxShadow: '0 2px 6px rgba(15,16,32,0.04)', backgroundImage: 'repeating-linear-gradient(transparent 0, transparent 21px, #eef0f4 21px, #eef0f4 22px)', backgroundPosition: '0 10px', overflow: 'visible' }}>
              {/* marge rouge */}
              <span aria-hidden="true" style={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: 1.5, background: '#f6cfcf', borderRadius: 1 }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f1020', lineHeight: '22px', margin: 0 }} className="group-hover:text-indigo-800 transition-colors">
                  <span style={{ background: `linear-gradient(104deg, ${fluo}00 0.9%, ${fluo}a6 2.4%, ${fluo}73 5.8%, ${fluo}26 93%, ${fluo}8c 96%, ${fluo}00 98%)`, backgroundSize: '100% 66%', backgroundRepeat: 'no-repeat', backgroundPosition: '0 65%', padding: '0 4px', margin: '0 -4px', borderRadius: 3, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>{fiche.title}</span>
                </h3>
                {isRead && (
                  <span title="Lue" style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: '#dcfce7', border: '1px solid #bbf7d0', color: '#166534', display: 'grid', placeItems: 'center' }}>
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12.5, color: '#5f6280', lineHeight: '22px', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{fiche.summary}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2, fontSize: 11.5, lineHeight: '22px' }}>
                <span style={{ fontWeight: 700, color: '#4f46e5' }}>{isRead ? 'Relire' : 'Lire'} →</span>
                <span style={{ color: '#9ca3af' }}>{mins} min</span>
              </div>
            </div>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
                      {items.map(renderCard)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14, paddingTop: 6 }}>
            {filteredFiches.map(renderCard)}
          </div>
        );
      })()}

      </>)}

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

/* Page « fiche bristol » : la fiche ouverte occupe la section, sur une carte crème lignée
   avec sa marge rouge et un bandeau à la couleur de l'UE. */
function FicheBristolPage({ fiche, fiches = [], isRead = false, onNavigate, onClose, isEssentiel, onLaunchQCM, onOpenCours }) {
  const sub = SUBJECTS.find(s => s.id === fiche.subject);
  const accent = FICHES_ACCENT_HEX[sub?.color] || FICHES_ACCENT_HEX.primary;
  const cols = FICHES_SUBJECT_COLORS[sub?.color] || FICHES_SUBJECT_COLORS.primary;
  const mins = ficheReadingTime(fiche.content);
  const idx = fiches.findIndex(f => f.id === fiche.id);
  const prevFiche = idx > 0 ? fiches[idx - 1] : null;
  const nextFiche = idx >= 0 && idx < fiches.length - 1 ? fiches[idx + 1] : null;
  const [downloading, setDownloading] = useState(false);
  const download = async () => { if (downloading) return; setDownloading(true); try { await downloadFichePdf(fiche, sub); } catch (e) { console.error(e); } finally { setDownloading(false); } };
  const NavBtn = ({ f, dir }) => f ? (
    <button onClick={() => onNavigate(f)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, maxWidth: 260, background: '#fff', border: '1px solid #e5e7f0', borderRadius: 10, padding: '8px 12px', fontSize: 12.5, fontWeight: 600, color: '#2a2c44', cursor: 'pointer', textAlign: dir === 'next' ? 'right' : 'left' }} className="hover:border-indigo-300 hover:text-indigo-700 transition-colors">
      {dir === 'prev' && <span>←</span>}<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.title}</span>{dir === 'next' && <span>→</span>}
    </button>
  ) : <span />;
  return (
    <div className="max-w-4xl mx-auto">
      {/* Barre de navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2" style={{ marginBottom: 16 }}>
        <button onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, fontSize: 13, fontWeight: 700, color: '#5f6280', cursor: 'pointer' }} className="hover:text-indigo-700 transition-colors">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Retour aux fiches
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          {isEssentiel && (
            <button onClick={download} disabled={downloading} title="Télécharger en PDF" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #e5e7f0', borderRadius: 10, padding: '8px 12px', fontSize: 12.5, fontWeight: 700, color: '#2a2c44', cursor: 'pointer' }} className="hover:border-indigo-300 transition-colors">
              {downloading ? <span style={{ width: 13, height: 13, border: '2px solid #d7d9e6', borderTopColor: '#4f46e5', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> : <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>}
              PDF
            </button>
          )}
          <button onClick={() => onLaunchQCM({ type: 'custom', subject: fiche.subject, subjectName: sub?.name || '', title: fiche.title, content: fiche.content, count: 5 })} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#4f46e5', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12.5, fontWeight: 700, color: '#fff', cursor: 'pointer' }} className="hover:bg-indigo-700 transition-colors">
            Me tester sur cette fiche
          </button>
        </div>
      </div>

      {/* La fiche bristol (composant partagé avec la page publique) */}
      <BristolCard fiche={fiche} subject={sub} isRead={isRead} />

      {/* Suite */}
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 10 }}>
        <div><NavBtn f={prevFiche} dir="prev" /></div>
        <div>
          {isEssentiel
            ? <button onClick={() => onOpenCours(fiche)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0f1020', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }} className="hover:opacity-90 transition-opacity">Cours complet →</button>
            : <Link href="/tarifs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fdf4e2', color: '#78350f', border: '1px solid #f4dcb0', borderRadius: 10, padding: '9px 16px', fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }}>Cours complet · Premium</Link>}
        </div>
        <div style={{ textAlign: 'right' }}><NavBtn f={nextFiche} dir="next" /></div>
      </div>
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

  const [downloading, setDownloading] = useState(false);
  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadFichePdf(fiche, sub);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
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
            {/* Télécharger la fiche en PDF (Premium) */}
            {isEssentiel ? (
              <button
                onClick={handleDownload}
                disabled={downloading}
                title="Télécharger la fiche en PDF"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#f1f5f9', color: '#475569', border: 'none', cursor: downloading ? 'wait' : 'pointer', opacity: downloading ? 0.65 : 1 }}
                className="hover:bg-slate-200 transition-colors"
              >
                {downloading ? (
                  <span style={{ width: 14, height: 14, border: '2px solid #cbd5e1', borderTopColor: '#475569', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                ) : (
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                )}
                <span className="hidden sm:inline">{downloading ? 'Création…' : 'PDF'}</span>
              </button>
            ) : (
              <Link
                href="/tarifs"
                title="Le téléchargement PDF est réservé aux membres Premium"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#f8fafc', color: '#94a3b8', border: '1px dashed #cbd5e1', textDecoration: 'none' }}
                className="hover:bg-slate-100 transition-colors"
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                <span className="hidden sm:inline">PDF</span>
              </Link>
            )}
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
/* Rail latéral : un seul niveau, icône + libellé court, accent indigo unique.
 *
 * Les sous-menus dépliants (les 6 UE, et les lancements QCM / examen blanc /
 * session éclair / à consolider) ont été retirés : ils dupliquaient le bento
 * « Que veux-tu faire ? » de l'accueil, la sélection de matière de la section
 * Fiches et le menu mobile, au prix d'un niveau de navigation supplémentaire.
 */
function DashboardSideNav({ activeSection, setActiveSection, isPremiumPlus, tier, onOpenFiches }) {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try { await logOut(); router.push('/'); } catch (e) { console.error(e); }
  };

  const navItems = [
    {
      id: 'overview', label: 'Accueil',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />,
    },
    {
      id: 'fiches', label: 'Fiches',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />,
    },
    {
      id: 'progression', label: 'Progression', locked: !isPremiumPlus,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />,
    },
    {
      id: 'objectifs', label: 'Objectifs', locked: !isPremiumPlus,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />,
    },
    {
      id: 'historique', label: 'Historique',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    },
  ];

  const initial = (user?.displayName?.[0] || user?.email?.[0] || '?').toUpperCase();
  const rule = <span style={{ width: 30, height: 1, background: '#eef0f7', flexShrink: 0 }} />;

  return (
    <aside
      className="hidden md:block"
      style={{ flexShrink: 0, padding: 12, height: '100vh', boxSizing: 'border-box', position: 'sticky', top: 0 }}
    >
      <div style={{ width: 96, height: '100%', background: '#fff', border: '1px solid #eef0f7', borderRadius: 26, boxShadow: '0 6px 24px rgba(15,16,32,0.05)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '18px 10px 16px' }}>

          {/* ── Logo — retour à l'accueil du site ── */}
          <Link href="/" title="Retour à l'accueil" style={{ display: 'block', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 40, height: 40, background: '#4f46e5', borderRadius: 12, display: 'grid', placeItems: 'center' }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
          </Link>
          <span style={{ width: 30, height: 1, background: '#eef0f7', margin: '16px 0 14px', flexShrink: 0 }} />

          {/* ── Navigation ── */}
          <div style={{ flex: 1, overflowY: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { if (item.id === 'fiches') onOpenFiches(null); else setActiveSection(item.id); }}
                  title={item.locked ? `${item.label} — Premium requis` : item.label}
                  style={{
                    position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    padding: '11px 4px 10px', borderRadius: 14, border: 'none',
                    background: isActive ? '#f2f0fe' : 'transparent',
                    color: isActive ? '#4f46e5' : '#2a2c44',
                    cursor: 'pointer',
                  }}
                  className={isActive ? '' : 'hover:bg-gray-50 transition-colors'}
                >
                  {isActive && <span style={{ position: 'absolute', left: -10, top: 12, bottom: 12, width: 4, borderRadius: '0 4px 4px 0', background: '#4f46e5' }} />}
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">{item.icon}</svg>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: -0.1, lineHeight: 1.15, textAlign: 'center' }}>{item.label}</span>
                  {item.locked && (
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#c1c3d4" strokeWidth="2.2" style={{ position: 'absolute', top: 8, right: 9 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  )}
                </button>
              );
            })}

            {/* Devenir Premium — tuile dorée (même style que le rail CRFPA), visible tant que
                l'abonnement n'est pas actif */}
            {!isPremiumPlus && (
              <Link
                href="/tarifs"
                title={tier === 'gratuit' ? 'Devenir Premium' : 'Voir les offres'}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: '12px 4px 10px', borderRadius: 14, textDecoration: 'none', marginTop: 4 }}
                className="hover:bg-amber-50 transition-colors"
              >
                <span style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: 12, display: 'grid', placeItems: 'center', boxShadow: '0 4px 10px rgba(245,158,11,0.3)' }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#78350f" strokeWidth="1.9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                </span>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#d97706', textAlign: 'center', lineHeight: 1.2 }}>Devenir<br />Premium</span>
              </Link>
            )}
          </div>

          {/* ── Bas : compte + déconnexion ── */}
          <span style={{ width: 30, height: 1, background: '#eef0f7', margin: '12px 0', flexShrink: 0 }} />
          {user && (
            <button
              onClick={() => setActiveSection('account')}
              title={`Mon compte — ${user.displayName || user.email}`}
              style={{ width: 42, height: 42, borderRadius: '50%', background: activeSection === 'account' ? '#ece9ff' : '#f4f5f9', color: activeSection === 'account' ? '#4f46e5' : '#2a2c44', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', flexShrink: 0 }}
              className="hover:bg-indigo-50 transition-colors"
            >
              {initial}
            </button>
          )}
          <button
            onClick={handleLogout}
            title="Se déconnecter"
            style={{ marginTop: 10, width: 38, height: 38, borderRadius: 12, background: 'transparent', border: 'none', color: '#2a2c44', display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0 }}
            className="hover:bg-rose-50 hover:text-[#e45770] transition-colors"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.9">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
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
/* ============================================================
   EN-TÊTE DE SECTION & CONTRÔLE SEGMENTÉ (langage du dashboard CRFPA)
   ============================================================ */
/* « Ta progression » : le mot-clé en dégradé, puis une rangée de pastilles.
   `chips` accepte des entrées falsy pour simplifier les conditions à l'appel. */
function SectionHeader({ lead, word, chips = [] }) {
  const TONES = {
    indigo: 'bg-indigo-50 text-indigo-700',
    amber: 'bg-amber-100 text-amber-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-100 text-red-600',
  };
  const list = chips.filter(Boolean);
  return (
    <div className="mb-5">
      <h2 className="font-jakarta text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
        {lead} <span className="home-gradient-text">{word}</span>
      </h2>
      {list.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {list.map(c => (
            <span key={c.label} className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${TONES[c.tone || 'indigo']}`}>{c.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function SegmentedPills({ value, onChange, options }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 bg-gray-50 border border-gray-200 rounded-full p-1">
      {options.map(o => (
        <button key={o.key} onClick={() => onChange(o.key)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${value === o.key ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' : 'text-gray-600 hover:text-indigo-600'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

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
/* Profil de révision : ce qui permet au site de s'adapter (faculté, voie, temps, barème). */
/* Liste déroulante sur mesure : bouton + panneau (rôle listbox) avec recherche pour les longues
   listes, sous-titres, badge, navigation clavier (flèches, Entrée, Échap) et fermeture au clic dehors. */
function FancySelect({ value, onChange, placeholder = 'Choisir…', icon, accent = false, options = [], searchable = false }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hi, setHi] = useState(-1);
  const ref = useRef(null); const listRef = useRef(null); const searchRef = useRef(null);
  const selected = options.find(o => o.value === value) || null;
  const norm = (t) => (t || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visible = q ? options.filter(o => norm(`${o.label} ${o.sub || ''}`).includes(norm(q))) : options;
  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close);
  }, [open]);
  useEffect(() => {
    if (!open) { setQ(''); setHi(-1); return; }
    setHi(Math.max(0, visible.findIndex(o => o.value === value)));
    setTimeout(() => searchRef.current?.focus(), 0);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open || hi < 0 || !listRef.current) return;
    listRef.current.children[hi]?.scrollIntoView({ block: 'nearest' });
  }, [hi, open]);
  const pick = (o) => { onChange(o.value); setOpen(false); };
  const onKey = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setOpen(true); return; }
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setHi(h => Math.min(visible.length - 1, h + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => Math.max(0, h - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (visible[hi]) pick(visible[hi]); }
  };
  const empty = !selected;
  return (
    <div ref={ref} className="relative" onKeyDown={onKey}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}
        className={`w-full flex items-center gap-2.5 ${icon ? 'pl-3.5' : 'pl-3.5'} pr-3 py-2.5 rounded-xl border text-sm text-left transition-colors focus:outline-none focus:ring-[3px] focus:ring-indigo-100 focus:border-indigo-400 ${open ? 'border-indigo-400 ring-[3px] ring-indigo-100' : ''} ${accent ? 'border-indigo-300 bg-indigo-50/60 hover:bg-indigo-50' : 'border-gray-200 bg-[#fafafe] hover:border-indigo-300 hover:bg-white'}`}>
        {icon && <svg className={`w-4 h-4 shrink-0 ${empty ? 'text-gray-400' : 'text-indigo-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">{icon}</svg>}
        <span className={`flex-1 min-w-0 truncate ${empty ? 'text-gray-400 font-medium' : 'text-gray-900 font-semibold'}`}>{selected ? selected.label : placeholder}</span>
        {selected?.badge && <span className="shrink-0 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5">{selected.badge}</span>}
        <svg className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180 text-indigo-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
      </button>
      {open && (
        <div className="absolute z-40 left-0 right-0 mt-1.5 rounded-xl border border-gray-200 bg-white shadow-xl shadow-slate-900/10 overflow-hidden" style={{ minWidth: 320 }}>
          {searchable && (
            <div className="relative border-b border-gray-100">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input ref={searchRef} value={q} onChange={e => { setQ(e.target.value); setHi(0); }} placeholder="Rechercher…" className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-white" />
            </div>
          )}
          <ul ref={listRef} role="listbox" className="max-h-64 overflow-y-auto py-1">
            {visible.length === 0 && <li className="px-3.5 py-3 text-sm text-gray-400">Aucun résultat</li>}
            {visible.map((o, i) => {
              const isSel = o.value === value; const isHi = i === hi;
              return (
                <li key={o.value || '_'} role="option" aria-selected={isSel} onMouseEnter={() => setHi(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 cursor-pointer text-sm ${isHi ? 'bg-indigo-50' : ''}`}>
                  <span className="flex-1 min-w-0">
                    <span className={`block truncate ${isSel ? 'font-bold text-indigo-700' : 'font-semibold text-gray-900'}`}>{o.label}</span>
                    {o.sub && <span className="block text-[11.5px] text-gray-500 leading-snug">{o.sub}</span>}
                  </span>
                  {o.badge && <span className="shrink-0 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5">{o.badge}</span>}
                  {isSel && <svg className="w-4 h-4 shrink-0 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProfileCard({ user }) {
  const initial = getProfile(user);
  const explicitBareme = user?.user_metadata?.profile?.bareme || null; // choisi par l'étudiant (ou pré-rempli) ?
  const [form, setForm] = useState({ fac: initial.fac || '', voie: initial.voie || '', bareme: explicitBareme || mccFor(initial.fac)?.bareme || 'partiel' });
  const mcc = mccFor(form.fac);
  const onFacChange = (fac) => setForm(f => ({ ...f, fac, bareme: mccFor(fac)?.bareme || f.bareme }));
  // Confirmations des étudiants de la fac (agrégées côté serveur, cache une heure)
  const [stats, setStats] = useState(null);
  useEffect(() => {
    if (!form.fac) { setStats(null); return; }
    let on = true;
    fetch(`/api/fac-stats?fac=${encodeURIComponent(form.fac)}`).then(r => r.ok ? r.json() : null).then(d => { if (on) setStats(d); }).catch(() => {});
    return () => { on = false; };
  }, [form.fac]);
  const [saving, setSaving] = useState(false); const [msg, setMsg] = useState(null);
  const persist = async (extra = {}) => {
    setSaving(true); setMsg(null);
    try {
      const profile = { ...initial, fac: form.fac || null, voie: form.voie || null, bareme: form.bareme, ...extra };
      const { error } = await supabase.auth.updateUser({ data: { profile } });
      if (error) throw error;
      return true;
    } catch (e) { setMsg({ ok: false, t: e.message || 'Erreur' }); return false; } finally { setSaving(false); }
  };
  const save = async () => { if (await persist()) setMsg({ ok: true, t: 'Profil enregistré.' }); };
  const confirm = async () => {
    const vote = { fac: form.fac, bareme: form.bareme, ok: true, at: new Date().toISOString() };
    if (await persist({ baremeVote: vote })) {
      setMsg({ ok: true, t: 'Merci ! Ta confirmation aide les étudiants de ta fac.' });
      setStats(st => st ? { ...st, votes: { ...st.votes, [form.bareme]: (st.votes?.[form.bareme] || 0) + 1 } } : st);
    }
  };
  const myVote = initial.baremeVote && initial.baremeVote.fac === form.fac && initial.baremeVote.bareme === form.bareme;
  const votes = stats?.votes?.[form.bareme] || 0;
  const labelCls = 'block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5';
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
        <div>
          <h3 className="font-jakarta text-base font-bold text-gray-900">Ma facult&eacute;</h3>
          <p className="text-sm text-gray-500">Le site applique le bar&egrave;me, le format des &eacute;preuves et le programme de ta fac.</p>
        </div>
        {form.fac && form.fac !== 'autre' && <Link href={`/facs/${form.fac}`} className="text-xs font-bold text-indigo-600 hover:underline">Fiche de la fac →</Link>}
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div><label className={labelCls}>Facult&eacute;</label>
          <FancySelect value={form.fac} onChange={onFacChange} placeholder="Choisir ma faculté…" searchable icon={<path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />}
            options={FACS.map(f => ({ value: f.id, label: f.name, sub: f.city || undefined, badge: mccFor(f.id)?.bareme ? 'barème connu' : undefined }))} /></div>
        <div><label className={labelCls}>Voie</label>
          <FancySelect value={form.voie} onChange={v => setForm(f => ({ ...f, voie: v }))} placeholder="PASS ou LAS ?" icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />}
            options={VOIES.map(v => ({ value: v.id, label: v.label, sub: v.desc }))} /></div>
        <div><label className={labelCls}>Bar&egrave;me des QCM</label>
          <FancySelect value={form.bareme} onChange={v => setForm(f => ({ ...f, bareme: v }))} icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.5v3.75m0 0L21 5.25m-2.25 3L16.5 5.25m-9 3v-3.75m0 0L9.75 5.25M5.25 4.5 3 5.25" />} accent={mcc?.bareme === form.bareme}
            options={BAREMES.map(b => ({ value: b.id, label: b.label, sub: b.desc, badge: mcc?.bareme === b.id ? 'Ta fac' : undefined }))} /></div>
      </div>
      <p className="mt-2 text-[11.5px] text-gray-500 leading-snug">
        {mcc?.bareme
          ? <>Pr&eacute;-rempli d&apos;apr&egrave;s {mcc.confidence === 'officiel' ? 'les MCC officielles' : 'une source étudiante'} {mcc.year} (<a href={mcc.source} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold hover:underline">source</a>){votes > 0 ? <>, confirm&eacute; par {votes} &eacute;tudiant{votes > 1 ? 's' : ''}</> : null}. V&eacute;rifie sur ton intranet, tu peux le changer.</>
          : form.fac
            ? <>Bar&egrave;me non publi&eacute; par cette facult&eacute; : choisis celui de ton intranet.{votes > 0 ? <> {votes} &eacute;tudiant{votes > 1 ? 's' : ''} de ta fac ont indiqu&eacute; celui-ci.</> : null}</>
            : <>Choisis ta facult&eacute; pour pr&eacute;-remplir le bar&egrave;me.</>}
      </p>
      <div className="flex items-center gap-3 mt-5 flex-wrap">
        <button onClick={save} disabled={saving} className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50">{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        {form.fac && form.fac !== 'autre' && (myVote
          ? <span className="text-xs font-semibold text-emerald-700">✓ Bar&egrave;me confirm&eacute; pour ta fac</span>
          : <button onClick={confirm} disabled={saving} className="text-xs font-bold text-gray-600 hover:text-indigo-700 disabled:opacity-50">Confirmer ce bar&egrave;me pour ma fac</button>)}
        {msg && <span className={`text-xs font-semibold ${msg.ok ? 'text-emerald-700' : 'text-red-600'}`}>{msg.t}</span>}
      </div>
    </div>
  );
}

/* Page « Mon compte », calquée sur le dashboard CRFPA : identité, e-mail,
   mot de passe, abonnement, suppression. La date du concours se modifie
   depuis le parcours de l'accueil ; grade, XP et série vivent dans Progression. */
function AccountSection({ user, tier, accessToken }) {
  const { logOut } = useAuth();
  const router = useRouter();

  const isPaidTier = tier === 'essentiel' || tier === 'premium+';
  const isOAuth = user?.app_metadata?.provider === 'google' ||
    (user?.identities?.length > 0 && user.identities.every(id => id.provider !== 'email'));

  const [emailForm, setEmailForm] = useState({ email: user?.email || '', loading: false, success: '', error: '' });
  const [pwForm, setPwForm] = useState({ password: '', confirm: '', loading: false, success: '', error: '' });
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!emailForm.email || emailForm.email === user?.email) return;
    setEmailForm(f => ({ ...f, loading: true, success: '', error: '' }));
    const { error } = await supabase.auth.updateUser({ email: emailForm.email });
    setEmailForm(f => ({ ...f, loading: false, error: error?.message || '', success: error ? '' : 'Un lien de confirmation a été envoyé à ta nouvelle adresse.' }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!pwForm.password || pwForm.password !== pwForm.confirm) { setPwForm(f => ({ ...f, error: 'Les mots de passe ne correspondent pas.', success: '' })); return; }
    if (pwForm.password.length < 8) { setPwForm(f => ({ ...f, error: 'Le mot de passe doit contenir au moins 8 caractères.', success: '' })); return; }
    setPwForm(f => ({ ...f, loading: true, success: '', error: '' }));
    const { error } = await supabase.auth.updateUser({ password: pwForm.password });
    setPwForm(f => ({ ...f, loading: false, error: error?.message || '', success: error ? '' : 'Mot de passe mis à jour.', password: error ? f.password : '', confirm: error ? f.confirm : '' }));
  };

  const handlePortal = async () => {
    setPortalLoading(true); setPortalError(null);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } });
      const d = await res.json();
      if (d.url) { window.location.href = d.url; return; }
      setPortalError(d.error || 'Erreur lors de la redirection.');
    } catch { setPortalError('Erreur de connexion. Réessaie.'); }
    setPortalLoading(false);
  };

  /* Suppression réelle (API + Supabase) : on garde la confirmation par saisie,
     contrairement au CRFPA où la suppression n'est pas encore branchée. */
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'SUPPRIMER') return;
    setDeleteLoading(true); setDeleteError(null);
    try {
      const res = await fetch('/api/delete-account', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || 'Échec de la suppression.');
      await logOut();
      router.push('/');
    } catch (e) { setDeleteError(e.message || 'Erreur.'); setDeleteLoading(false); }
  };

  const inputCls = 'w-full px-4 py-2.5 bg-[#fafafe] border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-[3px] focus:ring-indigo-100 transition';
  const labelCls = 'block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5';
  const submitCls = 'inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const Feedback = ({ error, success }) => (
    <>
      {error && <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1.5">{error}</p>}
      {success && <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">✓ {success}</p>}
    </>
  );

  return (
    <div className="space-y-5 pb-12">
      {/* Titre */}
      <div>
        <h1 className="font-jakarta" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, margin: 0, color: '#0f1020' }}>
          Mon <span style={{ color: '#4f46e5' }}>compte</span>
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">{user?.email}</span>
          <span className="text-xs font-bold text-gray-500">{isPaidTier ? 'Plan Premium' : 'Plan gratuit'}</span>
        </div>
      </div>

      {/* Identité */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" style={{ borderTopWidth: 3, borderTopColor: '#4f46e5' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/25" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
            <span className="font-jakarta text-2xl font-black text-white">{(user?.displayName || user?.email || 'U')[0].toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="font-jakarta text-lg font-bold text-gray-900 truncate">{user?.displayName || user?.email}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            <span className={`inline-flex mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isPaidTier ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'}`}>
              {isPaidTier ? '⭐ Premium' : 'Plan gratuit'}
            </span>
          </div>
        </div>
      </div>

      <ProfileCard user={user} />

      {/* Identifiants */}
      <div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-jakarta text-base font-bold text-gray-900 mb-4">Adresse e-mail</h3>
          <form onSubmit={handleEmailUpdate} className="space-y-3">
            <div>
              <label className={labelCls}>Nouvelle adresse</label>
              <input type="email" value={emailForm.email} onChange={e => setEmailForm(f => ({ ...f, email: e.target.value }))} className={inputCls} placeholder="nouvelle@adresse.com" required />
            </div>
            <Feedback error={emailForm.error} success={emailForm.success} />
            <button type="submit" disabled={emailForm.loading || emailForm.email === user?.email} className={submitCls}>
              {emailForm.loading ? 'Mise à jour…' : "Mettre à jour l'e-mail"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-jakarta text-base font-bold text-gray-900 mb-4">Mot de passe</h3>
          {isOAuth ? (
            <p className="text-sm text-gray-500 leading-relaxed">Tu te connectes avec Google : ton mot de passe se gère depuis ton compte Google.</p>
          ) : (
            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              <div>
                <label className={labelCls}>Nouveau mot de passe</label>
                <input type="password" value={pwForm.password} onChange={e => setPwForm(f => ({ ...f, password: e.target.value }))} className={inputCls} placeholder="8 caractères minimum" required />
              </div>
              <div>
                <label className={labelCls}>Confirmer le mot de passe</label>
                <input type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} className={inputCls} placeholder="Répète le mot de passe" required />
              </div>
              <Feedback error={pwForm.error} success={pwForm.success} />
              <button type="submit" disabled={pwForm.loading} className={submitCls}>
                {pwForm.loading ? 'Mise à jour…' : 'Changer le mot de passe'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Abonnement */}
      {isPaidTier ? (
        <div className="rounded-2xl border border-amber-200/70 shadow-sm p-6" style={{ background: 'linear-gradient(150deg, #fffbeb, #fff)' }}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="font-jakarta text-base font-bold text-gray-900">Abonnement Premium actif</p>
              <p className="text-sm text-gray-500">QCM illimités, examens blancs, cours complets, progression et objectifs.</p>
            </div>
            <div className="shrink-0 text-right">
              <button type="button" onClick={handlePortal} disabled={portalLoading} className="text-xs font-semibold text-amber-700 hover:underline disabled:opacity-50">
                {portalLoading ? 'Ouverture…' : 'Gérer mon abonnement →'}
              </button>
              {portalError && <p className="text-xs text-red-600 mt-1">{portalError}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
          <div className="absolute pointer-events-none" style={{ right: -20, bottom: -30, opacity: 0.12 }} aria-hidden="true">
            <svg width="140" height="140" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
          </div>
          <div className="relative flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[220px]">
              <p className="font-jakarta text-base font-bold">Tu es en plan gratuit</p>
              <p className="text-sm text-indigo-100 mt-0.5">Débloque les QCM illimités, les examens blancs, les cours complets et le suivi de progression.</p>
            </div>
            <Link href="/tarifs" className="shrink-0 px-5 py-2.5 bg-white text-indigo-700 text-sm font-bold rounded-full hover:bg-indigo-50 transition-colors shadow-lg">
              Passer au Premium
            </Link>
          </div>
        </div>
      )}

      {/* Suppression */}
      <div className="pt-1">
        <button type="button" onClick={() => { setDeleteConfirm(''); setDeleteError(null); setDeleteOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
          Supprimer mon compte
        </button>
      </div>

      {deleteOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'grid', placeItems: 'center', background: 'rgba(15,16,32,0.45)', backdropFilter: 'blur(3px)' }} onClick={() => !deleteLoading && setDeleteOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-6 w-[min(420px,90vw)] text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
            </div>
            <h3 className="font-jakarta text-lg font-bold text-gray-900 mb-2">Supprimer ton compte ?</h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Cette action est <strong className="text-red-600">définitive</strong> : ton historique, tes objectifs et ta progression seront effacés. Tape{' '}
              <strong className="text-gray-900">SUPPRIMER</strong> pour confirmer.
            </p>
            <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="SUPPRIMER" className={`${inputCls} text-center mb-3`} autoFocus />
            {deleteError && <p className="text-xs text-red-600 mb-3">{deleteError}</p>}
            <div className="flex gap-3">
              <button onClick={() => setDeleteOpen(false)} disabled={deleteLoading} className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:border-gray-300 transition-colors disabled:opacity-50">Annuler</button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading || deleteConfirm !== 'SUPPRIMER'} className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-700 transition-colors disabled:opacity-40">
                {deleteLoading ? 'Suppression…' : 'Oui, supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
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
  useEffect(() => { if (locked) track('premium_gate_shown', { title }); }, [locked, title]);
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
   SCORE LINE CHART
   ============================================================ */
function ScoreLineChart({ points, target = 70 }) {
  /* Feuille de courbe façon papier millimétré d'hôpital : petit carreau = 5 %, gros carreau = 25 %,
     tracé en segments comme une courbe de température, seuil objectif en pointillés rouges,
     note /20 en regard du pourcentage. */
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!points || points.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">Pas assez de donnees pour afficher le graphique.</p>;
  }

  const W = 640;
  const H = 220;
  const padLeft = 40;
  const padRight = 34;
  const padTop = 18;
  const padBottom = 30;
  const chartW = W - padLeft - padRight;
  const chartH = H - padTop - padBottom;
  const cell = chartH / 20; // 5 % par petit carreau

  const getX = (i) => padLeft + (points.length === 1 ? chartW / 2 : (i / (points.length - 1)) * chartW);
  const getY = (v) => padTop + chartH - (v / 100) * chartH;
  const pts = points.map((p, i) => [getX(i), getY(p.value)]);
  const linePath = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${getX(points.length - 1).toFixed(1)},${padTop + chartH} L${getX(0).toFixed(1)},${padTop + chartH} Z`;
  const objY = getY(target);
  const last = pts[pts.length - 1];

  const maxLabels = points.length <= 10 ? points.length : Math.min(points.length, 8);
  const labelStep = Math.max(1, Math.ceil(points.length / maxLabels));
  const INK = '#4338ca'; const GRID = '#c7cbe8'; const PENCIL = '#3b3a4f';

  return (
    <div className="w-full overflow-hidden" style={{ borderRadius: 12, border: '1px solid #e5e7f0', background: '#fff' }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet" onMouseLeave={() => setHoveredIndex(null)}>
        <defs>
          <pattern id="mmMinor" width={cell} height={cell} patternUnits="userSpaceOnUse" x={padLeft} y={padTop}>
            <path d={`M ${cell} 0 L 0 0 0 ${cell}`} fill="none" stroke={GRID} strokeWidth="0.5" opacity="0.55" />
          </pattern>
          <pattern id="mmMajor" width={cell * 5} height={cell * 5} patternUnits="userSpaceOnUse" x={padLeft} y={padTop}>
            <rect width={cell * 5} height={cell * 5} fill="url(#mmMinor)" />
            <path d={`M ${cell * 5} 0 L 0 0 0 ${cell * 5}`} fill="none" stroke={GRID} strokeWidth="1" />
          </pattern>
          {/* trait de crayon : léger tremblement du tracé et grain */}
          <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="pencilSoft" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={PENCIL} strokeWidth="0.9" opacity="0.32" />
          </pattern>
        </defs>

        {/* papier millimétré */}
        <rect x={padLeft} y={padTop} width={chartW} height={chartH} fill="#fbfbff" />
        <rect x={padLeft} y={padTop} width={chartW} height={chartH} fill="url(#mmMajor)" />
        <rect x={padLeft} y={padTop} width={chartW} height={chartH} fill="none" stroke={GRID} strokeWidth="1" />

        {/* graduations : % à gauche, /20 à droite */}
        {[0, 25, 50, 75, 100].map(tick => (
          <g key={tick}>
            <text x={padLeft - 6} y={getY(tick) + 3.5} textAnchor="end" fontSize="10" fontWeight="600" fill="#6b7280">{tick}%</text>
            <text x={W - padRight + 6} y={getY(tick) + 3.5} textAnchor="start" fontSize="10" fontWeight="700" fill={INK}>{tick / 5}</text>
          </g>
        ))}
        <text x={W - padRight + 6} y={padTop - 6} textAnchor="start" fontSize="8.5" fontWeight="800" fill={INK} letterSpacing="1">/20</text>

        {/* aire hachurée au crayon + tracé en deux passes (mine appuyée puis reprise plus claire) */}
        <path d={areaPath} fill="url(#hatch)" filter="url(#pencilSoft)" />
        <path d={linePath} fill="none" stroke={PENCIL} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" opacity="0.85" filter="url(#pencil)" />
        <path d={linePath} fill="none" stroke={PENCIL} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" opacity="0.55" filter="url(#pencilSoft)" />

        {/* seuil objectif */}
        <line x1={padLeft} y1={objY} x2={W - padRight} y2={objY} stroke="#dc2626" strokeWidth="1.6" strokeDasharray="7 4" opacity="0.7" filter="url(#pencil)" />
        <rect x={padLeft + 6} y={objY - 16} width="78" height="13" rx="3" fill="#fff" stroke="#e11d48" strokeWidth="0.8" opacity="0.95" />
        <text x={padLeft + 45} y={objY - 6.5} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#e11d48" letterSpacing="0.5">SEUIL {target} %</text>

        {/* dernier point : halo pulsé */}
        <circle cx={last[0]} cy={last[1]} r="9" fill={PENCIL} opacity="0.12">
          <animate attributeName="r" values="6;12;6" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.22;0.04;0.22" dur="2.2s" repeatCount="indefinite" />
        </circle>

        {/* points + survol */}
        {points.map((p, i) => {
          const [cx, cy] = pts[i];
          const isHovered = hoveredIndex === i;
          const isLast = i === points.length - 1;
          return (
            <g key={i} onMouseEnter={() => setHoveredIndex(i)} style={{ cursor: 'pointer' }}>
              <circle cx={cx} cy={cy} r={16} fill="transparent" />
              <circle cx={cx} cy={cy} r={isHovered ? 5 : isLast ? 4.2 : 3.2} fill={isHovered || isLast ? PENCIL : '#fff'} stroke={PENCIL} strokeWidth="1.8" filter="url(#pencil)" />
              {isHovered && (
                <g>
                  <rect x={cx - 30} y={cy - 32} width="60" height="22" rx="5" fill="#0f1020" />
                  <text x={cx} y={cy - 18} textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="700">{p.value}% · {String(Math.round(p.value * 2) / 10).replace('.', ',')}/20</text>
                </g>
              )}
            </g>
          );
        })}

        {/* dates */}
        {points.map((p, i) => {
          const isLast = i === points.length - 1;
          if (!isLast && (i % labelStep !== 0 || i > points.length - 1 - Math.ceil(labelStep / 2))) return null;
          return <text key={i} x={getX(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#6b7280">{p.label}</text>;
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
