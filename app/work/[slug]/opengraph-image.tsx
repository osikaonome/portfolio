import fs from "node:fs";
import { ImageResponse } from "next/og";
import { disciplineLabel } from "@/lib/labels";
import { assetPath, getProject, getProjects, hasCaseStudy } from "@/lib/content";
import { site } from "@/lib/site";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjects()
    .filter((p) => hasCaseStudy(p.data))
    .map((p) => ({ slug: p.data.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return new Response("Not found", { status: 404 });
  const { title, summary, discipline, cover } = project.data;

  const ext = cover.src.split(".").pop()?.toLowerCase();
  const mime = ext === "png" ? "image/png" : "image/jpeg";
  const coverData = `data:${mime};base64,${fs.readFileSync(assetPath("work", slug, cover.src)).toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#111110", color: "#ecebe6" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640, padding: 64 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: "#a3a199" }}>
            {disciplineLabel[discipline]}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 68, lineHeight: 1.05, fontWeight: 600 }}>{title}</div>
            <div style={{ marginTop: 24, fontSize: 26, lineHeight: 1.35, color: "#a3a199" }}>{summary}</div>
          </div>
          <div style={{ display: "flex", fontSize: 24 }}>{site.name}</div>
        </div>
        <img src={coverData} alt="" width={560} height={630} style={{ objectFit: "cover" }} />
      </div>
    ),
    size,
  );
}
