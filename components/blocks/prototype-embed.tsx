import { resolveImage, type AssetContext } from "@/lib/images";
import { LazyEmbed } from "./lazy-embed";

/** Figma (or other) prototype. Always click-to-load: embeds are heavy. */
export async function PrototypeEmbed({
  ctx,
  src,
  title,
  poster,
  posterAlt,
  aspect = "16 / 10",
}: {
  ctx: AssetContext;
  /** A Figma file/proto URL is converted to its embed URL automatically. */
  src: string;
  title: string;
  poster: string;
  posterAlt: string;
  aspect?: string;
}) {
  const img = await resolveImage(ctx, poster);
  const embed = /figma\.com\/(file|proto|design)\//.test(src)
    ? `https://www.figma.com/embed?embed_host=portfolio&url=${encodeURIComponent(src)}`
    : src;
  return <LazyEmbed src={embed} title={title} poster={img} posterAlt={posterAlt} aspect={aspect} label="Load prototype" />;
}
