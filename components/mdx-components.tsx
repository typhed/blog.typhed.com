import * as React from "react"
import Link from "next/link"
import type { MDXComponents } from "mdx/types"

import { Chart } from "@/components/chart"
import { Mermaid } from "@/components/mermaid"
import { cn } from "@/lib/utils"

/**
 * Element overrides passed to `compileMDX`. Headings, links, lists, tables, and
 * blockquotes are styled with theme tokens so posts match the site design.
 *
 * `pre`/`code` are intentionally NOT overridden — `rehype-pretty-code` owns
 * their markup, and their appearance is styled globally in `app/globals.css`.
 */

function MdxAnchor({ href = "", className, ...props }: React.ComponentPropsWithoutRef<"a">) {
  const isExternal = /^https?:\/\//.test(href)
  const classes = cn(
    "font-medium text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand",
    className,
  )

  if (isExternal) {
    return <a href={href} target="_blank" rel="noreferrer" className={classes} {...props} />
  }
  return <Link href={href} className={classes} {...props} />
}

export const mdxComponents: MDXComponents = {
  // Custom block components injected by `remarkDiagrams` from ```mermaid and
  // ```chart fences. Capitalized keys match the MDX JSX element names.
  Mermaid,
  Chart,
  a: MdxAnchor,
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-10 scroll-mt-24 font-display text-3xl font-bold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-12 scroll-mt-24 border-b border-border/60 pb-2 font-display text-2xl font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-8 scroll-mt-24 font-display text-xl font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "mt-6 scroll-mt-24 font-display text-lg font-semibold text-foreground",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("my-5 leading-7 text-foreground/90", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-5 ml-6 list-disc space-y-2 text-foreground/90", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn("my-5 ml-6 list-decimal space-y-2 text-foreground/90", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }) => <li className={cn("leading-7", className)} {...props} />,
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn("my-6 border-l-2 border-brand/60 pl-4 italic text-muted-foreground", className)}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-10 border-border/60", className)} {...props} />
  ),
  table: ({ className, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border-b border-border bg-muted/50 px-4 py-2 text-left font-semibold text-foreground",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn("border-b border-border/60 px-4 py-2 text-foreground/90", className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }) => (
    // Static export uses unoptimized images; a plain <img> is correct here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("my-6 rounded-lg border border-border", className)}
      alt={alt ?? ""}
      {...props}
    />
  ),
}
