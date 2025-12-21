import { EMOTIONS } from "./emotions";

export function dailyEmotionalDrift(entries) {
  if (!entries || entries.length === 0) return null;

  const counts = {};
  entries.forEach(e => {
    if (!e.emotion || !EMOTIONS[e.emotion]) return;
    counts[e.emotion] = (counts[e.emotion] || 0) + 1;
  });

  const list = Object.entries(counts);
  if (list.length === 0) return null;

  list.sort((a, b) => b[1] - a[1]);
  const dominant = list[0][0];

  if (list.length === 1) {
    return `Today’s reflections centered around ${EMOTIONS[dominant].label.toLowerCase()}.`;
  }

  const secondary = list[1][0];
  return `Your thoughts today moved between ${EMOTIONS[dominant].label.toLowerCase()} and ${EMOTIONS[secondary].label.toLowerCase()}.`;
}
