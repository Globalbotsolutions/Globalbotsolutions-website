// Quote request form: preselection, validation, submission.
// Success is shown ONLY after the server confirms the request was delivered.
(function () {
  "use strict";
  var dataEl = document.getElementById("page-data");
  var form = document.querySelector("[data-contact-form]");
  if (!form || !dataEl) return;
  var T = JSON.parse(dataEl.textContent);
  var status = form.querySelector("[data-form-status]");
  var submitBtn = form.querySelector("[data-submit]");
  var success = document.querySelector("[data-form-success]");
  var errorTpl = document.querySelector("[data-error-template]");

  // ---- preselect from the CTA that brought the visitor here
  var params = new URLSearchParams(location.search);
  var svc = params.get("service");
  if (svc) {
    var box = form.querySelector('input[name="services"][value="' + CSS.escape(svc) + '"]');
    if (box) box.checked = true;
  }
  var ind = params.get("industry");
  if (ind) {
    var sel = form.querySelector('select[name="industry"]');
    if (sel && sel.querySelector('option[value="' + CSS.escape(ind) + '"]')) sel.value = ind;
  }
  if (params.get("intent") === "consultation") {
    var c = form.querySelector("[data-consult]");
    if (c) c.checked = true;
  }

  // ---- campaign tracking + timing
  try {
    var tr = sessionStorage.getItem("gbs_tracking");
    if (tr) form.querySelector("[data-tracking]").value = tr;
  } catch (e) {}
  form.querySelector("[data-started]").value = String(Date.now());

  // ---- time zone: shown and sent ONLY when the visitor asks for a consultation call
  var consult = form.querySelector("[data-consult]");
  var tzNote = form.querySelector("[data-tz-note]");
  var tzInput = form.querySelector("[data-timezone]");
  var tz = "";
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
  if (!/^[A-Za-z_]+(\/[A-Za-z0-9_+\-]+){0,2}$/.test(tz)) tz = "";
  function syncTz() {
    var on = !!(consult && consult.checked && tz && T.tzNote);
    if (tzNote) { tzNote.textContent = on ? T.tzNote.replace("{tz}", tz.replace(/_/g, " ")) : ""; tzNote.hidden = !on; }
    if (tzInput) tzInput.value = on ? tz : "";
  }
  if (consult) consult.addEventListener("change", syncTz);
  syncTz();

  // ---- validation (mirrors the server rules in functions/api/contact.js)
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^[0-9+().\-\s]{7,30}$/;
  function val(name) { var el = form.elements[name]; return el ? String(el.value || "").trim() : ""; }
  function services() { return Array.prototype.map.call(form.querySelectorAll('input[name="services"]:checked'), function (b) { return b.value; }); }

  function validate() {
    var errs = {};
    if (val("name").length < 2) errs.name = T.v.name;
    if (val("business").length < 2) errs.business = T.v.business;
    if (!EMAIL.test(val("email"))) errs.email = T.v.email;
    var ph = val("phone");
    if (ph && (!PHONE.test(ph) || ph.replace(/\D/g, "").length < 7)) errs.phone = T.v.phone;
    if (!val("industry")) errs.industry = T.v.industry;
    if (!services().length) errs.services = T.v.services;
    var w = val("website");
    if (w && !/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(w)) errs.website = T.v.website;
    if (val("description").length < 20) errs.description = T.v.description;
    return errs;
  }

  var FIELD_IDS = { name: "f-name", business: "f-business", email: "f-email", phone: "f-phone", industry: "f-industry", services: "f-services", website: "f-website", description: "f-description" };

  function showErrors(errs) {
    Object.keys(FIELD_IDS).forEach(function (k) {
      var id = FIELD_IDS[k];
      var msg = document.getElementById(id + "-error");
      var input = k === "services" ? null : document.getElementById(id);
      var has = !!errs[k];
      if (msg) { msg.textContent = has ? errs[k] : ""; msg.hidden = !has; }
      if (input) { if (has) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid"); }
      if (k === "services") {
        var fs = msg && msg.closest("fieldset");
        if (fs) fs.classList.toggle("is-invalid", has);
      }
    });
    var first = Object.keys(FIELD_IDS).filter(function (k) { return errs[k]; })[0];
    if (first) {
      var el = first === "services" ? form.querySelector('input[name="services"]') : document.getElementById(FIELD_IDS[first]);
      if (el) el.focus();
    }
  }

  // Clear a field's error as the visitor fixes it
  form.addEventListener("input", function (e) {
    var name = e.target.name;
    if (!FIELD_IDS[name]) return;
    var errs = validate();
    if (!errs[name]) {
      var msg = document.getElementById(FIELD_IDS[name] + "-error");
      if (msg) msg.hidden = true;
      e.target.removeAttribute("aria-invalid");
      if (name === "services") { var fs = e.target.closest("fieldset"); if (fs) fs.classList.remove("is-invalid"); }
    }
  });

  function setStatus(html) {
    if (!html) { status.hidden = true; status.innerHTML = ""; return; }
    status.innerHTML = html;
    status.hidden = false;
  }
  function genericError() { return errorTpl ? errorTpl.innerHTML : ""; }
  function escapeText(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function resetCaptcha() { try { if (window.turnstile) window.turnstile.reset(); } catch (e) {} }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("");
    var errs = validate();
    if (Object.keys(errs).length) {
      showErrors(errs);
      setStatus("<p>" + escapeText(T.errorFix) + "</p>");
      return;
    }
    showErrors({});

    var fd = new FormData(form);
    var payload = {
      name: val("name"),
      business: val("business"),
      email: val("email"),
      phone: val("phone"),
      country: val("country"),
      contact_method: val("contact_method"),
      timezone: val("timezone"),
      industry: val("industry"),
      services: services(),
      website: val("website"),
      description: val("description"),
      language: (form.querySelector('input[name="language"]:checked') || {}).value || T.lang,
      budget: val("budget"),
      consultation: !!(form.querySelector("[data-consult]") || {}).checked,
      company_url: val("company_url"),
      page_lang: T.lang,
      tracking: val("tracking"),
      started: val("started"),
      turnstile_token: fd.get("cf-turnstile-response") || "",
    };

    submitBtn.disabled = true;
    submitBtn.textContent = T.sending;

    fetch(form.getAttribute("action"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      credentials: "same-origin",
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) { return { status: res.status, body: body }; });
      })
      .then(function (r) {
        if (r.status === 200 && r.body && r.body.ok === true) {
          form.hidden = true;
          success.hidden = false;
          success.focus();
          try { sessionStorage.removeItem("gbs_tracking"); } catch (e) {}
          return;
        }
        resetCaptcha();
        if (r.status === 400 && r.body && r.body.errors) {
          var mapped = {};
          Object.keys(r.body.errors).forEach(function (k) { if (T.v[k]) mapped[k] = T.v[k]; });
          if (Object.keys(mapped).length) { showErrors(mapped); setStatus("<p>" + escapeText(T.errorFix) + "</p>"); return; }
        }
        if (r.status === 429) { setStatus("<p>" + escapeText(T.errorRate) + "</p>"); return; }
        if (r.status === 403 && r.body && r.body.error === "captcha") { setStatus("<p>" + escapeText(T.errorCaptcha) + "</p>"); return; }
        setStatus(genericError());
      })
      .catch(function () {
        resetCaptcha();
        setStatus(genericError());
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = T.submit;
      });
  });
})();
