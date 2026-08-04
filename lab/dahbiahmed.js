/**
 * Dahbi lab — M.cursor-avatar + M.bookshelf-3d (CSS adapt, no Three.js)
 */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ——— M.cursor-avatar ——— */
  const wrap = document.getElementById("avatar-wrap");
  const face = wrap && wrap.querySelector(".avatar-face");
  const pupils = wrap ? wrap.querySelectorAll(".avatar-pupil") : [];
  const DEAD = 60;
  const LOOK = {
    center: { x: 0, y: 0, eyeX: 0, eyeY: 0 },
    right: { x: 0, y: 10, eyeX: 5, eyeY: 0 },
    "bottom-right": { x: 8, y: 8, eyeX: 4, eyeY: 4 },
    bottom: { x: 10, y: 0, eyeX: 0, eyeY: 5 },
    "bottom-left": { x: 8, y: -8, eyeX: -4, eyeY: 4 },
    left: { x: 0, y: -10, eyeX: -5, eyeY: 0 },
    "top-left": { x: -8, y: -8, eyeX: -4, eyeY: -4 },
    top: { x: -10, y: 0, eyeX: 0, eyeY: -5 },
    "top-right": { x: -8, y: 8, eyeX: 4, eyeY: -4 },
  };

  function bucket(clientX, clientY) {
    const r = wrap.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    if (Math.hypot(dx, dy) < DEAD) return "center";
    const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (deg >= -22.5 && deg < 22.5) return "right";
    if (deg >= 22.5 && deg < 67.5) return "bottom-right";
    if (deg >= 67.5 && deg < 112.5) return "bottom";
    if (deg >= 112.5 && deg < 157.5) return "bottom-left";
    if (deg >= 157.5 || deg < -157.5) return "left";
    if (deg >= -157.5 && deg < -112.5) return "top-left";
    if (deg >= -112.5 && deg < -67.5) return "top";
    return "top-right";
  }

  let lastLook = "center";
  function applyLook(dir) {
    if (dir === lastLook || !face) return;
    lastLook = dir;
    const L = LOOK[dir] || LOOK.center;
    face.style.setProperty("--look-x", L.x + "deg");
    face.style.setProperty("--look-y", L.y + "deg");
    face.dataset.look = dir;
    pupils.forEach((p) => {
      p.style.setProperty("--eye-x", L.eyeX + "px");
      p.style.setProperty("--eye-y", L.eyeY + "px");
    });
  }

  if (wrap && face && !reduceMotion) {
    window.addEventListener(
      "pointermove",
      (e) => applyLook(bucket(e.clientX, e.clientY)),
      { passive: true }
    );
  }

  /* ——— M.bookshelf-3d ——— */
  const BOOKS = [
    { id: "harbor", title: "Harbor", author: "Case · film strip", tone: "a", href: "./lefos.html" },
    { id: "ledger", title: "Ledger", author: "Case · sage strip", tone: "b", href: "./maxmilkin.html" },
    { id: "cuelabs", title: "Cue Labs", author: "Instrument chrome", tone: "c", href: "./" },
    { id: "garden", title: "SAP Garden", author: "3XN case spine", tone: "d", href: "./3xn.html" },
    { id: "terminal", title: "Sacred", author: "Term block works", tone: "e", href: "./sacred.html" },
    { id: "coffee", title: "Coffee Soft", author: "MAI parchment", tone: "f", href: "./microsoft-ai.html" },
    { id: "pastoral", title: "Pastoral", author: "Huts catalog", tone: "a", href: "./huts.html" },
    { id: "imagery", title: "Imagery", author: "Cool documentary", tone: "c", href: "../docs/imagery-brief.md" },
    { id: "grammar", title: "Grammar", author: "Circle + line", tone: "d", href: "../docs/visual-grammar.md" },
  ];

  const stage = document.getElementById("shelf-stage");
  const world = document.getElementById("shelf-world");
  const fallback = document.getElementById("books-fallback");
  const counter = document.getElementById("shelf-counter");
  const ticks = document.getElementById("shelf-ticks");
  const metaTitle = document.getElementById("shelf-title");
  const metaAuthor = document.getElementById("shelf-author");
  const inspect = document.getElementById("shelf-inspect");
  const btnPrev = document.getElementById("shelf-prev");
  const btnNext = document.getElementById("shelf-next");

  if (!stage || !world) return;

  if (reduceMotion) {
    stage.hidden = true;
    stage.classList.add("is-reduced");
    if (fallback) {
      fallback.classList.remove("books-hidden");
      fallback.removeAttribute("hidden");
    }
    document.querySelectorAll("[data-shelf-chrome]").forEach((el) => {
      el.hidden = true;
    });
    return;
  }

  let index = 0;
  const nodes = [];

  BOOKS.forEach((book, i) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "shelf-book";
    el.dataset.tone = book.tone;
    el.dataset.index = String(i);
    el.setAttribute("aria-label", "Browse to " + book.title);
    el.innerHTML =
      '<span class="spine">' +
      book.title +
      '</span><span class="cover"><strong>' +
      book.title +
      "</strong><em>" +
      book.author +
      "</em></span>";
    el.addEventListener("click", () => {
      if (i === index) {
        window.location.href = book.href;
      } else {
        setIndex(i);
      }
    });
    world.appendChild(el);
    nodes.push(el);
  });

  if (ticks) {
    ticks.innerHTML = BOOKS.map((_, i) => '<i data-i="' + i + '"></i>').join("");
  }

  function layout() {
    const n = BOOKS.length;
    nodes.forEach((el, i) => {
      let offset = i - index;
      if (offset > n / 2) offset -= n;
      if (offset < -n / 2) offset += n;
      const abs = Math.abs(offset);
      const focus = offset === 0;
      el.classList.toggle("is-focus", focus);
      if (focus) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
      const x = focus ? 0 : offset * 2.55 + (offset > 0 ? 3.2 : -3.2);
      const z = focus ? 40 : -abs * 28;
      const rotY = focus ? 0 : offset > 0 ? -18 : 18;
      const scale = focus ? 1 : Math.max(0.72, 1 - abs * 0.06);
      const opacity = abs > 4 ? 0 : 1;
      el.style.transform =
        "translateX(" +
        x +
        "rem) translateZ(" +
        z +
        "px) rotateY(" +
        rotY +
        "deg) scale(" +
        scale +
        ")";
      el.style.opacity = String(opacity);
      el.style.zIndex = String(focus ? 20 : 10 - abs);
      el.tabIndex = focus ? 0 : -1;
    });

    const book = BOOKS[index];
    if (counter) {
      counter.textContent =
        String(index + 1).padStart(2, "0") + " / " + String(n).padStart(2, "0");
    }
    if (ticks) {
      ticks.querySelectorAll("i").forEach((t, i) => t.classList.toggle("is-on", i === index));
    }
    if (metaTitle) metaTitle.textContent = book.title;
    if (metaAuthor) metaAuthor.textContent = book.author;
    if (inspect) {
      inspect.href = book.href;
      inspect.setAttribute("aria-label", "Inspect " + book.title);
    }
  }

  function setIndex(next) {
    const n = BOOKS.length;
    index = ((next % n) + n) % n;
    layout();
  }

  layout();
  if (fallback) {
    fallback.classList.add("books-hidden");
    fallback.setAttribute("hidden", "");
    fallback.setAttribute("aria-hidden", "true");
  }

  if (btnPrev) btnPrev.addEventListener("click", () => setIndex(index - 1));
  if (btnNext) btnNext.addEventListener("click", () => setIndex(index + 1));

  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setIndex(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setIndex(index + 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      window.location.href = BOOKS[index].href;
    }
  });

  let dragX = null;
  let dragOrigin = 0;

  world.addEventListener("pointerdown", (e) => {
    dragX = e.clientX;
    dragOrigin = index;
    world.classList.add("is-dragging");
    world.setPointerCapture(e.pointerId);
  });

  world.addEventListener("pointermove", (e) => {
    if (dragX == null) return;
    const dx = e.clientX - dragX;
    const step = Math.round(-dx / 48);
    if (step !== 0) setIndex(dragOrigin + step);
  });

  function endDrag(e) {
    if (dragX == null) return;
    dragX = null;
    world.classList.remove("is-dragging");
    try {
      world.releasePointerCapture(e.pointerId);
    } catch (_) {
      /* ignore */
    }
  }

  world.addEventListener("pointerup", endDrag);
  world.addEventListener("pointercancel", endDrag);
})();
