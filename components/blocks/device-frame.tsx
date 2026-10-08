import Image from "next/image";
import { resolveImage, type AssetContext } from "@/lib/images";

type Shot = { src: string; alt: string };

/** Desktop and mobile screenshots side by side; stacked when narrow. */
export async function DeviceFrame({ ctx, desktop, mobile, caption }: { ctx: AssetContext; desktop: Shot; mobile: Shot; caption?: string }) {
  const [d, m] = await Promise.all([resolveImage(ctx, desktop.src), resolveImage(ctx, mobile.src)]);
  return (
    <figure className="@container">
      <div className="grid items-end gap-stack-m @xl:grid-cols-[1fr_auto]">
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          <div className="flex gap-1.5 border-b border-border px-3 py-2" aria-hidden>
            <span className="size-2.5 rounded-full bg-surface-2" />
            <span className="size-2.5 rounded-full bg-surface-2" />
            <span className="size-2.5 rounded-full bg-surface-2" />
          </div>
          <Image src={d.src} alt={desktop.alt} width={d.width} height={d.height} placeholder={d.blurDataURL ? "blur" : "empty"} blurDataURL={d.blurDataURL} sizes="(min-width: 64rem) 720px, 100vw" className="h-auto w-full" />
        </div>
        <div className="mx-auto w-[55%] max-w-56 overflow-hidden rounded-[1.75rem] border-[6px] border-fg/90 bg-surface @xl:w-48">
          <Image src={m.src} alt={mobile.alt} width={m.width} height={m.height} placeholder={m.blurDataURL ? "blur" : "empty"} blurDataURL={m.blurDataURL} sizes="224px" className="h-auto w-full" />
        </div>
      </div>
      {caption && <figcaption className="mt-stack-xs text-step--1 text-muted">{caption}</figcaption>}
    </figure>
  );
}
