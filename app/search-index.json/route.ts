import { buildSearchIndex } from "@/lib/search";

// Built once at build time; fetched the first time the palette opens.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex());
}
