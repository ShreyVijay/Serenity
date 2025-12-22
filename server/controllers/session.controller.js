import Journal from "../models/Journal.js";
import DailyCheckin from "../models/DailyCheckin.js";

export async function clearSession(req, res) {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  try {
    await Promise.all([
      Journal.deleteMany({ sessionId }),
      DailyCheckin.deleteMany({ sessionId }),
    ]);

    return res.json({ success: true });
  } catch (err) {
    console.error("SESSION WIPE FAILED", err);
    return res.status(500).json({ error: "Failed to clear session data" });
  }
}
