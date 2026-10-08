import type { Heading } from "@/lib/toc";

/** Built from <Section> titles. Collapsible on mobile, always open on desktop. */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  const list = (
    <ol className="mt-stack-xs space-y-1 text-step--1">
      {headings.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`} className="tap inline-flex items-center text-muted hover:text-fg">
            {h.title}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <nav aria-label="On this page">
      <details className="rounded-card border border-border p-stack-s lg:hidden">
        <summary className="tap flex cursor-pointer items-center font-semibold">On this page</summary>
        {list}
      </details>
      <div className="hidden lg:block">
        <p className="eyebrow">On this page</p>
        {list}
      </div>
    </nav>
  );
}
