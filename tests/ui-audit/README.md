# UI Audit

Automated Playwright audit of `https://canadaemcs.com` that catches mobile overflow, squished text, tiny tap targets, and other layout bugs across three viewports × two locales.

## Quick start

```bash
npm install                       # installs @playwright/test
npx playwright install chromium   # one-time browser install
npm run audit:ui                  # runs the full audit (~5 min)
npm run audit:ui:report           # renders the Markdown summary
open tests/ui-audit/results/report.md
```

## What it checks

Per page load (every route × every viewport × every locale):

| Check | Severity | Mobile only |
|---|---|---|
| Horizontal document overflow | High | no |
| Elements past right edge of viewport | High | no |
| Clipped / squished text | High | no |
| Broken images (naturalWidth 0) | High | no |
| Console errors / uncaught exceptions | High | no |
| HTTP ≥ 400 response | High | no |
| Interactive targets < 32×32 | Medium | yes |
| Text smaller than 11px | Medium | yes |
| Images missing `alt` | Low | no |

Interactive flows (home page only, keeps the run fast):

- Mobile viewport: taps the mobile menu button, re-runs checks with menu open
- Desktop viewport: opens every `.nav-dropdown-trigger` in turn and re-runs checks
- Toggles language EN→VI on the home page to verify the header doesn't overflow after locale switch

## Matrix

- **Viewports:** iPhone SE (375×667), iPhone 14 Pro (393×852), Desktop (1440×900)
- **Locales:** English (`en`), Vietnamese (`vi`) — applied via `localStorage.i18nextLng` before boot
- **Routes:** curated list in [routes.js](routes.js) (skip portals — need auth)

Roughly `25 routes × 3 viewports × 2 locales ≈ 150 page loads`.

## Output

```
tests/ui-audit/results/
├── findings.jsonl     # one line per page-load, append-only (parallel-safe)
├── report.json        # merged, grouped, normalized
├── report.md          # human-readable summary (start here)
└── screenshots/<locale>/<viewport>/<slug>.png
```

`npm run audit:ui:report` exits non-zero when any High-severity findings exist, so CI can gate on it.

## Tuning

- **Add/remove routes:** edit [routes.js](routes.js)
- **Adjust thresholds:** tap-target size, tiny-text font size, overflow tolerance → [checks.js](checks.js)
- **Test a different environment:** `AUDIT_BASE_URL=https://staging.example.com npm run audit:ui`
- **Re-run a single viewport:** `npx playwright test tests/ui-audit --project=iphone-se`
- **Re-run a single locale:** `npx playwright test tests/ui-audit -g "locale: vi"`

## How to interpret findings

1. Open `report.md` — it ranks issue types by count. Tackle the highest-count High-severity type first.
2. For any finding, open the referenced screenshot to see the issue in context.
3. `off-viewport-elements` with a tiny overflow (1–2px) is often a rounding artifact — not a real bug. Anything ≥ 8px is worth fixing.
4. `clipped-text` usually means a fixed-width ancestor is too narrow, or `white-space: nowrap` on a long string. On VI pages, it's often a translation that's longer than the English original.
5. `small-tap-targets` on decorative icons (e.g., a flag icon inside a language button) are false positives — widen the parent button's hit area if needed.

## When to re-run

- After any change to a `Header*`, `Footer*`, or page-level CSS file
- After updating locale JSON (new or lengthened Vietnamese strings can break layouts)
- Before cutting a release
