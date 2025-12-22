const KEY = "serenity_prefs";

export function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {
      language: "en",
      culture: "neutral",
    };
  } catch {
    return { language: "en", culture: "neutral" };
  }
}

export function setPrefs(next) {
  const current = getPrefs();
  localStorage.setItem(KEY, JSON.stringify({ ...current, ...next }));
}
