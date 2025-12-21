import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getJournalsAPI } from "../utils/api";
import { getCheckins } from "../utils/checkinApi";
import { EMOTIONS } from "../utils/emotions";
import { weeklyEmotionalDrift } from "../utils/weeklyDrift";
import { dailyEmotionalDrift } from "../utils/dailyDrift";

function Calendar({ sessionId }) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEntries, setDayEntries] = useState([]);
  const [dayCheckin, setDayCheckin] = useState(null);
  const [weeklyDriftText, setWeeklyDriftText] = useState(null);
  const [showJournals, setShowJournals] = useState(false);

  useEffect(() => {
    async function load() {
      const journals = await getJournalsAPI(sessionId);
      const checkins = await getCheckins(sessionId);

      // ✅ Weekly drift (check-ins only)
      setWeeklyDriftText(weeklyEmotionalDrift(checkins));

      const journalsByDate = {};
      journals.forEach((j) => {
        if (!journalsByDate[j.date]) journalsByDate[j.date] = [];
        journalsByDate[j.date].push(j);
      });

      const checkinByDate = {};
      checkins.forEach((c) => {
        checkinByDate[c.date] = c;
      });

      const dates = new Set([
        ...Object.keys(journalsByDate),
        ...Object.keys(checkinByDate),
      ]);

      // ✅ Calendar color = CHECK-IN ONLY
      const calendarEvents = Array.from(dates).map((date) => {
        const c = checkinByDate[date];
        const emotion = c?.emotion ? EMOTIONS[c.emotion] : null;

        return {
          title: emotion ? emotion.emoji : "",
          date,
          backgroundColor: emotion?.color || "#e5e7eb",
          borderColor: emotion?.color || "#e5e7eb",
          extendedProps: {
            entries: journalsByDate[date] || [],
            checkin: c || null,
          },
        };
      });

      setEvents(calendarEvents);
    }

    load();
  }, [sessionId]);

  const sortedEntries = [...dayEntries].sort((a, b) =>
    a.time.localeCompare(b.time)
  );
  const dailyDriftText = showJournals
    ? dailyEmotionalDrift(sortedEntries)
    : null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Mood Calendar</h2>

      {/* ✅ Weekly drift (always visible) */}
      {weeklyDriftText && (
        <div className="p-4 rounded bg-slate-50 text-sm text-slate-700">
          {weeklyDriftText}
        </div>
      )}

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => {
          setSelectedDate(info.event.startStr);
          setDayEntries(info.event.extendedProps.entries);
          setDayCheckin(info.event.extendedProps.checkin);
          setShowJournals(false);
        }}
        height="auto"
      />

      {selectedDate && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">{selectedDate}</h3>

          {/* ✅ CHECK-IN FIRST */}
          {dayCheckin ? (
            <div className="p-4 rounded border bg-slate-50">
              <p className="font-medium">Daily Check-In</p>
              <p>
                Emotion: {EMOTIONS[dayCheckin.emotion].emoji}{" "}
                {EMOTIONS[dayCheckin.emotion].label}
              </p>
              <p>Energy: {dayCheckin.energy}</p>
              <p>Openness: {dayCheckin.openness}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No check-in recorded for this day.
            </p>
          )}

          {/* ✅ JOURNAL TOGGLE */}
          {sortedEntries.length > 0 && !showJournals && (
            <button
              className="text-sm underline text-slate-600"
              onClick={() => setShowJournals(true)}
            >
              View journal entries
            </button>
          )}

          {/* ✅ JOURNALS (COLLAPSED BY DEFAULT) */}
          {showJournals && sortedEntries.length > 0 && (
            <div className="space-y-3">
              {sortedEntries.map((entry, idx) => {
                const e = EMOTIONS[entry.emotion];
                return (
                  <div
                    key={idx}
                    className="p-4 rounded space-y-2"
                    style={{ backgroundColor: e.color }}
                  >
                    <div className="flex gap-3">
                      <div className="text-2xl">{e.emoji}</div>
                      <div>
                        <p className="font-medium flex gap-2">
                          {e.label}
                          <span className="text-xs text-slate-600">
                            {entry.time}
                          </span>
                        </p>
                        <p className="text-sm">{entry.text}</p>
                      </div>
                    </div>

                    {entry.reflection && (
                      <div className="ml-8 pl-3 text-sm text-slate-700">
                        {entry.reflection}
                      </div>
                    )}

                    {entry.followUp && (
                      <div className="ml-10 pl-3 border-l text-sm text-slate-600 italic">
                        {entry.followUp}
                      </div>
                    )}
                  </div>
                );
              })}
              {showJournals && dailyDriftText && (
                <div className="p-3 rounded bg-slate-50 text-sm text-slate-700">
                  {dailyDriftText}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Calendar;
