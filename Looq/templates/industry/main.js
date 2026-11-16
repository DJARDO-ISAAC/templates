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

  // "Pages" dropdown: opens on click or hover, closes on outside click or Escape
  document.querySelectorAll('[data-dropdown]').forEach((dropdown) => {
    const button = dropdown.querySelector('button')
    const list = document.getElementById(button.getAttribute('aria-controls'))
    const setOpen = (open) => {
      list.classList.toggle('hidden', !open)
      button.setAttribute('aria-expanded', String(open))
    }
    button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'))
    dropdown.addEventListener('mouseenter', () => setOpen(true))
    dropdown.addEventListener('mouseleave', () => setOpen(false))
    dropdown.addEventListener('focusout', (event) => {
      if (!dropdown.contains(event.relatedTarget)) setOpen(false)
    })
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        setOpen(false)
        button.focus()
      }
    })
  })

  // Carousels: arrows scroll the track by one item
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]')
    const scrollByItem = (direction) => {
      const item = track.firstElementChild
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      track.scrollBy({ left: direction * (item.getBoundingClientRect().width + gap), behavior: reduceMotion ? 'auto' : 'smooth' })
    }
    carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => scrollByItem(-1))
    carousel.querySelector('[data-carousel-next]').addEventListener('click', () => scrollByItem(1))
  })

  // Testimonial slider: one quote visible, arrows wrap around
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.slide'))
    let current = slides.findIndex((slide) => slide.hasAttribute('data-active'))
    const show = (index) => {
      slides[current].removeAttribute('data-active')
      current = (index + slides.length) % slides.length
      slides[current].setAttribute('data-active', '')
    }
    slider.querySelector('[data-slide-prev]').addEventListener('click', () => show(current - 1))
    slider.querySelector('[data-slide-next]').addEventListener('click', () => show(current + 1))
  })

  // Tabs (About page): click or arrow keys
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const tabs = Array.from(group.querySelectorAll('[role="tab"]'))
    const select = (tab) => {
      tabs.forEach((other) => {
        const selected = other === tab
        other.setAttribute('aria-selected', String(selected))
        other.tabIndex = selected ? 0 : -1
        document.getElementById(other.getAttribute('aria-controls')).toggleAttribute('data-active', selected)
      })
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab))
      tab.addEventListener('keydown', (event) => {
        const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
        if (!step) return
        const next = tabs[(index + step + tabs.length) % tabs.length]
        select(next)
        next.focus()
      })
    })
  })

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

  // Forms have no backend: show the confirmation message instead of submitting
  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      form.reset()
      const success = form.querySelector('[data-form-success]')
      if (success) success.classList.remove('hidden')
    })
  })

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
})()
