import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Fixed, token-driven decorative backdrop: a brand glow, a masked grid, three
 * drifting orbs, and a depth vignette. Fully theme-aware — it recolors with the
 * light/dark tokens. Inlined from the shared @typhed/ui package.
 */
export function AbstractBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background",
        className,
      )}
    >
      {/* top brand glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,hsl(var(--brand)/0.18),transparent_60%)]" />
      {/* masked grid */}
      <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      {/* drifting orbs */}
      <div className="absolute -left-24 -top-32 h-[34rem] w-[34rem] animate-drift-slow rounded-full bg-brand/20 blur-[120px] motion-reduce:animate-none" />
      <div className="absolute -right-32 top-1/3 h-[32rem] w-[32rem] animate-drift-slower rounded-full bg-brand-2/20 blur-[130px] motion-reduce:animate-none" />
      <div className="absolute -bottom-40 left-1/4 h-[28rem] w-[28rem] animate-drift-slow rounded-full bg-brand/15 blur-[120px] motion-reduce:animate-none" />
      {/* depth vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,hsl(var(--background))_96%)]" />
    </div>
  )
}
