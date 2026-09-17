#!/usr/bin/env bash
# Grade a short screen recording into a quiet 4:5 archive GIF + WebP poster.
# Matches docs/imagery-brief.md (I.archive-gif / M.thumb-loop): desat teal field,
# ~6–8 frames, ≤3s, ≤400KB target. You supply the .mp4; this does not invent footage.
#
# Usage:
#   ./scripts/make-work-gif.sh <input.mp4> <slug> [start_sec] [duration_sec]
#   ./scripts/make-work-gif.sh --true <input.mp4> <slug> [start_sec] [duration_sec]
#
# --true keeps source colors (no desat grade). Use for brand marks / logos.
#
# Examples:
#   ./scripts/make-work-gif.sh ~/rec/hamssah.mp4 hamssah
#   ./scripts/make-work-gif.sh --true media/work/_raw/phikra.mp4 phikra
#
# Writes:
#   media/work/<slug>.gif
#   media/work/<slug>-poster.webp
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${ROOT}/media/work"

TRUE_COLOR=0
if [[ "${1:-}" == "--true" ]]; then
  TRUE_COLOR=1
  shift
fi

INPUT="${1:-}"
SLUG="${2:-}"
START="${3:-0}"
DUR="${4:-2.5}"

WIDTH=400
HEIGHT=500
FPS=3
# Soft desat toward the standby teal field (#10191c / plate #16262a)
GRADE="eq=saturation=0.55:contrast=1.05:brightness=-0.04,colorbalance=rs=-0.04:gs=0.02:bs=0.06:rm=-0.03:gm=0.01:bm=0.05"

usage() {
  sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
  exit "${1:-0}"
}

[[ "${1:-}" == "-h" || "${1:-}" == "--help" ]] && usage 0

if [[ -z "$INPUT" || -z "$SLUG" ]]; then
  echo "Need <input.mp4> and <slug>." >&2
  usage 1
fi

if [[ ! -f "$INPUT" ]]; then
  echo "Missing input: $INPUT" >&2
  exit 1
fi

if ! [[ "$SLUG" =~ ^[a-z0-9][a-z0-9_-]*$ ]]; then
  echo "Slug must be lowercase alphanumeric (hyphen/underscore ok): got '$SLUG'" >&2
  exit 1
fi

command -v ffmpeg >/dev/null || {
  echo "ffmpeg not found" >&2
  exit 1
}

# Clamp duration to archive budget (≤3s)
DUR_CLAMP="$(awk -v d="$DUR" 'BEGIN { if (d > 3) d = 3; if (d < 0.4) d = 0.4; printf "%.2f", d }')"

OUT_GIF="${OUT_DIR}/${SLUG}.gif"
OUT_POSTER="${OUT_DIR}/${SLUG}-poster.webp"
PALETTE="$(mktemp "${TMPDIR:-/tmp}/work-gif-palette-XXXXXX.png")"
trap 'rm -f "$PALETTE"' EXIT

mkdir -p "$OUT_DIR"

# Crop to 4:5 center, scale to plate size, optional grade, then fps for ~6–8 frames.
if ((TRUE_COLOR)); then
  VF_BASE="fps=${FPS},crop=min(iw\\,ih*4/5):min(ih\\,iw*5/4),scale=${WIDTH}:${HEIGHT}:flags=lanczos"
  VF_POSTER="crop=min(iw\\,ih*4/5):min(ih\\,iw*5/4),scale=${WIDTH}:${HEIGHT}:flags=lanczos"
else
  VF_BASE="fps=${FPS},crop=min(iw\\,ih*4/5):min(ih\\,iw*5/4),scale=${WIDTH}:${HEIGHT}:flags=lanczos,${GRADE}"
  VF_POSTER="crop=min(iw\\,ih*4/5):min(ih\\,iw*5/4),scale=${WIDTH}:${HEIGHT}:flags=lanczos,${GRADE}"
fi

echo "=== make-work-gif ==="
echo "input:  $INPUT"
echo "slug:   $SLUG"
if ((TRUE_COLOR)); then
  echo "color:  true"
else
  echo "color:  desat"
fi
echo "window: start=${START}s duration=${DUR_CLAMP}s @ ${FPS}fps → ${WIDTH}x${HEIGHT}"
echo "out:    $OUT_GIF"
echo "poster: $OUT_POSTER"
echo

PAL_COLORS=64
if ((TRUE_COLOR)); then
  PAL_COLORS=128
fi

ffmpeg -y -hide_banner -loglevel error \
  -ss "$START" -t "$DUR_CLAMP" -i "$INPUT" \
  -vf "${VF_BASE},palettegen=max_colors=${PAL_COLORS}:stats_mode=diff" \
  "$PALETTE"

ffmpeg -y -hide_banner -loglevel error \
  -ss "$START" -t "$DUR_CLAMP" -i "$INPUT" -i "$PALETTE" \
  -lavfi "${VF_BASE}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle" \
  -loop 0 \
  "$OUT_GIF"

# Mid-trim still as reduced-motion poster
POSTER_AT="$(awk -v s="$START" -v d="$DUR_CLAMP" 'BEGIN { printf "%.2f", s + d / 2 }')"
ffmpeg -y -hide_banner -loglevel error \
  -ss "$POSTER_AT" -i "$INPUT" \
  -frames:v 1 \
  -vf "$VF_POSTER" \
  "$OUT_POSTER"

GIF_BYTES="$(wc -c <"$OUT_GIF" | tr -d ' ')"
POSTER_BYTES="$(wc -c <"$OUT_POSTER" | tr -d ' ')"
FRAMES="$(ffprobe -v error -count_frames -select_streams v:0 \
  -show_entries stream=nb_read_frames -of csv=p=0 "$OUT_GIF" 2>/dev/null || echo "?")"

echo "done."
echo "  gif:    ${GIF_BYTES} bytes (~$((GIF_BYTES / 1024))KB) · frames≈${FRAMES}"
echo "  poster: ${POSTER_BYTES} bytes"

if ((GIF_BYTES > 400 * 1024)); then
  echo "warn: GIF over 400KB target — trim shorter, lower FPS, or pick a quieter stretch." >&2
fi
