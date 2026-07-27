# Inspiration study: Sacred Computer (sacred.computer)

**Status:** Extracted · not applied.  
**Exemplar:** [sacred.computer](https://www.sacred.computer/) (SRCL — open-source terminal aesthetic React + style repo)  
**Evidence:** Live inspect 2026-07-27 (`theme-dark`) · [global.css](https://github.com/internet-development/www-sacred/blob/main/global.css) · [colors.json](https://github.com/internet-development/www-sacred/blob/main/scripts/cli/colors.json) · [components/AGENTS.md](https://github.com/internet-development/www-sacred/blob/main/components/AGENTS.md) · loader/layout CSS modules  
**Related:** [inspiration-ledger.md](inspiration-ledger.md)  
**Lab:** [lab/sacred.html](../lab/sacred.html)

**Why this exemplar:** Next inspiration in the cue pipeline (full visual system — not one cue). Terminal-grade mono system, ANSI palette truth, `ch`-grid chrome, hotkey language, **layout / loader / icon recipes** from SRCL.

---

## 1. What you notice → visual cues

| Signal | Cue ID | Measured / observed |
|--------|--------|---------------------|
| One mono face everywhere | `T.mono-grid` | `PaperMono-Regular, Consolas, monaco, monospace` · **16px** · **lh 1.25 (20px)** · `tabular-nums` · `text-rendering: geometricPrecision` |
| Pure terminal field | `C.ansi-binary` | Dark: bg `#000` · text `#fff` (harsh vs Lefos soft off-whites) |
| Stepped gray chrome | `C.ansi-gray-ramp` | ANSI gray ladder: `#080808` → `#262626` → `#3a3a3a` → `#585858` → `#8a8a8a` → `#a8a8a8` → `#e4e4e4` |
| Acid brand (rare) | `C.brand-acid` | `#e4f221` (`--color-brand` / `--ansi-true-brand`) |
| Character grid layout | `S.ch-measure` | Padding / indents / scrollbar width in **`ch`**; list indent `-1ch` |
| Box-draw / arrow chrome | `L.box-draw` | `⭢` `▾` `▪` `⌃+O` as UI language, not icons |
| Lifted window panel | `S.window-lift` | Window `#3a3a3a` over page `#000`/`#080808`; shadow `#262626` (darker than window) |
| Hotkey action chrome | `T.block-hotkey` | `⌃+O Fonts` · `⌘+S Save` — chord + label as primary control copy |
| Flat terminal skin | `L.flat-terminal` | **No film grain.** Optional faint phosphor dust only. Texture = absence of Lefos grit |
| Block links | `T.block-link` | Links = subdued bg block, hover → focused foreground (not underline) |

---

## 2. Color tokens (live dark)

| Role | Hex | Sacred token |
|------|-----|--------------|
| Page field | `#000000` | `--theme-background` / `termBg` |
| Near-black | `#080808` | `--color-gray-3` |
| Window / border | `#3a3a3a` | `--theme-border` / `windowBg` |
| Window shadow | `#262626` | `--theme-window-shadow` / `shadow` |
| Mid chrome | `#585858` / `#8a8a8a` | tableHeader / btnHotkey |
| Neutral muted | `#a8a8a8` | `neutral` |
| Text | `#ffffff` | `--theme-text` |
| Brand | `#e4f221` | `--color-brand` |
| Focus (default dark) | fuchsia-derived OKLCH | `--theme-focused-foreground` |

**CLI ↔ web contract:** `scripts/cli/colors.json` is source of truth; CSS `--ansi-*` mirrors terminal-legal colors. OKLCH tints = **web-only** projection — Avoid as portfolio base.

---

## 3. Type (`T.mono-grid`)

| Knob | Sacred |
|------|--------|
| Families | **1** — mono only |
| Size / leading | 16px / 20px (1.25) |
| Numerals | `tabular-nums` + `lining-nums` |
| Rendering | `geometricPrecision` |
| Weight | 400 |

**Steal for you:** dock / instrument chrome → stricter mono grid. **Avoid** replacing Fraunces display with mono-only sitewide (kills editorial cue stack from Lefos/3XN).

Lab stand-in: **Martian Mono** (Evil Martians — brutalist, Google Fonts). Not JetBrains. Alternates considered: Geist Mono, Fragment Mono.

---

## 4. Layout recipes (from SRCL components)

Source: `components/*.module.css` + `DebugGrid.tsx`. Unit = **`1ch` × `1 line`** where `1 line = font-size × line-height-base` (16×1.25 = **20px**).

| Recipe ID | Component | CSS / behavior |
|-----------|-----------|----------------|
| `S.debug-ch-grid` | `DebugGrid` | Overlay grid `background-size: **1ch 1.25rem**`; toggle `⌃+G` / `debugGridToggle` |
| `S.grid-pad` | `Grid` | `padding: 1line 2ch` |
| `S.indent-1ch` | `Indent` | `padding-left: 1ch` |
| `S.block-1ch` | `Block` | Solid `1ch` × `1line` spacer / caret brick |
| `S.row-focus-fill` | `Row` | Whole row focus → `--theme-focused-foreground` bg |
| `S.row-space-between` | `RowSpaceBetween` | `display: flex; justify-content: space-between` |
| `S.sidebar-20ch` | `SidebarLayout` | Sidebar **`width: 20ch`**; resize handle **`3ch`** with 2px dual lines |
| `S.window-shadow-ch` | `Window` | `box-shadow: **1ch 1line 0 0** var(--theme-window-shadow)`; pad `1line min(2ch,4vw)` |
| `S.divider-line` | `Divider` | Full-width **2px** text-color rule, or soft gradient fade |
| `S.action-icon-slot` | `ActionListItem` | Icon cell **`3ch × 1line`**; label `padding: 0 1ch`; hover paints **icon slot only** |

**Coherence rule:** every layout knob snaps to the character grid. No 8/12/16px Tailwind habit — measure in `ch` / line multiples.

---

## 5. Loader recipes

CLI ports are **static** (no animation loop). React side owns loaders.

| Recipe ID | Component | Recipe |
|-----------|-----------|--------|
| `M.bar-loader` | `BarLoader` | Track = `--theme-border`, height **1 line**; fill = `linear-gradient(to right, transparent, var(--theme-text))`; optional auto `+10%` tick |
| `M.char-progress` | `BarProgress` | Measure fill glyph width (`░` default); `floor(container/ch)` cells; string repeat — progress in **characters** |
| `M.block-spinner` | `BlockLoader` | Single glyph, `width: 1ch`, cycle ~**100ms**; modes = braille / dots / bars / arrows / box corners (11 sequences) |
| `M.one-line-cli` | `OneLineLoaders` | Braille frame + verb (`Thinking`…) + `﹒` phase + `(0ms)` elapsed; drive with **`setInterval` ~60ms** (not rAF — mobile throttle) |
| `M.matrix-rain` | `MatrixLoader` | `pre` cell grid; greek/katakana; IntersectionObserver pause off-screen |
| `M.ascii-canvas` | `ASCIICanvas` | `pre` + per-cell `span`; wave→gray hex color; DOM diff char/color; `ResizeObserver` cols; `IntersectionObserver` pause; height = `rows × 1line` |

**Steal for portfolio:** `M.block-spinner` or quiet `M.bar-loader` for case/async only. `M.ascii-canvas` = personal/lab ornament only. **Avoid** matrix rain / ascii canvas on commercial `/` hero.

---

## 6. Icon recipes

Sacred almost never ships SVG icon packs.

| Recipe ID | Pattern | Detail |
|-----------|---------|--------|
| `L.icon-glyph` | Unicode in mono | `⭢` `↑` `⊹` `▪` `▾` as the icon |
| `L.icon-slot-3ch` | `ActionListItem` | Glyph centered in **3ch** cell; focus/hover → focused bg on slot |
| `L.icon-svg-rare` | `svg/Sphere`, `IntDevLogo` | Decorative exceptions — not the system default |

**Steal:** dock / list affordances as 1-char glyphs in a fixed slot. **Avoid:** Lucide/Heroicons soup next to terminal chrome.

---

## 7. Texture (`L.flat-terminal`)

Sacred surface is **flat phosphor black**, not film/paper/matte.

| Look | Skin |
|------|------|
| Lefos | film |
| 3XN | paper |
| Max | matte |
| **Sacred** | **phosphor** — denser green/white CRT flecks (`noise-tile-phosphor` + loud variant), `mix-blend-mode: screen` |

Do **not** overlay Lefos 1-bit film on Sacred demos — breaks terminal read.

---

## 8. Steal / Adapt / Avoid

### Steal
| Cue | Portfolio use |
|-----|----------------|
| `T.mono-grid` | Dock, meta, case tags — fixed lh + tabular |
| `C.ansi-gray-ramp` | Quiet chrome steps (adapt off pure `#000`) |
| `S.ch-measure` / `S.debug-ch-grid` | Instrument UI + optional debug overlay |
| `S.action-icon-slot` / `L.icon-glyph` | List / dock affordances |
| `S.window-shadow-ch` | Modal / dialog hard ch-offset shadow |
| `M.block-spinner` | Tiny async indicator |
| `L.flat-terminal` | Know when grain must be **off** |

### Adapt
| Cue | Note |
|-----|------|
| `C.ansi-binary` | Soften to Nordic `#1a1e23` + off-white if mixing Lefos |
| `T.block-hotkey` | Only for power-user / lab surfaces |
| `C.brand-acid` | Tiny status/focus — never hero fill |
| `S.sidebar-20ch` | Personal tools only — not marketing home |
| `M.one-line-cli` | Fun on `/personal` or lab — not case hero |

### Avoid
| Cue | Why |
|-----|-----|
| Pure mono-only marketing home | Conflicts with brand/editorial cues |
| Kitchen-sink first viewport | Dashboard, not composition |
| Full OKLCH tint circus | Noise; portfolio needs one field |
| Importing SRCL wholesale | System is a product; steal recipes not the kitchen sink |
| `M.matrix-rain` on commercial `/` | Circus |
| `M.ascii-canvas` on commercial hero | Ornament noise; keep lab / personal |

---

## 9. make-interfaces-feel-better notes (Sacred already / gaps)

| Principle | Sacred | Lab / your stack |
|-----------|--------|------------------|
| Tabular numbers | Yes (`tabular-nums`) | Keep on instrument chrome |
| Font smoothing | Geometric precision | Pair with `antialiased` on macOS roots |
| Hit area ≥40px | Chord buttons tall via line box | Enforce `min-height: 40px` on lab chords |
| `transition: all` | `Row` uses `transition: 200ms ease background` — **narrow when porting** | Spec `background-color` only |
| Scale on press | Not signature | Lab chords: `scale(0.96)` |
| Text wrap | Terminal wrap, not `balance` | Lab titles still `text-wrap: balance` |
| Interruptible motion | Loaders = `setInterval` | Respect `prefers-reduced-motion` → freeze frame 0 |

---

## Next

1. Review [lab/sacred.html](../lab/sacred.html) — layout / loader / icon recipe demos + phosphor toggle.
2. Say which Cue IDs / recipes to **apply** (dock-safe: `T.mono-grid` + `S.action-icon-slot` + `M.block-spinner`).
