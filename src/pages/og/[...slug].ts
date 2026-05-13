import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

// One auto-generated OG image per blog post, served at /og/{slug}.png.
// These are PNGs (1200×630, the conventional OG card size) baked at
// build time, so each post has a consistent branded social preview
// without us having to design one by hand.

const posts = await getCollection("blog", ({ data }) => !data.draft);

// Map each post's `id` (URL slug) to its frontmatter data — that's the
// shape OGImageRoute expects.
const pages = Object.fromEntries(posts.map((post) => [post.id, post.data]));

// `OGImageRoute` returns a Promise in 0.11+, so we await it before
// re-exporting `getStaticPaths` and `GET`. Top-level await is required.
const { getStaticPaths, GET } = await OGImageRoute({
    param: "slug",
    pages,
    getImageOptions: (_path, page) => ({
        title: page.title,
        description: page.description ?? "",
        // Dark gradient background; matches a serious, editorial feel.
        bgGradient: [
            [26, 26, 26],
            [40, 40, 60],
        ],
        // Inline-start accent bar in the link color from global.css.
        border: { color: [59, 59, 191], width: 24, side: "inline-start" },
        padding: 80,
        font: {
            title: {
                size: 64,
                color: [255, 255, 255],
                weight: "Bold",
                lineHeight: 1.2,
            },
            description: {
                size: 28,
                color: [200, 200, 200],
                weight: "Normal",
                lineHeight: 1.4,
            },
        },
    }),
});

export { getStaticPaths, GET };
