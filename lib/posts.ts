import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"
import readingTime from "reading-time"

import type { AccessLink } from "@/lib/access-links"
import type { AccessCategory } from "@/lib/constants"

export type { AccessLink } from "@/lib/access-links"

/**
 * Build-time content loader for `content/blog/*.mdx`.
 *
 * Runs only on the server / at build time (uses `node:fs`). Frontmatter is
 * parsed with gray-matter; the raw MDX body is handed to the post page for
 * compilation. Drafts (`draft: true`) are hidden in production builds so an
 * unfinished post can live on `main` without publishing.
 */

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "blog")
const MDX_FILE = /\.mdx?$/

/** Shape authors write in a post's YAML frontmatter. */
export interface PostFrontmatter {
  title: string
  description: string
  /** ISO date string, e.g. "2026-07-11". */
  date: string
  tags?: string[]
  author?: string
  draft?: boolean
  /** Access tier. Omitted means `public`; see `toMeta`. */
  accessCategory?: AccessCategory
  /**
   * Optional access-links panel, keyed by platform slug and preserving author
   * order. When absent, the panel is not rendered at all.
   */
  links?: Record<string, AccessLink>
  /** Optional slugs of related posts, rendered as a "Related" rail section. */
  related?: string[]
}

/** Listing metadata (no body) — used by the index and tag pages. */
export interface PostMeta extends PostFrontmatter {
  slug: string
  tags: string[]
  accessCategory: AccessCategory
  readingTimeText: string
}

/** A full post, including its raw MDX body for compilation. */
export interface Post extends PostMeta {
  body: string
}

interface RawPost {
  slug: string
  data: PostFrontmatter
  body: string
}

function isVisible(data: PostFrontmatter): boolean {
  return process.env.NODE_ENV !== "production" || data.draft !== true
}

function readAllRaw(): RawPost[] {
  if (!fs.existsSync(POSTS_DIRECTORY)) return []

  return fs
    .readdirSync(POSTS_DIRECTORY)
    .filter((file) => MDX_FILE.test(file))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIRECTORY, file), "utf8")
      const parsed = matter(raw)
      return {
        slug: file.replace(MDX_FILE, ""),
        data: parsed.data as PostFrontmatter,
        body: parsed.content,
      }
    })
    .filter((post) => isVisible(post.data))
}

function toMeta({ slug, data, body }: RawPost): PostMeta {
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags ?? [],
    author: data.author,
    draft: data.draft,
    accessCategory: data.accessCategory ?? "public",
    readingTimeText: readingTime(body).text,
    links: data.links,
    related: data.related,
  }
}

/** All visible posts, newest first. */
export function getAllPosts(): PostMeta[] {
  return readAllRaw()
    .map(toMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** Slugs of all visible posts — for `generateStaticParams`. */
export function getAllSlugs(): string[] {
  return readAllRaw().map((post) => post.slug)
}

/** One post by slug, or `null` if it does not exist / is hidden. */
export function getPostBySlug(slug: string): Post | null {
  const found = readAllRaw().find((post) => post.slug === slug)
  if (!found) return null
  return { ...toMeta(found), body: found.body }
}

/**
 * Resolve a post's `related` slugs to their listing metadata, preserving the
 * author's order. Unknown or hidden slugs, duplicates, and any self-reference
 * are skipped, so the caller can render whatever survives (possibly nothing).
 */
export function getRelatedPosts(slugs: string[] | undefined, currentSlug?: string): PostMeta[] {
  if (!slugs || slugs.length === 0) return []
  const bySlug = new Map(getAllPosts().map((post) => [post.slug, post]))
  const seen = new Set<string>()
  const related: PostMeta[] = []
  for (const slug of slugs) {
    if (slug === currentSlug || seen.has(slug)) continue
    seen.add(slug)
    const post = bySlug.get(slug)
    if (post) related.push(post)
  }
  return related
}

/** All unique tags across visible posts, alphabetized. */
export function getAllTags(): string[] {
  const tags = new Set<string>()
  for (const post of readAllRaw()) {
    for (const tag of post.data.tags ?? []) tags.add(tag)
  }
  return Array.from(tags).sort()
}
