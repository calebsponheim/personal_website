// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { rehypeImageFigures } from './src/lib/rehype-image-figures.js';

// https://astro.build/config
export default defineConfig({
    // Canonical public origin for RSS, canonical links, sitemap entries, and
    // Open Graph image URLs. www is redirected to this apex host in src/worker.js.
    site: 'https://calebsponheim.com',
    integrations: [mdx(), sitemap()],
    markdown: {
        // Shiki theme for fenced code blocks. `github-light` is a clean,
        // recognizable light theme that harmonizes with the rest of the
        // site. When you add dark mode later, swap this for:
        //   themes: { light: 'github-light', dark: 'github-dark' }
        // and Shiki will emit dual-theme CSS variables automatically.
        shikiConfig: {
            theme: 'github-light',
            wrap: true,
        },
        // Astro 7 defaults to the Sätteri Markdown pipeline, which doesn't
        // support remark/rehype plugins. We depend on a custom rehype
        // plugin below, so we explicitly opt back into the remark/rehype
        // pipeline via `unified()` (from @astrojs/markdown-remark) per the
        // Astro v7 upgrade guide.
        processor: unified({
            // Custom rehype plugin: any Markdown image with a title
            // attribute — `![alt](src "caption")` — is wrapped in a
            // <figure> with a <figcaption>. See
            // src/lib/rehype-image-figures.js for details.
            rehypePlugins: [rehypeImageFigures],
        }),
    },
    fonts: [
        {
            provider: fontProviders.google(),
            name: 'Inter',
            cssVariable: '--font-inter',
            weights: ['100 900'],
            styles: ['normal', 'italic'],
        },
        {
            // Newsreader — a soft, calm transitional serif designed for
            // editorial long-form reading. Used for blog post body text;
            // Inter stays in charge of UI and headings.
            provider: fontProviders.google(),
            name: 'Newsreader',
            cssVariable: '--font-newsreader',
            weights: ['200 800'],
            styles: ['normal', 'italic'],
        },
    ],
});
