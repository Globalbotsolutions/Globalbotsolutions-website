// Central business settings. Only verified, public information belongs here.
// Secrets (Turnstile secret key, email API keys) NEVER go in this file —
// set them as Cloudflare Pages environment variables instead.

export const site = {
  name: "Global Bot Solutions",
  legalName: "Global Bot Solutions LLC",
  domain: "https://globalbotsolutions.com",

  // Taken from the existing live site (email corrected: the old page was missing the "@").
  email: "info@globalbotsolutions.com",
  phoneDisplay: "(307) 217-8616",
  phoneHref: "+13072178616",

  // Region served. Used in copy and in Organization schema as areaServed only
  // (no street address is published).
  region: { en: "New Jersey", es: "Nueva Jersey" },

  // Cloudflare Turnstile PUBLIC site key. Leave empty to hide the widget.
  // When you add it here, also set TURNSTILE_SECRET_KEY in Cloudflare Pages.
  turnstileSiteKey: "",

  // Optional Cloudflare Web Analytics token (cookie-free). Empty = no analytics.
  cfAnalyticsToken: "",

  // Social profiles: add only real, verified URLs.
  social: [],

  year: new Date().getFullYear(),
};
