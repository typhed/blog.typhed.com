import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"
import readingTime from "reading-time"

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
}

/** Listing metadata (no body) — used by the index and tag pages. */
export interface PostMeta extends PostFrontmatter {
  slug: string
  tags: string[]
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
    readingTimeText: readingTime(body).text,
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

/** All unique tags across visible posts, alphabetized. */
export function getAllTags(): string[] {
  const tags = new Set<string>()
  for (const post of readAllRaw()) {
    for (const tag of post.data.tags ?? []) tags.add(tag)
  }
  return Array.from(tags).sort()
}
