import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate } from "@/components/layout/entry-list";
import { getLabEntries, getLabEntry } from "@/lib/content";
import { MDXContent } from "@/lib/mdx";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLabEntries().map((e) => ({ slug: e.data.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lab/[slug]">): Promise<Metadata> {
  const entry = getLabEntry((await params).slug);
  if (!entry) return {};
  return {
    title: entry.data.title,
    description: entry.data.summary,
    alternates: { canonical: `/lab/${entry.data.slug}` },
  };
}

export default async function LabEntryPage({ params }: PageProps<"/lab/[slug]">) {
  const { slug } = await params;
  const entry = getLabEntry(slug);
  if (!entry) notFound();
  const { title, summary, date, tags } = entry.data;

  return (
    <article className="container-page pt-stack-l md:pt-stack-2xl">
      <p className="eyebrow">
        Lab · <time dateTime={date.toISOString()}>{formatDate(date)}</time>
      </p>
      <h1 className="mt-stack-xs max-w-[22ch] font-display text-step-5">{title}</h1>
      <p className="mt-stack-s max-w-[52ch] text-step-1 text-muted">{summary}</p>
      <p className="mt-stack-xs font-mono text-[0.72rem] uppercase tracking-wide text-muted">{tags.join(" · ")}</p>
      <div className="prose mt-stack-xl">
        <MDXContent source={entry.body} ctx={{ collection: "lab", slug }} />
      </div>
    </article>
  );
}
