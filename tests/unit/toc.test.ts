import { describe, expect, it } from "vitest";
import { extractHeadings, slugify } from "@/lib/toc";

describe("slugify", () => {
  it("makes kebab-case ids", () => {
    expect(slugify("The Problem & Context")).toBe("the-problem-context");
    expect(slugify("Café résumé")).toBe("cafe-resume");
  });
});

describe("extractHeadings", () => {
  it("reads <Section> titles in order, in any quote style", () => {
    const mdx = `<Section title="One">a</Section>\n<Section title='Two'>b</Section>\n<Section title={"Three"}>c</Section>`;
    expect(extractHeadings(mdx)).toEqual([
      { id: "one", title: "One" },
      { id: "two", title: "Two" },
      { id: "three", title: "Three" },
    ]);
  });
});
