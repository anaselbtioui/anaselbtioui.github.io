// #nobuild: case strips — type · title · problem line; cover optional upgrade.
import { projects } from "./content/manifest.js";
import { fetchEntry } from "./md.js";

function padIndex(n) {
  return String(n).padStart(2, "0");
}

function caseNode(entry, index) {
  const li = document.createElement("li");
  li.className = "case";
  if (entry.featured) li.classList.add("featured");
  if (entry.cover) li.classList.add("has-cover");
  li.style.setProperty("--i", String(index));

  if (entry.cover) {
    const figure = document.createElement("figure");
    figure.className = "case-cover";
    const img = document.createElement("img");
    img.src = entry.cover;
    img.alt = entry.title;
    img.loading = "lazy";
    img.decoding = "async";
    figure.appendChild(img);
    li.appendChild(figure);
  }

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
  li.appendChild(body);
  return li;
}

function emptyState() {
  return `<li class="case is-draft empty">
    <div class="case-body">
      <span class="case-index">00</span>
      <div class="case-main">
        <p class="case-type">Not published yet</p>
        <h3 class="case-title">No cases on the shelf</h3>
        <p class="case-summary">Write a project in <code>content/projects/</code>, then add its path to <code>content/manifest.js</code>. Empty is honest; fake covers are not.</p>
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
    if (summary) summary.textContent = "00 · empty";
    return;
  }

  const results = await Promise.allSettled(projects.map((p) => fetchEntry(p.path)));
  const entries = results
    .map((r, i) => (r.status === "fulfilled" ? { ...r.value, ...projects[i] } : null))
    .filter(Boolean);

  grid.innerHTML = "";
  entries.forEach((entry, i) => grid.appendChild(caseNode(entry, i)));
  if (summary) summary.textContent = padIndex(entries.length);
}

renderProjects();

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
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );

  nodes.forEach((n) => io.observe(n));
}

wireReveals();
