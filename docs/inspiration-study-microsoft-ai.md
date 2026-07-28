# Inspiration study: Microsoft AI (microsoft.ai)

**Status:** Extracted · not applied.  
**Exemplar:** [microsoft.ai](https://microsoft.ai/)  
**Evidence:** Live HTML/CSS tokens (2026-07-28) + public design writeups (MAI identity · Refero · Microsoft Design “Humanity in focus”).  
**Related:** [inspiration-ledger.md](inspiration-ledger.md), [inspiration-study-huts.md](inspiration-study-huts.md), [imagery-brief.md](imagery-brief.md).  
**Lab:** [lab/microsoft-ai.html](../lab/microsoft-ai.html)

**Why this exemplar (your words):** soft white coffee field · illustrations.

---

## 1. Measured / observed tokens

| Signal | Value / note |
|--------|----------------|
| Nav / field cream | `#FEF9ED` parchment (`--nav-background`) — soft coffee |
| Nav / body ink | `#5D524B` walnut |
| Secondary surfaces | Bone `#f5f0e4` · linen border `#cec7bc` |
| Warm wash | Apricot `#fbd3be` (atmosphere, not fill) |
| Dark void (hero contrast) | Library ink `#2e4d4d` (deep teal-green — rare) |
| Display / body type | Bradford LL serif |
| UI mono | Red Hat Mono |
| Atmosphere | Flat warm paper · peach wash · little elevation |

**Note:** Visual-grammar “no stock” + imagery brief still hold. Steal **grade + illustration language**, not MAI assets.

---

## 2. Cue extraction

| What you liked | Cue ID | Signal |
|----------------|--------|--------|
| Soft white coffee | `C.field-coffee` | Warm parchment field `#FEF9ED`–`#FAF7ED` class · not cool Nordic `#1a1e23` · not pure `#fff` |
| Warm ink on cream | `C.ink-walnut` | FG `#5D524B` / `#664A42` class on coffee field |
| Soft illustration language | `I.soft-illustrate` | Humanist, analogue-warm, soft glow/grain · not hard UI icon packs · not neon 3D product |
| Manuscript type | `T.serif-manuscript` | Soft transitional serif for **display + body** (Bradford → Fraunces); italic = emphasis; **no bold** |
| Quiet mono chrome | `T.mono-quiet-ui` | Mono only for tabs/labels/nav — positive tracking uppercase |
| Library Ink void | `C.library-ink` | `#2e4d4d` hero/masthead only — not lower-page dark cards |
| Rose labels | `C.rose-label` | `#8c5462` mono tags / italic accent — not moss green |
| Wax-seal control | `S.wax-seal-pill` | Extreme pill radius (~86px) · border ink · no hue fill |
| Apricot atmosphere | `C.wash-apricot` | `#fbd3be` full-bleed wash band only — never button fill |

---

## 2b. Split vs Huts (do not blend)

| MAI | Huts |
|-----|------|
| Serif reads everything | Serif display · **sans body** |
| Library Ink dark hero | Always light coffee field |
| Apricot wash band | Moss `#57772e` filled CTA |
| Wax-seal pill / text arrow | Rectangular moss button |
| Soft illustration | Pastoral **photo** projects |
| Model / values editorial | Home-type **catalog** + builds |
| No green accent | Moss is brand action |

## 3. Steal / Adapt / Avoid

### Steal

- Coffee parchment as **light** editorial plane (pair with Huts).
- Soft, human illustration as alternate to cool documentary photo / archive GIF (lab-specific).
- Flat stacked paper sections · space before chrome.

### Adapt

- Fonts: Fraunces (or similar soft serif) + JetBrains/IBM mono — **not** Segoe / system UI stack.
- Keep portfolio Nordic dark as default; coffee as **optional light skin** or one lab, not force sitewide.
- User frontend rule warns default “warm cream + terracotta” AI look — here cream is **intentional steal** from MAI/Huts; still avoid terracotta accent spam · prefer walnut ink + one quiet accent.

### Avoid

- Copying Microsoft product chrome / Copilot marketing blocks.
- Purple AI gradients · glassmorphism.
- Replacing all cool-doc photography with illustration everywhere (Sacred/Lefos stay their recipes).

---

## 4. make-interfaces-feel-better notes (when applying)

| Principle | How MAI informs apply |
|-----------|------------------------|
| Text wrap | Big serif heads → `text-wrap: balance` |
| Image outlines | Soft cream field → black `rgba(0,0,0,0.1)` outline on photos/illustrations |
| Shadows vs borders | Prefer soft separation / space; if radius used, concentric |
| Hit area | Pill/wax-seal controls ≥40×40 |
| Motion | Soft enter stagger; interruptible hover — no circus |

---

## 5. Card recipe (provisional)

`S.card-coffee-soft` — cream field · soft illustration or soft still · walnut type · no hard terminal blocks · no film grit.

---

## Next

1. Lab page when you say **lab microsoft-ai**.  
2. Or **apply `C.field-coffee` + `I.soft-illustrate`** to a light portfolio skin.
