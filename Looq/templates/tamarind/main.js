(function () {
  'use strict'

  /* ---------- Settings to change for your own charity ---------- */
  // What a gift buys. Used by the gift calculator and the donate form.
  var GIFTS = {
    food: { label: 'School meals', unit: 'school meal', units: 'school meals', part: 'part of a school meal', cost: 0.5 },
    water: { label: 'Clean water', unit: 'family with clean water for a year', units: 'families with clean water for a year', part: 'part of a year of clean water for one family', cost: 30 },
    learning: { label: 'Learning kits', unit: 'learning kit', units: 'learning kits', part: 'part of a learning kit', cost: 12 },
    health: { label: 'Health checks', unit: 'health check', units: 'health checks', part: 'part of a health check', cost: 8 }
  }
  // The appeal deadline, in the visitor's local time. After it passes the countdown shows a closing message.
  var APPEAL_ENDS = '2026-12-31T23:59:00'
  // Shop shipping
  var SHIPPING = 6
  var FREE_SHIPPING_FROM = 60

  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var params = new URLSearchParams(location.search)
  var money = function (n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) }
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch (e) { return d } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} }
  }

  /* ---------- Header ---------- */
  var header = $('[data-header]')
  var giveBar = $('[data-give-bar]')
  function onScroll() {
    var y = window.scrollY
    if (header) header.classList.toggle('is-stuck', y > 40)
    if (giveBar) {
      var nearEnd = y + innerHeight > document.documentElement.scrollHeight - 420
      giveBar.classList.toggle('is-on', y > 620 && !nearEnd)
    }
    if (!calm) parallax(y)
  }
  var plx = $$('[data-parallax]')
  function parallax(y) {
    plx.forEach(function (el) {
      var r = el.getBoundingClientRect()
      if (r.bottom < -100 || r.top > innerHeight + 100) return
      var mid = r.top + r.height / 2 - innerHeight / 2
      el.style.setProperty('--py', (mid * Number(el.dataset.parallax || 0.06)).toFixed(1) + 'px')
    })
  }
  var ticking = false
  window.addEventListener('scroll', function () {
    if (ticking) return
    ticking = true
    requestAnimationFrame(function () { onScroll(); ticking = false })
  }, { passive: true })
  onScroll()

  var drops = $$('[data-dropdown]')
  function closeDrops(except) {
    drops.forEach(function (d) {
      if (d === except) return
      d.classList.remove('is-open')
      $('button', d).setAttribute('aria-expanded', 'false')
    })
  }
  drops.forEach(function (d) {
    var b = $('button', d), t
    b.addEventListener('click', function () {
      var open = !d.classList.contains('is-open')
      closeDrops(d)
      d.classList.toggle('is-open', open)
      b.setAttribute('aria-expanded', String(open))
    })
    d.addEventListener('mouseenter', function () { clearTimeout(t); closeDrops(d); d.classList.add('is-open'); b.setAttribute('aria-expanded', 'true') })
    d.addEventListener('mouseleave', function () { t = setTimeout(function () { d.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false') }, 160) })
    d.addEventListener('focusout', function (e) { if (e.relatedTarget && !d.contains(e.relatedTarget)) { d.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false') } })
  })
  document.addEventListener('click', function (e) { if (!e.target.closest('[data-dropdown]')) closeDrops() })

  var menuBtn = $('[data-menu-button]'), panel = $('#mobile-menu')
  function setMenu(open) {
    if (!menuBtn) return
    panel.classList.toggle('is-open', open)
    menuBtn.setAttribute('aria-expanded', String(open))
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true') })
    document.addEventListener('click', function (e) { if (!e.target.closest('[data-header]')) setMenu(false) })
  }

  /* ---------- Overlays: search and cart ---------- */
  var lastFocus
  function openLayer(el, focusEl) {
    lastFocus = document.activeElement
    el.classList.add('is-open')
    el.removeAttribute('aria-hidden')
    document.documentElement.style.overflow = 'hidden'
    if (focusEl) focusEl.focus()
  }
  function closeLayer(el) {
    if (!el.classList.contains('is-open')) return
    el.classList.remove('is-open')
    el.setAttribute('aria-hidden', 'true')
    document.documentElement.style.overflow = ''
    if (lastFocus) lastFocus.focus()
  }
  $$('.scrim').forEach(function (s) {
    s.addEventListener('mousedown', function (e) { if (e.target === s) closeLayer(s) })
    // Keep Tab inside an open layer
    s.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return
      var f = $$('a[href], button:not([disabled]), input, select', s).filter(function (x) { return x.getClientRects().length })
      if (!f.length) return
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus() }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus() }
    })
  })
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return
    $$('.scrim.is-open').forEach(closeLayer)
    closeDrops()
    if (menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus() }
  })
  $$('[data-close-layer]').forEach(function (b) { b.addEventListener('click', function () { closeLayer(b.closest('.scrim')) }) })

  var searchLayer = $('[data-search-layer]'), searchInput = $('[data-search-input]'), searchOut = $('[data-search-results]'), searchIndex = null
  function runSearch() {
    var q = searchInput.value.trim().toLowerCase()
    if (!q) { searchOut.innerHTML = '<p class="px-2 py-3 text-muted">Try "water", "volunteer" or "tax receipt".</p>'; return }
    if (!searchIndex) { searchOut.innerHTML = '<p class="px-2 py-3 text-muted">Loading...</p>'; return }
    var words = q.split(/\s+/)
    var hits = searchIndex.filter(function (p) {
      var hay = (p.t + ' ' + p.d + ' ' + p.k).toLowerCase()
      return words.every(function (w) { return hay.indexOf(w) > -1 })
    }).slice(0, 8)
    searchOut.innerHTML = hits.length
      ? '<ul>' + hits.map(function (p) { return '<li><a class="block rounded-2xl px-3 py-3 transition-colors hover:bg-cream-2" href="' + esc(p.u) + '"><span class="block text-[.8rem] font-bold text-pers-2">' + esc(p.k) + '</span><span class="block font-display text-[1.1rem] font-bold leading-tight">' + esc(p.t) + '</span><span class="mt-1 block text-[.92rem] leading-snug text-muted">' + esc(p.d) + '</span></a></li>' }).join('') + '</ul>'
      : '<p class="px-2 py-3 text-muted">Nothing found for "' + esc(q) + '". Try a shorter word.</p>'
  }
  $$('[data-open-search]').forEach(function (b) {
    b.addEventListener('click', function () {
      setMenu(false)
      openLayer(searchLayer, searchInput)
      runSearch()
      if (!searchIndex) fetch('./assets/search-index.json').then(function (r) { return r.json() }).then(function (j) { searchIndex = j; runSearch() }).catch(function () { searchOut.innerHTML = '<p class="px-2 py-3 text-muted">Search could not load. Please use the menu.</p>' })
    })
  })
  if (searchInput) searchInput.addEventListener('input', runSearch)

  /* ---------- Shop cart (kept in this browser) ---------- */
  var CART_KEY = 'tamarind-cart'
  var cart = store.get(CART_KEY, [])
  var cartLayer = $('[data-cart-layer]')
  function lineKey(l) { return l.slug + '|' + (l.size || '') }
  function saveCart() { store.set(CART_KEY, cart); renderCart() }
  function subtotal() { return cart.reduce(function (s, l) { return s + l.price * l.qty }, 0) }
  function shippingFor(sub) { return !sub || sub >= FREE_SHIPPING_FROM ? 0 : SHIPPING }
  function lineHtml(l, i) {
    return '<li class="flex gap-4 py-4"><img src="' + esc(l.img) + '" alt="" width="72" height="72" class="size-[72px] flex-none rounded-2xl">' +
      '<div class="min-w-0 flex-1"><a class="font-display font-bold leading-tight hover:text-pers-2" href="' + esc(l.slug) + '">' + esc(l.name) + '</a>' +
      (l.size ? '<p class="text-[.9rem] text-muted">Size ' + esc(l.size) + '</p>' : '') +
      '<div class="mt-2 flex flex-wrap items-center gap-3"><div class="inline-flex items-center rounded-full bg-cream-2"><button type="button" class="grid size-9 place-items-center rounded-full font-bold" data-qty="-1" data-i="' + i + '" aria-label="Remove one ' + esc(l.name) + '">&minus;</button><span class="w-6 text-center font-bold" aria-live="polite">' + l.qty + '</span><button type="button" class="grid size-9 place-items-center rounded-full font-bold" data-qty="1" data-i="' + i + '" aria-label="Add one more ' + esc(l.name) + '">+</button></div>' +
      '<button type="button" class="text-[.9rem] font-semibold text-muted underline underline-offset-2 hover:text-pers-2" data-remove="' + i + '">Remove</button></div></div>' +
      '<p class="font-bold">' + money(l.price * l.qty) + '</p></li>'
  }
  function totalsHtml() {
    var sub = subtotal(), ship = shippingFor(sub)
    return '<dl class="grid gap-2"><div class="flex justify-between"><dt>Subtotal</dt><dd class="font-bold">' + money(sub) + '</dd></div>' +
      '<div class="flex justify-between"><dt>Shipping</dt><dd class="font-bold">' + (ship ? money(ship) : 'Free') + '</dd></div>' +
      '<div class="mt-1 flex justify-between border-t-2 border-line pt-3 font-display text-[1.3rem] font-bold"><dt>Total</dt><dd>' + money(sub + ship) + '</dd></div></dl>' +
      (sub && sub < FREE_SHIPPING_FROM ? '<p class="mt-3 text-[.92rem] text-muted">Add ' + money(FREE_SHIPPING_FROM - sub) + ' more for free shipping.</p>' : '')
  }
  function renderCart() {
    var count = cart.reduce(function (s, l) { return s + l.qty }, 0)
    $$('[data-cart-count]').forEach(function (c) {
      c.textContent = count
      c.hidden = !count
    })
    var empty = '<p class="py-6 text-muted">Your bag is empty.</p>'
    var drawerList = $('[data-cart-lines]')
    if (drawerList) drawerList.innerHTML = cart.length ? '<ul class="divide-y-2 divide-line">' + cart.map(lineHtml).join('') + '</ul>' : empty
    var drawerTotals = $('[data-cart-totals]')
    if (drawerTotals) drawerTotals.innerHTML = cart.length ? totalsHtml() : ''
    $$('[data-cart-actions]').forEach(function (a) { a.hidden = !cart.length })
    var pageList = $('[data-cart-page]')
    if (pageList) pageList.innerHTML = cart.length ? '<ul class="divide-y-2 divide-line">' + cart.map(lineHtml).join('') + '</ul>' : '<div class="py-8"><p class="h-md">Your bag is empty.</p><p class="mt-2 text-muted">Everything in the shop is made by partner workshops, and the profit funds school meals.</p><a class="btn btn-pers mt-5" href="shop">Visit the shop</a></div>'
    $$('[data-cart-summary]').forEach(function (s) { s.innerHTML = cart.length ? totalsHtml() : '<p class="text-muted">Nothing here yet.</p>' })
    $$('[data-needs-cart]').forEach(function (n) { n.hidden = !cart.length })
    var co = $('[data-checkout-lines]')
    if (co) co.innerHTML = cart.map(function (l) { return '<li class="flex justify-between gap-4 py-2"><span>' + esc(l.name) + (l.size ? ' (' + esc(l.size) + ')' : '') + ' &times; ' + l.qty + '</span><span class="font-bold">' + money(l.price * l.qty) + '</span></li>' }).join('')
  }
  document.addEventListener('click', function (e) {
    var q = e.target.closest('[data-qty]')
    if (q) {
      var i = Number(q.dataset.i)
      cart[i].qty += Number(q.dataset.qty)
      if (cart[i].qty < 1) cart.splice(i, 1)
      saveCart()
      return
    }
    var r = e.target.closest('[data-remove]')
    if (r) { cart.splice(Number(r.dataset.remove), 1); saveCart(); return }
    var add = e.target.closest('[data-add-cart]')
    if (add) {
      var sizeEl = $('[data-size]'), qtyEl = $('[data-qty-input]')
      var line = { slug: add.dataset.slug, name: add.dataset.name, price: Number(add.dataset.price), img: add.dataset.img, size: add.dataset.hasSize && sizeEl ? sizeEl.value : '', qty: qtyEl && add.dataset.hasQty ? Math.max(1, Number(qtyEl.value) || 1) : 1 }
      var found = cart.filter(function (l) { return lineKey(l) === lineKey(line) })[0]
      if (found) found.qty += line.qty; else cart.push(line)
      saveCart()
      $$('[data-cart-count]').forEach(function (c) { c.classList.add('bump'); setTimeout(function () { c.classList.remove('bump') }, 320) })
      openLayer(cartLayer, $('[data-close-layer]', cartLayer))
    }
  })
  $$('[data-open-cart]').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(false); openLayer(cartLayer, $('[data-close-layer]', cartLayer)) })
  })
  renderCart()

  /* Shop filter and sort */
  var shopGrid = $('[data-shop-grid]')
  if (shopGrid) {
    var shopCat = 'all', sortEl = $('[data-shop-sort]')
    var applyShop = function () {
      var items = $$('[data-cat]', shopGrid)
      items.forEach(function (it) { it.hidden = shopCat !== 'all' && it.dataset.cat !== shopCat })
      var how = sortEl.value
      items.sort(function (a, b) {
        if (how === 'low') return a.dataset.price - b.dataset.price
        if (how === 'high') return b.dataset.price - a.dataset.price
        return a.dataset.order - b.dataset.order
      }).forEach(function (it) { shopGrid.appendChild(it) })
      $('[data-shop-count]').textContent = items.filter(function (it) { return !it.hidden }).length
    }
    $$('[data-shop-cat]').forEach(function (c) {
      c.addEventListener('click', function () {
        shopCat = c.dataset.shopCat
        $$('[data-shop-cat]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === c)) })
        applyShop()
      })
    })
    sortEl.addEventListener('change', applyShop)
  }

  /* ---------- Generic list filter: campaigns, news, faq, events ---------- */
  $$('[data-filter-group]').forEach(function (group) {
    var scope = $(group.dataset.filterGroup)
    if (!scope) return
    var status = group.parentElement.querySelector('[data-filter-count]')
    var apply = function (v) {
      var n = 0
      $$('[data-tags]', scope).forEach(function (it) {
        var show = v === 'all' || it.dataset.tags.split(' ').indexOf(v) > -1
        it.hidden = !show
        if (show) n++
      })
      $$('[data-filter]', group).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === v)) })
      if (status) status.textContent = n + (n === 1 ? ' result' : ' results')
    }
    $$('[data-filter]', group).forEach(function (b) { b.addEventListener('click', function () { apply(b.dataset.filter) }) })
    var want = params.get('filter')
    if (want && $('[data-filter="' + want + '"]', group)) apply(want)
  })

  /* ---------- Gift calculator ---------- */
  var ICONS = {}
  $$('template[data-unit-icon]').forEach(function (t) { ICONS[t.dataset.unitIcon] = t.innerHTML })
  function impactLine(amount, cause) {
    var g = GIFTS[cause], n = Math.floor(amount / g.cost)
    return { n: n, text: n >= 1 ? n.toLocaleString('en-US') + ' ' + (n === 1 ? g.unit : g.units) : g.part }
  }
  $$('[data-calc]').forEach(function (calc) {
    var cause = 'food', range = $('[data-calc-range]', calc), amt = $('[data-calc-amount]', calc), res = $('[data-calc-result]', calc), units = $('[data-calc-units]', calc), go = $('[data-calc-go]', calc), shown = -1
    var draw = function () {
      var a = Number(range.value), line = impactLine(a, cause), pct = (a - range.min) / (range.max - range.min) * 100
      range.style.setProperty('--fill', pct + '%')
      amt.textContent = money(a)
      range.setAttribute('aria-valuetext', money(a) + ' gives ' + line.text)
      res.textContent = line.text
      go.href = 'donate?amount=' + a + '&cause=' + cause
      go.firstElementChild.textContent = 'Give ' + money(a)
      var count = Math.min(line.n, 42)
      if (count !== shown) {
        var html = ''
        for (var i = 0; i < count; i++) html += '<span class="unit" style="animation-delay:' + (i >= shown && shown >= 0 ? (i - shown) * 14 : i * 9) + 'ms">' + ICONS[cause] + '</span>'
        units.innerHTML = html
        shown = count
      }
    }
    range.addEventListener('input', draw)
    $$('[data-calc-cause]', calc).forEach(function (b) {
      b.addEventListener('click', function () {
        cause = b.dataset.calcCause
        $$('[data-calc-cause]', calc).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)) })
        shown = -1
        draw()
      })
    })
    draw()
  })

  /* Quick give chips (hero card, campaign side panel) */
  $$('[data-quick]').forEach(function (q) {
    var go = $('[data-quick-go]', q), line = $('[data-quick-line]', q), cause = q.dataset.cause || 'food', slug = q.dataset.campaign || ''
    var set = function (a) {
      $$('[data-amt]', q).forEach(function (o) { o.setAttribute('aria-pressed', String(Number(o.dataset.amt) === a)) })
      go.href = 'donate?amount=' + a + '&cause=' + cause + (slug ? '&campaign=' + slug : '')
      go.firstElementChild.textContent = 'Give ' + money(a)
      if (line) line.textContent = impactLine(a, cause).text
    }
    $$('[data-amt]', q).forEach(function (b) { b.addEventListener('click', function () { set(Number(b.dataset.amt)) }) })
    set(Number(q.dataset.start || 25))
  })

  /* ---------- Donate stepper ---------- */
  var donate = $('[data-donate]')
  if (donate) {
    var state = { amount: 25, monthly: false, cause: 'food', step: 1 }
    if (Number(params.get('amount')) > 0) state.amount = Number(params.get('amount'))
    if (GIFTS[params.get('cause')]) state.cause = params.get('cause')
    if (params.get('freq') === 'monthly') state.monthly = true
    var panes = $$('[data-pane]', donate), custom = $('[data-custom]', donate), causeSel = $('[data-cause]', donate)
    causeSel.value = state.cause
    var fundName = function () { return causeSel.options[causeSel.selectedIndex].textContent }
    var paintDonate = function () {
      $$('[data-amount]', donate).forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.amount) === state.amount)) })
      if (!$$('[data-amount]', donate).some(function (b) { return Number(b.dataset.amount) === state.amount })) custom.value = state.amount || ''
      $$('[data-freq]', donate).forEach(function (b) { b.setAttribute('aria-pressed', String((b.dataset.freq === 'monthly') === state.monthly)) })
      var line = impactLine(state.amount || 0, state.cause)
      var suffix = state.monthly ? ' every month' : ''
      $('[data-impact]', donate).textContent = (state.amount > 0 ? money(state.amount) + suffix + ' can provide ' + line.text + '.' : 'Enter an amount to see what it can do.')
      $$('[data-sum-amount]', donate).forEach(function (s) { s.textContent = money(state.amount || 0) + (state.monthly ? ' a month' : ' once') })
      $$('[data-sum-cause]', donate).forEach(function (s) { s.textContent = fundName() })
      $$('[data-step-dot]', donate).forEach(function (d, i) { d.classList.toggle('is-on', i < state.step) })
      var lab = $('[data-step-label]', donate)
      if (lab) lab.textContent = 'Step ' + state.step + ' of 3'
    }
    var goStep = function (n) {
      state.step = n
      panes.forEach(function (p) { p.hidden = Number(p.dataset.pane) !== n })
      paintDonate()
      var h = $('[data-pane="' + n + '"] h2', donate)
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }) }
      var top = donate.getBoundingClientRect().top
      if (top < 90) window.scrollBy({ top: top - 110, behavior: calm ? 'auto' : 'smooth' })
    }
    $$('[data-amount]', donate).forEach(function (b) { b.addEventListener('click', function () { state.amount = Number(b.dataset.amount); custom.value = ''; hideErr(custom); paintDonate() }) })
    custom.addEventListener('input', function () { state.amount = Math.max(0, Number(custom.value) || 0); hideErr(custom); paintDonate() })
    $$('[data-freq]', donate).forEach(function (b) { b.addEventListener('click', function () { state.monthly = b.dataset.freq === 'monthly'; paintDonate() }) })
    causeSel.addEventListener('change', function () { state.cause = causeSel.value; paintDonate() })
    $$('[data-next]', donate).forEach(function (b) {
      b.addEventListener('click', function () {
        var cur = state.step
        if (cur === 1 && !(state.amount >= 1)) { showErr(custom, 'Please choose or enter an amount of at least $1.'); custom.focus(); return }
        if (cur === 2 && !validate($('[data-pane="2"]', donate))) return
        goStep(cur + 1)
      })
    })
    $$('[data-back]', donate).forEach(function (b) { b.addEventListener('click', function () { goStep(state.step - 1) }) })
    var payBtn = $('[data-pay]', donate)
    if (payBtn) payBtn.addEventListener('click', function () { $('[data-pay-note]', donate).hidden = false })
    paintDonate()
  }

  /* ---------- Forms ---------- */
  function showErr(input, msg) {
    input.classList.add('is-bad')
    input.setAttribute('aria-invalid', 'true')
    var holder = input.closest('.field') || input.parentElement
    var e = $('.err', holder)
    if (!e) { e = document.createElement('span'); e.className = 'err'; e.id = 'err-' + (input.name || Math.random().toString(36).slice(2)); holder.appendChild(e); input.setAttribute('aria-describedby', e.id) }
    e.textContent = msg
  }
  function hideErr(input) {
    input.classList.remove('is-bad')
    input.removeAttribute('aria-invalid')
    input.removeAttribute('aria-describedby')
    var holder = input.closest('.field') || input.parentElement
    var e = $('.err', holder)
    if (e) e.remove()
  }
  function validate(scope) {
    var first = null
    $$('input, select, textarea', scope).forEach(function (i) {
      if (i.type === 'checkbox' && !i.required) return
      hideErr(i)
      var bad = ''
      if (i.required && i.type === 'checkbox' && !i.checked) bad = 'Please tick this box to continue.'
      else if (i.required && !i.value.trim()) bad = 'Please fill this in.'
      else if (i.type === 'email' && i.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value)) bad = 'Please enter a full email address.'
      if (bad) { showErr(i, bad); first = first || i }
    })
    if (first) first.focus()
    return !first
  }
  $$('form[data-form]').forEach(function (f) {
    f.setAttribute('novalidate', '')
    $$('input, select, textarea', f).forEach(function (i) { i.addEventListener('input', function () { if (i.classList.contains('is-bad')) hideErr(i) }) })
    f.addEventListener('submit', function (e) {
      e.preventDefault()
      if (!validate(f)) return
      var msg = $('[data-form-msg]', f)
      if (msg) {
        msg.hidden = false
        msg.setAttribute('tabindex', '-1')
        msg.focus({ preventScroll: true })
      }
      if (f.dataset.form === 'reset') f.reset()
    })
  })
  // Donor detail fields sit in the stepper rather than in a form submit, so clear their errors while typing
  if (donate) $$('[data-pane="2"] input', donate).forEach(function (i) { i.addEventListener('input', function () { if (i.classList.contains('is-bad')) hideErr(i) }) })

  var topic = params.get('topic')
  var topicSel = $('[data-topic]')
  if (topic && topicSel && $$('option', topicSel).some(function (o) { return o.value === topic })) topicSel.value = topic

  /* ---------- Stories carousel ---------- */
  $$('[data-stories]').forEach(function (s) {
    var slides = $$('.story-slide', s), dots = $$('[data-story-dot]', s), i = 0, timer
    var show = function (n, user) {
      i = (n + slides.length) % slides.length
      slides.forEach(function (sl, k) { sl.classList.toggle('is-active', k === i); sl.setAttribute('aria-hidden', String(k !== i)) })
      dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === i)); d.style.width = k === i ? '34px' : '12px'; d.style.background = k === i ? 'var(--color-pers)' : 'var(--color-line)' })
      if (user) clearInterval(timer)
    }
    $('[data-story-prev]', s).addEventListener('click', function () { show(i - 1, true) })
    $('[data-story-next]', s).addEventListener('click', function () { show(i + 1, true) })
    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k, true) }) })
    show(0)
    if (!calm) {
      timer = setInterval(function () { if (!document.hidden && !s.matches(':hover') && !s.contains(document.activeElement)) show(i + 1) }, 7500)
    }
  })

  /* ---------- Appeal countdown ---------- */
  var cd = $('[data-countdown]')
  if (cd) {
    var end = new Date(APPEAL_ENDS).getTime()
    var tick = function () {
      var left = end - Date.now()
      if (left <= 0) {
        cd.innerHTML = '<p class="h-sm">This appeal has closed. Thank you to everyone who gave.</p>'
        clearInterval(cdTimer)
        return
      }
      var d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60, s = Math.floor(left / 1e3) % 60
      var map = { d: d, h: h, m: m, s: s }
      Object.keys(map).forEach(function (k) { var el = $('[data-cd="' + k + '"]', cd); if (el) el.textContent = String(map[k]).padStart(2, '0') })
    }
    var cdTimer = setInterval(tick, 1000)
    tick()
  }

  /* ---------- Add to calendar ---------- */
  $$('[data-ics]').forEach(function (b) {
    b.addEventListener('click', function () {
      var stamp = new Date().toISOString().replace(/[-:]|\.\d+/g, '')
      var clean = function (s) { return s.replace(/[,;]/g, '\\$&') }
      var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Tamarind//Events//EN', 'BEGIN:VEVENT', 'UID:' + b.dataset.ics + '@tamarind.example', 'DTSTAMP:' + stamp, 'DTSTART:' + b.dataset.start, 'DTEND:' + b.dataset.end, 'SUMMARY:' + clean(b.dataset.title), 'LOCATION:' + clean(b.dataset.place), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
      var a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
      a.download = b.dataset.ics + '.ics'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(function () { URL.revokeObjectURL(a.href) }, 1000)
    })
  })

  /* ---------- Copy link ---------- */
  $$('[data-copy-link]').forEach(function (b) {
    b.addEventListener('click', function () {
      var label = b.textContent
      var done = function () { b.textContent = 'Link copied'; setTimeout(function () { b.textContent = label }, 1800) }
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, function () {})
    })
  })

  /* ---------- Scroll reveals, meters, counters ---------- */
  function countUp(el) {
    var target = Number(el.dataset.count), dec = Number(el.dataset.dec || 0), pre = el.dataset.pre || '', suf = el.dataset.suf || ''
    var fmt = function (v) { return pre + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf }
    if (calm) { el.textContent = fmt(target); return }
    var t0 = null, dur = 1700
    var step = function (t) {
      if (t0 === null) t0 = t
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4)
      el.textContent = fmt(target * e)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  var seen = $$('[data-reveal], .meter, [data-count]')
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return
        var el = en.target
        if (el.hasAttribute('data-reveal')) el.classList.add('is-revealed')
        if (el.classList.contains('meter')) el.classList.add('is-on')
        if (el.dataset.count) countUp(el)
        io.unobserve(el)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
    seen.forEach(function (el) { io.observe(el) })
  } else {
    seen.forEach(function (el) { el.classList.add('is-revealed', 'is-on') })
  }
})()
