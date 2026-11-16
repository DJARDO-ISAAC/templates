(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
    window.matchMedia('(min-width: 64rem)').addEventListener('change', (event) => {
      if (event.matches) setMenu(false)
    })
  }

  // Hero carousel: slides one card every 2.5s and loops without a visible jump.
  // The track holds four copies of the cards; it starts on the second copy and
  // snaps back by one copy (with the transition off) whenever it reaches the fourth.
  const carousel = document.querySelector('[data-hero-carousel]')
  if (carousel) {
    const track = carousel.querySelector('[data-hero-track]')
    const cards = Array.from(track.children)
    const perCopy = cards.length / 4
    let active = perCopy
    const step = () => cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left
    const place = (animate) => {
      track.style.transition = animate ? '' : 'none'
      const peek = carousel.clientWidth > 500 ? 0.86 : 0
      track.style.transform = `translateX(${-(active - peek) * step()}px)`
      cards.forEach((card, i) => card.toggleAttribute('data-active', i === active))
      if (!animate) void track.offsetWidth
    }
    place(false)
    window.addEventListener('resize', () => place(false))
    if (!reduceMotion) {
      track.addEventListener('transitionend', (event) => {
        if (event.target !== track || active < perCopy * 3) return
        active -= perCopy
        place(false)
      })
      let timer = setInterval(() => {
        active += 1
        place(true)
      }, 2500)
      document.addEventListener('visibilitychange', () => {
        clearInterval(timer)
        if (!document.hidden) {
          timer = setInterval(() => {
            active += 1
            place(true)
          }, 2500)
        }
      })
    }
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

  // Scroll reveals: each section's content rises in as it enters the viewport
  const revealed = document.querySelectorAll('[data-reveal]')
  if (revealed.length && !reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.remove('reveal-pending')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -10% 0px' })
    revealed.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return
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
})()
