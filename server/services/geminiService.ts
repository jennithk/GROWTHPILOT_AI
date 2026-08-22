import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client according to the official @google/genai guidelines
let genAI: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAI;
}

// Allowed models in priority order according to skill guidelines
const CANDIDATE_MODELS = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateStructuredAI<T>(
  prompt: string,
  systemInstruction: string,
  fallbackGenerator: () => T
): Promise<T> {
  const client = getGeminiClient();

  if (!client) {
    console.log('ℹ️ GEMINI_API_KEY not configured. Generating contextual deterministic response.');
    return fallbackGenerator();
  }

  const formattedSystemInstruction = `${systemInstruction}\n\nIMPORTANT: You MUST respond ONLY with valid, parseable JSON matching the requested structure without markdown code blocks, backticks, or commentary.`;

  // Try candidate models with graceful cascade and quick retry on 503 / 429
  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: formattedSystemInstruction,
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        if (!rawText.trim()) {
          throw new Error('Empty response from model');
        }

        // Clean potential markdown wrap if model returned it despite responseMimeType
        let cleaned = rawText.trim();
        if (cleaned.startsWith('```json')) {
          cleaned = cleaned.substring(7);
        }
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith('```')) {
          cleaned = cleaned.substring(0, cleaned.length - 3);
        }
        cleaned = cleaned.trim();

        const parsed = JSON.parse(cleaned);
        return parsed as T;
      } catch (err: any) {
        const errMessage = err?.message || String(err);
        const isUnavailable =
          errMessage.includes('503') ||
          errMessage.includes('UNAVAILABLE') ||
          errMessage.includes('high demand') ||
          errMessage.includes('429') ||
          errMessage.includes('RESOURCE_EXHAUSTED');

        if (isUnavailable && attempt === 1) {
          // Brief backoff before retry or switching model
          await sleep(500);
          continue;
        }

        // If this model is experiencing high demand, proceed to the next candidate model
        if (isUnavailable) {
          console.warn(`ℹ️ Model ${model} is experiencing temporary high demand (503/429). Cascading to alternate model...`);
          break;
        } else {
          console.warn(`ℹ️ Gemini API encountered an issue with ${model}:`, errMessage.substring(0, 120));
          break;
        }
      }
    }
  }

  // If all live models are temporarily unavailable or busy, use deterministic fallback
  console.log('ℹ️ Utilizing dynamic agent fallback engine for response synthesis.');
  return fallbackGenerator();
}

