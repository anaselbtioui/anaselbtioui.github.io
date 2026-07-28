// #nobuild: standby CLI loader + Formspree inquiry form.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Paste your Formspree form URL after creating one at https://formspree.io
   Example: https://formspree.io/f/mqkjwxyz
   Also set the same URL on <form id="inquiry" action="…">. */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpqvblgj";

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

function resolveEndpoint(form) {
  const fromConst = FORMSPREE_ENDPOINT && !FORMSPREE_ENDPOINT.includes("REPLACE_ME")
    ? FORMSPREE_ENDPOINT
    : "";
  const fromAction = form?.getAttribute("action") || "";
  const actionOk = fromAction && !fromAction.includes("REPLACE_ME") ? fromAction : "";
  return fromConst || actionOk || "";
}

function mountInquiryForm() {
  const form = document.getElementById("inquiry");
  if (!form) return;

  const news = form.querySelector("[data-form-news]");
  const submit = form.querySelector("[data-submit]");
  const endpoint = resolveEndpoint(form);

  if (!endpoint) {
    if (news) {
      news.textContent = "Formspree not wired yet — use email below.";
    }
  } else {
    form.setAttribute("action", endpoint);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!endpoint) {
      if (news) news.textContent = "Formspree endpoint missing. Email anaselbtioui@gmail.com.";
      return;
    }

    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    fd.delete("_gotcha");

    submit.disabled = true;
    if (news) news.textContent = "Sending…";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });

      if (!res.ok) {
        let detail = "Send failed — try again or email directly.";
        try {
          const data = await res.json();
          if (data?.error) detail = String(data.error);
        } catch {
          /* keep default */
        }
        if (news) news.textContent = detail;
        submit.disabled = false;
        return;
      }

      form.reset();
      if (news) news.textContent = "Sent. I’ll reply by email.";
      submit.disabled = false;
    } catch {
      if (news) news.textContent = "Network error — try again or email directly.";
      submit.disabled = false;
    }
  });
}

mountOneLine();
mountInquiryForm();
