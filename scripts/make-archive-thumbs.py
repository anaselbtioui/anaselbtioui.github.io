#!/usr/bin/env python3
"""Generate placeholder archive thumbs (I.archive-gif / M.thumb-loop).

Proof-sheet crops on the deep-teal field, organic subjects drawn from the
identity notes: cut fig, iris bloom, late-autumn strata, unopened fig. One
accent per plate (fig crimson, iris blue-violet, autumn ochre) so nothing
turns rainbow. Motion stays almost still: light drift, faint scan band,
static grain.

Outputs one GIF loop plus one WebP poster per slug into media/work/.
Usage: make-archive-thumbs.py [<slug> <variant>]
Replace with authored captures before shipping real case studies.
"""

from __future__ import annotations

import hashlib
import math
import random
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

OUT_DIR = Path(__file__).resolve().parent.parent / "media" / "work"
W, H = 400, 500  # portrait 4:5 — matches the arched plate frame
SS = 3  # supersample factor, downscaled for clean organic edges
FRAMES = 8
DURATION_MS = 340  # 8 frames ≈ 2.7s loop

Color = tuple[int, int, int]

# Field: standby palette. Accents: one per plate, desaturated and earthy.
FIELD: Color = (38, 66, 70)
INK: Color = (14, 26, 30)
LIGHT: Color = (186, 218, 214)
FIG_SKIN: Color = (82, 62, 96)
FIG_FLESH: Color = (158, 52, 66)
FIG_CORE: Color = (212, 142, 134)
IRIS: Color = (96, 100, 180)
IRIS_TIP: Color = (170, 178, 232)
OCHRE: Color = (188, 120, 56)


def lerp(a: Color, b: Color, t: float) -> Color:
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def blob(
    cx: float,
    cy: float,
    r: float,
    seed: int,
    wobble: float = 0.12,
    squash: float = 1.0,
    taper: float = 0.0,
    rotate: float = 0.0,
    steps: int = 256,
) -> list[tuple[float, float]]:
    """Closed organic outline. `taper` narrows the top into a fig teardrop."""
    rng = random.Random(seed)
    harmonics = [
        (k, rng.uniform(0, math.tau), wobble * rng.uniform(0.35, 1.0) / (i + 1))
        for i, k in enumerate((2, 3, 5))
    ]

    points = []
    for s in range(steps):
        t = s / steps * math.tau
        rr = r * (1 + sum(a * math.sin(k * t + p) for k, p, a in harmonics))
        if taper:
            rr *= 1 - taper * max(0.0, -math.sin(t)) ** 1.5
        x = rr * math.cos(t)
        y = rr * math.sin(t) * squash
        points.append(
            (
                cx + x * math.cos(rotate) - y * math.sin(rotate),
                cy + x * math.sin(rotate) + y * math.cos(rotate),
            )
        )
    return points


def field_wash(img: Image.Image, seed: int) -> None:
    """Cool ground plus one soft horizon so the subject sits in air, not a void."""
    w, h = img.size
    rng = random.Random(seed)
    draw = ImageDraw.Draw(img)
    horizon = round(h * rng.uniform(0.66, 0.76))
    draw.rectangle([0, horizon, w, h], fill=lerp(FIELD, INK, 0.42))
    draw.line([0, horizon, w, horizon], fill=lerp(FIELD, LIGHT, 0.18), width=SS)


def light_ramp(size: tuple[int, int]) -> Image.Image:
    """Soft diagonal light: brighter upper-left, falling to lower-right."""
    ramp = Image.new("L", (2, 2))
    ramp.putdata([255, 226, 214, 168])
    return Image.merge("RGB", (ramp,) * 3).resize(size, Image.BICUBIC)


def compose(painter, w: int, h: int, seed: int) -> Image.Image:
    """Field, cast shadow, shaded subject, rim light — depth without gloss."""
    base = Image.new("RGB", (w, h), FIELD)
    field_wash(base, seed)

    subject = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    painter(ImageDraw.Draw(subject), w, h, seed)
    mask = subject.getchannel("A")

    cast = mask.filter(ImageFilter.GaussianBlur(w * 0.035))
    cast = ImageChops.offset(cast, round(w * 0.022), round(h * 0.03))
    base = Image.composite(Image.blend(base, Image.new("RGB", (w, h), INK), 0.5), base, cast)

    body = subject.convert("RGB")
    body = Image.blend(body, ImageChops.multiply(body, light_ramp((w, h))), 0.9)

    rim = ImageChops.subtract(mask, ImageChops.offset(mask, round(w * 0.012), round(h * 0.016)))
    rim = rim.filter(ImageFilter.GaussianBlur(w * 0.004))
    body = Image.composite(Image.blend(body, Image.new("RGB", (w, h), LIGHT), 0.22), body, rim)

    return Image.composite(body, base, mask)


def fig_open(draw: ImageDraw.ImageDraw, w: int, h: int, seed: int) -> None:
    """Cut fig: rough skin outside, crimson flesh and seed speckle inside."""
    cx, cy, r = w * 0.42, h * 0.56, min(w, h) * 0.27
    draw.polygon(blob(cx, cy, r, seed + 2, 0.045, 1.3, 0.62), fill=(*FIG_SKIN, 255))
    draw.polygon(blob(cx, cy + r * 0.12, r * 0.76, seed + 3, 0.055, 1.2, 0.54), fill=(*FIG_FLESH, 255))
    draw.polygon(
        blob(cx, cy + r * 0.18, r * 0.42, seed + 4, 0.08, 1.08, 0.34),
        fill=(*lerp(FIG_FLESH, FIG_CORE, 0.6), 255),
    )

    rng = random.Random(seed + 5)
    for _ in range(120):
        t = rng.uniform(0, math.tau)
        rad = r * 0.66 * math.sqrt(rng.random())
        sx = cx + rad * math.cos(t)
        sy = cy + r * 0.16 + rad * math.sin(t) * 1.05
        d = SS * rng.uniform(0.5, 1.2)
        draw.ellipse(
            [sx - d, sy - d, sx + d, sy + d],
            fill=(*lerp(FIG_CORE, FIG_FLESH, rng.uniform(0, 0.4)), 255),
        )

    draw.line(
        [cx - r * 0.03, cy - r * 1.06, cx + r * 0.04, cy - r * 0.5],
        fill=(*lerp(INK, FIG_SKIN, 0.75), 255),
        width=round(SS * 2.2),
    )


def iris_bloom(draw: ImageDraw.ImageDraw, w: int, h: int, seed: int) -> None:
    """Blue iris: standards up, falls out, one ochre signal at the throat."""
    cx, cy, r = w * 0.46, h * 0.5, min(w, h) * 0.26
    petal_base = lerp(IRIS, FIELD, 0.22)

    for i in range(3):  # falls
        rotate = math.pi / 2 + i * math.tau / 3
        px = cx + math.cos(rotate) * r * 0.5
        py = cy + math.sin(rotate) * r * 0.5
        draw.polygon(
            blob(px, py, r * 0.56, seed + i * 7, 0.1, 1.5, 0.0, rotate + math.pi / 2),
            fill=(*lerp(petal_base, INK, 0.22), 255),
        )

    for i in range(3):  # standards
        rotate = -math.pi / 2 + i * math.tau / 3
        px = cx + math.cos(rotate) * r * 0.34
        py = cy + math.sin(rotate) * r * 0.34
        draw.polygon(
            blob(px, py, r * 0.42, seed + 40 + i * 5, 0.12, 1.32, 0.0, rotate + math.pi / 2),
            fill=(*lerp(petal_base, IRIS_TIP, 0.3), 255),
        )

    throat = r * 0.2
    draw.ellipse(
        [cx - throat, cy - throat * 1.15, cx + throat, cy + throat * 1.15],
        fill=(*OCHRE, 255),
    )
    draw.ellipse(
        [cx - throat * 0.4, cy - throat * 0.5, cx + throat * 0.4, cy + throat * 0.55],
        fill=(*lerp(OCHRE, INK, 0.45), 255),
    )
    draw.line(
        [cx + r * 0.04, cy + r * 1.1, cx - r * 0.02, h],
        fill=(*lerp(INK, IRIS, 0.35), 255),
        width=round(SS * 2.4),
    )


def fig_whole(draw: ImageDraw.ImageDraw, w: int, h: int, seed: int) -> None:
    """Unopened fig: muted skin, nothing revealed yet."""
    cx, cy, r = w * 0.44, h * 0.56, min(w, h) * 0.24
    draw.polygon(blob(cx, cy, r, seed + 2, 0.06, 1.22, 0.52), fill=(*FIG_SKIN, 255))
    draw.polygon(
        blob(cx - r * 0.22, cy - r * 0.2, r * 0.4, seed + 3, 0.1, 1.1, 0.2),
        fill=(*lerp(FIG_SKIN, LIGHT, 0.12), 255),
    )
    draw.line(
        [cx - r * 0.02, cy - r * 1.52, cx + r * 0.05, cy - r * 1.04],
        fill=(*lerp(INK, FIG_SKIN, 0.7), 255),
        width=round(SS * 2.2),
    )


def strata_autumn(_draw, w: int, h: int, seed: int) -> Image.Image:
    """Late autumn: organic layered ground, one ochre rim of low light."""
    img = Image.new("RGB", (w, h), FIELD)
    draw = ImageDraw.Draw(img)
    rng = random.Random(seed)

    sun_r = min(w, h) * 0.15
    sun_y = h * 0.44
    draw.ellipse(
        [w * 0.68 - sun_r, sun_y - sun_r, w * 0.68 + sun_r, sun_y + sun_r],
        fill=lerp(FIELD, OCHRE, 0.4),
    )

    for i in range(4):
        base = h * (0.52 + i * 0.13)
        amp = h * rng.uniform(0.03, 0.07)
        freq = rng.uniform(0.9, 1.8)
        phase = rng.uniform(0, math.tau)
        ridge = [(x, base + amp * math.sin(x / w * math.tau * freq + phase)) for x in range(0, w + SS, SS)]
        draw.polygon([*ridge, (w, h), (0, h)], fill=lerp(FIELD, INK, 0.3 + i * 0.16))
        rim = OCHRE if i == 1 else lerp(FIELD, LIGHT, 0.2)
        draw.line(ridge, fill=lerp(rim, FIELD, 0.35), width=round(SS * 1.2))
    return img


# variant -> (painter, accent, subject-on-field?)
VARIANTS = {
    "fig-open": (fig_open, FIG_CORE, True),
    "iris-bloom": (iris_bloom, IRIS_TIP, True),
    "strata-autumn": (strata_autumn, OCHRE, False),
    "fig-whole": (fig_whole, LIGHT, True),
}

VARIANT_ORDER = ("fig-open", "iris-bloom", "strata-autumn", "fig-whole")

# Project names, in Selected work order. Slug is positional (work-01, work-02...)
# so index.html keeps its src paths; the art itself follows the name.
PROJECTS = (
    "[Project name]",
    "[Project name 2]",
    "[Project name 3]",
)


def name_hash(name: str) -> int:
    """Stable across runs and machines — random.seed(str) is not."""
    return int.from_bytes(hashlib.blake2b(name.encode(), digest_size=8).digest(), "big")


def derive(name: str, index: int, previous: str | None) -> tuple[str, int]:
    """Name decides the subject and the wobble; neighbours never share a subject."""
    h = name_hash(name)
    order = [VARIANT_ORDER[(h + i) % len(VARIANT_ORDER)] for i in range(len(VARIANT_ORDER))]
    variant = next(v for v in order if v != previous)
    return variant, h % 100_000


def noise_field(seed: int, amount: int = 11) -> tuple[Image.Image, Image.Image]:
    """Fixed grain deltas, applied identically to every frame so GIF deltas stay small."""
    rng = random.Random(seed)
    up: list[int] = []
    down: list[int] = []
    for _ in range(W * H):
        v = rng.randint(-amount, amount) if rng.random() < 0.24 else 0
        up.append(max(0, v))
        down.append(max(0, -v))

    def plane(data: list[int]) -> Image.Image:
        band = Image.new("L", (W, H))
        band.putdata(data)
        return Image.merge("RGB", (band, band, band))

    return plane(up), plane(down)


def frame(plate: Image.Image, grain: tuple[Image.Image, Image.Image], accent: Color, i: int) -> Image.Image:
    """Light drift across the subject plus one faint scan band (I.still-alive)."""
    img = plate.copy()
    phase = i / FRAMES

    glow = Image.new("RGB", (W, H), (0, 0, 0))
    cx = round(W * (0.2 + 0.6 * ((math.sin(phase * math.tau) + 1) / 2)))
    ImageDraw.Draw(glow).ellipse(
        [cx - W // 2, -H // 3, cx + W // 2, H],
        fill=lerp((0, 0, 0), lerp(LIGHT, accent, 0.35), 0.28),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(46))
    img = Image.blend(img, Image.blend(img, glow, 0.28), 0.78)

    band_y = round(H * phase)
    ImageDraw.Draw(img).rectangle([0, band_y, W, band_y + 2], fill=lerp(FIELD, LIGHT, 0.14))

    up, down = grain
    return ImageChops.subtract(ImageChops.add(img, up), down)


def build(slug: str, variant: str, seed: int, label: str = "") -> None:
    painter, accent, on_field = VARIANTS[variant]
    big = compose(painter, W * SS, H * SS, seed) if on_field else painter(None, W * SS, H * SS, seed)
    plate = big.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.4))

    grain = noise_field(seed + 900)
    frames = [frame(plate, grain, accent, i) for i in range(FRAMES)]

    # One shared palette keeps flat areas byte-identical between frames.
    palette = frames[0].quantize(colors=36, method=Image.Quantize.MEDIANCUT)
    frames = [f.quantize(palette=palette, dither=Image.Dither.NONE) for f in frames]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    gif_path = OUT_DIR / f"{slug}.gif"
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=DURATION_MS,
        loop=0,
        optimize=True,
    )
    frames[0].convert("RGB").save(OUT_DIR / f"{slug}-poster.webp", quality=74, method=6)
    print(f"{gif_path.name}  {variant:<14} seed {seed:<6} {gif_path.stat().st_size // 1024}KB  {label}")


def build_all(names: tuple[str, ...] | list[str]) -> None:
    previous = None
    for i, name in enumerate(names, start=1):
        variant, seed = derive(name, i, previous)
        build(f"work-{i:02d}", variant, seed, label=name)
        previous = variant


if __name__ == "__main__":
    # No args: use PROJECTS. Args: treat them as project names, in order.
    build_all(sys.argv[1:] or PROJECTS)
