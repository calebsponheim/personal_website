import { generateOpenGraphImage } from "astro-og-canvas";
import { ogImageOptions } from "../../lib/og-image";

// Site-wide default OG image, served at /og/site.png. Layout.astro falls
// back to this URL when no page- or post-specific share image is supplied.
// Uses the same ASCII field background and typography as post cards so
// blog and non-blog pages share one visual identity in social previews.
export async function GET() {
    const body = await generateOpenGraphImage(
        ogImageOptions(
            "Caleb Sponheim",
            "APPLIED RESEARCH  /  AI  /  HUMAN BEHAVIOR",
            78,
        ),
    );

    return new Response(body, {
        headers: { "Content-Type": "image/png" },
    });
}
