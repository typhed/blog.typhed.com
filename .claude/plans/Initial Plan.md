<div align = "center">

# Initial Plan - TyPhed Blog

</div>

<div align = "justify">

This is the roadmap for taking `blog.typhed.com` from the scaffold in this repository to a
live, monetized blog. The foundation is already built and verified: what remains is mostly
account setup, writing, and putting your own stamp on the design. Work top to bottom;
`setup.md` holds the exact click-by-click steps for anything hosting or analytics related.

## Context

The blog is deliberately a separate repository from the main `typhed.com` site so the main
site stays small. It reuses the same colors and light/dark theme, renders MDX with LaTeX
math, and exports to static HTML for GitHub Pages. Revenue and measurement come from Google
AdSense, Google Analytics 4, Microsoft Clarity, and Google Search Console, all wired and
waiting for their ids.

## Phase 0 - What The Scaffold Already Provides

Nothing here needs building; it is the starting point.

  * A runnable Next.js 15 app that builds to a static export, with the TyPhed theme inlined.
  * The MDX plus LaTeX plus code-highlighting pipeline (`lib/posts.ts`,
    `app/blog/[slug]/page.tsx`, `components/mdx-components.tsx`).
  * Two sample posts in `content/blog/` that exercise every content feature.
  * SEO: metadata, canonical URLs, JSON-LD, `sitemap.ts`, `robots.ts`, `manifest.ts`, and a
    generated Open Graph image.
  * Analytics and ad components in `components/analytics/`, each dormant until its id is set.
  * A GitHub Actions workflow that deploys on a published Release.
  * `public/CNAME` set to `blog.typhed.com` and `public/ads.txt` ready for your publisher id.

## Phase 1 - Stand Up The Repository And Hosting

  1. Create a new GitHub repository and push this project to it.
  2. Add a DNS `CNAME` record for `blog` pointing at your GitHub Pages host.
  3. In the repository, set **Settings -> Pages -> Source** to **GitHub Actions** and add the
     custom domain `blog.typhed.com`.
  4. Confirm the sample site builds and runs locally with `pnpm install` and `pnpm dev`.

## Phase 2 - Turn On Analytics And Monetization

  1. Create the four accounts and collect their ids: GA4 measurement id, AdSense publisher
     id, Clarity project id, and the Search Console verification token.
  2. Put your AdSense publisher number into `public/ads.txt`.
  3. Add all four values as GitHub repository **Variables** so the deploy build injects them.
  4. Optionally copy `.env.example` to `.env.local` to test them on your machine first.
  5. After the first deploy, verify the site in Search Console and submit the sitemap.

## Phase 3 - Write And Publish Content

  1. Replace or delete the two sample posts once you have your own.
  2. Add posts as `.mdx` files in `content/blog/`, each with `title`, `description`, and
     `date` frontmatter. Use `draft: true` for work in progress.
  3. Preview locally with `pnpm dev`, then publish a GitHub Release to deploy.

## Phase 4 - Make The Design Your Own

The header and footer are intentionally minimal placeholders. This is where you build the
components you said you want to own.

  1. Redesign `components/site-header.tsx` (navigation, logo lockup, mobile menu).
  2. Redesign `components/site-footer.tsx` (columns, newsletter, richer social links).
  3. Tune the post and index typography in `components/mdx-components.tsx` and `app/page.tsx`.
  4. Adjust the decorative `components/abstract-background.tsx` or remove it if you prefer a
     flat background. All of these read theme tokens, so they stay in sync with light/dark.

## Phase 5 - Optional Enhancements

Add these as the blog grows. None are required for launch.

  * **Tag pages** - a `app/tags/[tag]/page.tsx` route using the existing `getAllTags` helper.
  * **Pagination** - once the index gets long, page the post list.
  * **RSS / Atom feed** - a `app/feed.xml/route.ts` that reads `getAllPosts`.
  * **Per-post Open Graph images** - a `opengraph-image.tsx` inside `app/blog/[slug]/`.
  * **Reading enhancements** - a table of contents, related posts, or a reading-progress bar.
  * **A prose plugin** - if hand-styling every element becomes tedious, add
    `@tailwindcss/typography` and map its `prose` colors to the theme tokens.

## Publishing Flow

  1. Write or edit posts and commit to `main`.
  2. When ready for readers, publish a GitHub Release (or run the deploy workflow by hand).
  3. The workflow builds the static export and deploys `out/` to GitHub Pages.

## Notes And Trade-offs

  * **Static only.** No server runs at request time. Everything a post needs is resolved at
    build. This keeps the site fast and free but rules out API routes and SSR.
  * **Code highlighting weight.** `rehype-pretty-code` uses Shiki, which is heavier at build
    time. If it ever slows builds too much, swap it for the lighter `rehype-highlight`.
  * **Ids are not secrets.** The analytics and AdSense ids ship to the browser by design, so
    they live in repository Variables, never Secrets.
  * **Keep colors in tokens.** Never hardcode hex in a component; edit `app/globals.css`.

</div>
