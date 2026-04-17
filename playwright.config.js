import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env.AUDIT_BASE_URL || 'https://canadaemcs.com'

export default defineConfig({
    testDir: './tests/ui-audit',
    timeout: 60_000,
    expect: { timeout: 10_000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: process.env.CI ? 2 : 4,
    reporter: [
        ['list'],
        ['json', { outputFile: 'tests/ui-audit/results/playwright-report.json' }]
    ],
    use: {
        baseURL: BASE_URL,
        trace: 'retain-on-failure',
        screenshot: 'off',
        video: 'off',
        actionTimeout: 10_000,
        navigationTimeout: 30_000
    },
    projects: [
        {
            name: 'iphone-se',
            use: {
                ...devices['iPhone SE'],
                viewport: { width: 375, height: 667 },
                deviceScaleFactor: 2,
                isMobile: true,
                hasTouch: true
            }
        },
        {
            name: 'iphone-14-pro',
            use: {
                ...devices['iPhone 14 Pro'],
                viewport: { width: 393, height: 852 },
                deviceScaleFactor: 3,
                isMobile: true,
                hasTouch: true
            }
        },
        {
            name: 'desktop',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1440, height: 900 }
            }
        }
    ]
})
