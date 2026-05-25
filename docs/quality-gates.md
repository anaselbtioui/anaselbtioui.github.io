# Quality Gates

Use this before every release and monthly design review.

## 1) Distinct silhouette test
- Take full-page screenshot.
- Convert to grayscale.
- Hide logo/name.
- Ask: still recognizable as this site in 3 seconds?
- If no: redesign hero composition and shape rhythm.

## 2) Voice identity test
- Remove author name from three pages.
- Ask peer to guess if same writer.
- If voice feels generic, replace abstract lines with concrete process evidence.

## 3) Craft test
- Validate spacing rhythm against 8px scale.
- Confirm type hierarchy remains clear across breakpoints.
- Verify circle/line motifs are consistent and intentional.
- Remove decorative elements that do not carry meaning.

## 4) Accessibility test
- Keyboard navigation on all interactive controls.
- Visible focus states for links/buttons.
- Semantic heading order and landmark usage.
- `prefers-reduced-motion` respected.
- Color contrast check for text and UI states.

## 5) Performance test
- Target LCP below 2.5s on mid hardware/network.
- Maintain smooth interaction and animation at 60fps target.
- Avoid heavy visual effects and oversized media.
- Keep initial page weight minimal.

## 6) Originality guardrail test
- Compare against three recent portfolio references.
- If layout feels familiar in first 3 seconds, rework structure.
- Reject cloned SaaS hero patterns.
- Reject generic portrait-led About sections without context.

## Release gate
Ship only when all six sections pass.
