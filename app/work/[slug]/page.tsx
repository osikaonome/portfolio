import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type CSSProperties } from "react";
import { MetricRow } from "@/components/blocks/metric-row";
import { Inspectable } from "@/components/inspect/inspectable";
import { disciplineLabel } from "@/lib/labels";
import { TableOfContents } from "@/components/work/table-of-contents";
import { getAdjacentProjects, getProject, getProjects, hasCaseStudy } from "@/lib/content";
import { resolveImage } from "@/lib/images";
import { JsonLd, projectJsonLd } from "@/lib/json-ld";
import { MDXContent } from "@/lib/mdx";
import { isTodo } from "@/lib/todo";
import { Val } from "@/components/ui/todo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects()
    .filter((p) => hasCaseStudy(p.data))
    .map((p) => ({ slug: p.data.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const { title, summary, slug } = project.data;
  return {
    title,
    description: summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { type: "article", title, description: summary },
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !hasCaseStudy(project.data)) notFound();

  const p = project.data;
  const ctx = { collection: "work" as const, slug };
  const cover = await resolveImage(ctx, p.cover.src);
  const { prev, next } = getAdjacentProjects(slug);

  const accentStyle = p.theme
    ? ({ "--accent-light": p.theme.accent, "--accent-dark": p.theme.accentDark ?? p.theme.accent } as CSSProperties)
    : undefined;

  const facts: [string, string[] | undefined][] = [
    ["Role", p.role],
    ["Stack", "stack" in p ? p.stack : undefined],
    ["Tools", "tools" in p ? p.tools : undefined],
    ["Deliverables", "deliverables" in p ? p.deliverables : undefined],
  ];
  const metricsProminent = p.discipline !== "design";

  return (
    <article data-project-accent={p.theme ? "" : undefined} style={accentStyle}>
      <JsonLd data={projectJsonLd(p)} />
      <div className="reading-progress" aria-hidden />

      <header className="container-page pt-stack-l md:pt-stack-2xl">
        <Inspectable id="case-study-hero">
          <p className="eyebrow">
            {disciplineLabel[p.discipline]} · <Val v={p.year} />
            {p.status === "concept" && " · In progress"}
            {p.status === "archived" && " · Archived"}
            {isTodo(p.status) && (
              <>
                {" · "}
                <Val v={`status ${p.status}`} />
              </>
            )}
          </p>
          <h1 className="mt-stack-xs max-w-[20ch] font-display text-step-5 md:text-step-6">{p.title}</h1>
          <p className="mt-stack-s max-w-[52ch] text-step-1 text-muted">{p.summary}</p>
        </Inspectable>
        <ViewTransition name={`cover-${slug}`} share="morph" default="none">
          <Image
            src={cover.src}
            alt={p.cover.alt}
            width={cover.width}
            height={cover.height}
            placeholder={cover.blurDataURL ? "blur" : "empty"}
            blurDataURL={cover.blurDataURL}
            priority
            sizes="(min-width: 80rem) 1200px, 100vw"
            // Covers are designed compositions: show them whole, never cropped.
            className="mt-stack-xl h-auto w-full rounded-panel bg-surface"
          />
        </ViewTransition>
      </header>

      {p.metrics && (
        <div className={`container-page mt-stack-xl ${metricsProminent ? "" : "max-w-3xl"}`}>
          <MetricRow items={p.metrics} />
        </div>
      )}

      <div className="container-page mt-stack-2xl grid gap-stack-xl lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-stack-2xl">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <Inspectable id="case-study-sidebar" className="space-y-stack-l">
            <dl className="grid grid-cols-2 gap-stack-m text-step--1 lg:grid-cols-1">
              {facts.map(([label, values]) =>
                values?.length ? (
                  <div key={label}>
                    <dt className="eyebrow">{label}</dt>
                    <dd className="mt-1">
                      <ul>
                        {values.map((v) => (
                          <li key={v}>
                            <Val v={v} />
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ) : null,
              )}
              {p.links && (
                <div>
                  <dt className="eyebrow">Links</dt>
                  <dd className="mt-1">
                    <ul>
                      {Object.entries(p.links).map(([k, href]) => (
                        <li key={k}>
                          <a href={href} className="tap inline-flex items-center text-accent capitalize underline">
                            {k === "live" ? "Live site" : k} ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
            <TableOfContents headings={project.headings} />
          </Inspectable>
        </aside>

        <div className="prose min-w-0">
          {"challenge" in p && p.challenge && (
            <p className="text-step-1">
              <span className="eyebrow mr-2">Challenge</span>
              {p.challenge}
            </p>
          )}
          <MDXContent source={project.body} ctx={ctx} />
        </div>
      </div>

      {next && prev && (
        <nav aria-label="More projects" className="container-page mt-section grid gap-stack-s border-t border-border pt-stack-l sm:grid-cols-2">
          <Link href={`/work/${prev.data.slug}`} className="tap group block rounded-card p-stack-s hover:bg-surface">
            <span className="eyebrow">← Previous</span>
            <span className="mt-1 block text-step-1 font-semibold">{prev.data.title}</span>
          </Link>
          <Link href={`/work/${next.data.slug}`} className="tap group block rounded-card p-stack-s text-right hover:bg-surface">
            <span className="eyebrow">Next project →</span>
            <span className="mt-1 block font-display text-step-3">{next.data.title}</span>
          </Link>
        </nav>
      )}
    </article>
  );
}
