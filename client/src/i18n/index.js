import { useState } from "react";
import { useSession } from "../context/SessionContext";

export default function Welcome() {
  const { initialize } = useSession();
  const [culture, setCulture] = useState("neutral");
  const [language, setLanguage] = useState("en");

  return (
    <div className="p-8 space-y-6 max-w-md mx-auto">
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
        <option value="es">Spanish</option>
        <option value="fr">French</option>
      </select>

      <button
        className="px-4 py-2 bg-slate-900 text-white rounded"
        onClick={() => initialize({ culture, language })}
      >
        Begin
      </button>
    </div>
  );
}
