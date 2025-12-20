function MoodSelector({ mood, setMood }) {
  const moods = [
    { label: "Very Low", value: 1 },
    { label: "Low", value: 2 },
    { label: "Neutral", value: 3 },
    { label: "Good", value: 4 },
    { label: "Very Good", value: 5 },
  ];

  return (
    <div>
      <p>Mood</p>
      {moods.map((m) => (
        <button
          key={m.value}
          onClick={() => setMood(m.value)}
          style={{
            fontWeight: mood === m.value ? "bold" : "normal",
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

export default MoodSelector;
