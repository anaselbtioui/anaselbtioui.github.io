// #nobuild: renders project entries into the commercial portfolio. Loaded from /.
// Editorial when text-only; gallery when a cover image is present.
import { projects } from "./content/manifest.js";
import { fetchEntry } from "./md.js";

function cardNode(entry, index) {
  const li = document.createElement("li");
  li.className = "card";
  if (entry.featured) li.classList.add("featured");
  if (entry.cover) li.classList.add("has-cover");
  li.style.setProperty("--i", String(index));

  if (entry.cover) {
    const figure = document.createElement("figure");
    figure.className = "card-cover";
    const img = document.createElement("img");
    img.src = entry.cover;
    img.alt = entry.title;
    img.loading = "lazy";
    img.decoding = "async";
    figure.appendChild(img);
    li.appendChild(figure);
  }

  const meta = [entry.domain, entry.role, entry.date].filter(Boolean);
  if (meta.length) {
    const metaEl = document.createElement("p");
    metaEl.className = "card-meta";
    metaEl.textContent = meta.join("  ·  ");
    li.appendChild(metaEl);
  }

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = entry.title;
  li.appendChild(title);

  if (entry.summary) {
    const summary = document.createElement("p");
    summary.className = "card-summary";
    summary.textContent = entry.summary;
    li.appendChild(summary);
  }

  return li;
}

async function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;
  const summary = document.getElementById("work-summary");

  if (projects.length === 0) {
    grid.innerHTML =
      '<li class="card is-draft empty"><p class="muted">No projects published yet — drafts live in <code>content/projects/</code>. Add them to <code>content/manifest.js</code> to publish.</p></li>';
    if (summary) summary.textContent = "Drafts in progress.";
    return;
  }

  const results = await Promise.allSettled(projects.map((p) => fetchEntry(p.path)));
  const entries = results
    .map((r, i) => (r.status === "fulfilled" ? { ...r.value, ...projects[i] } : null))
    .filter(Boolean);

  grid.innerHTML = "";
  entries.forEach((entry, i) => grid.appendChild(cardNode(entry, i)));
  if (summary) {
    summary.textContent = `${entries.length} project${
      entries.length === 1 ? "" : "s"
    } — process-first, not screenshots.`;
  }
}

renderProjects();
