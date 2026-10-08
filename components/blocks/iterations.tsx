import Image from "next/image";
import { resolveImage, type AssetContext } from "@/lib/images";

export type Iteration = { src: string; alt: string; label: string };

/** A sequence of explorations ending in the final design (the last item). */
export async function Iterations({ ctx, items }: { ctx: AssetContext; items: Iteration[] }) {
  const images = await Promise.all(items.map((i) => resolveImage(ctx, i.src)));
  return (
    <ol className="@container grid grid-cols-2 gap-stack-s @2xl:grid-cols-4">
      {items.map((item, i) => {
        const final = i === items.length - 1;
        return (
          <li key={item.src} className={final ? "col-span-2 @2xl:col-span-1" : ""}>
            <Image
              src={images[i].src}
              alt={item.alt}
              width={images[i].width}
              height={images[i].height}
              placeholder={images[i].blurDataURL ? "blur" : "empty"}
              blurDataURL={images[i].blurDataURL}
              sizes="(min-width: 64rem) 200px, 50vw"
              className={`h-auto w-full rounded-card bg-surface ${final ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : "opacity-80"}`}
            />
            <p className="mt-stack-2xs font-mono text-[0.72rem] text-muted">
              {String(i + 1).padStart(2, "0")} · {item.label}
              {final && <span className="text-accent"> · Final</span>}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
