import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate } from "@/components/layout/entry-list";
import { TableOfContents } from "@/components/work/table-of-contents";
import { getArticle, getArticles } from "@/lib/content";
import { articleJsonLd, JsonLd } from "@/lib/json-ld";
import { MDXContent } from "@/lib/mdx";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.data.slug }));
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  const { title, summary, slug, date } = article.data;
  return {
    title,
    description: summary,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: { type: "article", title, description: summary, publishedTime: date.toISOString() },
  };
}

export default async function ArticlePage({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const { title, summary, date } = article.data;

  return (
    <article className="container-page pt-stack-l md:pt-stack-2xl">
      <JsonLd data={articleJsonLd(article.data)} />
      <div className="reading-progress" aria-hidden />
      <p className="eyebrow">
        <time dateTime={date.toISOString()}>{formatDate(date)}</time>
      </p>
      <h1 className="mt-stack-xs max-w-[22ch] font-display text-step-5">{title}</h1>
      <p className="mt-stack-s max-w-[52ch] text-step-1 text-muted">{summary}</p>
      <div className="mt-stack-xl max-w-[var(--measure)]">
        <TableOfContents headings={article.headings} />
      </div>
      <div className="prose mt-stack-xl">
        <MDXContent source={article.body} ctx={{ collection: "writing", slug }} />
      </div>
    </article>
  );
}
