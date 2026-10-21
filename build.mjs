// Global Bot Solutions — static site generator (no dependencies).
// Usage: node build.mjs        → writes the site to ./dist
//
// English pages live at the root (/services/), Spanish at /es/ (/es/services/).
// All copy comes from src/content/{en,es}.mjs; business facts from src/site.config.mjs.

import { mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { site } from "./src/site.config.mjs";
import en from "./src/content/en.mjs";
import es from "./src/content/es.mjs";
import { icon } from "./src/icons.mjs";
import { portfolio } from "./src/data/portfolio.mjs";

const OUT = "dist";
const LANGS = { en, es };
const TODAY = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------- helpers
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const u = (lang, path) => (lang === "es" ? "/es" + path : path);
const abs = (lang, path) => site.domain + u(lang, path);
const json = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
const map = (arr, fn) => arr.map(fn).join("");

function assetHash(dir) {
  const h = createHash("sha256");
  const walk = (d) => readdirSync(d).sort().forEach((f) => {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p) : h.update(readFileSync(p));
  });
  walk(dir);
  return h.digest("hex").slice(0, 10);
}
const V = assetHash("public");

const contactHref = (lang, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return u(lang, "/contact/") + (q ? "?" + q : "") + "#quote-form";
};

const btn = (href, label, kind = "primary", extra = "") =>
  `<a class="btn btn-${kind}${extra ? " " + extra : ""}" href="${esc(href)}">${esc(label)}</a>`;

// ---------------------------------------------------------------- page registry
// path is language-neutral; each page renders once per language.
const SERVICE_SLUGS = Object.keys(en.pages.servicePages);
const pages = [
  { key: "home", path: "/" },
  { key: "services", path: "/services/" },
  ...SERVICE_SLUGS.map((s) => ({ key: "service", slug: s, path: `/services/${s}/` })),
  { key: "ai", path: "/ai-solutions/" },
  { key: "industries", path: "/industries/" },
  { key: "portfolio", path: "/portfolio/" },
  { key: "custom", path: "/custom-solutions/" },
  { key: "about", path: "/about/" },
  { key: "contact", path: "/contact/" },
  { key: "faq", path: "/faq/" },
  { key: "privacy", path: "/privacy/" },
  { key: "terms", path: "/terms/" },
];

// ---------------------------------------------------------------- schema
const orgSchema = (t) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": site.domain + "/#organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.domain + "/",
  logo: site.domain + "/img/logo-512.png",
  email: site.email,
  telephone: site.phoneHref,
  areaServed: { "@type": "State", name: "New Jersey" },
  knowsLanguage: ["en", "es"],
  contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: site.email, telephone: site.phoneHref, availableLanguage: ["English", "Spanish"] }],
  ...(site.social.length ? { sameAs: site.social } : {}),
});
const websiteSchema = (t) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": site.domain + "/#website",
  name: site.name,
  url: site.domain + "/",
  inLanguage: ["en", "es"],
  publisher: { "@id": site.domain + "/#organization" },
});
const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
});

// ---------------------------------------------------------------- layout parts
const NAV = [
  ["home", "/"], ["services", "/services/"], ["ai", "/ai-solutions/"], ["portfolio", "/portfolio/"],
  ["custom", "/custom-solutions/"], ["about", "/about/"], ["contact", "/contact/"],
];

function header(t, lang, path) {
  const other = lang === "en" ? "es" : "en";
  const isActive = (p) => (p === "/" ? path === "/" : path.startsWith(p));
  return `
<header class="site-header" data-header>
  <div class="container header-inner">
    <a class="brand" href="${u(lang, "/")}" aria-label="${esc(site.name)} — ${esc(t.nav.home)}">
      <img src="/img/logo.svg" alt="" width="40" height="40">
      <span class="brand-name">Global Bot <span>Solutions</span></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
      <span class="nav-toggle-open">${icon("menu")}<span class="sr-only">${esc(t.nav.menu)}</span></span>
      <span class="nav-toggle-close">${icon("close")}<span class="sr-only">${esc(t.nav.closeMenu)}</span></span>
    </button>
    <div class="nav-panel" id="site-nav" data-nav>
      <nav aria-label="${esc(t.nav.primary)}">
        <ul class="nav-list">
          ${map(NAV, ([k, p]) => `<li><a href="${u(lang, p)}"${isActive(p) ? ' aria-current="page"' : ""}>${esc(t.nav[k])}</a></li>`)}
        </ul>
      </nav>
      <div class="header-actions">
        <div class="lang-switch" role="group" aria-label="${esc(t.nav.langSwitch)}">
          <a href="${u("en", path)}" hreflang="en" lang="en"${lang === "en" ? ' aria-current="true"' : ""}>EN</a>
          <span aria-hidden="true">|</span>
          <a href="${u("es", path)}" hreflang="es" lang="es"${lang === "es" ? ' aria-current="true"' : ""}>ES</a>
        </div>
        ${btn(contactHref(lang), t.cta.quoteShort, "primary", "btn-sm")}
      </div>
    </div>
  </div>
</header>`;
}

function footer(t, lang) {
  return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand brand-light" href="${u(lang, "/")}">
          <img src="/img/logo.svg" alt="" width="40" height="40" loading="lazy">
          <span class="brand-name">Global Bot <span>Solutions</span></span>
        </a>
        <p>${esc(t.footer.blurb)}</p>
        <p class="footer-cta-title">${esc(t.footer.ctaTitle)}</p>
        ${btn(contactHref(lang), t.cta.quoteShort, "primary", "btn-sm")}
      </div>
      <div>
        <p class="footer-head">${esc(t.footer.servicesHead)}</p>
        <ul>${map(t.services.filter((s) => s.key !== "customer-service"), (s) => `<li><a href="${u(lang, s.href)}">${esc(s.name)}</a></li>`)}</ul>
      </div>
      <div>
        <p class="footer-head">${esc(t.footer.companyHead)}</p>
        <ul>
          <li><a href="${u(lang, "/ai-solutions/")}">${esc(t.nav.ai)}</a></li>
          <li><a href="${u(lang, "/industries/")}">${esc(t.nav.industries)}</a></li>
          <li><a href="${u(lang, "/portfolio/")}">${esc(t.nav.portfolio)}</a></li>
          <li><a href="${u(lang, "/custom-solutions/")}">${esc(t.nav.custom)}</a></li>
          <li><a href="${u(lang, "/about/")}">${esc(t.nav.about)}</a></li>
          <li><a href="${u(lang, "/faq/")}">${esc(t.nav.faq)}</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-head">${esc(t.footer.contactHead)}</p>
        <ul class="footer-contact">
          <li><a href="mailto:${site.email}">${icon("mail")}${esc(site.email)}</a></li>
          <li><a href="tel:${site.phoneHref}">${icon("phone")}${esc(site.phoneDisplay)}</a></li>
          <li><a href="${u(lang, "/contact/")}">${esc(t.nav.contact)}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${site.year} ${esc(site.legalName)}. ${esc(t.footer.rights)}</p>
      <ul>
        <li><a href="${u(lang, "/privacy/")}">${esc(t.footer.legal.privacy)}</a></li>
        <li><a href="${u(lang, "/terms/")}">${esc(t.footer.legal.terms)}</a></li>
        <li><a href="${u(lang === "en" ? "es" : "en", "/")}" lang="${lang === "en" ? "es" : "en"}">${esc(t.otherLangLabel)}</a></li>
      </ul>
    </div>
  </div>
</footer>`;
}

function layout(t, lang, { path, title, description, body, schema = [], scripts = [], bodyClass = "", noindex = false, data = null }) {
  const canonical = abs(lang, path);
  const og = `${site.domain}/img/og-${lang}.png`;
  const allSchema = [...schema];
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${abs("en", path)}">
<link rel="alternate" hreflang="es" href="${abs("es", path)}">
<link rel="alternate" hreflang="x-default" href="${abs("en", path)}">`}
<meta name="theme-color" content="#0B1730">
<link rel="icon" href="/img/logo.svg" type="image/svg+xml">
<link rel="icon" href="/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="preload" href="/fonts/Inter-Regular.woff" as="font" type="font/woff" crossorigin>
<link rel="preload" href="/fonts/InterDisplay-ExtraBold.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="/css/styles.css?v=${V}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${t.locale}">
<meta property="og:locale:alternate" content="${lang === "en" ? es.locale : en.locale}">
<meta name="twitter:card" content="summary_large_image">
${map(allSchema, (s) => `<script type="application/ld+json">${json(s)}</script>\n`)}${data ? `<script type="application/json" id="page-data">${json(data)}</script>\n` : ""}<script src="/js/main.js?v=${V}" defer></script>
${map(scripts, (s) => `<script src="${s}${s.startsWith("/") ? `?v=${V}` : ""}" defer></script>\n`)}${site.cfAnalyticsToken ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${esc(site.cfAnalyticsToken)}"}'></script>` : ""}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">${esc(t.skip)}</a>
${header(t, lang, path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(t, lang)}
</body>
</html>
`;
}

// ---------------------------------------------------------------- shared sections
function breadcrumbs(t, lang, trail) {
  // trail: [{name, path}] excluding home
  const items = [{ name: t.common.breadcrumbHome, path: "/" }, ...trail];
  return {
    html: `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${map(items, (it, i) =>
      i === items.length - 1 ? `<li><span aria-current="page">${esc(it.name)}</span></li>` : `<li><a href="${u(lang, it.path)}">${esc(it.name)}</a></li>`
    )}</ol></nav>`,
    schema: breadcrumbSchema(items.map((it) => ({ name: it.name, url: abs(lang, it.path) }))),
  };
}

function pageHero({ crumbs, h1, intro, actions = "", extra = "", dark = false, iconName = "" }) {
  return `
<section class="page-hero${dark ? " is-dark" : ""}">
  <div class="container">
    ${crumbs || ""}
    <div class="page-hero-body">
      ${iconName ? `<span class="hero-icon">${icon(iconName)}</span>` : ""}
      <h1>${esc(h1)}</h1>
      ${intro ? `<p class="lead">${esc(intro)}</p>` : ""}
      ${actions ? `<div class="actions">${actions}</div>` : ""}
      ${extra}
    </div>
  </div>
</section>`;
}

function ctaBand(t, lang, { title, text, primary, primaryHref, secondary = true }) {
  return `
<section class="cta-band">
  <div class="container cta-band-inner">
    <div>
      <h2>${esc(title)}</h2>
      ${text ? `<p>${esc(text)}</p>` : ""}
    </div>
    <div class="actions">
      ${btn(primaryHref || contactHref(lang), primary || t.cta.quote, "primary")}
      ${secondary ? btn(contactHref(lang, { intent: "consultation" }), t.cta.consult, "ghost-light") : ""}
    </div>
  </div>
</section>`;
}

const faqList = (items) => `<div class="faq-list">${map(items, (f) => `
  <details class="faq-item">
    <summary><span>${esc(f.q)}</span><span class="faq-marker" aria-hidden="true"></span></summary>
    <div class="faq-answer"><p>${esc(f.a)}</p></div>
  </details>`)}</div>`;

const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

const checkList = (items, cls = "check-list") => `<ul class="${cls}">${map(items, (i) => `<li>${icon("check")}<span>${esc(i)}</span></li>`)}</ul>`;

// ---------------------------------------------------------------- hero visual (home)
function heroVisual(v) {
  return `
<figure class="hero-visual" aria-labelledby="hero-visual-caption">
  <div class="hv-stage" data-hero-visual>
    <div class="hv-browser" aria-hidden="true">
      <div class="hv-browser-bar"><span></span><span></span><span></span><div class="hv-url">riverafamilydental.com</div></div>
      <div class="hv-site">
        <div class="hv-site-nav"><b>${esc(v.site)}</b><i></i><i></i><i></i></div>
        <div class="hv-site-hero">
          <div>
            <p class="hv-site-title">${esc(v.siteTag)}</p>
            <div class="hv-lines"><i></i><i></i></div>
            <span class="hv-site-btn">${esc(v.siteBtn)}</span>
          </div>
          <div class="hv-site-img"></div>
        </div>
        <div class="hv-site-cards"><i></i><i></i><i></i></div>
      </div>
    </div>
    <div class="hv-phone" aria-hidden="true">
      <div class="hv-phone-head">
        <img src="/img/logo.svg" alt="" width="28" height="28">
        <div><b>${esc(v.botName)}</b><span><i></i>${esc(v.online)}</span></div>
      </div>
      <div class="hv-chat">
        <p class="hv-msg hv-in hv-s1">${esc(v.m1)}</p>
        <p class="hv-msg hv-out hv-s2">${esc(v.m2)}</p>
        <p class="hv-msg hv-in hv-s3">${esc(v.m3)}</p>
        <div class="hv-booked hv-s4">${icon("calendar")}<div><b>${esc(v.booked)}</b><span>${esc(v.bookedDetail)}</span></div></div>
      </div>
    </div>
    <div class="hv-call hv-s5" aria-hidden="true">${icon("voice")}<span>${esc(v.call)}</span><span class="hv-wave"><i></i><i></i><i></i><i></i><i></i></span></div>
  </div>
  <figcaption id="hero-visual-caption" class="sr-only">${esc(v.caption)}</figcaption>
</figure>`;
}

// ---------------------------------------------------------------- portfolio mockup
function mockup(p, kind) {
  const th = p.theme;
  const chat = p.categories.includes("chatbot");
  const book = p.categories.includes("booking");
  const name = esc(p.name);
  if (kind === "mobile") {
    return `<svg class="mock mock-mobile" viewBox="0 0 180 360" role="img" aria-label="${name} — mobile preview">
  <rect width="180" height="360" rx="22" fill="${th.ink}"/>
  <rect x="7" y="7" width="166" height="346" rx="17" fill="${th.bg}"/>
  <rect x="66" y="13" width="48" height="8" rx="4" fill="${th.ink}"/>
  <text x="18" y="46" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="${th.ink}">${name}</text>
  <rect x="146" y="38" width="16" height="2.5" rx="1" fill="${th.ink}"/><rect x="146" y="43" width="16" height="2.5" rx="1" fill="${th.ink}"/>
  <rect x="18" y="62" width="144" height="88" rx="10" fill="${th.block}"/>
  <rect x="18" y="164" width="120" height="10" rx="3" fill="${th.ink}"/>
  <rect x="18" y="180" width="96" height="10" rx="3" fill="${th.ink}"/>
  <rect x="18" y="200" width="140" height="5" rx="2" fill="${th.ink}" opacity=".35"/>
  <rect x="18" y="210" width="118" height="5" rx="2" fill="${th.ink}" opacity=".35"/>
  <rect x="18" y="228" width="144" height="26" rx="8" fill="${th.accent}"/>
  <rect x="18" y="266" width="68" height="58" rx="8" fill="${th.block}"/><rect x="94" y="266" width="68" height="58" rx="8" fill="${th.block}"/>
  ${chat ? `<circle cx="148" cy="330" r="14" fill="${th.accent}"/><path d="M141 325h14v8h-9l-5 4z" fill="${th.bg}"/>` : ""}
</svg>`;
  }
  return `<svg class="mock mock-desktop" viewBox="0 0 480 300" role="img" aria-label="${name} — desktop preview">
  <rect width="480" height="300" rx="10" fill="${th.bg}"/>
  <rect width="480" height="22" rx="10" fill="${th.ink}" opacity=".08"/>
  <circle cx="14" cy="11" r="3.5" fill="${th.ink}" opacity=".3"/><circle cx="25" cy="11" r="3.5" fill="${th.ink}" opacity=".3"/><circle cx="36" cy="11" r="3.5" fill="${th.ink}" opacity=".3"/>
  <text x="24" y="48" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${th.ink}">${name}</text>
  <rect x="290" y="41" width="34" height="5" rx="2" fill="${th.ink}" opacity=".45"/><rect x="334" y="41" width="34" height="5" rx="2" fill="${th.ink}" opacity=".45"/>
  <rect x="384" y="34" width="72" height="20" rx="6" fill="${th.accent}"/>
  <rect x="24" y="86" width="200" height="16" rx="4" fill="${th.ink}"/>
  <rect x="24" y="108" width="160" height="16" rx="4" fill="${th.ink}"/>
  <rect x="24" y="136" width="196" height="6" rx="3" fill="${th.ink}" opacity=".35"/>
  <rect x="24" y="148" width="170" height="6" rx="3" fill="${th.ink}" opacity=".35"/>
  <rect x="24" y="168" width="96" height="26" rx="7" fill="${th.accent}"/>
  <rect x="128" y="168" width="80" height="26" rx="7" fill="none" stroke="${th.ink}" stroke-opacity=".35"/>
  <rect x="256" y="76" width="200" height="132" rx="12" fill="${th.block}"/>
  ${book ? `<rect x="276" y="96" width="120" height="92" rx="8" fill="${th.bg}"/><rect x="286" y="106" width="60" height="6" rx="3" fill="${th.ink}"/>${[0,1,2,3].map(r=>[0,1,2,3,4].map(c=>`<rect x="${286+c*21}" y="${120+r*16}" width="15" height="10" rx="2" fill="${(r+c)%3===0?th.accent:th.block}"/>`).join("")).join("")}` : ""}
  ${chat ? `<rect x="330" y="150" width="112" height="44" rx="9" fill="${th.bg}" stroke="${th.ink}" stroke-opacity=".12"/><rect x="340" y="160" width="74" height="7" rx="3.5" fill="${th.accent}"/><rect x="340" y="174" width="88" height="7" rx="3.5" fill="${th.ink}" opacity=".25"/><circle cx="446" cy="262" r="16" fill="${th.accent}"/><path d="M438 256h16v9h-10l-6 5z" fill="${th.bg}"/>` : ""}
  <rect x="24" y="226" width="130" height="56" rx="8" fill="${th.block}"/><rect x="166" y="226" width="130" height="56" rx="8" fill="${th.block}"/><rect x="308" y="226" width="${chat ? 100 : 148}" height="56" rx="8" fill="${th.block}"/>
</svg>`;
}

// ---------------------------------------------------------------- PAGES
const render = {};

render.home = (t, lang) => {
  const P = t.pages.home;
  const body = `
<section class="home-hero">
  <div class="container home-hero-grid">
    <div class="home-hero-copy">
      <h1>${esc(P.hero.h1)}</h1>
      <p class="lead">${esc(P.hero.text)}</p>
      <div class="actions">
        ${btn(contactHref(lang), t.cta.quote, "primary", "btn-lg")}
        ${btn(u(lang, "/services/"), t.cta.explore, "secondary", "btn-lg")}
      </div>
      <ul class="hero-points">${map(P.hero.points, (p) => `<li>${icon("check")}${esc(p)}</li>`)}</ul>
    </div>
    ${heroVisual(P.hero.visual)}
  </div>
</section>

<section class="section trust" aria-labelledby="trust-title">
  <div class="container">
    <h2 id="trust-title" class="section-title narrow">${esc(P.trust.title)}</h2>
    <ul class="trust-grid">${map(P.trust.items, (it) => `
      <li><span class="trust-icon">${icon(it.icon)}</span><div><h3>${esc(it.t)}</h3><p>${esc(it.d)}</p></div></li>`)}
    </ul>
  </div>
</section>

<section class="section section-alt" id="services" aria-labelledby="services-title">
  <div class="container">
    <div class="section-head">
      <h2 id="services-title" class="section-title">${esc(P.services.title)}</h2>
      <p>${esc(P.services.text)}</p>
    </div>
    <ul class="service-grid" data-reveal-group>${map(t.services, (s) => `
      <li class="service-tile">
        <span class="tile-icon">${icon(s.icon)}</span>
        <h3><a href="${u(lang, s.href)}">${esc(s.name)}</a></h3>
        <p>${esc(s.short)}</p>
        <span class="tile-links"><a class="link-arrow" href="${u(lang, s.href)}" tabindex="-1" aria-hidden="true">${esc(t.cta.learnMore)}${icon("arrow")}</a><a class="tile-quote" href="${esc(contactHref(lang, { service: s.key }))}">${esc(t.cta.quoteShort)}<span class="sr-only">: ${esc(s.name)}</span></a></span>
      </li>`)}
    </ul>
    <div class="section-foot">${btn(contactHref(lang), t.cta.quote, "primary")}</div>
  </div>
</section>

<section class="section is-dark value" aria-labelledby="value-title">
  <div class="container value-grid">
    <div>
      <h2 id="value-title" class="display">${esc(P.value.title)}</h2>
      <p class="lead">${esc(P.value.text)}</p>
      <div class="actions">${btn(contactHref(lang, { service: "not-sure" }), t.cta.ideal, "primary", "btn-lg")}</div>
    </div>
    <div class="value-side">
      <p class="value-slogan">${esc(P.value.slogan)}</p>
      <ul>${map(P.value.side, (s) => `<li><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`)}</ul>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="why-title">
  <div class="container why-grid">
    <h2 id="why-title" class="section-title">${esc(P.why.title)}</h2>
    <ul class="why-list">${map(P.why.items, (it) => `<li>${icon("check")}<div><h3>${esc(it.t)}</h3><p>${esc(it.d)}</p></div></li>`)}</ul>
  </div>
</section>

<section class="section section-alt" id="how" aria-labelledby="steps-title">
  <div class="container">
    <h2 id="steps-title" class="section-title">${esc(P.steps.title)}</h2>
    <ol class="steps">${map(P.steps.items, (s, i) => `<li><span class="step-num" aria-hidden="true">${i + 1}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`)}</ol>
  </div>
</section>

<section class="section is-dark ai-teaser" aria-labelledby="ai-teaser-title">
  <div class="container ai-teaser-grid">
    <div>
      <h2 id="ai-teaser-title" class="section-title">${esc(P.aiTeaser.title)}</h2>
      <p class="lead">${esc(P.aiTeaser.text)}</p>
      ${checkList(P.aiTeaser.bullets, "check-list on-dark")}
      <div class="actions">${btn(u(lang, "/ai-solutions/"), P.aiTeaser.btn, "primary")}</div>
    </div>
    <div class="teaser-tiles" aria-hidden="true">
      <div class="tt tt-chat">${icon("chat")}<span></span><span></span></div>
      <div class="tt tt-voice">${icon("voice")}<span class="hv-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div>
      <div class="tt tt-cal">${icon("calendar")}<span class="tt-grid">${"<i></i>".repeat(12)}</span></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="ind-title">
  <div class="container">
    <div class="section-head">
      <h2 id="ind-title" class="section-title">${esc(P.industries.title)}</h2>
      <p>${esc(P.industries.text)}</p>
    </div>
    <ul class="chip-list">${map(t.pages.industries.list, (i) => `<li><a class="chip" href="${u(lang, "/industries/")}#${i.key}">${icon(i.icon)}${esc(i.name)}</a></li>`)}</ul>
    <p class="section-foot left"><a class="link-arrow" href="${u(lang, "/industries/")}">${esc(t.cta.allIndustries)}${icon("arrow")}</a></p>
  </div>
</section>

${ctaBand(t, lang, { title: P.final.title, text: P.final.text, primary: t.cta.personalized })}
`;
  return { title: P.title, description: P.description, body, schema: [orgSchema(t), websiteSchema(t)], bodyClass: "page-home" };
};

render.services = (t, lang) => {
  const P = t.pages.services;
  const bc = breadcrumbs(t, lang, [{ name: t.nav.services, path: "/services/" }]);
  const byKey = Object.fromEntries(t.services.map((s) => [s.key, s]));
  const body = `
${pageHero({ crumbs: bc.html, h1: P.h1, intro: P.intro, actions: btn(contactHref(lang), t.cta.quote, "primary") + btn(u(lang, "/ai-solutions/"), t.cta.seeDemo, "secondary") })}
<section class="section">
  <div class="container">
    <h2 class="section-title">${esc(P.groupsTitle)}</h2>
    <div class="service-groups">${map(P.groups, (g) => `
      <div class="service-group">
        <div class="service-group-head"><h3>${esc(g.t)}</h3><p>${esc(g.d)}</p></div>
        <ul class="service-rows">${map(g.keys, (k) => {
          const s = byKey[k];
          return `<li><a href="${u(lang, s.href)}"><span class="tile-icon">${icon(s.icon)}</span><span><b>${esc(s.name)}</b><span>${esc(s.short)}</span></span>${icon("arrow", "icon row-arrow")}</a></li>`;
        })}</ul>
      </div>`)}
    </div>
  </div>
</section>
${ctaBand(t, lang, { title: P.slogan, text: t.footer.ctaText })}
`;
  return { title: P.title, description: P.description, body, schema: [bc.schema] };
};

render.service = (t, lang, page) => {
  const S = t.pages.servicePages[page.slug];
  const bc = breadcrumbs(t, lang, [{ name: t.nav.services, path: "/services/" }, { name: S.name, path: page.path }]);
  const quote = contactHref(lang, { service: page.slug });
  const related = t.services.filter((s) => s.href !== page.path && s.key !== "customer-service").slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: S.name,
    serviceType: S.name,
    description: S.description,
    url: abs(lang, page.path),
    inLanguage: lang,
    provider: { "@id": site.domain + "/#organization" },
    areaServed: { "@type": "State", name: "New Jersey" },
    availableLanguage: ["English", "Spanish"],
  };
  const body = `
${pageHero({ crumbs: bc.html, iconName: S.icon, h1: S.h1, intro: S.intro, actions: btn(quote, S.ctaLabel, "primary", "btn-lg") + (S.demo ? btn(u(lang, S.demo.href), t.cta.seeDemo, "secondary", "btn-lg") : btn(contactHref(lang, { service: page.slug, intent: "consultation" }), t.cta.consult, "secondary", "btn-lg")) })}

<section class="section">
  <div class="container split">
    <div class="problem">
      <h2 class="h3">${esc(S.problem.title)}</h2>
      <p class="lead">${esc(S.problem.text)}</p>
    </div>
    <div class="features-box">
      <h2 class="h3">${esc(S.name)}</h2>
      ${checkList(S.features)}
    </div>
  </div>
</section>

${S.status ? `<section class="section section-tight">
  <div class="container">
    <div class="status-box">
      <h2 class="h3">${esc(S.status.title)}</h2>
      <div class="status-grid">${map(S.status.items, (s, i) => `<div class="status-item ${i === 0 ? "is-included" : "is-quoted"}"><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`)}</div>
    </div>
  </div>
</section>` : ""}

<section class="section section-alt">
  <div class="container">
    <h2 class="section-title">${esc(t.common.howTitle)}</h2>
    <ol class="steps">${map(S.how, (s, i) => `<li><span class="step-num" aria-hidden="true">${i + 1}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`)}</ol>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title">${esc(t.common.benefitsTitle)}</h2>
    <ul class="benefit-grid">${map(S.benefits, (b) => `<li><h3>${esc(b.t)}</h3><p>${esc(b.d)}</p></li>`)}</ul>
    ${S.note ? `<p class="note-box">${icon("shield")}<span>${esc(S.note)}</span></p>` : ""}
  </div>
</section>

<section class="section section-alt">
  <div class="container split">
    <div>
      <h2 class="section-title">${esc(t.common.useCasesTitle)}</h2>
      ${checkList(S.useCases)}
    </div>
    ${S.demo ? `<div class="demo-callout is-dark">
      <span class="tile-icon">${icon(S.icon)}</span>
      <h3>${esc(t.cta.seeDemo)}</h3>
      <p>${esc(S.demo.text)}</p>
      ${btn(u(lang, S.demo.href), t.cta.seeDemo, "primary")}
    </div>` : `<div class="demo-callout">
      <h3>${esc(t.pages.home.value.slogan)}</h3>
      <p>${esc(t.common.proposalNote)}</p>
      ${btn(quote, S.ctaLabel, "primary")}
    </div>`}
  </div>
</section>

<section class="section">
  <div class="container faq-wrap">
    <h2 class="section-title">${esc(t.common.faqTitle)}</h2>
    ${faqList(S.faq)}
  </div>
</section>

<section class="section section-tight section-alt">
  <div class="container">
    <h2 class="h3">${esc(t.common.relatedTitle)}</h2>
    <ul class="related">${map(related, (s) => `<li><a href="${u(lang, s.href)}">${icon(s.icon)}<span>${esc(s.name)}</span></a></li>`)}</ul>
  </div>
</section>

${ctaBand(t, lang, { title: S.h1, text: t.common.proposalNote, primary: S.ctaLabel, primaryHref: quote })}
`;
  return { title: S.title, description: S.description, body, schema: [bc.schema, schema, faqSchema(S.faq)] };
};

render.ai = (t, lang) => {
  const A = t.pages.ai;
  const bc = breadcrumbs(t, lang, [{ name: t.nav.ai, path: "/ai-solutions/" }]);
  const industries = Object.keys(en.pages.ai.scripts);
  const scripts = { en: en.pages.ai.scripts, es: es.pages.ai.scripts };
  const calls = { en: en.pages.ai.call, es: es.pages.ai.call };
  const data = {
    lang,
    scripts,
    calls,
    labels: { chat: A.chat, voice: A.voice, booking: A.booking },
    langNames: { en: lang === "en" ? "English" : "Inglés", es: lang === "en" ? "Spanish" : "Español" },
  };
  const langToggle = (name, labelId) => `<div class="seg" role="radiogroup" aria-labelledby="${labelId}">
      <label><input type="radio" name="${name}" value="en"${lang === "en" ? " checked" : ""}><span>EN</span></label>
      <label><input type="radio" name="${name}" value="es"${lang === "es" ? " checked" : ""}><span>ES</span></label>
    </div>`;

  const body = `
${pageHero({ crumbs: bc.html, h1: A.h1, intro: A.intro, dark: true, actions: btn(contactHref(lang), t.cta.quote, "primary") ,
  extra: `<p class="disclaimer">${icon("shield")}<span><b>${esc(t.common.simulated)}.</b> ${esc(A.disclaimer)}</span></p>
  <nav class="jump" aria-label="${esc(t.common.onThisPage)}"><ul>
    <li><a href="#chat-demo">${icon("chat")}${esc(A.jump.chat)}</a></li>
    <li><a href="#voice-demo">${icon("voice")}${esc(A.jump.voice)}</a></li>
    <li><a href="#booking-demo">${icon("calendar")}${esc(A.jump.booking)}</a></li>
    <li><a href="#nfc-demo">${icon("nfc")}${esc(A.jump.nfc)}</a></li>
  </ul></nav>` })}

<div class="demo-page is-dark">

<section class="demo-section" id="chat-demo" aria-labelledby="chat-title">
  <div class="container demo-grid">
    <div class="demo-intro">
      <span class="demo-tag">${esc(t.common.simulated)}</span>
      <h2 id="chat-title" class="section-title">${esc(A.chat.title)}</h2>
      <p class="lead">${esc(A.chat.text)}</p>
      <p class="field-label" id="chat-ind-label">${esc(A.chat.industryLabel)}</p>
      <div class="seg seg-wrap" role="radiogroup" aria-labelledby="chat-ind-label" data-chat-industry>
        ${map(industries, (k, i) => `<label><input type="radio" name="chat-industry" value="${k}"${i === 0 ? " checked" : ""}><span>${esc(A.scripts[k].label)}</span></label>`)}
      </div>
      <p class="field-label" id="chat-lang-label">${esc(A.chat.langLabel)}</p>
      <div data-chat-lang>${langToggle("chat-lang", "chat-lang-label")}</div>
    </div>
    <div class="chat-window" data-chat>
      <div class="chat-head">
        <img src="/img/logo.svg" alt="" width="32" height="32">
        <div><b>${esc(A.chat.windowTitle)}</b><span>${esc(A.chat.status)}</span></div>
        <button type="button" class="icon-btn" data-chat-reset aria-label="${esc(A.chat.reset)}">${icon("restart")}</button>
      </div>
      <div class="chat-log" data-chat-log role="log" aria-live="polite" aria-relevant="additions"></div>
      <div class="chat-suggest">
        <p class="sr-only" id="chat-q-label">${esc(A.chat.questionsLabel)}</p>
        <div class="chat-chips" data-chat-chips role="group" aria-labelledby="chat-q-label"></div>
      </div>
    </div>
  </div>
</section>

<section class="demo-section" id="voice-demo" aria-labelledby="voice-title">
  <div class="container demo-grid demo-grid-flip">
    <div class="demo-intro">
      <span class="demo-tag">${esc(t.common.simulated)}</span>
      <h2 id="voice-title" class="section-title">${esc(A.voice.title)}</h2>
      <p class="lead">${esc(A.voice.text)}</p>
      <h3 class="h4">${esc(A.voice.questionsTitle)}</h3>
      ${checkList(A.voice.questions, "check-list on-dark compact")}
    </div>
    <div class="voice-card" data-voice>
      <div class="voice-top">
        <div class="voice-id"><span class="voice-avatar">${icon("voice")}</span><div><b>Bright Smile Dental</b><span data-voice-status>${esc(A.voice.agent)}</span></div></div>
        <div data-voice-lang><span class="sr-only" id="voice-lang-label">${esc(A.voice.langLabel)}</span>${langToggle("voice-lang", "voice-lang-label")}</div>
      </div>
      <div class="waveform" data-wave aria-hidden="true">${"<i></i>".repeat(36)}</div>
      <div class="voice-controls">
        <button type="button" class="btn btn-primary" data-voice-play><span data-play-icon>${icon("play")}</span><span data-play-label>${esc(A.voice.play)}</span></button>
        <button type="button" class="btn btn-ghost-light" data-voice-restart>${icon("restart")}${esc(A.voice.restart)}</button>
        <span class="voice-time" data-voice-time aria-hidden="true">00:00</span>
      </div>
      <p class="voice-note" data-voice-note>${esc(A.voice.ttsNote)}</p>
      <h3 class="h5" id="transcript-title">${esc(A.voice.transcript)}</h3>
      <ol class="transcript" data-transcript aria-labelledby="transcript-title"></ol>
    </div>
  </div>
</section>

<section class="demo-section" id="booking-demo" aria-labelledby="booking-title">
  <div class="container demo-grid">
    <div class="demo-intro">
      <span class="demo-tag">${esc(t.common.simulated)}</span>
      <h2 id="booking-title" class="section-title">${esc(A.booking.title)}</h2>
      <p class="lead">${esc(A.booking.text)}</p>
    </div>
    <div class="booking" data-booking>
      <ol class="booking-steps" aria-hidden="true">${map(A.booking.steps, (s, i) => `<li data-step-ind="${i}"><span>${i + 1}</span>${esc(s)}</li>`)}</ol>
      <div class="booking-body">
        <div class="booking-panel" data-panel="0">
          <h3 class="h5" tabindex="-1">${esc(A.booking.chooseService)}</h3>
          <div class="svc-options" role="radiogroup" aria-label="${esc(A.booking.chooseService)}">
            ${map(A.booking.services, (s, i) => `<label class="svc-option"><input type="radio" name="bk-service" value="${s.id}"${i === 0 ? " checked" : ""}><span><b>${esc(s.name)}</b><span>${esc(s.dur)}</span></span></label>`)}
          </div>
        </div>
        <div class="booking-panel" data-panel="1" hidden>
          <h3 class="h5" tabindex="-1">${esc(A.booking.chooseTime)}</h3>
          <div class="day-row" data-days role="radiogroup" aria-label="${esc(A.booking.chooseTime)}"></div>
          <div class="slot-grid" data-slots role="radiogroup" aria-label="${esc(A.booking.chooseTime)}"></div>
          <p class="bk-error" data-bk-error-time hidden>${esc(A.booking.pickTime)}</p>
        </div>
        <div class="booking-panel" data-panel="2" hidden>
          <h3 class="h5" tabindex="-1">${esc(A.booking.details)}</h3>
          <div class="bk-fields">
            <label>${esc(A.booking.name)}<input type="text" name="bk-name" autocomplete="off" maxlength="60"></label>
            <label>${esc(A.booking.phone)}<input type="tel" name="bk-phone" autocomplete="off" maxlength="20"></label>
          </div>
          <p class="bk-error" data-bk-error-name hidden>${esc(A.booking.fillDetails)}</p>
          <div class="bk-summary" data-bk-summary></div>
        </div>
        <div class="booking-panel booking-done" data-panel="3" hidden>
          <span class="done-icon">${icon("check")}</span>
          <h3 class="h5" tabindex="-1">${esc(A.booking.confirmedTitle)}</h3>
          <div class="bk-summary" data-bk-final></div>
          <p>${esc(A.booking.confirmedText)}</p>
        </div>
      </div>
      <div class="booking-nav">
        <button type="button" class="btn btn-ghost-light" data-bk-back hidden>${esc(A.booking.back)}</button>
        <button type="button" class="btn btn-primary" data-bk-next>${esc(A.booking.next)}</button>
        <button type="button" class="btn btn-ghost-light" data-bk-restart hidden>${esc(A.booking.startOver)}</button>
      </div>
      <p class="sr-only" aria-live="polite" data-bk-live></p>
    </div>
  </div>
</section>

<section class="demo-section" id="nfc-demo" aria-labelledby="nfc-title">
  <div class="container demo-grid demo-grid-flip">
    <div class="demo-intro">
      <span class="demo-tag">${esc(t.common.simulated)}</span>
      <h2 id="nfc-title" class="section-title">${esc(A.nfc.title)}</h2>
      <p class="lead">${esc(A.nfc.text)}</p>
      <ol class="nfc-steps">${map(A.nfc.steps, (s, i) => `<li><span class="step-num" aria-hidden="true">${i + 1}</span><div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div></li>`)}</ol>
      <p class="small muted-light">${esc(A.nfc.note)}</p>
    </div>
    <div class="nfc-stage" data-nfc>
      <div class="nfc-scene" aria-hidden="true">
        <div class="nfc-card">
          <img src="/img/logo.svg" alt="" width="34" height="34">
          <b>${esc(A.nfc.cardLabel)}</b>
          <span class="nfc-mark">${icon("nfc")}</span>
        </div>
        <div class="nfc-phone">
          <div class="nfc-screen nfc-idle"><span>${icon("nfc")}</span></div>
          <div class="nfc-screen nfc-review">
            <b>${esc(A.nfc.phoneTitle)}</b>
            <span>${esc(A.nfc.phoneSub)}</span>
            <span class="stars">${icon("star")}${icon("star")}${icon("star")}${icon("star")}${icon("star")}</span>
            <i></i><i></i>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-primary" data-nfc-tap aria-pressed="false">${esc(A.nfc.tap)}</button>
    </div>
  </div>
</section>

</div>

${ctaBand(t, lang, { title: A.cta.title, text: A.cta.text })}
`;
  return { title: A.title, description: A.description, body, schema: [bc.schema], scripts: ["/js/demos.js"], data, bodyClass: "page-ai" };
};

render.industries = (t, lang) => {
  const I = t.pages.industries;
  const bc = breadcrumbs(t, lang, [{ name: t.nav.industries, path: "/industries/" }]);
  const body = `
${pageHero({ crumbs: bc.html, h1: I.h1, intro: I.intro,
  extra: `<nav class="jump light" aria-label="${esc(t.common.onThisPage)}"><ul>${map(I.list, (i) => `<li><a href="#${i.key}">${icon(i.icon)}${esc(i.name)}</a></li>`)}</ul></nav>` })}
<section class="section">
  <div class="container industry-list">${map(I.list, (i) => `
    <article class="industry" id="${i.key}" aria-labelledby="${i.key}-title">
      <div class="industry-main">
        <span class="tile-icon lg">${icon(i.icon)}</span>
        <h2 id="${i.key}-title">${esc(i.name)}</h2>
        <p>${esc(i.text)}</p>
        ${btn(contactHref(lang, { industry: i.key }), i.cta, "primary")}
      </div>
      <div class="industry-cols">
        <div><h3 class="h5">${esc(I.needsLabel)}</h3><ul class="dash-list">${map(i.needs, (n) => `<li>${esc(n)}</li>`)}</ul></div>
        <div><h3 class="h5">${esc(I.helpsLabel)}</h3>${checkList(i.helps)}</div>
      </div>
    </article>`)}
  </div>
</section>
${ctaBand(t, lang, { title: I.otherTitle, text: I.otherText })}
`;
  return { title: I.title, description: I.description, body, schema: [bc.schema] };
};

render.portfolio = (t, lang) => {
  const P = t.pages.portfolio;
  const bc = breadcrumbs(t, lang, [{ name: t.nav.portfolio, path: "/portfolio/" }]);
  const svcName = Object.fromEntries(t.services.map((s) => [s.key, s.name]));
  const body = `
${pageHero({ crumbs: bc.html, h1: P.h1, intro: P.intro })}
<section class="section section-tight">
  <div class="container">
    <p class="note-box">${icon("shield")}<span>${esc(P.conceptNote)}</span></p>
    <div class="filter-bar">
      <p class="field-label" id="pf-filter-label">${esc(P.filterLabel)}</p>
      <div class="seg seg-wrap light" role="radiogroup" aria-labelledby="pf-filter-label" data-pf-filter>
        <label><input type="radio" name="pf" value="all" checked><span>${esc(P.all)}</span></label>
        ${map(Object.entries(P.filters), ([k, v]) => `<label><input type="radio" name="pf" value="${k}"><span>${esc(v)}</span></label>`)}
      </div>
    </div>
    <ul class="pf-grid" data-pf-grid>${map(portfolio, (p) => `
      <li class="pf-card" data-cats="${p.categories.join(" ")}">
        <div class="pf-preview">
          ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" width="960" height="600">` : mockup(p, "desktop")}
          <div class="pf-mobile">${mockup(p, "mobile")}</div>
        </div>
        <div class="pf-body">
          <div class="pf-meta">
            ${p.type === "concept" ? `<span class="badge">${esc(P.conceptBadge)}</span>` : ""}
            <span class="pf-ind">${esc(t.form.industries[p.industry] || p.industry)}</span>
          </div>
          <h2 class="h4">${esc(p.name)}</h2>
          <p>${esc(p.summary[lang])}</p>
          <p class="pf-services"><span class="sr-only">${esc(P.servicesLabel)}: </span>${map(p.services, (s) => `<span>${esc(svcName[s] || s)}</span>`)}</p>
          ${p.type === "client" && p.url ? `<a class="link-arrow" href="${esc(p.url)}" rel="noopener" target="_blank">${esc(p.url.replace(/^https?:\/\//, ""))}${icon("arrow")}</a>` : ""}
        </div>
      </li>`)}
    </ul>
    <p class="pf-empty" data-pf-empty hidden>${esc(P.empty)}</p>
  </div>
</section>
${ctaBand(t, lang, { title: t.pages.home.final.title, text: t.pages.home.final.text })}
`;
  return { title: P.title, description: P.description, body, schema: [bc.schema], scripts: ["/js/portfolio.js"] };
};

render.custom = (t, lang) => {
  const C = t.pages.custom;
  const bc = breadcrumbs(t, lang, [{ name: t.nav.custom, path: "/custom-solutions/" }]);
  const body = `
${pageHero({ crumbs: bc.html, h1: C.h1, intro: C.intro, actions: btn(contactHref(lang), t.cta.quote, "primary", "btn-lg") + btn(contactHref(lang, { intent: "consultation" }), t.cta.consult, "secondary", "btn-lg") })}
<section class="section">
  <div class="container">
    <div class="section-head">
      <h2 class="section-title">${esc(C.cardsTitle)}</h2>
      <p>${esc(C.cardsText)}</p>
    </div>
    <ul class="solution-cards">${map(C.cards, (c) => `
      <li class="solution-card${c.featured ? " is-featured" : ""}">
        <h3>${esc(c.t)}</h3>
        <p>${esc(c.d)}</p>
        ${checkList(c.items, c.featured ? "check-list on-dark" : "check-list")}
        ${btn(contactHref(lang, { service: c.service }), c.btn, "primary", "btn-block")}
      </li>`)}
    </ul>
    <p class="fine-print">${esc(C.disclaimer)}</p>
  </div>
</section>
<section class="section section-alt">
  <div class="container">
    <h2 class="section-title">${esc(C.howTitle)}</h2>
    <ol class="steps steps-3">${map(C.how, (s, i) => `<li><span class="step-num" aria-hidden="true">${i + 1}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`)}</ol>
  </div>
</section>
<section class="section is-dark slogans">
  <div class="container">
    <ul>${map(C.slogans, (s) => `<li>${esc(s)}</li>`)}<li>${esc(t.pages.services.slogan)}</li></ul>
  </div>
</section>
${ctaBand(t, lang, { title: t.pages.home.final.title, text: t.pages.home.final.text, primary: t.cta.personalized })}
`;
  return { title: C.title, description: C.description, body, schema: [bc.schema] };
};

render.about = (t, lang) => {
  const A = t.pages.about;
  const bc = breadcrumbs(t, lang, [{ name: t.nav.about, path: "/about/" }]);
  const body = `
${pageHero({ crumbs: bc.html, h1: A.h1, intro: A.intro })}
<section class="section">
  <div class="container split">
    <div>
      <h2 class="section-title">${esc(A.storyTitle)}</h2>
    </div>
    <div class="prose">${map(A.story, (p) => `<p>${esc(p)}</p>`)}</div>
  </div>
</section>
<section class="section section-alt">
  <div class="container">
    <h2 class="section-title">${esc(A.valuesTitle)}</h2>
    <ul class="trust-grid">${map(A.values, (v) => `<li><span class="trust-icon">${icon(v.icon)}</span><div><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p></div></li>`)}</ul>
  </div>
</section>
<section class="section">
  <div class="container split">
    <div><h2 class="section-title">${esc(A.areaTitle)}</h2></div>
    <div class="prose"><p>${esc(A.areaText)}</p>
      <ul class="contact-lines">
        <li><a href="mailto:${site.email}">${icon("mail")}${esc(site.email)}</a></li>
        <li><a href="tel:${site.phoneHref}">${icon("phone")}${esc(site.phoneDisplay)}</a></li>
      </ul>
    </div>
  </div>
</section>
${ctaBand(t, lang, { title: A.slogan, text: t.footer.ctaText })}
`;
  return { title: A.title, description: A.description, body, schema: [bc.schema] };
};

render.contact = (t, lang) => {
  const C = t.pages.contact;
  const F = t.form;
  const bc = breadcrumbs(t, lang, [{ name: t.nav.contact, path: "/contact/" }]);
  const req = `<span class="req" aria-hidden="true">*</span>`;
  const opt = `<span class="opt">(${esc(F.optional)})</span>`;
  const err = (id) => `<p class="field-error" id="${id}-error" hidden></p>`;
  const formData = {
    lang,
    v: F.v,
    errorFix: F.errorFix,
    errorRate: F.errorRate,
    errorCaptcha: F.errorCaptcha,
    sending: F.sending,
    submit: F.submit,
    turnstile: !!site.turnstileSiteKey,
  };
  const body = `
${pageHero({ crumbs: bc.html, h1: C.h1, intro: C.intro })}
<section class="section section-tight contact-section">
  <div class="container contact-grid">
    <div class="form-card" id="quote-form">
      <h2 class="h3">${esc(F.title)}</h2>
      <p class="small muted">${req} ${esc(F.required)}</p>
      <form method="post" action="/api/contact" novalidate data-contact-form>
        <div class="form-grid">
          <div class="field">
            <label for="f-name">${esc(F.name)} ${req}</label>
            <input id="f-name" name="name" type="text" autocomplete="name" required maxlength="100" aria-describedby="f-name-error">
            ${err("f-name")}
          </div>
          <div class="field">
            <label for="f-business">${esc(F.business)} ${req}</label>
            <input id="f-business" name="business" type="text" autocomplete="organization" required maxlength="120" aria-describedby="f-business-error">
            ${err("f-business")}
          </div>
          <div class="field">
            <label for="f-email">${esc(F.email)} ${req}</label>
            <input id="f-email" name="email" type="email" autocomplete="email" required maxlength="160" aria-describedby="f-email-error">
            ${err("f-email")}
          </div>
          <div class="field">
            <label for="f-phone">${esc(F.phone)} ${opt}</label>
            <input id="f-phone" name="phone" type="tel" autocomplete="tel" maxlength="30" aria-describedby="f-phone-error">
            ${err("f-phone")}
          </div>
          <div class="field">
            <label for="f-industry">${esc(F.industry)} ${req}</label>
            <select id="f-industry" name="industry" required aria-describedby="f-industry-error">
              <option value="">${esc(F.industryPlaceholder)}</option>
              ${map(Object.entries(F.industries), ([k, v]) => `<option value="${k}">${esc(v)}</option>`)}
            </select>
            ${err("f-industry")}
          </div>
          <div class="field">
            <label for="f-website">${esc(F.website)} ${opt}</label>
            <input id="f-website" name="website" type="url" inputmode="url" autocomplete="url" placeholder="${esc(F.websitePlaceholder)}" maxlength="200" aria-describedby="f-website-error">
            ${err("f-website")}
          </div>
          <fieldset class="field field-full" aria-describedby="f-services-hint f-services-error">
            <legend>${esc(F.services)} ${req}</legend>
            <p class="hint" id="f-services-hint">${esc(F.servicesHint)}</p>
            <div class="check-grid">
              ${map(Object.entries(F.serviceOptions), ([k, v]) => `<label class="check"><input type="checkbox" name="services" value="${k}"><span>${esc(v)}</span></label>`)}
            </div>
            ${err("f-services")}
          </fieldset>
          <div class="field field-full">
            <label for="f-description">${esc(F.description)} ${req}</label>
            <textarea id="f-description" name="description" rows="5" required minlength="20" maxlength="3000" placeholder="${esc(F.descriptionPlaceholder)}" aria-describedby="f-description-error"></textarea>
            ${err("f-description")}
          </div>
          <fieldset class="field">
            <legend>${esc(F.language)}</legend>
            <div class="seg light">
              <label><input type="radio" name="language" value="en"${lang === "en" ? " checked" : ""}><span>${esc(F.languages.en)}</span></label>
              <label><input type="radio" name="language" value="es"${lang === "es" ? " checked" : ""}><span>${esc(F.languages.es)}</span></label>
            </div>
          </fieldset>
          <div class="field">
            <label for="f-budget">${esc(F.budget)} ${opt}</label>
            <select id="f-budget" name="budget">
              <option value="">${esc(F.budgetPlaceholder)}</option>
              ${map(Object.entries(F.budgets), ([k, v]) => `<option value="${k}">${esc(v)}</option>`)}
            </select>
          </div>
          <div class="field field-full">
            <label class="check check-solo"><input type="checkbox" name="consultation" value="yes" data-consult><span>${esc(F.consultation)}</span></label>
          </div>
          <div class="hp" aria-hidden="true">
            <label for="f-company-url">Leave this field empty</label>
            <input id="f-company-url" name="company_url" type="text" tabindex="-1" autocomplete="off">
          </div>
          <input type="hidden" name="page_lang" value="${lang}">
          <input type="hidden" name="tracking" value="" data-tracking>
          <input type="hidden" name="started" value="" data-started>
          ${site.turnstileSiteKey ? `<div class="field field-full"><div class="cf-turnstile" data-sitekey="${esc(site.turnstileSiteKey)}" data-language="${lang}" data-theme="light"></div></div>` : ""}
        </div>
        <p class="small muted consent">${esc(F.consent)} <a href="${u(lang, "/privacy/")}">${esc(t.footer.legal.privacy)}</a>.</p>
        <div class="form-status" data-form-status role="alert" hidden></div>
        <button class="btn btn-primary btn-lg" type="submit" data-submit>${esc(F.submit)}</button>
      </form>
      <div class="form-success" data-form-success tabindex="-1" hidden>
        <span class="done-icon">${icon("check")}</span>
        <h2 class="h3">${esc(F.successTitle)}</h2>
        <p>${esc(F.successText)}</p>
      </div>
      <template data-error-template>
        <p><b>${esc(F.errorTitle)}.</b> ${esc(F.errorText)} <a href="mailto:${site.email}">${esc(site.email)}</a> · <a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a></p>
      </template>
    </div>
    <aside class="contact-aside">
      <div class="aside-block">
        <h2 class="h4">${esc(C.sideTitle)}</h2>
        <p>${esc(C.sideText)}</p>
        <ul class="contact-lines">
          <li><a href="tel:${site.phoneHref}">${icon("phone")}<span><b>${esc(t.common.callUs)}</b>${esc(site.phoneDisplay)}</span></a></li>
          <li><a href="mailto:${site.email}">${icon("mail")}<span><b>${esc(t.common.emailUs)}</b>${esc(site.email)}</span></a></li>
        </ul>
      </div>
      <div class="aside-block" id="consultation">
        <h2 class="h4">${esc(C.consultTitle)}</h2>
        <p>${esc(C.consultText)}</p>
      </div>
      <div class="aside-block">
        <h2 class="h4">${esc(C.nextTitle)}</h2>
        <ol class="mini-steps">${map(C.next, (n) => `<li>${esc(n)}</li>`)}</ol>
      </div>
    </aside>
  </div>
</section>
`;
  const scripts = ["/js/contact.js"];
  if (site.turnstileSiteKey) scripts.push("https://challenges.cloudflare.com/turnstile/v0/api.js");
  return { title: C.title, description: C.description, body, schema: [bc.schema], scripts, data: formData };
};

render.faq = (t, lang) => {
  const F = t.pages.faq;
  const bc = breadcrumbs(t, lang, [{ name: t.nav.faq, path: "/faq/" }]);
  const all = F.groups.flatMap((g) => g.items);
  const body = `
${pageHero({ crumbs: bc.html, h1: F.h1, intro: F.intro, actions: btn(contactHref(lang), t.cta.quote, "primary") })}
<section class="section">
  <div class="container faq-page">${map(F.groups, (g) => `
    <div class="faq-group">
      <h2 class="h3">${esc(g.t)}</h2>
      ${faqList(g.items)}
    </div>`)}
  </div>
</section>
${ctaBand(t, lang, { title: t.pages.home.final.title, text: t.pages.home.final.text })}
`;
  return { title: F.title, description: F.description, body, schema: [bc.schema, faqSchema(all)] };
};

const legal = (key) => (t, lang) => {
  const L = t.pages[key];
  const path = `/${key}/`;
  const bc = breadcrumbs(t, lang, [{ name: L.h1, path }]);
  const body = `
${pageHero({ crumbs: bc.html, h1: L.h1, intro: "" })}
<section class="section section-tight">
  <div class="container legal">
    <p class="review-banner" role="note">${icon("shield")}<span>${esc(L.review)}</span></p>
    <p class="small muted">${esc(L.updated)}: ${TODAY}</p>
    ${map(L.sections, (s) => `<h2 class="h4">${esc(s.t)}</h2>${map(s.p, (p) => `<p${p.startsWith("[") ? ' class="owner-todo"' : ""}>${esc(p)}</p>`)}`)}
    <h2 class="h4">${esc(L.contactTitle)}</h2>
    <p>${esc(site.legalName)}<br><a href="mailto:${site.email}">${esc(site.email)}</a><br><a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a></p>
  </div>
</section>`;
  return { title: L.title, description: L.description, body, schema: [bc.schema] };
};
render.privacy = legal("privacy");
render.terms = legal("terms");

render.notFound = (t, lang) => {
  const N = t.pages.notFound;
  const body = `
${pageHero({ h1: N.h1, intro: N.text })}
<section class="section section-tight">
  <div class="container">
    <ul class="related">
      <li><a href="${u(lang, "/")}">${icon("home")}<span>${esc(t.nav.home)}</span></a></li>
      <li><a href="${u(lang, "/services/")}">${icon("layers")}<span>${esc(t.nav.services)}</span></a></li>
      <li><a href="${u(lang, "/ai-solutions/")}">${icon("chat")}<span>${esc(t.nav.ai)}</span></a></li>
      <li><a href="${u(lang, "/contact/")}">${icon("mail")}<span>${esc(t.nav.contact)}</span></a></li>
    </ul>
  </div>
</section>`;
  return { title: N.title, description: N.description, body, noindex: true };
};

// ---------------------------------------------------------------- write
function write(file, content) {
  const p = join(OUT, file);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync("public", OUT, { recursive: true });

let count = 0;
for (const [lang, t] of Object.entries(LANGS)) {
  for (const page of pages) {
    const r = (render[page.key])(t, lang, page);
    const html = layout(t, lang, { path: page.path, ...r });
    write(u(lang, page.path).replace(/^\//, "") + "index.html", html);
    count++;
  }
}
// 404 (English root; Spanish copy at /es/404.html for reference)
write("404.html", layout(en, "en", { path: "/", ...render.notFound(en, "en") }));
write("es/404.html", layout(es, "es", { path: "/", ...render.notFound(es, "es") }));

// sitemap with hreflang alternates
const sm = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.flatMap((p) => ["en", "es"].map((l) => `  <url>
    <loc>${abs(l, p.path)}</loc>
    <lastmod>${TODAY}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${abs("en", p.path)}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${abs("es", p.path)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs("en", p.path)}"/>
  </url>`)).join("\n")}
</urlset>
`;
write("sitemap.xml", sm);
write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.domain}/sitemap.xml\n`);

console.log(`Built ${count} pages (+2 not-found pages) into ${OUT}/ — asset version ${V}`);
