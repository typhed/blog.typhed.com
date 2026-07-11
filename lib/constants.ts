/**
 * Single source of truth for brand strings, URLs, and navigation.
 *
 * Trimmed from the main typhed.com `@typhed/ui/lib/constants`. Change copy,
 * the canonical URL, or links here rather than in markup. Every metadata,
 * canonical, sitemap, robots, and JSON-LD value derives from `SITE`.
 */
export const SITE = {
  /** Human-facing site name (used in titles and the title template). */
  name: "TyPhed Blog",
  /** Parent brand / Organization name for JSON-LD. */
  brand: "TyPhed",
  tagline: "Engineering Tomorrow",
  legalEntity: "Debmalya Pramanik HUF",
  /** Canonical origin of the blog. Drives metadataBase and all absolute URLs. */
  url: "https://blog.typhed.com",
  /** The main brand homepage this blog belongs to. */
  mainSiteUrl: "https://typhed.com",
  description:
    "Notes, essays, and deep dives from TyPhed - Engineering Tomorrow. Writing on engineering, data, and the craft of building, by Debmalya Pramanik HUF.",
  locale: "en_US",
  /** Default author for posts that do not set one in frontmatter. */
  author: "Debmalya Pramanik",
} as const

export const COPYRIGHT = {
  line1: `Copyright © ${new Date().getFullYear()} TyPhed - Engineering Tomorrow`,
  line2: "This Brand is Maintained and Owned by Debmalya Pramanik HUF",
} as const

export const CONTACT_EMAIL = "pramanik.huf@gmail.com" as const

export type SocialIcon = "github" | "mail" | "external"

export type SocialLink = {
  label: string
  href: string
  icon: SocialIcon
  external: boolean
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "GitHub", href: "https://github.com/typhed", icon: "github", external: true },
  { label: "Main Site", href: SITE.mainSiteUrl, icon: "external", external: true },
  { label: "Contact", href: `mailto:${CONTACT_EMAIL}`, icon: "mail", external: false },
] as const

export type NavLink = { label: string; href: string; external?: boolean }

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Main Site", href: SITE.mainSiteUrl, external: true },
] as const
