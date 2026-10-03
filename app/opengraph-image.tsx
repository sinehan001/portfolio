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
          background: "radial-gradient(circle at 80% 40%, #0f3a20 0%, #040705 55%)",
          color: "#e9f0ea",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 26, color: "#d4af37", letterSpacing: 8, marginBottom: 24 }}>
          ✦ DOOMSDAY EDITION ✦
        </div>
        <div style={{ fontSize: 130, fontWeight: 700, letterSpacing: 4, color: "#f1f5f6" }}>
          {site.name.toUpperCase()}
        </div>
        <div style={{ fontSize: 40, color: "#9bab9f", marginTop: 12 }}>{site.title}</div>
        <div style={{ fontSize: 30, marginTop: 44, maxWidth: 900, color: "#3ddc84" }}>
          I forge reliable backends and GenAI systems that bend real data to their will.
        </div>
      </div>
    ),
    size,
  );
}
