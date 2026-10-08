export type Metric = { label: string; value: string; before?: string; note?: string };

/** Headline numbers, optionally as before → after. */
export function MetricRow({ items }: { items: Metric[] }) {
  return (
    <div className="@container">
      <dl className="flex flex-wrap gap-px overflow-hidden rounded-card border border-border bg-border">
        {items.map((m) => (
          <div key={m.label} className="flex-[1_1_9rem] bg-bg p-stack-s">
            <dt className="eyebrow">{m.label}</dt>
            <dd className="mt-1">
              {m.before && (
                <span className="mr-1.5 text-step--1 text-muted line-through decoration-muted/60">
                  <span className="sr-only">from </span>
                  {m.before}
                </span>
              )}
              <span className="font-display text-step-3 leading-none">
                {m.before && <span className="sr-only">to </span>}
                {m.value}
              </span>
              {m.note && <span className="mt-1 block text-step--1 text-muted">{m.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
