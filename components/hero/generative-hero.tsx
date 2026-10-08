"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { site } from "@/lib/site";
import { hourIn, paletteForHour } from "./sky";

const noopSubscribe = () => () => {};

type Nav = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

/** Static image instead of animation for reduced motion, data saver or low-power devices. */
function shouldAnimate() {
  const nav = navigator as Nav;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) < 4 || (nav.hardwareConcurrency ?? 8) < 4) return false;
  return true;
}

/**
 * The one generative moment: wind-like lines over a sky gradient whose
 * colours follow the time of day in Dublin. Canvas 2D, no dependencies.
 * Mobile gets a lower pixel ratio and 30fps; it pauses when offscreen.
 */
export function GenerativeHero() {
  const canvas = useRef<HTMLCanvasElement>(null);
  // Client-only: the hour at build time would be meaningless. Snapshots are
  // stable objects from a fixed table, so this doesn't re-render needlessly.
  const palette = useSyncExternalStore(
    noopSubscribe,
    () => paletteForHour(hourIn(site.timeZone)),
    () => null,
  );

  useEffect(() => {
    if (!palette) return;
    const p = palette;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    const small = matchMedia("(max-width: 48rem)").matches;
    const dpr = Math.min(devicePixelRatio || 1, small ? 1 : 2);
    const frameMs = small ? 1000 / 30 : 0;
    const animate = shouldAnimate();
    let w = 0;
    let h = 0;

    function resize() {
      const r = el!.getBoundingClientRect();
      w = r.width;
      h = r.height;
      el!.width = Math.round(w * dpr);
      el!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(t: number) {
      const g = ctx!.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, p.top);
      g.addColorStop(1, p.bottom);
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, h);

      const lines = small ? 14 : 24;
      ctx!.strokeStyle = p.line;
      ctx!.lineWidth = 1;
      for (let i = 0; i < lines; i++) {
        const y0 = (h / (lines + 1)) * (i + 1);
        ctx!.globalAlpha = 0.12 + 0.35 * (i / lines);
        ctx!.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const y =
            y0 +
            Math.sin(x * 0.006 + t * 0.00035 + i * 0.7) * 10 +
            Math.sin(x * 0.013 - t * 0.0005 + i) * 5;
          if (x === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }

    resize();
    draw(0);
    if (!animate) return;

    let raf = 0;
    let last = 0;
    let visible = true;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || t - last < frameMs) return;
      last = t;
      draw(t);
    };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const ro = new ResizeObserver(() => {
      resize();
      draw(last);
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [palette]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-panel bg-gradient-to-b from-surface-2 to-surface">
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
      {palette && (
        <p className="absolute bottom-3 left-3 rounded-full bg-black/35 px-2.5 py-1 font-mono text-[0.68rem] text-white backdrop-blur">
          Dublin sky · {palette.name}
        </p>
      )}
    </div>
  );
}
