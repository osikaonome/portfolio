import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { inspectNoteSchema, type InspectNote } from "@/content/schema";
import { CONTENT_DIR } from "@/lib/content";
import { sourceUrl } from "@/lib/site";

export type InspectNotePayload = InspectNote & { html: string; sourceUrl: string | null };

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Notes are short, so they get a deliberately tiny Markdown subset
 * (paragraphs, `code`, **bold**, [links](…)) instead of shipping an MDX
 * runtime to the client.
 */
function renderNote(body: string) {
  return body
    .trim()
    .split(/\n{2,}/)
    .map((para) => {
      const html = escape(para.replace(/\n/g, " "))
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
      return `<p>${html}</p>`;
    })
    .join("");
}

export function getInspectNotes(): InspectNotePayload[] {
  const dir = path.join(CONTENT_DIR, "inspect");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      const parsed = inspectNoteSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`[content] Invalid inspect note content/inspect/${f}: ${parsed.error.message}`);
      }
      if (`${parsed.data.id}.mdx` !== f) {
        throw new Error(`[content] content/inspect/${f}: id must match the file name`);
      }
      return { ...parsed.data, html: renderNote(content), sourceUrl: sourceUrl(parsed.data.source) };
    });
}
