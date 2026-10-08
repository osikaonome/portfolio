import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          padding: 72,
          color: "#ecebe6",
          background: "linear-gradient(180deg, #2b2f5c 0%, #ee8f6b 100%)",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 600, lineHeight: 1 }}>{site.name}</div>
        <div style={{ marginTop: 20, fontSize: 34 }}>{site.role}</div>
        <div style={{ marginTop: 8, fontSize: 26, opacity: 0.8 }}>{site.location}</div>
      </div>
    ),
    size,
  );
}
