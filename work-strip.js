// #nobuild: contact-sheet strip — drag to pan, centered plate goes live.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function wireOneStrip(track) {
  const cards = Array.from(track.querySelectorAll("[data-strip-card]"));

  let raf = 0;
  let pending = false;
  let dragging = false;
  let startX = 0;
  let startLeft = 0;
  let moved = 0;
  let activePointer = null;

  const span = () => track.scrollWidth - track.clientWidth;

  const paint = () => {
    track.style.cursor = span() > 8 ? "" : "default";

    if (!reduceMotion) {
      const mid = track.scrollLeft + track.clientWidth / 2;
      let live = null;
      let best = Infinity;
      for (const card of cards) {
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
        if (distance < best) {
          best = distance;
          live = card;
        }
      }
      for (const card of cards) card.classList.toggle("is-live", card === live);
    }
  };

  const schedule = () => {
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      raf = 0;
      paint();
    });
  };

  track.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  // Start pan only after a small move so plate links still click.
  // Pointer down on a link never arms drag — the whole card is the hit target.
  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || span() <= 8) return;
    if (event.target.closest?.("a[href]")) return;
    pending = true;
    dragging = false;
    moved = 0;
    activePointer = event.pointerId;
    startX = event.clientX;
    startLeft = track.scrollLeft;
  });

  track.addEventListener("pointermove", (event) => {
    if (!pending || event.pointerId !== activePointer) return;
    const dx = event.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    if (!dragging) {
      if (moved <= 6) return;
      dragging = true;
      track.classList.add("is-dragging");
      track.setPointerCapture(event.pointerId);
    }
    track.scrollLeft = startLeft - dx;
  });

  const endDrag = (event) => {
    if (!pending || event.pointerId !== activePointer) return;
    pending = false;
    activePointer = null;
    if (dragging) {
      dragging = false;
      track.classList.remove("is-dragging");
      if (track.hasPointerCapture?.(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
    }
  };

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  // Swallow the click that ends a drag so plates never trigger on a pan.
  track.addEventListener("click", (event) => {
    if (moved > 6) {
      event.preventDefault();
      event.stopPropagation();
      moved = 0;
    }
  });

  track.addEventListener("keydown", (event) => {
    const step = cards[0]?.offsetWidth ?? track.clientWidth * 0.8;
    const keys = {
      ArrowRight: () => track.scrollBy({ left: step, behavior: "smooth" }),
      ArrowLeft: () => track.scrollBy({ left: -step, behavior: "smooth" }),
      Home: () => track.scrollTo({ left: 0, behavior: "smooth" }),
      End: () => track.scrollTo({ left: span(), behavior: "smooth" }),
    };
    const move = keys[event.key];
    if (!move) return;
    event.preventDefault();
    move();
  });

  paint();
  return { paint };
}

export function wireWorkStrip() {
  const tracks = Array.from(document.querySelectorAll("[data-strip-track]"));
  if (!tracks.length) return null;
  return tracks.map(wireOneStrip);
}
