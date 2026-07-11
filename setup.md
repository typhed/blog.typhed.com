<div align = "center">

# Setup Guide

</div>

<div align = "justify">

This guide takes the blog from a folder on your machine to a live site at
`blog.typhed.com` with analytics and ads switched on. It assumes no prior Next.js
experience. Follow the sections in order and copy each command exactly.

## What You Need

  * A GitHub account that can create repositories.
  * [Node.js](https://nodejs.org) version 20 or newer installed.
  * [pnpm](https://pnpm.io) - the easiest way to get it is to run `corepack enable` once
    (Corepack ships with Node).
  * Access to the DNS settings for `typhed.com` (wherever the domain is registered).

To confirm the tools are present, run:

```shell
$ node --version
$ pnpm --version
```

## Create The GitHub Repository

  1. On GitHub, click **New repository**. Name it (for example `blog`), keep it public,
     and do **not** add a README - this project already has one.
  2. On your machine, open a terminal in this project folder.
  3. Run the commands below, replacing the URL with your new repository's URL:

```shell
$ git init
$ git add .
$ git commit -m "Initial commit: TyPhed blog scaffold"
$ git branch -M main
$ git remote add origin https://github.com/<your-name>/blog.git
$ git push -u origin main
```

## Run It Locally

  1. Install dependencies:

```shell
$ pnpm install
```

  2. Start the dev server:

```shell
$ pnpm dev
```

  3. Open [http://localhost:3000](http://localhost:3000). You should see the sample posts,
     a working light/dark toggle, and math rendered on the "Hello, World" post. Press
     `Ctrl + C` in the terminal to stop.

## Point blog.typhed.com At GitHub Pages

This has two halves: a DNS record at your domain registrar, and the Pages setting on
GitHub. The file [public/CNAME](public/CNAME) already contains `blog.typhed.com`, so the
build tells GitHub which domain to serve.

  1. In your DNS provider, add a record:
      * **Type**: `CNAME`
      * **Host / Name**: `blog`
      * **Value / Target**: `<your-name>.github.io` (your GitHub username or organization,
        followed by `.github.io`)
  2. On GitHub, open the repository and go to **Settings -> Pages**.
  3. Under **Build and deployment -> Source**, choose **GitHub Actions**.
  4. Under **Custom domain**, enter `blog.typhed.com` and save.
  5. Wait for the DNS check to pass (it can take a few minutes to a few hours), then tick
     **Enforce HTTPS**.

## Set Up Google Analytics 4

  1. Go to [analytics.google.com](https://analytics.google.com) and create a property for
     `blog.typhed.com`.
  2. Create a **Web** data stream for the URL `https://blog.typhed.com`.
  3. Copy the **Measurement ID** - it looks like `G-XXXXXXXXXX`.
  4. You will paste it into an environment variable in the two steps below (locally in
     `.env.local`, and on GitHub as a repository Variable).

## Set Up Microsoft Clarity

  1. Go to [clarity.microsoft.com](https://clarity.microsoft.com) and create a new project
     for `https://blog.typhed.com`.
  2. Open **Settings -> Overview** and copy the **Project ID** (a short string like
     `abcdefghij`).

## Set Up Google AdSense

  1. Go to [adsense.google.com](https://adsense.google.com) and add the site
     `blog.typhed.com`.
  2. Copy your **Publisher ID** - it looks like `ca-pub-0000000000000000`.
  3. Open [public/ads.txt](public/ads.txt) and replace `pub-0000000000000000` with your
     real publisher number (keep the `pub-` prefix and the rest of the line unchanged).
     This file is how AdSense confirms you own the ad inventory.
  4. To show an ad, add an `AdUnit` to any page or post with a slot id from your AdSense
     dashboard:

```tsx
import { AdUnit } from "@/components/analytics/ad-unit"

<AdUnit slot="1234567890" />
```

  Ads only appear on the live domain after AdSense approves the site; they will not show
  on `localhost`.

## Verify With Google Search Console

  1. Go to [search.google.com/search-console](https://search.google.com/search-console)
     and add a property for `https://blog.typhed.com`.
  2. Choose the **HTML tag** verification method and copy the value inside
     `content="..."` (a long token).
  3. Put that token in the `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` variable (next section).
     The site adds the verification meta tag automatically.
  4. After the site is deployed, return to Search Console and click **Verify**. Then submit
     `https://blog.typhed.com/sitemap.xml` under **Sitemaps**.

## Add The Values Locally And On GitHub

There are two places these ids live: your machine (for testing) and GitHub (for the live
build). None of them are secret - they ship to the browser either way - so on GitHub they
go in **Variables**, not **Secrets**.

  1. On your machine, copy the example file and fill in the ids you collected:

```shell
$ cp .env.example .env.local
```

  2. Edit `.env.local` so it reads like this (blanks are fine for anything you skip):

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000
NEXT_PUBLIC_CLARITY_PROJECT_ID=abcdefghij
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-search-console-token
```

  3. On GitHub, go to **Settings -> Secrets and variables -> Actions -> Variables** and add
     each one as a **New repository variable** with the same name and value. The deploy
     workflow reads them at build time.

## Publish

Deployment runs when you publish a GitHub Release.

  1. On GitHub, go to **Releases -> Draft a new release**.
  2. Create a tag such as `v0.1.0`, give it a title, and click **Publish release**.
  3. Open the **Actions** tab to watch the deploy. When it finishes, visit
     [https://blog.typhed.com](https://blog.typhed.com).

You can also trigger a deploy by hand from **Actions -> Deploy Blog to GitHub Pages ->
Run workflow**.

## Writing Your Next Post

  1. Create a file in `content/blog/`, for example `content/blog/my-first-real-post.mdx`.
  2. Start it with frontmatter and write below it:

```mdx
---
title: "My First Real Post"
description: "A one-line summary used for search and social previews."
date: "2026-07-15"
tags: ["notes"]
---

Your writing goes here. Math, tables, and code all work - see the sample posts.
```

  3. Commit and push. When you are ready for readers to see it, publish a new Release.

</div>
