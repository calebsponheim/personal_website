# calebsponheim.com

Personal website and blog. Built with [Astro](https://astro.build/), statically generated, hosted at [calebsponheim.com](https://calebsponheim.com/).

Posts live in [`src/content/blog/`](src/content/blog/). The feed is at [`/rss.xml`](https://calebsponheim.com/rss.xml).

## Running locally

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static build → ./dist/
npm run test:e2e  # Playwright smoke tests
```

Requires Node 22.12+.
