# calebsponheim.com

Personal website and blog, built with Astro and deployed as static assets on Cloudflare Workers.

## Local setup

Use Node **22.23.4** (recorded in `.node-version`) and npm **10.9.9**, matching CI and Cloudflare Builds. A version manager such as fnm can read `.node-version`; `node --version` should print `v22.23.4`.

```sh
npm ci
npx playwright install
npm run dev          # edit with Astro at http://localhost:4321
npm run check        # type-check Astro and TypeScript
npm run build        # production output in dist/
npm run test:e2e     # built site in Cloudflare's local runtime, all three browsers
npm run test:e2e:dev # optional development-server tests
```

Build before running the production tests. Playwright starts and stops `wrangler dev --local` itself; no Cloudflare login is required. `npm run preview:worker` serves the built site manually with redirects and security headers. `npm run preview` is an Astro-only preview.

## Publishing

Create a branch and pull request. Both `build-and-test` and `Workers Builds: calebsponheim-website` must pass before merging into `main`, including for repository administrators. CI checks a clean install, security advisories, types, the build, and production browser tests. Cloudflare uploads a preview version for other branches and automatically deploys merged changes on `main`.

After merging, verify the Cloudflare build and [live site](https://calebsponheim.com/). A successful GitHub CI run alone does not confirm deployment. Do not also run `npm run deploy`: it is a manual fallback when Cloudflare Builds is unavailable.

## Maintenance

- Review Dependabot PRs weekly. Compatible npm updates are grouped; major upgrades remain separate. GitHub Actions updates and security fixes also receive PRs. Do not auto-merge failed checks.
- Keep Node, npm, `.node-version`, and this setup guide aligned when updating tooling. Cloudflare Builds and GitHub Actions read the same Node version file.
- Review the résumé, contact and external links, project dates, and domain renewal settings quarterly.
- Cloudflare Web Analytics is automatically injected. The CSP permits only its documented script and reporting hosts in addition to this site's resources; application scripts stay external.
- Secret scanning and push protection are enabled. Never commit credentials, even to a temporary branch.

Posts live in `src/content/blog/`; the feed is [/rss.xml](https://calebsponheim.com/rss.xml). See [CLAUDE.md](CLAUDE.md) for architecture and [the deployment runbook](docs/cloudflare-deploy-runbook.md) for hosting details.
