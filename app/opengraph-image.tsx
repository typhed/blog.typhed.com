import { ImageResponse } from "next/og"

import { SITE } from "@/lib/constants"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = `${SITE.name} - ${SITE.tagline}`
export const dynamic = "force-static"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b1020 0%, #0e1733 100%)",
          color: "#e1e7ef",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#20d3ee" }}>TyPhed</div>
          <div style={{ fontSize: 30, fontWeight: 600, opacity: 0.85 }}>Blog</div>
        </div>
        <div style={{ marginTop: 24, fontSize: 42, fontWeight: 600 }}>{SITE.tagline}</div>
        <div style={{ marginTop: 16, fontSize: 24, opacity: 0.7 }}>{SITE.legalEntity}</div>
      </div>
    ),
    { ...size },
  )
}
