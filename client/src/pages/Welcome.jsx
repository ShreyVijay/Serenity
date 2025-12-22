import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

function Welcome() {
  const { createSession } = useSession();
  const navigate = useNavigate();

  const [culture, setCulture]  = useState("neutral");
  const [language, setLanguage] = useState("en");
  const [consent, setConsent] = useState(false);

  function submit() {
    if (!consent) return;

    createSession({ culture, language });
    navigate("/landing");
  }

  return (
    <div>
      <h1>Welcome to Serenity</h1>

      <select value={culture} onChange={(e) => setCulture(e.target.value)}>
        <option value="neutral">Neutral</option>
        <option value="indian">Indian</option>
        <option value="western">Western</option>
        <option value="east-asian">East Asian</option>
        <option value="middle-eastern">Middle Eastern</option>
        <option value="latin">Latin</option>
        <option value="african">African</option>
      </select>

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={consent}
          onChange={() => setConsent(!consent)}
        />
        I understand this is not a medical service
      </label>

      <button disabled={!consent} onClick={submit}>
        Continue
      </button>
    </div>
  );
}

export default Welcome;
