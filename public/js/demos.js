// AI Solutions page demos. Everything here is simulated and runs locally:
// no network requests, no data stored, no real appointments or calls.
(function () {
  "use strict";
  var dataEl = document.getElementById("page-data");
  if (!dataEl) return;
  var D = JSON.parse(dataEl.textContent);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function radioVal(name) { var r = $('input[name="' + name + '"]:checked'); return r ? r.value : null; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* ================= Chatbot ================= */
  (function chat() {
    var root = $("[data-chat]");
    if (!root) return;
    var log = $("[data-chat-log]", root);
    var chips = $("[data-chat-chips]", root);
    var busy = false;
    var asked = {};
    var timer = null;

    function script() { return D.scripts[radioVal("chat-lang") || D.lang][radioVal("chat-industry")]; }

    function renderChips() {
      chips.innerHTML = "";
      var s = script();
      s.qa.forEach(function (item, i) {
        if (asked[i]) return;
        var b = el("button", null, item.q);
        b.type = "button";
        b.disabled = busy;
        b.addEventListener("click", function () { ask(i); });
        chips.appendChild(b);
      });
    }

    function scroll() { log.scrollTop = log.scrollHeight; }

    function reset() {
      clearTimeout(timer);
      busy = false;
      asked = {};
      log.innerHTML = "";
      var s = script();
      var g = el("p", "bubble bot", s.greeting);
      g.lang = radioVal("chat-lang") || D.lang;
      log.appendChild(g);
      chips.lang = g.lang;
      renderChips();
    }

    function ask(i) {
      if (busy) return;
      var s = script();
      var lang = radioVal("chat-lang") || D.lang;
      asked[i] = true;
      busy = true;
      var q = el("p", "bubble user", s.qa[i].q);
      q.lang = lang;
      log.appendChild(q);
      renderChips();
      var typing = el("div", "typing");
      typing.setAttribute("aria-label", D.labels.chat.typing);
      typing.setAttribute("role", "status");
      typing.innerHTML = "<i></i><i></i><i></i>";
      log.appendChild(typing);
      scroll();
      timer = setTimeout(function () {
        typing.remove();
        var a = el("p", "bubble bot", s.qa[i].a);
        a.lang = lang;
        log.appendChild(a);
        busy = false;
        renderChips();
        scroll();
        var ae = document.activeElement;
        if (!ae || ae === document.body || chips.contains(ae)) {
          var nextChip = chips.querySelector("button");
          (nextChip || $("[data-chat-reset]", root)).focus({ preventScroll: true });
        }
      }, reduce ? 250 : 1100);
    }

    $$('input[name="chat-industry"], input[name="chat-lang"]').forEach(function (r) { r.addEventListener("change", reset); });
    $("[data-chat-reset]", root).addEventListener("click", reset);
    reset();
  })();

  /* ================= Voice receptionist ================= */
  (function voice() {
    var root = $("[data-voice]");
    if (!root) return;
    var L = D.labels.voice;
    var list = $("[data-transcript]", root);
    var wave = $("[data-wave]", root);
    var bars = $$("i", wave);
    var playBtn = $("[data-voice-play]", root);
    var playIcon = $("[data-play-icon]", root);
    var playLabel = $("[data-play-label]", root);
    var timeEl = $("[data-voice-time]", root);
    var note = $("[data-voice-note]", root);
    var statusEl = $("[data-voice-status]", root);
    var synth = window.speechSynthesis || null;
    var idx = 0, playing = false, lineTimer = null, raf = null, startedAt = 0, elapsed = 0, clockTimer = null, who = null;
    var ICON_PLAY = playIcon.innerHTML;
    var ICON_PAUSE = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>';

    function lang() { return radioVal("voice-lang") || D.lang; }
    function lines() { return D.calls[lang()]; }

    function pickVoice(l) {
      if (!synth) return null;
      var vs = synth.getVoices() || [];
      var prefs = l === "es" ? ["es-US", "es-MX", "es-419", "es-ES", "es"] : ["en-US", "en-GB", "en"];
      for (var p = 0; p < prefs.length; p++) {
        for (var v = 0; v < vs.length; v++) {
          if ((vs[v].lang || "").replace("_", "-").toLowerCase().indexOf(prefs[p].toLowerCase()) === 0) return vs[v];
        }
      }
      return null;
    }

    function renderTranscript() {
      list.innerHTML = "";
      lines().forEach(function (ln, i) {
        var li = el("li", ln.who === "agent" ? "is-agent" : "is-caller");
        li.lang = lang();
        var b = el("b", null, ln.who === "agent" ? L.agent : L.caller);
        li.appendChild(b);
        li.appendChild(document.createTextNode(ln.text));
        li.dataset.i = i;
        list.appendChild(li);
      });
    }

    function mark(i) {
      $$("li", list).forEach(function (li, k) {
        li.classList.toggle("is-active", k === i);
        li.classList.toggle("is-done", k < i);
      });
      var active = list.children[i];
      if (active) {
        var top = active.offsetTop - list.offsetTop - 40;
        list.scrollTo ? list.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" }) : (list.scrollTop = top);
      }
    }

    function setWave(mode) {
      who = mode;
      wave.classList.toggle("is-live", mode === "agent");
      wave.classList.toggle("is-caller", mode === "caller");
      if (!mode) { cancelAnimationFrame(raf); bars.forEach(function (b) { b.style.height = ""; }); return; }
      if (reduce) { bars.forEach(function (b, i) { b.style.height = (30 + ((i * 37) % 50)) + "%"; }); return; }
      var t0 = performance.now();
      (function loop(t) {
        var k = (t - t0) / 1000;
        bars.forEach(function (b, i) {
          var h = 18 + 62 * Math.abs(Math.sin(k * 6 + i * 0.55) * Math.sin(k * 2.3 + i * 0.21));
          b.style.height = h.toFixed(1) + "%";
        });
        raf = requestAnimationFrame(loop);
      })(t0);
    }

    function fmt(ms) { var s = Math.floor(ms / 1000); return ("0" + Math.floor(s / 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2); }
    function tick() { timeEl.textContent = fmt(elapsed + (playing ? Date.now() - startedAt : 0)); }

    function setPlayUi(on) {
      playIcon.innerHTML = on ? ICON_PAUSE : ICON_PLAY;
      playLabel.textContent = on ? L.pause : L.play;
      playBtn.setAttribute("aria-pressed", on ? "true" : "false");
    }

    function stop(resetAll) {
      playing = false;
      clearTimeout(lineTimer);
      clearInterval(clockTimer);
      if (synth) synth.cancel();
      setWave(null);
      setPlayUi(false);
      if (resetAll) { idx = 0; elapsed = 0; tick(); mark(-1); statusEl.textContent = L.agent; }
    }

    function finish() {
      elapsed += Date.now() - startedAt;
      stop(false);
      idx = 0;
      mark(lines().length);
    }

    function playLine() {
      var ls = lines();
      if (idx >= ls.length) { finish(); return; }
      var ln = ls[idx];
      mark(idx);
      setWave(ln.who);
      statusEl.textContent = ln.who === "agent" ? L.agent : L.caller;
      var voice = pickVoice(lang());
      var useTts = synth && voice;
      note.textContent = useTts ? L.ttsNote : L.noTts;
      var next = function () { if (!playing) return; idx++; lineTimer = setTimeout(playLine, 380); };
      if (useTts) {
        var u = new SpeechSynthesisUtterance(ln.text);
        u.voice = voice;
        u.lang = voice.lang;
        u.rate = 1.02;
        u.pitch = ln.who === "agent" ? 1.08 : 0.92;
        u.onend = next;
        u.onerror = function (ev) { if (ev.error === "interrupted" || ev.error === "canceled") return; next(); };
        synth.speak(u);
      } else {
        var words = ln.text.split(/\s+/).length;
        lineTimer = setTimeout(next, Math.max(1600, words * 330));
      }
    }

    playBtn.addEventListener("click", function () {
      if (playing) { elapsed += Date.now() - startedAt; stop(false); return; }
      playing = true;
      startedAt = Date.now();
      clockTimer = setInterval(tick, 250);
      setPlayUi(true);
      if (synth) synth.cancel();
      playLine();
    });
    $("[data-voice-restart]", root).addEventListener("click", function () {
      stop(true);
      playBtn.click();
    });
    $$('input[name="voice-lang"]').forEach(function (r) {
      r.addEventListener("change", function () { stop(true); renderTranscript(); });
    });
    document.addEventListener("visibilitychange", function () { if (document.hidden && playing) { elapsed += Date.now() - startedAt; stop(false); } });
    window.addEventListener("pagehide", function () { if (synth) synth.cancel(); });
    if (synth && synth.onvoiceschanged !== undefined) synth.onvoiceschanged = function () {};
    if (!synth) note.textContent = L.noTts;

    renderTranscript();
    playBtn.setAttribute("aria-pressed", "false");
  })();

  /* ================= Booking ================= */
  (function booking() {
    var root = $("[data-booking]");
    if (!root) return;
    var L = D.labels.booking;
    var step = 0;
    var panels = $$("[data-panel]", root);
    var inds = $$("[data-step-ind]", root);
    var back = $("[data-bk-back]", root), next = $("[data-bk-next]", root), restart = $("[data-bk-restart]", root);
    var live = $("[data-bk-live]", root);
    var daysEl = $("[data-days]", root), slotsEl = $("[data-slots]", root);
    var locale = D.lang === "es" ? "es-US" : "en-US";

    // Next six open days (no Sundays), simulated availability
    var days = [];
    var d = new Date(); d.setHours(0, 0, 0, 0);
    while (days.length < 6) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) days.push(new Date(d)); }

    function seeded(n) { var x = Math.sin(n) * 10000; return x - Math.floor(x); }

    days.forEach(function (day, i) {
      var lab = el("label");
      var inp = el("input"); inp.type = "radio"; inp.name = "bk-day"; inp.value = String(i); if (i === 0) inp.checked = true;
      var sp = el("span");
      sp.appendChild(document.createTextNode(day.toLocaleDateString(locale, { weekday: "short" })));
      sp.appendChild(el("b", null, String(day.getDate())));
      sp.appendChild(document.createTextNode(day.toLocaleDateString(locale, { month: "short" })));
      lab.appendChild(inp); lab.appendChild(sp);
      daysEl.appendChild(lab);
      inp.addEventListener("change", renderSlots);
    });

    function renderSlots() {
      slotsEl.innerHTML = "";
      var di = Number(radioVal("bk-day") || 0);
      var day = days[di];
      var end = day.getDay() === 6 ? 13 : 17;
      for (var h = 9, k = 0; h < end; h += 0.5, k++) {
        var t = new Date(day); t.setHours(Math.floor(h), h % 1 ? 30 : 0);
        var lab = el("label");
        var inp = el("input"); inp.type = "radio"; inp.name = "bk-slot"; inp.value = t.toISOString();
        var taken = seeded(di * 31 + k * 7 + day.getDate()) < 0.35;
        inp.disabled = taken;
        var text = t.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
        var sp = el("span", null, text);
        if (taken) { var sr = el("span", "sr-only", " (" + L.unavailable + ")"); sp.appendChild(sr); }
        lab.appendChild(inp); lab.appendChild(sp);
        slotsEl.appendChild(lab);
        inp.addEventListener("change", function () { $("[data-bk-error-time]", root).hidden = true; });
      }
    }
    renderSlots();

    function summary() {
      var svcId = radioVal("bk-service");
      var svc = L.services.filter(function (s) { return s.id === svcId; })[0];
      var slot = radioVal("bk-slot");
      var name = ($('input[name="bk-name"]', root).value || "").trim();
      var lines = [];
      if (svc) lines.push(svc.name + " · " + svc.dur);
      if (slot) { var t = new Date(slot); lines.push(t.toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric" }) + " · " + t.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })); }
      if (name) lines.push(name);
      return lines;
    }
    function fillSummary(target) {
      target.innerHTML = "";
      var ls = summary();
      if (!ls.length) return;
      target.appendChild(el("b", null, L.summary));
      ls.forEach(function (l) { target.appendChild(el("span", null, l)); });
    }

    function go(n, silent) {
      step = n;
      panels.forEach(function (p) { p.hidden = Number(p.dataset.panel) !== n; });
      inds.forEach(function (li, i) { li.classList.toggle("is-current", i === n); li.classList.toggle("is-done", i < n); });
      back.hidden = n === 0 || n === 3;
      next.hidden = n === 3;
      restart.hidden = n !== 3;
      next.textContent = n === 2 ? L.confirm : L.next;
      if (n === 2) fillSummary($("[data-bk-summary]", root));
      if (n === 3) fillSummary($("[data-bk-final]", root));
      if (!silent) live.textContent = L.steps[n];
      var h = $('[data-panel="' + n + '"] h3', root);
      if (h && !silent) h.focus({ preventScroll: true });
    }

    next.addEventListener("click", function () {
      if (step === 1 && !radioVal("bk-slot")) { $("[data-bk-error-time]", root).hidden = false; return; }
      if (step === 2 && !($('input[name="bk-name"]', root).value || "").trim()) {
        $("[data-bk-error-name]", root).hidden = false;
        $('input[name="bk-name"]', root).focus();
        return;
      }
      $("[data-bk-error-name]", root).hidden = true;
      go(step + 1);
    });
    back.addEventListener("click", function () { go(Math.max(0, step - 1)); });
    restart.addEventListener("click", function () {
      $('input[name="bk-name"]', root).value = "";
      $('input[name="bk-phone"]', root).value = "";
      var first = $('input[name="bk-service"]', root); if (first) first.checked = true;
      renderSlots();
      go(0);
    });
    go(0, true);
  })();

  /* ================= NFC ================= */
  (function nfc() {
    var root = $("[data-nfc]");
    if (!root) return;
    var b = $("[data-nfc-tap]", root);
    b.addEventListener("click", function () {
      var on = !root.classList.contains("is-tapped");
      root.classList.toggle("is-tapped", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  })();
})();
