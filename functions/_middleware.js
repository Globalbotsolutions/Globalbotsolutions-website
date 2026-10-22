// Permanently redirect the Cloudflare default production address to the real domain,
// so search engines see one copy of the site.
//
// Only the exact production host is redirected. Preview and branch deployments
// (e.g. feature-x.globalbotsolutions-website.pages.dev, 1a2b3c4d.globalbotsolutions-website.pages.dev)
// are subdomains of it and keep working unchanged.
export const PAGES_DEV_HOST = "globalbotsolutions-website.pages.dev";
export const CANONICAL_ORIGIN = "https://globalbotsolutions.com";

// Google Search Console ownership file (URL-prefix property https://globalbotsolutions.com/).
// Served here instead of as a static file because Pages would redirect "*.html" to an
// extensionless URL, which can make verification fail. Keep this for as long as the
// property should stay verified.
export const GSC_FILE = "google9e51c4fde646c8a8.html";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.pathname === "/" + GSC_FILE) {
    return new Response("google-site-verification: " + GSC_FILE, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    });
  }
  if (url.hostname === PAGES_DEV_HOST) {
    return new Response(null, {
      status: 301,
      headers: { Location: CANONICAL_ORIGIN + url.pathname + url.search, "Cache-Control": "public, max-age=3600" },
    });
  }
  return context.next();
}
