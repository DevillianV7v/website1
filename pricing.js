(function () {
  var plans = document.querySelectorAll(".plan");
  if (!plans.length) return; // not the pricing page
  var q = new URLSearchParams(location.search);
  var plan = q.get("plan"), project = q.get("project"), type = q.get("type");
  if (plan === null) return;
  var note = document.getElementById("suggested");
  plans.forEach(function (p, k) {
    if (String(k) === plan) {
      p.classList.add("rec");
      var tag = document.createElement("span");
      tag.className = "tag mono";
      tag.textContent = "Suggested for " + (project || "your project");
      p.insertBefore(tag, p.firstChild);
    }
  });
  if (note && project) {
    note.textContent = "Based on " + project + (type ? " (" + type.toLowerCase() + ")" : "") + ", here's the plan that fits.";
  }
})();
