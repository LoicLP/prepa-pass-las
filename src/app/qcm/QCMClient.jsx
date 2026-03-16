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

/* ========== MAIN PAGE COMPONENT ========== */
export default function QCMPage() {
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
  const [resultsFilter, setResultsFilter] = useState('all');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [correctionOpen, setCorrectionOpen] = useState(true);
  const pillsRef = useRef(null);

  // ----- Hooks -----
  const { user } = useAuth();
  const { isEssentiel } = usePremium();
  const timer = useTimer({ mode: 'up' });
  const [stats, setStats] = useLocalStorage('prepa-qcm-stats', { sessions: [], totalCorrect: 0, totalAnswered: 0 });
  const { generateQuestions: generateAIQuestions, isGenerating } = useGeminiQuestions();

  const totalDone = stats.sessions?.length || 0;
  const avgScore = totalDone > 0 ? Math.round(stats.sessions.reduce((a, s) => a + (s.percentage || s.score || 0), 0) / totalDone) : 0;
  const fichesCount = FICHES_DATA?.length || 0;

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

  // ----- Start quiz (AI generation + static fallback) -----
  const startQuiz = useCallback(async (topic) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    // Limite 1 QCM/jour en gratuit
    if (!isEssentiel) {
      const today = new Date().toISOString().split('T')[0];
      const lastDate = localStorage.getItem('prepa-qcm-today-date') || '';
      const todayCount = lastDate === today ? parseInt(localStorage.getItem('prepa-qcm-today-count') || '0') : 0;
      if (todayCount >= 1) {
        setShowUpgradeModal(true);
        return;
      }
      localStorage.setItem('prepa-qcm-today-date', today);
      localStorage.setItem('prepa-qcm-today-count', String(todayCount + 1));
    }
    setSelectedTopic(topic);
    setView('loading');

    // Try AI generation first
    const subjectName = topic.subject ? (topic.subjectName || getSubjectName(topic.subject)) : (topic.title || topic.subjectName);
    const ficheTopic = topic.title || null;

    if (topic.subject || ficheTopic) {
      const aiQuestions = await generateAIQuestions(topic.subject, subjectName, questionCount, 'qcm', ficheTopic);
      if (aiQuestions && aiQuestions.length > 0) {
        launchWithQuestions(aiQuestions);
        return;
      }
    }

    // Fallback to static questions
    const qs = generateStaticQuestions(topic, questionCount);
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
    });
  }, [pendingFiche, startQuiz]);

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

    const newAnswers = [...answers];
    newAnswers[currentIndex] = { question: q, selected: optionIndex, correct: isCorrect, correctIndex };
    setAnswers(newAnswers);
    setIsValidated(true);
  }, [isValidated, questions, currentIndex, score, streak, maxStreak, answers]);

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
    const validAnswers = answers.filter(a => a !== null);
    const correctCount = validAnswers.filter(a => a.correct).length;
    const pct = validAnswers.length > 0 ? Math.round((correctCount / validAnswers.length) * 100) : 0;

    // Save session
    setStats(prev => {
      const newSession = {
        subject: selectedTopic?.subject || 'custom',
        subjectName: selectedTopic?.subjectName || 'Sujet libre',
        topic: selectedTopic?.title || '',
        correct: correctCount,
        total: validAnswers.length,
        percentage: pct,
        duration: timer.seconds,
        date: new Date().toISOString(),
      };
      const sessions = [newSession, ...(prev.sessions || [])].slice(0, 50);
      return { ...prev, sessions, totalCorrect: (prev.totalCorrect || 0) + correctCount, totalAnswered: (prev.totalAnswered || 0) + validAnswers.length };
    });

    setView('results');
    setResultsFilter('all');
  }, [timer, answers, selectedTopic, setStats]);

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
    setShowQuitModal(false);
    setView('hero');
  }, [timer]);

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
                  Des <strong className="text-gray-900">questions illimit&eacute;es</strong> sur tous les sujets du programme PASS/LAS. <strong className="text-gray-900">Correction imm&eacute;diate</strong> avec
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
                <button
                  onClick={() => setView('modeChoice')}
                  className="group px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 flex items-center gap-3 text-lg"
                >
                  Commencer un QCM
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </button>
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
              <span className="text-sm font-semibold text-primary-700">Nouveau QCM</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">Comment souhaitez-vous r&eacute;viser ?</h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">Choisissez votre mode de r&eacute;vision pour commencer.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            <button onClick={() => setView('fichesSelection')} className="group bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10 transition-all hover:-translate-y-0.5">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">&Agrave; partir de nos fiches</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">G&eacute;n&eacute;rez un QCM &agrave; partir de nos fiches de r&eacute;vision et de nos cours, class&eacute;s par mati&egrave;re.</p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                  {fichesCount} fiches disponibles
                </span>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </div>
            </button>
            <button onClick={() => setView('customSelection')} className="group bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10 transition-all hover:-translate-y-0.5">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sujet personnalis&eacute;</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">Tapez n&rsquo;importe quel sujet et obtenez un QCM cibl&eacute; instantan&eacute;ment.</p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                  Th&egrave;me libre
                </span>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </div>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ===== FICHES SELECTION VIEW =====
  if (view === 'fichesSelection') {
    const filteredFiches = getFilteredFiches();
    const countPills = [5, 10, 15, 20];
    return (
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setView('modeChoice')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Retour
          </button>
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
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setView('modeChoice')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Retour
          </button>
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

  // ===== LOADING VIEW =====
  if (view === 'loading') {
    const subject = selectedTopic?.subject ? SUBJECTS.find(s => s.id === selectedTopic.subject) : null;
    const colors = getColors(subject?.color);
    const tip = LOADING_TIPS[tipIndex];
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
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
            <p className="text-sm text-gray-500 mb-1"><strong>{questionCount} questions</strong> sur :</p>
            <p className="text-sm text-gray-700 font-semibold mb-6">{selectedTopic?.title}</p>

            {/* Indeterminate progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-primary-500 rounded-full loading-progress" />
            </div>

            {/* Rotating tip */}
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 min-h-[72px] flex items-center gap-3 text-left">
              <span className="text-2xl shrink-0">{tip.icon}</span>
              <p key={tipIndex} className="text-xs text-primary-700 font-medium leading-relaxed tip-fade">{tip.text}</p>
            </div>

            <button onClick={() => { setView('hero'); }} className="mt-6 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors">Annuler</button>
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
      <div className="min-h-screen bg-slate-50 pt-20 pb-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setShowQuitModal(true)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
              Quitter
            </button>
            <div className="flex items-center gap-3">
              {streak >= 2 && (
                <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold animate-[streakPop_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
                  <span className="text-sm">&#x1F525;</span> {streak}
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                <span className="text-sm font-mono font-bold text-gray-700">{timer.formatted}</span>
              </div>
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
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium text-gray-500">Question {currentIndex + 1}</span>
              <span className={`px-3 py-1 ${colors.badge} text-xs font-bold rounded-full`}>{badgeText}</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-relaxed">{q.question}</p>

            <div className="space-y-3 mb-6">
              {q.options.map((opt, i) => {
                let btnClass = 'border-2 border-gray-200 text-gray-700 hover:border-primary-400 hover:bg-primary-50';
                let badgeClass = 'bg-gray-100 text-gray-500';
                let disabled = false;
                let icon = null;

                if (alreadyAnswered) {
                  disabled = true;
                  if (i === correctIndex) {
                    btnClass = 'border-2 border-emerald-400 bg-emerald-50 text-emerald-800';
                    badgeClass = 'bg-emerald-100 text-emerald-700';
                    icon = <svg className="w-4 h-4 ml-auto text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>;
                  } else if (i === alreadyAnswered.selected && !alreadyAnswered.correct) {
                    btnClass = 'border-2 border-red-400 bg-red-50 text-red-800';
                    badgeClass = 'bg-red-100 text-red-700';
                    icon = <svg className="w-4 h-4 ml-auto text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
                  } else {
                    btnClass = 'border-2 border-gray-200 text-gray-400';
                    badgeClass = 'bg-gray-100 text-gray-400';
                  }
                }

                return (
                  <button key={i} onClick={() => answerQuestion(i)} disabled={disabled} className={`w-full text-left px-5 py-4 rounded-xl text-sm md:text-base font-medium flex items-center gap-3 transition-all ${btnClass} ${!alreadyAnswered ? 'option-slide-in' : ''}`} style={!alreadyAnswered ? { animationDelay: `${i * 80}ms` } : undefined}>
                    <span className={`w-8 h-8 rounded-lg ${badgeClass} flex items-center justify-center text-sm font-bold shrink-0`}>{String.fromCharCode(65 + i)}</span>
                    <span className="flex-1">{opt.text}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

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
              <div className={`mt-4 p-4 rounded-xl text-sm font-medium ${alreadyAnswered.correct ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <strong>{alreadyAnswered.correct ? 'Bonne r\u00e9ponse !' : 'Mauvaise r\u00e9ponse.'}</strong>{' '}
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
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">R&eacute;sultats du QCM</h2>
            <p className="text-gray-500">{selectedTopic?.title || 'Sujet libre'}</p>
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
                <span className="text-xs text-gray-500">{correctCount}/{validAnswers.length}</span>
              </div>
            </div>
            <p className="text-lg font-bold mt-3" style={{ color }}>{scoreMessage}</p>
            {comparisonEl}
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
                            Votre r&eacute;ponse : <strong>{a.question.options[a.selected].text}</strong>
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

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => startQuiz(selectedTopic)} className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg>
              Recommencer
            </button>
            <button onClick={() => setView('hero')} className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors">
              Nouveau QCM
            </button>
          </div>
        </div>
        {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        {showUpgradeModal && <UpgradeModal requiredTier="essentiel" onClose={() => setShowUpgradeModal(false)} />}
      </section>
    );
  }

  return null;
}
