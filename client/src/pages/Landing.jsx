import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-xl">
        <h1 className="text-4xl font-semibold">Serenity</h1>
        <p className="text-slate-600">
          A quiet space to write, feel, and reflect.
        </p>
        <button
          onClick={() => navigate("/journal")}
          className="px-6 py-3 rounded bg-slate-900 text-white"
        >
          Start Journaling
        </button>
      </div>
    </div>
  );
}

export default Landing;
