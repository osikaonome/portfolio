import { describe, expect, it } from "vitest";
import { hourIn, paletteForHour } from "@/components/hero/sky";

describe("paletteForHour", () => {
  it("maps hours to times of day", () => {
    expect(paletteForHour(2).name).toBe("night");
    expect(paletteForHour(6).name).toBe("dawn");
    expect(paletteForHour(10).name).toBe("morning");
    expect(paletteForHour(14).name).toBe("afternoon");
    expect(paletteForHour(18.5).name).toBe("dusk");
    expect(paletteForHour(23).name).toBe("night");
  });

  it("returns stable objects (safe for useSyncExternalStore)", () => {
    expect(paletteForHour(10)).toBe(paletteForHour(11));
  });
});

describe("hourIn", () => {
  it("reads the hour in a time zone", () => {
    // 12:30 UTC in January is 12:30 in Dublin (GMT); in July it's 13:30 (IST).
    expect(hourIn("Europe/Dublin", new Date("2025-01-15T12:30:00Z"))).toBe(12.5);
    expect(hourIn("Europe/Dublin", new Date("2025-07-15T12:30:00Z"))).toBe(13.5);
  });
});
