import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const dev = process.env.SITE_TEST_MODE === 'dev';
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: dev ? 'npm run dev' : 'npm run preview:worker',
    url: baseURL,
    reuseExistingServer: dev && !process.env.CI,
    timeout: 120_000,
    // Astro 7 auto-detects AI coding agent environments and starts `astro
    // dev` as a detached background process (see the Astro v7 upgrade
    // notes on "Background mode"). That's great for interactive agent use,
    // but it makes the process Playwright spawns exit immediately after
    // handing off to the background daemon, which Playwright mistakes for
    // a startup failure. Force the server to stay in the foreground here.
    env: { ASTRO_DEV_BACKGROUND: '0' },
  },
});
