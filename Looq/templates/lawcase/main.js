(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Footer copyright year stays current
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

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
    }
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'))
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)))
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false)
        menuButton.focus()
      }
    })
    window.matchMedia('(min-width: 48rem)').addEventListener('change', (event) => {
      if (event.matches) setMenu(false)
    })
  }

  // Marquees: duplicate the items once so the track can loop seamlessly
  if (!reduceMotion) {
    document.querySelectorAll('[data-marquee]').forEach((track) => {
      Array.from(track.children).forEach((item) => {
        const clone = item.cloneNode(true)
        clone.setAttribute('aria-hidden', 'true')
        track.appendChild(clone)
      })
      track.classList.add('is-running')
    })
  }

  // Reveals: CSS hides [data-reveal] until it gets .is-revealed. Content already on screen animates
  // in on load (the hero entrance), the rest as it scrolls into view.
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
    }, { rootMargin: '0px 0px -8% 0px' })
    revealed.forEach((el) => observer.observe(el))
  }

  // Counters count up the first time they scroll into view
  const counters = document.querySelectorAll('[data-count]')
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        const el = entry.target
        const target = Number(el.dataset.count)
        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / 1500, 1)
          el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
    }, { threshold: 0.6 })
    counters.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return
      el.textContent = '1'
      observer.observe(el)
    })
  }

  // "Load More": reveal the hidden items, then retire the button
  document.querySelectorAll('[data-load-more]').forEach((button) => {
    const list = button.closest('section').querySelector('[data-load-more-list]')
    if (!list || !list.querySelector(':scope > [hidden]')) {
      button.disabled = true
      button.classList.add('opacity-50', 'cursor-default')
      return
    }
    button.addEventListener('click', () => {
      list.querySelectorAll(':scope > [hidden]').forEach((item) => item.removeAttribute('hidden'))
      button.disabled = true
      button.classList.add('opacity-50', 'cursor-default')
      button.textContent = 'All Loaded'
    })
  })

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

  // Contact form has no backend: show the confirmation instead of submitting
  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      form.reset()
      form.querySelector('[data-form-success]')?.classList.remove('hidden')
    })
  })
})()
