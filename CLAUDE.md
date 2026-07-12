# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

The blog for the TyPhed brand, served at `blog.typhed.com`. It is a single Next.js 15 (App Router,
React 19) application exported to static HTML and published to GitHub Pages. It is intentionally
independent from the main `typhed.com` monorepo: the shared theme and helpers are inlined here so this
repository has no workspace dependencies.

Posts are MDX files in `content/blog/`, rendered with LaTeX math (KaTeX) and syntax-highlighted code
(Shiki) at build time. The site reuses the main brand's color tokens and light/dark theme.

## Commands

Run from the repo root. Requires Node 20+ (CI builds on Node 22) and pnpm (pinned via `packageManager`).

| Command | What It Does |
| :---: | --- |
| `pnpm install` | Install dependencies. |
| `pnpm dev` | Run locally with hot reload at `localhost:3000`. |
| `pnpm build` | Produce the static export into `out/`. |
| `pnpm lint` | ESLint across the app. |
| `pnpm typecheck` | `tsc --noEmit`. |
| `pnpm format` / `pnpm format:check` | Prettier write / check. |

There is no test suite. The quality gates are `pnpm lint` and `pnpm typecheck`; CI additionally runs the
production build.

## Architecture

### Static export model

`next.config.mjs` sets `output: "export"`, so there is no server at runtime. `trailingSlash: true` emits
`route/index.html` directories for Pages, and `images.unoptimized` is required because there is no Image
Optimization server. Anything needing a server (API routes, SSR, `next start`) will not work; treat the
output as plain files. Everything a post needs is resolved at build time.

### Content pipeline

`lib/posts.ts` reads `content/blog/*.mdx` with `node:fs` at build time, parses frontmatter with
`gray-matter`, and computes reading time. `app/blog/[slug]/page.tsx` pre-renders every post via
`generateStaticParams` and compiles the body with `compileMDX` from `next-mdx-remote/rsc`, wiring
`remark-gfm`, `remark-math`, `rehype-katex`, `rehype-slug`, `rehype-autolink-headings`, and
`rehype-pretty-code`. Element styling is in `components/mdx-components.tsx`, except code blocks, which
`rehype-pretty-code` owns and `app/globals.css` styles. Add a post by adding a file; no code change needed.

### Theming and color tokens

Colors are HSL CSS variables in `app/globals.css`: light ("Aurora Glass") under `:root`, dark ("Midnight
Indigo", the default) under `.dark`. `tailwind.config.ts` maps each token to a utility via
`hsl(var(--token))`, so components use classes like `bg-brand` and never raw hex. `next-themes` toggles the
`.dark` class. Static assets (favicon, manifest colors, OG card) carry their own hardcoded hex that must be
kept in sync by hand.

### Single source of truth for content

Brand strings, the canonical URL, and links live in `lib/constants.ts`. Change copy or the domain there,
not in markup. `SITE.url` drives `metadataBase`, canonicals, sitemap, robots, and JSON-LD.

### Analytics and monetization

`components/analytics/` holds GA4, AdSense (loader + `AdUnit` slot), and Microsoft Clarity. Each reads a
`NEXT_PUBLIC_*` variable and renders nothing when it is unset, so dev builds stay untracked. Search Console
verification is a meta tag driven by `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. `public/ads.txt` carries the
AdSense publisher line.

### Deployment

`.github/workflows/deploy.yml` runs on a published GitHub Release or manual `workflow_dispatch`. It builds
the static export and deploys `out/` to GitHub Pages. The custom domain is declared in `public/CNAME`. There
is no push-to-deploy on `main`; publishing a Release ships the site.

### Custom domain and DNS routing

`blog.typhed.com` is a project site served from this repository, while `typhed.com` is served from the
separate `typhed.github.io` repository in the same organization. Both custom domains resolve to the same
GitHub Pages host, and GitHub picks which repository answers a request by matching the `Host` header against
each repo's configured custom domain. That is why `public/CNAME` must stay `blog.typhed.com`: it is the claim
that routes the subdomain to this repo.

The DNS record for `blog` is a `CNAME` whose target is the organization's Pages host, `typhed.github.io` - a
bare hostname, never a URL or a path. A target with a slash (for example `typhed.com/blog.typhed.com`) is
treated as a literal string, resolves to nothing, and surfaces as Cloudflare Error 1016. The record runs
through Cloudflare Proxied with SSL/TLS set to Full (strict); the certificate has to be provisioned with the
record temporarily set to DNS only, since GitHub cannot reach the origin through the proxy. See
[setup.md](setup.md) for that order. There is no `basePath` in `next.config.mjs` because the site is served
at the domain root, not a subpath.

## Conventions

  * **Colors go through tokens.** Never hardcode a hex value in a component. Edit the token in `globals.css`.
  * **Placeholder chrome.** `components/site-header.tsx` and `components/site-footer.tsx` are minimal
    placeholders meant to be replaced with a bespoke design.
  * **Markdown is skill-governed.** If this repo carries the `markdown-format` skill, follow it when editing
    docs.
