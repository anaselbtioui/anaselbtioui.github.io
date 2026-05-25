import { marked } from "marked";

type Entry = {
  slug: string;
  title: string;
  date: string | null;
  tags: string[];
  markdown: string;
};

const journalModules = import.meta.glob("../content/journal/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

function extractFront(mk: string): { title: string; date: string | null; tags: string[] } {
  const title = (mk.match(/^#\s+(.+)$/m)?.[1] ?? "Untitled").trim();
  const date = (mk.match(/^Date:\s*(.+)\s*$/m)?.[1] ?? null)?.trim() || null;
  const tagsLine = (mk.match(/^Tags:\s*(.+)\s*$/m)?.[1] ?? "").trim();
  const tags = tagsLine ? tagsLine.split(",").map((t) => t.trim()).filter(Boolean) : [];
  return { title, date, tags };
}

function slugFromPath(p: string) {
  const base = p.split("/").pop() ?? p;
  return base.replace(/\.md$/, "");
}

async function loadEntries(): Promise<Entry[]> {
  const paths = Object.keys(journalModules);
  const loaded = await Promise.all(
    paths.map(async (p) => {
      const markdown = await journalModules[p]();
      const { title, date, tags } = extractFront(markdown);
      return { slug: slugFromPath(p), title, date, tags, markdown };
    }),
  );

  loaded.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  return loaded;
}

function el<T extends HTMLElement>(id: string) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

function renderList(entries: Entry[]) {
  const list = el<HTMLOListElement>("journal-list");
  const count = el<HTMLDivElement>("journal-count");
  count.textContent = `${entries.length} total`;
  list.innerHTML = "";

  for (const entry of entries) {
    const li = document.createElement("li");
    li.className = "journal-item";

    const a = document.createElement("a");
    a.href = `#journal/${encodeURIComponent(entry.slug)}`;
    a.className = "journal-link";

    const title = document.createElement("div");
    title.className = "journal-item-title";
    title.textContent = entry.title;

    const meta = document.createElement("div");
    meta.className = "journal-item-meta";
    const tags = entry.tags.slice(0, 3).join(" · ");
    meta.textContent = [entry.date ?? "—", tags].filter(Boolean).join("  /  ");

    a.appendChild(title);
    a.appendChild(meta);
    li.appendChild(a);
    list.appendChild(li);
  }
}

function setActiveSlug(slug: string | null) {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".journal-link"));
  for (const link of links) {
    const isActive = link.getAttribute("href") === `#journal/${encodeURIComponent(slug ?? "")}`;
    link.setAttribute("aria-current", isActive ? "true" : "false");
  }
}

function renderEntry(entry: Entry | null) {
  const reader = el<HTMLDivElement>("journal-reader-content");
  if (!entry) {
    reader.innerHTML = `<p class="muted">Pick entry. Reader show here.</p>`;
    setActiveSlug(null);
    return;
  }

  const html = marked.parse(entry.markdown, { gfm: true, breaks: false }) as string;
  reader.innerHTML = html;
  setActiveSlug(entry.slug);
}

function getSlugFromHash(): string | null {
  const h = window.location.hash || "";
  const m = h.match(/^#journal\/(.+)$/);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

function ensureReaderVisible() {
  document.querySelector(".journal-reader")?.classList.add("is-open");
}

function ensureReaderHidden() {
  document.querySelector(".journal-reader")?.classList.remove("is-open");
}

async function main() {
  const entries = await loadEntries();
  renderList(entries);

  const closeBtn = el<HTMLButtonElement>("journal-close");
  closeBtn.addEventListener("click", () => {
    ensureReaderHidden();
    window.location.hash = "#journal";
  });

  const onRoute = () => {
    const slug = getSlugFromHash();
    const entry = slug ? entries.find((e) => e.slug === slug) ?? null : null;
    renderEntry(entry);
    if (entry) ensureReaderVisible();
  };

  window.addEventListener("hashchange", onRoute);
  onRoute();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
});

