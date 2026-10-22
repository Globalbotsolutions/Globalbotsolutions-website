// Site-wide behavior: mobile nav, sticky header state, legacy anchor redirects,
// campaign parameter capture, and a light one-time reveal.
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");

  // Legacy single-page anchors from the old site → new pages.
  var isEs = location.pathname.indexOf("/es/") === 0;
  var prefix = isEs ? "/es" : "";
  var legacy = {
    "#pricing": "/custom-solutions/",
    "#contact": "/contact/",
    "#services": "/services/",
    "#process": "/#how",
    "#languages": "/services/website-design/",
  };
  var onHome = location.pathname === "/" || location.pathname === "/es/" || location.pathname === "/index.html";
  if (onHome && legacy[location.hash]) {
    var target = legacy[location.hash];
    if (target.indexOf("/#") === 0) {
      location.replace(target.slice(1));
    } else {
      location.replace(prefix + target);
      return;
    }
  }

  // Campaign parameters (utm_*, gclid) kept for this browser session only,
  // and attached to quote requests so we know which campaign led to them.
  try {
    var params = new URLSearchParams(location.search);
    var keep = {};
    var found = false;
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach(function (k) {
      var v = params.get(k);
      if (v) { keep[k] = v.slice(0, 120); found = true; }
    });
    if (found) sessionStorage.setItem("gbs_tracking", JSON.stringify(keep));
  } catch (e) { /* storage blocked: ignore */ }

  document.addEventListener("DOMContentLoaded", function () {
    // Header shadow once scrolled
    var header = document.querySelector("[data-header]");
    var onScroll = function () { header && header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mobile navigation
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-nav]");
    if (toggle && panel) {
      var close = function (focusToggle) {
        toggle.setAttribute("aria-expanded", "false");
        panel.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        if (focusToggle) toggle.focus();
      };
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        if (open) { close(false); return; }
        toggle.setAttribute("aria-expanded", "true");
        panel.classList.add("is-open");
        document.body.classList.add("nav-open");
        var first = panel.querySelector("a");
        if (first) first.focus();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") close(true);
      });
      panel.addEventListener("click", function (e) {
        if (e.target.closest("a")) close(false);
      });
      window.matchMedia("(min-width: 1181px)").addEventListener("change", function (m) { if (m.matches) close(false); });
    }

    // One-time reveal for marked groups
    var groups = document.querySelectorAll("[data-reveal-group]");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      groups.forEach(function (g) { g.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -10% 0px" });
      groups.forEach(function (g) { io.observe(g); });
    }
  });
})();
