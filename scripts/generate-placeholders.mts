/**
 * Generates placeholder images. Never overwrites existing files.
 *
 *   npm run placeholders
 *
 * Project covers are named `cover-placeholder.jpg`. The content check refuses
 * placeholder covers in production builds, so they can't ship. Add a real
 * cover, then update `cover.src` and `cover.alt`.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.join(process.cwd(), "content");

type Spec = { file: string; w: number; h: number; from: string; to: string; label: string; sub?: string };

const projects: [slug: string, title: string, from: string, to: string][] = [
  ["jemine-ai", "Jemine AI", "#0f3b3a", "#3fa7a0"],
  ["lease-lens", "Lease Lens", "#1f2a5a", "#5a7cff"],
  ["myareaa", "MyAreaa", "#3a2a12", "#d39a3c"],
  ["connectafrobeats-platform", "ConnectAfrobeats", "#2a0f2e", "#c04fd1"],
  ["myfsconnect", "MyFSConnect", "#10233b", "#3f7fc4"],
  ["thummim", "Thummim", "#123320", "#4fae73"],
  ["jl13-crm-dashboard", "Internal CRM Dashboard", "#1d1d24", "#5a5a6e"],
  ["connectafrobeats-creative", "ConnectAfrobeats Creative", "#3b0f1f", "#e0507a"],
  ["daytona-247", "Daytona 24/7", "#3b2a0f", "#e0a43c"],
  ["rekoja", "Rékọjá", "#2e1f17", "#b8826a"],
  ["the-message-refinery", "The Message Refinery", "#16262e", "#5f9ab0"],
];

const specs: Spec[] = [
  ...projects.map(([slug, title, from, to]) => ({
    file: `work/${slug}/cover-placeholder.jpg`,
    w: 1600,
    h: 1000,
    from,
    to,
    label: title,
  })),
  // Neutral demo assets for the /system page
  { file: "system/demo/landscape.jpg", w: 1600, h: 1000, from: "#1f2a5a", to: "#5a7cff", label: "Example image", sub: "DEMO ASSET" },
  { file: "system/demo/landscape-2.jpg", w: 1600, h: 1000, from: "#3a1d14", to: "#e07a4f", label: "Example image", sub: "DEMO ASSET" },
  { file: "system/demo/landscape-3.jpg", w: 1600, h: 1000, from: "#123320", to: "#4fae73", label: "Example image", sub: "DEMO ASSET" },
  { file: "system/demo/portrait.png", w: 780, h: 1688, from: "#eef1fb", to: "#9fb0ff", label: "Mobile", sub: "DEMO ASSET" },
];

function svg({ w, h, from, to, label, sub }: Spec) {
  const size = Math.round(Math.min(w, h) / 14);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Helvetica, Arial, sans-serif" font-size="${size}" fill="rgba(255,255,255,0.88)">${label}</text>
  ${sub ? `<text x="50%" y="${Math.round(h / 2 + size * 1.3)}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(size * 0.42)}" letter-spacing="2" fill="rgba(255,255,255,0.65)">${sub}</text>` : ""}
</svg>`;
}

async function write(file: string, input: Buffer) {
  const out = path.join(root, file);
  if (fs.existsSync(out)) return;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const img = sharp(input);
  await (out.endsWith(".png") ? img.png({ compressionLevel: 9, palette: true }) : img.jpeg({ quality: 72, mozjpeg: true })).toFile(out);
  console.log("created", file);
}

for (const spec of specs) await write(spec.file, Buffer.from(svg(spec)));

// Lab cover: a real still of the generative hero (dusk palette, same line maths).
{
  const w = 1600;
  const h = 1000;
  const lines = Array.from({ length: 24 }, (_, i) => {
    const y0 = (h / 25) * (i + 1);
    let d = "";
    for (let x = 0; x <= w; x += 8) {
      const y = y0 + Math.sin(x * 0.006 + i * 0.7) * 10 + Math.sin(x * 0.013 + i) * 5;
      d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)} `;
    }
    return `<path d="${d}" fill="none" stroke="#ffd7b8" stroke-width="1.5" opacity="${(0.12 + 0.35 * (i / 24)).toFixed(2)}"/>`;
  }).join("");
  const sky = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2e5a"/><stop offset="1" stop-color="#ee8f6b"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>${lines}</svg>`;
  await write("lab/sky-lines/cover.jpg", Buffer.from(sky));
}
