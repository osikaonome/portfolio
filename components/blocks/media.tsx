import Image from "next/image";
import { isVideo, resolveImage, type AssetContext } from "@/lib/images";
import { assetUrl } from "@/lib/content";

export type MediaProps = {
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
  priority?: boolean;
  /** Layout hint for next/image `sizes`. */
  sizes?: string;
  className?: string;
};

/** Image or video with caption. AVIF/WebP, blur placeholder, lazy by default. */
export async function Media({ ctx, src, alt, caption, poster, priority, sizes, className = "" }: MediaProps & { ctx: AssetContext }) {
  let body;
  if (isVideo(src)) {
    const posterImg = poster ? await resolveImage(ctx, poster) : undefined;
    body = (
      <video
        className="h-auto w-full rounded-card bg-surface"
        controls
        playsInline
        muted
        preload="none"
        poster={posterImg?.src}
        width={posterImg?.width}
        height={posterImg?.height}
        aria-label={alt}
      >
        <source src={assetUrl(ctx.collection, ctx.slug, src)} />
      </video>
    );
  } else {
    const img = await resolveImage(ctx, src);
    body = (
      <Image
        src={img.src}
        alt={alt}
        width={img.width}
        height={img.height}
        placeholder={img.blurDataURL ? "blur" : "empty"}
        blurDataURL={img.blurDataURL}
        priority={priority}
        sizes={sizes ?? "(min-width: 64rem) 720px, 100vw"}
        className="h-auto w-full rounded-card bg-surface"
      />
    );
  }

  return (
    <figure className={className}>
      {body}
      {caption && <figcaption className="mt-stack-xs text-step--1 text-muted">{caption}</figcaption>}
    </figure>
  );
}
