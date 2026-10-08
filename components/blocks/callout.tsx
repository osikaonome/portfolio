import type { ReactNode } from "react";

const labels = { insight: "Insight", lesson: "Lesson learned", note: "Note" } as const;

/** A highlighted insight or lesson learned. */
export function Callout({
  tone = "insight",
  title,
  children,
}: {
  tone?: keyof typeof labels;
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="rounded-card border-l-2 border-accent bg-surface px-stack-m py-stack-s [&>*+*]:mt-stack-xs">
      <p className="eyebrow text-accent!">{title ?? labels[tone]}</p>
      {children}
    </aside>
  );
}
