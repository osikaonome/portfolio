"use client";

import { create } from "zustand";

type UIState = {
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;

  inspect: boolean;
  setInspect: (on: boolean) => void;
  toggleInspect: () => void;
};

// Inspect mode is mirrored to `?inspect=1` so an annotated view can be shared.
// history.replaceState keeps Next's router in sync without a navigation.
function syncInspectToUrl(on: boolean) {
  const url = new URL(window.location.href);
  if (on) url.searchParams.set("inspect", "1");
  else url.searchParams.delete("inspect");
  window.history.replaceState(window.history.state, "", url);
}

export const useUI = create<UIState>((set, get) => ({
  paletteOpen: false,
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),

  inspect: false,
  setInspect: (inspect) => {
    syncInspectToUrl(inspect);
    set({ inspect });
  },
  toggleInspect: () => get().setInspect(!get().inspect),
}));
