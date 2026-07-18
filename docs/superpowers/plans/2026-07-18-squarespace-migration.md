# Dependency Modernization + Squarespace Content Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the Astro toolchain (incl. Astro 6→7, MDX 5→7) with a green build, then migrate real content + images from the live Squarespace site into the repo's existing curated structure.

**Architecture:** Two phases. Phase 1 is a single sequential dependency upgrade verified by build + Playwright. Phase 2 is six independent content-migration tasks (one per repo entry), each self-contained (fetch → extract prose → download images locally → write file per repo conventions), runnable in parallel by subagents, then integrated with a final build + test.

**Tech Stack:** Astro 7, `@astrojs/mdx` 7, `@astrojs/rss`, `@astrojs/sitemap`, `astro-og-canvas`, `sharp`, Playwright. Content pulled via WebFetch (prose) + `curl` (raw HTML + images).

## Global Constraints

- Node `>=22.12.0` (unchanged; current runtime is v22.19.0).
- Work happens on branch `squarespace-migration` (already created).
- Frontmatter MUST validate against `src/content.config.ts` schemas exactly.
- Projects sort by integer `order`, NOT date. Spaced increments (10, 20, 30…).
- Images live alongside their entry (`src/content/projects/<slug>/…`) and are referenced with relative paths for Astro's `image()` helper. NO hotlinks to `static1.squarespace.com` in committed files.
- Markdown figures: standalone image with a title `![alt](./p.jpg "caption")` auto-renders `<figure><figcaption>` via `src/lib/rehype-image-figures.js`. Use the title slot for visible captions.
- Draft filter idiom `import.meta.env.DEV || !data.draft` — do not alter existing views.
- Tag URLs always via `tagSlug()` from `src/utils/tags.ts`.
- 4-space indent in `.astro`/`.ts`/`.js`. Comments explain *why*.
- Exit gate for every task: `npm run build` succeeds.

---

### Task 1: Safe dependency bumps (patch/minor)

**Files:**
- Modify: `package.json`, `package-lock.json`

**Interfaces:**
- Produces: an updated lockfile with `@astrojs/rss@4.0.19`, `@astrojs/sitemap@3.7.3`, `sharp@0.35.x`, `@playwright/test@1.61.x`. No API changes expected.

- [ ] **Step 1: Update the low-risk packages**

```bash
cd /Users/calebsponheim/Documents/Git/personal_website
npm install @astrojs/rss@latest @astrojs/sitemap@latest sharp@latest @playwright/test@latest
```

- [ ] **Step 2: Build to verify no regressions**

Run: `npm run build`
Expected: exit 0, `dist/` regenerated, no schema/collection errors.

- [ ] **Step 3: Run smoke test**

Run: `npm run test:e2e`
Expected: PASS across Chromium/Firefox/WebKit. (Playwright boots the dev server itself.)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: bump rss, sitemap, sharp, playwright (minor/patch)"
```

---

### Task 2: Major upgrades — Astro 7 + MDX 7 + astro-og-canvas 0.13

**Files:**
- Modify: `package.json`, `package-lock.json`, `astro.config.mjs` (if the upgrade guides require), any `astro:content`/loader usage in `src/content.config.ts` if APIs changed.

**Interfaces:**
- Consumes: green build from Task 1.
- Produces: `astro@7.x`, `@astrojs/mdx@7.x`, `astro-og-canvas@0.13.x` installed; build + OG image generation intact.

- [ ] **Step 1: Read the upgrade guides before changing anything**

Use the Astro docs MCP (`mcp__Astro_docs__search_astro_docs`) and/or context7 to pull the **Astro v7 upgrade guide** and **`@astrojs/mdx` v7** notes. Also check the `astro-og-canvas` CHANGELOG for 0.12→0.13. Note any breaking changes touching: `astro.config.mjs`, content collections / `glob` loader, `astro:assets`, `astro:content` types, MDX integration options.

- [ ] **Step 2: Install the majors together**

```bash
npm install astro@latest @astrojs/mdx@latest astro-og-canvas@latest
```

- [ ] **Step 3: Apply any required migration edits**

Apply the specific changes the guides call for (only what's needed — no speculative refactors). Common candidates: integration option renames in `astro.config.mjs`, content-config API shifts. Keep 4-space indent and existing comment style.

- [ ] **Step 4: Build and verify OG images**

Run: `npm run build`
Expected: exit 0. Then confirm OG PNGs were emitted:
Run: `ls dist/og/`
Expected: at least one `.png` (e.g. the existing blog post's OG image). If OG generation broke, fix per the `astro-og-canvas` 0.13 changelog before proceeding.

- [ ] **Step 5: Run smoke test**

Run: `npm run test:e2e`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: upgrade to Astro 7 + MDX 7 + astro-og-canvas 0.13"
```

**PHASE 1 GATE:** Do not begin Phase 2 until Tasks 1–2 are committed and both `npm run build` and `npm run test:e2e` pass. Report installed versions + any breaking-change fixes.

---

## Phase 2 — Content migration

Tasks 3–8 are **independent** and may run as parallel subagents. Each subagent receives: its source URL(s), its target file, and the Global Constraints above. Shared procedure for every content task:

1. **Fetch prose:** WebFetch each source URL asking for the full body text verbatim (headings, paragraphs, captions, links, dates).
2. **Fetch raw HTML for image URLs:** `curl -sL "<url>" -o /tmp/<slug>.html` then extract `static1.squarespace.com` image URLs (grep for `src=` / `data-src=` / `og:image`). Squarespace CDN URLs often carry a `?format=` query — strip it or request `?format=2500w` for a large original.
3. **Download images locally:**
   ```bash
   mkdir -p src/content/projects/<slug>
   curl -sL "<image-url>" -o src/content/projects/<slug>/<name>.jpg
   ```
   Verify each file is a real image (`file src/content/projects/<slug>/*.jpg` → "JPEG/PNG/WebP image data", non-zero size), not an HTML error page.
4. **Write the target `.md`** with valid frontmatter + real prose + relative image refs (figure captions via the title slot). Preserve the existing `order`/`dateLabel` unless the task says otherwise.
5. **Verify** (per-task steps below).

---

### Task 3: About page

**Files:**
- Modify: `src/pages/about.md`
- Assets (if any portrait/inline images used): `src/assets/` or inline — About is a page, not a collection entry, so images go in `src/assets/` and use `<Image>` OR are omitted if none.

**Interfaces:**
- Consumes: Phase 1 green build.
- Produces: an About page with real bio prose, no placeholder text.

- [ ] **Step 1:** Fetch `https://www.calebsponheim.com/` and `https://www.calebsponheim.com/about-industry`; capture the real About/bio prose.
- [ ] **Step 2:** Replace the placeholder body of `src/pages/about.md` (keep the existing frontmatter: `layout`, `title`). Preserve the layout front-matter line exactly. If the current draft prose (former neuroscientist / AI expert paragraphs) is genuine and worth keeping, integrate it; otherwise replace with the Squarespace content.
- [ ] **Step 3: Verify no placeholder remains**

Run: `grep -in "pardon our dust\|nothing to see here" src/pages/about.md`
Expected: no matches (exit 1).

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.md src/assets 2>/dev/null; git commit -m "content: migrate About page from Squarespace"
```

---

### Task 4: Neuroscience Research (collapsed)

**Files:**
- Modify: `src/content/projects/neuroscience-research.md`
- Create (images, if worth including): `src/content/projects/neuroscience-research/`

**Interfaces:**
- Produces: one enriched entry summarizing all four brain projects. Keep `order: 70`.

- [ ] **Step 1:** Fetch all four: `/brain-template`, `/array-stability`, `/brain-dynamics`, `/brain-machine-interfaces`. Capture each page's real description.
- [ ] **Step 2:** Download any key figure images (per shared procedure) into `neuroscience-research/`.
- [ ] **Step 3:** Rewrite the body: a short intro, then a subsection (`##`) per project with its real summary, retaining the existing Google Scholar link. Keep `order: 70`, `dateLabel: "2013-2023"`, `draft: false`.
- [ ] **Step 4: Verify no stub text remains**

Run: `grep -in "how do you condense" src/content/projects/neuroscience-research.md`
Expected: no matches, unless deliberately kept as an intentional intro line (agent's judgment — if kept, it must be followed by real content).

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/content/projects/neuroscience-research*
git commit -m "content: enrich Neuroscience Research from 4 Squarespace pages"
```

---

### Task 5: Science & Feelings podcast (8 episodes)

**Files:**
- Modify: `src/content/projects/science-and-feelings.md`
- Create (cover art, if present): `src/content/projects/science-and-feelings/`

**Interfaces:**
- Produces: one entry with a full 8-episode list. Keep `order: 60`, `dateLabel: "2018"`.

- [ ] **Step 1:** Fetch `/podcast` and each of the 8 episode URLs (listed in the spec). For each episode capture: title, date, description/show-notes, and any audio/embed link present.
- [ ] **Step 2:** Download the podcast cover art if available.
- [ ] **Step 3:** Rewrite the body: keep the existing intro voice, then render the 8 episodes as a list (chronological), each with title, date, blurb, and a link to whatever archive/audio exists (episode page, Dropbox, or embed URL). Keep the existing Dropbox archive link as a fallback.
- [ ] **Step 4: Verify all 8 episodes present**

Run: `grep -ic "possum\|jessy morgan\|infinite rooms\|dark side\|pyramid scheme\|end of the world\|jd\|episode 1" src/content/projects/science-and-feelings.md`
Expected: ≥ 6 matches (titles vary; confirm 8 episodes represented by eye).

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/content/projects/science-and-feelings*
git commit -m "content: port podcast episode list from Squarespace"
```

---

### Task 6: Design Training (Corporate Training)

**Files:**
- Modify: `src/content/projects/design-training.md`

**Interfaces:**
- Produces: enriched entry with `draft: false`. Keep `order: 20`.

- [ ] **Step 1:** Fetch `/design-training`; capture the real content.
- [ ] **Step 2:** Merge Squarespace content with the existing bullet list (fix the "Professioanls" typo). Flip `draft: true` → `draft: false`.
- [ ] **Step 3: Verify draft flipped**

Run: `grep -in "draft:" src/content/projects/design-training.md`
Expected: `draft: false`.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exit 0. Confirm the entry now appears in a production build (not just dev).

- [ ] **Step 5: Commit**

```bash
git add src/content/projects/design-training.md
git commit -m "content: enrich Design Training + publish (draft:false)"
```

---

### Task 7: Interactive Art (verify/enrich)

**Files:**
- Modify: `src/content/projects/interactive-art.md` (only if the live page has content the repo lacks)

**Interfaces:**
- Produces: verified entry. Keep `order: 50`. Images already present under `interactive-art/`.

- [ ] **Step 1:** Fetch `/lighting`; compare its prose to the existing (already fleshed-out) entry.
- [ ] **Step 2:** If the live page has additional prose/captions/images not in the repo, add them (download any missing images per shared procedure). If the repo entry is already complete, make no changes and note that.
- [ ] **Step 3: Verify existing images still resolve**

Run: `npm run build`
Expected: exit 0 (image() would fail the build if a referenced file were missing).

- [ ] **Step 4: Commit (only if changed)**

```bash
git add src/content/projects/interactive-art* && git commit -m "content: reconcile Interactive Art with Squarespace /lighting" || echo "no changes"
```

---

### Task 8: AppDev — new project entry

**Files:**
- Create: `src/content/projects/appdev.md`
- Create: `src/content/projects/appdev/` (images)

**Interfaces:**
- Consumes: the `projects` schema (`title`, `description`, `order`, `dateLabel`, `heroImage?`, `heroImageAlt?`, `draft`).
- Produces: a new, rendered project at `/projects/appdev/`.

- [ ] **Step 1:** Fetch `/appdev`; capture title ("Undergraduate UX Research Work"), description, body, and images.
- [ ] **Step 2:** Download images into `src/content/projects/appdev/` (per shared procedure; verify with `file`).
- [ ] **Step 3:** Write `appdev.md` with frontmatter: `title`, `description`, `order: 45`, `dateLabel: "2012–2014"` (adjust to actual dates found), optional `heroImage`/`heroImageAlt`, `draft: false`. Body = real content with figure captions.
- [ ] **Step 4: Verify it builds and routes**

Run: `npm run build`
Expected: exit 0, and `ls dist/projects/appdev/` shows an `index.html`.

- [ ] **Step 5: Commit**

```bash
git add src/content/projects/appdev*
git commit -m "content: add AppDev (Undergraduate UX Research) project"
```

---

### Task 9: Integration + final verification

**Files:**
- None new; may fix stragglers surfaced by review.

**Interfaces:**
- Consumes: all Phase 2 commits.

- [ ] **Step 1: Confirm no hotlinks or placeholders leaked into committed content**

Run: `grep -rIn "static1.squarespace.com" src/ ; grep -rIn "pardon our dust\|TODO\|TBD\|lorem ipsum" src/pages src/content`
Expected: no matches (query images stripped to local files; no placeholders).

- [ ] **Step 2: Full build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Full smoke test**

Run: `npm run test:e2e`
Expected: PASS.

- [ ] **Step 4: Manual visual spot-check (optional but recommended)**

Run: `npm run preview` and load `/`, `/about`, `/projects`, and each project sub-page; confirm text + images render.

- [ ] **Step 5: Finishing the branch**

Use `superpowers:finishing-a-development-branch` to choose merge/PR/cleanup with the user.

---

## Self-Review

**Spec coverage:**
- Phase 1 deps (all 7 packages) → Tasks 1–2. ✓
- Astro/MDX majors + OG verification → Task 2. ✓
- About migration → Task 3. ✓
- Neuroscience collapsed enrich → Task 4. ✓
- Podcast 8 episodes → Task 5. ✓
- Design Training enrich + publish → Task 6. ✓
- Interactive Art reconcile → Task 7. ✓
- AppDev new entry → Task 8. ✓
- Experience skipped → not a task (correct). ✓
- Success criteria (no placeholders, local images, build+test green) → Task 9. ✓

**Placeholder scan:** Content prose is intentionally fetched at execution time (can't be known now); every task instead has concrete verification commands with expected output. No "TBD/implement later" in process steps. ✓

**Type/name consistency:** File paths, slugs, and `order` values consistent across tasks and with `content.config.ts` (`title`, `description`, `order`, `dateLabel`, `heroImage`, `heroImageAlt`, `externalUrl`, `draft`). ✓
