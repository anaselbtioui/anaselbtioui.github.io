# Inspiration study: Huts (huts.com)

**Status:** Extracted · not applied.  
**Exemplar:** [huts.com](https://huts.com/?ref=siteinspire)  
**Evidence:** Live CSS tokens (2026-07-28).  
**Related:** [inspiration-ledger.md](inspiration-ledger.md), [inspiration-study-microsoft-ai.md](inspiration-study-microsoft-ai.md), [lab-card-recipes.md](lab-card-recipes.md).  
**Lab:** [lab/huts.html](../lab/huts.html)

**Why this exemplar (your words):** with microsoft.ai — soft coffee white · (implied) calm pastoral product storytelling.

---

## 1. Measured tokens

| Signal | Value |
|--------|--------|
| Page field | `#faf7ed` · near MAI coffee |
| Body ink | `#664a42` warm brown |
| Accent green | `#57772e` · deep `#0c310a` |
| Soft paper | `#fffdf6` · muted `#d0d4c8` |
| Dark ink | `#1e1414` |
| Display | HW Cigars (serif) |
| Sans | ABC Walter Neue |
| Content | Home-type grid · project case cards · testimonial strips · process narrative |

---

## 2. Cue extraction

| What you liked / observed | Cue ID | Signal |
|---------------------------|--------|--------|
| Soft coffee canvas (shared w/ MAI) | `C.field-coffee` | Warm parchment `#faf7ed` / `#FEF9ED` class |
| Warm brown reading ink | `C.ink-walnut` | `#664a42` on cream |
| Pastoral product catalog | `S.catalog-type-grid` | Equal tiles for “types” (Starter / Forever / …) — one job per tile |
| Soft green accent (action) | `C.accent-moss` | `#57772e` **filled** CTAs — core Huts (MAI forbids green) |
| Serif display + humanist sans | `T.serif-sans-pastoral` | Soft serif **heads only** · Outfit/Walter sans **body** |
| Project proof cards | `S.card-pastoral-project` | Photo-led tile · bed/bath/sqft meta · title under |
| Deep moss band | `C.moss-deep-band` | `#0c310a` process band — not Library Ink teal |

---

## 2b. Split vs Microsoft AI (do not blend)

| Huts | MAI |
|------|-----|
| Light field entire page | Dark Library Ink hero void |
| Moss filled buttons | Transparent wax-seal pills · no hue fill |
| Sans body copy | Serif body (manuscript) |
| Catalog of home types | Model/values editorial tiles |
| Pastoral photography | Soft illustration on apricot wash |
| Sharp/small radius CTAs | Extreme pill (~86px) |

---

## 3. Steal / Adapt / Avoid

### Steal

- Same coffee field family as MAI — **one shared light plane**.
- Catalog grid of offerings / project types (maps to portfolio case index).
- Moss accent sparingly on cream (alternative to acid Sacred yellow / teal paper).

### Adapt

- Licensed HW Cigars / ABC Walter → Fraunces + existing sans.
- Photography: keep `I.cool-doc` / archive GIF where labs demand; on coffee skin allow warmer pastoral stills **authored** (`I.no-stock`).
- Card chrome: follow [lab-card-recipes.md](lab-card-recipes.md) — new recipe `S.card-pastoral-project`, do not paste Max sage strip onto cream.

### Avoid

- Big rounded marketing cards with multi-layer shadows.
- Stock cabin lifestyle packs.
- Green as full field (kill coffee softness).

---

## 4. make-interfaces-feel-better notes (when applying)

| Principle | Apply |
|-----------|--------|
| Image outlines | On cream: `outline: 1px solid rgba(0,0,0,0.1)` |
| Hit area | “Learn about …” links ≥40px tall |
| Text wrap | Project titles `balance` · blurbs `pretty` |
| Scale on press | CTAs `scale(0.96)` · specific `transition-property` |
| Tabular nums | Sqft / bed / bath meta → `tabular-nums` |

---

## 5. Overlap with Microsoft AI

**Shared only:** warm coffee parchment family (`C.field-coffee`) + walnut-ish ink.

**Everything else splits** — see §2b. Labs must not look like twins.

---

## Next

1. Lab when you say **lab huts** (or combined **lab coffee** with both cue sets).  
2. Spec `S.card-pastoral-project` into [lab-card-recipes.md](lab-card-recipes.md) on apply.
