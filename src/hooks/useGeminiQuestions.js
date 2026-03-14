'use client';

import { useState, useCallback } from 'react';

export function useGeminiQuestions() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateQuestions = useCallback(async (subject, subjectName, count, mode = 'qcm', ficheTopic = null) => {
    setIsGenerating(true);
    setError(null);

    try {
      const payload = { subject, subjectName, count, mode };
      if (ficheTopic) payload.ficheTopic = ficheTopic;

      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Erreur serveur (${res.status})`);
      }

      const data = await res.json();

      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('Aucune question générée');
      }

      return data.questions;
    } catch (err) {
      console.warn('[Gemini] Erreur de génération:', err.message);
      setError(err.message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generateQuestions, isGenerating, error };
}
