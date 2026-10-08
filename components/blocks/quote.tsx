import type { ReactNode } from "react";

/** Client or user testimonial. Real, attributable quotes only. */
export function Quote({ children, cite, role }: { children: ReactNode; cite: string; role?: string }) {
  return (
    <figure className="border-l-0! pl-0!">
      <blockquote className="font-display text-step-2 leading-snug text-fg [&_p]:inline">
        “{children}”
      </blockquote>
      <figcaption className="mt-stack-xs text-step--1 text-muted">
        <span className="text-fg">{cite}</span>
        {role && <>, {role}</>}
      </figcaption>
    </figure>
  );
}
