function CultureSelector({ culture, setCulture }) {
  return (
    <div>
      <p>Language Tone</p>

      <label>
        <input
          type="radio"
          value="neutral"
          checked={culture === "neutral"}
          onChange={() => setCulture("neutral")}
        />
        Neutral
      </label>

      <label>
        <input
          type="radio"
          value="indian"
          checked={culture === "indian"}
          onChange={() => setCulture("indian")}
        />
        Indian
      </label>

      <label>
        <input
          type="radio"
          value="western"
          checked={culture === "western"}
          onChange={() => setCulture("western")}
        />
        Western
      </label>
    </div>
  );
}

export default CultureSelector;
