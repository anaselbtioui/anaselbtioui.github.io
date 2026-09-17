#!/usr/bin/env node
/**
 * Record a quiet ~2.5s clip of a local page (logo / mark), then grade via make-work-gif.sh.
 * Uses screenshot frames + system ffmpeg (no Playwright video / bundled ffmpeg).
 *
 * Usage:
 *   node scripts/capture-work-loop.mjs [--true] <url> <slug> [selector] [duration_sec]
 *
 * --true keeps brand colors (passes --true to make-work-gif.sh).
 *
 * Examples:
 *   node scripts/capture-work-loop.mjs http://127.0.0.1:5173/ phikra-landing 'img.brand-logo__img'
 *   node scripts/capture-work-loop.mjs --true http://127.0.0.1:8788/tools/phikra-mark.html phikra '#plate'
 *
 * Writes media/work/_raw/<slug>.mp4 then media/work/<slug>.gif + poster.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RAW_DIR = join(ROOT, "media/work/_raw");
const GRADE = join(ROOT, "scripts/make-work-gif.sh");

const args = process.argv.slice(2);
const trueColor = args[0] === "--true";
if (trueColor) args.shift();

const url = args[0];
const slug = args[1];
const selector = args[2] || "img[src*='logo'], #mark, .mark, #plate";
const durationSec = Math.min(3, Math.max(0.4, Number(args[3] || 2.5)));

if (!url || !slug) {
  console.error("Need <url> and <slug>.");
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9_-]*$/.test(slug)) {
  console.error(`Bad slug: ${slug}`);
  process.exit(1);
}

mkdirSync(RAW_DIR, { recursive: true });

const VW = 800;
const VH = 1000;
const PAD = 48;
const FPS = 8; // capture fps; make-work-gif later drops to ~3

const tmpDir = join(RAW_DIR, `.tmp-${slug}-${Date.now()}`);
mkdirSync(tmpDir, { recursive: true });

const outMp4 = join(RAW_DIR, `${slug}.mp4`);

console.log("=== capture-work-loop ===");
console.log(`url:      ${url}`);
console.log(`slug:     ${slug}`);
console.log(`selector: ${selector}`);
console.log(`duration: ${durationSec}s`);
console.log(`color:    ${trueColor ? "true" : "desat"}`);
console.log(`raw:      ${outMp4}`);

const chromePath =
  process.env.PLAYWRIGHT_CHROMIUM ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);

const browser = await chromium.launch({
  headless: true,
  executablePath: chromePath,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const context = await browser.newContext({
  viewport: { width: VW, height: VH },
  deviceScaleFactor: 1,
});

const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForSelector(selector, { state: "visible", timeout: 30000 });

const target = page.locator(selector).first();
await target.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

const box = await target.boundingBox();
if (!box) {
  console.error("Selector has no bounding box.");
  await context.close();
  await browser.close();
  rmSync(tmpDir, { recursive: true, force: true });
  process.exit(1);
}

const wantW = Math.min(
  VW,
  Math.max(Math.ceil(box.width + PAD * 2), Math.round((box.height + PAD * 2) * 0.8)),
);
const wantH = Math.min(
  VH,
  Math.max(Math.ceil(box.height + PAD * 2), Math.round(wantW * 1.25)),
);
const evenW = wantW - (wantW % 2);
const evenH = wantH - (wantH % 2);
const cx = box.x + box.width / 2;
const cy = box.y + box.height / 2;
const clip = {
  x: Math.max(0, Math.min(VW - evenW, Math.round(cx - evenW / 2))),
  y: Math.max(0, Math.min(VH - evenH, Math.round(cy - evenH / 2))),
  width: evenW,
  height: evenH,
};

console.log(`crop:     ${clip.width}x${clip.height} @ (${clip.x},${clip.y})`);

const frameCount = Math.max(4, Math.round(durationSec * FPS));
const intervalMs = Math.round((durationSec * 1000) / frameCount);

for (let i = 0; i < frameCount; i++) {
  const path = join(tmpDir, `frame-${String(i).padStart(3, "0")}.png`);
  await page.screenshot({ path, clip, type: "png" });
  if (i < frameCount - 1) await page.waitForTimeout(intervalMs);
}

await context.close();
await browser.close();

const listFile = join(tmpDir, "frames.txt");
const listBody = Array.from({ length: frameCount }, (_, i) => {
  const p = join(tmpDir, `frame-${String(i).padStart(3, "0")}.png`);
  return `file '${p}'\nduration ${intervalMs / 1000}`;
}).join("\n");
// Last frame needs a trailing file entry for concat demuxer
writeFileSync(
  listFile,
  `${listBody}\nfile '${join(tmpDir, `frame-${String(frameCount - 1).padStart(3, "0")}.png`)}'\n`,
);

const ff = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    listFile,
    "-pix_fmt",
    "yuv420p",
    "-an",
    outMp4,
  ],
  { stdio: "inherit" },
);

if (ff.status !== 0) {
  console.error("ffmpeg assemble failed");
  process.exit(ff.status || 1);
}

rmSync(tmpDir, { recursive: true, force: true });

const gradeArgs = trueColor
  ? ["--true", outMp4, slug, "0", String(durationSec)]
  : [outMp4, slug, "0", String(durationSec)];
const grade = spawnSync("bash", [GRADE, ...gradeArgs], {
  stdio: "inherit",
  cwd: ROOT,
});
process.exit(grade.status || 0);
