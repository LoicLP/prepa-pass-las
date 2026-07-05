'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTimer } from '@/hooks/useTimer';
import { SUBJECTS } from '@/data/subjects';
import { FICHES_DATA } from '@/data/fiches';
import { QUESTIONS } from '@/data/questions';
import { SUBJECT_COLORS, SUBJECT_ICONS, getSubjectName } from '@/data/constants';
import { useGeminiQuestions } from '@/hooks/useGeminiQuestions';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/contexts/PremiumContext';
import { supabase } from '@/lib/supabase';
import { useSupabaseStats } from '@/hooks/useSupabaseStats';
import LoginRequiredModal from '@/components/ui/LoginRequiredModal';
import UpgradeModal from '@/components/ui/UpgradeModal';
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
  const [tipIndex, setTipIndex] = useState(0);
  const [correctionOpen, setCorrectionOpen] = useState(true);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [reviewPool, setReviewPool] = useState([]); // pile « À consolider » en attente de choix du nombre
  const [reviewCountChoice, setReviewCountChoice] = useState(10); // nombre de questions choisi par l'utilisateur
  const [xpPop, setXpPop] = useState(null); // animation « +X XP » sur bonne réponse
  const pillsRef = useRef(null);

  // ----- Hooks -----
  const { user } = useAuth();
  const { isEssentiel } = usePremium();
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
  const recentSubjects = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const s of (stats.sessions || [])) {
      if (!s.subject || s.subject === 'custom' || s.subject === 'review') continue;
      if (seen.has(s.subject)) continue;
      const meta = QCM_SUBJECT_DATA.find(x => x.id === s.subject);
      if (!meta) continue;
      seen.add(s.subject);
      out.push(meta);
      if (out.length >= 3) break;
    }
    return out;
  }, [stats.sessions]);

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
    setQuestions(qs);
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
      const result = await generateAIQuestions(topic.subject, subjectName, effectiveCount, 'qcm', ficheTopic, ficheContent);
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
  const selectFiche = useCallback((ficheId) => {
    const fiche = FICHES_DATA.find(f => f.id === ficheId);
    if (!fiche) return;
    const subject = SUBJECTS.find(s => s.id === fiche.subject);
    setPendingFiche({ fiche, subject });
  }, []);

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

  // ----- « Je ne sais pas » : comptée ratée (→ À consolider), streak intact -----
  const answerDontKnow = useCallback(() => {
    if (isValidated) return;
    const q = questions[currentIndex];
    const correctIndex = q.options.findIndex(o => o.correct);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = { question: q, selected: null, correct: false, correctIndex, idk: true };
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
    newAnswers[currentIndex] = { question: q, selected: optionIndex, correct: isCorrect, correctIndex };
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
                    Sans carte bancaire · <strong className="text-violet-600">2 jours de Premium offerts</strong>{' '}
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
    const hasQuick = reviewQueueCount > 0 || recentSubjects.length > 0;

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
      <section className={`pb-16 bg-slate-50 ${onBack ? 'pt-8' : 'pt-24 md:pt-28 min-h-screen'}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête compact */}
          <div className="mb-5">
            <div className="inline-flex items-center gap-1.5 text-primary-600 mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
              <span className="text-xs font-bold uppercase tracking-wider">Nouveau QCM</span>
            </div>
            <h2 className="text-2xl md:text-[28px] font-black text-gray-900 tracking-tight">Que veux-tu travailler&nbsp;?</h2>
          </div>

          {/* Barre de recherche unifiée */}
          <div className="flex items-center gap-2 rounded-2xl border-2 border-indigo-500 bg-white pl-4 pr-2 py-2 shadow-[0_0_0_4px_rgba(79,70,229,0.08)] transition-all">
            <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            <input
              type="text"
              autoFocus
              value={launcherQuery}
              onChange={e => setLauncherQuery(e.target.value)}
              onKeyDown={onLauncherKey}
              placeholder="Une matière, une fiche, un thème…"
              className="flex-1 min-w-0 text-[15px] text-gray-800 placeholder-gray-400 outline-none bg-transparent py-1"
            />
            <button
              onClick={() => { if (subjectMatches.length) launchSubject(subjectMatches[0]); else if (ficheMatches.length) launchFiche(ficheMatches[0]); else launchFree(); }}
              disabled={!q}
              className="w-9 h-9 shrink-0 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Lancer le QCM"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </button>
          </div>

          {/* Suggestions (quand on tape) OU reprise rapide (à vide) */}
          {q ? (
            <div className="mt-3 rounded-2xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
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
          ) : hasQuick && (
            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">Reprise rapide</p>
              <div className="flex flex-wrap gap-2">
                {reviewQueueCount > 0 && (
                  <button
                    onClick={() => startReviewQuiz({ reviewQuestions: stats.reviewQueue })}
                    className="inline-flex items-center gap-2 pl-3 pr-2.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.9"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                    <span className="text-sm font-semibold text-gray-800">&Agrave; consolider</span>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">{reviewQueueCount}</span>
                  </button>
                )}
                {recentSubjects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => launchSubject(s)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:shadow-sm transition-all"
                    onMouseEnter={e => { e.currentTarget.style.borderColor = s.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.accent }} />
                    <span className="text-sm font-semibold text-gray-800">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modes secondaires — pour explorer plutôt que chercher */}
          <div className="mt-8">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">Ou parcours par mode</p>
            <div className="grid grid-cols-3 gap-2.5">
              <button onClick={() => setView('subjectSelection')} className="group flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left hover:border-indigo-400 hover:shadow-sm transition-all">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg>
                </span>
                <span className="min-w-0"><span className="block text-[13px] font-bold text-gray-900 leading-tight">Par matière</span><span className="block text-[11px] text-gray-400">6 UE</span></span>
              </button>
              <button onClick={() => setView('fichesSelection')} className="group flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left hover:border-amber-400 hover:shadow-sm transition-all">
                <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                </span>
                <span className="min-w-0"><span className="block text-[13px] font-bold text-gray-900 leading-tight">Par fiche</span><span className="block text-[11px] text-gray-400">{fichesCount} fiches</span></span>
              </button>
              <button onClick={() => setView('customSelection')} className="group flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left hover:border-violet-400 hover:shadow-sm transition-all">
                <span className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                </span>
                <span className="min-w-0"><span className="block text-[13px] font-bold text-gray-900 leading-tight">Sujet libre</span><span className="block text-[11px] text-gray-400">Thème précis</span></span>
              </button>
            </div>
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
    const facts = [
      { k: 'q', v: `${flashCount} questions`, d: 'format court', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
      { k: 't', v: '~5 min', d: 'chrono', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
      { k: 'x', v: 'XP bonus', d: 'x2 par bonne réponse', icon: <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /> },
    ];
    return (
      <section className={`pb-16 bg-slate-50 ${onBack ? 'pt-8' : 'pt-24 md:pt-28 min-h-screen'}`}>
        {!onBack && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <button onClick={() => { setFlashConfig(null); setView('hero'); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
              Retour
            </button>
          </div>
        )}
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm">
            {/* En-tête éclair */}
            <div className="flex items-center gap-3.5 mb-5">
              <span className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#fef4e4' }}>
                <svg className="w-6 h-6" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
              </span>
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight leading-tight">Session éclair</h2>
                <p className="text-[13px] text-gray-500">Un sprint de {flashCount} questions, parfait entre deux cours.</p>
              </div>
            </div>

            {/* Ce que c'est */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {facts.map(f => (
                <div key={f.k} className="rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-3 text-center">
                  <svg className="w-5 h-5 mx-auto mb-1.5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.9">{f.icon}</svg>
                  <div className="text-[13px] font-bold text-gray-900 leading-tight">{f.v}</div>
                  <div className="text-[10.5px] text-gray-400 leading-tight mt-0.5">{f.d}</div>
                </div>
              ))}
            </div>

            {/* Choix de la matière */}
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">Matière</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {QCM_SUBJECT_DATA.map(s => {
                const active = flashSubjectId === s.id;
                return (
                  <button key={s.id} onClick={() => setFlashSubjectId(s.id)}
                    className="flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all"
                    style={{ borderColor: active ? s.accent : '#e5e7eb', background: active ? s.bg : '#fff', boxShadow: active ? `0 0 0 3px ${s.accent}18` : 'none' }}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.accent }} />
                    <span className="text-[12.5px] font-semibold text-gray-800 leading-tight truncate">{s.name}</span>
                  </button>
                );
              })}
            </div>

            <button onClick={goFlash} className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90" style={{ background: accent }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
              Lancer la session éclair
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ===== COUNT CHOICE VIEW (après le lanceur : « combien de questions ? ») =====
  if (view === 'countChoice') {
    if (!pendingLaunch) { setView('modeChoice'); return null; }
    const { topic, label, sub, accent = '#4f46e5', bg = '#eef2ff' } = pendingLaunch;
    const go = () => { const t = { ...topic, count: questionCount }; setPendingLaunch(null); startQuiz(t); };
    return (
      <section className={`pb-16 bg-slate-50 ${onBack ? 'pt-8' : 'pt-24 md:pt-28 min-h-screen'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <button onClick={() => { setPendingLaunch(null); setView('modeChoice'); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Retour
          </button>
        </div>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            {/* Ce qui va être lancé */}
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                <svg className="w-5 h-5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
              </span>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{sub}</div>
                <div className="text-[15px] font-bold text-gray-900 truncate">{label}</div>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-700 mb-3">Combien de questions&nbsp;?</p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[5, 10, 20, 30].map(n => {
                const active = questionCount === n;
                return (
                  <button key={n} onClick={() => setQuestionCount(n)}
                    className="py-2.5 rounded-xl text-sm font-bold border transition-all"
                    style={{ borderColor: active ? accent : '#e5e7eb', background: active ? accent : '#fff', color: active ? '#fff' : '#6b7280' }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>

            <button onClick={go} className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90" style={{ background: accent }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              Lancer le QCM · {questionCount} questions
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ===== SUBJECT SELECTION VIEW =====
  if (view === 'subjectSelection') {
    const selectedSubject = QCM_SUBJECT_DATA.find(s => s.id === selectedSubjectId);

    return (
      <section className={`pb-16 bg-slate-50 ${onBack ? 'pt-8' : 'pt-24 md:pt-28 min-h-screen'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <button onClick={() => setView('modeChoice')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Retour
          </button>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Choisissez une mati&egrave;re</h2>
            <p className="text-gray-500 text-base">Le QCM couvrira l&rsquo;ensemble du programme de cette mati&egrave;re.</p>
          </div>
          {/* Grille des matières */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {QCM_SUBJECT_DATA.map(({ code, id, name, accent, bg, border }) => {
              const isSelected = selectedSubjectId === id;
              return (
                <button key={id} onClick={() => setSelectedSubjectId(isSelected ? null : id)}
                  className="text-left rounded-2xl p-5 transition-all hover:-translate-y-0.5"
                  style={{ border: `2px solid ${isSelected ? accent : border}`, background: isSelected ? accent : bg, boxShadow: isSelected ? `0 4px 14px ${accent}33` : 'none' }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, color: isSelected ? 'rgba(255,255,255,0.7)' : accent, marginBottom: 6 }}>{code}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: isSelected ? '#fff' : '#0f1020', lineHeight: 1.3 }}>{name}</div>
                </button>
              );
            })}
          </div>
          {/* Panneau de configuration (visible quand une matière est sélectionnée) */}
          {selectedSubject && (
            <div className="bg-white rounded-2xl border-2 p-6 transition-all" style={{ borderColor: selectedSubject.accent + '40' }}>
              <p className="text-sm text-gray-600 mb-4">
                QCM sur <strong className="text-gray-900">{selectedSubject.name}</strong> — combien de questions ?
              </p>
              <div className="flex gap-3 mb-5">
                {[5, 10, 20, 30].map(n => (
                  <button key={n} onClick={() => setQuestionCount(n)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all"
                    style={{ borderColor: questionCount === n ? selectedSubject.accent : '#e5e7eb', background: questionCount === n ? selectedSubject.accent : '#fff', color: questionCount === n ? '#fff' : '#6b7280' }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                onClick={() => startQuiz({ type: 'custom', subject: selectedSubject.id, subjectName: selectedSubject.name, title: selectedSubject.name, count: questionCount })}
                className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: selectedSubject.accent }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>
                Lancer le QCM · {questionCount} questions
              </button>
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
    const countPills = [5, 10, 15, 20];
    return (
      <section className={`pb-16 bg-slate-50 ${onBack ? 'pt-8' : 'pt-24 md:pt-28 min-h-screen'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <button onClick={() => setView('modeChoice')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Retour
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Choisissez votre fiche</h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">S&eacute;lectionnez un sujet parmi nos fiches de r&eacute;vision pour g&eacute;n&eacute;rer votre QCM.</p>
          </div>
          {/* Question count */}
          <div className="bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl border-2 border-primary-200 p-6 mb-8 max-w-lg mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/50 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" /></svg>
                </div>
                <p className="text-base font-bold text-gray-900">Combien de questions ?</p>
              </div>
              <p className="text-xs text-gray-500 mb-4 ml-[52px]">S&eacute;lectionnez le nombre de questions pour votre QCM</p>
              <div className="flex flex-wrap gap-2.5">
                {countPills.map(n => (
                  <button key={n} onClick={() => setQuestionCount(n)} className={`flex-1 min-w-[56px] py-3 rounded-xl text-sm font-bold border-2 shadow-sm transition-all ${n === questionCount ? 'bg-primary-600 text-white border-primary-600 shadow-primary-500/30' : 'border-white bg-white text-gray-600 hover:border-primary-300'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Search + filters */}
          <div className="max-w-5xl mx-auto mb-6">
            <div className="relative flex-1 w-full">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input type="text" placeholder="Rechercher un sujet..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => setSubjectFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${subjectFilter === 'all' ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 bg-white text-gray-600'}`}>Toutes</button>
              {SUBJECTS.map(s => (
                <button key={s.id} onClick={() => setSubjectFilter(s.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${subjectFilter === s.id ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 bg-white text-gray-600'}`}>{s.name}</button>
              ))}
            </div>
            {(searchQuery || subjectFilter !== 'all') && (
              <p className="text-xs text-gray-400 font-medium mt-2 text-center">{filteredFiches.length} fiche{filteredFiches.length > 1 ? 's' : ''} trouv&eacute;e{filteredFiches.length > 1 ? 's' : ''} sur {fichesCount}</p>
            )}
          </div>
          {/* Fiches grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
            {filteredFiches.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <p className="text-sm text-gray-400 font-medium">Aucune fiche ne correspond &agrave; votre recherche.</p>
              </div>
            ) : (
              <>
                {subjectFilter === 'all' && !searchQuery ? (
                  SUBJECTS.map(s => {
                    const subjectFiches = filteredFiches.filter(f => f.subject === s.id);
                    if (subjectFiches.length === 0) return null;
                    const colors = getColors(s.color);
                    return (
                      <div key={s.id} className="contents">
                        <div className="col-span-full mt-6 first:mt-0">
                          <div className="flex items-center gap-2.5 mb-3">
                            <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                              <SubjectIcon subjectId={s.id} className={`w-4 h-4 ${colors.icon}`} />
                            </div>
                            <h3 className="font-bold text-gray-900">{s.name}</h3>
                            <span className="text-xs text-gray-400 font-medium">{subjectFiches.length} sujets</span>
                          </div>
                        </div>
                        {subjectFiches.map(f => {
                          const fColors = getColors(s.color);
                          return (
                            <button key={f.id} onClick={() => selectFiche(f.id)} className="bg-white rounded-xl p-4 text-left border border-gray-200 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/10 hover:border-primary-300 cursor-pointer">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${fColors.badge}`}>{s.name}</span>
                                <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
                              </div>
                              <h4 className="text-sm font-bold text-gray-900 mb-1 leading-snug">{f.title}</h4>
                              <p className="text-xs text-gray-500 line-clamp-2">{f.summary}</p>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                ) : (
                  filteredFiches.map(f => {
                    const subject = SUBJECTS.find(s => s.id === f.subject);
                    const fColors = getColors(subject?.color);
                    return (
                      <button key={f.id} onClick={() => selectFiche(f.id)} className="bg-white rounded-xl p-4 text-left border border-gray-200 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/10 hover:border-primary-300 cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${fColors.badge}`}>{subject?.name || ''}</span>
                          <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1 leading-snug">{f.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{f.summary}</p>
                      </button>
                    );
                  })
                )}
              </>
            )}
          </div>
        </div>
        {/* Start confirmation modal */}
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
    const countPills = [5, 10, 15, 20];
    return (
      <section className={`pb-16 bg-slate-50 ${onBack ? 'pt-8' : 'pt-24 md:pt-28 min-h-screen'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <button onClick={() => setView('modeChoice')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Retour
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Sujet personnalis&eacute;</h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">Choisissez une mati&egrave;re et le nombre de questions pour g&eacute;n&eacute;rer votre QCM.</p>
          </div>
          {/* Topic input */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6 max-w-lg mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-violet-100 rounded-xl shadow-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
              </div>
              <p className="text-base font-bold text-gray-900">Quel sujet souhaitez-vous r&eacute;viser ?</p>
            </div>
            <p className="text-xs text-gray-500 mb-4 ml-[52px]">Des questions cibl&eacute;es seront g&eacute;n&eacute;r&eacute;es sur votre sujet</p>
            <input
              type="text"
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              placeholder="Ex : Ost&eacute;ologie du membre sup&eacute;rieur, Cycle de Krebs, Loi normale..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all placeholder:text-gray-400"
              onKeyDown={e => { if (e.key === 'Enter' && customTopic.trim()) { startQuiz({ type: 'custom', subject: null, subjectName: customTopic.trim(), title: customTopic.trim() }); setCustomTopic(''); } }}
            />
          </div>
          {/* Question count */}
          <div className="bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl border-2 border-primary-200 p-6 mb-8 max-w-lg mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/50 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" /></svg>
                </div>
                <p className="text-base font-bold text-gray-900">Combien de questions ?</p>
              </div>
              <p className="text-xs text-gray-500 mb-4 ml-[52px]">S&eacute;lectionnez le nombre de questions pour votre QCM</p>
              <div className="flex flex-wrap gap-2.5">
                {countPills.map(n => (
                  <button key={n} onClick={() => setQuestionCount(n)} className={`flex-1 min-w-[56px] py-3 rounded-xl text-sm font-bold border-2 shadow-sm transition-all ${n === questionCount ? 'bg-primary-600 text-white border-primary-600 shadow-primary-500/30' : 'border-white bg-white text-gray-600 hover:border-primary-300'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Launch button */}
          <button
            disabled={!customTopic.trim()}
            onClick={() => { startQuiz({ type: 'custom', subject: null, subjectName: customTopic.trim(), title: customTopic.trim() }); setCustomTopic(''); }}
            className={`w-full max-w-lg mx-auto block py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${customTopic.trim() ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
            Lancer le QCM
          </button>
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
      </div>
    );
  }

  // ===== LOADING VIEW =====
  if (view === 'loading') {
    const subject = selectedTopic?.subject ? SUBJECTS.find(s => s.id === selectedTopic.subject) : null;
    const colors = getColors(subject?.color);
    const tip = LOADING_TIPS[tipIndex];
    return (
      <div className={`bg-slate-50 flex items-center justify-center ${onBack ? 'min-h-[60vh]' : 'min-h-screen pt-16'}`}>
        <div className="max-w-md mx-auto px-4 text-center w-full">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
            <div className="mb-6">
              <div className={`w-20 h-20 mx-auto rounded-2xl ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}>
                {subject ? (
                  <SubjectIcon subjectId={subject.id} className={`w-10 h-10 ${colors.icon} animate-pulse`} />
                ) : (
                  <svg className={`w-10 h-10 ${colors.icon} animate-pulse`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                )}
              </div>
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Pr&eacute;paration du QCM...</h2>
            <p className="text-sm text-gray-500 mb-1"><strong>{selectedTopic?.count || questionCount} questions</strong> sur :</p>
            <p className="text-sm text-gray-700 font-semibold mb-6">{selectedTopic?.title || selectedTopic?.subjectName}</p>

            {/* Indeterminate progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-primary-500 rounded-full loading-progress" />
            </div>

            {/* Rotating tip */}
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 min-h-[72px] flex items-center gap-3 text-left">
              <span className="text-2xl shrink-0">{tip.icon}</span>
              <p key={tipIndex} className="text-xs text-primary-700 font-medium leading-relaxed tip-fade">{tip.text}</p>
            </div>

            <button onClick={() => { onBack ? onBack() : setView('hero'); }} className="mt-6 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors">Annuler</button>
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
      <div className={`bg-slate-50 pb-8 ${onBack ? 'pt-6' : 'min-h-screen pt-20'}`}>
        <div className="max-w-3xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
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
          <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
            <div className="h-2 bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>

          {/* Question pills — horizontal scroll on mobile */}
          <div ref={pillsRef} className="flex gap-1.5 mb-5 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {questions.map((_, i) => {
              let cls = 'bg-gray-100 text-gray-400'; // unanswered
              if (i === currentIndex) cls = 'bg-primary-600 text-white shadow-md shadow-primary-500/40';
              else if (answers[i] !== null) cls = answers[i].correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
              const canClick = answers[i] !== null || i === currentIndex;
              return (
                <button key={i} onClick={() => canClick && goToQuestion(i)} disabled={!canClick} className={`w-8 h-8 shrink-0 rounded-lg text-xs font-bold transition-all snap-center ${cls}`}>{i + 1}</button>
              );
            })}
          </div>

          {/* Question card */}
          <div key={currentIndex} className="question-in bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8 shadow-sm relative">
            {/* Animation +X XP sur bonne réponse */}
            {xpPop && xpPop.key === currentIndex && alreadyAnswered?.correct && (
              <span key={xpPop.key} className="xp-pop" style={{ position: 'absolute', top: 14, right: 16, background: '#7c3aed', color: '#fff', fontSize: 12, fontWeight: 800, padding: '4px 11px', borderRadius: 14, boxShadow: '0 4px 14px rgba(124,58,237,0.35)', pointerEvents: 'none', zIndex: 5 }}>
                +{xpPop.amount} XP
              </span>
            )}
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium text-gray-500">Question {currentIndex + 1}</span>
              <span className={`px-3 py-1 ${colors.badge} text-xs font-bold rounded-full`}>{selectedTopic?.title || badgeText}</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-relaxed">{q.question}</p>

            <div className="space-y-3 mb-6">
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
                  <button key={i} onClick={() => answerQuestion(i)} disabled={disabled} className={`w-full text-left px-5 py-4 rounded-xl text-sm md:text-base font-medium flex items-center gap-3 transition-all ${btnClass} ${animClass} ${!alreadyAnswered ? 'option-slide-in' : ''}`} style={!alreadyAnswered ? { animationDelay: `${i * 80}ms` } : undefined}>
                    <span className={`w-8 h-8 rounded-lg ${badgeClass} flex items-center justify-center text-sm font-bold shrink-0`}>{String.fromCharCode(65 + i)}</span>
                    <span className="flex-1">{opt.text}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* « Je ne sais pas » : honnêteté récompensée, la question part en consolidation */}
            {!isValidated && (
              <button
                onClick={answerDontKnow}
                className="w-full py-2.5 text-sm font-medium text-gray-400 border border-dashed border-gray-300 rounded-xl hover:text-gray-600 hover:border-gray-400 transition-colors"
              >
                🤷 Je ne sais pas — voir la réponse
              </button>
            )}

            {/* Next button */}
            {isValidated && (
              <button onClick={handleNextOrResults} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                {answeredCount >= total ? 'Voir les r\u00e9sultats' : 'Question suivante'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </button>
            )}

            {/* Keyboard hints */}
            <div className="hidden sm:flex items-center justify-center gap-4 mt-3 text-[10px] text-gray-400">
              <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[9px]">A-D</kbd> Choisir</span>
              <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[9px]">Entr&eacute;e</kbd> Suivante</span>
              <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[9px]">Esc</kbd> Quitter</span>
            </div>

            {/* Explanation */}
            {isValidated && alreadyAnswered && (
              <div className={`mt-4 p-4 rounded-xl text-sm font-medium ${alreadyAnswered.correct ? 'bg-green-50 text-green-700 border border-green-200' : alreadyAnswered.idk ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <strong>{alreadyAnswered.correct ? 'Bonne r\u00e9ponse !' : alreadyAnswered.idk ? 'Bien vu de ne pas deviner \u2014 elle part dans ta pile \u00ab \u00c0 consolider \u00bb.' : 'Mauvaise r\u00e9ponse.'}</strong>{' '}
                {q.explanation}
              </div>
            )}
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

    const scoreMessage = pct >= 90 ? 'Excellent !' : pct >= 70 ? 'Très bien !' : pct >= 50 ? 'Pas mal !' : 'Courage !';
    const showConfetti = pct >= 70;

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
                🔁 {incorrectCount} question{incorrectCount > 1 ? 's' : ''} ajoutée{incorrectCount > 1 ? 's' : ''} à ta pile « À consolider »
              </p>
              <p className="text-xs text-indigo-500 mt-1">Retrouve-les sur ton tableau de bord — réponds juste pour les retirer</p>
            </div>
          )}

          {/* Score circle */}
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
              <p className="mt-2.5 text-[11px] text-gray-400">Gratuit · sans carte bancaire · <strong className="text-violet-600">2 jours de Premium offerts</strong></p>
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
