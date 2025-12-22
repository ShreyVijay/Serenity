import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Leaf,
  Sparkles,
  X,
  Activity,
  Sun,
  ArrowLeft,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { getJournalsAPI } from "../utils/api";
import { getCheckins } from "../utils/checkinApi";
import { EMOTIONS } from "../utils/emotions";
import { weeklyEmotionalDrift } from "../utils/weeklyDrift";
import { dailyEmotionalDrift } from "../utils/dailyDrift";
import { getOrCreateSessionId } from "../utils/session";
import { useText } from "../i18n/useText";

function Calendar() {
  const sessionId = getOrCreateSessionId();
  const t = useText();

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEntries, setDayEntries] = useState([]);
  const [dayCheckin, setDayCheckin] = useState(null);
  const [weeklyDriftText, setWeeklyDriftText] = useState(null);
  const [showJournals, setShowJournals] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    async function load() {
      const journals = await getJournalsAPI(sessionId);
      const checkins = await getCheckins(sessionId);

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

      const calendarEvents = Array.from(dates).map((date) => {
        const c = checkinByDate[date];
        const emotion = c?.emotion ? EMOTIONS[c.emotion] : null;

        const bgColor = emotion?.color || "#F1F5F9";

        return {
          title: emotion ? emotion.emoji : "•",
          date,
          backgroundColor: bgColor,
          borderColor: "transparent",
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

  // --- RESPONSIVE FLOATING CALENDAR STYLING ---
  const calendarWrapperClass = `
    h-full w-full
    
    /* 1. Global Reset */
    [&_.fc]:font-sans [&_.fc]:text-slate-600
    
    /* 2. KILL ALL BORDERS */
    [&_.fc-scrollgrid]:!border-none 
    [&_.fc-theme-standard_td]:!border-none 
    [&_.fc-theme-standard_th]:!border-none
    [&_td]:!border-none
    [&_th]:!border-none
    [&_.fc-col-header-cell]:!border-none
    [&_.fc-daygrid-day]:!border-none

    /* 3. Header Toolbar */
    [&_.fc-header-toolbar]:mb-4 [&_.fc-header-toolbar]:px-1
    [&_.fc-toolbar-title]:text-lg md:[&_.fc-toolbar-title]:text-xl [&_.fc-toolbar-title]:font-semibold [&_.fc-toolbar-title]:text-slate-700
    
    /* Navigation Buttons */
    [&_.fc-button]:bg-white/80 [&_.fc-button]:!border-none [&_.fc-button]:shadow-sm [&_.fc-button]:text-slate-500 [&_.fc-button]:rounded-lg [&_.fc-button]:h-8 [&_.fc-button]:px-3 [&_.fc-button]:text-xs [&_.fc-button]:font-medium [&_.fc-button]:transition-all
    [&_.fc-button:hover]:bg-white [&_.fc-button:hover]:text-sky-600 [&_.fc-button:hover]:shadow-md
    [&_.fc-button:focus]:shadow-none [&_.fc-button:focus]:ring-0

    /* 4. Day Headers */
    [&_.fc-col-header-cell]:pb-2
    [&_.fc-col-header-cell-cushion]:text-[9px] md:[&_.fc-col-header-cell-cushion]:text-[10px] [&_.fc-col-header-cell-cushion]:font-bold [&_.fc-col-header-cell-cushion]:uppercase [&_.fc-col-header-cell-cushion]:tracking-widest [&_.fc-col-header-cell-cushion]:text-slate-400 [&_.fc-col-header-cell-cushion]:no-underline

    /* 5. THE DAY CELLS (Responsive Floating Cards) */
    
    /* Mobile: Tiny margins (2px), Fit Height */
    [&_.fc-daygrid-day-frame]:mx-0.5 [&_.fc-daygrid-day-frame]:my-0.5
    [&_.fc-daygrid-day-frame]:h-[calc(100%-4px)] 
    
    /* Desktop: Larger margins (8px), Fit Height */
    md:[&_.fc-daygrid-day-frame]:mx-2 md:[&_.fc-daygrid-day-frame]:my-2 
    md:[&_.fc-daygrid-day-frame]:h-[calc(100%-16px)]

    /* Visual Style */
    [&_.fc-daygrid-day-frame]:min-h-[70px] md:[&_.fc-daygrid-day-frame]:min-h-[90px]
    [&_.fc-daygrid-day-frame]:rounded-xl
    [&_.fc-daygrid-day-frame]:bg-white/40
    [&_.fc-daygrid-day-frame]:backdrop-blur-sm
    [&_.fc-daygrid-day-frame]:shadow-sm
    [&_.fc-daygrid-day-frame]:transition-all
    
    /* Hover Effect */
    [&_.fc-daygrid-day-frame:hover]:bg-white/90 [&_.fc-daygrid-day-frame:hover]:shadow-md [&_.fc-daygrid-day-frame:hover]:-translate-y-0.5

    /* 6. HIDE INVALID/EMPTY BOXES */
    [&_.fc-day-other_.fc-daygrid-day-frame]:!bg-transparent 
    [&_.fc-day-other_.fc-daygrid-day-frame]:!shadow-none 
    [&_.fc-day-other_.fc-daygrid-day-frame]:!backdrop-blur-none
    [&_.fc-day-other_.fc-daygrid-day-number]:opacity-30

    /* 7. Date Numbers */
    [&_.fc-daygrid-day-top]:flex-row [&_.fc-daygrid-day-top]:justify-end [&_.fc-daygrid-day-top]:p-1 md:[&_.fc-daygrid-day-top]:p-2
    [&_.fc-daygrid-day-number]:text-[10px] md:[&_.fc-daygrid-day-number]:text-xs [&_.fc-daygrid-day-number]:font-medium [&_.fc-daygrid-day-number]:text-slate-400 [&_.fc-daygrid-day-number]:no-underline

    /* 8. "Today" Highlighting */
    [&_.fc-day-today_.fc-daygrid-day-frame]:bg-sky-50/90
    [&_.fc-day-today_.fc-daygrid-day-number]:text-sky-600 [&_.fc-day-today_.fc-daygrid-day-number]:font-bold

    /* 9. Events (Pills) */
    [&_.fc-daygrid-event-harness]:my-0.5
    [&_.fc-event]:rounded-full [&_.fc-event]:!border-none [&_.fc-event]:shadow-none [&_.fc-event]:cursor-pointer 
    [&_.fc-event]:mx-auto [&_.fc-event]:px-1.5 md:[&_.fc-event]:px-2 [&_.fc-event]:py-0.5
    [&_.fc-event-title]:text-[10px] [&_.fc-event-title]:font-medium
    [&_.fc-event]:bg-transparent 
  `;

  return (
    <div className="h-screen w-full bg-gradient-to-b from-sky-100 via-emerald-50 to-slate-100 font-sans text-slate-800 flex flex-col overflow-hidden relative">
      {/* Ambient Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-200/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar */}
      <div className="flex-none px-6 py-6 flex items-center justify-between z-20 relative">
        {/* Left: Explicit Back Button */}
        <Link
          to="/landing"
          className="group flex items-center gap-3 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-white/60 group-hover:bg-white flex items-center justify-center shadow-sm border border-white/50 backdrop-blur-md transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-medium tracking-wide hidden md:block">
            Back to Sanctuary
          </span>
        </Link>

        {/* Center: Page Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-3xl font-medium text-slate-700 tracking-tight">
            {t.calendarTitle || "Your Journey"}
          </h1>
        </div>

        {/* Right: Empty Placeholder to balance flex (hidden on mobile) */}
        <div className="w-[140px] hidden md:block"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 px-4 pb-6 md:px-8 md:pb-8 z-10 flex flex-col">
        {/* Weekly Insight (Moved Above Calendar) */}
        {weeklyDriftText && (
          <div className="flex-none mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/50 shadow-sm">
              <Sparkles size={14} className="text-sky-500" />
              <span className="text-xs text-slate-600 font-medium text-center">
                {weeklyDriftText}
              </span>
            </div>
          </div>
        )}

        <div className="flex-1 min-h-0 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Area */}
          <div className="lg:col-span-8 h-full flex flex-col">
            <div className="flex-1 bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-4 md:p-6 overflow-hidden">
              <div className={calendarWrapperClass}>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={events}
                  headerToolbar={{
                    left: "prev,next",
                    center: "title",
                    right: "today",
                  }}
                  dayMaxEvents={2}
                  eventClick={(info) => {
                    setSelectedDate(info.event.startStr);
                    setDayEntries(info.event.extendedProps.entries);
                    setDayCheckin(info.event.extendedProps.checkin);
                    setShowJournals(false);
                  }}
                  height="100%"
                  fixedWeekCount={false}
                  showNonCurrentDates={true}
                />
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-4 h-full min-h-0 relative hidden lg:block">
            <AnimatePresence mode="wait">
              {selectedDate ? (
                <motion.div
                  key={selectedDate}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/20 rounded-[2.5rem] p-8 h-full flex flex-col"
                >
                  {/* Panel Header */}
                  <div className="flex items-center justify-between mb-8 flex-none">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Overview
                      </span>
                      <h3 className="text-2xl font-light text-slate-800 mt-1">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          day: "numeric",
                        })}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full text-slate-400 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Panel Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 pr-2 space-y-6">
                    {/* Check-in */}
                    {dayCheckin ? (
                      <div className="relative overflow-hidden bg-gradient-to-br from-white/80 to-slate-50/50 rounded-3xl p-6 border border-white shadow-sm">
                        <div className="flex items-center gap-5 mb-5 relative z-10">
                          <span className="text-5xl filter drop-shadow-sm">
                            {EMOTIONS[dayCheckin.emotion].emoji}
                          </span>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                              Mood
                            </p>
                            <p className="text-xl font-medium text-slate-700">
                              {EMOTIONS[dayCheckin.emotion].label}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                          <div className="bg-white/60 rounded-2xl p-3 text-center shadow-sm backdrop-blur-sm">
                            <Activity
                              size={16}
                              className="mx-auto text-emerald-400 mb-1"
                            />
                            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
                              Energy
                            </span>
                            <span className="text-lg font-semibold text-slate-600">
                              {dayCheckin.energy}
                            </span>
                          </div>
                          <div className="bg-white/60 rounded-2xl p-3 text-center shadow-sm backdrop-blur-sm">
                            <Sun
                              size={16}
                              className="mx-auto text-amber-400 mb-1"
                            />
                            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
                              Mental Clarity
                            </span>
                            <span className="text-lg font-semibold text-slate-600">
                              {dayCheckin.openness}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-slate-400 bg-white/30 rounded-3xl border border-dashed border-slate-200">
                        <Leaf className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="text-xs font-medium">
                          No check-in recorded
                        </p>
                      </div>
                    )}

                    {/* Journals */}
                    <div>
                      <div className="flex items-center justify-between mb-4 px-1">
                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                          Journals
                        </h4>
                        {!showJournals && sortedEntries.length > 0 && (
                          <button
                            onClick={() => setShowJournals(true)}
                            className="text-[10px] bg-white/60 px-3 py-1.5 rounded-full text-slate-500 border border-slate-200 hover:border-sky-200 hover:text-sky-600 transition-all shadow-sm"
                          >
                            Expand
                          </button>
                        )}
                      </div>

                      {showJournals || sortedEntries.length <= 1 ? (
                        <div className="space-y-4">
                          {dailyDriftText && (
                            <div className="bg-sky-50/60 p-4 rounded-2xl text-xs text-sky-800 border border-sky-100 flex gap-3 leading-relaxed">
                              <Sparkles
                                size={16}
                                className="text-sky-500 shrink-0 mt-0.5"
                              />
                              <span>{dailyDriftText}</span>
                            </div>
                          )}
                          {sortedEntries.map((entry, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-2xl">
                                  {EMOTIONS[entry.emotion].emoji}
                                </span>
                                <span className="text-[10px] bg-slate-50 px-2 py-1 rounded-full text-slate-400 font-medium tracking-wide">
                                  {entry.time}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 font-light leading-relaxed mb-4">
                                {entry.text}
                              </p>
                              {entry.reflection && (
                                <div className="bg-emerald-50/40 p-3 rounded-2xl text-xs text-slate-500 italic flex gap-2 border border-emerald-50/50">
                                  <Leaf
                                    size={12}
                                    className="text-emerald-500 shrink-0 mt-0.5"
                                  />
                                  {entry.reflection}
                                </div>
                              )}
                              {entry.followUp && (
                                <div className="mt-3 ml-3 pl-2 border-l-2 border-indigo-200 text-xs text-indigo-700 italic flex gap-2">
                                  <Compass
                                    size={12}
                                    className="shrink-0 mt-0.5 text-indigo-400"
                                  />
                                  {entry.followUp}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          className="bg-white/40 p-5 rounded-3xl border border-transparent hover:border-slate-200 text-center cursor-pointer transition-all hover:bg-white/60"
                          onClick={() => setShowJournals(true)}
                        >
                          <span className="text-xs text-slate-500 font-medium">
                            Read {sortedEntries.length} entries
                          </span>
                        </div>
                      )}

                      {sortedEntries.length === 0 && (
                        <div className="text-center py-6 text-slate-300 italic text-xs">
                          A quiet day. No thoughts recorded.
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/30 backdrop-blur-sm rounded-[2.5rem] border border-white/40">
                  <div className="w-24 h-24 bg-white/60 rounded-full flex items-center justify-center mb-6 text-slate-300 shadow-sm">
                    <CalendarDays size={32} strokeWidth={1} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-600 mb-2">
                    Select a Date
                  </h3>
                  <p className="text-sm text-slate-400 max-w-[200px]">
                    Tap on any day to explore your emotional landscape.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Modal for Selected Date */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white/90 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] p-6 lg:hidden h-[80vh] flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-6 flex-none">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Overview
                </span>
                <h3 className="text-2xl font-light text-slate-800 mt-1">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                  })}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Content Reused Logic */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Same content as Desktop Side Panel - Logic Replicated for Mobile */}
              {/* (For brevity, you can refactor this inner content into a component called DayDetailsPanel) */}
              {dayCheckin ? (
                <div className="relative overflow-hidden bg-gradient-to-br from-white/80 to-slate-50/50 rounded-3xl p-6 border border-white shadow-sm mb-6">
                  <div className="flex items-center gap-5 mb-5 relative z-10">
                    <span className="text-5xl filter drop-shadow-sm">
                      {EMOTIONS[dayCheckin.emotion].emoji}
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Mood
                      </p>
                      <p className="text-xl font-medium text-slate-700">
                        {EMOTIONS[dayCheckin.emotion].label}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 bg-white/30 rounded-3xl border border-dashed border-slate-200 mb-6">
                  <p className="text-xs font-medium">No check-in</p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Journals
                  </h4>
                </div>
                <div className="space-y-4">
                  {sortedEntries.map((entry, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm"
                    >
                      <p className="text-sm text-slate-600 font-light leading-relaxed mb-4">
                        {entry.text}
                      </p>
                      {entry.reflection && (
                        <div className="bg-emerald-50/40 p-3 rounded-2xl text-xs text-slate-500 italic flex gap-2 border border-emerald-50/50">
                          <Leaf
                            size={12}
                            className="text-emerald-500 shrink-0 mt-0.5"
                          />
                          {entry.reflection}
                        </div>
                      )}
                      {entry.followUp && (
                        <div className="mt-3 ml-3 pl-2 border-l-2 border-indigo-200 text-xs text-indigo-700 italic flex gap-2">
                          <Compass
                            size={12}
                            className="shrink-0 mt-0.5 text-indigo-400"
                          />
                          {entry.followUp}
                        </div>
                      )}
                    </div>
                  ))}
                  {sortedEntries.length === 0 && (
                    <p className="text-center text-xs text-slate-300">
                      No entries
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94A3B8; }
      `}</style>
    </div>
  );
}

export default Calendar;
