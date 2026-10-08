import Link from "next/link";

export type EntryListItem = { href: string; title: string; summary: string; date: Date; tags: string[] };

const fmt = new Intl.DateTimeFormat("en-IE", { year: "numeric", month: "short", day: "numeric" });

export function formatDate(date: Date) {
  return fmt.format(date);
}

/** Index list used by /lab and /writing. */
export function EntryList({ items, empty }: { items: EntryListItem[]; empty: string }) {
  if (!items.length) return <p className="mt-stack-xl text-muted">{empty}</p>;
  return (
    <ul className="mt-stack-xl divide-y divide-border border-y border-border">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="group grid gap-1 py-stack-m sm:grid-cols-[8rem_1fr] sm:gap-stack-m">
            <time dateTime={item.date.toISOString()} className="font-mono text-step--1 text-muted">
              {formatDate(item.date)}
            </time>
            <span>
              <span className="text-step-1 font-semibold group-hover:underline">{item.title}</span>
              <span className="mt-1 block text-muted">{item.summary}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
