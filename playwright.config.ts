import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for AutomationExercise (https://automationexercise.com)
 *
 * baseURL: https://automationexercise.com
 * API base: https://automationexercise.com/api
 * Projects: chromium, firefox, webkit
 * Retries: 2 on CI, 0 local
 * Reporter: html
 * Trace: on-first-retry
 *
 * Note: No storageState setup needed — AutomationExercise API has no JWT token auth
 */

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    timeout: 60000,
    forbidOnly: !!(globalThis as any).process?.env?.CI,
    retries: (globalThis as any).process?.env?.CI ? 2 : 0,
    workers: (globalThis as any).process?.env?.CI ? 1 : 2,
    reporter: 'html',
    use: {
        baseURL: 'https://automationexercise.com',
        testIdAttribute: 'data-qa',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],

    // Tests run directly against hosted environment, so no local web server is needed.
});
