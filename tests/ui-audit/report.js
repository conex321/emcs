#!/usr/bin/env node
// Reads tests/ui-audit/results/findings.jsonl and renders:
//  - results/report.json  (normalized, grouped)
//  - results/report.md    (human summary)
//
// Usage: `npm run audit:ui:report`

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RESULTS_DIR = path.join(__dirname, 'results')
const LOG = path.join(RESULTS_DIR, 'findings.jsonl')
const OUT_JSON = path.join(RESULTS_DIR, 'report.json')
const OUT_MD = path.join(RESULTS_DIR, 'report.md')

if (!fs.existsSync(LOG)) {
    console.error(`No findings log at ${LOG}. Run \`npm run audit:ui\` first.`)
    process.exit(1)
}

const entries = fs.readFileSync(LOG, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => {
        try { return JSON.parse(line) } catch { return null }
    })
    .filter(Boolean)

const totals = { high: 0, medium: 0, low: 0 }
const byRoute = {}
const byType = {}
const cleanPages = []
const badPages = []

for (const entry of entries) {
    const routeKey = `${entry.route} [${entry.viewport}/${entry.locale}]`
    byRoute[routeKey] = entry
    const highs = entry.findings.filter(f => f.severity === 'high').length
    const meds = entry.findings.filter(f => f.severity === 'medium').length
    const lows = entry.findings.filter(f => f.severity === 'low').length
    totals.high += highs
    totals.medium += meds
    totals.low += lows
    if (entry.findings.length === 0) cleanPages.push(routeKey)
    else if (highs > 0) badPages.push(routeKey)

    for (const f of entry.findings) {
        byType[f.type] ??= { count: 0, severity: f.severity, examples: [] }
        byType[f.type].count++
        if (byType[f.type].examples.length < 3) {
            byType[f.type].examples.push({ route: routeKey, message: f.message })
        }
    }
}

fs.writeFileSync(OUT_JSON, JSON.stringify({ totals, byType, entries }, null, 2))

const lines = []
lines.push('# UI Audit Report')
lines.push('')
lines.push(`- **Pages audited:** ${entries.length}`)
lines.push(`- **Clean pages:** ${cleanPages.length}`)
lines.push(`- **Pages with High-severity issues:** ${badPages.length}`)
lines.push(`- **Total findings:** ${totals.high + totals.medium + totals.low} (High: ${totals.high}, Medium: ${totals.medium}, Low: ${totals.low})`)
lines.push('')

lines.push('## Issue types (ranked by count)')
lines.push('')
const sortedTypes = Object.entries(byType).sort((a, b) => b[1].count - a[1].count)
for (const [type, info] of sortedTypes) {
    lines.push(`### ${type} _(${info.severity}, ${info.count} occurrence${info.count !== 1 ? 's' : ''})_`)
    for (const ex of info.examples) {
        lines.push(`- ${ex.route} — ${ex.message}`)
    }
    lines.push('')
}

if (badPages.length > 0) {
    lines.push('## Pages with High-severity issues')
    lines.push('')
    for (const page of badPages) {
        const entry = byRoute[page]
        lines.push(`### ${page}`)
        lines.push(`- Screenshot: \`${entry.screenshot}\``)
        for (const f of entry.findings.filter(x => x.severity === 'high')) {
            lines.push(`- **${f.type}** — ${f.message}`)
            if (f.details) {
                for (const d of f.details.slice(0, 3)) {
                    lines.push(`  - ${JSON.stringify(d)}`)
                }
            }
        }
        lines.push('')
    }
}

if (cleanPages.length > 0) {
    lines.push('## Clean pages (no findings)')
    lines.push('')
    for (const p of cleanPages) lines.push(`- ${p}`)
    lines.push('')
}

fs.writeFileSync(OUT_MD, lines.join('\n'))
console.log(`Wrote ${OUT_MD}`)
console.log(`Wrote ${OUT_JSON}`)
console.log(`\nSummary: ${entries.length} pages | High: ${totals.high} | Medium: ${totals.medium} | Low: ${totals.low}`)
if (totals.high > 0) process.exit(1)
