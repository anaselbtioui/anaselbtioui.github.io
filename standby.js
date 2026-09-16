// #nobuild: Fluid thinking-indicator port + Formspree inquiry form.

import { wireFolioRail } from "./folio-rail.js";
import { wireWorkStrip } from "./work-strip.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Formspree — https://formspree.io/f/xpqvblgj */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpqvblgj";

/* Sacred-style cycling verbs — Fluid thinking-indicator morph, vanilla */
const BLOCK_FRAMES = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"];
const CLI_WORDS = [
  "Layering",
  "Seasoning",
  "Steeping",
  "Curing",
  "Settling",
  "Weathering",
  "Tempering",
  "Distilling",
  "Uncovering",
  "Opening",
  "Grounding",
  "Rooting",
  "Joining",
  "Polishing",
  "Steadying",
  "Simmering",
  "Framing",
  "Finishing",
];

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function rectsOverlap(a, b, pad) {
  return !(
    a.right + pad < b.left ||
    a.left - pad > b.right ||
    a.bottom + pad < b.top ||
    a.top - pad > b.bottom
  );
}

function foxCoversLabel(ctx, imgBox, labelBox) {
  const x = Math.max(0, Math.floor(labelBox.left - imgBox.left - 4));
  const y = Math.max(0, Math.floor(labelBox.top - imgBox.top - 4));
  const w = Math.min(ctx.canvas.width - x, Math.ceil(labelBox.width + 8));
  const h = Math.min(ctx.canvas.height - y, Math.ceil(labelBox.height + 8));
  if (w < 2 || h < 2) return false;
  const data = ctx.getImageData(x, y, w, h).data;
  let hit = 0;
  let n = 0;
  for (let i = 3; i < data.length; i += 16) {
    n += 1;
    if (data[i] > 40) hit += 1;
  }
  return n > 0 && hit / n > 0.08;
}

function pickThinkSpot() {
  if (Math.random() < 0.5) {
    return {
      x: 8 + Math.random() * 12,
      y: 30 + Math.random() * 10,
    };
  }
  return {
    x: 36 + Math.random() * 20,
    y: 2 + Math.random() * 6,
  };
}

function mountThinkIndicator() {
  const root = document.querySelector("[data-think]");
  if (!root) return;
  const figure = root.closest(".hero-fox");
  const img = figure?.querySelector("img");
  const bubble = root.querySelector(".hero-think-bubble");
  const word = root.querySelector("[data-ol-word]");
  const loader = root.querySelector("[data-think-loader]");
  if (!bubble || !word) return;

  let mask = null;

  function ensureMask() {
    if (!img?.naturalWidth) return null;
    const box = img.getBoundingClientRect();
    const w = Math.round(box.width);
    const h = Math.round(box.height);
    if (mask && mask.canvas.width === w && mask.canvas.height === h) return mask;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    mask = ctx;
    return mask;
  }

  function blockers() {
    return [".mast", ".hero-kicker", ".hero-name", ".title", ".cta"]
      .map((sel) => document.querySelector(sel))
      .filter(Boolean)
      .map((el) => el.getBoundingClientRect());
  }

  function place() {
    const ctx = ensureMask();
    const imgBox = img?.getBoundingClientRect();
    const others = blockers();
    for (let i = 0; i < 20; i += 1) {
      const spot = pickThinkSpot();
      root.style.setProperty("--lx", `${spot.x.toFixed(1)}%`);
      root.style.setProperty("--ly", `${spot.y.toFixed(1)}%`);
      const box = bubble.getBoundingClientRect();
      if (others.some((other) => rectsOverlap(box, other, 10))) continue;
      if (ctx && imgBox && foxCoversLabel(ctx, imgBox, box)) continue;
      return;
    }
    root.style.setProperty("--lx", "13%");
    root.style.setProperty("--ly", "34%");
  }

  function start() {
    place();
    if (reduceMotion) {
      word.textContent = CLI_WORDS[0];
      if (loader) loader.textContent = BLOCK_FRAMES[0];
      bubble.classList.add("is-on");
      return;
    }

    let wi = 0;
    let fi = 0;
    window.setInterval(() => {
      fi = (fi + 1) % BLOCK_FRAMES.length;
      if (loader) loader.textContent = BLOCK_FRAMES[fi];
    }, 100);

    window.setInterval(async () => {
      bubble.classList.remove("is-on");
      await sleep(220);
      wi = (wi + 1) % CLI_WORDS.length;
      word.textContent = CLI_WORDS[wi];
      place();
      bubble.classList.add("is-on");
    }, 4000);

    bubble.classList.add("is-on");
  }

  if (img && !img.complete) img.addEventListener("load", start, { once: true });
  else start();
}

function resolveEndpoint(form) {
  const fromConst = FORMSPREE_ENDPOINT && !FORMSPREE_ENDPOINT.includes("REPLACE_ME")
    ? FORMSPREE_ENDPOINT
    : "";
  const fromAction = form?.getAttribute("action") || "";
  const actionOk = fromAction && !fromAction.includes("REPLACE_ME") ? fromAction : "";
  return fromConst || actionOk || "";
}

function mountInquiryForm() {
  const form = document.getElementById("inquiry");
  if (!form) return;

  const news = form.querySelector("[data-form-news]");
  const submit = form.querySelector("[data-submit]");
  const endpoint = resolveEndpoint(form);

  if (endpoint) form.setAttribute("action", endpoint);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!endpoint) {
      if (news) news.textContent = "Email anaselbtioui@gmail.com";
      return;
    }

    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    fd.delete("_gotcha");

    submit.disabled = true;
    if (news) news.textContent = "Sending…";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });

      if (!res.ok) {
        let detail = "Send failed. Write anaselbtioui@gmail.com";
        try {
          const data = await res.json();
          if (data?.error) detail = String(data.error);
        } catch {
          /* keep default */
        }
        if (news) news.textContent = detail;
        submit.disabled = false;
        return;
      }

      form.reset();
      if (news) news.textContent = "Sent.";
      submit.disabled = false;
    } catch {
      if (news) news.textContent = "Network error. Write anaselbtioui@gmail.com";
      submit.disabled = false;
    }
  });
}

function mastLinkKind(href) {
  if (/about\.html/.test(href)) return "about";
  if (/#contact/.test(href)) return "write";
  if (/#work/.test(href)) return "work";
  return "";
}

function mountMastCurrent() {
  const links = document.querySelectorAll(".mast-links a");
  if (!links.length) return;

  const page = document.body.dataset.page || "home";

  const sync = () => {
    const current =
      page === "about"
        ? "about"
        : window.location.hash === "#contact"
          ? "write"
          : "work";

    links.forEach((link) => {
      const kind = mastLinkKind(link.getAttribute("href") || "");
      if (kind && kind === current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  sync();
  window.addEventListener("hashchange", sync);
}

function mountMastFade() {
  const mast = document.querySelector(".mast");
  if (!mast) return;

  const reveal =
    parseFloat(getComputedStyle(mast).getPropertyValue("--scroll-fade-reveal")) ||
    96;
  const sync = () => {
    mast.style.setProperty(
      "--mast-fade",
      String(Math.min(1, window.scrollY / reveal))
    );
  };

  mast.classList.add("is-js-fade");
  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

function linkLeavesPage(anchor) {
  const raw = anchor.getAttribute("href");
  if (!raw || raw.startsWith("#")) return false;

  let url;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }

  if (url.protocol === "mailto:" || url.protocol === "tel:") return true;
  if (anchor.target === "_blank") return true;
  return url.origin !== window.location.origin;
}

function leaveHost(url) {
  if (url.protocol === "mailto:") return url.pathname;
  return url.hostname.replace(/^www\./, "");
}

function mountLeaveConfirm() {
  const pop = document.createElement("div");
  pop.className = "leave-pop";
  pop.setAttribute("popover", "auto");
  pop.setAttribute("role", "dialog");
  pop.setAttribute("aria-modal", "false");
  pop.setAttribute("aria-labelledby", "leave-pop-title");
  pop.innerHTML = `
    <p class="leave-pop-title" id="leave-pop-title">Open this link?</p>
    <p class="leave-pop-host" data-leave-host></p>
    <div class="leave-pop-actions">
      <button type="button" data-leave-stay>Stay</button>
      <button type="button" data-leave-go>
        Open
        <svg class="leave-pop-out" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
          <path d="M5 11.5 11.5 5"/>
          <path d="M6.75 5H11.5v4.75"/>
        </svg>
      </button>
    </div>
  `;
  document.body.append(pop);

  const hostEl = pop.querySelector("[data-leave-host]");
  const stayBtn = pop.querySelector("[data-leave-stay]");
  const goBtn = pop.querySelector("[data-leave-go]");
  let pending = null;

  const hide = () => {
    if (typeof pop.hidePopover === "function" && pop.matches(":popover-open")) {
      pop.hidePopover();
    }
  };

  const place = (anchor) => {
    const r = anchor.getBoundingClientRect();
    const pad = 8;
    const popW = pop.offsetWidth;
    const popH = pop.offsetHeight;
    const spaceBelow = window.innerHeight - r.bottom;
    const top =
      spaceBelow < popH + pad + 8 && r.top > popH + pad
        ? r.top - popH - pad
        : r.bottom + pad;
    let left = r.right - popW;
    left = Math.min(Math.max(12, left), window.innerWidth - popW - 12);
    pop.style.top = `${Math.round(top)}px`;
    pop.style.left = `${Math.round(left)}px`;
  };

  const openPending = () => {
    const link = pending;
    pending = null;
    hide();
    if (!link) return;
    if (link.target === "_blank") {
      window.open(link.href, "_blank", "noopener,noreferrer");
      return;
    }
    window.location.href = link.href;
  };

  stayBtn.addEventListener("click", () => hide());
  goBtn.addEventListener("click", () => openPending());

  pop.addEventListener("toggle", (event) => {
    if (event.newState === "closed") {
      const back = pending;
      pending = null;
      if (back) back.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (pop.contains(event.target)) return;
    const link = event.target.closest("a[href]");
    if (!link || !linkLeavesPage(link)) return;
    event.preventDefault();
    pending = link;
    try {
      hostEl.textContent = leaveHost(new URL(link.href, window.location.href));
    } catch {
      hostEl.textContent = "";
    }
    if (!pop.matches(":popover-open")) pop.showPopover();
    place(link);
    stayBtn.focus();
  });
}

function mountDirtyLeave() {
  const form = document.getElementById("inquiry");
  if (!form) return;

  let dirty = false;
  form.addEventListener("input", () => {
    dirty = true;
  });
  form.addEventListener("submit", () => {
    dirty = false;
  });
  window.addEventListener("beforeunload", (event) => {
    if (!dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "0";
    field.style.left = "-9999px";
    document.body.append(field);
    field.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    field.remove();
    return ok;
  }
}

function mountCopyEmail() {
  const buttons = document.querySelectorAll("[data-copy-email]");
  buttons.forEach((btn) => {
    const email = btn.getAttribute("data-copy-email") || "";
    const idle = btn.textContent;
    let timer = 0;

    btn.addEventListener("click", async () => {
      if (!email) return;
      const ok = await copyToClipboard(email);
      if (!ok) {
        window.location.href = `mailto:${email}`;
        return;
      }
      btn.textContent = "copied";
      btn.classList.add("is-copied");
      btn.setAttribute("aria-label", "Email copied");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        btn.textContent = idle;
        btn.classList.remove("is-copied");
        btn.setAttribute("aria-label", "Copy email address");
      }, 1600);
    });
  });
}

mountThinkIndicator();
mountInquiryForm();
mountCopyEmail();
mountMastCurrent();
mountMastFade();
mountLeaveConfirm();
mountDirtyLeave();
wireFolioRail();
wireWorkStrip();
