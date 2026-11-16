(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const $ = (selector, root = document) => root.querySelector(selector)
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector))

  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Header turns solid after the page scrolls.
  const header = $('[data-header]')
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  }

  // Mobile menu.
  const menuButton = $('[data-menu-button]')
  const menuPanel = $('[data-menu-panel]')
  if (header && menuButton && menuPanel) {
    let open = false
    const setMenu = (next, returnFocus = false) => {
      open = next
      header.classList.toggle('menu-open', open)
      menuPanel.classList.toggle('is-open', open)
      menuPanel.inert = !open
      menuButton.setAttribute('aria-expanded', String(open))
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
      document.body.classList.toggle('menu-open', open)
      if (open) {
        const first = $('a', menuPanel)
        if (first) window.setTimeout(() => first.focus(), 60)
      } else if (returnFocus) {
        menuButton.focus()
      }
    }
    menuPanel.inert = true
    menuButton.addEventListener('click', () => setMenu(!open))
    $$('a', menuPanel).forEach((link) => link.addEventListener('click', () => setMenu(false)))
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && open) setMenu(false, true)
    })
    window.addEventListener('resize', () => {
      if (open && window.innerWidth >= 1024) setMenu(false)
    })
  }

  // Hero slider: three headlines with tabs. Auto-advances unless the visitor
  // prefers reduced motion; pauses on hover and while focus is inside.
  const hero = $('[data-hero]')
  if (hero) {
    const slides = $$('[data-slide]', hero)
    const tabs = $$('[data-tab]', hero)
    const interval = 6500
    let index = 0
    let timer = null

    hero.style.setProperty('--slide-ms', `${interval}ms`)

    const show = (next) => {
      if (next === index) return
      const current = slides[index]
      const incoming = slides[next]
      current.hidden = true
      current.classList.remove('is-active')
      incoming.hidden = false
      incoming.classList.add('is-active', 'is-entering')
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => incoming.classList.remove('is-entering')))
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === next))
        tab.tabIndex = i === next ? 0 : -1
        // Restart the progress bar animation.
        const bar = $('i', tab)
        if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '' }
      })
      index = next
    }

    const start = () => {
      if (reduceMotion) return
      stop()
      timer = window.setInterval(() => show((index + 1) % slides.length), interval)
      hero.classList.remove('is-paused')
    }
    const stop = () => {
      if (timer) window.clearInterval(timer)
      timer = null
      hero.classList.add('is-paused')
    }

    tabs.forEach((tab, i) => {
      tab.tabIndex = i === 0 ? 0 : -1
      tab.addEventListener('click', () => { show(i); start() })
      tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
        event.preventDefault()
        const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + slides.length) % slides.length
        show(next)
        tabs[next].focus()
      })
    })

    hero.addEventListener('mouseenter', stop)
    hero.addEventListener('mouseleave', start)
    hero.addEventListener('focusin', stop)
    hero.addEventListener('focusout', (event) => { if (!hero.contains(event.relatedTarget)) start() })
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()))

    if (reduceMotion) hero.classList.add('is-paused')
    start()
  }

  // Scroll reveals for content below the fold only.
  const revealItems = $$('[data-reveal]')
  if (revealItems.length && !reduceMotion && 'IntersectionObserver' in window) {
    const fold = window.innerHeight * 0.92
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.remove('reveal-pending')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    revealItems.forEach((el) => {
      if (el.getBoundingClientRect().top > fold) {
        el.classList.add('reveal-pending')
        observer.observe(el)
      }
    })
  }

  // Highlight the nav link for the section in view.
  const navLinks = $$('[data-nav]')
  if (navLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(navLinks.map((link) => [link.hash.slice(1), link]))
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = byId.get(entry.target.id)
        if (!link) return
        if (entry.isIntersecting) {
          navLinks.forEach((other) => other.removeAttribute('aria-current'))
          link.setAttribute('aria-current', 'true')
        } else {
          link.removeAttribute('aria-current')
        }
      })
    }, { rootMargin: '-45% 0px -50% 0px' })
    byId.forEach((_, id) => { const section = document.getElementById(id); if (section) spy.observe(section) })
  }

  // Service cards and package buttons pre-select the service in the form.
  const serviceSelect = $('[data-service-select]')
  if (serviceSelect) {
    $$('[data-service]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        serviceSelect.value = trigger.dataset.service
        serviceSelect.classList.remove('is-invalid')
        const error = document.getElementById(`${serviceSelect.id}-error`)
        if (error) error.hidden = true
      })
    })
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  // Starter guide email capture (demo: connect to your email tool before going live).
  const guideForm = $('[data-guide-form]')
  if (guideForm) {
    const input = $('input[type="email"]', guideForm)
    const msg = $('[data-guide-msg]', guideForm)
    guideForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const ok = emailPattern.test(input.value.trim())
      input.classList.toggle('is-invalid', !ok)
      input.setAttribute('aria-invalid', String(!ok))
      if (!ok) {
        msg.textContent = 'Please enter a valid email address.'
        input.focus()
        return
      }
      msg.textContent = 'Thank you. The guide is on its way to your inbox.'
      input.value = ''
    })
  }

  // Consultation form: validates in the browser and shows a thank-you panel.
  // Connect it to a form service (Formspree, Basin or your own endpoint) before going live.
  const form = $('[data-form]')
  if (form) {
    const message = $('[data-form-msg]', form)
    const success = $('[data-form-success]')

    const fieldValid = (input) => {
      const value = input.value.trim()
      if (input.required && !value) return false
      if (input.type === 'email' && value && !emailPattern.test(value)) return false
      if (input.type === 'tel' && value && value.replace(/\D/g, '').length < 9) return false
      return true
    }
    const showState = (input, valid) => {
      const error = document.getElementById(`${input.id}-error`)
      input.classList.toggle('is-invalid', !valid)
      if (valid) {
        input.removeAttribute('aria-invalid')
        input.removeAttribute('aria-describedby')
      } else {
        input.setAttribute('aria-invalid', 'true')
        if (error) input.setAttribute('aria-describedby', error.id)
      }
      if (error) error.hidden = valid
    }

    const checked = $$('[required]', form)
    checked.forEach((input) => {
      input.addEventListener('blur', () => { if (input.value.trim()) showState(input, fieldValid(input)) })
      const recheck = () => { if (input.classList.contains('is-invalid') && fieldValid(input)) showState(input, true) }
      input.addEventListener('input', recheck)
      input.addEventListener('change', recheck)
    })

    form.addEventListener('submit', (event) => {
      event.preventDefault()
      if (form.elements.website && form.elements.website.value) return
      let firstInvalid = null
      checked.forEach((input) => {
        const valid = fieldValid(input)
        showState(input, valid)
        if (!valid && !firstInvalid) firstInvalid = input
      })
      if (firstInvalid) {
        message.hidden = false
        firstInvalid.focus()
        return
      }
      message.hidden = true
      const name = form.elements.name.value.trim().split(/\s+/)[0]
      const slot = $('[data-success-name]', success)
      if (slot && name) slot.textContent = `, ${name}`
      form.hidden = true
      success.hidden = false
      success.focus()
    })
  }

  // Service detail dialog: service cards open a modal with that service's details
  // (from its <template id="detail-…">). Without JavaScript, or without <dialog>
  // support, the cards stay plain links to the consultation form.
  const serviceDialog = $('[data-service-dialog]')
  if (serviceDialog && typeof serviceDialog.showModal === 'function') {
    const content = $('[data-sd-content]', serviceDialog)
    const media = $('[data-sd-img]', serviceDialog)
    const cta = $('[data-sd-cta]', serviceDialog)
    const wa = $('[data-sd-wa]', serviceDialog)
    let current = null

    $$('[data-service-detail]').forEach((card) => {
      const template = document.getElementById(`detail-${card.dataset.serviceDetail}`)
      if (!template) return
      card.addEventListener('click', (event) => {
        event.preventDefault()
        current = card.dataset.serviceDetail
        content.replaceChildren(template.content.cloneNode(true))
        const img = $('img', card)
        if (img) {
          media.src = img.currentSrc || img.src
          media.width = img.width
          media.height = img.height
        }
        const title = $('.sd-title', content)?.textContent.trim() ?? ''
        cta.textContent = 'Request a consultation'
        wa.href = `https://wa.me/233559204100?text=${encodeURIComponent(`Hello Kwan Consulting, I'd like to ask about ${title}.`)}`
        serviceDialog.showModal()
        document.body.classList.add('dialog-open')
        $('.sd-body', serviceDialog).scrollTop = 0
        $('.sd-close', serviceDialog).focus()
      })
    })

    // "Request a consultation" picks the service in the form, then goes to it.
    cta.addEventListener('click', () => {
      if (serviceSelect && current) {
        serviceSelect.value = current
        serviceSelect.classList.remove('is-invalid')
        const error = document.getElementById(`${serviceSelect.id}-error`)
        if (error) error.hidden = true
      }
      serviceDialog.close()
    })
    serviceDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'))
  }

  // Privacy dialog.
  $$('[data-open-dialog]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.openDialog)
    if (!dialog || typeof dialog.showModal !== 'function') return
    trigger.addEventListener('click', () => dialog.showModal())
  })
  $$('dialog').forEach((dialog) => {
    $$('[data-close-dialog]', dialog).forEach((button) => button.addEventListener('click', () => dialog.close()))
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close() })
  })
})()
