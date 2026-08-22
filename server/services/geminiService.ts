import { GoogleGenAI, Type } from '@google/genai';

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

export async function generateStructuredAI<T>(
  prompt: string,
  systemInstruction: string,
  fallbackGenerator: () => T
): Promise<T> {
  const client = getGeminiClient();

  if (!client) {
    console.log('ℹ️ GEMINI_API_KEY not provided. Generating intelligent deterministic agent response.');
    return fallbackGenerator();
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: `${systemInstruction}\n\nIMPORTANT: You MUST respond ONLY with valid, parseable JSON matching the requested structure without markdown code blocks, backticks, or extra commentary.`,
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
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
    console.warn('⚠️ Gemini generation error, using dynamic agent fallback:', err?.message || err);
    return fallbackGenerator();
  }
}
