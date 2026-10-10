import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { ProjectCardData } from "@/lib/cards";
import { site } from "@/lib/site";
import { Inspectable } from "@/components/inspect/inspectable";
import { disciplineLabel } from "@/lib/labels";
import { isTodo } from "@/lib/todo";
import { Val } from "@/components/ui/todo";

/** Rendered from frontmatter only. Works in server and client trees. */
export function ProjectCard({ project, priority = false, headingLevel = 3 }: { project: ProjectCardData; priority?: boolean; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as const;
  const archived = project.status === "archived";
  const href = `/work/${project.slug}`;

  const cover = (
    <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
      <Image
        src={project.cover.src}
        alt={project.cover.alt}
        width={project.cover.width}
        height={project.cover.height}
        placeholder={project.cover.blurDataURL ? "blur" : "empty"}
        blurDataURL={project.cover.blurDataURL}
        priority={priority}
        sizes="(min-width: 80rem) 600px, (min-width: 48rem) 50vw, 100vw"
        // Archived work is de-emphasised on the image only, so text keeps full contrast.
        className={`aspect-[16/10] h-auto w-full rounded-card bg-surface object-cover transition-transform duration-500 ease-out-soft group-hover:scale-[1.015]`}
      />
    </ViewTransition>
  );

  return (
    <Inspectable id="project-card" as="article" className="group relative">
      <div id={project.slug} className="scroll-mt-24 overflow-hidden rounded-card">
        {cover}
      </div>
      <div className="mt-stack-s flex items-baseline justify-between gap-stack-s">
        <H className="text-step-1 font-semibold">
          {project.hasPage ? (
            // The whole card is clickable via the stretched link, no hover-only affordances.
            <Link href={href} className="after:absolute after:inset-0 after:content-['']">
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </H>
        <span className="shrink-0 font-mono text-step--1 text-muted">
          <Val v={project.year} />
        </span>
      </div>
      <p className="mt-1 text-muted">{project.summary}</p>
      <p className="mt-stack-xs flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.72rem] uppercase tracking-wide text-muted">
        <span>{disciplineLabel[project.discipline]}</span>
        {archived && <span>Archived</span>}
        {project.status === "concept" && <span>In progress</span>}
        {isTodo(project.status) && <Val v={`status ${project.status}`} />}
        {project.tags.slice(0, 3).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </p>
      {project.depth === "card" && (
        <div className="mt-stack-xs space-y-1 text-step--1">
          <p>
            <span className="text-muted">Role: </span>
            {project.role.map((r, i) => (
              <span key={r}>
                {i > 0 && ", "}
                <Val v={r} />
              </span>
            ))}
          </p>
          {project.stack.length > 0 && (
            <p>
              <span className="text-muted">Stack: </span>
              {project.stack.join(", ")}
            </p>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="tap relative z-10 inline-flex items-center text-accent underline">
              Visit site ↗<span className="sr-only">: {project.title}</span>
            </a>
          )}
        </div>
      )}
      {!project.hasPage && project.status === "nda" && (
        <p className="relative z-10 mt-stack-xs text-step--1">
          Under NDA. Details on request:{" "}
          <a className="text-accent underline" href={`mailto:${site.email}?subject=${encodeURIComponent(project.title)}`}>
            get in touch
          </a>
          .
        </p>
      )}
    </Inspectable>
  );
}
