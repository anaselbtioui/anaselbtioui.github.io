#!/usr/bin/env bash
# Bake leaves.mp4 into pre-keyed alpha WebM (shadow + optional light fringe).
# Matches canopy.js intent: dark luma → opaque shadow, bright → transparent.
# ffmpeg 8+ geq requires lowercase r(X,Y)/g(X,Y)/b(X,Y) (not R/G/B).
# Note: leaves-1.mp4 is too bright (luma ~190–242) for LO/HI=40/200; use leaves.mp4.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INPUT="${ROOT}/leaves.mp4"
OUT_SHADOW="${ROOT}/leaves-shadow.webm"
OUT_LIGHT="${ROOT}/leaves-shadow-light.webm"
LOG="${ROOT}/scripts/bake-leaves-shadow.log"

FPS=14
CRF=28
LO=40
HI=200
SPAN=$((HI - LO))

# Parenthesize luma so HI-luma / SPAN math is correct under +/– precedence.
LUMA='(0.2126*r(X,Y)+0.7152*g(X,Y)+0.0722*b(X,Y))'
ALPHA="if(lte(${LUMA},${LO}),255,if(lt(${LUMA},${HI}),255*(${HI}-${LUMA})/${SPAN},0))"
LIGHT_ALPHA="if(lte(${LUMA},${LO}),255*0.36,if(lt(${LUMA},${HI}),255*(${HI}-${LUMA})/${SPAN}*0.36,0))"

SCALE="scale='if(gt(iw\\,ih)\\,720\\,-2)':'if(gt(iw\\,ih)\\,-2\\,720)':flags=lanczos"

exec > >(tee "$LOG") 2>&1

echo "=== Tools ==="
command -v ffmpeg
command -v ffprobe
command -v node || true
ffmpeg -version | head -1
node --version 2>/dev/null || true

if [[ ! -f "$INPUT" ]]; then
  echo "Missing input: $INPUT" >&2
  exit 1
fi

echo ""
echo "=== Input: $INPUT ==="
ffprobe -v error -show_entries format=size,duration -show_entries stream=width,height,r_frame_rate,codec_name -of default=noprint_wrappers=1 "$INPUT"

VF_SHADOW="${SCALE},fps=${FPS},format=rgba,geq=r='0':g='0':b='0':a='${ALPHA}'"
VF_LIGHT="${SCALE},fps=${FPS},format=rgba,geq=r='186':g='202':b='218':a='${LIGHT_ALPHA}'"

encode_vp9() {
  local vf="$1"
  local out="$2"
  echo ""
  echo "=== ffmpeg VP9 → $out ==="
  echo "ffmpeg -y -i \"$INPUT\" -vf \"$vf\" -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf $CRF -an \"$out\""
  ffmpeg -y -i "$INPUT" \
    -vf "$vf" \
    -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf "$CRF" -an \
    -metadata:s:v:0 alpha_mode=1 \
    "$out"
}

encode_vp9_no_alt() {
  local vf="$1"
  local out="$2"
  echo ""
  echo "=== ffmpeg VP9 (no alt-ref) → $out ==="
  ffmpeg -y -i "$INPUT" \
    -vf "$vf" \
    -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf "$CRF" -an \
    -metadata:s:v:0 alpha_mode=1 \
    "$out"
}

encode_vp8() {
  local vf="$1"
  local out="$2"
  local webm="${out%.webm}-vp8.webm"
  echo ""
  echo "=== ffmpeg VP8 alpha fallback → $webm ==="
  ffmpeg -y -i "$INPUT" \
    -vf "$vf" \
    -c:v libvpx -pix_fmt yuva420p -b:v 0 -crf "$CRF" -an \
    -metadata:s:v:0 alpha_mode=1 \
    "$webm"
}

encode_webp() {
  local vf="$1"
  local out="$2"
  local webp="${out%.webm}.webp"
  echo ""
  echo "=== ffmpeg animated WebP fallback → $webp ==="
  ffmpeg -y -i "$INPUT" \
    -vf "$vf" \
    -loop 0 -c:v libwebp -lossless 0 -quality 80 -an \
    "$webp"
}

bake_one() {
  local label="$1"
  local vf="$2"
  local out="$3"

  if encode_vp9 "$vf" "$out"; then
    return 0
  fi
  echo "WARN: VP9 encode failed for $label (auto-alt-ref)" >&2
  rm -f "$out"

  if encode_vp9_no_alt "$vf" "$out"; then
    return 0
  fi
  echo "WARN: VP9 encode failed for $label (no alt-ref)" >&2
  rm -f "$out"

  if encode_vp8 "$vf" "$out"; then
    return 0
  fi
  echo "WARN: VP8 alpha encode failed for $label" >&2

  encode_webp "$vf" "$out"
}

bake_one "shadow" "$VF_SHADOW" "$OUT_SHADOW"
bake_one "light" "$VF_LIGHT" "$OUT_LIGHT"

echo ""
echo "=== Output ==="
for f in "$OUT_SHADOW" "$OUT_LIGHT" "${OUT_SHADOW%.webm}-vp8.webm" "${OUT_LIGHT%.webm}-vp8.webm" \
  "${OUT_SHADOW%.webm}.webp" "${OUT_LIGHT%.webm}.webp"; do
  if [[ -f "$f" ]]; then
    ls -lh "$f"
    ffprobe -v error -show_entries format=size,duration -show_entries stream=width,height,r_frame_rate,pix_fmt -of default=noprint_wrappers=1 "$f" || true
  fi
done

echo "Done. Log: $LOG"
