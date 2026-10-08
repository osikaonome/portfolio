export type TimelineItem = { label: string; title: string; body?: string };

/** Project phases or process steps. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative ml-1.5 border-l border-border">
      {items.map((item) => (
        <li key={item.title} className="relative pb-stack-l pl-stack-l last:pb-0">
          <span aria-hidden className="absolute top-2 -left-[5px] size-2.5 rounded-full border-2 border-bg bg-accent" />
          <p className="eyebrow">{item.label}</p>
          <p className="font-semibold">{item.title}</p>
          {item.body && <p className="mt-1 text-muted">{item.body}</p>}
        </li>
      ))}
    </ol>
  );
}
