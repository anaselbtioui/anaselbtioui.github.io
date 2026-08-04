/**
 * Pretext lab — @chenglou/pretext via ESM CDN (#nobuild)
 * prepare once · layout / walkLineRanges / layoutNextLineRange on resize
 */
import {
  prepare,
  layout,
  prepareWithSegments,
  layoutWithLines,
  measureLineStats,
  layoutNextLineRange,
  materializeLineRange,
} from "https://cdn.jsdelivr.net/npm/@chenglou/pretext@0.0.8/+esm";

const BODY_FONT = '17px "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';
const MONO_FONT = '14px "IBM Plex Mono", ui-monospace, monospace';
const LINE_H = 26;
const MONO_LH = 22;

const SAMPLE =
  "Pretext measures multiline text without touching the DOM. " +
  "AGI 春天到了. بدأت الرحلة 🚀 " +
  "prepare() once — then layout() is pure arithmetic on cached widths. " +
  "No getBoundingClientRect thrash on every resize.";

const BUBBLES = [
  { side: "in", text: "Shrinkwrap this bubble to the widest line — not the full column." },
  { side: "out", text: "walkLineRanges / measureLineStats → maxLineWidth. Multiline shrink wrap the web never gave us." },
  { side: "in", text: "你好 · مرحبا · hello" },
];

const FLOW_TEXT =
  "Route text around an obstacle one row at a time. " +
  "layoutNextLineRange lets each line pick a different max width — " +
  "narrow beside the circle, full column below. Canvas paint from materializeLineRange. " +
  "Same prepareWithSegments handle the whole way.";

const statusEl = document.getElementById("px-status");
const widthRange = document.getElementById("px-width");
const widthVal = document.getElementById("px-width-val");
const heightVal = document.getElementById("px-height-val");
const linesVal = document.getElementById("px-lines-val");
const measureBox = document.getElementById("px-measure-box");
const measureText = document.getElementById("px-measure-text");
const widthMark = document.getElementById("px-width-mark");
const bubblesRoot = document.getElementById("px-bubbles");
const linesCanvas = document.getElementById("px-lines-canvas");
const flowCanvas = document.getElementById("px-flow-canvas");
const obstacle = document.getElementById("px-obstacle");
const flowStage = document.getElementById("px-flow");

function setStatus(ok, msg) {
  if (!statusEl) return;
  statusEl.dataset.ok = ok ? "1" : "0";
  statusEl.textContent = msg;
}

let prepared;
let preparedSeg;
let preparedBubbles = [];
let preparedFlow;

try {
  prepared = prepare(SAMPLE, BODY_FONT);
  preparedSeg = prepareWithSegments(SAMPLE, BODY_FONT);
  preparedBubbles = BUBBLES.map((b) => ({
    ...b,
    prepared: prepareWithSegments(b.text, MONO_FONT),
  }));
  preparedFlow = prepareWithSegments(FLOW_TEXT, BODY_FONT);
  setStatus(true, "pretext ready · prepare cached");
} catch (err) {
  setStatus(false, "pretext failed · " + (err && err.message ? err.message : String(err)));
  throw err;
}

if (measureText) measureText.textContent = SAMPLE;

function paintMeasure() {
  if (!prepared || !widthRange || !measureBox) return;
  const maxW = Number(widthRange.value);
  const { height, lineCount } = layout(prepared, maxW, LINE_H);
  measureBox.style.width = maxW + "px";
  measureBox.style.height = height + "px";
  if (widthVal) widthVal.textContent = String(maxW);
  if (heightVal) heightVal.textContent = height.toFixed(1);
  if (linesVal) linesVal.textContent = String(lineCount);
  if (widthMark) widthMark.style.left = 1.15 * 16 + maxW + "px";
}

function paintBubbles() {
  if (!bubblesRoot) return;
  bubblesRoot.innerHTML = "";
  const cap = Math.min(bubblesRoot.clientWidth || 360, 420);
  preparedBubbles.forEach((b) => {
    const stats = measureLineStats(b.prepared, cap);
    const el = document.createElement("div");
    el.className = "px-bubble";
    el.dataset.side = b.side;
    el.textContent = b.text;
    el.style.width = Math.ceil(stats.maxLineWidth + 2) + "px";
    bubblesRoot.appendChild(el);
  });
}

function paintLinesCanvas() {
  if (!linesCanvas || !preparedSeg) return;
  const cssW = linesCanvas.parentElement ? linesCanvas.parentElement.clientWidth - 24 : 480;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const maxW = Math.max(160, cssW - 8);
  const { lines, height } = layoutWithLines(preparedSeg, maxW, LINE_H);
  linesCanvas.width = Math.floor(cssW * dpr);
  linesCanvas.height = Math.floor((height + 16) * dpr);
  linesCanvas.style.width = cssW + "px";
  linesCanvas.style.height = height + 16 + "px";
  const ctx = linesCanvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, height + 16);
  ctx.font = BODY_FONT;
  ctx.fillStyle = "#e8eaed";
  ctx.textBaseline = "top";
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i].text, 4, 8 + i * LINE_H);
    ctx.strokeStyle = "rgba(107, 140, 174, 0.25)";
    ctx.beginPath();
    ctx.moveTo(4, 8 + i * LINE_H + LINE_H - 2);
    ctx.lineTo(4 + lines[i].width, 8 + i * LINE_H + LINE_H - 2);
    ctx.stroke();
  }
}

function paintFlow() {
  if (!flowCanvas || !preparedFlow || !flowStage || !obstacle) return;
  const pad = 18;
  const cssW = flowStage.clientWidth - pad * 2;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const obsSize = 120;
  const obsLeft = cssW - obsSize - 8;
  const obsTop = 8;
  const obsBottom = obsTop + obsSize;
  const gap = 12;

  obstacle.style.width = obsSize + "px";
  obstacle.style.height = obsSize + "px";
  obstacle.style.right = pad + 8 + "px";
  obstacle.style.top = pad + obsTop + "px";

  const rows = [];
  let cursor = { segmentIndex: 0, graphemeIndex: 0 };
  let y = 0;
  while (true) {
    const beside = y < obsBottom;
    const width = beside ? Math.max(80, obsLeft - gap) : cssW;
    const range = layoutNextLineRange(preparedFlow, cursor, width);
    if (range === null) break;
    const line = materializeLineRange(preparedFlow, range);
    rows.push({ text: line.text, width: line.width, y, x: 0 });
    cursor = range.end;
    y += LINE_H;
  }

  const totalH = Math.max(y + 8, obsBottom + 8);
  flowCanvas.width = Math.floor(cssW * dpr);
  flowCanvas.height = Math.floor(totalH * dpr);
  flowCanvas.style.width = cssW + "px";
  flowCanvas.style.height = totalH + "px";
  const ctx = flowCanvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, totalH);
  ctx.font = BODY_FONT;
  ctx.fillStyle = "#e8eaed";
  ctx.textBaseline = "top";
  rows.forEach((r) => ctx.fillText(r.text, r.x, r.y));
}

function paintAll() {
  paintMeasure();
  paintBubbles();
  paintLinesCanvas();
  paintFlow();
}

if (widthRange) {
  widthRange.addEventListener("input", paintMeasure);
}

let resizeTimer = 0;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(paintAll, 60);
});

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(paintAll);
} else {
  paintAll();
}
