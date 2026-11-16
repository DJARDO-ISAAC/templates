// Report how far each template follows the Looq design system: npm run check [slug ...]
// Read-only: it never changes a template. Warns; exits 0 unless a named template does not exist.
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { resolveSlugs, srcDir } from './lib.mjs'
import { loadTokens } from './design-system.mjs'

const { t } = loadTokens()
const colorNames = t.color.tokens.map((k) => k.name)
const fontRoles = ['display', 'sans']
const slugs = resolveSlugs(process.argv.slice(2))

const pagesOf = (dir) => readdirSync(dir).filter((f) => f.endsWith('.html'))
let total = 0

for (const slug of slugs) {
  const dir = srcDir(slug)
  const issues = []
  const themePath = join(dir, 'theme.css')
  const theme = existsSync(themePath) ? readFileSync(themePath, 'utf8') : ''

  const missingColors = colorNames.filter((n) => !new RegExp(`--color-${n}\\s*:`).test(theme))
  if (missingColors.length) issues.push(`tokens: missing ${missingColors.length}/${colorNames.length} colour roles (${missingColors.slice(0, 6).join(', ')}${missingColors.length > 6 ? '…' : ''})`)
  const missingFonts = fontRoles.filter((r) => !new RegExp(`--font-${r}\\s*:`).test(theme))
  if (missingFonts.length) issues.push(`tokens: missing font roles ${missingFonts.join(', ')}`)

  const pageIssues = {}
  const js = existsSync(join(dir, 'main.js')) ? readFileSync(join(dir, 'main.js'), 'utf8') : ''
  for (const page of pagesOf(dir)) {
    const html = readFileSync(join(dir, page), 'utf8')
    const p = (msg) => { (pageIssues[msg] ||= []).push(page) }
    const h1s = (html.match(/<h1[\s>]/g) || []).length
    if (h1s !== 1) p(`${h1s} h1 elements (expected 1)`)
    if (!/href="#main"/.test(html)) p('no skip link to #main')
    if (!/<main[^>]*id="main"/.test(html)) p('no <main id="main">')
    if (!/data-header/.test(html)) p('header has no data-header hook')
    if (/<nav/.test(html) && !/data-menu-button/.test(html)) p('no data-menu-button for the mobile menu')
    if (/<form/.test(html)) {
      if (!/data-form|data-inline-form|data-guide-form/.test(html)) p('form without a data-form hook')
      if (/data-form[\s>]/.test(html) && !/name="website"/.test(html)) p('enquiry form without a honeypot (name="website")')
      if (!/privacy/i.test(html)) p('form page without a privacy notice link')
    }
    const badTel = [...html.matchAll(/href="tel:([^"]+)"/g)].map((m) => m[1]).filter((n) => !/^\+\d{8,15}$/.test(n))
    if (badTel.length) p(`tel: links not in +233 international format (${[...new Set(badTel)].slice(0, 3).join(', ')})`)
    if (/whatsapp/i.test(html) && /api\.whatsapp\.com|web\.whatsapp\.com/.test(html)) p('WhatsApp links should use https://wa.me/')
  }
  for (const [msg, pages] of Object.entries(pageIssues)) issues.push(pages.length > 2 ? `${pages.length} pages: ${msg}` : `${pages.join(', ')}: ${msg}`)
  if (js && !/use strict/.test(js)) issues.push('main.js: not wrapped in a strict-mode IIFE')

  total += issues.length
  console.log(`${issues.length ? '⚠' : '✓'} ${slug}${issues.length ? ` (${issues.length})` : ''}`)
  for (const i of issues) console.log(`    - ${i}`)
}
console.log(`\n${slugs.length} template(s) checked, ${total} warning(s). See design-system/guides/04-adoption.md.`)
