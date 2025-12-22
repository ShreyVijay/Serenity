import Journal from "../models/Journal.js";
import { hasDangerContent } from "../utils/safetyCheck.js";
import { generateReflection } from "../utils/aiReflect.js";
import { ENV } from "../config/env.js";
import { getUserLocation } from "../utils/getLocation.js";
import { resolveHelpline } from "../utils/resolveHelpline.js";

export async function createJournal(req, res) {
  console.log("POST /journal HIT");
  console.log("Request body:", req.body);

  try {
    // ✅ FIX: destructure FIRST
    const { sessionId, entry } = req.body;

    if (!sessionId || !entry || !entry.text || !entry.emotion) {
      console.error("Invalid request payload");
      return res.status(400).json({ error: "Invalid request payload" });
    }

    console.log("DANGER CHECK INPUT:", entry.text);
    console.log("DANGER CHECK RESULT:", hasDangerContent(entry.text));

    // 1️⃣ Always create journal first
    const journal = await Journal.create({
      sessionId,
      ...entry,
      reflection: "",
    });

    // 2️⃣ Crisis path
    if (hasDangerContent(entry.text)) {
      console.warn("Crisis content detected");

      const crisisMessage =
        "It sounds like you’re going through something very heavy right now. You deserve support, and reaching out to someone you trust or a professional can help.";

      journal.reflection = crisisMessage;
      await journal.save();

      const location = getUserLocation(req);
      console.log("LOCATION:", location);

      const helpline = await resolveHelpline({
        country: location?.country,
        culture: entry.culture,
      });

      return res.json({
        journalId: journal._id,
        reflection: crisisMessage,
        crisis: true,
        helpline,
      });
    }

    // 3️⃣ Normal AI reflection
    let reflection = "";

    try {
      if (ENV.DISABLE_AI === "true") {
        reflection =
          "Thank you for sharing this. Taking time to reflect is already a meaningful step.";
      } else {
        console.log("Calling LLM…");
        reflection = await generateReflection(entry.text, entry.culture);
      }
    } catch (aiErr) {
      console.error("AI failed, using fallback:", aiErr.message);
      reflection =
        "Thank you for sharing this. Your feelings are valid, and reflecting on them matters.";
    }

    journal.reflection = reflection;
    await journal.save();

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
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const journals = await Journal.find({ sessionId }).sort({
      date: 1,
      time: 1,
    });

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

    let followUp = "";

    try {
      if (ENV.DISABLE_AI === "true") {
        followUp =
          "You might notice how this thought feels as you sit with it for a moment.";
      } else {
        followUp = await generateReflection(text, journal.culture || "neutral");
      }
    } catch (aiErr) {
      console.error("FOLLOW UP AI FAILED", aiErr.message);
      followUp =
        "Giving yourself a quiet moment to reflect on this could be helpful.";
    }

    journal.followUp = followUp;
    await journal.save();

    return res.json({ followUp });
  } catch (e) {
    console.error("FOLLOW UP FAILED", e.stack || e);
    return res.status(500).json({ error: "Failed to add follow-up" });
  }
}
