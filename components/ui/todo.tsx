import type { ReactNode } from "react";
import { isTodo } from "@/lib/todo";

/**
 * A visible placeholder for missing facts. In MDX: <Todo>owner's role</Todo>.
 * Any TODO fails the production build (scripts/check-content.mts).
 */
export function Todo({ children }: { children: ReactNode }) {
  return (
    <aside data-todo className="todo rounded-card border border-dashed px-stack-m py-stack-s text-step--1">
      <strong className="font-mono">TODO:</strong> {children}
    </aside>
  );
}

/** Renders a frontmatter value, highlighting it when it's a TODO placeholder. */
export function Val({ v }: { v: string | number }) {
  return isTodo(v) ? (
    <mark data-todo className="todo rounded-sm px-1">
      {v}
    </mark>
  ) : (
    <>{v}</>
  );
}
