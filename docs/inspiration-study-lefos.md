# Inspiration study: Lefos (lefos.com)

**Status:** Extracted · **not applied** (portfolio currently barebones: Nordic mist + grain, no leaf FX).

**Exemplar:** [lefos.com](https://lefos.com)  
**Live sample:** 2026-07-25 (gate + enter chrome; CSS vars + computed styles)  
**Related:** [inspiration-ledger.md](inspiration-ledger.md), [visual-grammar.md](visual-grammar.md), prior Max study.  
**Lab:** [lab/lefos.html](../lab/lefos.html)

**Why this exemplar (your words):** Soft dark/light contrast hierarchy; typography; layered mesh of texture / grain / color / motion with subtle lines; organic yet geometric.

---

## 1. What you noticed → visual cues

| You liked | Cue ID | Lefos signal (measured / observed) |
|-----------|--------|-------------------------------------|
| Soft yet noticeable dark↔light hierarchy | `C.contrast-soft` | Field `#161d27` · text `#f0f2f3` · muted chrome `#9fa4ab` — not pure black/white |
| Cool atmospheric field | `C.field-cool` | Tokens: `--bg` / moonstone system; evening blue `#252f3d`, tidal `#4b607c` |
| Typography | `T.duo-serif-mono` | **PlantinNow** (serif display) + **DepartureMono** (UI) |
| Grain / paper skin | `L.grain` | Heavy tactile noise on dark field (gate screen) |
| Living shade layer | `L.shade-multiply` | Fixed full-bleed canvas, `mix-blend-multiply`, opacity **0.6**; dock control “Leaf shadows” |
| Subtle geometric lines | `L.hairline` | Thin stroke box around CTA (“Summon the Herald”) |
| Organic ∩ geometric | `L.mark-geo` | Cross + four dots mark beside wordmark |
| Quiet motion | `M.slow-alive` | Soft leaf shade loop; toggleable FX; not scroll circus |
| Layout gravity | `S.corner-chrome` + `S.neg-space` | Brand center; About / studio / FX / lang pinned to edges |

---

## 2. Color tokens (live)

Dark UI (home gate):

| Role | Approx | Lefos token / note |
|------|--------|--------------------|
| Field / page bg | `#161d27` | `--bg` → moonstone system on dark |
| Elevated surface | `#252f3d` | `--color-evening-blue` / `--surface` |
| Primary text | `#f0f2f3` | `--text` / `--text-chrome` |
| Muted chrome | `#9fa4ab` | `--text-muted` |
| Soft paper (light mode surface) | `#ebe7e4` / `#dacbc2` | `--color-moonstone` / `--color-parchment` |
| Warm neutrals (secondary system) | `#5c5752` driftwood, warm-30/40/50 | Depth, not a loud accent |
| Accent blue (rare) | `#4b607c` | `--color-tidal-blue` — status/info, not hero scream |

**Hierarchy recipe (`C.contrast-soft`):**

1. Base = cool dark blue-grey (not warm grey, not `#000`)
2. Body text = soft off-white (`#f0f2f3` class), never `#fff`
3. Labels / dock = mid cool grey (`#9fa4ab` class) — readable, quieter than body
4. Accent used sparingly (links / focus), not decoration stripes

Contrast is **stepped**, not binary. Softness comes from hue (cool) + off-whites + grain eating hard edges.

---

## 3. Type (`T.duo-serif-mono`)

| Role | Lefos | Behavior |
|------|-------|----------|
| Display / brand | PlantinNow (serif) | Soft thick/thin contrast; optical sizing; slight negative tracking on titles |
| Chrome / UI | DepartureMono | Uppercase, tracked (~0.05–0.1em feel), small (11–14px), weight 400–500 |

**Steal pattern (not the licensed faces):** one **soft oldstyle/editorial serif** + one **mono instrument**. You already aim Fraunces + JetBrains Mono (+ Outfit body) — Lefos is stricter **duo**. Ledger constraint vs your visual-grammar “max 2 typefaces”: Lefos fits; your three-family stack is looser.

---

## 4. Layer stack (the “mesh”)

Bottom → top (what makes it feel coherent):

1. **Field color** — flat cool `#161d27` (plus optional quiet radial mist)
2. **Grain** — static film/paper noise over everything
3. **Shade atmosphere** — soft leaf/dappled multiply plate (empty pixels white so field survives)
4. **Hairlines / marks** — 1px geometry, sparse
5. **Type** — serif statement + mono chrome
6. **Motion** — only the shade layer (and micro UI), interruptible / toggleable

**Coherence rule:** every layer is low-amplitude. No layer screams alone. Mesh = many quiet signals.

**Your failed canopy attempts broke this** when multiply plate carried mid-grey fill → grey haze ate the field (`C.field-cool` died). Cue `L.shade-multiply` requires **white empty + soft dark only**.

---

## 5. Motion / FX (`M.slow-alive`)

| Lefos | Steal? |
|-------|--------|
| Leaf shadows canvas multiply ~0.6 | **Adapt** later — only with clean white plate or true alpha |
| FX toggle (“Leaf shadows: on”) | **Steal** pattern when FX returns |
| Appearance Auto | Optional |
| No heavy scroll theatre on gate | **Steal** — calm first fold |

---

## 6. Composition (`S.corner-chrome`, `S.neg-space`)

Gate:

- Center: mark + serif wordmark + quiet CTA
- Corners: About, studio credit, Herald box, EN / FX / Auto
- Huge negative space = grain becomes visible “material”

**Steal:** edge chrome tiny; center/left mass for brand/statement. Matches your dock-at-bottom habit if dock stays quiet muted mono.

---

## 7. Steal / Adapt / Avoid

### Steal (cues → portfolio)

| Cue | Ship as |
|-----|---------|
| `C.contrast-soft` + `C.field-cool` | Keep/tune `#1a1e23`–`#161d27` field, `#e6e9ed`/`#f0f2f3` fg, muted `#8b929c`/`#9fa4ab` |
| `T.duo-serif-mono` | Fraunces display + JetBrains Mono chrome; consider dropping Outfit later for true duo |
| `L.grain` | Keep `texture.png` overlay quiet |
| `L.hairline` | Section rules / dock separators already hairline — keep opacity low |
| `S.corner-chrome` / `S.neg-space` | Dock quiet; hero owns space |
| `M.slow-alive` | Prefer 2–3 CSS motions max when adding life back |

### Adapt

| Cue | Note |
|-----|------|
| `L.shade-multiply` | Reintroduce only with correct plate (wall-shadow, white field) — not look-up canopy fog |
| `L.mark-geo` | Optional tiny mark; don’t clone Lefos cross |

### Avoid

- Copying Lefos CDN assets / PlantinNow / DepartureMono binaries
- Mid-grey multiply plates
- Loud third accent hue
- Dense chrome competing with hero

---

## 8. Decision gate

Reply with one (or combine):

1. **apply cues** — list Cue IDs (e.g. `C.*` + `T.*` + `L.grain` only)
2. **next exemplar** — name site + what you like
3. **hold** — ledger only; keep barebones

No atmosphere FX until you choose `L.shade-multiply` again.
