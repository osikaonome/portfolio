import { getArticles, getLabEntries, getProjects, hasCaseStudy } from "@/lib/content";
import { nav } from "@/lib/site";
import type { SearchItem } from "@/lib/search-query";

/** Built at build time from all content and served as static JSON. */
export function buildSearchIndex(): SearchItem[] {
  const pages: SearchItem[] = nav.map((n) => ({
    type: "Page",
    title: n.label,
    summary: "",
    href: n.href,
    keywords: [],
  }));

  const projects: SearchItem[] = getProjects().map(({ data }) => ({
    type: "Project",
    title: data.title,
    summary: data.summary,
    // NDA projects have no page; send people to the card on /work instead.
    href: hasCaseStudy(data) ? `/work/${data.slug}` : `/work#${data.slug}`,
    keywords: [data.discipline, ...data.tags, ...data.role, String(data.year)],
  }));

  const lab: SearchItem[] = getLabEntries().map(({ data }) => ({
    type: "Lab",
    title: data.title,
    summary: data.summary,
    href: `/lab/${data.slug}`,
    keywords: data.tags,
  }));

  const writing: SearchItem[] = getArticles().map(({ data }) => ({
    type: "Writing",
    title: data.title,
    summary: data.summary,
    href: `/writing/${data.slug}`,
    keywords: data.tags,
  }));

  return [...pages, ...projects, ...lab, ...writing];
}
