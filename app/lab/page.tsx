import type { Metadata } from "next";
import { EntryList } from "@/components/layout/entry-list";
import { getLabEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lab",
  description: "Small creative experiments in code: shaders, motion and interaction studies.",
  alternates: { canonical: "/lab" },
};

export default function LabPage() {
  const items = getLabEntries().map(({ data }) => ({ ...data, href: `/lab/${data.slug}` }));
  return (
    <div className="container-page pt-stack-l md:pt-stack-2xl">
      <h1 className="font-display text-step-5">Lab</h1>
      <p className="mt-stack-xs max-w-[52ch] text-step-1 text-muted">
        Small experiments: shaders, motion and interaction studies. Less polish, more curiosity.
      </p>
      <EntryList items={items} empty="No experiments yet." />
    </div>
  );
}
