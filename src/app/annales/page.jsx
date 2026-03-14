'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTimer } from '@/hooks/useTimer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SUBJECTS } from '@/data/subjects';
import { SUBJECT_COLORS, SUBJECT_ICONS, getSubjectName } from '@/data/constants';
import { ANNALES_POOL } from '@/data/annales-data';

/* ========== HELPERS ========== */
function getColorsForSubject(subjectId) {
  const subject = SUBJECTS.find(s => s.id === subjectId);
  return SUBJECT_COLORS[subject?.color] || SUBJECT_COLORS.primary;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SubjectIcon({ subjectId, className }) {
  const iconData = SUBJECT_ICONS[subjectId];
  if (!iconData) return null;
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d={iconData.path} />
    </svg>
  );
}

/* ========== MAIN PAGE ========== */
export default function AnnalesPage() {
  const [view, setView] = useState('subjects'); // subjects | loading | exam | results
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [examResults, setExamResults] = useState(null);
  const startTimeRef = useRef(null);

  const [stats, setStats] = useLocalStorage('prepa-annales-stats', {
    sessions: [],
    totalCorrect: 0,
    totalAnswered: 0,
  });

  const handleFinish = useCallback(() => {
    finishExam();
  }, []);

  const timer = useTimer({ mode: 'down', durationMinutes: 30, onExpire: handleFinish });

  /* --- Finish exam --- */
  function finishExam() {
    timer.stop();
    const elapsed = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;
    const subject = SUBJECTS.find(s => s.id === selectedSubject);

    let correct = 0;
    const details = questions.map((q, i) => {
      const sel = answers[i];
      const correctIdx = q.options.findIndex(o => o.correct);
      const isCorrect = sel === correctIdx;
      if (isCorrect) correct++;
      return { question: q, selected: sel, correctIndex: correctIdx, isCorrect };
    });

    const pct = Math.round((correct / questions.length) * 100);
    const session = {
      subject: selectedSubject,
      subjectName: subject?.name || '',
      correct,
      total: questions.length,
      percentage: pct,
      duration: elapsed,
      date: new Date().toISOString(),
    };

    setStats(prev => {
      const sessions = [session, ...prev.sessions].slice(0, 50);
      return {
        sessions,
        totalCorrect: prev.totalCorrect + correct,
        totalAnswered: prev.totalAnswered + questions.length,
      };
    });

    setExamResults({ details, correct, total: questions.length, pct, elapsed, subjectName: subject?.name || '' });
    setView('results');
  }

  /* --- Launch exam from pool --- */
  function launchExam(subjectId) {
    setSelectedSubject(subjectId);
    setView('loading');

    // Fake loading delay, then pick 20 questions from pool
    setTimeout(() => {
      const pool = ANNALES_POOL.filter(q => q.subject === subjectId);
      const selected = shuffleArray(pool).slice(0, 20);

      if (selected.length < 5) {
        // Not enough questions, go back
        setView('subjects');
        return;
      }

      setQuestions(selected);
      setAnswers(new Array(selected.length).fill(null));
      setCurrentQ(0);
      startTimeRef.current = Date.now();
      timer.reset();
      timer.start();
      setView('exam');
    }, 2000 + Math.random() * 1000);
  }

  /* --- Confirm finish --- */
  function confirmFinish() {
    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0) {
      if (!window.confirm(`Vous avez ${unanswered} question${unanswered > 1 ? 's' : ''} sans reponse. Terminer quand meme ?`)) return;
    }
    finishExam();
  }

  /* --- Quit exam --- */
  function quitExam() {
    if (window.confirm("Quitter l'epreuve ? Votre progression sera perdue.")) {
      timer.stop();
      setView('subjects');
    }
  }

  /* --- Render based on view --- */
  if (view === 'loading') {
    return <LoadingScreen subjectId={selectedSubject} onCancel={() => setView('subjects')} />;
  }

  if (view === 'exam') {
    return (
      <ExamView
        questions={questions}
        answers={answers}
        currentQ={currentQ}
        subjectId={selectedSubject}
        timer={timer}
        onSelectOption={(idx) => {
          const newAnswers = [...answers];
          newAnswers[currentQ] = idx;
          setAnswers(newAnswers);
        }}
        onGoTo={(idx) => setCurrentQ(idx)}
        onPrev={() => currentQ > 0 && setCurrentQ(currentQ - 1)}
        onNext={() => currentQ < questions.length - 1 && setCurrentQ(currentQ + 1)}
        onFinish={confirmFinish}
        onQuit={quitExam}
      />
    );
  }

  if (view === 'results' && examResults) {
    return (
      <ResultsView
        results={examResults}
        subjectId={selectedSubject}
        onRetry={() => launchExam(selectedSubject)}
        onBack={() => setView('subjects')}
      />
    );
  }

  // Default: subject selection
  return <SubjectSelection stats={stats} onLaunch={launchExam} />;
}

/* ============================================================
   SUBJECT SELECTION VIEW
   ============================================================ */
function SubjectSelection({ stats, onLaunch }) {
  const totalDone = stats.sessions.length;
  const avgScore = totalDone > 0
    ? Math.round(stats.sessions.reduce((a, s) => a + s.percentage, 0) / totalDone)
    : 0;

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero noise-overlay dot-grid pt-24 pb-10 md:pt-28 md:pb-12 relative overflow-hidden">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full border border-primary-200 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-sm font-semibold text-primary-700">Annales d&apos;entra&icirc;nement</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            S&apos;entra&icirc;ner sur les <span className="text-primary-600">annales</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-5">
            20 questions en conditions d&apos;examen : 30 minutes, correction d&eacute;taill&eacute;e. Entra&icirc;nez-vous sur les annales PASS/LAS.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-5">
            <div className="bg-white/70 backdrop-blur-sm border border-primary-100 rounded-xl px-4 py-2.5">
              <div className="text-xl md:text-2xl font-black text-primary-600">20</div>
              <div className="text-[11px] font-semibold text-gray-500">Questions par &eacute;preuve</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-primary-100 rounded-xl px-4 py-2.5">
              <div className="text-xl md:text-2xl font-black text-primary-600">30</div>
              <div className="text-[11px] font-semibold text-gray-500">Minutes par &eacute;preuve</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-primary-100 rounded-xl px-4 py-2.5">
              <div className="text-xl md:text-2xl font-black text-primary-600">6</div>
              <div className="text-[11px] font-semibold text-gray-500">Mati&egrave;res disponibles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats banner */}
      {totalDone > 0 && (
        <section className="py-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <div className="text-center">
                <p className="text-xl font-black text-primary-700">{totalDone}</p>
                <p className="text-xs font-medium text-primary-500">&Eacute;preuves termin&eacute;es</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-accent-600">{avgScore}%</p>
                <p className="text-xs font-medium text-accent-600">Score moyen</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Subject cards */}
      <section className="py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Choisissez une mati&egrave;re</h2>
          <p className="text-sm text-gray-500 mb-4">S&eacute;lectionnez une mati&egrave;re pour lancer une &eacute;preuve de 20 questions en 30 minutes.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUBJECTS.map(s => {
              const colors = SUBJECT_COLORS[s.color] || SUBJECT_COLORS.primary;
              const done = stats.sessions.filter(ss => ss.subject === s.id).length;
              const best = stats.sessions.filter(ss => ss.subject === s.id).reduce((max, ss) => Math.max(max, ss.percentage), 0);
              return (
                <button
                  key={s.id}
                  onClick={() => onLaunch(s.id)}
                  className="bg-white rounded-2xl p-5 text-left border-2 border-gray-200 hover:border-primary-300 transition-all hover:shadow-lg hover:-translate-y-[3px]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                      <SubjectIcon subjectId={s.id} className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{s.name}</h3>
                      <p className="text-xs text-gray-500">Annales PASS/LAS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                      30 min
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>
                      20 questions
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-900">
                      Lancer l&apos;&eacute;preuve
                      <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
                    </span>
                    {done > 0 && (
                      <span className={`text-xs font-bold ${best >= 70 ? 'text-green-600' : best >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        Meilleur : {best}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================================================
   LOADING SCREEN
   ============================================================ */
function LoadingScreen({ subjectId, onCancel }) {
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const colors = SUBJECT_COLORS[subject?.color] || SUBJECT_COLORS.primary;
  const [statusText, setStatusText] = useState('Pr\u00e9paration des questions d\u2019annales...');

  useEffect(() => {
    const t1 = setTimeout(() => setStatusText('S\u00e9lection des questions...'), 800);
    const t2 = setTimeout(() => setStatusText('Pr\u00e9paration de l\u2019\u00e9preuve...'), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center pt-16">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="mb-6">
            <div className={`w-20 h-20 mx-auto rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center animate-pulse`}>
              <SubjectIcon subjectId={subjectId} className={`w-10 h-10 ${colors.icon}`} />
            </div>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Pr&eacute;paration en cours...</h2>
          <p className="text-sm text-gray-500 mb-6">
            Pr&eacute;paration de 20 questions de <strong>{subject?.name || ''}</strong> de niveau concours PASS/LAS
          </p>
          <div className="flex justify-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
          </div>
          <p className="text-xs text-gray-400">{statusText}</p>
          <button onClick={onCancel} className="mt-6 text-sm text-gray-400 hover:text-gray-600 font-medium">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EXAM VIEW
   ============================================================ */
function ExamView({ questions, answers, currentQ, subjectId, timer, onSelectOption, onGoTo, onPrev, onNext, onFinish, onQuit }) {
  const q = questions[currentQ];
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const total = questions.length;
  const answered = answers.filter(a => a !== null).length;
  const isWarning = timer.seconds <= 300 && timer.seconds > 0;

  return (
    <div className="min-h-screen bg-slate-100 pt-20 pb-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onQuit} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Quitter
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span className={`text-sm font-mono font-bold ${isWarning ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                {timer.formatted}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-500">{answered}/{total}</span>
          </div>
        </div>

        {/* Question pills */}
        <div className="flex flex-wrap gap-1.5 mb-5 justify-center">
          {questions.map((_, i) => {
            let cls = 'bg-slate-100 text-slate-400'; // unanswered
            if (i === currentQ) cls = 'bg-primary-600 text-white shadow-md shadow-primary-600/40';
            else if (answers[i] !== null) cls = 'bg-primary-100 text-primary-700';
            return (
              <button key={i} onClick={() => onGoTo(i)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${cls}`}>
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-medium text-gray-500">Question {currentQ + 1}/{total}</span>
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">{subject?.name || ''}</span>
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-relaxed">{q.question}</p>
          <div className="space-y-3 mb-6">
            {q.options.map((opt, i) => {
              const selected = answers[currentQ] === i;
              return (
                <button
                  key={i}
                  onClick={() => onSelectOption(i)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm md:text-base font-medium text-gray-700 flex items-center gap-3 transition-all hover:border-primary-400 hover:bg-primary-50/50 ${
                    selected ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                    selected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onPrev}
              disabled={currentQ === 0}
              className={`px-5 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors text-sm ${currentQ === 0 ? 'invisible' : ''}`}
            >
              Pr&eacute;c&eacute;dent
            </button>
            {currentQ === total - 1 ? (
              <button onClick={onFinish} className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors text-sm flex items-center gap-2">
                Terminer l&apos;&eacute;preuve
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </button>
            ) : (
              <button onClick={onNext} className="px-5 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm flex items-center gap-2">
                Suivante
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   RESULTS VIEW
   ============================================================ */
function ResultsView({ results, subjectId, onRetry, onBack }) {
  const { details, correct, total, pct, elapsed, subjectName } = results;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const answeredCount = details.filter(d => d.selected !== null).length;

  const circumference = 2 * Math.PI * 56;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <section className="py-24 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">R&eacute;sultats de l&apos;&eacute;preuve</h2>
          <p className="text-gray-500">{subjectName} &mdash; Annales PASS/LAS</p>
        </div>

        {/* Score circle */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg width="140" height="140">
              <circle cx="70" cy="70" r="56" fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle
                cx="70" cy="70" r="56" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black" style={{ color }}>{pct}%</span>
              <span className="text-xs text-gray-500">{correct}/{total}</span>
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p className="text-base font-bold text-gray-900">{subjectName}</p>
            <p className="text-xs text-gray-500">Mati&egrave;re</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p className="text-base font-bold text-gray-900">{minutes}m {seconds.toString().padStart(2, '0')}s</p>
            <p className="text-xs text-gray-500">Dur&eacute;e</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-center">
            <p className="text-base font-bold text-gray-900">{answeredCount}/{total}</p>
            <p className="text-xs text-gray-500">R&eacute;pondues</p>
          </div>
        </div>

        {/* Detailed corrections */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-5 text-lg">Correction d&eacute;taill&eacute;e</h3>
          <div className="space-y-4">
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
                        {!d.isCorrect && (
                          <> &mdash; Bonne r&eacute;ponse : <strong>{d.question.options[d.correctIndex].text}</strong></>
                        )}
                      </p>
                    ) : (
                      <p className="text-xs mt-1 text-gray-500">
                        Non r&eacute;pondue &mdash; Bonne r&eacute;ponse : <strong>{d.question.options[d.correctIndex].text}</strong>
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{d.question.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onRetry} className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg>
            Nouvelle &eacute;preuve
          </button>
          <button onClick={onBack} className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors">
            Changer de mati&egrave;re
          </button>
          <Link href="/dashboard" className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors text-center">
            Tableau de bord
          </Link>
        </div>
      </div>
    </section>
  );
}
