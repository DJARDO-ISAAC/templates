(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const $ = (selector, root = document) => root.querySelector(selector)
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector))

  // Footer copyright year stays current.
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Header: gains a solid, blurred background once the page scrolls.
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
    let menuOpen = false

    const setMenu = (open, returnFocus = false) => {
      menuOpen = open
      header.classList.toggle('menu-open', open)
      menuPanel.classList.toggle('is-open', open)
      menuButton.setAttribute('aria-expanded', String(open))
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
      document.body.classList.toggle('menu-open', open)

      if (open) {
        menuPanel.inert = false
        const first = menuPanel.querySelector('a, button')
        if (first) window.setTimeout(() => first.focus(), 80)
      } else {
        menuPanel.inert = true
        if (returnFocus) menuButton.focus()
      }
    }

    menuPanel.inert = true
    menuButton.addEventListener('click', () => setMenu(!menuOpen))
    $$('a', menuPanel).forEach((link) => link.addEventListener('click', () => setMenu(false)))
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuOpen) setMenu(false, true)
    })
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && menuOpen) setMenu(false)
    })
  }

  // Scroll reveals.
  const revealItems = $$('[data-reveal]')
  if (revealItems.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((el) => el.classList.add('is-visible'))
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        })
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
      revealItems.forEach((el) => revealObserver.observe(el))
    }
  }

  // Counters.
  const counters = $$('[data-count]')
  if (counters.length) {
    const format = (value) => value.toLocaleString('en-GB')
    const runCounter = (el) => {
      const target = Number(el.dataset.count)
      if (!Number.isFinite(target)) return
      if (reduceMotion) {
        el.textContent = format(target)
        return
      }
      const duration = 1400
      const start = performance.now()
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        el.textContent = format(Math.round(target * eased))
        if (progress < 1) window.requestAnimationFrame(tick)
      }
      window.requestAnimationFrame(tick)
    }

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          runCounter(entry.target)
          counterObserver.unobserve(entry.target)
        })
      }, { threshold: 0.6 })
      counters.forEach((el) => counterObserver.observe(el))
    } else {
      counters.forEach(runCounter)
    }
  }

  // Client marquee: clone the group enough times to loop seamlessly.
  const marqueeTrack = $('[data-marquee-track]')
  if (marqueeTrack) {
    const original = $('.marquee-group', marqueeTrack)
    if (original) {
      const fill = () => {
        const groupWidth = original.getBoundingClientRect().width
        if (!groupWidth) return
        const needed = Math.max(2, Math.ceil(window.innerWidth / groupWidth) * 2)
        $$('.marquee-group', marqueeTrack).forEach((group, index) => {
          if (index > 0) group.remove()
        })
        for (let i = 1; i < needed; i++) {
          const clone = original.cloneNode(true)
          clone.setAttribute('aria-hidden', 'true')
          marqueeTrack.appendChild(clone)
        }
        marqueeTrack.style.animation = 'none'
        void marqueeTrack.offsetWidth
        marqueeTrack.style.animation = ''
      }

      fill()
      if (document.fonts?.ready) document.fonts.ready.then(fill)

      let resizeTimer
      window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimer)
        resizeTimer = window.setTimeout(fill, 200)
      })
    }
  }

  // Dialogs.
  const dialogs = $$('dialog.dialog')
  const openDialog = (dialog) => {
    if (!dialog || typeof dialog.showModal !== 'function') return
    dialog.showModal()
    document.body.classList.add('has-dialog')
  }
  const closeDialog = (dialog) => {
    if (dialog?.open) dialog.close()
  }

  $$('[data-dialog-open]').forEach((button) => {
    button.addEventListener('click', () => openDialog($(button.dataset.dialogOpen)))
  })
  $$('[data-dialog-close]').forEach((button) => {
    button.addEventListener('click', () => closeDialog(button.closest('dialog')))
  })
  dialogs.forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close()
    })
    dialog.addEventListener('close', () => {
      if (!dialogs.some((item) => item.open)) document.body.classList.remove('has-dialog')
    })
  })

  $$('[data-dialog-cta]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = $(button.dataset.dialogCta)
      closeDialog(button.closest('dialog'))
      if (!target) return
      window.setTimeout(() => {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
        const nameField = $('#name')
        if (nameField) window.setTimeout(() => nameField.focus({ preventScroll: true }), 450)
      }, 60)
    })
  })

  // Sector tiles preselect the enquiry form and take the visitor there.
  const sectorSelect = $('#sector')
  const sectorTriggers = $$('[data-sector]')
  if (sectorSelect && sectorTriggers.length) {
    sectorTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        const value = trigger.dataset.sector
        if (!value) return
        const option = Array.from(sectorSelect.options).find((item) => item.value === value)
        if (option) sectorSelect.value = value
        sectorSelect.classList.add('is-set')
        window.setTimeout(() => sectorSelect.classList.remove('is-set'), 1800)

        if (trigger.tagName === 'A') event.preventDefault()
        const contact = $('#contact')
        if (!contact) return
        contact.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
        const nameField = $('#name')
        if (nameField) window.setTimeout(() => nameField.focus({ preventScroll: true }), 500)
      })
    })
  }

  // Enquiry form: inline validation and a local success state.
  const form = $('[data-form]')
  const success = $('[data-form-success]')
  if (form && success) {
    const fields = $$('input, select, textarea', form)

    const setError = (field, message) => {
      const error = document.getElementById(`${field.id}-error`)
      const wrap = field.closest('.field')
      if (wrap) wrap.classList.toggle('is-invalid', Boolean(message))
      field.setAttribute('aria-invalid', message ? 'true' : 'false')
      if (error) {
        error.textContent = message
        error.hidden = !message
      }
    }

    const validate = (field) => {
      const value = field.value.trim()
      if (field.required && !value) return 'This field is required.'
      if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Enter a valid email address.'
      }
      if (field.type === 'tel' && value && value.replace(/[^\d]/g, '').length < 9) {
        return 'Enter a phone number with at least 9 digits.'
      }
      return ''
    }

    const check = (field) => {
      const message = validate(field)
      setError(field, message)
      return !message
    }

    fields.forEach((field) => {
      field.addEventListener('blur', () => check(field))
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') check(field)
      })
      field.addEventListener('change', () => {
        if (field.getAttribute('aria-invalid') === 'true') check(field)
      })
    })

    form.addEventListener('submit', (event) => {
      event.preventDefault()
      let firstInvalid = null
      fields.forEach((field) => {
        if (!check(field) && !firstInvalid) firstInvalid = field
      })
      if (firstInvalid) {
        firstInvalid.focus()
        return
      }
      form.hidden = true
      success.hidden = false
      success.focus({ preventScroll: true })
      success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
    })

    const resetButton = $('[data-form-reset]')
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        form.reset()
        fields.forEach((field) => setError(field, ''))
        success.hidden = true
        form.hidden = false
        const nameField = $('#name')
        if (nameField) nameField.focus()
      })
    }
  }
})()
