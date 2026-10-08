# Portfolio

Personal portfolio built with Next.js 16 (App Router), MDX and a typed content layer. The site is its own case study: press **I** for inspect mode, **⌘K** to search, and see `/system` for the design system.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Sync content assets and start the dev server |
| `npm run build` | Sync assets, run content checks, then build (everything is statically generated) |
| `npm run check:content` | Validate all content (runs automatically before `build`) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | Playwright at mobile, tablet and desktop sizes, including axe checks. Needs `npm run build` first |
| `npm run test:visual` | Visual regression snapshots (`-- -u` to update baselines) |
| `npm run placeholders` | Regenerate placeholder images for the sample content (never overwrites) |

## Adding a project

Create one folder. Nothing else changes.

```
content/work/my-project/
  index.mdx      # frontmatter + body
  cover.jpg      # ≥1200px wide, ≤600 KB
  any-other-assets.png
```

Frontmatter is validated by `content/schema.ts` (Zod). `discipline` decides the required extras:

- `engineering`: `stack` (and optional `challenge`)
- `design`: `tools`, `deliverables`
- `both`: all of the above

Set `status: nda` to show a card with a "details on request" note and no case study page. `archived` projects are listed but de-emphasised. An optional `theme.accent` / `theme.accentDark` must pass WCAG AA against the light and dark backgrounds.

In the body, use the blocks documented on `/system`. Asset paths are relative to the project folder:

```mdx
<Section title="The problem">
  Markdown here.

  <Media src="screen.png" alt="Describe what the screenshot shows" />
</Section>
```

`<Section>` titles become the table of contents.

### Build-time checks

`scripts/check-content.mts` fails the build for: invalid frontmatter, slug/folder mismatch, duplicate slugs, alt text under 10 characters (frontmatter and blocks), accents failing AA contrast, missing/oversized covers, missing assets, broken internal links, and unknown block names.

## Structure

```
app/                  routes (all static), OG images, sitemap, search index and inspect-notes JSON
components/blocks/    MDX block library (shared, engineering, design)
components/inspect/   inspect mode (overlay is code-split; loads only when toggled)
components/palette/   command palette (code-split; loads on first open)
components/hero/      generative hero (Canvas 2D, time of day in Dublin)
content/              projects, lab, writing, inspect annotations, schema
lib/                  content layer, MDX rendering, images, search, tokens helpers
scripts/              asset sync, content checks, placeholder generator
tests/                unit (Vitest) and e2e (Playwright)
```

## Environment variables (Vercel)

| Variable | Needed for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, OG images and sitemap. Optional on Vercel, which falls back to the project's production domain |
| `RESEND_API_KEY` | Contact form. Without it the form tells visitors to email instead |
| `CONTACT_FROM` | Sender address on a domain verified in Resend (defaults to Resend's test sender, which only delivers to your Resend account email) |

## Before launch

- Add real project covers: replace each `content/work/<slug>/cover-placeholder.jpg`, then update `cover.src` and `cover.alt`. Production builds fail while placeholders remain (`npm run build:preview` skips this for previews).
- Set the environment variables above.
- Generate visual regression baselines on the CI image.
