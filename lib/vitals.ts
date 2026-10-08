"use client";

import { useSyncExternalStore } from "react";

export type Vital = { name: string; value: number; rating?: string };

// The visitor's own Web Vitals for this session, shown in inspect mode.
let vitals: Record<string, Vital> = {};
const listeners = new Set<() => void>();

export function recordVital(v: Vital) {
  vitals = { ...vitals, [v.name]: v };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useVitals() {
  return useSyncExternalStore(
    subscribe,
    () => vitals,
    () => vitals,
  );
}

export function formatVital({ name, value }: Vital) {
  if (name === "CLS") return value.toFixed(3);
  return `${Math.round(value)} ms`;
}
