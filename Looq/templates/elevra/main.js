(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const desktop = window.matchMedia('(min-width: 75rem)')

  // Footer copyright year stays current
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Phone menu: a full-screen panel. The page behind it stops scrolling while it is open.
  const header = document.querySelector('[data-header]')
  const menuButton = document.querySelector('[data-menu-button]')
  if (header && menuButton) {
    const panel = document.getElementById('mobile-menu')
    const setMenu = (open) => {
      header.classList.toggle('menu-open', open)
      menuButton.setAttribute('aria-expanded', String(open))
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
      panel.inert = !open
      document.documentElement.style.overflow = open ? 'hidden' : ''
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
    window.matchMedia('(min-width: 50.625rem)').addEventListener('change', (event) => { if (event.matches) setMenu(false) })
  }

  // Bottom edge blur: slides off screen over the last 100px of the page, so it never covers the
  // end of the footer. Moved with a transform because opacity would switch the blur itself off.
  const edgeBlur = document.querySelector('.edge-blur')
  if (edgeBlur) {
    let ticking = false
    const update = () => {
      ticking = false
      const remaining = document.documentElement.scrollHeight - window.innerHeight - window.scrollY
      edgeBlur.style.transform = `translateY(${Math.max(0, 100 - remaining)}px)`
    }
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    window.addEventListener('load', update)
    update()
  }

  // Counters climb from zero the first time they come into view
  const startCount = (el) => {
    const target = Number(el.dataset.count)
    const decimals = (el.dataset.count.split('.')[1] || '').length
    if (reduceMotion) { el.textContent = target.toFixed(decimals); return }
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / 1500, 1)
      el.textContent = (target * (1 - Math.pow(1 - t, 3))).toFixed(decimals)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
  const counters = document.querySelectorAll('[data-count]')
  if (counters.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach((el) => { el.textContent = el.dataset.count })
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          observer.unobserve(entry.target)
          startCount(entry.target)
        })
      }, { threshold: 0.4 })
      counters.forEach((el) => {
        el.textContent = (0).toFixed((el.dataset.count.split('.')[1] || '').length)
        observer.observe(el)
      })
    }
  }

  // Entrances: CSS hides [data-reveal] until it gets .is-revealed
  const revealed = document.querySelectorAll('[data-reveal], .chart')
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealed.forEach((el) => el.classList.add('is-revealed'))
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      })
    })
    revealed.forEach((el) => observer.observe(el))
  }

  // Service stack (from 1200px): an incoming card is up to 4.7% larger and settles as it arrives.
  // Fitted to the original: full size for the last 150px of travel, growing linearly before that.
  const stack = [...document.querySelectorAll('.stack-card')]
  if (stack.length && !reduceMotion) {
    let ticking = false
    const update = () => {
      ticking = false
      if (!desktop.matches) {
        stack.forEach((card) => card.style.removeProperty('--s'))
        return
      }
      stack.forEach((card) => {
        const distance = Math.max(0, card.getBoundingClientRect().top - 120)
        const scale = 1 + Math.min(0.047, Math.max(0, distance - 150) * 0.000065)
        card.style.setProperty('--s', scale.toFixed(4))
      })
    }
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    update()
  }

  // Process steps: the first holds for 5s and the rest for 3s, as in the original. Rotation runs
  // only while the section is on screen, and stops for good once someone picks a step.
  document.querySelectorAll('[data-steps]').forEach((list) => {
    const steps = [...list.querySelectorAll('[data-step]')]
    let current = 0
    let timer = null
    let stopped = reduceMotion
    const show = (n) => {
      current = n
      steps.forEach((step, i) => {
        step.toggleAttribute('data-active', i === n)
        step.querySelector('button').setAttribute('aria-expanded', String(i === n))
      })
    }
    const schedule = () => {
      clearTimeout(timer)
      if (stopped) return
      timer = setTimeout(() => { show((current + 1) % steps.length); schedule() }, current === 0 ? 5000 : 3000)
    }
    steps.forEach((step, i) => step.querySelector('button').addEventListener('click', () => {
      stopped = true
      clearTimeout(timer)
      show(i)
    }))
    show(0)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) schedule()
        else clearTimeout(timer)
      }).observe(list)
    } else {
      schedule()
    }
  })

  // Tickers: duplicate the items once so the track loops seamlessly at a steady speed
  if (!reduceMotion) {
    document.querySelectorAll('[data-ticker]').forEach((track) => {
      const list = track.firstElementChild
      const clone = list.cloneNode(true)
      clone.setAttribute('aria-hidden', 'true')
      clone.querySelectorAll('a').forEach((a) => { a.tabIndex = -1 })
      track.appendChild(clone)
      track.style.setProperty('--speed', `${Math.round(list.scrollWidth / Number(track.dataset.ticker || 40))}s`)
      track.classList.add('is-running')
    })
  }

  // FAQ accordion: one question open at a time
  document.querySelectorAll('[data-faq]').forEach((list) => {
    const items = [...list.querySelectorAll('[data-faq-item]')]
    items.forEach((item) => {
      const button = item.querySelector('button')
      button.addEventListener('click', () => {
        const open = !item.hasAttribute('data-open')
        items.forEach((other) => {
          other.toggleAttribute('data-open', other === item && open)
          other.querySelector('button').setAttribute('aria-expanded', String(other === item && open))
        })
      })
    })
  })

  // Insights filter
  const filter = document.querySelector('[data-filter]')
  if (filter) {
    const cards = document.querySelectorAll('[data-filter-list] [data-category]')
    const status = document.querySelector('[data-filter-status]')
    filter.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.value
        filter.querySelectorAll('button').forEach((b) => {
          const on = b === button
          b.setAttribute('aria-pressed', String(on))
          b.classList.toggle('bg-ink', on)
          b.classList.toggle('text-white', on)
          b.classList.toggle('border-ink', on)
        })
        let shown = 0
        cards.forEach((card) => {
          const match = value === 'all' || card.dataset.category === value
          card.hidden = !match
          if (match) { shown++; card.classList.add('is-revealed') }
        })
        status.textContent = `${shown} article${shown === 1 ? '' : 's'} shown`
      })
    })
  }

  // "How we work" film: there is no video in the template, so the play button just pauses the drift
  document.querySelectorAll('[data-play]').forEach((button) => {
    const media = button.parentElement.querySelector('.drift')
    if (!media) return
    button.addEventListener('click', () => {
      const paused = media.style.animationPlayState === 'paused'
      media.style.animationPlayState = paused ? 'running' : 'paused'
      button.setAttribute('aria-pressed', String(!paused))
      button.setAttribute('aria-label', paused ? 'Pause motion' : 'Play motion')
    })
  })

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
