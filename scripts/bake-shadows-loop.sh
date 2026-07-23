#!/usr/bin/env bash
# Bake Lefos-like dappled multiply plate from leaves.mp4.
# Mostly white + soft dark shade (multiply must not grey the whole page).
# Mild blur keeps leaf structure — heavy blur = fog.
# ffmpeg 8+ geq: lowercase r/g/b.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INPUT="${ROOT}/leaves.mp4"
OUT_WEBM="${ROOT}/shadows-loop.webm"
OUT_MP4="${ROOT}/shadows-loop.mp4"
LOG="${ROOT}/scripts/bake-shadows-loop.log"

FPS=14
CRF=26
BLUR=4
# Only deep shade stays dark; mid+ → white so multiply stays clean
LO=45
HI=130
SPAN=$((HI - LO))
SHADE_MIN=36
SHADE_MAX=255

LUMA='(0.2126*r(X,Y)+0.7152*g(X,Y)+0.0722*b(X,Y))'
SHADE="if(lte(${LUMA},${LO}),${SHADE_MIN},if(gte(${LUMA},${HI}),${SHADE_MAX},${SHADE_MIN}+(${SHADE_MAX}-${SHADE_MIN})*(${LUMA}-${LO})/${SPAN}))"

SCALE="scale='if(gt(iw\\,ih)\\,960\\,-2)':'if(gt(iw\\,ih)\\,-2\\,960)':flags=lanczos"
# Remap → mild blur → lift midtones toward white (multiply-safe plate)
VF="${SCALE},fps=${FPS},format=rgba,geq=r='${SHADE}':g='${SHADE}':b='${SHADE}':a='255',gblur=sigma=${BLUR}:steps=1,curves=all='0/0 0.35/0.72 0.55/0.92 1/1'"

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
# Spot-check: mean luma should be high (white-biased plate)
ffmpeg -y -i "$OUT_MP4" -vf "signalstats,metadata=print:key=lavfi.signalstats.YAVG" -frames:v 1 -f null - 2>&1 | rg -i "YAVG|error" || true
echo "Done."
