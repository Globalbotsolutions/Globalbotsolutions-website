// Static checks on the built site in ./dist (run `node build.mjs` first; `npm test` does both).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import en from "../src/content/en.mjs";
import es from "../src/content/es.mjs";

const DIST = "dist";
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith(".html"));
const pageFiles = htmlFiles.filter((f) => !f.endsWith("404.html"));
const read = (f) => readFileSync(f, "utf8");
const textOf = (html) => html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ");

const PATHS = ["", "services/", ...Object.keys(en.pages.servicePages).map((s) => `services/${s}/`), "ai-solutions/", "industries/", "portfolio/", "custom-solutions/", "about/", "contact/", "faq/", "privacy/", "terms/"];

test("every page exists in English and Spanish", () => {
  for (const p of PATHS) {
    assert.ok(existsSync(join(DIST, p, "index.html")), "missing EN " + p);
    assert.ok(existsSync(join(DIST, "es", p, "index.html")), "missing ES " + p);
  }
  assert.equal(pageFiles.length, PATHS.length * 2);
});

test("NO public prices anywhere in the built site", () => {
  const patterns = [
    /\$\s?\d/, /\d\s?(USD|usd)\b/, /\bUSD\b/, /\b\d+(\.\d+)?\s?(dollars|dólares)\b/i,
    /per month/i, /\/\s?mo\b/i, /monthly fee/i, /one-time (startup )?fee/i, /startup fee/i, /cancellation fee/i,
    /cargo (mensual|inicial)/i, /al mes\b/i, /por mes\b/i, /tarifa de cancelación/i,
    /"price"\s*:/, /"priceCurrency"/, /"@type"\s*:\s*"Offer"/, /\b399\.99\b|\b199\.99\b/,
  ];
  const scanned = files.filter((f) => /\.(html|js|json|xml|txt|css)$/.test(f) || f.endsWith("_headers") || f.endsWith("_redirects"));
  for (const f of scanned) {
    const s = read(f);
    for (const re of patterns) assert.doesNotMatch(s, re, `${f} matches ${re}`);
  }
  assert.ok(!existsSync(join(DIST, "pricing")), "no pricing page");
});

test("no pricing toggle or pricing section markup", () => {
  for (const f of htmlFiles) assert.doesNotMatch(read(f), /pricing-(card|price|toggle|grid)|id="pricing"/, f);
});

test("CSP-safe markup: no inline styles, event handlers or executable inline scripts", () => {
  for (const f of htmlFiles) {
    const s = read(f);
    assert.doesNotMatch(s, /\sstyle=/, f + " has style attribute");
    assert.doesNotMatch(s, /\son[a-z]+=/i, f + " has inline handler");
    const scripts = s.match(/<script(?![^>]*\bsrc=)[^>]*>/g) || [];
    for (const tag of scripts) assert.match(tag, /type="application\/(ld\+)?json"/, f + " inline script " + tag);
  }
});

test("internal links and assets resolve", () => {
  const missing = [];
  for (const f of htmlFiles) {
    const s = read(f);
    for (const m of s.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const p = m[1];
      if (p.startsWith("/api/")) continue;
      const target = p.endsWith("/") ? join(DIST, p, "index.html") : join(DIST, p);
      if (!existsSync(target)) missing.push(`${f} → ${p}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("in-page anchors used by links exist", () => {
  const missing = [];
  for (const f of htmlFiles) {
    const s = read(f);
    for (const m of s.matchAll(/href="(\/[^"#]*)?#([^"]+)"/g)) {
      const path = m[1] ? m[1].split("?")[0] : null;
      const targetFile = path ? (path.endsWith("/") ? join(DIST, path, "index.html") : join(DIST, path)) : f;
      if (!existsSync(targetFile)) continue;
      if (!read(targetFile).includes(`id="${m[2]}"`)) missing.push(`${f} → ${m[0]}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("SEO basics on every page", () => {
  const titles = new Set(), descs = new Set();
  for (const f of pageFiles) {
    const s = read(f);
    const isEs = f.startsWith(join(DIST, "es"));
    assert.match(s, new RegExp(`<html lang="${isEs ? "es" : "en"}">`), f);
    const title = (s.match(/<title>([^<]+)<\/title>/) || [])[1];
    const desc = (s.match(/<meta name="description" content="([^"]+)"/) || [])[1];
    assert.ok(title && title.length <= 110, f + " title");
    assert.ok(desc && desc.length >= 70 && desc.length <= 200, f + " description length " + (desc || "").length);
    assert.ok(!titles.has(title), "duplicate title " + title); titles.add(title);
    assert.ok(!descs.has(desc), "duplicate description " + desc); descs.add(desc);
    assert.equal((s.match(/<h1[\s>]/g) || []).length, 1, f + " must have exactly one h1");
    assert.match(s, /<link rel="canonical" href="https:\/\/globalbotsolutions\.com\//, f);
    for (const hl of ["en", "es", "x-default"]) assert.match(s, new RegExp(`hreflang="${hl}"`), f + " hreflang " + hl);
    assert.match(s, /og:image" content="https:\/\/globalbotsolutions\.com\/img\/og-(en|es)\.png"/, f);
    for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
  }
});

test("sitemap and robots", () => {
  const sm = read(join(DIST, "sitemap.xml"));
  assert.equal((sm.match(/<loc>/g) || []).length, PATHS.length * 2);
  assert.match(read(join(DIST, "robots.txt")), /Sitemap: https:\/\/globalbotsolutions\.com\/sitemap\.xml/);
});

test("Spanish pages contain no untranslated English UI strings", () => {
  // Collect every English string (>= 14 chars) that does not also appear in the Spanish content.
  const collect = (o, out = new Set()) => {
    if (typeof o === "string") out.add(o);
    else if (Array.isArray(o)) o.forEach((x) => collect(x, out));
    else if (o && typeof o === "object") Object.values(o).forEach((x) => collect(x, out));
    return out;
  };
  const esStrings = collect(es);
  const enOnly = [...collect(en)].filter((s) => s.length >= 14 && !esStrings.has(s) && !s.startsWith("/") && !/^[a-z_]+$/.test(s));
  // The AI demo page legitimately embeds both languages' scripts in its JSON data, which is stripped below.
  const leaks = [];
  for (const f of pageFiles.filter((f) => f.startsWith(join(DIST, "es")))) {
    const text = textOf(read(f));
    for (const s of enOnly) if (text.includes(s)) leaks.push(`${f}: "${s}"`);
  }
  assert.deepEqual(leaks, []);
});

test("English pages contain no Spanish-only strings", () => {
  const collect = (o, out = new Set()) => {
    if (typeof o === "string") out.add(o);
    else if (Array.isArray(o)) o.forEach((x) => collect(x, out));
    else if (o && typeof o === "object") Object.values(o).forEach((x) => collect(x, out));
    return out;
  };
  const enStrings = collect(en);
  const esOnly = [...collect(es)].filter((s) => s.length >= 14 && !enStrings.has(s) && !s.startsWith("/"));
  const leaks = [];
  for (const f of pageFiles.filter((f) => !f.startsWith(join(DIST, "es")))) {
    const text = textOf(read(f));
    for (const s of esOnly) if (text.includes(s)) leaks.push(`${f}: "${s}"`);
  }
  assert.deepEqual(leaks, []);
});

test("contact details come only from verified config", () => {
  for (const f of pageFiles) {
    const s = read(f);
    for (const m of s.matchAll(/href="tel:([^"]+)"/g)) assert.equal(m[1], "+13072178616", f);
    for (const m of s.matchAll(/href="mailto:([^"]+)"/g)) assert.equal(m[1], "info@globalbotsolutions.com", f);
  }
});

test("no fabricated trust signals", () => {
  for (const f of pageFiles) {
    const t = textOf(read(f));
    assert.doesNotMatch(t, /\b\d{2,}\+?\s+(happy |satisfied )?(clients|customers|businesses served)\b/i, f);
    assert.doesNotMatch(t, /\b(guaranteed|garantizad[oa]s?)\b(?! (reviews|reseñas))/i, f);
    assert.doesNotMatch(t, /\blowest price|más barato|cheapest\b/i, f);
    assert.doesNotMatch(s(f), /"aggregateRating"|"review"\s*:/, f);
  }
  function s(f) { return read(f); }
});

test("demo pages are clearly labeled as simulated", () => {
  for (const f of [join(DIST, "ai-solutions/index.html"), join(DIST, "es/ai-solutions/index.html")]) {
    const t = textOf(read(f));
    assert.match(t, /Simulated demo|Demostración simulada/);
    assert.match(t, /not connected to a live AI|no están conectadas a un sistema de IA real/i);
  }
});

test("no unfinished placeholders or internal notes on any page", () => {
  for (const f of pageFiles) {
    const t = textOf(read(f));
    assert.doesNotMatch(t, /\[(Owner|owner|Por completar|Por confirmar)[^\]]*\]|lorem ipsum|before publication|antes de publicarse/i, f);
    assert.doesNotMatch(t, /\bTODO\b|\bFIXME\b/, f);
  }
});
