'use client';

import { useState, useCallback } from 'react';
import { buildPrompt } from '@/utils/prompts';

/**
 * Gemini API configuration.
 * In production, the API key should come from environment variables.
 */
const GEMINI_MODEL = 'gemini-2.0-flash';

function getGeminiUrl(apiKey) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
}

/**
 * Validate and extract questions from the Gemini API response.
 * @param {string} text - Raw text response from the API.
 * @param {number} count - Expected number of questions.
 * @returns {Array} Array of validated question objects.
 */
function parseAndValidateQuestions(text, count) {
  let questions;

  try {
    questions = JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      questions = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Format de r\u00e9ponse invalide');
    }
  }

  if (!Array.isArray(questions) || questions.length < Math.min(count, 3)) {
    throw new Error(
      `Nombre insuffisant de questions (${questions?.length || 0})`
    );
  }

  const validated = questions.slice(0, count).filter((q) => {
    return (
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.options.filter((o) => o.correct).length === 1 &&
      q.explanation
    );
  });

  if (validated.length < Math.min(count, 3)) {
    throw new Error(
      `Trop peu de questions valides (${validated.length}/${count})`
    );
  }

  return validated;
}

/**
 * React hook for generating QCM questions using the Gemini API.
 *
 * @param {string} apiKey - The Gemini API key.
 * @returns {{ generateQuestions, isGenerating, error }}
 *
 * @example
 * const { generateQuestions, isGenerating, error } = useGeminiGeneration(apiKey);
 * const questions = await generateQuestions(topic, 10);
 */
export function useGeminiGeneration(apiKey) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateQuestions = useCallback(
    async (topic, count) => {
      setIsGenerating(true);
      setError(null);

      try {
        const prompt = buildPrompt(topic, count);
        const url = getGeminiUrl(apiKey);

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.9,
              topP: 0.95,
              maxOutputTokens: 16384,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Erreur serveur (${response.status})`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('R\u00e9ponse vide du serveur');

        const questions = parseAndValidateQuestions(text, count);
        return questions;
      } catch (err) {
        setError(err.message || 'Erreur lors de la g\u00e9n\u00e9ration');
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    [apiKey]
  );

  return { generateQuestions, isGenerating, error };
}
