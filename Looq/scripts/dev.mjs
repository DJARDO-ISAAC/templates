// Dev mode: npm run dev [slug ...]
// Watches each template, rebuilds into dist/ and serves dist/ on http://localhost:3000.
import { createReadStream, existsSync, statSync, watch } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, sep } from 'node:path'
import { DIST, copyStatic, resolveSlugs, runTailwind, srcDir, writeGallery } from './lib.mjs'
import { DS_SRC, buildDesignSystem } from './design-system.mjs'

const PORT = Number(process.env.PORT) || 3000
const slugs = resolveSlugs(process.argv.slice(2))
const children = []

for (const slug of slugs) {
  await runTailwind(slug)
  await copyStatic(slug)
  children.push(runTailwind(slug, { watch: true }))

  let timer
  watch(srcDir(slug), { recursive: true }, (_event, file) => {
    if (!file || file === 'theme.css' || file === 'meta.json') return
    clearTimeout(timer)
    timer = setTimeout(() => {
      copyStatic(slug)
        .then(() => console.log(`[${slug}] copied ${file}`))
        .catch((err) => console.error(`[${slug}] ${err.message}`))
    }, 50)
  })
}
if (await buildDesignSystem()) {
  let dsTimer
  watch(DS_SRC, { recursive: true }, () => {
    clearTimeout(dsTimer)
    dsTimer = setTimeout(() => buildDesignSystem().catch((err) => console.error(`[design-system] ${err.message}`)), 100)
  })
}
await writeGallery()

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.webm': 'video/webm',
}

createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  let file = normalize(join(DIST, pathname))
  if (file !== DIST && !file.startsWith(DIST + sep)) return res.writeHead(403).end()
  // Clean URLs: /slug/visit serves visit.html, and /slug/visit.html redirects to /slug/visit
  const search = new URL(req.url, 'http://localhost').search
  if (pathname.endsWith('.html') && existsSync(file)) {
    const clean = pathname.endsWith('/index.html') ? pathname.slice(0, -'index.html'.length) : pathname.slice(0, -'.html'.length)
    return res.writeHead(301, { Location: clean + search }).end()
  }
  if (!extname(file) && !existsSync(file) && existsSync(file + '.html')) file += '.html'
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!pathname.endsWith('/')) return res.writeHead(301, { Location: pathname + '/' }).end()
    file = join(file, 'index.html')
  }
  if (!existsSync(file)) return res.writeHead(404).end('Not found')
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
  createReadStream(file).pipe(res)
}).listen(PORT, () => console.log(`Serving dist/ on http://localhost:${PORT}`))

process.on('SIGINT', () => {
  for (const child of children) child.kill()
  process.exit(0)
})
