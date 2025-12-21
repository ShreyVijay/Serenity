import { useState } from "react";
import MoodSelector from "../components/MoodSelector";
import CultureSelector from "../components/CultureSelector";
import { useNavigate } from "react-router-dom";

function Journal({ sessionId }) {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState(null);
  const [culture, setCulture] = useState("neutral");
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [followUp, setFollowUp] = useState(null);
  const [usedFollowUp, setUsedFollowUp] = useState(false);
  const [journalId, setJournalId] = useState(null);
  const [helpline, setHelpline] = useState(null);

  const navigate = useNavigate();

  const canReflect = text.trim().length >= 10 && emotion !== null;

  const handleReflect = async () => {
    if (!canReflect || loading) return;

    setLoading(true);
    setReflection("");
    setFollowUp(null);
    setUsedFollowUp(false);
    setCrisis(false);
    setJournalId(null);
    setHelpline(null);

    const now = new Date();

    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;

    const time = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const entry = {
      date,
      time,
      text,
      emotion,
      culture,
    };

    try {
      const res = await fetch("http://localhost:5000/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, entry }),
      });

      const data = await res.json();

      console.log("CREATE JOURNAL RESPONSE:", data);

      if (data.journalId) {
        setJournalId(data.journalId);
      }

      setReflection(data.reflection || "");
      setCrisis(!!data.crisis);
      setHelpline(data.helpline);
    } catch (err) {
      console.error("Reflect failed:", err);
    } finally {
      setLoading(false);
    }
  };

  async function handleFollowUp() {
    if (!journalId) {
      console.error("Follow-up blocked: journalId missing");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/journal/${journalId}/followup`,
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
      <h2 className="text-2xl font-semibold">Today's Reflection</h2>

      <button
        onClick={() => navigate("/checkin")}
        className="text-sm underline text-slate-600"
      >
        Daily Check-In
      </button>

      <textarea
        className="w-full min-h-[160px] p-4 rounded border focus:outline-none"
        placeholder="Write anything that's on your mind..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <MoodSelector emotion={emotion} setEmotion={setEmotion} />
      <CultureSelector culture={culture} setCulture={setCulture} />

      <button
        disabled={!canReflect || loading}
        onClick={handleReflect}
        className={`px-4 py-2 rounded text-white ${
          canReflect && !loading
            ? "bg-slate-900"
            : "bg-slate-400 cursor-not-allowed"
        }`}
      >
        {loading ? "Reflecting…" : "Reflect"}
      </button>

      {reflection && (
        <div className="p-4 rounded bg-slate-100 space-y-3">
          <p>{reflection}</p>

          {crisis && helpline && (
  <div className="mt-3 border-t pt-3 text-sm text-slate-600">
    <p>
      Support available in your area:
    </p>
    <p className="font-medium">
      {helpline.name}
    </p>
    <p>📞 {helpline.phone}</p>
  </div>
)}

        </div>
      )}

      {reflection && journalId && !usedFollowUp && (
        <button onClick={handleFollowUp}>One More Thought</button>
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
        View Mood Calendar
      </button>
    </div>
  );
}

export default Journal;
