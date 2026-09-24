"""Automatic overlap check on the rendered PDF: text-vs-text, text-vs-image, off-slide."""
import sys
import pymupdf

d = pymupdf.open(sys.argv[1])
issues = 0
for pno, page in enumerate(d, 1):
    W, H = page.rect.width, page.rect.height
    lines = []
    for b in page.get_text('dict')['blocks']:
        if b.get('type') != 0:
            continue
        for l in b['lines']:
            txt = ''.join(s['text'] for s in l['spans']).strip()
            if txt:
                lines.append((pymupdf.Rect(l['bbox']), txt))
    imgs = [pymupdf.Rect(i['bbox']) for i in page.get_image_info()]
    for i, (r, t) in enumerate(lines):
        if r.x0 < 18 or r.y0 < 10 or r.x1 > W - 18 or r.y1 > H - 8:
            print(f'slide {pno}: near/over edge: "{t[:50]}"'); issues += 1
        for r2, t2 in lines[i + 1:]:
            inter = r & r2
            if not inter.is_empty and inter.width > 2 and inter.height > 2:
                print(f'slide {pno}: TEXT OVERLAP "{t[:40]}" ↔ "{t2[:40]}"'); issues += 1
        for ir in imgs:
            inter = r & ir
            if not inter.is_empty and inter.width > 2 and inter.height > 2 and ir.width < W * 0.9:
                print(f'slide {pno}: text over image: "{t[:50]}"'); issues += 1
print(f'{issues} issue(s) in {len(d)} slides')
