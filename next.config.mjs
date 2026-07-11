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
  ],
}

export default nextConfig
