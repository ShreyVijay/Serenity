import { EMOTIONS } from "../utils/emotions";

function MoodSelector({ emotion, setEmotion }) {
  return (
    <div className="space-y-2">
      <p className="font-medium">How are you feeling?</p>

      <div className="flex flex-wrap gap-3">
        {Object.entries(EMOTIONS).map(([key, e]) => (
          <button
            key={key}
            onClick={() => setEmotion(key)}
            className={`px-4 py-2 rounded border flex items-center gap-2
              ${emotion === key ? "ring-2 ring-slate-900" : ""}
            `}
            style={{ backgroundColor: e.color }}
          >
            <span className="text-lg">{e.emoji}</span>
            <span>{e.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodSelector;
