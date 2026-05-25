const e=`# Experiments: One Memorable Moment, Ten Seconds

Date: 2026-05-02
Tags: process-note, design

## Question
How do I make a first impression that feels like craft, not gimmick?

## Attempt
I prototyped a hero scene with only circle + line: an orbit and a single axis line. I tuned motion to two modes: reading (almost still) and transition (noticeable). I tested three timings: 320ms, 480ms, 640ms for section entry.

## Failure
Fast motion looked like UI decoration. Slow motion looked like nothing. Middle speed worked, but only when tied to scroll progress; autoplay felt fake.

## Insight
Motion needs a reason. Scroll is a reason because it reflects intent: user moves, form responds.

## Artifact
- snippet: CSS \`@keyframes orbit\` timing notes (placeholder)
- screenshot: three hero variants side by side (placeholder)

## Humility Line
What I still do not know: exact threshold where “subtle” becomes “invisible” across devices.

## Next Step
Add a scroll-linked progress value (even if simple) and retest with \`prefers-reduced-motion\`.
`;export{e as default};
