import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../config/env.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export async function generateReflection(text, culture) {
  const model = genAI.getGenerativeModel({
    model: ENV.GEMINI_MODEL
  });

  const prompt = `
You are an empathetic mental health reflection assistant.

Rules:
- Do NOT give advice
- Do NOT suggest actions
- Do NOT diagnose
- Reflect emotions only
- 3–4 sentences
- Gentle, validating tone
- Cultural context: ${culture}

Journal:
${text}
`;

  const result = await model.generateContent(prompt);

  const parts =
    result?.response?.candidates?.[0]?.content?.parts;

  if (!parts || parts.length === 0) {
    throw new Error("Gemini returned empty response");
  }

  return parts.map(p => p.text).join(" ").trim();
}
