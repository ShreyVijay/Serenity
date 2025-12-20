import { useEffect, useState } from "react";
import { getMonthDays } from "../utils/calendar";
import { getMoodColor } from "../utils/moodColors";
import { getJournalsAPI } from "../utils/api";

function buildJournalMap(journals) {
  const map = {};
  journals.forEach((j) => {
    map[j.date] = j;
  });
  return map;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function Calendar({ sessionId }) {
  const [journals, setJournals] = useState([]);
  const [selected, setSelected] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  useEffect(() => {
    async function load() {
      const data = await getJournalsAPI(sessionId);
      setJournals(data);
    }
    load();
  }, [sessionId]);

  const journalMap = buildJournalMap(journals);
  const days = getMonthDays(year, month);

  const todayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Mood Calendar</h2>

      <div className="grid grid-cols-7 gap-2 text-center text-sm text-slate-500">
        {WEEKDAYS.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          if (!day) return <div key={idx} />;

          const dateStr = `${day.getFullYear()}-${String(
            day.getMonth() + 1
          ).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;

          const entry = journalMap[dateStr];
          const isToday = dateStr === todayStr;

          return (
            <div
              key={idx}
              title={entry ? `Mood: ${entry.mood}` : ""}
              onClick={() => entry && setSelected(entry)}
              className={`h-20 p-2 rounded border text-sm cursor-pointer
                ${entry ? getMoodColor(entry.mood) : "bg-slate-50"}
                ${isToday ? "border-slate-900" : ""}`}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="p-4 rounded bg-slate-100 space-y-2">
          <p className="font-semibold">{selected.date}</p>
          <p>Mood: {selected.mood}</p>
          <p>{selected.text}</p>
        </div>
      )}
    </div>
  );
}

export default Calendar;
