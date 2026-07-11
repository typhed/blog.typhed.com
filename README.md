<div align = "center">

# TyPhed Blog

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=plastic&logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-20232A?style=plastic&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=plastic&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=plastic&logo=tailwindcss)](https://tailwindcss.com)
[![MDX](https://img.shields.io/badge/MDX-%20+%20LaTeX-1B1F24?style=plastic&logo=mdx)](https://mdxjs.com)
[![GitHub Pages](https://img.shields.io/badge/Deploy-%20GitHub%20Pages-222222?style=plastic&logo=githubpages)](https://pages.github.com)

</div>

<div align = "justify">

The blog for [typhed.com](https://typhed.com), served at `blog.typhed.com`. It is a
standalone Next.js app that renders MDX posts with LaTeX math and syntax-highlighted
code, wears the same Aurora Glass / Midnight Indigo theme as the main site, and
exports to static HTML for GitHub Pages. Analytics and ad slots are wired in and
switch on the moment you supply their ids.

## 🧠 Overview

  * **Framework** - Next.js 15 (App Router, React 19) with `output: "export"`, so the
    whole site ships as static files with no server at runtime.
  * **Content** - posts are `.mdx` files in [content/blog/](content/blog/). Frontmatter
    drives the title, description, date, and tags; the body is Markdown plus optional
    JSX, LaTeX, and fenced code.
  * **Theme** - the exact TyPhed color tokens and light/dark switch, inlined so this
    repository stands alone with no shared workspace packages.
  * **Growth** - analytics (GA4, Microsoft Clarity), monetization (Google AdSense), and
    Google Search Console verification are all present and env-driven.

## 🚀 Getting Started

Requires Node 20 or newer and [pnpm](https://pnpm.io) (the version is pinned in
`package.json`).

```shell
$ corepack enable
$ pnpm install
$ pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The sample posts render immediately;
analytics stay off locally until you add ids.

| Command | What It Does |
| :---: | --- |
| `pnpm dev` | Run the site locally with hot reload. |
| `pnpm build` | Produce the static export into `out/`. |
| `pnpm lint` | ESLint across the app. |
| `pnpm typecheck` | `tsc --noEmit`. |
| `pnpm format` | Prettier write. |

## ✍️ Writing Posts

Add a file such as `content/blog/my-post.mdx`:

```mdx
---
title: "My Post"
description: "One sentence for search results and social cards."
date: "2026-07-11"
tags: ["engineering"]
---

Inline math like $E = mc^2$ and display math both work:

$$
\int_0^\infty e^{-x}\,\mathrm{d}x = 1
$$
```

The file name becomes the URL slug (`/blog/my-post/`). Set `draft: true` in the
frontmatter to keep a post out of production builds while you work on it. See the
sample posts in [content/blog/](content/blog/) for the full range of supported
Markdown, tables, and code.

## 📊 Analytics And Monetization

Copy `.env.example` to `.env.local` and fill in only what you use. Each service renders
nothing until its id is present.

| Service | Environment Variable |
| :---: | --- |
| Google Analytics 4 | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| Google AdSense | `NEXT_PUBLIC_ADSENSE_CLIENT_ID` |
| Microsoft Clarity | `NEXT_PUBLIC_CLARITY_PROJECT_ID` |
| Search Console | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` |

Place an ad slot anywhere with the `AdUnit` component:

```tsx
import { AdUnit } from "@/components/analytics/ad-unit"

<AdUnit slot="1234567890" />
```

Full account setup, DNS, and the custom-domain steps live in [setup.md](setup.md).

## 🎨 Theming

Colors are HSL CSS variables in [app/globals.css](app/globals.css) - light ("Aurora
Glass") under `:root`, dark ("Midnight Indigo", the default) under `.dark`. The Tailwind
config maps each token to a utility, so components use classes like `bg-brand` and never
raw hex. Change a color once in `globals.css` and it updates everywhere.

## 🗂️ Project Structure

```text
app/            Routes: layout, home index, blog/[slug], sitemap, robots, manifest, OG
components/     Theme provider + toggle, background, header/footer, MDX map, analytics
content/blog/   Your posts, one .mdx file each
lib/            cn() helper, SITE constants, the build-time post loader
public/         Brand assets, CNAME, ads.txt, .nojekyll
```

## 🚢 Deployment

Pushing a published GitHub Release builds the static export and deploys it to GitHub
Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml). The custom domain
is declared in [public/CNAME](public/CNAME). Point a DNS `CNAME` record for `blog` at your
GitHub Pages host and set the four analytics values as repository Variables. Step by step:
[setup.md](setup.md).

</div>
