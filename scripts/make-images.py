"""Render brand images (OG cards, favicons) from the logo with headless Chromium.
Usage: python3 scripts/make-images.py   (writes into public/img/)"""
import pathlib, base64
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parent.parent
img = root / "public" / "img"
logo = (img / "logo.svg").read_text()
logo_uri = "data:image/svg+xml;base64," + base64.b64encode(logo.encode()).decode()
fonts = root / "public" / "fonts"
def font(name): return "data:font/woff;base64," + base64.b64encode((fonts / name).read_bytes()).decode()

OG = {
  "en": ("Your Business. Smarter, Faster, Automated.", "Websites · AI receptionists · Chatbots · Online booking", "English & Spanish"),
  "es": ("Tu Negocio. Más Inteligente, Más Rápido y Automatizado.", "Páginas web · Recepcionistas con IA · Chatbots · Reservas", "Inglés y español"),
}

def og_html(h, sub, tag):
    return f"""<html><head><style>
@font-face{{font-family:D;src:url({font('InterDisplay-ExtraBold.woff')});font-weight:800}}
@font-face{{font-family:B;src:url({font('Inter-SemiBold.woff')});font-weight:600}}
body{{margin:0;width:1200px;height:630px;background:#080F1F;color:#fff;font-family:B;overflow:hidden;position:relative}}
.g{{position:absolute;inset:0;background-image:radial-gradient(700px 400px at 90% 0,rgba(37,99,235,.45),transparent 70%),linear-gradient(rgba(174,187,208,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(174,187,208,.06) 1px,transparent 1px);background-size:auto,48px 48px,48px 48px}}
.w{{position:absolute;inset:72px 80px;display:flex;flex-direction:column}}
.b{{display:flex;align-items:center;gap:18px;font-family:D;font-size:34px;letter-spacing:-.02em}}
.b img{{width:72px;height:72px;border-radius:16px}} .b span{{color:#22D3EE}}
h1{{font-family:D;font-weight:800;font-size:72px;line-height:1.02;letter-spacing:-.035em;margin:auto 0 24px;max-width:960px}}
p{{margin:0;font-size:28px;color:#AEBBD0}} .t{{margin-top:18px;display:inline-block;color:#22D3EE;font-size:24px}}
</style></head><body><div class=g></div><div class=w><div class=b><img src="{logo_uri}">Global Bot <span>Solutions</span></div>
<h1>{h}</h1><p>{sub}</p><div class=t>{tag}</div></div></body></html>"""

with sync_playwright() as pw:
    br = pw.chromium.launch()
    pg = br.new_page(viewport={"width": 1200, "height": 630})
    for lang, (h, s, t) in OG.items():
        pg.set_content(og_html(h, s, t)); pg.wait_for_timeout(200)
        pg.screenshot(path=str(img / f"og-{lang}.png"))
    for size, name in [(512, "logo-512.png"), (180, "apple-touch-icon.png"), (32, "favicon-32.png")]:
        p = br.new_page(viewport={"width": size, "height": size})
        p.set_content(f'<html><body style="margin:0;background:#060f23"><img src="{logo_uri}" style="width:{size}px;height:{size}px;display:block"></body></html>')
        p.wait_for_timeout(100)
        p.screenshot(path=str(img / name)); p.close()
    br.close()
print("images written to", img)
