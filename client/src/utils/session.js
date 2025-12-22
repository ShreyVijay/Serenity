import { v4 as uuid } from "uuid";

const SESSION_KEY = "serenity_session_id";
const CULTURE_KEY = "serenity_culture";
const LANGUAGE_KEY = "serenity_language";

export function getOrCreateSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function setCulture(culture) {
  localStorage.setItem(CULTURE_KEY, culture);
}

export function getCulture() {
  return localStorage.getItem(CULTURE_KEY) || "neutral";
}

export function setLanguage(lang) {
  localStorage.setItem(LANGUAGE_KEY, lang);
}

export function getLanguage() {
  return localStorage.getItem(LANGUAGE_KEY) || "en";
}

export function clearAllData() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(CULTURE_KEY);
  localStorage.removeItem(LANGUAGE_KEY);
}
