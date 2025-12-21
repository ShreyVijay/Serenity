import Journal from "../models/Journal.js";
import { hasDangerContent } from "../utils/safetyCheck.js";
import { generateReflection } from "../utils/aiReflect.js";
import { ENV } from "../config/env.js";
import { getUserLocation } from "../utils/getLocation.js";
import { resolveHelpline } from "../utils/resolveHelpline.js";

export async function createJournal(req, res) {
  console.log("POST /journal HIT");
  console.log("Request body:", req.body);
console.log("DANGER CHECK INPUT:", entry.text);
console.log("DANGER CHECK RESULT:", hasDangerContent(entry.text));

  try {
    const { sessionId, entry } = req.body;

    if (!sessionId || !entry || !entry.text || !entry.emotion) {
      console.error("Invalid request payload");
      return res.status(400).json({ error: "Invalid request payload" });
    }

    // 1️⃣ Always create journal FIRST
    const journal = await Journal.create({
      sessionId,
      ...entry,
      reflection: "", // placeholder
    });

    // 2️⃣ Crisis handling (no AI)
    if (hasDangerContent(entry.text)) {
      console.warn("Crisis content detected");

      const crisisMessage =
        "It sounds like you’re going through something very heavy right now. You deserve support, and reaching out to someone you trust or a professional can help.";

      journal.reflection = crisisMessage;
      await journal.save();

      const location = getUserLocation(req);
console.log("crisis");
console.log("LOCATION:", location);

      const helpline = await resolveHelpline({
        country: location.country,
        culture: entry.culture,
      });

      return res.json({
        journalId: journal._id,
        reflection: crisisMessage,
        crisis: true,
        helpline
      });
    }

    // 3️⃣ AI reflection (best-effort)
    let reflection = "";

    try {
      if (ENV.DISABLE_AI === "true") {
        reflection =
          "Thank you for sharing this. Taking time to reflect is already a meaningful step.";
      } else {
        console.log("Calling Gemini…");
        reflection = await generateReflection(entry.text, entry.culture);
      }
    } catch (aiErr) {
      console.error("AI failed, using fallback:", aiErr.message);
      reflection =
        "Thank you for sharing this. Your feelings are valid, and reflecting on them is a meaningful step.";
    }

    journal.reflection = reflection;
    await journal.save();

    // 4️⃣ Final response (REQUIRED FIELDS)
    return res.json({
      journalId: journal._id,
      reflection,
      crisis: false,
    });
  } catch (err) {
    console.error("❌ CREATE JOURNAL FAILED");
    console.error(err.stack || err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
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

export async function addFollowUp(req, res) {
  try {
    const { journalId } = req.params;
    const { text } = req.body;

    if (!journalId || !text) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const journal = await Journal.findById(journalId);
    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    // Best-effort AI follow-up
    let followUp = "";

    try {
      if (ENV.DISABLE_AI === "true") {
        followUp =
          "It can help to sit with this thought for a moment and notice what comes up.";
      } else {
        followUp = await generateReflection(text, "neutral");
      }
    } catch (aiErr) {
      console.error("FOLLOW UP AI FAILED — USING FALLBACK", aiErr.message);
      followUp =
        "It might be worth giving yourself a quiet moment to reflect on this further.";
    }

    journal.followUp = followUp;
    await journal.save();

    return res.json({ followUp });
  } catch (e) {
    console.error("FOLLOW UP FAILED", e.stack || e);
    return res.status(500).json({ error: "Failed to add follow-up" });
  }
}
