'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useTimer } from '@/hooks/useTimer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SUBJECTS } from '@/data/subjects';
import { FICHES_DATA } from '@/data/fiches';
import { QUESTIONS } from '@/data/questions';
import { SUBJECT_COLORS, SUBJECT_ICONS, getSubjectName } from '@/data/constants';
import { useGeminiQuestions } from '@/hooks/useGeminiQuestions';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/contexts/PremiumContext';
import LoginRequiredModal from '@/components/ui/LoginRequiredModal';
import UpgradeModal from '@/components/ui/UpgradeModal';

const LOADING_TIPS = [
  { icon: '💡', text: 'Relisez vos erreurs après chaque épreuve pour progresser plus vite.' },
  { icon: '🎯', text: 'Visez 70\u00a0% de bonnes réponses avant de passer à un nouveau chapitre.' },
  { icon: '⏱️', text: 'En conditions réelles, comptez ~1\u00a0min\u00a030 par question.' },
  { icon: '📚', text: 'Alternez entre différentes matières pour renforcer la mémorisation.' },
  { icon: '🔁', text: 'La répétition espacée est la clé pour retenir sur le long terme.' },
  { icon: '🧠', text: 'Faire des QCM est plus efficace que relire ses cours passivement.' },
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

/* Confirmation modal before starting a fiche-based exam */
function StartConfirmModal({ fiche, subject, questionCount, duration, onConfirm, onCancel }) {
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
          <span className="text-sm text-gray-500">Format :</span>
          <span className="font-bold text-gray-900">{questionCount} questions &middot; {duration} min</span>
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

/* Mixed exam confirmation modal */
function MixedExamModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl border border-gray-200 p-6 max-w-sm w-full shadow-xl animate-[modalEnter_0.25s_ease-out]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-600">&Eacute;preuve compl&egrave;te</p>
            <h3 className="font-bold text-gray-900 text-sm">Examen complet</h3>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">40 questions m&eacute;lang&eacute;es couvrant l&apos;ensemble des mati&egrave;res du tronc commun. Conditions proches du concours.</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {SUBJECTS.map(s => {
            const colors = getColors(s.color);
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <SubjectIcon subjectId={s.id} className={`w-3.5 h-3.5 ${colors.icon}`} />
                </div>
                <span className="text-xs font-medium text-gray-700">{s.name}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mb-5 px-1 py-2 bg-emerald-50 rounded-lg">
          <span className="text-sm text-gray-600 ml-2">Format :</span>
          <span className="font-bold text-emerald-700 mr-2">40 questions &middot; 60 min</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 text-sm hover:border-gray-300 transition-colors">
            Annuler
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
            Commencer
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* Quit confirmation modal */
function QuitModal({ answered, total, timerFormatted, onContinue, onQuit }) {
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
          <h3 className="font-bold text-gray-900 text-lg mb-1">Quitter l&apos;&eacute;preuve ?</h3>
          <p className="text-sm text-gray-500">Votre progression sera perdue.</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 mb-5 flex justify-around text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">{answered}/{total}</p>
            <p className="text-xs text-gray-500">R&eacute;pondues</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div>
            <p className="text-lg font-bold text-gray-900">{timerFormatted}</p>
            <p className="text-xs text-gray-500">Restant</p>
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

/* Finish confirmation modal */
function FinishModal({ unanswered, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-[modalEnter_0.25s_ease-out]">
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Terminer l&apos;&eacute;preuve ?</h3>
          {unanswered > 0 ? (
            <p className="text-sm text-gray-500">Vous avez <strong className="text-amber-600">{unanswered} question{unanswered > 1 ? 's' : ''}</strong> sans r&eacute;ponse.</p>
          ) : (
            <p className="text-sm text-gray-500">Vous avez r&eacute;pondu &agrave; toutes les questions.</p>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 text-sm hover:border-gray-300 transition-colors">
            Continuer
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors">
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== MAIN PAGE COMPONENT ========== */
export default function ExamenPage() {
  // ----- State machine -----
  const [view, setView] = useState('hero');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [examDuration, setExamDuration] = useState(30);
  const [examQuestionCount, setExamQuestionCount] = useState(20);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showMixedModal, setShowMixedModal] = useState(false);
  const [pendingFiche, setPendingFiche] = useState(null);
  const [customText, setCustomText] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [correctionOpen, setCorrectionOpen] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTier, setUpgradeTier] = useState('essentiel');
  const pillsRef = useRef(null);

  // ----- Auth & Premium -----
  const { user } = useAuth();
  const { isEssentiel, isPremiumPlus } = usePremium();

  // ----- Finish ref for timer callback -----
  const finishRef = useRef(null);

  // ----- Finish exam function -----
  const finishExam = useCallback(() => {
    setView('results');
  }, []);

  // Keep finishRef in sync
  useEffect(() => {
    finishRef.current = finishExam;
  }, [finishExam]);

  // ----- Timer hook: countdown -----
  const timer = useTimer({
    mode: 'down',
    durationMinutes: examDuration,
    onExpire: () => finishRef.current?.(),
  });

  // ----- Gemini AI -----
  const { generateQuestions: generateAIQuestions, isGenerating } = useGeminiQuestions();

  // ----- Stats -----
  const [stats, setStats] = useLocalStorage('prepa-examen-stats', { sessions: [], totalCorrect: 0, totalAnswered: 0 });

  const totalDone = stats.sessions?.length || 0;
  const avgScore = totalDone > 0 ? Math.round(stats.sessions.reduce((a, s) => a + (s.percentage || 0), 0) / totalDone) : 0;
  const fichesCount = FICHES_DATA?.length || 0;

  // ----- Static question selection (fallback) -----
  const generateStaticQuestions = useCallback((source, count) => {
    let pool = [];
    if (source.type === 'fiche') {
      pool = QUESTIONS.filter(q => q.subject === source.subject);
    } else if (source.type === 'custom') {
      if (source.subject) {
        pool = QUESTIONS.filter(q => q.subject === source.subject);
      } else {
        pool = [...QUESTIONS];
      }
    } else if (source.type === 'mixed') {
      pool = [...QUESTIONS];
    } else if (source.subjectId) {
      pool = QUESTIONS.filter(q => q.subject === source.subjectId);
    } else {
      pool = [...QUESTIONS];
    }
    const shuffled = shuffleArray(pool);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }, []);

  // ----- Helper to launch exam with questions -----
  const startWithQuestions = useCallback((qs) => {
    if (!qs || qs.length === 0) {
      setView('hero');
      return;
    }
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrentQ(0);
    setStartTime(Date.now());
    timer.reset();
    setTimeout(() => timer.start(), 50);
    setView('exam');
  }, [timer]);

  // ----- Launch exam (AI generation + static fallback) -----
  const launchExam = useCallback(async (source) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    // Examen complet (40q) = Premium+ requis
    if (source.type === 'mixed') {
      if (!isPremiumPlus) {
        setUpgradeTier('premium+');
        setShowUpgradeModal(true);
        return;
      }
    } else {
      // Examen classique = Essentiel requis
      if (!isEssentiel) {
        setUpgradeTier('essentiel');
        setShowUpgradeModal(true);
        return;
      }
    }
    setSelectedTopic(source);

    let duration = 30;
    let qCount = 20;
    if (source.type === 'mixed') {
      duration = 60;
      qCount = 40;
    }
    setExamDuration(duration);
    setExamQuestionCount(qCount);
    setView('loading');

    // Try AI generation first
    const subjectId = source.subject || source.subjectId || null;
    const subjectName = subjectId ? (source.subjectName || getSubjectName(subjectId)) : (source.title || source.subjectName);
    const ficheTopic = source.title || null;

    if (subjectId || ficheTopic) {
      const aiQuestions = await generateAIQuestions(subjectId, subjectName, qCount, 'examen', ficheTopic);
      if (aiQuestions && aiQuestions.length > 0) {
        startWithQuestions(aiQuestions);
        return;
      }
    }

    // Fallback to static questions
    const qs = generateStaticQuestions(source, qCount);
    startWithQuestions(qs);
  }, [user, isEssentiel, isPremiumPlus, generateStaticQuestions, generateAIQuestions, startWithQuestions, timer]);

  // ----- Fiche selection -----
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
    launchExam({
      type: 'fiche',
      subject: fiche.subject,
      subjectName: subject?.name || '',
      title: fiche.title,
      summary: fiche.summary,
    });
  }, [pendingFiche, launchExam]);

  // ----- Custom exam start -----
  const startCustomExam = useCallback(() => {
    if (!customText.trim()) return;
    launchExam({
      type: 'custom',
      subject: null,
      subjectName: 'Sujet libre',
      title: customText.trim().length > 60 ? customText.trim().substring(0, 57) + '...' : customText.trim(),
    });
  }, [customText, launchExam]);

  // ----- Exam interactions (NO instant feedback) -----
  const selectOption = useCallback((optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIndex;
    setAnswers(newAnswers);
  }, [answers, currentQ]);

  const goToQuestion = useCallback((index) => {
    setCurrentQ(index);
  }, []);

  const prevQuestion = useCallback(() => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  }, [currentQ]);

  const nextQuestion = useCallback(() => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  }, [currentQ, questions.length]);

  // ----- Confirm finish -----
  const confirmFinish = useCallback(() => {
    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0) {
      setShowFinishModal(true);
    } else {
      timer.stop();
      finishExam();
    }
  }, [answers, timer, finishExam]);

  const doFinish = useCallback(() => {
    setShowFinishModal(false);
    timer.stop();
    finishExam();
  }, [timer, finishExam]);

  // ----- Quit -----
  const confirmQuit = useCallback(() => {
    timer.stop();
    setShowQuitModal(false);
    setView('hero');
  }, [timer]);

  // ----- Save stats on results -----
  useEffect(() => {
    if (view !== 'results' || questions.length === 0) return;

    const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    let correct = 0;
    questions.forEach((q, i) => {
      const sel = answers[i];
      if (sel !== null) {
        const correctIdx = q.options.findIndex(o => o.correct);
        if (sel === correctIdx) correct++;
      }
    });

    const pct = Math.round((correct / questions.length) * 100);

    let subjectId = selectedTopic?.subject || 'custom';
    let subjectName = selectedTopic?.subjectName || 'Sujet libre';
    if (selectedTopic?.type === 'mixed') {
      subjectId = 'mixed';
      subjectName = 'Examen complet';
    }

    setStats(prev => {
      const newSession = {
        subject: subjectId,
        subjectName,
        correct,
        total: questions.length,
        percentage: pct,
        duration: elapsed,
        date: new Date().toISOString(),
      };
      const sessions = [newSession, ...(prev.sessions || [])].slice(0, 50);
      return { ...prev, sessions, totalCorrect: (prev.totalCorrect || 0) + correct, totalAnswered: (prev.totalAnswered || 0) + questions.length };
    });
    // Only run once when entering results
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // ----- Loading tips rotation -----
  useEffect(() => {
    if (view !== 'loading') return;
    const interval = setInterval(() => setTipIndex(prev => (prev + 1) % LOADING_TIPS.length), 3500);
    return () => clearInterval(interval);
  }, [view]);

  // ----- Auto-scroll active pill -----
  useEffect(() => {
    if (view !== 'exam' || !pillsRef.current) return;
    const active = pillsRef.current.children[currentQ];
    if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [currentQ, view]);

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
                  <span className="text-sm font-semibold text-primary-700">Conditions r&eacute;elles</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-5">
                  Entra&icirc;nez-vous en{' '}
                  <span className="bg-gradient-to-r from-primary-600 via-violet-600 to-primary-500 bg-clip-text text-transparent">
                    conditions r&eacute;elles
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                  Des questions de niveau concours, un chronomètre et une{' '}
                  <strong className="text-gray-900">correction d&eacute;taill&eacute;e</strong> &agrave; la fin.
                  &Eacute;preuve classique de 20 questions en 30 min ou{' '}
                  <strong className="text-gray-900">examen complet</strong> de 40 questions en 60 min.
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
                    <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    </div>
                    <div>
                      <div className="text-xl font-black text-gray-900">30-60 min</div>
                      <div className="text-xs font-medium text-gray-500">Par &eacute;preuve</div>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-gray-200/60 hidden sm:block" />
                  <div className="flex items-center gap-3 transition-transform hover:-translate-y-0.5">
                    <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
                    </div>
                    <div>
                      <div className="text-xl font-black text-gray-900">6</div>
                      <div className="text-xs font-medium text-gray-500">Mati&egrave;res</div>
                    </div>
                  </div>
                </div>
                {/* CTA */}
                <button
                  onClick={() => setView('modeChoice')}
                  className="group px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 flex items-center gap-3 text-lg"
                >
                  Commencer une &eacute;preuve
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </button>
              </div>

              {/* Right: Mock exam preview */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-sm">
                  <div className="animate-[mockFloat_5s_ease-in-out_infinite] bg-white rounded-2xl shadow-xl shadow-primary-500/10 border border-gray-100 p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">Anatomie</span>
                      <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                        <span className="text-sm font-mono font-bold text-gray-700">24:37</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-3 leading-relaxed">Quel muscle est responsable de la flexion de l&apos;avant-bras sur le bras ?</p>
                    <div className="space-y-2">
                      <div className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-medium text-gray-600 flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">A</span>
                        Triceps brachial
                      </div>
                      <div className="px-4 py-2.5 rounded-xl border-2 border-primary-500 bg-primary-50 text-xs font-medium text-primary-700 flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700">B</span>
                        Biceps brachial
                      </div>
                      <div className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-medium text-gray-600 flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">C</span>
                        Delto&iuml;de
                      </div>
                    </div>
                    <div className="flex justify-center gap-1.5 mt-4">
                      {[1, 2, 3, 4, 5].map(n => (
                        <span key={n} className={`w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center ${n === 3 ? 'bg-primary-500 text-white shadow-sm' : n <= 2 ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'}`}>{n}</span>
                      ))}
                      <span className="text-[9px] text-gray-400 flex items-center">...</span>
                      <span className="w-5 h-5 rounded bg-gray-100 text-gray-400 text-[9px] font-bold flex items-center justify-center">20</span>
                    </div>
                  </div>
                  {totalDone > 0 ? (
                    <div className="animate-[mockFloat_5s_ease-in-out_infinite_1.5s] bg-white rounded-2xl shadow-lg shadow-primary-500/5 border border-gray-100 p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{totalDone} &eacute;preuve{totalDone > 1 ? 's' : ''}</p>
                          <p className="text-xs text-gray-500">Score moyen : <strong className={avgScore >= 70 ? 'text-emerald-600' : avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}>{avgScore}%</strong></p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-[mockFloat_5s_ease-in-out_infinite_1.5s] bg-gradient-to-br from-primary-600 to-violet-600 rounded-2xl shadow-lg shadow-primary-500/20 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Correction &agrave; la fin</p>
                          <p className="text-xs text-white/70">Explications d&eacute;taill&eacute;es pour chaque question</p>
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

  // ===== MODE CHOICE VIEW =====
  if (view === 'modeChoice') {
    return (
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setView('hero')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Retour
          </button>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full border border-primary-200 mb-5">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
              <span className="text-sm font-semibold text-primary-700">Nouvelle &eacute;preuve</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">Comment souhaitez-vous r&eacute;viser ?</h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">Choisissez votre mode de r&eacute;vision pour commencer.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {/* Fiches-based */}
            <button onClick={() => setView('fichesSelection')} className="group bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10 transition-all hover:-translate-y-0.5">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">&Agrave; partir de nos fiches</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">G&eacute;n&eacute;rez une &eacute;preuve &agrave; partir de nos fiches de r&eacute;vision et de nos cours, class&eacute;s par mati&egrave;re.</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    {fichesCount} fiches
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    20 questions &middot; 30 min
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </div>
            </button>
            {/* Custom */}
            <button onClick={() => setView('customSelection')} className="group bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10 transition-all hover:-translate-y-0.5">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sujet personnalis&eacute;</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">Choisissez une mati&egrave;re pour une &eacute;preuve de 20 questions en 30 min.</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                    Th&egrave;me libre
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    20 questions &middot; 30 min
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </div>
            </button>
          </div>
          {/* Mixed exam full-width */}
          <div className="mb-8">
            <button onClick={() => setShowMixedModal(true)} className="group bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all w-full hover:-translate-y-0.5">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">Examen complet</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wide">Concours</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">&Eacute;preuve de 40 questions m&eacute;lang&eacute;es sur l&apos;ensemble des mati&egrave;res du tronc commun. Conditions proches du concours.</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                      40 questions &middot; 60 min
                    </span>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
        {showMixedModal && (
          <MixedExamModal
            onConfirm={() => { setShowMixedModal(false); launchExam({ type: 'mixed' }); }}
            onCancel={() => setShowMixedModal(false)}
          />
        )}
        {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        {showUpgradeModal && <UpgradeModal requiredTier={upgradeTier} onClose={() => setShowUpgradeModal(false)} />}
      </section>
    );
  }

  // ===== FICHES SELECTION VIEW =====
  if (view === 'fichesSelection') {
    const filteredFiches = getFilteredFiches();
    return (
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setView('modeChoice')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Retour
          </button>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Choisissez votre fiche</h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">S&eacute;lectionnez un sujet parmi nos fiches de r&eacute;vision pour g&eacute;n&eacute;rer votre &eacute;preuve de 20 questions.</p>
          </div>
          {/* Exam info banner */}
          <div className="bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl border-2 border-primary-200 p-5 mb-8 max-w-lg mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/50 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">20 questions &middot; 30 minutes &middot; Correction &agrave; la fin</p>
                <p className="text-xs text-gray-500 mt-0.5">&Eacute;preuve en conditions r&eacute;elles de concours</p>
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
        {pendingFiche && (
          <StartConfirmModal
            fiche={pendingFiche.fiche}
            subject={pendingFiche.subject}
            questionCount={20}
            duration={30}
            onConfirm={confirmFicheStart}
            onCancel={() => setPendingFiche(null)}
          />
        )}
        {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        {showUpgradeModal && <UpgradeModal requiredTier={upgradeTier} onClose={() => setShowUpgradeModal(false)} />}
      </section>
    );
  }

  // ===== CUSTOM SELECTION VIEW =====
  if (view === 'customSelection') {
    return (
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setView('modeChoice')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Retour
          </button>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Sujet personnalis&eacute;</h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">Choisissez une mati&egrave;re pour une &eacute;preuve de 20 questions en 30 min.</p>
          </div>
          {/* Exam info banner */}
          <div className="bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl border-2 border-primary-200 p-5 mb-8 max-w-lg mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/50 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">20 questions &middot; 30 minutes &middot; Correction &agrave; la fin</p>
                <p className="text-xs text-gray-500 mt-0.5">&Eacute;preuve en conditions r&eacute;elles de concours</p>
              </div>
            </div>
          </div>
          {/* Specific topic input */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-8 max-w-lg mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-violet-100 rounded-xl shadow-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
              </div>
              <p className="text-base font-bold text-gray-900">Sujet pr&eacute;cis <span className="text-gray-400 font-normal text-sm">(optionnel)</span></p>
            </div>
            <p className="text-xs text-gray-500 mb-4 ml-[52px]">Pr&eacute;cisez un th&egrave;me pour cibler les questions g&eacute;n&eacute;r&eacute;es</p>
            <input
              type="text"
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              placeholder="Ex : Ost&eacute;ologie du membre sup&eacute;rieur, Cycle de Krebs, Loi normale..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all placeholder:text-gray-400"
            />
          </div>
          {/* Subject cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {SUBJECTS.map(s => {
              const colors = getColors(s.color);
              return (
                <button key={s.id} onClick={() => { launchExam({ type: 'custom', subject: s.id, subjectName: s.name, title: customTopic.trim() || s.name }); setCustomTopic(''); }} className="bg-white rounded-xl p-4 text-left border border-gray-200 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-primary-300 cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-3`}>
                    <SubjectIcon subjectId={s.id} className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">{s.name}</h4>
                  <p className="text-xs text-gray-500">{QUESTIONS.filter(q => q.subject === s.id).length} questions</p>
                </button>
              );
            })}
          </div>
          {/* All subjects */}
          <button onClick={() => { launchExam({ type: 'custom', subject: null, subjectName: 'Toutes mati\u00e8res', title: customTopic.trim() || 'Toutes les mati\u00e8res' }); setCustomTopic(''); }} className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            Toutes les mati&egrave;res (20 questions &middot; 30 min)
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
          </button>
        </div>
        {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        {showUpgradeModal && <UpgradeModal requiredTier={upgradeTier} onClose={() => setShowUpgradeModal(false)} />}
      </section>
    );
  }

  // ===== LOADING VIEW =====
  if (view === 'loading') {
    const subject = selectedTopic?.subject ? SUBJECTS.find(s => s.id === selectedTopic.subject) : null;
    const colors = selectedTopic?.type === 'mixed' ? getColors('emerald') : getColors(subject?.color);
    const qCount = selectedTopic?.type === 'mixed' ? 40 : 20;
    const topicTitle = selectedTopic?.type === 'mixed' ? 'Toutes les mati\u00e8res du tronc commun' : selectedTopic?.title;
    const tip = LOADING_TIPS[tipIndex];
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
        <div className="max-w-md mx-auto px-4 text-center w-full">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
            <div className="mb-6">
              <div className={`w-20 h-20 mx-auto rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center animate-pulse`}>
                {subject ? (
                  <SubjectIcon subjectId={subject.id} className={`w-10 h-10 ${colors.icon}`} />
                ) : (
                  <svg className={`w-10 h-10 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                )}
              </div>
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Pr&eacute;paration de l&apos;&eacute;preuve...</h2>
            <p className="text-sm text-gray-500 mb-1"><strong>{qCount} questions</strong> sur :</p>
            <p className="text-sm text-gray-700 font-semibold mb-6">{topicTitle}</p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full loading-progress" />
            </div>

            {/* Rotating tip */}
            <div className="bg-primary-50 rounded-xl p-4 mb-6 min-h-[72px] flex items-center justify-center">
              <p key={tipIndex} className="text-sm text-primary-800 leading-relaxed tip-fade">
                <span className="mr-1.5">{tip.icon}</span>
                {tip.text}
              </p>
            </div>

            <button onClick={() => setView('hero')} className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors">Annuler</button>
          </div>
        </div>
      </div>
    );
  }

  // ===== EXAM VIEW (NO INSTANT FEEDBACK) =====
  if (view === 'exam') {
    const q = questions[currentQ];
    if (!q) return null;
    const total = questions.length;
    const answered = answers.filter(a => a !== null).length;
    const isTimeLow = timer.seconds <= 300;

    let badgeText = '';
    if (selectedTopic?.type === 'fiche') {
      const subject = SUBJECTS.find(s => s.id === selectedTopic.subject);
      badgeText = subject?.name || '';
    } else if (selectedTopic?.type === 'custom') {
      badgeText = selectedTopic.subjectName || 'Sujet libre';
    } else if (selectedTopic?.type === 'mixed') {
      badgeText = 'Examen complet';
    }

    return (
      <div className="min-h-screen bg-slate-50 pt-20 pb-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setShowQuitModal(true)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
              Quitter
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                <span className={`text-sm font-mono font-bold ${isTimeLow ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>{timer.formatted}</span>
              </div>
              <span className="text-sm font-semibold text-gray-500">{answered}/{total}</span>
            </div>
          </div>

          {/* Question pills -- horizontal scroll */}
          <div ref={pillsRef} className="flex gap-1.5 mb-5 overflow-x-auto scrollbar-hide snap-x pb-1">
            {questions.map((_, i) => {
              let cls = 'bg-gray-100 text-gray-400'; // unanswered
              if (i === currentQ) cls = 'bg-primary-600 text-white shadow-md shadow-primary-500/40';
              else if (answers[i] !== null) cls = 'bg-primary-100 text-primary-700';
              return (
                <button key={i} onClick={() => goToQuestion(i)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shrink-0 snap-center ${cls}`}>{i + 1}</button>
              );
            })}
          </div>

          {/* Question card */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium text-gray-500">Question {currentQ + 1}/{total}</span>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">{badgeText}</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-relaxed">{q.question}</p>

            <div className="space-y-3 mb-6">
              {q.options.map((opt, i) => {
                const isSelected = answers[currentQ] === i;
                return (
                  <button key={i} onClick={() => selectOption(i)} className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm md:text-base font-medium flex items-center gap-3 transition-all ${isSelected ? 'border-primary-500 bg-primary-50 text-primary-800' : 'border-gray-200 text-gray-700 hover:border-primary-400 hover:bg-primary-50/50'}`}>
                    <span className={`w-8 h-8 rounded-lg ${isSelected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'} flex items-center justify-center text-sm font-bold shrink-0`}>{String.fromCharCode(65 + i)}</span>
                    <span className="flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-between gap-3">
              <button onClick={prevQuestion} className={`px-5 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors text-sm ${currentQ === 0 ? 'invisible' : ''}`} disabled={currentQ === 0}>
                Pr&eacute;c&eacute;dent
              </button>
              {currentQ === total - 1 ? (
                <button onClick={confirmFinish} className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors text-sm flex items-center gap-2">
                  Terminer l&apos;&eacute;preuve
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </button>
              ) : (
                <button onClick={nextQuestion} className="px-5 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm flex items-center gap-2">
                  Suivante
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {showQuitModal && (
          <QuitModal
            answered={answered}
            total={total}
            timerFormatted={timer.formatted}
            onContinue={() => setShowQuitModal(false)}
            onQuit={confirmQuit}
          />
        )}
        {showFinishModal && (
          <FinishModal
            unanswered={answers.filter(a => a === null).length}
            onConfirm={doFinish}
            onCancel={() => setShowFinishModal(false)}
          />
        )}
      </div>
    );
  }

  // ===== RESULTS VIEW =====
  if (view === 'results') {
    const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    let subjectName = selectedTopic?.subjectName || 'Sujet libre';
    if (selectedTopic?.type === 'mixed') subjectName = 'Examen complet';

    // Score calculation
    const details = questions.map((q, i) => {
      const sel = answers[i];
      const correctIdx = q.options.findIndex(o => o.correct);
      const isCorrect = sel === correctIdx;
      return { question: q, selected: sel, correctIndex: correctIdx, isCorrect };
    });

    const correct = details.filter(d => d.isCorrect).length;
    const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    const circumference = 2 * Math.PI * 56;
    const offset = circumference - (pct / 100) * circumference;
    const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
    const answeredTotal = answers.filter(a => a !== null).length;

    const scoreMessage = pct >= 90 ? 'Excellent !' : pct >= 70 ? 'Très bien !' : pct >= 50 ? 'Pas mal !' : 'Courage !';
    const showConfetti = pct >= 70;

    return (
      <section className="py-24 md:py-28 min-h-screen bg-slate-50">
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
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">R&eacute;sultats de l&apos;&eacute;preuve</h2>
            <p className="text-gray-500">{subjectName} &mdash; Mode Examen</p>
          </div>

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
                <span className="text-xs text-gray-500">{correct}/{questions.length}</span>
              </div>
            </div>
            <p className="text-lg font-bold mt-3" style={{ color }}>{scoreMessage}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white rounded-xl px-4 py-3 text-center border border-gray-100">
              <p className="text-base font-bold text-gray-900">{subjectName}</p>
              <p className="text-xs text-gray-500">Mati&egrave;re</p>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 text-center border border-gray-100">
              <p className="text-base font-bold text-gray-900">{minutes}m {seconds.toString().padStart(2, '0')}s</p>
              <p className="text-xs text-gray-500">Dur&eacute;e</p>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 text-center border border-gray-100">
              <p className="text-base font-bold text-gray-900">{answeredTotal}/{questions.length}</p>
              <p className="text-xs text-gray-500">R&eacute;pondues</p>
            </div>
          </div>

          {/* Correction */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-1">
              <button onClick={() => setCorrectionOpen(!correctionOpen)} className="flex items-center gap-2 group">
                <h3 className="font-bold text-gray-900 text-lg">Correction d&eacute;taill&eacute;e</h3>
                <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${correctionOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
              </button>
            </div>
            <div className={`correction-collapse ${correctionOpen ? 'open' : ''}`}>
              <div className="space-y-4 pt-4">
                {details.map((d, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${d.isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full ${d.isCorrect ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center shrink-0 mt-0.5`}>
                        {d.isCorrect ? (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">Q{i + 1}. {d.question.question}</p>
                        {d.selected !== null ? (
                          <p className={`text-xs mt-1 ${d.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            Votre r&eacute;ponse : <strong>{d.question.options[d.selected].text}</strong>
                            {!d.isCorrect && <> &mdash; Bonne r&eacute;ponse : <strong>{d.question.options[d.correctIndex].text}</strong></>}
                          </p>
                        ) : (
                          <p className="text-xs mt-1 text-gray-500">Non r&eacute;pondue &mdash; Bonne r&eacute;ponse : <strong>{d.question.options[d.correctIndex].text}</strong></p>
                        )}
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed">{d.question.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setView('modeChoice')} className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
              Nouvelle &eacute;preuve
            </button>
            <button onClick={() => setView('hero')} className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors">
              Retour &agrave; l&apos;accueil
            </button>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
