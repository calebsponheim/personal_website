import type { OGImageOptions } from "astro-og-canvas";

const OG_BACKGROUND = "./src/assets/og-ascii-field.png";
const OG_FONTS = [
    "./src/assets/fonts/newsreader-variable.woff2",
    "./src/assets/fonts/inter-variable.woff2",
];

/**
 * Keep long headlines inside the quiet half of the artwork. The renderer
 * respects explicit newlines but otherwise lays text across the full card.
 */
export function wrapOgTitle(title: string, lineLength = 24, maxLines = 3) {
    const words = title.trim().split(/\s+/);
    const lines: string[] = [];

    for (const word of words) {
        const lastLine = lines.at(-1);

        if (!lastLine) {
            lines.push(word);
        } else if (`${lastLine} ${word}`.length <= lineLength) {
            lines[lines.length - 1] = `${lastLine} ${word}`;
        } else if (lines.length < maxLines) {
            lines.push(word);
        } else {
            const finalLine = lines[maxLines - 1];
            lines[maxLines - 1] = `${finalLine.replace(/[….]+$/, "")}…`;
            break;
        }
    }

    return lines.join("\n");
}

export function ogImageOptions(
    title: string,
    description: string,
    titleSize = 62,
): OGImageOptions {
    return {
        title: wrapOgTitle(title),
        description,
        bgGradient: [[255, 255, 255]],
        bgImage: {
            path: OG_BACKGROUND,
            fit: "cover",
            position: "center",
        },
        padding: 72,
        fonts: OG_FONTS,
        font: {
            title: {
                size: titleSize,
                color: [25, 25, 24],
                weight: "Bold",
                lineHeight: 1.03,
                families: ["Newsreader"],
            },
            description: {
                size: 22,
                color: [59, 59, 191],
                weight: "SemiBold",
                lineHeight: 1.2,
                families: ["Inter"],
            },
        },
    };
}
