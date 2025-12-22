export function moodToColor(mood) {
  switch (mood) {
    case 1: return "#fecaca"; // red-200
    case 2: return "#fed7aa"; // orange-200
    case 3: return "#fef08a"; // yellow-200
    case 4: return "#bbf7d0"; // green-200
    case 5: return "#6ee7b7"; // emerald-300
    default: return "#e5e7eb"; // slate-200
  }
}
