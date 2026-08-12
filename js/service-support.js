(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  var success = document.getElementById("form-success");
  if (!form || !success) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();
