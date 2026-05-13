/**
 * Convert a human-readable tag (e.g. "learning in public") into a URL-safe
 * slug ("learning-in-public"). Used everywhere tag URLs are generated so
 * the link and the route param match.
 *
 * Kept deliberately simple — if you ever need full Unicode normalization,
 * the `slugify` npm package is a drop-in replacement.
 */
export function tagSlug(tag: string): string {
    return tag
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}
