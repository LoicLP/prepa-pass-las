'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTimer } from '@/hooks/useTimer';
import { SUBJECTS } from '@/data/subjects';
import { FICHES_DATA } from '@/data/fiches';
import { QUESTIONS } from '@/data/questions';
import { shuffleAllOptions } from '@/utils/shuffle';
import { SUBJECT_COLORS, SUBJECT_ICONS, getSubjectName } from '@/data/constants';
import { useGeminiQuestions } from '@/hooks/useGeminiQuestions';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/contexts/PremiumContext';
import { supabase } from '@/lib/supabase';
import { track } from '@/lib/track';
import { getProfile, styleFor, VOIES, CONCOURS_DATES, programFor } from '@/lib/profile';
import { FACS, mccFor, facById } from '@/data/facs';
import { facExams } from '@/data/facExams';
import { strategyFor } from '@/lib/bareme';
import { levelOf } from '@/lib/mastery';
import { useSupabaseStats } from '@/hooks/useSupabaseStats';
import LoginRequiredModal from '@/components/ui/LoginRequiredModal';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { FLUO_HEX } from '@/components/fiches/BristolCard';
import { xpForSession } from '@/lib/gamification';

/* ========== CONSTANTS ========== */
const LOADING_TIPS = [
  { icon: '\u{1F4A1}', text: 'Relisez vos erreurs apr\u00e8s chaque QCM pour progresser plus vite.' },
  { icon: '\u{1F3AF}', text: 'Visez 70% de bonnes r\u00e9ponses avant de passer \u00e0 un nouveau chapitre.' },
  { icon: '\u23F1\uFE0F', text: 'En conditions r\u00e9elles, comptez ~1min30 par question.' },
  { icon: '\u{1F4DA}', text: 'Alternez entre diff\u00e9rentes mati\u00e8res pour renforcer la m\u00e9morisation.' },
  { icon: '\u{1F501}', text: 'La r\u00e9p\u00e9tition espac\u00e9e est la cl\u00e9 pour retenir sur le long terme.' },
  { icon: '\u{1F9E0}', text: 'Faire des QCM est plus efficace que relire ses cours passivement.' },
];

/* ========== HELPERS ========== */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getColors(colorName) {
  return SUBJECT_COLORS[colorName] || SUBJECT_COLORS.primary;
}

function getIconPath(subjectId) {
  return SUBJECT_ICONS[subjectId]?.path || SUBJECT_ICONS.anatomie.path;
}

/* ========== SUB-COMPONENTS ========== */

/* Bouton retour commun aux écrans de préparation : pastille blanche, flèche dans un disque,
   la flèche glisse vers la gauche au survol. */
function BackButton({ onClick, children = 'Retour', className = '' }) {
  return (
    <button onClick={onClick} className={`group inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-white border border-gray-200 text-[13px] font-semibold text-gray-600 shadow-[0_1px_2px_rgba(15,16,32,0.04)] hover:border-indigo-300 hover:text-indigo-700 hover:shadow-[0_4px_12px_-4px_rgba(79,70,229,0.25)] transition-all ${className}`}>
      <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
        <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
      </span>
      {children}
    </button>
  );
}

function SubjectIcon({ subjectId, className = 'w-5 h-5' }) {
  const path = getIconPath(subjectId);
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

/* Confirmation modal before starting a fiche-based QCM */
function StartConfirmModal({ fiche, subject, questionCount, onConfirm, onCancel }) {
  const colors = getColors(subject?.color);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl border border-gray-200 p-6 max-w-sm w-full shadow-xl animate-[modalEnter_0.25s_ease-out]">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
            <SubjectIcon subjectId={subject?.id} className={`w-5 h-5 ${colors.icon}`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">{subject?.name || 'Sujet libre'}</p>
            <h3 className="font-bold text-gray-900 text-sm">{fiche.title}</h3>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">{fiche.summary}</p>
        <div className="flex items-center justify-between mb-5 px-1">
          <span className="text-sm text-gray-500">Questions :</span>
          <span className="font-bold text-gray-900">{questionCount}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 text-sm hover:border-gray-300 transition-colors">
            Annuler
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            Commencer
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* Quit confirmation modal */
function QuitModal({ answered, total, score, timerFormatted, onContinue, onQuit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onContinue} />
      <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-[modalEnter_0.25s_ease-out]">
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Quitter le QCM ?</h3>
          <p className="text-sm text-gray-500">Votre progression sera perdue.</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 mb-5 flex justify-around text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">{answered}/{total}</p>
            <p className="text-xs text-gray-500">Repondues</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div>
            <p className="text-lg font-bold text-gray-900">{score}</p>
            <p className="text-xs text-gray-500">Correctes</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div>
            <p className="text-lg font-bold text-gray-900">{timerFormatted}</p>
            <p className="text-xs text-gray-500">Temps</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onContinue} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 text-sm hover:border-gray-300 transition-colors">
            Continuer
          </button>
          <button onClick={onQuit} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== À CONSOLIDER ==========
   Banque de toutes les réponses fausses. Dans n'importe quelle session :
   - bonne réponse à une question de la pile → elle en est retirée ;
   - mauvaise réponse → elle est ajoutée (ou conservée si déjà présente). */
const REVIEW_QUEUE_MAX = 200;

function updateReviewQueue(queue, answersList, topic) {
  const next = [...queue];
  const keyOf = q => q?.question; // le texte de la question sert d'identifiant (stable, y compris pour les questions IA)
  for (const a of answersList) {
    const key = keyOf(a.question);
    if (!key) continue;
    const idx = next.findIndex(e => keyOf(e.question) === key);
    if (a.correct) {
      if (idx !== -1) next.splice(idx, 1); // maîtrisée → on la retire
    } else if (idx === -1) {
      next.push({
        question: a.question,
        subject: topic?.subject || a.question.subject || 'custom',
        subjectName: topic?.subjectName || 'Sujet libre',
        addedAt: new Date().toISOString(),
      });
    }
  }
  return next.slice(-REVIEW_QUEUE_MAX);
}

/* ========== SUBJECT DATA (for subject picker view) ========== */
const QCM_SUBJECT_DATA = [
  { code: 'UE1', id: 'chimie',      name: 'Chimie / Biochimie',  accent: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  { code: 'UE2', id: 'biocell',     name: 'Biologie cellulaire', accent: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  { code: 'UE3', id: 'biophysique', name: 'Biophysique',          accent: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  { code: 'UE4', id: 'biostats',    name: 'Biostatistiques',      accent: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
  { code: 'UE5', id: 'anatomie',    name: 'Anatomie',             accent: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
  { code: 'UE6', id: 'ssh',         name: 'SSH / Éthique',        accent: '#e11d48', bg: '#fff1f2', border: '#fecdd3' },
  { code: 'UE7', id: 'physiologie', name: 'Physiologie',          accent: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  { code: 'UE8', id: 'medicament',  name: 'Médicament',           accent: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
  { code: 'UE9', id: 'histo',       name: 'Histologie / Embryologie', accent: '#c026d3', bg: '#fdf4ff', border: '#f5d0fe' },
];

// Normalisation pour une recherche insensible à la casse et aux accents
const norm = (s) => (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

/* ========== MAIN PAGE COMPONENT ========== */
export default function QCMPage({ initialConfig = null, onBack = null, onViewChange = null }) {
  // ----- State machine -----
  const [view, setView] = useState('hero');
  const [questionCount, setQuestionCount] = useState(10);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isValidated, setIsValidated] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [pendingFiche, setPendingFiche] = useState(null);
  const [customText, setCustomText] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [launcherQuery, setLauncherQuery] = useState(''); // barre de recherche unifiée (mode « lanceur »)
  const [pendingLaunch, setPendingLaunch] = useState(null); // QCM choisi, en attente du choix du nombre de questions
  const [flashConfig, setFlashConfig] = useState(null); // config de la session éclair, en attente de confirmation
  const [flashSubjectId, setFlashSubjectId] = useState(null); // matière choisie pour la session éclair
  const [resultsFilter, setResultsFilter] = useState('all');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [welcomeExamDate, setWelcomeExamDate] = useState(null); // date choisie sur l'écran de bienvenue
  const [welcomeVoie, setWelcomeVoie] = useState(null);
  const [welcomeFac, setWelcomeFac] = useState('');
  const qStartRef = useRef(Date.now()); // départ du chrono de la question courante (analyse des erreurs)
  const [tipIndex, setTipIndex] = useState(0);
  const [correctionOpen, setCorrectionOpen] = useState(true);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [reviewPool, setReviewPool] = useState([]); // pile « À consolider » en attente de choix du nombre
  const [reviewCountChoice, setReviewCountChoice] = useState(10); // nombre de questions choisi par l'utilisateur
  const [xpPop, setXpPop] = useState(null); // animation « +X XP » sur bonne réponse
  const pillsRef = useRef(null);

  // ----- Hooks -----
  const { user } = useAuth();
  const { isEssentiel } = usePremium();
  const prog = useMemo(() => programFor(getProfile(user)), [user]); // UE de la fac d'abord
  const timer = useTimer({ mode: 'up' });
  const [stats, setStats] = useSupabaseStats(user?.id, 'qcm_stats');
  const { generateQuestions: generateAIQuestions, isGenerating } = useGeminiQuestions();
  const searchParams = useSearchParams();

  // Remonte la vue courante au parent (le dashboard masque la sidebar en mode immersif)
  useEffect(() => { onViewChange?.(view); }, [view, onViewChange]);

  // Page publique /qcm : un utilisateur connecté est redirigé vers son dashboard
  const router = useRouter();
  useEffect(() => {
    if (!onBack && user) router.replace('/dashboard?open=qcm');
  }, [onBack, user, router]);

  const totalDone = stats.sessions?.length || 0;
  const avgScore = totalDone > 0 ? Math.round(stats.sessions.reduce((a, s) => a + (s.percentage || s.score || 0), 0) / totalDone) : 0;
  const fichesCount = FICHES_DATA?.length || 0;

  // ----- Données d'accès rapide (matières récentes + pile à consolider) -----
  const reviewQueueCount = stats.reviewQueue?.length || 0;

  // ----- Static question selection (fallback) -----
  const generateStaticQuestions = useCallback((topic, count) => {
    let pool = [];
    if (topic.type === 'fiche') {
      pool = QUESTIONS.filter(q => q.subject === topic.subject);
    } else if (topic.type === 'custom') {
      if (topic.subject) {
        pool = QUESTIONS.filter(q => q.subject === topic.subject);
      } else {
        pool = [...QUESTIONS];
      }
    }
    const shuffled = shuffleArray(pool);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }, []);

  // ----- Helper to launch quiz with questions -----
  const launchWithQuestions = useCallback((qs) => {
    if (!qs || qs.length === 0) {
      setView('hero');
      return;
    }
    // Les propositions sont mélangées à chaque session : dans la banque statique
    // la bonne réponse est presque toujours en 2e/3e position.
    setQuestions(shuffleAllOptions(qs));
    setCurrentIndex(0);
    setScore(0);
    setAnswers(new Array(qs.length).fill(null));
    setIsValidated(false);
    setStreak(0);
    setMaxStreak(0);
    timer.reset();
    timer.start();
    setView('quiz');
  }, [timer]);

  // ----- Reprise d'une session interrompue -----
  const RESUME_KEY = 'qcm_resume';
  const clearResume = useCallback(() => { try { localStorage.removeItem(RESUME_KEY); } catch {} }, []);

  const resumeQuiz = useCallback((st) => {
    if (!st?.questions?.length) { setView('hero'); return; }
    setSelectedTopic(st.selectedTopic);
    setQuestions(st.questions);
    setAnswers(st.answers);
    setCurrentIndex(st.currentIndex);
    setScore(st.score);
    setStreak(st.streak);
    setMaxStreak(st.maxStreak);
    setAiGenerated(!!st.aiGenerated);
    setIsValidated(st.answers[st.currentIndex] != null);
    timer.reset();
    timer.start();
    setView('quiz');
  }, [timer]);

  // Sauvegarde continue de l'état du quiz (hors flash/consolidation, éphémères)
  useEffect(() => {
    if (view !== 'quiz' || !selectedTopic || selectedTopic.flash || selectedTopic.demo || selectedTopic.type === 'review') return;
    if (!questions.length) return;
    try {
      localStorage.setItem(RESUME_KEY, JSON.stringify({
        selectedTopic, questions, answers, currentIndex, score, streak, maxStreak, aiGenerated,
        savedAt: Date.now(),
      }));
    } catch {}
  }, [view, selectedTopic, questions, answers, currentIndex, score, streak, maxStreak, aiGenerated]);

  // ----- Start quiz (AI generation + static fallback) -----
  const startQuiz = useCallback(async (topic) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    // Limite 1 QCM/jour en gratuit
    if (!isEssentiel) {
      const today = new Date().toISOString().split('T')[0];
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('qcm_today_date, qcm_today_count')
        .eq('id', user.id)
        .single();

      const lastDate = profile?.qcm_today_date || '';
      const todayCount = lastDate === today ? (profile?.qcm_today_count || 0) : 0;

      if (todayCount >= 1) {
        track('daily_limit_reached', { todayCount });
        setShowUpgradeModal(true);
        return;
      }

      await supabase.from('user_profiles').upsert({
        id: user.id,
        qcm_today_date: today,
        qcm_today_count: todayCount + 1,
        updated_at: new Date().toISOString(),
      });
    }
    setSelectedTopic(topic);
    setView('loading');

    // Try AI generation first
    const subjectName = topic.subject ? (topic.subjectName || getSubjectName(topic.subject)) : (topic.title || topic.subjectName);
    const ficheTopic = topic.title || null;
    const ficheContent = topic.content || null;

    // Prioritize count passed directly in topic object (e.g. from dashboard onboarding URL param)
    const effectiveCount = topic.count || questionCount;

    if (topic.subject || ficheTopic) {
      const result = await generateAIQuestions(topic.subject, subjectName, effectiveCount, 'qcm', ficheTopic, ficheContent, styleFor(getProfile(user)));
      // result is either { questions, aiGenerated, topic } or null
      const aiQuestions = result?.questions ?? result;
      if (Array.isArray(aiQuestions) && aiQuestions.length > 0) {
        setAiGenerated(result?.aiGenerated === true);
        launchWithQuestions(aiQuestions);
        return;
      }
    }

    // Fallback to static questions
    setAiGenerated(false);
    const qs = generateStaticQuestions(topic, effectiveCount);
    launchWithQuestions(qs);
  }, [user, isEssentiel, questionCount, generateStaticQuestions, generateAIQuestions, launchWithQuestions]);

  // ----- Fiche selection flow -----
  const confirmFicheStart = useCallback(() => {
    if (!pendingFiche) return;
    const { fiche, subject } = pendingFiche;
    setPendingFiche(null);
    startQuiz({
      type: 'fiche',
      subject: fiche.subject,
      subjectName: subject?.name || '',
      title: fiche.title,
      summary: fiche.summary,
      content: fiche.content || null,
    });
  }, [pendingFiche, startQuiz]);

  // ----- Auto-start from URL param ?fiche=<id> -----
  useEffect(() => {
    const ficheId = searchParams?.get('fiche');
    if (!ficheId) return;
    const fiche = FICHES_DATA.find(f => f.id === ficheId);
    if (!fiche) return;
    const subject = SUBJECTS.find(s => s.id === fiche.subject);
    // Show the confirmation modal (same flow as selecting from the list)
    setPendingFiche({ fiche, subject });
    setView('hero');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ----- Auto-start from URL param ?subject=<id>&count=<n> -----
  useEffect(() => {
    const subjectId = searchParams?.get('subject');
    if (!subjectId) return;
    const subject = SUBJECTS.find(s => s.id === subjectId);
    if (!subject) return;
    const countParam = parseInt(searchParams?.get('count') || '', 10);
    const count = [5, 10, 15, 20, 30].includes(countParam) ? countParam : undefined;
    startQuiz({
      type: 'custom',
      subject: subject.id,
      subjectName: subject.name,
      title: subject.name,
      count,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ----- Auto-filter from URL param ?ue=<id> (depuis onboarding dashboard) -----
  useEffect(() => {
    const ueId = searchParams?.get('ue');
    if (!ueId) return;
    const subject = SUBJECTS.find(s => s.id === ueId);
    if (!subject) return;
    // Préfiltre la liste des fiches sur cette matière, sans lancer de quiz
    setSubjectFilter(ueId);
    setView('hero');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ----- Auto-start from URL param ?topic=<text> (depuis onboarding dashboard) -----
  useEffect(() => {
    const topicText = searchParams?.get('topic');
    if (!topicText?.trim()) return;
    startQuiz({
      type: 'custom',
      subject: null,
      subjectName: 'Sujet libre',
      title: topicText.trim().length > 60 ? topicText.trim().substring(0, 57) + '...' : topicText.trim(),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ----- Auto-start/navigate from initialConfig prop (mode embarqué dashboard) -----
  useEffect(() => {
    if (!initialConfig) return;
    if (initialConfig.initialView) {
      // Navigation vers une vue spécifique (ex: fichesSelection avec filtre matière)
      if (initialConfig.initialSubjectFilter) setSubjectFilter(initialConfig.initialSubjectFilter);
      setView(initialConfig.initialView);
    } else if (initialConfig.type === 'review') {
      // Session de consolidation depuis la pile « À consolider »
      startReviewQuiz(initialConfig);
    } else if (initialConfig.type === 'resume' && initialConfig.resumeState) {
      // Reprise d'une session interrompue
      resumeQuiz(initialConfig.resumeState);
    } else if (initialConfig.welcome) {
      // Premier QCM de bienvenue (nouvel inscrit) : écran d'intro dédié
      setView('welcomeIntro');
    } else if (initialConfig.flash) {
      // Session éclair : on affiche d'abord l'écran d'intro
      setFlashConfig(initialConfig);
      setFlashSubjectId(initialConfig.subject || null);
      setView('flashIntro');
    } else {
      // Lancement direct du quiz
      startQuiz(initialConfig);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Session de consolidation (révisions espacées) -----
  // Lance une consolidation sur un sous-ensemble aléatoire de `count` questions (ou toutes si null)
  const launchReviewWith = useCallback((entries, count) => {
    setSelectedTopic({ type: 'review', subject: 'review', subjectName: 'À consolider', title: 'À consolider' });
    setAiGenerated(false);
    const shuffled = shuffleArray(entries.map(e => e.question));
    launchWithQuestions(count ? shuffled.slice(0, count) : shuffled);
  }, [launchWithQuestions]);

  const startReviewQuiz = useCallback((cfg) => {
    if (!user) { setShowLoginModal(true); return; }
    const entries = cfg.reviewQuestions || [];
    if (entries.length === 0) { setView('hero'); return; }
    setReviewPool(entries);
    // On demande systématiquement combien de questions travailler (sauf s'il n'y en a qu'une)
    if (entries.length > 1) { setReviewCountChoice(Math.min(10, entries.length)); setView('reviewCount'); return; }
    // Pas de génération IA ni de limite quotidienne : on rejoue des questions déjà vues
    launchReviewWith(entries, null);
  }, [user, launchReviewWith]);

  // ----- Premier QCM de bienvenue (nouvel inscrit) -----
  // 5 questions statiques → démarrage instantané, session réelle (stats + série lancées).
  const launchWelcome = useCallback(() => {
    // Positionnement doux : deux questions par matière, sans note — juste un point de départ
    setSelectedTopic({ type: 'custom', subject: null, subjectName: 'Bienvenue', title: 'Faisons connaissance', placement: true });
    setAiGenerated(false);
    const bySub = {};
    shuffleArray(QUESTIONS.filter(q => prog.has(q.subject))).forEach(q => { (bySub[q.subject] ||= []); if (bySub[q.subject].length < 2) bySub[q.subject].push(q); });
    launchWithQuestions(shuffleArray(Object.values(bySub).flat()));
  }, [launchWithQuestions, prog]);

  // ----- Démo découverte (page publique, sans compte) -----
  // 5 questions de la banque statique, aucune sauvegarde ni limite : un avant-goût avant inscription.
  const launchDemo = useCallback(() => {
    setSelectedTopic({ type: 'custom', subject: null, subjectName: 'Démo découverte', title: 'Démo découverte', demo: true });
    setAiGenerated(false);
    launchWithQuestions(shuffleArray([...QUESTIONS]).slice(0, 5));
  }, [launchWithQuestions]);

  // ----- Custom quiz start -----
  const startCustomQuiz = useCallback(() => {
    if (!customText.trim()) return;
    startQuiz({
      type: 'custom',
      subject: null,
      subjectName: 'Sujet libre',
      title: customText.trim().length > 60 ? customText.trim().substring(0, 57) + '...' : customText.trim(),
    });
  }, [customText, startQuiz]);

  useEffect(() => { qStartRef.current = Date.now(); }, [currentIndex, view]);
  const qElapsed = () => Math.max(1, Math.round((Date.now() - qStartRef.current) / 1000));

  // Écran de bienvenue : date, voie, faculté, heures → métadonnées du compte (best effort)
  const saveWelcomeProfile = async (extra = {}) => {
    if (!supabase || !user) return;
    const prev = getProfile(user);
    const facBareme = !user?.user_metadata?.profile?.bareme && mccFor(welcomeFac)?.bareme; // barème des MCC si l'étudiant n'en a pas choisi
    const profile = { ...prev, ...(welcomeVoie ? { voie: welcomeVoie } : {}), ...(welcomeFac ? { fac: welcomeFac } : {}), ...(facBareme ? { bareme: facBareme } : {}), ...extra };
    const data = { profile, ...(welcomeExamDate ? { exam_date: welcomeExamDate } : {}) };
    try { await supabase.auth.updateUser({ data }); } catch {}
  };

  // ----- « Je ne sais pas » : comptée ratée (→ À consolider), streak intact -----
  const answerDontKnow = useCallback(() => {
    if (isValidated) return;
    const q = questions[currentIndex];
    const correctIndex = q.options.findIndex(o => o.correct);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = { question: q, selected: null, correct: false, correctIndex, idk: true, t: qElapsed() };
    setAnswers(newAnswers);
    setIsValidated(true);
  }, [isValidated, questions, currentIndex, answers]);

  // ----- Answer a question (instant feedback) -----
  const answerQuestion = useCallback((optionIndex) => {
    if (isValidated) return;
    const q = questions[currentIndex];
    const correctIndex = q.options.findIndex(o => o.correct);
    const isCorrect = optionIndex === correctIndex;

    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    if (newStreak > maxStreak) setMaxStreak(newStreak);

    // Animation « +X XP » — pondération identique à la lib gamification
    if (isCorrect) {
      const amount = selectedTopic?.type === 'review' ? 6 : selectedTopic?.flash ? 4 : 2;
      setXpPop({ amount, key: currentIndex });
    }

    const newAnswers = [...answers];
    newAnswers[currentIndex] = { question: q, selected: optionIndex, correct: isCorrect, correctIndex, t: qElapsed() };
    setAnswers(newAnswers);
    setIsValidated(true);
  }, [isValidated, questions, currentIndex, score, streak, maxStreak, answers, selectedTopic]);

  // ----- Navigation -----
  const findNextUnanswered = useCallback(() => {
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === null) return i;
    }
    return answers.length;
  }, [answers]);

  const nextQuestion = useCallback(() => {
    const next = findNextUnanswered();
    if (next < questions.length) {
      setCurrentIndex(next);
      setIsValidated(false);
    } else {
      showResults();
    }
  }, [findNextUnanswered, questions.length]);

  const goToQuestion = useCallback((index) => {
    if (answers[index] !== null || index === findNextUnanswered()) {
      setCurrentIndex(index);
      setIsValidated(!!answers[index]);
    }
  }, [answers, findNextUnanswered]);

  // ----- Show results -----
  const showResults = useCallback(() => {
    timer.stop();
    clearResume();
    const validAnswers = answers.filter(a => a !== null);
    const correctCount = validAnswers.filter(a => a.correct).length;
    const pct = validAnswers.length > 0 ? Math.round((correctCount / validAnswers.length) * 100) : 0;

    // Nature des erreurs : réponse rapide et fausse → lecture ; fausse au rythme normal → connaissance ; « je ne sais pas » → idk
    const ts = validAnswers.map(a => a.t).filter(Number.isFinite).sort((a, b) => a - b);
    const medianT = ts.length ? ts[Math.floor(ts.length / 2)] : 0;
    const avgT = ts.length ? Math.round(ts.reduce((a, b) => a + b, 0) / ts.length) : null;
    const errNature = validAnswers.reduce((acc, a) => {
      if (a.correct) return acc;
      if (a.idk) acc.idk += 1; else if (Number.isFinite(a.t) && a.t < Math.max(6, medianT * 0.45)) acc.lecture += 1; else acc.connaissance += 1;
      return acc;
    }, { lecture: 0, connaissance: 0, idk: 0 });

    // Positionnement : score par matière enregistré dans le profil (jamais affiché comme une note)
    if (selectedTopic?.placement && supabase && user) {
      const per = {};
      validAnswers.forEach(a => { const sub = a.question?.subject; if (!sub) return; (per[sub] ||= { c: 0, n: 0 }); per[sub].n += 1; if (a.correct) per[sub].c += 1; });
      const placement = Object.fromEntries(Object.entries(per).map(([k, v]) => [k, Math.round((v.c / v.n) * 100)]));
      const profile = { ...getProfile(user), placement, placementAt: new Date().toISOString(), level: 'positionne' };
      supabase.auth.updateUser({ data: { profile } }).catch(() => {});
    }

    // Save session + mise à jour de la file de révisions espacées (jamais en mode démo)
    const isReviewSession = selectedTopic?.type === 'review';
    if (!selectedTopic?.demo) setStats(prev => {
      const newSession = {
        subject: selectedTopic?.subject || 'custom',
        subjectName: selectedTopic?.subjectName || 'Sujet libre',
        topic: selectedTopic?.title || '',
        correct: correctCount,
        total: validAnswers.length,
        percentage: pct,
        duration: timer.seconds,
        date: new Date().toISOString(),
        ...(selectedTopic?.flash ? { flash: true } : {}),
        ...(selectedTopic?.placement ? { placement: true } : {}),
        errNature, avgT,
      };
      const sessions = [newSession, ...(prev.sessions || [])].slice(0, 50);
      const reviewQueue = updateReviewQueue(prev.reviewQueue || [], validAnswers, selectedTopic);
      return { ...prev, sessions, reviewQueue, totalCorrect: (prev.totalCorrect || 0) + correctCount, totalAnswered: (prev.totalAnswered || 0) + validAnswers.length };
    });

    setView('results');
    setResultsFilter('all');
  }, [timer, answers, selectedTopic, setStats]);

  // ----- Session éclair : fin automatique à 5 minutes -----
  useEffect(() => {
    if (view !== 'quiz' || !selectedTopic?.flash) return;
    if (timer.seconds >= 300) showResults();
  }, [view, selectedTopic, timer.seconds, showResults]);

  // Tell nextQuestion about showResults
  const handleNextOrResults = useCallback(() => {
    const answeredCount = answers.filter(a => a !== null).length;
    if (answeredCount >= questions.length) {
      showResults();
    } else {
      nextQuestion();
    }
  }, [answers, questions.length, showResults, nextQuestion]);

  // ----- Quit -----
  const confirmQuit = useCallback(() => {
    timer.stop();
    clearResume(); // abandon volontaire → pas de bannière de reprise
    setShowQuitModal(false);
    if (onBack) {
      onBack();
    } else {
      setView('hero');
    }
  }, [timer, onBack]);

  // ----- Keyboard shortcuts -----
  useEffect(() => {
    if (view !== 'quiz') return;
    const handler = (e) => {
      if (showQuitModal) return;
      const key = e.key.toUpperCase();
      if (!isValidated) {
        const map = { A: 0, B: 1, C: 2, D: 3, '1': 0, '2': 1, '3': 2, '4': 3 };
        if (key in map) { e.preventDefault(); answerQuestion(map[key]); return; }
      }
      if (isValidated && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault(); handleNextOrResults(); return;
      }
      if (e.key === 'Escape') { e.preventDefault(); setShowQuitModal(true); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [view, isValidated, showQuitModal, answerQuestion, handleNextOrResults]);

  // ----- Loading tips rotation -----
  useEffect(() => {
    if (view !== 'loading') return;
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % LOADING_TIPS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [view]);

  // ----- Auto-scroll active pill into view -----
  useEffect(() => {
    if (view !== 'quiz' || !pillsRef.current) return;
    const active = pillsRef.current.children[currentIndex];
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [view, currentIndex]);

  // ----- Filtered fiches -----
  const getFilteredFiches = useCallback(() => {
    let fiches = FICHES_DATA || [];
    if (subjectFilter !== 'all') fiches = fiches.filter(f => f.subject === subjectFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      fiches = fiches.filter(f => f.title.toLowerCase().includes(q) || f.summary.toLowerCase().includes(q));
    }
    return fiches;
  }, [subjectFilter, searchQuery]);

  // ==================== RENDER VIEWS ====================

  // En mode embarqué (dashboard), on saute le hero — on attend le démarrage auto.
  // Les modales (connexion / limite quotidienne) doivent quand même s'afficher,
  // sinon l'utilisateur bloqué voit un overlay vide.
  if (view === 'hero' && initialConfig && !initialConfig.initialView) {
    return (
      <>
        {showLoginModal && <LoginRequiredModal onClose={() => { setShowLoginModal(false); onBack?.(); }} />}
        {showUpgradeModal && <UpgradeModal requiredTier="essentiel" onClose={() => { setShowUpgradeModal(false); onBack?.(); }} />}
      </>
    );
  }

  // ===== HERO VIEW =====
  if (view === 'hero') {
    return (
      <>
        <section className="gradient-hero noise-overlay dot-grid pt-28 pb-14 md:pt-36 md:pb-20 relative overflow-hidden">
          <div className="blob-1" />
          <div className="blob-2" />
          <div className="absolute w-[280px] h-[280px] bg-violet-300/10 rounded-full blur-[80px] top-1/3 left-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="geo-circle-light w-40 h-40 top-24 right-[10%] hidden lg:block" />
          <div className="geo-ring-light w-64 h-64 -bottom-16 left-[5%] hidden lg:block" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left: Text */}
              <div>
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-primary-200 mb-6">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                  </span>
                  <span className="text-sm font-semibold text-primary-700">Questions illimit&eacute;es</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-5">
                  QCM{' '}
                  <span className="bg-gradient-to-r from-primary-600 via-violet-600 to-primary-500 bg-clip-text text-transparent">
                    d&apos;entra&icirc;nement
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                  Des <strong className="text-gray-900">questions illimit&eacute;es</strong> sur tous les sujets du programme PASS/LAS. <strong className="text-gray-900">Correction imm&eacute;diate</strong>{' '}avec
                  explications d&eacute;taill&eacute;es.
                </p>
                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-5 sm:gap-6 mb-8">
                  <div className="flex items-center gap-3 transition-transform hover:-translate-y-0.5">
                    <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                    </div>
                    <div>
                      <div className="text-xl font-black text-gray-900">&infin;</div>
                      <div className="text-xs font-medium text-gray-500">Questions</div>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-gray-200/60 hidden sm:block" />
                  <div className="flex items-center gap-3 transition-transform hover:-translate-y-0.5">
                    <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    </div>
                    <div>
                      <div className="text-xl font-black text-gray-900">Direct</div>
                      <div className="text-xs font-medium text-gray-500">Correction</div>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-gray-200/60 hidden sm:block" />
                  <div className="flex items-center gap-3 transition-transform hover:-translate-y-0.5">
                    <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                    </div>
                    <div>
                      <div className="text-xl font-black text-gray-900">{fichesCount}</div>
                      <div className="text-xs font-medium text-gray-500">Sujets</div>
                    </div>
                  </div>
                </div>
                {/* CTA */}
                {user ? (
                  <button
                    onClick={() => setView('modeChoice')}
                    className="group px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 flex items-center gap-3 text-lg"
                  >
                    Commencer un QCM
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/connexion"
                      className="group px-8 py-4 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/30 hover:opacity-90 flex items-center justify-center gap-3 text-lg"
                      style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                    >
                      Commencer gratuitement
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                    </Link>
                    <button
                      onClick={launchDemo}
                      className="px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl border-2 border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all flex items-center justify-center text-lg"
                    >
                      Essayer 5 questions sans compte
                    </button>
                  </div>
                )}
                {!user && (
                  <p className="mt-3 text-xs text-gray-400">
                    Sans carte bancaire · <strong className="text-violet-600">7 jours de Premium offerts</strong>{' '}
                    &agrave; l&apos;inscription
                  </p>
                )}
              </div>

              {/* Right: Mock QCM card */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-sm">
                  <div className="animate-[qcmFloat_5s_ease-in-out_infinite] bg-white rounded-2xl shadow-xl shadow-primary-500/10 border border-gray-100 p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Chimie / Biochimie</span>
                      <span className="text-xs font-mono font-semibold text-gray-400">Q3/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3">
                      <div className="h-1.5 bg-primary-500 rounded-full" style={{ width: '30%' }} />
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-3">Quel est le bilan net en ATP de la glycolyse ?</p>
                    <div className="space-y-1.5">
                      <div className="px-3 py-2 rounded-lg border border-gray-200 text-[11px] font-medium text-gray-500 flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500">A</span>4 ATP
                      </div>
                      <div className="px-3 py-2 rounded-lg border-2 border-emerald-400 bg-emerald-50 text-[11px] font-medium text-emerald-700 flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-emerald-100 flex items-center justify-center text-[9px] font-bold text-emerald-700">B</span>2 ATP
                        <svg className="w-3 h-3 ml-auto text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                      </div>
                      <div className="px-3 py-2 rounded-lg border-2 border-red-300 bg-red-50 text-[11px] font-medium text-red-600 flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-red-100 flex items-center justify-center text-[9px] font-bold text-red-600">C</span>36 ATP
                        <svg className="w-3 h-3 ml-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                      </div>
                    </div>
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                      <p className="text-[10px] text-emerald-700 leading-relaxed"><strong>Bonne r&eacute;ponse !</strong> La glycolyse produit 4 ATP bruts mais en consomme 2, soit un bilan net de 2 ATP...</p>
                    </div>
                  </div>
                  {totalDone > 0 ? (
                    <div className="animate-[qcmFloat_5s_ease-in-out_infinite_1.5s] bg-white rounded-2xl shadow-lg shadow-primary-500/5 border border-gray-100 p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{totalDone} session{totalDone > 1 ? 's' : ''}</p>
                          <p className="text-xs text-gray-500">Score moyen : <strong className={avgScore >= 70 ? 'text-emerald-600' : avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}>{avgScore}%</strong></p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-[qcmFloat_5s_ease-in-out_infinite_1.5s] bg-gradient-to-br from-primary-600 to-violet-600 rounded-2xl shadow-lg shadow-primary-500/20 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Correction imm&eacute;diate</p>
                          <p className="text-xs text-white/70">Explications d&eacute;taill&eacute;es apr&egrave;s chaque question</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ===== MODE CHOICE VIEW (« lanceur » — barre de recherche unifiée) =====
  if (view === 'modeChoice') {
    const q = launcherQuery.trim();
    const nq = norm(q);

    const subjectMatches = q ? QCM_SUBJECT_DATA.filter(s => norm(s.name).includes(nq) || norm(s.code).includes(nq)) : [];
    const ficheMatches = q ? FICHES_DATA.filter(f => norm(f.title).includes(nq)).slice(0, 4) : [];

    const askCount = (topic, meta) => { setLauncherQuery(''); setPendingLaunch({ topic, ...meta }); setView('countChoice'); };
    const launchSubject = (s) => askCount({ type: 'custom', subject: s.id, subjectName: s.name, title: s.name }, { label: s.name, sub: `Matière · ${s.code}`, accent: s.accent, bg: s.bg });
    const launchFiche = (f) => {
      const subj = SUBJECTS.find(x => x.id === f.subject);
      const m = subjectMeta(f.subject);
      askCount({ type: 'fiche', subject: f.subject, subjectName: subj?.name || '', title: f.title, summary: f.summary, content: f.content || null }, { label: f.title, sub: `Fiche${m ? ` · ${m.code}` : ''}`, accent: '#d97706', bg: '#fffbeb' });
    };
    const launchFree = () => { if (!q) return; askCount({ type: 'custom', subject: null, subjectName: q, title: q }, { label: q, sub: 'Sujet libre', accent: '#7c3aed', bg: '#f5f3ff' }); };
    const onLauncherKey = (e) => {
      if (e.key !== 'Enter' || !q) return;
      if (subjectMatches.length) launchSubject(subjectMatches[0]);
      else if (ficheMatches.length) launchFiche(ficheMatches[0]);
      else launchFree();
    };
    const subjectMeta = (id) => QCM_SUBJECT_DATA.find(s => s.id === id);

    return (
      <section className={`pb-16 bg-slate-50 ${onBack ? 'pt-6 md:pt-16' : 'pt-24 md:pt-28 min-h-screen'}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {onBack && (
            <BackButton onClick={onBack} className="md:hidden mb-5">Tableau de bord</BackButton>
          )}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-8" style={{ boxShadow: '0 1px 2px rgba(15,16,32,0.04), 0 24px 48px -24px rgba(79,70,229,0.18)' }}>
          {/* En-tête */}
          <div className="mb-6">
            <h2 className="font-jakarta text-[28px] md:text-[34px] font-black text-gray-900 tracking-tight leading-tight">Que veux-tu travailler&nbsp;?</h2>
            <p className="text-[15px] text-gray-500 mt-1.5">Tape une mati&egrave;re, une fiche ou un th&egrave;me, puis Entr&eacute;e.</p>
          </div>

          {/* Barre de recherche unifiée */}
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-slate-50 pl-5 pr-2.5 py-2.5 focus-within:bg-white focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.12)] transition-all">
            <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            <input
              type="text"
              autoFocus
              value={launcherQuery}
              onChange={e => setLauncherQuery(e.target.value)}
              onKeyDown={onLauncherKey}
              placeholder="Ex. « anatomie », « membrane », « cycle de Krebs »…"
              className="flex-1 min-w-0 text-[16px] text-gray-800 placeholder-gray-400 outline-none bg-transparent py-2"
            />
            {q && (
              <button
                onClick={() => { if (subjectMatches.length) launchSubject(subjectMatches[0]); else if (ficheMatches.length) launchFiche(ficheMatches[0]); else launchFree(); }}
                className="h-10 px-5 shrink-0 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
              >
                Lancer
              </button>
            )}
          </div>

          {/* Suggestions (quand on tape) OU reprise rapide (à vide) */}
          {q ? (
            <div className="mt-2 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden divide-y divide-gray-100">
              {subjectMatches.map(s => (
                <button key={`s-${s.id}`} onClick={() => launchSubject(s)} className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-gray-50 transition-colors">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                    <svg className="w-4 h-4" style={{ color: s.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg>
                  </span>
                  <span className="flex-1 min-w-0 text-sm font-semibold text-gray-800 truncate">{s.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 shrink-0">Matière · {s.code}</span>
                </button>
              ))}
              {ficheMatches.map(f => {
                const m = subjectMeta(f.subject);
                return (
                  <button key={`f-${f.id}`} onClick={() => launchFiche(f)} className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-gray-50 transition-colors">
                    <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                    </span>
                    <span className="flex-1 min-w-0 text-sm font-semibold text-gray-800 truncate">{f.title}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 shrink-0">Fiche{m ? ` · ${m.code}` : ''}</span>
                  </button>
                );
              })}
              <button onClick={launchFree} className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-violet-50 transition-colors">
                <span className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                </span>
                <span className="flex-1 min-w-0 text-sm text-gray-800 truncate">Générer un QCM sur «&nbsp;<span className="font-semibold">{q}</span>&nbsp;»</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-violet-400 shrink-0">Sujet libre</span>
              </button>
            </div>
          ) : reviewQueueCount > 0 && (
            <button
              onClick={() => startReviewQuiz({ reviewQuestions: stats.reviewQueue })}
              className="mt-4 w-full flex items-center gap-3.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 sm:px-5 py-3.5 text-left hover:bg-amber-100/70 hover:border-amber-300 transition-colors"
            >
              <span className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[15px] font-bold text-gray-900">Rejouer mes {reviewQueueCount} question{reviewQueueCount > 1 ? 's' : ''} rat&eacute;e{reviewQueueCount > 1 ? 's' : ''}</span>
                <span className="block text-xs text-amber-700/80 mt-0.5">Le plus efficace pour progresser</span>
              </span>
              <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            </button>
          )}

          {/* Modes secondaires — pour explorer plutôt que chercher */}
          <div className="mt-8">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Ou choisis</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onClick={() => setView('subjectSelection')} className="group flex sm:flex-col items-center sm:items-start gap-3 rounded-2xl border border-gray-200 bg-slate-50 p-4 text-left hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                <span className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-600/30">
                  <svg className="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg>
                </span>
                <span className="min-w-0"><span className="block text-[14px] font-bold text-gray-900 leading-tight">Une mati&egrave;re</span><span className="block text-[11px] text-gray-400 mt-0.5">{QCM_SUBJECT_DATA.length} UE</span></span>
              </button>
              <button onClick={() => setView('fichesSelection')} className="group flex sm:flex-col items-center sm:items-start gap-3 rounded-2xl border border-gray-200 bg-slate-50 p-4 text-left hover:bg-emerald-50 hover:border-emerald-300 transition-all">
                <span className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/30">
                  <svg className="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                </span>
                <span className="min-w-0"><span className="block text-[14px] font-bold text-gray-900 leading-tight">Une fiche</span><span className="block text-[11px] text-gray-400 mt-0.5">{fichesCount} fiches</span></span>
              </button>
              <button onClick={() => setView('customSelection')} className="group flex sm:flex-col items-center sm:items-start gap-3 rounded-2xl border border-gray-200 bg-slate-50 p-4 text-left hover:bg-violet-50 hover:border-violet-300 transition-all">
                <span className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shrink-0 shadow-sm shadow-violet-600/30">
                  <svg className="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                </span>
                <span className="min-w-0"><span className="block text-[14px] font-bold text-gray-900 leading-tight">Un th&egrave;me libre</span><span className="block text-[11px] text-gray-400 mt-0.5">QCM g&eacute;n&eacute;r&eacute; par l&rsquo;IA</span></span>
              </button>
            </div>
          </div>
          </div>
        </div>
        {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        {showUpgradeModal && <UpgradeModal requiredTier="essentiel" onClose={() => setShowUpgradeModal(false)} />}
      </section>
    );
  }

  // ===== WELCOME INTRO VIEW (premier QCM d'un nouvel inscrit) =====
  if (view === 'welcomeIntro') {
    return (
      <section className={`pb-16 bg-slate-50 flex items-center justify-center ${onBack ? 'pt-8 min-h-[70vh]' : 'pt-24 min-h-screen'}`}>
        <div className="w-full max-w-lg px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-500/10 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }}></div>
            <div className="w-20 h-20 mx-auto rounded-full bg-violet-100 flex items-center justify-center text-5xl mb-4 pricing-float">🦉</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Bienvenue&nbsp;! On y va&nbsp;?</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Douze questions, <strong className="text-gray-900">deux par matière</strong>, pour savoir par où commencer.
              Pas de note, pas de classement : si tu débutes, tu vas en rater — c&apos;est prévu.
            </p>
            {/* Date de concours : Pico compte à rebours et personnalise tes rappels */}
            {!user?.user_metadata?.exam_date && (
              <div className="mb-6 text-left max-w-xs mx-auto">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Ton concours, c&apos;est quand&nbsp;?</p>
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    const fd = facExams(welcomeFac || user?.user_metadata?.profile?.fac)?.dates; const fname = facById(welcomeFac || user?.user_metadata?.profile?.fac)?.city;
                    const lab = (d) => new Date(d).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }).replace(/^./, c => c.toUpperCase());
                    if (fd?.s1 || fd?.s2) return [fd.s1 && [fd.s1, lab(fd.s1), `Partiels S1 · ${fname}${fd.approx ? ' (à confirmer)' : ''}`], fd.s2 && [fd.s2, lab(fd.s2), `Partiels S2 · ${fname}${fd.approx ? ' (à confirmer)' : ''}`]].filter(Boolean);
                    return [['2026-12-14', 'Déc. 2026', 'Écrits du S1'], ['2027-05-17', 'Mai 2027', 'Écrits du S2']];
                  })().map(([d, l, sub]) => (
                    <button key={d} type="button" onClick={() => setWelcomeExamDate(welcomeExamDate === d ? null : d)}
                      className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${welcomeExamDate === d ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'}`}>
                      <span className="block text-sm font-bold text-gray-900">{l}</span>
                      <span className="block text-[11px] text-gray-500">{sub}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Modifiable à tout moment depuis ton tableau de bord.</p>
              </div>
            )}
            {!user?.user_metadata?.profile?.voie && (
              <div className="mb-6 text-left max-w-xs mx-auto space-y-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Ta voie</p>
                  <div className="grid grid-cols-2 gap-2">
                    {VOIES.map(v => (
                      <button key={v.id} type="button" onClick={() => setWelcomeVoie(welcomeVoie === v.id ? null : v.id)} className={`rounded-xl border px-3 py-2 text-left transition-colors ${welcomeVoie === v.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'}`}>
                        <span className="block text-sm font-bold text-gray-900">{v.label}</span><span className="block text-[11px] text-gray-500">{v.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Ta faculté</p>
                  <select value={welcomeFac} onChange={e => setWelcomeFac(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-indigo-400">
                    <option value="">Choisir…</option>
                    {FACS.map(f => <option key={f.id} value={f.id}>{f.name}{f.city ? ` — ${f.city}` : ''}</option>)}
                  </select>
                  {mccFor(welcomeFac)?.bareme && <p className="mt-1.5 text-[11px] text-indigo-700 leading-snug">Bar&egrave;me de tes MCC appliqu&eacute; &agrave; tes examens blancs{mccFor(welcomeFac).confidence === 'officiel' ? '' : ' (source non officielle, à vérifier)'}. Modifiable dans Mon compte.</p>}
                </div>
              </div>
            )}
            <div className="space-y-2.5 mb-7 text-left max-w-xs mx-auto">
              {[
                ['🔥', <>Ta <strong>série de révisions</strong> démarre aujourd&apos;hui</>],
                ['🦉', <>Pico <strong>calibre tes recommandations</strong></>],
                ['✨', <>Tes premiers <strong>XP</strong> t&apos;attendent</>],
              ].map(([e, t], i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 border border-gray-100 rounded-xl px-3.5 py-2.5">
                  <span className="text-lg leading-none">{e}</span>
                  <span className="text-[13px] text-gray-700">{t}</span>
                </div>
              ))}
            </div>
            <button
              onClick={async () => { await saveWelcomeProfile(); launchWelcome(); }}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              C&apos;est parti
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </button>
            <button
              onClick={async () => { await saveWelcomeProfile({ level: 'debutant' }); onBack ? onBack() : setView('hero'); }}
              className="mt-3 text-sm text-gray-500 hover:text-gray-800 font-semibold transition-colors"
            >
              Je débute, je passe les questions
            </button>
            <p className="mt-2 text-[11px] text-gray-400">Tu pourras faire ce point de départ plus tard, quand tu auras vu quelques cours.</p>
          </div>
        </div>
      </section>
    );
  }

  // ===== FLASH INTRO VIEW (écran avant de lancer une session éclair) =====
  if (view === 'flashIntro') {
    const flashSubj = QCM_SUBJECT_DATA.find(s => s.id === flashSubjectId);
    const flashName = flashSubj?.name || flashConfig?.subjectName || 'Session éclair';
    const flashCount = flashConfig?.count || 8;
    const accent = '#d97706';
    const goFlash = () => {
      const t = { type: 'custom', subject: flashSubjectId, subjectName: flashName, title: flashName, count: flashCount, flash: true };
      setFlashConfig(null);
      startQuiz(t);
    };
    const ordered = [...prog.subjects, ...prog.others].map(su => ({ ...(QCM_SUBJECT_DATA.find(m => m.id === su.id) || {}), facLabel: su.facLabel })).filter(m => m.id);
    const facts = [[`${flashCount}`, 'questions'], ['5 min', 'environ'], ['XP ×2', 'par bonne réponse']];
    return (
      <section className={`pb-16 bg-slate-50 ${onBack ? 'pt-6 md:pt-16' : 'pt-24 md:pt-28 min-h-screen'}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {onBack
            ? <BackButton onClick={onBack} className="md:hidden mb-5">Tableau de bord</BackButton>
            : <BackButton onClick={() => { setFlashConfig(null); setView('hero'); }} className="mb-5" />}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-8" style={{ boxShadow: '0 1px 2px rgba(15,16,32,0.04), 0 24px 48px -24px rgba(217,119,6,0.3)' }}>
            {/* En-tête */}
            <div className="flex items-center gap-3.5 mb-6">
              <span className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white" style={{ background: accent, boxShadow: '0 4px 12px rgba(217,119,6,0.4)' }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
              </span>
              <div>
                <h2 className="font-jakarta text-[24px] md:text-[28px] font-black text-gray-900 tracking-tight leading-tight">Session &eacute;clair</h2>
                <p className="text-[14px] text-gray-500 mt-0.5">Un sprint de {flashCount} questions, parfait entre deux cours.</p>
              </div>
            </div>

            {/* Format */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {facts.map(([big, small]) => (
                <div key={small} className="rounded-2xl border border-gray-200 bg-slate-50 py-3.5 text-center">
                  <span className="font-jakarta block text-xl font-black leading-none text-gray-900">{big}</span>
                  <span className="block text-[11px] text-gray-400 mt-1.5">{small}</span>
                </div>
              ))}
            </div>

            {/* Matière */}
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">Mati&egrave;re</p>
            <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
              {ordered.map((m, i) => {
                const active = flashSubjectId === m.id;
                return (
                  <button key={m.id} onClick={() => setFlashSubjectId(m.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${i < ordered.length - 1 ? 'border-b border-gray-100' : ''} ${active ? '' : 'hover:bg-slate-50'}`} style={active ? { background: m.bg } : undefined}>
                    <span className="w-11 shrink-0 text-center text-[11px] font-extrabold tracking-wide rounded-md py-1" style={{ background: active ? m.accent : m.bg, color: active ? '#fff' : m.accent }}>{m.code}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-bold leading-tight" style={{ color: active ? m.accent : '#0f1020' }}>{m.name}</span>
                      {m.facLabel && m.facLabel !== m.name && <span className="hidden sm:block text-[11px] text-gray-400 truncate">{m.facLabel}</span>}
                    </span>
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors" style={{ borderColor: active ? m.accent : '#d1d5db', background: active ? m.accent : '#fff' }}>
                      {active && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                    </span>
                  </button>
                );
              })}
            </div>

            <button onClick={goFlash} className="w-full py-4 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-px" style={{ background: accent, boxShadow: '0 8px 20px -8px rgba(217,119,6,0.7)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
              Lancer la session &eacute;clair · {flashName}
            </button>
          </div>
        </div>
        {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        {showUpgradeModal && <UpgradeModal requiredTier="essentiel" onClose={() => setShowUpgradeModal(false)} />}
      </section>
    );
  }

  // ===== COUNT CHOICE VIEW (après le lanceur : « combien de questions ? ») =====
  if (view === 'countChoice') {
    if (!pendingLaunch) { setView('modeChoice'); return null; }
    const { topic, label, sub, accent = '#4f46e5', bg = '#eef2ff' } = pendingLaunch;
    const go = () => { const t = { ...topic, count: questionCount }; setPendingLaunch(null); startQuiz(t); };
    const back = () => { setPendingLaunch(null); setView('modeChoice'); };
    const COUNTS = [{ n: 5, min: 3 }, { n: 10, min: 6 }, { n: 20, min: 12 }, { n: 30, min: 18 }];
    return (
      <section className={`pb-16 bg-slate-50 ${onBack ? 'pt-6 md:pt-16' : 'pt-24 md:pt-28 min-h-screen'}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton onClick={back} className="mb-5">Changer de sujet</BackButton>

          <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-8" style={{ boxShadow: `0 1px 2px rgba(15,16,32,0.04), 0 24px 48px -24px ${accent}44` }}>
          {/* Sujet retenu */}
          <div className="flex items-center gap-3.5 mb-7">
            <span className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: accent, boxShadow: `0 4px 12px ${accent}55` }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{sub}</p>
              <p className="font-jakarta text-[22px] md:text-[26px] font-black text-gray-900 tracking-tight leading-tight truncate">{label}</p>
            </div>
          </div>

          {/* Longueur de la session */}
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Combien de questions&nbsp;?</p>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {COUNTS.map(({ n, min }) => {
              const active = questionCount === n;
              return (
                <button key={n} onClick={() => setQuestionCount(n)}
                  className="rounded-2xl border py-4 text-center transition-all"
                  style={{ borderColor: active ? accent : '#e5e7eb', background: active ? bg : '#f8fafc', boxShadow: active ? `0 0 0 3px ${accent}26` : undefined }}
                >
                  <span className="font-jakarta block text-2xl font-black leading-none" style={{ color: active ? accent : '#0f1020' }}>{n}</span>
                  <span className="block text-[11px] text-gray-400 mt-1.5">&asymp; {min} min</span>
                </button>
              );
            })}
          </div>

          <button onClick={go} className="w-full py-4 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-px" style={{ background: accent, boxShadow: `0 8px 20px -8px ${accent}99` }}>
            Lancer le QCM · {questionCount} questions
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">Correction et explication apr&egrave;s chaque question.</p>
          </div>
        </div>
        {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        {showUpgradeModal && <UpgradeModal requiredTier="essentiel" onClose={() => setShowUpgradeModal(false)} />}
      </section>
    );
  }

  // ===== SUBJECT SELECTION VIEW =====
  if (view === 'subjectSelection') {
    const pick = (m) => { setPendingLaunch({ topic: { type: 'custom', subject: m.id, subjectName: m.name, title: m.name }, label: m.name, sub: `Matière · ${m.code}`, accent: m.accent, bg: m.bg }); setView('countChoice'); };
    // Moyenne /20 et sessions par UE
    const perUE = {};
    for (const x of (stats.sessions || [])) {
      if (!x.subject) continue;
      const pct = Number.isFinite(x.percentage) ? x.percentage : (x.total > 0 ? Math.round((x.correct / x.total) * 100) : null);
      const e = (perUE[x.subject] ||= { n: 0, sum: 0, k: 0 }); e.n++; if (pct != null) { e.sum += pct; e.k++; }
    }
    const noteOf = (id) => { const e = perUE[id]; return e && e.k ? Math.round((e.sum / e.k) * 2) / 10 : null; };
    const ink = (n) => (n >= 14 ? '#15803d' : n >= 10 ? '#374151' : '#dc2626');
    const meta = (id) => QCM_SUBJECT_DATA.find(m => m.id === id);
    const main = (prog.known ? prog.subjects : SUBJECTS).map(su => ({ ...meta(su.id), facLabel: su.facLabel, description: su.description })).filter(m => m.id);
    const others = prog.known ? prog.others.map(su => ({ ...meta(su.id), description: su.description })).filter(m => m.id) : [];
    const Card = (m) => {
      const note = noteOf(m.id); const e = perUE[m.id];
      return (
        <button key={m.id} onClick={() => pick(m)} className="group h-full flex flex-col text-left rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 hover:-translate-y-0.5 hover:shadow-md transition-all" style={{ boxShadow: '0 1px 2px rgba(15,16,32,0.04)' }} onMouseEnter={ev => { ev.currentTarget.style.borderColor = m.accent; }} onMouseLeave={ev => { ev.currentTarget.style.borderColor = '#e5e7eb'; }}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-extrabold tracking-wide rounded-md px-2 py-1" style={{ background: m.bg, color: m.accent }}>{m.code}</span>
            {note != null
              ? <span className="text-[13px] font-extrabold tabular-nums" style={{ color: ink(note) }}>{String(note).replace('.', ',')}<span className="text-[11px] font-semibold text-gray-400"> /20</span></span>
              : <span className="text-[11px] font-semibold text-gray-300">Pas encore</span>}
          </div>
          <p className="font-jakarta text-[16px] font-bold text-gray-900 leading-tight">{m.name}</p>
          {m.facLabel && m.facLabel !== m.name && <p className="text-[11px] font-semibold mt-0.5" style={{ color: m.accent }}>{m.facLabel}</p>}
          <p className="text-[12px] text-gray-400 mt-1.5 leading-snug line-clamp-2">{m.description}</p>
          <p className="mt-auto pt-3 text-[12px] font-bold flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: m.accent }}>
            {e ? `${e.n} session${e.n > 1 ? 's' : ''} · continuer` : 'Commencer'}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </p>
        </button>
      );
    };
    const facName = facById(prog.fac)?.name?.replace(/^Université (de |d’|d')?/i, '');
    return (
      <section className={`pb-16 bg-slate-50 ${onBack ? 'pt-6 md:pt-16' : 'pt-24 md:pt-28 min-h-screen'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton onClick={() => setView('modeChoice')} className="mb-5" />
          <div className="mb-6">
            <h2 className="font-jakarta text-[28px] md:text-[34px] font-black text-gray-900 tracking-tight leading-tight">Choisis une mati&egrave;re</h2>
            <p className="text-[15px] text-gray-500 mt-1.5">{prog.known && facName ? `Le programme de ${facName}. ` : ''}Le QCM couvre l&rsquo;ensemble de l&rsquo;UE.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {main.map(Card)}
          </div>
          {others.length > 0 && (
            <div className="mt-8">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Hors programme de ta fac</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 opacity-80">
                {others.map(Card)}
              </div>
            </div>
          )}
        </div>
        {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        {showUpgradeModal && <UpgradeModal requiredTier="essentiel" onClose={() => setShowUpgradeModal(false)} />}
      </section>
    );
  }

  // ===== FICHES SELECTION VIEW =====
  if (view === 'fichesSelection') {
    const filteredFiches = getFilteredFiches();
    const pickFiche = (f) => {
      const subj = SUBJECTS.find(x => x.id === f.subject); const m = QCM_SUBJECT_DATA.find(x => x.id === f.subject);
      setPendingLaunch({ topic: { type: 'fiche', subject: f.subject, subjectName: subj?.name || '', title: f.title, summary: f.summary, content: f.content || null }, label: f.title, sub: `Fiche${m ? ` · ${m.code}` : ''}`, accent: m?.accent || '#4f46e5', bg: m?.bg || '#eef2ff' });
      setView('countChoice');
    };
    const orderedSubjects = [...prog.subjects, ...prog.others];
    const countOf = (id) => FICHES_DATA.filter(f => f.subject === id).length;
    const stroke = (fluo, strong) => `linear-gradient(104deg, ${fluo}00 0.9%, ${fluo}${strong ? 'e6' : '99'} 2.4%, ${fluo}${strong ? 'bf' : '73'} 5.8%, ${fluo}${strong ? '66' : '26'} 93%, ${fluo}${strong ? 'cc' : '8c'} 96%, ${fluo}00 98%)`;
    const renderCard = (f) => {
      const sub = SUBJECTS.find(s => s.id === f.subject);
      const fluo = FLUO_HEX[sub?.color] || FLUO_HEX.primary;
      return (
        <div key={f.id} role="button" tabIndex={0} onClick={() => pickFiche(f)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickFiche(f); } }}
          className="qcm-fiche-mini group"
          style={{ position: 'relative', backgroundColor: '#fff', borderRadius: 14, border: '1px solid #e5e7f0', cursor: 'pointer', padding: '14px 16px 12px 22px', display: 'flex', flexDirection: 'column', gap: 6, transition: 'transform .18s, box-shadow .18s', boxShadow: '0 2px 6px rgba(15,16,32,0.04)', backgroundImage: 'repeating-linear-gradient(transparent 0, transparent 21px, #eef0f4 21px, #eef0f4 22px)', backgroundPosition: '0 10px' }}>
          <span aria-hidden="true" style={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: 1.5, background: '#f6cfcf', borderRadius: 1 }} />
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f1020', lineHeight: '22px', margin: 0 }} className="group-hover:text-indigo-800 transition-colors">
            <span style={{ backgroundImage: stroke(fluo, false), backgroundSize: '100% 66%', backgroundRepeat: 'no-repeat', backgroundPosition: '0 65%', padding: '0 4px', margin: '0 -4px', borderRadius: 3, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>{f.title}</span>
          </h4>
          <p style={{ fontSize: 12.5, color: '#5f6280', lineHeight: '22px', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{f.summary}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2, fontSize: 11.5, lineHeight: '22px' }}>
            <span style={{ fontWeight: 700, color: '#4f46e5', whiteSpace: 'nowrap' }}>Me tester &rarr;</span>
            <span style={{ color: '#9ca3af', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub?.name}</span>
          </div>
        </div>
      );
    };
    const groups = (subjectFilter === 'all' && !searchQuery)
      ? orderedSubjects.map(s => ({ s, items: filteredFiches.filter(f => f.subject === s.id) })).filter(g => g.items.length > 0)
      : null;
    return (
      <section className={`pb-16 bg-slate-50 ${onBack ? 'pt-6 md:pt-16' : 'pt-24 md:pt-28 min-h-screen'}`}>
        <style>{`.qcm-fiche-mini:hover { transform: translateY(-3px) rotate(-0.6deg); box-shadow: 0 14px 28px -14px rgba(15,16,32,0.25); }`}</style>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton onClick={() => setView('modeChoice')} className="mb-5" />
          <div className="mb-6">
            <h2 className="font-jakarta text-[28px] md:text-[34px] font-black text-gray-900 tracking-tight leading-tight">Choisis une fiche</h2>
            <p className="text-[15px] text-gray-500 mt-1.5">Le QCM porte uniquement sur le contenu de la fiche.</p>
          </div>

          {/* Recherche */}
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white pl-5 pr-4 py-2.5 shadow-[0_1px_2px_rgba(15,16,32,0.04)] focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.12)] transition-all mb-4">
            <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            <input type="text" placeholder="Rechercher une fiche…" className="flex-1 min-w-0 text-[15px] text-gray-800 placeholder-gray-400 outline-none bg-transparent py-1.5" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="text-xs font-semibold text-gray-400 hover:text-gray-700">Effacer</button>}
          </div>

          {/* Filtres à trait de fluo */}
          <div className="flex flex-wrap gap-2 mb-7">
            {(() => { const isSel = subjectFilter === 'all'; return (
              <button onClick={() => setSubjectFilter('all')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', border: `1px solid ${isSel ? '#0f1020' : '#e5e7f0'}`, background: isSel ? '#0f1020' : '#fff', color: isSel ? '#fff' : '#2a2c44' }} className="transition-colors hover:border-gray-400">
                Toutes <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>{fichesCount}</span>
              </button>
            ); })()}
            {orderedSubjects.map(s => {
              const fluo = FLUO_HEX[s.color] || FLUO_HEX.primary; const isSel = subjectFilter === s.id; const outside = prog.known && !prog.has(s.id);
              return (
                <button key={s.id} onClick={() => setSubjectFilter(s.id)} title={outside ? 'Hors programme de ta fac' : (s.facLabel || undefined)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', border: `1px solid ${isSel ? '#c9cbe0' : '#e5e7f0'}`, background: '#fff', color: '#0f1020', boxShadow: isSel ? '0 0 0 2px #eef0f7' : 'none', opacity: outside ? 0.6 : 1 }} className="transition-colors hover:border-gray-400">
                  <span style={{ backgroundImage: stroke(fluo, isSel), backgroundSize: '100% 62%', backgroundRepeat: 'no-repeat', backgroundPosition: '0 70%', padding: '0 4px', margin: '0 -4px', borderRadius: 2 }}>{s.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#8a8ea8' }}>{countOf(s.id)}</span>
                </button>
              );
            })}
          </div>

          {/* Fiches */}
          {filteredFiches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#5f6280' }}>
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Aucune fiche trouv&eacute;e</p>
              <p style={{ fontSize: 13 }}>Essaie un autre terme ou change de mati&egrave;re.</p>
            </div>
          ) : groups ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
              {groups.map(({ s, items }) => {
                const colors = getColors(s.color); const outside = prog.known && !prog.has(s.id);
                return (
                  <div key={s.id}>
                    <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                      <span className={`w-7 h-7 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center shrink-0`}>
                        <SubjectIcon subjectId={s.id} className={`w-4 h-4 ${colors.icon}`} />
                      </span>
                      <h3 className="font-jakarta text-[15px] font-extrabold text-gray-900">{s.name}</h3>
                      {s.facLabel && s.facLabel !== s.name && <span className="hidden sm:inline text-[11px] font-semibold text-indigo-600 bg-indigo-50 rounded-full px-2 py-0.5">{s.facLabel}</span>}
                      {outside && <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">hors programme de ta fac</span>}
                      <span className="text-xs text-gray-400">{items.length} fiche{items.length > 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>{items.map(renderCard)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 font-medium mb-3">{filteredFiches.length} fiche{filteredFiches.length > 1 ? 's' : ''} sur {fichesCount}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>{filteredFiches.map(renderCard)}</div>
            </>
          )}
        </div>
        {/* Démarrage direct depuis ?fiche=<id> */}
        {pendingFiche && (
          <StartConfirmModal
            fiche={pendingFiche.fiche}
            subject={pendingFiche.subject}
            questionCount={questionCount}
            onConfirm={confirmFicheStart}
            onCancel={() => setPendingFiche(null)}
          />
        )}
        {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        {showUpgradeModal && <UpgradeModal requiredTier="essentiel" onClose={() => setShowUpgradeModal(false)} />}
      </section>
    );
  }

  // ===== CUSTOM SELECTION VIEW =====
  if (view === 'customSelection') {
    const t = customTopic.trim();
    const goTopic = (topic) => { const v = (topic || '').trim(); if (!v) return; setCustomTopic(''); setPendingLaunch({ topic: { type: 'custom', subject: null, subjectName: v, title: v }, label: v, sub: 'Thème libre', accent: '#7c3aed', bg: '#f5f3ff' }); setView('countChoice'); };
    const EXAMPLES = ['Cycle de Krebs', 'Ostéologie du membre supérieur', 'Loi normale', 'Potentiel d’action', 'Pharmacocinétique', 'Liaisons chimiques'];
    return (
      <section className={`pb-16 bg-slate-50 ${onBack ? 'pt-6 md:pt-16' : 'pt-24 md:pt-28 min-h-screen'}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton onClick={() => setView('modeChoice')} className="mb-5" />
          <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-8" style={{ boxShadow: '0 1px 2px rgba(15,16,32,0.04), 0 24px 48px -24px rgba(124,58,237,0.28)' }}>
            <div className="flex items-center gap-3.5 mb-6">
              <span className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shrink-0" style={{ boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
              </span>
              <div>
                <h2 className="font-jakarta text-[24px] md:text-[28px] font-black text-gray-900 tracking-tight leading-tight">Un th&egrave;me libre</h2>
                <p className="text-[14px] text-gray-500 mt-0.5">L&rsquo;IA g&eacute;n&egrave;re des questions cibl&eacute;es sur le point que tu choisis.</p>
              </div>
            </div>

            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Ton sujet</label>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-slate-50 pl-5 pr-2.5 py-2.5 focus-within:bg-white focus-within:border-violet-400 focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.12)] transition-all">
              <input
                type="text"
                autoFocus
                value={customTopic}
                onChange={e => setCustomTopic(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') goTopic(customTopic); }}
                placeholder="Ex. « Cycle de Krebs », « Loi normale »…"
                className="flex-1 min-w-0 text-[16px] text-gray-800 placeholder-gray-400 outline-none bg-transparent py-2"
              />
              {t && <button onClick={() => goTopic(customTopic)} className="h-10 px-5 shrink-0 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-colors">Continuer</button>}
            </div>

            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mt-6 mb-2.5">Ou pars d&rsquo;un exemple</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => goTopic(ex)} className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-[13px] font-semibold text-gray-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-colors">{ex}</button>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-6">Sois pr&eacute;cis : un chapitre ou une notion donne de meilleures questions qu&rsquo;une mati&egrave;re enti&egrave;re.</p>
          </div>
        </div>
        {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        {showUpgradeModal && <UpgradeModal requiredTier="essentiel" onClose={() => setShowUpgradeModal(false)} />}
      </section>
    );
  }

  // ===== CHOIX DU NOMBRE (pile « À consolider » > 10) =====
  if (view === 'reviewCount') {
    const n = reviewPool.length;
    const count = Math.min(Math.max(1, reviewCountChoice), n);
    return (
      <div className={`bg-slate-50 flex items-center justify-center ${onBack ? 'min-h-[calc(100vh-57px)]' : 'min-h-screen pt-16'}`}>
        <div className="max-w-md mx-auto px-4 text-center w-full">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">{n} questions à consolider</h2>
            <p className="text-sm text-gray-500 mb-6">Sur combien veux-tu t&apos;entra&icirc;ner ? Elles seront tir&eacute;es au hasard dans ta pile.</p>

            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-5xl font-black text-primary-600 tabular-nums">{count}</span>
              <span className="text-sm text-gray-400">/ {n} question{n > 1 ? 's' : ''}</span>
            </div>

            <div className="flex items-center gap-3 mb-7">
              <button onClick={() => setReviewCountChoice(Math.max(1, count - 1))} className="w-9 h-9 shrink-0 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 text-xl font-bold flex items-center justify-center transition-all" aria-label="Une question de moins">&minus;</button>
              <input type="range" min="1" max={n} value={count} onChange={(e) => setReviewCountChoice(Number(e.target.value))} className="flex-1 accent-indigo-600 cursor-pointer" aria-label="Nombre de questions" />
              <button onClick={() => setReviewCountChoice(Math.min(n, count + 1))} className="w-9 h-9 shrink-0 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 text-xl font-bold flex items-center justify-center transition-all" aria-label="Une question de plus">+</button>
            </div>

            <button onClick={() => launchReviewWith(reviewPool, count)} className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors">Commencer avec {count} question{count > 1 ? 's' : ''}</button>
            <button onClick={() => { onBack ? onBack() : setView('hero'); }} className="mt-4 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors">Annuler</button>
          </div>
        </div>
        {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        {showUpgradeModal && <UpgradeModal requiredTier="essentiel" onClose={() => setShowUpgradeModal(false)} />}
      </div>
    );
  }

  // ===== LOADING VIEW =====
  if (view === 'loading') {
    const subject = selectedTopic?.subject ? SUBJECTS.find(s => s.id === selectedTopic.subject) : null;
    const meta = selectedTopic?.subject ? QCM_SUBJECT_DATA.find(m => m.id === selectedTopic.subject) : null;
    const accent = selectedTopic?.flash ? '#d97706' : (meta?.accent || (selectedTopic?.type === 'fiche' ? '#d97706' : selectedTopic?.type === 'custom' && !selectedTopic?.subject ? '#7c3aed' : '#4f46e5'));
    const count = selectedTopic?.count || questionCount;
    const title = selectedTopic?.flash ? 'Pico pr\u00e9pare ta session \u00e9clair' : 'Pico pr\u00e9pare ton QCM';
    const line = `${count} question${count > 1 ? 's' : ''}${selectedTopic?.title || selectedTopic?.subjectName ? ` \u00b7 ${selectedTopic?.title || selectedTopic?.subjectName}` : ''}`;
    const tip = LOADING_TIPS[tipIndex];
    const cancel = () => { onBack ? onBack() : setView('hero'); };
    return (
      <div className={`bg-slate-50 flex items-center justify-center ${onBack ? 'min-h-[70vh]' : 'min-h-screen pt-16'}`}>
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 text-center" style={{ boxShadow: `0 1px 2px rgba(15,16,32,0.04), 0 24px 48px -24px ${accent}55` }}>
            {/* Icône entourée d'un anneau qui tourne */}
            <div className="relative w-24 h-24 mx-auto mb-5">
              <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '1.6s' }} viewBox="0 0 96 96" fill="none" aria-hidden="true">
                <circle cx="48" cy="48" r="44" stroke={`${accent}22`} strokeWidth="4" />
                <path d="M48 4a44 44 0 0 1 44 44" stroke={accent} strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span className="absolute inset-[14px] rounded-2xl flex items-center justify-center text-white" style={{ background: accent, boxShadow: `0 6px 16px ${accent}55` }}>
                {subject ? <SubjectIcon subjectId={subject.id} className="w-7 h-7" /> : <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>}
              </span>
            </div>
            <h2 className="font-jakarta text-[22px] font-black text-gray-900 tracking-tight leading-tight">{title}</h2>
            <p className="text-[14px] text-gray-500 mt-1.5">{line}</p>

            {/* Barre indéterminée */}
            <div className="w-full h-1.5 rounded-full overflow-hidden my-6" style={{ background: `${accent}1a` }}>
              <div className="h-full rounded-full loading-progress" style={{ background: accent }} />
            </div>

            {/* Conseil qui tourne */}
            <div className="rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3.5 min-h-[64px] flex items-center gap-3 text-left">
              <span className="text-xl shrink-0">{tip.icon}</span>
              <p key={tipIndex} className="text-[13px] text-gray-600 leading-snug tip-fade">{tip.text}</p>
            </div>

            <button onClick={cancel} className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-[13px] font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-800 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== QUIZ VIEW =====
  if (view === 'quiz') {
    const q = questions[currentIndex];
    if (!q) return null;
    const total = questions.length;
    const answeredCount = answers.filter(a => a !== null).length;
    const progressPct = (answeredCount / total) * 100;
    const subject = selectedTopic?.subject ? SUBJECTS.find(s => s.id === selectedTopic.subject) : null;
    const badgeText = subject?.name || 'Sujet libre';
    const colors = getColors(subject?.color);
    const alreadyAnswered = answers[currentIndex];
    const correctIndex = q.options.findIndex(o => o.correct);

    return (
      <div className={`bg-slate-50 flex flex-col overflow-hidden ${onBack ? 'h-[100dvh] pt-4 pb-4' : 'h-[100dvh] pt-20 pb-4'}`}>
        <div className="max-w-3xl mx-auto px-4 w-full flex-1 min-h-0 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            <button onClick={() => setShowQuitModal(true)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
              Quitter
            </button>
            <div className="flex items-center gap-3">
              {streak >= 2 && (
                <div
                  key={streak}
                  className={`flame-pop flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${streak >= 5 ? 'bg-orange-500 text-white shadow-md shadow-orange-500/40' : 'bg-amber-100 text-amber-700'}`}
                >
                  <span className="text-sm">&#x1F525;</span> {streak}{streak >= 5 && <span className="hidden sm:inline">&nbsp;en feu&nbsp;!</span>}
                </div>
              )}
              {selectedTopic?.flash ? (
                (() => {
                  const remaining = Math.max(0, 300 - timer.seconds);
                  const urgent = remaining <= 60;
                  return (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${urgent ? 'bg-red-50 border-red-200' : 'bg-indigo-50 border-indigo-200'}`}>
                      <span className="text-sm">⚡</span>
                      <span className={`text-sm font-mono font-bold ${urgent ? 'text-red-600' : 'text-indigo-700'}`}>
                        {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
                      </span>
                    </div>
                  );
                })()
              ) : (
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  <span className="text-sm font-mono font-bold text-gray-700">{timer.formatted}</span>
                </div>
              )}
              <span className="text-sm font-semibold text-gray-900">{currentIndex + 1}/{total}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-200 rounded-full mb-3 shrink-0">
            <div className="h-1.5 bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>

          {/* Question pills — horizontal scroll on mobile */}
          <div ref={pillsRef} className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-hide snap-x shrink-0">
            {questions.map((_, i) => {
              let cls = 'bg-gray-100 text-gray-400'; // unanswered
              if (i === currentIndex) cls = 'bg-primary-600 text-white shadow-md shadow-primary-500/40';
              else if (answers[i] !== null) cls = answers[i].correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
              const canClick = answers[i] !== null || i === currentIndex;
              return (
                <button key={i} onClick={() => canClick && goToQuestion(i)} disabled={!canClick} className={`w-7 h-7 shrink-0 rounded-lg text-[11px] font-bold transition-all snap-center ${cls}`}>{i + 1}</button>
              );
            })}
          </div>

          {/* Question card */}
          <div key={currentIndex} className="question-in bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 md:p-6 shadow-sm relative min-h-0 flex flex-col">
            {/* Animation +X XP sur bonne réponse */}
            {xpPop && xpPop.key === currentIndex && alreadyAnswered?.correct && (
              <span key={xpPop.key} className="xp-pop" style={{ position: 'absolute', top: 14, right: 16, background: '#7c3aed', color: '#fff', fontSize: 12, fontWeight: 800, padding: '4px 11px', borderRadius: 14, boxShadow: '0 4px 14px rgba(124,58,237,0.35)', pointerEvents: 'none', zIndex: 5 }}>
                +{xpPop.amount} XP
              </span>
            )}
            <div className="flex items-center justify-between mb-2 shrink-0">
              <span className="text-xs font-medium text-gray-500">Question {currentIndex + 1}</span>
              <span className={`px-2.5 py-0.5 ${colors.badge} text-[11px] font-bold rounded-full truncate max-w-[60%]`}>{selectedTopic?.title || badgeText}</span>
            </div>
            <p className="text-[16px] md:text-lg font-bold text-gray-900 mb-3 leading-snug shrink-0">{q.question}</p>

            {/* Propositions : seule zone qui défile si l'écran est trop petit */}
            <div className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-0.5 -mr-0.5">
              {q.options.map((opt, i) => {
                let btnClass = 'border-2 border-gray-200 text-gray-700 hover:border-primary-400 hover:bg-primary-50';
                let badgeClass = 'bg-gray-100 text-gray-500';
                let disabled = false;
                let icon = null;
                let animClass = '';

                if (alreadyAnswered) {
                  disabled = true;
                  if (i === correctIndex) {
                    btnClass = 'border-2 border-emerald-400 bg-emerald-50 text-emerald-800';
                    badgeClass = 'bg-emerald-100 text-emerald-700';
                    icon = <svg className="w-4 h-4 ml-auto text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>;
                    // Halo vert seulement si l'utilisateur a choisi la bonne
                    if (alreadyAnswered.correct) animClass = 'answer-good';
                  } else if (i === alreadyAnswered.selected && !alreadyAnswered.correct) {
                    btnClass = 'border-2 border-red-400 bg-red-50 text-red-800';
                    badgeClass = 'bg-red-100 text-red-700';
                    icon = <svg className="w-4 h-4 ml-auto text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
                    animClass = 'answer-bad';
                  } else {
                    btnClass = 'border-2 border-gray-200 text-gray-400';
                    badgeClass = 'bg-gray-100 text-gray-400';
                  }
                }

                return (
                  <button key={i} onClick={() => answerQuestion(i)} disabled={disabled} className={`w-full text-left px-4 py-2.5 md:py-3 rounded-xl text-[14px] md:text-[15px] font-medium flex items-center gap-3 transition-all ${btnClass} ${animClass} ${!alreadyAnswered ? 'option-slide-in' : ''}`} style={!alreadyAnswered ? { animationDelay: `${i * 80}ms` } : undefined}>
                    <span className={`w-7 h-7 rounded-lg ${badgeClass} flex items-center justify-center text-[13px] font-bold shrink-0`}>{String.fromCharCode(65 + i)}</span>
                    <span className="flex-1 leading-snug">{opt.text}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            <div className="shrink-0 pt-3">
            {/* « Je ne sais pas » : honnêteté récompensée, la question part en consolidation */}
            {!isValidated && (
              <button
                onClick={answerDontKnow}
                className="w-full py-2 text-[13px] font-medium text-gray-400 border border-dashed border-gray-300 rounded-xl hover:text-gray-600 hover:border-gray-400 transition-colors"
              >
                🤷 Je ne sais pas — voir la réponse
              </button>
            )}

            {/* Explanation */}
            {isValidated && alreadyAnswered && (
              <div className={`mb-3 px-4 py-3 rounded-xl text-[13px] font-medium leading-snug max-h-[26vh] overflow-y-auto ${alreadyAnswered.correct ? 'bg-green-50 text-green-700 border border-green-200' : alreadyAnswered.idk ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <strong>{alreadyAnswered.correct ? 'Bonne r\u00e9ponse !' : alreadyAnswered.idk ? 'Bien vu de ne pas deviner \u2014 elle part dans ta pile \u00ab \u00c0 consolider \u00bb.' : 'Mauvaise r\u00e9ponse.'}</strong>{' '}
                {q.explanation}
              </div>
            )}

            {/* Next button */}
            {isValidated && (
              <button onClick={handleNextOrResults} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                {answeredCount >= total ? 'Voir les r\u00e9sultats' : 'Question suivante'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </button>
            )}

            {/* Keyboard hints */}
            <div className="hidden md:flex items-center justify-center gap-4 mt-2 text-[10px] text-gray-400">
              <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[9px]">A-D</kbd> Choisir</span>
              <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[9px]">Entr&eacute;e</kbd> Suivante</span>
              <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[9px]">Esc</kbd> Quitter</span>
            </div>

            </div>
          </div>
        </div>

        {/* Quit modal */}
        {showQuitModal && (
          <QuitModal
            answered={answeredCount}
            total={total}
            score={score}
            timerFormatted={timer.formatted}
            onContinue={() => setShowQuitModal(false)}
            onQuit={confirmQuit}
          />
        )}
      </div>
    );
  }

  // ===== RESULTS VIEW =====
  if (view === 'results') {
    const validAnswers = answers.filter(a => a !== null);
    const correctCount = validAnswers.filter(a => a.correct).length;
    const pct = validAnswers.length > 0 ? Math.round((correctCount / validAnswers.length) * 100) : 0;
    const totalSeconds = timer.seconds;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const circumference = 2 * Math.PI * 56;
    const offset = circumference - (pct / 100) * circumference;
    const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
    const subject = selectedTopic?.subject ? SUBJECTS.find(s => s.id === selectedTopic.subject) : null;
    const incorrectCount = validAnswers.filter(a => !a.correct).length;

    // Compare with last session on same topic
    const lastSame = stats.sessions?.find((s, i) => i > 0 && s.topic === selectedTopic?.title);
    let comparisonEl = null;
    if (lastSame) {
      const diff = pct - (lastSame.percentage || 0);
      if (diff > 0) {
        comparisonEl = (
          <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mt-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
            +{diff}% vs dernier essai
          </div>
        );
      } else if (diff < 0) {
        comparisonEl = (
          <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold mt-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" /></svg>
            {diff}% vs dernier essai
          </div>
        );
      }
    }

    const filteredResults = resultsFilter === 'incorrect' ? validAnswers.filter(a => !a.correct) : validAnswers;

    const isPlacement = !!selectedTopic?.placement;
    const scoreMessage = isPlacement ? 'Ton point de départ' : pct >= 90 ? 'Excellent !' : pct >= 70 ? 'Très bien !' : pct >= 50 ? 'Pas mal !' : 'Courage !';
    const showConfetti = !isPlacement && pct >= 70;
    const placementMap = isPlacement ? prog.subjects.map(sub => {
      const qs = validAnswers.filter(a => a.question?.subject === sub.id);
      const score = qs.length ? Math.round(qs.filter(a => a.correct).length / qs.length * 100) : null;
      return { sub, score, level: levelOf(score) };
    }) : [];

    return (
      <section className={`bg-slate-50 ${onBack ? 'py-10' : 'py-24 md:py-28 min-h-screen'}`}>
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-5%',
                  backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][i % 6],
                  animation: `confettiFall ${2 + Math.random() * 2}s ease-in ${Math.random() * 1.5}s forwards`,
                }}
              />
            ))}
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">R&eacute;sultats du QCM</h2>
            <p className="text-gray-500">{selectedTopic?.title || 'Sujet libre'}</p>
          </div>

          {/* À consolider : information sur la pile de réponses fausses */}
          {selectedTopic?.type === 'review' ? (
            <div className="max-w-md mx-auto mb-8 bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3.5 text-center">
              <p className="text-sm text-indigo-900 font-semibold">
                {correctCount > 0 && `✅ ${correctCount} maîtrisée${correctCount > 1 ? 's' : ''} et retirée${correctCount > 1 ? 's' : ''} de ta pile`}
                {correctCount > 0 && incorrectCount > 0 && ' · '}
                {incorrectCount > 0 && `🔁 ${incorrectCount} encore à revoir`}
              </p>
              <p className="text-xs text-indigo-500 mt-1">Réponds juste à une question pour la sortir de ta pile « À consolider »</p>
            </div>
          ) : incorrectCount > 0 && (
            <div className="max-w-md mx-auto mb-8 bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3.5 text-center">
              <p className="text-sm text-indigo-900 font-semibold">
                {isPlacement ? `🔁 ${incorrectCount} question${incorrectCount > 1 ? 's' : ''} gardée${incorrectCount > 1 ? 's' : ''} au chaud dans ta pile « À consolider »` : `🔁 ${incorrectCount} question${incorrectCount > 1 ? 's' : ''} ajoutée${incorrectCount > 1 ? 's' : ''} à ta pile « À consolider »`}
              </p>
              <p className="text-xs text-indigo-500 mt-1">{isPlacement ? 'Tu les reverras après avoir lu les fiches — sans pression, à ton rythme.' : 'Retrouve-les sur ton tableau de bord — réponds juste pour les retirer'}</p>
            </div>
          )}

          {isPlacement && (
            <div className="max-w-lg mx-auto mb-8 bg-white border border-indigo-100 rounded-2xl p-5 text-left">
              <p className="text-sm font-bold text-gray-900 mb-1">Voici par où on commence</p>
              <p className="text-xs text-gray-500 mb-4">Ce n&apos;est pas une note : c&apos;est la carte de ton point de départ. Elle bougera à chaque session.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {placementMap.map(({ sub, level }) => {
                  const tone = { rose: 'bg-rose-50 text-rose-700 border-rose-100', amber: 'bg-amber-50 text-amber-700 border-amber-100', emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100' }[level.tone];
                  return (
                    <div key={sub.id} className={`rounded-xl border px-3 py-2 ${tone}`}>
                      <span className="block text-[11px] font-semibold truncate">{sub.name}</span>
                      <span className="block text-sm font-black">{level.label}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-4">Pico va commencer par les matières en <strong>Découverte</strong> — deux questions par matière, c&apos;est un premier repère, pas un verdict.</p>
            </div>
          )}

          {/* Conseil de stratégie au barème de la fac — après un QCM à réponses multiples */}
          {!isPlacement && questions.some(q => q.multi) && user?.user_metadata?.profile?.bareme && (() => {
            const st = strategyFor(user.user_metadata.profile.bareme);
            return (
              <div className="max-w-md mx-auto mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3.5 text-left">
                <p className="text-[13px] font-bold text-indigo-900">{st.title}</p>
                <p className="text-[12px] text-indigo-900/80 mt-0.5">{st.tips[0]}</p>
              </div>
            );
          })()}
          {/* Score circle — jamais pour le positionnement : pas de note, pas de rouge */}
          {!isPlacement && (
          <div className="flex flex-col items-center justify-center mb-8">
            <div className={`relative ${showConfetti ? 'celebrate-pulse' : ''}`}>
              <svg className="w-36 h-36 sm:w-44 sm:h-44" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="56" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle cx="70" cy="70" r="56" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={offset}
                  style={{ transition: 'stroke-dashoffset 1s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-black" style={{ color }}>{pct}%</span>
                <span className="text-xs text-gray-500">{correctCount}/{validAnswers.length}</span>
              </div>
            </div>
            <p className="text-lg font-bold mt-3" style={{ color }}>{scoreMessage}</p>
            {comparisonEl}
            {/* XP gagnés sur la session */}
            <div className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 px-3.5 py-1.5 rounded-full text-sm font-bold mt-3">
              ✨ +{xpForSession({ correct: correctCount, subject: selectedTopic?.type === 'review' ? 'review' : selectedTopic?.subject, flash: !!selectedTopic?.flash })} XP
            </div>
          </div>
          )}

          {/* Stats grid */}
          <div className={`grid ${maxStreak >= 2 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} gap-3 mb-8`}>
            <div className="bg-white rounded-xl px-4 py-3 text-center border border-gray-100">
              <p className="text-base font-bold text-gray-900">{subject?.name || 'Libre'}</p>
              <p className="text-xs text-gray-500">Mati&egrave;re</p>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 text-center border border-gray-100">
              <p className="text-base font-bold text-gray-900">{minutes}m {seconds.toString().padStart(2, '0')}s</p>
              <p className="text-xs text-gray-500">Dur&eacute;e</p>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 text-center border border-gray-100">
              <p className="text-base font-bold text-gray-900">{validAnswers.length}</p>
              <p className="text-xs text-gray-500">Questions</p>
            </div>
            {maxStreak >= 2 && (
              <div className="bg-white rounded-xl px-4 py-3 text-center border border-gray-100">
                <p className="text-base font-bold text-gray-900">&#x1F525; {maxStreak}</p>
                <p className="text-xs text-gray-500">Meilleure s&eacute;rie</p>
              </div>
            )}
          </div>

          {/* Correction */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-1">
              <button onClick={() => setCorrectionOpen(!correctionOpen)} className="flex items-center gap-2 group">
                <h3 className="font-bold text-gray-900 text-lg">Correction d&eacute;taill&eacute;e</h3>
                <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${correctionOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
              </button>
              <div className="flex gap-2">
                <button onClick={() => setResultsFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${resultsFilter === 'all' ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-200 bg-white text-gray-500'}`}>
                  Toutes ({validAnswers.length})
                </button>
                {incorrectCount > 0 && (
                  <button onClick={() => setResultsFilter('incorrect')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${resultsFilter === 'incorrect' ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-200 bg-white text-gray-500'}`}>
                    Erreurs ({incorrectCount})
                  </button>
                )}
              </div>
            </div>
            <div className={`correction-collapse ${correctionOpen ? 'open' : ''}`}>
              <div className="space-y-4 pt-4">
                {filteredResults.map((a, i) => {
                  const qIdx = answers.indexOf(a);
                  const num = qIdx >= 0 ? qIdx + 1 : i + 1;
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${a.correct ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full ${a.correct ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center shrink-0 mt-0.5`}>
                          {a.correct ? (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900">Q{num}. {a.question.question}</p>
                          <p className={`text-xs mt-1 ${a.correct ? 'text-green-700' : 'text-red-700'}`}>
                            Votre r&eacute;ponse : <strong>{a.selected != null ? a.question.options[a.selected].text : '🤷 Je ne sais pas'}</strong>
                            {!a.correct && <> &mdash; Bonne r&eacute;ponse : <strong>{a.question.options[a.correctIndex].text}</strong></>}
                          </p>
                          <p className="text-xs text-gray-600 mt-2 leading-relaxed">{a.question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fin de démo : invitation à créer un compte (aversion à la perte) */}
          {selectedTopic?.demo && (() => {
            const demoXp = xpForSession({ correct: correctCount, subject: null });
            return (
            <div className="max-w-xl mx-auto mb-8 rounded-2xl border border-indigo-100 p-6 text-center" style={{ background: 'linear-gradient(135deg, #eef2ff, #faf9ff 65%)' }}>
              <div className="text-3xl mb-2">🦉</div>
              <h3 className="text-lg font-black text-gray-900 mb-3">
                {demoXp > 0
                  ? <>Tu viens de gagner <span className="text-indigo-600">+{demoXp} XP</span>&hellip; qui ne seront pas sauvegard&eacute;s.</>
                  : <>Cette s&eacute;rie &eacute;tait corsée — c&apos;est exactement pour &ccedil;a qu&apos;on r&eacute;vise.</>}
              </h3>
              <div className="flex flex-col gap-2 max-w-md mx-auto mb-4 text-left">
                {incorrectCount > 0 && (
                  <div className="flex items-start gap-2.5 bg-white/80 border border-indigo-100 rounded-xl px-3.5 py-2.5">
                    <span className="text-base leading-none mt-0.5">🔁</span>
                    <p className="text-[13px] text-gray-700 leading-snug">
                      Tes <strong>{incorrectCount} erreur{incorrectCount > 1 ? 's' : ''}</strong>{' '}
                      auraient rejoint ta pile «&nbsp;&Agrave; consolider&nbsp;» pour &ecirc;tre
                      retravaill&eacute;es jusqu&apos;&agrave; la ma&icirc;trise.
                    </p>
                  </div>
                )}
                <div className="flex items-start gap-2.5 bg-white/80 border border-indigo-100 rounded-xl px-3.5 py-2.5">
                  <span className="text-base leading-none mt-0.5">🔥</span>
                  <p className="text-[13px] text-gray-700 leading-snug">
                    Ta <strong>s&eacute;rie de r&eacute;visions</strong>{' '}
                    aurait commenc&eacute; aujourd&apos;hui — avec Pico, tes stats et des QCM
                    illimit&eacute;s par IA.
                  </p>
                </div>
              </div>
              <Link
                href="/connexion"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              >
                Cr&eacute;er mon compte gratuit
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <p className="mt-2.5 text-[11px] text-gray-400">Gratuit · sans carte bancaire · <strong className="text-violet-600">7 jours de Premium offerts</strong></p>
            </div>
            );
          })()}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {incorrectCount > 0 && !selectedTopic?.demo && (
              <button
                onClick={() => launchReviewWith(validAnswers.filter(a => !a.correct).map(a => ({ question: a.question })), null)}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                🔁 Rejouer mes {incorrectCount} erreur{incorrectCount > 1 ? 's' : ''} maintenant
              </button>
            )}
            <button
              onClick={() => selectedTopic?.demo
                ? launchDemo()
                : selectedTopic?.type === 'review'
                  ? launchReviewWith(questions.map(q => ({ question: q })), null)
                  : startQuiz(selectedTopic)}
              className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg>
              Recommencer
            </button>
            {onBack ? (
              <button onClick={onBack} className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                Retour au tableau de bord
              </button>
            ) : (
              <button onClick={() => setView('hero')} className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors">
                Nouveau QCM
              </button>
            )}
          </div>
        </div>
        {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        {showUpgradeModal && <UpgradeModal requiredTier="essentiel" onClose={() => setShowUpgradeModal(false)} />}
      </section>
    );
  }

  return null;
}
