import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSession } from "../utils/session";

function Welcome() {
  const navigate = useNavigate();
  const [consent, setConsent] = useState(false);

  function submit() {
    if (!consent) return;
    createSession();
    navigate("/landing");
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Welcome to Serenity</h1>

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={consent}
          onChange={() => setConsent(!consent)}
        />
        <span>I understand this is not a medical service</span>
      </label>

      <button
        disabled={!consent}
        onClick={submit}
        className={`px-4 py-2 rounded text-white ${
          consent ? "bg-slate-900" : "bg-slate-400"
        }`}
      >
        Continue
      </button>
    </div>
  );
}

export default Welcome;
