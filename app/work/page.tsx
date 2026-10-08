import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkGrid, WorkList } from "@/components/work/work-grid";
import { getProjectCards } from "@/lib/cards";
import { getAllTags } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Engineering and design projects: case studies, decisions and results.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const projects = await getProjectCards();
  const tags = getAllTags();

  return (
    <div className="container-page pt-stack-l md:pt-stack-2xl">
      <h1 className="font-display text-step-5">Work</h1>
      <p className="mt-stack-xs max-w-[52ch] text-step-1 text-muted">
        Case studies across frontend engineering and design. Filter by discipline or tag; the URL updates so you can
        share a filtered view.
      </p>
      <div className="mt-stack-xl">
        <Suspense fallback={<WorkList projects={projects} />}>
          <WorkGrid projects={projects} tags={tags} />
        </Suspense>
      </div>
    </div>
  );
}
