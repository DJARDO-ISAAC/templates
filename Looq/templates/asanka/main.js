(function () {
  'use strict'

  /* ---------- Settings to change for your own kitchen ---------- */
  // Opening hours in local time, Sunday first. The kitchen stops taking orders KITCHEN_CLOSES_EARLY minutes before closing.
  var HOURS = [['12:00', '21:00'], ['07:00', '22:00'], ['07:00', '22:00'], ['07:00', '22:00'], ['07:00', '22:00'], ['07:00', '23:00'], ['07:00', '23:00']]
  var KITCHEN_CLOSES_EARLY = 30
  // Hours ahead of UTC for the restaurant. Accra is UTC+0 all year.
  var UTC_OFFSET = 0
  var CURRENCY = 'GH₵'
  var CART_KEY = 'asanka-order'

  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var params = new URLSearchParams(location.search)
  var money = function (n) { return CURRENCY + ' ' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }) }
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  var store = {
    get: function (k, d, s) { try { var v = (s ? sessionStorage : localStorage).getItem(k); return v ? JSON.parse(v) : d } catch (e) { return d } },
    set: function (k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, JSON.stringify(v)) } catch (e) {} }
  }
  var icon = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/></svg>' }
  var IC = { plus: icon('M12 5v14M5 12h14'), minus: icon('M5 12h14'), close: icon('M6 6l12 12M18 6 6 18') }

  /* ---------- Local time at the restaurant ---------- */
  var toMin = function (t) { var p = t.split(':'); return +p[0] * 60 + +p[1] }
  var fmt = function (m) { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0') }
  function localNow() {
    var d = new Date(Date.now() + UTC_OFFSET * 3600000)
    return { day: d.getUTCDay(), mins: d.getUTCHours() * 60 + d.getUTCMinutes(), date: d.toISOString().slice(0, 10) }
  }
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  function openState() {
    var n = localNow(), h = HOURS[n.day], o = toMin(h[0]), c = toMin(h[1])
    if (n.mins >= o && n.mins < c) return { open: true, text: 'Open now · until ' + h[1] }
    if (n.mins < o) return { open: false, text: 'Closed · opens at ' + h[0] }
    var next = HOURS[(n.day + 1) % 7]
    return { open: false, text: 'Closed · opens ' + next[0] + ' tomorrow' }
  }
  function paintOpen() {
    var s = openState()
    $$('[data-open-status]').forEach(function (el) { el.classList.toggle('is-open', s.open); $('span', el).textContent = s.text })
    var day = localNow().day
    $$('[data-hours] li').forEach(function (li) { li.classList.toggle('is-today', +li.dataset.day === day) })
  }
  paintOpen()
  setInterval(paintOpen, 60000)

  /* ---------- Header, order bar, dropdowns, mobile menu ---------- */
  var header = $('[data-header]'), orderBar = $('[data-order-bar]')
  function onScroll() {
    var y = window.scrollY
    if (header) header.classList.toggle('is-stuck', y > 30)
    if (orderBar) orderBar.classList.toggle('is-on', y > 640 && y + innerHeight < document.documentElement.scrollHeight - 520)
    catchUp()
    if (!calm) { parallax(); fillWords(); stackCards() }
  }
  var ticking = false
  window.addEventListener('scroll', function () {
    if (ticking) return
    ticking = true
    requestAnimationFrame(function () { onScroll(); ticking = false })
  }, { passive: true })

  var drops = $$('[data-dropdown]')
  function closeDrops(except) {
    drops.forEach(function (d) { if (d === except) return; d.classList.remove('is-open'); $('button', d).setAttribute('aria-expanded', 'false') })
  }
  drops.forEach(function (d) {
    var b = $('button', d), timer
    b.addEventListener('click', function () { var open = !d.classList.contains('is-open'); closeDrops(d); d.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open)) })
    d.addEventListener('mouseenter', function () { if (!matchMedia('(hover: hover)').matches) return; clearTimeout(timer); closeDrops(d); d.classList.add('is-open'); b.setAttribute('aria-expanded', 'true') })
    d.addEventListener('mouseleave', function () { if (!matchMedia('(hover: hover)').matches) return; timer = setTimeout(function () { d.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false') }, 160) })
    d.addEventListener('focusout', function (e) { if (!d.contains(e.relatedTarget)) { d.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false') } })
  })
  document.addEventListener('click', function (e) { if (!e.target.closest('[data-dropdown]')) closeDrops() })

  var menuBtn = $('[data-menu-button]'), panel = $('#mobile-menu')
  function setMenu(open) {
    if (!menuBtn) return
    menuBtn.setAttribute('aria-expanded', String(open))
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    panel.classList.toggle('is-open', open)
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true') })
    document.addEventListener('click', function (e) { if (panel.classList.contains('is-open') && !e.target.closest('.site-header')) setMenu(false) })
    $$('a', panel).forEach(function (a) { a.addEventListener('click', function () { setMenu(false) }) })
  }

  /* ---------- Scroll reveal and counters ---------- */
  function countUp(el) {
    var end = Number(el.dataset.count), suf = el.dataset.suf || ''
    if (calm || !end) { el.textContent = end.toLocaleString('en-US') + suf; return }
    var t0 = performance.now(), dur = 1500
    ;(function step(t) {
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4)
      el.textContent = Math.round(end * e).toLocaleString('en-US') + suf
      if (p < 1) requestAnimationFrame(step)
    })(t0)
  }
  var catchUp = function () {}
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return
        var el = en.target
        el.classList.add('is-revealed')
        $$('[data-count]', el).forEach(countUp)
        if (el.matches('[data-count]')) countUp(el)
        io.unobserve(el)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    $$('[data-reveal], [data-count]').forEach(function (el) { io.observe(el) })
    // A jump past an element (anchor link, fast fling) never makes it intersect, so reveal anything already above the fold
    var pending = $$('[data-reveal]')
    catchUp = function () {
      pending = pending.filter(function (el) {
        if (el.classList.contains('is-revealed')) return false
        if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('is-revealed'); $$('[data-count]', el).forEach(countUp); io.unobserve(el); return false }
        return true
      })
    }
  } else $$('[data-reveal]').forEach(function (el) { el.classList.add('is-revealed') })

  /* ---------- Scroll effects: parallax, filling words, stacking cards ---------- */
  var plx = $$('[data-parallax]')
  function parallax() {
    plx.forEach(function (el) {
      var r = el.getBoundingClientRect()
      if (r.bottom < -100 || r.top > innerHeight + 100) return
      var target = el.querySelector('img') || el
      target.style.setProperty('--py', ((r.top + r.height / 2 - innerHeight / 2) * -Number(el.dataset.parallax || 0.05)).toFixed(1) + 'px')
    })
  }
  var fill = $('[data-fill]'), words = []
  if (fill) {
    // Wrap each text word in a span, leaving the inline photos alone
    Array.prototype.slice.call(fill.childNodes).forEach(function (n) {
      if (n.nodeType !== 3) return
      var frag = document.createDocumentFragment()
      n.textContent.split(/(\s+)/).forEach(function (w) {
        if (!w) return
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return }
        var s = document.createElement('span'); s.className = 'w'; s.textContent = w; frag.appendChild(s); words.push(s)
      })
      fill.replaceChild(frag, n)
    })
    if (calm) words.forEach(function (w) { w.classList.add('on') })
  }
  function fillWords() {
    if (!words.length) return
    var r = fill.getBoundingClientRect()
    var p = Math.min(Math.max((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35), 0), 1)
    var n = Math.round(p * words.length)
    words.forEach(function (w, i) { w.classList.toggle('on', i < n) })
  }
  var stacks = $$('[data-stack]')
  function stackCards() {
    stacks.forEach(function (c, i) {
      var next = stacks[i + 1]
      if (!next) return
      var gap = next.getBoundingClientRect().top - c.getBoundingClientRect().top
      var p = Math.min(Math.max(1 - gap / c.offsetHeight, 0), 1)
      c.style.transform = 'scale(' + (1 - p * 0.05).toFixed(3) + ')'
      c.style.filter = 'brightness(' + (1 - p * 0.25).toFixed(3) + ')'
    })
  }

  /* ---------- Ticker bands speed up with scrolling ---------- */
  var tickers = $$('[data-ticker]')
  if (tickers.length && !calm) {
    var lastY = scrollY, boost = 0, offs = tickers.map(function () { return 0 })
    ;(function loop() {
      var dy = Math.abs(scrollY - lastY); lastY = scrollY
      boost = Math.min(boost * 0.92 + dy * 0.12, 14)
      tickers.forEach(function (t, i) {
        var track = t.firstElementChild, half = track.scrollWidth / 2, dir = Number(t.dataset.dir || 1)
        offs[i] = (offs[i] + (0.6 + boost) * dir) % half
        if (offs[i] < 0) offs[i] += half
        track.style.transform = 'translateX(' + (-offs[i]).toFixed(1) + 'px)'
      })
      requestAnimationFrame(loop)
    })()
  }

  /* ---------- Fan favourites: a photo follows the pointer ---------- */
  var fav = $('[data-fav]'), prev = $('[data-fav-preview]')
  if (fav && prev && matchMedia('(hover: hover)').matches) {
    var px = 0, py = 0, tx = 0, ty = 0, raf
    var follow = function () { px += (tx - px) * 0.16; py += (ty - py) * 0.16; prev.style.transform = 'translate(' + (px - 115) + 'px,' + (py - 150) + 'px) rotate(' + ((tx - px) * 0.04).toFixed(2) + 'deg)'; raf = requestAnimationFrame(follow) }
    $$('.fav-row', fav).forEach(function (row) {
      row.addEventListener('mouseenter', function () { $('img', prev).src = row.dataset.favImg; prev.classList.add('is-on') })
    })
    fav.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY })
    fav.addEventListener('mouseenter', function (e) { px = tx = e.clientX; py = ty = e.clientY; if (!calm) follow() })
    fav.addEventListener('mouseleave', function () { prev.classList.remove('is-on'); cancelAnimationFrame(raf) })
  }

  /* ---------- Recipe rail: drag to scroll, and arrow buttons ---------- */
  $$('[data-rail]').forEach(function (rail) {
    var down = false, x0 = 0, s0 = 0, moved = false
    rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; x0 = e.clientX; s0 = rail.scrollLeft })
    window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - x0; if (Math.abs(dx) > 5) { moved = true; rail.classList.add('is-dragging') } rail.scrollLeft = s0 - dx })
    window.addEventListener('pointerup', function () { if (!down) return; down = false; setTimeout(function () { rail.classList.remove('is-dragging') }, 0) })
    rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false } }, true)
    var sec = rail.closest('section')
    var by = function (d) { rail.scrollBy({ left: d * (rail.firstElementChild.offsetWidth + 22), behavior: calm ? 'auto' : 'smooth' }) }
    var p = $('[data-rail-prev]', sec), n = $('[data-rail-next]', sec)
    if (p) p.addEventListener('click', function () { by(-1) })
    if (n) n.addEventListener('click', function () { by(1) })
  })

  /* ---------- Tabs: pot of the day and food regions ---------- */
  function tabs(list, onSelect) {
    var btns = $$('[role="tab"]', list)
    function select(b, focus) {
      btns.forEach(function (x) {
        var on = x === b
        x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1
        var p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on
      })
      if (focus) b.focus()
      if (onSelect) onSelect(b)
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(b) })
      b.addEventListener('keydown', function (e) {
        var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
        if (e.key === 'Home') { e.preventDefault(); select(btns[0], true) }
        else if (e.key === 'End') { e.preventDefault(); select(btns[btns.length - 1], true) }
        else if (k) { e.preventDefault(); select(btns[(i + k + btns.length) % btns.length], true) }
      })
    })
    return select
  }
  var potTabs = $('[data-pot-tabs]')
  if (potTabs) {
    var today = localNow().day
    var selectPot = tabs(potTabs)
    var tb = $('[data-day="' + today + '"]', potTabs)
    tb.classList.add('is-today')
    selectPot(tb)
    var tp = $('#pot-' + today); var badge = tp && $('[data-pot-today]', tp); if (badge) badge.hidden = false
    var nm = $('[data-today-name]'); if (nm && tp) nm.textContent = $('h3', tp).textContent
  } else {
    var chipName = $('[data-today-name]'); if (chipName) chipName.hidden = false
  }
  $$('[data-tabs]').forEach(function (t) { tabs(t) })

  /* ---------- Filter chips (recipes, questions) ---------- */
  $$('[data-filter-group]').forEach(function (g) {
    var list = $('[data-filter-list="' + g.dataset.filterGroup + '"]')
    $$('[data-filter]', g).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-filter]', g).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) })
        var f = b.dataset.filter
        Array.prototype.forEach.call(list.children, function (c) { c.hidden = f !== 'all' && c.dataset.cat !== f })
      })
    })
  })

  /* ---------- Menu page filters ---------- */
  var tools = $('[data-menu-tools]')
  if (tools) {
    var fam = 'all', rows = $$('.menu-row'), q = $('[data-menu-search]'), vegBox = $('[data-menu-veg]'), gfBox = $('[data-menu-gf]'), heatSel = $('[data-menu-heat]')
    var famBtns = $$('[data-fam-btn]', tools)
    function applyMenu() {
      var text = q.value.trim().toLowerCase(), shown = 0
      rows.forEach(function (r) {
        var ok = (fam === 'all' || r.dataset.fam === fam) && (!vegBox.checked || r.dataset.veg === 'true') && (!gfBox.checked || r.dataset.gf === 'true') && Number(r.dataset.spice) <= Number(heatSel.value) && (!text || r.dataset.name.indexOf(text) > -1)
        r.hidden = !ok; if (ok) shown++
      })
      $$('[data-fam-sec]').forEach(function (s) { s.hidden = !$$('.menu-row:not([hidden])', s).length })
      $('[data-menu-count]').textContent = shown === rows.length ? rows.length + ' dishes' : shown + ' of ' + rows.length + ' dishes'
      $('[data-menu-empty]').hidden = shown > 0
    }
    famBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        fam = b.dataset.famBtn
        famBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) })
        var u = new URL(location.href); if (fam === 'all') u.searchParams.delete('family'); else u.searchParams.set('family', fam)
        history.replaceState(null, '', u)
        applyMenu()
      })
    })
    ;[q, vegBox, gfBox, heatSel].forEach(function (el) { el.addEventListener('input', applyMenu); el.addEventListener('change', applyMenu) })
    $('[data-menu-reset]').addEventListener('click', function () { q.value = ''; vegBox.checked = gfBox.checked = false; heatSel.value = '3'; famBtns[0].click() })
    var pf = params.get('family'), start = pf && $('[data-fam-btn="' + pf + '"]', tools)
    if (start) start.click(); else applyMenu()
  }

  /* ---------- Steppers ---------- */
  $$('[data-stepper]').forEach(function (s) {
    var input = $('input', s)
    var lo = Number(s.dataset.min || input.min || 1), hi = Number(s.dataset.max || input.max || 99)
    var clamp = function () { var v = Math.round(Number(input.value)); if (!isFinite(v)) v = lo; input.value = Math.min(Math.max(v, lo), hi) }
    $$('[data-step]', s).forEach(function (b) {
      b.addEventListener('click', function () { input.value = Number(input.value) + Number(b.dataset.step); clamp(); input.dispatchEvent(new Event('input', { bubbles: true })) })
    })
    input.addEventListener('change', function () { clamp(); input.dispatchEvent(new Event('input', { bubbles: true })) })
  })

  /* ---------- Order bag ---------- */
  var cart = store.get(CART_KEY, [])
  var saveCart = function () { store.set(CART_KEY, cart); paintCart() }
  var subtotal = function () { return cart.reduce(function (s, l) { return s + l.price * l.qty }, 0) }
  var count = function () { return cart.reduce(function (s, l) { return s + l.qty }, 0) }
  function addLine(item, qty, from) {
    var id = item.id + '|' + (item.opts || '')
    var line = cart.find(function (l) { return l.key === id })
    var max = item.max || 50
    if (line) line.qty = Math.min(line.qty + qty, max)
    else cart.push({ key: id, id: item.id, name: item.name, price: item.price, opts: item.opts || '', img: item.img || '', kind: item.kind || 'food', qty: Math.min(qty, max), max: max })
    saveCart()
    var badge = $('[data-cart-count]')
    if (badge) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); setTimeout(function () { badge.classList.remove('bump') }, 320) }
    fly(from, item.img)
    toast('<span>' + esc(item.name) + ' added</span><a href="order">View order</a>')
  }
  function fly(from, src) {
    var target = $('[data-open-cart]')
    if (calm || !from || !target || !src) return
    var a = from.getBoundingClientRect(), b = target.getBoundingClientRect()
    var f = document.createElement('div'); f.className = 'fly'; f.innerHTML = '<img alt="" src="' + esc(src) + '">'
    f.style.left = a.left + a.width / 2 - 27 + 'px'; f.style.top = a.top + a.height / 2 - 27 + 'px'
    document.body.appendChild(f)
    f.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + (b.left - a.left - a.width / 2 + 27 - 4) / 2 + 'px,' + ((b.top - a.top) / 2 - 90) + 'px) scale(.8)', opacity: 1, offset: 0.5 }, { transform: 'translate(' + (b.left + b.width / 2 - a.left - a.width / 2) + 'px,' + (b.top + b.height / 2 - a.top - a.height / 2) + 'px) scale(.2)', opacity: 0.3 }], { duration: 750, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = function () { f.remove() }
  }
  var toastEl = $('[data-toast]'), toastT
  function toast(html) {
    if (!toastEl) return
    toastEl.innerHTML = html; toastEl.classList.add('is-on')
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on') }, 3200)
  }
  function lineHTML(l, i) {
    return '<div class="line">' + (l.img ? '<div class="line-img"><img alt="" src="' + esc(l.img) + '"></div>' : '') + '<div class="min-w-0 flex-1"><p class="font-bold leading-tight">' + esc(l.name) + '</p>' + (l.opts ? '<p class="text-[.88rem] text-muted">' + esc(l.opts) + '</p>' : '') +
      '<div class="qty-mini"><button type="button" data-line-step="-1" data-i="' + i + '" aria-label="One fewer ' + esc(l.name) + '">' + IC.minus + '</button><span>' + l.qty + '</span><button type="button" data-line-step="1" data-i="' + i + '" aria-label="One more ' + esc(l.name) + '">' + IC.plus + '</button></div></div>' +
      '<div class="flex flex-col items-end gap-2"><p class="font-bold whitespace-nowrap">' + money(l.price * l.qty) + '</p><button type="button" class="text-[.86rem] font-semibold text-muted underline underline-offset-2 hover:text-palm" data-line-remove data-i="' + i + '">Remove</button></div></div>'
  }
  function paintCart() {
    var n = count(), badge = $('[data-cart-count]')
    if (badge) { badge.hidden = !n; badge.textContent = n }
    var lines = $('[data-cart-lines]')
    if (lines) {
      lines.innerHTML = cart.length ? cart.map(lineHTML).join('') : '<div class="py-14 text-center"><p class="font-display text-[1.6rem] font-extrabold uppercase">Your bowl is empty</p><p class="mt-1 text-muted">Add a dish from the menu to start.</p><a class="btn btn-cocoa btn-sm mt-5" href="menu"><span>See the menu</span></a></div>'
      $('[data-cart-actions]').hidden = !cart.length
      $('[data-cart-totals]').innerHTML = '<dl class="sum-rows !border-0 !pt-0"><div class="sum-total !mt-0 !border-0 !pt-0"><dt>Subtotal</dt><dd>' + money(subtotal()) + '</dd></div></dl><p class="mt-1 text-[.9rem] text-muted">Delivery is added at checkout.</p>'
    }
    paintCheckout()
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-line-step], [data-line-remove]')
    if (!b) return
    var i = Number(b.dataset.i), l = cart[i]
    if (!l) return
    if (b.hasAttribute('data-line-remove')) cart.splice(i, 1)
    else { l.qty += Number(b.dataset.lineStep); if (l.qty < 1) cart.splice(i, 1); else l.qty = Math.min(l.qty, l.max || 50) }
    saveCart()
  })
  // Quick "Add" buttons on the menu, pot of the day and pantry
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]')
    if (!b) return
    addLine({ id: b.dataset.id, name: b.dataset.name, price: Number(b.dataset.price), opts: b.dataset.opts, img: b.dataset.img, kind: b.dataset.kind }, 1, b)
  })

  // Dish and product pages: options change the price
  $$('[data-dish]').forEach(function (f) {
    var base = Number(f.dataset.price), qty = $('[data-qty]', f), out = $('[data-price-out]', f)
    var unit = function () { return base + $$('input[type=radio]:checked', f).reduce(function (s, r) { return s + Number(r.dataset.delta || 0) }, 0) }
    var paint = function () { out.textContent = money(unit() * Number(qty.value || 1)) }
    f.addEventListener('input', paint); f.addEventListener('change', paint)
    f.addEventListener('submit', function (e) {
      e.preventDefault()
      addLine({ id: f.dataset.id, name: f.dataset.name, price: unit(), opts: $$('input[type=radio]:checked', f).map(function (r) { return r.value }).join(', '), img: f.dataset.img, kind: f.dataset.kind || 'food' }, Number(qty.value || 1), $('[type=submit]', f))
    })
    paint()
  })

  /* ---------- Overlays: order drawer and search ---------- */
  var lastFocus
  function openLayer(layer) {
    lastFocus = document.activeElement
    layer.classList.add('is-open'); layer.setAttribute('aria-hidden', 'false')
    document.documentElement.style.overflow = 'hidden'
    setTimeout(function () { var f = $('input, button, a[href]', layer); if (f) f.focus() }, 60)
  }
  function closeLayers() {
    $$('.scrim.is-open').forEach(function (l) { l.classList.remove('is-open'); l.setAttribute('aria-hidden', 'true') })
    document.documentElement.style.overflow = ''
    if (lastFocus && lastFocus.focus) lastFocus.focus()
  }
  $$('.scrim').forEach(function (l) {
    l.addEventListener('click', function (e) { if (e.target === l) closeLayers() })
    l.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return
      var f = $$('a[href], button:not([disabled]), input, select, textarea', l).filter(function (x) { return x.offsetParent !== null })
      if (!f.length) return
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus() }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus() }
    })
  })
  $$('[data-close-layer]').forEach(function (b) { b.addEventListener('click', closeLayers) })
  var cartLayer = $('[data-cart-layer]'), searchLayer = $('[data-search-layer]')
  $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); openLayer(cartLayer) }) })
  $$('[data-open-search]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); openLayer(searchLayer) }) })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeLayers(); closeDrops(); setMenu(false) }
    var typing = /input|textarea|select/i.test(document.activeElement.tagName)
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); openLayer(searchLayer) }
  })

  var index = null, sIn = $('[data-search-input]'), sOut = $('[data-search-results]')
  function runSearch() {
    var q = sIn.value.trim().toLowerCase()
    if (!q) { sOut.innerHTML = '<p class="px-2 py-3 text-muted">Try “fufu”, “vegan”, “shito” or “Thursday”.</p>'; return }
    if (!index) { sOut.innerHTML = '<p class="px-2 py-3 text-muted">Loading...</p>'; return }
    var terms = q.split(/\s+/)
    var hits = index.map(function (x) {
      var t = x.t.toLowerCase(), d = (x.d || '').toLowerCase(), s = 0
      terms.forEach(function (w) { if (t.indexOf(w) === 0) s += 5; else if (t.indexOf(w) > -1) s += 3; if (d.indexOf(w) > -1) s += 1 })
      return { x: x, s: terms.every(function (w) { return t.indexOf(w) > -1 || d.indexOf(w) > -1 }) ? s : 0 }
    }).filter(function (h) { return h.s }).sort(function (a, b) { return b.s - a.s }).slice(0, 8)
    var mark = function (s) { var out = esc(s); terms.forEach(function (w) { if (w.length > 1) out = out.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>') }); return out }
    sOut.innerHTML = hits.length ? hits.map(function (h) { return '<a class="result" href="' + esc(h.x.u) + '"><span class="block text-[.78rem] font-bold uppercase tracking-[.12em] text-palm">' + esc(h.x.k) + '</span><span class="block font-display text-[1.35rem] font-extrabold uppercase leading-tight">' + mark(h.x.t) + '</span><span class="block text-[.92rem] text-muted">' + mark((h.x.d || '').slice(0, 120)) + '</span></a>' }).join('') : '<p class="px-2 py-3 text-muted">Nothing found for “' + esc(q) + '”.</p>'
  }
  if (sIn) {
    sIn.addEventListener('input', runSearch)
    sIn.addEventListener('focus', function () {
      if (index) return
      fetch('./assets/search-index.json').then(function (r) { return r.json() }).then(function (j) { index = j; runSearch() }).catch(function () { sOut.innerHTML = '<p class="px-2 py-3 text-muted">Search is not available right now.</p>' })
    })
    runSearch()
  }
  sOut && sOut.addEventListener('click', function (e) { if (e.target.closest('a')) closeLayers() })

  /* ---------- Form helpers ---------- */
  var PHONE = /^(\+?233|0)[235]\d{8}$/
  function setErr(input, msg) {
    var field = input.closest('.field') || input.parentElement
    var err = $('.err[data-for]', field)
    input.classList.toggle('is-bad', !!msg)
    input.setAttribute('aria-invalid', msg ? 'true' : 'false')
    if (msg) {
      if (!err) { err = document.createElement('span'); err.className = 'err'; err.setAttribute('data-for', ''); err.id = 'err-' + Math.random().toString(36).slice(2, 8); field.appendChild(err) }
      err.textContent = msg; err.hidden = false; input.setAttribute('aria-describedby', err.id)
    } else if (err) { err.hidden = true; input.removeAttribute('aria-describedby') }
    return !msg
  }
  function check(input) {
    var v = input.value.trim()
    if (input.required && !v && !input.disabled) return setErr(input, 'Please fill this in.')
    if (v && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setErr(input, 'That email does not look right.')
    if (v && (input.type === 'tel' || input.hasAttribute('data-phone')) && !PHONE.test(v.replace(/[\s-]/g, ''))) return setErr(input, 'Use a Ghana number, like 024 000 0000.')
    return setErr(input, '')
  }
  function validate(form) {
    var bad = $$('input, select, textarea', form).filter(function (i) { return i.offsetParent !== null && !check(i) })
    if (bad.length) bad[0].focus()
    return !bad.length
  }
  document.addEventListener('blur', function (e) { var t = e.target; if (t.matches && t.matches('.input') && t.getAttribute('aria-invalid') === 'true') check(t) }, true)
  $$('form[data-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault()
      if (!validate(f)) return
      var msg = $('[data-form-msg]', f)
      $$('input, textarea, select, button', f).forEach(function (el) { if (f.dataset.form === 'validate') el.disabled = true })
      if (f.dataset.form === 'reset') f.reset()
      if (msg) { msg.hidden = false; msg.focus && msg.setAttribute('tabindex', '-1'); msg.focus() }
    })
  })
  var todayISO = localNow().date
  $$('[data-min-today]').forEach(function (i) { i.min = todayISO })
  // Careers: "Apply for this role" picks it in the form
  $$('[data-apply]').forEach(function (a) { a.addEventListener('click', function () { var s = $('[data-role-select]'); if (s) s.value = a.dataset.apply }) })
  var topic = $('[data-topic]'); if (topic && params.get('topic')) topic.value = params.get('topic')

  /* ---------- Calendar files ---------- */
  function ics(title, date, start, end, where) {
    var d = date.replace(/-/g, ''), t = function (x) { var m = toMin(x) - UTC_OFFSET * 60; return d + 'T' + fmt(m).replace(':', '') + '00Z' }
    var body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Asanka//EN', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@asanka', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART:' + t(start), 'DTEND:' + t(end), 'SUMMARY:' + title, 'LOCATION:' + where, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
    var a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.ics'
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove() }, 500)
  }
  var PLACE = 'Asanka, 18 Akwaaba Lane, off Oxford Street, Osu, Accra'

  /* ---------- Checkout ---------- */
  var co = $('[data-checkout]')
  function zoneFee() { var z = $('[data-zone]'); return z ? Number(z.selectedOptions[0].dataset.fee) : 0 }
  function method() { var m = $('[data-method]:checked'); return m ? m.value : 'pickup' }
  function sums() {
    var sub = subtotal(), del = method() === 'delivery' ? zoneFee() : 0
    var foodOnly = cart.every(function (l) { return l.kind === 'gift' || l.kind === 'ticket' })
    if (foodOnly) del = 0
    return { sub: sub, del: del, total: sub + del }
  }
  function sumRows(s, m) { return '<div><dt>Subtotal</dt><dd>' + money(s.sub) + '</dd></div>' + (m === 'delivery' ? '<div><dt>Delivery</dt><dd>' + money(s.del) + '</dd></div>' : '<div><dt>Pickup</dt><dd>Free</dd></div>') + '<div class="sum-total"><dt>Total</dt><dd>' + money(s.total) + '</dd></div>' }
  function paintCheckout() {
    if (!co) return
    $('[data-checkout-empty]').hidden = !!cart.length
    co.hidden = !cart.length
    $('[data-checkout-lines]').innerHTML = cart.map(function (l, i) { return '<li>' + lineHTML(l, i) + '</li>' }).join('')
    $('[data-checkout-sums]').innerHTML = sumRows(sums(), method())
    $('[data-place-label]').textContent = 'Place order · ' + money(sums().total)
  }
  function buildSlots() {
    var sel = $('[data-slots]'), note = $('[data-slot-note]'), n = localNow(), opts = []
    var prep = method() === 'delivery' ? Number($('[data-zone]').selectedOptions[0].dataset.min) + 15 : 25
    var h = HOURS[n.day], o = toMin(h[0]), last = toMin(h[1]) - KITCHEN_CLOSES_EARLY
    if (n.mins >= o && n.mins < last) {
      opts.push(['asap', 'As soon as possible (about ' + prep + ' min)'])
      for (var m = Math.ceil((n.mins + prep + 15) / 30) * 30; m <= last; m += 30) opts.push([fmt(m), 'Today at ' + fmt(m)])
      note.textContent = ''
    } else {
      var day = n.mins < o ? n.day : (n.day + 1) % 7, label = n.mins < o ? 'Today' : 'Tomorrow'
      var oo = toMin(HOURS[day][0]), ll = toMin(HOURS[day][1]) - KITCHEN_CLOSES_EARLY
      for (var k = oo + 30; k <= ll; k += 30) opts.push([label.toLowerCase() + '-' + fmt(k), label + ' at ' + fmt(k)])
      note.textContent = 'We are closed right now, so choose a time once we open.'
    }
    var keep = sel.value
    sel.innerHTML = opts.map(function (x) { return '<option value="' + x[0] + '">' + x[1] + '</option>' }).join('')
    if (keep && $('option[value="' + keep + '"]', sel)) sel.value = keep
  }
  if (co) {
    var pay = function () { var p = $('[data-pay]:checked').value; $$('[data-pay-panel]').forEach(function (x) { x.hidden = x.dataset.payPanel !== p }) }
    var meth = function () {
      var del = method() === 'delivery'
      $('[data-delivery-fields]').hidden = !del
      $('[data-req-delivery]').required = del
      var cash = $('[data-pay][value="cash"]')
      cash.disabled = del; cash.closest('.radio-card').style.opacity = del ? '.5' : ''
      if (del && cash.checked) { $('[data-pay][value="momo"]').checked = true; pay() }
      buildSlots(); paintCheckout()
    }
    $$('[data-method]').forEach(function (r) { r.addEventListener('change', meth) })
    $('[data-zone]').addEventListener('change', function () { buildSlots(); paintCheckout() })
    $$('[data-pay]').forEach(function (r) { r.addEventListener('change', pay) })
    var card = $('[data-card]'), exp = $('[data-exp]')
    card.addEventListener('input', function () { card.value = card.value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim() })
    exp.addEventListener('input', function () { var v = exp.value.replace(/\D/g, '').slice(0, 4); exp.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v })
    meth(); pay()
    co.addEventListener('submit', function (e) {
      e.preventDefault()
      var err = $('[data-checkout-err]'), ok = validate(co), p = $('[data-pay]:checked').value
      if (p === 'momo') { var mm = $('[data-momo]'); ok = setErr(mm, PHONE.test(mm.value.replace(/[\s-]/g, '')) ? '' : 'Enter the Mobile Money number to charge.') && ok }
      if (p === 'card') {
        var digits = card.value.replace(/\D/g, ''), luhn = digits.split('').reverse().reduce(function (s, d, i) { d = +d; if (i % 2) { d *= 2; if (d > 9) d -= 9 } return s + d }, 0) % 10 === 0
        ok = setErr(card, digits.length >= 13 && luhn ? '' : 'Check the card number.') && ok
        var mmyy = exp.value.split('/'), now = new Date(), valid = mmyy.length === 2 && +mmyy[0] >= 1 && +mmyy[0] <= 12 && new Date(2000 + +mmyy[1], +mmyy[0]) > now
        ok = setErr(exp, valid ? '' : 'Use MM/YY, in the future.') && ok
        ok = setErr($('[data-cvc]'), /^\d{3,4}$/.test($('[data-cvc]').value) ? '' : '3 or 4 digits.') && ok
      }
      if (!ok) { err.textContent = 'Please check the highlighted fields.'; err.hidden = false; var b = $('.is-bad', co); if (b) b.focus(); return }
      err.hidden = true
      var s = sums(), slot = $('[data-slots]').selectedOptions[0]
      var order = { no: 'AS-' + String(Math.floor(1000 + Math.random() * 9000)), lines: cart, sums: s, method: method(), when: slot ? slot.textContent : '', name: co.name.value.trim().split(' ')[0], zone: method() === 'delivery' ? $('[data-zone]').value : '' }
      store.set('asanka-last', order, true)
      cart = []; store.set(CART_KEY, cart)
      location.href = 'order-confirmed'
    })
  }

  /* ---------- Order confirmed ---------- */
  var conf = $('[data-confirm]')
  if (conf) {
    var last = store.get('asanka-last', null, true)
    if (last) {
      $('[data-confirm-no]').textContent = '#' + last.no
      $('[data-confirm-line]').textContent = 'Thank you, ' + (last.name || 'friend') + '. ' + (last.method === 'delivery' ? 'Your rider leaves for ' + last.zone + ' as soon as it is packed. ' : 'Collect it at the counter. ') + (last.when ? 'Time: ' + last.when + '.' : '')
      $('[data-confirm-lines]').innerHTML = last.lines.map(function (l) { return '<li class="flex justify-between gap-4"><span><strong>' + l.qty + ' × ' + esc(l.name) + '</strong>' + (l.opts ? '<span class="block text-[.9rem] text-muted">' + esc(l.opts) + '</span>' : '') + '</span><span class="font-bold whitespace-nowrap">' + money(l.price * l.qty) + '</span></li>' }).join('')
      $('[data-confirm-sums]').innerHTML = sumRows(last.sums, last.method)
      var lastStage = $('[data-tracker] li:last-child .tracker-t'); if (lastStage) lastStage.textContent = last.method === 'delivery' ? 'On its way' : 'Ready'
    }
    var stages = $$('[data-tracker] li'), tracker = $('[data-tracker]')
    var setStage = function (n) { stages.forEach(function (s, i) { s.classList.toggle('is-on', i <= n) }); tracker.style.setProperty('--p', n / (stages.length - 1)) }
    setStage(0)
    // A demo of live progress. Replace with your kitchen system's status.
    ;[[1, 2500], [2, 7000]].forEach(function (x) { setTimeout(function () { setStage(x[0]) }, calm ? 0 : x[1]) })
  }

  /* ---------- Recipes: scale, tick off, time ---------- */
  var recipe = $('[data-recipe]')
  if (recipe) {
    var base = Number(recipe.dataset.serves), sIn2 = $('[data-serves-input]', recipe)
    var FR = [[0.25, '¼'], [0.333, '⅓'], [0.5, '½'], [0.667, '⅔'], [0.75, '¾']]
    var nice = function (q, u) {
      if (u === 'g' && q >= 1000) return nice(q / 1000, 'kg')
      if (u === 'ml' && q >= 1000) return nice(q / 1000, 'l')
      if (u === 'g' || u === 'ml') return Math.round(q / 5) * 5 + ' ' + u
      var whole = Math.floor(q), rest = q - whole, best = ''
      if (rest > 0.12) { var f = FR.reduce(function (a, b) { return Math.abs(b[0] - rest) < Math.abs(a[0] - rest) ? b : a }); if (rest > 0.88) { whole++ } else best = f[1] }
      var s = (whole || !best ? whole : '') + best
      return (s || '¼') + (u ? ' ' + u : '')
    }
    var scale = function () { var k = Number(sIn2.value) / base; $$('[data-qty]', recipe).forEach(function (el) { el.textContent = nice(Number(el.dataset.qty) * k, el.dataset.unit) }) }
    sIn2.addEventListener('input', scale)
    scale()
    var checks = $$('[data-step-check]'), prog = $('[data-step-progress]'), bar = $('[data-step-bar]')
    var paintSteps = function () { var n = checks.filter(function (c) { return c.checked }).length; checks.forEach(function (c) { c.closest('.method-step').classList.toggle('is-done', c.checked) }); prog.textContent = n === checks.length ? 'All done. Time to eat.' : n + ' of ' + checks.length + ' steps done'; bar.parentElement.style.setProperty('--v', (n / checks.length * 100) + '%'); bar.style.width = (n / checks.length * 100) + '%' }
    checks.forEach(function (c) { c.addEventListener('change', paintSteps) })
    $$('[data-timer]').forEach(function (t) {
      var total = Number(t.dataset.timer) * 60, left = total, id = null, out = $('[data-timer-out]', t), go = $('[data-timer-go]', t), reset = $('[data-timer-reset]', t)
      var show = function () { out.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0') }
      var label = function (txt) { $('span', go).textContent = txt }
      var stop = function () { clearInterval(id); id = null; t.classList.remove('is-running') }
      go.addEventListener('click', function () {
        if (id) { stop(); go.innerHTML = IC_PLAY + '<span>Resume</span>'; return }
        if (left <= 0) left = total
        t.classList.remove('is-done'); t.classList.add('is-running'); reset.hidden = false
        go.innerHTML = IC_PAUSE + '<span>Pause</span>'
        var end = Date.now() + left * 1000
        id = setInterval(function () {
          left = Math.max(0, Math.round((end - Date.now()) / 1000)); show()
          if (!left) { stop(); t.classList.add('is-done'); go.innerHTML = IC_PLAY + '<span>Again</span>'; toast('<span>Timer done: ' + esc($('p', t.parentElement).textContent.slice(0, 50)) + '…</span>'); if (navigator.vibrate) navigator.vibrate([200, 100, 200]) }
        }, 250)
      })
      reset.addEventListener('click', function () { stop(); left = total; show(); t.classList.remove('is-done'); reset.hidden = true; go.innerHTML = IC_PLAY + '<span>Start ' + t.dataset.timer + ' min</span>' })
      void label
    })
    var printB = $('[data-print]'); if (printB) printB.addEventListener('click', function () { window.print() })
    var wake = $('[data-wake]'), lock = null
    if (wake) {
      if (!('wakeLock' in navigator)) wake.hidden = true
      wake.addEventListener('click', function () {
        if (lock) { lock.release(); lock = null; wake.setAttribute('aria-pressed', 'false'); $('[data-wake-label]').textContent = 'Keep screen on'; return }
        navigator.wakeLock.request('screen').then(function (l) { lock = l; wake.setAttribute('aria-pressed', 'true'); $('[data-wake-label]').textContent = 'Screen stays on'; l.addEventListener('release', function () { lock = null; wake.setAttribute('aria-pressed', 'false'); $('[data-wake-label]').textContent = 'Keep screen on' }) }).catch(function () {})
      })
    }
  }
  var IC_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.500v13l10.500-6.500Z" fill="currentColor"/></svg>'
  var IC_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.500v14H7zM13.500 5H17v14h-3.500z" fill="currentColor"/></svg>'

  /* ---------- Catering estimate ---------- */
  var cater = $('[data-cater]')
  if (cater) {
    var g = $('[data-guests]', cater)
    var calc = function () {
      var n = Number(g.value), pack = $('input[name=pack]:checked', cater), per = Number(pack.dataset.per), total = n * per, rows = [[pack.dataset.name + ' × ' + n, n * per]]
      g.style.setProperty('--fill', ((n - g.min) / (g.max - g.min) * 100) + '%')
      $('[data-guests-out]', cater).textContent = n
      $$('[data-add-on]:checked', cater).forEach(function (a) {
        var p = Number(a.dataset.addOn), c = a.dataset.unit === 'head' ? p * n : a.dataset.unit === 'per25' ? p * Math.ceil(n / 25) : p
        total += c; rows.push([a.dataset.name, c])
      })
      $('[data-cater-total]', cater).textContent = money(total)
      $('[data-cater-per]', cater).textContent = money(Math.round(total / n)) + ' per guest'
      $('[data-cater-lines]', cater).innerHTML = rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + money(r[1]) + '</dd></div>' }).join('')
      return { n: n, total: total, rows: rows }
    }
    cater.addEventListener('input', calc); cater.addEventListener('change', calc); calc()
    $('[data-cater-go]', cater).addEventListener('click', function () {
      var c = calc(), notes = $('[data-cater-notes]')
      if (notes) notes.value = 'Estimate for ' + c.n + ' guests: ' + c.rows.map(function (r) { return r[0] + ' (' + money(r[1]) + ')' }).join(', ') + '. Total ' + money(c.total) + '.\n\n'
    })
  }

  /* ---------- Book a table ---------- */
  var book = $('[data-book]')
  if (book) {
    var dIn = $('[data-book-date]'), gIn = $('[data-book-guests]'), slotsEl = $('[data-book-slots]'), chosen = ''
    dIn.value = todayISO
    // A stand-in for real availability: some slots are full, more of them for big groups
    var full = function (date, t, n) { var h = 0, s = date + t; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997; return h % (n > 6 ? 3 : 6) === 0 }
    var paintSlots = function () {
      var date = dIn.value || todayISO, day = new Date(date + 'T12:00:00Z').getUTCDay(), h = HOURS[day], n = localNow()
      var first = Math.max(toMin(h[0]), 11 * 60 + 30), last = toMin(h[1]) - 90, out = []
      for (var m = first; m <= last; m += 30) {
        var past = date === todayISO && m < n.mins + 30
        if (!past) out.push([fmt(m), full(date, fmt(m), Number(gIn.value))])
      }
      $('[data-book-day]').textContent = DAY_NAMES[day] + ': open ' + h[0] + ' to ' + h[1] + '. Tables are held for two hours.'
      slotsEl.innerHTML = out.length ? out.map(function (s) { return '<button type="button" class="slot" aria-pressed="' + (s[0] === chosen && !s[1]) + '"' + (s[1] ? ' disabled aria-label="' + s[0] + ', full"' : '') + ' data-slot="' + s[0] + '">' + s[0] + '</button>' }).join('') : '<p class="text-muted">No times left today. Try tomorrow.</p>'
      if (!$('[data-slot="' + chosen + '"]:not([disabled])', slotsEl)) chosen = ''
    }
    slotsEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-slot]'); if (!b || b.disabled) return
      chosen = b.dataset.slot; $$('[data-slot]', slotsEl).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }); $('[data-slot-err]').hidden = true
    })
    dIn.addEventListener('change', paintSlots); gIn.addEventListener('input', paintSlots); paintSlots()
    book.addEventListener('submit', function (e) {
      e.preventDefault()
      var ok = validate(book)
      if (dIn.value && dIn.value < todayISO) ok = setErr(dIn, 'Choose today or a later date.') && false
      if (!chosen) { $('[data-slot-err]').hidden = false; ok = false }
      if (!ok) return
      var done = $('[data-booked]'), d = new Date(dIn.value + 'T12:00:00Z')
      var when = DAY_NAMES[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' }) + ' at ' + chosen
      $('[data-booked-line]').textContent = 'A table for ' + gIn.value + ' on ' + when + ', under ' + book.name.value.trim() + '. We will text you a reminder the day before.'
      book.hidden = true; done.hidden = false; done.focus()
      $('[data-ics]', done).onclick = function () { ics('Table at Asanka for ' + gIn.value, dIn.value, chosen, fmt(toMin(chosen) + 120), PLACE) }
    })
  }

  /* ---------- Events: seats to the order, calendar file ---------- */
  var ev = $('[data-event]')
  if (ev) {
    var eq = $('[data-qty]', ev), eo = $('[data-price-out]', ev), price = Number(ev.dataset.price)
    var paintEv = function () { eo.textContent = money(price * Number(eq.value || 1)) }
    eq.addEventListener('input', paintEv)
    if (Number(ev.dataset.left) < 1) { var add0 = $('[data-event-add]', ev); add0.disabled = true; add0.textContent = 'Sold out' }
    $('[data-event-add]', ev).addEventListener('click', function (e) { addLine({ id: ev.dataset.id, name: ev.dataset.name + ' seat', price: price, opts: ev.dataset.date + ', ' + ev.dataset.start, img: ev.dataset.img, kind: 'ticket', max: Number(ev.dataset.left) }, Number(eq.value || 1), e.currentTarget) })
    $('[data-ics]', ev).addEventListener('click', function () { ics(ev.dataset.name + ' at Asanka', ev.dataset.date, ev.dataset.start, ev.dataset.end, PLACE) })
  }

  /* ---------- Gift cards ---------- */
  var gf = $('[data-gift-form]')
  if (gf) {
    var amount = 200, gCard = $('[data-gift-card]'), gAmt = $('[data-gift-amt]'), custom = $('[data-gift-custom]')
    var paintAmt = function () { gAmt.textContent = money(amount); $('[data-gift-btn]').textContent = money(amount); if (!calm) { gAmt.classList.remove('pop'); void gAmt.offsetWidth; gAmt.classList.add('pop') } }
    $$('[data-gift-pick]', gf).forEach(function (b) { b.addEventListener('click', function () { amount = Number(b.dataset.giftPick); custom.value = ''; setErr(custom, ''); $$('[data-gift-pick]', gf).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }); paintAmt() }) })
    custom.addEventListener('input', function () {
      var v = Number(custom.value)
      $$('[data-gift-pick]', gf).forEach(function (x) { x.setAttribute('aria-pressed', 'false') })
      if (v >= 50 && v <= 2000) { amount = Math.round(v); setErr(custom, ''); paintAmt() }
    })
    $$('[data-gift-design]', gf).forEach(function (r) { r.addEventListener('change', function () { gCard.dataset.design = r.value }) })
    var toIn = $('[data-gift-to-in]'), msgIn = $('[data-gift-msg-in]')
    toIn.addEventListener('input', function () { $('[data-gift-to]').textContent = toIn.value.trim() ? 'For ' + toIn.value.trim() : 'For someone hungry' })
    msgIn.addEventListener('input', function () { $('[data-gift-msg]').textContent = msgIn.value; $('[data-gift-left]').textContent = '(' + (120 - msgIn.value.length) + ' left)' })
    gf.addEventListener('submit', function (e) {
      e.preventDefault()
      var ok = validate(gf)
      if (custom.value && !(Number(custom.value) >= 50 && Number(custom.value) <= 2000)) ok = setErr(custom, 'Choose between 50 and 2,000.') && false
      if (!ok) return
      addLine({ id: 'gift-' + amount + '-' + Date.now(), name: 'Gift card ' + money(amount), price: amount, opts: 'For ' + toIn.value.trim() + ', ' + $('[data-gift-design]:checked').closest('label').textContent.trim(), kind: 'gift', max: 1 }, 1, $('[type=submit]', gf))
    })
  }

  /* ---------- Food guide A to Z filter ---------- */
  var gs = $('[data-gloss-search]')
  if (gs) {
    gs.addEventListener('input', function () {
      var q = gs.value.trim().toLowerCase(), any = false
      $$('[data-gloss-group]').forEach(function (g) {
        var vis = 0
        $$('[data-gloss-item]', g).forEach(function (it) { var ok = !q || it.dataset.text.indexOf(q) > -1; it.hidden = !ok; if (ok) vis++ })
        g.hidden = !vis; if (vis) any = true
      })
      $('[data-gloss-empty]').hidden = any
    })
  }

  paintCart()
  onScroll()
})()
