// Tests for functions/api/contact.js (run: node --test tests/)
import { test } from "node:test";
import assert from "node:assert/strict";
import { onRequestPost, onRequest, validate, buildMime, composeEmail } from "../functions/api/contact.js";

const good = () => ({
  name: "Maria Lopez",
  business: "Lopez Auto Care",
  email: "maria@example.com",
  phone: "+1 555 010 0100",
  industry: "auto-repair",
  services: ["website-design", "ai-receptionist"],
  website: "https://example.com",
  description: "We need a new website and help answering calls while we work.",
  language: "es",
  budget: "complete",
  consultation: true,
  company_url: "",
  page_lang: "es",
  tracking: JSON.stringify({ utm_source: "google", evil: "x" }),
  started: String(Date.now() - 60_000),
  turnstile_token: "",
});

let ipCounter = 0;
const req = (body, { origin = "https://globalbotsolutions.com", ct = "application/json", ip } = {}) =>
  new Request("https://globalbotsolutions.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": ct, ...(origin ? { Origin: origin } : {}), "CF-Connecting-IP": ip || `10.0.0.${++ipCounter}` },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

function mockFetch(handler) {
  const orig = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => { calls.push({ url: String(url), init }); return handler(String(url), init); };
  return { calls, restore: () => { globalThis.fetch = orig; } };
}
const resendEnv = { RESEND_API_KEY: "test_key", LEAD_FROM: "Website <quotes@globalbotsolutions.com>" };

test("valid request is delivered and returns ok only after provider accepts", async () => {
  const m = mockFetch(async () => new Response(JSON.stringify({ id: "1" }), { status: 200 }));
  try {
    const res = await onRequestPost({ request: req(good()), env: resendEnv });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
    assert.equal(m.calls.length, 1);
    assert.equal(m.calls[0].url, "https://api.resend.com/emails");
    const sent = JSON.parse(m.calls[0].init.body);
    assert.deepEqual(sent.to, ["info@globalbotsolutions.com"]);
    assert.equal(sent.reply_to, "maria@example.com");
    assert.match(sent.text, /utm_source: google/);
    assert.doesNotMatch(sent.text, /evil/);
    assert.equal(m.calls[0].init.headers.Authorization, "Bearer test_key");
  } finally { m.restore(); }
});

test("provider failure returns 502, never ok", async () => {
  const m = mockFetch(async () => new Response("nope", { status: 500 }));
  try {
    const res = await onRequestPost({ request: req(good()), env: resendEnv });
    assert.equal(res.status, 502);
    assert.equal((await res.json()).ok, false);
  } finally { m.restore(); }
});

test("no delivery configured returns 503, never ok", async () => {
  const res = await onRequestPost({ request: req(good()), env: {} });
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, "not_configured");
});

test("invalid fields are rejected with field errors", async () => {
  const bad = { ...good(), name: "", email: "nope", industry: "spaceship", services: ["hacking"], website: "javascript:alert(1)", description: "short", phone: "abc" };
  const res = await onRequestPost({ request: req(bad), env: resendEnv });
  assert.equal(res.status, 400);
  const body = await res.json();
  for (const f of ["name", "email", "industry", "services", "website", "description", "phone"]) assert.ok(body.errors[f], f);
});

test("cross-origin posts are refused", async () => {
  const res = await onRequestPost({ request: req(good(), { origin: "https://evil.example" }), env: resendEnv });
  assert.equal(res.status, 403);
});

test("non-JSON content type is refused", async () => {
  const res = await onRequestPost({ request: req("name=x", { ct: "application/x-www-form-urlencoded" }), env: resendEnv });
  assert.equal(res.status, 415);
});

test("malformed JSON is refused", async () => {
  const res = await onRequestPost({ request: req("{not json"), env: resendEnv });
  assert.equal(res.status, 400);
});

test("oversized body is refused", async () => {
  const res = await onRequestPost({ request: req({ ...good(), description: "x".repeat(30_000) }), env: resendEnv });
  assert.equal(res.status, 413);
});

test("honeypot submissions are swallowed without sending", async () => {
  const m = mockFetch(async () => new Response("{}", { status: 200 }));
  try {
    const res = await onRequestPost({ request: req({ ...good(), company_url: "http://spam" }), env: resendEnv });
    assert.equal(res.status, 200);
    assert.equal(m.calls.length, 0);
  } finally { m.restore(); }
});

test("instant submissions are swallowed without sending", async () => {
  const m = mockFetch(async () => new Response("{}", { status: 200 }));
  try {
    const res = await onRequestPost({ request: req({ ...good(), started: String(Date.now()) }), env: resendEnv });
    assert.equal(res.status, 200);
    assert.equal(m.calls.length, 0);
  } finally { m.restore(); }
});

test("rate limit kicks in after 5 requests from one IP", async () => {
  const m = mockFetch(async () => new Response("{}", { status: 200 }));
  try {
    const statuses = [];
    for (let i = 0; i < 7; i++) statuses.push((await onRequestPost({ request: req(good(), { ip: "203.0.113.9" }), env: resendEnv })).status);
    assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429, 429]);
  } finally { m.restore(); }
});

test("rate limit uses KV when bound", async () => {
  const store = new Map();
  const kv = { get: async (k) => store.get(k) ?? null, put: async (k, v) => { store.set(k, v); } };
  const m = mockFetch(async () => new Response("{}", { status: 200 }));
  try {
    for (let i = 0; i < 5; i++) await onRequestPost({ request: req(good(), { ip: "198.51.100.1" }), env: { ...resendEnv, RATE_LIMIT: kv } });
    const res = await onRequestPost({ request: req(good(), { ip: "198.51.100.1" }), env: { ...resendEnv, RATE_LIMIT: kv } });
    assert.equal(res.status, 429);
    assert.ok([...store.keys()].every((k) => k.startsWith("rl:") && !k.includes("198.51")), "IP is hashed, not stored");
  } finally { m.restore(); }
});

test("Turnstile is enforced server-side when a secret is set", async () => {
  const m = mockFetch(async (url) => url.includes("turnstile")
    ? new Response(JSON.stringify({ success: false }), { status: 200 })
    : new Response("{}", { status: 200 }));
  try {
    const res = await onRequestPost({ request: req({ ...good(), turnstile_token: "abc" }), env: { ...resendEnv, TURNSTILE_SECRET_KEY: "s" } });
    assert.equal(res.status, 403);
    assert.equal((await res.json()).error, "captcha");
    const noToken = await onRequestPost({ request: req(good()), env: { ...resendEnv, TURNSTILE_SECRET_KEY: "s" } });
    assert.equal(noToken.status, 403);
  } finally { m.restore(); }
});

test("Turnstile success allows delivery", async () => {
  const m = mockFetch(async (url) => url.includes("turnstile")
    ? new Response(JSON.stringify({ success: true }), { status: 200 })
    : new Response("{}", { status: 200 }));
  try {
    const res = await onRequestPost({ request: req({ ...good(), turnstile_token: "abc" }), env: { ...resendEnv, TURNSTILE_SECRET_KEY: "s" } });
    assert.equal(res.status, 200);
    assert.equal(m.calls.length, 2);
  } finally { m.restore(); }
});

test("GET and other methods get 405", async () => {
  const res = await onRequest({ request: new Request("https://globalbotsolutions.com/api/contact") });
  assert.equal(res.status, 405);
});

test("header injection is neutralized in subject and MIME", () => {
  const { data } = validate({ ...good(), business: "Evil\r\nBcc: victim@example.com" });
  const mail = composeEmail(data);
  assert.doesNotMatch(mail.subject, /[\r\n]/);
  const mime = buildMime({ from: "a@b.com", to: "c@d.com", replyTo: data.email, subject: mail.subject, text: mail.text });
  assert.doesNotMatch(mime, /^Bcc:/m);
});

test("HTML email escapes user input", () => {
  const { data } = validate({ ...good(), description: "<script>alert(1)</script> and more text here" });
  const mail = composeEmail(data);
  assert.doesNotMatch(mail.html, /<script>/);
  assert.match(mail.html, /&lt;script&gt;/);
});

// ---------------- Optional international fields
test("international fields are optional: omitted fields still deliver", async () => {
  const m = mockFetch(async () => new Response("{}", { status: 200 }));
  try {
    const res = await onRequestPost({ request: req(good()), env: resendEnv });
    assert.equal(res.status, 200);
    const sent = JSON.parse(m.calls[0].init.body);
    assert.match(sent.text, /Country: —/);
    assert.match(sent.text, /Preferred contact method: —/);
    assert.doesNotMatch(sent.text, /time zone/i);
  } finally { m.restore(); }
});

test("international fields are included in the lead email when given", async () => {
  const m = mockFetch(async () => new Response("{}", { status: 200 }));
  try {
    const body = { ...good(), country: "México", contact_method: "phone", timezone: "America/Mexico_City", consultation: true, phone: "+52 55 1234 5678" };
    const res = await onRequestPost({ request: req(body), env: resendEnv });
    assert.equal(res.status, 200);
    const sent = JSON.parse(m.calls[0].init.body);
    assert.match(sent.text, /Country: México/);
    assert.match(sent.text, /Preferred contact method: Phone call/);
    assert.match(sent.text, /Visitor's time zone: America\/Mexico_City/);
    assert.match(sent.text, /Phone: \+52 55 1234 5678/);
  } finally { m.restore(); }
});

test("invalid optional values are dropped, never block the request", async () => {
  const m = mockFetch(async () => new Response("{}", { status: 200 }));
  try {
    const body = { ...good(), country: "<script>x</script>", contact_method: "whatsapp", timezone: "../../etc/passwd", consultation: true };
    const res = await onRequestPost({ request: req(body), env: resendEnv });
    assert.equal(res.status, 200);
    const sent = JSON.parse(m.calls[0].init.body);
    assert.match(sent.text, /Country: —/);
    assert.match(sent.text, /Preferred contact method: —/);
    assert.doesNotMatch(sent.text, /<script|whatsapp|passwd/i);
  } finally { m.restore(); }
});

test("time zone is only kept when a consultation call is requested", () => {
  assert.equal(validate({ ...good(), consultation: false, timezone: "Europe/Madrid" }).data.timezone, "");
  assert.equal(validate({ ...good(), consultation: true, timezone: "Europe/Madrid" }).data.timezone, "Europe/Madrid");
  assert.equal(validate({ ...good(), country: "Côte d'Ivoire" }).data.country, "Côte d'Ivoire");
  assert.equal(validate({ ...good(), country: "Spain\r\nBcc: x@y.z" }).data.country, "");
});
