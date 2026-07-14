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

/**
 * Two-column post layout: a left rail beside the article. The rail stacks up to
 * three sections - the table of contents, the "Trade With" access panel, and
 * the "Related" posts list - and each is rendered only when it has content, so a
 * post with no `links`/`related` frontmatter simply shows fewer sections (and a
 * post with none of the three drops the rail entirely for a single centered
 * reading column). The pair spans ~90% of the viewport, split 22% rail / 78%
 * article from `md` up and capped at 66rem so the reading column stops widening
 * on large screens; it collapses to the single reading column below `md`, where
 * the rail is too narrow to be useful.
 *
 * The article stays first in the DOM - the natural reading and mobile order -
 * and is placed into the right column explicitly on `md+`, so screen readers
 * reach the body before the rail even though the rail renders to its left.
 *
 * The TOC is a signed-in feature for freemium posts - hidden until the reader
 * signs in, mirroring how the body is gated - while public posts always show
 * it. With Clerk unconfigured (e.g. local dev) the TOC shows for every post,
 * the same ungated fallback the body uses. The access panel and the related
 * list are keyed only to the frontmatter, so they are never gated - they appear
 * only when the post declares them.
 *
 * `article` is the server-rendered post (header + gated body) passed in as a
 * prop so this client component can switch between the two-column grid and a
 * full-width single column without an empty rail flashing in.
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

  if (!tocVisible && !linksVisible && !relatedVisible) {
    return <div className="mx-auto w-[90%] max-w-3xl">{article}</div>
  }

  return (
    <div className="mx-auto grid w-[90%] max-w-[66rem] grid-cols-1 gap-8 md:grid-cols-[22fr_78fr]">
      {/* Article first in the DOM for reading/mobile order; placed in the right
          column on md+ so the left rail renders visually before it. */}
      <div className="min-w-0 md:col-start-2 md:row-start-1">{article}</div>
      <aside className="hidden md:col-start-1 md:row-start-1 md:block">
        <div className="sticky top-24 max-h-[calc(100dvh-8rem)] space-y-6 overflow-y-auto">
          {tocVisible ? <TableOfContents headings={headings} /> : null}
          {linksVisible ? <AccessPanel links={links} /> : null}
          {relatedVisible ? <RelatedPosts posts={relatedPosts as PostMeta[]} /> : null}
        </div>
      </aside>
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
