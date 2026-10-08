"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Poster = { src: string; width: number; height: number; blurDataURL?: string };

/**
 * Shared by <LiveDemo> and <PrototypeEmbed>. Renders a poster and only
 * creates the iframe on demand. With `loadOnView`, fine-pointer devices
 * (desktop) load it automatically when it scrolls into view.
 */
export function LazyEmbed({
  src,
  title,
  poster,
  posterAlt,
  aspect,
  loadOnView = false,
  label,
}: {
  src: string;
  title: string;
  poster: Poster;
  posterAlt: string;
  aspect: string;
  loadOnView?: boolean;
  label: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadOnView || !box.current) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || !matchMedia("(pointer: fine)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setLoaded(true);
        io.disconnect();
      }
    }, { rootMargin: "200px" });
    io.observe(box.current);
    return () => io.disconnect();
  }, [loadOnView]);

  return (
    <div ref={box} className="relative overflow-hidden rounded-card border border-border bg-surface" style={{ aspectRatio: aspect }}>
      {loaded ? (
        <iframe src={src} title={title} className="absolute inset-0 size-full" loading="lazy" allow="fullscreen; clipboard-write" />
      ) : (
        <>
          <Image src={poster.src} alt={posterAlt} fill sizes="(min-width: 64rem) 720px, 100vw" placeholder={poster.blurDataURL ? "blur" : "empty"} blurDataURL={poster.blurDataURL} className="object-cover" />
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="tap absolute inset-0 flex items-center justify-center bg-black/25 text-white transition-colors hover:bg-black/35"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-step--1 backdrop-blur">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 4v16l13-8z" />
              </svg>
              {label}
              <span className="sr-only">: {title}</span>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
