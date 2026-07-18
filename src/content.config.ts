import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// The `blog` collection: Markdown (or MDX, if added later) files under
// `src/content/blog/`. The Zod schema validates each post's frontmatter
// at build time and gives us full TypeScript autocomplete when querying
// via `getCollection('blog')`.
const blog = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
    // Function-form schema: the `image` helper is supplied by Astro and
    // validates that the referenced file exists relative to the markdown
    // file. It returns an `ImageMetadata` object suitable for passing to
    // `<Image src={post.data.heroImage} />`, which then gets the full
    // optimization pipeline (responsive srcset, WebP/AVIF, etc.).
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            // `coerce.date()` accepts a YAML date like `2026-05-13` and
            // returns a real `Date` object on `post.data.pubDate`.
            pubDate: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            author: z.string().optional(),
            // Optional local hero image. Place the file alongside the post
            // (e.g. `src/content/blog/my-post.cover.jpg`) and reference it
            // with `heroImage: ./my-post.cover.jpg` in frontmatter.
            heroImage: image().optional(),
            heroImageAlt: z.string().optional(),
            tags: z.array(z.string()).optional(),
            // `draft: true` posts appear in dev but are filtered out at
            // build time (see `blog.astro` and `[...slug].astro`).
            draft: z.boolean().optional().default(false),
            // Optional canonical URL — set this if a post was originally
            // published elsewhere (e.g. Substack) so search engines know
            // which copy is canonical.
            canonicalUrl: z.string().url().optional(),
        }),
});

// The `projects` collection: a curated list of things Caleb has built or
// done. Unlike `blog`, projects are sorted by a hand-set `order` number,
// not by date — the narrative arc of the projects page matters more than
// chronology. Each project can be either an internal sub-page (markdown
// body rendered at `/projects/{slug}/`) or an external link card (set
// `externalUrl` and the index page links straight out instead).
const projects = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            // One-line summary shown on the projects index card.
            description: z.string().optional(),
            // Hand-set sort key. Lower numbers appear first on `/projects`.
            // Using a number (not date) so the page tells a story instead
            // of being a timeline.
            order: z.number(),
            // Human-readable timeframe shown on cards and sub-pages —
            // free text so values like "Ongoing", "2018–2024", or
            // "June 2026" all work without fighting a Date object.
            dateLabel: z.string().optional(),
            heroImage: image().optional(),
            heroImageAlt: z.string().optional(),
            // If set, the index card becomes an outbound link (no sub-page
            // is rendered). Use this for projects that live on another
            // site, e.g. an NN/G author page.
            externalUrl: z.string().url().optional(),
            // Drafts are visible in dev, hidden in prod builds — same
            // convention as the `blog` collection.
            draft: z.boolean().optional().default(false),
        }),
});

export const collections = { blog, projects };
