import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#10140f",
          color: "#f3efe6",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, letterSpacing: 6 }}>
          <div style={{ width: 28, height: 28, background: "#e24a2b" }} />
          QWIK TECHNOLOGIES
        </div>
        <div style={{ display: "flex", fontSize: 64, lineHeight: 1.05, maxWidth: 980 }}>
          Creating templates and experiences that drives remarkable change.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#d9d3c7" }}>Prices in naira. Shown in your currency.</div>
      </div>
    ),
    { ...size },
  );
}
