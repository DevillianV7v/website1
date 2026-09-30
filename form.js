(function () {
  var f = document.getElementById("f");
  if (!f) return; // not the contact page
  var EMAIL = "hello@example.com"; /* <-- set your real address here */

  var q = new URLSearchParams(location.search);
  var project = q.get("project"), type = q.get("type"), plan = q.get("plan");
  var PLAN_LABEL = ["Landing (one page)", "Studio (up to 5 pages)", "Product (app or shop)"];
  if (project) {
    document.getElementById("cth").textContent = "Want a " + (type || "site").toLowerCase() + " like " + project + "?";
    document.getElementById("brief").value = "I'd like something like " + project + (type ? " (" + type.toLowerCase() + "). " : ". ");
    if (plan !== null && PLAN_LABEL[plan]) document.getElementById("pk").value = PLAN_LABEL[plan];
  }

  f.onsubmit = function (e) {
    e.preventDefault();
    var g = function (i) { return document.getElementById(i).value; };
    location.href = "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent("Sevenday brief: " + g("pk") + " (" + g("nm") + ")") +
      "&body=" + encodeURIComponent(g("brief") + "\n\n" + g("nm") + "\n" + g("em"));
  };
})();
