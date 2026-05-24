import { generateOpenGraphImage } from "astro-og-canvas";

// Site-wide default OG image, served at /og/site.png. Layout.astro falls
// back to this URL when no page- or post-specific share image is supplied.
// Mirrors the styling in `[...slug].ts` so blog and non-blog pages share
// one visual identity in social previews.
export async function GET() {
    const body = await generateOpenGraphImage({
        title: "Caleb Sponheim",
        description:
            "Applied researcher and AI expert. Senior Experience Specialist and AI Lead at NN/G.",
        bgGradient: [
            [26, 26, 26],
            [40, 40, 60],
        ],
        border: { color: [59, 59, 191], width: 24, side: "inline-start" },
        padding: 80,
        font: {
            title: {
                size: 72,
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
    });

    return new Response(body, {
        headers: { "Content-Type": "image/png" },
    });
}
