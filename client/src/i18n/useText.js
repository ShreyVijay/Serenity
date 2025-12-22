import { TEXT } from "./text";
import { getLanguage } from "../utils/session";
import { useSyncExternalStore } from "react";

/**
 * React-safe subscription to language changes
 */
function subscribe(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return getLanguage();
}

export function useText() {
  const lang = useSyncExternalStore(subscribe, getSnapshot);
  return TEXT[lang] || TEXT.en;
}
