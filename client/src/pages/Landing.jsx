import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LANG_KEY = "serenity_language";
const CULTURE_KEY = "serenity_culture";

export default function Landing() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("en");
  const [culture, setCulture] = useState("neutral");

  useEffect(() => {
    const l = localStorage.getItem(LANG_KEY);
    const c = localStorage.getItem(CULTURE_KEY);
    if (l) setLanguage(l);
    if (c) setCulture(c);
  }, []);

  function continueFlow() {
    localStorage.setItem(LANG_KEY, language);
    localStorage.setItem(CULTURE_KEY, culture);
    navigate("/journal");
  }

  function clearAll() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-semibold">
          Serenity
        </h1>

        <p className="text-slate-600">
          A quiet place to notice how you feel.
        </p>

        <div className="space-y-3">
          <label className="block text-sm">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm">Cultural tone</label>
          <select
            value={culture}
            onChange={(e) => setCulture(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="neutral">Neutral</option>
            <option value="indian">Indian</option>
            <option value="western">Western</option>
            <option value="east-asian">East Asian</option>
            <option value="middle-eastern">Middle Eastern</option>
            <option value="latin">Latin</option>
            <option value="african">African</option>
          </select>
        </div>

        <button
          onClick={continueFlow}
          className="w-full bg-slate-900 text-white py-2 rounded"
        >
          Continue
        </button>

        <button
          onClick={clearAll}
          className="text-xs text-slate-500 underline"
        >
          Clear all data
        </button>
      </div>
    </div>
  );
}
