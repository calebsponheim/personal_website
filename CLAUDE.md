# CLAUDE.md

Personal website + blog for Caleb Sponheim. Astro 6, statically built, deployed at **calebsponheim.com**.

## Commands

```bash
npm run dev          # Dev server on http://localhost:4321
npm run build        # Static build to ./dist/
npm run preview      # Serve ./dist/ locally
npm run test:e2e     # Playwright across Chromium, Firefox, WebKit
npm run test:e2e:ui  # Playwright UI mode
npm run pw:codegen   # Record interactions against the dev server
```

Playwright's `webServer` block boots `npm run dev` for you and reuses an already-running dev server when one exists — no need to start it by hand before running tests locally.

## Architecture at a glance

```
src/
├── content/blog/          One folder per post (post.md + co-located images)
├── content.config.ts      Zod schema for the `blog` collection
├── pages/                 Routes — index, blog, blog/[...slug], tags, og, rss
│   ├── og/[...slug].ts    Auto-generated 1200×630 OG PNGs via astro-og-canvas
│   └── rss.xml.js         RSS 2.0 feed at /rss.xml
├── layouts/Layout.astro   <head> meta (SEO, OG, Twitter card, RSS auto-discovery)
├── components/            Header, Footer, Navigation, Social, Welcome (small set)
├── lib/rehype-image-figures.js   Custom rehype plugin (see "Markdown" below)
├── utils/tags.ts          `tagSlug()` — used wherever tag URLs are built
└── styles/global.css      Site-wide CSS + CSS custom properties
tests/smoke.spec.ts        Playwright smoke test
```

## Non-obvious conventions

**Draft filter.** `import.meta.env.DEV || !data.draft` — drafts are visible in dev, hidden at build. The pattern is duplicated in [blog.astro](src/pages/blog.astro), [blog/[...slug].astro](src/pages/blog/[...slug].astro), [og/[...slug].ts](src/pages/og/[...slug].ts), and [rss.xml.js](src/pages/rss.xml.js). If you add a new view of blog posts, keep this filter consistent.

**Markdown figures from titled images.** [src/lib/rehype-image-figures.js](src/lib/rehype-image-figures.js) rewrites any standalone Markdown image with a title — `![alt](./photo.jpg "caption text")` — into `<figure><img><figcaption>`. Inline images (mixed with text in a paragraph) stay as `<img>`. Use the title slot for the visible caption; the alt stays alt.

**OG images are baked at build time.** Each non-draft post gets a PNG at `/og/{slug}.png` rendered by `astro-og-canvas` with dark gradient + blue accent bar. `Layout.astro` falls back to this URL when a post has no `heroImage`.

**Reading time.** 225 wpm, computed inline in `blog.astro` and `[...slug].astro` from `post.body`. If you change the formula, change both.

**Slug = filename.** Astro's content collections use the entry's filename as `post.id`, which is also the URL slug (`/blog/{post.id}/`). Don't pass slugs around as a separate field.

**Tag slugs.** Always go through `tagSlug()` in [src/utils/tags.ts](src/utils/tags.ts) so links and the `[tag]` route param stay in sync. It's lowercase + dashes only — Unicode-aware slugging would need the `slugify` package.

## Blog frontmatter

Schema lives in [src/content.config.ts](src/content.config.ts) and is the source of truth. Highlights:

- `heroImage: ./cover.webp` — relative path resolved by Astro's `image()` helper. Files live alongside the post (`src/content/blog/my-post/cover.webp`).
- `pubDate: 2026-05-13` — YAML date, coerced to `Date`.
- `draft: true` — see "Draft filter" above.
- `canonicalUrl` — set when a post was published elsewhere first (Substack etc.); the post page renders an "Originally published at…" note and the URL is used for the `<link rel="canonical">`.
- `tags: ["AI", "lemon"]` — render through `tagSlug()` for any URL.

## Typography

Two webfonts loaded via Astro's font providers ([astro.config.mjs](astro.config.mjs)) and exposed as CSS variables:

- `--font-inter` — UI, headings, captions.
- `--font-newsreader` — long-form blog body (soft transitional serif).

`Layout.astro` preloads both. Switching to a new font means touching `astro.config.mjs` and `global.css` together.

## Code style

- 4-space indent in `.astro` and `.ts`/`.js` files (match existing files).
- Comments explain *why*, not *what* — the existing files do this well; keep it up.
- Astro components: frontmatter is TypeScript-typed via `interface Props` where it matters (see `Layout.astro`).

## Gotchas

- `Astro.site` is only set in builds where `site:` is configured (it is — `calebsponheim.com`). `Layout.astro` falls back gracefully but anything that builds absolute URLs needs to handle the dev case.
- `dist/` and `.astro/` are build artifacts. Don't edit them; don't read them as source of truth.
- The default Astro starter `README.md` is still in the repo. It's stale — trust this file instead.
