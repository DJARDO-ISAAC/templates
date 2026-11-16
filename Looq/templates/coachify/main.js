(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Footer copyright year stays current
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Header background once the page scrolls
  const header = document.querySelector('[data-header]')
  if (header) {
    const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  // Mobile menu
  const menuButton = document.querySelector('[data-menu-button]')
  const menu = document.getElementById('mobile-menu')
  if (menuButton && menu) {
    const setMenu = (open) => {
      menu.classList.toggle('hidden', !open)
      menuButton.setAttribute('aria-expanded', String(open))
      menuButton.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu'
      menuButton.querySelector('[data-menu-open]').classList.toggle('hidden', open)
      menuButton.querySelector('[data-menu-close]').classList.toggle('hidden', !open)
      if (open) header.setAttribute('data-scrolled', '')
    }
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'))
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)))
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false)
        menuButton.focus()
      }
    })
    window.matchMedia('(min-width: 64rem)').addEventListener('change', (event) => {
      if (event.matches) setMenu(false)
    })
  }

  // Carousels: the arrow moves one card, and wraps back to the start at the end
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]')
    const next = carousel.querySelector('[data-carousel-next]')
    next.addEventListener('click', () => {
      const card = track.firstElementChild
      const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0)
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step, behavior: reduceMotion ? 'auto' : 'smooth' })
    })
  })

  // Process timeline: each line fills as the reader scrolls past it
  const lines = document.querySelectorAll('[data-timeline]')
  if (lines.length) {
    let queued = false
    const update = () => {
      queued = false
      const focus = window.innerHeight * 0.6
      lines.forEach((fill) => {
        const rect = fill.parentElement.getBoundingClientRect()
        const progress = Math.min(Math.max((focus - rect.top) / rect.height, 0), 1)
        fill.style.setProperty('--progress', progress.toFixed(3))
      })
    }
    const queue = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(update)
    }
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    update()
  }

  // Scroll reveal, only for elements that start below the fold
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.remove('reveal-pending')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return
      el.classList.add('reveal-pending')
      observer.observe(el)
    })
  }

  // Book a call: every [data-book-call] link opens the dialog (without JS it still jumps to #contact)
  const dialog = document.getElementById('book-call')
  if (dialog && typeof dialog.showModal === 'function') {
    const form = dialog.querySelector('[data-bk-form]')
    const formView = dialog.querySelector('[data-bk-view="form"]')
    const doneView = dialog.querySelector('[data-bk-view="done"]')
    const submit = form.querySelector('[type="submit"]')
    let opener = null

    const reset = () => {
      form.reset()
      form.querySelectorAll('.is-invalid').forEach((field) => field.classList.remove('is-invalid'))
      formView.hidden = false
      doneView.hidden = true
      submit.removeAttribute('aria-busy')
      submit.disabled = false
    }
    const open = (trigger) => {
      opener = trigger
      reset()
      dialog.classList.remove('is-closing')
      dialog.showModal()
      dialog.scrollTop = 0
    }
    const close = () => {
      if (!dialog.open || dialog.classList.contains('is-closing')) return
      if (reduceMotion) { dialog.close(); return }
      dialog.classList.add('is-closing')
      dialog.addEventListener('animationend', () => { dialog.classList.remove('is-closing'); dialog.close() }, { once: true })
    }

    document.querySelectorAll('[data-book-call]').forEach((link) => {
      link.addEventListener('click', (event) => { event.preventDefault(); open(link) })
    })
    dialog.querySelectorAll('[data-bk-close]').forEach((button) => button.addEventListener('click', close))
    // Escape: play the closing animation instead of snapping shut
    dialog.addEventListener('cancel', (event) => { event.preventDefault(); close() })
    // A click on the backdrop (outside the panel) closes it
    dialog.addEventListener('click', (event) => { if (event.target === dialog) close() })
    dialog.addEventListener('close', () => { if (opener && document.contains(opener)) opener.focus() })

    // Validation: errors show after a submit attempt, then update as the visitor fixes them
    const fields = [...form.querySelectorAll('.bk-field')].filter((field) => field.querySelector('[required]'))
    const validate = (field) => {
      const controls = [...field.querySelectorAll('input, select, textarea')]
      const ok = controls.every((control) => control.checkValidity())
      field.classList.toggle('is-invalid', !ok)
      controls.forEach((control) => control.setAttribute('aria-invalid', String(!ok)))
      return ok
    }
    form.addEventListener('input', (event) => {
      const field = event.target.closest('.bk-field')
      if (field && field.classList.contains('is-invalid')) validate(field)
    })
    form.addEventListener('change', (event) => {
      const field = event.target.closest('.bk-field')
      if (field && field.classList.contains('is-invalid')) validate(field)
    })

    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const invalid = fields.filter((field) => !validate(field))
      if (invalid.length) {
        invalid[0].querySelector('input, select, textarea').focus()
        return
      }
      const data = new FormData(form)
      submit.setAttribute('aria-busy', 'true')
      submit.disabled = true
      // Demo only: connect this to your booking tool or form service (Calendly, Formspree, etc.)
      setTimeout(() => {
        dialog.querySelector('[data-bk-name]').textContent = String(data.get('name')).trim().split(/\s+/)[0]
        dialog.querySelector('[data-bk-email]').textContent = String(data.get('email')).trim()
        formView.hidden = true
        doneView.hidden = false
        dialog.scrollTop = 0
        doneView.focus()
      }, 700)
    })
  }

  // FAQ accordion, one item open at a time
  const faqItems = document.querySelectorAll('[data-faq-item]')
  faqItems.forEach((item) => {
    const button = item.querySelector('button')
    button.addEventListener('click', () => {
      const wasOpen = item.hasAttribute('data-open')
      faqItems.forEach((other) => {
        other.removeAttribute('data-open')
        other.querySelector('button').setAttribute('aria-expanded', 'false')
      })
      if (!wasOpen) {
        item.setAttribute('data-open', '')
        button.setAttribute('aria-expanded', 'true')
      }
    })
  })
})()
