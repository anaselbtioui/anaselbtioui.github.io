// #nobuild: standby mono CLI loader (Sacred M.one-line-cli / M.block-spinner cues).

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CLI_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const CLI_WORDS = ["Building", "Shaping", "Tuning", "Drafting", "Locking"];
const CLI_DOTS = ["﹒", "﹒﹒", "﹒﹒﹒"];

function mountOneLine() {
  const el = document.querySelector("[data-one-line]");
  if (!el) return;
  const spin = el.querySelector("[data-ol-spin]");
  const word = el.querySelector("[data-ol-word]");
  const dots = el.querySelector("[data-ol-dots]");
  const time = el.querySelector("[data-ol-time]");
  let fi = 0;
  let wi = 0;
  let di = 0;
  const start = performance.now();

  if (reduceMotion) {
    if (spin) spin.textContent = CLI_FRAMES[0];
    if (word) word.textContent = CLI_WORDS[0];
    if (dots) dots.textContent = CLI_DOTS[2];
    if (time) time.textContent = "(…)";
    return;
  }

  window.setInterval(() => {
    fi = (fi + 1) % CLI_FRAMES.length;
    if (fi === 0) wi = (wi + 1) % CLI_WORDS.length;
    di = (di + 1) % CLI_DOTS.length;
    if (spin) spin.textContent = CLI_FRAMES[fi];
    if (word) word.textContent = CLI_WORDS[wi];
    if (dots) dots.textContent = CLI_DOTS[di];
    if (time) time.textContent = `(${Math.round(performance.now() - start)}ms)`;
  }, 80);
}

mountOneLine();
