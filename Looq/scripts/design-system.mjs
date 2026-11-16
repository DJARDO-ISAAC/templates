// Builds the Looq design system from design-system/ into dist/design-system/:
//   index.html                 browsable reference (open via npm run dev, or directly from disk)
//   tokens.css · components.css · tokens.json · fonts/
//   theme-<id>.css             a Tailwind v4 theme.css starter per theme, ready to drop into a template
//   looq-design-system.zip     everything above plus the source, for download
// Run alone with: npm run ds
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { crc32, deflateRawSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { DIST, ROOT } from './lib.mjs'

export const DS_SRC = join(ROOT, 'design-system')
const OUT = join(DIST, 'design-system')

const read = (p) => readFileSync(join(DS_SRC, p), 'utf8')
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

// ---------- tokens ----------
export function loadTokens() {
  const t = JSON.parse(read('tokens.json'))
  const themes = t.color.themes
  const first = themes[0].id
  const val = (tok, id) => (typeof tok.value === 'string' ? tok.value : tok.value[id] ?? tok.value[first])
  return { t, themes, first, val }
}

// Font roles for one theme: display, sans, accent, plus an optional heading weight.
export function themeFonts(t, id) {
  const th = t.type.themes?.[id] ?? {}
  const roles = { ...t.type.families, ...Object.fromEntries(Object.entries(th).filter(([k]) => k !== 'displayWeight')) }
  return { roles, displayWeight: th.displayWeight }
}
const fontVars = (t, id) => {
  const { roles, displayWeight } = themeFonts(t, id)
  const lines = Object.entries(roles).map(([k, v]) => `  --font-${k}: ${v};`)
  if (displayWeight) lines.push(`  --display-weight: ${displayWeight};`)
  return lines
}
// Tokens whose value can differ per theme (an object keyed by theme id).
const themedTokens = (t) => [...t.color.tokens, ...(t.shadow?.tokens ?? []), ...t.radius.tokens]
const plainTokens = (t) => [...t.spacing.tokens, ...(t.layout?.tokens ?? []), ...(t.motion?.tokens ?? [])]

function tokensCss({ t, themes, first, val }) {
  const themed = themedTokens(t)
  let css = '/* Looq — generated from tokens.json */\n'
  css += `:root, [data-theme="${first}"] {\n${[...themed.map((k) => `  --${k.name}: ${val(k, first)};`), ...fontVars(t, first)].join('\n')}\n}\n`
  for (const th of themes.slice(1)) {
    const lines = themed.filter((k) => typeof k.value === 'object' && k.value[th.id]).map((k) => `  --${k.name}: ${k.value[th.id]};`)
    css += `[data-theme="${th.id}"] {\n${[...lines, ...fontVars(t, th.id)].join('\n')}\n}\n`
  }
  css += `:root {\n${plainTokens(t).map((k) => `  --${k.name}: ${k.value};`).join('\n')}\n}\n`
  for (const g of t.type.groups) for (const s of g.styles) css += `.${s.name} { ${typeDecl(s, g)} }\n`
  for (const f of t.type.fonts) css += fontFace(f, '')
  return css
}

const fluid = (s) => /Fluid: (clamp\([^)]*\))/.exec(s.usage ?? '')?.[1]
function typeDecl(s, g, { fluidSize = false } = {}) {
  const fam = s.family || g.family
  const size = (fluidSize && fluid(s)) || s.fontSize
  // Display styles follow the theme's heading weight when it sets one.
  const weight = fam === 'display' ? `var(--display-weight, ${s.fontWeight})` : s.fontWeight
  return `font-family: var(--font-${fam}); font-size: ${size}; line-height: ${s.lineHeight}; font-weight: ${weight};${s.letterSpacing ? ` letter-spacing: ${s.letterSpacing};` : ''}${s.name === 'eyebrow' ? ' text-transform: uppercase;' : ''}`
}
const fontFace = (f, prefix) => `@font-face { font-family: "${f.family}"; src: url("${prefix}${f.file}") format("woff2"); font-weight: ${f.weight}; font-style: ${f.style || 'normal'}; font-display: swap; }\n`

// Font files a theme needs (fonts tagged with that theme, or untagged fonts).
export const themeFontFiles = (t, id) => t.type.fonts.filter((f) => !f.themes || f.themes.includes(id))

// A Tailwind v4 theme.css starter for one theme: colours become --color-*, so classes like bg-brand work.
export function themeStarter(tk, themeId, componentsCss) {
  const { t, themes, val } = tk
  const th = themes.find((x) => x.id === themeId)
  const colorNames = new Set(t.color.tokens.map((k) => k.name))
  const toTw = (css) => css.replace(/var\(--([a-z0-9-]+)\)/g, (m, n) => (colorNames.has(n) ? `var(--color-${n})` : m))
  const [base, comps] = componentsCss.split('/* @components */')
  const baseBody = base.replace(/^[\s\S]*?\/\* @base \*\//, '').trim()
  const files = themeFontFiles(t, themeId)
  const { roles, displayWeight } = themeFonts(t, themeId)
  let css = `/* Looq ${th.name} — theme.css starter generated from the Looq design system.\n`
  css += `   Copy into templates/<slug>/theme.css. Keep every token name; change the values to make the template its own.\n`
  css += `   Fonts: copy ${[...new Set(files.map((f) => f.file.replace(/^fonts\//, '')))].join(', ') || 'your fonts'} from design-system/fonts/ into templates/<slug>/assets/fonts/. */\n`
  css += `@import "tailwindcss";\n\n`
  for (const f of files) css += fontFace({ ...f, file: f.file.replace(/^fonts\//, '') }, '../assets/fonts/')
  css += `\n@theme {\n`
  css += Object.entries(roles).map(([k, v]) => `  --font-${k}: ${v};`).join('\n') + '\n\n'
  css += t.color.tokens.map((k) => `  --color-${k.name}: ${val(k, themeId)};`).join('\n') + '\n\n'
  css += t.radius.tokens.map((k) => `  --${k.name}: ${val(k, themeId)};`).join('\n') + '\n\n'
  css += (t.shadow?.tokens ?? []).map((k) => `  --${k.name}: ${val(k, themeId)};`).join('\n') + '\n\n'
  css += (t.motion?.tokens ?? []).filter((k) => k.name.startsWith('ease')).map((k) => `  --${k.name}: ${k.value};`).join('\n') + '\n}\n\n'
  css += `:root {\n${[...t.spacing.tokens, ...(t.layout?.tokens ?? []), ...(t.motion?.tokens ?? []).filter((k) => !k.name.startsWith('ease'))].map((k) => `  --${k.name}: ${k.value};`).join('\n')}${displayWeight ? `\n  --display-weight: ${displayWeight};` : ''}\n}\n\n`
  css += `@layer base {\n${indent(toTw(baseBody))}\n}\n\n`
  css += `@layer components {\n`
  for (const g of t.type.groups) for (const s of g.styles) css += `  .${s.name} { ${typeDecl(s, g, { fluidSize: true })} }\n`
  css += `\n${indent(toTw(comps.trim()))}\n}\n`
  return css
}
const indent = (s) => s.split('\n').map((l) => (l ? '  ' + l : l)).join('\n')

// ---------- contrast ----------
function hexRgb(hex) {
  let h = hex.slice(1)
  if (h.length <= 4) h = h.split('').map((c) => c + c).join('')
  return { n: [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 }
}
const lum = (n) => { const [r, g, b] = n.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
function ratio(fg, bg) {
  const f = hexRgb(fg), b = hexRgb(bg)
  const mixed = f.n.map((c, i) => Math.round(c * f.a + b.n[i] * (1 - f.a)))
  const x = lum(mixed), y = lum(b.n)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
const PAIRS = [
  ...['ink', 'body', 'muted'].flatMap((t) => ['canvas', 'surface', 'surface-2'].map((g) => [t, g, 4.5])),
  ['brand-strong', 'canvas', 4.5], ['brand-strong', 'surface', 4.5],
  ['on-brand', 'brand', 4.5], ['on-accent', 'accent', 4.5],
  ['night-ink', 'night', 4.5], ['night-muted', 'night', 4.5], ['accent', 'night', 4.5],
  ['line-strong', 'canvas', 3], ['line-strong', 'surface', 3], ['focus', 'canvas', 3], ['focus', 'surface', 3],
  ['danger', 'canvas', 4.5], ['danger', 'surface', 4.5], ['success', 'canvas', 4.5], ['success', 'surface', 4.5],
  ['warning', 'canvas', 4.5], ['warning', 'surface', 4.5], ['info', 'canvas', 4.5], ['info', 'surface', 4.5],
  ['on-whatsapp', 'whatsapp', 3],
]
function contrast({ t, themes, val }) {
  const by = Object.fromEntries(t.color.tokens.map((k) => [k.name, k]))
  return themes.map((th) => ({
    theme: th,
    rows: PAIRS.filter(([f, b]) => by[f] && by[b]).map(([f, b, min]) => {
      const r = ratio(val(by[f], th.id), val(by[b], th.id))
      return { fg: f, bg: b, min, ratio: r, pass: r >= min }
    }),
  }))
}

// ---------- components ----------
function loadComponents() {
  const dir = join(DS_SRC, 'components')
  return readdirSync(dir).filter((n) => statSync(join(dir, n)).isDirectory()).map((name) => {
    const html = existsSync(join(dir, name, 'preview.html')) ? readFileSync(join(dir, name, 'preview.html'), 'utf8') : ''
    const readme = existsSync(join(dir, name, 'README.md')) ? readFileSync(join(dir, name, 'README.md'), 'utf8') : ''
    const marker = /<!--\s*@dsCard([\s\S]*?)-->/.exec(html)?.[1] ?? ''
    const attr = (k) => new RegExp(`${k}="([^"]*)"`).exec(marker)?.[1] ?? new RegExp(`${k}=(\\d+)`).exec(marker)?.[1]
    const body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1].trim() ?? ''
    const head = /<head[^>]*>([\s\S]*?)<\/head>/i.exec(html)?.[1] ?? ''
    const styles = [...head.matchAll(/<style>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n')
    const markup = body.replace(/<script>[\s\S]*?<\/script>/gi, '').trim()
    return { name, group: attr('group') || '', subtitle: attr('subtitle') || '', height: Number(attr('height')) || 160, body, styles, markup, readme }
  })
}

// ---------- tiny markdown ----------
function md(src) {
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  const out = []
  const lines = src.replace(/\r/g, '').split('\n')
  let i = 0
  while (i < lines.length) {
    const l = lines[i]
    if (l.startsWith('```')) {
      const buf = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++])
      i++
      out.push(`<pre class="ui-code"><code>${esc(buf.join('\n'))}</code></pre>`)
    } else if (/^#{1,4} /.test(l)) {
      const n = l.match(/^#+/)[0].length
      out.push(`<h${n + 1} class="ui-h${n + 1}">${inline(l.slice(n + 1))}</h${n + 1}>`)
      i++
    } else if (/^- /.test(l)) {
      const items = []
      while (i < lines.length && /^- /.test(lines[i])) {
        let item = lines[i++].slice(2)
        while (i < lines.length && /^ {2}\S/.test(lines[i])) item += ' ' + lines[i++].trim()
        items.push(`<li>${inline(item)}</li>`)
      }
      out.push(`<ul>${items.join('')}</ul>`)
    } else if (l.trim() === '') {
      i++
    } else {
      const buf = []
      while (i < lines.length && lines[i].trim() && !/^(#{1,4} |- |```)/.test(lines[i])) buf.push(lines[i++])
      out.push(`<p>${inline(buf.join(' '))}</p>`)
    }
  }
  return out.join('\n')
}

// ---------- zip (deflate, no dependencies) ----------
function zip(entries) {
  const local = [], central = []
  let offset = 0
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name)
    const comp = deflateRawSync(data)
    const crc = crc32(data) >>> 0
    const h = Buffer.alloc(30)
    h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(8, 8)
    h.writeUInt32LE(0x21000000, 10); h.writeUInt32LE(crc, 14); h.writeUInt32LE(comp.length, 18); h.writeUInt32LE(data.length, 22)
    h.writeUInt16LE(nameBuf.length, 26); h.writeUInt16LE(0, 28)
    local.push(h, nameBuf, comp)
    const c = Buffer.alloc(46)
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(8, 10)
    c.writeUInt32LE(0x21000000, 12); c.writeUInt32LE(crc, 16); c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(data.length, 24)
    c.writeUInt16LE(nameBuf.length, 28); c.writeUInt32LE(offset, 42)
    central.push(c, nameBuf)
    offset += 30 + nameBuf.length + comp.length
  }
  const cd = Buffer.concat(central)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16)
  return Buffer.concat([...local, cd, end])
}
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name)
    if (e.name.startsWith('.')) return []
    return e.isDirectory() ? walk(p) : [p]
  })
}

// ---------- viewer ----------
function viewer({ tk, comps, report, css, readme, guides }) {
  const { t, themes, first, val } = tk
  const cover = comps.find((c) => c.name === 'Cover')
  const ORDER = ['Layout', 'Navigation', 'Actions', 'Content', 'Proof', 'Forms', 'Contact', 'Utilities']
  const rank = (g) => (ORDER.indexOf(g) + 1 || 99)
  const list = comps.filter((c) => c.name !== 'Cover').sort((a, b) => rank(a.group || 'Other') - rank(b.group || 'Other') || a.name.localeCompare(b.name))
  const groups = [...new Set(list.map((c) => c.group || 'Other'))]
  // Previews run the shared main.js so menus, FAQs, forms and dialogs behave as they do in a template.
  const mainJs = (css.mainJs || '').replace(/<\/script/gi, '<\\/script')
  const frameDoc = (c) => `<!doctype html><html lang="en" class="js" data-theme="${first}"><head><meta charset="utf-8"><style>${css.tokens}\n${css.components}\n${css.previews}\n${c.styles}\nbody{overflow:hidden}</style></head><body>${c.body}<script>document.addEventListener('click',function(e){var a=e.target.closest('a[href]');if(a)e.preventDefault()});</script><script>${mainJs}</script></body></html>`
  const fontLabel = (id) => { const { roles } = themeFonts(t, id); return Object.entries(roles).map(([k, v]) => `${k}: ${v.split(',')[0].replace(/"/g, '')}`).join(' · ') }
  const data = {
    themes,
    colors: t.color.tokens.map((k) => ({ name: k.name, values: Object.fromEntries(themes.map((th) => [th.id, val(k, th.id)])) })),
    fonts: Object.fromEntries(themes.map((th) => [th.id, fontLabel(th.id)])),
  }
  const fails = report.reduce((n, r) => n + r.rows.filter((x) => !x.pass).length, 0)

  const colorCards = t.color.tokens.map((k) => `
      <article class="ui-swatch">
        <div class="ui-chip" data-themed style="background:var(--${k.name})"></div>
        <div class="ui-swatch-text"><div class="ui-row"><code class="ui-name">${esc(k.name)}</code><code class="ui-val" data-color="${esc(k.name)}">${esc(val(k, first))}</code></div>
        <p class="ui-note">${md(k.usage ?? '').replace(/^<p>|<\/p>$/g, '')}</p></div>
      </article>`).join('')

  const typeRows = t.type.groups.map((g) => `
      <h3 class="ui-h3">${esc(g.name)}</h3>
      ${g.styles.map((s) => `<div class="ui-type">
        <div class="ui-type-meta"><code class="ui-name">.${esc(s.name)}</code><span>${esc(s.fontSize)} / ${esc(s.lineHeight)} · ${esc(s.fontWeight)}${s.letterSpacing ? ' · ' + esc(s.letterSpacing) : ''}</span>${fluid(s) ? `<span>${esc(fluid(s))}</span>` : ''}</div>
        <div class="ui-type-sample" data-themed><div class="${esc(s.name)}" style="color:var(--ink)${s.name === 'eyebrow' ? ';text-transform:uppercase' : ''}">${esc(s.sample || s.name)}</div></div>
        <p class="ui-note">${md(s.usage ?? '').replace(/^<p>|<\/p>$/g, '')}</p>
      </div>`).join('')}`).join('')

  const scale = (fam, render) => fam ? `<p class="ui-lede">${esc(fam.note ?? '')}</p><div class="ui-scale">${fam.tokens.map((k) => `<div class="ui-scale-row"><code class="ui-name">${esc(k.name)}</code><code class="ui-val">${esc(typeof k.value === 'string' ? k.value : k.value[first])}</code>${render(k) ? `<div class="ui-scale-vis" data-themed>${render(k)}</div>` : '<div></div>'}<p class="ui-note">${md(k.usage ?? '').replace(/^<p>|<\/p>$/g, '')}</p></div>`).join('')}</div>` : ''

  const compSections = list.map((c) => `
    <section class="ui-section" id="c-${esc(c.name)}">
      <div class="ui-comp-head"><div><p class="ui-kicker">${esc(c.group || 'Component')}</p><h2 class="ui-h2">${esc(c.name)}</h2>${c.subtitle ? `<p class="ui-sub"><code>${esc(c.subtitle)}</code></p>` : ''}</div>
      <div class="ui-tabs" role="tablist"><button type="button" role="tab" aria-selected="true" data-tab="preview">Preview</button><button type="button" role="tab" aria-selected="false" data-tab="code">HTML</button></div></div>
      <div class="ui-panel" data-panel="preview"><iframe class="ui-frame" title="${esc(c.name)} preview" style="height:${c.height}px" data-frame srcdoc="${esc(frameDoc(c))}"></iframe></div>
      <div class="ui-panel" data-panel="code" hidden><div class="ui-codewrap"><button type="button" class="ui-copy" data-copy>Copy</button><pre class="ui-code"><code>${esc(c.markup)}</code></pre></div></div>
      <div class="ui-md">${md(c.readme.replace(/^# .*\n/, ''))}</div>
    </section>`).join('')

  const contrastTables = report.map((r) => `
      <h3 class="ui-h3">${esc(r.theme.name)} <span class="ui-count">${r.rows.filter((x) => !x.pass).length ? `${r.rows.filter((x) => !x.pass).length} below target` : 'all pass'}</span></h3>
      <table class="ui-table"><thead><tr><th>Foreground</th><th>Background</th><th>Ratio</th><th>Target</th><th></th></tr></thead><tbody>
      ${r.rows.map((x) => `<tr class="${x.pass ? '' : 'is-fail'}"><td><code>${x.fg}</code></td><td><code>${x.bg}</code></td><td>${x.ratio.toFixed(2)}:1</td><td>${x.min}:1</td><td>${x.pass ? 'Pass' : 'Below'}</td></tr>`).join('')}
      </tbody></table>`).join('')

  const guideSections = guides.map((g) => `
  <section class="ui-section" id="g-${esc(g.id)}">
    <p class="ui-kicker">Guide</p>
    <div class="ui-md">${md(g.src)}</div>
  </section>`).join('')

  const nav = `
    <a href="#overview">Overview</a><a href="#colours">Colour</a><a href="#type">Type</a><a href="#space">Space, shape &amp; motion</a>
    ${guides.length ? `<p class="ui-navgroup">Guides</p>${guides.map((g) => `<a href="#g-${esc(g.id)}">${esc(g.title)}</a>`).join('')}` : ''}
    ${groups.map((g) => `<p class="ui-navgroup">${esc(g)}</p>${list.filter((c) => (c.group || 'Other') === g).map((c) => `<a href="#c-${esc(c.name)}">${esc(c.name)}</a>`).join('')}`).join('')}
    <p class="ui-navgroup">Checks</p><a href="#contrast">Contrast</a><a href="#downloads">Downloads</a>`

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Looq design system</title>
<link rel="stylesheet" href="tokens.css">
<style>
  :root { --ui-bg:#fbfaf7; --ui-panel:#fff; --ui-ink:#17171b; --ui-muted:#5f6067; --ui-line:#e4e2db; --ui-focus:#0f5c4d; color-scheme: light; }
  * { box-sizing: border-box; }
  html { scroll-padding-top: 88px; }
  body { margin:0; background:var(--ui-bg); color:var(--ui-ink); font:15px/1.6 "Onest", ui-sans-serif, system-ui, sans-serif; -webkit-font-smoothing:antialiased; }
  a { color: inherit; }
  code { font: 13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; }
  :focus-visible { outline: 3px solid var(--ui-focus); outline-offset: 2px; border-radius: 6px; }
  .ui-top { position: sticky; top: 0; z-index: 10; display:flex; flex-wrap:wrap; align-items:center; gap:12px 20px; justify-content:space-between; padding:14px 24px; background:rgb(251 250 247 / .92); backdrop-filter: blur(10px); border-bottom:1px solid var(--ui-line); }
  .ui-brand { display:flex; align-items:baseline; gap:10px; font:800 22px/1 "Bricolage Grotesque", ui-sans-serif, sans-serif; letter-spacing:-.02em; }
  .ui-brand span { font: 500 14px/1 "Onest", sans-serif; color: var(--ui-muted); letter-spacing: 0; }
  .ui-controls { display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
  .ui-controls label { font-size: 13px; color: var(--ui-muted); }
  select, .ui-btn { height:40px; padding:0 14px; border:1px solid #c9c7bf; border-radius:999px; background:#fff; color:var(--ui-ink); font:600 14px/1 inherit; font-family: inherit; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:8px; }
  .ui-btn-dark { background: var(--ui-ink); border-color: var(--ui-ink); color: #fff; }
  .ui-layout { display:grid; grid-template-columns: 220px minmax(0, 1fr); max-width: 1320px; margin: 0 auto; }
  .ui-nav { position: sticky; top: 69px; align-self: start; height: calc(100vh - 69px); overflow:auto; padding: 24px 12px 40px 24px; display:flex; flex-direction:column; gap:2px; }
  .ui-nav a { padding:6px 10px; border-radius:8px; text-decoration:none; color: var(--ui-muted); font-weight: 500; }
  .ui-nav a:hover { background: #efede6; color: var(--ui-ink); }
  .ui-nav a[aria-current="true"] { background: var(--ui-ink); color: #fff; font-weight: 600; }
  .ui-navgroup { margin:16px 10px 4px; font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#8a8b90; }
  main { padding: 24px 32px 120px; min-width: 0; }
  .ui-section { padding: 40px 0; border-bottom: 1px solid var(--ui-line); }
  .ui-h2 { margin:0 0 8px; font: 800 34px/1.05 "Bricolage Grotesque", ui-sans-serif, sans-serif; letter-spacing: -.015em; }
  .ui-h3 { margin: 32px 0 12px; font: 700 20px/1.2 "Bricolage Grotesque", ui-sans-serif, sans-serif; }
  .ui-h4 { margin: 24px 0 8px; font-size: 16px; }
  .ui-h5 { margin: 20px 0 6px; font-size: 15px; }
  .ui-kicker { margin:0 0 6px; font-size:12px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color: var(--ui-focus); }
  .ui-lede { max-width: 72ch; color: var(--ui-muted); }
  .ui-sub { margin: 0; color: var(--ui-muted); }
  .ui-md { max-width: 76ch; }
  .ui-md p, .ui-md li { color: #34353b; }
  .ui-md ul { padding-left: 20px; }
  .ui-md code, .ui-note code, .ui-lede code { padding: 1px 5px; border-radius: 5px; background: #efede6; }
  .ui-code { margin: 12px 0; padding: 16px; overflow:auto; border-radius: 12px; background: #17171b; color: #ecebe6; }
  .ui-code code { background: none; padding: 0; }
  .ui-cover { width:100%; height:288px; border:0; border-radius:16px; display:block; background: var(--canvas); }
  .ui-themed-note { font-size: 13px; color: var(--ui-muted); }
  .ui-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  .ui-swatch { border:1px solid var(--ui-line); border-radius: 14px; overflow:hidden; background: var(--ui-panel); }
  .ui-chip { height: 88px; border-bottom:1px solid var(--ui-line); }
  .ui-swatch-text { padding: 12px 14px; }
  .ui-row { display:flex; justify-content:space-between; gap:8px; align-items:baseline; }
  .ui-name { font-weight: 700; }
  .ui-val { color: var(--ui-muted); }
  .ui-note { margin: 6px 0 0; font-size: 13px; line-height: 1.5; color: var(--ui-muted); }
  .ui-type { display:grid; grid-template-columns: 200px minmax(0,1fr); gap: 4px 24px; padding: 16px 0; border-top: 1px solid var(--ui-line); }
  .ui-type-meta { display:flex; flex-direction:column; gap:2px; font-size: 13px; color: var(--ui-muted); }
  .ui-type-sample { padding: 12px 16px; border-radius: 12px; background: var(--canvas); overflow:hidden; }
  .ui-type .ui-note { grid-column: 2; }
  .ui-scale { display:grid; gap: 0; }
  .ui-scale-row { display:grid; grid-template-columns: 120px 200px minmax(0,1fr); gap: 4px 20px; align-items:center; padding: 12px 0; border-top: 1px solid var(--ui-line); }
  .ui-scale-row .ui-note { grid-column: 3; margin: 0; }
  .ui-scale-vis { min-height: 24px; padding: 10px; border-radius: 10px; background: var(--canvas); }
  .ui-comp-head { display:flex; justify-content:space-between; align-items:flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
  .ui-tabs { display:flex; gap:4px; padding:4px; border-radius:999px; background:#efede6; }
  .ui-tabs button { height:34px; padding:0 14px; border:0; border-radius:999px; background:transparent; font:600 13px/1 inherit; font-family: inherit; color: var(--ui-muted); cursor:pointer; }
  .ui-tabs [aria-selected="true"] { background:#fff; color: var(--ui-ink); box-shadow: 0 1px 2px rgb(0 0 0 / .08); }
  .ui-frame { display:block; width:100%; border:1px solid var(--ui-line); border-radius: 14px; background: #fff; }
  .ui-codewrap { position: relative; }
  .ui-copy { position:absolute; top: 10px; right: 10px; height: 30px; padding: 0 12px; border:0; border-radius: 999px; background: #34353b; color: #fff; font: 600 12px/1 inherit; font-family: inherit; cursor:pointer; }
  .ui-table { width:100%; border-collapse: collapse; font-size: 14px; }
  .ui-table th, .ui-table td { text-align:left; padding: 8px 10px; border-bottom: 1px solid var(--ui-line); }
  .ui-table th { font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: var(--ui-muted); }
  .ui-table .is-fail td { background: #fdf0ec; color: #8a2a14; font-weight: 600; }
  .ui-count { font: 500 13px/1 "Onest", sans-serif; color: var(--ui-muted); margin-left: 8px; }
  .ui-dl { display:grid; gap: 10px; max-width: 760px; }
  .ui-dl a { display:flex; justify-content:space-between; gap: 16px; padding: 14px 16px; border:1px solid var(--ui-line); border-radius: 12px; background:#fff; text-decoration:none; }
  .ui-dl a:hover { border-color: var(--ui-ink); }
  .ui-dl span { color: var(--ui-muted); font-size: 13px; }
  @media (max-width: 900px) { .ui-layout { grid-template-columns: 1fr; } .ui-nav { display:none; } main { padding: 16px 18px 80px; } .ui-type, .ui-scale-row { grid-template-columns: 1fr; } .ui-type .ui-note, .ui-scale-row .ui-note { grid-column: 1; } }
</style>
</head>
<body>
<header class="ui-top">
  <div class="ui-brand">Looq <span>design system</span></div>
  <div class="ui-controls">
    <label for="theme">Theme</label>
    <select id="theme">${themes.map((th) => `<option value="${esc(th.id)}">${esc(th.name)}</option>`).join('')}</select>
    <a class="ui-btn" id="dl-theme" href="theme-${esc(first)}.css" download>Download theme.css</a>
    <a class="ui-btn ui-btn-dark" href="looq-design-system.zip" download>Download all (.zip)</a>
  </div>
</header>
<div class="ui-layout">
<nav class="ui-nav" aria-label="Sections">${nav}</nav>
<main>
  <section class="ui-section" id="overview">
    ${cover ? `<iframe class="ui-cover" title="Looq cover" data-frame srcdoc="${esc(frameDoc(cover))}"></iframe>` : ''}
    <p class="ui-themed-note">Previews, swatches and specimens follow the theme picker at the top. ${fails ? `${fails} colour pairs from real templates are below their contrast target. They are listed under <a href="#contrast">Contrast</a>.` : ''}</p>
    <div class="ui-md">${md(readme)}</div>
  </section>
  <section class="ui-section" id="colours">
    <h2 class="ui-h2">Colour</h2>
    <p class="ui-lede">${themes.length} themes share the same ${t.color.tokens.length} token names. In a template, each token becomes <code>--color-&lt;name&gt;</code> in <code>@theme</code>, which gives classes like <code>bg-brand</code> and <code>text-ink</code>.</p>
    <div class="ui-grid">${colorCards}</div>
  </section>
  <section class="ui-section" id="type">
    <h2 class="ui-h2">Type</h2>
    <p class="ui-lede">${md(t.type.familiesNote ?? '').replace(/^<p>|<\/p>$/g, '')} This theme: <strong data-fonts>${esc(fontLabel(first))}</strong>. Sizes shown at desktop width; the starter theme.css uses the fluid <code>clamp()</code> values.</p>
    ${typeRows}
  </section>
  <section class="ui-section" id="space">
    <h2 class="ui-h2">Space, shape &amp; motion</h2>
    <h3 class="ui-h3">Spacing</h3>${scale(t.spacing, (k) => `<div style="height:16px;width:${esc(k.value)};border-radius:4px;background:var(--brand)"></div>`)}
    <h3 class="ui-h3">Radius</h3>${scale(t.radius, (k) => `<div style="height:56px;width:120px;border-radius:var(--${esc(k.name)});background:var(--surface);border:2px solid var(--line-strong)"></div>`)}
    ${t.shadow ? `<h3 class="ui-h3">Shadow</h3>${scale(t.shadow, (k) => `<div style="height:56px;width:160px;border-radius:12px;background:var(--surface);box-shadow:var(--${esc(k.name)});margin:8px"></div>`)}` : ''}
    ${t.motion ? `<h3 class="ui-h3">Motion</h3>${scale(t.motion, () => '')}` : ''}
    ${t.layout ? `<h3 class="ui-h3">Layout</h3>${scale(t.layout, () => '')}` : ''}
  </section>
  ${guideSections}
  ${compSections}
  <section class="ui-section" id="contrast">
    <h2 class="ui-h2">Contrast</h2>
    <p class="ui-lede">WCAG 2 ratios for every text, border and focus pair the system relies on, in every theme. Text needs 4.5:1 (3:1 at 24px+); control borders and focus rings need 3:1. Pairs below target come from real templates and are kept exact; fix them in the template.</p>
    ${contrastTables}
  </section>
  <section class="ui-section" id="downloads">
    <h2 class="ui-h2">Downloads</h2>
    <div class="ui-dl">
      <a href="looq-design-system.zip" download><strong>looq-design-system.zip</strong><span>Everything: this page, source, tokens, CSS, fonts, all theme starters</span></a>
      ${themes.map((th) => `<a href="theme-${esc(th.id)}.css" download><strong>theme-${esc(th.id)}.css</strong><span>Tailwind v4 theme.css starter — ${esc(th.name)}</span></a>`).join('')}
      <a href="tokens.json" download><strong>tokens.json</strong><span>All tokens as data</span></a>
      <a href="components.css" download><strong>components.css</strong><span>The component class contract</span></a>
      <a href="main.js" download><strong>main.js</strong><span>The shared behaviour: header, menu, reveals, FAQ, forms, dialogs, open-now</span></a>
      <a href="tokens.css" download><strong>tokens.css</strong><span>Tokens as CSS variables, per theme</span></a>
    </div>
  </section>
</main>
</div>
<script>
(() => {
  'use strict'
  const DATA = ${JSON.stringify(data).replace(/</g, '\\u003c')}
  const select = document.getElementById('theme')
  const dl = document.getElementById('dl-theme')
  const sizeFrame = (f) => { try { const h = f.contentDocument.documentElement.scrollHeight; if (h && !f.classList.contains('ui-cover')) f.style.height = h + 'px' } catch (e) {} }
  function apply(id) {
    document.querySelectorAll('[data-themed]').forEach((el) => el.setAttribute('data-theme', id))
    document.querySelectorAll('[data-frame]').forEach((f) => { try { f.contentDocument.documentElement.setAttribute('data-theme', id) } catch (e) {} })
    document.querySelectorAll('[data-color]').forEach((el) => { const c = DATA.colors.find((x) => x.name === el.dataset.color); if (c) el.textContent = c.values[id] })
    document.querySelectorAll('[data-fonts]').forEach((el) => { el.textContent = DATA.fonts[id] || '' })
    dl.href = 'theme-' + id + '.css'
    try { localStorage.setItem('looq-ds-theme', id) } catch (e) {}
  }
  document.querySelectorAll('[data-frame]').forEach((f) => f.addEventListener('load', () => { f.contentDocument.documentElement.setAttribute('data-theme', select.value); sizeFrame(f) }))
  select.addEventListener('change', () => apply(select.value))
  let saved = new URLSearchParams(location.search).get('theme')
  try { saved = saved || localStorage.getItem('looq-ds-theme') } catch (e) {}
  if (saved && DATA.themes.some((t) => t.id === saved)) select.value = saved
  apply(select.value)
  document.querySelectorAll('.ui-tabs').forEach((tabs) => tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]'); if (!b) return
    const sec = tabs.closest('.ui-section')
    tabs.querySelectorAll('[data-tab]').forEach((x) => x.setAttribute('aria-selected', String(x === b)))
    sec.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== b.dataset.tab })
    if (b.dataset.tab === 'preview') sec.querySelectorAll('[data-frame]').forEach(sizeFrame)
  }))
  // Sidebar: highlight the section currently in view
  const navEl = document.querySelector('.ui-nav')
  const links = [...navEl.querySelectorAll('a[href^="#"]')]
  const targets = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean)
  let current = null
  function setActive(id) {
    if (id === current) return
    current = id
    links.forEach((a) => {
      const on = a.getAttribute('href') === '#' + id
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current')
      if (on) {
        const top = a.offsetTop - navEl.offsetTop, bottom = top + a.offsetHeight
        if (top < navEl.scrollTop + 40) navEl.scrollTop = top - 40
        else if (bottom > navEl.scrollTop + navEl.clientHeight - 40) navEl.scrollTop = bottom - navEl.clientHeight + 40
      }
    })
  }
  function spy() {
    const line = document.querySelector('.ui-top').offsetHeight + 120
    let id = targets[0] && targets[0].id
    for (const t of targets) if (t.getBoundingClientRect().top <= line) id = t.id
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) id = targets[targets.length - 1].id
    setActive(id)
  }
  let ticking = false, lockUntil = 0
  window.addEventListener('scroll', () => { if (Date.now() < lockUntil) return; if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; spy() }) } }, { passive: true })
  window.addEventListener('resize', spy)
  links.forEach((a) => a.addEventListener('click', () => { lockUntil = Date.now() + 900; setActive(a.getAttribute('href').slice(1)) }))
  spy()
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const text = b.nextElementSibling.textContent
    try { await navigator.clipboard.writeText(text); b.textContent = 'Copied' } catch (e) { b.textContent = 'Select and copy' }
    setTimeout(() => { b.textContent = 'Copy' }, 1600)
  }))
})()
</script>
</body>
</html>
`
}

export async function buildDesignSystem() {
  if (!existsSync(join(DS_SRC, 'tokens.json'))) return false
  const tk = loadTokens()
  const comps = loadComponents()
  const css = {
    tokens: tokensCss(tk),
    components: read('components.css'),
    previews: existsSync(join(DS_SRC, 'previews.css')) ? read('previews.css') : '',
    mainJs: existsSync(join(DS_SRC, 'main.js')) ? read('main.js') : '',
  }
  const report = contrast(tk)
  // Guides: guides/*.md, in file-name order; the first heading is the nav title.
  const guideDir = join(DS_SRC, 'guides')
  const guides = existsSync(guideDir)
    ? readdirSync(guideDir).filter((f) => f.endsWith('.md')).sort().map((f) => {
        const src = readFileSync(join(guideDir, f), 'utf8')
        return { id: f.replace(/^\d+-/, '').replace(/\.md$/, ''), title: /^# (.+)$/m.exec(src)?.[1] ?? f, src }
      })
    : []

  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })
  await cp(join(DS_SRC, 'fonts'), join(OUT, 'fonts'), { recursive: true })
  await writeFile(join(OUT, 'tokens.css'), css.tokens)
  await writeFile(join(OUT, 'components.css'), css.components)
  await writeFile(join(OUT, 'tokens.json'), read('tokens.json'))
  if (css.mainJs) await writeFile(join(OUT, 'main.js'), css.mainJs)
  for (const th of tk.themes) await writeFile(join(OUT, `theme-${th.id}.css`), themeStarter(tk, th.id, css.components))
  await writeFile(join(OUT, 'index.html'), viewer({ tk, comps, report, css, readme: read('README.md'), guides }))

  const entries = [
    ...walk(OUT).map((p) => ({ name: 'looq-design-system/' + relative(OUT, p), data: readFileSync(p) })),
    ...walk(DS_SRC).map((p) => ({ name: 'looq-design-system/source/' + relative(DS_SRC, p), data: readFileSync(p) })),
  ]
  await writeFile(join(OUT, 'looq-design-system.zip'), zip(entries))

  const fails = report.flatMap((r) => r.rows.filter((x) => !x.pass).map((x) => `${r.theme.id}: ${x.fg} on ${x.bg} ${x.ratio.toFixed(2)}:1`))
  console.log(`✓ design system -> dist/design-system/ (${comps.length - 1} components, ${tk.themes.length} themes${fails.length ? `, ${fails.length} contrast pairs below target` : ''})`)
  return true
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await buildDesignSystem()
  const { writeGallery } = await import('./lib.mjs')
  await writeGallery()
}
