(function () {
  var D = window.SEVENDAY, WORKS = D.WORKS, TYPES = D.TYPES, PLAN = D.PLAN;
  var stage = document.getElementById("stage"), wheel = document.getElementById("wheel"),
      lbl = document.getElementById("lbl"), ttl = document.getElementById("ttl"), idx = document.getElementById("idx");
  if (!stage) return; // not the work page

  var K = { H: .38, MW: .34, R: 1.45, STEP: 40, DRUM: 2.22, LENS: 2.7, RING: 1.14, BOW: 1.82, T: .124, IDX: .04, CULL: 1.6, WU: 900, DU: 420, SETTLE: 140, EASE: .12 };
  var n = WORKS.length, last = n - 1, cards = [], btns = [];
  var turn = 0, target = 0, active = 0, M = null, drag = null, timer = 0, moved = 0;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var rad = function (d) { return d * Math.PI / 180; };

  WORKS.forEach(function (t, i) {
    var a = document.createElement("a");
    a.className = "card"; a.href = "pricing.html?plan=" + PLAN[i] + "&project=" + encodeURIComponent(t) + "&type=" + encodeURIComponent(TYPES[i]);
    a.setAttribute("role", "option");
    a.innerHTML = '<span class="face"><img draggable="false" alt="' + t + '" src="' + D.art(i) + '"><i class="mono">Start like this</i></span>';
    wheel.appendChild(a); cards.push(a);
    var li = document.createElement("li"), b = document.createElement("button");
    b.type = "button"; b.textContent = t; b.onclick = function () { to(i + 1); };
    li.appendChild(b); idx.appendChild(li); btns.push(b);
  });

  function measure() {
    var w = stage.clientWidth, h = stage.clientHeight; if (!h) return;
    var cw = Math.min(h * K.H * K.R, w * K.MW), ch = cw / K.R, ringR = ch * K.RING;
    M = { cw: cw, ch: ch, ringR: ringR, drumR: ch * K.DRUM, bow: ch * K.BOW, rs: clamp((2 * Math.PI * ringR / n * .82) / cw, .16, 1) };
    stage.style.perspective = ch * K.LENS + "px";
    lbl.style.fontSize = ttl.style.fontSize = ch * K.T + "px"; idx.style.fontSize = ch * K.IDX + "px";
    cards.forEach(function (c) { c.style.width = cw + "px"; c.style.height = ch + "px"; c.style.marginLeft = -cw / 2 + "px"; c.style.marginTop = -ch / 2 + "px"; });
  }
  new ResizeObserver(measure).observe(stage); measure();

  function to(v) { target = clamp(v, 0, last + 1); }

  function draw() {
    requestAnimationFrame(draw); if (!M) return;
    var gap = target - turn; if (Math.abs(gap) < .0005) turn = target; else turn += gap * (reduced ? 1 : K.EASE);
    var m = clamp(turn, 0, 1), pos = Math.max(0, turn - 1);
    wheel.style.transform = "translateZ(" + (-m * M.drumR) + "px)";
    for (var i = 0; i < n; i++) {
      var d = i - pos, dd = d * K.STEP, c = cards[i];
      c.style.transform = "translateX(" + (m * -M.bow * (1 - Math.cos(rad(dd)))) + "px) rotateZ(" + ((1 - m) * d * 360 / n) + "deg) translateY(" + (-(1 - m) * M.ringR) + "px) rotateX(" + (m * dd) + "deg) translateZ(" + (m * M.drumR) + "px)";
      c.style.opacity = m > .5 && Math.abs(d) > K.CULL ? "0" : "1";
      c.style.zIndex = Math.round(100 - Math.abs(d) * 2);
      c.firstElementChild.style.transform = "scale(" + lerp(M.rs, 1, m) + ")";
    }
    lbl.style.opacity = 1 - m; ttl.style.opacity = m;
    var near = clamp(Math.round(pos), 0, last);
    if (near !== active || !ttl.textContent) {
      active = near; ttl.textContent = WORKS[near];
      btns.forEach(function (b, i) { b.className = i === near ? "on" : ""; });
      cards.forEach(function (c, i) { c.setAttribute("aria-selected", i === near); });
    }
  }
  requestAnimationFrame(draw);

  stage.addEventListener("wheel", function (e) {
    var next = target + e.deltaY / K.WU; if (next > 0 && next < last + 1) e.preventDefault(); to(next);
    clearTimeout(timer); timer = setTimeout(function () { to(Math.round(target)); }, K.SETTLE);
  }, { passive: false });
  stage.addEventListener("pointerdown", function (e) { moved = 0; drag = e.clientY; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener("pointermove", function (e) { if (drag === null) return; moved += Math.abs(drag - e.clientY); to(target + (drag - e.clientY) / K.DU); drag = e.clientY; });
  stage.addEventListener("pointerup", function (e) {
    drag = null; if (target > 1) to(Math.round(target));
    // A tap (not a drag) on a side card turns it to the front instead of following its link.
    if (moved < 6) {
      var els = document.elementsFromPoint(e.clientX, e.clientY);
      for (var k = 0; k < els.length; k++) {
        var c = els[k].closest && els[k].closest(".card");
        if (c) { var i = cards.indexOf(c); if (!(i === active && turn >= .5)) { e.preventDefault(); to(i + 1); } break; }
      }
    }
  });
  stage.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") to(Math.round(target) + 1);
    else if (e.key === "ArrowUp") to(Math.round(target) - 1);
    else return;
    e.preventDefault();
  });
})();
