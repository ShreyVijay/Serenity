
import { culturalPrompt } from "../prompts/culturalPrompt.js";
import { ENV } from "../config/env.js";

export async function callFallbackLLM(text, culture) {
  const res = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.TOGETHER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ENV.FALLBACK_MODEL,
      messages: [
        { role: "system", content: culturalPrompt(culture) },
        { role: "user", content: text },
      ],
      temperature: 0.85,
      max_tokens: 120,
      top_p: 0.9,
    }),
  });

  if (!res.ok) {
    throw new Error(`Fallback LLM failed: ${res.status}`);
  }

  const json = await res.json();
  return json.choices[0].message.content.trim();
}
