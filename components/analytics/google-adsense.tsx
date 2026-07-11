"use client"

import Script from "next/script"

/**
 * Loads the Google AdSense library once for the whole site. Renders nothing
 * unless NEXT_PUBLIC_ADSENSE_CLIENT_ID (e.g. "ca-pub-0000000000000000") is set.
 * Place individual ad slots with the <AdUnit /> component.
 */
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

export function GoogleAdSense() {
  if (!ADSENSE_CLIENT_ID) return null

  return (
    <Script
      id="google-adsense"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
    />
  )
}
