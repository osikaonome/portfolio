import { afterEach, describe, expect, it, vi } from "vitest";
import { findTodos, isTodo, todosAllowed } from "@/lib/todo";

describe("isTodo / findTodos", () => {
  it("detects TODO markers as whole words", () => {
    expect(isTodo("TODO: year")).toBe(true);
    expect(isTodo("Todoist")).toBe(false);
    expect(isTodo(2024)).toBe(false);
  });

  it("reports the path of every TODO", () => {
    const data = { year: "TODO: year", role: ["Lead", "TODO: role"], links: { live: "https://x.com" } };
    expect(findTodos(data)).toEqual(["year", "role.1"]);
  });
});

describe("todosAllowed", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is off by default", () => {
    vi.stubEnv("ALLOW_TODOS", "");
    expect(todosAllowed()).toBe(false);
  });

  it("can be opted into for non-production builds", () => {
    vi.stubEnv("ALLOW_TODOS", "1");
    expect(todosAllowed()).toBe(true);
  });

  it("is never allowed on a Vercel production deploy", () => {
    vi.stubEnv("ALLOW_TODOS", "1");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(todosAllowed()).toBe(false);
  });
});
