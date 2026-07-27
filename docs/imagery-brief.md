# Imagery brief — cool documentary material

**Status:** Locked (inferred from Nordic field + Lefos film + 3XN case spine + Max restraint + [visual-grammar.md](visual-grammar.md)).  
**Related:** [inspiration-ledger.md](inspiration-ledger.md) · Cue prefix `I.*`

Photos = **evidence of place / material / work**. Same quiet as type. Not lifestyle. Not startup stock.

---

## Direction (one line)

Cool overcast documentary stills — desaturated Nordic blue-grey, soft contrast, architectural or material subject, empty negative space.

---

## Cue IDs

| Cue ID | Rule |
|--------|------|
| `I.cool-doc` | Cool documentary grade: overcast / soft daylight, blue-grey bias, soft blacks (not crushed HDR) |
| `I.desat-nordic` | Desaturated palette — stone, concrete, paper, cool metal. Accents rare (one object max) |
| `I.material-subject` | Subject = architecture, interior void, tool, screen-as-object, material, shadow. Process evidence |
| `I.neg-frame` | Crop with empty air; full-bleed hero or wide content-width (3XN modules). No floating rounded photo cards |
| `I.grain-match` | Dark / film zones → grit OK (`L.grain` film). Cream editorial cases → cleaner / flatter (`L.flat-terminal` class) |
| `I.still-alive` | Almost-static frames (`M.slow-alive`). No action / sports energy |
| `I.no-stock` | Own, commissioned, or authored-to-brief only. **No Unsplash/Pexels defaults** (matches visual-grammar) |
| `I.no-lifestyle` | Ban: smiling headshots, coworking laptops, neon city bokeh, golden-hour influencer, “team collaborating” |
| `I.archive-gif` | Short silent catalog loop for project thumbs — contact-sheet / darkroom proof feel, not Dribbble bounce |
| `I.proof-sheet` | Square or 4:3 catalog crop · hard edge · optional mono index label (`01 · Harbor`) |
| `M.thumb-loop` | ≤3s loop · ≤4–8 frames · ≤400KB target · `prefers-reduced-motion` → poster still |

---

## Project thumbnails (archive GIF)

**Direction:** photographer archive / proof-sheet catalog — not UI screen-rec, not sticker bounce.

| Axis | Rule |
|------|------|
| Feel | Contact sheet · darkroom proof · museum index |
| Motion | Light drift / scan / focus breathe / dust — almost still |
| Grade | Cool desat or duotone/1-bit proof · grain OK on dark |
| Crop | Square or 4:3 · hard edge · no rounded cards (`I.neg-frame`) |
| Format | True GIF for archive vibe, or animated WebP if weight wins |
| Fallback | Poster still via `<picture>` + `prefers-reduced-motion: reduce` |

**Ban:** rainbow GIF · sticker bounce · loud UI capture · stock meme loops

**Lab prototype:** archive GIFs on Max/Lefos rows. **Per-lab layout:** [lab-card-recipes.md](lab-card-recipes.md) (`S.card-*`).

| Surface | Photo role |
|---------|------------|
| Home / chrome | Prefer geometry + grain + type. **One** signature still max, or none |
| Case spine | 3XN-style modules — wide quiet architectural / material frames |
| Journal | One quiet still per piece, or none |

---

## Do / don’t

**Do:** façade detail · empty lobby · desk object · UI on real device in cool room · concrete + shadow · one strong horizon / line  

**Don’t:** purple gradients · glassmorphism product shots · stock lifestyle · warm golden hour · heavy Instagram vignette · rainbow accents  

---

## Generate / shoot prompt stub

> Cool overcast documentary photo, desaturated Nordic blue-grey, soft contrast, architectural or material subject, empty negative space, no people faces, no neon, no stock lifestyle, flat editorial grade, subtle film grain on dark areas only.

---

## Steal / Adapt / Avoid

| | |
|--|--|
| **Steal** | 3XN case photo rhythm (wide, quiet, content-width). Lefos soft contrast + cool field. |
| **Adapt** | Grain only where surface is dark; cream case pages stay flatter. |
| **Avoid** | Universal stock packs; one grit recipe on every photo; lifestyle / neon / warm influencer grades. |

---

## Checklist before shipping an image

1. Passes `I.no-stock` + `I.no-lifestyle`?
2. Grade matches `I.cool-doc` + `I.desat-nordic`?
3. Crop = `I.neg-frame` (bleed or wide), not card inset?
4. Grain matches surface (`I.grain-match`)?
5. Still reads as evidence, not decoration?

---

## Lab media inventory

Authored stills live in [`lab/media/`](../lab/media/) (WebP, `?v=1`). Cues: `I.cool-doc`, `I.desat-nordic`, `I.material-subject`, `I.neg-frame`, `I.grain-match`, `I.still-alive`, `I.no-stock`, `I.no-lifestyle`.

| File | Lab | Role |
|------|-----|------|
| `lefos-gate.webp` | [lefos.html](../lab/lefos.html) | Gate field under film mesh |
| `lefos-work-01.webp` … `03` | Lefos | Work strip material plates |
| `max-case-01.webp` … `03` | [maxmilkin.html](../lab/maxmilkin.html) | Case strip side plates |
| `sacred-device.webp` | [sacred.html](../lab/sacred.html) | Single device plate in terminal window |
| `x3xn-hero.webp` | [3xn.html](../lab/3xn.html) | Case hero bleed |
| `x3xn-mod-01.webp` · `02` | 3XN | Wide modules |
| `x3xn-pair-a.webp` · `b` | 3XN | Double image |
| `x3xn-gal-a.webp` · `b` | 3XN | Gallery track |
| `x3xn-rel-a.webp` · `b` | 3XN | Related 2-up |
| `harbor-archive.gif` | Max + Lefos Harbor thumb | Archive GIF (`I.archive-gif`) |
| `harbor-archive-poster.webp` | same | Reduced-motion poster |
| `ledger-archive.gif` + `-poster.webp` | Max + Lefos Ledger | Archive GIF |
| `cuelabs-archive.gif` + `-poster.webp` | Max + Lefos Cue Labs | Archive GIF |

No Unsplash/CDN in labs.
