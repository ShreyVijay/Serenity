import { useState, useEffect } from "react";
import { EMOTIONS } from "../utils/emotions";
import { saveCheckin, getCheckins } from "../utils/checkinApi";
import { last7Days } from "../utils/last7Days";
import { useSession } from "../context/SessionContext";

function todayLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}


export default function Checkin() {
  const { sessionId } = useSession();
  console.log("CHECKIN SESSION ID:", sessionId);

  const [emotion, setEmotion] = useState(null);
  const [energy, setEnergy] = useState(3);
  const [openness, setOpenness] = useState(3);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [week, setWeek] = useState([]);

  const canSave = Boolean(emotion) && !saving;

  async function loadWeek() {
    if (!sessionId) return;

    const data = await getCheckins(sessionId);

    console.log(
      "RAW CHECKINS:",
      data.map((c) => c.date)
    );
    console.log("LAST 7 DAYS:", last7Days());

    const byDate = {};
    data.forEach((c) => {
      byDate[c.date] = c;
    });

    const days = last7Days().map((d) => byDate[d] || null);
    setWeek(days);
  }

  useEffect(() => {
    loadWeek();
  }, [sessionId]);

  async function submit() {
    if (!canSave) return;

    setSaving(true);
    setSaved(false);

    await saveCheckin(sessionId, {
      date: todayLocal(),
      emotion,
      energy,
      openness,
    });

    setSaving(false);
    setSaved(true);

    await loadWeek(); // refresh UI
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Daily Check-In</h2>

      <div>
        <p>This week:</p>
        {week.map((d, i) => (
          <span key={i}>
            {d ? EMOTIONS[d.emotion]?.emoji : "—"}{" "}
          </span>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {Object.entries(EMOTIONS).map(([k, e]) => (
          <button
            key={k}
            onClick={() => setEmotion(k)}
            className={`px-4 py-2 rounded border ${
              emotion === k ? "ring-2" : ""
            }`}
            style={{ backgroundColor: e.color }}
          >
            <span className="text-lg">{e.emoji}</span> {e.label}
          </button>
        ))}
      </div>

      <div>
        <label>Energy</label>
        <input
          type="range"
          min="1"
          max="5"
          value={energy}
          onChange={(e) => setEnergy(+e.target.value)}
        />
      </div>

      <div>
        <label>Openness</label>
        <input
          type="range"
          min="1"
          max="5"
          value={openness}
          onChange={(e) => setOpenness(+e.target.value)}
        />
      </div>

      <button
        onClick={submit}
        disabled={!canSave}
        className={`px-4 py-2 rounded text-white ${
          canSave ? "bg-slate-900" : "bg-slate-400"
        }`}
      >
        {saving ? "Saving…" : "Save Check-In"}
      </button>

      {saved && <p>Saved.</p>}
    </div>
  );
}
