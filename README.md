# Global Bot Solutions — website

Bilingual (English/Spanish) marketing site for Global Bot Solutions LLC, built as plain
HTML/CSS/JS by a small zero-dependency Node script, plus one Cloudflare Pages Function
for quote requests. No framework, no npm dependencies, no paid services required.

## Structure

```
build.mjs                 Static site generator → writes dist/
src/site.config.mjs       Business facts: email, phone, Turnstile site key, analytics token
src/content/en.mjs        ALL English copy (every page, form, demo script)
src/content/es.mjs        ALL Spanish copy — same keys as en.mjs
src/data/portfolio.mjs    Portfolio entries (concept designs today; add client projects here)
src/icons.mjs             Inline SVG icon set
public/                   Copied as-is: css/, js/, fonts/, img/, _headers, _redirects
functions/api/contact.js  POST /api/contact — validates, rate-limits, emails the lead
scripts/dev-server.mjs    Local preview incl. the form function and production headers
scripts/make-images.py    Regenerates social preview images and icons from the logo
tests/                    node --test suites (form backend + built-site checks)
```

URLs: English at `/services/…`, Spanish at `/es/services/…`. Every page exists in both
languages with `hreflang`, canonical tags and a language switch that keeps you on the same page.

## Common edits

- **Change wording:** edit `src/content/en.mjs` and the same key in `src/content/es.mjs`.
- **Phone/email:** `src/site.config.mjs`.
- **Add a real portfolio project:** add an entry to `src/data/portfolio.mjs` with
  `type: "client"`, a screenshot in `public/img/portfolio/`, and `url` only if the client agreed.
- Then run `npm test` — it rebuilds and fails if anything breaks (including any `$` price sneaking in).

## Local preview

```
npm run build
DEV_FAKE_EMAIL=1 node scripts/dev-server.mjs     # http://localhost:8788, form leads print in the terminal
```

Requires Node 18+. `DEV_FAKE_EMAIL=fail` simulates the email provider failing.

## Tests

`npm test` builds the site and runs 30 checks: no public prices anywhere (HTML, JS, JSON-LD,
sitemap), every page exists in both languages, no untranslated strings, links and anchors resolve,
unique titles/descriptions, one H1 per page, CSP-safe markup, verified contact details only, and the
form backend's validation, spam traps, rate limiting, Turnstile and "success only after delivery".

## Deploying on Cloudflare Pages

Project: `globalbotsolutions-website` (account e338b68f…), connected to this repo, production branch `main`,
custom domain `globalbotsolutions.com`. Configuration lives in the Cloudflare dashboard; `wrangler.example.toml`
is reference only.

> **Important — do this before merging to `main`.** The current live site is served straight from the
> repository root with no build step. This version is built into `dist/`. If `main` is updated without
> changing the build settings, the live site will break.

1. **Cloudflare dashboard → Workers & Pages → (this project) → Settings → Build:**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (unchanged)
2. **Email delivery for the quote form** (Settings → Variables and Secrets / Bindings). Pick one:
   - **Resend** (free tier available): secret `RESEND_API_KEY`, variable `LEAD_FROM`
     (e.g. `Global Bot Solutions Website <quotes@globalbotsolutions.com>`; the domain must be verified in Resend).
   - **Cloudflare Email Routing** (free): enable Email Routing on the domain, verify
     `info@globalbotsolutions.com` as a destination, add a **send_email** binding named `LEAD_EMAIL`,
     and variable `LEAD_FROM` with an address on your domain.
   - Optional: `LEAD_TO` (defaults to info@globalbotsolutions.com).
   Until one is configured, the form tells visitors it couldn't send and shows your email and phone.
   It never shows a false "sent".
3. **Spam protection (recommended):** create a free Turnstile widget for the domain, put the
   *site key* in `src/site.config.mjs → turnstileSiteKey`, and add the *secret key* as the encrypted
   secret `TURNSTILE_SECRET_KEY`. Optional KV bindings: `RATE_LIMIT` (durable rate limiting) and
   `LEADS` (private 90-day backup copy of each lead).
4. **Preview first:** push the `feature/gbs-premium-redesign` branch. Cloudflare Pages builds a preview at
   `https://feature-gbs-premium-redesign.<project>.pages.dev` (branch previews must be enabled). Check
   the pages and send a test quote request.
5. **Go live:** merge the branch into `main`. Cloudflare deploys it to globalbotsolutions.com.
   DNS does not change.

## Rollback

- **Fastest:** Cloudflare dashboard → the project → Deployments → pick the last deployment of the
  old site → **Rollback to this deployment**. This is instant and doesn't touch Git.
- **In Git:** revert the merge commit on `main`. The old site's files (`index.html`, `styles.css`,
  `script.js`) return to the root. Then set the build command back to empty and the output
  directory back to `/` so the old files are served again.

## Owner decisions before launch

- Review and approve the Privacy Policy and Terms (marked as drafts on the pages; items in
  brackets need your input or an attorney's).
- Choose the email delivery option and add the secrets (step 2 above).
- Turnstile: yes/no (recommended).
- Analytics: optional, cookie-free Cloudflare Web Analytics (`cfAnalyticsToken` in site config).
- Portfolio: replace or add to the concept designs with real client work you have permission to show.
- About page: currently describes the company without naming people. Add your name or photo if you'd like.
- Service area wording says New Jersey plus remote U.S. Confirm that's accurate.
- HSTS is set without `preload`/`includeSubDomains`. Extend only if every subdomain is HTTPS.
