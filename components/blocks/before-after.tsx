import { resolveImage, type AssetContext } from "@/lib/images";
import { BeforeAfterSlider } from "./before-after-slider";

type Shot = { src: string; alt: string };

/** Draggable comparison. Operable by touch, mouse and keyboard (it's a range input). */
export async function BeforeAfter({ ctx, before, after, caption }: { ctx: AssetContext; before: Shot; after: Shot; caption?: string }) {
  const [b, a] = await Promise.all([resolveImage(ctx, before.src), resolveImage(ctx, after.src)]);
  return (
    <figure>
      <BeforeAfterSlider before={{ ...b, alt: before.alt }} after={{ ...a, alt: after.alt }} />
      {caption && <figcaption className="mt-stack-xs text-step--1 text-muted">{caption}</figcaption>}
    </figure>
  );
}
