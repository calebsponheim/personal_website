import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

// Generates an RSS 2.0 feed at `/rss.xml`. Feed readers like NetNewsWire,
// Feedly, Inoreader, etc. will poll this URL and notify subscribers when
// new posts appear.
export async function GET(context) {
    // Same filter the blog pages use: exclude drafts at build time.
    const posts = (
        await getCollection("blog", ({ data }) => !data.draft)
    ).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    return rss({
        title: "Caleb Sponheim",
        description:
            "Writing on applied research, AI, and design from Caleb Sponheim, PhD.",
        // `context.site` comes from the `site` field in astro.config.mjs.
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description ?? "",
            author: post.data.author,
            categories: post.data.tags,
            // Absolute URLs are required in RSS items; `context.site` is
            // joined automatically when this is a relative path.
            link: `/blog/${post.id}/`,
        })),
        customData: `<language>en-us</language>`,
    });
}
