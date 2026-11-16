(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Footer copyright year stays current
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Mobile menu: the header grows to show the links and pushes the page down
  const header = document.querySelector('[data-header]')
  const menuButton = document.querySelector('[data-menu-button]')
  if (header && menuButton) {
    const panel = document.getElementById('mobile-menu')
    const setMenu = (open) => {
      header.classList.toggle('menu-open', open)
      menuButton.setAttribute('aria-expanded', String(open))
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
      panel.inert = !open
    }
    panel.inert = true
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'))
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false)
        menuButton.focus()
      }
    })
    window.matchMedia('(min-width: 75rem)').addEventListener('change', (event) => {
      if (event.matches) setMenu(false)
    })
  }

  // Reveals: CSS hides [data-reveal] until it gets .is-revealed. Content on screen at load
  // animates in straight away, the rest once it is well inside the viewport.
  const revealed = document.querySelectorAll('[data-reveal]')
  if (!('IntersectionObserver' in window)) {
    revealed.forEach((el) => el.classList.add('is-revealed'))
  } else if (revealed.length && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -12% 0px' })
    revealed.forEach((el) => observer.observe(el))
  }

  // Scroll-linked effects: the hero insets hold their place on screen while the photo band
  // scrolls past them (the band clips them), and the "LX" badge turns as the page scrolls.
  const insets = document.querySelectorAll('[data-hold]')
  const badge = document.querySelector('[data-spin]')
  if ((insets.length || badge) && !reduceMotion) {
    let ticking = false
    const update = () => {
      ticking = false
      const y = window.scrollY
      insets.forEach((el) => { el.style.transform = `translate3d(0, ${(y * Number(el.dataset.hold)).toFixed(1)}px, 0)` })
      if (badge) {
        const start = badge.parentElement.getBoundingClientRect().top + y - window.innerHeight
        badge.style.transform = `rotate(${(Math.max(0, y - start) * 0.034).toFixed(2)}deg)`
      }
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update) }
    }, { passive: true })
    window.addEventListener('resize', update)
    update()
  }

  // FAQ accordion: each question opens and closes on its own
  document.querySelectorAll('[data-faq-item]').forEach((item) => {
    const button = item.querySelector('button')
    button.addEventListener('click', () => {
      const open = !item.hasAttribute('data-open')
      item.toggleAttribute('data-open', open)
      button.setAttribute('aria-expanded', String(open))
    })
  })

  // Case studies filter: shows only the matters in the chosen category
  const filter = document.querySelector('[data-case-filter]')
  if (filter) {
    const cards = document.querySelectorAll('[data-category]')
    const status = document.querySelector('[data-filter-status]')
    const apply = () => {
      let shown = 0
      cards.forEach((card) => {
        const match = filter.value === 'all' || card.dataset.category === filter.value
        card.hidden = !match
        if (match) {
          shown++
          card.classList.add('is-revealed')
        }
      })
      if (status) status.textContent = shown ? `${shown} matter${shown === 1 ? '' : 's'} shown` : 'No matters in this category yet.'
    }
    filter.addEventListener('change', apply)
    apply()
  }

  // Forms have no backend: confirm instead of submitting
  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      form.reset()
      const note = form.querySelector('[data-form-success]') || form.parentElement.querySelector('[data-form-success]')
      if (note) note.hidden = false
    })
  })
})()
