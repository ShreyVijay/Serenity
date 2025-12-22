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
  GEMINI_MODEL: required("GEMINI_MODEL"),
  CORS_ORIGIN: required("CORS_ORIGIN"),
  GROQ_API_KEY: required("GROQ_API_KEY"),
GROQ_MODEL: process.env.GROQ_MODEL,
  DISABLE_AI: process.env.DISABLE_AI || "false",
};
