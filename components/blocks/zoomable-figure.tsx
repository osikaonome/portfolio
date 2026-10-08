"use client";

import { useRef, type ReactNode } from "react";

type Img = { src: string; width: number; height: number };

export function ZoomableFigure({ image, alt, caption, children }: { image?: Img; alt: string; caption?: string; children?: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);

  const content = image ? (
    // Plain <img>: diagrams are usually SVG, which next/image won't optimise anyway.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image.src} alt={alt} width={image.width} height={image.height} loading="lazy" className="h-auto w-full" />
  ) : (
    <div role="img" aria-label={alt} className="[&_svg]:h-auto [&_svg]:w-full">
      {children}
    </div>
  );

  return (
    <figure>
      <div className="relative rounded-card border border-border bg-surface p-stack-s">
        {content}
        <button
          type="button"
          onClick={() => dialog.current?.showModal()}
          className="tap absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full border border-border bg-bg px-3 text-step--1 md:hidden"
        >
          Expand
          <span className="sr-only"> diagram: {alt}</span>
        </button>
      </div>
      {caption && <figcaption className="mt-stack-xs text-step--1 text-muted">{caption}</figcaption>}

      <dialog
        ref={dialog}
        aria-label={alt}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 backdrop:bg-black/60"
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
      >
        <div className="flex h-full flex-col pt-[env(safe-area-inset-top)]">
          <div className="flex items-center justify-between border-b border-border px-4">
            <p className="text-step--1 text-muted">Pinch to zoom</p>
            <button type="button" className="tap" onClick={() => dialog.current?.close()}>
              Close
            </button>
          </div>
          {/* Wider than the viewport so it can be panned; pinch-zoom is native. */}
          <div className="flex-1 overflow-auto overscroll-contain p-4 [touch-action:pan-x_pan-y_pinch-zoom]">
            <div className="w-[200%] max-w-[1600px]">{content}</div>
          </div>
        </div>
      </dialog>
    </figure>
  );
}
