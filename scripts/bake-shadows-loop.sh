#!/usr/bin/env bash
# Bake Lefos-like dappled multiply plate from wall-shadow footage.
# Empty field → pure white (multiply pass-through). Soft shade only.
# Source: leaves-1.mp4 — soft shadows on bright wall (narrow luma ~180–227).
# Uses colorlevels stretch (not geq) — geq+curves crushed this source to blank.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INPUT="${ROOT}/leaves-1.mp4"
OUT_WEBM="${ROOT}/shadows-loop.webm"
OUT_MP4="${ROOT}/shadows-loop.mp4"
LOG="${ROOT}/scripts/bake-shadows-loop.log"
PREVIEW="${ROOT}/scripts/shadows-loop-preview.png"

FPS=14
CRF=26
BLUR=2
# Map shade floor (~0.68*255≈173) → blackish; wall (~0.90*255≈230) → white
RIMIN=0.68
RIMAX=0.90

SCALE="scale='if(gt(iw\\,ih)\\,960\\,-2)':'if(gt(iw\\,ih)\\,-2\\,960)':flags=lanczos"
# Stretch narrow wall-shadow band → soft blur → lift pure black so multiply not harsh
VF="${SCALE},fps=${FPS},colorlevels=rimin=${RIMIN}:gimin=${RIMIN}:bimin=${RIMIN}:rimax=${RIMAX}:gimax=${RIMAX}:bimax=${RIMAX},gblur=sigma=${BLUR}:steps=1,curves=all='0/0.16 0.45/0.55 0.8/0.94 1/1'"

exec > >(tee "$LOG") 2>&1

echo "=== Tools ==="
command -v ffmpeg
ffmpeg -version | head -1

if [[ ! -f "$INPUT" ]]; then
  echo "Missing input: $INPUT" >&2
  exit 1
fi

echo ""
echo "=== Input ==="
ffprobe -v error -show_entries format=duration -show_entries stream=width,height -of default=noprint_wrappers=1 "$INPUT"
echo "VF=$VF"

ffmpeg -y -i "$INPUT" -vf "$VF" -c:v libvpx-vp9 -b:v 0 -crf "$CRF" -an "$OUT_WEBM"
ffmpeg -y -i "$INPUT" -vf "$VF" -c:v libx264 -pix_fmt yuv420p -crf "$CRF" -movflags +faststart -an "$OUT_MP4"

ls -lh "$OUT_WEBM" "$OUT_MP4"

echo "=== luma check (want YMIN<<YAVG<<YMAX, not flat) ==="
ffmpeg -y -ss 1 -i "$OUT_MP4" -vf "signalstats,metadata=print:file=${ROOT}/scripts/bake-y.txt" -frames:v 1 -f null -
rg -i "YAVG|YMIN|YMAX" "${ROOT}/scripts/bake-y.txt" || true

ffmpeg -y -ss 1 -i "$OUT_MP4" -frames:v 1 "$PREVIEW"
echo "Preview: $PREVIEW"

SIZE=$(wc -c < "$OUT_MP4")
if (( SIZE < 50000 )); then
  echo "ERROR: output too small (${SIZE}B) — likely blank plate" >&2
  exit 1
fi

# Flat white = all Y equal
YMIN=$(rg -o "YMIN=([0-9.]+)" -r '$1' "${ROOT}/scripts/bake-y.txt" | head -1)
YMAX=$(rg -o "YMAX=([0-9.]+)" -r '$1' "${ROOT}/scripts/bake-y.txt" | head -1)
if [[ -n "$YMIN" && -n "$YMAX" ]]; then
  # bash float compare via awk
  if awk -v a="$YMIN" -v b="$YMAX" 'BEGIN{exit !((b-a)<5)}'; then
    echo "ERROR: plate flat (YMIN=$YMIN YMAX=$YMAX) — no shade structure" >&2
    exit 1
  fi
fi

echo "Done."
