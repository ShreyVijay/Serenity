// server/utils/aiReflect.js
import { callGemini } from "./callGemini.js";
import { callGroq } from "./callGroq.js";
import { ENV } from "../config/env.js";

export async function generateReflection(text, culture) {
  try {
    return await callGemini(text, culture);
  } catch (err) {
    console.error("Gemini failed, using Groq fallback:", err.message);

    if (ENV.DISABLE_FALLBACK === "true") {
      throw err;
    }

    return await callGroq(text, culture);
  }
}
