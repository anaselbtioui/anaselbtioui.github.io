# Inspiration study: 3XN (3xn.com) — fonts + layout

**Status:** Extracted (fonts + SAP Garden case spine) · not applied.  
**Exemplar:** [3xn.com](https://3xn.com/) · case: [SAP Garden](https://3xn.com/project/sap-garden)  
**Evidence source:** Live browser inspect (SAP Garden, 2026-07-27).  
**Related:** [inspiration-ledger.md](inspiration-ledger.md), [inspiration-study-lefos.md](inspiration-study-lefos.md).  
**Lab:** [lab/3xn.html](../lab/3xn.html)

**Why this exemplar (your words):** “I like the fonts specifically.”

---

## 1. Measured evidence (from inspect)

Important: blue highlight in screenshots is Chrome inspect overlay, not site UI.

| Element | Font | Size | Color | Contrast | Role |
|--------|------|------|-------|----------|------|
| Heading (`h2.ng-binding`) | `"Du Nord"` | `30px` | `#494949` | `8.53` | Primary headline |
| Paragraph (`p`) | `"ID00 Serif Pro"` | `15px` | `#898989` | `3.31` | Long reading copy |

---

## 2. Cue extraction

| What you liked | Cue ID | Signal |
|----------------|--------|--------|
| Font pairing (clear hierarchy) | `T.sans-head-serif-body` | Sans for headings + serif for body copy |
| Readability hierarchy by tone | `T.reading-contrast-ladder` | Darker high-contrast head; lighter lower-contrast paragraph |

---

## 3. What this means for your system

### Steal

- **Role split, not style split:** heading family and body family intentionally different.
- **Contrast ladder by text role:** heading can sit near AA/AAA, body intentionally softer for editorial tone.

### Adapt

- Keep your current families if desired, but map roles like 3XN:
  - display/headline = sans
  - long copy = serif
- If you keep Fraunces in headline, inverse this only if tone still matches your target.

### Avoid

- Same family for every role.
- Equal contrast for all text blocks (kills hierarchy).

---

## 4. Quick apply sketch (for later)

If you ask “apply 3XN font cues”, target:

1. Headings (`h1/h2/case titles`) → sans family
2. Paragraph/body copy (`p`, case prose) → serif family
3. Color ladder:
   - heading around `#494949` equivalent against warm light surface
   - paragraph around `#898989` equivalent

No code changes yet in production pages.

---

## 5. Case layout (SAP Garden — measured 2026-07-27)

Exemplar: [3xn.com/project/sap-garden](https://3xn.com/project/sap-garden). Confidence: **high** after live inspect.

**Spine:** full-bleed hero → intro+meta → module stack → related 2-up.

| Signal | Measured / observed | Cue ID |
|--------|----------------------|--------|
| Hero bleed | ~`100vw × 100vh`; white thesis overlay (~50px Du Nord) bottom-left | `S.case-hero-bleed` |
| Intro + meta same column | ~706px; title 30px `#494949`; body 16px `#898989`; Information list 13px | `S.intro-meta-column` |
| Quote module | Serif ~40px; ~60% content width; centered | `S.module-quote` |
| Wide image | Content-width full; no card chrome | `S.module-image` |
| Text rail L/R | `col-lg-4` / `col-md-5` (~694px); `.md-text.left` / `.right` | `S.module-text-rail` |
| Image pair | 50/50 side-by-side | `S.module-image-pair` |
| Field | Cream `#faf9f2`; **no film grain** on live site | `S.content-first-plane` |
| Type ladder | Sans head / serif body / contrast `#494949`→`#898989` | `T.sans-head-serif-body`, `T.reading-contrast-ladder` |

**Lab:** [lab/3xn.html](../lab/3xn.html) rebuilds this spine (Outfit / Fraunces stand-ins).

### Implications for your system

- Case pages = module spine, not one flat reading column.
- Intro measure shared by title, body, meta — then media breaks wide.
- Text rails alternate left/right; images own full content width.
- Flat cream field; skip grain for this look.
