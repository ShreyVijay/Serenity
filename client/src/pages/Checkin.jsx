import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Activity,
  Brain,
  Check,
  Loader2,
} from "lucide-react";

import MoodSelector from "../components/MoodSelector";
import { EMOTIONS } from "../utils/emotions";
import { saveCheckin, getCheckins } from "../utils/checkinApi";
import { last7Days } from "../utils/last7Days";
import { getOrCreateSessionId } from "../utils/session";
import { useText } from "../i18n/useText";

function todayLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function Checkin() {
  const sessionId = getOrCreateSessionId();
  const t = useText();
  const navigate = useNavigate();

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
    const byDate = {};
    data.forEach((c) => (byDate[c.date] = c));

    // .reverse() ensures Chronological Order: [T-6, T-5, ... Yesterday, Today]
    // This places "Today" (Latest) at the visual Right.
    const days = last7Days()
      .reverse()
      .map((d) => ({
        date: d,
        data: byDate[d] || null,
        isToday: d === todayLocal(),
      }));
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
    await loadWeek();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-emerald-50 to-slate-100 font-sans text-slate-800 relative overflow-hidden flex flex-col">
      {/* Ambient Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-200/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <div className="relative z-20 px-6 py-6 flex items-center justify-between max-w-2xl mx-auto w-full">
        <Link
          to="/landing"
          className="group flex items-center gap-3 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-white/60 group-hover:bg-white flex items-center justify-center shadow-sm border border-white/50 backdrop-blur-md transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-medium tracking-wide hidden md:block">
            {t.backToSanctuary || "Back to Sanctuary"}
          </span>
        </Link>

        <Link
          to="/calendar"
          className="w-10 h-10 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-slate-500 hover:text-amber-600 shadow-sm border border-white/50 backdrop-blur-md transition-all"
          title={t.viewCalendar || "View Calendar"}
        >
          <CalendarDays size={18} />
        </Link>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 w-full max-w-2xl mx-auto px-6 pb-12 relative z-10"
      >
        {/* Weekly Streak Header */}
        <div className="mb-8">
          <h2 className="text-center text-3xl font-light text-slate-800 mb-6">
            {t.checkinTitle || "Daily Pulse"}
          </h2>

          {/* Week Bubbles (Left = Oldest, Right = Today) */}
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-4 flex justify-between items-center shadow-sm">
            {week.map((dayObj, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 relative group"
              >
                {/* The Bubble */}
                <div
                  className={`
                                w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-lg shadow-sm transition-all
                                ${
                                  dayObj.data
                                    ? "scale-100 ring-2 ring-white"
                                    : "bg-white/40 border border-slate-200 border-dashed text-slate-300"
                                }
                                ${
                                  dayObj.isToday
                                    ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-white/50"
                                    : ""
                                }
                            `}
                  style={{
                    backgroundColor: dayObj.data
                      ? EMOTIONS[dayObj.data.emotion].color
                      : "",
                  }}
                >
                  {dayObj.data
                    ? EMOTIONS[dayObj.data.emotion].emoji
                    : "•"}
                </div>

                {/* Label */}
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    dayObj.isToday
                      ? "text-emerald-600 font-extrabold"
                      : "text-slate-400"
                  }`}
                >
                  {dayObj.isToday
                    ? t.today || "Today"
                    : new Date(dayObj.date).toLocaleDateString("en-US", {
                        weekday: "narrow",
                      })}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-3 font-medium tracking-wide uppercase">
            {t.thisWeek || "Past 7 Days"}
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden">
          {/* Success Overlay */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 bg-emerald-50/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-lg mb-6"
                >
                  <Check size={40} strokeWidth={3} />
                </motion.div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-2">
                  {t.saved || "Recorded"}
                </h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                  {t.checkinRecorded || "Your pulse has been added to your journey."}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSaved(false)}
                    className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
                  >
                    {t.edit || "Edit"}
                  </button>
                  <button
                    onClick={() => navigate("/calendar")}
                    className="px-6 py-2 bg-slate-800 rounded-xl text-white font-medium hover:bg-slate-900"
                  >
                    {t.viewCalendar || "View Calendar"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-8">
            {/* 1. Mood Section */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block pl-1">
                {t.howAreYouFeeling || "How are you feeling right now?"}
              </label>
              <MoodSelector emotion={emotion} setEmotion={setEmotion} />
            </div>

            {/* 2. Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Energy Slider */}
              <div className="bg-white/60 rounded-2xl p-5 border border-white/50">
                <div className="flex items-center gap-2 mb-4 text-emerald-600">
                  <Activity size={18} />
                  <span className="font-medium text-sm">
                    {t.energy || "Physical Energy"}
                  </span>
                  <span className="ml-auto bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">
                    {energy}/5
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energy}
                  onChange={(e) => setEnergy(+e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>{t.drained || "Drained"}</span>
                  <span>{t.vibrant || "Vibrant"}</span>
                </div>
              </div>

              {/* Clarity Slider (Mental) */}
              <div className="bg-white/60 rounded-2xl p-5 border border-white/50">
                <div className="flex items-center gap-2 mb-4 text-violet-500">
                  <Brain size={18} />
                  <span className="font-medium text-sm">
                    {t.clarity || "Mental Clarity"}
                  </span>
                  <span className="ml-auto bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full text-xs font-bold">
                    {openness}/5
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={openness}
                  onChange={(e) => setOpenness(+e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>{t.foggy || "Foggy"}</span>
                  <span>{t.clear || "Clear"}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: canSave ? 1.02 : 1 }}
                whileTap={{ scale: canSave ? 0.98 : 1 }}
                onClick={submit}
                disabled={!canSave}
                className={`
                                    w-full flex items-center justify-center gap-2 rounded-xl py-4 font-medium text-lg transition-all shadow-lg
                                    ${
                                      canSave
                                        ? "bg-slate-800 text-white shadow-slate-300 hover:bg-slate-900 cursor-pointer"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                                    }
                                `}
              >
                {saving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>{t.saving || "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <span>{t.saveCheckin || "Save Check-in"}</span>
                    <Check
                      size={18}
                      className={canSave ? "opacity-100" : "opacity-50"}
                    />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}