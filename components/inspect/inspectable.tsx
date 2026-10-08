import type { ElementType, ReactNode } from "react";

/**
 * Opts an element into inspect mode. Costs one data attribute; the overlay
 * that reads it is only downloaded when inspect mode is switched on.
 * Annotation text lives in content/inspect/<id>.mdx, not here.
 */
export function Inspectable({
  id,
  as: Tag = "div",
  className,
  children,
}: {
  id: string;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag data-inspect={id} className={className}>
      {children}
    </Tag>
  );
}
