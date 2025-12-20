export function getSessionId() {
  let sessionId = localStorage.getItem("serenity_session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("serenity_session_id", sessionId);
  }

  return sessionId;
}
