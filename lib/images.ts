import fs from "node:fs";
import { imageSize } from "image-size";
import sharp from "sharp";
import { assetPath, assetUrl, type AssetCollection } from "@/lib/content";

export type AssetContext = { collection: AssetCollection; slug: string };

export type ResolvedImage = {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

const cache = new Map<string, Promise<ResolvedImage>>();

/**
 * Resolves an image referenced from content to a public URL, intrinsic size
 * (prevents CLS) and a tiny blurred placeholder. Runs at build time only.
 */
export function resolveImage(ctx: AssetContext, src: string): Promise<ResolvedImage> {
  const key = `${ctx.collection}/${ctx.slug}/${src}`;
  let p = cache.get(key);
  if (!p) {
    p = load(ctx, src);
    cache.set(key, p);
  }
  return p;
}

async function load(ctx: AssetContext, src: string): Promise<ResolvedImage> {
  const file = assetPath(ctx.collection, ctx.slug, src);
  if (!fs.existsSync(file)) {
    throw new Error(`[content] Missing asset "${src}" in content/${ctx.collection}/${ctx.slug}`);
  }
  const buffer = fs.readFileSync(file);
  const { width, height } = imageSize(buffer);
  if (!width || !height) throw new Error(`[content] Could not read size of ${file}`);

  let blurDataURL: string | undefined;
  if (!file.endsWith(".svg")) {
    const tiny = await sharp(buffer).resize(16).blur().webp({ quality: 40 }).toBuffer();
    blurDataURL = `data:image/webp;base64,${tiny.toString("base64")}`;
  }

  return { src: assetUrl(ctx.collection, ctx.slug, src), width, height, blurDataURL };
}

export const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);
