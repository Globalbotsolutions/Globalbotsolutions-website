// Portfolio category filter.
(function () {
  "use strict";
  var bar = document.querySelector("[data-pf-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-pf-grid] > li"));
  var empty = document.querySelector("[data-pf-empty]");
  if (!bar) return;
  bar.addEventListener("change", function (e) {
    var v = e.target.value;
    var shown = 0;
    cards.forEach(function (c) {
      var match = v === "all" || (" " + c.getAttribute("data-cats") + " ").indexOf(" " + v + " ") !== -1;
      c.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
  });
})();
