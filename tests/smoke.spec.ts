import { test, expect } from '@playwright/test';

test('astro dev server responds and renders the layout title', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Caleb Sponheim/);
});

test('important public routes respond successfully', async ({ page }) => {
  for (const route of [
    '/',
    '/about/',
    '/projects/',
    '/blog/',
    '/rss.xml',
    '/robots.txt',
  ]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
  }
});

test('the home page exposes canonical and social metadata', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://calebsponheim.com/',
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /applied researcher and AI expert/i,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://calebsponheim.com/og/site.png',
  );
});

test('unknown routes use the custom not-found page', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist/');

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: "That page doesn't exist." }),
  ).toBeVisible();
});
