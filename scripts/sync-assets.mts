/**
 * Copies co-located content assets (images, video) to public/content so
 * next/image can serve them. Runs before `dev` and `build`.
 */
import fs from "node:fs";
import path from "node:path";

const src = path.join(process.cwd(), "content");
const out = path.join(process.cwd(), "public", "content");

fs.rmSync(out, { recursive: true, force: true });

let count = 0;
for (const collection of ["work", "lab", "writing", "system"]) {
  const dir = path.join(src, collection);
  if (!fs.existsSync(dir)) continue;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    for (const file of fs.readdirSync(path.join(dir, entry.name))) {
      if (file.endsWith(".mdx") || file.startsWith(".")) continue;
      const to = path.join(out, collection, entry.name, file);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(path.join(dir, entry.name, file), to);
      count++;
    }
  }
}
console.log(`[assets] synced ${count} files to public/content`);
