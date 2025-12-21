import { callGemini } from "./callGemini.js";
import { callFallbackLLM } from "./fallbackLLM.js";
import { ENV } from "../config/env.js";

export async function generateReflection(text, culture) {
  if (ENV.DISABLE_GEMINI === "true") {
    return await callFallbackLLM(text, culture);
  }

  try {
    return await callGemini(text, culture);
  } catch {
    return await callFallbackLLM(text, culture);
  }
}
