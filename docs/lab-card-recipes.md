# Lab card / project-row recipes

**Status:** Locked (specify per look — do not one-size all labs).  
**Related:** [imagery-brief.md](imagery-brief.md) · [inspiration-ledger.md](inspiration-ledger.md) · labs under [`lab/`](../lab/)

Each inspiration owns **one** project-preview pattern. Shared media (`I.archive-gif`) may feed thumbs, but **chrome + layout differ**.

---

## Cue IDs

| Cue ID | Lab | Meaning |
|--------|-----|---------|
| `S.card-film-strip` | Lefos | Dark film catalog row — plate + index + title |
| `S.card-case-module` | 3XN | Not a card — case module / related tile on cream |
| `S.card-sage-strip` | Max | Sage magazine strip — matte plate + ink type |
| `S.card-term-block` | Sacred | Terminal block link / ch-window — not photo card |

---

## 1. Lefos — `S.card-film-strip`

**Feel:** Darkroom contact strip on cool night field.

| Axis | Spec |
|------|------|
| Surface | `#161d27` class field · film grain over plate (`L.grain` film) |
| Plate | `I.archive-gif` · 4:3 · hard hairline `rgba(fg, ~0.12)` · **no radius, no shadow** |
| Layout | Row: **plate `minmax(16rem, 42%)`** · index `4ch` · title · tag |
| Type | Fraunces title · JetBrains Mono index/tag · soft muted |
| Pad | Comfortable vertical pad (~1.1–1.65rem) · hairline rules between rows |
| Mobile | Plate full-bleed on top · index/title/tag under |
| Ban | White cards · sage · rounded · stamp-size (&lt;16rem) thumbs |

**Live:** [lab/lefos.html](../lab/lefos.html) work strip.

---

## 2. 3XN — `S.card-case-module`

**Feel:** Institutional editorial — modules, not cards.

| Axis | Spec |
|------|------|
| Surface | Cream `#faf9f2` · **no film grain** on media |
| “Card” | Avoid. Project preview = **related 2-up** or wide `module-image` |
| Plate | Authored still / optional archive GIF · full tile width · hard edge · outline whisper only |
| Layout | Related: **2-col equal** · image full cell · title + place under (sans/serif ladder) |
| Type | Outfit head · Fraunces or sans body · `#494949` / `#898989` |
| Pad | Side pad like case inner · gap between pair ~0.75–1.5rem |
| Mobile | Stack 1-col |
| Ban | Side-stamp strip · dark film chrome · rounded cards · heavy shadow |

**Live:** [lab/3xn.html](../lab/3xn.html) related-projects (+ module images).

---

## 3. Max — `S.card-sage-strip`

**Feel:** Commercial restraint — magazine case strip on sage.

| Axis | Spec |
|------|------|
| Surface | `#C2CABB` · matte skin quiet · ink `#10120F` |
| Plate | `I.archive-gif` · 4:3 · **1px ink outline** · no radius · no drop shadow |
| Layout | Row: **plate `minmax(16rem, 42%)`** · mono tag · display title · one problem line |
| Type | Space Grotesk display · IBM Plex Mono labels |
| Pad | Strip padding ~1.15–1.75rem · 1px strip border as list chrome |
| Mobile | Plate full width on top · type stack under |
| Ban | Film grit heavy · cream editorial · terminal glyphs as primary thumb |

**Live:** [lab/maxmilkin.html](../lab/maxmilkin.html) case strips.

---

## 4. Sacred — `S.card-term-block`

**Feel:** Instrument list — project as block action, photo optional.

| Axis | Spec |
|------|------|
| Surface | Flat black / window gray · phosphor optional · **no Lefos film** |
| “Card” | `T.block-link` row · icon slot `3ch` · label · optional small device still |
| Plate | If image: one quiet still **inside** window chrome, not side stamp · or skip image |
| Layout | Vertical action list / `20ch` nav language · projects as `→ Harbor` blocks |
| Type | Martian Mono (or JetBrains stand-in) · fixed sizes · tabular |
| Pad | `ch` / line rhythm · hard `box-shadow: 1ch 1line` on window only |
| Mobile | Same stack · no magazine plate column |
| Ban | Sage strips · cream related tiles · large archive GIF as hero of list |

**Live:** [lab/sacred.html](../lab/sacred.html) — `WORKS` window · `.sacred-term-block` rows (Harbor / Ledger / Cue Labs). No archive GIF on list.

---

## Shared rules (all labs)

1. Hard edges · no rounded “product cards”.  
2. One job per row/tile.  
3. Archive GIF OK as **thumb fuel** only where recipe allows (Lefos + Max primary; 3XN related optional; Sacred rare).  
4. `prefers-reduced-motion` → poster still.  
5. Never copy Max layout into Lefos chrome or reverse.

---

## Apply checklist

When changing project previews:

- [ ] Which lab? Use that lab’s `S.card-*` only.  
- [ ] Plate size matches recipe (≥16rem / 42% where strip)?  
- [ ] Surface + typeface + outline match look?  
- [ ] Mobile stack rule followed?
