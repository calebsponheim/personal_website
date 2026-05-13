import { test, expect } from '@playwright/test';

test('astro dev server responds and renders the layout title', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Caleb Sponheim/);
});
