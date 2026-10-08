import { describe, expect, it } from "vitest";
import { searchItems, type SearchItem } from "@/lib/search-query";

const items: SearchItem[] = [
  { type: "Project", title: "Lease Lens", summary: "AI lease reader", href: "/work/lease-lens", keywords: ["AI", "Next.js"] },
  { type: "Project", title: "Northbound identity", summary: "Branding for a co-op", href: "/work/northbound-identity", keywords: ["Branding"] },
  { type: "Page", title: "About", summary: "", href: "/about", keywords: [] },
];

describe("searchItems", () => {
  it("returns everything for an empty query", () => {
    expect(searchItems(items, "  ")).toHaveLength(3);
  });

  it("ranks title matches above keyword matches", () => {
    expect(searchItems(items, "lens")[0].href).toBe("/work/lease-lens");
    expect(searchItems(items, "branding")[0].href).toBe("/work/northbound-identity");
  });

  it("requires every term to match", () => {
    expect(searchItems(items, "lease branding")).toHaveLength(0);
  });
});
