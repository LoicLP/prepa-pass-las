import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { buildQCMPrompt, buildExamenPrompt } from '@/utils/prompts';

const VALID_SUBJECTS = ['anatomie', 'chimie', 'biocell', 'biostats', 'biophysique', 'ssh'];
const VALID_MODES = ['qcm', 'examen'];

// Rate limiting par IP (20 requêtes par 15 min)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 20;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Fisher-Yates shuffle pour mélanger les options de réponse
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function POST(request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return Response.json(
      { error: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.' },
      { status: 429 }
    );
  }

  // Auth check : vérifier que l'utilisateur est connecté
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      if (error || !user) {
        // Continue sans auth — les utilisateurs gratuits non connectés sont limités côté client
      }
    } catch {
      // Continue sans auth
    }
  }

  // Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'Clé API Gemini non configurée' },
      { status: 503 }
    );
  }

  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'Body JSON invalide' },
      { status: 400 }
    );
  }

  const { subject, subjectName, count, mode = 'qcm', ficheTopic = null } = body;

  // Validate params
  if (subject && !VALID_SUBJECTS.includes(subject)) {
    return Response.json(
      { error: `Matière invalide. Valeurs acceptées : ${VALID_SUBJECTS.join(', ')}` },
      { status: 400 }
    );
  }

  if (!subject && !ficheTopic) {
    return Response.json(
      { error: 'Veuillez indiquer une matière ou un sujet précis' },
      { status: 400 }
    );
  }

  if (!VALID_MODES.includes(mode)) {
    return Response.json(
      { error: `Mode invalide. Valeurs acceptées : ${VALID_MODES.join(', ')}` },
      { status: 400 }
    );
  }

  const questionCount = Math.max(1, Math.min(50, parseInt(count) || 10));
  const resolvedSubjectName = subjectName || subject || ficheTopic;

  // Build prompt
  let prompt;
  if (mode === 'examen') {
    prompt = buildExamenPrompt(subject, resolvedSubjectName, questionCount, ficheTopic);
  } else {
    prompt = buildQCMPrompt(subject, resolvedSubjectName, questionCount, ficheTopic);
  }

  // Call Gemini
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    let questions;
    try {
      questions = JSON.parse(text);
    } catch {
      // Try to extract JSON array from the response
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          questions = JSON.parse(match[0]);
        } catch {
          return Response.json(
            { error: 'Impossible de parser la réponse de Gemini' },
            { status: 500 }
          );
        }
      } else {
        return Response.json(
          { error: 'Réponse de Gemini invalide (pas de JSON trouvé)' },
          { status: 500 }
        );
      }
    }

    // Validate and normalize questions
    if (!Array.isArray(questions)) {
      return Response.json(
        { error: 'La réponse n\'est pas un tableau' },
        { status: 500 }
      );
    }

    const validQuestions = questions
      .filter(q => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) return false;
        const correctCount = q.options.filter(o => o.correct === true).length;
        if (correctCount !== 1) return false;
        if (!q.options.every(o => typeof o.text === 'string' && o.text.length > 0)) return false;
        return true;
      })
      .map((q, index) => ({
        id: index + 1,
        subject: subject || 'custom',
        question: q.question,
        options: shuffleArray(q.options.map(o => ({
          text: o.text,
          correct: o.correct === true,
        }))),
        explanation: q.explanation || 'Pas d\'explication disponible.',
      }));

    if (validQuestions.length === 0) {
      return Response.json(
        { error: 'Aucune question valide générée' },
        { status: 500 }
      );
    }

    return Response.json({ questions: validQuestions });
  } catch (err) {
    console.error('[Gemini API Error]', err);
    return Response.json(
      { error: 'Erreur lors de la génération des questions. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
