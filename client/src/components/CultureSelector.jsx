import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OPTIONS = [
  { value: "neutral", label: "Neutral / Global (Balanced)" },
  { value: "indian", label: "Indian (Warm, Family & Society aware)" },
  { value: "east-asian", label: "East Asian (Reserved, Duty-oriented)" },
  { value: "middle-eastern", label: "Middle Eastern (Respectful, Collective)" },
  { value: "western", label: "Western (Direct, Individual-focused)" },
  { value: "latin", label: "Latin (Expressive, Relational)" },
  { value: "african", label: "African (Community-centered)" },
];

function CultureSelector({ culture, setCulture }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find the label for the currently selected value
  const selectedLabel = OPTIONS.find((o) => o.value === culture)?.label || "Select Culture";

  return (
    <div className="space-y-3" ref={dropdownRef}>
      {/* Label */}
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 pl-1">
        <Globe size={12} className="text-indigo-400" />
        Language & Cultural Tone
      </label>

      {/* The Trigger Button (Replaces <select>) */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between
            bg-white/60 backdrop-blur-md hover:bg-white/90
            border transition-all duration-300
            text-slate-700 text-sm font-medium
            py-3.5 pl-5 pr-4
            rounded-2xl
            shadow-sm hover:shadow-md
            outline-none
            ${isOpen ? "border-indigo-300 ring-4 ring-indigo-50/50" : "border-slate-200 hover:border-indigo-200"}
          `}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown 
            size={18} 
            strokeWidth={2.5} 
            className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-500" : ""}`} 
          />
        </button>

        {/* The Custom Dropdown List (Replaces <option>) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar"
            >
              <div className="p-1.5 space-y-0.5">
                {OPTIONS.map((option) => {
                  const isSelected = culture === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setCulture(option.value);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${isSelected 
                          ? "bg-indigo-50 text-indigo-700" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && <Check size={16} className="text-indigo-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CultureSelector;