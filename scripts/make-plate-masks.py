#!/usr/bin/env python3
"""Generate alpha masks for work plate shapes.

deckle — handmade-paper edge, irregular on all four sides.
blob   — organic fig-ish silhouette, no straight edges at all.

White = keep, transparent = cut. Used via CSS mask-image on .work-plate.
"""

from __future__ import annotations

import hashlib
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

OUT_DIR = Path(__file__).resolve().parent.parent / "media" / "work"
W, H = 800, 1000
SS = 2


def deckle(w: int, h: int, seed: int = 7) -> Image.Image:
    """Rectangle whose edges wander like torn paper."""
    rng = random.Random(seed)
    inset = min(w, h) * 0.045
    jitter = min(w, h) * 0.022
    steps = 90

    def edge(ax, ay, bx, by):
        pts = []
        for i in range(steps + 1):
            t = i / steps
            x = ax + (bx - ax) * t
            y = ay + (by - ay) * t
            # Perpendicular wobble, damped at the corners so they stay sharp-ish.
            damp = math.sin(math.pi * t) ** 0.6
            n = (rng.uniform(-1, 1) + rng.uniform(-1, 1)) / 2
            nx, ny = -(by - ay), (bx - ax)
            length = math.hypot(nx, ny) or 1
            off = n * jitter * damp
            pts.append((x + nx / length * off, y + ny / length * off))
        return pts

    l, t, r, b = inset, inset, w - inset, h - inset
    outline = [
        *edge(l, t, r, t),
        *edge(r, t, r, b),
        *edge(r, b, l, b),
        *edge(l, b, l, t),
    ]

    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).polygon(outline, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(min(w, h) * 0.0015))


def blob(w: int, h: int, seed: int = 11) -> Image.Image:
    """Organic silhouette — harmonics on the radius, slight fig taper."""
    rng = random.Random(seed)
    harmonics = [
        (k, rng.uniform(0, math.tau), amp)
        for k, amp in ((2, 0.055), (3, 0.038), (5, 0.022))
    ]

    cx, cy = w / 2, h * 0.52
    r = min(w, h) * 0.48
    pts = []
    for i in range(512):
        a = i / 512 * math.tau
        rr = r * (1 + sum(amp * math.sin(k * a + p) for k, p, amp in harmonics))
        rr *= 1 - 0.14 * max(0.0, -math.sin(a)) ** 1.5
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a) * (h / w) * 0.94))

    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).polygon(pts, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(min(w, h) * 0.002))


def wander(seed: int, amp: float, harmonics=((1, 1.0), (2, 0.5), (3, 0.28), (7, 0.1))):
    """Smooth 0..1 -> offset curve. Low harmonics read organic, high ones torn."""
    rng = random.Random(seed)
    parts = [(k, w, rng.uniform(0, math.tau)) for k, w in harmonics]
    norm = sum(w for _, w in harmonics)

    def f(t: float) -> float:
        v = sum(w * math.sin(k * math.pi * t + p) for k, w, p in parts) / norm
        # Ease the ends so corners of neighbouring plates still line up, but
        # keep most of the swing so the wander stays readable.
        return v * amp * math.sin(math.pi * min(max(t, 0.0), 1.0)) ** 0.22

    return f


def seam_masks(count: int, w: int, h: int, seed: int = 3) -> list[Image.Image]:
    """Plates slit from one sheet: plate i's right edge IS plate i+1's left edge."""
    # Insets leave room for an edge to bulge outward; amp stays under the inset
    # so a swing never gets clipped flat against the canvas.
    side_inset = w * 0.115
    cap_inset = h * 0.05
    side_amp = w * 0.1
    steps = 220

    seams = [wander(seed * 100 + i, side_amp) for i in range(count + 1)]
    # Shared caps so the whole row reads as one torn strip.
    top = wander(seed + 41, h * 0.022, ((1, 1.0), (3, 0.4), (9, 0.18)))
    bottom = wander(seed + 87, h * 0.008, ((2, 1.0), (11, 0.3)))
    tear = wander(seed + 5, w * 0.006, ((23, 1.0), (37, 0.6), (53, 0.4)))

    out = []
    for i in range(count):
        left, right = seams[i], seams[i + 1]
        pts = []
        for j in range(steps + 1):
            t = j / steps
            pts.append((side_inset + left(t) + tear(t), cap_inset + (h - 2 * cap_inset) * t))
        for j in range(steps + 1):
            t = j / steps
            x = side_inset + (w - 2 * side_inset) * t
            pts.append((x, h - cap_inset + bottom(t)))
        for j in range(steps + 1):
            t = 1 - j / steps
            pts.append((w - side_inset + right(t) + tear(t), cap_inset + (h - 2 * cap_inset) * t))
        for j in range(steps + 1):
            t = 1 - j / steps
            x = side_inset + (w - 2 * side_inset) * t
            pts.append((x, cap_inset + top(t)))

        mask = Image.new("L", (w, h), 0)
        ImageDraw.Draw(mask).polygon(pts, fill=255)
        out.append(mask.filter(ImageFilter.GaussianBlur(min(w, h) * 0.0018)))
    return out


GOLDEN_ANGLE = math.pi * (3 - math.sqrt(5))  # ~137.5°, the phyllotaxis divergence


def name_seed(name: str) -> int:
    return int.from_bytes(hashlib.blake2b(name.encode(), digest_size=6).digest(), "big")


def crown(index: int, seed: int):
    """Top-edge profile for one plate. Returns f(t)->0..1, 0 at both corners.

    Phyllotaxis: each card's dome peak sits at a golden-angle step, so no two
    consecutive plates lean the same way (leaves never stack). Harmonics keyed
    off the project name add a low ripple — shared fundamental keeps the arch
    family, per-name phase gives identity.
    """
    rng = random.Random(seed)
    # Peak position walks by the golden angle, kept in the middle band so the
    # dome always reads as an arch, never a corner ramp.
    lean = 0.5 + 0.15 * math.sin(index * GOLDEN_ANGLE + seed % 7)
    lean = min(0.65, max(0.35, lean))
    # Superellipse exponent sets fullness: 2 is a true semicircle, higher flattens
    # the shoulder and starts reading as a sliced-off top. Stay near the circle.
    n = 1.9 + 0.7 * ((seed >> 3) % 100) / 100
    ripple = [
        (2, 0.028, rng.uniform(0, math.tau)),
        (3, 0.018, rng.uniform(0, math.tau)),
        (5, 0.01, rng.uniform(0, math.tau)),
    ]

    def f(t: float) -> float:
        # Center the superellipse on `lean`; each flank scaled so |x|=1 at the
        # corners (dome->0) and x=0 at the peak (dome->1, slope 0, rounded).
        x = (t - lean) / lean if t < lean else (t - lean) / (1 - lean)
        dome = max(0.0, 1 - abs(x) ** n) ** (1 / n)
        window = math.sin(math.pi * t) ** 0.5
        r = sum(a * math.sin(k * math.pi * t + p) for k, a, p in ripple)
        return max(0.0, min(1.0, dome + r * window))

    return f


def grove_masks(names, w: int, h: int) -> list[Image.Image]:
    """Arch plates: straight sides, flat bottom, phyllotaxis-domed top.

    Container is preserved (baseline stays flat for the overlaid title); only
    the crown varies per project, so cards stay a family while each is distinct.
    """
    side_inset = w * 0.02
    base_cap = h * 0.014  # apex sits just inside the top edge
    # A semicircular arch across this width needs depth = width / 2; go slightly
    # past it so the dome reads full instead of sliced.
    crown_depth = (w - 2 * side_inset) / 2 * 1.06
    foot = h * 0.985
    steps = 260

    out = []
    for index, name in enumerate(names):
        prof = crown(index, name_seed(name))
        pts = [(side_inset, foot)]  # bottom-left
        # left side up to where the crown starts
        for j in range(steps + 1):
            t = j / steps
            x = side_inset + (w - 2 * side_inset) * t
            y = base_cap + crown_depth * (1 - prof(t))
            pts.append((x, y))
        pts.append((w - side_inset, foot))  # bottom-right, then flat back to start

        mask = Image.new("L", (w, h), 0)
        ImageDraw.Draw(mask).polygon(pts, fill=255)
        out.append(mask.filter(ImageFilter.GaussianBlur(min(w, h) * 0.0012)))
    return out


def save(name: str, mask: Image.Image) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = Image.new("L", (W, H))
    out.paste(mask.resize((W, H), Image.LANCZOS))
    rgba = Image.merge("RGBA", (Image.new("L", (W, H), 255),) * 3 + (out,))
    path = OUT_DIR / f"mask-{name}.png"
    rgba.save(path, optimize=True)
    print(f"{path.name}: {path.stat().st_size // 1024}KB")


# Project names in Selected work order — crown derives from these.
PROJECTS = (
    "[Project name]",
    "[Project name 2]",
    "[Project name 3]",
)


if __name__ == "__main__":
    save("deckle", deckle(W * SS, H * SS))
    save("blob", blob(W * SS, H * SS))
    for i, m in enumerate(seam_masks(3, W * SS, H * SS), start=1):
        save(f"seam-{i:02d}", m)
    for i, m in enumerate(grove_masks(PROJECTS, W * SS, H * SS), start=1):
        save(f"grove-{i:02d}", m)
