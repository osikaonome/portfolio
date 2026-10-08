import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact";

const ok = { name: "Ada", email: "ada@example.com", message: "Hello there, a real message." };

describe("contactSchema", () => {
  it("accepts a valid message", () => {
    expect(contactSchema.safeParse(ok).success).toBe(true);
    expect(contactSchema.safeParse({ ...ok, company: "" }).success).toBe(true);
  });

  it("rejects bad emails and very short messages", () => {
    expect(contactSchema.safeParse({ ...ok, email: "nope" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...ok, message: "hi" }).success).toBe(false);
  });

  it("passes the honeypot through so the route can drop bot messages quietly", () => {
    expect(contactSchema.parse({ ...ok, company: "Spam Inc" }).company).toBe("Spam Inc");
  });
});
