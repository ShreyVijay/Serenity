import { useState } from "react";
import MoodSelector from "../components/MoodSelector";
import { useNavigate } from "react-router-dom";
import { getOrCreateSessionId, getCulture } from "../utils/session";

import { useText } from "../i18n/useText";

function Journal() {
  const sessionId = getOrCreateSessionId();
  const navigate = useNavigate();
  const t = useText();

  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState(null);
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [followUp, setFollowUp] = useState(null);
  const [usedFollowUp, setUsedFollowUp] = useState(false);
  const [journalId, setJournalId] = useState(null);
  const [helpline, setHelpline] = useState(null);

  const canReflect = text.trim().length >= 10 && emotion !== null;

  async function handleReflect() {
    if (!canReflect || loading || !sessionId) return;

    setLoading(true);
    setReflection("");
    setFollowUp(null);
    setUsedFollowUp(false);
    setCrisis(false);
    setJournalId(null);
    setHelpline(null);

    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);

    const entry = {
      date,
      time,
      text,
      emotion,
      culture: getCulture(),
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/journal`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, entry }),
        }
      );

      const data = await res.json();

      setReflection(data.reflection || "");
      setCrisis(!!data.crisis);
      setHelpline(data.helpline || null);

      if (data.journalId) {
        setJournalId(data.journalId);
      }
    } catch (err) {
      console.error("Reflect failed:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFollowUp() {
    if (!journalId) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/journal/${journalId}/followup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );

      const data = await res.json();
      setFollowUp(data.followUp);
      setUsedFollowUp(true);
    } catch (err) {
      console.error("Follow-up failed:", err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">{t.journalTitle}</h2>

      <button
        onClick={() => navigate("/checkin")}
        className="text-sm underline text-slate-600"
      >
        {t.dailyCheckin}
      </button>

      <textarea
        className="w-full min-h-[160px] p-4 rounded border"
        placeholder={t.journalPlaceholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <MoodSelector emotion={emotion} setEmotion={setEmotion} />

      <button
        disabled={!canReflect || loading}
        onClick={handleReflect}
        className={`px-4 py-2 rounded text-white ${
          canReflect && !loading
            ? "bg-slate-900"
            : "bg-slate-400 cursor-not-allowed"
        }`}
      >
        {loading ? t.reflecting : t.reflect}
      </button>

      {reflection && (
        <div className="p-4 rounded bg-slate-100 space-y-3">
          <p>{reflection}</p>

          {crisis && helpline && (
            <div className="border-t pt-3 text-sm text-slate-600">
              <p>{t.supportAvailable}</p>
              <p className="font-medium">{helpline.name}</p>
              <p>📞 {helpline.phone}</p>
              {helpline.website && (
                <a
                  href={helpline.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {helpline.website}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {reflection && journalId && !usedFollowUp && (
        <button onClick={handleFollowUp}>{t.oneMoreThought}</button>
      )}

      {followUp && (
        <div className="p-4 rounded bg-slate-50">
          <p>{followUp}</p>
        </div>
      )}

      <button
        onClick={() => navigate("/calendar")}
        className="text-sm underline text-slate-600"
      >
        {t.viewCalendar}
      </button>
    </div>
  );
}

export default Journal;
