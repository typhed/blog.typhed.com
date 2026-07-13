// Surface a missing Clerk key at build time. Without it, CLERK_ENABLED is false,
// auth is disabled, and freemium posts render ungated - a silent failure that
// exposes gated content. This warning lands in the deploy log so a
// misconfigured build is obvious. It is only a heads-up in dev, where building
// without Clerk is normal.
if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  console.warn(
    "\n[blog] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set: auth is OFF and freemium posts will render ungated. Set it as a GitHub repository Variable (not a Secret) and redeploy.\n",
  )
}

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Static HTML export for GitHub Pages (no Node server at runtime).
  output: "export",
  reactStrictMode: true,
  // GitHub Pages serves directories, so emit `route/index.html` files.
  trailingSlash: true,
  // The export build has no Image Optimization server.
  images: {
    unoptimized: true,
  },
  // Keep the MDX / unified toolchain external instead of bundling it into the
  // server output. These are large ESM packages (next-mdx-remote plus the
  // remark/rehype plugins) that use Node subpath imports; leaving them external
  // keeps the server build lean and their module resolution intact.
  serverExternalPackages: [
    "next-mdx-remote",
    "remark-gfm",
    "remark-math",
    "rehype-katex",
    "rehype-slug",
    "rehype-autolink-headings",
    "rehype-pretty-code",
    "shiki",
    // Used by the local remark/rehype plugins (remark-diagrams,
    // rehype-collect-headings); external for the same reasons as the rest.
    "unist-util-visit",
    "hast-util-to-string",
  ],
}

export default nextConfig
