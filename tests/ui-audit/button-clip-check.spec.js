import { test, expect } from '@playwright/test'

const routes = [
    '/',
    '/about',
    '/courses',
    '/contact',
    '/faq',
    '/register',
    '/programs/elementary',
    '/programs/middle-school',
    '/programs/high-school',
    '/cart',
    '/tuition',
    '/compare',
    '/schedule',
    '/academic-prep',
    '/official-ontario',
    '/academic-prep/grade-9',
    '/academic-prep/grade-10',
    '/student',
    '/parent',
    '/agent',
]

for (const route of routes) {
    test(`no clipped buttons on ${route}`, async ({ page }) => {
        await page.goto(route, { waitUntil: 'networkidle' })
        const clipped = await page.evaluate(() => {
            const btns = [...document.querySelectorAll('.btn')]
            const issues = []
            btns.forEach(b => {
                const r = b.getBoundingClientRect()
                if (r.width === 0) return
                if (b.scrollWidth > b.clientWidth + 1) {
                    issues.push({
                        text: (b.innerText || '').trim().slice(0, 60),
                        classes: b.className.toString(),
                        w: Math.round(r.width),
                        scrollW: b.scrollWidth,
                    })
                }
            })
            return issues
        })
        if (clipped.length) {
            console.log(`Clipped buttons on ${route}:`, JSON.stringify(clipped, null, 2))
        }
        expect(clipped).toEqual([])
    })
}
