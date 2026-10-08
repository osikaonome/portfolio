"use client";

import Image from "next/image";
import { useId, useState } from "react";

type Img = { src: string; width: number; height: number; alt: string; blurDataURL?: string };

export function BeforeAfterSlider({ before, after }: { before: Img; after: Img }) {
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <div className="relative overflow-hidden rounded-card border border-border bg-surface select-none" style={{ aspectRatio: `${after.width} / ${after.height}` }}>
      <Image src={after.src} alt={after.alt} fill sizes="(min-width: 64rem) 720px, 100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes="(min-width: 64rem) 720px, 100vw" className="object-cover" />
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.2)]" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-md">
          ↔
        </span>
      </div>
      <span aria-hidden className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[0.7rem] text-white">Before</span>
      <span aria-hidden className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[0.7rem] text-white">After</span>

      {/* The whole surface is the slider: drag anywhere, or use arrow keys. */}
      <label htmlFor={id} className="sr-only">
        Comparison position: before on the left, after on the right
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-valuetext={`${pos}% before`}
        className="absolute inset-0 size-full cursor-ew-resize opacity-0 [touch-action:pan-y]"
      />
    </div>
  );
}
