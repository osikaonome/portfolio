import { contrastRatio } from "@/lib/contrast";

export type Swatch = { name: string; hex: string };

/** Colour swatches with hex values and contrast ratios against white and black. */
export function Palette({ colors }: { colors: Swatch[] }) {
  return (
    <ul className="@container grid grid-cols-2 gap-stack-s sm:grid-cols-3">
      {colors.map((c) => {
        const onWhite = contrastRatio(c.hex, "#ffffff");
        const onBlack = contrastRatio(c.hex, "#000000");
        return (
          <li key={c.hex} className="overflow-hidden rounded-card border border-border">
            <div className="flex aspect-[4/3] items-end p-2 font-mono text-[0.7rem]" style={{ background: c.hex, color: onWhite > onBlack ? "#fff" : "#000" }}>
              Aa
            </div>
            <div className="p-2 text-step--1">
              <p className="font-semibold">{c.name}</p>
              <p className="font-mono text-muted uppercase">{c.hex}</p>
              <p className="mt-1 font-mono text-[0.7rem] text-muted">
                <Ratio label="on white" value={onWhite} /> · <Ratio label="on black" value={onBlack} />
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Ratio({ label, value }: { label: string; value: number }) {
  return (
    <span title={value >= 4.5 ? "Passes WCAG AA" : value >= 3 ? "AA for large text only" : "Fails AA"}>
      {value.toFixed(1)}:1 {label} {value >= 4.5 ? "✓" : ""}
    </span>
  );
}
