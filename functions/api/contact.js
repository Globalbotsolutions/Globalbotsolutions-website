// POST /api/contact — quote request handler (Cloudflare Pages Function).
//
// Delivery (configure ONE in Cloudflare Pages → Settings → Variables / Bindings):
//   A) Resend:   RESEND_API_KEY (secret), LEAD_FROM (e.g. "Website <quotes@globalbotsolutions.com>")
//   B) Cloudflare Email Routing send_email binding named LEAD_EMAIL. NOT for globalbotsolutions.com:
//      Email Routing replaces the domain's MX records and would break Google Workspace mail.
// Optional:
//   LEAD_TO               recipient (default info@globalbotsolutions.com)
//   TURNSTILE_SECRET_KEY  enables server-side Turnstile verification (secret)
//   RATE_LIMIT            KV namespace binding for durable rate limiting
//   LEADS                 KV namespace binding to keep a private backup copy of each lead (90 days)
//
// The endpoint returns { ok: true } ONLY when the lead was actually handed to the email provider.

const DEFAULT_TO = "info@globalbotsolutions.com";
const MAX_BODY = 20_000;
const RL_WINDOW_S = 600; // 10 minutes
const RL_MAX = 5;

const INDUSTRIES = ["restaurant", "barbershop", "hair-salon", "dental", "auto-repair", "transportation", "laundromat", "hvac", "home-services", "other"];
const SERVICES = ["website-design", "ai-receptionist", "ai-chatbots", "online-booking", "customer-service", "nfc-review-cards", "website-maintenance", "business-automation", "not-sure"];
const BUDGETS = ["", "essential", "complete", "recommendations", "private"];
const LANGS = ["en", "es"];
const CONTACT_METHODS = ["", "email", "phone", "either"];
// IANA time zone names such as "America/Bogota" or "Europe/Madrid" (sent by the browser, optional)
const TIMEZONE = /^[A-Za-z_]+(\/[A-Za-z0-9_+\-]+){0,2}$/;

const memoryHits = new Map(); // best-effort fallback when no KV is bound

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });

const clean = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
const oneLine = (v) => v.replace(/[\r\n]+/g, " ");

export function validate(raw) {
  const d = {
    name: oneLine(clean(raw.name, 100)),
    business: oneLine(clean(raw.business, 120)),
    email: oneLine(clean(raw.email, 160)).toLowerCase(),
    phone: oneLine(clean(raw.phone, 30)),
    industry: clean(raw.industry, 40),
    services: Array.isArray(raw.services) ? [...new Set(raw.services.map((s) => clean(s, 40)))].slice(0, 10) : [],
    website: oneLine(clean(raw.website, 200)),
    description: clean(raw.description, 3000),
    language: clean(raw.language, 5),
    budget: clean(raw.budget, 40),
    consultation: raw.consultation === true,
    page_lang: clean(raw.page_lang, 5),
    // Optional international details. Never required; invalid values are dropped, not rejected.
    country: oneLine(clean(raw.country, 60)),
    contact_method: clean(raw.contact_method, 10),
    timezone: oneLine(clean(raw.timezone, 50)),
    tracking: {},
  };
  const errors = {};
  if (d.name.length < 2) errors.name = "invalid";
  if (d.business.length < 2) errors.business = "invalid";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) errors.email = "invalid";
  if (d.phone && (!/^[0-9+().\-\s]{7,30}$/.test(d.phone) || d.phone.replace(/\D/g, "").length < 7)) errors.phone = "invalid";
  if (!INDUSTRIES.includes(d.industry)) errors.industry = "invalid";
  if (!d.services.length || d.services.some((s) => !SERVICES.includes(s))) errors.services = "invalid";
  if (d.website && !/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(d.website)) errors.website = "invalid";
  if (d.description.length < 20) errors.description = "invalid";
  if (!LANGS.includes(d.language)) d.language = "en";
  if (!LANGS.includes(d.page_lang)) d.page_lang = "en";
  if (!BUDGETS.includes(d.budget)) d.budget = "";
  if (!CONTACT_METHODS.includes(d.contact_method)) d.contact_method = "";
  if (!/^[\p{L}\p{M} .,'()\-]*$/u.test(d.country)) d.country = "";
  // Time zone is only useful (and only sent by the form) when a consultation call is requested.
  if (!d.consultation || !TIMEZONE.test(d.timezone)) d.timezone = "";

  // Campaign parameters: only known keys, short values
  try {
    const t = typeof raw.tracking === "string" && raw.tracking ? JSON.parse(raw.tracking) : {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"]) {
      if (t && typeof t[k] === "string") d.tracking[k] = oneLine(clean(t[k], 120));
    }
  } catch { /* ignore malformed tracking */ }

  return { data: d, errors };
}

async function sha256(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function rateLimited(env, ip) {
  const key = "rl:" + (await sha256("gbs:" + ip)).slice(0, 32);
  if (env.RATE_LIMIT) {
    const cur = Number((await env.RATE_LIMIT.get(key)) || 0);
    if (cur >= RL_MAX) return true;
    await env.RATE_LIMIT.put(key, String(cur + 1), { expirationTtl: RL_WINDOW_S });
    return false;
  }
  const now = Date.now();
  const hits = (memoryHits.get(key) || []).filter((t) => now - t < RL_WINDOW_S * 1000);
  if (hits.length >= RL_MAX) { memoryHits.set(key, hits); return true; }
  hits.push(now);
  memoryHits.set(key, hits);
  if (memoryHits.size > 5000) memoryHits.clear();
  return false;
}

async function verifyTurnstile(secret, token, ip) {
  if (!token || typeof token !== "string" || token.length > 2048) return false;
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const out = await r.json();
    return out && out.success === true;
  } catch {
    return false;
  }
}

const LABELS = {
  industry: { restaurant: "Restaurant", barbershop: "Barbershop", "hair-salon": "Hair salon", dental: "Dental office", "auto-repair": "Auto repair shop", transportation: "Transportation company", laundromat: "Laundromat", hvac: "HVAC", "home-services": "Home services", other: "Other" },
  services: { "website-design": "Professional website", "ai-receptionist": "AI voice receptionist", "ai-chatbots": "AI chatbot", "online-booking": "Online booking", "customer-service": "Customer service automation", "nfc-review-cards": "NFC review cards", "website-maintenance": "Website maintenance", "business-automation": "Custom business automation", "not-sure": "Not sure yet" },
  budget: { "": "—", essential: "Essential solution", complete: "Complete solution", recommendations: "Open to recommendations", private: "Prefers to discuss privately" },
  contact_method: { "": "—", email: "Email", phone: "Phone call", either: "Email or phone" },
};

export function composeEmail(d) {
  const rows = [
    ["Name", d.name],
    ["Business", d.business],
    ["Email", d.email],
    ["Phone", d.phone || "—"],
    ["Country", d.country || "—"],
    ["Preferred contact method", LABELS.contact_method[d.contact_method]],
    ["Industry", LABELS.industry[d.industry]],
    ["Services", d.services.map((s) => LABELS.services[s]).join(", ")],
    ["Current website", d.website || "—"],
    ["Preferred language", d.language === "es" ? "Spanish" : "English"],
    ["Project scope", LABELS.budget[d.budget]],
    ["Wants free consultation", d.consultation ? "Yes" : "No"],
    ...(d.timezone ? [["Visitor's time zone", d.timezone]] : []),
    ["Form language", d.page_lang === "es" ? "Spanish page" : "English page"],
    ...Object.entries(d.tracking).map(([k, v]) => [k, v]),
  ];
  const subject = oneLine(`New quote request: ${d.business} (${LABELS.industry[d.industry]})`).slice(0, 180);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nProject description:\n${d.description}\n`;
  const e = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><th align="left" style="background:#F5F8FC">${e(k)}</th><td>${e(v)}</td></tr>`)
    .join("")}</table><h3 style="font-family:Arial,sans-serif">Project description</h3><p style="font-family:Arial,sans-serif;white-space:pre-wrap">${e(d.description)}</p>`;
  return { subject, text, html };
}

function b64(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function buildMime({ from, to, replyTo, subject, text }) {
  const wrap = (s) => s.match(/.{1,76}/g).join("\r\n");
  const id = `<${crypto.randomUUID()}@globalbotsolutions.com>`;
  return [
    `From: ${from}`,
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: =?UTF-8?B?${b64(subject)}?=`,
    `Message-ID: ${id}`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrap(b64(text)),
    "",
  ].join("\r\n");
}

async function deliver(env, d) {
  const to = env.LEAD_TO || DEFAULT_TO;
  const { subject, text, html } = composeEmail(d);

  if (env.RESEND_API_KEY && env.LEAD_FROM) {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.LEAD_FROM, to: [to], reply_to: d.email, subject, text, html }),
    });
    if (!r.ok) throw new Error("email_provider_" + r.status);
    return "resend";
  }

  if (env.LEAD_EMAIL && env.LEAD_FROM) {
    const { EmailMessage } = await import("cloudflare:email");
    const fromAddr = (env.LEAD_FROM.match(/<([^>]+)>/) || [null, env.LEAD_FROM])[1];
    const raw = buildMime({ from: env.LEAD_FROM, to, replyTo: d.email, subject, text });
    await env.LEAD_EMAIL.send(new EmailMessage(fromAddr, to, raw));
    return "cf-email";
  }

  return null;
}

export async function onRequestPost({ request, env }) {
  // Same-origin only
  const origin = request.headers.get("Origin");
  if (origin) {
    let sameHost = false;
    try { sameHost = new URL(origin).host === new URL(request.url).host; } catch {}
    if (!sameHost) return json(403, { ok: false, error: "origin" });
  }
  if (!(request.headers.get("Content-Type") || "").toLowerCase().startsWith("application/json")) {
    return json(415, { ok: false, error: "content_type" });
  }
  const len = Number(request.headers.get("Content-Length") || 0);
  if (len > MAX_BODY) return json(413, { ok: false, error: "too_large" });

  let raw;
  try {
    const textBody = await request.text();
    if (textBody.length > MAX_BODY) return json(413, { ok: false, error: "too_large" });
    raw = JSON.parse(textBody);
  } catch {
    return json(400, { ok: false, error: "bad_json" });
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return json(400, { ok: false, error: "bad_json" });

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (await rateLimited(env, ip)) return json(429, { ok: false, error: "rate_limited" });

  // Bot traps: hidden honeypot field, or submitted impossibly fast.
  // Bots get a neutral success-shaped reply and nothing is sent.
  const started = Number(raw.started);
  if (clean(raw.company_url, 200) || (Number.isFinite(started) && started > 0 && Date.now() - started < 2000)) {
    return json(200, { ok: true });
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const passed = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, raw.turnstile_token, ip === "unknown" ? "" : ip);
    if (!passed) return json(403, { ok: false, error: "captcha" });
  }

  const { data, errors } = validate(raw);
  if (Object.keys(errors).length) return json(400, { ok: false, errors });

  if (env.LEADS) {
    try {
      await env.LEADS.put(`lead:${new Date().toISOString()}:${crypto.randomUUID().slice(0, 8)}`, JSON.stringify(data), { expirationTtl: 60 * 60 * 24 * 90 });
    } catch { /* backup copy is optional */ }
  }

  let via;
  try {
    via = await deliver(env, data);
  } catch (e) {
    console.error("lead delivery failed:", e && e.message);
    return json(502, { ok: false, error: "delivery_failed" });
  }
  if (!via) {
    console.error("lead delivery not configured: set RESEND_API_KEY + LEAD_FROM, or a LEAD_EMAIL send_email binding + LEAD_FROM");
    return json(503, { ok: false, error: "not_configured" });
  }
  return json(200, { ok: true });
}

export async function onRequest({ request }) {
  // Any method other than POST (POST is handled by onRequestPost)
  return new Response(null, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
}
