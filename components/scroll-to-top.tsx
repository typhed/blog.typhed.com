"use client"

import * as React from "react"
import { ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Floating "back to top" control, pinned to the bottom-center of the viewport.
 * Mounted only from the blog post page (`app/blog/[slug]/page.tsx`), so it never
 * appears on the index or other routes.
 *
 * It stays hidden until the reader has scrolled past `SHOW_AFTER` pixels - at the
 * very top there is nothing to return to - then fades in. Clicking scrolls back
 * to the top, honouring the reader's reduced-motion preference (an instant jump
 * instead of a smooth glide).
 */
const SHOW_AFTER = 400

export function ScrollToTop() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER)
    onScroll() // sync with the position on mount (e.g. deep-linked to an anchor)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })
  }

  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      onClick={scrollToTop}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-6 left-1/2 z-40 inline-flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full",
        "border border-border bg-secondary/90 text-muted-foreground shadow-lg backdrop-blur",
        "ring-offset-background transition-[opacity,transform,color,border-color] duration-200",
        "hover:border-brand/50 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}

export default ScrollToTop
