import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import {
  labSchema,
  projectSchema,
  writingSchema,
  type Article,
  type LabEntry,
  type Project,
} from "@/content/schema";
import { BODY_TODO_RE, findTodos, todosAllowed } from "@/lib/todo";
import { extractHeadings, type Heading } from "@/lib/toc";

// The content layer: every entry is a folder containing `index.mdx` plus its
// assets. Frontmatter is validated with Zod; any invalid file throws, which
// fails `next build`.

export const CONTENT_DIR = path.join(process.cwd(), "content");

export type Collection = "work" | "lab" | "writing";

export type Entry<T> = {
  data: T;
  body: string;
  headings: Heading[];
  collection: Collection;
  /** Repo-relative path of the MDX file, for inspect mode and error messages. */
  file: string;
};

const schemas = {
  work: projectSchema,
  lab: labSchema,
  writing: writingSchema,
} satisfies Record<Collection, z.ZodType>;

type DataOf = { work: Project; lab: LabEntry; writing: Article };

const memo = new Map<Collection, Entry<unknown>[]>();

function load<C extends Collection>(collection: C): Entry<DataOf[C]>[] {
  const cached = memo.get(collection);
  if (cached && process.env.NODE_ENV !== "development") {
    return cached as Entry<DataOf[C]>[];
  }

  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];

  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const file = path.join(dir, d.name, "index.mdx");
      const relative = path.relative(process.cwd(), file);
      if (!fs.existsSync(file)) {
        throw new Error(`[content] ${collection}/${d.name} has no index.mdx`);
      }
      const { data, content } = matter(fs.readFileSync(file, "utf8"));
      const parsed = schemas[collection].safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.issues
          .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
          .join("\n");
        throw new Error(`[content] Invalid frontmatter in ${relative}\n${issues}`);
      }
      if (parsed.data.slug !== d.name) {
        throw new Error(
          `[content] ${relative}: slug "${parsed.data.slug}" must match its folder name "${d.name}"`,
        );
      }
      // Backstop for builds that skip `npm run build`'s content check.
      if (process.env.NODE_ENV === "production" && !todosAllowed()) {
        const todos = [...findTodos(data), ...(content.match(BODY_TODO_RE) ? ["body"] : [])];
        if (todos.length) {
          throw new Error(`[content] ${relative} still has TODOs (${todos.join(", ")}). Fill them in, or set ALLOW_TODOS=1 for a non-production build.`);
        }
      }
      return {
        data: parsed.data,
        body: content,
        headings: extractHeadings(content),
        collection,
        file: relative,
      };
    });

  memo.set(collection, entries);
  return entries as unknown as Entry<DataOf[C]>[];
}

// ---------- Projects ----------

/** Featured first (by `order`), then newest first, archived last. */
function compareProjects(a: Project, b: Project) {
  const archived = Number(a.status === "archived") - Number(b.status === "archived");
  if (archived !== 0) return archived;
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  const order = (a.order ?? Infinity) - (b.order ?? Infinity);
  if (order !== 0 && Number.isFinite(order)) return order;
  const year = (p: Project) => (typeof p.year === "number" ? p.year : 0);
  if (year(a) !== year(b)) return year(b) - year(a);
  return a.title.localeCompare(b.title);
}

export function getProjects(): Entry<Project>[] {
  return [...load("work")].sort((a, b) => compareProjects(a.data, b.data));
}

export function getFeaturedProjects() {
  return getProjects().filter((p) => p.data.featured);
}

/** NDA and `depth: card` projects have a card but no case study page. */
export function hasCaseStudy(project: Project) {
  return project.status !== "nda" && project.depth !== "card";
}

export function getProject(slug: string) {
  return getProjects().find((p) => p.data.slug === slug);
}

/** Previous / next among projects that have a case study, wrapping around. */
export function getAdjacentProjects(slug: string) {
  const list = getProjects().filter((p) => hasCaseStudy(p.data));
  const i = list.findIndex((p) => p.data.slug === slug);
  if (i === -1 || list.length < 2) return { prev: undefined, next: undefined };
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}

export function getAllTags() {
  return [...new Set(getProjects().flatMap((p) => p.data.tags))].sort();
}

// ---------- Lab & writing ----------

export function getLabEntries(): Entry<LabEntry>[] {
  return [...load("lab")].sort((a, b) => +b.data.date - +a.data.date);
}

export function getLabEntry(slug: string) {
  return getLabEntries().find((e) => e.data.slug === slug);
}

export function getArticles(): Entry<Article>[] {
  return [...load("writing")]
    .filter((a) => process.env.NODE_ENV === "development" || !a.data.draft)
    .sort((a, b) => +b.data.date - +a.data.date);
}

export function getArticle(slug: string) {
  return getArticles().find((a) => a.data.slug === slug);
}

// ---------- Assets ----------

/** Absolute path on disk for an asset referenced from an entry's MDX. */
/** "system" holds demo assets for the /system page. */
export type AssetCollection = Collection | "system";

export function assetPath(collection: AssetCollection, slug: string, src: string) {
  return path.join(CONTENT_DIR, collection, slug, src);
}

/** Public URL for an asset; files are copied to /public/content by scripts/sync-assets.ts. */
export function assetUrl(collection: AssetCollection, slug: string, src: string) {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
  return `/content/${collection}/${slug}/${src}`;
}
