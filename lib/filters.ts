import type { Discipline } from "@/content/schema";

/** /work filter predicate. "both" projects count as engineering and as design. */
export function matchesFilters(
  project: { discipline: Discipline; tags: string[] },
  discipline: string | null,
  tag: string | null,
) {
  const d = !discipline || project.discipline === discipline || project.discipline === "both";
  const t = !tag || project.tags.includes(tag);
  return d && t;
}
