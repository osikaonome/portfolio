"use client";

import { useUI } from "@/lib/store";

/** Opens the command palette. ⌘K on desktop; this button everywhere. */
export function SearchButton({ variant }: { variant: "header" | "bottom" }) {
  const open = () => useUI.getState().setPaletteOpen(true);

  if (variant === "bottom") {
    return (
      <button
        type="button"
        onClick={open}
        className="tap flex flex-1 flex-col items-center justify-center gap-0.5 text-[0.7rem] text-muted"
        aria-haspopup="dialog"
      >
        <SearchIcon />
        Search
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      className="tap inline-flex items-center gap-2 rounded-full border border-border px-3 text-step--1 text-muted transition-colors hover:border-fg hover:text-fg"
    >
      <SearchIcon />
      <span>Search</span>
      <kbd className="font-mono text-[0.7rem] tracking-wide">⌘K</kbd>
    </button>
  );
}

export function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  );
}
