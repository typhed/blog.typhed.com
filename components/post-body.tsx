"use client"

import * as React from "react"
import { useAuth } from "@clerk/react"

import { TableOfContents } from "@/components/table-of-contents"
import { type AccessCategory, CLERK_ENABLED } from "@/lib/constants"
import type { TocItem } from "@/lib/rehype-collect-headings"

/**
 * Two-column post layout: the article beside a right-side rail. The pair spans
 * ~90% of the viewport, split 80% article / 20% rail from `md` up, but is capped
 * at 64rem so the reading column stops widening on large screens (the block then
 * centers). The wider cap keeps the article's reading width unchanged from the
 * former 85/15-at-60rem split while giving the rail more room. It stacks to a
 * single centered reading column below `md`, where a 20% rail is too narrow to
 * be useful.
 *
 * The TOC is a signed-in feature for freemium posts - hidden until the reader
 * signs in, mirroring how the body is gated - while public posts always show
 * it. With Clerk unconfigured (e.g. local dev) the TOC shows for every post,
 * the same ungated fallback the body uses.
 *
 * `article` is the server-rendered post (header + gated body) passed in as a
 * prop so this client component can switch between the two-column grid and a
 * full-width single column without an empty rail flashing in.
 */
function Shell({
  article,
  headings,
  showToc,
}: {
  article: React.ReactNode
  headings: TocItem[]
  showToc: boolean
}) {
  if (!showToc || headings.length === 0) {
    return <div className="mx-auto w-[90%] max-w-3xl">{article}</div>
  }
  return (
    <div className="mx-auto grid w-[90%] max-w-[64rem] grid-cols-1 gap-8 md:grid-cols-[80fr_20fr]">
      <div className="min-w-0">{article}</div>
      <aside className="hidden md:block">
        <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto">
          <TableOfContents headings={headings} />
        </div>
      </aside>
    </div>
  )
}

function GatedShell({
  article,
  headings,
  accessCategory,
}: {
  article: React.ReactNode
  headings: TocItem[]
  accessCategory: AccessCategory
}) {
  const { isLoaded, isSignedIn } = useAuth()
  // Public posts always show the TOC; freemium posts reveal it only once the
  // reader is signed in, the same condition that reveals the body.
  const showToc = accessCategory === "public" ? true : isLoaded && Boolean(isSignedIn)
  return <Shell article={article} headings={headings} showToc={showToc} />
}

export function PostBody({
  article,
  headings,
  accessCategory,
}: {
  article: React.ReactNode
  headings: TocItem[]
  accessCategory: AccessCategory
}) {
  // Clerk not configured: no sign-in exists, so the TOC is ungated like the
  // body. Guard here so useAuth is never called without a provider.
  if (!CLERK_ENABLED) {
    return <Shell article={article} headings={headings} showToc={headings.length > 0} />
  }
  return <GatedShell article={article} headings={headings} accessCategory={accessCategory} />
}

export default PostBody
