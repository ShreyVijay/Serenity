import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Settings, 
  X, 
  BookOpen, 
  CalendarDays, 
  Activity, 
  ChevronRight,
  Sparkles,
  ChevronDown,
  Check
} from "lucide-react";
import { useText } from "../i18n/useText";
import CultureSelector from "../components/CultureSelector";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi (हिंदी)" },
  { value: "es", label: "Spanish (Español)" },
  { value: "fr", label: "French (Français)" },
  { value: "de", label: "German (Deutsch)" },
  { value: "ja", label: "Japanese (日本語)" },
];

function Landing() {
  const t = useText();
  const [showSettings, setShowSettings] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // State for settings
  const [language, setLanguage] = useState("en");
  const [culture, setCulture] = useState("neutral");

  useEffect(() => {
    const savedLang = localStorage.getItem("serenity_language");
    const savedCulture = localStorage.getItem("serenity_culture");
    if (savedLang) setLanguage(savedLang);
    if (savedCulture) setCulture(savedCulture);
  }, []);

  function saveSettings() {
    localStorage.setItem("serenity_language", language);
    localStorage.setItem("serenity_culture", culture);
    window.location.reload(); 
  }

  const selectedLangLabel = LANGUAGES.find(l => l.value === language)?.label || "English";

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    // ROOT: Scrolling enabled (overflow-y-auto) as requested
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-sky-100 via-emerald-50 to-slate-100 font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900 flex flex-col relative custom-scrollbar">
      
      {/* Ambient Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[80%] md:w-[60%] h-[60%] bg-white/40 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] md:w-[50%] h-[50%] bg-sky-200/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />

      {/* Top Controls */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
        <button 
          onClick={() => setShowSettings(true)}
          className="group flex items-center gap-2.5 px-5 py-2.5 bg-white/70 hover:bg-white rounded-full transition-all shadow-sm border border-white/60 backdrop-blur-md hover:shadow-md hover:scale-[1.02] active:scale-95"
        >
          <Sparkles size={16} className="text-indigo-500 group-hover:text-indigo-600 group-hover:rotate-12 transition-all duration-500" />
          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 tracking-wide">
            {t.personalize || "Personalize"}
          </span>
        </button>
      </div>

      {/* Main Content Dashboard */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-16 flex flex-col"
      >
        
        {/* HEADER SECTION - Cinematic Look */}
        <motion.div variants={cardVariants} className="relative flex flex-col items-center justify-center text-center shrink-0 min-h-[200px] mb-8">
            
            {/* LOGO LAYER (Background) */}
            {/* Z-0 puts it behind the text. Mask fades edges softly. */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-25 md:opacity-30">
                 <img 
                    src="/logo.png" 
                    alt="Serenity" 
                    className="w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-2xl [mask-image:radial-gradient(circle,black_30%,transparent_80%)]" 
                 />
            </div>

            {/* TEXT LAYER (Foreground) */}
            <div className="relative z-10">
                <h1 className="text-5xl md:text-7xl font-light text-slate-800 mb-2 tracking-tight drop-shadow-sm">
                    {t.landingTitle || "Serenity"}
                </h1>
                <p className="text-slate-500 max-w-md mx-auto text-sm md:text-lg font-light leading-relaxed px-4">
                    {t.landingSubtitle || "Where would you like to begin today?"}
                </p>
            </div>
        </motion.div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-12">
            
            {/* Primary Card: Journal */}
            <motion.div variants={cardVariants} className="md:col-span-7 h-full">
                <Link to="/journal" className="group block h-full">
                    <div className="relative h-full bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 md:p-8 transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] hover:bg-white/80 hover:scale-[1.01] overflow-hidden flex flex-col justify-between min-h-[220px]">
                        <div className="space-y-4 relative z-10">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-medium text-slate-800 mb-1">{t.journalTitle || "Journal"}</h2>
                                <p className="text-slate-500 leading-relaxed text-sm md:text-base max-w-sm">
                                  {t.journalDesc || "Unload your thoughts. Reflect with gentle guidance."}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-600 font-medium mt-6 group-hover:translate-x-1 transition-transform relative z-10">
                            {t.writeEntry || "Write Entry"} <ChevronRight size={18} />
                        </div>
                        {/* Decorative Blob */}
                        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-indigo-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100/60 transition-colors" />
                    </div>
                </Link>
            </motion.div>

            {/* Secondary Column */}
            <div className="md:col-span-5 flex flex-col gap-4">
                
                {/* Check-in Card */}
                <motion.div variants={cardVariants} className="flex-1">
                    <Link to="/checkin" className="group block h-full">
                        <div className="relative h-full bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 transition-all hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] hover:bg-white/80 hover:scale-[1.01] overflow-hidden flex flex-col justify-center min-h-[140px]">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <Activity size={20} strokeWidth={1.5} />
                                </div>
                            </div>
                            <h2 className="text-lg font-medium text-slate-800">{t.checkinTitle || "Daily Check-in"}</h2>
                            <p className="text-sm text-slate-500 line-clamp-1">{t.checkinDesc || "Track your mood & energy."}</p>
                        </div>
                    </Link>
                </motion.div>

                {/* Calendar Card */}
                <motion.div variants={cardVariants} className="flex-1">
                    <Link to="/calendar" className="group block h-full">
                        <div className="relative h-full bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 transition-all hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] hover:bg-white/80 hover:scale-[1.01] overflow-hidden flex flex-col justify-center min-h-[140px]">
                             <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                    <CalendarDays size={20} strokeWidth={1.5} />
                                </div>
                            </div>
                            <h2 className="text-lg font-medium text-slate-800">{t.calendarTitle || "Calendar"}</h2>
                            <p className="text-sm text-slate-500 line-clamp-1">{t.calendarDesc || "View your journey."}</p>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </div>

        {/* Footer */}
        <motion.p variants={cardVariants} className="mt-auto text-center text-xs text-slate-400 font-medium tracking-wide pb-8">
            {t.footer || "Your space. Your pace."}
        </motion.p>
      </motion.div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSettings(false)}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm max-h-[85vh] overflow-y-auto bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl z-50 p-8 border border-white/60 custom-scrollbar"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
                            {t.personalize || "Personalize"}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            {t.tailorExp || "Tailor your sanctuary experience."}
                        </p>
                    </div>
                    <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Settings Content with Extra Padding at bottom for dropdowns */}
                <div className="space-y-6 pb-4">
                    {/* CUSTOM LANGUAGE DROPDOWN */}
                    <div className="space-y-3 relative z-20">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 pl-1">
                            <Globe size={12} className="text-indigo-400" /> {t.language || "Language"}
                        </label>
                        
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className={`w-full flex items-center justify-between bg-white/60 hover:bg-white/90 border transition-all duration-300 text-slate-700 text-sm font-medium py-3.5 pl-5 pr-4 rounded-2xl shadow-sm outline-none ${isLangOpen ? "border-indigo-300 ring-4 ring-indigo-50/50" : "border-slate-200 hover:border-indigo-200"}`}
                            >
                                <span>{selectedLangLabel}</span>
                                <ChevronDown size={18} strokeWidth={2.5} className={`text-slate-400 transition-transform duration-300 ${isLangOpen ? "rotate-180 text-indigo-500" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isLangOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsLangOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute z-20 top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl overflow-hidden max-h-[200px] overflow-y-auto custom-scrollbar"
                                        >
                                            <div className="p-1.5 space-y-0.5">
                                                {LANGUAGES.map((lang) => {
                                                    const isSelected = language === lang.value;
                                                    return (
                                                        <button
                                                            key={lang.value}
                                                            onClick={() => {
                                                                setLanguage(lang.value);
                                                                setIsLangOpen(false);
                                                            }}
                                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${isSelected ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                                                        >
                                                            <span>{lang.label}</span>
                                                            {isSelected && <Check size={16} className="text-indigo-500" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Culture Selector Component */}
                    <div className="relative z-10">
                        <CultureSelector culture={culture} setCulture={setCulture} />
                    </div>

                    <div className="pt-2 relative z-0">
                        <button 
                            onClick={saveSettings}
                            className="w-full bg-slate-800 text-white rounded-2xl py-4 font-medium hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
                        >
                            {t.saveChanges || "Save Changes"}
                        </button>
                    </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #CBD5E1; border-radius: 4px; }
      `}</style>
    </div>
  );
}

export default Landing;