import type { MetadataRoute } from "next"

import { SITE } from "@/lib/constants"
import { getAllPosts } from "@/lib/posts"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE.url}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [
    {
      url: `${SITE.url}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...posts,
  ]
}
