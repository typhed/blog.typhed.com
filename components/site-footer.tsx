import { ExternalLink, Mail } from "lucide-react"

import { COPYRIGHT, SITE, SOCIAL_LINKS, type SocialIcon } from "@/lib/constants"

function SocialGlyph({ icon }: { icon: SocialIcon }) {
  if (icon === "github") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.72-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.03 11.03 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
      </svg>
    )
  }
  if (icon === "mail") return <Mail className="h-4 w-4" aria-hidden="true" />
  return <ExternalLink className="h-4 w-4" aria-hidden="true" />
}

/**
 * Minimal placeholder footer: brand line, copyright, and social links.
 * Replace with your own design as the blog grows.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="container flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="font-display text-sm font-semibold text-foreground">
            {SITE.brand} — {SITE.tagline}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{COPYRIGHT.line1}</p>
          <p className="text-xs text-muted-foreground">{COPYRIGHT.line2}</p>
        </div>

        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
              aria-label={link.label}
              title={link.label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
            >
              <SocialGlyph icon={link.icon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
