import type { Metadata } from "next";
import { EntryList } from "@/components/layout/entry-list";
import { getArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Articles on frontend engineering, design systems and performance.",
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  const items = getArticles().map(({ data }) => ({ ...data, href: `/writing/${data.slug}` }));
  return (
    <div className="container-page pt-stack-l md:pt-stack-2xl">
      <h1 className="font-display text-step-5">Writing</h1>
      <p className="mt-stack-xs max-w-[52ch] text-step-1 text-muted">
        Notes on frontend engineering, design systems and making the web fast.
      </p>
      <EntryList items={items} empty="Nothing published yet." />
    </div>
  );
}
