import { spawn } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
export const TEMPLATES = join(ROOT, 'templates')
export const DIST = join(ROOT, 'dist')
const TAILWIND = join(ROOT, 'node_modules', '.bin', 'tailwindcss')

export const srcDir = (slug) => join(TEMPLATES, slug)
export const outDir = (slug) => join(DIST, slug)

// Every folder in templates/ that has a theme.css is a template. Templates may
// live one level down inside a category folder (e.g. single-page/<name>/).
export function listSlugs() {
  if (!existsSync(TEMPLATES)) return []
  const slugs = []
  const walk = (dir, prefix, depth) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue
      if (!entry.isDirectory()) continue
      const full = join(dir, entry.name)
      const slug = prefix ? `${prefix}/${entry.name}` : entry.name
      if (existsSync(join(full, 'theme.css'))) {
        slugs.push(slug)
      } else if (depth < 1) {
        walk(full, slug, depth + 1)
      }
    }
  }
  walk(TEMPLATES, '', 0)
  return slugs.sort()
}

export function resolveSlugs(requested) {
  const all = listSlugs()
  if (requested.length === 0) return all
  // A category name expands to every template inside it.
  const expanded = requested.flatMap((slug) =>
    all.includes(slug) ? [slug] : all.filter((name) => name.startsWith(`${slug}/`))
  )
  const missing = requested.filter(
    (slug) => !all.includes(slug) && !all.some((name) => name.startsWith(`${slug}/`))
  )
  if (missing.length) throw new Error(`Unknown template(s): ${missing.join(', ')}`)
  return [...new Set(expanded)]
}

// Runs the Tailwind CLI with the template folder as cwd, so only that
// template's files are scanned for classes.
export function runTailwind(slug, { watch = false, minify = false } = {}) {
  const args = ['-i', join(srcDir(slug), 'theme.css'), '-o', join(outDir(slug), 'css', 'styles.css'), '--cwd', srcDir(slug)]
  if (watch) args.push('--watch=always')
  if (minify) args.push('--minify')
  const child = spawn(TAILWIND, args, { stdio: ['ignore', 'inherit', 'pipe'] })
  child.stderr.on('data', (chunk) => {
    for (const line of chunk.toString().split('\n')) if (line.trim()) console.log(`[${slug}] ${line}`)
  })
  if (watch) return child
  return new Promise((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`Tailwind failed for ${slug} (exit ${code})`))))
  })
}

// Copies everything except the CSS source: every page (*.html), main.js -> js/main.js, assets/.
export async function copyStatic(slug) {
  const src = srcDir(slug)
  const out = outDir(slug)
  await mkdir(join(out, 'js'), { recursive: true })

  // Copy every .html file recursively, preserving subdirectory structure.
  async function copyHtml(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        await copyHtml(full)
      } else if (entry.name.endsWith('.html')) {
        const relPath = full.slice(src.length + 1)
        const outPath = join(out, relPath)
        await mkdir(join(outPath, '..'), { recursive: true })
        await cp(full, outPath)
      }
    }
  }
  await copyHtml(src)

  if (existsSync(join(src, 'main.js'))) await cp(join(src, 'main.js'), join(out, 'js', 'main.js'))
  if (existsSync(join(src, 'assets'))) {
    await rm(join(out, 'assets'), { recursive: true, force: true })
    await cp(join(src, 'assets'), join(out, 'assets'), { recursive: true, filter: (p) => !p.endsWith('.gitkeep') })
  }
}

export function readMeta(slug) {
  try {
    return JSON.parse(readFileSync(join(srcDir(slug), 'meta.json'), 'utf8'))
  } catch {
    return { slug, name: slug }
  }
}

const escape = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

// dist/index.html: a plain list of every built template, for browsing locally.
export async function writeGallery() {
  const items = listSlugs()
    .filter((slug) => existsSync(join(outDir(slug), 'index.html')))
    .map((slug) => {
      const meta = readMeta(slug)
      return `<li><a href="./${slug}/">${escape(meta.name)}</a> <span>${escape(meta.industry)}</span><p>${escape(meta.description)}</p></li>`
    })
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Templates</title>
<style>
  body { font: 16px/1.5 system-ui, sans-serif; max-width: 720px; margin: 48px auto; padding: 0 16px; color: #111; background: #fff; }
  ul { list-style: none; padding: 0; } li { padding: 16px 0; border-bottom: 1px solid #eee; }
  a { font-weight: 600; color: inherit; } span { color: #888; font-size: 14px; margin-left: 8px; } p { margin: 4px 0 0; color: #555; }
</style>
</head>
<body>
<h1>Templates</h1>
${existsSync(join(DIST, 'design-system', 'index.html')) ? '<p><a href="./design-system/">Looq design system</a> <span>tokens, components, downloads</span></p>' : ''}
<ul>
${items.join('\n') || '<li>No templates yet. Run <code>npm run new &lt;slug&gt;</code>.</li>'}
</ul>
</body>
</html>
`
  await mkdir(DIST, { recursive: true })
  await writeFile(join(DIST, 'index.html'), html)
}
