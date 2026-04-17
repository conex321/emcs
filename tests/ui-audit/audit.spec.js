import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { routes, locales } from './routes.js'
import { runPageChecks } from './checks.js'
import { installCheckRunner, mobileMenuFlow, dropdownsFlow, languageToggleFlow } from './flows.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RESULTS_DIR = path.join(__dirname, 'results')
const SCREENSHOTS_DIR = path.join(RESULTS_DIR, 'screenshots')

// Accumulate findings in a JSON file. Each worker appends; the report step merges.
// Using append-only JSONL keeps this parallel-safe without locks.
const FINDINGS_LOG = path.join(RESULTS_DIR, 'findings.jsonl')

function ensureDir(p) {
    fs.mkdirSync(p, { recursive: true })
}

function recordFinding(entry) {
    ensureDir(RESULTS_DIR)
    fs.appendFileSync(FINDINGS_LOG, JSON.stringify(entry) + '\n')
}

// Reset the findings log at the start of a fresh run. Playwright globalSetup
// would be cleaner, but a project-level marker file works without extra config.
const RUN_MARKER = path.join(RESULTS_DIR, '.run-started')
test.beforeAll(() => {
    ensureDir(RESULTS_DIR)
    if (!fs.existsSync(RUN_MARKER)) {
        // First worker to reach here clears the log
        try { fs.writeFileSync(RUN_MARKER, String(Date.now()), { flag: 'wx' }) } catch { return }
        if (fs.existsSync(FINDINGS_LOG)) fs.unlinkSync(FINDINGS_LOG)
    } else {
        const age = Date.now() - Number(fs.readFileSync(RUN_MARKER, 'utf8') || 0)
        if (age > 60 * 60 * 1000) {
            // Stale marker from a previous run — reset
            fs.writeFileSync(RUN_MARKER, String(Date.now()))
            if (fs.existsSync(FINDINGS_LOG)) fs.unlinkSync(FINDINGS_LOG)
        }
    }
})

for (const locale of locales) {
    test.describe(`locale: ${locale.code}`, () => {

        for (const route of routes) {
            test(`${route.label} [${locale.code}]`, async ({ page }, testInfo) => {
                const viewportName = testInfo.project.name
                const isMobile = viewportName !== 'desktop'

                const consoleErrors = []
                const pageErrors = []
                page.on('console', msg => {
                    if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 300))
                })
                page.on('pageerror', err => pageErrors.push(String(err).slice(0, 300)))

                // Install check runner in-page BEFORE first navigation so it's
                // available for interactive flows.
                await installCheckRunner(page)

                // Set locale via localStorage BEFORE the app boots. Using
                // addInitScript means it applies on every navigation.
                await page.addInitScript((code) => {
                    try { localStorage.setItem('i18nextLng', code) } catch {}
                }, locale.code)

                // Navigate
                const response = await page.goto(route.path, { waitUntil: 'networkidle', timeout: 30_000 })
                const status = response?.status() ?? 0

                // Give the React tree a beat to settle after i18n init
                await page.waitForTimeout(600)

                // Run page-level checks
                const result = await page.evaluate((opts) => window.__emcsAudit(opts), { isMobile })

                // Screenshot
                const shotDir = path.join(SCREENSHOTS_DIR, locale.code, viewportName)
                ensureDir(shotDir)
                const shotPath = path.join(shotDir, `${route.slug}.png`)
                await page.screenshot({ path: shotPath, fullPage: true }).catch(() => {})

                // Interactive flows (only on home page, mobile viewport, to stay fast)
                const extraFindings = []
                if (route.path === '/' && isMobile) {
                    extraFindings.push(...await mobileMenuFlow({ page, isMobile }))
                }
                if (route.path === '/' && !isMobile) {
                    extraFindings.push(...await dropdownsFlow({ page, isMobile }))
                }
                // Language toggle test runs once per viewport on EN home (flips to VI)
                if (route.path === '/' && locale.code === 'en') {
                    extraFindings.push(...await languageToggleFlow({ page, isMobile }))
                }

                // Console errors → finding
                const extraNetworkFindings = []
                if (consoleErrors.length) {
                    extraNetworkFindings.push({
                        severity: 'high',
                        type: 'console-error',
                        message: `${consoleErrors.length} console error(s)`,
                        details: consoleErrors.slice(0, 5)
                    })
                }
                if (pageErrors.length) {
                    extraNetworkFindings.push({
                        severity: 'high',
                        type: 'uncaught-exception',
                        message: `${pageErrors.length} uncaught exception(s)`,
                        details: pageErrors.slice(0, 5)
                    })
                }
                if (status >= 400) {
                    extraNetworkFindings.push({
                        severity: 'high',
                        type: 'http-error',
                        message: `HTTP ${status} on ${route.path}`
                    })
                }

                const allFindings = [...result.findings, ...extraFindings, ...extraNetworkFindings]

                recordFinding({
                    route: route.path,
                    slug: route.slug,
                    label: route.label,
                    locale: locale.code,
                    viewport: viewportName,
                    viewportSize: result.summary.viewport,
                    screenshot: path.relative(RESULTS_DIR, shotPath),
                    httpStatus: status,
                    findings: allFindings,
                    summary: result.summary
                })

                // Soft-fail: we WANT to capture all findings across the matrix,
                // not stop at the first one. Use expect.soft so the test still
                // marks failed if anything is High-severity — this makes CI useful.
                const highs = allFindings.filter(f => f.severity === 'high')
                expect.soft(highs, `High-severity findings on ${route.path} @ ${viewportName}/${locale.code}:\n${JSON.stringify(highs, null, 2)}`).toHaveLength(0)
            })
        }
    })
}
