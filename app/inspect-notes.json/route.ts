import { getInspectNotes } from "@/lib/inspect-notes";

// Generated once at build time; fetched only when inspect mode is switched on.
export const dynamic = "force-static";

export function GET() {
  return Response.json(getInspectNotes());
}
