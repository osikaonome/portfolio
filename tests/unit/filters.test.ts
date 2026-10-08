import { describe, expect, it } from "vitest";
import { matchesFilters } from "@/lib/filters";

describe("matchesFilters", () => {
  const both = { discipline: "both" as const, tags: ["React"] };
  const design = { discipline: "design" as const, tags: ["Branding"] };

  it("shows everything with no filters", () => {
    expect(matchesFilters(design, null, null)).toBe(true);
  });

  it("counts 'both' as engineering and as design", () => {
    expect(matchesFilters(both, "engineering", null)).toBe(true);
    expect(matchesFilters(both, "design", null)).toBe(true);
    expect(matchesFilters(design, "engineering", null)).toBe(false);
  });

  it("combines discipline and tag", () => {
    expect(matchesFilters(design, "design", "Branding")).toBe(true);
    expect(matchesFilters(design, "design", "React")).toBe(false);
  });
});
