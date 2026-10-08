import { describe, expect, it } from "vitest";
import { getAdjacentProjects, getProjects, hasCaseStudy } from "@/lib/content";

describe("content layer", () => {
  const projects = getProjects();

  it("loads every project folder", () => {
    expect(projects.length).toBeGreaterThanOrEqual(4);
  });

  it("sorts featured projects by order first", () => {
    const featured = projects.filter((p) => p.data.featured);
    const orders = featured.map((p) => p.data.order ?? Infinity);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(projects.indexOf(featured[0])).toBe(0);
  });

  it("gives card-depth and NDA projects no case study page", () => {
    for (const p of projects) {
      if (p.data.depth === "card" || p.data.status === "nda") expect(hasCaseStudy(p.data)).toBe(false);
    }
    expect(projects.some((p) => p.data.depth === "card")).toBe(true);
  });

  it("excludes pageless projects from prev/next", () => {
    const withPages = projects.filter((p) => hasCaseStudy(p.data));
    for (const p of withPages) {
      const { prev, next } = getAdjacentProjects(p.data.slug);
      expect(prev && hasCaseStudy(prev.data)).toBe(true);
      expect(next && hasCaseStudy(next.data)).toBe(true);
    }
  });
});
