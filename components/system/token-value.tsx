"use client";

import { useEffect, useState } from "react";

/** Shows a token's live computed value, so /system always reflects the current theme. */
export function TokenValue({ name }: { name: string }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const read = () => setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
    read();
    // Theme changes flip data-theme on <html> or the system preference.
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", read);
    return () => {
      mo.disconnect();
      mq.removeEventListener("change", read);
    };
  }, [name]);

  return <code className="font-mono text-[0.72rem] break-all text-muted">{value || name}</code>;
}
