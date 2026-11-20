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

/* Dede Ansah Realty: template-only behaviour.
   [data-filter] chips      show or hide property cards by data-kind; #rent, #sale, #land in the URL pick a filter
   [data-advance]           rent-advance check against the Rent Act's six-month limit
   ?want= / ?property=      preselect the enquiry form from links on other pages */
;(() => {
  'use strict'
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s))
  const cedis = (n) => 'GH₵ ' + Math.round(n).toLocaleString('en-GB')

  // Property filter
  const list = $('[data-props]')
  if (list) {
    const chips = $$('[data-filter]')
    const count = $('[data-count-shown]')
    const apply = (kind) => {
      let shown = 0
      $$('[data-kind]', list).forEach((card) => {
        const on = kind === 'all' || card.dataset.kind === kind
        card.hidden = !on
        if (on) shown++
      })
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === kind)))
      if (count) count.textContent = shown
    }
    chips.forEach((c) => c.addEventListener('click', () => {
      apply(c.dataset.filter)
      history.replaceState(null, '', c.dataset.filter === 'all' ? location.pathname : '#' + c.dataset.filter)
    }))
    const fromHash = location.hash.slice(1)
    if (['rent', 'sale', 'land'].includes(fromHash)) apply(fromHash)
  }

  // Rent advance check
  const adv = $('[data-advance]')
  if (adv) {
    const rent = $('#adv-rent', adv)
    const months = $('#adv-months', adv)
    const out = (k) => $(`[data-out="${k}"]`, adv)
    const verdict = $('[data-verdict]', adv)
    const okIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>'
    const warnIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4M12 17h.01M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>'
    const render = () => {
      const r = Math.max(0, Number(rent.value) || 0)
      const m = Number(months.value)
      const asked = r * m
      const legal = r * Math.min(m, 6)
      const excess = Math.max(0, asked - r * 6)
      out('months').textContent = `${m} month${m === 1 ? '' : 's'}`
      out('asked').textContent = cedis(asked)
      out('legal').textContent = cedis(r * 6)
      out('excess').textContent = cedis(excess)
      const ok = m <= 6
      verdict.dataset.ok = String(ok)
      verdict.innerHTML = (ok ? okIcon : warnIcon) + '<span data-out="verdict"></span>'
      out('verdict').textContent = ok
        ? 'That is within the six-month limit.'
        : `That's ${m - 6} month${m - 6 === 1 ? '' : 's'} more than the law allows, ${cedis(excess)} you shouldn't have to pay upfront.`
      months.setAttribute('aria-valuetext', `${m} months`)
    }
    rent.addEventListener('input', render)
    months.addEventListener('input', render)
    render()
  }

  // Enquiry form preselect from links (?want=sell-let, ?property=airport-apartment)
  const params = new URLSearchParams(location.search)
  const want = $('#want')
  const property = $('#property')
  const prop = params.get('property')
  if (property && prop) {
    const opt = $(`option[value="${CSS.escape(prop)}"]`, property)
    if (opt) {
      property.value = prop
      if (want && !params.get('want') && opt.dataset.want) want.value = opt.dataset.want
    }
  }
  const w = params.get('want')
  if (want && w && $(`option[value="${CSS.escape(w)}"]`, want)) want.value = w
})();
