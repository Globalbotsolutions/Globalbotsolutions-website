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
2. **Email delivery for the quote form** (Settings → Variables and Secrets), using **Resend**:
   - Create a free Resend account **with the address that should receive leads** (info@globalbotsolutions.com).
   - Create an API key and add it as the encrypted secret `RESEND_API_KEY` (Production and Preview).
   - Add the variable `LEAD_FROM` = `Global Bot Solutions Website <onboarding@resend.dev>` and
     `LEAD_TO` = the same address you signed up with. With the `resend.dev` sender, Resend only delivers to
     the account's own address, which is exactly what lead notifications need, and **no DNS changes** are required.
   - Later, to send from `@globalbotsolutions.com`, verify the domain in Resend (adds records on a subdomain;
     Google Workspace mail records stay untouched) and change `LEAD_FROM`.
   - **Do not enable Cloudflare Email Routing** on this domain: it requires replacing the Google Workspace MX
     records and would stop your company email. (The code still supports a `LEAD_EMAIL` send_email binding for
     other setups; don't use it here.)
   Until delivery is configured, the form tells visitors it couldn't send and shows your email and phone.
   It never shows a false "sent".
3. **AI chat assistant:** Settings → Bindings → Add → **Workers AI**, variable name `AI`
   (Production and Preview). No API key; usage counts against the account's free daily Workers AI allocation
   (requests fail politely when it's used up; the widget then shows the contact options). Turn the widget off
   with `chatEnabled: false` in `src/site.config.mjs`.
4. **Spam protection (recommended):** create a free Turnstile widget for the domain, put the
   *site key* in `src/site.config.mjs → turnstileSiteKey`, and add the *secret key* as the encrypted
   secret `TURNSTILE_SECRET_KEY`. Optional KV bindings: `RATE_LIMIT` (durable rate limiting) and
   `LEADS` (private 90-day backup copy of each lead).
5. **Preview first:** push the `feature/gbs-premium-redesign` branch. Cloudflare Pages builds a preview at
   `https://feature-gbs-premium-redesign.globalbotsolutions-website.pages.dev` (branch previews are enabled). Check
   the pages and send a test quote request.
6. **Go live:** merge the branch into `main`. Cloudflare deploys it to globalbotsolutions.com.
   DNS does not change.

## Rollback

- **Fastest:** Cloudflare dashboard → the project → Deployments → pick the last deployment of the
  old site → **Rollback to this deployment**. This is instant and doesn't touch Git.
- **In Git:** revert the merge commit on `main`. The old site's files (`index.html`, `styles.css`,
  `script.js`) return to the root. Then set the build command back to empty and the output
  directory back to `.` so the old files are served again.
- The pre-redesign production deployment is `408f324e` (commit `7bbd4d9`, tag `backup/live-2026-10-21`).

## Owner decisions before launch

- Review and approve the Privacy Policy and Terms (marked as drafts on the pages; items in
  brackets need your input or an attorney's).
- Create the Resend account and add the secret/variables (step 2) and the Workers AI binding (step 3).
- Turnstile: yes/no (recommended).
- Analytics: optional, cookie-free Cloudflare Web Analytics (`cfAnalyticsToken` in site config).
- Portfolio: replace or add to the concept designs with real client work you have permission to show.
- About page: currently describes the company without naming people. Add your name or photo if you'd like.
- Service area wording says New Jersey plus remote U.S. Confirm that's accurate.
- HSTS is set without `preload`/`includeSubDomains`. Extend only if every subdomain is HTTPS.
