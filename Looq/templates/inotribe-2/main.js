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


/* Inotribe version B: behaviour specific to this template.
   The navbar, numbered mobile menu, footer and scroll-to-top ring are built here and inserted into
   [data-component="navbar"] and [data-component="footer"]; <body data-page> marks the current page.
   The mobile menu uses event delegation because its markup is inserted after load.
   [data-timeline] fills the process rail as it scrolls past. Case studies (Work) and testimonials
   (About) are read from assets/data/*.json. The contact form ([data-form-relay]) posts JSON to
   Web3Forms. Contact details and social links live in SITE. */
;(() => {
  'use strict'

  const SITE = {
    email: 'team@inotribe.com',
    // Profile URLs. An empty href keeps the icon and links to #.
    social: [
      { label: 'Inotribe on LinkedIn', icon: 'ti-brand-linkedin', href: '' },
      { label: 'Inotribe on X', icon: 'ti-brand-x', href: '' },
      { label: 'Inotribe on GitHub', icon: 'ti-brand-github', href: '' },
      { label: 'Email Inotribe', icon: 'ti-mail', href: 'mailto:team@inotribe.com' },
    ],
    // Phone shown on the Contact page, e.g. '+233 30 000 0000'. Empty shows a call-back note instead.
    phone: '',
    // Web3Forms access key for team@inotribe.com (FR-09). While empty, sending shows the error message.
    WEB3FORMS_ACCESS_KEY: '',
  }

  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s))
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const page = document.body.dataset.page || ''
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

  const phoneSlot = $('[data-site-phone]')
  if (phoneSlot && SITE.phone) {
    const tel = '+' + SITE.phone.replace(/\D/g, '')
    phoneSlot.innerHTML = `<a class="underline decoration-[var(--color-accent)] underline-offset-4" href="tel:${tel}">${esc(SITE.phone)}</a>`
  }

  const LINKS = [
    { id: 'home', label: 'Home', href: './' },
    { id: 'about', label: 'About', href: 'about' },
    { id: 'services', label: 'Services', href: 'services' },
    { id: 'work', label: 'Work', href: 'work' },
    { id: 'contact', label: 'Contact', href: 'contact' },
  ]
  const current = (id) => (id === page ? ' aria-current="page"' : '')

  // Navbar and full-screen numbered menu
  const navSlot = $('[data-component="navbar"]')
  if (navSlot) {
    navSlot.innerHTML = `
      <div class="rail">
        <nav class="rail-inner" aria-label="Main">
          <div class="rail-left">
            <a class="nav-logo" href="./" aria-label="Inotribe home"><img src="./assets/images/logo-color.png" alt="Inotribe" width="80" height="41"></a>
            <p class="rail-clock">Accra<time data-accra-time>GMT</time></p>
          </div>
          <div class="nav-links"><span class="nav-ind" aria-hidden="true"></span>${LINKS.map((l) => `<a class="nav-link" href="${l.href}"${current(l.id)}>${l.label}</a>`).join('')}</div>
          <div class="rail-right">
            <a class="btn btn-primary btn-sm nav-cta" href="contact">Contact Us</a>
            <button class="nav-burger" type="button" data-menu-open aria-controls="menu-overlay" aria-expanded="false" aria-label="Open menu"><i class="ti ti-menu-2" aria-hidden="true"></i></button>
          </div>
        </nav>
      </div>
      <div class="menu-overlay" id="menu-overlay" role="dialog" aria-modal="true" aria-label="Menu" inert>
        <div class="menu-top">
          <a class="inline-flex" href="./" aria-label="Inotribe home"><img src="./assets/images/logo-color.png" alt="Inotribe" width="72" height="37" style="height:36px;width:auto"></a>
          <button class="nav-burger" type="button" data-menu-close aria-label="Close menu" style="display:grid"><i class="ti ti-x" aria-hidden="true"></i></button>
        </div>
        <div class="menu-list">${LINKS.map((l) => `<a class="menu-item" href="${l.href}"${current(l.id)}>${l.label}</a>`).join('')}</div>
        <div class="menu-foot">
          <a class="btn btn-primary" href="contact">Contact Us <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
          <a class="text-center font-semibold text-[var(--color-text-primary)]" href="mailto:${SITE.email}">${SITE.email}</a>
        </div>
      </div>`
  }

  // Accra clock (Ghana time, GMT all year) and the highlight that slides between nav links
  const clock = $('[data-accra-time]')
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Accra', hour: '2-digit', minute: '2-digit', hour12: false })
    const tick = () => { clock.textContent = `${fmt.format(new Date())} GMT` }
    tick()
    setInterval(tick, 20000)
  }
  const track = $('.nav-links')
  const ind = track && $('.nav-ind', track)
  if (track && ind) {
    const moveTo = (link) => {
      if (!link) { ind.style.opacity = '0'; return }
      ind.style.width = `${link.offsetWidth}px`
      ind.style.transform = `translateX(${link.offsetLeft}px)`
      ind.style.opacity = '1'
    }
    const home = () => moveTo($('.nav-link[aria-current="page"]', track))
    $$('.nav-link', track).forEach((l) => { l.addEventListener('mouseenter', () => moveTo(l)); l.addEventListener('focus', () => moveTo(l)) })
    track.addEventListener('mouseleave', home)
    track.addEventListener('focusout', (e) => { if (!track.contains(e.relatedTarget)) home() })
    window.addEventListener('resize', home)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(home); else home()
  }

  const overlay = $('#menu-overlay')
  let lastFocus = null
  const setMenu = (open) => {
    if (!overlay) return
    overlay.classList.toggle('is-open', open)
    overlay.inert = !open
    document.body.classList.toggle('menu-locked', open)
    $$('[data-menu-open]').forEach((b) => b.setAttribute('aria-expanded', String(open)))
    if (open) { lastFocus = document.activeElement; setTimeout(() => $('[data-menu-close]', overlay)?.focus(), 50) }
    else if (lastFocus) lastFocus.focus()
  }
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-menu-open]')) setMenu(true)
    else if (e.target.closest('[data-menu-close]')) setMenu(false)
    else if (overlay?.classList.contains('is-open') && e.target.closest('#menu-overlay a')) setMenu(false)
  })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay?.classList.contains('is-open')) setMenu(false) })
  window.addEventListener('resize', () => { if (window.innerWidth >= 768 && overlay?.classList.contains('is-open')) setMenu(false) })

  // Footer
  const footSlot = $('[data-component="footer"]')
  if (footSlot) {
    footSlot.innerHTML = `
      <footer class="site-footer">
        <div class="wrap">
          <p class="footer-line">Software engineering for institutions, <span class="gold">from Accra.</span></p>
          <div class="footer-top">
            <a class="inline-flex w-fit" href="./" aria-label="Inotribe home"><img src="./assets/images/logo-color.png" alt="Inotribe" width="80" height="41" style="height:38px;width:auto"></a>
            <div class="footer-cols">
              <div><p class="footer-head">Navigation</p>${LINKS.map((l) => `<a class="footer-link" href="${l.href}">${l.label}</a>`).join('')}</div>
              <div><p class="footer-head">Company</p><a class="footer-link" href="about#process">How we work</a><a class="footer-link" href="./#clients">Clients</a><button class="footer-link" type="button" data-footer-privacy>Privacy notice</button><a class="footer-link" href="mailto:${SITE.email}">${SITE.email}</a></div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>© ${new Date().getFullYear()} Inotribe. All rights reserved.</p>
            <div style="display:flex;gap:10px">${SITE.social.map((s) => `<a class="social" href="${esc(s.href || '#')}" aria-label="${esc(s.label)}"${s.href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}><i class="ti ${s.icon}" aria-hidden="true"></i></a>`).join('')}</div>
          </div>
        </div>
      </footer>`
  }

  // Privacy notice from the footer: reuse the Contact page dialog, or add the same notice on other pages
  let privacy = document.getElementById('privacy')
  if (!privacy) {
    privacy = document.createElement('dialog')
    privacy.className = 'dialog'
    privacy.id = 'privacy'
    privacy.setAttribute('aria-labelledby', 'privacy-title')
    privacy.innerHTML = `<div class="dialog-body"><h2 id="privacy-title">Privacy notice</h2><p>When you send a message, we receive your name, email address and what you wrote. We use them only to reply to your enquiry and to keep a record of our conversation.</p><p>Messages are delivered to us through Web3Forms, a form relay service. We do not use analytics, advertising cookies or trackers on this website.</p><p>You can ask us to see, correct or delete the details you sent at any time by writing to ${SITE.email}. We handle personal data in line with Ghana's Data Protection Act, 2012 (Act 843).</p><button class="btn btn-outline btn-sm mt-6" type="button" data-close-dialog>Close</button></div>`
    document.body.appendChild(privacy)
    $('[data-close-dialog]', privacy).addEventListener('click', () => privacy.close())
    privacy.addEventListener('click', (e) => { if (e.target === privacy) privacy.close() })
  }
  $('[data-footer-privacy]')?.addEventListener('click', () => { if (typeof privacy.showModal === 'function') privacy.showModal() })

  // Scroll-to-top ring: scrollY / (scrollHeight - innerHeight)
  const toTop = document.createElement('button')
  toTop.type = 'button'
  toTop.className = 'to-top'
  toTop.setAttribute('aria-label', 'Scroll to top')
  const C = 2 * Math.PI * 21
  toTop.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="ring-track" cx="24" cy="24" r="21"/><circle class="ring-fill" cx="24" cy="24" r="21" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg><i class="ti ti-arrow-up" aria-hidden="true"></i>`
  document.body.appendChild(toTop)
  const ring = $('.ring-fill', toTop)

  // Process rail fills as the list passes the middle of the screen
  const timeline = $('[data-timeline]')
  const steps = timeline ? $$('.tl', timeline) : []

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
    ring.setAttribute('stroke-dashoffset', String(C * (1 - p)))
    toTop.classList.toggle('is-visible', window.scrollY > 300)
    if (timeline) {
      const r = timeline.getBoundingClientRect()
      const mid = window.innerHeight * 0.6
      const t = Math.min(Math.max((mid - r.top) / r.height, 0), 1)
      timeline.style.setProperty('--p', t.toFixed(3))
      steps.forEach((s) => s.classList.toggle('is-on', s.getBoundingClientRect().top < mid))
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  onScroll()
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }))

  // Testimonial slider, wrapping in both directions
  const slider = $('[data-testimonials]')
  if (slider) {
    const quote = $('[data-t-quote]', slider)
    const name = $('[data-t-name]', slider)
    const title = $('[data-t-title]', slider)
    const photo = $('[data-t-photo]', slider)
    const count = $('[data-t-count]', slider)
    const bars = $('[data-t-bars]', slider)
    let items = []
    let i = 0
    const show = (n) => {
      if (!items.length) return
      i = (n + items.length) % items.length
      const t = items[i]
      quote.textContent = t.quote
      name.textContent = t.name
      title.textContent = t.title
      photo.src = t.image
      photo.alt = t.alt || `Portrait of ${t.name}`
      if (count) count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`
      if (bars) bars.innerHTML = items.map((_, k) => `<span${k === i ? ' aria-current="true"' : ''}></span>`).join('')
      ;[quote.parentElement, photo.parentElement].forEach((el) => { el.classList.remove('t-fade'); void el.offsetWidth; el.classList.add('t-fade') })
    }
    fetch('./assets/data/testimonials.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => { items = Array.isArray(data) ? data : []; show(0) })
      .catch(() => { quote.textContent = 'Testimonials could not be loaded.' })
    $$('[data-t-prev]').forEach((b) => b.addEventListener('click', () => show(i - 1)))
    $$('[data-t-next]').forEach((b) => b.addEventListener('click', () => show(i + 1)))
  }

  // Work page: case index cards and one challenge → built → impact flow per study
  const graphics = {
    network: `<svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><pattern id="g-dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#423739"/></pattern></defs><rect width="800" height="320" fill="url(#g-dots)"/><g stroke="#423739" stroke-width="1.5" fill="none"><path d="M120 160 L300 70 L500 70 L680 160 L500 250 L300 250 Z"/><path d="M300 70 L300 250M500 70 L500 250M120 160 L680 160"/></g><g fill="#2b2325" stroke="#6cbccc" stroke-width="2"><circle cx="300" cy="70" r="14"/><circle cx="300" cy="250" r="14"/><circle cx="500" cy="70" r="14"/><circle cx="500" cy="250" r="14"/></g><circle cx="120" cy="160" r="22" fill="#1f7a8c"/><circle cx="680" cy="160" r="22" fill="#e3a857"/><circle r="5" fill="#e3a857" class="packet" style="offset-path:path('M120 160 L300 70 L500 70 L680 160')"/><circle r="5" fill="#6cbccc" class="packet" style="offset-path:path('M120 160 L300 250 L500 250 L680 160');animation-delay:-2s"/><circle r="4" fill="#e3a857" class="packet" style="offset-path:path('M120 160 L680 160');animation-duration:3s"/></svg>`,
    geo: `<svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><pattern id="geo-dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill="#423739"/></pattern></defs><rect width="800" height="320" fill="url(#geo-dots)"/><path d="M60 280 C160 230 220 250 300 190 S420 120 480 150 S600 90 760 50" fill="none" stroke="#e3a857" stroke-width="2" stroke-dasharray="8 7"/><g fill="none" stroke="#1f7a8c" stroke-width="1.5" opacity=".7"><path d="M0 40 L800 210"/><path d="M0 120 L800 290"/></g><g fill="#6cbccc"><circle cx="250" cy="160" r="5"/><circle cx="410" cy="205" r="5"/><circle cx="540" cy="110" r="5"/></g><g fill="none" stroke="#6cbccc" stroke-width="1.5"><circle cx="410" cy="205" r="16"/><circle cx="410" cy="205" r="30" opacity=".5"/></g><text x="660" y="74" fill="#a39496" font-size="12" font-family="Google Sans, sans-serif">boundary</text><text x="40" y="74" fill="#a39496" font-size="12" font-family="Google Sans, sans-serif">satellite pass</text></svg>`,
  }
  const list = $('[data-case-studies]')
  const index = $('[data-case-index]')
  if (list) {
    fetch('./assets/data/case-studies.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        const studies = Array.isArray(data) ? data : []
        const num = (n) => String(n + 1).padStart(2, '0')
        list.innerHTML = studies.map((s, n) => {
          const art = s.graphic && graphics[s.graphic]
          const media = art
            ? `${s.image ? `<img src="${esc(s.image)}" alt="${esc(s.imageAlt)}" loading="lazy" style="opacity:.3">` : ''}${art}`
            : `<img src="${esc(s.image)}" alt="${esc(s.imageAlt)}" loading="lazy">`
          const stack = Array.isArray(s.systems) && s.systems.length ? `<div class="stack" aria-label="Systems involved">${s.systems.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''
          return `
          <article class="cs" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-title">
            <div class="cs-head">
              <div class="grid gap-4">
                <div class="case-meta"><span class="cs-id">CS-${num(n)}</span><span class="tag">${esc(s.sector)}</span></div>
                <h2 class="h-section" id="${esc(s.id)}-title" style="font-size:clamp(1.9rem,3.6vw,2.9rem)">${esc(s.title)}</h2>
              </div>
              <p class="lede lg:text-right">${esc(s.summary)}</p>
            </div>
            <div class="cs-media">${media}${stack}</div>
            <div class="flow">
              <div class="flow-step"><p class="flow-label"><i class="ti ti-alert-triangle" aria-hidden="true"></i>The challenge</p><p>${esc(s.challenge)}</p></div>
              <span class="flow-arrow" aria-hidden="true"><i class="ti ti-arrow-right"></i></span>
              <div class="flow-step is-built"><p class="flow-label"><i class="ti ti-code" aria-hidden="true"></i>What we built</p><p>${esc(s.built)}</p></div>
              <span class="flow-arrow" aria-hidden="true"><i class="ti ti-arrow-right"></i></span>
              <div class="flow-step is-impact"><p class="flow-label"><i class="ti ti-target-arrow" aria-hidden="true"></i>Why it matters</p><p>${esc(s.impact)}</p></div>
            </div>
          </article>`
        }).join('')
        if (index) index.innerHTML = studies.map((s, n) => `<a href="#${esc(s.id)}"><span class="cs-id">CS-${num(n)}</span><strong>${esc(s.title)}</strong><small>${esc(s.sector)}</small></a>`).join('')
        if (location.hash) { const target = document.getElementById(location.hash.slice(1)); if (target) setTimeout(() => target.scrollIntoView(), 60) }
        if (index && 'IntersectionObserver' in window) {
          const links = new Map($$('a', index).map((a) => [a.hash.slice(1), a]))
          const io = new IntersectionObserver((entries) => entries.forEach((en) => {
            if (en.isIntersecting) { links.forEach((a) => a.removeAttribute('aria-current')); links.get(en.target.id)?.setAttribute('aria-current', 'true') }
          }), { rootMargin: '-40% 0px -55% 0px' })
          $$('.cs', list).forEach((el) => io.observe(el))
        }
      })
      .catch(() => { list.innerHTML = '<p class="form-error">Case studies could not be loaded. Please refresh the page.</p>' })
  }

  // Contact form: validate, send to Web3Forms, then show sent or error
  $$('[data-form-relay]').forEach((form) => {
    const button = $('[type="submit"]', form)
    const label = button.textContent
    const errorBox = $('[data-relay-error]', form.parentElement)
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
    const fields = $$('[required]', form)
    const check = (input) => {
      const v = input.value.trim()
      const ok = v !== '' && (input.type !== 'email' || emailOk(v))
      const err = document.getElementById(`${input.id}-error`)
      input.setAttribute('aria-invalid', String(!ok))
      if (err) { err.hidden = ok; ok ? input.removeAttribute('aria-describedby') : input.setAttribute('aria-describedby', err.id) }
      return ok
    }
    fields.forEach((f) => f.addEventListener('input', () => { if (f.getAttribute('aria-invalid') === 'true') check(f) }))
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      if (form.elements.website?.value) return
      if (errorBox) errorBox.hidden = true
      const bad = fields.filter((f) => !check(f))
      if (bad.length) { bad[0].focus(); return }
      button.disabled = true
      button.textContent = 'Sending...'
      const data = Object.fromEntries(new FormData(form))
      delete data.website
      const payload = {
        access_key: SITE.WEB3FORMS_ACCESS_KEY,
        subject: `New enquiry from ${data.first_name} ${data.last_name} (inotribe.com)`,
        from_name: 'Inotribe website',
        name: `${data.first_name} ${data.last_name}`,
        ...data,
      }
      try {
        if (!SITE.WEB3FORMS_ACCESS_KEY) throw new Error('Web3Forms access key not set')
        const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        const json = await res.json().catch(() => ({}))
        if (!res.ok || json.success === false) throw new Error(json.message || `Request failed (${res.status})`)
        form.reset()
        fields.forEach((f) => f.removeAttribute('aria-invalid'))
        button.textContent = 'Message sent'
        setTimeout(() => { button.textContent = label; button.disabled = false }, 3000)
      } catch (err) {
        button.textContent = label
        button.disabled = false
        if (errorBox) {
          errorBox.querySelector('[data-relay-error-text]').textContent = `Your message didn't send. Please try again, or email us at ${SITE.email}.`
          errorBox.hidden = false
        }
      }
    })
  })
})();
