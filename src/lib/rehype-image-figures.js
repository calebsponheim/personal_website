import { visit } from "unist-util-visit";

/**
 * Rehype plugin: converts standalone Markdown images that have a title
 * attribute into semantic <figure>/<figcaption> pairs.
 *
 * Source Markdown:
 *   ![Short alt for screen readers](./photo.jpg "Visible caption text.")
 *
 * Default Astro/rehype output:
 *   <p><img alt="..." src="..." title="Visible caption text."></p>
 *
 * After this plugin:
 *   <figure>
 *     <img alt="..." src="...">
 *     <figcaption>Visible caption text.</figcaption>
 *   </figure>
 *
 * Why only paragraphs containing *just* an image? Markdown's parser wraps
 * loose images in <p>, but inline images (an image mixed with text in a
 * sentence) should stay as <img> — figures are a block-level construct.
 */
export function rehypeImageFigures() {
    return (tree) => {
        visit(tree, "element", (paragraph, index, parent) => {
            if (paragraph.tagName !== "p" || parent == null || index == null) {
                return;
            }

            // Strip pure-whitespace text nodes so a line like `![](...)\n`
            // counts as "paragraph contains only an image."
            const meaningfulChildren = paragraph.children.filter((child) => {
                if (child.type === "text" && child.value.trim() === "") {
                    return false;
                }
                return true;
            });

            if (meaningfulChildren.length !== 1) return;
            const img = meaningfulChildren[0];
            if (img.type !== "element" || img.tagName !== "img") return;

            const title = img.properties?.title;
            if (typeof title !== "string" || title.length === 0) return;

            // Build the replacement <figure>. We remove `title` from the
            // <img> so it doesn't double up as a hover tooltip.
            const { title: _omit, ...imgProps } = img.properties ?? {};
            const figure = {
                type: "element",
                tagName: "figure",
                properties: {},
                children: [
                    { ...img, properties: imgProps },
                    {
                        type: "element",
                        tagName: "figcaption",
                        properties: {},
                        children: [{ type: "text", value: title }],
                    },
                ],
            };

            parent.children[index] = figure;
        });
    };
}
