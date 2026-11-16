(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const tablet = window.matchMedia('(min-width: 50.625rem)')

  // Footer copyright year stays current
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Header: from 810px the open bar tightens into a floating pill once the page scrolls. On the home
  // page that happens together with the hero's second state, elsewhere after a short scroll.
  const header = document.querySelector('[data-header]')
  const hero = document.querySelector('[data-hero]')

  // Mobile menu: the pill grows downwards to show the links
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
    tablet.addEventListener('change', (event) => { if (event.matches) setMenu(false) })
  }

  // Page colour: each [data-bg-marker] switches the body colour once it passes the middle of the screen
  const markers = [...document.querySelectorAll('[data-bg-marker]')]
  const baseBg = document.body.dataset.bg

  // Scroll-linked work, batched into one frame
  const parallax = [...document.querySelectorAll('[data-par]')]
  const spinners = [...document.querySelectorAll('[data-spin]')]
  const heroSearch = hero && hero.querySelector('[data-search-open]')
  let ticking = false
  const update = () => {
    ticking = false
    const y = window.scrollY
    const vh = window.innerHeight

    if (markers.length) {
      let bg = baseBg
      markers.forEach((m) => { if (m.getBoundingClientRect().top < vh / 2) bg = m.dataset.bgMarker })
      document.body.style.setProperty('--page-bg', `var(--color-${bg})`)
    }

    // The hero switches state once it has scrolled half a screen; the change itself is a CSS transition
    if (hero) {
      const alt = tablet.matches && y > hero.offsetTop + vh * 0.5
      if (alt !== hero.classList.contains('is-alt')) {
        hero.classList.toggle('is-alt', alt)
        if (heroSearch) heroSearch.inert = alt
      }
    }
    if (header) header.classList.toggle('is-scrolled', hero ? hero.classList.contains('is-alt') || y > hero.offsetTop + hero.offsetHeight - vh : y > 100)

    // Bento cards rise into place (and their icons straighten) as their section scrolls in
    if (!reduceMotion && tablet.matches) {
      const progress = (el) => {
        const top = el.closest('section').getBoundingClientRect().top
        return Math.min(1, Math.max(0, (vh - top) / (vh + 50)))
      }
      parallax.forEach((el) => el.style.setProperty('--par', `${(Number(el.dataset.par) * (1 - progress(el))).toFixed(1)}px`))
      spinners.forEach((el) => el.style.setProperty('--spin', `${(10 * (1 - progress(el))).toFixed(2)}deg`))
    } else {
      parallax.forEach((el) => el.style.removeProperty('--par'))
      spinners.forEach((el) => el.style.removeProperty('--spin'))
    }
  }
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
  window.addEventListener('scroll', request, { passive: true })
  window.addEventListener('resize', request)
  update()

  // Appear: [data-reveal] slides up once it is well inside the view
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
    }, { rootMargin: '0px 0px -10% 0px' })
    revealed.forEach((el) => observer.observe(el))
  }

  // Marquees: duplicate the list once so the track can loop seamlessly at a steady speed
  if (!reduceMotion) {
    document.querySelectorAll('[data-marquee]').forEach((track) => {
      const list = track.firstElementChild
      const clone = list.cloneNode(true)
      clone.setAttribute('aria-hidden', 'true')
      track.appendChild(clone)
      track.style.setProperty('--speed', `${Math.round(list.scrollWidth / 70)}s`)
      track.classList.add('is-running')
    })
  }

  // Accordions: each question opens and closes on its own
  document.querySelectorAll('[data-acc-item]').forEach((item) => {
    const button = item.querySelector('button')
    button.addEventListener('click', () => {
      const open = !item.hasAttribute('data-open')
      item.toggleAttribute('data-open', open)
      button.setAttribute('aria-expanded', String(open))
    })
  })

  // Pricing: monthly / annual switch
  const billing = document.querySelector('[data-billing]')
  if (billing) {
    billing.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        const period = button.dataset.period
        billing.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === button)))
        document.querySelectorAll('[data-monthly]').forEach((el) => { el.textContent = el.dataset[period] })
        document.querySelectorAll('[data-period-label]').forEach((el) => { el.textContent = period === 'annual' ? 'month, billed annually' : 'month' })
      })
    })
  }

  // Home categories: phones show three, "View more" opens the rest
  const catMore = document.querySelector('[data-cat-more]')
  if (catMore) {
    catMore.addEventListener('click', () => {
      document.querySelectorAll('[data-cat-extra]').forEach((el) => el.classList.remove('max-md:hidden'))
      catMore.parentElement.remove()
    })
  }

  // "Load more" lists (authors, an author's works)
  document.querySelectorAll('[data-more-button]').forEach((button) => {
    const list = button.closest('section').querySelector('[data-more-list]')
    const hidden = () => list.querySelectorAll(':scope > [hidden]')
    if (!hidden().length) { button.parentElement.remove(); return }
    button.addEventListener('click', () => {
      const next = [...hidden()]
      next.slice(0, 3).forEach((el) => el.removeAttribute('hidden'))
      const link = next[0] && next[0].querySelector('a[href]')
      if (link) link.focus()
      if (!hidden().length) button.parentElement.remove()
    })
  })

  // Articles feed: category filter, sort order and a feed that loads six more as you reach the end
  const feed = document.querySelector('[data-feed]')
  if (feed) {
    const rows = [...feed.querySelectorAll('[data-row]')]
    const category = document.querySelector('[data-filter-category]')
    const sort = document.querySelector('[data-filter-sort]')
    const more = document.querySelector('[data-feed-more]')
    const empty = document.querySelector('[data-feed-empty]')
    const status = document.querySelector('[data-filter-status]')
    const PAGE = 6
    let shown = PAGE
    let matches = []
    const render = () => {
      matches.forEach((row, i) => { row.hidden = i >= shown })
      rows.filter((row) => !matches.includes(row)).forEach((row) => { row.hidden = true })
      more.hidden = shown >= matches.length
      empty.classList.toggle('hidden', matches.length > 0)
    }
    const apply = () => {
      const cat = category.value
      matches = rows.filter((row) => cat === 'all' || row.dataset.tags.split(' ').includes(cat))
      matches.sort((a, b) => (sort.value === 'newest' ? -1 : 1) * a.dataset.date.localeCompare(b.dataset.date))
      matches.forEach((row) => feed.appendChild(row))
      shown = PAGE
      render()
      status.textContent = `${matches.length} article${matches.length === 1 ? '' : 's'}`
    }
    const preset = new URLSearchParams(location.search).get('category')
    if (preset && category.querySelector(`option[value="${CSS.escape(preset)}"]`)) category.value = preset
    category.addEventListener('change', apply)
    sort.addEventListener('change', apply)
    apply()
    let loading = false
    const loadMore = () => {
      if (loading || shown >= matches.length) return
      loading = true
      setTimeout(() => { shown += PAGE; render(); loading = false }, reduceMotion ? 0 : 600)
    }
    more.querySelector('button').addEventListener('click', loadMore)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => { if (entries[0].isIntersecting) loadMore() }, { rootMargin: '0px 0px 200px 0px' }).observe(more)
    }
  }

  // Search dialog: filters every article by title and summary
  const dialog = document.querySelector('[data-search]')
  if (dialog && typeof dialog.showModal === 'function') {
    const index = JSON.parse(dialog.querySelector('[data-search-index]').textContent)
    const input = dialog.querySelector('[data-search-input]')
    const results = dialog.querySelector('[data-search-results]')
    const status = dialog.querySelector('[data-search-status]')
    const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
    const run = () => {
      const q = input.value.trim().toLowerCase()
      const hits = q ? index.filter((a) => (a.t + ' ' + a.e).toLowerCase().includes(q)) : index.slice(-5).reverse()
      results.innerHTML = hits.map((a) => `<li><a href="${a.u}" class="flex flex-col gap-1 rounded-[12px] px-4 py-3 transition-colors hover:bg-white/10 focus-visible:bg-white/10"><span class="text-[18px] text-lime">${escape(a.t)}</span><span class="text-[14px] text-white/70">${escape(a.d)}</span></a></li>`).join('')
      status.textContent = q ? (hits.length ? `${hits.length} result${hits.length === 1 ? '' : 's'}` : 'No articles match your search.') : 'Latest articles'
    }
    document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', () => {
      dialog.showModal()
      run()
      input.focus()
    }))
    dialog.querySelector('[data-search-close]').addEventListener('click', () => dialog.close())
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close() })
    input.addEventListener('input', run)
  }

  // Become a creator: three steps that slide sideways; each step checks its own fields
  const steps = document.querySelector('[data-steps]')
  if (steps) {
    const track = steps.querySelector('[data-steps-track]')
    const panels = [...steps.querySelectorAll('[data-step]')]
    let current = 0
    const go = (n) => {
      current = n
      track.style.transform = `translateX(${-100 * n}%)`
      panels.forEach((p, i) => { p.inert = i !== n })
      panels[n].querySelector('[data-step-title]').focus({ preventScroll: true })
    }
    const valid = () => [...panels[current].querySelectorAll('input, select, textarea')].every((f) => f.reportValidity())
    steps.querySelectorAll('[data-step-next]').forEach((b) => b.addEventListener('click', () => { if (valid()) go(current + 1) }))
    steps.querySelectorAll('[data-step-prev]').forEach((b) => b.addEventListener('click', () => go(current - 1)))
  }

  // Forms have no backend: confirm instead of submitting
  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      if (form.hasAttribute('novalidate') && ![...form.querySelectorAll('input, select, textarea')].every((f) => f.closest('[inert]') || f.reportValidity())) return
      form.reset()
      const note = form.querySelector('[data-form-success]')
      if (note) note.hidden = false
    })
  })
})()
