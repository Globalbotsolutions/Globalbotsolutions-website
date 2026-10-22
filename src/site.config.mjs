// Central business settings. Only verified, public information belongs here.
// Secrets (Turnstile secret key, email API keys) NEVER go in this file —
// set them as Cloudflare Pages environment variables instead.

export const site = {
  name: "Global Bot Solutions",
  legalName: "Global Bot Solutions LLC",
  domain: "https://globalbotsolutions.com",

  // Taken from the existing live site (email corrected: the old page was missing the "@").
  email: "info@globalbotsolutions.com",
  // International format so callers outside the U.S. know to dial +1.
  phoneDisplay: "+1 (307) 217-8616",
  phoneHref: "+13072178616",

  // Positioning: businesses worldwide, delivered fully online. Do NOT publish the owner's
  // location, a street address, city or state, or claim offices anywhere (privacy decision).

  // Dates shown in the sitemap (lastmod) and on the legal pages. Update them by hand
  // only when that content actually changes.
  contentUpdated: "2026-10-22",
  legalUpdated: "2026-10-22",

  // Cloudflare Turnstile PUBLIC site key. Leave empty to hide the widget.
  // When you add it here, also set TURNSTILE_SECRET_KEY in Cloudflare Pages.
  turnstileSiteKey: "",

  // Website AI chat assistant (needs a Workers AI binding named "AI" on the Pages project).
  chatEnabled: true,

  // Optional Cloudflare Web Analytics token (cookie-free). Empty = no analytics.
  cfAnalyticsToken: "",

  // Social profiles: add only real, verified URLs.
  social: [],

  year: new Date().getFullYear(),
};
