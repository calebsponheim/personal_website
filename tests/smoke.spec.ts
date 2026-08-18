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
    '/blog/i-built-my-companys-institutional-ai-agent/',
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
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
    'content',
    '1200',
  );
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
    'content',
    '630',
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    'content',
    /Caleb Sponheim/,
  );
});

test('unknown routes use the custom not-found page', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist/');

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: "That page doesn't exist." }),
  ).toBeVisible();
});

test('the projects sort control reorders by date and is linkable', async ({ page }) => {
  await page.goto('/projects/');

  const titles = page.locator('[data-project-list] .project-title');
  const control = page.getByLabel('Sort by');

  // Server-rendered default is the hand-curated `order` sequence.
  await expect(control).toHaveValue('relevance');
  await expect(titles.first()).toHaveText(/Lemon/);

  // Oldest-first must put the earliest `startYear` at the top.
  await control.selectOption('oldest');
  await expect(titles.first()).toHaveText(/Neuroscience Research/);
  await expect(page).toHaveURL(/\?sort=oldest/);

  // Newest-first ranks ongoing work above anything already finished.
  await control.selectOption('newest');
  await expect(titles.first()).toHaveText(/Lemon/);
  await expect(titles.nth(3)).toHaveText(/Neuroscience Research/);

  // Returning to relevance clears the param rather than leaving ?sort=relevance.
  await control.selectOption('relevance');
  await expect(page).toHaveURL(/\/projects\/$/);
});

test('a chosen sort survives a fresh page load', async ({ page }) => {
  await page.goto('/projects/?sort=oldest');

  await expect(page.getByLabel('Sort by')).toHaveValue('oldest');
  await expect(
    page.locator('[data-project-list] .project-title').first(),
  ).toHaveText(/Neuroscience Research/);
});

test('the skip link targets the main landmark', async ({ page }) => {
  await page.goto('/');

  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toHaveAttribute('href', '#main');

  await expect(page.locator('main#main')).toHaveCount(1);

  // Focus explicitly rather than pressing Tab: WebKit doesn't move focus to
  // links on Tab unless Safari's "highlight each item" preference is on, so
  // a Tab-based assertion would fail on that project for no good reason.
  await skipLink.focus();
  await expect(skipLink).toBeFocused();

  // Off-screen by default, pulled into view once focused.
  const box = await skipLink.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
});
