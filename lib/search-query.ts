// Client-safe: no fs imports. Used by the command palette and unit tests.

export type SearchItem = {
  type: "Page" | "Project" | "Lab" | "Writing";
  title: string;
  summary: string;
  href: string;
  keywords: string[];
};

/** Small ranked substring search: title matches beat keyword and summary matches. */
export function searchItems(items: SearchItem[], query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return items;
  return items
    .map((item) => {
      const title = item.title.toLowerCase();
      const keywords = item.keywords.join(" ").toLowerCase();
      const summary = item.summary.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (title.startsWith(t)) score += 6;
        else if (title.includes(t)) score += 4;
        else if (keywords.includes(t)) score += 2;
        else if (summary.includes(t)) score += 1;
        else return { item, score: 0 };
      }
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}
