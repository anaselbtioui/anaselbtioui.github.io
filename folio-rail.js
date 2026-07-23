// #nobuild: custom mist thumb — native OS trail cannot be killed on Linux.
/** @param {{ getY?: () => number, scrollTo?: (y: number) => void }} api */
export function wireFolioRail(api = {}) {
  if (!document.body.classList.contains("portfolio")) return null;

  let rail = document.querySelector(".folio-rail");
  if (!rail) {
    rail = document.createElement("div");
    rail.className = "folio-rail";
    rail.setAttribute("aria-hidden", "true");
    const el = document.createElement("div");
    el.className = "folio-rail-thumb";
    rail.appendChild(el);
    document.body.appendChild(rail);
  }

  const thumb = rail.querySelector(".folio-rail-thumb");
  if (!thumb) return null;

  let raf = 0;
  let dragging = false;
  let dragOffset = 0;

  const metrics = () => {
    const view = window.innerHeight;
    const total = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    );
    const limit = Math.max(0, total - view);
    const thumbH = Math.max(40, Math.min(view * 0.45, (view / total) * view));
    const maxTop = Math.max(0, view - thumbH);
    return { view, total, limit, thumbH, maxTop };
  };

  const readY = () => {
    const y = api.getY?.();
    return Number.isFinite(y) ? y : window.scrollY || 0;
  };

  const jumpTo = (y) => {
    if (typeof api.scrollTo === "function") api.scrollTo(y);
    else window.scrollTo(0, y);
  };

  const paint = () => {
    raf = 0;
    const { limit, thumbH, maxTop, total, view } = metrics();
    if (total <= view + 2) {
      rail.hidden = true;
      return;
    }
    rail.hidden = false;
    const y = readY();
    const top = limit > 0 ? (y / limit) * maxTop : 0;
    thumb.style.height = `${thumbH}px`;
    thumb.style.transform = `translate3d(0, ${top}px, 0)`;
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(paint);
  };

  thumb.addEventListener("pointerdown", (e) => {
    dragging = true;
    thumb.setPointerCapture(e.pointerId);
    dragOffset = e.clientY - thumb.getBoundingClientRect().top;
    rail.classList.add("is-dragging");
    e.preventDefault();
  });

  thumb.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const { maxTop, limit, thumbH } = metrics();
    const top = Math.max(0, Math.min(maxTop, e.clientY - dragOffset));
    const y = maxTop > 0 ? (top / maxTop) * limit : 0;
    jumpTo(y);
    thumb.style.height = `${thumbH}px`;
    thumb.style.transform = `translate3d(0, ${top}px, 0)`;
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    rail.classList.remove("is-dragging");
    try {
      thumb.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  thumb.addEventListener("pointerup", endDrag);
  thumb.addEventListener("pointercancel", endDrag);

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  schedule();

  return { update: schedule };
}
