# Cloudflare Workers deploy runbook

Practical checklist for shipping this site to Cloudflare Workers (static assets)
and migrating the domain off Squarespace. For the full rationale, sourcing, and
gotchas behind each step, see
[docs/hosting-research-cloudflare.md](./hosting-research-cloudflare.md).

Scaffolding already in place: `wrangler.jsonc` (static-assets Worker with a
minimal `src/worker.js` entrypoint for the canonical-host redirect), `wrangler`
as a devDependency, and a `npm run deploy` script (`astro build && wrangler deploy`).

## Current state (verified 2026-08-07)

- `calebsponheim.com` is an active full Cloudflare zone.
- The registrar is Cloudflare, Inc.; the domain transfer is complete.
- `calebsponheim.com` and `www.calebsponheim.com` are custom domains on the
  `calebsponheim-website` Worker.
- The apex site returns `200`, and `www` redirects to the apex over HTTPS.
- Legacy Squarespace paths in `public/_redirects` are returning the expected
  `301` redirects in production.
- Deployments are currently uploaded with Wrangler. GitHub Actions now runs
  the build and browser smoke tests, but it does not deploy automatically.

## 1. First-time deploy

1. `npm run cf:login` (or `npx wrangler login`) — opens a browser to authenticate
   Wrangler with your Cloudflare account. One-time, until the token expires.
2. `npm run deploy` — builds the static site to `dist/` and uploads it as a
   Worker with static assets. First run creates the Worker (name comes from
   `wrangler.jsonc`); subsequent runs just push a new version.
3. Confirm the site loads at the `*.workers.dev` URL Wrangler prints.

## 2. Connect Workers Builds (git auto-deploy)

1. In the Cloudflare dashboard, open the Worker created in step 1 → go to its
   **Settings → Builds** (or **Build** tab depending on dashboard version).
2. Connect the GitHub account, then select the `calebsponheim/personal_website`
   repo and the branch to auto-deploy (typically `main`).
3. If prompted, confirm the build command (`npm run build` / `astro build`) and
   output directory (`dist`) — Cloudflare's autoconfig usually detects Astro
   correctly, but double check against `wrangler.jsonc`'s `assets.directory`.
4. Push to the connected branch and confirm a build/deploy runs automatically
   and shows up as a GitHub check run. PRs against that branch will get preview
   deployments.
5. Optional: once this is working, manual `npm run deploy` is no longer
   required for normal changes — keep it as a fallback for one-off pushes.

## 3. Domain migration — DNS first, registrar transfer later

Do **not** do these in the "obvious" order (transfer registrar, then point
DNS). Do DNS/hosting first — it's fast and carries no lock risk — then
transfer the registrar at leisure.

### 3a. Move DNS to Cloudflare (do this first, independent of the Worker deploy)

1. In Squarespace DNS settings, disable DNSSEC if enabled; wait ~24h for that
   to propagate before continuing.
2. Add `calebsponheim.com` to Cloudflare as a zone (DNS-only setup — no
   registrar change yet).
3. Update nameservers at Squarespace to the two Cloudflare-assigned ones.
4. Wait for the zone to show **Active** in the Cloudflare dashboard (usually
   minutes, up to 24h).
5. On the Worker from step 1 above, go to **Settings → Domains & Routes** and
   add `calebsponheim.com` and `www.calebsponheim.com` as **Custom Domains**.
   Cloudflare creates the proxied DNS records and issues TLS certs
   automatically.
6. Verify the live site on the real domain before touching registration at
   all.

### 3b. Transfer the registrar (only after 3a is verified working)

1. **Check the lock window first**: Squarespace enforces a mandatory 60-day
   lock after initial registration, after any transfer, or after a
   registrant-contact-info change. If you're inside that window, the transfer
   below will be rejected — wait it out. This does **not** block step 3a.
2. In Squarespace, unlock the domain (toggle off "Domain Lock").
3. Request the transfer authorization/EPP code from Squarespace (emailed to
   the registrant contact, typically within 24h).
4. In the Cloudflare dashboard → **Transfer Domains**, enter the auth code,
   confirm contact info, and confirm the transfer.
5. Approve the confirmation email Squarespace sends.
6. Wait for completion — Cloudflare/Squarespace both cite up to ~10-15 days.
   No downtime risk during this window since DNS/hosting already live on
   Cloudflare from step 3a.

## Notes

- Don't run `wrangler login` or a real `wrangler deploy` from an automated
  agent session — these steps are meant to be run by hand.
- If Google Workspace or any other third-party MX/TXT records exist on the
  current DNS, re-add them on the Cloudflare zone before cutting over, and
  re-verify after.
