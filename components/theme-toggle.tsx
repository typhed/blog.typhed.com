"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

/**
 * Accessible light/dark switch. Renders the light position until mounted to
 * avoid a hydration mismatch. Inlined from the shared @typhed/ui package.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border bg-secondary px-1 ring-offset-background transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Sun
        className="pointer-events-none absolute left-1.5 h-3.5 w-3.5 text-muted-foreground"
        aria-hidden="true"
      />
      <Moon
        className="pointer-events-none absolute right-1.5 h-3.5 w-3.5 text-muted-foreground"
        aria-hidden="true"
      />
      <span
        className={cn(
          "pointer-events-none relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform duration-200",
          isDark ? "translate-x-6" : "translate-x-0",
        )}
      >
        {mounted ? (
          isDark ? (
            <Moon className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Sun className="h-3.5 w-3.5" aria-hidden="true" />
          )
        ) : null}
      </span>
    </button>
  )
}
