export type Heading = { id: string; title: string };

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The table of contents is built from `<Section title="…">` blocks, so the
 * TOC and the anchors rendered by <Section> always agree.
 */
export function extractHeadings(mdx: string): Heading[] {
  const headings: Heading[] = [];
  const re = /<Section\b[^>]*?\btitle=(?:"([^"]+)"|'([^']+)'|\{["'`]([^"'`]+)["'`]\})/g;
  for (const match of mdx.matchAll(re)) {
    const title = match[1] ?? match[2] ?? match[3];
    headings.push({ id: slugify(title), title });
  }
  return headings;
}
