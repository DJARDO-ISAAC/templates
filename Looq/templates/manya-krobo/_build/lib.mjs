// Page shell and shared components for the bank template generator
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { logoMark, ic } from './art.mjs'
import { BANK, PRODUCTS, GROUPS } from './bank.mjs'

export const T = join(dirname(fileURLToPath(import.meta.url)), '..')
export { ic }
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
// A value that may be wrapped in confirm(): returns the raw value
export const val = (x) => (x && typeof x === 'object' && 'confirm' in x ? x.v : x)
// Wraps text so review mode can highlight figures the bank still has to sign off
export const cf = (x, fallback = '') => { const v = val(x); const out = v == null ? fallback : v; return x && typeof x === 'object' && x.confirm ? `<span data-confirm>${out}</span>` : out }
export const tel = (p) => 'tel:' + String(p).replace(/[^+\d]/g, '')
export const wa = (p) => 'https://wa.me/' + String(p).replace(/[^\d]/g, '')
export const NAME = BANK.rename.show ? BANK.rename.to : BANK.name
export const RING = BANK.rename.show ? BANK.rename.ringTop : BANK.ringTop
export const mark = (cls) => logoMark(RING, 'BANK', cls)

const sizes = {}
export function dims(f) {
  if (sizes[f]) return sizes[f]
  const p = join(T, 'assets/images', f)
  if (!existsSync(p) || f.endsWith('.svg')) return (sizes[f] = [1200, 800])
  const b = readFileSync(p)
  let i = 2
  while (i < b.length) {
    const m = b[i + 1], len = b.readUInt16BE(i + 2)
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return (sizes[f] = [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)])
    i += 2 + len
  }
  return (sizes[f] = [1200, 800])
}
export const img = (f, alt, attrs = '') => { const [w, h] = dims(f); return `<img src="./assets/images/${f}" alt="${esc(alt)}" width="${w}" height="${h}"${attrs.includes('loading=') ? '' : ' loading="lazy"'} decoding="async"${attrs ? ' ' + attrs : ''}>` }
export const btn = (label, href, cls = 'btn-brand', icon = ic.arrow) => `<a href="${href}" class="btn ${cls}"><span>${label}</span>${icon || ''}</a>`
export const link = (t, h) => `<a class="link" href="${h}"><span>${t}</span>${ic.arrow}</a>`
export const crumbs = (list) => `<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="./">Home</a></li>${list.map(([t, h]) => `<li>${h ? `<a href="${h}">${t}</a>` : `<span aria-current="page">${t}</span>`}</li>`).join('')}</ol></nav>`
export const head = (eb, title, intro = '', cls = '') => `<div class="${cls}" data-reveal>${eb ? `<p class="eyebrow">${eb}</p>` : ''}<h2 class="h-lg mt-3">${title}</h2>${intro ? `<p class="lede mt-4 max-w-[62ch] text-muted">${intro}</p>` : ''}</div>`

const byGroup = (g) => PRODUCTS.filter((p) => p.group === g || p.also === g)
const megaCol = (title, items) => `<div class="mega-col"><h2>${title}</h2><ul class="mt-3 grid gap-1">${items.map(([t, s, h]) => `<li><a class="mega-link" href="${h}"><strong>${t}</strong>${s ? `<span>${s}</span>` : ''}</a></li>`).join('')}</ul></div>`
const NAV = [
  { k: 'save', t: 'Save & invest', cols: [['Accounts', byGroup('save').map((p) => [p.name, p.short, p.slug])], ['Invest', [['Shares', 'Own part of your community bank', 'shares'], ['Sikatso Account', 'Leave money to grow', 'sikatso-account']]], ['Insurance', byGroup('insure').map((p) => [p.name, '', p.slug])]], foot: [['Compare accounts', 'accounts'], ['Open an account', 'open-account']] },
  { k: 'borrow', t: 'Loans', cols: [['Personal', ['salary-loans', 'personal-loans', 'school-fees-loans', 'auto-loans', 'christmas-easter-loans', 'salary-overdrafts'].map((s) => PRODUCTS.find((p) => p.slug === s)).map((p) => [p.name, p.short, p.slug])], ['Business and groups', ['business-loans', 'micro-loans', 'group-loans', 'business-overdrafts'].map((s) => PRODUCTS.find((p) => p.slug === s)).map((p) => [p.name, p.short, p.slug])]], foot: [['All loans', 'loans'], ['Loan calculator', 'loan-calculator']] },
  { k: 'digital', t: 'Digital banking', h: 'digital-banking' },
  { k: 'branches', t: 'Branches', h: 'branches' },
  { k: 'about', t: 'About us', cols: [['The bank', [['Our story', 'Founded by the Krobo Women Association in 1978', 'about'], ['Board of directors', '', 'board'], ['Management team', '', 'management'], ['In the community', 'Scholarships, health and festivals', 'community']]], ['News and media', [['News and notices', '', 'news'], ['Gallery', '', 'gallery']]], ['Shareholders', [['Investor relations', 'AGMs, dividends and governance', 'investors'], ['Reports and financial statements', '', 'reports']]]] },
  { k: 'help', t: 'Help', cols: [['Get in touch', [['Contact us', 'Call, WhatsApp, email or visit', 'contact'], ['MD Direct', 'Write to the Managing Director', 'md-direct'], ['Make a complaint', '', 'complaints']]], ['Information', [['Rates and fees', '', 'rates'], ['Questions and answers', '', 'faq'], ['Forms and downloads', '', 'forms'], ['Dormant accounts', '', 'dormant-accounts']]], ['Stay safe', [['Security and fraud', 'We will never ask for your PIN', 'security']]]] },
]

export const INDEX = []
export function page({ file, title, description, current = '', body, kind = 'Page', index = true, short }) {
  const desk = NAV.map((n) => n.cols
    ? `<li data-mega><button type="button" class="nav-item${n.k === current ? ' is-current' : ''}" aria-expanded="false" aria-controls="mega-${n.k}">${n.t}${ic.chev}</button><div class="mega" id="mega-${n.k}"><div class="wrap grid gap-8 py-8 md:grid-cols-${n.cols.length + (n.foot ? 1 : 0)}">${n.cols.map(([t, l]) => megaCol(t, l)).join('')}${n.foot ? `<div class="rounded-2xl bg-mint p-5"><p class="font-display text-[1.15rem] font-bold text-ink">Not sure where to start?</p><ul class="mt-3 grid gap-2">${n.foot.map(([t, h]) => `<li>${link(t, h)}</li>`).join('')}</ul></div>` : ''}</div></div></li>`
    : `<li><a class="nav-item${n.k === current ? ' is-current' : ''}" href="${n.h}"${n.k === current ? ' aria-current="page"' : ''}>${n.t}</a></li>`).join('')
  const mob = NAV.map((n) => n.cols
    ? `<details class="m-acc"><summary>${n.t}${ic.chev}</summary><div class="pb-3">${n.cols.map(([t, l]) => `<p class="mt-3 text-[.8rem] font-bold uppercase tracking-[.12em] text-muted">${t}</p><ul>${l.map(([lt, , h]) => `<li><a href="${h}">${lt}</a></li>`).join('')}</ul>`).join('')}${n.foot ? `<ul class="mt-2">${n.foot.map(([t, h]) => `<li><a href="${h}" class="!text-brand-2">${t}</a></li>`).join('')}</ul>` : ''}</div></details>`
    : `<a class="m-link" href="${n.h}">${n.t}</a>`).join('')
  if (index) INDEX.push({ u: file === 'index' ? './' : file, t: short || title.split(' | ')[0], d: description, k: kind })
  const fb = val(BANK.social.facebook), li = val(BANK.social.linkedin), x = val(BANK.social.x)
  writeFileSync(join(T, file + '.html'), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#0b4a2b">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(NAME)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="./assets/images/share.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="./assets/images/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="./assets/fonts/public-sans-variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="./assets/fonts/outfit-variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="./css/styles.css">
  <script src="./js/main.js" defer></script>
</head>
<body>
  <a href="#main" class="skip">Skip to content</a>
  <div class="utility hidden md:block">
    <div class="wrap flex h-10 items-center justify-between gap-6">
      <p class="flex items-center gap-5"><a class="inline-flex items-center gap-2" href="${tel(BANK.phone)}"><span class="block size-4">${ic.phone}</span>${BANK.phone}</a><a class="inline-flex items-center gap-2" href="mailto:${BANK.email}"><span class="block size-4">${ic.mail}</span>${BANK.email}</a></p>
      <p class="flex items-center gap-5"><a href="rates">Rates and fees</a><a href="news">News</a><a href="branches">Find a branch</a><a href="digital-banking" class="font-bold text-sun">U-Connect app</a></p>
    </div>
  </div>
  <header class="site-header" data-header>
    <div class="wrap relative">
      <div class="bar">
        <a href="./" class="logo" aria-label="${esc(NAME)}, home">${mark('logo-mark')}<span class="hidden min-[360px]:block"><span class="logo-name">${esc(NAME.replace(/ PLC$/, ''))}</span><span class="logo-tag">${BANK.tagline}</span></span></a>
        <nav class="hidden xl:block" aria-label="Main"><ul class="flex items-center gap-1">${desk}</ul></nav>
        <div class="flex items-center gap-2">
          <button type="button" class="round-btn" data-open-search aria-label="Search the site">${ic.search}</button>
          <a href="open-account" class="btn btn-brand btn-sm hidden md:inline-flex">Open an account</a>
          <button type="button" class="round-btn xl:hidden" data-menu-button aria-controls="mobile-menu" aria-expanded="false" aria-label="Open menu"><span class="burger"><i></i><i></i></span></button>
        </div>
      </div>
    </div>
    <nav class="mobile-menu xl:hidden" id="mobile-menu" aria-label="Mobile">
      ${mob}
      <div class="mt-6 grid gap-2"><a class="btn btn-brand" href="open-account">Open an account</a><a class="btn btn-line" href="${tel(BANK.phone)}">${ic.phone}<span>Call ${BANK.phone}</span></a></div>
    </nav>
  </header>
  <div data-notice-slot></div>
  <main id="main">
${body}
  </main>
  <footer class="footer">
    <div class="wrap py-14 md:py-20">
      <div class="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <a href="./" class="inline-flex items-center gap-3 text-white" aria-label="${esc(NAME)}, home"><span class="grid size-[72px] flex-none place-items-center rounded-full bg-white p-1">${mark('size-16 text-brand')}</span><span><span class="block font-display text-[1.2rem] font-bold uppercase leading-tight">${esc(NAME.replace(/ PLC$/, ''))}</span><span class="block font-serif text-[.92rem] italic text-white/75">${BANK.tagline}</span></span></a>
          <address class="mt-6 not-italic leading-relaxed">${BANK.address}<br>${BANK.postal}<br>GhanaPost GPS: ${BANK.gps}</address>
          <p class="mt-4 grid gap-1"><a href="${tel(BANK.phone)}">${BANK.phone}</a><a href="mailto:${BANK.email}">${BANK.email}</a></p>
          <ul class="mt-5 flex gap-2">${fb ? `<li><a class="social" href="${fb}" aria-label="Facebook">${ic.fb}</a></li>` : ''}${li ? `<li><a class="social" href="${li}" aria-label="LinkedIn">${ic.li}</a></li>` : ''}${x ? `<li><a class="social" href="${x}" aria-label="X">${ic.x}</a></li>` : ''}<li><a class="social" href="${wa(val(BANK.whatsapp))}" aria-label="WhatsApp">${ic.wa}</a></li></ul>
        </div>
        ${[['Banking', [['Accounts', 'accounts'], ['Loans', 'loans'], ['Insurance', 'insurance'], ['Shares', 'shares'], ['Digital banking', 'digital-banking'], ['Rates and fees', 'rates']]], ['The bank', [['Our story', 'about'], ['Leadership', 'board'], ['In the community', 'community'], ['News', 'news'], ['Investors', 'investors'], ['Reports', 'reports']]], ['Help', [['Contact us', 'contact'], ['Branches', 'branches'], ['Complaints', 'complaints'], ['Security and fraud', 'security'], ['Forms', 'forms'], ['Questions', 'faq']]]].map(([h, l]) => `<div><h2>${h}</h2><ul class="mt-4 grid gap-2">${l.map(([t, u]) => `<li><a href="${u}">${t}</a></li>`).join('')}</ul></div>`).join('')}
      </div>
      <div class="mt-12 grid gap-6 border-t border-white/15 pt-8 md:grid-cols-[1fr_auto] md:items-center">
        <p class="max-w-[70ch] text-[.92rem] text-white/70">${cf(BANK.licence)} We will never ask for your PIN or password.</p>
        <div class="flex flex-wrap gap-2">${appBadges()}</div>
      </div>
      <div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-[.9rem] text-white/65">
        <p>© ${BANK.founded}–2026 ${esc(NAME)}</p>
        <p class="flex flex-wrap gap-x-5 gap-y-2"><a href="privacy">Privacy</a><a href="terms">Terms of use</a><a href="cookies">Cookies</a><a href="complaints">Complaints</a><a href="sitemap">Sitemap</a></p>
      </div>
    </div>
  </footer>
  <nav class="action-bar" aria-label="Quick actions">
    <a href="${tel(BANK.phone)}">${ic.phone}Call</a>
    <a href="${wa(val(BANK.whatsapp))}">${ic.wa}WhatsApp</a>
    <a href="branches">${ic.pin}Branches</a>
    <a href="open-account">${ic.user}Open account</a>
  </nav>
  <dialog class="dlg" data-search-dialog aria-label="Search">
    <div class="p-4 md:p-5">
      <form class="flex items-center gap-2" role="search" data-search-form><label class="sr-only" for="site-search">Search the site</label><input id="site-search" class="input flex-1" type="search" placeholder="Search accounts, loans, branches, forms..." autocomplete="off" data-search-input><button type="button" class="round-btn" data-close-dialog aria-label="Close search">${ic.close}</button></form>
      <div class="mt-3 max-h-[60svh] overflow-y-auto" data-search-results aria-live="polite"></div>
    </div>
  </dialog>
</body>
</html>
`)
}

export function appBadges(dark = true) {
  const a = BANK.app
  return `<a class="store" href="${val(a.ios)}"${val(a.ios) ? '' : ' aria-disabled="true"'}>${ic.apple}<span><small>Download on the</small><strong>App Store</strong></span></a><a class="store" href="${val(a.android)}">${ic.gplay}<span><small>Get it on</small><strong>Google Play</strong></span></a>`
}

// Slim title band for inner pages: H1, breadcrumb and one line
export const titleBand = ({ title, intro = '', trail = [], eb = '', aside = '', img: image, alt = '' }) => `<section class="page-hero">
  <div class="wrap grid items-center gap-8 ${image ? 'lg:grid-cols-[1.35fr_1fr]' : ''}">
    <div>
      ${crumbs(trail)}
      ${eb ? `<p class="eyebrow mt-6 hero-in">${eb}</p>` : ''}
      <h1 class="h-xl ${eb ? 'mt-3' : 'mt-6'} hero-in" style="--i:1">${title}</h1>
      ${intro ? `<p class="lede mt-4 max-w-[60ch] text-muted hero-in" style="--i:2">${intro}</p>` : ''}
      ${aside ? `<div class="mt-6 hero-in" style="--i:3">${aside}</div>` : ''}
    </div>
    ${image ? `<div class="hero-in hidden overflow-hidden rounded-[24px] lg:block" style="--i:2">${img(image, alt, 'class="aspect-[4/3] w-full object-cover" fetchpriority="high" loading="eager"')}</div>` : ''}
  </div>
</section>`
