(() => {
  'use strict'

  // Edit these to match your church. Day: 0 is Sunday. Times are in the church's own time zone,
  // so a visitor abroad still sees the correct countdown.
  const SERVICES = {
    timeZone: 'America/Chicago',
    lengthMinutes: 75,
    times: [{ day: 0, hour: 9, minute: 0 }, { day: 0, hour: 11, minute: 0 }],
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Header gains a hairline once scrolled; over the night hero it also turns from clear to paper
  const header = document.querySelector('[data-header]')
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  // Desktop dropdowns
  const dropdowns = [...document.querySelectorAll('[data-dropdown]')]
  const closeDropdowns = (except) => dropdowns.forEach((item) => {
    if (item === except) return
    item.querySelector('button').setAttribute('aria-expanded', 'false')
    item.querySelector('.dropdown').classList.remove('is-open')
  })
  dropdowns.forEach((item) => {
    const button = item.querySelector('button')
    const panel = item.querySelector('.dropdown')
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true'
      closeDropdowns(item)
      button.setAttribute('aria-expanded', String(open))
      panel.classList.toggle('is-open', open)
    })
  })
  document.addEventListener('click', (event) => { if (!event.target.closest('[data-dropdown]')) closeDropdowns() })

  // Phone menu
  const menuButton = document.querySelector('[data-menu-button]')
  const mobilePanel = document.getElementById('mobile-menu')
  const setMenu = (open) => {
    if (!menuButton) return
    header.classList.toggle('menu-open', open)
    menuButton.setAttribute('aria-expanded', String(open))
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    mobilePanel.inert = !open
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }
  if (menuButton && mobilePanel) {
    mobilePanel.inert = true
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'))
    mobilePanel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)))
    window.matchMedia('(min-width: 68rem)').addEventListener('change', (event) => { if (event.matches) setMenu(false) })
  }
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    const openDropdown = dropdowns.find((item) => item.querySelector('button').getAttribute('aria-expanded') === 'true')
    if (openDropdown) { closeDropdowns(); openDropdown.querySelector('button').focus() }
    if (menuButton?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus() }
  })

  // Next service: counted in minutes of the church's week, so no time-zone arithmetic is needed
  const serviceEls = document.querySelectorAll('[data-next-service]')
  if (serviceEls.length) {
    const WEEK = 7 * 24 * 60
    const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
    const format = new Intl.DateTimeFormat('en-US', { timeZone: SERVICES.timeZone, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    const clock = (hour, minute) => `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'am' : 'pm'}`
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const update = () => {
      const parts = Object.fromEntries(format.formatToParts(new Date()).map((p) => [p.type, p.value]))
      const now = days[parts.weekday] * 1440 + Number(parts.hour) * 60 + Number(parts.minute)
      const slots = SERVICES.times.map((t) => ({ ...t, at: t.day * 1440 + t.hour * 60 + t.minute })).sort((a, b) => a.at - b.at)
      const live = slots.find((s) => {
        const since = (now - s.at + WEEK) % WEEK
        return since < SERVICES.lengthMinutes
      })
      const next = slots.map((s) => ({ ...s, wait: (s.at - now + WEEK) % WEEK })).sort((a, b) => a.wait - b.wait)[0]
      const d = Math.floor(next.wait / 1440), h = Math.floor((next.wait % 1440) / 60), m = next.wait % 60
      const wait = d ? `${d} day${d === 1 ? '' : 's'}, ${h} hour${h === 1 ? '' : 's'}` : h ? `${h} hour${h === 1 ? '' : 's'}, ${m} min` : `${m} minute${m === 1 ? '' : 's'}`
      serviceEls.forEach((el) => {
        el.closest('[data-service-state]')?.classList.toggle('is-live', Boolean(live))
        el.textContent = live
          ? `We are gathered right now, at the ${clock(live.hour, live.minute)} service.`
          : `Next gathering: ${dayName[next.day]} at ${clock(next.hour, next.minute)}, in ${wait}.`
      })
      document.querySelectorAll('[data-live-link]').forEach((el) => { el.textContent = live ? 'Watch live now' : 'Watch online' })
    }
    update()
    setInterval(update, 30000)
  }

  // Scroll entrances
  const revealed = document.querySelectorAll('[data-reveal], [data-arch]')
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealed.forEach((el) => el.classList.add('is-revealed'))
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -6% 0px' })
    revealed.forEach((el) => observer.observe(el))
  }

  // Quotes: one at a time, with a soft change
  document.querySelectorAll('[data-quotes]').forEach((box) => {
    const quotes = [...box.querySelectorAll('[data-quote]')]
    let current = 0
    const show = (n) => {
      current = (n + quotes.length) % quotes.length
      quotes.forEach((quote, i) => {
        quote.hidden = i !== current
        if (i === current && !reduceMotion) quote.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: 'cubic-bezier(0.19, 1, 0.22, 1)' })
      })
    }
    box.querySelector('[data-quote-prev]').addEventListener('click', () => show(current - 1))
    box.querySelector('[data-quote-next]').addEventListener('click', () => show(current + 1))
  })

  // Sermon library: search plus series and speaker filters, and ?series= links from elsewhere
  const library = document.querySelector('[data-library]')
  if (library) {
    const cards = [...library.querySelectorAll('[data-sermon]')]
    const search = document.querySelector('[data-library-search]')
    const series = document.querySelector('[data-library-series]')
    const speaker = document.querySelector('[data-library-speaker]')
    const status = document.querySelector('[data-library-status]')
    const empty = document.querySelector('[data-library-empty]')
    const params = new URLSearchParams(window.location.search)
    if (params.get('q')) search.value = params.get('q')
    if (params.get('series')) series.value = params.get('series')
    const apply = () => {
      const words = search.value.toLowerCase().split(/\s+/).filter(Boolean)
      let shown = 0
      cards.forEach((card) => {
        const text = card.textContent.toLowerCase()
        const match = words.every((w) => text.includes(w))
          && (series.value === 'all' || card.dataset.series === series.value)
          && (speaker.value === 'all' || card.dataset.speaker === speaker.value)
        card.hidden = !match
        if (match) { shown++; card.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-revealed')); card.classList.add('is-revealed') }
      })
      status.textContent = `${shown} message${shown === 1 ? '' : 's'}`
      empty.hidden = shown > 0
    }
    search.addEventListener('input', apply)
    series.addEventListener('change', apply)
    speaker.addEventListener('change', apply)
    document.querySelector('[data-library-reset]').addEventListener('click', () => {
      search.value = ''; series.value = 'all'; speaker.value = 'all'; apply(); search.focus()
    })
    apply()
  }

  // Chip filters, used by events
  document.querySelectorAll('[data-chips]').forEach((chips) => {
    const list = document.querySelector(chips.dataset.chips)
    const items = [...list.querySelectorAll('[data-kind]')]
    const status = document.querySelector('[data-chips-status]')
    chips.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
      chips.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === button)))
      let shown = 0
      items.forEach((item) => {
        const match = button.dataset.value === 'all' || item.dataset.kind === button.dataset.value
        item.hidden = !match
        if (match) { shown++; item.classList.add('is-revealed') }
      })
      status.textContent = `${shown} event${shown === 1 ? '' : 's'} shown`
    }))
  })

  // Group finder
  const finder = document.querySelector('[data-finder]')
  if (finder) {
    const groups = [...document.querySelectorAll('[data-group]')]
    const status = document.querySelector('[data-finder-status]')
    const empty = document.querySelector('[data-finder-empty]')
    const apply = () => {
      const day = finder.elements.day.value, type = finder.elements.type.value, area = finder.elements.area.value
      let shown = 0
      groups.forEach((group) => {
        const match = (day === 'all' || group.dataset.day === day) && (type === 'all' || group.dataset.type === type) && (area === 'all' || group.dataset.area === area)
        group.hidden = !match
        if (match) { shown++; group.classList.add('is-revealed') }
      })
      status.textContent = `${shown} group${shown === 1 ? '' : 's'} found`
      empty.hidden = shown > 0
    }
    finder.addEventListener('change', apply)
    finder.addEventListener('reset', () => setTimeout(apply))
    apply()
  }

  // Add to calendar: builds a small .ics file in the browser
  document.querySelectorAll('[data-ics]').forEach((button) => {
    button.addEventListener('click', () => {
      const { title, start, end, place, rule } = button.dataset
      const stamp = new Date().toISOString().replace(/[-:]|\.\d+/g, '')
      const safe = (text) => text.replace(/([,;\\])/g, '\\$1')
      const lines = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Stillwater Church//Events//EN', 'BEGIN:VEVENT',
        `UID:${start}-${title.toLowerCase().replace(/\W+/g, '-')}@stillwater.example`, `DTSTAMP:${stamp}`,
        `DTSTART;TZID=${SERVICES.timeZone}:${start}`, `DTEND;TZID=${SERVICES.timeZone}:${end}`,
        `SUMMARY:${safe(title)}`, `LOCATION:${safe(place)}`, ...(rule ? [`RRULE:${rule}`] : []), 'END:VEVENT', 'END:VCALENDAR',
      ]
      const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }))
      const link = Object.assign(document.createElement('a'), { href: url, download: `${title.toLowerCase().replace(/\W+/g, '-')}.ics` })
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      const label = button.querySelector('span')
      if (label) label.textContent = 'Added'
    })
  })

  // Giving: choose an amount and fund, then hand over to the church's payment provider
  const give = document.querySelector('[data-give]')
  if (give) {
    const custom = give.elements.custom
    const summary = give.querySelector('[data-give-summary]')
    const note = give.querySelector('[data-give-note]')
    const amount = () => (custom.value ? Number(custom.value) : Number(give.elements.amount.value))
    const paint = () => {
      const value = amount()
      const fund = give.elements.fund.selectedOptions[0].textContent
      const when = give.elements.frequency.value === 'monthly' ? ' each month' : ''
      summary.textContent = value > 0 ? `Give $${value.toLocaleString('en-US')}${when} to ${fund}` : 'Choose an amount to continue'
      note.hidden = true
    }
    give.addEventListener('input', (event) => {
      if (event.target.name === 'amount') custom.value = ''
      if (event.target === custom && custom.value) give.querySelectorAll('[name="amount"]').forEach((r) => { r.checked = false })
      paint()
    })
    give.addEventListener('submit', (event) => {
      event.preventDefault()
      if (amount() > 0) note.hidden = false
      else custom.focus()
    })
    paint()
  }

  // Prayer wall: each visitor's "I prayed" is remembered in their browser
  document.querySelectorAll('[data-pray]').forEach((button) => {
    const key = `stillwater-prayed-${button.dataset.pray}`
    const count = button.querySelector('[data-count]')
    const label = button.querySelector('[data-label]')
    const set = (on) => {
      button.setAttribute('aria-pressed', String(on))
      label.textContent = on ? 'You prayed' : 'I prayed'
    }
    let stored = false
    try { stored = localStorage.getItem(key) === '1' } catch {}
    if (stored) { count.textContent = Number(count.textContent) + 1; set(true) }
    button.addEventListener('click', () => {
      const on = button.getAttribute('aria-pressed') !== 'true'
      count.textContent = Number(count.textContent) + (on ? 1 : -1)
      set(on)
      try { on ? localStorage.setItem(key, '1') : localStorage.removeItem(key) } catch {}
    })
  })

  // Sermon players hold no recording in the template, so the button says where one goes
  document.querySelectorAll('[data-player]').forEach((button) => {
    button.addEventListener('click', () => {
      const note = button.parentElement.querySelector('[data-player-note]')
      if (note) note.hidden = false
    })
  })

  // Contact form opens on the topic a link asked for, such as contact?topic=groups
  const topic = document.querySelector('[data-topic]')
  if (topic) {
    const asked = new URLSearchParams(window.location.search).get('topic')
    if (asked && [...topic.options].some((option) => option.value === asked)) topic.value = asked
  }

  // Forms have no backend: confirm instead of submitting
  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      form.reset()
      const note = form.querySelector('[data-form-success]')
      if (note) { note.hidden = false; note.focus?.() }
    })
  })
})()
