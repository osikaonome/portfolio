import { resolveImage, type AssetContext } from "@/lib/images";
import { LazyEmbed } from "./lazy-embed";

/**
 * Interactive embed. Static poster until tapped on touch devices (saves
 * data); loads when scrolled into view on desktop.
 */
export async function LiveDemo({
  ctx,
  src,
  title,
  poster,
  posterAlt,
  aspect = "16 / 10",
}: {
  ctx: AssetContext;
  src: string;
  title: string;
  poster: string;
  posterAlt: string;
  aspect?: string;
}) {
  const img = await resolveImage(ctx, poster);
  return <LazyEmbed src={src} title={title} poster={img} posterAlt={posterAlt} aspect={aspect} loadOnView label="Load live demo" />;
}
