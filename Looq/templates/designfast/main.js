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
        clone.querySelectorAll('img').forEach((img) => img.setAttribute('alt', ''))
        track.appendChild(clone)
      })
      track.classList.add('is-running')
    })
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

  // Testimonial carousel
  const slideWrap = document.querySelector('[data-slides]')
  const nextButton = document.querySelector('[data-slide-next]')
  if (slideWrap && nextButton) {
    const slides = Array.from(slideWrap.children)
    let current = 0
    let timer

    const show = (index) => {
      slides[current].removeAttribute('data-active')
      current = (index + slides.length) % slides.length
      slides[current].setAttribute('data-active', '')
    }
    const start = () => {
      if (reduceMotion) return
      clearInterval(timer)
      timer = setInterval(() => show(current + 1), 6000)
    }
    const stop = () => clearInterval(timer)

    nextButton.addEventListener('click', () => {
      show(current + 1)
      start()
    })
    const card = slideWrap.parentElement
    card.addEventListener('mouseenter', stop)
    card.addEventListener('mouseleave', start)
    card.addEventListener('focusin', stop)
    card.addEventListener('focusout', start)
    start()
  }
})()
