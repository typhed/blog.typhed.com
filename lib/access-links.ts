/**
 * Access-links frontmatter types, kept free of any `node:*` imports so that
 * client components (the post rail, the access panel) can import the type and
 * the `hasAccessLinks` guard without pulling `lib/posts.ts` - and its build-time
 * `node:fs`/`node:path` reads - into the browser bundle.
 */

/**
 * One entry in a post's `links` block - a call-to-action to an external trading
 * platform, keyed by platform slug (e.g. `tradingview`). An entry with an
 * empty/missing `link` renders as a disabled "coming soon" row.
 */
export interface AccessLink {
  /** Free-form access descriptor shown as a caption, e.g. "free, public". */
  type?: string
  /** Outbound URL. Empty or missing → the entry renders disabled. */
  link?: string | null
  /** Button label, e.g. "Get Access". Falls back to "Get Access". */
  rtag?: string
}

/** True when the post declares at least one access link. */
export function hasAccessLinks(
  links?: Record<string, AccessLink>,
): links is Record<string, AccessLink> {
  return Boolean(links) && Object.keys(links as Record<string, AccessLink>).length > 0
}
