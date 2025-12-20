import Journal from "../models/Journal.js";
import { hasDangerContent } from "../utils/safetyCheck.js";
import { generateReflection } from "../utils/aiReflect.js";

export async function createJournal(req, res) {
  console.log("POST /journal HIT");
  console.log("Request body:", req.body);

  try {
    const { sessionId, entry } = req.body;

    if (!sessionId || !entry || !entry.text || !entry.mood) {
      console.error("Invalid request payload");
      return res.status(400).json({ error: "Invalid request payload" });
    }

    // Crisis path
    if (hasDangerContent(entry.text)) {
      console.warn("Crisis content detected");

      const crisisMessage =
        "It sounds like you’re going through something very heavy right now. You deserve support, and reaching out to someone you trust or a professional can help.";

      await Journal.create({
        sessionId,
        ...entry,
        reflection: crisisMessage
      });

      return res.json({
        reflection: crisisMessage,
        crisis: true
      });
    }

    console.log("Calling Gemini…");
    const reflection = await generateReflection(entry.text, entry.culture);
    console.log("Gemini response:", reflection);

    await Journal.create({
      sessionId,
      ...entry,
      reflection
    });

    return res.json({ reflection });

  } catch (err) {
    console.error("❌ CREATE JOURNAL FAILED");
    console.error(err.stack || err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message
    });
  }
}

export async function getJournals(req, res) {
  console.log("GET /journal HIT", req.query);

  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      console.error("Missing sessionId");
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const journals = await Journal.find({ sessionId }).sort({ date: 1 });
    return res.json(journals);

  } catch (err) {
    console.error("❌ FETCH JOURNALS FAILED");
    console.error(err.stack || err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
