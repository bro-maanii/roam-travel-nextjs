"""Create the one-page, linked assessment handoff PDF."""

from pathlib import Path
import sys
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "submission" / "Roam-Assessment-Submission.pdf"
LIVE = sys.argv[1]
REPO = "https://github.com/bro-maanii/roam-travel-nextjs"
OUTPUT.parent.mkdir(exist_ok=True)

for name, filename in [("Arial", "arial.ttf"), ("ArialBold", "arialbd.ttf"), ("GeorgiaItalic", "georgiai.ttf")]:
    pdfmetrics.registerFont(TTFont(name, str(Path("C:/Windows/Fonts") / filename)))

INK = HexColor("#26362b")
MUTED = HexColor("#626d59")
CREAM = HexColor("#faf9f6")
LIME = HexColor("#d6ee8b")
RULE = HexColor("#dfe3d5")
PAGE_W, PAGE_H = 595.28, 841.89
pdf = canvas.Canvas(str(OUTPUT), pagesize=(PAGE_W, PAGE_H))
pdf.setTitle("Roam | Frontend Technical Assessment Submission")
pdf.setAuthor("Roam Travel")
pdf.setSubject("Travel agency website: live Vercel website, GitHub repository and project details")
pdf.setFillColor(CREAM)
pdf.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)


def text(x, y, value, size=10, color=INK, font="Arial"):
    pdf.setFont(font, size)
    pdf.setFillColor(color)
    pdf.drawString(x, y, value)


text(40, 790, "* roam.", 32, INK, "ArialBold")
text(344, 797, "FRONTEND TECHNICAL ASSESSMENT", 8, MUTED)
text(344, 782, "Next.js App Router / Tailwind CSS / GSAP", 8, MUTED)

# Crop the photograph into a wide editorial panel.
img = ImageReader(str(ROOT / "public/images/hero.jpg"))
iw, ih = img.getSize()
box_x, box_y, box_w, box_h = 40, 565, 515.28, 185
scale = max(box_w / iw, box_h / ih)
pdf.saveState()
clip = pdf.beginPath()
clip.roundRect(box_x, box_y, box_w, box_h, 9)
pdf.clipPath(clip, stroke=0, fill=0)
pdf.drawImage(img, box_x + (box_w - iw * scale) / 2, box_y + (box_h - ih * scale) / 2, iw * scale, ih * scale)
pdf.setFillColor(INK)
pdf.rect(box_x, box_y, box_w, 28, stroke=0, fill=1)
text(54, 575, "FOR THE PLACES YOU'LL NEVER FORGET", 8, LIME)
text(437, 575, "CINQUE TERRE, ITALY", 7, CREAM)
pdf.restoreState()

text(40, 532, "Go somewhere that stays with you.", 23, INK, "GeorgiaItalic")
text(40, 510, "A premium, fully responsive travel agency experience. Built for the journey.", 10, MUTED)


def link_card(y, label, url):
    pdf.setFillColor(HexColor("#eef1e5"))
    pdf.setStrokeColor(RULE)
    pdf.roundRect(40, y, 515.28, 55, 7, fill=1, stroke=1)
    text(55, y + 34, label, 8, MUTED, "ArialBold")
    text(55, y + 15, url, 10, INK)
    text(526, y + 22, ">", 16, INK)
    pdf.linkURL(url, (40, y, 555.28, y + 55), relative=0, thickness=0)


link_card(432, "LIVE WEBSITE / VERCEL", LIVE)
link_card(364, "SOURCE CODE / GITHUB", REPO)

text(40, 335, "THE ASSESSMENT, COVERED.", 9, INK, "ArialBold")
features = [
    (40, 309, "Four working mock search services"),
    (40, 285, "Destination cards, filters & trip details"),
    (40, 261, "Testimonials, contact form & footer"),
    (310, 309, "Mobile, tablet & desktop layouts"),
    (310, 285, "GSAP hero, scroll, counters & hover"),
    (310, 261, "SEO, legal pages & privacy controls"),
]
for x, y, label in features:
    pdf.setFillColor(LIME)
    pdf.circle(x + 4, y + 3, 4, fill=1, stroke=0)
    text(x + 15, y, label, 9, INK)

pdf.setFillColor(INK)
pdf.roundRect(40, 181, 515.28, 54, 7, fill=1, stroke=0)
text(55, 214, "VERIFIED BEFORE HANDOFF", 8, LIME, "ArialBold")
text(55, 195, "Production build + TypeScript | 7 unit tests | 13 browser tests", 10, CREAM)

text(40, 151, "RUN LOCALLY", 8, MUTED, "ArialBold")
text(40, 132, "npm ci  >  npm run dev", 11, INK, "ArialBold")
text(40, 113, "Node.js 22.13+  /  Email provider setup is documented in the README.", 9, MUTED)

pdf.setStrokeColor(RULE)
pdf.line(40, 91, 555.28, 91)
text(40, 72, "Sample travel prices, reviews and figures. No payments or reservations.", 8, MUTED)
text(40, 57, "Contact enquiries require configured Resend or SMTP credentials.", 8, MUTED)
text(479, 57, "02 NOV 2026", 8, MUTED)
pdf.save()

document = PdfReader(str(OUTPUT))
assert len(document.pages) == 1, "Submission must fit on one page"
assert LIVE in document.pages[0].extract_text()
assert REPO in document.pages[0].extract_text()
links = [annotation.get_object().get("/A", {}).get("/URI") for annotation in document.pages[0].get("/Annots", [])]
assert LIVE in links and REPO in links
assert OUTPUT.stat().st_size < 10 * 1024 * 1024
print(f"Created and validated: {OUTPUT} ({OUTPUT.stat().st_size:,} bytes)")
