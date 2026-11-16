// Scaffold a template from the Looq design system:
//   npm run new <slug>                    e.g. npm run new restaurant-fine-dining
//   npm run new <category>/<slug>         e.g. npm run new single-page/cafe-osu
//   npm run new <slug> --theme=<id>       start from another theme's values (default: base)
// Creates theme.css (every token name, the theme's fonts and the component classes), the shared
// main.js, a starter page with skip link, header, hero, contact, footer and privacy dialog, and meta.json.
// It never touches existing templates.
import { existsSync, readFileSync } from 'node:fs'
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { srcDir } from './lib.mjs'
import { DS_SRC, loadTokens, themeFontFiles, themeStarter } from './design-system.mjs'

const args = process.argv.slice(2)
const slug = args.find((a) => !a.startsWith('--'))
const themeId = (args.find((a) => a.startsWith('--theme=')) || '--theme=base').split('=')[1]
const parts = slug?.split('/') ?? []
const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/
if (!slug || parts.length > 2 || parts.some((part) => !kebab.test(part))) {
  console.error('Usage: npm run new <slug> [--theme=<id>]   (lowercase-kebab-case, optionally inside a category, e.g. single-page/cafe-osu)')
  process.exit(1)
}
const dir = srcDir(slug)
if (existsSync(dir)) {
  console.error(`templates/${slug} already exists.`)
  process.exit(1)
}

const tk = loadTokens()
if (!tk.themes.some((t) => t.id === themeId)) {
  console.error(`Unknown theme "${themeId}". Available: ${tk.themes.map((t) => t.id).join(', ')}`)
  process.exit(1)
}
const componentsCss = readFileSync(join(DS_SRC, 'components.css'), 'utf8')
const name = parts[parts.length - 1].split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')

await mkdir(join(dir, 'assets', 'images'), { recursive: true })
await mkdir(join(dir, 'assets', 'fonts'), { recursive: true })
await writeFile(join(dir, 'assets', 'images', '.gitkeep'), '')

// Fonts for the chosen theme
const fontFiles = [...new Set(themeFontFiles(tk.t, themeId).map((f) => f.file))]
for (const file of fontFiles) await copyFile(join(DS_SRC, file), join(dir, 'assets', file))

await writeFile(join(dir, 'theme.css'), themeStarter(tk, themeId, componentsCss) + `
/* ---- ${name}: template-specific CSS below. Keep the token names above; change their values to make it yours. ---- */
`)

await copyFile(join(DS_SRC, 'main.js'), join(dir, 'main.js'))

const icon = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
}

await writeFile(join(dir, 'index.html'), `<!doctype html>
<html lang="en-GH">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${name} · What the business does, Town</title>
  <meta name="description" content="One sentence: what ${name} offers, for whom and where in Ghana.">
  <link rel="icon" href="./assets/images/favicon.svg" type="image/svg+xml">
  <script>document.documentElement.classList.add('js')</script>
  <link rel="stylesheet" href="./css/styles.css">
  <script src="./js/main.js" defer></script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "${name}",
    "telephone": "+233000000000",
    "address": { "@type": "PostalAddress", "streetAddress": "Street, Area", "addressLocality": "Accra", "addressCountry": "GH" }
  }
  </script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>

  <header class="site-header wrap" data-header>
    <div class="bar">
      <a href="./" class="logo">${name}</a>
      <nav class="hidden lg:block" aria-label="Main">
        <ul class="nav"><li><a class="nav-item" href="#services" data-nav>Services</a></li><li><a class="nav-item" href="#contact" data-nav>Contact</a></li></ul>
      </nav>
      <div class="flex items-center gap-2">
        <a href="#contact" class="btn btn-brand btn-sm hidden sm:inline-flex">Get in touch</a>
        <button type="button" class="round-btn lg:hidden" data-menu-button aria-controls="menu-panel" aria-expanded="false" aria-label="Open menu"><span class="burger"><i></i><i></i></span></button>
      </div>
    </div>
    <div class="menu-panel lg:hidden" id="menu-panel">
      <nav aria-label="Mobile"><ul><li><a class="menu-link" href="#services">Services</a></li><li><a class="menu-link" href="#contact">Contact</a></li></ul></nav>
    </div>
  </header>

  <main id="main">
    <section class="hero hero-split wrap" aria-labelledby="hero-title">
      <div class="hero-body">
        <p class="eyebrow">What you do · Town</p>
        <h1 id="hero-title" class="d-hero">Say what the business does, for whom and where.</h1>
        <p class="lede">One or two sentences on the offer and why customers choose you.</p>
        <div class="hero-actions">
          <a href="#contact" class="btn btn-brand"><span>Name the next step</span>${icon.arrow}</a>
        </div>
      </div>
      <div class="hero-media"><img src="./assets/images/hero.webp" width="1200" height="1500" alt="Describe the photo" fetchpriority="high"></div>
    </section>

    <section id="services" class="sec" aria-labelledby="services-title">
      <div class="wrap">
        <div class="sec-head"><p class="eyebrow">Services</p><h2 id="services-title" class="d-lg">What we offer</h2></div>
        <!-- Build sections from the design system's Section recipes guide. -->
      </div>
    </section>

    <section id="contact" class="sec sec-alt" aria-labelledby="contact-title">
      <div class="wrap">
        <div class="sec-head"><p class="eyebrow">Contact</p><h2 id="contact-title" class="d-lg">Get in touch</h2></div>
        <!-- Add ContactDetails and, for archetype B, the EnquiryForm from the design system. -->
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-bottom">
        <p>© <span data-year>2026</span> ${name}. Registered in Ghana.</p>
        <button type="button" class="footer-link" data-open-dialog="privacy">Privacy notice</button>
      </div>
    </div>
  </footer>

  <dialog class="dialog" id="privacy" aria-labelledby="privacy-title">
    <div class="dialog-head"><h2 id="privacy-title" class="d-sm">Privacy notice</h2><button class="round-btn" type="button" aria-label="Close privacy notice" data-close-dialog>${icon.close}</button></div>
    <p>Write the Act 843 privacy notice here: who runs the site, what is collected and why, how long it is kept, and how to ask to see, correct or delete it. See the Ghana conventions guide.</p>
  </dialog>
</body>
</html>
`)

await writeFile(join(dir, 'assets', 'images', 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${tk.val(tk.t.color.tokens.find((k) => k.name === 'brand'), themeId)}"/></svg>\n`)

await writeFile(join(dir, 'meta.json'), JSON.stringify({
  slug,
  name,
  industry: '',
  type: parts[0] === 'single-page' ? 'landing-page' : 'website',
  archetype: [],
  pages: ['index.html'],
  tags: [],
  description: '',
  designSystem: { version: tk.t.version, theme: themeId },
  tailwindVersion: '4.x',
}, null, 2) + '\n')

console.log(`Created templates/${slug}/ from the ${themeId} theme (${fontFiles.length} font files). Run: npm run dev ${slug}`)
