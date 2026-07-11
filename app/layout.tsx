import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"

import "./globals.css"
import "katex/dist/katex.min.css"

import { GoogleAdSense } from "@/components/analytics/google-adsense"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { MicrosoftClarity } from "@/components/analytics/microsoft-clarity"
import { AbstractBackground } from "@/components/abstract-background"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { SITE } from "@/lib/constants"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} - ${SITE.tagline}`,
    template: `%s - ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "TyPhed",
    "TyPhed Blog",
    "Debmalya Pramanik",
    "Debmalya Pramanik HUF",
    "Engineering Tomorrow",
    "engineering blog",
  ],
  authors: [{ name: SITE.author, url: SITE.mainSiteUrl }],
  creator: SITE.legalEntity,
  publisher: SITE.legalEntity,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/brand/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/brand/favicon/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: ["/brand/favicon/favicon.ico"],
    apple: [{ url: "/brand/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/brand/favicon/safari-pinned-tab.svg",
        color: "#6366f1",
      },
    ],
  },
  other: {
    "msapplication-TileColor": "#0b1020",
    "msapplication-config": "/brand/favicon/browserconfig.xml",
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} - ${SITE.tagline}`,
    description: SITE.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} - ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  verification: GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : undefined,
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.mainSiteUrl}/#organization`,
      name: SITE.brand,
      legalName: SITE.legalEntity,
      alternateName: [SITE.legalEntity, "Debmalya Pramanik"],
      url: SITE.mainSiteUrl,
      logo: `${SITE.mainSiteUrl}/brand/mark/typhed-mark-1024.png`,
      slogan: SITE.tagline,
    },
    {
      "@type": "Blog",
      "@id": `${SITE.url}/#blog`,
      name: `${SITE.name} - ${SITE.tagline}`,
      url: SITE.url,
      description: SITE.description,
      inLanguage: "en",
      publisher: { "@id": `${SITE.mainSiteUrl}/#organization` },
    },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AbstractBackground />
          <div className="relative z-10 flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>

        {/* Analytics + monetization. Each no-ops until its NEXT_PUBLIC_* id is set. */}
        <GoogleAnalytics />
        <GoogleAdSense />
        <MicrosoftClarity />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
