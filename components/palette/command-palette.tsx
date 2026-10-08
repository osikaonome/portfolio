"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { searchItems, type SearchItem } from "@/lib/search-query";
import { useUI } from "@/lib/store";
import { SearchIcon } from "@/components/layout/search-button";

let indexPromise: Promise<SearchItem[]> | undefined;
const loadIndex = () =>
  (indexPromise ??= fetch("/search-index.json").then((r) => r.json() as Promise<SearchItem[]>));

/**
 * One component, two presentations: a centred dialog on desktop and a
 * full-screen sheet on mobile. Uses <dialog> for focus trapping and Escape.
 */
export default function CommandPalette() {
  const open = useUI((s) => s.paletteOpen);
  const setOpen = useUI((s) => s.setPaletteOpen);
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const listId = useId();

  useEffect(() => {
    loadIndex().then(setItems).catch(() => setItems([]));
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      input.current?.focus();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  const results = useMemo(() => searchItems(items, query).slice(0, 12), [items, query]);
  const current = Math.min(cursor, Math.max(results.length - 1, 0));

  function go(item: SearchItem | undefined) {
    if (!item) return;
    setOpen(false);
    setQuery("");
    setCursor(0);
    router.push(item.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[current]);
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-label="Search the site"
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === dialog.current && setOpen(false)}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-black/40 backdrop:backdrop-blur-sm md:m-auto md:mt-[12vh] md:h-auto md:max-h-[70vh] md:w-[min(40rem,90vw)] md:rounded-panel md:border md:border-border md:shadow-2xl"
    >
      <div className="flex h-full flex-col pt-[env(safe-area-inset-top)] md:max-h-[70vh]">
        <div className="flex items-center gap-2 border-b border-border px-4">
          <span className="text-muted">
            <SearchIcon />
          </span>
          <input
            ref={input}
            type="search"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[current] ? `${listId}-${current}` : undefined}
            aria-autocomplete="list"
            placeholder="Search projects, writing, pages…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={onKeyDown}
            className="h-14 flex-1 bg-transparent text-step-0 outline-none placeholder:text-muted"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="tap inline-flex items-center justify-center text-step--1 text-muted hover:text-fg"
          >
            <span className="md:hidden">Close</span>
            <kbd className="hidden font-mono text-[0.7rem] md:inline">Esc</kbd>
          </button>
        </div>

        <ul id={listId} role="listbox" aria-label="Results" className="flex-1 overflow-y-auto overscroll-contain p-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-step--1 text-muted">
              {items.length ? `No results for “${query}”` : "Loading…"}
            </li>
          )}
          {results.map((item, i) => (
            <li
              key={item.href}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === current}
              onClick={() => go(item)}
              onMouseMove={() => setCursor(i)}
              className="flex min-h-tap cursor-pointer items-baseline gap-3 rounded-card px-3 py-2 aria-selected:bg-surface"
            >
              <span className="w-16 shrink-0 font-mono text-[0.7rem] uppercase tracking-wide text-muted">{item.type}</span>
              <span className="min-w-0">
                <span className="block truncate">{item.title}</span>
                {item.summary && <span className="block truncate text-step--1 text-muted">{item.summary}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
