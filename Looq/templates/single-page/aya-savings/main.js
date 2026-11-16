(() => {
  'use strict'

  const $ = (selector, root = document) => root.querySelector(selector)
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector))

  /* Mobile menu */
  const menu = $('[data-mobile-menu]')
  const menuToggle = $('[data-menu-toggle]')
  const menuClose = $('[data-menu-close]')
  let menuOpen = false

  const setMenu = (open, returnFocus = false) => {
    if (!menu || !menuToggle) return
    menuOpen = open
    menu.classList.toggle('is-open', open)
    menu.setAttribute('aria-hidden', String(!open))
    menu.inert = !open
    menuToggle.setAttribute('aria-expanded', String(open))
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    document.body.classList.toggle('menu-open', open)

    if (open) {
      window.setTimeout(() => menuClose?.focus(), 80)
    } else if (returnFocus) {
      menuToggle.focus()
    }
  }

  if (menu) menu.inert = true
  menuToggle?.addEventListener('click', () => setMenu(!menuOpen))
  menuClose?.addEventListener('click', () => setMenu(false, true))
  $$('a', menu).forEach((link) => link.addEventListener('click', () => setMenu(false)))

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960 && menuOpen) setMenu(false)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) setMenu(false, true)
  })

  menu?.addEventListener('keydown', (event) => {
    if (!menuOpen || event.key !== 'Tab') return
    const focusable = $$('a, button', menu).filter(
      (el) => !el.disabled && el.offsetParent !== null
    )
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  })

  /* FAQ accordion */
  const faqItems = $$('.faq-item')

  const setFaq = (item, open) => {
    const trigger = $('.faq-trigger', item)
    const panel = $('.faq-panel', item)
    if (!trigger || !panel) return
    item.classList.toggle('is-open', open)
    trigger.setAttribute('aria-expanded', String(open))
    panel.setAttribute('aria-hidden', String(!open))
  }

  faqItems.forEach((item) => {
    const trigger = $('.faq-trigger', item)
    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open')
      faqItems.forEach((other) => {
        if (other !== item) setFaq(other, false)
      })
      setFaq(item, !isOpen)
    })
  })

  /* Founding-list forms */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  $$('[data-waitlist-form]').forEach((form) => {
    const input = $('input[type="email"]', form)
    const error = $('.form-error', form.parentElement)
    const success = $('[data-waitlist-success]', form.parentElement)

    const setError = (invalid) => {
      if (!input || !error) return
      if (invalid) input.setAttribute('aria-invalid', 'true')
      else input.removeAttribute('aria-invalid')
      error.hidden = !invalid
      if (invalid) input.focus()
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const value = input?.value.trim() ?? ''

      if (!emailPattern.test(value)) {
        setError(true)
        return
      }

      setError(false)
      form.hidden = true
      if (success) {
        success.hidden = false
        success.focus({ preventScroll: true })
      }
    })

    input?.addEventListener('input', () => {
      if (!input.hasAttribute('aria-invalid')) return
      if (emailPattern.test(input.value.trim())) setError(false)
    })
  })
})()
