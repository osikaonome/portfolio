"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { InspectNotePayload } from "@/lib/inspect-notes";
import { useUI } from "@/lib/store";
import { formatVital, useVitals } from "@/lib/vitals";

type Target = { id: string; el: HTMLElement; top: number; left: number; width: number; height: number };

const COLOR_TOKENS = ["--color-fg", "--color-muted", "--color-accent", "--color-bg", "--color-surface", "--color-border"];

function hexToRgbString(hex: string) {
  const n = parseInt(hex.trim().slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

/** Which design tokens the element is actually using, read from computed styles. */
function tokensFor(el: HTMLElement) {
  const root = getComputedStyle(document.documentElement);
  const byRgb = new Map<string, string>();
  for (const name of COLOR_TOKENS) {
    const v = root.getPropertyValue(name).trim();
    if (v.startsWith("#")) byRgb.set(hexToRgbString(v), name);
  }
  const s = getComputedStyle(el);
  const font = s.fontFamily.split(",")[0].replace(/["']/g, "");
  return [
    ["Text colour", byRgb.get(s.color) ?? s.color],
    ["Background", byRgb.get(s.backgroundColor) ?? (s.backgroundColor === "rgba(0, 0, 0, 0)" ? "transparent" : s.backgroundColor)],
    ["Font", `${font} · ${s.fontSize}`],
  ] as const;
}

export default function InspectOverlay() {
  const pathname = usePathname();
  const vitals = useVitals();
  const [notes, setNotes] = useState<Record<string, InspectNotePayload>>({});
  const [targets, setTargets] = useState<Target[]>([]);
  const [active, setActive] = useState<{ id: string; pinned: boolean } | null>(null);
  const [wide, setWide] = useState(true);
  const [docHeight, setDocHeight] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    fetch("/inspect-notes.json")
      .then((r) => r.json() as Promise<InspectNotePayload[]>)
      .then((list) => setNotes(Object.fromEntries(list.map((n) => [n.id, n]))))
      .catch(() => {});
  }, []);

  const measure = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const els = [...document.querySelectorAll<HTMLElement>("[data-inspect]")];
      setTargets(
        els
          .map((el) => {
            const r = el.getBoundingClientRect();
            return { id: el.dataset.inspect!, el, top: r.top + scrollY, left: r.left + scrollX, width: r.width, height: r.height };
          })
          .filter((t) => t.width > 0 && t.height > 0),
      );
      setDocHeight(document.documentElement.scrollHeight);
      setWide(matchMedia("(min-width: 48rem) and (pointer: fine)").matches);
    });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      removeEventListener("resize", measure);
      cancelAnimationFrame(frame.current);
    };
  }, [measure, pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (active) setActive(null);
      else useUI.getState().setInspect(false);
    }
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [active]);

  const activeTarget = active ? targets.find((t) => t.id === active.id) : undefined;
  const note = active ? notes[active.id] : undefined;

  return createPortal(
    <>
      {/* HUD: live metrics from this visit */}
      <div
        role="status"
        className="fixed inset-x-0 top-0 z-50 border-b border-accent bg-bg/95 pt-[env(safe-area-inset-top)] font-mono text-[0.72rem] text-muted backdrop-blur"
      >
        <div className="container-page flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
          <span className="text-accent">Inspect mode · {targets.length} annotations</span>
          {["LCP", "INP", "CLS", "FCP", "TTFB"].map((name) => (
            <span key={name}>
              {name} {vitals[name] ? formatVital(vitals[name]) : "–"}
            </span>
          ))}
          <span className="ml-auto hidden md:inline">Tab between markers · Esc to close</span>
        </div>
      </div>

      <div aria-hidden={false} className="pointer-events-none absolute top-0 left-0 z-40 w-full" style={{ height: docHeight }}>
        {targets.map((t, i) => {
          const isActive = active?.id === t.id;
          return (
            <div key={`${t.id}-${i}`}>
              <div
                className="absolute rounded-sm border border-dashed border-accent/70 transition-colors"
                style={{ top: t.top, left: t.left, width: t.width, height: t.height, background: isActive ? "color-mix(in srgb, var(--color-accent) 8%, transparent)" : undefined }}
              />
              <button
                type="button"
                className="tap pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                // Keep markers clear of the fixed HUD at the top of the page.
                style={{ top: Math.max(t.top, 56), left: t.left + 4 }}
                aria-label={`Annotation ${i + 1}: ${notes[t.id]?.title ?? t.id}`}
                aria-expanded={isActive}
                onClick={() => setActive(isActive && active?.pinned ? null : { id: t.id, pinned: true })}
                onMouseEnter={() => wide && !active?.pinned && setActive({ id: t.id, pinned: false })}
                onMouseLeave={() => wide && !active?.pinned && setActive(null)}
                onFocus={() => wide && !active?.pinned && setActive({ id: t.id, pinned: false })}
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-accent font-mono text-[0.7rem] text-accent-fg shadow">
                  {i + 1}
                </span>
              </button>
            </div>
          );
        })}

        {activeTarget && wide && (
          <NotePanel
            note={note}
            id={activeTarget.id}
            el={activeTarget.el}
            onClose={() => setActive(null)}
            className="pointer-events-auto absolute w-80"
            style={{ top: activeTarget.top + 16, left: Math.min(activeTarget.left + 16, innerWidth - 336) }}
          />
        )}
      </div>

      {activeTarget && !wide && (
        <NotePanel
          note={note}
          id={activeTarget.id}
          el={activeTarget.el}
          onClose={() => setActive(null)}
          className="fixed inset-x-0 bottom-0 z-[60] max-h-[70dvh] overflow-y-auto rounded-t-panel pb-[calc(env(safe-area-inset-bottom)+1rem)]"
        />
      )}
    </>,
    document.body,
  );
}

function NotePanel({
  note,
  id,
  el,
  onClose,
  className,
  style,
}: {
  note?: InspectNotePayload;
  id: string;
  el: HTMLElement;
  onClose: () => void;
  className: string;
  style?: React.CSSProperties;
}) {
  const tokens = tokensFor(el);
  return (
    <section
      aria-label={note?.title ?? id}
      className={`border border-border bg-surface p-4 text-step--1 shadow-xl ${className}`}
      style={style}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold">{note?.title ?? id}</h2>
        <button type="button" onClick={onClose} className="tap -m-2 inline-flex items-center justify-center text-muted hover:text-fg" aria-label="Close annotation">
          ✕
        </button>
      </div>
      {note ? (
        <div
          className="mt-2 space-y-2 text-muted [&_a]:underline [&_code]:font-mono [&_code]:text-fg"
          dangerouslySetInnerHTML={{ __html: note.html }}
        />
      ) : (
        <p className="mt-2 text-muted">No annotation written yet for “{id}”.</p>
      )}
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-[0.72rem]">
        {tokens.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className="truncate">{v}</dd>
          </div>
        ))}
      </dl>
      {note &&
        (note.sourceUrl ? (
          <a href={note.sourceUrl} className="mt-3 inline-flex font-mono text-[0.72rem] text-accent underline">
            {note.source}
          </a>
        ) : (
          <p className="mt-3 font-mono text-[0.72rem] text-muted">{note.source}</p>
        ))}
    </section>
  );
}
