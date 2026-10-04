import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, Senior Frontend Engineer and Tech Lead`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#0d1713",
          color: "#e9f0eb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 30, color: "#5fd4a0" }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#5fd4a0", marginRight: 16 }} />
          {profile.status}
        </div>
        <div style={{ display: "flex", fontSize: 112, fontWeight: 800, letterSpacing: -4, marginTop: 28 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", fontSize: 52, marginTop: 12, color: "#b7c7be" }}>
          {profile.headline}
          <span style={{ color: "#f0a64e", marginLeft: 14 }}>Tech Lead</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 56, color: "#93a89d" }}>{profile.handle}.com</div>
      </div>
    ),
    size,
  );
}
