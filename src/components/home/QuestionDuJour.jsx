'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { QUESTIONS } from '@/data/questions';
import { SUBJECTS } from '@/data/subjects';
import { useAuth } from '@/contexts/AuthContext';

export default function QuestionDuJour() {
  const { user } = useAuth();
  // Connecté → dashboard avec le lanceur QCM ; visiteur → inscription (2 jours de Premium offerts)
  const moreHref = user ? '/dashboard?open=qcm' : '/connexion';

  const q = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / 86400000) % QUESTIONS.length;
    return QUESTIONS[dayIndex];
  }, []);

  const subjectName = useMemo(() => {
    return SUBJECTS.find((s) => s.id === q.subject)?.name || '';
  }, [q]);

  const [selectedIdx, setSelectedIdx] = useState(null);
  const [validated, setValidated] = useState(false);

  const handleSelect = (idx) => {
    if (validated) return;
    setSelectedIdx(idx);
  };

  const handleValidate = () => {
    if (selectedIdx === null || validated) return;
    setValidated(true);
  };

  const correctIdx = q.options.findIndex((o) => o.correct);
  const isCorrect = validated && selectedIdx === correctIdx;

  const getOptionClasses = (idx) => {
    const base =
      'w-full text-left px-5 py-4 rounded-xl border-2 transition-all text-sm md:text-base font-medium';

    if (!validated) {
      if (idx === selectedIdx) {
        return `${base} border-primary-500 bg-primary-50 text-primary-700`;
      }
      return `${base} border-gray-200 hover:border-primary-400 text-gray-700`;
    }

    // After validation
    if (idx === correctIdx) {
      return `${base} border-green-500 bg-green-50 text-green-700`;
    }
    if (idx === selectedIdx && !isCorrect) {
      return `${base} border-red-500 bg-red-50 text-red-700`;
    }
    return `${base} border-gray-200 text-gray-700`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 quiz-card">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-semibold text-gray-500">Question du jour</span>
        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">
          {subjectName}
        </span>
      </div>
      <p className="text-base md:text-lg font-bold text-gray-900 mb-6 leading-relaxed">
        {q.question}
      </p>
      <div className="space-y-3 mb-6">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={validated}
            className={getOptionClasses(i)}
          >
            {opt.text}
          </button>
        ))}
      </div>
      <button
        onClick={handleValidate}
        disabled={selectedIdx === null || validated}
        className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-default"
      >
        Valider ma réponse
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>
      {validated && (
        <div
          className={`mt-4 p-4 rounded-xl text-sm font-medium ${
            isCorrect
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <strong>{isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse.'}</strong>{' '}
          {q.explanation}
        </div>
      )}
      <div className="mt-4">
        {validated ? (
          <>
            <Link
              href={moreHref}
              className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              Continuer avec des QCM illimit&eacute;s
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            {!user && (
              <p className="mt-2 text-center text-[11px] text-gray-400">
                Compte gratuit &middot; <strong className="text-violet-600">2 jours de Premium offerts</strong>
              </p>
            )}
          </>
        ) : (
          <div className="text-center">
            <Link href={moreHref} className="text-sm text-primary-600 font-semibold hover:underline">
              Plus de QCM &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
