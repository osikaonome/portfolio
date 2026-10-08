import type { ReactNode } from "react";
import { slugify } from "@/lib/toc";

/** Consistent spacing and an anchored heading. Feeds the table of contents. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = slugify(title);
  return (
    <section aria-labelledby={id} className="scroll-mt-24 [&>*+*]:mt-stack-m">
      <h2 id={id} className="group">
        <a href={`#${id}`} className="no-underline! text-fg!">
          {title}
          <span aria-hidden className="ml-2 text-muted opacity-0 transition-opacity group-hover:opacity-100">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  );
}
