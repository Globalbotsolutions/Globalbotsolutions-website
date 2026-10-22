// Local preview: serves ./dist with the production _headers/_redirects rules
// and runs the real /api/contact Pages Function.
//
//   node build.mjs && node scripts/dev-server.mjs            → http://localhost:8788
//   DEV_FAKE_EMAIL=1 node scripts/dev-server.mjs             → prints leads to the console instead of emailing
//   RESEND_API_KEY=... LEAD_FROM="..." node scripts/dev-server.mjs   → sends real email via Resend
import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";
import { onRequestPost, onRequest } from "../functions/api/contact.js";
import * as chat from "../functions/api/chat.js";

const ROOT = "dist";
const PORT = Number(process.env.PORT || 8788);
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff": "font/woff", ".xml": "application/xml", ".txt": "text/plain" };

// _headers: apply "/*" block plus matching prefix blocks
const headerBlocks = [];
let cur = null;
for (const line of readFileSync(join(ROOT, "_headers"), "utf8").split("\n")) {
  if (!line.trim()) continue;
  if (!line.startsWith(" ")) { cur = { pattern: line.trim(), headers: {} }; headerBlocks.push(cur); continue; }
  const i = line.indexOf(":");
  cur.headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
}
const redirects = readFileSync(join(ROOT, "_redirects"), "utf8").split("\n").filter((l) => l.trim() && !l.startsWith("#")).map((l) => l.trim().split(/\s+/));

function headersFor(path) {
  const out = {};
  for (const b of headerBlocks) {
    const p = b.pattern.replace(/\*$/, "");
    if (path.startsWith(p)) Object.assign(out, b.headers);
  }
  delete out["Strict-Transport-Security"];
  out["Content-Security-Policy"] = (out["Content-Security-Policy"] || "").replace(/;\s*upgrade-insecure-requests/, "");
  return out;
}

const env = { ...process.env };
// DEV_FAKE_AI=1 → canned chat replies (the real assistant needs Cloudflare Workers AI)
if (process.env.DEV_FAKE_AI) {
  env.AI = { run: async (_m, input) => {
    const q = input.messages.at(-1).content;
    const es = /[¿¡ñáéíóú]|qué|hacen|ofrecen|cuánto/i.test(q);
    if (/price|cost|how much|cu[aá]nto|precio/i.test(q)) return { response: es ? "Eso cuesta $500." : "That costs $500." }; // exercises the price guard
    return { response: es ? "Hacemos páginas web, recepcionistas con IA, chatbots y reservas en línea, en inglés y español. ¿Quieres una cotización? https://globalbotsolutions.com/es/contact/" : "We build websites, AI receptionists, chatbots and online booking, in English and Spanish. Want a quote? https://globalbotsolutions.com/contact/" };
  } };
}
if (process.env.DEV_FAKE_EMAIL) {
  env.RESEND_API_KEY = "dev";
  env.LEAD_FROM = "Dev <dev@localhost>";
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    if (String(url).startsWith("https://api.resend.com")) {
      const b = JSON.parse(init.body);
      console.log("\n--- FAKE EMAIL (not sent) ---\nTo:", b.to.join(", "), "\nSubject:", b.subject, "\n" + b.text + "-----------------------------\n");
      if (process.env.DEV_FAKE_EMAIL === "fail") return new Response("fail", { status: 500 });
      return new Response('{"id":"dev"}', { status: 200 });
    }
    return realFetch(url, init);
  };
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = decodeURIComponent(url.pathname);

  if (path === "/api/chat") {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const request = new Request(url, { method: req.method, headers: { ...req.headers, "CF-Connecting-IP": req.socket.remoteAddress }, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) });
    const r = req.method === "POST" ? await chat.onRequestPost({ request, env }) : await chat.onRequest({ request, env });
    res.writeHead(r.status, Object.fromEntries(r.headers));
    res.end(Buffer.from(await r.arrayBuffer()));
    return;
  }

  if (path === "/api/contact") {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const request = new Request(url, { method: req.method, headers: { ...req.headers, "CF-Connecting-IP": req.socket.remoteAddress }, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) });
    const r = req.method === "POST" ? await onRequestPost({ request, env }) : await onRequest({ request, env });
    res.writeHead(r.status, Object.fromEntries(r.headers));
    res.end(Buffer.from(await r.arrayBuffer()));
    return;
  }

  const rd = redirects.find(([from]) => from === path);
  if (rd) { res.writeHead(Number(rd[2] || 301), { Location: rd[1] }); res.end(); return; }

  let file = normalize(join(ROOT, path));
  if (!file.startsWith(ROOT)) { res.writeHead(400); res.end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!path.endsWith("/")) { res.writeHead(308, { Location: path + "/" + url.search }); res.end(); return; }
    file = join(file, "index.html");
  }
  let status = 200;
  if (!existsSync(file)) { status = 404; file = join(ROOT, path.startsWith("/es/") ? "es/404.html" : "404.html"); }
  res.writeHead(status, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", ...headersFor(path) });
  res.end(readFileSync(file));
}).listen(PORT, "127.0.0.1", () => console.log(`Preview: http://localhost:${PORT}  (form delivery: ${process.env.DEV_FAKE_EMAIL ? "fake, printed here" : env.RESEND_API_KEY ? "Resend" : "not configured → form will show an error"})`));
