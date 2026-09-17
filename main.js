/* Motion system: Lenis smooth scroll + GSAP ScrollTrigger.
   Everything here is additive. The page is complete without it. */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const html = document.documentElement;

  /* ---------- Header + mobile nav (no GSAP needed) ---------- */
  const header = document.querySelector("[data-header]");
  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector("[data-nav-toggle]");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle) {
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); } });
    window.matchMedia("(min-width: 901px)").addEventListener("change", e => { if (e.matches) setMenu(false); });
  }

  /* ---------- Images: fade in as each one decodes; the blurred placeholder underneath fades out ---------- */
  document.querySelectorAll(".img-shell, .hero__poster").forEach(shell => {
    const media = shell.matches("img") ? shell : shell.querySelector("img, iframe");
    const done = () => shell.classList.add("is-loaded");
    if (!media) return done();
    if (media.tagName === "IMG" && media.complete && media.naturalWidth) return done();
    media.addEventListener("load", done, { once: true });
    media.addEventListener("error", done, { once: true });
  });

  /* ---------- Contact form: builds a mailto message, no server involved ---------- */
  const form = document.querySelector("[data-form]");
  if (form) {
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector("[data-form-submit]");
    const fields = ["name", "email", "subject", "message"].map(n => form.elements[n]);

    function validate(el) {
      const wrap = el.closest(".form__field");
      const err = wrap.querySelector(".form__error");
      let ok = el.value.trim().length > 0;
      if (ok && el.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
      wrap.classList.toggle("is-invalid", !ok);
      el.setAttribute("aria-invalid", String(!ok));
      if (!ok) el.setAttribute("aria-describedby", err.id); else el.removeAttribute("aria-describedby");
      return ok;
    }
    fields.forEach(el => {
      el.addEventListener("blur", () => { if (el.value) validate(el); });
      el.addEventListener("input", () => { if (el.closest(".form__field").classList.contains("is-invalid")) validate(el); });
    });

    form.addEventListener("submit", e => {
      e.preventDefault();
      const results = fields.map(validate);
      if (results.includes(false)) {
        status.textContent = "";
        fields[results.indexOf(false)].focus();
        return;
      }
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const subject = form.elements.subject.value;
      const message = form.elements.message.value.trim();
      const body = `${message}\n\n${name}\n${email}`;
      const t = k => (window.MCI18N ? window.MCI18N.t(k) : k);
      const href = `mailto:mingattorney@gmail.com?subject=${encodeURIComponent(subject + t("form.mailSubject"))}&body=${encodeURIComponent(body)}`;

      submit.setAttribute("aria-busy", "true");
      status.classList.remove("is-ok");
      status.textContent = "";
      window.location.href = href;
      window.setTimeout(() => {
        submit.removeAttribute("aria-busy");
        status.classList.add("is-ok");
        status.textContent = t("form.status");
      }, 900);
    });
  }

  /* ---------- Plan view canvas (the model seen from above) ---------- */
  const planCanvas = document.querySelector("[data-plan-canvas]");
  if (planCanvas && window.MCCity) {
    const layout = window.MCCity.generate();
    const ctx = planCanvas.getContext("2d");
    function drawPlan() {
      const rect = planCanvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      planCanvas.width = Math.round(rect.width * dpr);
      planCanvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      // fit the plan inside its panel, rotated so the long side runs vertically on tall panels
      const portrait = rect.height > rect.width;
      const pw = portrait ? layout.depth : layout.width;
      const ph = portrait ? layout.width : layout.depth;
      const scale = Math.min((rect.width * 0.78) / pw, (rect.height * 0.64) / ph);
      const ox = rect.width / 2;
      const oy = rect.height * 0.44;

      ctx.lineWidth = 1;
      layout.blocks.forEach(b => {
        const bx = portrait ? b.z : b.x, by = portrait ? -b.x : b.z;
        const bw = portrait ? b.sz : b.sx, bh = portrait ? b.sx : b.sz;
        const x = ox + (bx - bw / 2) * scale;
        const y = oy + (by - bh / 2) * scale;
        const w = bw * scale, h = bh * scale;
        if (b.accent) {
          ctx.fillStyle = "#C63D2A";
          ctx.fillRect(x, y, w, h);
        } else {
          ctx.fillStyle = `rgba(237, 238, 234, ${0.06 + Math.min(b.h, 4) * 0.05})`;
          ctx.fillRect(x, y, w, h);
          ctx.strokeStyle = "rgba(237, 238, 234, 0.35)";
          ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        }
      });
      // site boundary
      ctx.strokeStyle = "rgba(237, 238, 234, 0.35)";
      ctx.setLineDash([3, 5]);
      ctx.strokeRect(ox - pw * scale / 2 - 12, oy - ph * scale / 2 - 12, pw * scale + 24, ph * scale + 24);
      ctx.setLineDash([]);
    }
    drawPlan();
    let raf = 0;
    new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(drawPlan); }).observe(planCanvas.parentElement);
  }



  /* ---------- Everything below needs GSAP ---------- */
  if (!hasGsap) { html.classList.remove("has-motion"); return; }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.85 });

  /* Header state */
  ScrollTrigger.create({
    start: 24,
    onUpdate: self => header.classList.toggle("is-scrolled", self.scroll() > 24),
    onRefresh: self => header.classList.toggle("is-scrolled", self.scroll() > 24)
  });

  /* Smooth scroll, one engine only */
  let lenis = null;
  if (!reduceMotion && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9, anchors: { offset: -72, duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) } });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  if (reduceMotion) {
    // finished states, no choreography
    gsap.set("[data-split], [data-reveal], [data-reveal-item], [data-image-reveal], [data-reveal-lines] li, [data-reveal-soft-group] > *, [data-reveal-marquee], .public__bg, .rule-draw", { autoAlpha: 1, clearProps: "all" });
    return;
  }

  /* ---------- Split words (keeps the unsplit accessible name) ---------- */
  function splitWords(el) {
    if (el.dataset.splitDone) return;
    const text = el.textContent.trim();
    el.textContent = "";
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = text;
    el.appendChild(sr);
    const cjk = /[\u3000-\u9fff\uf900-\ufaff]/.test(text);
    let parts;
    if (!cjk) parts = text.split(/(\s+)/);
    else if (el.dataset.split === "lede") parts = text.match(/[^，。、；：！？]+[，。、；：！？]*|[^\s]+/g) || [text];
    else parts = text.match(/[^\s，。、；：！？]\s*[，。、；：！？]*|\s+/g) || [text];
    parts.forEach(part => {
      if (!part.trim()) { el.appendChild(document.createTextNode(part)); return; }
      const mask = document.createElement("span");
      mask.className = "word-mask";
      mask.setAttribute("aria-hidden", "true");
      const word = document.createElement("span");
      word.className = "word";
      word.textContent = part;
      mask.appendChild(word);
      el.appendChild(mask);
    });
    el.dataset.splitDone = "true";
  }

  /* ---------- Hero intro: model first, headline second, copy third, actions last ---------- */
  /* ---------- Intro: the logo assembles, then the overlay wipes into the hero ---------- */
  const pre = document.querySelector("[data-preloader]");
  const introPlays = !!pre && getComputedStyle(pre).display !== "none";
  /* Builds the logo assembly on any inline copy of the mark. Shared by the intro and the looping mark. */
  function buildLogoTimeline(root, opts) {
    const facets = root.querySelectorAll(".lg-facet");
    const core = root.querySelector(".lg-core");
    const mark = root.querySelector(".lg-mark");
    const paths = root.querySelectorAll(".lg-mark-path");
    const values = root.querySelectorAll(".lg-value");
    paths.forEach(p => { p.style.strokeDasharray = p.getTotalLength(); });
    const tl = gsap.timeline(Object.assign({ defaults: { ease: "power3.out" } }, opts || {}));
    // Facets carry their own entrance; core, mark and values stay hidden until their turn (matters on every repeat).
    tl.set(facets, { opacity: 1 }, 0)
      .set([core, mark, values], { autoAlpha: 0 }, 0)
      .set(mark, { autoAlpha: 1 }, 0.7)
      .fromTo(facets, { scale: 0.35, autoAlpha: 0, transformOrigin: "50% 50%" }, { scale: 1, autoAlpha: 1, duration: 0.75, stagger: { each: 0.035, from: "center" } }, 0)
      .fromTo(core, { scale: 0.6, autoAlpha: 0, transformOrigin: "50% 50%" }, { scale: 1, autoAlpha: 1, duration: 0.7 }, 0.45)
      .set(paths, { fillOpacity: 0, stroke: "#12345F", strokeWidth: 3 }, 0.7)
      .fromTo(paths, { strokeDashoffset: (i, el) => el.getTotalLength() }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0.7)
      .to(paths, { fillOpacity: 1, duration: 0.35 }, 1.35)
      .fromTo(values, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.07 }, 1.2);
    return tl;
  }
  window.MCLogoBuild = buildLogoTimeline;

  function runIntro() {
    const tl = buildLogoTimeline(pre, {
      onComplete: () => {
        pre.remove();
        try { sessionStorage.setItem("mc-intro", "1"); } catch (e) { /* ignore */ }
        window.dispatchEvent(new Event("mc:intro-done"));
      }
    });
    tl.to(pre.querySelector(".preloader__logo"), { scale: 0.86, y: -30, autoAlpha: 0, duration: 0.6, ease: "power3.in" }, 2.45)
      .to(pre, { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power4.inOut" }, 2.5);
    return tl;
  }

  /* ---------- Looping mark above "Find your case": assemble, hold, dissolve, repeat; only while in view ---------- */
  const loopRoot = document.querySelector("[data-logo-loop]");
  if (loopRoot) {
    const loopTl = buildLogoTimeline(loopRoot, { repeat: -1, repeatDelay: 0.6, paused: true });
    loopTl.to(loopRoot.querySelectorAll(".lg-facet, .lg-core, .lg-mark, .lg-value"), { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, "+=1.6");
    window.MCLogoLoop = loopTl;
    ScrollTrigger.create({ trigger: loopRoot, start: "top 95%", end: "bottom 5%", onToggle: self => { if (self.isActive) loopTl.play(); else loopTl.pause(); } });
  }

  if (introPlays) {
    gsap.set(pre, { clipPath: "inset(0 0 0% 0)" });
    runIntro();
  }

  const mm = gsap.matchMedia();
  const heroTitle = document.querySelector(".hero__title");
  if (heroTitle) {
    splitWords(heroTitle);
    const lede = document.querySelector(".hero__lede");
    splitWords(lede);
    const tl = gsap.timeline({ delay: 0.15, paused: introPlays });
    if (introPlays) window.addEventListener("mc:intro-done", () => tl.play(), { once: true });
    tl.set([heroTitle, lede], { autoAlpha: 1 })
      .fromTo(".brand", { y: -10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0)
      .fromTo(heroTitle.querySelectorAll(".word"), { yPercent: 110, rotate: 2 }, { yPercent: 0, rotate: 0, duration: 1.1, ease: "power4.out", stagger: 0.055 }, 0.25)
      .fromTo(lede.querySelectorAll(".word"), { yPercent: 105 }, { yPercent: 0, duration: 0.8, ease: "power3.out", stagger: 0.014 }, 0.75)
      .fromTo(".hero__actions .btn", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.09, clearProps: "transform" }, 1.0)
      .set(".hero__actions", { opacity: 1 }, 1.0);
    if (window.matchMedia("(min-width: 901px)").matches) {
      tl.fromTo(".site-nav__list li", { y: -10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, clearProps: "all" }, 0.15)
        .fromTo(".site-nav > .btn, .lang-switch", { y: -10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, clearProps: "all" }, 0.45);
    }
    document.querySelector(".hero__actions").addEventListener("focusin", () => tl.progress(1), { once: true });
  }

  /* ---------- Hero handoff: scrub lifts the camera from model to plan ---------- */
  const hero = document.querySelector("[data-hero]");
  const heroCanvas = document.querySelector("[data-hero-canvas]");
  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: self => {
        const p = self.progress;
        if (window.MCHero) window.MCHero.setProgress(p);
        if (heroCanvas) heroCanvas.style.opacity = String(1 - Math.max(0, (p - 0.7) / 0.3));
        gsap.set(".hero__copy", { y: p * 90, opacity: 1 - Math.min(1, p * 1.7) });
      },
      onToggle: self => { if (window.MCHero) window.MCHero.setActive(self.isActive); }
    });
    window.setTimeout(() => { if (!window.MCHero) document.querySelector("[data-hero-stage]").classList.add("no-3d"); }, 4000);
    window.addEventListener("mc:hero-ready", () => {
      const st = ScrollTrigger.getAll().find(t => t.trigger === hero);
      if (st && window.MCHero) window.MCHero.setProgress(st.progress);
    });
  }

  /* Inside the dark passage everything waits for the curtain, so white type never lands on the pale page */
  const darkDelay = el => (el.closest(".public") ? 0.5 : 0);

  /* ---------- Headings and ledes: masked word reveals (ledes tighter and quicker) ---------- */
  function revealSplit(el) {
    splitWords(el);
    const isLede = el.dataset.split === "lede";
    gsap.set(el, { autoAlpha: 1 });
    el._mcTween = gsap.fromTo(el.querySelectorAll(".word"), { yPercent: isLede ? 105 : 110, rotate: isLede ? 0 : 1.5 }, {
      yPercent: 0, rotate: 0, duration: isLede ? 0.7 : 0.95, ease: "power4.out", stagger: isLede ? 0.012 : 0.05, delay: darkDelay(el),
      scrollTrigger: { trigger: el, start: "top 86%", once: true }
    });
  }
  const sectionSplits = gsap.utils.toArray("[data-split]").filter(el => el !== heroTitle && !el.closest(".hero"));
  sectionSplits.forEach(revealSplit);

  /* ---------- Rules draw themselves as their section arrives ---------- */
  gsap.utils.toArray(".rule-draw").forEach(el => {
    gsap.fromTo(el, { "--rule-x": 0 }, { "--rule-x": 1, duration: 1.1, ease: "power3.inOut", delay: darkDelay(el), scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });

  /* ---------- Grouped reveals: a different grammar per list, not one fade-up everywhere ---------- */
  gsap.utils.toArray("[data-reveal-group]").forEach(group => {
    const marked = group.querySelectorAll("[data-reveal-item]");
    const items = marked.length ? marked : group.children;
    const kind = group.dataset.revealGroup || "";
    gsap.set(group, { autoAlpha: 1 });
    const focusable = !!group.querySelector("a, button, input, select, textarea, iframe");
    if (focusable) gsap.set(items, { visibility: "visible" });
    const st = { trigger: group, start: "top 84%", once: true };
    let tween;
    if (kind === "slide-left" || kind === "slide-right") {
      const dx = kind === "slide-left" ? -30 : 30;
      tween = focusable
        ? gsap.fromTo(items, { x: dx, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power4.out", stagger: 0.09, scrollTrigger: st, clearProps: "transform" })
        : gsap.fromTo(items, { x: dx, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9, ease: "power4.out", stagger: 0.09, scrollTrigger: st, clearProps: "transform" });
      const rects = group.querySelectorAll(".index__mark rect");
      if (rects.length) {
        rects.forEach(r => { const len = r.getTotalLength(); r.style.strokeDasharray = len; r.style.strokeDashoffset = len; });
        gsap.to(rects, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.03, delay: 0.25, scrollTrigger: { trigger: group, start: "top 84%", once: true }, onComplete: () => rects.forEach(r => { r.style.strokeDasharray = ""; r.style.strokeDashoffset = ""; }) });
      }
    } else if (kind === "wipe") {
      tween = gsap.fromTo(items, { clipPath: "inset(0 100% 0 0)", autoAlpha: 1 }, { clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "power4.out", stagger: 0.14, delay: darkDelay(group), scrollTrigger: st, clearProps: "clipPath" });
    } else if (kind === "soft") {
      tween = gsap.fromTo(items, { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.05, scrollTrigger: st });
    } else if (focusable) {
      tween = gsap.fromTo(items, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power4.out", stagger: 0.07, scrollTrigger: st });
    } else {
      tween = gsap.fromTo(items, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power4.out", stagger: 0.07, scrollTrigger: st });
    }
    group.addEventListener("focusin", () => tween.progress(1), { once: true });
  });
  gsap.utils.toArray("[data-reveal]").forEach(el => {
    gsap.set(el, { autoAlpha: 1 });
    gsap.fromTo(el, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power4.out", delay: Number(el.dataset.revealDelay || 0), scrollTrigger: { trigger: el, start: "top 86%", once: true } });
  });

  /* ---------- Line reveals: each value rises through its own mask ---------- */
  function revealLines(list) {
    const lines = [];
    list.querySelectorAll("li").forEach(li => {
      const mask = document.createElement("span"); mask.className = "line-mask";
      const line = document.createElement("span"); line.className = "line"; line.textContent = li.textContent;
      mask.appendChild(line); li.textContent = ""; li.appendChild(mask); lines.push(line);
    });
    gsap.set(list.querySelectorAll("li"), { autoAlpha: 1 });
    list._mcTween = gsap.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.075, scrollTrigger: { trigger: list, start: "top 84%", once: true } });
  }
  const lineLists = gsap.utils.toArray("[data-reveal-lines]");
  lineLists.forEach(revealLines);

  /* ---------- Language switch: i18n.js has replaced the text, so the text reveals are rebuilt on the new copy ---------- */
  window.addEventListener("mc:lang", () => {
    const killTween = el => { if (el._mcTween) { if (el._mcTween.scrollTrigger) el._mcTween.scrollTrigger.kill(); el._mcTween.kill(); } };
    sectionSplits.forEach(el => { killTween(el); revealSplit(el); });
    lineLists.forEach(list => { killTween(list); revealLines(list); });
    [heroTitle, document.querySelector(".hero__lede")].forEach(el => {
      if (!el) return;
      splitWords(el);
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(el.querySelectorAll(".word"), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: el === heroTitle ? 0.05 : 0.012 });
    });
    ScrollTrigger.refresh();
  });

  /* ---------- Soft groups (forms): opacity only, never removed from the tab order ---------- */
  gsap.utils.toArray("[data-reveal-soft-group]").forEach(group => {
    const items = group.children;
    const tween = gsap.fromTo(items, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: group, start: "top 86%", once: true }, clearProps: "transform" });
    group.addEventListener("focusin", () => tween.progress(1), { once: true });
  });

  /* ---------- Marquee: wipes in from the left inside its frame ---------- */
  gsap.utils.toArray("[data-reveal-marquee]").forEach(el => {
    gsap.set(el, { autoAlpha: 1 });
    gsap.fromTo(el, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true }, clearProps: "clipPath" });
  });

  /* ---------- The dark passage rises like a curtain before its content ---------- */
  const publicBg = document.querySelector(".public__bg");
  if (publicBg) {
    gsap.fromTo(publicBg, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "power3.inOut", scrollTrigger: { trigger: ".public", start: "top 95%", once: true } });
  }

  /* ---------- Lazy photographs are fetched two screens ahead so they are decoded before their reveal ---------- */
  gsap.utils.toArray("img[loading='lazy']").forEach(img => {
    ScrollTrigger.create({ trigger: img.closest("figure, .band, .public__photos") || img, start: "top 250%", once: true, onEnter: () => { img.loading = "eager"; } });
  });

  /* ---------- Image clip reveals with a direction per figure; each waits for its picture ---------- */
  /* Every component keeps a % unit: a unitless intermediate such as inset(50 0 0 0) is invalid CSS and the browser would hold the last valid frame */
  const clipFrom = { l: "inset(0% 100% 0% 0%)", r: "inset(0% 0% 0% 100%)", u: "inset(100% 0% 0% 0%)", d: "inset(0% 0% 100% 0%)" };
  gsap.utils.toArray("[data-image-reveal]").forEach(fig => {
    const dir = fig.dataset.imageReveal || "d";
    const img = fig.querySelector("img, canvas, .plinth");
    gsap.set(fig, { autoAlpha: 1 });
    const tl = gsap.timeline({ paused: true, delay: darkDelay(fig), onComplete: () => gsap.set(fig, { clearProps: "clipPath" }) });
    ScrollTrigger.create({ trigger: fig, start: "top 84%", once: true, onEnter: () => { if (img && img.tagName === "IMG") img.loading = "eager"; tl.play(); } });
    tl.fromTo(fig, { clipPath: clipFrom[dir] || clipFrom.d }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "power4.out" });
    const depth = fig.hasAttribute("data-depth");
    if (img && depth) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.35, ease: "power4.out" }, 0);
    else if (img) tl.fromTo(img, { scale: 1.12, xPercent: dir === "l" ? -4 : dir === "r" ? 4 : 0, yPercent: dir === "u" ? 4 : 0 }, { scale: 1, xPercent: 0, yPercent: 0, duration: 1.35, ease: "power4.out", clearProps: "transform" }, 0);
  });

  /* ---------- Parallax: the jet band, and a little depth on media on larger screens ---------- */
  gsap.utils.toArray("[data-parallax-image]").forEach(img => {
    const section = img.closest("[data-parallax-section]") || img;
    gsap.fromTo(img, { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
  });
  mm.add("(min-width: 901px)", () => {
    gsap.utils.toArray("[data-depth] img").forEach(img => {
      const fig = img.closest("[data-depth]");
      gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true } });
    });
  });

  /* ---------- Magnetic primary actions on fine pointers; buttons press under the pointer ---------- */
  mm.add("(hover: hover) and (pointer: fine)", () => {
    gsap.utils.toArray("[data-magnetic]").forEach(el => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
      const move = e => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.2); yTo((e.clientY - r.top - r.height / 2) * 0.2 - 2); };
      const leave = () => { xTo(0); yTo(0); gsap.to(el, { scale: 1, duration: 0.2 }); };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      el.addEventListener("pointerdown", () => gsap.to(el, { scale: 0.97, duration: 0.14 }));
      el.addEventListener("pointerup", () => gsap.to(el, { scale: 1, duration: 0.2 }));
      return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
    });
  });

  /* ---------- Mobile menu: links arrive one by one when the panel opens ---------- */
  if (toggle) {
    toggle.addEventListener("click", () => {
      if (toggle.getAttribute("aria-expanded") === "true") {
        gsap.fromTo(".site-nav__list li, .lang-switch, .site-nav > .btn", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.05, delay: 0.08, clearProps: "all" });
      }
    });
  }

  /* ---------- Sticky stack: each card recedes as the next arrives (desktop only) ---------- */
  mm.add("(min-width: 901px)", () => {
    const cards = gsap.utils.toArray("[data-stack-card]");
    cards.forEach((card, i) => {
      card.style.zIndex = String(i + 1);
      if (i === cards.length - 1) return;
      const st = { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true, invalidateOnRefresh: true };
      gsap.to(card, { scale: 0.94, ease: "none", scrollTrigger: st });
      gsap.to(card.querySelector(".stack__dim"), { opacity: 0.32, ease: "none", scrollTrigger: { ...st } });
    });
  });

  /* ---------- Refresh after fonts and media settle ---------- */
  window.addEventListener("load", () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
