"use client"

import { useEffect, type CSSProperties } from "react"

import { cn } from "@/lib/utils"

/**
 * A single AdSense ad slot. Drop it anywhere in a post or page. Renders nothing
 * unless NEXT_PUBLIC_ADSENSE_CLIENT_ID is set, and requires <GoogleAdSense /> to
 * be mounted (it is, in the root layout).
 *
 * @example
 * <AdUnit slot="1234567890" />
 */
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

interface AdUnitProps {
  /** The ad slot id from your AdSense dashboard. */
  slot: string
  format?: string
  responsive?: boolean
  className?: string
  style?: CSSProperties
}

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className,
  style,
}: AdUnitProps) {
  useEffect(() => {
    if (!ADSENSE_CLIENT_ID) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle ?? []).push({})
    } catch {
      // The AdSense script may be blocked or not yet ready; ignore.
    }
  }, [])

  if (!ADSENSE_CLIENT_ID) return null

  return (
    <ins
      className={cn("adsbygoogle block", className)}
      style={{ display: "block", ...style }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  )
}
