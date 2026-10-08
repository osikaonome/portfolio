import type { Discipline } from "@/content/schema";
import { getProjects, hasCaseStudy, type Entry } from "@/lib/content";
import { resolveImage, type ResolvedImage } from "@/lib/images";
import type { Project } from "@/content/schema";

/** Serializable card data, generated from frontmatter only. */
export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  year: number | string;
  discipline: Discipline;
  tags: string[];
  role: string[];
  status: Project["status"];
  depth: Project["depth"];
  hasPage: boolean;
  live?: string;
  stack: string[];
  cover: ResolvedImage & { alt: string };
};

export async function toCardData({ data }: Entry<Project>): Promise<ProjectCardData> {
  const img = await resolveImage({ collection: "work", slug: data.slug }, data.cover.src);
  return {
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    year: data.year,
    discipline: data.discipline,
    tags: data.tags,
    role: data.role,
    status: data.status,
    depth: data.depth,
    hasPage: hasCaseStudy(data),
    live: data.links?.live,
    stack: "stack" in data ? data.stack : [],
    cover: { ...img, alt: data.cover.alt },
  };
}

export function getProjectCards(entries = getProjects()) {
  return Promise.all(entries.map(toCardData));
}
