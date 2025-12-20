import { useState } from "react";
import MoodSelector from "../components/MoodSelector";
import CultureSelector from "../components/CultureSelector";
import { useNavigate } from "react-router-dom";

function Journal({ sessionId }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState(null);
  const [culture, setCulture] = useState("neutral");
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState(false);

  const navigate = useNavigate();

  const canReflect = text.trim().length >= 10 && mood !== null;

  const handleReflect = async () => {
    if (!canReflect || loading) return;

    setLoading(true);
    setReflection("");
    setCrisis(false);

    const now = new Date();
    const date = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const entry = { date, text, mood, culture };

    try {
      const res = await fetch("http://localhost:5000/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, entry })
      });

      const data = await res.json();

      if (data.crisis) {
        setCrisis(true);
      }

      setReflection(data.reflection || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Today's Reflection</h2>

      <textarea
        className="w-full min-h-[160px] p-4 rounded border focus:outline-none"
        placeholder="Write anything that's on your mind..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <MoodSelector mood={mood} setMood={setMood} />
      <CultureSelector culture={culture} setCulture={setCulture} />

      <button
        disabled={!canReflect || loading}
        onClick={handleReflect}
        className={`px-4 py-2 rounded text-white transition
          ${canReflect && !loading
            ? "bg-slate-900"
            : "bg-slate-400 cursor-not-allowed"}`}
      >
        {loading ? "Reflecting…" : "Reflect"}
      </button>

      {reflection && (
        <div className="p-4 rounded bg-slate-100 space-y-3">
          <p className="animate-fadeIn">{reflection}</p>

          {crisis && (
            <div className="text-sm text-slate-600 border-t pt-3">
              <p>If you’re feeling unsafe right now:</p>
              <p>India: AASRA – 91-9820466726</p>
              <p>Global: findahelpline.com</p>
            </div>
          )}
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
