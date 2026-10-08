import { contactSchema } from "@/lib/contact";
import { site } from "@/lib/site";

// Best-effort per-instance limit: 5 messages per IP per hour.
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

/**
 * Sends contact form messages to the site owner through Resend.
 * Accepts JSON (the enhanced form) or form posts (no JavaScript), where it
 * redirects to a confirmation page instead of returning JSON.
 *
 * Env: RESEND_API_KEY (required), CONTACT_FROM (a sender on a verified
 * Resend domain; defaults to Resend's test sender).
 */
export async function POST(request: Request) {
  const isForm = !request.headers.get("content-type")?.includes("application/json");
  const reply = (ok: boolean, status: number, error?: string) =>
    isForm
      ? Response.redirect(new URL(`/contact/${ok ? "sent" : "failed"}`, request.url), 303)
      : Response.json(ok ? { ok } : { ok, error }, { status });

  let body: unknown;
  try {
    body = isForm ? Object.fromEntries(await request.formData()) : await request.json();
  } catch {
    return reply(false, 400, "Invalid request.");
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return reply(false, 400, parsed.error.issues[0]?.message ?? "Invalid input.");

  // Bots that fill the honeypot get a fake success.
  if (parsed.data.company) return reply(true, 200);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return reply(false, 429, "Too many messages. Please try again later, or email me directly.");

  const key = process.env.RESEND_API_KEY;
  if (!key) return reply(false, 503, `The form isn't set up yet. Please email ${site.email}.`);

  const { name, email, message } = parsed.data;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: [site.email],
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    }),
  });

  if (!res.ok) return reply(false, 502, `Sorry, that didn't send. Please email ${site.email}.`);
  return reply(true, 200);
}
