/**
 * Build-time content checks. Runs before `next build` and in CI; any error
 * fails the build.
 *
 *   - frontmatter matches the schema, slugs match folders, no duplicates
 *   - alt text present and at least 10 characters (frontmatter and blocks)
 *   - project accent colours pass WCAG AA on light and dark backgrounds
 *   - cover images exist and aren't too large
 *   - every referenced asset exists
 *   - internal links point at real routes
 *   - only known blocks are used in MDX
 *   - no TODO placeholders remain (content, placeholder images, site config, CV),
 *     unless ALLOW_TODOS=1 (never on a Vercel production deploy)
 */
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { blockNames } from "@/components/blocks/names";
import { getInspectNotes } from "@/lib/inspect-notes";
import { AA, backgrounds, contrastRatio } from "@/lib/contrast";
import {
  CONTENT_DIR,
  getArticles,
  getLabEntries,
  getProjects,
  hasCaseStudy,
  type Collection,
  type Entry,
} from "@/lib/content";
import { cv } from "@/lib/cv";
import { nav, site } from "@/lib/site";
import { BODY_TODO_RE, findTodos, todosAllowed } from "@/lib/todo";

const MAX_COVER_BYTES = 600 * 1024;
const MAX_COVER_EDGE = 4000;
const MIN_COVER_WIDTH = 1200;
const MIN_ALT = 10;

const errors: string[] = [];
const fail = (file: string, msg: string) => errors.push(`${file}: ${msg}`);
const todos: string[] = [];
const todo = (file: string, msg: string) => todos.push(`${file}: ${msg}`);

// 1. Schema, slug and folder checks happen while loading.
let projects, lab, writing;
try {
  projects = getProjects();
  lab = getLabEntries();
  writing = getArticles();
  getInspectNotes();
} catch (e) {
  console.error(`\n✖ ${(e as Error).message}\n`);
  process.exit(1);
}

type AnyEntry = Entry<{ slug: string }>;
const all: AnyEntry[] = [...projects, ...lab, ...writing];

// 2. Duplicate slugs within a collection
for (const collection of ["work", "lab", "writing"] as Collection[]) {
  const seen = new Map<string, string>();
  for (const e of all.filter((e) => e.collection === collection)) {
    const prev = seen.get(e.data.slug);
    if (prev) fail(e.file, `duplicate slug "${e.data.slug}" (also in ${prev})`);
    seen.set(e.data.slug, e.file);
  }
}

// Known internal routes, for link checking
const routes = new Set<string>([
  ...nav.map((n) => n.href),
  ...projects.filter((p) => hasCaseStudy(p.data)).map((p) => `/work/${p.data.slug}`),
  ...lab.map((e) => `/lab/${e.data.slug}`),
  ...writing.map((e) => `/writing/${e.data.slug}`),
]);

const assetRe = /["'`]([^"'`\s]+\.(?:jpe?g|png|webp|avif|gif|svg|mp4|webm|mov))["'`]/gi;

for (const e of all) {
  const dir = path.join(CONTENT_DIR, e.collection, e.data.slug);
  const body = e.body;

  // TODOs in frontmatter and body
  for (const path of findTodos(e.data)) todo(e.file, `frontmatter ${path}`);
  const bodyTodos = body.match(BODY_TODO_RE)?.length ?? 0;
  if (bodyTodos) todo(e.file, `${bodyTodos} TODO${bodyTodos > 1 ? "s" : ""} in the body`);

  // 3. Referenced assets exist
  for (const [, src] of body.matchAll(assetRe)) {
    if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) continue;
    if (!fs.existsSync(path.join(dir, src))) fail(e.file, `missing asset "${src}"`);
  }

  // 4. Alt text in blocks: every { src: … } object and every src= attribute needs alt
  for (const [obj] of body.matchAll(/\{[^{}]*\bsrc:\s*["'][^"']+["'][^{}]*\}/g)) {
    const alt = /\balt:\s*["']([^"']*)["']/.exec(obj)?.[1];
    if (!alt || alt.length < MIN_ALT) fail(e.file, `alt text missing or shorter than ${MIN_ALT} characters in ${obj.slice(0, 60)}…`);
  }
  for (const [tag] of body.matchAll(/<(?:Media|ArchitectureDiagram)\b[^>]*>/g)) {
    const alt = /\balt=["']([^"']*)["']/.exec(tag)?.[1];
    if (!alt || alt.length < MIN_ALT) fail(e.file, `alt text missing or shorter than ${MIN_ALT} characters in ${tag.slice(0, 60)}…`);
  }
  for (const [tag] of body.matchAll(/<(?:LiveDemo|PrototypeEmbed)\b[^>]*>/g)) {
    const alt = /\bposterAlt=["']([^"']*)["']/.exec(tag)?.[1];
    if (!alt || alt.length < MIN_ALT) fail(e.file, `posterAlt missing or too short in ${tag.slice(0, 60)}…`);
  }
  for (const [, alt] of body.matchAll(/!\[([^\]]*)\]\(/g)) {
    if (alt.length < MIN_ALT) fail(e.file, `markdown image alt text shorter than ${MIN_ALT} characters`);
  }

  // 5. Internal links
  const links = [...body.matchAll(/\]\((\/[^)\s]*)\)/g), ...body.matchAll(/href=["'](\/[^"']*)["']/g)].map((m) => m[1]);
  for (const link of links) {
    const pathname = link.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    if (!routes.has(pathname)) fail(e.file, `broken internal link "${link}"`);
  }

  // 6. Unknown blocks (catches typos like <Galery>)
  const stripped = body.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
  for (const [, name] of stripped.matchAll(/<([A-Z][A-Za-z]*)\b/g)) {
    if (!(blockNames as readonly string[]).includes(name)) fail(e.file, `unknown block <${name}>`);
  }
}

// 7. Projects: covers and accent contrast
for (const p of projects) {
  const { cover, theme, slug } = p.data;
  if (/placeholder|todo/i.test(cover.src)) todo(p.file, `placeholder cover "${cover.src}": add the real cover`);
  const file = path.join(CONTENT_DIR, "work", slug, cover.src);
  if (!fs.existsSync(file)) {
    fail(p.file, `cover image "${cover.src}" not found`);
  } else {
    const bytes = fs.statSync(file).size;
    if (bytes > MAX_COVER_BYTES) fail(p.file, `cover is ${Math.round(bytes / 1024)} KB (max ${MAX_COVER_BYTES / 1024} KB)`);
    const { width = 0, height = 0 } = imageSize(fs.readFileSync(file));
    if (Math.max(width, height) > MAX_COVER_EDGE) fail(p.file, `cover is ${width}×${height} (max ${MAX_COVER_EDGE}px per edge)`);
    if (width < MIN_COVER_WIDTH) fail(p.file, `cover is ${width}px wide (min ${MIN_COVER_WIDTH}px)`);
  }

  if (theme) {
    const light = contrastRatio(theme.accent, backgrounds.light);
    const dark = contrastRatio(theme.accentDark ?? theme.accent, backgrounds.dark);
    if (light < AA) fail(p.file, `theme.accent ${theme.accent} is ${light.toFixed(2)}:1 on the light background (needs ${AA}:1)`);
    if (dark < AA)
      fail(p.file, `${theme.accentDark ? "theme.accentDark" : "theme.accent"} is ${dark.toFixed(2)}:1 on the dark background (needs ${AA}:1); set or adjust theme.accentDark`);
  }
}

// Site config and CV
for (const path of findTodos(site).filter((p) => !p.startsWith("positioningOptions"))) todo("lib/site.ts", path);
for (const path of findTodos(cv)) todo("lib/cv.ts", path);
if (process.env.VERCEL_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL && !process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  fail("env", "NEXT_PUBLIC_SITE_URL must be set to the production domain");
}

if (todos.length) {
  const list = todos.map((t) => `  - ${t}`).join("\n");
  if (todosAllowed()) {
    console.warn(`\n⚠ ${todos.length} TODOs remain (allowed because ALLOW_TODOS=1; a production deploy will fail):\n${list}\n`);
  } else {
    errors.push(...todos.map((t) => `TODO ${t}`));
  }
}

if (errors.length) {
  console.error(`\n✖ Content checks failed (${errors.length}):\n${errors.map((e) => `  - ${e}`).join("\n")}\n`);
  process.exit(1);
}
console.log(`✓ Content checks passed: ${projects.length} projects, ${lab.length} lab entries, ${writing.length} articles`);
