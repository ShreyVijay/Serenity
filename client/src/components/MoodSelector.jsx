import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { EMOTIONS } from "../utils/emotions";

function MoodSelector({ emotion, setEmotion }) {
  return (
    <div className="flex flex-wrap gap-3">
      {Object.entries(EMOTIONS).map(([key, e]) => {
        const isSelected = emotion === key;

        return (
          <motion.button
            key={key}
            onClick={() => setEmotion(key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            // Added cursor-pointer here
            className={`
              cursor-pointer relative px-5 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300
              ${isSelected 
                ? "shadow-md ring-2 ring-offset-2 ring-slate-200 ring-offset-white font-medium opacity-100 translate-y-[-2px]" 
                : "hover:shadow-sm opacity-70 hover:opacity-100 border border-transparent hover:bg-opacity-90"
              }
            `}
            style={{ 
              backgroundColor: e.color, 
              color: "#334155" 
            }}
          >
            {/* Emoji */}
            <span className="text-xl filter drop-shadow-sm select-none">
                {e.emoji}
            </span>
            
            {/* Label */}
            <span className="text-sm tracking-wide select-none">
                {e.label}
            </span>

            {/* Selection Indicator */}
            {isSelected && (
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full text-emerald-500 flex items-center justify-center shadow-sm border border-slate-50"
               >
                 <Check size={12} strokeWidth={4} />
               </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export default MoodSelector;