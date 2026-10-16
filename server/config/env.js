import dotenv from "dotenv";
dotenv.config();

function required(key) {
  if (!process.env[key]) {
    throw new Error(`ENV NOT SET: ${key}`);
  }
  return process.env[key];
}

export const ENV = {
  PORT: required("PORT"),
  MONGO_URI: required("MONGO_URI"),
  GEMINI_API_KEY: required("GEMINI_API_KEY"),
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-4-argon",
  CORS_ORIGIN: required("CORS_ORIGIN"),
  GROQ_API_KEY: required("GROQ_API_KEY"),
  GROQ_MODEL: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
  DISABLE_FALLBACK: process.env.DISABLE_FALLBACK || "false",
  DISABLE_AI: process.env.DISABLE_AI || "false",
};
