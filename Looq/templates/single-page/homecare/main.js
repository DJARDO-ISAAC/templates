(() => {
  'use strict'

  const $ = (selector, context = document) => context.querySelector(selector)
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector))

  /* Header shadow */
  const header = $('[data-header]')
  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8)
  }
  updateHeader()
  window.addEventListener('scroll', updateHeader, { passive: true })

  /* Mobile menu */
  const menu = $('[data-mobile-menu]')
  const menuToggle = $('[data-menu-toggle]')

  const setMenu = (open) => {
    if (!menu || !menuToggle) return
    menu.classList.toggle('is-open', open)
    menuToggle.setAttribute('aria-expanded', String(open))
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    document.body.classList.toggle('menu-open', open)
  }

  menuToggle?.addEventListener('click', () => {
    setMenu(!menu?.classList.contains('is-open'))
  })
  $$('a', menu).forEach((link) => {
    link.addEventListener('click', () => setMenu(false))
  })
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMenu(false)
  })

  /* Reveal on scroll */
  const revealEls = $$('[data-reveal]')
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0 }
    )
    revealEls.forEach((el) => observer.observe(el))
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'))
  }

  /* Waitlist forms */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  $$('[data-waitlist]').forEach((wrap) => {
    const form = $('[data-waitlist-form]', wrap)
    const input = $('input[type="email"]', form)
    const error = $('.form-error', wrap)
    const success = $('.waitlist-success', wrap)

    form?.addEventListener('submit', (event) => {
      event.preventDefault()
      const value = input?.value.trim() ?? ''

      if (!emailPattern.test(value)) {
        wrap.classList.remove('is-success')
        wrap.classList.add('is-error')
        input?.setAttribute('aria-invalid', 'true')
        if (error) error.textContent = 'Please enter a valid email address.'
        input?.focus()
        return
      }

      wrap.classList.remove('is-error')
      wrap.classList.add('is-success')
      input?.removeAttribute('aria-invalid')
      if (success) {
        success.setAttribute('tabindex', '-1')
        success.focus({ preventScroll: true })
      }
    })

    input?.addEventListener('input', () => {
      if (!wrap.classList.contains('is-error')) return
      if (emailPattern.test(input.value.trim())) {
        wrap.classList.remove('is-error')
        input.removeAttribute('aria-invalid')
      }
    })
  })

  /* Pricing billing toggle */
  const billingButtons = $$('[data-billing]')
  const priceEls = $$('[data-price]')
  const periodEls = $$('[data-period]')

  const setBilling = (period) => {
    billingButtons.forEach((button) => {
      const active = button.dataset.billing === period
      button.classList.toggle('is-active', active)
      button.setAttribute('aria-pressed', String(active))
    })
    priceEls.forEach((el) => {
      const value = el.dataset[period]
      if (value) el.textContent = value
    })
    periodEls.forEach((el) => {
      el.textContent = period === 'yearly' ? '/year' : '/month'
    })
  }

  billingButtons.forEach((button) => {
    button.addEventListener('click', () => setBilling(button.dataset.billing))
  })

  /* Fee calculator */
  const budget = $('#calc-budget')
  const budgetValue = $('#calc-budget-value')
  const planSelect = $('#calc-plan')
  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  const planNames = { '0': 'Essential', '4': 'Family', '9': 'Diaspora Plus' }

  const updateCalc = () => {
    if (!budget || !planSelect) return

    const amount = Number(budget.value)
    const planFee = Number(planSelect.value)
    const fee = Math.min(amount * 0.015, 25)
    const total = amount + fee + planFee
    const percent = ((amount - Number(budget.min)) / (Number(budget.max) - Number(budget.min))) * 100

    if (budgetValue) budgetValue.textContent = usd.format(amount).replace('.00', '')
    const budgetRow = $('#calc-budget-row')
    const feeRow = $('#calc-fee-row')
    const planRow = $('#calc-plan-row')
    const planLabel = $('#calc-plan-label')
    const totalEl = $('#calc-total')
    const note = $('#calc-note')

    if (budgetRow) budgetRow.textContent = usd.format(amount)
    if (feeRow) feeRow.textContent = usd.format(fee)
    if (planRow) planRow.textContent = usd.format(planFee)
    if (planLabel) planLabel.textContent = `${planNames[planSelect.value] ?? 'HomeCare'} plan`
    if (totalEl) totalEl.textContent = usd.format(total)
    budget.style.setProperty('--fill', `${percent}%`)

    if (note) {
      note.textContent =
        amount * 0.015 > 25
          ? `Your 1.5% fee would be ${usd.format(amount * 0.015)}, but it is capped at $25 per top-up.`
          : 'The 1.5% funding fee is capped at $25 per top-up.'
    }
  }

  budget?.addEventListener('input', updateCalc)
  planSelect?.addEventListener('change', updateCalc)
  updateCalc()

  /* FAQ accordion */
  const faqItems = $$('.faq-item')

  const closeFaq = (item) => {
    item.classList.remove('is-open')
    $('.faq-q', item)?.setAttribute('aria-expanded', 'false')
    const panel = $('.faq-a', item)
    if (panel) panel.style.maxHeight = ''
  }

  faqItems.forEach((item) => {
    const button = $('.faq-q', item)
    const panel = $('.faq-a', item)

    button?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open')
      faqItems.forEach(closeFaq)
      if (isOpen || !panel) return
      item.classList.add('is-open')
      button.setAttribute('aria-expanded', 'true')
      panel.style.maxHeight = `${panel.scrollHeight}px`
    })
  })

  window.addEventListener('resize', () => {
    const openPanel = $('.faq-item.is-open .faq-a')
    if (openPanel) openPanel.style.maxHeight = `${openPanel.scrollHeight}px`
  })

  /* Verification dialog */
  const dialog = $('#verify-dialog')
  let lastFocus = null

  const openDialog = () => {
    if (!dialog || dialog.open) return
    lastFocus = document.activeElement
    setMenu(false)
    dialog.showModal()
    document.body.classList.add('dialog-open')
    $('.dialog-close', dialog)?.focus()
  }

  const closeDialog = () => {
    if (dialog?.open) dialog.close()
  }

  $$('[data-dialog-open]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault()
      openDialog()
    })
  })

  $$('[data-dialog-close]').forEach((trigger) => {
    trigger.addEventListener('click', closeDialog)
  })

  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog()
  })

  dialog?.addEventListener('close', () => {
    document.body.classList.remove('dialog-open')
    if (lastFocus instanceof HTMLElement) lastFocus.focus({ preventScroll: true })
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    setMenu(false)
  })
})()
