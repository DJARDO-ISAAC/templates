(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Footer copyright year stays current
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Header: hides while scrolling down, comes back when scrolling up
  const header = document.querySelector('[data-header]')
  const menuButton = document.querySelector('[data-menu-button]')
  const menu = document.getElementById('mobile-menu')
  if (header) {
    let lastY = window.scrollY
    window.addEventListener('scroll', () => {
      const y = window.scrollY
      const menuOpen = menuButton?.getAttribute('aria-expanded') === 'true'
      if (y !== lastY) header.toggleAttribute('data-hidden', !menuOpen && y > 20 && y > lastY)
      lastY = y
    }, { passive: true })
    header.addEventListener('focusin', () => header.removeAttribute('data-hidden'))
  }

  // Mobile menu
  if (menuButton && menu) {
    const setMenu = (open) => {
      menu.classList.toggle('hidden', !open)
      menuButton.setAttribute('aria-expanded', String(open))
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
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
        clone.querySelectorAll('img').forEach((img) => img.setAttribute('alt', ''))
        track.appendChild(clone)
      })
      track.classList.add('is-running')
    })
  }

  // Intro heading: words turn dark one by one as the heading scrolls through the view
  const reveal = document.querySelector('[data-word-reveal]')
  if (reveal && !reduceMotion) {
    reveal.setAttribute('aria-label', reveal.textContent.trim())
    reveal.innerHTML = reveal.textContent.trim().split(/\s+/)
      .map((word) => `<span class="word" aria-hidden="true">${word}</span>`).join(' ')
    const words = reveal.querySelectorAll('.word')
    let queued = false
    const update = () => {
      queued = false
      const rect = reveal.getBoundingClientRect()
      const progress = Math.min(Math.max((window.innerHeight * 0.85 - rect.top) / (rect.height + window.innerHeight * 0.35), 0), 1)
      words.forEach((word, i) => word.classList.toggle('on', i / words.length < progress))
    }
    window.addEventListener('scroll', () => {
      if (!queued) {
        queued = true
        requestAnimationFrame(update)
      }
    }, { passive: true })
    update()
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
          const progress = Math.min((now - start) / 1600, 1)
          el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
    }, { threshold: 0.6 })
    counters.forEach((el) => {
      el.textContent = '0'
      observer.observe(el)
    })
  }

  // Scroll reveals: elements below the fold start hidden and settle in as they enter
  const animated = document.querySelectorAll('[data-anim]')
  if (animated.length && !reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.remove('anim-pending')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -12% 0px' })
    animated.forEach((el) => {
      if (el.dataset.delay) el.style.setProperty('--delay', `${el.dataset.delay}ms`)
      if (el.getBoundingClientRect().top < window.innerHeight * 0.88) return
      el.classList.add('anim-pending')
      observer.observe(el)
    })
  }

  // Scroll-linked effects, batched into one frame
  const parallax = document.querySelector('[data-parallax]')
  const stackCards = Array.from(document.querySelectorAll('[data-stack] .stack-card'))
  stackCards.forEach((card, i) => card.style.setProperty('--n', i))
  if (!reduceMotion && (parallax || stackCards.length)) {
    let queued = false
    const update = () => {
      queued = false
      // Hero copy drifts down at 0.4x the scroll speed while the hero is on screen
      if (parallax && window.scrollY < window.innerHeight * 1.2) {
        parallax.style.transform = `translateY(${window.scrollY * Number(parallax.dataset.parallax)}px)`
      }
      // Each stacked card shrinks by 10% for every card that slides over it
      stackCards.forEach((card, i) => {
        let covered = 0
        for (let j = i + 1; j < stackCards.length; j++) {
          const next = stackCards[j]
          const stickTop = parseFloat(getComputedStyle(next).top)
          const travel = next.offsetHeight
          covered += Math.min(Math.max(1 - (next.getBoundingClientRect().top - stickTop) / travel, 0), 1)
        }
        card.style.transform = covered ? `scale(${1 - covered * 0.1})` : ''
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

  // Estimate form has no backend: validate, then show a confirmation
  const form = document.querySelector('[data-estimate-form]')
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const valid = form.checkValidity()
      form.querySelector('[data-error]').classList.toggle('hidden', valid)
      form.querySelector('[data-success]').classList.toggle('hidden', !valid)
      if (valid) form.reset()
      else form.querySelector(':invalid')?.focus()
    })
  }
})()
