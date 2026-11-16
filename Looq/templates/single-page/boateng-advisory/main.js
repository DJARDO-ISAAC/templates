(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const $ = (selector, root = document) => root.querySelector(selector)
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector))

  // Footer year.
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Header gains a background once the page scrolls.
  const header = $('[data-header]')
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8)
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

  // Scroll reveals: only elements below the fold start hidden, so nothing is
  // ever invisible without JavaScript or for content already on screen.
  const revealItems = $$('[data-reveal]')
  if (revealItems.length && !reduceMotion && 'IntersectionObserver' in window) {
    const fold = window.innerHeight * 0.92
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.remove('reveal-pending')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 })
    revealItems.forEach((el) => {
      if (el.getBoundingClientRect().top > fold) {
        el.classList.add('reveal-pending')
        observer.observe(el)
      }
    })
  }

  // Result counters count up once when they come into view.
  const counters = $$('[data-count]')
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    const format = (value) => value.toLocaleString('en-GB')
    const run = (el) => {
      const target = Number(el.dataset.count)
      if (!Number.isFinite(target)) return
      const start = performance.now()
      const duration = 1300
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        el.textContent = format(Math.round(target * eased))
        if (progress < 1) window.requestAnimationFrame(tick)
      }
      window.requestAnimationFrame(tick)
    }
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        run(entry.target)
        counterObserver.unobserve(entry.target)
      })
    }, { threshold: 0.6 })
    counters.forEach((el) => counterObserver.observe(el))
  }

  // Highlight the nav link for the section in view.
  const navLinks = $$('[data-nav]')
  if (navLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(navLinks.map((link) => [link.hash.slice(1), link]))
    const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean)
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = byId.get(entry.target.id)
        if (!link) return
        if (entry.isIntersecting) {
          navLinks.forEach((other) => other.removeAttribute('aria-current'))
          link.setAttribute('aria-current', 'true')
        } else if (link.getAttribute('aria-current')) {
          link.removeAttribute('aria-current')
        }
      })
    }, { rootMargin: '-45% 0px -50% 0px' })
    sections.forEach((section) => spy.observe(section))
  }

  // "Ask about this" buttons pre-select the service in the form.
  const serviceSelect = $('[data-service-select]')
  if (serviceSelect) {
    $$('[data-service]').forEach((button) => {
      button.addEventListener('click', () => {
        serviceSelect.value = button.dataset.service
        serviceSelect.classList.remove('is-invalid')
        const error = document.getElementById(`${serviceSelect.id}-error`)
        if (error) error.hidden = true
      })
    })
  }

  // Mobile action bar steps aside while the booking form is on screen.
  const actionBar = $('[data-action-bar]')
  const bookSection = $('#book')
  if (actionBar && bookSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      actionBar.classList.toggle('is-hidden', entry.isIntersecting)
    }, { threshold: 0.15 }).observe(bookSection)
  }

  // Enquiry form: validates in the browser and shows the thank-you panel.
  // Connect it to a form service (Formspree, Basin, your own endpoint) before going live.
  const form = $('[data-form]')
  if (form) {
    const message = $('[data-form-msg]', form)
    const success = $('[data-form-success]')
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

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

    // Required fields, plus optional fields that still need a valid format when filled in.
    const required = $$('[required], input[type="email"]', form)
    required.forEach((input) => {
      input.addEventListener('blur', () => {
        if (input.value.trim()) showState(input, fieldValid(input))
      })
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid') && fieldValid(input)) showState(input, true)
      })
      input.addEventListener('change', () => {
        if (input.classList.contains('is-invalid') && fieldValid(input)) showState(input, true)
      })
    })

    form.addEventListener('submit', (event) => {
      event.preventDefault()
      if (form.elements.website && form.elements.website.value) return

      let firstInvalid = null
      required.forEach((input) => {
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
      const nameSlot = $('[data-success-name]', success)
      if (nameSlot && name) nameSlot.textContent = `, ${name}`
      form.hidden = true
      success.hidden = false
      success.focus()
    })
  }

  // Dialogs (privacy notice). Native <dialog> traps focus and closes on Escape.
  $$('[data-open-dialog]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.openDialog)
    if (!dialog || typeof dialog.showModal !== 'function') return
    trigger.addEventListener('click', () => dialog.showModal())
  })
  $$('dialog').forEach((dialog) => {
    $$('[data-close-dialog]', dialog).forEach((button) => button.addEventListener('click', () => dialog.close()))
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close()
    })
  })
})()
