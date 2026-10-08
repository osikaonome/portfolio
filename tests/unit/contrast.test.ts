import { describe, expect, it } from "vitest";
import { backgrounds, contrastRatio, passesAA } from "@/lib/contrast";

describe("contrastRatio", () => {
  it("is 21:1 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#2f4bd8", "#fbfaf7")).toBeCloseTo(contrastRatio("#fbfaf7", "#2f4bd8"));
  });

  it("rejects invalid colours", () => {
    expect(() => contrastRatio("blue", "#fff")).toThrow();
  });
});

describe("theme tokens", () => {
  it("default accents pass AA on their backgrounds", () => {
    expect(passesAA("#2f4bd8", backgrounds.light)).toBe(true);
    expect(passesAA("#8fa2ff", backgrounds.dark)).toBe(true);
  });

  it("muted text passes AA in both themes", () => {
    expect(passesAA("#5c5a54", backgrounds.light)).toBe(true);
    expect(passesAA("#a3a199", backgrounds.dark)).toBe(true);
  });
});
