// Shared building blocks used by gen.mjs and pages.mjs
import { esc, val, cf, tel, img, btn, ic } from './lib.mjs'
import { cowrie } from './art.mjs'
import { BANK, PRODUCTS, BRANCHES, REGIONS } from './bank.mjs'
import { NEWS } from './content.mjs'

export const P = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]))
export const groupPage = { save: 'accounts', invest: 'shares', insure: 'insurance', borrow: 'loans' }
export const hoursSpec = (b) => { const h = val(BANK.hours); return `${h.weekdays.join('-')}|${h.saturday ? h.saturday.join('-') : 'closed'}` }
export const openDot = (b) => `<p class="open-dot" data-hours="${hoursSpec(b)}"><i></i><span>Monday to Friday, ${val(BANK.hours).weekdays.join(' to ')}</span></p>`
export const branchOptions = (sel = '') => `<option value="">Choose a branch</option>${Object.entries(REGIONS).map(([k, r]) => `<optgroup label="${r}">${BRANCHES.filter((b) => b.region === k).map((b) => `<option${b.slug === sel ? ' selected' : ''}>${b.name}</option>`).join('')}</optgroup>`).join('')}`
export const productCard = (p, i = 0) => `<div data-reveal style="--d:${(i % 3) * 80}ms"><article class="card p-6 md:p-7">
  <div class="flex items-start justify-between gap-4"><span class="card-ic">${ic[p.icon]}</span><span class="card-go">${ic.arrow}</span></div>
  <h3 class="h-sm mt-10"><a class="stretched" href="${p.slug}">${p.name}<span class="sr-only">: learn more</span></a></h3>
  <p class="mt-2 flex-1 text-[.95rem] text-muted">${p.short}</p>
  ${p.seasonal ? `<p class="mt-4"><span class="pill pill-sun">${ic.cal}Seasonal</span></p>` : ''}
</article></div>`
const CAT = { notice: 'Notice', community: 'Community', network: 'New branch', awards: 'Award', report: 'Report' }
export const newsCard = (n, i = 0) => `<div data-cat="${n.cat}" data-reveal style="--d:${(i % 3) * 80}ms"><article class="card">
  <div class="card-img">${n.img ? img(n.img, n.alt || '') : `<div class="grid h-full place-items-center bg-[radial-gradient(circle_at_30%_20%,var(--color-mint-2),var(--color-mint))] text-brand/30"><span class="block size-24">${cowrie}</span></div>`}<span class="pill absolute left-3 top-3 !bg-white/90 backdrop-blur">${CAT[n.cat]}</span></div>
  <div class="flex flex-1 flex-col p-6"><p class="text-[.85rem]">${dateTag(n)}</p><h3 class="h-sm mt-2"><a class="stretched" href="news-${n.slug}">${n.title}</a></h3><p class="mt-2 flex-1 text-[.94rem] text-muted">${n.sum}</p><p class="mt-5 flex items-center justify-between text-[.9rem] font-semibold text-ink">Read more<span class="card-go">${ic.arrow}</span></p></div>
</article></div>`
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const fmtDate = (iso) => { const d = new Date(iso + 'T12:00:00Z'); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}` }
export const dateTag = (n) => { const d = val(n.date); const conf = n.date && typeof n.date === 'object'; const txt = d ? fmtDate(d) : val(n.year); const iso = d || val(n.year); return `<time datetime="${iso}" class="text-muted"${conf || (n.year && typeof n.year === 'object') ? ' data-confirm' : ''}>${txt}</time>` }
const sortKey = (n) => val(n.date) || (val(n.year) + '-00-00')
export const NEWS_SORTED = [...NEWS].sort((a, b) => sortKey(b).localeCompare(sortKey(a)))

export const factVal = (v) => v == null ? `<span data-confirm class="font-sans text-[1rem] font-semibold text-muted">Ask any branch</span>` : cf(v)
export const formFields = (p) => {
  const loan = p.group === 'borrow', ins = p.group === 'insure'
  return `${loan ? `<div class="grid items-end gap-4 sm:grid-cols-2"><label class="field"><span>Amount <span class="opt">(optional)</span></span><span class="relative block"><span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[.95rem] font-semibold text-muted" aria-hidden="true">GH₵</span><input class="input !pl-[3.4rem]" name="amount" inputmode="numeric" placeholder="5,000" aria-label="Amount in Ghana cedis (optional)"></span></label><label class="field"><span>Months <span class="opt">(optional)</span></span><input class="input" name="months" inputmode="numeric" placeholder="e.g. 24" aria-label="Repayment period in months (optional)"></label></div>` : ''}
  ${p.slug === 'salary-loans' ? `<label class="field"><span>Employer <span class="req">Required</span></span><select class="input" name="employer" required><option value="">Choose your employer</option><option>Ghana Education Service (GES)</option><option>Ghana Health Service (GHS)</option><option>Volta River Authority (VRA)</option><option>VRA Resettlement Trust (VREL)</option><option>Golden Exotics</option><option>Other</option></select></label>` : ''}
  ${ins ? `<label class="field"><span>What would you like to cover? <span class="opt">(optional)</span></span><input class="input" name="cover" placeholder="${p.slug === 'motor-insurance' ? 'e.g. Toyota Corolla, taxi' : 'Tell us briefly'}"></label>` : ''}`
}
export const applyForm = (p, id = 'apply-form') => `<div class="side-card" id="apply">
  <h2 class="h-md">${p.group === 'borrow' ? 'Apply for' : p.group === 'insure' ? 'Get a quote for' : p.slug === 'shares' ? 'Buy' : 'Open'} ${p.name.replace(/^(.)/, (m) => m.toLowerCase()).replace(/^shares$/, 'shares')}</h2>
  <p class="mt-2 text-muted">Leave your details and a member of staff will call you within one working day<span data-confirm></span>. Nothing is decided until we talk.</p>
  <form class="mt-5 grid gap-4" id="${id}" data-form="${p.slug}" novalidate>
    <label class="field"><span>Full name <span class="req">Required</span></span><input class="input" name="name" required autocomplete="name"></label>
    <label class="field"><span>Phone number <span class="req">Required</span></span><input class="input" type="tel" name="phone" required autocomplete="tel" inputmode="tel" placeholder="024 000 0000"></label>
    <label class="field"><span>Email <span class="opt">(optional)</span></span><input class="input" type="email" name="email" autocomplete="email"></label>
    ${formFields(p)}
    <label class="field"><span>Nearest branch <span class="req">Required</span></span><select class="input" name="branch" required>${branchOptions()}</select></label>
    <label class="field"><span>Best time to call <span class="opt">(optional)</span></span><select class="input" name="time"><option>Any time</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label>
    <div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
    <label class="check"><input type="checkbox" name="consent" required data-msg="Please agree so that we can contact you."><span class="text-[.95rem]">I agree that ${esc(BANK.short)} may use these details to contact me about this request, as set out in the <a class="prose-link" href="privacy">privacy notice</a>.</span></label>
    <button class="btn btn-brand" type="submit"><span>Send my request</span>${ic.arrow}</button>
  </form>
  <div class="success mt-5" data-form-ok="${id}" hidden role="status"><p class="flex items-center gap-2 font-display text-[1.25rem] font-bold text-deep"><span class="block size-6 text-brand">${ic.check}</span>Request received</p><p class="mt-2">Thank you. We will call you within one working day<span data-confirm></span>. Your reference is <strong data-ref></strong>.</p><p class="mt-3 text-[.95rem]">In a hurry? Call <a class="prose-link" href="${tel(BANK.phone)}">${BANK.phone}</a>.</p></div>
</div>`

export const loanCalc = (p, products = null) => { const c = p ? p.calc : { min: 500, max: 100000, months: 60 }; const start = Math.round((c.min + c.max) / 4 / 100) * 100; return `<div class="grid gap-6 lg:grid-cols-[1.25fr_1fr]" data-loan-calc>
  <div class="form-card grid gap-7">
    ${products ? `<label class="field"><span>Loan</span><select class="input" data-calc-product>${products.map((x) => `<option value="${x.slug}" data-min="${x.calc.min}" data-max="${x.calc.max}" data-months="${x.calc.months}"${x.slug === 'salary-loans' ? ' selected' : ''}>${x.name}</option>`).join('')}</select></label>` : ''}
    <div><div class="flex items-baseline justify-between gap-3"><label class="font-bold text-ink" for="amt-${p ? p.slug : 'all'}">Amount</label><output class="font-display text-[1.4rem] font-bold text-ink" data-amount-out></output></div><input id="amt-${p ? p.slug : 'all'}" class="range mt-3" type="range" min="${c.min}" max="${c.max}" step="100" value="${start}" data-amount></div>
    <div><div class="flex items-baseline justify-between gap-3"><label class="font-bold text-ink" for="mon-${p ? p.slug : 'all'}">Repay over</label><output class="font-display text-[1.4rem] font-bold text-ink" data-months-out></output></div><input id="mon-${p ? p.slug : 'all'}" class="range mt-3" type="range" min="1" max="${c.months}" step="1" value="${Math.min(12, c.months)}" data-months></div>
    <label class="field"><span>Interest rate a year (%)</span><input class="input max-w-[200px]" type="number" min="0" max="99" step="0.5" value="30" data-rate data-hint="rate-hint-${p ? p.slug : 'all'}" aria-describedby="rate-hint-${p ? p.slug : 'all'}"><span class="hint" id="rate-hint-${p ? p.slug : 'all'}">An example rate for this estimate. Your actual rate depends on the loan and is confirmed when you apply.</span></label>
  </div>
  <div class="calc-out flex flex-col" aria-live="polite">
    <p class="flex items-center gap-2 text-[.9rem] font-medium text-white/70"><span class="size-2 rounded-full bg-glow shadow-[0_0_10px_var(--color-glow)]"></span>Estimated monthly repayment</p>
    <p class="calc-big mt-2" data-pay-out></p>
    <dl class="mt-6 grid gap-2 border-t border-white/20 pt-5 text-[.97rem]"><div class="flex justify-between gap-4"><dt class="text-white/75">Total repaid</dt><dd class="font-bold" data-total-out></dd></div><div class="flex justify-between gap-4"><dt class="text-white/75">Total interest</dt><dd class="font-bold" data-interest-out></dd></div></dl>
    <p class="mt-5 flex-1 text-[.88rem] text-white/70">An estimate only, using a reducing balance. It is not a loan offer. Fees and your final rate are confirmed when you apply.</p>
    <a class="btn btn-sun mt-6" href="${p ? '#apply' : 'salary-loans'}" data-calc-apply data-base="${p ? '' : 'salary-loans'}"><span>Apply now</span>${ic.arrow}</a>
  </div>
</div>` }

