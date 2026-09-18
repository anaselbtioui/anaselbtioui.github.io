// #nobuild: thin case catalog for standby case pages.
// Only projects with a case entry are linkable from home.
// Private GitHub stays off. Live URLs only when already public elsewhere on the site.

export const cases = [
  {
    slug: "hamssah",
    title: "Hamssah",
    line: "Storefront, API, and ERP for a retail business.",
    body: [
      "Customers buy on the storefront. The team runs stock, orders, and catalog in the ERP. An API keeps the two honest.",
      "One design language across those surfaces so the same product does not feel like three apps.",
    ],
    group: "Business",
    gif: "./media/work/hamssah.gif?v=1",
    poster: "./media/work/hamssah-poster.webp?v=1",
    live: "https://hamssah.com",
  },
  {
    slug: "wa-pharma",
    title: "W.A. Pharma",
    line: "Landing, API, and ERP for a distribution business.",
    body: [
      "Public face for partnerships on the commercial site. Ops run through the API and admin ERP behind it.",
      "Same stack family as other business work here — landing is the plate people can open.",
    ],
    group: "Business",
    gif: "./media/work/wa-pharma.gif?v=1",
    poster: "./media/work/wa-pharma-poster.webp?v=1",
  },
  {
    slug: "phikra",
    title: "Phikra",
    line: "Landing page that launches the Phikra agency idea.",
    body: [
      "The deliverable is the site — a public face people can open when someone asks what Phikra is.",
      "I did not create the brand. The mark already existed; the work was putting the idea on the web.",
    ],
    group: "Business",
    gif: "./media/work/phikra.gif?v=6",
    poster: "./media/work/phikra-poster.webp?v=6",
    live: "https://phikra.com",
  },
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
];

export function findCase(slug) {
  const i = cases.findIndex((c) => c.slug === slug);
  if (i < 0) return null;
  return { entry: cases[i], index: i };
}

export function caseHref(slug) {
  return `./case.html?p=${encodeURIComponent(slug)}`;
}
