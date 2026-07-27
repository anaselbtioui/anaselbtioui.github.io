// #nobuild: cue lab — layer toggles for mesh stage.

const stage = document.getElementById("stage");
const fxBtn = document.getElementById("fx-toggle");

function setLayer(name, on) {
  if (!stage) return;
  stage.dataset[name] = on ? "on" : "off";
}

document.querySelectorAll(".layer-toggles input[data-layer]").forEach((input) => {
  input.addEventListener("change", () => {
    setLayer(input.dataset.layer, input.checked);
    if (input.dataset.layer === "shade" && fxBtn) {
      fxBtn.setAttribute("aria-pressed", input.checked ? "true" : "false");
    }
  });
});

const burnToggle = document.getElementById("grain-burn");
if (burnToggle && stage) {
  burnToggle.addEventListener("change", () => {
    stage.dataset.grainBlend = burnToggle.checked ? "burn" : "soft";
  });
}

if (fxBtn) {
  fxBtn.addEventListener("click", () => {
    const shadeInput = document.querySelector('input[data-layer="shade"]');
    const next = stage?.dataset.shade !== "on";
    setLayer("shade", next);
    fxBtn.setAttribute("aria-pressed", next ? "true" : "false");
    if (shadeInput) shadeInput.checked = next;
  });
}
