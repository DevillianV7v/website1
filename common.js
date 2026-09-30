// Shared across all pages: nav state + the project data every page reads from.
(function () {
  var page = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll("nav a[data-page]").forEach(function (a) {
    if (a.getAttribute("data-page") === page) a.classList.add("current");
  });
})();

window.SEVENDAY = {
  WORKS: ["Ember Coffee", "Atlas Studio", "Nori Ramen", "Field Notes", "Halo Health", "Kiln Ceramics", "Bluewave", "Orbit Launch"],
  TYPES: ["Shop", "Studio site", "Restaurant", "Editorial", "Clinic", "Shop", "SaaS", "Landing page"],
  // Which plan (0 Landing / 1 Studio / 2 Product) fits each project above.
  PLAN: [2, 1, 1, 1, 1, 2, 2, 0],
  PAL: [["#ff7a45", "#2b1a4d"], ["#f2b134", "#5a1a0c"], ["#38e0c0", "#0d2438"], ["#e5322d", "#f4d9c0"],
        ["#dfe8ff", "#4b6fd6"], ["#ff5fa2", "#180f2e"], ["#3a3fd6", "#c9d3ff"], ["#ffd166", "#1d3557"]],
  art: function (i) {
    var p = this.PAL[i % this.PAL.length], a = (i * 37) % 60;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 290 200" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + p[0] + '"/>' +
      '<stop offset="1" stop-color="' + p[1] + '"/></linearGradient></defs><rect width="290" height="200" fill="url(#g)"/>' +
      '<circle cx="' + (90 + a) + '" cy="' + (70 + a / 2) + '" r="' + (40 + a / 2) + '" fill="' + p[1] + '" opacity=".55"/>' +
      '<rect x="' + (150 - a) + '" y="120" width="170" height="16" transform="rotate(-' + (12 + a / 3) + ' 150 120)" fill="' + p[0] + '" opacity=".8"/></svg>';
    return "data:image/svg+xml;utf8," + encodeURIComponent(s);
  }
};
