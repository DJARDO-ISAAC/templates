import Collapse from "bootstrap/js/dist/collapse";
import Tab from "bootstrap/js/dist/tab";
import "bootstrap/js/dist/carousel";
import Modal from "bootstrap/js/dist/modal";

(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // ---------------------------------------------------------------
  // Scroll-driven updates share one rAF loop
  // ---------------------------------------------------------------
  const scrollTasks = [];
  let ticking = false;
  const runScrollTasks = () => {
    ticking = false;
    const y = window.scrollY;
    scrollTasks.forEach((fn) => fn(y));
  };
  const requestTick = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(runScrollTasks);
    }
  };
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);

  // ---------------------------------------------------------------
  // Header: solid on scroll, hides on scroll down, shows on scroll up
  // ---------------------------------------------------------------
  const header = $("[data-header]");
  const navCollapse = $("#mainNav");
  let lastY = window.scrollY;
  if (header) {
    scrollTasks.push((y) => {
      header.classList.toggle("is-scrolled", y > 40);
      const menuOpen = navCollapse && navCollapse.classList.contains("show");
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (goingDown && y > 480 && !menuOpen) header.classList.add("is-hidden");
      if (goingUp || y < 480) header.classList.remove("is-hidden");
      lastY = y;
    });
  }

  // Close the mobile menu after choosing a link
  if (navCollapse) {
    $$(".nav-link, .btn", navCollapse).forEach((link) => {
      link.addEventListener("click", () => {
        if (navCollapse.classList.contains("show")) Collapse.getOrCreateInstance(navCollapse).hide();
      });
    });
  }

  // ---------------------------------------------------------------
  // Scroll progress bar + back-to-top
  // ---------------------------------------------------------------
  const progress = $(".tpl-progress-bar");
  const toTop = $("[data-to-top]");
  scrollTasks.push((y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? clamp(y / max) : 0})`;
    if (toTop) toTop.classList.toggle("is-visible", y > 900);
  });

  // ---------------------------------------------------------------
  // Reveal on scroll
  // ---------------------------------------------------------------
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // ---------------------------------------------------------------
  // Parallax (uses the `translate` property so it composes with CSS animations)
  // ---------------------------------------------------------------
  const parallaxEls = $$("[data-parallax]");
  if (parallaxEls.length && !reduceMotion.matches) {
    scrollTasks.push(() => {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) return;
        const speed = parseFloat(el.dataset.parallax) || 0;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      });
    });
  }

  // ---------------------------------------------------------------
  // Marquee: duplicate the track for a seamless loop
  // ---------------------------------------------------------------
  $$("[data-marquee]").forEach((marquee) => {
    const track = $(".tpl-marquee-track", marquee);
    if (!track) return;
    const clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    marquee.appendChild(clone);
  });

  // ---------------------------------------------------------------
  // Highlight the current page in the main navigation
  // ---------------------------------------------------------------
  const fileOf = (url) => (url.pathname.split("/").pop() || "index.html").toLowerCase();
  const currentFile = fileOf(window.location);
  const sectionOf = { "news-article.html": "news.html" };
  $$(".tpl-nav .nav-link").forEach((link) => {
    const target = fileOf(new URL(link.href, window.location.href));
    if (target === currentFile || target === sectionOf[currentFile]) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // ---------------------------------------------------------------
  // Curriculum tabs: open the tab named in the URL (#kg, #lp, #up, #jhs)
  // ---------------------------------------------------------------
  const tabForHash = { kg: "#tab-kg", lp: "#tab-lp", up: "#tab-up", jhs: "#tab-jhs" };
  const openTabFromHash = () => {
    const selector = tabForHash[window.location.hash.slice(1)];
    const button = selector ? $(selector) : null;
    if (button) Tab.getOrCreateInstance(button).show();
  };
  if ($("#tab-kg")) {
    openTabFromHash();
    window.addEventListener("hashchange", openTabFromHash);
  }

  // ---------------------------------------------------------------
  // Class finder (3-step quiz)
  // ---------------------------------------------------------------
  const finder = $("[data-finder]");
  if (finder) {
    const steps = $$("[data-step]", finder);
    const bar = $("[data-finder-bar]", finder);
    const progressWrap = $(".progress", finder);
    const current = $("[data-finder-current]", finder);
    const prevBtn = $("[data-finder-prev]", finder);
    const nextBtn = $("[data-finder-next]", finder);
    const nextLabel = $("[data-finder-next-label]", finder);
    const nav = $("[data-finder-nav]", finder);
    const result = $("[data-finder-result]", finder);
    const live = $("[data-finder-live]", finder);
    const form = $("form", finder);
    const names = ["age", "from", "focus"];
    let step = 0;

    const classes = {
      4: ["KG 1", "Kindergarten · Foundation", "kg"],
      5: ["KG 2", "Kindergarten · Foundation", "kg"],
      6: ["Basic 1", "Lower Primary · Ages 6–8", "lp"],
      7: ["Basic 2", "Lower Primary · Ages 6–8", "lp"],
      8: ["Basic 3", "Lower Primary · Ages 6–8", "lp"],
      9: ["Basic 4", "Upper Primary · Ages 9–11", "up"],
      10: ["Basic 5", "Upper Primary · Ages 9–11", "up"],
      11: ["Basic 6", "Upper Primary · Ages 9–11", "up"],
      12: ["JHS 1", "Junior High · Basic 7", "jhs"],
      13: ["JHS 2", "Junior High · Basic 8", "jhs"],
      14: ["JHS 3", "Junior High · Basic 9", "jhs"],
    };
    const phaseText = {
      kg: "In KG your child learns through play across four integrated themes, with Twi or Ga alongside English.",
      lp: "In Lower Primary your child builds strong reading and numeracy foundations while moving steadily from a Ghanaian language to English.",
      up: "In Upper Primary English becomes the main language of teaching, with weekly science labs, computing and project work.",
      jhs: "In JHS your child follows the Common Core Programme and works step by step towards the BECE.",
    };
    const fromItems = {
      none: "A relaxed play visit or short readiness check, with no exam pressure",
      gh: "Bring your child's latest terminal report and a transfer letter",
      intl: "A placement assessment that maps previous learning to the GES curriculum, with Ghanaian language support if needed",
    };
    const focusItems = {
      literacy: "A daily 40-minute reading block and small-group maths support",
      stem: "A weekly science lab and computing lessons, plus a robotics club from Basic 4",
      languages: "Twi or Ga, French from Basic 1, plus music, drumming and art",
      bece: { jhs: "Termly BECE mock exams from Basic 8 and Saturday revision clinics", other: "Termly progress reports with clear targets in every subject" },
    };

    const value = (name) => {
      const checked = $(`input[name="${name}"]:checked`, finder);
      return checked ? checked.value : null;
    };

    const render = () => {
      steps.forEach((el, i) => { el.hidden = i !== step; });
      current.textContent = String(step + 1).padStart(2, "0");
      bar.style.width = `${((step + 1) / steps.length) * 100}%`;
      progressWrap.setAttribute("aria-valuenow", String(step + 1));
      prevBtn.disabled = step === 0;
      nextBtn.disabled = !value(names[step]);
      nextLabel.textContent = step === steps.length - 1 ? "See recommendation" : "Next";
    };

    const showResult = () => {
      const age = Number(value("age"));
      const [cls, phase, key] = classes[age];
      const items = [fromItems[value("from")]];
      const focus = value("focus");
      items.push(focus === "bece" ? focusItems.bece[key === "jhs" ? "jhs" : "other"] : focusItems[focus]);
      if (age === 14) items.push("JHS 3 entry is limited because BECE registration closes early in the school year");

      $("[data-result-class]", finder).textContent = cls;
      $("[data-result-phase]", finder).textContent = phase;
      $("[data-result-text]", finder).textContent = phaseText[key];
      const list = $("[data-result-list]", finder);
      list.replaceChildren(
        ...items.map((text) => {
          const li = document.createElement("li");
          li.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg>';
          li.append(document.createTextNode(text));
          return li;
        })
      );
      const cta = $("[data-result-cta]", finder);
      cta.firstChild.textContent = `Apply for ${cls} `;

      steps.forEach((el) => { el.hidden = true; });
      nav.hidden = true;
      result.hidden = false;
      current.textContent = "03";
      bar.style.width = "100%";
      live.textContent = `Recommended class: ${cls}, ${phase}.`;
      result.focus({ preventScroll: true });
    };

    form.addEventListener("change", () => { nextBtn.disabled = !value(names[step]); });
    form.addEventListener("submit", (e) => e.preventDefault());
    nextBtn.addEventListener("click", () => {
      if (!value(names[step])) return;
      if (step < steps.length - 1) {
        step += 1;
        render();
        const firstInput = $("input", steps[step]);
        if (firstInput) firstInput.focus({ preventScroll: true });
      } else {
        showResult();
      }
    });
    prevBtn.addEventListener("click", () => {
      if (step > 0) {
        step -= 1;
        render();
      }
    });
    $("[data-finder-restart]", finder).addEventListener("click", () => {
      form.reset();
      step = 0;
      result.hidden = true;
      nav.hidden = false;
      render();
      const firstInput = $("input", steps[0]);
      if (firstInput) firstInput.focus({ preventScroll: true });
    });
    render();
  }

  // ---------------------------------------------------------------
  // Journey: vertical scroll drives a horizontal track (large screens)
  // ---------------------------------------------------------------
  const hSection = $("[data-hscroll]");
  if (hSection) {
    const track = $("[data-hscroll-track]", hSection);
    const hBar = $("[data-hscroll-bar]", hSection);
    const desktop = window.matchMedia("(min-width: 992px)");
    let pinned = false;
    let distance = 0;

    const measure = () => {
      pinned = desktop.matches && !reduceMotion.matches;
      hSection.classList.toggle("is-pinned", pinned);
      track.style.transform = "";
      if (pinned) {
        const last = track.lastElementChild;
        const padRight = parseFloat(getComputedStyle(track).paddingRight) || 0;
        distance = Math.max(0, last.offsetLeft + last.offsetWidth + padRight - track.clientWidth);
        hSection.style.height = `${window.innerHeight + distance}px`;
      } else {
        distance = 0;
        hSection.style.height = "";
      }
      requestTick();
    };

    scrollTasks.push(() => {
      let p;
      if (pinned) {
        const rect = hSection.getBoundingClientRect();
        const span = hSection.offsetHeight - window.innerHeight;
        p = span > 0 ? clamp(-rect.top / span) : 0;
        track.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
      } else {
        const max = track.scrollWidth - track.clientWidth;
        p = max > 0 ? clamp(track.scrollLeft / max) : 0;
      }
      if (hBar) hBar.style.transform = `scaleX(${p})`;
    });

    track.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    reduceMotion.addEventListener("change", measure);
    window.addEventListener("load", measure);
    measure();
  }

  // ---------------------------------------------------------------
  // Why-us: swap the sticky image as each row reaches the middle
  // ---------------------------------------------------------------
  const swapSection = $("[data-sticky-swap]");
  if (swapSection && "IntersectionObserver" in window) {
    const rows = $$("[data-swap-row]", swapSection);
    const imgs = $$("[data-swap-img]", swapSection);
    const indexLabel = $("[data-swap-index]", swapSection);
    const activate = (i) => {
      rows.forEach((r, n) => r.classList.toggle("is-active", n === i));
      imgs.forEach((img, n) => img.classList.toggle("is-active", n === i));
      if (indexLabel) indexLabel.textContent = String(i + 1).padStart(2, "0");
    };
    const swapObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) activate(Number(entry.target.dataset.swapRow));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    rows.forEach((row) => swapObserver.observe(row));
    activate(0);
  }

  // ---------------------------------------------------------------
  // Statement: words light up as you scroll
  // ---------------------------------------------------------------
  const statement = $("[data-words]");
  if (statement) {
    const words = statement.textContent.trim().split(/\s+/);
    statement.setAttribute("aria-label", words.join(" "));
    statement.replaceChildren(
      ...words.flatMap((word, i) => {
        const span = document.createElement("span");
        span.className = "tpl-word";
        span.setAttribute("aria-hidden", "true");
        span.textContent = word;
        return i < words.length - 1 ? [span, document.createTextNode(" ")] : [span];
      })
    );
    const spans = $$(".tpl-word", statement);
    if (reduceMotion.matches) {
      spans.forEach((s) => s.classList.add("is-lit"));
    } else {
      scrollTasks.push(() => {
        const rect = statement.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.85;
        const end = vh * 0.35;
        const p = clamp((start - rect.top) / (start - end + rect.height * 0.6));
        const lit = Math.round(p * spans.length);
        spans.forEach((s, i) => s.classList.toggle("is-lit", i < lit));
      });
    }
  }

  // ---------------------------------------------------------------
  // Odometer counters
  // ---------------------------------------------------------------
  const odometers = $$(".tpl-odometer[data-count]");
  if (odometers.length) {
    const build = (el) => {
      const target = String(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      el.setAttribute("aria-label", target + suffix);
      el.setAttribute("role", "img");
      const reels = [];
      el.replaceChildren(
        ...target.split("").map((digit) => {
          const wrap = document.createElement("span");
          wrap.className = "tpl-odo-digit";
          wrap.setAttribute("aria-hidden", "true");
          const reel = document.createElement("span");
          reel.className = "tpl-odo-reel";
          for (let r = 0; r < 2; r += 1) {
            for (let n = 0; n <= 9; n += 1) {
              const s = document.createElement("span");
              s.textContent = String(n);
              reel.appendChild(s);
            }
          }
          reel.dataset.target = String(10 + Number(digit));
          wrap.appendChild(reel);
          reels.push(reel);
          return wrap;
        })
      );
      if (suffix) {
        const s = document.createElement("span");
        s.className = "tpl-odo-suffix";
        s.setAttribute("aria-hidden", "true");
        s.textContent = suffix;
        el.appendChild(s);
      }
      return reels;
    };
    // Each digit column takes the width of its final digit, so "100" doesn't read as "1 00"
    const sizeColumns = () => {
      odometers.forEach((el) => {
        const fontSize = parseFloat(getComputedStyle(el).fontSize) || 16;
        $$(".tpl-odo-reel", el).forEach((reel) => {
          const probe = document.createElement("span");
          probe.textContent = String(Number(reel.dataset.target) - 10);
          probe.setAttribute("aria-hidden", "true");
          probe.className = "position-absolute invisible";
          el.appendChild(probe);
          reel.parentElement.style.width = `${(probe.getBoundingClientRect().width / fontSize).toFixed(3)}em`;
          probe.remove();
        });
      });
    };
    const spin = (reels) => {
      reels.forEach((reel, i) => {
        reel.style.transitionDelay = `${i * 0.12}s`;
        reel.style.transform = `translateY(-${reel.dataset.target}em)`;
      });
    };

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      odometers.forEach((el) => {
        const reels = build(el);
        reels.forEach((reel) => {
          reel.style.transition = "none";
          reel.style.transform = `translateY(-${reel.dataset.target}em)`;
        });
      });
    } else {
      const odoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            spin(entry.target._reels);
            odoObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );
      odometers.forEach((el) => {
        el._reels = build(el);
        odoObserver.observe(el);
      });
    }
    sizeColumns();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeColumns);
  }

  // ---------------------------------------------------------------
  // Forms: validate, then POST to the endpoint in the form's action
  // (set in site.json -> forms). Until a real endpoint is set, forms run
  // in demo mode and only show the success message.
  // ---------------------------------------------------------------
  const isDemoEndpoint = (url) => !url || url.includes("YOUR_FORM_ID");
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
        if (form.classList.contains("tpl-newsletter-form") && error) error.hidden = false;
        const firstInvalid = $("input:invalid, select:invalid, textarea:invalid", form);
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      submit.disabled = true;
      form.setAttribute("aria-busy", "true");
      try {
        if (isDemoEndpoint(form.action)) {
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

    // Forms inside a modal reset when it closes
    const resetOn = form.dataset.resetOn ? $(form.dataset.resetOn) : null;
    if (resetOn) {
      resetOn.addEventListener("hidden.bs.modal", () => {
        form.reset();
        form.classList.remove("was-validated");
        form.hidden = false;
        if (error) error.hidden = true;
        if (success) success.hidden = true;
      });
    }
  });

  // ---------------------------------------------------------------
  // Filters (news page)
  // ---------------------------------------------------------------
  $$("[data-filter-group]").forEach((group) => {
    const grid = $(group.dataset.filterGroup);
    if (!grid) return;
    const items = $$("[data-filter-item]", grid);
    const empty = $("[data-filter-empty]", grid.parentElement);
    const status = $("[data-filter-status]", grid.parentElement);
    $$("[data-filter]", group).forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.filter;
        $$("[data-filter]", group).forEach((b) => {
          const on = b === button;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        let shown = 0;
        items.forEach((item) => {
          const match = value === "all" || item.dataset.filterItem === value;
          item.classList.toggle("is-filtered-out", !match);
          if (match) {
            shown += 1;
            const card = $("[data-reveal]", item);
            if (card) card.classList.add("is-visible");
          }
        });
        if (empty) empty.hidden = shown > 0;
        if (status) status.textContent = `${shown} ${shown === 1 ? "story" : "stories"} shown`;
      });
    });
  });

  // ---------------------------------------------------------------
  // Gallery lightbox
  // ---------------------------------------------------------------
  const gallery = $("[data-gallery]");
  const lightboxEl = $("#lightbox");
  if (gallery && lightboxEl) {
    const tiles = $$(".tpl-gallery-item", gallery);
    const lbImg = $("[data-lightbox-img]", lightboxEl);
    const lbCaption = $("[data-lightbox-caption]", lightboxEl);
    const lbCount = $("[data-lightbox-count]", lightboxEl);
    const lightbox = Modal.getOrCreateInstance(lightboxEl);
    let index = 0;
    const show = (i) => {
      index = (i + tiles.length) % tiles.length;
      const tile = tiles[index];
      const thumb = $("img", tile);
      lbImg.src = tile.dataset.full;
      lbImg.alt = thumb ? thumb.alt : "";
      lbCaption.textContent = tile.dataset.caption || "";
      lbCount.textContent = `${index + 1} / ${tiles.length}`;
    };
    tiles.forEach((tile, i) => tile.addEventListener("click", () => { show(i); lightbox.show(); }));
    $("[data-lightbox-prev]", lightboxEl).addEventListener("click", () => show(index - 1));
    $("[data-lightbox-next]", lightboxEl).addEventListener("click", () => show(index + 1));
    lightboxEl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    lightboxEl.addEventListener("hidden.bs.modal", () => { if (tiles[index]) tiles[index].focus(); });
  }

  // ---------------------------------------------------------------
  // Back to top + share links
  // ---------------------------------------------------------------
  if (toTop) {
    toTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    });
  }
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);
  $$("[data-share]").forEach((link) => {
    if (link.dataset.share === "facebook") link.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    if (link.dataset.share === "x") link.href = `https://x.com/intent/post?url=${pageUrl}&text=${pageTitle}`;
    if (link.dataset.share === "whatsapp") link.href = `https://wa.me/?text=${pageTitle}%20${pageUrl}`;
  });

  runScrollTasks();
})();
