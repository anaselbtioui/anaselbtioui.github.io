#!/usr/bin/env bash
# Thin wrapper: Playwright capture → make-work-gif.sh
# Usage: ./scripts/capture-work-loop.sh [--true] <url> <slug> [selector] [duration_sec]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v ffmpeg >/dev/null; then
  echo "ffmpeg not found" >&2
  exit 1
fi

# Prefer a local playwright install under scripts/.capture-venv if present,
# else npx playwright package for the chromium driver + node API.
NODE_SCRIPT="$ROOT/scripts/capture-work-loop.mjs"

if [[ ! -f "$ROOT/node_modules/playwright/package.json" ]]; then
  echo "Installing playwright (one-shot, local node_modules)…"
  npm install --no-save --no-package-lock playwright@1.49.1
fi

# Prefer system Chromium (Omarchy/Arch). Override with PLAYWRIGHT_CHROMIUM.
export PLAYWRIGHT_CHROMIUM="${PLAYWRIGHT_CHROMIUM:-/usr/bin/chromium}"

exec node "$NODE_SCRIPT" "$@"
