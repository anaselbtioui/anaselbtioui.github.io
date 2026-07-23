// #nobuild: Lefos-style soft canopy — CSS video multiply + FX toggle + grain tile.

const FX_KEY = "folio-leaf-shadows";

function readFx() {
  try {
    const v = localStorage.getItem(FX_KEY);
    if (v === "off") return false;
    if (v === "on") return true;
  } catch {
    /* private mode */
  }
  return true;
}

function writeFx(on) {
  try {
    localStorage.setItem(FX_KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
}

/** Fine film grain — pure random (sin fBm = visible mesh). */
export function makeGrainTile(size = 128) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (110 + Math.random() * 36) | 0;
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL("image/png");
}

export function applyGrainTile() {
  const url = makeGrainTile(256);
  if (!url) return;
  document.documentElement.style.setProperty("--folio-grain", `url("${url}")`);
}

let canopyRoot = null;
let canopyVideo = null;
let fxBtn = null;

export function setCanopyFx(on) {
  writeFx(on);
  if (canopyRoot) canopyRoot.dataset.fx = on ? "on" : "off";
  if (fxBtn) {
    fxBtn.setAttribute("aria-pressed", on ? "true" : "false");
    fxBtn.textContent = "FX";
  }
  if (!canopyVideo) return;
  if (on && !document.hidden) {
    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) canopyVideo.play().catch(() => {});
  } else {
    canopyVideo.pause();
  }
}

export function wireCanopyShadows() {
  canopyRoot = document.querySelector(".folio-canopy");
  canopyVideo = canopyRoot?.querySelector(".folio-canopy-video") ?? null;
  fxBtn = document.querySelector("[data-folio-fx]");

  applyGrainTile();

  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canopyRoot || !canopyVideo) {
    if (fxBtn) fxBtn.hidden = true;
    return;
  }

  if (reduced) {
    canopyRoot.hidden = true;
    canopyVideo.pause();
    if (fxBtn) fxBtn.hidden = true;
    return;
  }

  const on = readFx();
  setCanopyFx(on);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      canopyVideo.pause();
    } else if (readFx()) {
      canopyVideo.play().catch(() => {});
    }
  });

  if (fxBtn) {
    fxBtn.addEventListener("click", () => {
      setCanopyFx(!readFx());
    });
  }
}
