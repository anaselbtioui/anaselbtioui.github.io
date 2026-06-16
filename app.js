// #nobuild: plain ES module, runs in the browser with no compile step.
// Data lives locally (localStorage). Cross-device sync = an encrypted file
// (data/checkins.enc) you commit to the repo; only your passphrase decrypts it.

const STORAGE_KEY = "coherence-checkins-v1";
const SYNC_PATH = "./data/checkins.enc";

function el(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node;
}

// ---- local store ----------------------------------------------------------

function loadCheckIns() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCheckIns(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function mergeById(a, b) {
  const byId = new Map();
  for (const e of [...a, ...b]) byId.set(e.id, e);
  return [...byId.values()];
}

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---- encryption (Web Crypto, AES-GCM + PBKDF2) ----------------------------

function bytesToB64(bytes) {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s);
}

function b64ToBytes(str) {
  const bin = atob(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

async function deriveKey(passphrase, salt) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptText(text, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(text),
  );
  return JSON.stringify({
    v: 1,
    salt: bytesToB64(salt),
    iv: bytesToB64(iv),
    data: bytesToB64(new Uint8Array(cipher)),
  });
}

async function decryptText(payloadStr, passphrase) {
  const payload = JSON.parse(payloadStr);
  const salt = b64ToBytes(payload.salt);
  const iv = b64ToBytes(payload.iv);
  const data = b64ToBytes(payload.data);
  const key = await deriveKey(passphrase, salt);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(plain);
}

// ---- form: draft parts ----------------------------------------------------

let draftParts = [];

function renderDraftParts() {
  const wrap = el("parts");
  wrap.innerHTML = "";

  draftParts.forEach((part, index) => {
    const row = document.createElement("div");
    row.className = "part-row";

    const name = document.createElement("input");
    name.type = "text";
    name.value = part.name;
    name.placeholder = "name (e.g. the critic)";
    name.setAttribute("aria-label", `Part ${index + 1} name`);
    name.addEventListener("input", () => (draftParts[index].name = name.value));

    const note = document.createElement("input");
    note.type = "text";
    note.value = part.note;
    note.placeholder = "what it wants / fears";
    note.setAttribute("aria-label", `Part ${index + 1} note`);
    note.addEventListener("input", () => (draftParts[index].note = note.value));

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

// ---- log ------------------------------------------------------------------

function renderLog(entries) {
  const log = el("log");
  const summary = el("log-summary");
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

    if (entry.felt && entry.felt.trim()) {
      const felt = document.createElement("p");
      felt.className = "log-felt";
      felt.textContent = entry.felt.trim();
      li.appendChild(felt);
    }

    if (entry.parts && entry.parts.length) {
      const parts = document.createElement("ul");
      parts.className = "log-parts";
      for (const part of entry.parts) {
        const item = document.createElement("li");
        const name = (part.name || "").trim() || "unnamed";
        item.textContent = (part.note || "").trim()
          ? `${name} — ${part.note.trim()}`
          : name;
        parts.appendChild(item);
      }
      li.appendChild(parts);
    }

    if (entry.suffering && entry.suffering.trim()) {
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

// ---- sync (encrypted file in repo) ----------------------------------------

let passphrase = null;

function ensurePassphrase() {
  if (passphrase) return passphrase;
  const entered = window.prompt(
    "Passphrase for your encrypted check-ins (only you know this):",
  );
  if (entered) passphrase = entered;
  return passphrase;
}

async function unlockAndLoad() {
  const status = el("sync-status");
  const pass = ensurePassphrase();
  if (!pass) return;

  status.textContent = "loading…";
  try {
    const res = await fetch(SYNC_PATH, { cache: "no-store" });
    if (!res.ok) {
      status.textContent = "no synced file yet — make one with “Download encrypted”.";
      return;
    }
    const payload = await res.text();
    const json = await decryptText(payload, pass);
    const synced = JSON.parse(json);
    const merged = mergeById(loadCheckIns(), synced);
    saveCheckIns(merged);
    renderLog(merged);
    status.textContent = `loaded ${synced.length} synced.`;
  } catch (err) {
    console.error(err);
    passphrase = null;
    status.textContent = "couldn’t decrypt — wrong passphrase or bad file.";
  }
}

async function downloadEncrypted() {
  const status = el("sync-status");
  const pass = ensurePassphrase();
  if (!pass) return;

  try {
    const json = JSON.stringify(loadCheckIns());
    const payload = await encryptText(json, pass);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "checkins.enc";
    a.click();
    URL.revokeObjectURL(url);
    status.textContent = "downloaded. commit it to data/checkins.enc";
  } catch (err) {
    console.error(err);
    status.textContent = "encryption failed.";
  }
}

// ---- init -----------------------------------------------------------------

function main() {
  const form = el("checkin-form");
  const felt = el("felt");
  const coherence = el("coherence");
  const coherenceOut = el("coherence-out");
  const suffering = el("suffering");
  const addPart = el("add-part");
  const status = el("save-status");

  coherence.addEventListener("input", () => {
    coherenceOut.textContent = coherence.value;
  });

  addPart.addEventListener("click", () => {
    draftParts.push({ name: "", note: "" });
    renderDraftParts();
    el("parts").querySelector(".part-row:last-child input")?.focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const entry = {
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
    window.setTimeout(() => (status.textContent = ""), 2000);
  });

  el("unlock").addEventListener("click", unlockAndLoad);
  el("backup").addEventListener("click", downloadEncrypted);

  renderDraftParts();
  renderLog(loadCheckIns());
}

main();
