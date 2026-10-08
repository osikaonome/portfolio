import type { MetadataRoute } from "next";
import { getArticles, getLabEntries, getProjects, hasCaseStudy } from "@/lib/content";
import { nav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  return [
    ...nav.map((n) => ({ url: url(n.href) })),
    ...getProjects()
      .filter((p) => hasCaseStudy(p.data))
      .map((p) => ({ url: url(`/work/${p.data.slug}`) })),
    ...getLabEntries().map((e) => ({ url: url(`/lab/${e.data.slug}`), lastModified: e.data.date })),
    ...getArticles().map((a) => ({ url: url(`/writing/${a.data.slug}`), lastModified: a.data.date })),
  ];
}
