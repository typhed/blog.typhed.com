import type { MetadataRoute } from "next"

import { SITE } from "@/lib/constants"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} - ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b1020",
    theme_color: "#0b1020",
    icons: [
      { src: "/brand/favicon/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/brand/favicon/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { src: "/brand/favicon/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
      {
        src: "/brand/favicon/maskable-icon-512x512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  }
}
