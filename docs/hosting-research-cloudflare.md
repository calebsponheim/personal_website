# Hosting `calebsponheim.com` on Cloudflare + migrating off Squarespace

Research date: 2026-07-18. All claims below are sourced from live docs/search results fetched on this date; Cloudflare's docs and pricing can change, so re-verify before acting if this report is read much later.

## Recommended path (for this project)

1. **Add the domain to Cloudflare as a zone first** (DNS-only, no registrar change yet). In Squarespace DNS settings, disable DNSSEC if enabled and wait ~24h. Add `calebsponheim.com` to Cloudflare, switch nameservers at Squarespace to the two Cloudflare-assigned ones, and wait for the zone to go "Active" (minutes, up to 24h).
2. **Deploy the site to a Cloudflare Worker with static assets** while still on the old registrar — this can happen in parallel with step 1 and costs nothing to try:
   - No `@astrojs/cloudflare` adapter needed — this repo already does `astro build` → `dist/`, which is exactly what static-assets Workers wants.
   - Add a minimal `wrangler.jsonc` (example in Q2 below), run `npx astro build && npx wrangler deploy`.
   - Wire up **Workers Builds** (Cloudflare's git integration) pointed at the GitHub repo for auto-deploy on push, replacing whatever manual deploy step exists today.
3. **Point DNS at the Worker**: in the Worker's *Settings → Domains & Routes*, add `calebsponheim.com` and `www.calebsponheim.com` as Custom Domains. Cloudflare creates/updates the proxied DNS records and issues certs automatically. Verify the live site on the Cloudflare-served domain before touching registration.
4. **Only after the site is confirmed working on Cloudflare DNS**, start the registrar transfer: unlock the domain in Squarespace, request the auth/EPP code, then in Cloudflare go to *Domain Registration → Transfer Domains*, enter the code, confirm contacts, and approve the transfer email Squarespace sends. Expect up to ~10 days for the transfer to finalize (this runs in the background — DNS/site already work, so there's no downtime risk during this window).
5. **Gotcha to check now, not later**: Squarespace enforces a mandatory 60-day lock after initial registration or after any transfer/registrant-contact change. If the domain was registered or had contact info changed within the last 60 days, the registrar transfer (step 4) will be blocked until that window passes — but steps 1–3 (DNS + hosting) are unaffected by this lock and can be done immediately. If you're inside the 60-day window, do steps 1–3 now and schedule step 4 for whenever the lock clears.

This gets the site itself off Squarespace immediately, and decouples that from the (potentially delayed) registrar transfer — minimizing both downtime and the chance of being blocked by Squarespace's lock rules.

---

## 1. Workers vs Pages for a static Astro site (2026)

Cloudflare's own migration guide frames this as **not** a hard deprecation: Pages is not declared deprecated or in a stated maintenance-mode in the docs' own wording, but Cloudflare is steering new projects to Workers with static assets and shipping new platform features (Secrets Store, Workflows, Containers, etc.) to Workers first or exclusively. Their guidance: for a **new** project, start on Workers directly; for an existing, working Pages project, there's no forcing deadline — migrate only when you have a concrete reason (adding backend logic, consolidating frontend/backend, or hitting a Pages-specific limitation).

For a purely static site specifically, the docs describe near feature-parity on the core "serve files" use case, with static-asset requests billed identically (free/unlimited request-wise) on both platforms. The differences that remain:

- **Pages-only conveniences**: automatic Early Hints, simpler default 404.html/index.html detection, custom domains that don't require the domain to be a full Cloudflare DNS zone.
- **Workers-only advantages**: broader platform surface (Durable Objects, Cron Triggers, richer observability, Quick Editor, remote dev), and it's where all *new* features land first going forward.

**Verdict for this project**: since this is a brand-new deployment (not an existing Pages project) and the user explicitly wants to be on Cloudflare's forward path, deploy directly to **Workers with static assets** rather than Pages. This matches Cloudflare's own "new project → Workers" guidance.

- [Migrate from Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)
- [Static Assets · Cloudflare Workers docs](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)

---

## 2. Deploying static Astro to Cloudflare Workers (static assets)

Per Astro's own deployment docs, for a fully static site (this project's default `output` mode — no SSR), **`@astrojs/cloudflare` is not required**. Plain `astro build` producing `dist/` plus a static-assets `wrangler.jsonc` is sufficient. The adapter is only needed for on-demand rendering (SSR).

Minimal working config (per Astro docs and Cloudflare's static-assets reference):

```jsonc
// wrangler.jsonc
{
  "name": "calebsponheim-com",
  "compatibility_date": "2026-07-18",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"   // this repo has a custom src/pages/404.astro
  }
}
```

No `main` worker entry point is required for a pure static deployment — the `assets` block alone is enough; the docs note a Worker script is only invoked if present and no matching asset is found.

Build + deploy:

```bash
npx astro build && npx wrangler deploy
```

Local preview of the built output through Wrangler:

```bash
npx astro build && npx wrangler dev
```

Notes/gotchas found during research:
- If using the `@cloudflare/vite-plugin` you'd omit `assets.directory` (plugin infers it) — not applicable here since this project isn't using that plugin.
- A GitHub PR against `withastro/astro` (#15694) flagged an adapter-only bug (`preserveBuildClientDir` causing `dist/client/` vs `dist/`) — irrelevant here since no adapter is installed for a pure static build.

- [Deploy your Astro Site to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Astro · Cloudflare Workers docs (framework guide)](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)
- [Static Assets · Cloudflare Workers docs](https://developers.cloudflare.com/workers/static-assets/)
- [astrojs/cloudflare adapter docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)

---

## 3. Deploy-from-GitHub (CI)

Workers now has its own git-connected auto-deploy feature called **Workers Builds** — the direct analog of what Pages did:

- Connect a GitHub or GitLab repo (individual or org account, non-self-hosted) under the Worker's dashboard settings.
- Every push to the configured branch triggers an automatic build + deploy; PRs get preview deployments.
- If the repo lacks a `wrangler.jsonc`, Cloudflare's "autoconfig" can detect the framework and open a PR adding one.
- Build status surfaces as GitHub check runs.
- Automatic deploys can be disabled while still uploading versions manually via `wrangler versions upload`.

Alternative for more control: plain **Wrangler CLI in GitHub Actions** — Cloudflare publishes an official `cloudflare/wrangler-action` and a near-zero-config `deploy.workers.cloudflare.com` GitHub Action template.

- [Builds · Cloudflare Workers docs](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Git integration · Cloudflare Workers docs](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)
- [GitHub integration · Cloudflare Workers docs](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/)
- [deploy.workers.cloudflare.com (GitHub Actions template)](https://github.com/cloudflare/deploy.workers.cloudflare.com)

---

## 4. Free tier limits: Workers static assets vs Pages

| Limit | Workers Free | Workers Paid | Pages (historical) |
|---|---|---|---|
| Worker request/invocation quota | 100,000 requests/day (resets midnight UTC) | No enforced daily cap | N/A (Pages Functions billed as Workers) |
| **Static asset requests** | Not counted against the Worker invocation quota — served directly, no invocation billed | Same | Unlimited/free, same model |
| Max files per deployment ("Worker version") | 20,000 | 100,000 (needs Wrangler ≥ 4.34.0) | — |
| Max file size | 25 MiB | 25 MiB | — |
| Workers Builds (CI) build minutes/month | 3,000 | 6,000 (then $0.005/min overage) | — |
| Concurrent builds | 1 | 6 | — |
| Max build duration | 20 minutes | 20 minutes | — |

Important nuance: "static assets are free/unlimited" refers to **request billing** (an asset request doesn't consume the Worker's invocation quota) — it does **not** mean unlimited file count. The 20,000/100,000 file-count ceiling is a separate, real limit on how many distinct files can ship in one deployment. For a personal blog with images, this is unlikely to be hit, but worth knowing if the photo/asset count grows substantially.

- [Pricing · Cloudflare Workers docs](https://developers.cloudflare.com/workers/platform/pricing/)
- [Limits · Cloudflare Workers docs](https://developers.cloudflare.com/workers/platform/limits/)
- [Limits & pricing · Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)

**Could not fully verify**: an official side-by-side Pages-vs-Workers limits table doesn't appear to exist anymore in the docs (Pages' own limits page still exists at `developers.cloudflare.com/pages/platform/limits/` but wasn't cross-checked line-by-line against the numbers above in this pass).

---

## 5. Domain migration: Squarespace → Cloudflare

### Step order that minimizes downtime

The key insight: **DNS/hosting migration and registrar transfer are independent** — do DNS first (fast, no lock risk), then transfer registration at leisure.

**(a) Move DNS to Cloudflare, keep Squarespace as registrar (do this first):**
1. Disable DNSSEC at Squarespace if enabled; wait ≥24h for propagation.
2. Add the domain to Cloudflare (full DNS setup) — this is a prerequisite for the later registrar transfer too; Cloudflare requires the domain be active on Cloudflare DNS before it will accept an auth code.
3. Update nameservers at Squarespace to Cloudflare's assigned pair.
4. Wait for "Active" status in the Cloudflare dashboard (usually minutes, up to 24h).
5. Add `calebsponheim.com` and `www.calebsponheim.com` as **Custom Domains** on the Worker (Worker → Settings → Domains & Routes). Cloudflare auto-creates the proxied DNS records and issues TLS certs.

**(b) Transfer the registrar to Cloudflare Registrar (do this once (a) is verified working, and once outside any lock window):**
1. In Squarespace, unlock the domain (toggle off "Domain Lock" in the domains dashboard).
2. Request the transfer authorization code ("Send Transfer Authorization Code" / EPP code) — Squarespace emails it to the registrant contact, typically within 24h.
3. In Cloudflare dashboard → **Transfer domains**, select the domain, paste the auth code, confirm contact info and payment, and select "Confirm transfer."
4. Approve the transfer confirmation email Squarespace sends.
5. Wait for completion — Cloudflare states total time up to **10 days** depending on registrar; Squarespace's own doc says the process "can take up to 15 days." Cloudflare transfers are at-cost with no markup and typically add a one-year extension to the expiration date.

### Gotchas

- **60-day ICANN lock**: Squarespace must place a mandatory 60-day lock after initial registration, after any inbound transfer, and after registrant contact-info changes (registrant name/org/email). This blocks the registrar transfer (step b) until it clears — but does **not** block the DNS/hosting migration (step a), so there's no reason to wait on hosting.
- If DNSSEC was ever enabled, it must be removed and given time to propagate before either the zone activation or the transfer will succeed cleanly.
- If a domain was recently renewed, Squarespace's guidance is to wait ~45 days past the *original* expiration date before transferring.
- Preserve DNS records before transferring — most registrars don't carry over records automatically (moot here since DNS already lives on Cloudflare after step (a)).
- If Google Workspace or any third-party MX/TXT records exist, re-verify them post-migration.

- [Transfer your domain to Cloudflare · Cloudflare Registrar docs](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/)
- [Onboard a domain · Cloudflare Fundamentals docs](https://developers.cloudflare.com/fundamentals/manage-domains/add-site/)
- [Custom Domains · Cloudflare Workers docs](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Domain locks – Squarespace Help Center](https://support.squarespace.com/hc/en-us/articles/360034059332-Domain-locks)
- [Transferring a domain away from Squarespace – Squarespace Help Center](https://support.squarespace.com/hc/en-us/articles/205812338-Transferring-a-domain-away-from-Squarespace)

---

## 6. Reality check vs Netlify and Vercel

For a small static Astro personal site, all three free tiers would technically work, but Cloudflare Workers is the only one of the three with **unlimited free bandwidth and unlimited static-asset requests** — Netlify's free tier is credit/build-minute metered (300 build min/mo) and Vercel's free tier explicitly disallows commercial use and caps serverless invocations (100 GB bandwidth, 100k invocations). Vercel and Netlify both remain the smoother "git push → done" experience for pure Jamstack with more polished preview-deployment UX out of the box, but for a no-SSR static Astro blog with modest but nonzero request volume, Cloudflare's combination of free unlimited static bandwidth + Workers Builds git integration + already-planned DNS migration makes it the most cost-effective and operationally simplest choice for this specific project.

- [Netlify vs Vercel 2026 pricing comparison](https://toolchase.com/blog/netlify-vs-vercel/)
- [Vercel vs Netlify vs Cloudflare Pages: Pricing Comparison 2026](https://www.devtoolreviews.com/reviews/vercel-vs-netlify-vs-cloudflare-pages-pricing-comparison-2026)

---

## What could not be fully verified

- No official Cloudflare doc explicitly states Pages is "deprecated" or "maintenance mode" in those words — that characterization in some third-party 2026 blog posts goes beyond what Cloudflare's own docs currently say. Treat "Pages is being folded into Workers over time" as directionally true but not an official deprecation announcement.
- Could not find a current, single authoritative Cloudflare page directly comparing Pages' historical free-tier limits against Workers' static-asset limits line-by-line (the pages limits doc exists at `developers.cloudflare.com/pages/platform/limits/` but wasn't cross-verified number-for-number against the Workers Builds numbers above).
- Exact current Squarespace-side UI labels ("Send Transfer Authorization Code" vs "Request transfer code") appear to differ slightly between two Squarespace help articles fetched — this may reflect a recent Squarespace UI update; verify wording in the live dashboard when performing the transfer.
