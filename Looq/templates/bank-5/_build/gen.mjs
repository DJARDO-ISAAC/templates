// node templates/bank-5/_build/gen.mjs: writes every page of the bank template, the favicon and the search index
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { T, esc, val, cf, tel, wa, NAME, mark, img, btn, link, crumbs, head, page, titleBand, appBadges, INDEX, ic } from './lib.mjs'
import { cowrie } from './art.mjs'
import { BANK, KEY_FACTS, GROUPS, PRODUCTS, BRANCHES, REGIONS } from './bank.mjs'
import { NEWS, ALBUMS } from './content.mjs'
import { P, factVal, groupPage, hoursSpec, openDot, branchOptions, productCard, newsCard, fmtDate, dateTag, NEWS_SORTED, applyForm, loanCalc } from './parts.mjs'

// favicon.png is cropped from the official logo in assets/images; nothing to generate

/* ================= HOME ================= */
const latest = NEWS_SORTED.filter((n) => val(n.date))[0]
const tabs = ['save', 'borrow', 'insure', 'invest']
const years = 2026 - BANK.founded
const star = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 2.8 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor"/></svg>'
const spark = `<svg class="spark h-12 w-full" viewBox="0 0 200 48" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="sg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3fe08e" stop-opacity=".35"/><stop offset="1" stop-color="#3fe08e" stop-opacity="0"/></linearGradient></defs><path d="M0 40 L20 36 L40 38 L60 30 L80 32 L100 22 L120 25 L140 16 L160 18 L180 8 L200 6 L200 48 L0 48Z" fill="url(#sg)"/><path class="line" d="M0 40 L20 36 L40 38 L60 30 L80 32 L100 22 L120 25 L140 16 L160 18 L180 8 L200 6" fill="none" stroke="#119a52" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`
const PARTNERS = [['GES', 'Ghana Education Service'], ['GHS', 'Ghana Health Service'], ['VRA', 'Volta River Authority'], ['VREL', 'VRA Resettlement Trust'], ['GE', 'Golden Exotics'], ['ARB', 'ARB Apex Bank'], ['MTN', 'MTN Mobile Money'], ['GC', 'Ghana Club 100']]
const mq = (hidden) => `<div class="flex gap-14"${hidden ? ' aria-hidden="true"' : ''}>${PARTNERS.map(([a, n]) => `<span class="mq-item"><i>${a}</i>${n}</span>`).join('')}</div>`
// Abstract pin layout for the networked-branches tile: Krobo cluster top right, Accra cluster bottom left
const PINS = { krobo: [[70, 22], [78, 30], [64, 34], [84, 18], [72, 44], [88, 38]], accra: [[22, 66], [30, 74], [16, 80], [36, 62], [26, 88], [40, 82]] }
const pinIdx = { krobo: 0, accra: 0 }
const pins = BRANCHES.map((b, i) => { const [x, y] = PINS[b.region][pinIdx[b.region]++ % 6]; return `<span class="pin${b.type === 'head' ? ' is-gold' : ''}" style="left:${x}%;top:${y}%;--d:${(i * 0.21).toFixed(2)}s"></span>` }).join('')
const STORIES = ALBUMS.filter((a) => a.cat === 'community')

page({ file: 'index', title: `${NAME} | Your family banking centre since ${BANK.founded}`, description: `Savings, susu, loans and insurance from ${BANK.short}, the community bank founded by the Krobo Women Association in 1978. 12 locations in the Krobo area and Greater Accra.`, kind: 'Home', short: 'Home', body: `
<section class="hx on-dark">
  <div class="hx-bg" aria-hidden="true"><span class="blob blob-a"></span><span class="blob blob-b"></span><span class="blob blob-c"></span><span class="grid-lines"></span><span class="grain"></span></div>
  <div class="wrap grid items-center gap-12 lg:grid-cols-[1.08fr_1fr] lg:gap-10">
    <div class="relative z-[1]">
      <a class="announce hero-in" href="news-${latest.slug}"><b>New</b><span>${latest.title}</span>${ic.arrow}</a>
      <h1 class="h-xl mt-7 max-w-[13ch]" data-split>Your family's <em class="serif grad-text">banking centre</em> since ${BANK.founded}.</h1>
      <p class="lede mt-6 max-w-[50ch] hero-in" style="--i:4">Founded by the Krobo Women Association, we help traders, farmers, workers and families save, borrow and plan, at 12 networked places across the Krobo area and Greater Accra.</p>
      <div class="mt-9 flex flex-wrap gap-3 hero-in" style="--i:5">${btn('Open an account', 'open-account', 'btn-sun')}${btn('Explore loans', 'loans', 'btn-line', '')}</div>
      <ul class="trust mt-10 hero-in" style="--i:6"><li>${ic.check}5th rural bank licensed in Ghana</li><li>${ic.check}Ghana Club 100</li><li>${ic.check}${years} years serving families</li></ul>
    </div>
    <div class="hx-visual" data-parallax-scene aria-hidden="true">
      <div class="hx-photo float-in" style="--i:0">${img('hero-staff.jpg', '', 'fetchpriority="high" loading="eager"')}</div>
      <div class="float left-0 top-[8%] w-[250px] float-in sm:w-[270px]" style="--i:2" data-depth="18"><div class="glass-light bob p-4">
        <div class="flex items-center justify-between"><p class="text-[.72rem] font-semibold uppercase tracking-[.12em] text-muted">Savings balance</p><span class="pill !py-0.5 !text-[.68rem]">U-Connect</span></div>
        <p class="mt-2 font-display text-[1.6rem] font-bold tracking-[-.03em] text-ink">GH₵ <span data-count="12480" data-dp="2">12,480.00</span></p>
        <div class="mt-2">${spark}</div>
        <p class="mt-1 flex items-center gap-1.5 text-[.76rem] font-semibold text-brand-2"><span class="block size-3.5 -rotate-45">${ic.arrow}</span>GH₵ 320 saved this week</p>
      </div></div>
      <div class="float bottom-[6%] left-[2%] float-in" style="--i:3" data-depth="32"><a class="bank-card bob-2 block -rotate-[4deg] !w-[250px] sm:!w-[290px]" href="salary-loans" tabindex="-1">
        <div class="relative flex h-full flex-col"><div class="flex items-center justify-between"><span class="chip-ic"></span><span class="text-[.7rem] font-semibold uppercase tracking-[.16em] text-white/70">Salary loan</span></div><p class="mt-auto font-display text-[1.7rem] font-bold leading-none tracking-[-.03em]">60 <span class="text-[.9rem] font-semibold text-white/70">months to repay</span></p><p class="mt-2 text-[.74rem] text-white/70">GES · GHS · VRA · VREL · Golden Exotics</p></div>
      </a></div>
      <div class="float right-[4%] top-[4%] hidden float-in sm:block" style="--i:4" data-depth="12"><div class="glass bob-3 flex items-center gap-2.5 !rounded-full px-4 py-2.5">${openDot(BRANCHES[0]).replace('<p class="open-dot"', '<p class="open-dot !text-white"')}</div></div>
      <div class="float bottom-[16%] right-0 hidden float-in md:block" style="--i:5" data-depth="24"><div class="glass toast bob">
        <i class="bg-sun text-ink">${ic.mobile}</i><span><span class="block text-[.72rem] text-white/60">MTN MoMo to account</span><span class="block font-semibold text-white">GH₵ 250.00 received</span></span><span class="ml-2 block size-5 rounded-full bg-glow p-1 text-night">${ic.check}</span>
      </div></div>
    </div>
  </div>
  <div class="wrap pb-8 pt-14 md:pt-20"><nav class="quick" aria-label="Quick actions">
    ${[['open-account', 'piggy', 'Open an account', 'Start online in 3 minutes'], ['loans', 'coins', 'Get a loan', 'Salary, business, group and more'], ['branches', 'pin', 'Find a branch', '12 places to bank'], [tel(BANK.phone), 'phone', 'Call us', BANK.phone]].map(([h, i, t, s], k) => `<a href="${h}" class="hero-in" style="--i:${7 + k}"><span class="quick-ic">${ic[i]}</span><span>${t}<small>${s}</small></span></a>`).join('')}
  </nav></div>
</section>

<section class="py-12 md:py-14" aria-label="Who we serve and work with">
  <p class="wrap text-center text-[.8rem] font-semibold uppercase tracking-[.16em] text-muted">Trusted by the staff of and partnered with</p>
  <div class="marquee mt-7"><div class="marquee-track">${mq(false)}${mq(true)}</div></div>
</section>

<section class="sec !pt-10"><div class="wrap">
  <div class="sec-head">${head('What we offer', 'Everything you need to <em class="serif text-brand">save, borrow</em> and grow', 'Every product page tells you who it is for, what you need and how to start.')}
  <div class="tabs" role="tablist" aria-label="Products" data-reveal>${tabs.map((g, i) => `<button type="button" role="tab" id="t-${g}" aria-controls="p-${g}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}">${GROUPS[g].name}</button>`).join('')}</div></div>
  ${tabs.map((g, i) => `<div role="tabpanel" id="p-${g}" aria-labelledby="t-${g}" class="mt-10"${i ? ' hidden' : ''}><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${PRODUCTS.filter((p) => p.group === g || p.also === g).slice(0, 6).map(productCard).join('')}</div><p class="mt-8">${link(`All ${GROUPS[g].title.toLowerCase()}`, groupPage[g])}</p></div>`).join('')}
</div></section>

<section class="pb-[clamp(72px,9vw,128px)]"><div class="wrap">
  ${head('Why families choose us', 'A bank that <em class="serif text-brand">knows your town</em>', '', 'max-w-[720px]')}
  <div class="bento mt-12">
    <article class="tile spot b-a !min-h-[420px] justify-end on-dark" data-reveal="scale"><div class="tile-img">${img('head-office.jpg', 'The green head office building at Abanse')}</div><p class="tile-num">${BANK.founded}</p><h3 class="h-md mt-3 max-w-[18ch]">Started by women, owned by the community</h3><p class="mt-3 max-w-[48ch]">The Krobo Women Association founded the bank at Abanse, in the Manya Krobo district, to bring banking to the farmers, traders and families the big banks did not reach.</p><p class="mt-5">${link('Read our story', 'about').replace('class="link"', 'class="link !text-sun"')}</p></article>
    <article class="tile spot b-b" data-reveal style="--d:80ms"><span class="card-ic">${ic.building}</span><p class="tile-num mt-auto pt-8"><span data-count="5">5</span><sup class="text-[.4em] text-brand">th</sup></p><p class="mt-2 font-semibold text-ink">Rural bank to be licensed in Ghana</p></article>
    <article class="tile tile-dark spot b-c on-dark" data-reveal style="--d:160ms"><p class="tile-num"><span data-count="12">12</span></p><h3 class="h-sm mt-2">Places to bank, all networked</h3><p class="mt-2 text-[.94rem]">Deposit and withdraw at whichever is closest that day.</p><div class="dotmap mt-6 min-h-[200px] flex-1 rounded-2xl bg-white/[.04] ring-1 ring-white/10" aria-hidden="true"><span class="absolute left-[60%] top-[8%] text-[.66rem] font-semibold uppercase tracking-[.14em] text-white/40">Krobo</span><span class="absolute bottom-[6%] left-[8%] text-[.66rem] font-semibold uppercase tracking-[.14em] text-white/40">Accra</span>${pins}</div><p class="mt-5">${link('Find a branch', 'branches').replace('class="link"', 'class="link !text-glow"')}</p></article>
    <article class="tile spot b-d !bg-sun-soft !shadow-none" data-reveal style="--d:120ms"><span class="card-ic !bg-sun !text-ink">${star}</span><p class="mt-auto pt-8 font-display text-[1.6rem] font-bold leading-tight tracking-[-.03em] text-ink">Ghana Club 100</p><p class="mt-2 text-[.94rem] text-body">Ranked 31st in 2016 and listed again in 2018.</p></article>
    <article class="tile spot b-e !min-h-[300px] justify-end on-dark" data-reveal style="--d:60ms"><div class="tile-img">${img('scholarship.jpg', 'Scholarship recipients with bank staff')}</div><p class="tile-num">GH₵ <span data-count="90000">90,000</span></p><h3 class="h-sm mt-2">in scholarships for 36 tertiary students in 2025</h3><p class="mt-4">${link('Our profits stay local', 'community').replace('class="link"', 'class="link !text-sun"')}</p></article>
    <article class="tile spot b-f !bg-mint !shadow-none" data-reveal style="--d:120ms"><div class="flex flex-1 flex-col justify-between gap-8 md:flex-row md:items-end"><div><span class="card-ic !bg-white">${ic.users}</span><h3 class="h-md mt-6 max-w-[16ch]">Lending that lifts women and families</h3><p class="mt-3 max-w-[46ch] text-body">Much of our lending still goes to women, and it has given many women in our area real economic independence.</p></div><div class="flex-none rounded-2xl bg-white p-5 shadow-[0_20px_40px_-24px_rgb(4_35_26/.4)]"><p class="text-[.72rem] font-semibold uppercase tracking-[.12em] text-muted">Since 1998</p><p class="mt-1 font-display text-[1.05rem] font-bold leading-snug text-ink">Named best managed<br>rural bank in Ghana</p></div></div></article>
  </div>
</div></section>

<section class="pb-[clamp(72px,9vw,128px)]"><div class="wrap">
  <div class="cta !p-[clamp(28px,5vw,64px)] grid items-center gap-12 on-dark lg:grid-cols-[1fr_1fr]" data-reveal="clip">
    <svg class="rings" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" stroke-dasharray="2 6"/><circle cx="100" cy="100" r="70" fill="none" stroke="currentColor"/><circle cx="100" cy="100" r="42" fill="none" stroke="currentColor" stroke-dasharray="1 4"/></svg>
    <div>
      <p class="eyebrow">Salary loans</p>
      <h2 class="h-lg mt-5" data-split-scroll>Borrow more. Repay over <em class="serif text-sun">up to 60 months.</em></h2>
      <p class="lede mt-5">For staff of GES, GHS, VRA, VREL and Golden Exotics who take their salary at ${BANK.short}. Small monthly repayments leave more of your take-home pay.</p>
      <ul class="ticks mt-7">${['Top up once you have repaid half of your current loan', 'You can still use a salary overdraft', 'Apply at Abanse, Somanya, Kpong, Akuse, Madina, Ashiyie or Ashaiman'].map((t) => `<li>${ic.check}<span>${t}</span></li>`).join('')}</ul>
      <p class="mt-8">${link('See salary loans', 'salary-loans').replace('class="link"', 'class="link !text-sun"')}</p>
    </div>
    <div class="glass relative p-6 md:p-8" data-loan-calc>
      <p class="flex items-center justify-between text-[.78rem] font-semibold uppercase tracking-[.14em] text-white/55"><span>Quick estimate</span><span class="block size-5 text-glow">${ic.calc}</span></p>
      <div class="mt-6"><div class="flex items-baseline justify-between gap-3"><label class="font-medium text-white/85" for="h-amt">Loan amount</label><output class="font-display text-[1.3rem] font-bold text-white" data-amount-out></output></div><input id="h-amt" class="range mt-4" type="range" min="1000" max="100000" step="500" value="20000" data-amount></div>
      <div class="mt-7"><div class="flex items-baseline justify-between gap-3"><label class="font-medium text-white/85" for="h-mon">Repay over</label><output class="font-display text-[1.3rem] font-bold text-white" data-months-out></output></div><input id="h-mon" class="range mt-4" type="range" min="1" max="60" step="1" value="24" data-months></div>
      <input type="hidden" value="30" data-rate>
      <div class="mt-8 rounded-2xl bg-night/40 p-5 ring-1 ring-white/10"><p class="text-[.85rem] text-white/60">Estimated monthly repayment</p><p class="calc-big mt-2" data-pay-out></p><dl class="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-[.86rem]"><div><dt class="text-white/55">Total repaid</dt><dd class="mt-0.5 font-semibold text-white" data-total-out></dd></div><div><dt class="text-white/55">Total interest</dt><dd class="mt-0.5 font-semibold text-white" data-interest-out></dd></div></dl></div>
      <p class="mt-4 text-[.78rem] text-white/50">Uses an example rate of 30% a year on a reducing balance. Not a loan offer.</p>
      <a class="btn btn-sun mt-5 w-full" href="salary-loans" data-calc-apply data-base="salary-loans"><span>Apply for a salary loan</span>${ic.arrow}</a>
    </div>
  </div>
</div></section>

<section class="pb-[clamp(72px,9vw,128px)]"><div class="wrap">
  ${head('Getting started', 'Open an account in <em class="serif text-brand">three simple steps</em>', 'Start online in about three minutes. Bank of Ghana rules mean we check your Ghana Card in person, so the branch visit is quick.', 'mx-auto max-w-[760px] text-center [&_.lede]:mx-auto')}
  <div class="track mt-14" data-reveal><div class="track-line" aria-hidden="true"><i></i></div>
    ${[['mobile', 'Start online', 'Choose an account and leave your details. It takes about three minutes.'], ['phone', 'We call you', 'A member of staff calls within one working day to tell you exactly what to bring.'], ['card', 'Visit your branch', 'Bring your Ghana Card to any of our 12 locations and walk out with your account.']].map(([i, t, d], k) => `<div class="step"><div class="step-n"><span>${ic[i]}</span><b>${k + 1}</b></div><h3 class="h-sm mt-6">${t}</h3><p class="mt-2 max-w-[32ch] text-muted">${d}</p></div>`).join('')}
  </div>
  <div class="mt-12 flex flex-wrap justify-center gap-3" data-reveal>${btn('Start online', 'open-account')}${btn('What to bring', 'forms', 'btn-line', '')}</div>
</div></section>

<section class="relative overflow-hidden rounded-[clamp(28px,4vw,48px)] bg-night on-dark mx-3 md:mx-5"><div class="hx-bg" aria-hidden="true"><span class="blob blob-b !opacity-40"></span><span class="grid-lines"></span></div>
  <div class="wrap grid items-center gap-14 py-20 md:py-28 lg:grid-cols-[1fr_1.1fr]">
    <div class="relative mx-auto" data-reveal="scale" aria-hidden="true">
      <div class="phone"><div class="phone-notch"></div><div class="phone-screen">
        <div class="app-top"><p class="text-[.72rem] text-white/60">Good morning</p><p class="font-display text-[1.05rem] font-bold">Hello, Ama</p></div>
        <div class="app-card"><p class="text-[.66rem] font-semibold uppercase tracking-[.12em] text-muted">Savings account ···· 4821</p><p class="mt-1 font-display text-[1.45rem] font-bold tracking-[-.03em]">GH₵ 12,480.00</p><div class="app-acts">${[['send', 'Send'], ['mobile', 'MoMo'], ['phone', 'Airtime'], ['doc', 'Bills']].map(([i, t]) => `<span><i>${ic[i]}</i>${t}</span>`).join('')}</div></div>
        <div class="mx-4 mt-4"><p class="text-[.7rem] font-semibold uppercase tracking-[.12em] text-muted">Recent</p>${[['mobile', 'MoMo top-up', '+ 250.00', 'text-brand-2'], ['doc', 'ECG prepaid', '− 120.00', ''], ['send', 'Transfer to Kofi', '− 300.00', ''], ['wallet', 'Salary', '+ 3,450.00', 'text-brand-2']].map(([i, t, v, c]) => `<div class="app-row"><i>${ic[i]}</i><span class="flex-1 font-medium">${t}</span><span class="font-semibold ${c}">${v}</span></div>`).join('')}</div>
      </div></div>
      <div class="glass toast absolute -left-16 bottom-[30%] hidden sm:flex bob"><i class="bg-glow text-night">${ic.check}</i><span><span class="block text-[.72rem] text-white/60">Transfer sent</span><span class="block font-semibold text-white">GH₵ 300.00</span></span></div>
      <div class="glass toast absolute -right-14 top-[9%] hidden sm:flex bob-2"><i class="bg-sun text-ink">${ic.lock}</i><span><span class="block text-[.72rem] text-white/60">Your PIN</span><span class="block font-semibold text-white">Known only to you</span></span></div>
    </div>
    <div data-reveal style="--d:100ms">
      <p class="eyebrow">Digital banking</p>
      <h2 class="h-lg mt-5" data-split-scroll>Your bank in your pocket with <em class="serif grad-text">U-Connect</em></h2>
      <p class="lede mt-5">Check your balance, send money and pay bills from your phone, day or night. As an MTN Mobile Money super merchant, we also let you move money between your account and your MoMo wallet.</p>
      <ul class="mt-8 grid gap-3 sm:grid-cols-2">${[['wallet', 'Balance and history'], ['send', 'Transfers'], ['mobile', 'MoMo, both ways'], ['doc', 'Airtime and bills']].map(([i, t]) => `<li class="flex items-center gap-3 rounded-2xl bg-white/[.05] p-4 ring-1 ring-white/10"><span class="grid size-10 flex-none place-items-center rounded-xl bg-glow/15 text-glow"><span class="block size-[18px]">${ic[i]}</span></span><span class="font-semibold text-white">${t}</span></li>`).join('')}</ul>
      <div class="mt-9 flex flex-wrap gap-3">${appBadges()}</div>
      <p class="mt-6">${link('How to register', 'digital-banking').replace('class="link"', 'class="link !text-glow"')}</p>
    </div>
  </div>
</section>

<section class="sec"><div class="wrap">
  <div class="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-start">
    <div class="lg:sticky lg:top-[120px]">
      ${head('Branches', '12 places to bank, <em class="serif text-brand">all networked</em>', 'Deposit and withdraw at any branch or mobilisation centre, whichever is closest to you.')}
      <form action="branches" class="mt-8 flex w-full max-w-[460px] gap-2 rounded-full bg-white p-1.5 shadow-[0_0_0_1px_var(--color-line),0_14px_30px_-20px_rgb(4_35_26/.4)]" data-reveal role="search"><label class="sr-only" for="town">Find a branch by town</label><input id="town" name="town" class="input !min-h-[46px] !rounded-full !bg-transparent !shadow-none" placeholder="Your town, e.g. Somanya"><button class="btn btn-deep btn-sm" type="submit">Find</button></form>
      <div class="mt-6" data-reveal>${openDot(BRANCHES[0])}</div>
    </div>
    <div class="grid gap-4">${Object.entries(REGIONS).map(([k, r], j) => { const list = BRANCHES.filter((b) => b.region === k); return `<div class="rounded-[28px] bg-white p-6 shadow-[0_0_0_1px_var(--color-line)] md:p-8" data-reveal style="--d:${j * 100}ms"><div class="flex items-center justify-between gap-4"><h3 class="h-sm">${r}</h3><span class="pill">${list.length} locations</span></div><ul class="mt-5 grid gap-1 sm:grid-cols-2">${list.map((b) => `<li><a class="group flex items-center gap-3 rounded-2xl px-3 py-2.5 font-medium text-ink transition hover:bg-paper" href="branch-${b.slug}"><span class="grid size-8 flex-none place-items-center rounded-full bg-mint text-brand-2 transition group-hover:bg-brand group-hover:text-white"><span class="block size-4">${ic.pin}</span></span><span class="min-w-0 flex-1 truncate">${b.name.replace(' Mobilisation Centre', ' Centre')}</span><span class="block size-4 -translate-x-1 text-muted opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">${ic.arrow}</span></a></li>`).join('')}</ul></div>` }).join('')}</div>
  </div>
</div></section>

<section class="pb-[clamp(72px,9vw,128px)]"><div class="wrap">
  <div class="sec-head">${head('In the community', 'Our profits <em class="serif text-brand">stay local</em>', 'Scholarships, health centres, schools, police stations and festivals across the Krobo area.')}<div class="flex gap-2" data-reveal data-scroll-nav="stories"><button type="button" class="round-btn sc-btn" data-scroll-prev="stories" aria-controls="stories" aria-label="Previous stories" disabled>${ic.back}</button><button type="button" class="round-btn sc-btn" data-scroll-next="stories" aria-controls="stories" aria-label="Next stories">${ic.next}</button></div></div>
  <div class="scroller mt-10" id="stories" data-scroller data-reveal>${STORIES.map((a) => `<a class="story" href="gallery-${a.slug}">${img(`gallery/thumb-${a.slug}-${a.cover || 1}.jpg`, '')}<span class="pill self-start !bg-white/15 !text-white backdrop-blur">${a.n} photos</span><h3 class="h-sm mt-3">${cf(a.title)}</h3></a>`).join('')}<a class="story !justify-center bg-mint !text-ink before:!hidden" href="community"><span class="card-ic !bg-white">${ic.heart}</span><h3 class="h-md mt-5 !text-ink">See all our community work</h3><span class="mt-4 font-semibold text-brand-2">In the community →</span></a></div>
</div></section>

<section class="sec bg-white"><div class="wrap">
  <div class="sec-head">${head('Latest from the bank', 'News and <em class="serif text-brand">notices</em>')}<div data-reveal>${btn('All news and notices', 'news', 'btn-line', ic.arrow)}</div></div>
  <div class="mt-12 grid gap-5 md:grid-cols-3">${NEWS_SORTED.slice(0, 3).map(newsCard).join('')}</div>
</div></section>

<section class="py-[clamp(72px,9vw,128px)]"><div class="wrap grid gap-5">
  <div class="flex flex-col gap-6 rounded-[28px] bg-danger-soft/70 p-6 ring-1 ring-danger/10 md:flex-row md:items-center md:p-8" data-reveal><span class="grid size-14 flex-none place-items-center rounded-2xl bg-white text-danger shadow-sm"><span class="block size-7">${ic.shield}</span></span><div class="flex-1"><h2 class="h-sm">We will never ask for your PIN</h2><p class="mt-1 text-body">Not by phone, SMS, WhatsApp or email. If someone asks for your PIN, password or a code, it is fraud. Hang up and call <a class="prose-link" href="${tel(BANK.phone)}">${BANK.phone}</a>.</p></div>${btn('How to stay safe', 'security', 'btn-line btn-sm', '')}</div>
  <div class="cta on-dark" data-reveal="clip">
    <svg class="rings" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" stroke-dasharray="2 6"/><circle cx="100" cy="100" r="76" fill="none" stroke="currentColor"/><circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" stroke-dasharray="1 4"/><circle cx="100" cy="100" r="32" fill="none" stroke="currentColor"/></svg>
    <div class="max-w-[640px]"><p class="eyebrow">Join ${years} years of families</p><h2 class="h-xl mt-6" data-split-scroll>Open your account <em class="serif text-sun">in three minutes.</em></h2><p class="lede mt-5 max-w-[48ch]">Start online today and finish at the branch nearest you. No queue for the paperwork.</p><div class="mt-9 flex flex-wrap gap-3">${btn('Open an account', 'open-account', 'btn-sun')}${btn('Find a branch', 'branches', 'btn-line', ic.pin)}</div></div>
  </div>
</div></section>
` })

/* ================= PRODUCT PAGES ================= */
const rel = (p) => PRODUCTS.filter((x) => x.group === p.group && x.slug !== p.slug).slice(0, 3)
for (const p of PRODUCTS) {
  const g = GROUPS[p.group]
  const facts = Object.entries(p.facts)
  const benefits = val(p.benefits)
  const bConf = p.benefits && p.benefits.confirm
  page({ file: p.slug, title: `${p.name} | ${NAME}`, description: `${val(p.short)} ${BANK.short}.`, current: p.group === 'borrow' ? 'borrow' : 'save', kind: g.title.replace(/s$/, ''), body: `
${titleBand({ title: p.name, eb: g.title, trail: [[g.title, groupPage[p.group]], [p.name]], intro: cf(p.summary), aside: `<div class="flex flex-wrap gap-3">${btn(p.group === 'borrow' ? 'Apply now' : p.group === 'insure' ? 'Get a quote' : 'Start online', '#apply')}${btn(`Call ${BANK.phone}`, tel(BANK.phone), 'btn-line', ic.phone)}</div>${p.seasonal ? `<p class="callout mt-5 max-w-[60ch]">${ic.cal}<span>${cf(p.seasonal)}</span></p>` : ''}` })}
<section class="pt-10"><div class="wrap"><dl class="facts" style="--n:${facts.length}">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${factVal(v)}</dd></div>`).join('')}</dl></div></section>
<section class="sec !pt-12"><div class="wrap grid gap-12 lg:grid-cols-[1.4fr_1fr]">
  <div class="grid gap-12">
    <div data-reveal><h2 class="h-md">Who it is for</h2><p class="lede mt-3 text-body">${p.who}</p></div>
    <div data-reveal><h2 class="h-md">What you get</h2><ul class="ticks mt-5"${bConf ? ' data-confirm' : ''}>${benefits.map((b) => `<li>${ic.check}<span>${b}</span></li>`).join('')}</ul></div>
    ${p.slug === 'susu-savings-account' ? susuPlanner() : ''}
    ${p.calc ? `<div data-reveal><h2 class="h-md">Estimate your repayments</h2><div class="mt-5">${loanCalc(p)}</div></div>` : ''}
    <div data-reveal><h2 class="h-md">What you need</h2><ul class="doc-list mt-4">${p.docs.map((d) => `<li>${ic.doc}<span>${d}</span></li>`).join('')}</ul><p class="mt-4 text-[.95rem] text-muted">Bring the originals to the branch. ${link('Prepare with our checklists', 'forms')}</p></div>
    <div data-reveal><h2 class="h-md">How to ${p.group === 'borrow' ? 'apply' : 'start'}</h2><ol class="steps-list mt-5">${[[`Send your details`, `Use the form on this page, call ${BANK.phone} or walk into any branch.`], ['We call you', 'A member of staff calls within one working day to answer your questions and tell you exactly what to bring.'], ['Visit your branch', 'Bring your Ghana Card and the documents listed above.'], [p.group === 'borrow' ? 'Get a decision' : 'You are set up', p.group === 'borrow' ? 'We assess your application and tell you the decision, the rate and the fees before you sign anything.' : 'We open your account or policy and explain how to use it, including U-Connect and mobile money.']].map(([t, d]) => `<li><strong class="block text-ink">${t}</strong><span class="text-muted">${d}</span></li>`).join('')}</ol></div>
    ${val(p.faq) && val(p.faq).length ? `<div data-reveal><h2 class="h-md">Questions</h2><div class="mt-5 grid gap-3">${p.faq.map(([q, a]) => `<details class="acc"><summary>${q}<span class="acc-ic">${ic.plus}</span></summary><div class="acc-body text-body">${cf(a)}</div></details>`).join('')}</div></div>` : ''}
  </div>
  <div>${applyForm(p)}</div>
</div></section>
<section class="pb-[clamp(64px,8vw,112px)]"><div class="wrap">
  <div class="flex flex-wrap items-end justify-between gap-6">${head('', 'You might also need')}<div data-reveal>${link(`All ${g.title.toLowerCase()}`, groupPage[p.group])}</div></div>
  <div class="mt-8 grid gap-5 md:grid-cols-3">${rel(p).map(productCard).join('')}</div>
</div></section>
` })
}

function susuPlanner() { return `<div data-reveal><h2 class="h-md">Plan your susu</h2><p class="mt-2 text-muted">See how small daily amounts add up.</p><div class="mt-5 grid gap-6 lg:grid-cols-[1.25fr_1fr]" data-susu>
  <div class="form-card grid gap-7">
    <div><div class="flex items-baseline justify-between gap-3"><label class="font-bold text-ink" for="susu-d">Each collection</label><output class="font-display text-[1.4rem] font-bold text-ink" data-daily-out></output></div><input id="susu-d" class="range mt-3" type="range" min="2" max="200" step="1" value="10" data-daily></div>
    <label class="field"><span>Collections a week</span><select class="input" data-days><option value="7">Every day</option><option value="6" selected>6 days a week</option><option value="5">5 days a week</option><option value="3">3 days a week</option><option value="1">Once a week</option></select></label>
    <div><div class="flex items-baseline justify-between gap-3"><label class="font-bold text-ink" for="susu-w">For</label><output class="font-display text-[1.4rem] font-bold text-ink" data-weeks-out></output></div><input id="susu-w" class="range mt-3" type="range" min="4" max="104" step="1" value="26" data-weeks></div>
  </div>
  <div class="calc-out" aria-live="polite"><p class="font-semibold text-white/80">You will have saved</p><p class="calc-big mt-2" data-susu-out></p><p class="mt-5 text-[.88rem] text-white/70">Before any interest or fees. Ask your mobile banker about the terms for your account.</p></div>
</div></div>` }

/* ================= LISTINGS ================= */
const listing = (file, g, title, intro, extra = '') => page({ file, title: `${title} | ${NAME}`, description: intro, current: g === 'borrow' ? 'borrow' : 'save', body: `
${titleBand({ title, eb: GROUPS[g].name, trail: [[title]], intro })}
<section class="sec !pt-12"><div class="wrap"><div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${PRODUCTS.filter((p) => p.group === g || (g === 'save' && p.also === 'invest' && false)).map(productCard).join('')}</div></div></section>
${extra}` })

const accRows = ['savings-account', 'current-account', 'susu-savings-account', 'school-child-account', 'sikatso-account'].map((s) => P[s])
listing('accounts', 'save', 'Accounts', 'Five accounts for every kind of saver, from daily susu to a business current account. Compare them below, then start online or at any branch.', `
<section class="pb-[clamp(64px,8vw,112px)]"><div class="wrap">
  ${head('Compare', 'Which account is right for you?')}
  <div class="table-wrap mt-8"><table class="tbl"><caption class="sr-only">Comparison of accounts</caption><thead><tr><th scope="col">Account</th><th scope="col">Best for</th><th scope="col">Opening deposit</th><th scope="col">Interest</th><th scope="col">Withdrawals</th><th scope="col"><span class="sr-only">Link</span></th></tr></thead><tbody>${accRows.map((p) => `<tr><th scope="row">${p.name}</th><td>${p.who.split(':')[0].split('.')[0]}</td><td>${factVal(p.facts['Opening deposit'] ?? p.facts['Minimum amount'] ?? null)}</td><td>${factVal(p.facts['Interest'] ?? p.facts['Return'] ?? null)}</td><td>${factVal(p.facts['Withdrawals'] ?? p.facts['Early withdrawal'] ?? null)}</td><td><a class="link whitespace-nowrap" href="${p.slug}">Details<span class="sr-only"> about ${p.name}</span></a></td></tr>`).join('')}</tbody></table></div>
  <div class="mt-10 flex flex-wrap gap-3">${btn('Open an account', 'open-account')}${btn('See current rates', 'rates', 'btn-line', '')}</div>
</div></section>`)
listing('loans', 'borrow', 'Loans', 'Ten ways to borrow, for salaried workers, traders, groups, farmers and families. Estimate your repayments, then apply online or at any branch.', `
<section class="pb-[clamp(64px,8vw,112px)]"><div class="wrap">${head('Estimate', 'What would my repayments be?')}<div class="mt-8">${loanCalc(null, PRODUCTS.filter((p) => p.calc))}</div></div></section>`)
listing('insurance', 'insure', 'Insurance', 'Cover for your vehicle, your property, yourself and your family, arranged through your bank and paid from your account.', `
<section class="pb-[clamp(64px,8vw,112px)]"><div class="wrap"><p class="callout callout-info">${ic.info}<span>Insurance is provided by our partner insurer, <strong>${cf(confirm_insurer())}</strong>, and arranged by ${BANK.short} as an agent. Policy documents and claims are handled at any branch.</span></p></div></section>`)
function confirm_insurer() { return { v: 'name to be confirmed', confirm: true } }

page({ file: 'loan-calculator', title: `Loan calculator | ${NAME}`, description: 'Estimate monthly repayments for any of our loans before you apply.', current: 'borrow', kind: 'Tool', body: `
${titleBand({ title: 'Loan calculator', eb: 'Loans', trail: [['Loans', 'loans'], ['Loan calculator']], intro: 'Choose a loan, an amount and a period to see an estimate of your monthly repayment.' })}
<section class="sec !pt-12"><div class="wrap">${loanCalc(null, PRODUCTS.filter((p) => p.calc))}<p class="mt-8 max-w-[70ch] text-muted">Estimates use a reducing balance and an example interest rate that you can change. Your actual rate, fees and repayment plan are set out in writing before you sign anything. See <a class="prose-link" href="rates">current rates</a>.</p></div></section>
` })

/* ================= OPEN AN ACCOUNT ================= */
const OPENABLE = ['savings-account', 'current-account', 'susu-savings-account', 'school-child-account', 'sikatso-account'].map((s) => P[s])
page({ file: 'open-account', title: `Open an account | ${NAME}`, description: 'Start opening an account online in four short steps. We call you, then you visit a branch with your Ghana Card to finish.', current: 'save', kind: 'Tool', body: `
${titleBand({ title: 'Open an account', eb: 'Get started', trail: [['Accounts', 'accounts'], ['Open an account']], intro: 'Start here in about three minutes. We call you to confirm, then you finish at your chosen branch with your Ghana Card.' })}
<section class="sec !pt-12"><div class="wrap grid gap-10 lg:grid-cols-[1.4fr_1fr]">
  <form class="form-card" data-wizard data-form="open-account" id="open-form" novalidate>
    <div class="flex items-center justify-between gap-4"><p class="font-bold text-ink" data-step-label aria-live="polite">Step 1 of 4</p><div class="grid w-40 grid-cols-4 gap-1.5" aria-hidden="true">${[0, 1, 2, 3].map(() => '<span class="h-2 rounded bg-mint-2" data-step-bar></span>').join('')}</div></div>
    <fieldset data-step class="mt-6"><legend><h2 class="h-md">Which account?</h2></legend><div class="mt-5 grid gap-3">${OPENABLE.map((p, i) => `<label class="check rounded-2xl bg-white p-4 shadow-[inset_0_0_0_1.5px_var(--color-line)] has-[:checked]:shadow-[inset_0_0_0_2px_var(--color-brand)]"><input type="radio" name="account" value="${p.slug}" data-label="${p.name}" required${i === 0 ? '' : ''}><span><strong class="block text-ink">${p.name}</strong><span class="text-[.95rem] text-muted">${p.short}</span></span></label>`).join('')}</div><div class="mt-6 flex justify-end"><button type="button" class="btn btn-brand" data-next><span>Continue</span>${ic.arrow}</button></div></fieldset>
    <fieldset data-step class="mt-6" hidden><legend><h2 class="h-md">About you</h2></legend><div class="mt-5 grid gap-4 sm:grid-cols-2">
      <label class="field"><span>First name <span class="req">Required</span></span><input class="input" name="first" required autocomplete="given-name"></label>
      <label class="field"><span>Last name <span class="req">Required</span></span><input class="input" name="last" required autocomplete="family-name"></label>
      <label class="field"><span>Phone number <span class="req">Required</span></span><input class="input" type="tel" name="phone" required autocomplete="tel" inputmode="tel" placeholder="024 000 0000"></label>
      <label class="field"><span>Email <span class="opt">(optional)</span></span><input class="input" type="email" name="email" autocomplete="email"></label>
      <label class="field sm:col-span-2"><span>Ghana Card number <span class="opt">(optional, saves time)</span></span><input class="input" name="ghanacard" placeholder="GHA-000000000-0" autocomplete="off" data-hint="gc-hint" aria-describedby="gc-hint"><span class="hint" id="gc-hint">We check it against your card at the branch. Never share your PIN or passwords with anyone.</span></label>
    </div><div class="mt-6 flex justify-between gap-3"><button type="button" class="btn btn-line" data-back>Back</button><button type="button" class="btn btn-brand" data-next><span>Continue</span>${ic.arrow}</button></div></fieldset>
    <fieldset data-step class="mt-6" hidden><legend><h2 class="h-md">Branch and documents</h2></legend><div class="mt-5 grid gap-4 sm:grid-cols-2">
      <label class="field"><span>Branch to finish at <span class="req">Required</span></span><select class="input" name="branch" required>${branchOptions()}</select></label>
      <label class="field"><span>Best time to call</span><select class="input" name="time"><option>Any time</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label>
    </div>
    <div class="mt-6 rounded-2xl bg-mint p-5"><p class="font-bold text-deep">Bring these to the branch</p>${OPENABLE.map((p) => `<ul class="doc-list mt-2" data-docs-for="${p.slug}" hidden>${p.docs.map((d) => `<li>${ic.doc}<span>${d}</span></li>`).join('')}</ul>`).join('')}</div>
    <div class="mt-6 flex justify-between gap-3"><button type="button" class="btn btn-line" data-back>Back</button><button type="button" class="btn btn-brand" data-next><span>Review</span>${ic.arrow}</button></div></fieldset>
    <fieldset data-step class="mt-6" hidden><legend><h2 class="h-md">Check and send</h2></legend><dl class="mt-4" data-review></dl>
      <div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
      <label class="check mt-6"><input type="checkbox" name="consent" required data-msg="Please agree so that we can contact you."><span class="text-[.95rem]">I agree that ${esc(BANK.short)} may use these details to contact me about opening an account, as set out in the <a class="prose-link" href="privacy">privacy notice</a>.</span></label>
      <div class="mt-6 flex justify-between gap-3"><button type="button" class="btn btn-line" data-back>Back</button><button type="submit" class="btn btn-brand"><span>Send</span>${ic.send}</button></div></fieldset>
  </form>
  <div class="success" data-form-ok="open-form" hidden role="status"><p class="flex items-center gap-2 font-display text-[1.4rem] font-bold text-deep"><span class="block size-7 text-brand">${ic.check}</span>We have your details</p><p class="mt-3">We will call you within one working day<span data-confirm></span> to arrange your visit. Your reference is <strong data-ref></strong>.</p><p class="mt-3">${link('See branch opening hours', 'branches')}</p></div>
  <aside class="grid content-start gap-5">
    <div class="rounded-[20px] bg-sand p-6"><h2 class="h-sm">Why we still need to see you</h2><p class="mt-2 text-muted">Bank of Ghana rules require us to check your Ghana Card in person before an account is opened. Starting online means the visit is quick.</p></div>
    <div class="rounded-[20px] bg-sand p-6"><h2 class="h-sm">Prefer to talk?</h2><p class="mt-2 text-muted">Call <a class="prose-link" href="${tel(BANK.phone)}">${BANK.phone}</a> or walk into any branch.</p></div>
  </aside>
</div></section>
` })

/* ================= DIGITAL BANKING ================= */
page({ file: 'digital-banking', title: `Digital banking and U-Connect | ${NAME}`, description: 'Bank from your phone with the U-Connect app, and move money between your account and MTN Mobile Money.', current: 'digital', body: `
${titleBand({ title: 'Banking on your phone', eb: 'Digital banking', trail: [['Digital banking']], intro: 'Use the U-Connect app to check your balance, send money and pay bills at any time. Link your account to MTN Mobile Money to move money in seconds.', img: 'gallery/uconnect-4.jpg', alt: 'Bank staff and guests at the launch of the U-Connect app', aside: `<div class="flex flex-wrap gap-3">${appBadges()}</div>` })}
<section class="sec"><div class="wrap grid gap-12 lg:grid-cols-2">
  <div data-reveal><h2 class="h-lg">What you can do with U-Connect</h2><ul class="ticks mt-6" data-confirm>${['Check your balance and recent transactions', 'Transfer money to other accounts', 'Move money between your account and MTN Mobile Money', 'Buy airtime and pay bills', 'Block your access straight away if your phone is lost'].map((t) => `<li>${ic.check}<span>${t}</span></li>`).join('')}</ul></div>
  <div data-reveal style="--d:80ms"><h2 class="h-lg">How to register</h2><ol class="steps-list mt-6">${[['Have an account with us', 'Any of our accounts works.'], ['Download U-Connect', 'From the App Store or Google Play. Only use these official stores.'], ['Register at your branch', 'Bring your Ghana Card and the phone number you use. Staff activate your access.'], ['Set your PIN', 'Choose a PIN only you know. We will never ask you for it.']].map(([t, d]) => `<li><strong class="block text-ink">${t}</strong><span class="text-muted">${d}</span></li>`).join('')}</ol></div>
</div></section>
<section class="pb-[clamp(64px,8vw,112px)]"><div class="wrap grid gap-6 md:grid-cols-2">
  <div class="rounded-[24px] bg-sun-soft p-8" data-reveal><span class="card-ic !bg-sun !text-ink">${ic.mobile}</span><h2 class="h-md mt-5">MTN Mobile Money</h2><p class="mt-3 text-body">We are an MTN Mobile Money super merchant. Link your account and wallet at any branch, then move money both ways whenever you need to.</p></div>
  <div class="rounded-[24px] bg-mint p-8" data-reveal style="--d:80ms"><span class="card-ic">${ic.shield}</span><h2 class="h-md mt-5">Stay safe on your phone</h2><p class="mt-3 text-body">Never share your PIN or the codes we send you. Lock your phone, and tell us at once if it is lost or stolen.</p><p class="mt-4">${link('Security and fraud advice', 'security')}</p></div>
</div></section>
` })

await import('./pages.mjs')
