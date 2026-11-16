// Branches, about, news, gallery, investors, help and legal pages
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { T, esc, val, cf, tel, wa, NAME, img, btn, link, head, page, titleBand, INDEX, ic } from './lib.mjs'
import { cowrie } from './art.mjs'
import { BANK, KEY_FACTS, HISTORY, MISSION, VISION, BRANCHES, REGIONS, BOARD, MANAGEMENT, PRODUCTS, RATES, FAQ } from './bank.mjs'
import { NEWS, NEWS_CATS, REPORTS, PDF_BASE, DORMANT_PDF, ALBUMS, ALBUM_CATS } from './content.mjs'
import { P, openDot, hoursSpec, branchOptions, productCard, newsCard, fmtDate, dateTag, NEWS_SORTED } from './parts.mjs'

const maps = (b) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${BANK.short} ${b.name}, ${b.where}`)
const typeName = { head: 'Head office', branch: 'Branch', centre: 'Mobilisation centre' }
const contactForm = (id, topic, extra = '', note = '') => `<form class="form-card grid gap-4" id="${id}" data-form="${topic}" novalidate>
  <div class="grid gap-4 sm:grid-cols-2">
    <label class="field"><span>Full name <span class="req">Required</span></span><input class="input" name="name" required autocomplete="name"></label>
    <label class="field"><span>Phone number <span class="req">Required</span></span><input class="input" type="tel" name="phone" required autocomplete="tel" inputmode="tel" placeholder="024 000 0000"></label>
    <label class="field"><span>Email <span class="opt">(optional)</span></span><input class="input" type="email" name="email" autocomplete="email"></label>
    <label class="field"><span>Your branch <span class="opt">(optional)</span></span><select class="input" name="branch">${branchOptions()}</select></label>
  </div>
  ${extra}
  <label class="field"><span>Your message <span class="req">Required</span></span><textarea class="input" name="message" required></textarea></label>
  <div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
  <label class="check"><input type="checkbox" name="consent" required data-msg="Please agree so that we can reply."><span class="text-[.95rem]">I agree that ${esc(BANK.short)} may use these details to reply to me, as set out in the <a class="prose-link" href="privacy">privacy notice</a>.</span></label>
  ${note}
  <button class="btn btn-brand justify-self-start" type="submit"><span>Send</span>${ic.send}</button>
</form>
<div class="success" data-form-ok="${id}" hidden role="status"><p class="flex items-center gap-2 font-display text-[1.3rem] font-bold text-deep"><span class="block size-6 text-brand">${ic.check}</span>Message received</p><p class="mt-2">Thank you. Your reference is <strong data-ref></strong>. Keep it in case you need to follow up.</p></div>`

/* ================= BRANCHES ================= */
const branchCard = (b) => `<article class="branch" data-branch data-region="${b.region}" data-type="${b.type}" data-text="${esc([b.name, b.town, b.where, val(b.serves) || ''].join(' ').toLowerCase())}">
  <p class="flex flex-wrap items-center gap-2"><span class="pill ${b.type === 'centre' ? 'pill-grey' : ''}">${typeName[b.type]}</span><span class="text-[.9rem] text-muted">${b.town}</span></p>
  <h3 class="h-sm"><a class="hover:underline" href="branch-${b.slug}">${b.name}</a></h3>
  <p class="flex gap-2 text-body"><span class="mt-1 block size-4 flex-none text-brand">${ic.pin}</span>${b.where}</p>
  ${openDot(b)}
  <div class="contact-row mt-1">${b.phone ? `<a class="chip" href="${tel(b.phone)}">${ic.phone}<span>${b.phone}</span></a>` : `<a class="chip" href="${tel(BANK.phone)}">${ic.phone}<span>Hotline</span></a>`}<a class="chip" href="${maps(b)}" target="_blank" rel="noopener">${ic.dir}<span>Directions</span><span class="sr-only">(opens Google Maps)</span></a></div>
</article>`
page({ file: 'branches', title: `Branches and opening hours | ${NAME}`, description: 'Find your nearest branch or mobilisation centre in the Krobo area and Greater Accra, with opening hours, phone numbers and directions.', current: 'branches', body: `
${titleBand({ title: 'Find a branch', eb: '12 places to bank', trail: [['Branches']], intro: `Our head office, 8 branches and 3 mobilisation centres are all networked, so you can bank at whichever is closest. Most are open Monday to Friday, ${val(BANK.hours).weekdays.join(' to ')}.` })}
<section class="sec !pt-10"><div class="wrap" data-finder>
  <div class="grid gap-4 rounded-[20px] bg-white p-5 shadow-[0_0_0_1px_var(--color-line)] lg:grid-cols-[1fr_auto_auto] lg:items-end">
    <label class="field"><span>Search by town or landmark</span><input class="input" type="search" placeholder="e.g. Somanya, Madina, lorry station" data-finder-q></label>
    <div><p class="mb-2 text-[.95rem] font-bold text-ink" id="reg-l">Area</p><div class="flex flex-wrap gap-2" role="group" aria-labelledby="reg-l"><button type="button" class="chip" data-region="all" aria-pressed="true">All</button>${Object.entries(REGIONS).map(([k, r]) => `<button type="button" class="chip" data-region="${k}" aria-pressed="false">${r.split(',')[0]}</button>`).join('')}</div></div>
    <div><p class="mb-2 text-[.95rem] font-bold text-ink" id="typ-l">Show</p><div class="flex flex-wrap gap-2" role="group" aria-labelledby="typ-l"><button type="button" class="chip" data-type="all" aria-pressed="true">Everything</button><button type="button" class="chip" data-type="branch" aria-pressed="false">Branches</button><button type="button" class="chip" data-type="centre" aria-pressed="false">Centres</button><button type="button" class="chip" data-type="open" aria-pressed="false">Open now</button></div></div>
  </div>
  <p class="mt-5 font-semibold text-muted" data-finder-count aria-live="polite"></p>
  ${Object.entries(REGIONS).map(([k, r]) => `<h2 class="sr-only">${r}</h2>`).join('')}
  <div class="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">${BRANCHES.map(branchCard).join('')}</div>
  <div class="mt-6 rounded-2xl bg-sand p-8 text-center" data-finder-empty hidden><p class="h-sm">No location matches that search</p><p class="mt-2 text-muted">Try another town, or call ${BANK.phone} and we will tell you the nearest one.</p></div>
  <p class="callout mt-10">${ic.info}<span>Mobilisation centres offer deposits, withdrawals and susu collection close to markets and lorry parks. For loans and account opening, they can arrange everything with their parent branch.<span data-confirm></span></span></p>
</div></section>
` })

for (const b of BRANCHES) {
  const near = BRANCHES.filter((x) => x.region === b.region && x.slug !== b.slug).slice(0, 3)
  const gps = val(b.gps)
  page({ file: `branch-${b.slug}`, title: `${b.name}, ${b.town} | ${NAME}`, description: `${b.name}: ${b.where}. Opening hours, phone number and directions.`, current: 'branches', kind: 'Branch', body: `
${titleBand({ title: b.name, eb: typeName[b.type] + ' · ' + REGIONS[b.region].split(',')[0], trail: [['Branches', 'branches'], [b.name]], intro: b.note || `${b.where}.`, img: b.img, alt: b.img ? `The ${b.name.toLowerCase()} building with the bank\'s green signboard` : '', aside: `${openDot(b)}<div class="contact-row mt-4">${b.phone ? `<a class="btn btn-brand btn-sm" href="${tel(b.phone)}">${ic.phone}<span>Call ${b.phone}</span></a>` : `<a class="btn btn-brand btn-sm" href="${tel(BANK.phone)}">${ic.phone}<span>Call the hotline</span></a>`}<a class="btn btn-line btn-sm" href="${maps(b)}" target="_blank" rel="noopener">${ic.dir}<span>Get directions</span><span class="sr-only">(opens Google Maps)</span></a></div>` })}
<section class="sec !pt-12"><div class="wrap grid gap-8 lg:grid-cols-3">
  <div class="form-card"><h2 class="h-sm">Address</h2><p class="mt-3">${b.where}<br>${b.town}</p><p class="mt-3 text-[.95rem]">GhanaPost GPS: ${gps ? `<strong>${gps}</strong> <button type="button" class="link ml-1" data-copy="${gps}">Copy</button>` : '<span data-confirm class="text-muted">To be added</span>'}</p>${val(b.serves) ? `<p class="mt-4 text-[.95rem] text-muted">Serves ${b.serves}.</p>` : ''}${b.parent ? `<p class="mt-3 text-[.95rem] text-muted">Operates under the <a class="prose-link" href="branch-${b.parent}">${BRANCHES.find((x) => x.slug === b.parent).name}</a>.</p>` : ''}</div>
  <div class="form-card"><h2 class="h-sm">Opening hours</h2><table class="mt-3 w-full text-[.97rem]" data-confirm><tbody>${[['Monday to Friday', val(BANK.hours).weekdays.join(' to ')], ['Saturday', val(BANK.hours).saturday ? val(BANK.hours).saturday.join(' to ') : 'Closed'], ['Sunday and public holidays', 'Closed']].map(([d, h]) => `<tr class="border-b border-line"><th scope="row" class="py-2 text-left font-semibold">${d}</th><td class="py-2 text-right">${h}</td></tr>`).join('')}</tbody></table></div>
  <div class="form-card"><h2 class="h-sm">Services</h2><ul class="ticks mt-4" data-confirm>${(b.type === 'centre' ? ['Deposits and withdrawals', 'Susu collection', 'Account enquiries', 'Mobile money'] : ['All accounts and deposits', 'Loans and overdrafts', 'Account opening', 'Mobile money and U-Connect registration']).map((t) => `<li>${ic.check}<span>${t}</span></li>`).join('')}</ul></div>
</div></section>
<section class="pb-[clamp(64px,8vw,112px)]"><div class="wrap">${head('', 'Nearby')}<div class="mt-6 grid gap-5 md:grid-cols-3">${near.map(branchCard).join('')}</div><p class="mt-6">${link('All branches', 'branches')}</p></div></section>
` })
}

/* ================= ABOUT ================= */
page({ file: 'about', title: `Our story | ${NAME}`, description: `Founded by the Krobo Women Association in ${BANK.founded}, ${BANK.short} was the fifth rural bank licensed in Ghana.`, current: 'about', body: `
${titleBand({ title: 'Started by women, owned by the community', eb: 'Our story', trail: [['About us']], intro: `In ${BANK.founded} the Krobo Women Association founded a community bank at Abanse, in the Manya Krobo district of the Eastern Region. It was the fifth rural bank to be licensed in Ghana.`, img: 'head-office.jpg', alt: 'The two-storey head office building in Abanse, painted green, with the bank\'s signboard' })}
${BANK.rename.show ? `<section class="pt-10"><div class="wrap"><p class="callout">${ic.info}<span><strong>We are now ${BANK.rename.to}.</strong> ${BANK.rename.note}</span></p></div></section>` : ''}
<section class="sec"><div class="wrap grid gap-12 lg:grid-cols-[1.3fr_1fr]">
  <div class="prose max-w-[66ch] text-[1.06rem]" data-reveal>
    <p>We were created to bring banking to people the big banks did not reach: farmers, fishermen, traders and small businesses in the Krobo area. We collect savings from the community and lend them back into productive work.</p>
    <p>Microfinance became a major part of our work, as a way to reduce poverty and to support families facing problems such as illness, drug abuse and illiteracy. Much of our lending goes to women, and it has given many women in our catchment area a level of economic independence.</p>
    <p>From a single branch we have grown to a head office, eight branches and three mobilisation centres in the Krobo area and Greater Accra, all networked so customers can bank at any of them. In 1998 we were named the best managed rural bank in Ghana, and in 2001 we joined the Ghana Club 100.</p>
  </div>
  <div class="grid content-start gap-4" data-reveal style="--d:80ms">
    <div class="rounded-[20px] bg-deep p-7 text-white"><h2 class="font-sans text-[.82rem] font-bold uppercase tracking-[.12em] text-sun">Our mission</h2><p class="mt-3 text-[1.1rem] leading-relaxed text-white/90">${MISSION}</p></div>
    <div class="rounded-[20px] bg-mint p-7"><h2 class="font-sans text-[.82rem] font-bold uppercase tracking-[.12em] text-brand-2">Our vision</h2><p class="mt-3 text-[1.1rem] leading-relaxed">${VISION}</p></div>
  </div>
</div></section>
<section class="sec bg-sand"><div class="wrap">
  ${head('Since 1978', 'Milestones')}
  <ol class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">${HISTORY.map(([y, t, d], i) => `<li class="rounded-[20px] bg-white p-6 shadow-[0_0_0_1px_var(--color-line)]" data-reveal style="--d:${(i % 3) * 70}ms"><p class="font-display text-[2rem] font-extrabold text-brand">${y}</p><h3 class="h-sm mt-1">${t}</h3><p class="mt-2 text-muted">${d}</p></li>`).join('')}</ol>
</div></section>
<section class="sec"><div class="wrap">
  ${head('Why bank with us', 'A bank that knows your town')}
  <div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">${[['users', 'For everyone', 'Public sector workers, security services, businesses, petty traders, farmers, churches and associations.'], ['building', 'Networked branches', 'Bank at any of our 12 locations, whichever is closest that day.'], ['user', 'People you know', 'Trained staff who live in the communities they serve.'], ['heart', 'Profits that stay local', 'Scholarships, health centres, schools and festivals, every year.']].map(([i, t, d], k) => `<div class="card p-6" data-reveal style="--d:${k * 70}ms"><span class="card-ic">${ic[i]}</span><h3 class="h-sm mt-5">${t}</h3><p class="mt-2 text-muted">${d}</p></div>`).join('')}</div>
  <div class="mt-12 grid gap-4 rounded-[24px] bg-mint p-8 md:grid-cols-4">${KEY_FACTS.map(([k, v]) => `<div><p class="font-display text-[1.7rem] font-extrabold leading-none text-deep">${k}</p><p class="mt-2 text-[.95rem]">${v}</p></div>`).join('')}</div>
  <div class="mt-10 flex flex-wrap gap-3">${btn('Meet the board', 'board', 'btn-deep')}${btn('Management team', 'management', 'btn-line', '')}${btn('In the community', 'community', 'btn-line', '')}</div>
</div></section>
` })

const peoplePage = (file, title, list, intro) => page({ file, title: `${title} | ${NAME}`, description: intro, current: 'about', body: `
${titleBand({ title, eb: 'Leadership', trail: [['About us', 'about'], [title]], intro })}
<section class="sec !pt-12"><div class="wrap">
  <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">${list.map(([n, r, f], i) => `<li class="person" data-reveal style="--d:${(i % 4) * 60}ms"><button type="button" data-person aria-haspopup="dialog">${img(f, `Portrait of ${n}`)}<h3 class="h-sm mt-4">${n}</h3><p class="font-semibold text-brand-2">${r}</p><span class="mt-2 inline-block text-[.92rem] font-bold text-deep underline">Read profile</span></button>
  <template><div class="grid gap-6 p-6 sm:grid-cols-[200px_1fr]">${img(f, `Portrait of ${n}`, 'class="w-full rounded-2xl"')}<div><h2 class="h-md">${n}</h2><p class="mt-1 font-semibold text-brand-2">${r}</p><p class="mt-4 text-body" data-confirm>A short biography of ${n.split(' ').slice(-1)[0] === n ? n : n}, their experience and their role at the bank will appear here.</p><dl class="mt-5 grid gap-2 text-[.95rem]"><div class="flex gap-2"><dt class="text-muted">Appointed:</dt><dd data-confirm>To be added</dd></div>${file === 'board' ? '<div class="flex gap-2"><dt class="text-muted">Committees:</dt><dd data-confirm>To be added</dd></div>' : ''}</dl></div></div></template></li>`).join('')}</ul>
  <p class="mt-12">${file === 'board' ? link('Meet the management team', 'management') : link('Meet the board of directors', 'board')}</p>
</div></section>
<dialog class="dlg" data-person-dialog aria-label="Profile"><div class="relative"><button type="button" class="round-btn absolute right-3 top-3" data-close-dialog aria-label="Close profile">${ic.close}</button><div data-person-body></div></div></dialog>
` })
peoplePage('board', 'Board of directors', BOARD, 'The board sets the bank\'s direction and protects the interests of shareholders, depositors and the community.')
peoplePage('management', 'Management team', MANAGEMENT, 'The people who run the bank day to day, led by the Chief Executive Officer.')

const csr = NEWS_SORTED.filter((n) => n.cat === 'community')
page({ file: 'community', title: `In the community | ${NAME}`, description: 'Scholarships, health centres, schools, police stations and festivals: how the bank reinvests its profits in the Krobo area.', current: 'about', body: `
${titleBand({ title: 'Our profits stay in the community', eb: 'In the community', trail: [['About us', 'about'], ['In the community']], intro: '“Our growth as a financial institution is directly linked to the well-being and progress of the communities we serve.” Godfred Asante Hanson, Chief Executive Officer', img: 'scholarship.jpg', alt: 'Scholarship recipients holding a presentation cheque with bank staff' })}
<section class="sec"><div class="wrap grid gap-5 md:grid-cols-2 lg:grid-cols-4">${[['school', 'Education', 'GH₵ 90,000 in scholarships for 36 tertiary students in 2025, over 130 students in 2016, and desks and books for schools across the Krobo area.'], ['heart', 'Health', 'Equipment for five CHPS compounds, a free screening for 400 people and a polytank for Somanya Municipal Hospital.'], ['shield', 'Safety', 'Computers for the Odumase-Krobo Police, over 600 bags of cement for Akuse Police, and support for the Nuaso Police Station.'], ['gift', 'Culture', 'Title sponsor of the Ngmayem Festival, including the Yokama celebrations, and support for Farmers\' Day.']].map(([i, t, d], k) => `<div class="card p-6" data-reveal style="--d:${k * 70}ms"><span class="card-ic">${ic[i]}</span><h2 class="h-sm mt-5">${t}</h2><p class="mt-2 text-muted">${d}</p></div>`).join('')}</div></section>
<section class="pb-[clamp(64px,8vw,112px)]"><div class="wrap">${head('Stories', 'Recent community work')}<div class="mt-8 grid gap-6 md:grid-cols-3">${csr.map(newsCard).join('')}</div><p class="mt-8">${link('See the photo gallery', 'gallery')}</p></div></section>
` })

/* ================= NEWS ================= */
page({ file: 'news', title: `News and notices | ${NAME}`, description: 'AGM notices, branch openings, awards and community news from the bank, newest first.', current: 'about', body: `
${titleBand({ title: 'News and notices', eb: 'Media', trail: [['News']], intro: 'Official notices for customers and shareholders, and news from across our branches. Newest first.' })}
<section class="sec !pt-10"><div class="wrap">
  <div class="flex flex-wrap gap-2" role="group" aria-label="Filter news" data-filter-group="news"><button type="button" class="chip" data-filter="all" aria-pressed="true">Everything</button>${Object.entries(NEWS_CATS).map(([k, t]) => `<button type="button" class="chip" data-filter="${k}" aria-pressed="false">${t}</button>`).join('')}</div>
  <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-filter-list="news">${NEWS_SORTED.map(newsCard).join('')}</div>
</div></section>
` })
for (const n of NEWS) {
  const i = NEWS_SORTED.indexOf(n), older = NEWS_SORTED[i + 1], newer = NEWS_SORTED[i - 1]
  const old = (val(n.date) || val(n.year) + '-12-31') < '2023-01-01'
  page({ file: `news-${n.slug}`, title: `${n.title} | ${NAME}`, description: n.sum, current: 'about', kind: 'News', body: `
<article>
<section class="page-hero"><div class="wrap max-w-[860px]">
  ${['<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="./">Home</a></li><li><a href="news">News</a></li><li><span aria-current="page">' + n.title + '</span></li></ol></nav>'][0]}
  <p class="mt-6 flex flex-wrap items-center gap-3"><span class="pill">${NEWS_CATS[n.cat]}</span>${dateTag(n)}</p>
  <h1 class="h-xl mt-4 hero-in">${n.title}</h1>
  <p class="lede mt-4 text-muted hero-in" style="--i:1">${n.sum}</p>
</div></section>
<div class="wrap max-w-[860px] py-10 md:py-14">
  ${old ? `<p class="callout mb-8">${ic.info}<span>This is an archived article. Details such as branch counts, opening hours and products may have changed. For current information, see ${n.cat === 'network' ? '<a class="prose-link" href="branches">our branches</a>' : '<a class="prose-link" href="./">the homepage</a>'}.</span></p>` : ''}
  ${n.img ? `<figure>${img(n.img, n.alt, 'class="w-full rounded-[20px]"')}</figure>` : ''}
  <div class="prose mt-8 text-[1.06rem]">
    ${n.body.map((p) => `<p>${p}</p>`).join('')}
    ${n.list ? `<ol>${n.list.map((l) => `<li>${l}</li>`).join('')}</ol>` : ''}
    ${(n.after || []).map((p) => `<p>${p}</p>`).join('')}
    ${(n.sections || []).map(([h, p, tbl]) => `<h2>${h}</h2><p>${p}</p>${tbl ? `<div class="table-wrap not-prose mt-4"><table class="tbl !min-w-0"><thead><tr>${tbl.head.map((x) => `<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${tbl.rows.map((r) => `<tr><td>${r[0]}</td><td class="num">${r[1]}</td></tr>`).join('')}</tbody></table></div>` : ''}`).join('')}
    ${n.source ? `<p class="text-muted">Source: <a href="${n.source[1]}" rel="noopener">${n.source[0]}</a></p>` : ''}
  </div>
  ${n.doc ? `<a class="file mt-8" href="${PDF_BASE}${n.doc[1]}"><span class="file-ic">PDF</span><span class="flex-1"><strong class="block text-ink">${n.doc[0]}</strong><span class="size">${sizeOf(n.doc[1])}</span></span><span class="block size-6 text-brand">${ic.download}</span></a>` : ''}
  ${n.link ? `<p class="mt-6">${link(n.link[0], n.link[1])}</p>` : ''}
  <div class="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6"><span class="font-semibold text-ink">Share:</span><a class="chip" href="https://wa.me/?text=${encodeURIComponent(n.title + ' https://' + BANK.domain + '/news-' + n.slug)}" target="_blank" rel="noopener">${ic.wa}<span>WhatsApp</span></a><a class="chip" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://' + BANK.domain + '/news-' + n.slug)}" target="_blank" rel="noopener">${ic.fb}<span>Facebook</span></a><button type="button" class="chip" data-print>${ic.doc}<span>Print</span></button></div>
  <nav class="mt-8 grid gap-4 sm:grid-cols-2" aria-label="More news">${newer ? `<a class="file" href="news-${newer.slug}"><span class="block size-5 text-brand">${ic.back}</span><span><span class="block text-[.85rem] text-muted">Newer</span><strong class="text-ink">${newer.title}</strong></span></a>` : '<span></span>'}${older ? `<a class="file sm:text-right" href="news-${older.slug}"><span class="flex-1"><span class="block text-[.85rem] text-muted">Older</span><strong class="text-ink">${older.title}</strong></span><span class="block size-5 text-brand">${ic.next}</span></a>` : ''}</nav>
</div>
</article>
` })
}
function sizeOf(file) { const r = REPORTS.find((x) => x[1] === file) || (DORMANT_PDF[1] === file ? DORMANT_PDF : null); const mb = r ? r[2] : file.includes('Dud') ? 0.38 : null; return mb == null ? 'PDF' : `PDF, ${mb < 1 ? Math.round(mb * 1024) + ' KB' : mb.toFixed(1) + ' MB'}` }

/* ================= GALLERY ================= */
page({ file: 'gallery', title: `Gallery | ${NAME}`, description: 'Photos from branch openings, AGMs, community donations and staff events.', current: 'about', body: `
${titleBand({ title: 'Gallery', eb: 'Media', trail: [['Gallery']], intro: 'Photos from branch openings, AGMs, community donations and staff events.' })}
<section class="sec !pt-10"><div class="wrap">
  <div class="flex flex-wrap gap-2" role="group" aria-label="Filter albums" data-filter-group="albums"><button type="button" class="chip" data-filter="all" aria-pressed="true">All albums</button>${Object.entries(ALBUM_CATS).map(([k, t]) => `<button type="button" class="chip" data-filter="${k}" aria-pressed="false">${t}</button>`).join('')}</div>
  <ul class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-filter-list="albums">${ALBUMS.map((a, i) => `<li class="album card" data-cat="${a.cat}" data-reveal style="--d:${(i % 3) * 60}ms"><div class="card-img !aspect-[4/3]">${img(`gallery/thumb-${a.slug}-${a.cover || 1}.jpg`, '')}</div><div class="p-5"><h2 class="h-sm"><a class="stretched" href="gallery-${a.slug}">${cf(a.title)}</a></h2><p class="mt-1 text-muted">${a.n} photos</p></div></li>`).join('')}</ul>
</div></section>
` })
for (const a of ALBUMS) {
  const t = val(a.title)
  page({ file: `gallery-${a.slug}`, title: `${t} | Gallery | ${NAME}`, description: `Photos: ${t}.`, current: 'about', kind: 'Album', body: `
${titleBand({ title: cf(a.title), eb: `${a.n} photos`, trail: [['Gallery', 'gallery'], [t]] })}
<section class="sec !pt-10"><div class="wrap">
  <ul class="shots">${Array.from({ length: a.n }, (_, k) => `<li><button type="button" data-shot data-full="./assets/images/gallery/${a.slug}-${k + 1}.jpg" aria-label="Open photo ${k + 1} of ${a.n}">${img(`gallery/thumb-${a.slug}-${k + 1}.jpg`, `${t}, photo ${k + 1}`)}</button></li>`).join('')}</ul>
  <p class="mt-10">${link('All albums', 'gallery')}</p>
</div></section>
<dialog class="lightbox" data-lightbox aria-label="Photo viewer">
  <img alt="">
  <p class="absolute bottom-5 left-1/2 w-[min(90vw,700px)] -translate-x-1/2 text-center text-white/85"><span data-lb-cap></span> · <span data-lb-count></span></p>
  <button type="button" class="lb-btn right-4 top-4" data-close-dialog aria-label="Close photo viewer">${ic.close}</button>
  <button type="button" class="lb-btn left-3 top-1/2 -translate-y-1/2" data-lb-prev aria-label="Previous photo">${ic.back}</button>
  <button type="button" class="lb-btn right-3 top-1/2 -translate-y-1/2" data-lb-next aria-label="Next photo">${ic.next}</button>
</dialog>
` })
}

/* ================= INVESTORS AND REPORTS ================= */
const fileRow = ([t, f, mb, type, year]) => `<li data-cat="${year} ${type.toLowerCase().replace(/[^a-z]+/g, '-')}"><a class="file" href="${PDF_BASE}${f}"><span class="file-ic">PDF</span><span class="min-w-0 flex-1"><strong class="block text-ink">${t}</strong><span class="text-[.9rem] text-muted">${type} · ${year}</span></span><span class="size ${mb > 20 ? 'is-big' : ''}">${mb < 1 ? Math.round(mb * 1024) + ' KB' : mb.toFixed(1) + ' MB'}${mb > 20 ? '<span class="block text-[.78rem] font-semibold">Large file</span>' : ''}</span><span class="block size-6 flex-none text-brand">${ic.download}</span></a></li>`
const years = [...new Set(REPORTS.map((r) => r[4]))]
page({ file: 'reports', title: `Annual reports and financial statements | ${NAME}`, description: 'Download our annual reports, financial statements and auditor\'s reports, grouped by year.', current: 'about', body: `
${titleBand({ title: 'Reports and financial statements', eb: 'Investors', trail: [['Investors', 'investors'], ['Reports']], intro: 'Every annual report, financial statement and auditor\'s report we have published, newest first. File sizes are shown so you can choose when to download on mobile data.' })}
<section class="sec !pt-10"><div class="wrap max-w-[960px]">
  <div class="flex flex-wrap gap-2" role="group" aria-label="Filter by year" data-filter-group="reports"><button type="button" class="chip" data-filter="all" aria-pressed="true">All years</button>${years.map((y) => `<button type="button" class="chip" data-filter="${y}" aria-pressed="false">${y}</button>`).join('')}</div>
  <div data-filter-list="reports">${years.map((y) => `<section class="mt-10" data-cat="${y}"><h2 class="h-md">${y}</h2><ul class="mt-4 grid gap-3">${REPORTS.filter((r) => r[4] === y).map(fileRow).join('')}</ul></section>`).join('')}</div>
  <p class="callout mt-12">${ic.info}<span>Some older reports are large scanned files. If you need a copy on paper, ask at any branch.<span data-confirm> Reports for 2022 and 2024 are not yet online.</span></span></p>
</div></section>
` })
const agm = NEWS.find((n) => n.slug === 'notice-of-45th-annual-general-meeting')
page({ file: 'investors', title: `Investor relations | ${NAME}`, description: 'AGM notices, dividends, governance and how to buy shares in the bank.', current: 'about', body: `
${titleBand({ title: 'Investor relations', eb: 'Shareholders', trail: [['Investors']], intro: `We are owned by our shareholders, most of whom are people from the communities we serve. This is where we publish AGM notices, results and governance information.` })}
<section class="sec !pt-10"><div class="wrap grid gap-10 lg:grid-cols-[1.4fr_1fr]">
  <div class="form-card" data-reveal><p class="flex flex-wrap items-center gap-2"><span class="pill">Latest AGM</span>${dateTag(agm)}</p><h2 class="h-md mt-3">${agm.title}</h2><p class="mt-3 text-body">Saturday 29 August 2026 at 10:00, Agormanya Roman Catholic Parish Hall, Odumase-Krobo.</p><details class="acc mt-5"><summary>Agenda<span class="acc-ic">${ic.plus}</span></summary><div class="acc-body"><ol class="list-decimal pl-5">${agm.list.map((l) => `<li class="mt-1">${l}</li>`).join('')}</ol></div></details><p class="mt-5">${link('Read the full notice', 'news-' + agm.slug)}</p></div>
  <div class="grid content-start gap-4" data-reveal style="--d:80ms">
    <div class="rounded-[20px] bg-mint p-6"><h2 class="h-sm">Dividends</h2><p class="mt-2 text-body" data-confirm>The dividend for 2025 is subject to approval at the AGM and by the Bank of Ghana. Details will be published here once approved.</p></div>
    <div class="rounded-[20px] bg-sand p-6"><h2 class="h-sm">Company secretary</h2><p class="mt-2 text-body">${BANK.secretary}</p></div>
  </div>
</div></section>
<section class="pb-[clamp(64px,8vw,112px)]"><div class="wrap">
  <div class="grid gap-5 md:grid-cols-3">${[['chart', 'Buy shares', 'Become an owner of your community bank.', 'shares'], ['doc', 'Reports and financial statements', 'Every year we have published, with file sizes.', 'reports'], ['users', 'Board of directors', 'The people who govern the bank.', 'board']].map(([i, t, d, h], k) => `<div data-reveal style="--d:${k * 70}ms"><article class="card p-6"><span class="card-ic">${ic[i]}</span><h2 class="h-sm mt-5"><a class="stretched" href="${h}">${t}</a></h2><p class="mt-2 text-muted">${d}</p></article></div>`).join('')}</div>
  <h2 class="h-md mt-14">Latest results</h2><ul class="mt-5 grid gap-3">${REPORTS.slice(0, 3).map(fileRow).join('')}</ul>
</div></section>
` })
page({ file: 'dormant-accounts', title: `Dormant accounts | ${NAME}`, description: 'Check whether your account has become dormant, and how to reactivate it before it is transferred to the Bank of Ghana.', current: 'help', body: `
${titleBand({ title: 'Dormant accounts', eb: 'Help', trail: [['Help', 'contact'], ['Dormant accounts']], intro: 'Under the Banks and Specialised Deposit-Taking Institutions Act, 2016 (Act 930), an account that has not been used for five years becomes dormant. Unclaimed balances are later transferred to the Bank of Ghana.' })}
<section class="sec !pt-10"><div class="wrap grid gap-10 lg:grid-cols-[1.3fr_1fr]">
  <div><h2 class="h-md">How to reactivate your account</h2><ol class="steps-list mt-5">${[['Check the list', 'Download the published list below and look for your name or account number.'], ['Visit any branch', 'Bring your Ghana Card. If you are acting for someone who has died, bring the letters of administration or probate.'], ['Make a transaction', 'A deposit or withdrawal reactivates the account. Staff will update your records.']].map(([t, d]) => `<li><strong class="block text-ink">${t}</strong><span class="text-muted">${d}</span></li>`).join('')}</ol>
  <a class="file mt-8" href="${PDF_BASE}${DORMANT_PDF[1]}"><span class="file-ic">PDF</span><span class="flex-1"><strong class="block text-ink">${DORMANT_PDF[0]}</strong><span class="size">PDF, ${DORMANT_PDF[2].toFixed(1)} MB</span></span><span class="block size-6 text-brand">${ic.download}</span></a></div>
  <div class="grid content-start gap-4"><p class="callout">${ic.alert}<span>Accounts that are not reactivated within the notice period are transferred to the Bank of Ghana. You can still claim the money afterwards, but it takes longer.</span></p><div class="form-card"><h2 class="h-sm">Questions?</h2><p class="mt-2">Call the head office on <a class="prose-link" href="${tel(BANK.phoneAlt)}">${BANK.phoneAlt}</a>.</p></div></div>
</div></section>
` })

/* ================= FORMS ================= */
const CHECKLISTS = [
  ['Individual account', ['Ghana Card', 'Two passport photographs', 'GhanaPost GPS address or proof of address', 'Opening deposit']],
  ['Joint account', ['Ghana Cards of all account holders', 'Two passport photographs of each holder', 'Instructions on who can sign', 'Opening deposit']],
  ['Child (School Child Account)', ['Child\'s birth certificate', 'Parent or guardian\'s Ghana Card', 'Two passport photographs of the child and of the parent', 'Opening deposit']],
  ['Business account', ['Certificate of registration', 'Ghana Cards and photographs of all signatories', 'Board resolution or letter naming the signatories (companies)', 'Business GhanaPost GPS address']],
  ['Church, association or group', ['Constitution or rules', 'Minutes or resolution naming the signatories', 'Ghana Cards and photographs of signatories', 'Group\'s address']],
  ['Loan application', ['Ghana Card', 'Proof of income: payslips or bank statements', 'Guarantor details, if required', 'Collateral documents for larger loans']],
]
page({ file: 'forms', title: `Forms and checklists | ${NAME}`, description: 'What to bring when you open an account or apply for a loan, plus our downloadable forms.', current: 'help', body: `
${titleBand({ title: 'Forms and checklists', eb: 'Help', trail: [['Help', 'contact'], ['Forms']], intro: 'Check what to bring before you visit, so your account or loan can be set up in one trip.' })}
<section class="sec !pt-10"><div class="wrap">
  <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">${CHECKLISTS.map(([t, l], i) => `<div class="form-card" data-reveal style="--d:${(i % 3) * 60}ms"><h2 class="h-sm">${t}</h2><ul class="doc-list mt-3">${l.map((d) => `<li>${ic.check}<span>${d}</span></li>`).join('')}</ul></div>`).join('')}</div>
  <div class="mt-8 flex flex-wrap gap-3">${btn('Start opening an account', 'open-account')}<button type="button" class="btn btn-line" data-print>${ic.doc}<span>Print these checklists</span></button></div>
  <h2 class="h-md mt-14">Downloadable forms</h2>
  <ul class="mt-5 grid gap-3" data-confirm>${['Individual account opening form', 'Corporate account opening form', 'Loan application form', 'Share application form', 'Standing order form'].map((t) => `<li class="file"><span class="file-ic">PDF</span><span class="flex-1"><strong class="block text-ink">${t}</strong><span class="text-[.9rem] text-muted">Available at any branch. Online copy coming soon.</span></span></li>`).join('')}</ul>
</div></section>
` })

/* ================= RATES ================= */
const eff = val(RATES.effective)
page({ file: 'rates', title: `Rates and fees | ${NAME}`, description: 'Our current lending base rate, savings interest and standard fees, with the date they took effect.', current: 'help', body: `
${titleBand({ title: 'Rates and fees', eb: 'Help', trail: [['Help', 'contact'], ['Rates and fees']], intro: 'Our current rates and standard charges. Rates are reviewed every month by our Finance and Administration team.', aside: `<p class="inline-flex flex-wrap items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-ink shadow-[0_0_0_1px_var(--color-line)]">${ic.cal.replace('<svg', '<svg class="size-5 text-brand"')}Effective from <span data-confirm>${eff || 'date to be set'}</span></p>` })}
<section class="sec !pt-10"><div class="wrap max-w-[960px]">
  <h2 class="h-md">Interest rates</h2>
  <div class="table-wrap mt-5"><table class="tbl"><thead><tr><th scope="col">Product</th><th scope="col">Rate</th><th scope="col">Notes</th></tr></thead><tbody>${RATES.rows.map(([n, v, d]) => `<tr><th scope="row">${n}</th><td class="num">${v == null ? `<a data-confirm class="prose-link font-sans" href="${tel(BANK.phone)}">Call for today\'s rate</a>` : v}</td><td class="text-muted">${d}</td></tr>`).join('')}</tbody></table></div>
  <h2 class="h-md mt-12">Standard fees</h2>
  <div class="table-wrap mt-5"><table class="tbl"><thead><tr><th scope="col">Service</th><th scope="col">Fee</th></tr></thead><tbody>${RATES.fees.map(([n, v]) => `<tr><th scope="row">${n}</th><td class="num">${v == null ? '<span data-confirm class="font-sans font-semibold text-muted">Ask any branch</span>' : v}</td></tr>`).join('')}</tbody></table></div>
  <p class="callout callout-info mt-10">${ic.info}<span>The rate on your own loan or account is set out in your agreement. Rates for new loans depend on the product, the amount and the period. Before you sign, we tell you the rate, all fees and the total you will repay.</span></p>
  <div class="mt-8 flex flex-wrap gap-3">${btn('Loan calculator', 'loan-calculator', 'btn-brand', ic.calc)}<button type="button" class="btn btn-line" data-print>${ic.doc}<span>Print this page</span></button></div>
</div></section>
` })

/* ================= CONTACT AND HELP ================= */
const ho = BRANCHES[0]
page({ file: 'contact', title: `Contact us | ${NAME}`, description: 'Call, WhatsApp, email or visit us. Find our head office and send us a message.', current: 'help', body: `
${titleBand({ title: 'Contact us', eb: 'Help', trail: [['Contact us']], intro: 'Call or WhatsApp for the quickest answer. For anything about a specific account, visit your branch with your Ghana Card.' })}
<section class="sec !pt-10"><div class="wrap">
  <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">${[['phone', 'Call the hotline', BANK.phone, tel(BANK.phone)], ['wa', 'WhatsApp', cf(BANK.whatsapp), wa(val(BANK.whatsapp))], ['mail', 'Email', BANK.email, 'mailto:' + BANK.email], ['pin', 'Head office', `${BANK.postal}<br>GPS ${BANK.gps}`, 'branch-head-office']].map(([i, t, v, h], k) => `<a class="card p-6" href="${h}" data-reveal style="--d:${k * 60}ms"><span class="card-ic">${ic[i]}</span><span class="h-sm mt-5 block">${t}</span><span class="mt-1 block text-body">${v}</span></a>`).join('')}</div>
</div></section>
<section class="pb-[clamp(64px,8vw,112px)]"><div class="wrap grid gap-10 lg:grid-cols-[1.4fr_1fr]">
  <div><h2 class="h-md">Send us a message</h2><p class="mt-2 text-muted">We reply within one working day<span data-confirm></span>. Do not include your PIN, password or full account number.</p><div class="mt-6">${contactForm('contact-form', 'contact', `<label class="field"><span>What is it about? <span class="req">Required</span></span><select class="input" name="topic" required><option value="">Choose a topic</option><option>Opening an account</option><option>A loan</option><option>An existing account</option><option>Digital banking and U-Connect</option><option>Shares and the AGM</option><option>Something else</option></select></label>`)}</div></div>
  <aside class="grid content-start gap-4">
    <div class="form-card"><h2 class="h-sm">Opening hours</h2><p class="mt-2">Monday to Friday, <span data-confirm>${val(BANK.hours).weekdays.join(' to ')}</span>. Closed at weekends and on public holidays.</p><p class="mt-4">${link('Find your nearest branch', 'branches')}</p></div>
    <div class="form-card"><h2 class="h-sm">Write to the Managing Director</h2><p class="mt-2 text-muted">Ideas, praise or a problem that has not been solved.</p><p class="mt-4">${link('MD Direct', 'md-direct')}</p></div>
    <div class="form-card"><h2 class="h-sm">Not happy with our service?</h2><p class="mt-2 text-muted">See how we handle complaints and how long it takes.</p><p class="mt-4">${link('Make a complaint', 'complaints')}</p></div>
  </aside>
</div></section>
` })
page({ file: 'md-direct', title: `MD Direct: write to the Managing Director | ${NAME}`, description: 'Write directly to the Managing Director with suggestions, praise or service problems that have not been resolved.', current: 'help', body: `
${titleBand({ title: 'MD Direct', eb: 'Help', trail: [['Contact us', 'contact'], ['MD Direct']], intro: 'Write directly to the Managing Director with an idea, praise for a member of staff, or a problem that has not been solved at your branch. Every message is read by the MD\'s office.' })}
<section class="sec !pt-10"><div class="wrap grid gap-10 lg:grid-cols-[1.4fr_1fr]">
  <div>${contactForm('md-form', 'md-direct', `<label class="field"><span>Subject <span class="req">Required</span></span><input class="input" name="subject" required></label>`, '<p class="text-[.95rem] text-muted">For a formal complaint with a reference and deadlines, please use the <a class="prose-link" href="complaints">complaints form</a>.</p>')}</div>
  <aside class="grid content-start gap-4"><div class="form-card"><h2 class="h-sm">What happens next</h2><p class="mt-2" data-confirm>The MD\'s office acknowledges every message within two working days and replies in full within ten.</p></div></aside>
</div></section>
` })
const faqCats = { accounts: 'Accounts', loans: 'Loans', digital: 'Digital banking', help: 'Help and safety' }
page({ file: 'faq', title: `Questions and answers | ${NAME}`, description: 'Answers to common questions about accounts, loans, U-Connect, dormant accounts and complaints.', current: 'help', body: `
${titleBand({ title: 'Questions and answers', eb: 'Help', trail: [['Help', 'contact'], ['Questions']], intro: 'Quick answers to what customers ask us most.' })}
<section class="sec !pt-10"><div class="wrap max-w-[900px]">
  <div class="flex flex-wrap gap-2" role="group" aria-label="Filter questions" data-filter-group="faq"><button type="button" class="chip" data-filter="all" aria-pressed="true">All</button>${Object.entries(faqCats).map(([k, t]) => `<button type="button" class="chip" data-filter="${k}" aria-pressed="false">${t}</button>`).join('')}</div>
  <div class="mt-8 grid gap-3" data-filter-list="faq">${FAQ.map(([c, q, a]) => `<details class="acc" data-cat="${c}"><summary>${q}<span class="acc-ic">${ic.plus}</span></summary><div class="acc-body text-body">${a == null ? '<span data-confirm>Ask at any branch or call ' + BANK.phone + '.</span>' : a}</div></details>`).join('')}</div>
  <p class="mt-10">Still have a question? ${link('Contact us', 'contact')}</p>
</div></section>
` })
page({ file: 'security', title: `Security and fraud | ${NAME}`, description: 'How to protect your account, spot scams and report fraud. We will never ask for your PIN.', current: 'help', body: `
${titleBand({ title: 'Banking safely', eb: 'Security', trail: [['Help', 'contact'], ['Security and fraud']], intro: 'Fraudsters pretend to be bank staff, mobile money agents and even relatives. These rules will keep your money safe.' })}
<section class="sec !pt-10"><div class="wrap">
  <p class="callout callout-danger text-[1.08rem]">${ic.alert}<span><strong>We will never ask for your PIN, password or the codes we send you</strong>, by phone, SMS, WhatsApp or email. Anyone who asks is a fraudster. Hang up and call ${BANK.phone}.</span></p>
  <div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">${[['lock', 'Keep your PIN secret', 'Do not write it down or share it, even with family. Cover the keypad when you type it.'], ['phone', 'Beware of “bank” calls', 'If someone calls saying they are from the bank and asks for details, hang up and call us back on our published number.'], ['mobile', 'Mobile money scams', 'Never reverse a “wrong transfer” yourself. Check your balance first, and report it to us or to MTN.'], ['user', 'Check who you deal with', 'Our mobile bankers carry staff ID and give you a receipt for every susu collection. Ask to see it.'], ['send', 'Suspicious messages', 'Do not click links in messages that claim your account is blocked. We do not send links asking you to log in.'], ['card', 'Keep your Ghana Card safe', 'Never hand your Ghana Card or account documents to people who promise loans for a fee.']].map(([i, t, d], k) => `<div class="card p-6" data-reveal style="--d:${(k % 3) * 60}ms"><span class="card-ic">${ic[i]}</span><h2 class="h-sm mt-5">${t}</h2><p class="mt-2 text-muted">${d}</p></div>`).join('')}</div>
  <div class="mt-12 grid gap-6 rounded-[24px] bg-deep p-8 text-white md:grid-cols-[1.4fr_1fr] md:items-center md:p-10"><div><h2 class="h-md !text-white">Think you have been targeted?</h2><p class="mt-2 text-white/85">Call us straight away so we can protect your account, then report it to the police.</p></div><div class="flex flex-wrap gap-3 md:justify-end"><a class="btn btn-sun" href="${tel(BANK.phone)}">${ic.phone}<span>Call ${BANK.phone}</span></a><a class="btn btn-line" href="complaints">Report it</a></div></div>
</div></section>
` })

/* ================= LEGAL AND COMPLAINTS ================= */
// Privacy, terms, cookies and complaints live in legal.mjs
await import('./legal.mjs')

/* ================= 404 AND SITEMAP ================= */
page({ file: 'error-404', title: `Page not found | ${NAME}`, description: 'This page could not be found.', index: false, body: `
<section class="sec !pt-[calc(var(--hdr)+48px)]"><div class="wrap grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
  <div><p class="eyebrow">Error 404</p><h1 class="h-xl mt-4">We could not find that page</h1><p class="lede mt-4 max-w-[52ch] text-muted">It may have moved when we updated our website. Try searching, or use one of these links.</p>
  <div class="mt-8 flex flex-wrap gap-3"><button type="button" class="btn btn-brand" data-open-search>${ic.search}<span>Search the site</span></button>${btn('Go to the homepage', './', 'btn-line', '')}</div>
  <ul class="mt-10 grid gap-2 sm:grid-cols-2">${[['Accounts', 'accounts'], ['Loans', 'loans'], ['Branches and hours', 'branches'], ['Reports', 'reports'], ['Rates and fees', 'rates'], ['Contact us', 'contact']].map(([t, h]) => `<li>${link(t, h)}</li>`).join('')}</ul></div>
  <div class="mx-auto w-full max-w-[320px] text-brand/25">${cowrie}</div>
</div></section>
` })
const groups = [['Banking', ['accounts', 'loans', 'insurance', 'loan-calculator', 'open-account', 'digital-banking', ...PRODUCTS.map((p) => p.slug)]], ['Branches', ['branches', ...BRANCHES.map((b) => 'branch-' + b.slug)]], ['About', ['about', 'board', 'management', 'community', 'news', 'gallery', 'investors', 'reports']], ['Help', ['contact', 'md-direct', 'complaints', 'faq', 'security', 'rates', 'forms', 'dormant-accounts']], ['Legal', ['privacy', 'terms', 'cookies']]]
const titleOf = (u) => (INDEX.find((x) => x.u === u) || {}).t || u
page({ file: 'sitemap', title: `Sitemap | ${NAME}`, description: 'Every page on this website.', body: `
${titleBand({ title: 'Sitemap', trail: [['Sitemap']], intro: 'Every page on this website, grouped by section.' })}
<section class="sec !pt-10"><div class="wrap grid gap-10 md:grid-cols-2 lg:grid-cols-3">${groups.map(([h, l]) => `<div><h2 class="h-sm">${h}</h2><ul class="mt-3 grid gap-1.5">${l.map((u) => `<li><a class="prose-link" href="${u}">${titleOf(u)}</a></li>`).join('')}</ul></div>`).join('')}<div><h2 class="h-sm">News</h2><ul class="mt-3 grid gap-1.5">${NEWS_SORTED.map((n) => `<li><a class="prose-link" href="news-${n.slug}">${n.title}</a></li>`).join('')}</ul></div></div></section>
` })

/* ================= SEARCH INDEX ================= */
for (const f of FAQ) INDEX.push({ u: 'faq', t: f[1], d: val(f[2]) || '', k: 'Question' })
writeFileSync(join(T, 'assets/search-index.json'), JSON.stringify(INDEX))
console.log('pages', INDEX.length)
