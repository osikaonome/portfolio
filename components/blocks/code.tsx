import type { ReactElement, ReactNode } from "react";
import { highlight } from "@/lib/highlight";

/** Fenced code blocks in MDX (```ts … ```), highlighted at build time. */
export async function Pre({ children }: { children?: ReactNode }) {
  const code = children as ReactElement<{ className?: string; children?: string }>;
  const lang = code?.props?.className?.replace("language-", "") || "text";
  const html = await highlight(String(code?.props?.children ?? ""), lang);
  return <div className="not-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Before/after code. Side by side when its container is wide; each scrolls horizontally. */
export async function CodeCompare({
  before,
  after,
  lang = "tsx",
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  before: string;
  after: string;
  lang?: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [b, a] = await Promise.all([highlight(before, lang), highlight(after, lang)]);
  return (
    <div className="@container">
      <div className="grid gap-stack-s @3xl:grid-cols-2">
        {[
          [beforeLabel, b],
          [afterLabel, a],
        ].map(([label, html]) => (
          <figure key={label} className="min-w-0">
            <figcaption className="eyebrow mb-stack-2xs">{label}</figcaption>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </figure>
        ))}
      </div>
    </div>
  );
}
