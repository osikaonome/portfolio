// TODO placeholders: visible in development, fatal in production builds.
// Content uses "TODO: …" wherever a fact isn't known yet, so nothing is invented.

export const TODO_RE = /\bTODO\b/;

/** TODOs in MDX bodies: the word itself, or a <Todo> block. */
export const BODY_TODO_RE = /\bTODO\b|<Todo\b/g;

export const isTodo = (v: unknown): v is string => typeof v === "string" && TODO_RE.test(v);

/** Paths of every TODO string in a value, e.g. ["year", "role.0"]. */
export function findTodos(value: unknown, path = ""): string[] {
  if (isTodo(value)) return [path || "(value)"];
  if (Array.isArray(value)) return value.flatMap((v, i) => findTodos(v, path ? `${path}.${i}` : String(i)));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => findTodos(v, path ? `${path}.${k}` : k));
  }
  return [];
}

/**
 * TODOs are never allowed in a Vercel production deployment. Elsewhere,
 * `ALLOW_TODOS=1` permits them (local preview builds, CI tests, preview deploys).
 */
export function todosAllowed() {
  if (process.env.VERCEL_ENV === "production") return false;
  return process.env.ALLOW_TODOS === "1";
}
