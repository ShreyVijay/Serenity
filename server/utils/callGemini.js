import { ENV } from "../config/env.js";
import { culturalPrompt } from "../prompts/culturalPrompt.js";

export async function callGemini(text, culture) {
  const model = ENV.GEMINI_MODEL || "gemini-4-argon";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${ENV.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: culturalPrompt(culture) }] },
        contents: [{ role: "user", parts: [{ text: `Journal entry:\n${text}` }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 150, topP: 0.9 },
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`Gemini failed: ${await res.text()}`);
  }

  const json = await res.json();
  const content = json?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!content) {
    throw new Error("Gemini returned empty response");
  }

  return content;
}
