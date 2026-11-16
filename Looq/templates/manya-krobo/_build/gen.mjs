// node templates/manya-krobo/_build/gen.mjs: writes every page of the bank template, the favicon and the search index
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { T, esc, val, cf, tel, wa, NAME, mark, img, btn, link, crumbs, head, page, titleBand, appBadges, INDEX, ic } from './lib.mjs'
import { cowrie } from './art.mjs'
import { BANK, KEY_FACTS, GROUPS, PRODUCTS, BRANCHES, REGIONS } from './bank.mjs'
import { NEWS } from './content.mjs'
import { P, factVal, groupPage, hoursSpec, openDot, branchOptions, productCard, newsCard, fmtDate, dateTag, NEWS_SORTED, applyForm, loanCalc } from './parts.mjs'

writeFileSync(join(T, 'assets/images/favicon.svg'), mark('').replace('<svg class=""', '<svg xmlns="http://www.w3.org/2000/svg" style="color:#21974e"').replace(' aria-hidden="true" focusable="false"', ''))

/* ================= HOME ================= */
const latest = NEWS_SORTED.filter((n) => val(n.date))[0]
const tabs = ['save', 'borrow', 'insure', 'invest']
page({ file: 'index', title: `${NAME} | Your family banking centre since ${BANK.founded}`, description: `Savings, susu, loans and insurance from ${BANK.short}, the community bank founded by the Krobo Women Association in 1978. 12 locations in the Krobo area and Greater Accra.`, kind: 'Home', short: 'Home', body: `
<div class="notice-bar" data-notice="${latest.slug}"><div class="wrap flex items-center justify-between gap-4 py-2.5"><p class="flex flex-wrap items-center gap-x-3 gap-y-1"><span class="tag-date">${fmtDate(val(latest.date))}</span><span>${latest.title}.</span><a href="news-${latest.slug}">Read the notice</a></p><button type="button" class="grid size-10 flex-none place-items-center rounded-lg hover:bg-white/60" data-notice-close aria-label="Dismiss this notice"><span class="block size-5">${ic.close}</span></button></div></div>
<section class="hero on-dark">
  <span class="hero-shell">${cowrie}</span>
  <div class="wrap grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:py-20">
    <div class="relative z-[1] order-2 lg:order-1">
      <p class="eyebrow hero-in">Since ${BANK.founded} · Krobo area and Greater Accra</p>
      <h1 class="h-xl mt-4 hero-in" style="--i:1">Your family <span class="text-sun">banking centre</span></h1>
      <p class="lede mt-5 max-w-[48ch] hero-in" style="--i:2">Founded by the Krobo Women Association in ${BANK.founded}, we help traders, farmers, workers and families save, borrow and plan, at 12 places across the Krobo area and Greater Accra.</p>
      <div class="mt-8 flex flex-wrap gap-3 hero-in" style="--i:3">${btn('Open an account', 'open-account', 'btn-sun')}${btn('Explore loans', 'loans', 'btn-line', '')}</div>
      <ul class="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[.95rem] text-white/80 hero-in" style="--i:4"><li class="flex items-center gap-2"><span class="block size-5 text-sun">${ic.check}</span>5th rural bank licensed in Ghana</li><li class="flex items-center gap-2"><span class="block size-5 text-sun">${ic.check}</span>Ghana Club 100 member</li><li class="flex items-center gap-2"><span class="block size-5 text-sun">${ic.check}</span>Every branch networked</li></ul>
    </div>
    <div class="relative order-1 lg:order-2 hero-in" style="--i:1">
      <div class="overflow-hidden rounded-[28px] lg:rounded-[200px_28px_28px_200px]">${img('hero-staff.jpg', 'Manya Krobo Rural Bank directors and managers in the bank\'s green and white cloth at the 43rd Annual General Meeting', 'class="aspect-[4/3] w-full object-cover object-[50%_30%] lg:aspect-[5/5]" fetchpriority="high" loading="eager"')}</div>
      <a href="salary-loans" class="absolute -bottom-5 left-4 right-4 hidden items-center sm:flex gap-4 rounded-2xl bg-white p-4 text-ink shadow-[0_20px_40px_-20px_rgb(0_0_0/.5)] transition-transform hover:-translate-y-1 sm:left-auto sm:right-6 sm:max-w-[330px] lg:-left-8 lg:right-auto"><span class="card-ic flex-none !bg-sun-soft !text-[#7a5a00]">${ic.wallet}</span><span><strong class="block font-display text-[1.1rem]">Salary loans up to 60 months</strong><span class="text-[.92rem] text-muted">For GES, GHS, VRA, VREL and Golden Exotics staff</span></span></a>
    </div>
  </div>
</section>
<section class="relative z-[2] pt-14 md:pt-16" aria-label="Quick actions"><div class="wrap"><div class="quick">
  ${[['open-account', 'piggy', 'Open an account', 'Start online in 3 minutes'], ['loans', 'coins', 'Get a loan', 'Salary, business, group and more'], ['branches', 'pin', 'Find a branch', '12 places to bank'], [tel(BANK.phone), 'phone', 'Call us', BANK.phone]].map(([h, i, t, s]) => `<a href="${h}"><span class="quick-ic">${ic[i]}</span><span>${t}<small>${s}</small></span></a>`).join('')}
</div></div></section>

<section class="sec"><div class="wrap">
  ${head('What we offer', 'Banking for every family, trade and season', 'Choose what you want to do. Every product page tells you who it is for, what you need and how to start.')}
  <div class="tabs mt-8" role="tablist" aria-label="Products">${tabs.map((g, i) => `<button type="button" role="tab" id="t-${g}" aria-controls="p-${g}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}">${GROUPS[g].name}</button>`).join('')}</div>
  ${tabs.map((g, i) => `<div role="tabpanel" id="p-${g}" aria-labelledby="t-${g}" class="mt-8"${i ? ' hidden' : ''}><div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${PRODUCTS.filter((p) => p.group === g || p.also === g).slice(0, 6).map(productCard).join('')}</div><p class="mt-6">${link(`All ${GROUPS[g].title.toLowerCase()}`, groupPage[g])}</p></div>`).join('')}
</div></div></section>

<section class="sec bg-sand"><div class="wrap grid items-center gap-12 lg:grid-cols-2">
  <div class="relative" data-reveal>${img('salary-loan.jpg', 'A teacher, a health worker and an engineer smiling together, holding loan documents', 'class="aspect-[4/3] w-full rounded-[24px] object-cover"')}<p class="absolute left-4 top-4 rounded-xl bg-sun px-4 py-2 font-display text-[1.6rem] font-extrabold leading-none text-ink">60<span class="block text-[.8rem] font-bold">months</span></p></div>
  <div data-reveal style="--d:80ms">
    <p class="eyebrow">Salary loans</p>
    <h2 class="h-lg mt-3">Borrow more. Repay over up to 60 months.</h2>
    <p class="lede mt-4 text-muted">For staff of GES, GHS, VRA, VREL and Golden Exotics who take their salary at ${BANK.short}. Small monthly repayments leave more of your take-home pay.</p>
    <ul class="ticks mt-6">${['Top up once you have repaid half of your current loan', 'You can still use a salary overdraft', 'Apply at Abanse, Somanya, Kpong, Akuse, Madina, Ashiyie or Ashaiman'].map((t) => `<li>${ic.check}<span>${t}</span></li>`).join('')}</ul>
    <div class="mt-8 flex flex-wrap gap-3">${btn('See salary loans', 'salary-loans')}${btn('Estimate repayments', 'loan-calculator', 'btn-line', ic.calc)}</div>
  </div>
</div></section>

<section class="sec"><div class="wrap grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
  <div data-reveal>
    <p class="eyebrow">Our story</p>
    <h2 class="h-lg mt-3">Started by women, owned by the community</h2>
    <p class="lede mt-4 text-muted">In ${BANK.founded} the Krobo Women Association founded a community bank at Abanse, in the Manya Krobo district of the Eastern Region. It was the fifth rural bank licensed in Ghana.</p>
    <p class="mt-4 text-muted">Today we lend to farmers, fishermen, traders and small businesses, and much of our lending still goes to women. Our profits go back into the community, through scholarships, health centres and schools.</p>
    <div class="mt-7">${link('Read our story', 'about')}</div>
  </div>
  <div data-reveal style="--d:80ms">
    <dl class="grid gap-4 sm:grid-cols-2">${KEY_FACTS.map(([k, v]) => `<div class="rounded-2xl bg-mint p-6"><dt class="sr-only">${v}</dt><dd class="font-display text-[2rem] font-extrabold leading-none text-deep">${k}</dd><p class="mt-2 text-[.97rem] text-body">${v}</p></div>`).join('')}</dl>
  </div>
</div></section>

<section class="on-dark relative overflow-hidden bg-deep"><div class="wrap grid items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.2fr_1fr]">
  <div data-reveal>
    <p class="eyebrow">Digital banking</p>
    <h2 class="h-lg mt-3">Your bank in your pocket with U-Connect</h2>
    <p class="lede mt-4">Check your balance, send money and pay bills from your phone, day or night. As an MTN Mobile Money super merchant, we also let you move money between your account and your MoMo wallet.</p>
    <div class="mt-7 flex flex-wrap gap-3">${appBadges()}</div>
    <p class="mt-5">${link('How to register', 'digital-banking').replace('class="link"', 'class="link !text-sun"')}</p>
  </div>
  <div class="relative hidden lg:block" data-reveal style="--d:80ms">${img('gallery/uconnect-2.jpg', 'Staff of the ARB Apex Bank and partner banks at the launch of U-Connect', 'class="aspect-[4/3] w-full rounded-[24px] object-cover"')}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="flex flex-wrap items-end justify-between gap-6">${head('Branches', '12 places to bank, all networked', 'Deposit and withdraw at any branch or mobilisation centre, whichever is closest to you.')}<form action="branches" class="flex w-full max-w-[420px] gap-2" data-reveal role="search"><label class="sr-only" for="town">Find a branch by town</label><input id="town" name="town" class="input" placeholder="Your town, e.g. Somanya"><button class="btn btn-brand" type="submit">Find</button></form></div>
  <div class="mt-10 grid gap-6 lg:grid-cols-2">${Object.entries(REGIONS).map(([k, r]) => `<div class="rounded-[20px] bg-white p-6 shadow-[0_0_0_1px_var(--color-line)]" data-reveal><h3 class="h-sm">${r}</h3><ul class="mt-4 grid gap-1 sm:grid-cols-2">${BRANCHES.filter((b) => b.region === k).map((b) => `<li><a class="flex items-center gap-2 rounded-lg px-2 py-2 font-semibold text-ink hover:bg-mint" href="branch-${b.slug}"><span class="block size-4 flex-none text-brand">${ic.pin}</span>${b.name.replace(' Mobilisation Centre', ' Centre')}</a></li>`).join('')}</ul></div>`).join('')}</div>
</div></section>

<section class="sec bg-sand"><div class="wrap">
  <div class="flex flex-wrap items-end justify-between gap-6">${head('Latest from the bank', 'Notices and news')}<div data-reveal>${link('All news and notices', 'news')}</div></div>
  <div class="mt-10 grid gap-6 md:grid-cols-3">${NEWS_SORTED.slice(0, 3).map(newsCard).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="grid gap-6 rounded-[28px] bg-mint p-8 md:grid-cols-[1.2fr_1fr] md:p-12" data-reveal>
    <div><p class="eyebrow">Banking safely</p><h2 class="h-md mt-3">We will never ask for your PIN</h2><p class="mt-3 text-body">Not by phone, SMS, WhatsApp or email. If someone asks for your PIN, password or a code sent to your phone, it is a fraud. Hang up and call us on <a class="prose-link" href="${tel(BANK.phone)}">${BANK.phone}</a>.</p></div>
    <div class="flex flex-wrap items-center gap-3 md:justify-end">${btn('How to stay safe', 'security', 'btn-deep', ic.shield)}${btn('Report a problem', 'complaints', 'btn-line', '')}</div>
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
