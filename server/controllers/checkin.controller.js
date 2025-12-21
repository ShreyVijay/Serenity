import DailyCheckin from "../models/DailyCheckin.js";

export async function upsertCheckin(req, res) {
  try {
    const { sessionId, checkin } = req.body;
    if (!sessionId || !checkin) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const { date, emotion, energy, openness } = checkin;

    const saved = await DailyCheckin.findOneAndUpdate(
      { sessionId, date },
      { sessionId, date, emotion, energy, openness },
      { upsert: true, new: true }
    );

    res.json(saved);
  } catch (e) {
    console.error("CHECKIN FAILED", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getCheckins(req, res) {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

    const data = await DailyCheckin.find({ sessionId }).sort({ date: 1 });
    res.json(data);
  } catch (e) {
    console.error("FETCH CHECKINS FAILED", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
