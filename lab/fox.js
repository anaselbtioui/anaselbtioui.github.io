// #nobuild: Fox den variant — Formspree inquiry only.

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpqvblgj";

function resolveEndpoint(form) {
  const fromConst =
    FORMSPREE_ENDPOINT && !FORMSPREE_ENDPOINT.includes("REPLACE_ME")
      ? FORMSPREE_ENDPOINT
      : "";
  const fromAction = form?.getAttribute("action") || "";
  const actionOk =
    fromAction && !fromAction.includes("REPLACE_ME") ? fromAction : "";
  return fromConst || actionOk || "";
}

function mountInquiryForm() {
  const form = document.getElementById("inquiry");
  if (!form) return;

  const news = form.querySelector("[data-form-news]");
  const submit = form.querySelector("[data-submit]");
  const endpoint = resolveEndpoint(form);

  if (endpoint) form.setAttribute("action", endpoint);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!endpoint) {
      if (news) news.textContent = "Form endpoint missing.";
      return;
    }
    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    if (news) news.textContent = "Sending…";
    if (submit) submit.disabled = true;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      if (news) news.textContent = "Sent. I’ll write back.";
    } catch {
      if (news) news.textContent = "Send failed. Try email instead.";
    } finally {
      if (submit) submit.disabled = false;
    }
  });
}

mountInquiryForm();
