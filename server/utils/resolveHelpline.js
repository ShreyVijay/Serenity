export async function resolveHelpline({ country, culture }) {
  // DEV fallback so it works locally
  if (!country && process.env.NODE_ENV !== "production") {
    country = "IN";
  }

  if (!country) return null;

  try {
    const res = await fetch(
      `https://findahelpline.com/${country.toLowerCase()}`,
      { headers: { "User-Agent": "Serenity-App" } }
    );

    if (!res.ok) return null;

    const html = await res.text();

    const phoneMatch = html.match(/tel:\+?[\d\s\-()]+/);
    const nameMatch = html.match(/<h2[^>]*>(.*?)<\/h2>/);

    if (!phoneMatch || !nameMatch) return null;

    return {
  name: nameMatch[1].replace(/<[^>]+>/g, ""),
  phone: phoneMatch[0].replace("tel:", ""),
  website: `https://findahelpline.com/${country.toLowerCase()}`,
  country,
  culture,
};

  } catch {
    return null;
  }
}
