# Inspiration study: Max Milkin (maxmilkin.com)

**Status:** Applied to commercial `/` (adapted Max grammar). Personal `/personal/` unchanged.

**Applied:** 2026-07-17 — sage/ink tokens, Space Grotesk + IBM Plex Mono, case strips, CSS motion only.

**Exemplar:** [maxmilkin.com](https://maxmilkin.com/)  
**Lab:** [lab/maxmilkin.html](../lab/maxmilkin.html)  
**Sources:** live site (OG + CSS/JS bundles), [Awwwards SOTD](https://www.awwwards.com/sites/max-milkin-portfolio), [Codrops case study](https://tympanus.net/codrops/2025/12/02/two-portfolios-one-process-where-design-motion-and-code-come-together/), DesignRush/Are.na blurbs, cofolios case-study spine, [docs/visual-grammar.md](visual-grammar.md), [docs/narrative-thesis.md](narrative-thesis.md), make-interfaces-feel-better.

**Why this exemplar:** Performance-first *developer* portfolio (not design-intern flash). Two-color discipline. Motion framed as meaning. Not Brittany sticky-rail.

---

## 1. Anatomy (home IA)

| Zone | What Max does | Notes for you |
|------|---------------|---------------|
| Loader | PixiJS text rings + % counter → fade to main | Personality ritual; heavy WebGL |
| Header | Wordmark left (`MAX MILKIN`); nav right: About · Awards · Works · Expertise · Contact | 5 top-level choices — high nav cost |
| Hero | Full-bleed 3D scene (sage ground + stone/object); short manifesto line (“Minimalism is not emptiness, it’s essence”) | Beauty = craft object + space, not card chrome |
| Works / case | Dedicated `case` surfaces: title, type, description, awards, slider, next project | Process + artifact, not title-only dump |
| About | Photo + assembling-paragraph scroll story; life/expertise blocks | Storytelling depth |
| Awards / Expertise | Numbered rows, skill lists | Proof strips |
| Contact / Footer | Form + socials + designer credit | Close the loop |

**First-fold Vision (≤3 ideas):** who (Max) · what craft (creative frontend) · attitude (minimal = essence). Work is *reachable* from nav, not crammed into fold.

**Navigation cost:** 5 items before work. For your commercial `/`, keep **≤3** (Projects · Contact · Personal) — you already do this; keep it.

---

## 2. Type + color tokens

### Color (Awwwards-documented + CSS)

| Token | Hex | Role |
|-------|-----|------|
| Ink | `#10120F` | Text / dark UI |
| Sage | `#C2CABB` | Field / atmosphere (hero “floor”) |
| Supporting (CSS) | `#3b4039`, `#d2d8cb`, `#0b0c0a`, white | Depth steps, not a third brand hue |
| System blue | `#007aff` | Likely form/focus OS — ignore |

**Grammar fit:** Matches visual-grammar “max three semantic colors.” Accent appears as *field + wordmark contrast*, not rainbow tags.

### Type (from CSS / Codrops)

| Role | Family | Use |
|------|--------|-----|
| Display / UI sans | Inter (bundle), RF Dewi (loader text) | Uppercase nav, wordmark weight |
| Display alt | Bebas Neue (present in CSS) | Possibly section/display moments |

**Your constraint:** max two typefaces. If adapting: **one grotesque display/body + one mono for labels** (e.g. Space Grotesk or similar + IBM Plex Mono). Do **not** ship Inter (your frontend design rules / avoid default stacks). Do **not** keep Fraunces+Outfit+mono (3 families) on portfolio if locking Max grammar.

---

## 3. Work presentation

From CSS/JS class map: `case__title`, `case__type`, `case__description`, `case__awards`, `case__slider`, `typesOfWork`, “Next project”, “back to home”.

**Pattern:**
- Work is a **dedicated case surface**, not a flat card grid alone
- Meta = **type of work** + awards proof
- Description = short narrative (problem/intent), not only a pretty thumbnail
- Gallery/slider for evidence when artifacts exist
- Clear next/prev between cases

**Cofolios spine check (content, not chrome):**

| Spine step | Max | Your `content/projects` template |
|------------|-----|----------------------------------|
| Problem / overview | Case description | Problem section |
| Role | Implicit (solo creative FE) | Role in snapshot |
| Process | Motion/3D *is* the process showcase | Process subsections |
| Outcome | Awards + shipped cases | Outcome |
| Unresolved / reflection | Soft (portfolio-as-craft) | Reflection — keep this; Max underplays it |

**Empty-state implication (you have 0 published projects):** Max’s beauty depends on 3D hero + real cases. With no projects, cloning his gallery looks hollow. Until content lands: **editorial list + one strong statement**; optional abstract line/circle motif (your primitives) instead of fake screenshots or rock WebGL.

---

## 4. Motion budget (what Max does vs what you can ship)

| Max move | Intent | `#nobuild` adapt? |
|----------|--------|-------------------|
| PixiJS loader rings | Calm “alive” entry | **Avoid** — WebGL tax |
| Letter-path paragraph assemble (GSAP MotionPath) | Chaos → structure metaphor | **Adapt** — stagger fade/slide of lines/words in CSS only (180–240ms read / 420–560ms section per your grammar) |
| Blender 3D hero + scroll room | Immersive proof of craft | **Avoid** as requirement; **Adapt** atmosphere via flat field color + one real cover when you have it |
| Soft hero letter stagger from center | Entry hierarchy | **Steal** — CSS stagger on hero / intro chunks |
| ScrollTrigger scrub | Motion tied to scroll | **Adapt** lightly or skip; prefer interruptible hover/focus transitions |

**Ship budget for `/` if you apply (2–3 moves only):**
1. Intro split-stagger (kicker → hero → lede)
2. Work rows/pieces enter with subtle `translateY` + opacity, stagger ~80–100ms
3. Hover: title/accent color + cover scale ≤1.03 (interruptible; specific `transition-property`)

Respect `prefers-reduced-motion` (you already global-mute).

---

## 5. Scores

### Awwwards lens (home)

| Axis | Score (1–5) | Note |
|------|-------------|------|
| Design | 5 | Extreme restraint; object + type + space |
| Usability | 4 | Clear nav; loader may delay content; heavy for slow nets |
| Creativity | 5 | 3D+type as identity |
| Content | 3–4 | Strong craft story; less “problem→outcome” recruiter spine than cofolios Shopify cases |

### make-interfaces-feel-better

| Principle | Max | Steal / Adapt / Avoid for you |
|-----------|-----|-------------------------------|
| Shadows over borders | Depth from light/3D, not card borders | **Adapt** — soft layered shadows only if cards stay; else hairlines/fields |
| Image outlines | N/A on hero rock | **Steal** when covers exist: `1px` pure black/white outline |
| Split & stagger enter | Yes (hero letters, sections) | **Steal** |
| Interruptible transitions | GSAP scrub + soft eases | **Adapt** — CSS cubic-bezier only |
| Tabular nums | Awards numbers | **Steal** on counts / indices |
| Text wrap | Tight uppercase UI | **Steal** balance on hero; pretty on body |
| Hit areas | Nav text may be tight | **Steal+fix** — keep ≥40px (you already) |
| No `transition: all` | Likely specific in GSAP | **Steal** — keep property lists |
| Scale on press | Soft, not bouncy | **Steal** `0.96` on buttons |
| Concentric radius | Mostly sharp / scene-based | **Adapt** — if soft cards, outer = inner + padding |

### Your visual-grammar / thesis

| Rule | Max | Verdict |
|------|-----|---------|
| Max 2 typefaces | Borderline (Inter + Dewi + Bebas) | Tighten to 2 |
| No gradients / glass | Hero is lit 3D, not CSS glass | OK; avoid fake glass |
| Circle + line primitives | Rings in loader = circle motif | **Adapt** circle/line as quiet motif, not Pixi rings |
| Motion explains structure | Strong | Keep |
| Evidence over declarations | Case + awards = evidence; manifesto line is poetic | Keep manifesto short; lean on project evidence |
| Anti-Brittany | No sticky dual column | Good |

---

## 6. Steal-list (concrete — not applied yet)

If you say **apply**, change commercial `/` toward this grammar:

| # | Change | Target files |
|---|--------|--------------|
| 1 | Tokens: `--bg` / field `#C2CABB` (or near), `--fg` `#10120F`, drop teal paper / Fraunces light-studio look | [styles.css](../styles.css) `body.portfolio` |
| 2 | Type: 2 families only — geometric grotesque + mono labels; uppercase quiet nav | [index.html](../index.html) font links; CSS vars |
| 3 | Hero: one Vision line + short lede; generous negative space; optional flat sage field (no WebGL rock) | [index.html](../index.html) |
| 4 | Work: prefer **magazine rows or case strips** with `type · title · one problem line`; cover optional upgrade | [portfolio.js](../portfolio.js) |
| 5 | Motion: 2–3 CSS moves only (intro stagger, row stagger, hover) | [styles.css](../styles.css) |
| 6 | Keep nav ≤3 links; personal space link stays quiet | [index.html](../index.html) |
| 7 | Empty state: editorial honesty, not fake gallery cards | [portfolio.js](../portfolio.js) |

### Avoid (do not copy)

- Pixi/Three/Blender hero as a dependency  
- 5-item top nav  
- Brittany sticky rail  
- Inter as the face of the site  
- Purple glow / cream+terracotta AI defaults  
- Motion that blocks reading the job statement  

### Adapt (idea yes, implementation light)

- “Chaos → structure” → CSS line/word reveal, not MotionPath  
- Immersive field → solid sage (or ink) canvas + one real cover later  
- Awards strip → optional later when you have external proof  

---

## 7. Gaps (stack / content)

| Max has | You have / need |
|---------|-----------------|
| React + GSAP + Pixi + Three | `#nobuild` static ES modules only |
| Designed 3D identity object | None — don’t fake it |
| Multiple shipped cases + awards | Manifest projects empty |
| Designer–dev duo polish | Solo; process honesty > spectacle |

**Bottom line:** Steal **restraint, 2-color field, type hierarchy, short manifesto, case spine**. Do not steal the **WebGL portfolio-as-demo**.

---

## 8. Decision gate

Reply with one:

1. **apply** — restyle `/` to adapted Max grammar (steal-list above)  
2. **different exemplar** — name one (or ask for a new pick)  
3. **hybrid** — e.g. Max tokens + cofolios case spine + keep current gallery shell  

No code until you choose.
