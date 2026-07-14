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
`remark-diagrams` (local), `remark-gfm`, `remark-math`, `rehype-slug`, `rehype-collect-headings`
(local), `rehype-autolink-headings`, `rehype-katex`, and `rehype-pretty-code`. Element styling is in
`components/mdx-components.tsx`, except code blocks, which `rehype-pretty-code` owns and
`app/globals.css` styles. Add a post by adding a file; no code change needed.

### Diagrams, charts, and the table of contents

Two extra fenced-code languages render as interactive client components instead of highlighted text.
A ```` ```mermaid ```` fence becomes a diagram and a ```` ```chart ```` fence becomes an interactive
Recharts chart. The interception happens in `lib/remark-diagrams.ts`, a remark plugin that runs first
and rewrites those `code` nodes into `<Mermaid>` / `<Chart>` MDX JSX elements (passing the raw fence
body as a string prop); `rehype-pretty-code` never sees them. They are mapped to components in
`components/mdx-components.tsx`. `components/mermaid.tsx` lazy-imports `mermaid` in a client effect and
re-renders on theme change. `components/chart.tsx` lazy-loads `components/chart-inner.tsx`
(`next/dynamic`, `ssr: false`) so Recharts is a client-only chunk. A chart fence is a small JSON spec:
`type` (`line` / `area` / `bar`), `xKey`, `series[]`, `data[]`, and optional `title`, `xLabel`,
`yLabel`, `smooth`, and `refLines`. Chart series colors come from the validated `--chart-1..4` tokens
in `app/globals.css` (read from CSS at runtime so they track the theme), not from raw hex.

Every article shows a right-side rail beside the body. `lib/rehype-collect-headings.ts`
harvests the `h2`-`h4` ids that `rehype-slug` assigned (so the anchors always match) into an array the
page hands to `components/post-body.tsx`. That client component lays the article and the rail out as a
two-column grid - roughly 80% article and 20% rail, together spanning ~90% of the viewport but capped at
64rem so the reading column stops widening on large screens (the block then centers, and the wider cap
keeps the article's reading width unchanged from the former 85/15-at-60rem split) - from the `md`
breakpoint up, collapsing to a single centered reading column below it. The rail stacks up to three
sections: the table of contents (`components/table-of-contents.tsx`, whose `IntersectionObserver`
highlights the section nearest the top as the reader scrolls), the access-links panel, and the related
posts list. The rail shows whenever any section has content. The TOC follows the same access gate as the
body: a freemium post reveals it only once the reader is signed in (`useAuth`), a public post always
shows it, and with Clerk unconfigured it shows for every post - the ungated fallback. The access panel
and the related list are keyed only to the frontmatter, so they are never gated. Both the diagram/chart
rendering and the scroll-spy run in the browser, consistent with the static-export model.

Two optional frontmatter blocks feed the rail. A `links` block (a map keyed by platform slug, each entry
carrying `type`, `link`, and `rtag`) drives the "Trade With" access panel in `components/access-panel.tsx`:
every listed platform renders with a mark from `components/platform-icons.tsx` (TradingView, NinjaTrader,
MetaTrader, Thinkorswim, plus a generic fallback), a populated `link` becomes an active branded button and
an empty one renders dimmed and disabled. The shared `AccessLink` type and the `hasAccessLinks` guard live
in `lib/access-links.ts`, deliberately free of `node:*` imports so the client rail can use them without
pulling `lib/posts.ts` into the browser bundle. A `related` list of post slugs drives
`components/related-posts.tsx`; `getRelatedPosts` in `lib/posts.ts` resolves them to listing metadata at
build time, dropping unknown, hidden, duplicate, and self-referential slugs.

### Access categories and authentication

Every post carries an `accessCategory` in frontmatter: `public` (👥, the default) or `freemium`
(🔓). `lib/posts.ts` parses it and `toMeta` defaults a missing value to `public`; `lib/constants.ts`
holds `ACCESS_CATEGORIES`, the single source for each tier's emoji and label.
`components/access-badge.tsx` renders the badge on the index and the post header.

Auth is Clerk, and it is **client-only** because this is a static export with no server: no
middleware, no `auth()`, no API routes. The provider is `@clerk/react` (not `@clerk/nextjs`, whose
`ClerkProvider` is a server component that expects middleware), wrapped in
`components/clerk-provider.tsx` and mounted in `app/layout.tsx`. Session state is read through the
`useAuth()` hook. `components/freemium-gate.tsx` wraps the compiled MDX body of a freemium post:
signed-in readers see it, everyone else gets a sign-in card. The header sign-in lives in
`components/auth-buttons.tsx` and opens Clerk in a modal.

The blog reuses the **same Clerk publishable key as `typhed.com`**. Because it is a subdomain of the
same root, Clerk shares the session across both sites automatically, with no satellite domain. The
key is `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`; like the analytics ids it is public and ships to the
browser. When it is unset, `CLERK_ENABLED` is false, the provider is skipped, and freemium posts
render ungated, so dev and unauthenticated builds work with no Clerk config.

The gate is a **soft gate**: the body is compiled at build time and travels in the page payload, so
it is hidden, not secret. That is the right trade for freemium; real paid content would need a server
or edge check. Freemium posts stay in `getAllPosts()`, so they remain listed on the index and in
`sitemap.xml` - the public title and description are the teaser.

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
  * **Auth is client-side only.** No middleware, no server `auth()`, no API routes - the static export
    forbids them. Read the session with the `useAuth()` hook and gate content through
    `components/freemium-gate.tsx`, remembering it is a soft gate.
  * **Markdown is skill-governed.** If this repo carries the `markdown-format` skill, follow it when editing
    docs.
