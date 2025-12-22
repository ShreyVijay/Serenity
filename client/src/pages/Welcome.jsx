import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSession } from "../utils/session";

export default function Welcome() {
  const navigate = useNavigate();
  const [culture, setCulture] = useState("neutral");
  const [language, setLanguage] = useState("en");
  const [consent, setConsent] = useState(false);

  function submit() {
    if (!consent) return;

    const sessionId = createSession();

    localStorage.setItem("serenity_onboarded", "true");
    localStorage.setItem("serenity_culture", culture);
    localStorage.setItem("serenity_language", language);

    navigate("/landing", { replace: true });
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to Serenity</h1>

      <select value={culture} onChange={e => setCulture(e.target.value)}>
        <option value="neutral">Neutral</option>
        <option value="indian">Indian</option>
        <option value="western">Western</option>
        <option value="east-asian">East Asian</option>
        <option value="middle-eastern">Middle Eastern</option>
        <option value="latin">Latin</option>
        <option value="african">African</option>
      </select>

      <select value={language} onChange={e => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={consent}
          onChange={() => setConsent(!consent)}
        />
        I understand this is not a medical service
      </label>

      <button
        disabled={!consent}
        onClick={submit}
        className="px-4 py-2 bg-slate-900 text-white rounded disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
