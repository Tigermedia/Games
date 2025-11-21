// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for Pilatis Form Testing
 *
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './',
  testMatch: '*.spec.js', // Match all spec files

  /* Maximum time one test can run for */
  timeout: 60 * 1000,

  /* Test execution settings */
  fullyParallel: false, // Run tests sequentially for clarity
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  /* Reporter to use */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'https://1.michal-stern.com',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure',

    /* Browser viewport */
    viewport: { width: 1280, height: 720 },

    /* Timeout for each action */
    actionTimeout: 15000,

    /* Grant all permissions to bypass prompts */
    permissions: ['geolocation', 'notifications', 'camera', 'microphone', 'clipboard-read', 'clipboard-write'],

    /* Additional settings to avoid prompts */
    acceptDownloads: true,

    /* Set locale and timezone for Israeli context */
    locale: 'he-IL',
    timezoneId: 'Asia/Jerusalem',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Additional chromium-specific permissions
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled', // Avoid bot detection
            '--disable-notifications', // Disable notification prompts
          ]
        }
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',
});
