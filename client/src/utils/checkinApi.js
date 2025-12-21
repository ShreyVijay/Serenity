const BASE = import.meta.env.VITE_API_BASE;

export async function saveCheckin(sessionId, checkin) {
  const r = await fetch(`${BASE}/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, checkin })
  });
  if (!r.ok) throw new Error("saveCheckin failed");
  return r.json();
}

export async function getCheckins(sessionId) {
  const r = await fetch(`${BASE}/checkin?sessionId=${sessionId}`);
  if (!r.ok) throw new Error("getCheckins failed");
  return r.json();
}
