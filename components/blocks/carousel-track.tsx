"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Scroll-snap track. The position indicator shows only while it is a carousel. */
export function CarouselTrack({ children, count, label }: { children: ReactNode; count: number; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setIndex(items.indexOf(e.target as HTMLElement));
        }
      },
      { root: el, threshold: 0.6 },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  return (
    <div role="group" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={track}
        tabIndex={0}
        className="scrollbar-none -mx-gutter flex snap-x snap-mandatory gap-stack-s overflow-x-auto overscroll-x-contain px-gutter @2xl:mx-0 @2xl:grid @2xl:grid-cols-2 @2xl:overflow-visible @2xl:px-0 @5xl:grid-cols-3"
      >
        {children}
      </div>
      <p className="mt-stack-xs text-center font-mono text-[0.72rem] text-muted @2xl:hidden" aria-live="polite">
        {index + 1} / {count}
      </p>
    </div>
  );
}
