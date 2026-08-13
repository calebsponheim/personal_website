import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";
import { ogImageOptions } from "../../lib/og-image";

// One auto-generated OG image per blog post, served at /og/{slug}.png.
// These are PNGs (1200×630, the conventional OG card size) baked at
// build time, so each post gets the shared ASCII field artwork
// with its own headline and publication date.

const posts = await getCollection("blog", ({ data }) => !data.draft);

// Map each post's `id` (URL slug) to its frontmatter data — that's the
// shape OGImageRoute expects.
const pages = Object.fromEntries(posts.map((post) => [post.id, post.data]));

// `OGImageRoute` returns a Promise in 0.11+, so we await it before
// re-exporting `getStaticPaths` and `GET`. Top-level await is required.
//
// astro-og-canvas 0.13 removed the `param` option — the route parameter
// name is now auto-detected from this file's name (`[...slug].ts` -> `slug`).
const { getStaticPaths, GET } = await OGImageRoute({
    pages,
    getImageOptions: (_path, page) =>
        ogImageOptions(
            page.title,
            `CALEB SPONHEIM  /  ${page.pubDate
                .toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    timeZone: "UTC",
                    year: "numeric",
                })
                .toUpperCase()}`,
        ),
});

export { getStaticPaths, GET };
