// server/utils/callGroq.js

import { ENV } from "../config/env.js";
import { culturalPrompt } from "../prompts/culturalPrompt.js";

export async function callGroq(text, culture) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ENV.GROQ_MODEL || "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: culturalPrompt(culture),
        },
        {
          role: "user",
          content: `Journal entry:\n${text}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
      top_p: 0.9,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq failed: ${err}`);
  }

  const json = await res.json();

  const content = json?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq returned empty response");
  }

  return content.trim();
}
