"use client"

import * as React from "react"

import type { TocItem } from "@/lib/rehype-collect-headings"
import { cn } from "@/lib/utils"

/**
 * Sticky "On this page" navigation built from the headings collected at build
 * time (see `rehypeCollectHeadings`). An IntersectionObserver highlights the
 * section nearest the top of the viewport as the reader scrolls. Rendered only
 * in the right rail on `xl` screens; the parent hides it below that.
 */
const INDENT = ["pl-4", "pl-8", "pl-12"] as const

export function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = React.useState("")

  React.useEffect(() => {
    if (headings.length === 0) return
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        )
        setActiveId(topmost.target.id)
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const minDepth = Math.min(...headings.map((h) => h.depth))

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 font-display text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        On this page
      </p>
      <ul className="border-l border-border/60">
        {headings.map((h) => {
          const isActive = h.id === activeId
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={() => setActiveId(h.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1 leading-snug transition-colors",
                  INDENT[Math.min(h.depth - minDepth, INDENT.length - 1)],
                  isActive
                    ? "border-brand font-medium text-brand"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default TableOfContents
