const BASE = import.meta.env.VITE_API_BASE;

export async function saveCheckin(sessionId, payload) {
  if (!sessionId) {
    throw new Error("sessionId missing in saveCheckin");
  }

  console.log("SENDING CHECKIN:", {
    sessionId,
    ...payload,
  });

  const res = await fetch(`${BASE}/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      ...payload,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("CHECKIN API ERROR:", text);
    throw new Error("saveCheckin failed");
  }

  return res.json();
}

export async function getCheckins(sessionId) {
  if (!sessionId) {
    throw new Error("sessionId missing in getCheckins");
  }

  const res = await fetch(`${BASE}/checkin?sessionId=${sessionId}`);

  if (!res.ok) {
    throw new Error("getCheckins failed");
  }

  return res.json();
}
