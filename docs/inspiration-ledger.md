# Inspiration ledger

**Purpose:** Accumulate what you like from exemplars → extract **visual cues** → decide Steal / Adapt / Avoid → optionally apply.

**How to add:** Paste likes in chat (or append a row). Agent extracts cues into a study doc + updates this ledger.

**Preview:** [lab/](../lab/) — one standalone cue page per inspiration. Serve project root (`npx serve`), open `/lab/`.

| Lab | Path | Texture skin |
|-----|------|--------------|
| Hub | [lab/index.html](../lab/index.html) | — |
| Lefos | [lab/lefos.html](../lab/lefos.html) | **film** — 1-bit B/W α32 · overlay on dark |
| 3XN | [lab/3xn.html](../lab/3xn.html) | **paper** — warm flecks · multiply, quiet on 3XN live (~0.22–0.38) |
| Max Milkin | [lab/maxmilkin.html](../lab/maxmilkin.html) | **matte** — quiet 1-bit α20 · overlay on sage |
| Sacred Computer | [lab/sacred.html](../lab/sacred.html) | **phosphor** — mid CRT flecks · screen @ ~0.55–0.7 (not loud) |
| Microsoft AI | [lab/microsoft-ai.html](../lab/microsoft-ai.html) | **coffee** — parchment `#FEF9ED` · no film grit |
| Huts | [lab/huts.html](../lab/huts.html) | **coffee** — field `#faf7ed` · moss accent |
| Ahmed Dahbi | [lab/dahbiahmed.html](../lab/dahbiahmed.html) | **charcoal** — flat `#141414` · no grain |
| Pretext | [lab/pretext.html](../lab/pretext.html) | **instrument** — `#12161c` · accent line |

---

## Index

| Exemplar | Study | Lab | Status | Steal focus (your words → cues) |
|----------|-------|-----|--------|----------------------------------|
| [Lefos](https://lefos.com) | [inspiration-study-lefos.md](inspiration-study-lefos.md) | [lefos.html](../lab/lefos.html) | Extracted · not applied | Soft dark/light hierarchy · type duo · grain+shade+line mesh · organic∩geometric |
| [Max Milkin](https://maxmilkin.com) | [inspiration-study-maxmilkin.md](inspiration-study-maxmilkin.md) | [maxmilkin.html](../lab/maxmilkin.html) | Applied (partial / later diverged) | Restraint · 2-color field · case spine |
| [3XN](https://3xn.com/) | [inspiration-study-3xn.md](inspiration-study-3xn.md) | [3xn.html](../lab/3xn.html) | Extracted (fonts + SAP Garden case spine) | Case modules: hero bleed · intro+meta · quote / image / text-rail / pair |
| [Sacred Computer](https://www.sacred.computer/) | [inspiration-study-sacred.md](inspiration-study-sacred.md) | [sacred.html](../lab/sacred.html) | Extracted · not applied | Terminal mono · ANSI · ch layout · loaders · glyph icons · phosphor |
| [Microsoft AI](https://microsoft.ai/) | [inspiration-study-microsoft-ai.md](inspiration-study-microsoft-ai.md) | [microsoft-ai.html](../lab/microsoft-ai.html) | Extracted · lab live | Soft coffee parchment · soft illustration · manuscript serif |
| [Huts](https://huts.com/) | [inspiration-study-huts.md](inspiration-study-huts.md) | [huts.html](../lab/huts.html) | Extracted · lab live | Coffee field · pastoral catalog · moss accent |
| [Ahmed Dahbi](https://dahbiahmed.com/) | [inspiration-study-dahbiahmed.md](inspiration-study-dahbiahmed.md) | [dahbiahmed.html](../lab/dahbiahmed.html) | Extracted · lab live | Cursor avatar · CSS shelf · accordion spine |
| [Pretext](https://github.com/chenglou/pretext) | [inspiration-study-pretext.md](inspiration-study-pretext.md) | [pretext.html](../lab/pretext.html) | Extracted · lab live | Measure without reflow · shrinkwrap · line flow |

---

## Cue vocabulary (shared language)

Use these labels when naming what you like — maps feeling → measurable CSS/design knobs.

| Cue ID | Feeling (what you notice) | Signals (what to measure / ship) |
|--------|---------------------------|----------------------------------|
| `C.contrast-soft` | Soft yet clear hierarchy | FG not pure white; muted ~40–55% of FG luminance step; no neon accents |
| `C.field-cool` | Cool night / Nordic field | Blue-grey base (`#161d27` class), not warm charcoal or purple |
| `T.duo-serif-mono` | Editorial + instrument | One soft serif display + one mono chrome; tracked uppercase UI |
| `T.sans-head-serif-body` | Institutional editorial readability | Humanist/geometric sans headline + serif paragraph body; strong role split |
| `T.reading-contrast-ladder` | Headline pops, body stays calm | Example from inspect: h2 contrast ~8.53 (`#494949`), paragraph contrast ~3.31 (`#898989`) |
| `L.grain` | Paper / film skin | **Look-matched tiles:** Lefos **film**. 3XN **paper**. Max **matte**. Sacred **phosphor** / bare (`L.flat-terminal`). Avoid one universal grit. |
| `L.shade-multiply` | Living atmospheric shade | Soft dark-on-light plate × `mix-blend-multiply`; empty = white pass-through |
| `L.hairline` | Geometric tension | 1px rules / thin stroke boxes; low-alpha borders |
| `L.mark-geo` | Organic ∩ geometric mark | Simple cross/circle/dot motif, sparse |
| `M.slow-alive` | Subtle life, not circus | One slow loop or soft hover; FX toggleable; respect reduced-motion |
| `S.corner-chrome` | Edge gravity | Tiny UI in corners; brand / hero owns center or left mass |
| `S.neg-space` | Calm premium | Hierarchy from space before weight |
| `S.single-column-measure` | Editorial readability | Heading and body share one measure band (~540px class), no split columns |
| `S.reading-flow-stack` | Calm reading flow | Vertical stack: heading then paragraph, modest spacing, no card framing |
| `S.content-first-plane` | Information-first zone | Plain surface under text; decoration stays secondary |
| `T.mono-grid` | Terminal instrument type | One mono face; fixed 16/20; `tabular-nums`; `geometricPrecision` |
| `C.ansi-binary` | Pure terminal field | `#000` / `#fff` (adapt before soft Nordic portfolios) |
| `C.ansi-gray-ramp` | Stepped chrome grays | ANSI ladder `#080808`→`#e4e4e4` |
| `C.brand-acid` | Rare acid accent | `#e4f221` chip/status — never hero fill |
| `S.ch-measure` | Character grid layout | Padding / measure / indent in `ch` |
| `L.box-draw` | Unicode as UI chrome | Arrows / folds / bullets instead of icon packs |
| `S.window-lift` | Lifted panel | Window one gray step up; shadow darker than window |
| `T.block-hotkey` | Chord + label controls | `⌃+O Fonts` language; ≥40px hit |
| `L.flat-terminal` | Flat CRT skin | No film grit; optional phosphor flecks only |
| `T.block-link` | Block link hover | Subdued bg block → focused fill; no underline |
| `S.debug-ch-grid` | Character debug overlay | `background-size: 1ch 1.25rem`; toggleable |
| `S.sidebar-20ch` | Terminal sidebar | Sidebar `20ch` · handle `3ch` |
| `S.window-shadow-ch` | Hard window lift | `box-shadow: 1ch 1line 0 0` |
| `S.action-icon-slot` | Glyph affordance cell | Icon `3ch × 1line`; hover paints slot only |
| `L.icon-glyph` | Unicode as icon | `→` `⊹` `▪` — not SVG packs |
| `M.bar-loader` | Line-height bar | Track border · fill text-gradient · height 1 line |
| `M.char-progress` | Progress in characters | Measure glyph · repeat fill |
| `M.block-spinner` | 1ch Unicode spinner | ~100ms cycle · braille/box modes |
| `M.one-line-cli` | CLI status line | Braille + verb + dots + elapsed · `setInterval` |
| `M.ascii-canvas` | Animated ASCII field | Per-cell spans · wave brightness · IO pause · RO cols |
| `I.cool-doc` | Cool documentary photo grade | Overcast / soft daylight · blue-grey bias · soft blacks |
| `I.desat-nordic` | Desaturated Nordic still | Stone / concrete / paper / cool metal · rare accent |
| `I.material-subject` | Material / place evidence | Architecture · void · tool · screen-as-object · shadow |
| `I.neg-frame` | Empty crop, wide or bleed | Full-bleed hero or content-width; no rounded photo cards |
| `I.grain-match` | Grain follows surface | Film on dark; flatter on cream editorial |
| `I.still-alive` | Quiet still | Almost static; no action energy |
| `I.no-stock` | Authored imagery only | No Unsplash/Pexels defaults |
| `I.no-lifestyle` | Anti-lifestyle | No smiling heads / coworking / neon / golden-hour influencer |
| `I.archive-gif` | Archive / proof-sheet thumb loop | Short silent GIF · catalog crop · not bounce |
| `I.proof-sheet` | Contact-sheet thumb chrome | Hard edge · 4:3/square · mono index label |
| `M.thumb-loop` | Quiet thumb motion | ≤3s · few frames · reduced-motion → poster |
| `S.card-film-strip` | Lefos project row | Dark film catalog · plate 42% · index + title |
| `S.card-case-module` | 3XN project preview | Not a card — related 2-up / module on cream |
| `S.card-sage-strip` | Max project row | Sage magazine strip · matte plate + ink |
| `S.card-term-block` | Sacred project row | Terminal block link · ch chrome · photo rare |
| `C.field-coffee` | Soft white coffee / parchment | Warm cream `#FEF9ED`–`#FAF7ED` · not cool Nordic · not pure white |
| `C.ink-walnut` | Warm brown ink on cream | `#5D524B` / `#664A42` class |
| `C.accent-moss` | Quiet pastoral green | `#57772E` class CTAs/links · rare |
| `C.wash-apricot` | Soft peach atmosphere | `#FBD3BE` wash band only · never button fill |
| `C.library-ink` | MAI hero void | `#2E4D4D` masthead/hero only · not Huts |
| `C.rose-label` | MAI muted burgundy label | `#8C5462` tags/emphasis |
| `C.moss-deep-band` | Huts deep green band | `#0C310A` process section |
| `S.wax-seal-pill` | MAI extreme pill control | ~86px radius · ink border · no hue fill |
| `I.soft-illustrate` | Humanist soft illustration | Analogue warm · soft glow/grain · not neon 3D UI |
| `T.serif-manuscript` | Manuscript editorial serif | Soft transitional display+body (Bradford → Fraunces) |
| `T.mono-quiet-ui` | Mono as small chrome only | Labels/tabs · not full-page terminal |
| `T.serif-sans-pastoral` | Soft serif + humanist sans | Huts: display serif · body sans |
| `S.catalog-type-grid` | Equal offering tiles | One job per tile · catalog of types |
| `S.card-coffee-soft` | Coffee light project preview | Cream · soft illust/still · walnut type |
| `S.card-pastoral-project` | Huts-style project tile | Photo-led · meta · title under |
| `M.cursor-avatar` | Portrait tracks pointer | 8-way look · center dead zone · transition frames · theme sprite pairs |
| `M.bookshelf-3d` | WebGL volume browser | Drag · arrows · pick up / inspect · face-out + spine queue |
| `S.project-shelf` | Works as physical volumes | List elsewhere · shelf for browse metaphor |
| `S.accordion-terminal` | Chevron accordion spine | `>` headers · mono uppercase · one section open |
| `C.field-charcoal-warm` | Warm near-black void | `#141414` class · flat · no grain |
| `T.serif-mono-personal` | Personal site type pair | Fraunces display · IBM Plex Mono body |
| `M.lazy-webgl-chunk` | Deferred 3D | dynamic import on section open · idle prefetch |
| `S.shelf-fallback` | Shelf without WebGL | DOM list · same links · reduced-motion / error path |
| `S.card-shelf-volume` | Dahbi project preview | Face-out cover · spine siblings · inspect link |
| `M.pretext-measure` | Height without DOM reflow | `prepare` + `layout(width, lineHeight)` |
| `M.pretext-shrinkwrap` | Multiline content hug | `measureLineStats.maxLineWidth` |
| `M.pretext-line-flow` | Variable-width rows | `layoutNextLineRange` · obstacle / float |
| `M.pretext-canvas-lines` | Manual line paint | `prepareWithSegments` + `layoutWithLines` |
| `S.instrument-panel` | Lab prove-the-math chrome | Dark panel · range · tabular stats |

**Imagery lock:** [imagery-brief.md](imagery-brief.md) · labs use authored [`lab/media/`](../lab/media/) (no stock CDN).  
**Card layouts:** [lab-card-recipes.md](lab-card-recipes.md) — one recipe per lab.

---

## Your stated likes → cue map (Lefos, session)

| You said | Cue IDs |
|----------|---------|
| Contrast ratio dark/light — soft yet noticeable hierarchy | `C.contrast-soft`, `C.field-cool` |
| Typography | `T.duo-serif-mono` |
| Layered mesh: texture, grains, colors, movements + subtle lines | `L.grain`, `L.shade-multiply`, `L.hairline`, `M.slow-alive` |
| Organic yet geometric | `L.mark-geo`, `L.hairline` + soft atmosphere layers |

---

## Your stated likes → cue map (3XN, session)

| You said | Cue IDs |
|----------|---------|
| Fonts specifically | `T.sans-head-serif-body`, `T.reading-contrast-ladder` |
| Layout of text area (from inspect screenshots) | `S.single-column-measure`, `S.reading-flow-stack`, `S.content-first-plane` |

## Your stated likes → cue map (Sacred, session)

| You said | Cue IDs |
|----------|---------|
| Next inspiration: sacred.computer | Full extract — see study |
| (system read) terminal mono + ANSI + ch chrome | `T.mono-grid`, `C.ansi-gray-ramp`, `S.ch-measure`, `L.box-draw`, `S.window-lift`, `L.flat-terminal` |
| Pull recipes: layout / loaders / icons | `S.debug-ch-grid`, `S.sidebar-20ch`, `S.window-shadow-ch`, `S.action-icon-slot`, `L.icon-glyph`, `M.bar-loader`, `M.char-progress`, `M.block-spinner`, `M.one-line-cli` |
| ASCII canvas example (screenshot) | `M.ascii-canvas` — per-cell binary field + wave gray |

## Your stated likes → cue map (Imagery, session)

| You said | Cue IDs |
|----------|---------|
| Photography style for the app (infer from aesthetic) | `I.cool-doc`, `I.desat-nordic`, `I.material-subject`, `I.neg-frame`, `I.grain-match`, `I.still-alive`, `I.no-stock`, `I.no-lifestyle` |
| Archive / photographer-gallery GIFs for project thumbs | `I.archive-gif`, `I.proof-sheet`, `M.thumb-loop` |
| Per-lab card design + layout | `S.card-film-strip`, `S.card-case-module`, `S.card-sage-strip`, `S.card-term-block` → [lab-card-recipes.md](lab-card-recipes.md) |

## Your stated likes → cue map (MAI + Huts, session)

| You said | Cue IDs |
|----------|---------|
| Soft white coffee (microsoft.ai) | `C.field-coffee`, `C.ink-walnut`, `C.wash-apricot` |
| Illustrations (microsoft.ai) | `I.soft-illustrate`, `T.serif-manuscript`, `T.mono-quiet-ui` |
| Along with huts.com | `C.field-coffee` (shared), `C.accent-moss`, `S.catalog-type-grid`, `S.card-pastoral-project`, `T.serif-sans-pastoral` |

## Your stated likes → cue map (Dahbi, session)

| You said | Cue IDs |
|----------|---------|
| Avatar following the cursor | `M.cursor-avatar` |
| 3D bookshelf | `M.bookshelf-3d`, `S.project-shelf`, `S.card-shelf-volume`, `S.shelf-fallback`, `M.lazy-webgl-chunk` |

## Your stated likes → cue map (Pretext, session)

| You said | Cue IDs |
|----------|---------|
| Try something with pretext | `M.pretext-measure`, `M.pretext-shrinkwrap`, `M.pretext-line-flow`, `M.pretext-canvas-lines` |

## Next

1. Or **apply** Pretext shrinkwrap / predicted height to a case row.  
2. Labs live: [pretext.html](../lab/pretext.html) · [dahbiahmed.html](../lab/dahbiahmed.html).
