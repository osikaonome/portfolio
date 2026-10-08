import Image from "next/image";
import { resolveImage, type AssetContext } from "@/lib/images";
import { CarouselTrack } from "./carousel-track";

export type GalleryItem = { src: string; alt: string; caption?: string };

/**
 * Grid when its container is wide; swipeable carousel with a position
 * indicator when narrow. Uses a container query, so it works in a sidebar
 * or full width.
 */
export async function Gallery({ ctx, items, label = "Gallery" }: { ctx: AssetContext; items: GalleryItem[]; label?: string }) {
  const images = await Promise.all(items.map((i) => resolveImage(ctx, i.src)));
  return (
    <div className="@container">
      <CarouselTrack label={label} count={items.length}>
        {items.map((item, i) => (
          <figure key={item.src} className="w-[85%] shrink-0 snap-center @2xl:w-auto">
            <Image
              src={images[i].src}
              alt={item.alt}
              width={images[i].width}
              height={images[i].height}
              placeholder={images[i].blurDataURL ? "blur" : "empty"}
              blurDataURL={images[i].blurDataURL}
              sizes="(min-width: 64rem) 400px, 85vw"
              className="h-auto w-full rounded-card bg-surface"
            />
            {item.caption && <figcaption className="mt-stack-xs text-step--1 text-muted">{item.caption}</figcaption>}
          </figure>
        ))}
      </CarouselTrack>
    </div>
  );
}
