"use client"

import * as React from "react"

import {
  TEXT_SIZE_DEFAULT,
  TEXT_SIZE_MAX,
  TEXT_SIZE_MIN,
  applyScale,
  nextScale,
  previousScale,
  readStoredScale,
} from "@/lib/text-size"
import { cn } from "@/lib/utils"

/**
 * Site-wide text-size control: a smaller "A" that shrinks and a larger "A" that
 * grows every piece of text on the page. It writes the `--font-scale` CSS
 * variable, which the root font-size reads, so all rem/em typography rescales at
 * once (headings, body, nav, code, KaTeX). The persisted value is applied before
 * paint by the init script in `app/layout.tsx`; here we read it once on mount so
 * the disabled-at-limit state matches. Rendering the default until mounted keeps
 * server and first client render identical (no hydration mismatch).
 */
export function TextSizeToggle() {
  const [scale, setScale] = React.useState(TEXT_SIZE_DEFAULT)

  React.useEffect(() => {
    setScale(readStoredScale())
  }, [])

  const update = (value: number) => {
    setScale(value)
    applyScale(value)
  }

  // Tolerance guards against float-comparison edge cases at the bounds.
  const canDecrease = scale > TEXT_SIZE_MIN + 1e-9
  const canIncrease = scale < TEXT_SIZE_MAX - 1e-9

  const buttonClass =
    "inline-flex h-6 w-6 items-center justify-center rounded-full font-semibold leading-none text-muted-foreground ring-offset-background transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"

  return (
    <div
      role="group"
      aria-label="Text size"
      className="inline-flex h-8 shrink-0 items-center gap-0.5 rounded-full border border-border bg-secondary px-1"
    >
      <button
        type="button"
        aria-label="Decrease text size"
        title="Decrease text size"
        disabled={!canDecrease}
        onClick={() => update(previousScale(scale))}
        className={cn(buttonClass, "text-[0.7rem]")}
      >
        A
      </button>
      <button
        type="button"
        aria-label="Increase text size"
        title="Increase text size"
        disabled={!canIncrease}
        onClick={() => update(nextScale(scale))}
        className={cn(buttonClass, "text-base")}
      >
        A
      </button>
    </div>
  )
}
