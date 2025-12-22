const dangerKeywords = [
  "suicide",
  "kill myself",
  "self harm",
  "end my life",
  "die",
  "worthless",
  "hopeless",
];

export function hasDangerContent(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return dangerKeywords.some(word => lower.includes(word));
}
