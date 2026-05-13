// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { rehypeImageFigures } from './src/lib/rehype-image-figures.js';

// https://astro.build/config
export default defineConfig({
    // TODO: replace with your real domain. Used for RSS feed URLs,
    // canonical link tags, sitemap entries, and Open Graph image URLs.
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
        // Custom rehype plugin: any Markdown image with a title attribute
        // — `![alt](src "caption")` — is wrapped in a <figure> with a
        // <figcaption>. See src/lib/rehype-image-figures.js for details.
        rehypePlugins: [rehypeImageFigures],
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
