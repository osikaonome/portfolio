/** Decision → options considered → choice → trade-off. */
export function DecisionLog({
  decision,
  options,
  choice,
  tradeoff,
}: {
  decision: string;
  options: string[];
  choice: string;
  tradeoff: string;
}) {
  return (
    <article className="rounded-card border border-border p-stack-m">
      <p className="eyebrow">Decision</p>
      <h3 className="mt-1! text-step-1 font-semibold">{decision}</h3>
      <dl className="mt-stack-s grid gap-stack-s text-step--1 sm:grid-cols-[8rem_1fr]">
        <dt className="text-muted">Options</dt>
        <dd>
          <ul className="list-disc pl-5">
            {options.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </dd>
        <dt className="text-muted">Chose</dt>
        <dd className="font-semibold text-accent">{choice}</dd>
        <dt className="text-muted">Trade-off</dt>
        <dd>{tradeoff}</dd>
      </dl>
    </article>
  );
}
