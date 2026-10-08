import { describe, expect, it } from "vitest";
import { projectSchema } from "@/content/schema";

const valid = {
  title: "Example",
  slug: "example",
  summary: "A short summary.",
  year: 2025,
  role: ["Frontend lead"],
  discipline: "engineering",
  tags: ["Next.js"],
  cover: { src: "cover.jpg", alt: "A descriptive alt text" },
  status: "live",
  stack: ["Next.js"],
};

describe("projectSchema", () => {
  it("accepts a valid engineering project and applies defaults", () => {
    const r = projectSchema.parse(valid);
    expect(r.featured).toBe(false);
  });

  it("rejects short alt text", () => {
    expect(projectSchema.safeParse({ ...valid, cover: { src: "c.jpg", alt: "cover" } }).success).toBe(false);
  });

  it("requires discipline-specific fields", () => {
    expect(projectSchema.safeParse({ ...valid, discipline: "design" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...valid, discipline: "design", tools: ["Figma"], deliverables: ["Logo"] }).success).toBe(true);
  });

  it("accepts TODO placeholders for year and status, but not other free text", () => {
    expect(projectSchema.safeParse({ ...valid, year: "TODO: year", status: "TODO: live or archived" }).success).toBe(true);
    expect(projectSchema.safeParse({ ...valid, year: "soon" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...valid, status: "launching" }).success).toBe(false);
  });

  it("defaults depth to full and accepts card", () => {
    expect(projectSchema.parse(valid).depth).toBe("full");
    expect(projectSchema.parse({ ...valid, depth: "card" }).depth).toBe("card");
  });

  it("rejects bad slugs, long summaries and more than four metrics", () => {
    expect(projectSchema.safeParse({ ...valid, slug: "Bad Slug" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...valid, summary: "x".repeat(161) }).success).toBe(false);
    const metrics = Array.from({ length: 5 }, (_, i) => ({ label: `m${i}`, value: "1" }));
    expect(projectSchema.safeParse({ ...valid, metrics }).success).toBe(false);
  });
});
