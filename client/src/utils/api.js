// const BASE_URL = "http://localhost:5000";

export async function saveJournalAPI(sessionId, entry) {
  const res = await fetch(`${BASE_URL}/journal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, entry })
  });

  if (!res.ok) {
    throw new Error("Failed to save journal");
  }
}

export async function getJournalsAPI(sessionId) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/journal?sessionId=${sessionId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch journals");
  }

  return res.json();
}
