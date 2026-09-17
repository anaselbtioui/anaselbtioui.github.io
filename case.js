// #nobuild: thin standby case page — ?p=slug from content/cases.js
import { cases, findCase, caseHref } from "./content/cases.js";
import { wireFolioRail } from "./folio-rail.js";

function querySlug() {
  const params = new URLSearchParams(window.location.search);
  let slug = (params.get("p") || params.get("slug") || "").trim().toLowerCase();
  if (!slug && window.location.hash) {
    slug = window.location.hash
      .replace(/^#/, "")
      .replace(/^p=/i, "")
      .trim()
      .toLowerCase();
  }
  return slug;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}

function renderCase() {
  const host = document.getElementById("case-article");
  const pager = document.getElementById("case-pager");
  if (!host) return;

  const slug = querySlug();
  if (!slug) {
    host.removeAttribute("aria-busy");
    host.innerHTML =
      '<p class="case-miss">Missing project. <a href="./#work">Back to work</a>.</p>';
    return;
  }

  const hit = findCase(slug);
  if (!hit) {
    host.removeAttribute("aria-busy");
    host.innerHTML =
      '<p class="case-miss">Unknown project. <a href="./#work">Back to work</a>.</p>';
    return;
  }

  const { entry, index } = hit;
  document.title = `${entry.title} — Anas Elbtioui`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", entry.line);

  const body = (entry.body || [])
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");

  const contrib = [];
  if (entry.live) {
    contrib.push(
      `<a class="hit" href="${escapeHtml(entry.live)}" target="_blank" rel="noopener noreferrer">Live site</a>`
    );
  }
  if (entry.github) {
    contrib.push(
      `<a class="hit" href="${escapeHtml(entry.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`
    );
  }

  host.removeAttribute("aria-busy");
  host.innerHTML = `
    <header class="case-header">
      ${entry.group ? `<p class="case-kicker">${escapeHtml(entry.group)}</p>` : ""}
      <h1 class="case-title">${escapeHtml(entry.title)}</h1>
      <p class="case-line">${escapeHtml(entry.line)}</p>
    </header>
    <figure class="case-plate">
      <img
        class="case-plate-still"
        src="${escapeHtml(entry.poster)}"
        alt=""
        width="400"
        height="500"
        decoding="async"
      >
      <img
        class="case-plate-loop"
        src="${escapeHtml(entry.gif)}"
        alt=""
        width="400"
        height="500"
        decoding="async"
      >
    </figure>
    <div class="case-body">${body}</div>
    ${
      contrib.length
        ? `<nav class="case-contrib cta" aria-label="Links">${contrib.join("")}</nav>`
        : ""
    }
  `;

  if (pager && cases.length > 1) {
    const prev = cases[index - 1];
    const next = cases[index + 1];
    pager.hidden = false;
    pager.innerHTML = `
      <div class="case-pager-row">
        ${
          prev
            ? `<a class="case-pager-link" href="${caseHref(prev.slug)}">
                <span class="case-pager-label">Previous</span>
                <span class="case-pager-title">${escapeHtml(prev.title)}</span>
              </a>`
            : `<span class="case-pager-link is-empty"></span>`
        }
        ${
          next
            ? `<a class="case-pager-link case-pager-next" href="${caseHref(next.slug)}">
                <span class="case-pager-label">Next</span>
                <span class="case-pager-title">${escapeHtml(next.title)}</span>
              </a>`
            : `<span class="case-pager-link is-empty"></span>`
        }
      </div>
    `;
  }

  window.dispatchEvent(new Event("resize"));
}

if (document.getElementById("case-article")) {
  wireFolioRail();
  renderCase();
}
