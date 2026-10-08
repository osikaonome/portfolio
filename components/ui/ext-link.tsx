import type { ReactNode } from "react";
import { isTodo } from "@/lib/todo";
import { Val } from "./todo";

/** A link whose URL may still be a TODO placeholder; then it renders the marker instead. */
export function ExtLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (isTodo(href)) return <Val v={href} />;
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
