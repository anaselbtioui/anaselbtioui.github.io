// #nobuild: renders journal entries into the personal space. Loaded from /personal/.
import { journal } from "./content/manifest.js";
import { fetchEntry } from "./md.js";

function entryNode(entry) {
  const details = document.createElement("details");
  details.className = "entry";

  const summary = document.createElement("summary");
  const title = document.createElement("span");
  title.className = "entry-title";
  title.textContent = entry.title;
  const date = document.createElement("span");
  date.className = "entry-date";
  date.textContent = entry.date;
  summary.append(title, date);
  details.appendChild(summary);

  if (entry.tags.length) {
    const tags = document.createElement("p");
    tags.className = "entry-tags";
    tags.textContent = entry.tags.join(" · ");
    details.appendChild(tags);
  }

  const body = document.createElement("div");
  body.className = "entry-body";
  body.innerHTML = entry.bodyHtml;
  details.appendChild(body);

  return details;
}

async function renderJournal() {
  const host = document.getElementById("journal");
  if (!host) return;
  const summary = document.getElementById("journal-summary");

  if (journal.length === 0) {
    if (summary) summary.textContent = "No entries yet.";
    return;
  }

  const results = await Promise.allSettled(journal.map((e) => fetchEntry(e.path)));
  const entries = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  if (summary) {
    summary.textContent = `${entries.length} entr${entries.length === 1 ? "y" : "ies"}`;
  }
  host.innerHTML = "";
  for (const entry of entries) host.appendChild(entryNode(entry));

  const failed = results.filter((r) => r.status === "rejected").length;
  if (failed && summary) {
    summary.textContent += ` · ${failed} failed to load`;
  }
}

renderJournal();
