"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print tap inline-flex items-center rounded-full border border-border px-4 text-step--1 transition-colors hover:border-fg"
    >
      Print / save as PDF
    </button>
  );
}
