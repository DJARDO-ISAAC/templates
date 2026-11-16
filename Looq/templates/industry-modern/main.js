(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Footer copyright year stays current
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Header: gains a frosted background once the page scrolls
  const header = document.querySelector('[data-header]')
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  // Mobile menu
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
    panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)))
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false)
        menuButton.focus()
      }
    })
    window.matchMedia('(min-width: 64rem)').addEventListener('change', (event) => { if (event.matches) setMenu(false) })
  }

  // Reveal on scroll
  const revealed = document.querySelectorAll('[data-reveal]')
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealed.forEach((el) => el.classList.add('is-revealed'))
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px' })
    revealed.forEach((el) => observer.observe(el))
  }

  // Counters count up the first time they come into view
  const counters = document.querySelectorAll('[data-count]')
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        const el = entry.target
        const target = Number(el.dataset.count)
        const decimals = (el.dataset.count.split('.')[1] || '').length
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / 1600, 1)
          el.textContent = (target * (1 - Math.pow(1 - p, 4))).toFixed(decimals)
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
    }, { threshold: 0.6 })
    counters.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return
      el.textContent = '0'
      observer.observe(el)
    })
  }

  // Logo marquee: duplicate the list once so it can loop seamlessly
  if (!reduceMotion) {
    document.querySelectorAll('[data-marquee]').forEach((track) => {
      const clone = track.firstElementChild.cloneNode(true)
      clone.setAttribute('aria-hidden', 'true')
      track.appendChild(clone)
      track.classList.add('is-running')
    })
  }

  // Tabs (mission / vision / goal) with arrow-key support
  document.querySelectorAll('[data-tabs]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')]
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab
        t.setAttribute('aria-selected', String(on))
        t.tabIndex = on ? 0 : -1
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on
      })
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab))
      tab.addEventListener('keydown', (event) => {
        const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
        if (!step) return
        const next = tabs[(i + step + tabs.length) % tabs.length]
        select(next)
        next.focus()
      })
    })
  })

  // Testimonial switcher
  const quotes = document.querySelectorAll('[data-quote]')
  if (quotes.length) {
    let current = 0
    const show = (n) => {
      current = (n + quotes.length) % quotes.length
      quotes.forEach((q, i) => {
        q.classList.toggle('hidden', i !== current)
        if (i === current && !reduceMotion) q.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' })
      })
    }
    document.querySelector('[data-quote-prev]')?.addEventListener('click', () => show(current - 1))
    document.querySelector('[data-quote-next]')?.addEventListener('click', () => show(current + 1))
  }

  // Project filter
  const filter = document.querySelector('[data-filter]')
  if (filter) {
    const cards = document.querySelectorAll('[data-filter-list] [data-category]')
    const status = document.querySelector('[data-filter-status]')
    filter.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.filterValue
        filter.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === button)))
        let shown = 0
        cards.forEach((card) => {
          const match = value === 'all' || card.dataset.category === value
          card.hidden = !match
          if (match) { shown++; card.classList.add('is-revealed') }
        })
        status.textContent = `${shown} project${shown === 1 ? '' : 's'} shown`
      })
    })
  }

  // Project index: a preview image follows the cursor (pointer devices only)
  const previewList = document.querySelector('[data-preview-list]')
  const previewBox = document.querySelector('[data-preview-box]')
  if (previewList && previewBox && window.matchMedia('(hover: hover) and (min-width: 48rem)').matches && !reduceMotion) {
    const previewImg = previewBox.querySelector('img')
    previewList.querySelectorAll('[data-preview]').forEach((row) => {
      row.addEventListener('mouseenter', () => {
        previewImg.src = row.dataset.preview
        previewBox.classList.add('is-on')
      })
      row.addEventListener('mouseleave', () => previewBox.classList.remove('is-on'))
    })
    previewList.addEventListener('mousemove', (event) => {
      previewBox.style.setProperty('--px', `${event.clientX + 24}px`)
      previewBox.style.setProperty('--py', `${event.clientY - 120}px`)
    })
  }

  // Forms have no backend: confirm instead of submitting
  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      form.reset()
      const note = form.querySelector('[data-form-success]')
      if (note) note.hidden = false
    })
  })
})()
