/* Looq reference main.js — the shared behaviour contract.
   Copy into templates/<slug>/main.js and keep the features the template uses; delete the rest.
   Every feature finds its elements by a data-* hook and does nothing when they are missing,
   so one file serves every page. No libraries. Respects prefers-reduced-motion.

   Hooks
   data-year                          current year
   data-header                        gets .is-stuck after scrolling (and .menu-open while the menu is open)
   data-menu-button + aria-controls   opens/closes the [data-menu-panel]; Escape closes; focus returns
   data-reveal                        fades in when scrolled into view (only below-the-fold elements start hidden)
   data-count="1234"                  counts up once when visible (keep the final number as the text)
   data-nav                           in-page nav link that gets aria-current="true" for the section in view
   data-faq-group                     on a wrapper of <details>: only one open at a time
   data-form                          validated enquiry form (see below)
   data-service="value"               clicking it preselects [data-service-select] in the form
   data-inline-form                   single-field form (lead magnet); message goes in [data-inline-msg]
   data-action-bar                    mobile bar that hides while [data-action-target] (default #contact) is on screen
   data-open-dialog="id"              opens <dialog id="id">; [data-close-dialog] or the backdrop closes it
   data-hours='{"1":["08:00","17:00"]}'  shows "Open now"/"Closed" in Africa/Accra time (0 = Sunday)

   Forms
   <form data-form novalidate> with fields as <div class="field"><label for="x">…</label><input id="x" class="input" required>
   <p class="err" id="x-error" hidden>How to fix it</p></div>. Required fields, email format and phone length (9+ digits)
   are checked on submit; errors set aria-invalid and aria-describedby and show the .err. A hidden honeypot
   (name="website") silently drops bots. On success the form is hidden and [data-form-success] is shown and focused;
   [data-success-name] gets ", Firstname". Connect a real endpoint (Formspree, Basin, your own) before launch:
   set the form's action and set data-endpoint="ajax" to post with fetch, or leave it to show the demo success. */
(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const $ = (selector, root = document) => root.querySelector(selector)
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector))

  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Header state
  const header = $('[data-header]')
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  }

  // Mobile menu
  const menuButton = $('[data-menu-button]')
  const menuPanel = menuButton && document.getElementById(menuButton.getAttribute('aria-controls'))
  if (menuButton && menuPanel) {
    let open = false
    const setMenu = (next, returnFocus = false) => {
      open = next
      menuPanel.classList.toggle('is-open', open)
      menuPanel.inert = !open
      header?.classList.toggle('menu-open', open)
      document.body.classList.toggle('menu-open', open)
      menuButton.setAttribute('aria-expanded', String(open))
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
      if (open) window.setTimeout(() => $('a, button', menuPanel)?.focus(), 60)
      else if (returnFocus) menuButton.focus()
    }
    menuPanel.inert = true
    menuButton.addEventListener('click', () => setMenu(!open))
    $$('a', menuPanel).forEach((a) => a.addEventListener('click', () => setMenu(false)))
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) setMenu(false, true) })
    window.addEventListener('resize', () => { if (open && window.innerWidth >= 1024) setMenu(false) })
  }

  // Scroll reveals (below the fold only, so content never starts hidden without JS)
  const reveals = $$('[data-reveal]')
  if (reveals.length && !reduceMotion && 'IntersectionObserver' in window) {
    const fold = window.innerHeight * 0.92
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.remove('reveal-pending')
      io.unobserve(entry.target)
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top > fold) { el.classList.add('reveal-pending'); io.observe(el) }
    })
  }

  // Counters
  const counters = $$('[data-count]')
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    const run = (el) => {
      const target = Number(el.dataset.count)
      if (!Number.isFinite(target)) return
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / 1300, 1)
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-GB')
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target) }
    }), { threshold: 0.6 })
    counters.forEach((el) => io.observe(el))
  }

  // In-page nav highlighting
  const navLinks = $$('[data-nav]')
  if (navLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(navLinks.map((a) => [a.hash.slice(1), a]))
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      const link = byId.get(entry.target.id)
      if (!link) return
      if (entry.isIntersecting) { navLinks.forEach((a) => a.removeAttribute('aria-current')); link.setAttribute('aria-current', 'true') }
      else link.removeAttribute('aria-current')
    }), { rootMargin: '-45% 0px -50% 0px' })
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s) })
  }

  // FAQ: one open at a time within a group
  $$('[data-faq-group]').forEach((group) => {
    const items = $$('details', group)
    items.forEach((d) => d.addEventListener('toggle', () => { if (d.open) items.forEach((o) => { if (o !== d) o.open = false }) }))
  })

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  const fieldValid = (input) => {
    const value = input.value.trim()
    if (input.type === 'checkbox') return !input.required || input.checked
    if (input.required && !value) return false
    if (input.type === 'email' && value && !emailPattern.test(value)) return false
    if (input.type === 'tel' && value && value.replace(/\D/g, '').length < 9) return false
    return true
  }
  const showState = (input, valid) => {
    const err = document.getElementById(`${input.id}-error`)
    if (valid) { input.removeAttribute('aria-invalid'); if (err) input.removeAttribute('aria-describedby') }
    else { input.setAttribute('aria-invalid', 'true'); if (err) input.setAttribute('aria-describedby', err.id) }
    if (err) err.hidden = valid
  }

  // Service preselect
  const serviceSelect = $('[data-service-select]')
  if (serviceSelect) {
    $$('[data-service]').forEach((el) => el.addEventListener('click', () => {
      serviceSelect.value = el.dataset.service
      showState(serviceSelect, true)
    }))
  }

  // Enquiry forms
  $$('[data-form]').forEach((form) => {
    const msg = $('[data-form-msg]', form)
    const success = form.parentElement && $('[data-form-success]', form.parentElement)
    const checked = $$('[required], input[type="email"], input[type="tel"]', form)
    checked.forEach((input) => {
      input.addEventListener('blur', () => { if (input.value.trim()) showState(input, fieldValid(input)) })
      const recheck = () => { if (input.getAttribute('aria-invalid') === 'true' && fieldValid(input)) showState(input, true) }
      input.addEventListener('input', recheck)
      input.addEventListener('change', recheck)
    })
    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      if (form.elements.website && form.elements.website.value) return
      let first = null
      checked.forEach((input) => { const ok = fieldValid(input); showState(input, ok); if (!ok && !first) first = input })
      if (first) { if (msg) msg.hidden = false; first.focus(); return }
      if (msg) msg.hidden = true
      const submit = $('[type="submit"]', form)
      submit?.setAttribute('aria-busy', 'true')
      submit && (submit.disabled = true)
      try {
        if (form.dataset.endpoint === 'ajax' && form.action) {
          const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
          if (!res.ok) throw new Error(String(res.status))
        }
        const name = form.elements.name?.value.trim().split(/\s+/)[0]
        const slot = success && $('[data-success-name]', success)
        if (slot && name) slot.textContent = `, ${name}`
        if (success) { form.hidden = true; success.hidden = false; success.focus() }
      } catch (err) {
        if (msg) { msg.textContent = 'Sorry, that didn’t send. Please try again, or call or WhatsApp us.'; msg.hidden = false }
      } finally {
        submit?.removeAttribute('aria-busy')
        submit && (submit.disabled = false)
      }
    })
  })

  // Single-field forms (lead magnet, newsletter)
  $$('[data-inline-form]').forEach((form) => {
    const input = $('input', form)
    const out = $('[data-inline-msg]', form)
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const ok = fieldValid(input) && !!input.value.trim()
      input.setAttribute('aria-invalid', String(!ok))
      if (out) out.textContent = ok ? (form.dataset.success || 'Thank you. Check your inbox.') : 'Please enter a valid email address.'
      if (ok) input.value = ''
      else input.focus()
    })
  })

  // Mobile action bar steps aside near the form
  const bar = $('[data-action-bar]')
  const barTarget = bar && $(bar.dataset.actionTarget || '#contact')
  if (bar && barTarget && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => bar.classList.toggle('is-hidden', entry.isIntersecting), { threshold: 0.15 }).observe(barTarget)
  }

  // Dialogs
  $$('[data-open-dialog]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.openDialog)
    if (dialog && typeof dialog.showModal === 'function') trigger.addEventListener('click', () => dialog.showModal())
  })
  $$('dialog').forEach((dialog) => {
    $$('[data-close-dialog]', dialog).forEach((b) => b.addEventListener('click', () => dialog.close()))
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close() })
  })

  // Open now / closed (Ghana time, GMT all year)
  $$('[data-hours]').forEach((el) => {
    let hours
    try { hours = JSON.parse(el.dataset.hours) } catch (e) { return }
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Accra', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date())
    const get = (t) => parts.find((p) => p.type === t)?.value
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
    const now = `${get('hour')}:${get('minute')}`
    const today = hours[String(day)]
    const open = !!today && now >= today[0] && now < today[1]
    el.dataset.open = String(open)
    el.textContent = open ? `Open now · until ${today[1]}` : 'Closed now'
  })
})();

/* Dawuni Grains: live northern season, buyer/farmer tabs, season calculator. */
;(() => {
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]

  // Today's date in Accra.
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Accra', year: 'numeric', month: 'numeric', day: 'numeric' })
    .formatToParts(new Date()).map((p) => [p.type, Number(p.value)]))
  const today = new Date(Date.UTC(parts.year, parts.month - 1, parts.day))

  // ---- Season: one rainy season in the north ----
  const phases = [
    { id: 'dry', from: 0, to: 3, name: 'dry season, selling from store' },
    { id: 'prep', from: 3, to: 5, name: 'land preparation' },
    { id: 'plant', from: 5, to: 7, name: 'planting' },
    { id: 'grow', from: 7, to: 9, name: 'the growing season' },
    { id: 'harvest', from: 9, to: 12, name: 'harvest and buying' },
  ]
  const daysInMonth = new Date(Date.UTC(parts.year, parts.month, 0)).getUTCDate()
  const at = (parts.month - 1) + (parts.day - 1) / daysInMonth
  const phase = phases.find((p) => at >= p.from && at < p.to) || phases[0]
  // ISO week number
  const d = new Date(today)
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const week = Math.ceil(((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7)

  const weekEl = $('[data-season-week]'); if (weekEl) weekEl.textContent = 'Week ' + week
  const nameEl = $('[data-season-name]'); if (nameEl) nameEl.textContent = phase.name
  const now = $('[data-season-now]'); if (now) now.style.setProperty('--at', at.toFixed(2))
  $$('.track-bar .ph').forEach((el) => el.classList.toggle('is-current', el.classList.contains('ph-' + phase.id)))
  $$('[data-phase-text]').forEach((el) => { el.hidden = el.dataset.phase !== phase.id })

  // ---- Tabs: buyer / farmer forms ----
  const tabs = $$('[role="tab"][data-tab]')
  const selectTab = (name, focus) => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === name
      t.setAttribute('aria-selected', String(on))
      t.tabIndex = on ? 0 : -1
      const panel = document.getElementById(t.getAttribute('aria-controls'))
      if (panel) panel.hidden = !on
      if (on && focus) t.focus()
    })
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t.dataset.tab))
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      e.preventDefault()
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]
      selectTab(next.dataset.tab, true)
    })
  })
  $$('[data-open-tab]').forEach((a) => a.addEventListener('click', () => selectTab(a.dataset.openTab)))

  // ---- Season calculator ----
  // Per-acre input package (GH₵), expected yield in 100 kg bags, and this week's price per bag.
  // Illustrative figures: replace with the client's real package prices every season.
  const crops = {
    maize: { pack: 2180, yield: [12, 16], price: 520 },
    soya: { pack: 1520, yield: [7, 10], price: 780 },
    sorghum: { pack: 1515, yield: [8, 12], price: 560 },
  }
  const CHARGE = 0.10
  const calc = $('[data-calc]')
  if (calc) {
    const acresIn = $('#calc-acres', calc)
    const out = (k) => $('[data-out="' + k + '"]', calc)
    const num = (n) => Math.round(n).toLocaleString('en-GB')
    const halfUp = (n) => Math.ceil(n * 2) / 2
    const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1))
    const clampAcres = () => {
      let a = Math.round(Number(acresIn.value))
      if (!Number.isFinite(a) || a < 1) a = 1
      if (a > 20) a = 20
      return a
    }
    const bag = (cls) => '<span class="bag ' + cls + '"></span>'

    const render = () => {
      const crop = crops[$('input[name="calc-crop"]:checked', calc).value]
      const acres = clampAcres()
      const pack = crop.pack * acres
      const charge = pack * CHARGE
      const repay = halfUp((pack + charge) / crop.price)
      const hMin = crop.yield[0] * acres
      const hMax = crop.yield[1] * acres
      const kMin = Math.max(0, hMin - repay)
      const kMax = Math.max(0, hMax - repay)
      out('package').textContent = 'GH₵ ' + num(pack)
      out('charge').textContent = 'GH₵ ' + num(charge)
      out('repay').textContent = fmt(repay)
      out('harvest').textContent = hMin + '–' + hMax
      out('keep').textContent = fmt(kMin) + '–' + fmt(kMax)
      out('worth').textContent = 'GH₵ ' + num(kMin * crop.price) + '–' + num(kMax * crop.price)

      // One square per bag, or per few bags on bigger farms.
      const unit = Math.max(1, Math.ceil(hMax / 64))
      const nRepay = Math.ceil(repay / unit)
      const nKeep = Math.max(0, Math.floor(hMin / unit) - nRepay)
      const nMaybe = Math.max(0, Math.ceil(hMax / unit) - nRepay - nKeep)
      out('bags').innerHTML = '<div class="bag-grid">' + bag('bag-repay').repeat(nRepay) + bag('bag-keep').repeat(nKeep) + bag('bag-maybe').repeat(nMaybe) + '</div>' +
        '<p class="bag-key"><span>' + bag('bag-repay') + 'Repayment</span><span>' + bag('bag-keep') + 'Yours</span><span>' + bag('bag-maybe') + 'Yours in a good year</span>' +
        (unit > 1 ? '<span>Each = ' + unit + ' bags</span>' : '') + '</p>'
    }

    $$('input[name="calc-crop"]', calc).forEach((r) => r.addEventListener('change', render))
    acresIn.addEventListener('input', () => { if (acresIn.value !== '') render() })
    acresIn.addEventListener('change', () => { acresIn.value = clampAcres(); render() })
    $$('[data-acres-step]', calc).forEach((b) => b.addEventListener('click', () => {
      acresIn.value = Math.min(20, Math.max(1, clampAcres() + Number(b.dataset.acresStep)))
      render()
    }))
    // Carry the numbers into the farmer form.
    const apply = $('[data-calc-apply]', calc)
    if (apply) apply.addEventListener('click', () => {
      const crop = $('#j-crop')
      const acres = $('#j-acres')
      if (crop) crop.value = $('input[name="calc-crop"]:checked', calc).value
      if (acres) acres.value = clampAcres()
    })
    render()
  }
})();

;(() => {
  // Hero season scene: pause / play (WCAG 2.2.2)
  const btn = document.querySelector('[data-scene-toggle]')
  const hero = btn && btn.closest('.hero')
  if (!btn || !hero) return
  btn.addEventListener('click', () => {
    const paused = hero.classList.toggle('is-paused')
    btn.setAttribute('aria-pressed', String(paused))
    btn.textContent = paused ? 'Play' : 'Pause'
  })
})();
