(function () {
  "use strict";

  var toggle = document.getElementById("bleaching-toggle");
  var panel = document.getElementById("bleaching-panel");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    panel.classList.toggle("is-open", !open);
    toggle.textContent = "";
    var label = document.createElement("span");
    label.textContent = open ? "Specification and speed models " : "Hide specification ";
    var chevron = document.createElement("span");
    chevron.className = "chevron";
    chevron.textContent = "▾";
    toggle.appendChild(label);
    toggle.appendChild(chevron);
    if (!open) {
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
})();
