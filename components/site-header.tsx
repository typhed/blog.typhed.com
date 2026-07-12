import Link from "next/link"

import { NAV_LINKS, SITE } from "@/lib/constants"
import { AuthButtons } from "@/components/auth-buttons"
import { ThemeToggle } from "@/components/theme-toggle"

/**
 * Minimal placeholder header: wordmark + nav + theme toggle. Deliberately
 * simple — replace it with your own design as the blog grows.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            {SITE.brand}
          </span>
          <span className="rounded-md bg-brand/15 px-1.5 py-0.5 font-display text-xs font-medium uppercase tracking-wider text-brand">
            Blog
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          <AuthButtons />
        </nav>
      </div>
    </header>
  )
}
