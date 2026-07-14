"use client"

import * as React from "react"
import { useAuth } from "@clerk/react"

import { AccessPanel } from "@/components/access-panel"
import { RelatedPosts } from "@/components/related-posts"
import { TableOfContents } from "@/components/table-of-contents"
import { type AccessLink, hasAccessLinks } from "@/lib/access-links"
import { type AccessCategory, CLERK_ENABLED } from "@/lib/constants"
import type { PostMeta } from "@/lib/posts"
import type { TocItem } from "@/lib/rehype-collect-headings"
import { cn } from "@/lib/utils"

/**
 * Multi-column post layout: the table of contents on the left, the article in
 * the middle, and the "Trade With" access panel + "Related" posts list on the
 * right. The block spans ~90% of the viewport from `md` up and collapses to a
 * single centered reading column below it, where the rails are too narrow to be
 * useful.
 *
 * The columns adapt to what a post actually has, so a missing rail never leaves
 * an empty column. With both rails the split is 16% TOC / 64% article / 20%
 * panels capped at 76rem (the article keeps a ~46rem reading measure); with only
 * one rail it falls back to a 20/80 (TOC left) or 80/20 (panels right) two-column
 * grid capped at 64rem; with neither, the article gets the full single column.
 *
 * The article stays first in the DOM - the natural reading and mobile order -
 * and is placed into its column explicitly on `md+`, so screen readers reach
 * the body before the side rails even though the TOC renders to its left.
 *
 * The TOC is a signed-in feature for freemium posts - hidden until the reader
 * signs in, mirroring how the body is gated - while public posts always show
 * it. With Clerk unconfigured (e.g. local dev) the TOC shows for every post,
 * the same ungated fallback the body uses. The access panel and the related
 * list are keyed only to the frontmatter, so they are never gated.
 *
 * `article` is the server-rendered post (header + gated body) passed in as a
 * prop so this client component can switch layouts without an empty rail
 * flashing in.
 */
function Shell({
  article,
  headings,
  showToc,
  links,
  relatedPosts,
}: {
  article: React.ReactNode
  headings: TocItem[]
  showToc: boolean
  links?: Record<string, AccessLink>
  relatedPosts?: PostMeta[]
}) {
  const tocVisible = showToc && headings.length > 0
  const linksVisible = hasAccessLinks(links)
  const relatedVisible = Boolean(relatedPosts && relatedPosts.length > 0)

  const hasLeft = tocVisible
  const hasRight = linksVisible || relatedVisible

  if (!hasLeft && !hasRight) {
    return <div className="mx-auto w-[90%] max-w-3xl">{article}</div>
  }

  // Pick the column template from which rails have content. Class strings are
  // written as complete literals so Tailwind's JIT can see them.
  const layout =
    hasLeft && hasRight
      ? {
          container: "max-w-[76rem] md:grid-cols-[16fr_64fr_20fr]",
          article: "md:col-start-2",
          left: "md:col-start-1",
          right: "md:col-start-3",
        }
      : hasLeft
        ? {
            container: "max-w-[64rem] md:grid-cols-[20fr_80fr]",
            article: "md:col-start-2",
            left: "md:col-start-1",
            right: "",
          }
        : {
            container: "max-w-[64rem] md:grid-cols-[80fr_20fr]",
            article: "md:col-start-1",
            left: "",
            right: "md:col-start-2",
          }

  return (
    <div className={cn("mx-auto grid w-[90%] grid-cols-1 gap-8", layout.container)}>
      <div className={cn("min-w-0 md:row-start-1", layout.article)}>{article}</div>
      {hasLeft ? (
        <aside className={cn("hidden md:row-start-1 md:block", layout.left)}>
          <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      ) : null}
      {hasRight ? (
        <aside className={cn("hidden md:row-start-1 md:block", layout.right)}>
          <div className="sticky top-24 max-h-[calc(100dvh-8rem)] space-y-6 overflow-y-auto">
            {linksVisible ? <AccessPanel links={links} /> : null}
            {relatedVisible ? <RelatedPosts posts={relatedPosts as PostMeta[]} /> : null}
          </div>
        </aside>
      ) : null}
    </div>
  )
}

function GatedShell({
  article,
  headings,
  accessCategory,
  links,
  relatedPosts,
}: {
  article: React.ReactNode
  headings: TocItem[]
  accessCategory: AccessCategory
  links?: Record<string, AccessLink>
  relatedPosts?: PostMeta[]
}) {
  const { isLoaded, isSignedIn } = useAuth()
  // Public posts always show the TOC; freemium posts reveal it only once the
  // reader is signed in, the same condition that reveals the body.
  const showToc = accessCategory === "public" ? true : isLoaded && Boolean(isSignedIn)
  return (
    <Shell
      article={article}
      headings={headings}
      showToc={showToc}
      links={links}
      relatedPosts={relatedPosts}
    />
  )
}

export function PostBody({
  article,
  headings,
  accessCategory,
  links,
  relatedPosts,
}: {
  article: React.ReactNode
  headings: TocItem[]
  accessCategory: AccessCategory
  links?: Record<string, AccessLink>
  relatedPosts?: PostMeta[]
}) {
  // Clerk not configured: no sign-in exists, so the TOC is ungated like the
  // body. Guard here so useAuth is never called without a provider.
  if (!CLERK_ENABLED) {
    return (
      <Shell
        article={article}
        headings={headings}
        showToc={headings.length > 0}
        links={links}
        relatedPosts={relatedPosts}
      />
    )
  }
  return (
    <GatedShell
      article={article}
      headings={headings}
      accessCategory={accessCategory}
      links={links}
      relatedPosts={relatedPosts}
    />
  )
}

export default PostBody
