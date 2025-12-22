// server/utils/aiReflect.js
import { callGroq } from "./callGroq.js";
import { callFallbackLLM } from "./fallbackLLM.js";
import { ENV } from "../config/env.js";

export async function generateReflection(text, culture) {
  try {
    return await callGroq(text, culture);
  } catch (err) {
    console.error("Groq failed, using fallback:", err.message);

    if (ENV.DISABLE_FALLBACK === "true") {
      throw err;
    }

    return await callFallbackLLM(text, culture);
  }
}
