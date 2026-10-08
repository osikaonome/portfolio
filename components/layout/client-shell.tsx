"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { useUI } from "@/lib/store";
import { recordVital } from "@/lib/vitals";

// Both are code-split: normal visitors never download them.
const CommandPalette = dynamic(() => import("@/components/palette/command-palette"), {
  ssr: false,
});
const InspectOverlay = dynamic(() => import("@/components/inspect/inspect-overlay"), {
  ssr: false,
});

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

/** Global keyboard shortcuts, the inspect toggle and lazy overlays. */
export function ClientShell() {
  const paletteOpen = useUI((s) => s.paletteOpen);
  const inspect = useUI((s) => s.inspect);
  // Keep the palette mounted after first open so reopening is instant.
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  if (paletteOpen && !paletteLoaded) setPaletteLoaded(true);

  useReportWebVitals((metric) =>
    recordVital({ name: metric.name, value: metric.value, rating: metric.rating }),
  );

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("inspect") === "1") {
      useUI.setState({ inspect: true });
    }

    function onKey(e: KeyboardEvent) {
      const ui = useUI.getState();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ui.setPaletteOpen(!ui.paletteOpen);
        return;
      }
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "/" && !ui.paletteOpen) {
        e.preventDefault();
        ui.setPaletteOpen(true);
      } else if (e.key.toLowerCase() === "i" && !ui.paletteOpen) {
        ui.toggleInspect();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => useUI.getState().toggleInspect()}
        aria-pressed={inspect}
        aria-keyshortcuts="I"
        className="no-print tap fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom)+0.75rem)] z-50 inline-flex items-center gap-2 rounded-full border border-border bg-bg/90 px-3 font-mono text-[0.75rem] text-muted shadow-sm backdrop-blur-md transition-colors hover:text-fg aria-pressed:border-accent aria-pressed:text-accent md:bottom-4"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M4 20v-6M20 20h-6M20 20v-6" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
        Inspect
        <kbd className="hidden md:inline">I</kbd>
      </button>
      {paletteLoaded && <CommandPalette />}
      {inspect && <InspectOverlay />}
    </>
  );
}
