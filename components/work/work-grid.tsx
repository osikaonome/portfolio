"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProjectCardData } from "@/lib/cards";
import { matchesFilters } from "@/lib/filters";
import { disciplineLabel } from "@/lib/labels";
import { ProjectCard } from "./project-card";

const disciplines = ["engineering", "design"] as const;

/**
 * Filter state lives in the URL (?discipline=design&tag=Branding) so a
 * filtered view can be shared. Without JS, the Suspense fallback (every
 * project, unfiltered) is what renders.
 */
export function WorkGrid({ projects, tags }: { projects: ProjectCardData[]; tags: string[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const discipline = params.get("discipline");
  const tag = params.get("tag");
  const visible = projects.filter((p) => matchesFilters(p, discipline, tag));

  function set(key: "discipline" | "tag", value: string | null) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <>
      <div className="space-y-stack-xs">
        <FilterRow label="Discipline">
          <Chip active={!discipline} onClick={() => set("discipline", null)}>
            All
          </Chip>
          {disciplines.map((d) => (
            <Chip key={d} active={discipline === d} onClick={() => set("discipline", d)}>
              {disciplineLabel[d]}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Tag">
          <Chip active={!tag} onClick={() => set("tag", null)}>
            Any
          </Chip>
          {tags.map((t) => (
            <Chip key={t} active={tag === t} onClick={() => set("tag", tag === t ? null : t)}>
              {t}
            </Chip>
          ))}
        </FilterRow>
      </div>

      <p className="mt-stack-m text-step--1 text-muted" aria-live="polite">
        Showing {visible.length} of {projects.length} projects
      </p>

      <WorkList projects={visible} />
      {visible.length === 0 && (
        <p className="mt-stack-l">
          Nothing matches those filters.{" "}
          <button type="button" className="tap text-accent underline" onClick={() => router.replace(pathname, { scroll: false })}>
            Clear filters
          </button>
        </p>
      )}
    </>
  );
}

export function WorkList({ projects }: { projects: ProjectCardData[] }) {
  return (
    <ul className="mt-stack-m grid gap-x-stack-l gap-y-stack-2xl md:grid-cols-2">
      {projects.map((p) => (
        <li key={p.slug}>
          <ProjectCard project={p} headingLevel={2} />
        </li>
      ))}
    </ul>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={`Filter by ${label.toLowerCase()}`} className="scrollbar-none -mx-gutter flex items-center gap-2 overflow-x-auto px-gutter">
      <span className="eyebrow mr-1 shrink-0">{label}</span>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="tap inline-flex shrink-0 items-center rounded-full border border-border px-3.5 text-step--1 whitespace-nowrap transition-colors hover:border-fg aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg"
    >
      {children}
    </button>
  );
}
