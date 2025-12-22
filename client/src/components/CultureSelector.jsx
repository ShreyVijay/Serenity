function CultureSelector({ culture, setCulture }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">
        Language & Cultural Tone
      </label>

      <select
        value={culture}
        onChange={(e) => setCulture(e.target.value)}
        className="w-full p-2 border rounded bg-white"
      >
        <option value="neutral">Neutral / Global</option>
        <option value="indian">Indian (family & society aware)</option>
        <option value="east-asian">East Asian (reserved, duty-oriented)</option>
        <option value="middle-eastern">Middle Eastern (respectful, collective)</option>
        <option value="western">Western (direct, individual-focused)</option>
        <option value="latin">Latin (expressive, relational)</option>
        <option value="african">African (community-centered)</option>
      </select>
    </div>
  );
}

export default CultureSelector;
