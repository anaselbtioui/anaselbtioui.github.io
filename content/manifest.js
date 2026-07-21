// #nobuild: explicit content index. No directory listing at runtime, so publishing
// = add the file's site-root-absolute path here. Templates stay out on purpose.
// Paths are absolute from the site root so any page (/ or /personal/) can fetch them.

// Each project: { path, cover?, featured? }
//   cover    — optional image path (e.g. "/content/projects/media/crm.png").
//              Present => gallery card with image; absent => editorial text card.
//   featured — optional; true makes the card span the full grid width (hero).
// PLACEHOLDER projects for layout testing — replace with real work before ship.
export const projects = [
  {
    path: "/content/projects/2025-11-12-harbor-crm.md",
    cover: "/content/projects/media/harbor-crm.jpg",
    featured: true,
  },
  {
    path: "/content/projects/2025-08-03-ledger-scrape.md",
    cover: "/content/projects/media/ledger-scrape.jpg",
  },
  {
    path: "/content/projects/2026-02-18-shelf-voice.md",
    cover: "/content/projects/media/shelf-voice.jpg",
  },
  {
    path: "/content/projects/2025-04-22-quiet-desk.md",
  },
];

export const journal = [
  { path: "/content/journal/2026-05-05-next-step-template-smell-test.md" },
  { path: "/content/journal/2026-05-04-insight-voice-without-manifesto.md" },
  { path: "/content/journal/2026-05-03-failure-about-page-portrait.md" },
  { path: "/content/journal/2026-05-02-experiments-hero-moment.md" },
  { path: "/content/journal/2026-05-01-origin-why-reduction.md" },
];
