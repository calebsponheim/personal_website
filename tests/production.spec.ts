import { test, expect } from '@playwright/test';

test.skip(process.env.SITE_TEST_MODE === 'dev', 'Requires built Cloudflare assets');

test('production responses carry security headers, including the 404', async ({ request }) => {
    for (const route of ['/', '/projects/', '/this-route-does-not-exist/']) {
        const response = await request.get(route);
        expect(response.status()).toBe(route.includes('does-not-exist') ? 404 : 200);
        const headers = response.headers();
        expect(headers['x-content-type-options']).toBe('nosniff');
        expect(headers['x-frame-options']).toBe('DENY');
        expect(headers['content-security-policy']).toContain("script-src 'self' https://static.cloudflareinsights.com;");
        expect(headers['content-security-policy']).not.toMatch(/script-src[^;]*'unsafe-inline'/);
    }
});

test('legacy links redirect to their current pages', async ({ request }) => {
    const response = await request.get('/about-industry', { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(new URL(response.headers().location, response.url()).pathname).toBe('/about/');
});

test('built project sorting works under the production security policy', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto('/projects/');
    await expect(page.locator('script[type="module"]:not([src])')).toHaveCount(0);
    await page.getByLabel('Sort by').selectOption('oldest');
    await expect(page.locator('[data-project-list] .project-title').first()).toHaveText(/Neuroscience Research/);
    await expect(page).toHaveURL(/\?sort=oldest/);
    expect(errors).toEqual([]);
});
