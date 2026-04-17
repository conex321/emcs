// In-page audit checks. This function is serialized and run inside the browser
// via page.evaluate() — so it must be self-contained (no imports, no closures over Node-land).
//
// Returns: { findings: [{severity, type, message, element?, details?}, ...], summary: {...} }

export function runPageChecks(opts = {}) {
    const { isMobile = false } = opts
    const findings = []

    const vw = window.innerWidth
    const vh = window.innerHeight

    // --- 1. Horizontal overflow on the document --------------------------------
    const docScrollW = document.documentElement.scrollWidth
    if (docScrollW > vw + 1) {
        findings.push({
            severity: 'high',
            type: 'horizontal-overflow',
            message: `Document scrollWidth ${docScrollW}px exceeds viewport ${vw}px (overflow of ${docScrollW - vw}px)`
        })
    }

    // --- 2. Elements extending past the right edge of the viewport -----------
    // Skip elements whose ancestor chain clips them — legitimate scroll containers
    // (overflow: auto/scroll) or clipping containers (overflow: hidden, used for
    // marquees, carousels, and image-crop effects). Only report genuinely visible
    // overflow that would cause horizontal scrollbars on the page.
    function hasClippingAncestor(el) {
        let node = el.parentElement
        while (node && node !== document.body) {
            const style = getComputedStyle(node)
            const oX = style.overflowX
            const o = style.overflow
            if (oX === 'auto' || oX === 'scroll' || oX === 'hidden' ||
                o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') {
                return true
            }
            node = node.parentElement
        }
        return false
    }

    const offViewport = []
    const allEls = document.querySelectorAll('body *')
    for (const el of allEls) {
        const rect = el.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue
        const style = getComputedStyle(el)
        if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') continue
        if (style.position === 'fixed') continue // fixed toasts/modals handled separately
        if (rect.right > vw + 1 && !hasClippingAncestor(el)) {
            offViewport.push({
                tag: el.tagName.toLowerCase(),
                class: (el.className && typeof el.className === 'string') ? el.className.slice(0, 80) : '',
                id: el.id || '',
                overflowPx: Math.round(rect.right - vw),
                right: Math.round(rect.right)
            })
        }
    }
    if (offViewport.length > 0) {
        // Collapse: report the worst 5
        offViewport.sort((a, b) => b.overflowPx - a.overflowPx)
        findings.push({
            severity: 'high',
            type: 'off-viewport-elements',
            message: `${offViewport.length} element(s) extend past the viewport`,
            details: offViewport.slice(0, 5)
        })
    }

    // --- 3. Clipped text (squish) ---------------------------------------------
    // Text nodes whose rendered width is smaller than their natural width.
    // Skip elements inside clipping containers (marquees, carousels).
    const clippedText = []
    const textContainers = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, li, td, th, label, div')
    for (const el of textContainers) {
        const rect = el.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue
        if (el.children.length > 0 && el.textContent.trim().length < 2) continue
        if (!el.textContent || !el.textContent.trim()) continue
        const style = getComputedStyle(el)
        // Skip this element's own scroll/clip containers — intentional clipping.
        // We DON'T skip on ancestor overflow:hidden because a button being squished
        // inside a clipping container is still a real UX bug.
        if (style.overflow === 'auto' || style.overflow === 'scroll' || style.overflow === 'hidden' ||
            style.overflowX === 'auto' || style.overflowX === 'scroll' || style.overflowX === 'hidden') continue
        // Filter out tiny differences from subpixel rounding.
        if (el.scrollWidth > el.clientWidth + 2 && style.overflow !== 'visible') {
            clippedText.push({
                tag: el.tagName.toLowerCase(),
                class: (el.className && typeof el.className === 'string') ? el.className.slice(0, 80) : '',
                clippedBy: el.scrollWidth - el.clientWidth,
                text: el.textContent.trim().slice(0, 60)
            })
        }
    }
    if (clippedText.length > 0) {
        clippedText.sort((a, b) => b.clippedBy - a.clippedBy)
        findings.push({
            severity: 'high',
            type: 'clipped-text',
            message: `${clippedText.length} text element(s) are clipped (squished)`,
            details: clippedText.slice(0, 5)
        })
    }

    // --- 4. Small tap targets (mobile only) -----------------------------------
    if (isMobile) {
        const interactive = document.querySelectorAll('a, button, [role="button"], input:not([type="hidden"]), select, textarea')
        const tiny = []
        for (const el of interactive) {
            const rect = el.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) continue
            const style = getComputedStyle(el)
            if (style.visibility === 'hidden' || style.display === 'none') continue
            // Language toggle flags and cart icons are commonly smaller — still report but as low
            if (rect.width < 32 || rect.height < 32) {
                tiny.push({
                    tag: el.tagName.toLowerCase(),
                    class: (el.className && typeof el.className === 'string') ? el.className.slice(0, 60) : '',
                    size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                    text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40)
                })
            }
        }
        if (tiny.length > 0) {
            findings.push({
                severity: 'medium',
                type: 'small-tap-targets',
                message: `${tiny.length} interactive element(s) below 32x32 minimum tap size`,
                details: tiny.slice(0, 5)
            })
        }
    }

    // --- 5. Tiny text on mobile ------------------------------------------------
    if (isMobile) {
        const tinyText = []
        for (const el of textContainers) {
            if (!el.textContent || !el.textContent.trim()) continue
            if (el.children.length > 0) continue // leaf only
            const style = getComputedStyle(el)
            const fs = parseFloat(style.fontSize)
            if (fs > 0 && fs < 11) {
                tinyText.push({
                    tag: el.tagName.toLowerCase(),
                    class: (el.className && typeof el.className === 'string') ? el.className.slice(0, 60) : '',
                    fontSize: `${fs.toFixed(1)}px`,
                    text: el.textContent.trim().slice(0, 40)
                })
            }
        }
        if (tinyText.length > 0) {
            findings.push({
                severity: 'medium',
                type: 'tiny-text',
                message: `${tinyText.length} text element(s) below 11px on mobile`,
                details: tinyText.slice(0, 5)
            })
        }
    }

    // --- 6. Broken images ------------------------------------------------------
    const brokenImages = []
    for (const img of document.querySelectorAll('img')) {
        if (img.complete && img.naturalWidth === 0) {
            brokenImages.push({
                src: (img.src || '').slice(0, 120),
                alt: img.alt || ''
            })
        }
    }
    if (brokenImages.length > 0) {
        findings.push({
            severity: 'high',
            type: 'broken-images',
            message: `${brokenImages.length} image(s) failed to load`,
            details: brokenImages.slice(0, 5)
        })
    }

    // --- 7. Missing alt text (a11y, low severity) -----------------------------
    const noAlt = document.querySelectorAll('img:not([alt])').length
    if (noAlt > 0) {
        findings.push({
            severity: 'low',
            type: 'missing-alt',
            message: `${noAlt} image(s) missing alt attribute`
        })
    }

    return {
        findings,
        summary: {
            viewport: { width: vw, height: vh },
            isMobile,
            docScrollWidth: docScrollW,
            elementCount: allEls.length,
            findingCount: findings.length,
            severityBreakdown: {
                high: findings.filter(f => f.severity === 'high').length,
                medium: findings.filter(f => f.severity === 'medium').length,
                low: findings.filter(f => f.severity === 'low').length
            }
        }
    }
}
