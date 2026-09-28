// #nobuild: thin case catalog for standby case pages.
// Only projects with a case entry are linkable from home.
// Private GitHub stays off. Live URLs only when already public elsewhere on the site.

export const cases = [
  {
    slug: "ghizou",
    title: "Ghizou",
    line: "Side project: tools that help close an accounting month.",
    body: [
      "Built for a concrete job — get transactions ready to export, not another generic finance dashboard.",
      "Wine field and pear mascot carry the line: close the month without noise.",
    ],
    group: "Side projects",
    gif: "./media/work/ghizou.gif?v=1",
    poster: "./media/work/ghizou-poster.webp?v=1",
  },
  {
    slug: "profit-flow",
    title: "Profit Flow Academy",
    line: "Side project: landing for trading mentorship.",
    body: [
      "A public face for Profit Flow Academy — mentorship that aims at getting traders funded.",
      "The plate is the brand mark and the line people land on first.",
    ],
    group: "Side projects",
    gif: "./media/work/profit-flow.gif?v=1",
    poster: "./media/work/profit-flow-poster.webp?v=1",
    live: "https://profit-flow-academy.vercel.app",
  },
];

export function findCase(slug) {
  const i = cases.findIndex((c) => c.slug === slug);
  if (i < 0) return null;
  return { entry: cases[i], index: i };
}

export function caseHref(slug) {
  return `./case.html?p=${encodeURIComponent(slug)}`;
}
