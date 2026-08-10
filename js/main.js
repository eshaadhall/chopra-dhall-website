(function () {
  "use strict";

  var HOTSPOTS = [
    { id: "centering", eyebrow: "Combi steamer outlet", label: "Centering device", x: 9, y: 55,
      bullets: ["Unique centering configuration at Combi Steamer outlet", "E+L SS centering device", "Creaseless run into the treatment zones"] },
    { id: "dosing", eyebrow: "Chemical preparation", label: "Dosing station", x: 25, y: 38,
      bullets: ["Five-stage flowmeter-controlled auto-dosing", "Proportionate valve configuration", "Dosing Pump & pH Sensor — Prominent, Flowmeter — E+H"] },
    { id: "steam", eyebrow: "Thermal treatment", label: "Steam conditioning station", x: 41, y: 60,
      bullets: ["Conditions steam for optimal temperature and saturation", "Steam Traps — Forbes Marshall", "Feeds directly into the padder for uniform impregnation"] },
    { id: "padder", eyebrow: "Impregnation", label: "Finishing padder", x: 57, y: 42,
      bullets: ["Heavy-duty finishing padder", "Uniform moisture and high squeeze pre-impregnation", "Sets fabric moisture ahead of the treatment bath"] },
    { id: "rolls", eyebrow: "Fabric transport", label: "200mm guide rolls", x: 73, y: 58,
      bullets: ["Large 200mm dia stainless steel guide rolls", "Creaseless run across the full line", "S.S. nuts and bolts throughout the body construction"] },
    { id: "output", eyebrow: "Line output", label: "Output & line speed", x: 90, y: 45,
      bullets: ["Line models available at 40 / 60 / 80 mts/min", "Switchgears — Schneider, AC Inverters — Lenze", "Automation reports back to the Smart Solutions platform"] }
  ];

  var FABRIC_CLASSES = ["Wovens", "Denim", "Knits"];
  var VERTICALS = ["Singeing & Desizing", "Continuous Bleaching", "Continuous Mercerizing", "CPB Dyeing", "Continuous Washing", "Stenter", "Compressive Shrinking", "Two-Bowl Calendar"];
  var VOLUMES = ["Up to 50,000 mts/day", "50,000–75,000 mts/day", "75,000–100,000 mts/day", "100,000+ mts/day"];
  var PORTS = ["Bangladesh", "Turkey", "Vietnam", "Indonesia", "Thailand", "Poland", "Bulgaria", "Nigeria", "Tanzania", "Sri Lanka", "Brazil", "Peru", "Egypt", "Mexico"];
  var STEP_TITLES = ["What fabric class does this line run?", "Which machinery vertical?", "Intended production volume?", "Global destination port?", "Contact details"];
  var TRUST_LOGOS = ["Lenze", "Schneider", "Forbes Marshall", "Festo", "SMC", "E+L", "Prominent", "Endress+Hauser", "Pleva", "L&T"];

  // ---- Header scroll state ----
  var header = document.getElementById("site-header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll);
  onScroll();

  // ---- Animated stats ----
  (function animateStats() {
    var start = performance.now();
    var duration = 1100;
    var installEl = document.getElementById("stat-installations");
    var countryEl = document.getElementById("stat-countries");
    function tick(now) {
      var p = Math.min(1, (now - start) / duration);
      var ease = 1 - Math.pow(1 - p, 3);
      installEl.textContent = Math.round(2500 * ease).toLocaleString() + "+";
      countryEl.textContent = String(Math.round(30 * ease));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  // ---- Marquee ----
  (function buildMarquee() {
    var track = document.getElementById("marquee-track");
    var logos = TRUST_LOGOS.concat(TRUST_LOGOS);
    track.innerHTML = logos.map(function (t) {
      return '<span>' + t + '</span>';
    }).join("");
  })();

  // ---- Schematic hotspots ----
  var activeHotspotId = "centering";
  var schematic = document.getElementById("schematic");
  var chipRow = document.getElementById("chip-row");

  function renderHotspots() {
    var existing = schematic.querySelectorAll(".cdg-hotspot");
    existing.forEach(function (el) { el.remove(); });

    HOTSPOTS.forEach(function (h, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cdg-hotspot" + (h.id === activeHotspotId ? " is-active" : "");
      btn.style.left = h.x + "%";
      btn.style.top = h.y + "%";
      btn.setAttribute("aria-label", h.label);
      btn.textContent = String(i + 1);
      btn.addEventListener("click", function () {
        activeHotspotId = h.id;
        renderHotspots();
        renderSpecCard();
        renderChips();
      });
      schematic.appendChild(btn);
    });
  }

  function renderSpecCard() {
    var active = HOTSPOTS.find(function (h) { return h.id === activeHotspotId; }) || HOTSPOTS[0];
    document.getElementById("spec-eyebrow").textContent = active.eyebrow;
    document.getElementById("spec-label").textContent = active.label;
    var bulletsEl = document.getElementById("spec-bullets");
    bulletsEl.innerHTML = active.bullets.map(function (b) {
      return '<div><span class="dash">—</span><span>' + b + '</span></div>';
    }).join("");
  }

  function renderChips() {
    chipRow.innerHTML = "";
    HOTSPOTS.forEach(function (h, i) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "cdg-chip" + (h.id === activeHotspotId ? " is-active" : "");
      chip.textContent = (i + 1) + ". " + h.label;
      chip.addEventListener("click", function () {
        activeHotspotId = h.id;
        renderHotspots();
        renderSpecCard();
        renderChips();
      });
      chipRow.appendChild(chip);
    });
  }

  renderHotspots();
  renderSpecCard();
  renderChips();

  // ---- RFQ multi-step form ----
  var rfqState = {
    step: 0,
    fabricClass: null,
    vertical: null,
    volume: null,
    port: null,
    otherPort: "",
    contact: { name: "", company: "", email: "", phone: "", notes: "" },
    submitted: false
  };

  var stepPanels = {
    0: document.getElementById("step-fabric"),
    1: document.getElementById("step-vertical"),
    2: document.getElementById("step-volume"),
    3: document.getElementById("step-port"),
    4: document.getElementById("step-contact")
  };

  function canProceed() {
    switch (rfqState.step) {
      case 0: return !!rfqState.fabricClass;
      case 1: return !!rfqState.vertical;
      case 2: return !!rfqState.volume;
      case 3: return !!rfqState.port || rfqState.otherPort.trim().length > 0;
      case 4: return rfqState.contact.name.trim().length > 0 && rfqState.contact.email.trim().length > 0;
      default: return false;
    }
  }

  function renderFabricStep() {
    var el = stepPanels[0];
    el.innerHTML = "";
    FABRIC_CLASSES.forEach(function (label) {
      var checked = rfqState.fabricClass === label;
      var card = document.createElement("label");
      card.className = "cdg-fabric-card" + (checked ? " is-checked" : "");
      card.innerHTML = '<input type="radio" name="fabric"' + (checked ? " checked" : "") + '>' +
        '<div class="cdg-fabric-photo">Photo placeholder</div>' +
        '<div class="label">' + label + '</div>';
      card.addEventListener("click", function () {
        rfqState.fabricClass = label;
        renderFabricStep();
        updateActions();
      });
      el.appendChild(card);
    });
  }

  function renderVerticalStep() {
    var el = stepPanels[1];
    el.innerHTML = "";
    VERTICALS.forEach(function (label) {
      var checked = rfqState.vertical === label;
      var card = document.createElement("label");
      card.className = "cdg-vertical-card" + (checked ? " is-checked" : "");
      card.innerHTML = '<input type="radio" name="vertical"' + (checked ? " checked" : "") + '>' +
        '<span class="cdg-radio-dot"></span><span class="label">' + label + '</span>';
      card.addEventListener("click", function () {
        rfqState.vertical = label;
        renderVerticalStep();
        updateActions();
      });
      el.appendChild(card);
    });
  }

  function renderVolumeStep() {
    var el = stepPanels[2];
    el.innerHTML = "";
    VOLUMES.forEach(function (label) {
      var checked = rfqState.volume === label;
      var card = document.createElement("label");
      card.className = "cdg-volume-card" + (checked ? " is-checked" : "");
      card.innerHTML = '<input type="radio" name="volume"' + (checked ? " checked" : "") + '>' +
        '<span class="label">' + label + '</span><span class="cdg-radio-dot"></span>';
      card.addEventListener("click", function () {
        rfqState.volume = label;
        renderVolumeStep();
        updateActions();
      });
      el.appendChild(card);
    });
  }

  var otherPortInput = document.getElementById("other-port-input");
  function renderPortStep() {
    var el = document.getElementById("port-cards");
    el.innerHTML = "";
    PORTS.forEach(function (label) {
      var checked = rfqState.port === label;
      var card = document.createElement("label");
      card.className = "cdg-port-card" + (checked ? " is-checked" : "");
      card.innerHTML = '<input type="radio" name="port"' + (checked ? " checked" : "") + '>' + label;
      card.addEventListener("click", function () {
        rfqState.port = label;
        rfqState.otherPort = "";
        otherPortInput.value = "";
        renderPortStep();
        updateActions();
      });
      el.appendChild(card);
    });
    otherPortInput.value = rfqState.otherPort;
  }
  otherPortInput.addEventListener("input", function () {
    rfqState.otherPort = otherPortInput.value;
    rfqState.port = null;
    renderPortStep();
    updateActions();
  });

  var contactFields = ["name", "company", "email", "phone", "notes"];
  contactFields.forEach(function (field) {
    var input = document.getElementById("contact-" + field);
    input.addEventListener("input", function () {
      rfqState.contact[field] = input.value;
      updateActions();
      updateSummary();
    });
  });

  function updateSummary() {
    var s = rfqState;
    document.getElementById("summary-line").textContent =
      (s.fabricClass || "—") + " · " + (s.vertical || "—") + " · " +
      (s.volume || "—") + " · " + (s.port || s.otherPort || "—");
  }

  function renderProgress() {
    var progress = document.getElementById("rfq-progress");
    progress.innerHTML = "";
    for (var i = 0; i < 5; i++) {
      var seg = document.createElement("div");
      seg.className = "cdg-progress-seg" + (i <= rfqState.step ? " is-done" : "");
      progress.appendChild(seg);
    }
  }

  function updateActions() {
    var backBtn = document.getElementById("rfq-back");
    var nextBtn = document.getElementById("rfq-next");
    backBtn.disabled = rfqState.step === 0;
    nextBtn.disabled = !canProceed();
    nextBtn.textContent = rfqState.step === 4 ? "Submit enquiry" : "Continue";
  }

  function renderStep() {
    Object.keys(stepPanels).forEach(function (key) {
      stepPanels[key].hidden = Number(key) !== rfqState.step;
    });
    document.getElementById("rfq-step-label").textContent = "Step " + (rfqState.step + 1) + " of 5";
    document.getElementById("rfq-step-title").textContent = STEP_TITLES[rfqState.step];
    renderProgress();

    if (rfqState.step === 0) renderFabricStep();
    if (rfqState.step === 1) renderVerticalStep();
    if (rfqState.step === 2) renderVolumeStep();
    if (rfqState.step === 3) renderPortStep();
    if (rfqState.step === 4) updateSummary();

    updateActions();
  }

  document.getElementById("rfq-back").addEventListener("click", function () {
    rfqState.step = Math.max(0, rfqState.step - 1);
    renderStep();
  });

  document.getElementById("rfq-next").addEventListener("click", function () {
    if (!canProceed()) return;
    if (rfqState.step === 4) {
      rfqState.submitted = true;
      document.getElementById("rfq-form").hidden = true;
      document.getElementById("rfq-success").hidden = false;
      return;
    }
    rfqState.step += 1;
    renderStep();
  });

  renderStep();
})();
