// #nobuild: contact-sheet strip — drag to pan, centered plate goes live.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function wireWorkStrip() {
  const track = document.querySelector("[data-strip-track]");
  if (!track) return null;

  const cards = Array.from(track.querySelectorAll("[data-strip-card]"));

  let raf = 0;
  let dragging = false;
  let startX = 0;
  let startLeft = 0;
  let moved = 0;

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

  track.addEventListener("pointerdown", (event) => {
    // Touch already pans natively; hijacking it would double the movement.
    if (event.pointerType !== "mouse" || event.button !== 0 || span() <= 8) return;
    dragging = true;
    moved = 0;
    startX = event.clientX;
    startLeft = track.scrollLeft;
    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    track.scrollLeft = startLeft - dx;
  });

  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture?.(event.pointerId)) track.releasePointerCapture(event.pointerId);
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
