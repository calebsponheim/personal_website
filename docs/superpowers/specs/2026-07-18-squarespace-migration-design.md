# Design: Dependency modernization + Squarespace content migration

**Date:** 2026-07-18
**Author:** Caleb Sponheim (with Claude as orchestrator)
**Status:** Approved for planning

## Goal

Two sequential objectives for the Astro personal site (`calebsponheim.com`):

1. **Modernize** the toolchain — update all dependencies, including the major
   Astro 6 → 7 and `@astrojs/mdx` 5 → 7 jumps — and keep the build + tests green.
2. **Migrate content** from the live Squarespace site into the repo, *enriching
   the existing curated content structure* rather than recreating Squarespace's
   page layout.

Sequencing: **modernization first, verified green, then content migration** (user
choice — avoids doing content work on a toolchain that's about to shift).

## Non-goals

- No redesign of layouts, components, or styling.
- No new collections or schema changes (existing `blog`/`projects` schemas stand).
- No recreation of the Squarespace `/experience` CV page (homepage résumé link
  already covers it — user decision).

## Phase 1 — Dependency modernization

Current → target (from `npm outdated`):

| Package | Current | Target | Risk |
|---|---|---|---|
| `astro` | 6.1.9 | 7.1.1 | **major** — follow upgrade guide |
| `@astrojs/mdx` | 5.0.5 | 7.0.3 | **major** — follow upgrade guide |
| `astro-og-canvas` | 0.11.1 | 0.13.0 | pre-1.0 minor — check changelog (OG images) |
| `@astrojs/rss` | 4.0.18 | 4.0.19 | patch |
| `@astrojs/sitemap` | 3.7.2 | 3.7.3 | patch |
| `sharp` | 0.34.5 | 0.35.3 | minor |
| `@playwright/test` | 1.60.0 | 1.61.1 | minor |

Approach:
1. Apply patch/minor bumps first; run `npm run build` + `npm run test:e2e`.
2. Apply `astro` and `@astrojs/mdx` majors together, consulting the official Astro
   v7 and MDX v7 upgrade guides (use Astro docs tooling / context7). Fix any config
   (`astro.config.mjs`), content-collection loader, or `astro:content` API changes.
3. Verify `astro-og-canvas` 0.13 still renders the `/og/{slug}.png` images.
4. **Exit criteria:** `npm run build` succeeds AND `npm run test:e2e` passes
   (Playwright smoke test across Chromium/Firefox/WebKit). Report versions + any
   breaking-change fixes applied.

## Phase 2 — Content migration

Source-of-truth for structure = the repo. Source-of-truth for prose/images = the
live Squarespace pages. Each existing repo file gets enriched with real content
and images downloaded from the Squarespace CDN (`static1.squarespace.com`).

### Content mapping

| Squarespace source | Repo target | Action |
|---|---|---|
| `/` + `/about-industry` | `src/pages/about.md` | Replace placeholder with real About prose |
| `/brain-template`, `/array-stability`, `/brain-dynamics`, `/brain-machine-interfaces` | `src/content/projects/neuroscience-research.md` | Keep collapsed; weave in real summaries of all 4 + Google Scholar link |
| `/podcast` + 8 episode pages | `src/content/projects/science-and-feelings.md` | Port full episode list (titles, blurbs, audio/links if present) |
| `/design-training` | `src/content/projects/design-training.md` | Enrich; flip `draft: true → false` |
| `/lighting` | `src/content/projects/interactive-art.md` | Verify/enrich (images already present) |
| `/appdev` | `src/content/projects/appdev.md` **(new)** | Create new project entry — "Undergraduate UX Research Work" at Grinnell AppDev, w/ content + images |

Podcast episode URLs (8) to port:
- `.../2018/12/17/the-end-of-the-world-and-this-podcast`
- `.../2018/12/3/priorities-w-jessy-morgan`
- `.../2018/11/19/the-hotel-with-infinite-rooms`
- `.../2018/11/5/ive-gone-to-the-dark-side`
- `.../2018/10/22/science-is-a-pyramid-scheme`
- `.../2018/10/4/running-on-possum-time`
- `.../2018/9/21/episode-2-jd`
- `.../2018/8/27/cvah3f2yxv9oepnhf0ih0js6kegsye` (episode 1)

### Repo conventions every content agent must follow (from CLAUDE.md)

- **Frontmatter** matches `src/content.config.ts` schemas exactly.
- **Projects sort by `order`** (integer), not date. New `appdev.md`: propose
  `order: 45`, `dateLabel` ≈ "2012–2014" (adjust to actual). Story order, not
  chronology — final value confirmable at review.
- **Images** live alongside the entry (`src/content/projects/<slug>/…`) and are
  referenced with relative paths resolved by Astro's `image()` helper.
- **Markdown figures:** a standalone image with a title —
  `![alt](./p.jpg "caption")` — auto-renders as `<figure>` via the rehype plugin.
  Use the title slot for visible captions.
- **Draft filter** convention (`import.meta.env.DEV || !data.draft`) — nothing to
  change unless a new view is added (none planned).
- **Tags** always via `tagSlug()`.

### Image handling

Chrome extension is not connected, so agents use `curl` to fetch raw page HTML,
extract `static1.squarespace.com` image URLs, and download originals into the
entry's sibling assets folder. Prose is pulled via web-fetch (clean text). If the
user reconnects the extension, switch to live browser capture.

## Orchestration

Claude acts as orchestrator; work is delegated to subagents to preserve context.

- **Phase 1:** a single subagent performs the dependency upgrade + verification,
  reports back. Orchestrator confirms green before Phase 2.
- **Phase 2:** parallel subagents, one per content entry (About, Neuroscience,
  Podcast, Design Training, Interactive Art, AppDev). Each is self-contained:
  fetch → extract → download images → write/rewrite target file per conventions.
- **Integration:** orchestrator reviews each agent's output, then runs a final
  `npm run build` + `npm run test:e2e`. Fix stragglers.

## Success criteria

- All dependencies updated; `npm run build` and `npm run test:e2e` pass.
- Every mapped repo file contains real Squarespace content (no placeholders /
  "pardon our dust" / stub text remaining in migrated entries).
- Images downloaded locally and rendered via Astro's image pipeline (no hotlinks
  to `static1.squarespace.com`).
- `design-training.md` no longer `draft: true`.
- New `appdev.md` present and rendered on `/projects`.
- No regressions to existing pages (Lemon, NN/G, Interactive Art images, OG images).

## Open/deferred items

- `/experience` CV page — intentionally skipped.
- Podcast audio: if original audio files aren't recoverable from Squarespace, the
  episode list links to whatever archive exists (episode pages / Dropbox).
- `appdev` `order`/`dateLabel` values confirmable during review.
