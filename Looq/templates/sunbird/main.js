(() => {
  'use strict'

  const root = document.documentElement
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Footer copyright year stays current
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Loading bars lift once the page has loaded, and the hero entrance starts from there.
  // The timer is a backstop for a slow image, so nobody is left looking at the bars.
  const ready = () => root.classList.add('is-ready')
  const shownAt = performance.now()
  const lift = () => setTimeout(ready, Math.max(0, 600 - (performance.now() - shownAt)))
  if (document.readyState === 'complete') lift()
  else window.addEventListener('load', lift)
  setTimeout(ready, 3500)

  // Header picks up a shadow and tightens once the page scrolls; back-to-top button appears further down
  const header = document.querySelector('[data-header]')
  const toTop = document.querySelector('[data-to-top]')
  const onScroll = () => {
    header?.classList.toggle('is-stuck', window.scrollY > 8)
    toTop?.classList.toggle('is-on', window.scrollY > 500)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }))

  // Search panel drops down from the round button
  const searchButton = document.querySelector('[data-search-button]')
  const searchPanel = document.querySelector('[data-search-panel]')
  if (searchButton && searchPanel) {
    const setSearch = (open) => {
      searchPanel.classList.toggle('is-open', open)
      searchButton.setAttribute('aria-expanded', String(open))
      searchButton.setAttribute('aria-label', open ? 'Close search' : 'Open search')
      searchButton.querySelector('[data-icon-search]').toggleAttribute('hidden', open)
      searchButton.querySelector('[data-icon-close]').toggleAttribute('hidden', !open)
      if (open) searchPanel.querySelector('input').focus()
    }
    searchButton.addEventListener('click', () => setSearch(searchButton.getAttribute('aria-expanded') !== 'true'))
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && searchButton.getAttribute('aria-expanded') === 'true') {
        setSearch(false)
        searchButton.focus()
      }
    })
    document.addEventListener('click', (event) => {
      if (searchButton.getAttribute('aria-expanded') === 'true' && !searchPanel.contains(event.target) && !searchButton.contains(event.target)) setSearch(false)
    })
  }

  // Phone menu: a panel slides in from the left and the page behind it stops scrolling
  const menuButton = document.querySelector('[data-menu-button]')
  const drawer = document.getElementById('mobile-menu')
  if (menuButton && drawer) {
    const closeButton = drawer.querySelector('[data-menu-close]')
    const setMenu = (open) => {
      root.classList.toggle('menu-open', open)
      menuButton.setAttribute('aria-expanded', String(open))
      drawer.inert = !open
      root.style.overflow = open ? 'hidden' : ''
      if (open) closeButton.focus()
    }
    drawer.inert = true
    menuButton.addEventListener('click', () => setMenu(true))
    closeButton.addEventListener('click', () => { setMenu(false); menuButton.focus() })
    document.querySelector('[data-menu-scrim]').addEventListener('click', () => setMenu(false))
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && root.classList.contains('menu-open')) {
        setMenu(false)
        menuButton.focus()
      }
    })
    window.matchMedia('(min-width: 64rem)').addEventListener('change', (event) => { if (event.matches) setMenu(false) })
  }

  // Page banner doodles drift gently against the pointer, as the original's parallax layer does
  const doodles = document.querySelector('[data-doodles]')
  if (doodles && !reduceMotion && window.matchMedia('(hover: hover) and (min-width: 64rem)').matches) {
    const banner = doodles.parentElement
    banner.addEventListener('mousemove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * -24
      const y = (event.clientY / window.innerHeight - 0.5) * -24
      doodles.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
    })
    banner.addEventListener('mouseleave', () => { doodles.style.transform = '' })
  }

  // Carousels: native scroll-snap with dots. Dots only appear when there is more than one page.
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track')
    const dots = carousel.querySelector('.carousel-dots')
    const slides = [...track.children]
    let timer = null
    const goTo = (i) => track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' })
    const current = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth + 30))
    const paint = () => [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === current())))
    const build = () => {
      const multiple = track.scrollWidth > track.clientWidth + 2
      dots.hidden = !multiple
      dots.replaceChildren(...(multiple ? slides.map((_, i) => {
        const dot = document.createElement('button')
        dot.type = 'button'
        dot.setAttribute('aria-label', `Show quote ${i + 1}`)
        dot.addEventListener('click', () => { stop(); goTo(i) })
        return dot
      }) : []))
      paint()
    }
    const stop = () => { clearInterval(timer); timer = null }
    const start = () => {
      if (reduceMotion || !('autoplay' in carousel.dataset) || timer) return
      timer = setInterval(() => {
        if (track.scrollWidth > track.clientWidth + 2) goTo((current() + 1) % slides.length)
      }, 6000)
    }
    track.addEventListener('scroll', paint, { passive: true })
    window.addEventListener('resize', build)
    carousel.addEventListener('mouseenter', stop)
    carousel.addEventListener('mouseleave', start)
    carousel.addEventListener('focusin', stop)
    carousel.addEventListener('focusout', start)
    build()
    start()
  })

  // Tabs with arrow-key support
  document.querySelectorAll('[data-tabs]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')]
    const select = (tab) => tabs.forEach((t) => {
      const on = t === tab
      t.setAttribute('aria-selected', String(on))
      t.tabIndex = on ? 0 : -1
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on
    })
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

  // Photo gallery lightbox
  const lightbox = document.querySelector('[data-lightbox]')
  if (lightbox) {
    const img = lightbox.querySelector('img')
    const caption = lightbox.querySelector('p')
    document.querySelectorAll('[data-photo]').forEach((button) => {
      button.addEventListener('click', () => {
        img.src = button.dataset.photo
        img.alt = button.dataset.caption
        caption.textContent = button.dataset.caption
        lightbox.showModal()
      })
    })
    lightbox.querySelector('button').addEventListener('click', () => lightbox.close())
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close() })
  }

  // Blog: load more, plus results for the header search
  const postList = document.querySelector('[data-post-list]')
  if (postList) {
    const cards = [...postList.children]
    const moreButton = document.querySelector('[data-load-more]')
    const status = document.querySelector('[data-post-status]')
    const heading = document.querySelector('[data-post-heading]')
    const pageSize = 6
    let visible = pageSize
    const query = (new URLSearchParams(window.location.search).get('q') || '').trim()
    const showPage = () => {
      cards.forEach((card, i) => { card.hidden = i >= visible })
      moreButton.hidden = visible >= cards.length
    }
    if (query) {
      const words = query.toLowerCase().split(/\s+/)
      let shown = 0
      cards.forEach((card) => {
        const text = card.textContent.toLowerCase()
        const match = words.every((word) => text.includes(word))
        card.hidden = !match
        if (match) shown++
      })
      moreButton.hidden = true
      status.textContent = shown
        ? `${shown} result${shown === 1 ? '' : 's'} for "${query}"`
        : `Nothing found for "${query}". Try another word, like "stories" or "camp".`
      status.hidden = false
      heading.textContent = 'Search results'
    } else {
      showPage()
      moreButton.addEventListener('click', () => {
        const next = cards[visible]
        visible += pageSize
        showPage()
        next?.querySelector('a')?.focus()
      })
    }
  }

  // Like button keeps its count for this visit
  document.querySelectorAll('[data-like]').forEach((button) => {
    const count = button.querySelector('span')
    button.addEventListener('click', () => {
      const on = button.getAttribute('aria-pressed') !== 'true'
      button.setAttribute('aria-pressed', String(on))
      count.textContent = Number(count.textContent) + (on ? 1 : -1)
    })
  })

  // Share button copies the page address
  document.querySelectorAll('[data-share]').forEach((button) => {
    button.addEventListener('click', async () => {
      const label = button.querySelector('span')
      try {
        await navigator.clipboard.writeText(window.location.href)
        label.textContent = 'Link copied'
      } catch {
        label.textContent = 'Copy the page address to share'
      }
    })
  })

  // Episode players have no video in the template, so the button says where one goes
  document.querySelectorAll('[data-player]').forEach((button) => {
    button.addEventListener('click', () => {
      const note = button.parentElement.querySelector('[data-player-note]')
      if (note) note.hidden = false
    })
  })

  // Contact form opens on the topic a link asked for, such as contact?topic=camps
  const topicSelect = document.querySelector('[data-topic]')
  if (topicSelect) {
    const topic = new URLSearchParams(window.location.search).get('topic')
    if (topic && [...topicSelect.options].some((option) => option.value === topic)) topicSelect.value = topic
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
