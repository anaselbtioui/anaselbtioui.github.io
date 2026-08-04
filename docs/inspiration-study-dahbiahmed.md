# Inspiration study: Ahmed Dahbi (dahbiahmed.com)

**Status:** Extracted · not applied.  
**Exemplar:** [dahbiahmed.com/#projects](https://dahbiahmed.com/#projects)  
**Evidence:** Live inspect 2026-08-04 · Astro bundle (`index.astro_*.js`, lazy `shelf.*.js`) · browser CDP  
**Related:** [inspiration-ledger.md](inspiration-ledger.md)  
**Lab:** *(not built — say **lab dahbi** when ready)*

**Why this exemplar (your words):** avatar following the cursor · 3D bookshelf.

---

## 1. What you notice → visual cues

| Signal | Cue ID | Measured / observed |
|--------|--------|---------------------|
| Portrait tracks pointer | `M.cursor-avatar` | 8-way look direction from cursor angle (`atan2` · 45° sectors) · **60px center dead zone** · 3-frame WebP transitions between directions · light/dark asset pairs |
| Projects / reading as objects | `S.project-shelf` | Side Projects = text list · **Bookshelf** = 9 volumes in WebGL · one **face-out** cover + spine stack · metaphor: browse physical shelf |
| Drag + keyboard shelf | `M.bookshelf-3d` | Horizontal drag browse · **← →** · **Enter** inspect · **Inspect ↗** button · counter **01 / 09** · tick progress rail |
| Accordion page spine | `S.accordion-terminal` | Single column · `>` / `ˇ` chevron headers · expand one section at a time · mono labels uppercase |
| Warm charcoal void | `C.field-charcoal-warm` | Page `#141414` · text `rgb(225,225,225)` · no grain · flat premium dark |
| Serif name + mono body | `T.serif-mono-personal` | **Fraunces** 36px display · **IBM Plex Mono** body/chrome |
| Lazy heavy WebGL | `M.lazy-webgl-chunk` | Shelf chunk (~575KB Three.js) **dynamic-import** on accordion open / pointerenter prefetch · not on first paint |
| Graceful shelf fallback | `S.shelf-fallback` | `#books-fallback` list stays in DOM · hidden when WebGL init succeeds · catch → remove `is-active` |
| Save-data / 2g gate | `M.connection-aware` | Skip prefetch when `saveData` or `2g` · `requestIdleCallback` warm otherwise |

---

## 2. Avatar mechanics (`M.cursor-avatar`)

**Not** a smooth 3D rig — a **directional sprite system**:

| Knob | Dahbi |
|------|-------|
| Directions | `center`, `top`, `top-right`, `right`, `bottom-right`, `bottom`, `bottom-left`, `left`, `top-left` |
| Assets | `/profile/nobg/{dir}.webp` + `black-{dir}.webp` (theme) |
| Transitions | `/profile/nobg/transitions/{from}_to_{to}_{1-3}.webp` · **3 frames** per edge |
| Mapping | Cursor vs avatar center → angle bucket · inside 60px radius → `center` |
| Interaction | `#avatar-wrap` clickable (help / alternate view) |
| Theme | Swap light/dark sprite sets on `data-theme` |

**Steal for you:** “presence” without WebGL — head **looks toward** visitor. **Adapt:** 4 directions + CSS ease instead of 16×3 frame sheets; or subtle **2D parallax** on a single portrait if no sprite shoot. **Avoid:** shipping 100+ WebP frames unless you commit to that asset pipeline.

---

## 3. Bookshelf mechanics (`M.bookshelf-3d`)

| Knob | Dahbi |
|------|-------|
| Stack | Custom WebGL (Three.js bundled in `shelf.*.js`) · canvas `.shelf-canvas` ~692×480 |
| Browse | Pointer drag on shelf · arrow buttons · spine strip of queued volumes |
| Focus | Selected volume **rotates face-out** with cover texture |
| Inspect | Pick up / inspect mode · outbound link on title |
| A11y | `role` region: *“Interactive three-dimensional shelf… Drag or use arrow keys… Press Enter to inspect”* |
| Reduced motion | `prefers-reduced-motion: reduce` read at init |
| Load UX | “assembling N volumes…” assembly state (observed in copy) |
| Fallback | Plain `<ul>` book list + links when WebGL fails |

**Steal for you:** **projects as volumes** — tactile browse beats another card grid. **Adapt:** lazy chunk · static spine row + one featured cover for `#nobuild` budget · map **your** lab projects to spines. **Avoid:** 575KB Three.js on hub first paint; no WebGL without list fallback.

---

## 4. Page structure (beyond the two likes)

| Section | Pattern |
|---------|---------|
| Hero | Circular avatar · Fraunces name · mono bio with inline company links |
| Nav | Accordion: About · Career · Advisory · Side Projects · Bookshelf |
| Side Projects | Expanded list — title bold · muted description · no thumbnails |
| CTA | White pill “How I can help” → full-screen help carousel (separate sprite system) |
| Footer | Twitter · LinkedIn · Email |

`#projects` hash lands on the accordion stack (Side Projects + Bookshelf territory) — not a separate route.

---

## 5. Color + type tokens

| Role | Value |
|------|-------|
| Field | `#141414` |
| Body text | `rgb(225, 225, 225)` |
| Display | Fraunces, Georgia, serif · 36px |
| UI / body | IBM Plex Mono, monospace |
| Accent | Orange tick on shelf progress · white pill CTA |

---

## 6. Steal / Adapt / Avoid (portfolio `#nobuild`)

| | Guidance |
|---|----------|
| **Steal** | Cursor-aware portrait · shelf metaphor for **Works** or **Reading** · accordion spine for long CV · lazy WebGL · list fallback |
| **Adapt** | Fraunces already in your stack — pair with mono chrome · Nordic `#1a1e23` field instead of `#141414` if applying dark skin · 4-way avatar or parallax · simplified shelf (CSS 3D or static face-out + spine strip) in lab first |
| **Avoid** | Three.js sitewide · no reduced-motion path · gradients/glass (Dahbi avoids these too) · blending with terminal Sacred or coffee MAI card recipes |

---

## 7. Card recipe (provisional)

`S.card-shelf-volume` — one featured **face-out** project (cover still or archive GIF) · spine queue for siblings · drag/arrow browse · inspect → case link. Distinct from `S.card-film-strip` (Lefos) and `S.card-term-block` (Sacred).

---

## 8. Implementation sketch (when labbing)

```
lab/dahbiahmed.html
├── Hero: simplified M.cursor-avatar (4-dir CSS or 2-frame crossfade)
├── Accordion: S.accordion-terminal (About / Work / …)
└── Bookshelf zone:
    ├── prefers-reduced-motion → S.shelf-fallback list
    └── else → optional Three.js chunk OR CSS perspective shelf prototype
```

---

## Next

1. Say **lab dahbi** to prototype avatar + shelf in `/lab/`.  
2. Or **apply** shelf metaphor only to Works section (no full Three.js).  
3. Or next exemplar + likes.
