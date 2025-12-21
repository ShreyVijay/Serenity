export async function resolveHelpline({ country, culture }) {
  if (!country) return null;

  try {
    const res = await fetch(
      `https://findahelpline.com/${country.toLowerCase()}`,
      {
        headers: {
          "User-Agent": "Serenity-App",
        },
      }
    );

    if (!res.ok) return null;

    const html = await res.text();

    // Minimal parsing strategy:
    // We DO NOT scrape aggressively.
    // We only extract the primary helpline block.

    const phoneMatch = html.match(/tel:\+?[\d\s\-()]+/);
    const nameMatch = html.match(/<h2[^>]*>(.*?)<\/h2>/);

    if (!phoneMatch || !nameMatch) return null;

    return {
      name: nameMatch[1].replace(/<[^>]+>/g, ""),
      phone: phoneMatch[0].replace("tel:", ""),
      country,
      culture,
    };
  } catch {
    return null;
  }
}
