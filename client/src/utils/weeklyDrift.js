import { EMOTIONS } from "./emotions";

export function weeklyEmotionalDrift(checkins) {
  if (!checkins || checkins.length < 2) return null;

  const counts = {};

  checkins.forEach(c => {
    if (!c.emotion || !EMOTIONS[c.emotion]) return;
    counts[c.emotion] = (counts[c.emotion] || 0) + 1;
  });

  const entries = Object.entries(counts);
  if (entries.length === 0) return null;

  entries.sort((a, b) => b[1] - a[1]);
  const dominant = entries[0][0];

  if (entries.length === 1) {
    return `This week has mostly carried a sense of ${EMOTIONS[dominant].label.toLowerCase()}.`;
  }

  const secondary = entries[1][0];

  return `This week shows a mix of ${EMOTIONS[dominant].label.toLowerCase()} and ${EMOTIONS[secondary].label.toLowerCase()}.`;
}
