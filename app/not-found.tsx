import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page pt-stack-2xl">
      <p className="eyebrow">404</p>
      <h1 className="mt-stack-xs font-display text-step-5">Nothing here.</h1>
      <p className="mt-stack-s text-muted">
        The page may have moved. Try <Link className="text-accent underline" href="/work">the work index</Link> or
        press <kbd className="font-mono">⌘K</kbd> to search.
      </p>
    </div>
  );
}
