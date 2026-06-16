type Part = {
  name: string;
  note: string;
};

type CheckIn = {
  id: string;
  ts: number;
  felt: string;
  parts: Part[];
  coherence: number;
  suffering: string;
};

const STORAGE_KEY = "coherence-checkins-v1";

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

function loadCheckIns(): CheckIn[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CheckIn[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCheckIns(entries: CheckIn[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Draft parts being composed in the form, before the check-in is saved.
let draftParts: Part[] = [];

function renderDraftParts() {
  const wrap = el<HTMLDivElement>("parts");
  wrap.innerHTML = "";

  draftParts.forEach((part, index) => {
    const row = document.createElement("div");
    row.className = "part-row";

    const name = document.createElement("input");
    name.type = "text";
    name.value = part.name;
    name.placeholder = "name (e.g. the critic)";
    name.setAttribute("aria-label", `Part ${index + 1} name`);
    name.addEventListener("input", () => {
      draftParts[index].name = name.value;
    });

    const note = document.createElement("input");
    note.type = "text";
    note.value = part.note;
    note.placeholder = "what it wants / fears";
    note.setAttribute("aria-label", `Part ${index + 1} note`);
    note.addEventListener("input", () => {
      draftParts[index].note = note.value;
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "ghost remove-part";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Remove part ${index + 1}`);
    remove.addEventListener("click", () => {
      draftParts.splice(index, 1);
      renderDraftParts();
    });

    row.append(name, note, remove);
    wrap.appendChild(row);
  });
}

function renderLog(entries: CheckIn[]) {
  const log = el<HTMLOListElement>("log");
  const summary = el<HTMLParagraphElement>("log-summary");
  log.innerHTML = "";

  if (entries.length === 0) {
    summary.textContent = "No check-ins yet.";
    return;
  }

  const avg = Math.round(
    entries.reduce((sum, e) => sum + e.coherence, 0) / entries.length,
  );
  summary.textContent = `${entries.length} check-in${entries.length === 1 ? "" : "s"} · avg coherence ${avg}`;

  const sorted = [...entries].sort((a, b) => b.ts - a.ts);

  for (const entry of sorted) {
    const li = document.createElement("li");
    li.className = "log-item";

    const meta = document.createElement("div");
    meta.className = "log-meta";
    meta.innerHTML = `<span>${formatDate(entry.ts)}</span><span class="reading">${entry.coherence}</span>`;

    li.appendChild(meta);

    if (entry.felt.trim()) {
      const felt = document.createElement("p");
      felt.className = "log-felt";
      felt.textContent = entry.felt.trim();
      li.appendChild(felt);
    }

    if (entry.parts.length) {
      const parts = document.createElement("ul");
      parts.className = "log-parts";
      for (const part of entry.parts) {
        const item = document.createElement("li");
        const name = part.name.trim() || "unnamed";
        item.textContent = part.note.trim() ? `${name} — ${part.note.trim()}` : name;
        parts.appendChild(item);
      }
      li.appendChild(parts);
    }

    if (entry.suffering.trim()) {
      const suffering = document.createElement("p");
      suffering.className = "log-suffering";
      suffering.textContent = `set down: ${entry.suffering.trim()}`;
      li.appendChild(suffering);
    }

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "ghost remove-entry";
    remove.textContent = "delete";
    remove.addEventListener("click", () => {
      const next = loadCheckIns().filter((e) => e.id !== entry.id);
      saveCheckIns(next);
      renderLog(next);
    });
    li.appendChild(remove);

    log.appendChild(li);
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function main() {
  const form = el<HTMLFormElement>("checkin-form");
  const felt = el<HTMLTextAreaElement>("felt");
  const coherence = el<HTMLInputElement>("coherence");
  const coherenceOut = el<HTMLSpanElement>("coherence-out");
  const suffering = el<HTMLTextAreaElement>("suffering");
  const addPart = el<HTMLButtonElement>("add-part");
  const status = el<HTMLSpanElement>("save-status");

  coherence.addEventListener("input", () => {
    coherenceOut.textContent = coherence.value;
  });

  addPart.addEventListener("click", () => {
    draftParts.push({ name: "", note: "" });
    renderDraftParts();
    const wrap = el<HTMLDivElement>("parts");
    wrap.querySelector<HTMLInputElement>(".part-row:last-child input")?.focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const entry: CheckIn = {
      id: newId(),
      ts: Date.now(),
      felt: felt.value,
      parts: draftParts
        .map((p) => ({ name: p.name.trim(), note: p.note.trim() }))
        .filter((p) => p.name || p.note),
      coherence: Number(coherence.value),
      suffering: suffering.value,
    };

    const next = [...loadCheckIns(), entry];
    saveCheckIns(next);

    form.reset();
    draftParts = [];
    renderDraftParts();
    coherenceOut.textContent = coherence.value;
    renderLog(next);

    status.textContent = "saved";
    window.setTimeout(() => {
      status.textContent = "";
    }, 2000);
  });

  renderDraftParts();
  renderLog(loadCheckIns());
}

main();
