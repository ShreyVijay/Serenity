import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

function Landing() {
  const { session, clearSession } = useSession();
  const navigate = useNavigate();

  async function clearAll() {
    try {
      await fetch(
        `http://localhost:5000/session/${session.sessionId}`,
        { method: "DELETE" }
      );
    } catch (e) {
      console.error("Backend delete failed, clearing locally anyway");
    }

    clearSession();
    navigate("/welcome");
  }

  return (
    <div>
      <h1>Serenity</h1>

      <button onClick={() => navigate("/journal")}>Journal</button>
      <button onClick={() => navigate("/checkin")}>Daily Check-in</button>
      <button onClick={() => navigate("/calendar")}>Calendar</button>

      <hr />

      <button onClick={clearAll}>Clear All Data</button>
    </div>
  );
}

export default Landing;
