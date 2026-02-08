import { NextResponse } from "next/server";
const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const MODEL = process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'llama3';
export async function POST(req) {
  const { prompt, temperature, topK } = await req.json();

  const systemPrompt = `
      You are simulating next-token prediction.

      Given the input text, return the TOP 8 most likely NEXT TOKENS
      with probabilities that sum to 1.

      Rules:
      - Tokens must be short (1–3 words)
      - Probabilities must be numbers
      - Return ONLY valid JSON

      Format:
      {
        "tokens": [
          { "token": "word", "probability": 0.4 }
        ]
      }
      `;

  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature,
      stream: false,
      prompt: systemPrompt + `\nInput: "${prompt}"`
    })
  });

  const data = await response.json();

  const text = data.response;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  const parsed = JSON.parse(text.slice(start, end + 1));

  // --- TOP-K FILTERING ---
  parsed.tokens.sort((a, b) => b.probability - a.probability);
  const topTokens = parsed.tokens.slice(0, topK);

  // --- RENORMALIZE ---
  const total = topTokens.reduce((s, t) => s + t.probability, 0);
  topTokens.forEach(t => {
    t.probability = t.probability / total;
  });

  return NextResponse.json({ tokens: topTokens });
}
