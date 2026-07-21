// #nobuild: dedicated case study page — ?p=slug from manifest path.
import { projects } from "./content/manifest.js";
import { fetchEntry } from "./md.js";

export function projectSlug(path) {
  const file = path.split("/").pop() || "";
  return file.replace(/\.md$/i, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function padIndex(n) {
  return String(n).padStart(2, "0");
}

function querySlug() {
  const params = new URLSearchParams(window.location.search);
  let slug = (params.get("p") || params.get("slug") || "").trim();
  if (!slug && window.location.hash) {
    slug = window.location.hash
      .replace(/^#/, "")
      .replace(/^p=/i, "")
      .trim();
  }
  return slug;
}

function findProject(slug) {
  const i = projects.findIndex((p) => projectSlug(p.path) === slug);
  if (i < 0) return null;
  return { meta: projects[i], index: i };
}

function snapshotBits(entry) {
  return [
    entry.domain && entry.role
      ? `${entry.domain} · ${entry.role}`
      : entry.domain || entry.role,
    entry.duration,
    entry.date,
  ].filter(Boolean);
}

async function renderCase() {
  const host = document.getElementById("case-article");
  const pager = document.getElementById("case-pager");
  if (!host) return;

  const slug = querySlug();
  if (!slug) {
    host.removeAttribute("aria-busy");
    host.innerHTML =
      '<p class="muted">Missing project. <a href="./#work">Back to work</a>.</p>';
    return;
  }

  const hit = findProject(slug);
  if (!hit) {
    host.removeAttribute("aria-busy");
    host.innerHTML =
      '<p class="muted">Unknown project. <a href="./#work">Back to work</a>.</p>';
    return;
  }

  try {
    const entry = { ...(await fetchEntry(hit.meta.path)), ...hit.meta };
    document.title = `${entry.title} — Anas`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && entry.summary) desc.setAttribute("content", entry.summary);

    const bits = snapshotBits(entry);
    const cover = entry.cover
      ? `<figure class="case-hero-cover">
          <img src="${entry.cover}" alt="" decoding="async" />
        </figure>`
      : "";

    host.removeAttribute("aria-busy");
    host.innerHTML = `
      <header class="case-header">
        <p class="case-kicker">${padIndex(hit.index + 1)} · Case study</p>
        <h1 class="case-hero-title">${entry.title}</h1>
        ${bits.length ? `<p class="case-meta-line">${bits.join(" · ")}</p>` : ""}
      </header>
      ${cover}
      <div class="case-prose">${entry.bodyHtml}</div>
    `;

    if (pager && projects.length > 1) {
      const prev = projects[hit.index - 1];
      const next = projects[hit.index + 1];
      pager.hidden = false;
      pager.innerHTML = `
        <div class="case-pager-row">
          ${
            prev
              ? `<a class="case-pager-link prev" href="./case.html#${projectSlug(prev.path)}">
                  <span class="case-pager-label">Previous</span>
                  <span class="case-pager-title"></span>
                </a>`
              : `<span class="case-pager-link prev is-empty"></span>`
          }
          ${
            next
              ? `<a class="case-pager-link next" href="./case.html#${projectSlug(next.path)}">
                  <span class="case-pager-label">Next</span>
                  <span class="case-pager-title"></span>
                </a>`
              : `<span class="case-pager-link next is-empty"></span>`
          }
        </div>
      `;

      // Fill titles without blocking first paint
      const fill = async (node, meta) => {
        if (!node || !meta) return;
        try {
          const e = await fetchEntry(meta.path);
          const t = node.querySelector(".case-pager-title");
          if (t) t.textContent = e.title;
        } catch {
          /* ignore */
        }
      };
      fill(pager.querySelector(".case-pager-link.prev:not(.is-empty)"), prev);
      fill(pager.querySelector(".case-pager-link.next:not(.is-empty)"), next);
    }
  } catch (err) {
    host.removeAttribute("aria-busy");
    host.innerHTML = `<p class="muted">Could not load case study. <a href="./#work">Back to work</a>.</p>`;
    console.error(err);
  }
}

if (document.getElementById("case-article")) {
  renderCase();
}
