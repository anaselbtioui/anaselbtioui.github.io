// #nobuild: tiny markdown renderer for the controlled subset used in content/*.md
// (headings, unordered lists, paragraphs, inline code / bold / italic / links).
// Not a general parser — deliberately small and dependency-free.

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  }[c]));
}

function inline(s) {
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

export function renderMarkdown(src, headingOffset = 1) {
  const lines = src.split(/\r?\n/);
  let html = "";
  let inList = false;
  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeList();
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = Math.min(6, heading[1].length + headingOffset);
      html += `<h${level}>${inline(heading[2])}</h${level}>`;
      continue;
    }
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inline(item[1])}</li>`;
      continue;
    }
    closeList();
    html += `<p>${inline(line)}</p>`;
  }
  closeList();
  return html;
}

function metaField(src, key) {
  const m = src.match(new RegExp(`^\\s*-?\\s*${key}:\\s*(.*)$`, "im"));
  return m ? m[1].trim() : "";
}

// First paragraph of prose under a "## Heading" section, as plain text.
export function sectionText(src, heading) {
  const re = new RegExp(`^#{2,3}\\s+${heading}\\s*$([\\s\\S]*?)(?=^#{1,3}\\s|$)`, "im");
  const block = src.match(re);
  if (!block) return "";
  const para = block[1]
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .find((s) => s && !s.startsWith("-") && !s.startsWith("#"));
  return para ? para.replace(/\s+/g, " ").trim() : "";
}

// Pull title / date / tags / snapshot fields off the top, render the rest.
export function parseEntry(src) {
  const titleMatch = src.match(/^#\s+(.*)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled";

  const date = metaField(src, "Date");
  const role = metaField(src, "Role");
  const domain = metaField(src, "Domain");
  const duration = metaField(src, "Duration");

  const tagsMatch = src.match(/^\s*-?\s*Tags:\s*(.*)$/m);
  const tags = tagsMatch
    ? tagsMatch[1].split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const summary =
    sectionText(src, "Problem") || sectionText(src, "Artistic Intent");

  const body = src
    .replace(/^#\s+.*$/m, "")
    .replace(/^\s*-?\s*Date:.*$/m, "")
    .replace(/^\s*-?\s*Tags:.*$/m, "");

  return {
    title,
    date,
    role,
    domain,
    duration,
    tags,
    summary,
    bodyHtml: renderMarkdown(body, 2),
  };
}

export async function fetchEntry(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Missing ${path} (${res.status})`);
  const src = await res.text();
  return { path, ...parseEntry(src) };
}
