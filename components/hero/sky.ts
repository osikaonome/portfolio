// Pure helpers for the generative hero (unit-tested).

export type SkyPalette = { top: string; bottom: string; line: string; name: string };

const palettes: { from: number; palette: SkyPalette }[] = [
  { from: 0, palette: { name: "night", top: "#0d1024", bottom: "#1d2340", line: "#8fa2ff" } },
  { from: 5, palette: { name: "dawn", top: "#2b2f5c", bottom: "#f2a98a", line: "#ffe2c7" } },
  { from: 8, palette: { name: "morning", top: "#9cc3e6", bottom: "#eef3f6", line: "#2f4bd8" } },
  { from: 12, palette: { name: "afternoon", top: "#7fb0d9", bottom: "#e6eef2", line: "#1f3aa8" } },
  { from: 17, palette: { name: "dusk", top: "#3b2e5a", bottom: "#ee8f6b", line: "#ffd7b8" } },
  { from: 21, palette: { name: "night", top: "#0d1024", bottom: "#1d2340", line: "#8fa2ff" } },
];

export function paletteForHour(hour: number): SkyPalette {
  let current = palettes[0].palette;
  for (const p of palettes) if (hour >= p.from) current = p.palette;
  return current;
}

/** Hour (0–23, fractional) in a time zone, e.g. Europe/Dublin. */
export function hourIn(timeZone: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(date);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h + m / 60;
}
