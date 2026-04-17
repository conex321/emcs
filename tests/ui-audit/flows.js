// Interactive flows — tap mobile menu, open dropdowns, run cart flow.
// Each flow takes a { page, isMobile, viewportName, locale } context,
// runs checks after each meaningful state change, and returns an array of findings.

import { runPageChecks } from './checks.js'

async function checkNow(page, label, isMobile) {
    const result = await page.evaluate((opts) => {
        // Injected runner — re-declares checks inline because page.evaluate
        // can't import. We import and stringify instead.
        return window.__emcsAudit(opts)
    }, { isMobile })
    return result.findings.map(f => ({ ...f, flow: label }))
}

// Install the check function on window so interactive flows can reuse it.
export async function installCheckRunner(page) {
    const checksSource = runPageChecks.toString()
    await page.addInitScript({
        content: `window.__emcsAudit = ${checksSource};`
    })
}

export async function mobileMenuFlow({ page, isMobile, log }) {
    if (!isMobile) return []
    const findings = []
    const btn = page.locator('.mobile-menu-btn').first()
    if (!(await btn.isVisible().catch(() => false))) {
        log?.('mobile menu button not visible — skipping')
        return []
    }
    await btn.click()
    await page.waitForSelector('.mobile-menu', { state: 'visible', timeout: 3_000 }).catch(() => {})
    await page.waitForTimeout(300)
    findings.push(...await checkNow(page, 'mobile-menu-open', isMobile))
    // Close
    await btn.click().catch(() => {})
    await page.waitForTimeout(200)
    return findings
}

export async function dropdownsFlow({ page, isMobile, log }) {
    // Dropdowns are desktop-only (mobile uses the mobile menu instead)
    if (isMobile) return []
    const findings = []
    const triggers = await page.locator('.nav-dropdown-trigger').all()
    for (let i = 0; i < triggers.length; i++) {
        const trigger = triggers[i]
        const name = (await trigger.textContent())?.trim().slice(0, 30) || `dropdown-${i}`
        if (!(await trigger.isVisible().catch(() => false))) continue
        await trigger.click().catch(() => {})
        await page.waitForTimeout(300)
        const dropdownFindings = await checkNow(page, `dropdown-${name}`, isMobile)
        findings.push(...dropdownFindings)
        // Close by clicking trigger again
        await trigger.click().catch(() => {})
        await page.waitForTimeout(150)
    }
    return findings
}

export async function languageToggleFlow({ page, isMobile, log }) {
    // Toggle to VI and re-check for overflow (VI strings are often longer)
    const findings = []
    const toggle = page.locator('button, [role=button]').filter({ hasText: /VN|Tiếng|Vietnamese|VI/i }).first()
    const visible = await toggle.isVisible().catch(() => false)
    if (!visible) {
        log?.('language toggle not found — skipping')
        return []
    }
    await toggle.click().catch(() => {})
    await page.waitForTimeout(500)
    findings.push(...await checkNow(page, 'after-lang-toggle-vi', isMobile))
    return findings
}
