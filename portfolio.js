// #nobuild: case strips — type · title · problem line; cover optional upgrade.
import { projects } from "./content/manifest.js";
import { fetchEntry } from "./md.js";
import { projectSlug } from "./case.js";
import { wireFolioRail } from "./folio-rail.js";
import { wireCanopyShadows } from "./canopy.js?v=13";

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
  window.dispatchEvent(new Event("resize"));
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

/** Mild Lenis inertia — no snap (snap fought sections). */
let folioLenis = null;

const folioScrollEase = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

async function wireSmoothScroll() {
  const railApi = {
    getY: () => window.scrollY || 0,
    scrollTo: (y) => window.scrollTo(0, y),
  };
  const rail = wireFolioRail(railApi);

  if (
    !document.body.classList.contains("portfolio") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  try {
    const { default: Lenis } = await import(
      "https://cdn.jsdelivr.net/npm/lenis@1.3.4/+esm"
    );

    folioLenis = new Lenis({
      duration: 1.05,
      easing: folioScrollEase,
      smoothWheel: true,
      touchMultiplier: 1.35,
    });

    railApi.getY = () => folioLenis.scroll;
    railApi.scrollTo = (y) => folioLenis.scrollTo(y, { immediate: true });
    folioLenis.on("scroll", () => {
      rail?.update();
    });

    const raf = (time) => {
      folioLenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    rail?.update();

    document.querySelectorAll('.folio-dock a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target || !folioLenis) return;
        e.preventDefault();
        folioLenis.scrollTo(target, {
          offset: -20,
          duration: 1.1,
          easing: folioScrollEase,
        });
      });
    });
  } catch {
    /* keep CSS scroll-behavior fallback + rail */
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

wireCanopyShadows();
