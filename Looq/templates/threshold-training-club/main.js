(() => {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Footer copyright year stays current
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })

  // Shared zone state: the week picker, the zone calculator and "the room right now" card all follow it
  const ZONE_NAMES = ['Recover', 'Base', 'Tempo', 'Thres', 'Max']
  const ZONE_LINES = [
    'easy enough to talk in full sentences',
    'the pace you could keep all morning',
    'comfortably hard, short sentences only',
    'hard, but you can hold it for twenty minutes',
    'all out, for seconds rather than minutes',
  ]
  const ZONE_BANDS = [[0.5, 0.6], [0.6, 0.7], [0.7, 0.8], [0.8, 0.9], [0.9, 1]]
  const state = { age: 34, zone: 1 }
  const listeners = []
  const update = (changes) => {
    Object.assign(state, changes)
    listeners.forEach((fn) => fn(state))
  }
  const maxHeartRate = () => 220 - state.age
  const band = (zone) => ZONE_BANDS[zone - 1].map((share) => Math.round(maxHeartRate() * share))

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

  // Week picker: today opens first, any day opens on click, arrows step through the week
  const week = document.querySelector('[data-week]')
  if (week) {
    const days = Array.from(week.querySelectorAll('[data-day]'))
    const now = new Date()
    const todayIndex = (now.getDay() + 6) % 7
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const label = (index) => {
      if (index === todayIndex) {
        return `Today · ${now.toLocaleDateString('en-GB', { weekday: 'short' })}, ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      }
      if (index === (todayIndex + 1) % 7) return 'Tomorrow'
      return dayNames[index]
    }

    const open = (index, focus) => {
      days.forEach((day, i) => {
        const isOpen = i === index
        day.toggleAttribute('data-open', isOpen)
        day.querySelector('[data-day-toggle]').setAttribute('aria-expanded', String(isOpen))
        day.querySelectorAll('.day-body a, .day-body button').forEach((el) => {
          el.tabIndex = isOpen ? 0 : -1
        })
      })
      const day = days[index]
      const labelEl = day.querySelector('[data-day-label]')
      if (labelEl) labelEl.textContent = label(index)
      if (day.dataset.zone) update({ zone: Number(day.dataset.zone) })
      if (focus) day.querySelector('.day-body a, .day-body button')?.focus()
    }

    days.forEach((day, i) => {
      day.querySelector('[data-day-toggle]').addEventListener('click', () => open(i, true))
      day.querySelector('[data-day-prev]')?.addEventListener('click', () => open((i + 6) % 7, true))
      day.querySelector('[data-day-next]')?.addEventListener('click', () => open((i + 1) % 7, true))
    })

    const todayPill = document.querySelector('[data-today-zone]')
    const todayDay = days[todayIndex]
    if (todayPill) {
      todayPill.textContent = todayDay.dataset.zone
        ? `${dayNames[todayIndex]} is a Zone ${todayDay.dataset.zone} day`
        : `${dayNames[todayIndex]} is a rest day`
    }
    open(todayIndex, false)

    listeners.push(() => {
      week.querySelectorAll('[data-target-hr]').forEach((el) => {
        const [low, high] = band(Number(el.dataset.targetHr))
        el.textContent = Math.floor((low + high) / 2)
      })
    })
  }

  // Zone calculator
  const zones = document.querySelector('[data-zones]')
  if (zones) {
    const ageEl = zones.querySelector('[data-age]')
    const picks = Array.from(zones.querySelectorAll('[data-zone-pick]'))
    zones.querySelector('[data-age-down]').addEventListener('click', () => update({ age: Math.max(16, state.age - 1) }))
    zones.querySelector('[data-age-up]').addEventListener('click', () => update({ age: Math.min(90, state.age + 1) }))
    picks.forEach((pick) => pick.addEventListener('click', () => update({ zone: Number(pick.dataset.zonePick) })))

    listeners.push(({ age, zone }) => {
      ageEl.textContent = age
      zones.querySelector('[data-max]').textContent = maxHeartRate()
      const [low, high] = band(zone)
      zones.querySelector('[data-range]').textContent = `${low}–${high}`
      zones.querySelector('[data-zone-label]').textContent = `Zone ${zone}`
      zones.querySelector('[data-zone-line]').textContent = ZONE_LINES[zone - 1]
      zones.querySelectorAll('[data-zone-range]').forEach((el) => {
        el.textContent = band(Number(el.dataset.zoneRange)).join('–')
      })
      picks.forEach((pick) => pick.setAttribute('aria-pressed', String(Number(pick.dataset.zonePick) === zone)))
      const mid = ((zone - 0.5) / 5) * 100
      zones.querySelector('[data-zone-dot]').style.left = `${mid}%`
      zones.querySelector('[data-zone-fill]').style.width = `${(zone / 5) * 100 - 0.4}%`
    })
  }

  // "The room right now" card
  const roomZone = document.querySelector('[data-room-zone]')
  if (roomZone) listeners.push(({ zone }) => {
    roomZone.textContent = `Zone ${zone} · ${ZONE_NAMES[zone - 1]}`
  })

  update({})

  // Inside a class: the clock walks round the five step cards
  const clock = document.querySelector('[data-class-clock]')
  if (clock) {
    const steps = Array.from(clock.querySelectorAll('[data-step]'))
    const names = ['Warm up', 'Build', 'Hold', 'Peak', 'Come down']
    const times = ['45:00', '37:00', '25:00', '10:00', '06:00']
    let current = 0
    let timer
    const show = (index) => {
      current = index
      steps.forEach((step, i) => step.toggleAttribute('data-active', i === index))
      clock.querySelector('[data-clock-step]').textContent = names[index]
      clock.querySelector('[data-clock-time]').textContent = times[index]
    }
    show(0)
    if (!reduceMotion && 'IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        clearInterval(timer)
        if (entry.isIntersecting) timer = setInterval(() => show((current + 1) % steps.length), 2600)
      }, { threshold: 0.3 }).observe(clock)
    }
  }

  // Numbers count up the first time they scroll into view
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
          const progress = Math.min((now - start) / 1200, 1)
          el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)))
          if (progress < 1) requestAnimationFrame(tick)
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

  // FAQ accordion, one item open at a time within each list
  document.querySelectorAll('[data-faq-item]').forEach((item) => {
    const button = item.querySelector('button')
    button.addEventListener('click', () => {
      const wasOpen = item.hasAttribute('data-open')
      item.parentElement.querySelectorAll('[data-faq-item]').forEach((other) => {
        other.removeAttribute('data-open')
        other.querySelector('button').setAttribute('aria-expanded', 'false')
      })
      if (!wasOpen) {
        item.setAttribute('data-open', '')
        button.setAttribute('aria-expanded', 'true')
      }
    })
  })

  // Forms have no backend: show the confirmation instead of submitting
  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      form.reset()
      form.querySelector('[data-form-note]')?.classList.add('hidden')
      form.querySelector('[data-form-success]')?.classList.remove('hidden')
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
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return
      el.classList.add('reveal-pending')
      observer.observe(el)
    })
  }
})()
