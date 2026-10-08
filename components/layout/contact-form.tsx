"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const field =
  "mt-1 block w-full rounded-card border border-border bg-bg px-3 py-2.5 text-step-0 text-fg placeholder:text-muted focus-visible:border-fg";

/** Posts to /api/contact. Without JavaScript it's a plain form post. */
export function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        form.reset();
        setState({ kind: "sent" });
      } else {
        setState({ kind: "error", message: data.error ?? "Something went wrong." });
      }
    } catch {
      setState({ kind: "error", message: `Couldn't send. Please email ${site.email}.` });
    }
  }

  if (state.kind === "sent") {
    return (
      <p role="status" className="rounded-card border border-border bg-bg p-stack-m">
        Thanks, your message is on its way. I’ll reply by email.
      </p>
    );
  }

  return (
    <form action="/api/contact" method="post" onSubmit={onSubmit} className="grid max-w-xl gap-stack-s" noValidate={false}>
      <div className="grid gap-stack-s sm:grid-cols-2">
        <label className="text-step--1">
          Name
          <input name="name" required maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="text-step--1">
          Email
          <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
        </label>
      </div>
      <label className="text-step--1">
        Message
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} className={field} />
      </label>
      {/* Honeypot, hidden from people and assistive tech */}
      <div aria-hidden className="hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-stack-s">
        <button
          type="submit"
          disabled={state.kind === "sending"}
          className="tap inline-flex items-center rounded-full bg-fg px-5 text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {state.kind === "sending" ? "Sending…" : "Send message"}
        </button>
        <p aria-live="polite" className="text-step--1 text-muted">
          {state.kind === "error" && <span className="text-fg">{state.message}</span>}
        </p>
      </div>
    </form>
  );
}
