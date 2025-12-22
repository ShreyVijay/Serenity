import { v4 as uuid } from "uuid";

const KEY = "serenity_session";

export function createSession() {
  const id = uuid();
  localStorage.setItem(KEY, id);
  return id;
}

export function getSession() {
  return localStorage.getItem(KEY);
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
