import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const alt = `${site.name} – ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#09090b",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#67e8f9", marginBottom: 24 }}>
          Portfolio
        </div>
        <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -3 }}>
          {site.name}
        </div>
        <div style={{ fontSize: 42, color: "#a1a1aa", marginTop: 16 }}>
          {site.title}
        </div>
        <div style={{ fontSize: 30, marginTop: 48, maxWidth: 900 }}>
          {site.tagline}
        </div>
      </div>
    ),
    size,
  );
}
