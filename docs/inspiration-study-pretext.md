# Inspiration study: Pretext (@chenglou/pretext)

**Status:** Extracted · lab live.  
**Exemplar:** [github.com/chenglou/pretext](https://github.com/chenglou/pretext) · demos [chenglou.me/pretext](https://chenglou.me/pretext/)  
**Evidence:** README API · jsDelivr `@chenglou/pretext@0.0.8/+esm` · lab 2026-08-04  
**Related:** [inspiration-ledger.md](inspiration-ledger.md)  
**Lab:** [lab/pretext.html](../lab/pretext.html)

**Why this exemplar:** Try something with Pretext — text measure/layout without DOM reflow.

---

## 1. What it is

Pure JS/TS multiline text measurement. Uses canvas font engine as ground truth. Side-steps `getBoundingClientRect` / `offsetHeight` reflow for height prediction, shrinkwrap, virtualization, obstacle flow.

Needs `Intl.Segmenter` + Canvas 2D `measureText`.

---

## 2. Cue extraction

| Signal | Cue ID | Notes |
|--------|--------|-------|
| Height without DOM measure | `M.pretext-measure` | `prepare` once · `layout(prepared, maxWidth, lineHeight)` → `{ height, lineCount }` |
| Multiline shrink wrap | `M.pretext-shrinkwrap` | `measureLineStats` / `walkLineRanges` → `maxLineWidth` sizes container to widest line |
| Variable-width line routing | `M.pretext-line-flow` | `layoutNextLineRange` + `materializeLineRange` — obstacle / float / multi-column |
| Manual canvas/SVG lines | `M.pretext-canvas-lines` | `prepareWithSegments` + `layoutWithLines` |
| Instrument lab chrome | `S.instrument-panel` | Dark panel · range + tabular stats · prove the math |

---

## 3. #nobuild import

```js
import { prepare, layout } from 'https://cdn.jsdelivr.net/npm/@chenglou/pretext@0.0.8/+esm'
```

Prefer jsDelivr `+esm` (bundled). Pin version. MIT license.

---

## 4. Steal / Adapt / Avoid

| | |
|--|--|
| **Steal** | Predicted card/case heights · chat/bubble shrinkwrap · scroll re-anchor when copy loads · AI-time overflow checks |
| **Adapt** | Sync `font` string + `lineHeight` with real CSS · wait `document.fonts.ready` · named fonts (avoid `system-ui` on macOS) |
| **Avoid** | Calling `prepare()` every frame · treating as full CSS inline engine · rich-inline for nested markup trees |

---

## 5. Lab demos shipped

1. Width slider → `layout()` height on a box  
2. Shrinkwrap bubbles via `measureLineStats`  
3. Canvas lines via `layoutWithLines`  
4. Circle obstacle via `layoutNextLineRange`

---

## Next

1. **apply** shrinkwrap / predicted height to a portfolio case or Works row.  
2. Or next exemplar.
