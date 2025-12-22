import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Leaf, 
  Settings, 
  X, 
  BookOpen, 
  CalendarDays, 
  Activity, 
  ChevronRight,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { useText } from "../i18n/useText";
import CultureSelector from "../components/CultureSelector";

function Landing() {
  const t = useText();
  const [showSettings, setShowSettings] = useState(false);

  // State for settings (loaded from local storage)
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
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-b from-sky-100 via-emerald-50 to-slate-100 font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      
      {/* Ambient Background - Responsive sizes */}
      <div className="absolute top-[-20%] left-[-10%] w-[80%] md:w-[60%] h-[60%] bg-white/40 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] md:w-[50%] h-[50%] bg-sky-200/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />

      {/* Top Controls (Personalize Button) */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
        <button 
          onClick={() => setShowSettings(true)}
          className="group flex items-center gap-2.5 px-5 py-2.5 bg-white/70 hover:bg-white rounded-full transition-all shadow-sm border border-white/60 backdrop-blur-md hover:shadow-md hover:scale-[1.02] active:scale-95"
        >
          <Sparkles size={16} className="text-indigo-500 group-hover:text-indigo-600 group-hover:rotate-12 transition-all duration-500" />
          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 tracking-wide">Personalize</span>
        </button>
      </div>

      {/* Main Content Dashboard */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 py-16 md:py-20 flex flex-col"
      >
        
        {/* LOGO SPACE & HEADER */}
        <motion.div variants={cardVariants} className="flex flex-col items-center text-center mb-10 md:mb-12">
            
            {/* LOGO */}
            {/* Note: Ensure 'logo.png' is inside your 'client/public' folder */}
            <div className="w-32 h-32 md:w-28 md:h-28 mb-6 rounded-full flex items-center justify-centerbackdrop-blur-sm overflow-hidden p-1">
                 <img 
                    src="/logo.png" 
                    alt="Serenity" 
                    className="w-full h-full object-contain rounded-full opacity-90 hover:scale-105 transition-transform duration-500" 
                 />
            </div>

            <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
                {t.landingTitle || "Serenity"}
            </h1>
            <p className="text-slate-500 max-w-md text-base md:text-lg font-light leading-relaxed px-4">
                {t.landingSubtitle || "Where would you like to begin today?"}
            </p>
        </motion.div>

        {/* Action Grid - Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-12">
            
            {/* Primary Card: Journal (Span 7/12 on Desktop, Full on Mobile) */}
            <motion.div variants={cardVariants} className="md:col-span-7 h-full">
                <Link to="/journal" className="group block h-full">
                    <div className="relative h-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] hover:bg-white/90 overflow-hidden">
                        <div className="relative z-10 flex flex-col h-full justify-between min-h-[180px] md:min-h-[220px]">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-medium text-slate-800 mb-1">Journal</h2>
                                    <p className="text-slate-500 leading-relaxed text-sm md:text-base">Unload your thoughts. <br/>Reflect with gentle guidance.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-indigo-600 font-medium mt-6 group-hover:translate-x-1 transition-transform">
                                Write Entry <ChevronRight size={18} />
                            </div>
                        </div>
                        {/* Decorative Blob */}
                        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-indigo-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100/50 transition-colors" />
                    </div>
                </Link>
            </motion.div>

            {/* Secondary Column (Span 5/12 on Desktop) */}
            <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
                
                {/* Check-in Card */}
                <motion.div variants={cardVariants} className="flex-1">
                    <Link to="/checkin" className="group block h-full">
                        <div className="relative h-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] md:rounded-[2.5rem] p-6 transition-all hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] hover:bg-white/90 overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <Activity size={20} strokeWidth={1.5} />
                                </div>
                            </div>
                            <h2 className="text-xl font-medium text-slate-800 mb-1">Daily Check-in</h2>
                            <p className="text-sm text-slate-500 mb-2">Track your mood & energy.</p>
                            <div className="absolute bottom-6 right-6 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 hidden md:block">
                                <ChevronRight size={24} />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Calendar Card */}
                <motion.div variants={cardVariants} className="flex-1">
                    <Link to="/calendar" className="group block h-full">
                        <div className="relative h-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] md:rounded-[2.5rem] p-6 transition-all hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] hover:bg-white/90 overflow-hidden">
                             <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                    <CalendarDays size={20} strokeWidth={1.5} />
                                </div>
                            </div>
                            <h2 className="text-xl font-medium text-slate-800 mb-1">Calendar</h2>
                            <p className="text-sm text-slate-500">View your journey.</p>
                            <div className="absolute bottom-6 right-6 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 hidden md:block">
                                <ChevronRight size={24} />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </div>

        {/* Footer */}
        <motion.p variants={cardVariants} className="mt-auto pt-4 text-center text-xs text-slate-400 font-medium tracking-wide">
            Your space. Your pace.
        </motion.p>
      </motion.div>

      {/* Settings Modal - Centered and Responsive */}
      <AnimatePresence>
        {showSettings && (
          <>
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSettings(false)}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />
            {/* Modal */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl z-50 p-8 border border-white/60"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Personalize</h3>
                        <p className="text-xs text-slate-500 mt-1">Tailor your sanctuary experience.</p>
                    </div>
                    <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Language */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 pl-1">
                            <Globe size={12} className="text-indigo-400" /> Language
                        </label>
                        <div className="relative group">
                            <select 
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full appearance-none bg-white/60 hover:bg-white/90 border border-slate-200 hover:border-indigo-200 text-slate-700 text-sm font-medium py-3.5 pl-5 pr-10 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer outline-none focus:ring-4 focus:ring-indigo-50/50"
                            >
                                <option value="en">English</option>
                                <option value="hi">Hindi (हिंदी)</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                                <ChevronDown size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>

                    {/* Culture Selector Component */}
                    <CultureSelector culture={culture} setCulture={setCulture} />

                    <div className="pt-2">
                        <button 
                            onClick={saveSettings}
                            className="w-full bg-slate-800 text-white rounded-2xl py-4 font-medium hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Landing;