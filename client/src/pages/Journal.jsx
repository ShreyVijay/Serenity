import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Send,
  ArrowLeft,
  Sparkles,
  CalendarDays,
  Loader2,
  BookOpen,
  Compass,
} from "lucide-react";
import MoodSelector from "../components/MoodSelector";
import { getOrCreateSessionId } from "../utils/session";
import { useText } from "../i18n/useText";

function Journal() {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState(null);
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState(null);
  const [journalId, setJournalId] = useState(null);

  const navigate = useNavigate();
  const t = useText();

  const canReflect = text.trim().length >= 10 && emotion;

  async function handleReflect() {
    if (!canReflect || loading) return;

    setLoading(true);
    setReflection("");
    setFollowUp(null);

    const sessionId = getOrCreateSessionId();

    const now = new Date(); // ❗ THIS LINE WAS MISSING

    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);

    const entry = {
      date: localDate,
      time: now.toTimeString().slice(0, 5),
      text,
      emotion,
      culture: localStorage.getItem("serenity_culture") || "neutral",
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/journal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          entry,
        }),
      });

      if (!res.ok) throw new Error("Journal save failed");

      const data = await res.json();
      setJournalId(data.journalId);

      setReflection(data.reflection || "");
    } catch (err) {
      console.error("Journal save error:", err);
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
    } catch (e) {
      console.error("Follow-up save failed", e);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-emerald-50 to-slate-100 font-sans text-slate-800 relative overflow-hidden flex flex-col">
      {/* Ambient Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-200/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <div className="relative z-20 px-6 py-6 flex items-center justify-between max-w-6xl mx-auto w-full">
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

        <div className="flex items-center gap-3">
          <Link
            to="/calendar"
            className="w-10 h-10 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-slate-500 hover:text-amber-600 shadow-sm border border-white/50 backdrop-blur-md transition-all group"
            title="View Calendar"
          >
            <CalendarDays size={18} />
          </Link>
        </div>
      </div>

      {/* Main Content: Split Grid */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 pb-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Writing Canvas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col h-full"
        >
          <div className="mb-6">
            <h2 className="text-3xl font-light text-slate-800 mb-2 flex items-center gap-3">
              <BookOpen
                size={28}
                className="text-indigo-400"
                strokeWidth={1.5}
              />
              {t.journalTitle || "Unload your mind"}
            </h2>
            <p className="text-slate-500 text-sm ml-10">
              What is weighing on you right now? Let it out safely.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] flex-1 min-h-[500px] flex flex-col">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.journalPlaceholder || "I am feeling..."}
              className="w-full flex-1 bg-transparent resize-none border-none focus:outline-none text-lg text-slate-700 placeholder:text-slate-400/70 leading-relaxed custom-scrollbar"
              autoFocus
            />

            <div className="mt-6 pt-6 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block pl-1">
                How does this make you feel?
              </label>
              <MoodSelector emotion={emotion} setEmotion={setEmotion} />
            </div>

            <div className="mt-8">
              <motion.button
                whileHover={{ scale: canReflect ? 1.02 : 1 }}
                whileTap={{ scale: canReflect ? 0.98 : 1 }}
                onClick={handleReflect}
                disabled={!canReflect || loading}
                className={`
                            w-full flex items-center justify-center gap-3 rounded-2xl py-4 font-medium text-lg transition-all shadow-lg
                            ${
                              canReflect
                                ? "bg-slate-800 text-white shadow-slate-300 hover:bg-slate-900 cursor-pointer"
                                : "bg-white/50 text-slate-400 border border-white/50 cursor-not-allowed shadow-none"
                            }
                        `}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>{t.reflecting || "Reflecting..."}</span>
                  </>
                ) : (
                  <>
                    <span>{t.reflect || "Reflect"}</span>
                    <Send
                      size={18}
                      className={canReflect ? "opacity-100" : "opacity-50"}
                    />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Reflection Output */}
        <div className="h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {reflection ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/40 border border-white/60 relative overflow-hidden"
              >
                {/* Gradient Top Line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-300" />

                <div className="flex items-start gap-5 mb-6">
                  <div className="p-3.5 bg-indigo-50 rounded-2xl text-indigo-500 shrink-0">
                    <Sparkles size={24} />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">
                      {t.reflectionLabel || "Reflection"}
                    </h3>
                    <div className="text-slate-800 leading-relaxed text-xl font-light">
                      {reflection}
                    </div>
                  </div>
                </div>

                {/* Deepen Reflection Section */}
                {!followUp ? (
                  <div className="mt-10 flex justify-end">
                    <button
                      onClick={() => handleFollowUp()}
                      className="group flex items-center gap-3 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-6 py-3 rounded-full transition-all"
                    >
                      <Compass
                        size={18}
                        className="group-hover:rotate-45 transition-transform duration-500"
                      />
                      {t.deepenReflection || "One More Thought"}
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-10 pt-10 border-t border-slate-100"
                  >
                    <div className="flex gap-5">
                      <div className="mt-1 text-slate-300 shrink-0">
                        <Compass size={24} />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          One More Thought
                        </span>
                        <p className="text-slate-600 font-light text-lg italic leading-relaxed">
                          "{followUp}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Empty State Placeholder for Right Side */
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:flex h-full flex-col items-center justify-center text-center p-12 opacity-40"
              >
                <div className="w-64 h-64 bg-white/30 rounded-full blur-3xl absolute" />
                <div className="relative z-10">
                  <Sparkles
                    size={48}
                    className="text-slate-300 mx-auto mb-4"
                    strokeWidth={1}
                  />
                  <h3 className="text-xl font-light text-slate-400">
                    Ready to listen
                  </h3>
                  <p className="text-sm text-slate-300 mt-2 max-w-xs mx-auto">
                    Your reflection will appear here once you share your
                    thoughts.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
      `}</style>
    </div>
  );
}

export default Journal;
