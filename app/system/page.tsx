import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createBlocks } from "@/components/blocks";
import { Inspectable } from "@/components/inspect/inspectable";
import { TokenValue } from "@/components/system/token-value";
import { highlight } from "@/lib/highlight";
import { slugify } from "@/lib/toc";

export const metadata: Metadata = {
  title: "Design system",
  description: "The tokens, components and principles this site is built from, rendered live.",
  alternates: { canonical: "/system" },
};

const colors = ["--color-bg", "--color-surface", "--color-surface-2", "--color-fg", "--color-muted", "--color-border", "--color-accent", "--color-positive"];
const steps = ["--step-6", "--step-5", "--step-4", "--step-3", "--step-2", "--step-1", "--step-0", "--step--1"];
const space = ["--space-2xs", "--space-xs", "--space-s", "--space-m", "--space-l", "--space-xl", "--space-2xl", "--space-3xl"];
const radii = ["--radius-s", "--radius-m", "--radius-l"];
const motion = ["--duration-fast", "--duration-base", "--duration-slow", "--ease-out", "--ease-in-out"];

const principles = [
  ["Motion explains, never decorates", "Animation shows where something came from or went. If it doesn’t, it goes. Reduced motion is respected everywhere."],
  ["Mobile is the design, not the fallback", "Every component is designed at 360px first and earns its wider layouts through container queries."],
  ["Typography does the heavy lifting", "A calm, editorial base so the one generative moment and the work itself stand out."],
  ["Accessible by construction", "Alt text and contrast are enforced by the build. Every hover state has a tap or visible equivalent."],
];

// Demos use neutral assets from content/system/demo.
const B = createBlocks({ collection: "system", slug: "demo" });

type Doc = { name: string; group: "Shared" | "Engineering" | "Design"; purpose: string; usage: string; demo: ReactNode };

const docs: Doc[] = [
  { name: "Section", group: "Shared", purpose: "Consistent spacing and an anchored heading; feeds the table of contents.", usage: `<Section title="The problem">\n  Markdown content…\n</Section>`, demo: <B.Section title="Example section"><p>Sections become TOC entries automatically.</p></B.Section> },
  { name: "Callout", group: "Shared", purpose: "A highlighted insight or lesson learned.", usage: `<Callout tone="lesson">\n  Measure on a mid-range Android first.\n</Callout>`, demo: <B.Callout tone="lesson"><p>Measure on a mid-range Android first.</p></B.Callout> },
  { name: "Media", group: "Shared", purpose: "Image or video with caption. AVIF/WebP, blur placeholder, lazy loaded.", usage: `<Media src="screen.png" alt="…" caption="…" />`, demo: <B.Media src="landscape.jpg" alt="Example landscape image used to demonstrate the block" caption="A caption sits under the media." /> },
  { name: "Gallery", group: "Shared", purpose: "Grid when wide, swipeable carousel with position indicator when narrow.", usage: `<Gallery items={[{ src: "a.jpg", alt: "…" }]} />`, demo: <B.Gallery items={[{ src: "landscape.jpg", alt: "Example image one, blue gradient" }, { src: "landscape-2.jpg", alt: "Example image two, orange gradient" }, { src: "landscape-3.jpg", alt: "Example image three, green gradient" }]} /> },
  { name: "DeviceFrame", group: "Shared", purpose: "Desktop and mobile screenshots side by side.", usage: `<DeviceFrame desktop={{ src, alt }} mobile={{ src, alt }} />`, demo: <B.DeviceFrame desktop={{ src: "landscape.jpg", alt: "Example desktop screenshot" }} mobile={{ src: "portrait.png", alt: "Example mobile screenshot" }} /> },
  { name: "Timeline", group: "Shared", purpose: "Project phases or process steps.", usage: `<Timeline items={[{ label: "Week 1", title: "Discovery" }]} />`, demo: <B.Timeline items={[{ label: "Week 1", title: "Discovery", body: "Interviews and audit." }, { label: "Week 3", title: "Prototype" }, { label: "Week 6", title: "Ship" }]} /> },
  { name: "Quote", group: "Shared", purpose: "A client or user testimonial. Real, attributable quotes only.", usage: `<Quote cite="Name" role="Title, Company">…</Quote>`, demo: <B.Quote cite="Name" role="Role, organisation">Format example only. Real, attributed quotes are used in case studies.</B.Quote> },
  { name: "MetricRow", group: "Engineering", purpose: "Before/after numbers.", usage: `<MetricRow items={[{ label: "LCP", before: "3.1s", value: "1.2s" }]} />`, demo: <B.MetricRow items={[{ label: "LCP", before: "3.1s", value: "1.2s" }, { label: "JS", before: "310 KB", value: "96 KB" }]} /> },
  { name: "DecisionLog", group: "Engineering", purpose: "Decision → options → choice → trade-off.", usage: `<DecisionLog decision="…" options={["…"]} choice="…" tradeoff="…" />`, demo: <B.DecisionLog decision="Where should search run?" options={["Hosted search service", "Build-time static index"]} choice="Build-time static index" tradeoff="Index size grows with content; fine below a few hundred entries." /> },
  { name: "ArchitectureDiagram", group: "Engineering", purpose: "SVG or image diagram; tap to open full-screen with pinch zoom on mobile.", usage: `<ArchitectureDiagram src="diagram.svg" alt="…" />`, demo: <B.ArchitectureDiagram src="landscape-3.jpg" alt="Example image standing in for a system diagram" /> },
  { name: "CodeCompare", group: "Engineering", purpose: "Before/after code; scrolls horizontally inside its container.", usage: "<CodeCompare lang=\"ts\" before={`…`} after={`…`} />", demo: <B.CodeCompare lang="ts" before={`const data = await fetch(url).then(r => r.json())`} after={`const data = await fetch(url, { next: { revalidate: 3600 } }).then(r => r.json())`} /> },
  { name: "LiveDemo", group: "Engineering", purpose: "Lazy interactive embed; static poster until tapped on mobile.", usage: `<LiveDemo src="https://…" title="…" poster="poster.jpg" posterAlt="…" />`, demo: <B.LiveDemo src="https://example.com" title="Example embed" poster="landscape.jpg" posterAlt="Example poster image for a live demo" /> },
  { name: "BeforeAfter", group: "Design", purpose: "Draggable comparison slider, touch and keyboard operable.", usage: `<BeforeAfter before={{ src, alt }} after={{ src, alt }} />`, demo: <B.BeforeAfter before={{ src: "landscape-2.jpg", alt: "Example before state, orange" }} after={{ src: "landscape.jpg", alt: "Example after state, blue" }} /> },
  { name: "Palette", group: "Design", purpose: "Colour swatches with hex values and contrast ratios.", usage: `<Palette colors={[{ name: "Ink", hex: "#161614" }]} />`, demo: <B.Palette colors={[{ name: "Ink", hex: "#161614" }, { name: "Paper", hex: "#fbfaf7" }, { name: "Signal", hex: "#2f4bd8" }]} /> },
  { name: "TypeSpecimen", group: "Design", purpose: "Typeface showcase with weights and scale.", usage: `<TypeSpecimen name="Instrument Serif" family="var(--font-display)" />`, demo: <B.TypeSpecimen name="Instrument Serif" family="var(--font-display)" weights={[400]} /> },
  { name: "Iterations", group: "Design", purpose: "Sequence of explorations ending in the final design.", usage: `<Iterations items={[{ src, alt, label }]} />`, demo: <B.Iterations items={[{ src: "landscape-2.jpg", alt: "Example exploration one", label: "Sketch" }, { src: "landscape-3.jpg", alt: "Example exploration two", label: "Direction" }, { src: "landscape.jpg", alt: "Example final design", label: "Refined" }]} /> },
  { name: "PrototypeEmbed", group: "Design", purpose: "Figma or video prototype; click to load.", usage: `<PrototypeEmbed src="https://www.figma.com/proto/…" title="…" poster="…" posterAlt="…" />`, demo: <B.PrototypeEmbed src="https://example.com" title="Example prototype" poster="landscape-3.jpg" posterAlt="Example poster image for a prototype" /> },
];

export default async function SystemPage() {
  const usage = await Promise.all(docs.map((d) => highlight(d.usage, "tsx")));

  return (
    <div className="container-page pt-stack-l md:pt-stack-2xl">
      <h1 className="font-display text-step-5">Design system</h1>
      <p className="mt-stack-xs max-w-[56ch] text-step-1 text-muted">
        Every token and block this site uses, rendered live. Values update when you switch theme.
      </p>

      <nav aria-label="On this page" className="mt-stack-l flex flex-wrap gap-2 text-step--1">
        {["Principles", "Colour", "Type", "Space", "Shape & motion", "Components"].map((s) => (
          <a key={s} href={`#${slugify(s)}`} className="tap inline-flex items-center rounded-full border border-border px-3 hover:border-fg">
            {s}
          </a>
        ))}
      </nav>

      <SystemSection title="Principles">
        <ul className="grid gap-stack-m md:grid-cols-2">
          {principles.map(([title, body]) => (
            <li key={title} className="rounded-card border border-border p-stack-m">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </SystemSection>

      <SystemSection title="Colour">
        <Inspectable id="tokens-colour">
          <ul className="grid grid-cols-2 gap-stack-s sm:grid-cols-4">
            {colors.map((c) => (
              <li key={c}>
                <div className="aspect-[3/2] rounded-card border border-border" style={{ background: `var(${c})` }} />
                <p className="mt-1 font-mono text-[0.75rem]">{c}</p>
                <TokenValue name={c} />
              </li>
            ))}
          </ul>
        </Inspectable>
      </SystemSection>

      <SystemSection title="Type">
        <p className="text-muted">Fluid scale using <code className="font-mono">clamp()</code>: sizes grow smoothly with the viewport instead of jumping at breakpoints.</p>
        <ul className="mt-stack-m space-y-stack-s">
          {steps.map((s) => (
            <li key={s} className="grid items-baseline gap-stack-s border-b border-border pb-stack-s md:grid-cols-[10rem_1fr]">
              <span className="font-mono text-[0.75rem] text-muted">{s}</span>
              <span className="truncate font-display leading-tight" style={{ fontSize: `var(${s})` }}>
                Calm, typographic, fast
              </span>
            </li>
          ))}
        </ul>
      </SystemSection>

      <SystemSection title="Space">
        <ul className="space-y-2">
          {space.map((s) => (
            <li key={s} className="grid grid-cols-[8rem_1fr] items-center gap-stack-s">
              <span className="font-mono text-[0.75rem] text-muted">{s}</span>
              <span className="h-3 rounded-sm bg-accent" style={{ width: `var(${s})` }} />
            </li>
          ))}
        </ul>
      </SystemSection>

      <SystemSection title="Shape & motion">
        <ul className="grid grid-cols-2 gap-stack-s sm:grid-cols-3">
          {radii.map((r) => (
            <li key={r}>
              <div className="aspect-square border-2 border-fg" style={{ borderRadius: `var(${r})` }} />
              <p className="mt-1 font-mono text-[0.75rem]">{r}</p>
              <TokenValue name={r} />
            </li>
          ))}
        </ul>
        <dl className="mt-stack-l grid grid-cols-[10rem_1fr] gap-y-1 font-mono text-[0.75rem]">
          {motion.map((m) => (
            <div key={m} className="contents">
              <dt>{m}</dt>
              <dd>
                <TokenValue name={m} />
              </dd>
            </div>
          ))}
        </dl>
      </SystemSection>

      <SystemSection title="Components">
        <p className="max-w-[60ch] text-muted">
          Blocks available in every project’s MDX. Assets are resolved relative to the project folder.
        </p>
        <div className="mt-stack-l space-y-section">
          {(["Shared", "Engineering", "Design"] as const).map((group) => (
            <div key={group}>
              <h3 className="eyebrow">{group} blocks</h3>
              <div className="mt-stack-m space-y-stack-2xl">
                {docs
                  .filter((d) => d.group === group)
                  .map((d) => {
                    const i = docs.indexOf(d);
                    return (
                      <article key={d.name} id={slugify(d.name)} className="scroll-mt-24 grid gap-stack-m lg:grid-cols-[18rem_minmax(0,1fr)]">
                        <div className="min-w-0">
                          <h4 className="font-mono text-step-0 font-semibold">&lt;{d.name}&gt;</h4>
                          <p className="mt-1 text-step--1 text-muted">{d.purpose}</p>
                          <div className="mt-stack-xs" dangerouslySetInnerHTML={{ __html: usage[i] }} />
                        </div>
                        <div className="prose min-w-0 rounded-panel border border-dashed border-border p-stack-m">{d.demo}</div>
                      </article>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </SystemSection>
    </div>
  );
}

function SystemSection({ title, children }: { title: string; children: ReactNode }) {
  const id = slugify(title);
  return (
    <section aria-labelledby={id} className="mt-section scroll-mt-24">
      <h2 id={id} className="mb-stack-m font-display text-step-4">
        {title}
      </h2>
      {children}
    </section>
  );
}
