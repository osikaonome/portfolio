import type { ReactNode } from "react";
import { resolveImage, type AssetContext } from "@/lib/images";
import { ZoomableFigure } from "./zoomable-figure";

/**
 * SVG or image diagram. Inline on desktop; on small screens a tap opens it
 * full-screen where it can be pinch-zoomed and panned.
 * Pass an image `src` from the project folder, or inline SVG as children.
 */
export async function ArchitectureDiagram({
  ctx,
  src,
  alt,
  caption,
  children,
}: {
  ctx: AssetContext;
  src?: string;
  alt: string;
  caption?: string;
  children?: ReactNode;
}) {
  const img = src ? await resolveImage(ctx, src) : undefined;
  return (
    <ZoomableFigure alt={alt} caption={caption} image={img ? { src: img.src, width: img.width, height: img.height } : undefined}>
      {children}
    </ZoomableFigure>
  );
}
