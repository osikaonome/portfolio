import type { Project } from "@/content/schema";
import { site } from "@/lib/site";
import { isTodo } from "@/lib/todo";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can't close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    url: site.url,
    address: { "@type": "PostalAddress", addressLocality: "Dublin", addressCountry: "IE" },
    sameAs: Object.values(site.social).filter((u) => !isTodo(u)),
  };
}

export function projectJsonLd(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.summary,
    ...(typeof p.year === "number" && { dateCreated: String(p.year) }),
    keywords: p.tags.join(", "),
    url: `${site.url}/work/${p.slug}`,
    image: `${site.url}/work/${p.slug}/opengraph-image`,
    author: { "@type": "Person", name: site.name },
  };
}

export function articleJsonLd(a: { title: string; summary: string; date: Date; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.summary,
    datePublished: a.date.toISOString(),
    url: `${site.url}/writing/${a.slug}`,
    author: { "@type": "Person", name: site.name },
  };
}
