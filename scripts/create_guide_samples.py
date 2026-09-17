"""Create deterministic, non-sensitive practice files for the public guide."""
from pathlib import Path

from PIL import Image, ImageDraw
from reportlab.pdfgen import canvas

DEST = Path(__file__).resolve().parents[1] / "static" / "guide-examples"
DEST.mkdir(parents=True, exist_ok=True)

pdf = canvas.Canvas(str(DEST / "practice-packet.pdf"), pagesize=(612, 792), invariant=1)
pdf.setTitle("Browser Tools - Four-page practice packet")
for number, title in enumerate(("Cover", "Checklist", "Notes", "Appendix"), 1):
    pdf.setFillColorRGB(.09, .12, .14)
    pdf.rect(0, 610, 612, 182, fill=1, stroke=0)
    pdf.setFillColorRGB(1, 1, 1)
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(48, 738, "BROWSER TOOLS / PRACTICE FILE")
    pdf.setFont("Helvetica-Bold", 34)
    pdf.drawString(48, 662, f"{number:02d} / {title}")
    pdf.setFillColorRGB(.09, .12, .14)
    pdf.setFont("Helvetica", 14)
    for line, text in enumerate((
        "This is a synthetic sample, not a personal document.",
        "Use it to practice splitting, merging, and image export.",
        f"Expected original position: page {number} of 4.",
        "Page size: US Letter, 612 x 792 PDF points.",
        "Keep this original and compare it with your output.",
    )):
        pdf.drawString(48, 548 - line * 30, text)
    pdf.setFont("Helvetica", 11)
    pdf.drawString(48, 48, f"Browser Tools sample | {title} | {number} / 4")
    pdf.showPage()
pdf.save()

image = Image.new("RGB", (1600, 1000), "#dce8e4")
draw = ImageDraw.Draw(image)
draw.rectangle((100, 100, 1500, 900), outline="#253d39", width=12)
draw.ellipse((250, 250, 750, 750), fill="#e2b74f")
draw.rectangle((900, 250, 1350, 750), fill="#416a62")
image.save(DEST / "resize-practice.png")
# Exact bytes matter: no trailing newline or byte-order mark.
(DEST / "abc.txt").write_bytes(b"abc")
print(f"Created three practice assets in {DEST}")
