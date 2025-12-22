import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../config/env.js";
import { culturalPrompt } from "../prompts/culturalPrompt.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export async function callGemini(text, culture) {
  const model = genAI.getGenerativeModel({
    model: ENV.GEMINI_MODEL,
  });

  const prompt = `
${culturalPrompt(culture)}

Journal entry:
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
