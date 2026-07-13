import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeKatex from "rehype-katex"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { AccessBadge } from "@/components/access-badge"
import { FreemiumGate } from "@/components/freemium-gate"
import { mdxComponents } from "@/components/mdx-components"
import { TableOfContents } from "@/components/table-of-contents"
import { SITE } from "@/lib/constants"
import { getAllSlugs, getPostBySlug } from "@/lib/posts"
import { rehypeCollectHeadings, type TocItem } from "@/lib/rehype-collect-headings"
import { remarkDiagrams } from "@/lib/remark-diagrams"

// Static export: only pre-known slugs are built; unknown paths 404.
export const dynamicParams = false

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const canonical = `/blog/${slug}/`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author ?? SITE.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  // Populated during compile by `rehypeCollectHeadings` (runs right after
  // rehypeSlug, so the ids match the rendered anchors) for the table of contents.
  const headings: TocItem[] = []

  const { content } = await compileMDX({
    source: post.body,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkDiagrams, remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          rehypeCollectHeadings(headings),
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          rehypeKatex,
          [
            rehypePrettyCode,
            { theme: { light: "github-light", dark: "github-dark" }, keepBackground: false },
          ],
        ],
      },
    },
  })

  return (
    <div className="container py-12 sm:py-16">
      <div className="mx-auto flex max-w-3xl gap-10 xl:max-w-6xl">
        <div className="min-w-0 flex-1 xl:max-w-3xl">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to all posts
          </Link>

          <article className="mt-8">
            <header className="mb-8 border-b border-border/60 pb-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <AccessBadge category={post.accessCategory} />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTimeText}</span>
                <span aria-hidden="true">·</span>
                <span>{post.author ?? SITE.author}</span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
              {post.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            {post.accessCategory === "freemium" ? <FreemiumGate>{content}</FreemiumGate> : content}
          </article>
        </div>

        {headings.length > 0 ? (
          <aside className="hidden shrink-0 xl:block xl:w-60">
            <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  )
}
