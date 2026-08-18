# CLAUDE.md

Personal website + blog for Caleb Sponheim. Astro 7, statically built, deployed at **calebsponheim.com**.

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
├── content/blog/          One markdown file per post + sibling assets folder
├── content/projects/      Same pattern — curated portfolio entries
├── content.config.ts      Zod schemas for the `blog` and `projects` collections
├── copy/home.md           Home page prose + positioning frontmatter (see "Copy in Markdown")
├── pages/                 Routes — index, blog, blog/[...slug], projects, projects/[...slug], tags, og, rss
│   ├── og/[...slug].ts    Auto-generated 1200×630 OG PNGs via astro-og-canvas
│   └── rss.xml.js         RSS 2.0 feed at /rss.xml
├── layouts/Layout.astro   <head> meta (SEO, OG, Twitter card, RSS auto-discovery)
├── components/            Header, Footer, Navigation (small set)
├── worker.js               Cloudflare Worker entrypoint for www → apex redirects
├── lib/rehype-image-figures.js   Custom rehype plugin (see "Markdown" below)
├── utils/tags.ts          `tagSlug()` — used wherever tag URLs are built
└── styles/global.css      Site-wide CSS + CSS custom properties
public/_redirects           Legacy Squarespace route migrations
public/robots.txt           Crawler policy and sitemap location
public/resume/              Résumé PDF — served locally, not linked to Google Docs
tests/smoke.spec.ts        Playwright smoke test
```

## Non-obvious conventions

**Draft filter.** `import.meta.env.DEV || !data.draft` — drafts are visible in dev, hidden at build. The pattern is duplicated across every place that queries `getCollection`: [index.astro](src/pages/index.astro), [blog.astro](src/pages/blog.astro), [blog/[...slug].astro](src/pages/blog/[...slug].astro), [og/[...slug].ts](src/pages/og/[...slug].ts), [rss.xml.js](src/pages/rss.xml.js), [projects.astro](src/pages/projects.astro), and [projects/[...slug].astro](src/pages/projects/[...slug].astro). If you add a new view of either collection, keep this filter consistent.

**Projects sort by `order`, not date.** Unlike blog posts (sorted reverse-chronologically by `pubDate`), projects use a hand-set integer `order` field so the page tells a curated story. Spaced increments (10, 20, 30…) make reordering cheap without renumbering everything.

**The `/projects` sort control.** `order` is the *default* ("Relevance"); readers can also sort by date in either direction. Because `dateLabel` is free text (`"Ongoing"`, `"2026–present"`) and can't be sorted, sorting reads separate numeric `startYear` / `endYear` frontmatter, emitted onto each `<li>` as data attributes. A missing `endYear` means "still running" and is substituted with an `ONGOING = 9999` sentinel so newest-first ranks live work above anything finished. **Add both fields whenever you add a project**, or it sorts as if it never ended. The control is progressively enhanced: it ships with `hidden`, the inline script reveals it, and it reorders real DOM nodes (never CSS `order`) so tab order keeps matching visual order. It also reads and writes `?sort=`.

**Copy in Markdown.** Home page prose lives in [src/copy/home.md](src/copy/home.md), imported as a module (`import * as homepageCopy from "../copy/home.md"`) rather than loaded as a content collection — `homepageCopy.Content` renders the body, `homepageCopy.frontmatter` carries the rest. `src/copy/` sits outside `src/pages/`, so it never becomes a route. Its frontmatter also drives the home page's `availability` line and the featured-project callout: `featuredSlug` must match a `src/content/projects/` filename, and that project is filtered out of the "Selected work" list below so it doesn't appear twice.

**Résumé is a local PDF.** [public/resume/caleb-sponheim-resume.pdf](public/resume/caleb-sponheim-resume.pdf), linked with `download` from the home page and `/projects`. It deliberately replaced a Google Docs share link, which put a login wall and an access-request risk in front of the site's main conversion action. Re-export to this path to update it — don't reintroduce an external link.

**External project entries.** A project with `externalUrl` set is a link-out card on `/projects` with no sub-page — [projects/[...slug].astro](src/pages/projects/[...slug].astro) filters these out of `getStaticPaths`. Use this for work that lives on another site (e.g. an NN/G author page).

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

## Theming and layout tokens

Every color is a CSS custom property on `:root` in [global.css](src/styles/global.css), and dark mode is a single `@media (prefers-color-scheme: dark)` block that redefines only those tokens — no component carries a dark-specific rule. **Don't hardcode a hex value in a component**; if you need a new shade, add a token. `--color-surface` / `--color-surface-hover` are the raised surfaces (tag pills, code blocks, the contact and featured cards).

`--color-text-muted` is darker than a typical muted grey on purpose: it has to clear 4.5:1 against `--color-surface`, not just against white, because muted text sits on grey pills. It currently measures 6.13:1 on the page background and 5.58:1 on a surface.

**Two width tokens.** `--content-width` (52rem) is the outer column shared by the header, `<main>`, and the footer. `--prose-width` (38rem) is the long-form measure. Article containers use `max-width: var(--prose-width)` with `margin: 0` — **left-aligned, not centred** — so an `h1` sits at the same x-position on every page. Centring them made the heading jump horizontally when navigating from an index into a detail page.

Bare Markdown pages (`about.md`) have no wrapper element to constrain, so they opt in with `variant: prose` in frontmatter, which puts `.prose-page` on `<main>`. The CSS caps `main.prose-page > *` — the *children*, not `<main>` — because narrowing `<main>` would let its `margin: 0 auto` re-center the column and break alignment with the header and footer.

## Accessibility baseline

Things already in place that are easy to regress:

- A skip link in [Layout.astro](src/layouts/Layout.astro) targeting `<main id="main">`.
- One global `:focus-visible` ring in `global.css`. Don't add `outline: none` anywhere.
- `.visually-hidden` for screen-reader-only text. External links pair an `aria-hidden` `↗` with a visually-hidden "(opens in a new tab)".
- Nav and footer links are padded to 44px tall. Keep interactive targets at or above 24px (WCAG 2.5.8) and prefer 44px.
- The `/projects` sort control announces reorders through an `aria-live="polite"` status element.
- A `prefers-reduced-motion` block neutralizes transitions and animations.

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
