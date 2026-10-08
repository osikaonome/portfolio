import { z } from "zod";

// Frontmatter schemas. An invalid file fails the build: the content loader
// parses every file during static generation and `npm run check:content`
// runs before `next build`.

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slugs are lowercase kebab-case");

const image = z.object({
  src: z.string(),
  alt: z.string().min(10, "Alt text must be at least 10 characters"),
});

/** A visible placeholder for a fact that isn't known yet. Fails production builds. */
const todo = z.string().regex(/^TODO\b/, 'Use a real value or a "TODO: …" placeholder');

const hexColour = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use a six-digit hex colour, e.g. #3355ff");

const base = z.object({
  title: z.string().max(60),
  slug,
  summary: z.string().max(160), // used for cards, meta and OG
  year: z.union([z.number().int(), todo]),
  role: z.array(z.string()).min(1),
  tags: z.array(z.string()),
  cover: image,
  featured: z.boolean().default(false),
  order: z.number().optional(), // manual sort for featured items
  status: z.union([z.enum(["live", "archived", "concept", "nda"]), todo]),
  // "card" projects get a compact card (summary, role, stack, link) and no case study page.
  depth: z.enum(["full", "card"]).default("full"),
  links: z
    .object({
      live: z.url().optional(),
      repo: z.url().optional(),
      figma: z.url().optional(),
    })
    .optional(),
  metrics: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .max(4)
    .optional(),
  // Both must pass WCAG AA against the page background (scripts/check-content.ts).
  // One colour can't pass on both light and dark backgrounds, hence accentDark.
  theme: z
    .object({
      accent: hexColour,
      accentDark: hexColour.optional(),
    })
    .optional(),
});

const engineering = base.extend({
  discipline: z.literal("engineering"),
  stack: z.array(z.string()).min(1),
  challenge: z.string().optional(),
});

const design = base.extend({
  discipline: z.literal("design"),
  tools: z.array(z.string()).min(1),
  deliverables: z.array(z.string()).min(1),
});

const both = base.extend({
  discipline: z.literal("both"),
  stack: z.array(z.string()).min(1),
  challenge: z.string().optional(),
  tools: z.array(z.string()).min(1),
  deliverables: z.array(z.string()).min(1),
});

export const projectSchema = z.discriminatedUnion("discipline", [
  engineering,
  design,
  both,
]);

export const labSchema = z.object({
  title: z.string().max(60),
  slug,
  summary: z.string().max(160),
  date: z.coerce.date(),
  tags: z.array(z.string()),
  cover: image.optional(),
});

export const writingSchema = z.object({
  title: z.string().max(80),
  slug,
  summary: z.string().max(160),
  date: z.coerce.date(),
  tags: z.array(z.string()),
  draft: z.boolean().default(false),
});

export const inspectNoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  source: z.string(), // repo-relative path
});

export type Project = z.infer<typeof projectSchema>;
export type Discipline = Project["discipline"];
export type LabEntry = z.infer<typeof labSchema>;
export type Article = z.infer<typeof writingSchema>;
export type InspectNote = z.infer<typeof inspectNoteSchema>;
