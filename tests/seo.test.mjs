// SEO limits and the pages.dev redirect.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { onRequest, PAGES_DEV_HOST, GSC_FILE } from "../functions/_middleware.js";

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk("dist").filter((f) => f.endsWith("index.html"));

test("titles ≤ 60 characters and descriptions ≤ 160 on every indexable page", () => {
  const bad = [];
  for (const f of pages) {
    const s = readFileSync(f, "utf8");
    const dec = (x) => x.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    const t = dec(s.match(/<title>([^<]+)<\/title>/)[1]);
    const d = dec(s.match(/<meta name="description" content="([^"]+)"/)[1]);
    if (t.length > 60) bad.push(`${f} title ${t.length}: ${t}`);
    if (d.length > 160) bad.push(`${f} description ${d.length}`);
  }
  assert.deepEqual(bad, []);
});

const ctx = (url) => ({ request: new Request(url), next: async () => new Response("asset", { status: 200 }) });

test("production pages.dev address 301-redirects to the real domain, keeping path and query", async () => {
  const r = await onRequest(ctx(`https://${PAGES_DEV_HOST}/es/services/ai-chatbots/?utm_source=x`));
  assert.equal(r.status, 301);
  assert.equal(r.headers.get("Location"), "https://globalbotsolutions.com/es/services/ai-chatbots/?utm_source=x");
});

test("preview, branch and real-domain requests pass through untouched", async () => {
  for (const u of [
    `https://feature-seo-improvements.${PAGES_DEV_HOST}/`,
    `https://1a2b3c4d.${PAGES_DEV_HOST}/contact/`,
    "https://globalbotsolutions.com/",
    "http://localhost:8788/",
  ]) {
    const r = await onRequest(ctx(u));
    assert.equal(r.status, 200, u);
    assert.equal(await r.text(), "asset");
  }
});

test("Search Console verification file is served directly (no redirect)", async () => {
  const r = await onRequest(ctx("https://globalbotsolutions.com/" + GSC_FILE));
  assert.equal(r.status, 200);
  assert.equal(await r.text(), "google-site-verification: google9e51c4fde646c8a8.html");
});
