// Worldwide positioning + location privacy checks on the built site (run after `node build.mjs`; `npm test` does both).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { site } from "../src/site.config.mjs";
import { KNOWLEDGE } from "../functions/api/chat.js";

const DIST = "dist";
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(DIST);
const pages = files.filter((f) => f.endsWith("index.html"));
const read = (f) => readFileSync(f, "utf8");
const isLegal = (f) => /\/(privacy|terms)\/index\.html$/.test(f);
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));

test("privacy: no owner/company location anywhere in public files (HTML, JSON-LD, JS, sitemap, robots)", () => {
  const LOCATION = /New Jersey|Nueva Jersey|\bN\.?J\.?\b|Edison|Perth Amboy|Middlesex|\bU\.S\.(?=[\s,.])|EE\. ?UU\./;
  const scanned = files.filter((f) => /\.(html|js|json|xml|txt|css)$/.test(f));
  const hits = [];
  for (const f of scanned) { const m = read(f).match(LOCATION); if (m) hits.push(`${f}: ${m[0]}`); }
  assert.deepEqual(hits, []);
});

test("privacy: no street address, office or headquarters claims; no LocalBusiness/address schema", () => {
  for (const f of pages) {
    const s = read(f);
    assert.doesNotMatch(s, /headquarter|our offices?\b|office in\b|nuestras? oficinas?|sede central|\bsuite \d|street address/i, f);
    for (const block of jsonLd(s)) {
      const str = JSON.stringify(block);
      assert.doesNotMatch(str, /"address"|PostalAddress|LocalBusiness|"geo"/, f);
    }
  }
});

test("privacy: the only state named is Wyoming, and only in the governing-law clause", () => {
  for (const f of pages) {
    const s = read(f);
    if (/\/terms\/index\.html$/.test(f)) assert.match(s, /Wyoming/, f + " must keep the governing-law clause");
    else assert.doesNotMatch(s, /Wyoming/, f);
  }
});

test("structured data: areaServed is Worldwide on Organization and every Service", () => {
  let services = 0;
  for (const f of pages) {
    for (const b of jsonLd(read(f))) {
      if (b["@type"] === "Organization" || b["@type"] === "Service") {
        assert.equal(b.areaServed, "Worldwide", f + " " + b["@type"]);
        if (b["@type"] === "Service") services++;
      }
    }
  }
  assert.equal(services, 14, "7 service pages × 2 languages");
});

test("worldwide message is present in English and Spanish where it matters", () => {
  const en = read(join(DIST, "index.html")), es = read(join(DIST, "es/index.html"));
  assert.match(en, /Smart Digital Solutions for Businesses Worldwide/);
  assert.match(en, /Serving businesses worldwide/);
  assert.match(es, /Soluciones digitales inteligentes para negocios en todo el mundo/);
  assert.match(es, /Atendemos negocios en todo el mundo/);
  assert.match(read(join(DIST, "about/index.html")), /around the world/);
  assert.match(read(join(DIST, "es/about/index.html")), /en todo el mundo/);
  assert.match(read(join(DIST, "faq/index.html")), /We work fully online with businesses worldwide/);
  assert.match(read(join(DIST, "es/faq/index.html")), /Trabajamos 100 % en línea con negocios de todo el mundo/);
});

test("phone is shown in international format; tel: link unchanged", () => {
  assert.equal(site.phoneDisplay, "+1 (307) 217-8616");
  for (const f of pages) {
    const s = read(f);
    assert.doesNotMatch(s.replace(/\+1 \(307\) 217-8616/g, ""), /\(307\) 217-8616/, f + " has a phone number without +1");
    assert.match(s, /href="tel:\+13072178616"/, f);
  }
});

test("NFC cards: international orders case by case, never worldwide shipping", () => {
  const all = pages.map(read).join("\n");
  assert.doesNotMatch(all, /ship(ping)? worldwide|worldwide shipping|free international shipping|env[ií]os? a todo el mundo|env[ií]o internacional gratis/i);
  assert.match(read(join(DIST, "services/nfc-review-cards/index.html")), /case by case/);
  assert.match(read(join(DIST, "es/services/nfc-review-cards/index.html")), /caso por caso/);
});

test("contact options: email and phone only (no WhatsApp)", () => {
  for (const f of files.filter((f) => /\.(html|js)$/.test(f))) assert.doesNotMatch(read(f), /whatsapp|wa\.me/i, f);
  assert.doesNotMatch(KNOWLEDGE, /whatsapp/i);
});

test("no unsupported legal-compliance claims", () => {
  for (const f of pages) {
    assert.doesNotMatch(read(f), /\bGDPR\b|\bRGPD\b|\bCCPA\b|\bLGPD\b|\bHIPAA\b|compliant with|in compliance with|cumplimos con|certified|certificad[oa]s?/i, f);
  }
});

test("legal pages keep draft notices and use the fixed legal date", () => {
  for (const f of pages.filter(isLegal)) {
    const s = read(f);
    assert.match(s, /Draft under legal review|Borrador en revisión legal/, f);
    assert.match(s, new RegExp(`: ${site.legalUpdated}<`), f);
  }
  assert.match(read(join(DIST, "privacy/index.html")), /Where information is processed/);
  assert.match(read(join(DIST, "es/privacy/index.html")), /Dónde se procesa la información/);
});

test("sitemap: 36 URLs, stable lastmod, 3 hreflang alternates each", () => {
  const sm = read(join(DIST, "sitemap.xml"));
  const urls = sm.match(/<url>[\s\S]*?<\/url>/g);
  assert.equal(urls.length, 36);
  for (const u of urls) {
    assert.match(u, new RegExp(`<lastmod>${site.contentUpdated}</lastmod>`));
    assert.equal((u.match(/hreflang=/g) || []).length, 3);
  }
});

test("internal links: FAQ answers and About page link to service pages", () => {
  for (const f of ["faq/index.html", "es/faq/index.html"]) {
    const n = (read(join(DIST, f)).match(/class="faq-more"><a href="\/(es\/)?(services|ai-solutions)\//g) || []).length;
    assert.ok(n >= 6, `${f} has ${n} contextual links`);
  }
  assert.match(read(join(DIST, "about/index.html")), /<ul class="related">[\s\S]*href="\/services\/"/);
  assert.match(read(join(DIST, "es/about/index.html")), /<ul class="related">[\s\S]*href="\/es\/services\/"/);
});

test("quote form: new international fields exist and are all optional", () => {
  for (const f of ["contact/index.html", "es/contact/index.html"]) {
    const s = read(join(DIST, f));
    const country = s.match(/<input id="f-country"[^>]*>/)[0];
    const method = s.match(/<select id="f-contact-method"[^>]*>/)[0];
    assert.doesNotMatch(country, /required/, f);
    assert.doesNotMatch(method, /required/, f);
    assert.match(s, /<input type="hidden" name="timezone" value="" data-timezone>/, f);
    assert.match(s, /data-tz-note hidden/, f);
    assert.doesNotMatch(s, /value="whatsapp"/i, f);
    // required fields unchanged
    assert.equal((s.match(/\srequired[\s>]/g) || []).length, 5, f + " required inputs (name, business, email, industry, description)");
  }
});

test("chatbot knowledge: worldwide, location privacy rule, no state named", () => {
  assert.match(KNOWLEDGE, /work fully online with businesses worldwide/);
  assert.match(KNOWLEDGE, /LOCATION PRIVACY/);
  assert.match(KNOWLEDGE, /We work fully online with businesses worldwide\./);
  assert.match(KNOWLEDGE, /case by case/);
  assert.match(KNOWLEDGE, /\+1 \(307\) 217-8616/);
  assert.doesNotMatch(KNOWLEDGE.replace(/a client in New Jersey, Mexico or Spain/, ""), /New Jersey|\bNJ\b|Wyoming|U\.S\./);
});
