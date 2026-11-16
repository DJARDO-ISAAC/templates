import Collapse from "bootstrap/js/dist/collapse";

(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const cedis = (n) => `GH₵ ${n.toLocaleString("en-GH")}`;

  // ---------------------------------------------------------------
  // One rAF loop for everything driven by scrolling
  // ---------------------------------------------------------------
  const scrollTasks = [];
  let ticking = false;
  const runScrollTasks = () => {
    ticking = false;
    scrollTasks.forEach((fn) => fn(window.scrollY));
  };
  const requestTick = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(runScrollTasks);
    }
  };
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);

  // Header: solid after scrolling, hides when scrolling down, returns on scroll up
  const header = $("[data-header]");
  const navCollapse = $("#mainNav");
  let lastY = window.scrollY;
  if (header) {
    scrollTasks.push((y) => {
      header.classList.toggle("is-scrolled", y > 30);
      const menuOpen = navCollapse && navCollapse.classList.contains("show");
      if (y > lastY + 4 && y > 500 && !menuOpen) header.classList.add("is-hidden");
      if (y < lastY - 4 || y < 500) header.classList.remove("is-hidden");
      lastY = y;
    });
  }
  if (navCollapse) {
    // Solid header while the mobile menu is open over the photo hero
    navCollapse.addEventListener("show.bs.collapse", () => header && header.classList.add("is-menu-open"));
    navCollapse.addEventListener("hidden.bs.collapse", () => header && header.classList.remove("is-menu-open"));
    $$(".nav-link, .btn", navCollapse).forEach((link) =>
      link.addEventListener("click", () => {
        if (navCollapse.classList.contains("show")) Collapse.getOrCreateInstance(navCollapse).hide();
      })
    );
  }

  // Back to top
  const toTop = $("[data-to-top]");
  if (toTop) {
    scrollTasks.push((y) => toTop.classList.toggle("is-visible", y > 900));
    toTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    });
  }

  // Current page in the navigation
  const fileOf = (url) => (url.pathname.split("/").pop() || "index.html").toLowerCase();
  const here = fileOf(window.location);
  $$(".tpl-nav .nav-link").forEach((link) => {
    const url = new URL(link.href, window.location.href);
    if (fileOf(url) === here && !url.hash) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // ---------------------------------------------------------------
  // Reveal on scroll + parallax + marquee
  // ---------------------------------------------------------------
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const parallaxEls = $$("[data-parallax]");
  if (parallaxEls.length && !reduceMotion.matches) {
    scrollTasks.push(() => {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) return;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -(parseFloat(el.dataset.parallax) || 0);
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      });
    });
  }

  $$("[data-marquee]").forEach((marquee) => {
    const track = $(".tpl-marquee-track", marquee);
    if (!track) return;
    const clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    marquee.appendChild(clone);
  });

  // ---------------------------------------------------------------
  // Open now / closed status (always in Accra time)
  // ---------------------------------------------------------------
  const accraNow = () => {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Accra", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date())
        .map((p) => [p.type, p.value])
    );
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
    return { day, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
  };
  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  const label = (hhmm) => {
    const mins = toMinutes(hhmm);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""}${h < 12 ? "am" : "pm"}`;
  };
  const updateStatus = () => {
    const { day, minutes } = accraNow();
    $$("[data-status]").forEach((el) => {
      const d = el.dataset;
      const hoursFor = (dd) => (dd === 0 ? [d.sunOpen, d.sunClose] : [d.open, d.close]);
      const [open, close] = hoursFor(day);
      const text = $("[data-status-text]", el);
      el.classList.remove("is-open", "is-fufu", "is-closed");
      if (minutes >= toMinutes(open) && minutes < toMinutes(close)) {
        const fufuReady = minutes >= toMinutes(d.fufu);
        el.classList.add(fufuReady ? "is-fufu" : "is-open");
        if ("short" in d) text.textContent = `Open until ${label(close)}`;
        else text.textContent = fufuReady
          ? `Open now · fufu is ready · until ${label(close)}`
          : `Open now · fufu from ${label(d.fufu)} · until ${label(close)}`;
      } else {
        el.classList.add("is-closed");
        const opensToday = minutes < toMinutes(open);
        const nextOpen = opensToday ? open : hoursFor((day + 1) % 7)[0];
        text.textContent = "short" in d
          ? `Opens ${label(nextOpen)}`
          : `Closed now · opens ${opensToday ? "today" : "tomorrow"} at ${label(nextOpen)}`;
      }
    });
    $$("[data-day]").forEach((row) => row.classList.toggle("is-today", Number(row.dataset.day) === day));
  };
  if ($("[data-status]")) {
    updateStatus();
    setInterval(updateStatus, 60000);
  }

  // ---------------------------------------------------------------
  // Today's pots: staff edit assets/today.json, no rebuild needed
  // ---------------------------------------------------------------
  const board = $("[data-today]");
  if (board && window.fetch) {
    const statusInfo = {
      available: ["tpl-pill--available", "Available"],
      few: ["tpl-pill--few", "A few left"],
      finished: ["tpl-pill--finished", "Finished"],
    };
    fetch("./assets/today.json", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.status))))
      .then((data) => {
        const list = $("[data-today-list]", board);
        list.replaceChildren(
          ...data.pots.map((pot) => {
            const [cls, text] = statusInfo[pot.status] || statusInfo.available;
            const li = document.createElement("li");
            if (pot.status === "finished") li.classList.add("is-finished");
            const dish = document.createElement("span");
            dish.className = "tpl-board-dish";
            const name = document.createElement("strong");
            name.textContent = pot.name;
            dish.append(name);
            if (pot.detail) {
              const small = document.createElement("small");
              small.textContent = pot.detail;
              dish.append(small);
            }
            const pill = document.createElement("span");
            pill.className = `tpl-pill ${cls}`;
            pill.textContent = text;
            li.append(dish, pill);
            return li;
          })
        );
        if (data.note) $("[data-today-note]", board).textContent = data.note;
        if (data.updated) {
          const when = new Date(data.updated);
          const time = $("[data-today-updated]", board);
          time.dateTime = data.updated;
          time.textContent = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Accra", weekday: "short", hour: "numeric", minute: "2-digit", hour12: true }).format(when);
        }
      })
      .catch(() => { /* keep the board that ships in the HTML */ });
  }

  // ---------------------------------------------------------------
  // Build your bowl
  // ---------------------------------------------------------------
  $$("[data-builder]").forEach((builder) => {
    const form = $("form", builder);
    const soupFill = $("[data-soup-fill]", builder);
    const layers = $$("[data-layer]", builder);
    const caption = $("[data-bowl-caption]", builder);
    const lines = $("[data-ticket-lines]", builder);
    const totalEl = $("[data-ticket-total]", builder);
    const qtyEl = $("[data-qty-value]", builder);
    const orderLink = $("[data-order-link]", builder);
    let qty = 1;
    let lastTotal = 0;

    const checked = (name) => $$(`input[name="${name}"]:checked`, form);
    const joinNice = (items) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} & ${items[items.length - 1]}`);

    const update = () => {
      const starch = checked("starch")[0];
      const soup = checked("soup")[0];
      const proteins = checked("protein");
      const extras = checked("extra");
      const pepper = checked("pepper")[0];

      // Illustration
      soupFill.style.fill = soup.dataset.color;
      const on = new Set([`starch:${starch.dataset.key}`, ...proteins.map((p) => `protein:${p.dataset.key}`)]);
      if (pepper.dataset.key === "medium" || pepper.dataset.key === "hot") on.add("pepper:medium");
      if (pepper.dataset.key === "hot") on.add("pepper:hot");
      layers.forEach((layer) => layer.classList.toggle("is-on", on.has(layer.dataset.layer)));
      caption.textContent = `${starch.value} with ${soup.value.toLowerCase()}${proteins.length ? `, ${joinNice(proteins.map((p) => p.value.toLowerCase()))}` : ""}`;

      // Ticket
      const rows = [[`${starch.value} & ${soup.value}`, Number(starch.dataset.price)]];
      proteins.forEach((p) => rows.push([`+ ${p.value}`, Number(p.dataset.price)]));
      extras.forEach((x) => rows.push([`+ ${x.value}`, Number(x.dataset.price)]));
      const perBowl = rows.reduce((sum, [, price]) => sum + price, 0);
      const total = perBowl * qty;
      lines.replaceChildren(
        ...rows.map(([name, price]) => {
          const li = document.createElement("li");
          li.innerHTML = "<span></span><span></span>";
          li.children[0].textContent = name;
          li.children[1].textContent = cedis(price);
          return li;
        }),
        ...(qty > 1 ? [Object.assign(document.createElement("li"), { textContent: `× ${qty} bowls` })] : [])
      );
      totalEl.textContent = cedis(total);
      if (total !== lastTotal && !reduceMotion.matches) {
        totalEl.classList.remove("is-bump");
        void totalEl.offsetWidth;
        totalEl.classList.add("is-bump");
      }
      lastTotal = total;
      qtyEl.textContent = String(qty);

      // WhatsApp message
      const name = form.elements.name.value.trim();
      const mode = form.elements.mode.value;
      const message = [
        `Hello ${builder.dataset.shop}! I'd like to order:`,
        `${qty} × ${starch.value} & ${soup.value}`,
        ...proteins.map((p) => `  + ${p.value}`),
        ...extras.map((x) => `  + ${x.value}`),
        `Pepper: ${pepper.value}`,
        `${mode}${name ? ` · Name: ${name}` : ""}`,
        `Total: ${cedis(total)}`,
      ].join("\n");
      orderLink.href = `https://wa.me/${builder.dataset.wa}?text=${encodeURIComponent(message)}`;
    };

    form.addEventListener("change", update);
    form.addEventListener("input", update);
    form.addEventListener("submit", (e) => e.preventDefault());
    $$("[data-qty]", builder).forEach((btn) =>
      btn.addEventListener("click", () => {
        qty = Math.min(20, Math.max(1, qty + Number(btn.dataset.qty)));
        update();
      })
    );
    update();
  });

  // ---------------------------------------------------------------
  // Menu: meat-free filter
  // ---------------------------------------------------------------
  const vegToggle = $("[data-veg-toggle]");
  if (vegToggle) {
    const main = $("#main");
    const status = $("[data-veg-status]");
    const note = $("[data-veg-empty]");
    $$(".tpl-menu-board").forEach((boardEl) => {
      if (!$('li[data-tags~="veg"]', boardEl)) boardEl.closest("[class*='col-']").classList.add("tpl-veg-none");
    });
    vegToggle.addEventListener("change", () => {
      const on = vegToggle.checked;
      main.classList.toggle("is-veg-only", on);
      $$(".tpl-veg-none").forEach((col) => { col.hidden = on; });
      if (note) note.hidden = !on;
      const count = $$('.tpl-menu-list li[data-tags~="veg"]').length;
      if (status) status.textContent = on ? `Showing ${count} meat-free dishes` : "Showing the full menu";
    });
  }

  // ---------------------------------------------------------------
  // Forms: validate, then POST to the endpoint set in site.json -> forms.
  // Until a real endpoint is set, forms run in demo mode.
  // ---------------------------------------------------------------
  const today = new Date().toISOString().split("T")[0];
  $$("[data-min-today]").forEach((input) => { input.min = today; });
  $$("form[data-form]").forEach((form) => {
    const success = form.dataset.success ? $(form.dataset.success) : null;
    const error = $("[data-form-error]", form);
    const submit = $("[type='submit']", form);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (error) error.hidden = true;
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        const firstInvalid = $("input:invalid, select:invalid, textarea:invalid", form);
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      submit.disabled = true;
      form.setAttribute("aria-busy", "true");
      try {
        if (!form.action || form.action.includes("YOUR_FORM_ID")) {
          console.info("[forms] Demo mode: add your form endpoint in site.json -> forms to receive submissions.");
          await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
          const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
          if (!response.ok) throw new Error(`Form endpoint responded ${response.status}`);
        }
        form.hidden = true;
        if (success) {
          success.hidden = false;
          success.focus();
        }
      } catch (err) {
        console.error(err);
        if (error) error.hidden = false;
      } finally {
        submit.disabled = false;
        form.removeAttribute("aria-busy");
      }
    });
  });

  runScrollTasks();
})();
