import { useNavigate } from "react-router-dom";
import { getSession, clearSession, createSession } from "../utils/session";

function Landing() {
  const navigate = useNavigate();
  const sessionId = getSession();

  function start() {
    if (!sessionId) createSession();
    navigate("/journal");
  }

  function reset() {
    clearSession();
    window.location.reload();
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Serenity</h1>

      <button
        onClick={start}
        className="px-4 py-2 rounded bg-slate-900 text-white"
      >
        Continue journaling
      </button>

      <button
        onClick={reset}
        className="text-sm underline text-slate-600"
      >
        Clear all data
      </button>
    </div>
  );
}

export default Landing;
