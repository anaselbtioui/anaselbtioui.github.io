#!/usr/bin/env python3
"""Grade PNG frames into a quiet 4:5 archive GIF + WebP poster. No ffmpeg."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "media" / "work"
W, H = 400, 500
MAX_GIF_KB = 400


def crop_45(img: Image.Image) -> Image.Image:
    src = img.convert("RGB")
    sw, sh = src.size
    target = 4 / 5
    if sw / sh > target:
        nw = round(sh * target)
        left = (sw - nw) // 2
        src = src.crop((left, 0, left + nw, sh))
    else:
        nh = round(sw / target)
        top = (sh - nh) // 2
        src = src.crop((0, top, sw, top + nh))
    return src.resize((W, H), Image.LANCZOS)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("frames_dir")
    parser.add_argument("slug")
    args = parser.parse_args()

    slug = args.slug
    if not slug or slug[0] not in "abcdefghijklmnopqrstuvwxyz0123456789":
        print(f"Bad slug: {slug}", file=sys.stderr)
        return 1

    folder = Path(args.frames_dir)
    frames_in = sorted(folder.glob("frame-*.png"))
    if len(frames_in) < 2:
        print(f"Need at least 2 frames in {folder}", file=sys.stderr)
        return 1

    plates = [crop_45(Image.open(p)) for p in frames_in]
    duration = max(80, round(2500 / len(plates)))

    palette = plates[0].quantize(colors=48, method=Image.Quantize.MEDIANCUT)
    indexed = [f.quantize(palette=palette, dither=Image.Dither.NONE) for f in plates]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    gif_path = OUT_DIR / f"{slug}.gif"
    poster_path = OUT_DIR / f"{slug}-poster.webp"

    indexed[0].save(
        gif_path,
        save_all=True,
        append_images=indexed[1:],
        duration=duration,
        loop=0,
        optimize=True,
        disposal=2,
    )
    plates[len(plates) // 2].save(poster_path, quality=78, method=6)

    gif_kb = gif_path.stat().st_size // 1024
    poster_kb = poster_path.stat().st_size // 1024
    print(f"done. gif {gif_kb}KB · {len(plates)} frames · poster {poster_kb}KB")
    print(f"  {gif_path}")
    print(f"  {poster_path}")
    if gif_kb > MAX_GIF_KB:
        print(f"warn: GIF over {MAX_GIF_KB}KB target", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
