// Page shell and shared components for the bank-5 template generator
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { logoMark, ic } from './art.mjs'
import { BANK, PRODUCTS } from './bank.mjs'

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
// Short name split for the logo lockup: "Manya Krobo" / "Rural Bank"
const SHORT = NAME.replace(/ PLC$/, '')
const words = SHORT.split(' ')
export const LOGO_TOP = words.slice(0, 2).join(' ')
export const LOGO_BOTTOM = words.slice(2).join(' ')
// The bank's official logo lockup (mark, name and tagline). favicon.png is the ring mark cropped from it
export const LOGO = 'manya-krobo-rural-bank-logo.png'

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
export const btn = (label, href, cls = 'btn-brand', icon = ic.arrow) => `<a href="${href}" class="btn ${cls}"${cls.includes('btn-brand') || cls.includes('btn-sun') ? ' data-magnetic' : ''}><span>${label}</span>${icon || ''}</a>`
export const link = (t, h) => `<a class="link" href="${h}"><span>${t}</span>${ic.arrow}</a>`
export const crumbs = (list) => `<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="./">Home</a></li>${list.map(([t, h]) => `<li>${h ? `<a href="${h}">${t}</a>` : `<span aria-current="page">${t}</span>`}</li>`).join('')}</ol></nav>`
// Section heading. The h2 words rise in when the block scrolls into view
export const head = (eb, title, intro = '', cls = '') => `<div class="${cls}" data-reveal>${eb ? `<p class="eyebrow">${eb}</p>` : ''}<h2 class="h-lg ${eb ? 'mt-5' : ''}" data-split-scroll>${title}</h2>${intro ? `<p class="lede mt-4 max-w-[58ch] text-muted">${intro}</p>` : ''}</div>`

const byGroup = (g) => PRODUCTS.filter((p) => p.group === g || p.also === g)
const pick = (slugs) => slugs.map((s) => PRODUCTS.find((p) => p.slug === s))
const megaCol = (title, items) => `<div class="mega-col"><h2>${title}</h2><ul class="mt-3 grid gap-0.5">${items.map(([t, s, h]) => `<li><a class="mega-link" href="${h}"><span class="min-w-0"><strong>${t}</strong>${s ? `<span>${s}</span>` : ''}</span></a></li>`).join('')}</ul></div>`
const NAV = [
  { k: 'save', t: 'Save & invest', cols: [['Accounts', byGroup('save').map((p) => [p.name, p.short, p.slug])], ['Invest and insure', [['Shares', 'Own part of your community bank', 'shares'], ...byGroup('insure').map((p) => [p.name, '', p.slug])]]], feat: { eb: 'Get started', t: 'Open an account in about three minutes', d: 'Start online, then finish at your branch with your Ghana Card.', links: [['Open an account', 'open-account'], ['Compare accounts', 'accounts']] } },
  { k: 'borrow', t: 'Loans', cols: [['Personal', pick(['salary-loans', 'personal-loans', 'school-fees-loans', 'auto-loans', 'christmas-easter-loans', 'salary-overdrafts']).map((p) => [p.name, p.short, p.slug])], ['Business and groups', pick(['business-loans', 'micro-loans', 'group-loans', 'business-overdrafts']).map((p) => [p.name, p.short, p.slug])]], feat: { eb: 'Plan ahead', t: 'See your monthly repayment before you apply', d: 'Pick a loan, an amount and a period.', links: [['Loan calculator', 'loan-calculator'], ['All loans', 'loans']] } },
  { k: 'digital', t: 'Digital banking', h: 'digital-banking' },
  { k: 'branches', t: 'Branches', h: 'branches' },
  { k: 'about', t: 'About', cols: [['The bank', [['Our story', 'Founded by the Krobo Women Association in 1978', 'about'], ['Board of directors', '', 'board'], ['Management team', '', 'management'], ['In the community', 'Scholarships, health and festivals', 'community']]], ['News and investors', [['News and notices', '', 'news'], ['Gallery', '', 'gallery'], ['Investor relations', 'AGMs, dividends and governance', 'investors'], ['Reports and statements', '', 'reports']]]], feat: { eb: 'Shareholders', t: 'Notice of the 45th Annual General Meeting', d: 'Saturday 29 August 2026, Agormanya.', links: [['Read the notice', 'news-notice-of-45th-annual-general-meeting'], ['Investor relations', 'investors']] } },
  { k: 'help', t: 'Help', cols: [['Get in touch', [['Contact us', 'Call, WhatsApp, email or visit', 'contact'], ['MD Direct', 'Write to the Managing Director', 'md-direct'], ['Make a complaint', '', 'complaints']]], ['Information', [['Rates and fees', '', 'rates'], ['Questions and answers', '', 'faq'], ['Forms and checklists', '', 'forms'], ['Dormant accounts', '', 'dormant-accounts'], ['Security and fraud', 'We will never ask for your PIN', 'security']]]], feat: { eb: 'Hotline', t: BANK.phone, d: 'Monday to Friday during banking hours. For lost cards or fraud, call straight away.', links: [['Call now', tel(BANK.phone)], ['WhatsApp us', wa(val(BANK.whatsapp))]] } },
]
const feature = (f) => `<div class="mega-feature"><p class="text-[.72rem] font-semibold uppercase tracking-[.14em] text-glow">${f.eb}</p><p class="mt-3 font-display text-[1.22rem] font-bold leading-snug tracking-[-.02em] text-white">${f.t}</p><p class="mt-2 flex-1 text-[.9rem]">${f.d}</p><ul class="mt-5 grid gap-2">${f.links.map(([t, h]) => `<li><a class="inline-flex items-center gap-2 hover:underline" href="${h}">${t}<span class="block size-4">${ic.arrow}</span></a></li>`).join('')}</ul></div>`

export const INDEX = []
export function page({ file, title, description, current = '', body, kind = 'Page', index = true, short }) {
  const desk = NAV.map((n) => n.cols
    ? `<li data-mega><button type="button" class="nav-item${n.k === current ? ' is-current' : ''}" aria-expanded="false" aria-controls="mega-${n.k}">${n.t}${ic.chev}</button><div class="mega" id="mega-${n.k}"><div class="grid gap-8 p-7 lg:grid-cols-[1fr_1fr_.9fr]">${n.cols.map(([t, l]) => megaCol(t, l)).join('')}${feature(n.feat)}</div></div></li>`
    : `<li><a class="nav-item${n.k === current ? ' is-current' : ''}" href="${n.h}"${n.k === current ? ' aria-current="page"' : ''}>${n.t}</a></li>`).join('')
  const mob = NAV.map((n) => n.cols
    ? `<details class="m-acc"><summary>${n.t}${ic.chev}</summary><div class="pb-4">${n.cols.map(([t, l]) => `<p class="mt-3 text-[.72rem] font-semibold uppercase tracking-[.14em] text-muted">${t}</p><ul>${l.map(([lt, , h]) => `<li><a href="${h}">${lt}</a></li>`).join('')}</ul>`).join('')}<ul class="mt-2">${n.feat.links.map(([t, h]) => `<li><a href="${h}" class="!font-semibold !text-brand-2">${t}</a></li>`).join('')}</ul></div></details>`
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
  <meta name="theme-color" content="#021610">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(NAME)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="./assets/images/share.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="./assets/images/favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="./assets/images/favicon.png">
  <link rel="preload" href="./assets/fonts/satoshi-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="./assets/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="./css/styles.css">
  <script src="./js/main.js" defer></script>
</head>
<body${file === 'index' ? ' class="is-home"' : ''}>
  <a href="#main" class="skip">Skip to content</a>
  <div class="progress" data-progress aria-hidden="true"></div>
  <header class="site-header" data-header>
    <div class="hdr">
      <div class="bar">
        <a href="./" class="logo"><img class="logo-img" src="./assets/images/${LOGO}" alt="${esc(NAME)}, home" width="291" height="90"></a>
        <nav class="hidden xl:block" aria-label="Main"><ul class="nav" data-nav><li class="nav-pill" data-nav-pill aria-hidden="true"></li>${desk}</ul></nav>
        <div class="flex items-center gap-2">
          <button type="button" class="round-btn" data-open-search aria-label="Search the site">${ic.search}</button>
          <a href="open-account" class="btn btn-deep btn-sm hidden md:inline-flex"><span>Open an account</span>${ic.arrow}</a>
          <button type="button" class="round-btn xl:hidden" data-menu-button aria-controls="mobile-menu" aria-expanded="false" aria-label="Open menu"><span class="burger"><i></i><i></i></span></button>
        </div>
      </div>
    </div>
    <nav class="mobile-menu xl:hidden" id="mobile-menu" aria-label="Mobile">
      ${mob}
      <div class="mt-8 grid gap-2"><a class="btn btn-brand" href="open-account"><span>Open an account</span>${ic.arrow}</a><a class="btn btn-line" href="${tel(BANK.phone)}">${ic.phone}<span>Call ${BANK.phone}</span></a></div>
      <p class="mt-6 text-center text-[.88rem] text-muted">${BANK.email}</p>
    </nav>
  </header>
  <main id="main">
${body}
  </main>
  <footer class="footer on-dark">
    <div class="wrap pt-16 md:pt-24">
      <div class="grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[1fr_1.4fr] lg:items-end" data-reveal>
        <div>
          <p class="eyebrow">We are here to help</p>
          <h2 class="h-lg mt-5 max-w-[16ch]">Talk to people who know <em class="serif text-sun">your town.</em></h2>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          ${[['phone', 'Call', BANK.phone, tel(BANK.phone)], ['wa', 'WhatsApp', 'Chat with us', wa(val(BANK.whatsapp))], ['mail', 'Email', 'Write to us', 'mailto:' + BANK.email]].map(([i, t, v, h]) => `<a href="${h}" class="group flex items-center gap-3 rounded-2xl bg-white/[.05] p-4 ring-1 ring-white/10 transition hover:bg-white/[.09] hover:ring-glow/50"><span class="grid size-10 flex-none place-items-center rounded-xl bg-glow/15 text-glow transition group-hover:bg-glow group-hover:text-night"><span class="block size-[18px]">${ic[i]}</span></span><span class="min-w-0"><span class="block text-[.78rem] text-white/50">${t}</span><span class="block text-[.95rem] font-semibold leading-snug text-white">${v}</span></span></a>`).join('')}
        </div>
      </div>
      <div class="grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div class="col-span-2 sm:col-span-3 lg:col-span-1">
          <a href="./" class="inline-block rounded-2xl bg-white px-4 py-3 transition hover:-translate-y-0.5"><img class="h-[54px] w-auto" src="./assets/images/${LOGO}" alt="${esc(NAME)}, home" width="291" height="90" loading="lazy"></a>
          <address class="mt-6 not-italic leading-relaxed">${BANK.address}<br>${BANK.postal}<br>GhanaPost GPS: ${BANK.gps}</address>
          <ul class="mt-6 flex gap-2">${fb ? `<li><a class="social" href="${fb}" aria-label="Facebook">${ic.fb}</a></li>` : ''}${li ? `<li><a class="social" href="${li}" aria-label="LinkedIn">${ic.li}</a></li>` : ''}${x ? `<li><a class="social" href="${x}" aria-label="X">${ic.x}</a></li>` : ''}<li><a class="social" href="${wa(val(BANK.whatsapp))}" aria-label="WhatsApp">${ic.wa}</a></li></ul>
        </div>
        ${[['Banking', [['Accounts', 'accounts'], ['Loans', 'loans'], ['Insurance', 'insurance'], ['Shares', 'shares'], ['Digital banking', 'digital-banking'], ['Rates and fees', 'rates']]], ['The bank', [['Our story', 'about'], ['Leadership', 'board'], ['In the community', 'community'], ['News', 'news'], ['Investors', 'investors'], ['Reports', 'reports']]], ['Help', [['Contact us', 'contact'], ['Branches', 'branches'], ['Complaints', 'complaints'], ['Security and fraud', 'security'], ['Forms', 'forms'], ['Questions', 'faq']]]].map(([h, l]) => `<div><h2>${h}</h2><ul class="mt-5 grid gap-2.5">${l.map(([t, u]) => `<li><a href="${u}">${t}</a></li>`).join('')}</ul></div>`).join('')}
      </div>
      <div class="grid gap-6 border-t border-white/10 pt-8 md:grid-cols-[1fr_auto] md:items-center">
        <p class="max-w-[70ch] text-[.88rem] text-white/55">${cf(BANK.licence)} We will never ask for your PIN or password.</p>
        <div class="flex flex-wrap gap-2">${appBadges()}</div>
      </div>
      <div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[.86rem] text-white/50">
        <p>© ${BANK.founded}–2026 ${esc(NAME)}</p>
        <p class="flex flex-wrap gap-x-5 gap-y-2"><a href="privacy">Privacy</a><a href="terms">Terms of use</a><a href="cookies">Cookies</a><a href="complaints">Complaints</a><a href="sitemap">Sitemap</a></p>
      </div>
    </div>
    <p class="wordmark -mb-[.12em] select-none" aria-hidden="true">${esc(LOGO_TOP)}</p>
  </footer>
  <nav class="action-bar" aria-label="Quick actions" data-action-bar>
    <a href="${tel(BANK.phone)}">${ic.phone}Call</a>
    <a href="${wa(val(BANK.whatsapp))}">${ic.wa}WhatsApp</a>
    <a href="branches">${ic.pin}Branches</a>
    <a href="open-account">${ic.user}Open account</a>
  </nav>
  <dialog class="dlg" data-search-dialog aria-label="Search">
    <div class="p-4 md:p-5">
      <form class="flex items-center gap-2" role="search" data-search-form><label class="sr-only" for="site-search">Search the site</label><span class="pointer-events-none -mr-11 ml-4 block size-5 text-muted">${ic.search}</span><input id="site-search" class="input flex-1 !pl-12" type="search" placeholder="Search accounts, loans, branches, forms..." autocomplete="off" data-search-input><button type="button" class="round-btn" data-close-dialog aria-label="Close search">${ic.close}</button></form>
      <div class="mt-3 max-h-[60svh] overflow-y-auto" data-search-results aria-live="polite"></div>
    </div>
  </dialog>
</body>
</html>
`)
}

export function appBadges() {
  const a = BANK.app
  // Official badges: Apple App Store and Google Play marketing artwork (assets/images/badge-*.svg)
  return `<a class="store" href="${val(a.ios)}"${val(a.ios) ? '' : ' aria-disabled="true"'}><img src="./assets/images/badge-app-store.svg" alt="Download on the App Store" width="135" height="40" loading="lazy"></a><a class="store" href="${val(a.android)}"><img src="./assets/images/badge-google-play.svg" alt="Get it on Google Play" width="180" height="53" loading="lazy"></a>`
}

// Title band for inner pages: breadcrumb, H1 with a word-by-word reveal, intro and an optional framed photo
export const titleBand = ({ title, intro = '', trail = [], eb = '', aside = '', img: image, alt = '' }) => `<section class="page-hero">
  <div class="wrap grid items-center gap-10 ${image ? 'lg:grid-cols-[1.25fr_1fr]' : ''}">
    <div class="${image ? '' : 'max-w-[900px]'}">
      <div class="hero-in">${crumbs(trail)}</div>
      ${eb ? `<p class="eyebrow mt-7 hero-in" style="--i:1">${eb}</p>` : ''}
      <h1 class="h-xl ${eb ? 'mt-5' : 'mt-7'}" data-split>${title}</h1>
      ${intro ? `<p class="lede mt-5 max-w-[60ch] text-muted hero-in" style="--i:3">${intro}</p>` : ''}
      ${aside ? `<div class="mt-7 hero-in" style="--i:4">${aside}</div>` : ''}
    </div>
    ${image ? `<div class="ph-frame hero-in hidden lg:block" style="--i:2">${img(image, alt, 'class="aspect-[4/3] w-full object-cover" fetchpriority="high" loading="eager"')}</div>` : ''}
  </div>
</section>`
