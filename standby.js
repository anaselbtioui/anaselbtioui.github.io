// #nobuild: Formspree inquiry form.

/* Formspree — https://formspree.io/f/xpqvblgj */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpqvblgj";

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

  if (endpoint) form.setAttribute("action", endpoint);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!endpoint) {
      if (news) news.textContent = "Email anaselbtioui@gmail.com";
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
        let detail = "Send failed — try email below.";
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
      if (news) news.textContent = "Sent.";
      submit.disabled = false;
    } catch {
      if (news) news.textContent = "Network error — try email below.";
      submit.disabled = false;
    }
  });
}

mountInquiryForm();
