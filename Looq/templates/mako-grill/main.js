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


/* Mako Grill: behaviour specific to this template.
   [data-tabs]          ARIA tabs for the menu board on Home (click, arrow keys, Home/End)
   [data-filter]        menu-page chips: everything / vegetarian / no groundnut; empty sections hide
   [data-countdown]     counts down to the next data-day (0 = Sunday) at data-time, Accra time (GMT, no DST) */
;(() => {
  'use strict'
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s))

  // Menu tabs
  $$('[data-tabs]').forEach((list) => {
    const tabs = $$('[role="tab"]', list)
    const select = (tab, focus = true) => {
      tabs.forEach((t) => {
        const on = t === tab
        t.setAttribute('aria-selected', String(on))
        t.tabIndex = on ? 0 : -1
        const panel = document.getElementById(t.getAttribute('aria-controls'))
        if (panel) panel.hidden = !on
      })
      if (focus) tab.focus()
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false))
      tab.addEventListener('keydown', (e) => {
        const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key]
        if (next === undefined) return
        e.preventDefault()
        select(tabs[(next + tabs.length) % tabs.length])
      })
    })
  })

  // Menu filters
  const chips = $$('[data-filter]')
  if (chips.length) {
    const rows = $$('.m-row')
    const count = $('[data-filter-count]')
    const tests = {
      all: () => true,
      veg: (r) => r.dataset.veg === 'true',
      nonuts: (r) => r.dataset.nuts === 'false',
    }
    chips.forEach((chip) => chip.addEventListener('click', () => {
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)))
      const test = tests[chip.dataset.filter] || tests.all
      let shown = 0
      rows.forEach((r) => { const ok = test(r); r.hidden = !ok; if (ok) shown++ })
      $$('[data-menu-cat]').forEach((cat) => { cat.hidden = !$$('.m-row', cat).some((r) => !r.hidden) })
      if (count) count.textContent = `${shown} ${shown === 1 ? 'dish' : 'dishes'}`
    }))
  }

  // Countdown to the next weekday/time in Accra (UTC+0 all year)
  $$('[data-countdown]').forEach((box) => {
    const day = Number(box.dataset.day || 0)
    const [hh, mm] = (box.dataset.time || '22:00').split(':').map(Number)
    const units = { d: $('[data-unit="d"]', box), h: $('[data-unit="h"]', box), m: $('[data-unit="m"]', box), s: $('[data-unit="s"]', box) }
    const target = () => {
      const now = new Date()
      const t = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hh, mm))
      t.setUTCDate(t.getUTCDate() + ((day - now.getUTCDay() + 7) % 7))
      if (t <= now) t.setUTCDate(t.getUTCDate() + 7)
      return t
    }
    let end = target()
    const pad = (n) => String(n).padStart(2, '0')
    const tick = () => {
      let left = Math.floor((end - Date.now()) / 1000)
      if (left < 0) { end = target(); left = Math.floor((end - Date.now()) / 1000) }
      units.d.textContent = Math.floor(left / 86400)
      units.h.textContent = pad(Math.floor(left / 3600) % 24)
      units.m.textContent = pad(Math.floor(left / 60) % 60)
      units.s.textContent = pad(left % 60)
    }
    tick()
    setInterval(tick, 1000)
  })
})();


/* Mako Grill signature features.
   [data-grill-now]   ticker under the header: one message chosen from Accra time, the opening hours (data-grill-hours)
                      and the weekly deals; refreshed every 30 s (no auto-rotation, so nothing needs pausing)
   [data-builder]     build-your-plate: radios update the plate drawing, the receipt and a WhatsApp link with
                      the order typed out for the chosen branch. [data-builder-mini] is a running total that shows on
                      small screens while the choices are on screen and the receipt is not (the action bar steps aside)
   [data-heat]        spice dial on the Menu: dishes hotter than the chosen level are greyed with "ask for it milder";
                      the level is remembered (localStorage) and preselects the builder's heat */
;(() => {
  'use strict'
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s))
  const store = { get: (k) => { try { return localStorage.getItem(k) } catch (e) { return null } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} } }
  const HEAT = ['No chilli', 'Mild', 'Medium', 'Hot']

  // ---------- On the grill ticker
  const ticker = $('[data-grill-now]')
  if (ticker) {
    let hours = {}
    try { hours = JSON.parse(ticker.dataset.grillHours) } catch (e) {}
    const msgEl = $('[data-grill-msg]', ticker)
    const clock = $('[data-grill-clock]', ticker)
    const link = $('[data-grill-link]', ticker)
    const orderHref = link.getAttribute('href')
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Accra', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
    const pick = () => {
      const parts = fmt.formatToParts(new Date())
      const get = (t) => parts.find((p) => p.type === t).value
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
      const now = Number(get('hour')) * 60 + Number(get('minute'))
      const today = hours[String(day)]
      const time = `${get('hour')}:${get('minute')}`
      if (!today || now < mins(today[0]) || now >= mins(today[1])) {
        let text
        if (today && now < mins(today[0])) text = now >= 9 * 60 ? `Coals are lit and heating up. Kitchen opens at ${today[0]}.` : `Grill's cold for now. Kitchen opens at ${today[0]} today.`
        else { const next = hours[String((day + 1) % 7)]; text = `Grill's off for tonight. Back tomorrow from ${next ? next[0] : '11:00'}.` }
        return { state: 'closed', time, text, cta: 'See the menu', href: 'menu' }
      }
      const close = mins(today[1])
      let text = 'On the coals now: charcoal chicken, khebab and tilapia, cooked to order.'
      if (close - now <= 30) text = `Last orders: the kitchen closes at ${today[1]}.`
      else if (day === 3) text = 'Wing Wednesday is on: 12 fiery wings for GH₵ 99.'
      else if (day === 5) text = now >= 17 * 60 ? 'Khebab Friday is on: 5 sticks for the price of 4.' : 'Khebab Friday starts at 17:00: 5 sticks for the price of 4.'
      else if (day === 6 && now < 15 * 60) text = 'Saturday waakye is on, until the pot is empty.'
      else if (day === 6 || day === 0) text = 'Weekend bucket: free kelewele with every family bucket.'
      else if (now >= 12 * 60 && now < 14 * 60) text = 'Lunch rush: WhatsApp ahead and skip the queue.'
      return { state: 'open', time, text, cta: 'Order on WhatsApp', href: orderHref }
    }
    const render = () => {
      const m = pick()
      ticker.dataset.state = m.state
      clock.textContent = m.time
      if (msgEl.textContent !== m.text) { msgEl.textContent = m.text; msgEl.removeAttribute('data-swap'); void msgEl.offsetWidth; msgEl.setAttribute('data-swap', '') }
      link.firstChild.textContent = m.cta
      link.setAttribute('href', m.href)
    }
    render()
    setInterval(render, 30000)
  }

  // ---------- Build your plate
  const form = $('[data-builder]')
  if (form) {
    const lines = $('[data-lines]', form)
    const total = $('[data-total]', form)
    const meta = $('[data-meta]', form)
    const send = $('[data-builder-send]', form)
    const desc = $('[data-plate-desc]', form)
    const mini = $('[data-builder-mini]')
    const miniTotal = mini && $('[data-mini-total]', mini)
    const miniCount = mini && $('[data-mini-count]', mini)
    const ticketNo = String(Math.floor(1000 + Math.random() * 9000))
    $('[data-ticket]', form).textContent = `TICKET #${ticketNo}`
    const saved = Number(store.get('mako-heat'))
    if (store.get('mako-heat') !== null) {
      const want = HEAT[Math.max(1, saved)]
      const r = $(`input[name="heat"][value="${want}"]`, form)
      if (r) r.checked = true
    }
    const val = (name) => $(`input[name="${name}"]:checked`, form)
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
    const update = () => {
      const picked = ['main', 'base', 'side', 'drink'].map((k) => ({ k, el: val(k) }))
      let sum = 0
      const items = []
      picked.forEach(({ k, el }) => {
        const price = Number(el.dataset.price)
        const color = el.dataset.color
        const zone = $(`[data-zone="${k}"]`, form)
        if (zone) zone.setAttribute('fill', color || '#3a2c26')
        const label = $(`[data-label="${k}"]`, form)
        if (label) {
          const short = el.dataset.short || ''
          const empty = !short
          const lines = empty ? [k === 'drink' ? '' : `+ ${k}`] : short.split('|')
          label.textContent = ''
          lines.forEach((t, n) => {
            const span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
            span.setAttribute('x', label.getAttribute('x'))
            span.setAttribute('dy', n === 0 ? `${-(lines.length - 1) * 5.5}` : '11')
            span.textContent = t
            label.appendChild(span)
          })
          // dark text on light fills, light text on dark fills and on empty (charcoal) zones
          const hex = (color || '#3a2c26').replace('#', '')
          const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
          label.setAttribute('fill', k === 'drink' ? '#c9b8a5' : lum > 0.5 ? '#1d1512' : '#f8f0e4')
          label.classList.toggle('is-empty', empty)
        }
        if (k === 'drink') $('[data-zone-wrap="drink"]', form).style.opacity = color ? '1' : '.3'
        if (price) { sum += price; items.push({ name: el.value, price }) }
      })
      const heat = val('heat').value
      const branch = val('branch')
      const how = val('how').value
      lines.innerHTML = items.map((i) => `<li><span>1× ${esc(i.name)}</span><span></span><span>${i.price}</span></li>`).join('')
      meta.textContent = `${heat} · ${branch.value} · ${how}`
      total.textContent = `GH₵ ${sum}`
      if (miniTotal) miniTotal.textContent = `GH₵ ${sum}`
      if (miniCount) miniCount.textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'}`
      desc.setAttribute('aria-label', items.length ? `Plate with ${items.map((i) => i.name.toLowerCase()).join(', ')}` : 'Empty plate')
      const text = [
        `Hello Mako Grill ${branch.value}, I'd like to order (ticket #${ticketNo}):`,
        ...items.map((i) => `- ${i.name} (GH₵ ${i.price})`),
        `Heat: ${heat}`,
        `${how}${how === 'Deliver to me' ? '. My address: ' : ''}`,
        `Total: GH₵ ${sum}`,
      ].join('\n')
      send.href = `https://wa.me/${branch.dataset.wa}?text=${encodeURIComponent(text)}`
    }
    form.addEventListener('change', update)
    if (mini && 'IntersectionObserver' in window) {
      const steps = $('.builder-steps', form)
      const ticketEl = $('.receipt', form)
      let stepsIn = false
      let ticketIn = false
      const sync = () => {
        const on = stepsIn && !ticketIn
        mini.classList.toggle('is-on', on)
        mini.inert = !on
        document.body.classList.toggle('builder-active', on)
      }
      mini.inert = true
      new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.target === steps) stepsIn = e.isIntersecting; else ticketIn = e.isIntersecting })
        sync()
      }).observe(steps)
      new IntersectionObserver(([e]) => { ticketIn = e.isIntersecting; sync() }, { rootMargin: '0px 0px -64px 0px' }).observe(ticketEl)
    }
    update()
  }

  // ---------- Spice dial
  const dial = $('[data-heat]')
  if (dial) {
    const range = $('input[type="range"]', dial)
    const out = $('[data-heat-out]', dial)
    const rows = $$('.m-row')
    const set = (v, save) => {
      let fit = 0
      rows.forEach((r) => { const hot = Number(r.dataset.spice) > v; r.classList.toggle('too-hot', hot); if (!hot) fit++ })
      range.style.setProperty('--p', `${(v / 3) * 100}%`)
      range.setAttribute('aria-valuetext', HEAT[v])
      out.textContent = v === 3 ? 'Hot: bring everything on' : `${HEAT[v]}: ${fit} dishes as they come. The greyed ones can be made milder, just ask.`
      if (save) store.set('mako-heat', String(v))
    }
    const start = store.get('mako-heat')
    if (start !== null && /^[0-3]$/.test(start)) range.value = start
    set(Number(range.value), false)
    range.addEventListener('input', () => set(Number(range.value), true))
  }
})();


/* Swipe rows ([data-snap]): on small screens the card stacks scroll sideways. While a row actually
   scrolls it gets tabindex="0" so keyboard users can reach it and scroll it with the arrow keys. */
;(() => {
  'use strict'
  const rows = Array.from(document.querySelectorAll('[data-snap]'))
  if (!rows.length) return
  const sync = () => rows.forEach((row) => {
    if (row.scrollWidth > row.clientWidth + 1) row.setAttribute('tabindex', '0')
    else row.removeAttribute('tabindex')
  })
  sync()
  window.addEventListener('resize', sync)
})();


/* Crowd calculator ([data-crowd], Home): pack + guest slider give a live estimate and a quote link that
   carries ?guests=&pack= to the catering form, which pre-fills from them. */
;(() => {
  'use strict'
  const $ = (s, r = document) => r.querySelector(s)
  const money = (n) => `GH₵ ${n.toLocaleString('en-GB')}`

  const calc = $('[data-crowd]')
  if (calc) {
    const range = $('input[type="range"]', calc)
    const num = $('[data-crowd-num]', calc)
    const price = $('[data-crowd-price]', calc)
    const note = $('[data-crowd-note]', calc)
    const quote = $('[data-crowd-quote]', calc)
    const packs = {
      boxes: (g) => ({ total: g * 85, note: `${g} lunch boxes at GH₵ 85, labelled per person` }),
      khebab: (g) => { const trays = Math.ceil((g * 3) / 50); return { total: trays * 700, note: `${trays} ${trays === 1 ? 'tray' : 'trays'}, ${trays * 50} sticks (about 3 a guest)` } },
      grill: (g) => g < 100 ? { total: 0, note: 'Our live grill starts at 100 guests. Try lunch boxes or khebab trays.' } : { total: g * 120, note: `Grill and two cooks on site for ${g} guests, setup included` },
    }
    const update = () => {
      const g = Number(range.value)
      const pack = $('input[name="crowd-pack"]:checked', calc).value
      const r = packs[pack](g)
      num.textContent = g
      range.setAttribute('aria-valuetext', `${g} guests`)
      range.style.setProperty('--p', `${((g - 20) / 280) * 100}%`)
      price.textContent = r.total ? `≈ ${money(r.total)}` : 'From 100 guests'
      note.textContent = r.note
      quote.href = `catering?guests=${g}&pack=${pack}#enquiry`
      quote.textContent = `Get a quote for ${g} guests`
    }
    calc.addEventListener('input', update)
    calc.addEventListener('change', update)
    update()
  }

  // Catering form: pre-fill from the calculator's link
  const params = new URLSearchParams(location.search)
  const guests = $('#guests')
  if (guests && /^\d{2,3}$/.test(params.get('guests') || '')) guests.value = params.get('guests')
  const names = { boxes: 'Office lunch boxes', khebab: 'Khebab party trays', grill: 'Live grill at our event' }
  const message = $('#message')
  if (message && guests && names[params.get('pack')] && !message.value) message.value = `Interested in: ${names[params.get('pack')]}.`
})();
