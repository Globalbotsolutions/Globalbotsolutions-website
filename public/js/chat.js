// Website AI assistant widget. Talks to /api/chat (Workers AI). Nothing is sent until the visitor writes.
(function () {
  "use strict";
  var root = document.querySelector("[data-chat-widget]");
  if (!root) return;
  var openBtn = root.querySelector("[data-chat-open]");
  var panel = root.querySelector(".chat-panel");
  var closeBtn = root.querySelector("[data-chat-close]");
  var log = root.querySelector("[data-chat-panel-log]");
  var form = root.querySelector("[data-chat-form]");
  var input = root.querySelector("[data-chat-input]");
  var sendBtn = root.querySelector("[data-chat-send]");
  var suggest = root.querySelector("[data-chat-suggest]");
  var tpl = root.querySelector("[data-chat-strings]");
  var S = {};
  try { S = JSON.parse(tpl.content ? tpl.content.textContent : tpl.textContent); } catch (e) {}
  var lang = root.getAttribute("data-lang") || "en";
  var history = [];
  var busy = false;
  var offline = false;

  function setOpen(open) {
    panel.hidden = !open;
    openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    root.classList.toggle("is-open", open);
    if (open) { input.focus(); scroll(); } else { openBtn.focus(); }
  }
  function scroll() { log.scrollTop = log.scrollHeight; }
  function bubble(cls, text) {
    var p = document.createElement("p");
    p.className = "bubble " + cls;
    // Linkify plain URLs on this site only; everything else stays as text.
    var parts = String(text).split(/(https:\/\/globalbotsolutions\.com\/[^\s)]*)/g);
    parts.forEach(function (part, i) {
      if (i % 2 === 1) {
        var full = part.replace(/[.,;:!?]+$/, "");
        var a = document.createElement("a");
        a.href = full.replace(/^https:\/\/globalbotsolutions\.com/, "") || "/"; // stay on the current host (works on previews too)
        a.textContent = a.getAttribute("href");
        p.appendChild(a);
        var trail = part.slice(full.length);
        if (trail) p.appendChild(document.createTextNode(trail));
      } else if (part) {
        p.appendChild(document.createTextNode(part));
      }
    });
    log.appendChild(p);
    scroll();
    return p;
  }
  function setBusy(b) {
    busy = b;
    sendBtn.disabled = b || offline;
    input.disabled = offline;
  }

  function send(text) {
    text = String(text || "").trim();
    if (!text || busy || offline) return;
    if (text.length > 500) { bubble("note", S.tooLong); return; }
    if (suggest) { suggest.remove(); suggest = null; }
    bubble("user", text);
    history.push({ role: "user", content: text });
    input.value = "";
    autoSize();
    setBusy(true);
    var typing = document.createElement("div");
    typing.className = "typing";
    typing.setAttribute("role", "status");
    typing.setAttribute("aria-label", S.typing || "…");
    typing.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(typing);
    scroll();

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ lang: lang, messages: history.slice(-10) }),
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { return { status: r.status, body: b }; }); })
      .then(function (r) {
        typing.remove();
        if (r.status === 200 && r.body && r.body.ok && r.body.reply) {
          bubble("bot", r.body.reply);
          history.push({ role: "assistant", content: r.body.reply });
        } else if (r.status === 429) {
          history.pop();
          bubble("note", S.busy);
        } else if (r.status === 400 && r.body && r.body.error === "too_long") {
          history.pop();
          bubble("note", S.tooLong);
        } else {
          history.pop();
          offline = true;
          bubble("note", S.offline);
        }
      })
      .catch(function () {
        typing.remove();
        history.pop();
        bubble("note", S.offline);
      })
      .then(function () { setBusy(false); if (!offline) input.focus(); });
  }

  function autoSize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  }

  openBtn.addEventListener("click", function () { setOpen(panel.hidden); });
  closeBtn.addEventListener("click", function () { setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) setOpen(false); });
  form.addEventListener("submit", function (e) { e.preventDefault(); send(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input.value); }
  });
  input.addEventListener("input", autoSize);
  if (suggest) suggest.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) send(b.textContent); });
})();
