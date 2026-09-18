#!/usr/bin/env node
/**
 * Capture a quiet ~2.5s loop of a local plate page to PNG frames.
 * Pair with scripts/frames-to-work-gif.py (Windows-friendly, no ffmpeg).
 *
 * Usage:
 *   node scripts/capture-plate.mjs <url> <slug> [selector] [duration_sec]
 */
import { mkdirSync, rmSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RAW_DIR = join(ROOT, "media/work/_raw");

const url = process.argv[2];
const slug = process.argv[3];
const selector = process.argv[4] || "#plate";
const durationSec = Math.min(3, Math.max(0.4, Number(process.argv[5] || 2.5)));

if (!url || !slug) {
  console.error("Need <url> and <slug>.");
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9_-]*$/.test(slug)) {
  console.error(`Bad slug: ${slug}`);
  process.exit(1);
}

const chromePath =
  process.env.PLAYWRIGHT_CHROMIUM ||
  (existsSync("C:/Program Files/Google/Chrome/Application/chrome.exe")
    ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
    : undefined);

const VW = 800;
const VH = 1000;
const FPS = 3;
const frameCount = Math.max(4, Math.round(durationSec * FPS));
const intervalMs = Math.round((durationSec * 1000) / frameCount);
const tmpDir = join(RAW_DIR, `.tmp-${slug}`);

rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });

console.log("=== capture-plate ===");
console.log(`url:      ${url}`);
console.log(`slug:     ${slug}`);
console.log(`selector: ${selector}`);
console.log(`frames:   ${frameCount} @ ${intervalMs}ms`);
console.log(`chrome:   ${chromePath || "playwright bundled"}`);
console.log(`out:      ${tmpDir}`);

const browser = await chromium.launch({
  headless: true,
  executablePath: chromePath,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const context = await browser.newContext({
  viewport: { width: VW, height: VH },
  deviceScaleFactor: 1,
  reducedMotion: "no-preference",
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForSelector(selector, { state: "visible", timeout: 30000 });
await page.waitForTimeout(400);

const target = page.locator(selector).first();
const box = await target.boundingBox();
if (!box) {
  console.error("Selector has no bounding box.");
  await context.close();
  await browser.close();
  process.exit(1);
}

const clip = {
  x: Math.max(0, Math.round(box.x)),
  y: Math.max(0, Math.round(box.y)),
  width: Math.round(box.width) - (Math.round(box.width) % 2),
  height: Math.round(box.height) - (Math.round(box.height) % 2),
};

console.log(`clip:     ${clip.width}x${clip.height} @ (${clip.x},${clip.y})`);

for (let i = 0; i < frameCount; i++) {
  const path = join(tmpDir, `frame-${String(i).padStart(3, "0")}.png`);
  await page.screenshot({ path, clip, type: "png" });
  if (i < frameCount - 1) await page.waitForTimeout(intervalMs);
}

await context.close();
await browser.close();
console.log("frames ready.");
console.log(tmpDir);
