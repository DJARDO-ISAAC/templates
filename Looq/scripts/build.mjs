// Production build: npm run build [slug ...]
import { rm } from 'node:fs/promises'
import { copyStatic, outDir, resolveSlugs, runTailwind, writeGallery } from './lib.mjs'
import { buildDesignSystem } from './design-system.mjs'

const slugs = resolveSlugs(process.argv.slice(2))

let failed = 0
for (const slug of slugs) {
  try {
    await rm(outDir(slug), { recursive: true, force: true })
    await runTailwind(slug, { minify: true })
    await copyStatic(slug)
    console.log(`✓ ${slug} -> dist/${slug}/`)
  } catch (err) {
    failed++
    console.error(`✗ ${slug}: ${err.message}`)
  }
}

try {
  await buildDesignSystem()
} catch (err) {
  failed++
  console.error(`✗ design system: ${err.message}`)
}

await writeGallery()
console.log(`Built ${slugs.length - failed}/${slugs.length} template(s).`)
if (failed) process.exit(1)
