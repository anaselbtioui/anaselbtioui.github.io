// #nobuild: case strips — type · title · problem line; cover optional upgrade.
import { projects } from "./content/manifest.js";
import { fetchEntry } from "./md.js";
import { projectSlug } from "./case.js";

function padIndex(n) {
  return String(n).padStart(2, "0");
}

function lampNodes() {
  const paper = document.createElement("span");
  paper.className = "zone-paper";
  paper.setAttribute("aria-hidden", "true");

  const clip = document.createElement("span");
  clip.className = "lamp-clip";
  clip.setAttribute("aria-hidden", "true");

  const glow = document.createElement("span");
  glow.className = "lamp";

  const lift = document.createElement("span");
  lift.className = "lamp-lift";

  const fiber = document.createElement("span");
  fiber.className = "lamp-fiber";

  const motes = document.createElement("span");
  motes.className = "lamp-motes";

  clip.append(glow, lift, fiber, motes);
  return [paper, clip];
}

function caseNode(entry, index) {
  const li = document.createElement("li");
  li.className = "case has-lamp";
  if (entry.featured) li.classList.add("featured");
  if (entry.cover) li.classList.add("has-cover");
  li.style.setProperty("--i", String(index));

  const slug = projectSlug(entry.path);
  const href = `./case.html#${encodeURIComponent(slug)}`;

  const link = document.createElement("a");
  link.className = "case-link";
  link.href = href;
  link.setAttribute(
    "aria-label",
    `${entry.title}. Open case study.`,
  );

  const body = document.createElement("div");
  body.className = "case-body";

  const indexEl = document.createElement("span");
  indexEl.className = "case-index";
  indexEl.textContent = padIndex(index + 1);

  const main = document.createElement("div");
  main.className = "case-main";

  const typeBits = [entry.domain, entry.role].filter(Boolean);
  const type = document.createElement("p");
  type.className = "case-type";
  type.textContent = typeBits.length ? typeBits.join(" · ") : "Project";

  const title = document.createElement("h3");
  title.className = "case-title";
  title.textContent = entry.title;

  main.append(type, title);

  if (entry.summary) {
    const summary = document.createElement("p");
    summary.className = "case-summary";
    summary.textContent = entry.summary;
    main.appendChild(summary);
  }

  const meta = document.createElement("span");
  meta.className = "case-meta";
  meta.textContent = entry.date || "—";

  body.append(indexEl, main, meta);

  if (entry.cover) {
    const figure = document.createElement("figure");
    figure.className = "case-cover";
    const img = document.createElement("img");
    img.src = entry.cover;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    figure.appendChild(img);
    body.appendChild(figure);
  }

  link.appendChild(body);
  li.append(...lampNodes(), link);
  return li;
}

function emptyState() {
  return `<li class="case is-draft empty">
    <div class="case-body">
      <span class="case-index">00</span>
      <div class="case-main">
        <p class="case-type">Nothing yet</p>
        <h3 class="case-title">No projects</h3>
        <p class="case-summary">Add a file in <code>content/projects/</code> and list it in <code>content/manifest.js</code>.</p>
      </div>
      <span class="case-meta">draft</span>
    </div>
  </li>`;
}

async function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;
  const summary = document.getElementById("work-summary");

  if (projects.length === 0) {
    grid.innerHTML = emptyState();
    if (summary) summary.textContent = "0";
    return;
  }

  const results = await Promise.allSettled(projects.map((p) => fetchEntry(p.path)));
  const entries = results
    .map((r, i) => (r.status === "fulfilled" ? { ...r.value, ...projects[i] } : null))
    .filter(Boolean);

  grid.innerHTML = "";
  entries.forEach((entry, i) => grid.appendChild(caseNode(entry, i)));
  if (summary) summary.textContent = padIndex(entries.length);
  wireZoneLamps(grid);
  refreshFolioSnaps();
}

function wireZoneLamps(root) {
  if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  root.querySelectorAll(".case.has-lamp").forEach((zone) => {
    let raf = 0;
    let x = 0;
    let y = 0;

    const flush = () => {
      raf = 0;
      zone.style.setProperty("--lamp-x", `${x}px`);
      zone.style.setProperty("--lamp-y", `${y}px`);
    };

    const track = (e) => {
      const r = zone.getBoundingClientRect();
      /* Keep bright core inside feather — no knife clip at rim */
      const padX = Math.min(96, r.width * 0.28);
      const padY = Math.min(80, r.height * 0.32);
      x = Math.min(r.width - padX, Math.max(padX, e.clientX - r.left));
      y = Math.min(r.height - padY, Math.max(padY, e.clientY - r.top));
      if (!raf) raf = requestAnimationFrame(flush);
    };

    zone.addEventListener("pointerenter", track);
    zone.addEventListener("pointermove", track);
    zone.addEventListener("pointerleave", () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    });
  });
}

renderProjects();

/** Controlled scroll: Lenis + snap to intro / cases / contact. */
let folioLenis = null;
let folioSnap = null;
const folioSnapRemovers = [];

const folioScrollEase = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

function clearFolioSnaps() {
  while (folioSnapRemovers.length) {
    const remove = folioSnapRemovers.pop();
    try {
      remove();
    } catch {
      /* ignore */
    }
  }
}

function refreshFolioSnaps() {
  if (!folioSnap) return;
  clearFolioSnaps();

  const nodes = [
    document.querySelector(".intro"),
    document.querySelector(".work .section-head"),
    ...document.querySelectorAll(".case.has-lamp"),
    document.querySelector("#contact"),
  ].filter(Boolean);

  for (const el of nodes) {
    folioSnapRemovers.push(
      folioSnap.addElement(el, { align: ["start"] }),
    );
  }
}

async function wireSmoothScroll() {
  if (
    !document.body.classList.contains("portfolio") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  try {
    const [{ default: Lenis }, { default: Snap }] = await Promise.all([
      import("https://cdn.jsdelivr.net/npm/lenis@1.3.4/+esm"),
      import("https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis-snap.mjs"),
    ]);

    folioLenis = new Lenis({
      duration: 1.2,
      easing: folioScrollEase,
      smoothWheel: true,
      touchMultiplier: 1.35,
    });

    folioSnap = new Snap(folioLenis, {
      type: "mandatory",
      duration: 1.2,
      easing: folioScrollEase,
      debounce: 60,
      velocityThreshold: 0.15,
    });

    const raf = (time) => {
      folioLenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    refreshFolioSnaps();

    document.querySelectorAll('.folio-dock a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target || !folioLenis) return;
        e.preventDefault();
        folioLenis.scrollTo(target, {
          offset: -20,
          duration: 1.25,
          easing: folioScrollEase,
          lock: true,
        });
      });
    });
  } catch {
    /* keep CSS scroll-behavior fallback */
  }
}

wireSmoothScroll();

function wireReveals() {
  const nodes = [...document.querySelectorAll(".reveal")];
  if (!nodes.length) return;

  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    nodes.forEach((n) => n.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
  );

  nodes.forEach((n) => io.observe(n));
}

wireReveals();

/** Key bright plate out → muted leaf shadows + soft refraction twin. */
function wireCanopyShadows() {
  const root = document.querySelector(".folio-canopy");
  const video = document.querySelector(".folio-canopy-video");
  const canvas = document.querySelector(".folio-canopy-canvas");
  const refract = document.querySelector(".folio-canopy-refract");
  if (!root || !video || !canvas || !refract) return;

  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    root.hidden = true;
    return;
  }

  const ctx = canvas.getContext("2d", { alpha: true });
  const rctx = refract.getContext("2d", { alpha: true });
  const work = document.createElement("canvas");
  const light = document.createElement("canvas");
  const wctx = work.getContext("2d", {
    willReadFrequently: true,
    alpha: true,
  });
  const lctx = light.getContext("2d", {
    willReadFrequently: true,
    alpha: true,
  });
  if (!ctx || !rctx || !wctx || !lctx) return;

  // Dark leaf cast + cool refraction fringe
  const SH_R = 0;
  const SH_G = 0;
  const SH_B = 0;
  const LT_R = 186;
  const LT_G = 202;
  const LT_B = 218;
  const MAX_A = 230;
  const LIGHT_A = 0.52;
  const HI_FRAC = 0.08;
  const LO_FRAC = 0.82;

  function drawCover(destCtx, src, dw, dh) {
    const sw = src.videoWidth || src.width;
    const sh = src.videoHeight || src.height;
    if (!sw || !sh) return;
    const scale = Math.max(dw / sw, dh / sh) * 1.04;
    const tw = sw * scale;
    const th = sh * scale;
    destCtx.drawImage(src, (dw - tw) * 0.5, (dh - th) * 0.3, tw, th);
  }

  function sizeCanvases() {
    const w = root.clientWidth || window.innerWidth;
    const h = root.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const cw = Math.max(1, Math.floor(w * dpr));
    const ch = Math.max(1, Math.floor(h * dpr));
    canvas.width = cw;
    canvas.height = ch;
    refract.width = cw;
    refract.height = ch;
    work.width = Math.max(1, Math.floor(w * 0.4));
    work.height = Math.max(1, Math.floor(h * 0.4));
    light.width = work.width;
    light.height = work.height;
  }

  function keyFrame() {
    if (video.readyState < 2 || work.width < 2) return;
    if (!video.videoWidth || !video.videoHeight) return;

    wctx.clearRect(0, 0, work.width, work.height);
    drawCover(wctx, video, work.width, work.height);
    let img;
    try {
      img = wctx.getImageData(0, 0, work.width, work.height);
    } catch {
      return;
    }

    const d = img.data;
    let maxY = 0;
    let minY = 255;
    for (let i = 0; i < d.length; i += 4) {
      const y = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      if (y > maxY) maxY = y;
      if (y < minY) minY = y;
    }

    const range = Math.max(1, maxY - minY);
    const HI = maxY - range * HI_FRAC;
    const LO = maxY - range * LO_FRAC;
    const span = Math.max(1, HI - LO);

    const lightImg = lctx.createImageData(work.width, work.height);
    const ld = lightImg.data;

    for (let i = 0; i < d.length; i += 4) {
      const y = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      let a = 0;
      if (y <= LO) a = MAX_A;
      else if (y < HI) a = Math.round(MAX_A * (1 - (y - LO) / span));

      d[i] = SH_R;
      d[i + 1] = SH_G;
      d[i + 2] = SH_B;
      d[i + 3] = a;

      ld[i] = LT_R;
      ld[i + 1] = LT_G;
      ld[i + 2] = LT_B;
      ld[i + 3] = Math.round(a * LIGHT_A);
    }
    wctx.putImageData(img, 0, 0);
    lctx.putImageData(lightImg, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(work, 0, 0, canvas.width, canvas.height);

    rctx.clearRect(0, 0, refract.width, refract.height);
    rctx.imageSmoothingEnabled = true;
    rctx.imageSmoothingQuality = "high";
    rctx.drawImage(light, 0, 0, refract.width, refract.height);
  }

  let raf = 0;
  function loop() {
    keyFrame();
    raf = requestAnimationFrame(loop);
  }

  sizeCanvases();
  window.addEventListener("resize", sizeCanvases, { passive: true });

  const start = () => {
    video.playbackRate = 1;
    video.play().catch(() => {});
    if (!raf) loop();
  };

  if (video.readyState >= 2) start();
  else video.addEventListener("loadeddata", start, { once: true });
}

wireCanopyShadows();
