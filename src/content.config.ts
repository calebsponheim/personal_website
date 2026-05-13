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

export const collections = { blog };
