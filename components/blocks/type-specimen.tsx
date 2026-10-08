const scale = ["var(--step-5)", "var(--step-3)", "var(--step-1)", "var(--step-0)"];

/** Typeface showcase: name, weights and a sample across the type scale. */
export function TypeSpecimen({
  name,
  family,
  weights = [400],
  sample = "Sphinx of black quartz, judge my vow",
}: {
  name: string;
  /** CSS font-family value, e.g. "var(--font-display)" or "Georgia, serif". */
  family: string;
  weights?: number[];
  sample?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-card border border-border">
      <div className="flex items-baseline justify-between gap-2 border-b border-border px-stack-m py-stack-xs">
        <figcaption className="font-semibold">{name}</figcaption>
        <span className="font-mono text-[0.72rem] text-muted">{weights.join(" · ")}</span>
      </div>
      <div className="space-y-stack-s overflow-hidden p-stack-m" style={{ fontFamily: family }}>
        <p className="text-step-6 leading-none" aria-hidden>
          Aa Gg Rr 123
        </p>
        {scale.map((size, i) => (
          <p key={size} className="truncate leading-tight" style={{ fontSize: size, fontWeight: weights[i % weights.length] }}>
            {sample}
          </p>
        ))}
      </div>
    </figure>
  );
}
