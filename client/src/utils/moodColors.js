export function getMoodColor(mood) {
  switch (mood) {
    case 1:
      return "bg-red-200";
    case 2:
      return "bg-orange-200";
    case 3:
      return "bg-yellow-200";
    case 4:
      return "bg-green-200";
    case 5:
      return "bg-emerald-300";
    default:
      return "bg-slate-100";
  }
}
