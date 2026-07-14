import * as React from "react"

import { resolvePlatform } from "@/components/platform-icons"
import type { AccessLink } from "@/lib/access-links"
import { cn } from "@/lib/utils"

/**
 * Right-rail "Trade With" panel driven by a post's `links` frontmatter block.
 * Renders every platform the author lists, in order, with its mark: an entry
 * whose `link` is a real URL becomes an active, branded call-to-action that
 * opens the platform in a new tab; an entry with an empty/missing `link`
 * renders dimmed and disabled (a "coming soon" placeholder). The whole panel is
 * omitted upstream when there is no `links` block.
 *
 * The rail is narrow (~130-200px), so each entry stacks the button beneath the
 * icon and name rather than placing them side by side, which would truncate the
 * platform label. Colors come from theme tokens, so it tracks light/dark.
 */
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      width={14}
      height={14}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function isPopulated(link: AccessLink["link"]): link is string {
  return typeof link === "string" && link.trim().length > 0
}

export function AccessPanel({ links }: { links: Record<string, AccessLink> }) {
  const entries = Object.entries(links)
  if (entries.length === 0) return null

  return (
    <section
      aria-label="Trade with"
      className="rounded-xl border border-border bg-card/50 px-1.5 pb-1.5"
    >
      <p className="px-2 pb-1 pt-2.5 font-display text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Trade With
      </p>
      <ul className="divide-y divide-border/60">
        {entries.map(([slug, entry]) => {
          const { label, Icon } = resolvePlatform(slug)
          const active = isPopulated(entry.link)
          const rtag = entry.rtag?.trim() || "Get Access"

          return (
            <li key={slug} className="px-1 py-2.5">
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    active ? "text-foreground" : "text-muted-foreground/40",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-sm font-medium",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                  {entry.type ? (
                    <span className="block truncate text-[10px] leading-tight text-muted-foreground/70">
                      {entry.type}
                    </span>
                  ) : null}
                </span>
              </div>

              {active ? (
                <a
                  href={entry.link as string}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-opacity hover:opacity-90"
                >
                  {rtag}
                  <ArrowRight />
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  className="mt-2 flex w-full cursor-not-allowed items-center justify-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground/60"
                >
                  {rtag}
                  <ArrowRight />
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default AccessPanel
