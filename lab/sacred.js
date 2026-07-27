// #nobuild: Sacred cue lab — phosphor toggles, debug ch-grid, loaders.

const stage = document.getElementById("stage");
const body = document.body;
const chkP = document.getElementById("chk-phosphor");
const chkS = document.getElementById("chk-scan");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setPhosphor(on) {
  if (on) body.dataset.pageSkin = "phosphor";
  else delete body.dataset.pageSkin;
  if (stage) {
    if (on) stage.dataset.skin = "phosphor";
    else stage.removeAttribute("data-skin");
  }
  if (chkP) chkP.checked = on;
}

function setScan(on) {
  if (stage) stage.dataset.scan = on ? "on" : "off";
  if (chkS) chkS.checked = on;
}

document.getElementById("toggle-phosphor")?.addEventListener("click", () => {
  setPhosphor(body.dataset.pageSkin !== "phosphor");
});
document.getElementById("toggle-scan")?.addEventListener("click", () => {
  setScan(stage?.dataset.scan !== "on");
});
document.getElementById("toggle-grid")?.addEventListener("click", () => {
  window.dispatchEvent(new CustomEvent("debugGridToggle"));
});
chkP?.addEventListener("change", () => setPhosphor(chkP.checked));
chkS?.addEventListener("change", () => setScan(chkS.checked));

/* —— DebugGrid recipe: 1ch × 1.25rem —— */
(function mountDebugGrid() {
  const debugGrid = document.createElement("div");
  let isVisible = false;
  const setHeight = () => {
    debugGrid.style.height = `${document.documentElement.scrollHeight}px`;
  };
  Object.assign(debugGrid.style, {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    zIndex: "0",
    margin: "0",
    backgroundImage: `
      repeating-linear-gradient(#3a3a3a 0 1px, transparent 1px 100%),
      repeating-linear-gradient(90deg, #3a3a3a 0 1px, transparent 1px 100%)
    `,
    backgroundSize: "1ch 1.25rem",
    pointerEvents: "none",
    display: "none",
    opacity: "0.55",
  });
  document.body.appendChild(debugGrid);
  setHeight();
  const observer = new ResizeObserver(setHeight);
  observer.observe(document.documentElement);
  window.addEventListener("debugGridToggle", () => {
    isVisible = !isVisible;
    debugGrid.style.display = isVisible ? "block" : "none";
  });
  window.addEventListener("resize", setHeight);
})();

/* —— BlockLoader sequences (from SRCL BlockLoader.tsx) —— */
const BLOCK_SEQUENCES = [
  ["⠁", "⠂", "⠄", "⡀", "⢀", "⠠", "⠐", "⠈"],
  ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"],
  ["▖", "▘", "▝", "▗"],
  ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█", "▇", "▆", "▅", "▄", "▃", "▁"],
  ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"],
  ["┤", "┘", "┴", "└", "├", "┌", "┬", "┐"],
];

function mountBlockSpinners() {
  document.querySelectorAll("[data-block-loader]").forEach((el) => {
    const mode = Number(el.getAttribute("data-block-loader") || "0");
    const seq = BLOCK_SEQUENCES[mode] || BLOCK_SEQUENCES[0];
    let i = 0;
    el.textContent = seq[0];
    if (reduceMotion) return;
    window.setInterval(() => {
      i = (i + 1) % seq.length;
      el.textContent = seq[i];
    }, 100);
  });
}

/* —— BarLoader auto tick —— */
function mountBarLoaders() {
  document.querySelectorAll("[data-bar-loader]").forEach((el) => {
    const bar = el.querySelector(".sacred-bar-fill");
    if (!bar) return;
    let p = 0;
    if (reduceMotion) {
      bar.style.width = "40%";
      return;
    }
    window.setInterval(() => {
      p = (p + 10) % 110;
      bar.style.width = `${Math.min(p, 100)}%`;
    }, 180);
  });
}

/* —— Char progress (BarProgress recipe) —— */
function mountCharProgress() {
  document.querySelectorAll("[data-char-progress]").forEach((root) => {
    const fillChar = root.getAttribute("data-fill-char") || "░";
    const out = root.querySelector("[data-char-out]");
    const measure = root.querySelector("[data-char-measure]");
    if (!out || !measure) return;
    let progress = 0;
    const paint = () => {
      const cw = measure.getBoundingClientRect().width || 8;
      const max = Math.max(1, Math.floor(root.clientWidth / cw));
      const n = Math.round((Math.min(progress, 100) / 100) * max);
      out.textContent = fillChar.repeat(n);
    };
    paint();
    new ResizeObserver(paint).observe(root);
    if (reduceMotion) {
      progress = 45;
      paint();
      return;
    }
    window.setInterval(() => {
      progress = (progress + 8) % 110;
      paint();
    }, 160);
  });
}

/* —— One-line CLI loader —— */
const CLI_FRAMES = ["⠋⠋⠋⠋", "⠙⠙⠙⠙", "⠹⠹⠹⠹", "⠸⠸⠸⠸", "⠼⠼⠼⠼", "⠴⠴⠴⠴", "⠦⠦⠦⠦", "⠧⠧⠧⠧", "⠇⠇⠇⠇", "⠏⠏⠏⠏"];
const CLI_WORDS = ["Thinking", "Pondering", "Reasoning", "Analyzing", "Processing"];
const CLI_DOTS = ["﹒", "﹒﹒", "﹒﹒﹒"];

function mountOneLine() {
  const el = document.querySelector("[data-one-line]");
  if (!el) return;
  const spin = el.querySelector("[data-ol-spin]");
  const word = el.querySelector("[data-ol-word]");
  const dots = el.querySelector("[data-ol-dots]");
  const time = el.querySelector("[data-ol-time]");
  let fi = 0;
  let wi = 0;
  let di = 0;
  let start = performance.now();
  if (reduceMotion) {
    if (spin) spin.textContent = CLI_FRAMES[0];
    if (word) word.textContent = CLI_WORDS[0];
    if (dots) dots.textContent = CLI_DOTS[2];
    if (time) time.textContent = "(0ms)";
    return;
  }
  // Sacred note: setInterval not rAF — mobile throttle
  window.setInterval(() => {
    fi = (fi + 1) % CLI_FRAMES.length;
    if (fi === 0) wi = (wi + 1) % CLI_WORDS.length;
    di = (di + 1) % CLI_DOTS.length;
    if (spin) spin.textContent = CLI_FRAMES[fi];
    if (word) word.textContent = CLI_WORDS[wi];
    if (dots) dots.textContent = CLI_DOTS[di];
    if (time) time.textContent = `(${Math.round(performance.now() - start)}ms)`;
  }, 80);
}

mountBlockSpinners();
mountBarLoaders();
mountCharProgress();
mountOneLine();

/* —— ASCIICanvas (from SRCL ASCIICanvas.tsx) —— */
const ASCII_DENSITY = "10";

function asciiAnimate(x, y, t) {
  const speed = t * 8;
  const wave1 = Math.sin(x * 0.15 + speed) * Math.cos(y * 0.1 + speed * 0.7);
  const wave2 = Math.sin((x + y) * 0.08 + speed * 1.3);
  const v = wave1 + wave2;
  const digit = ASCII_DENSITY[Math.floor(x * 0.5 + y * 0.3 + speed * 2) % ASCII_DENSITY.length];
  const brightness = Math.floor(((Math.sin(v * 2) + 1) / 2) * 180 + 50);
  const hex = brightness.toString(16).padStart(2, "0");
  return { char: digit, color: `#${hex}${hex}${hex}` };
}

function mountAsciiCanvas() {
  document.querySelectorAll("[data-ascii-canvas]").forEach((el) => {
    const rows = Number(el.getAttribute("data-rows") || "10");
    el.style.height = `calc(1.25rem * ${rows})`;

    if (reduceMotion) {
      // Static mid-gray field — no rAF
      const cols = Math.max(8, Math.floor(el.clientWidth / 8) || 40);
      let html = "";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          html += `<span style="color:#888">1</span>`;
        }
        if (y < rows - 1) html += "\n";
      }
      el.innerHTML = html;
      return;
    }

    let cancelled = false;
    let frame = 0;
    let cols = 40;
    let visible = false;
    /** @type {HTMLSpanElement[]} */
    let grid = [];
    let prevCols = 0;
    let prevChars = [];
    let prevColors = [];

    const measure = document.createElement("span");
    measure.style.visibility = "hidden";
    measure.style.position = "absolute";
    measure.style.whiteSpace = "pre";
    measure.textContent = "X";
    el.appendChild(measure);

    const buildGrid = (nextCols) => {
      if (nextCols === prevCols) return;
      prevCols = nextCols;
      while (el.firstChild && el.firstChild !== measure) {
        el.removeChild(el.firstChild);
      }
      const frag = document.createDocumentFragment();
      const spans = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < nextCols; x++) {
          const s = document.createElement("span");
          s.textContent = " ";
          spans.push(s);
          frag.appendChild(s);
        }
        if (y < rows - 1) frag.appendChild(document.createTextNode("\n"));
      }
      el.insertBefore(frag, measure);
      grid = spans;
      prevChars = new Array(nextCols * rows).fill("");
      prevColors = new Array(nextCols * rows).fill("");
    };

    const updateCols = () => {
      const charWidth = measure.getBoundingClientRect().width;
      if (charWidth > 0) {
        cols = Math.max(1, Math.floor(el.clientWidth / charWidth));
        buildGrid(cols);
      }
    };
    updateCols();

    const resizeObs = new ResizeObserver(updateCols);
    resizeObs.observe(el);

    const loop = () => {
      if (!visible || cancelled) return;
      const time = performance.now() * 0.0001;
      const total = cols * rows;
      for (let index = 0; index < total && index < grid.length; index++) {
        const column = index % cols;
        const row = (index - column) / cols;
        const cell = asciiAnimate(column, row, time);
        const span = grid[index];
        if (cell.char !== prevChars[index]) {
          span.textContent = cell.char;
          prevChars[index] = cell.char;
        }
        if (cell.color !== prevColors[index]) {
          span.style.color = cell.color;
          prevColors[index] = cell.color;
        }
      }
      frame = requestAnimationFrame(loop);
    };

    const interObs = new IntersectionObserver(
      ([entry]) => {
        const was = visible;
        visible = entry.isIntersecting;
        if (entry.isIntersecting && !was) {
          frame = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting) {
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0 }
    );
    interObs.observe(el);
    frame = requestAnimationFrame(loop);

    // Cleanup if navigated away is N/A for static lab page
    void cancelled;
    void resizeObs;
    void interObs;
  });
}

mountAsciiCanvas();
