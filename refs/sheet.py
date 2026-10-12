#!/usr/bin/env python3
"""
Contact sheets from a /watch report (github.com/bradautomates/claude-video):
every frame the report lists, in order, tiled with its timestamp, so a whole
reel reads in one or two images instead of forty to a hundred.

    python3 refs/sheet.py <watch report .md or the stdout saved to a file> <out dir> [--cols 6] [--per 24]

Writes <out dir>/sheet-1.jpg, sheet-2.jpg… and frames.json (path, t, reason).
Needs Pillow.
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw


def frames_from_report(text):
    out = []
    for m in re.finditer(r"`([^`]+frame_\d+\.jpg)` \(t=([\d:.]+), reason=([\w-]+)\)", text):
        out.append({'path': m.group(1), 't': m.group(2), 'reason': m.group(3)})
    return out


def main():
    a = sys.argv[1:]
    if len(a) < 2:
        print(__doc__)
        sys.exit(1)
    report, out = Path(a[0]), Path(a[1])
    cols = int(a[a.index('--cols') + 1]) if '--cols' in a else 6
    per = int(a[a.index('--per') + 1]) if '--per' in a else 24
    frames = [f for f in frames_from_report(report.read_text(encoding='utf-8', errors='ignore')) if Path(f['path']).exists()]
    if not frames:
        print('no frames found in the report')
        sys.exit(2)
    out.mkdir(parents=True, exist_ok=True)
    (out / 'frames.json').write_text(json.dumps(frames, indent=1))
    w = 300
    for s in range(0, len(frames), per):
        chunk = frames[s:s + per]
        ims = []
        for f in chunk:
            im = Image.open(f['path']).convert('RGB')
            im = im.resize((w, int(im.height * w / im.width)))
            ims.append(im)
        hmax = max(i.height for i in ims)
        rows = (len(ims) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * (w + 6), rows * (hmax + 30)), 'white')
        d = ImageDraw.Draw(sheet)
        for i, (im, f) in enumerate(zip(ims, chunk)):
            x, y = (i % cols) * (w + 6), (i // cols) * (hmax + 30)
            sheet.paste(im, (x, y + 26))
            d.rectangle([x, y, x + w, y + 24], fill='black')
            d.text((x + 6, y + 6), f"#{s + i + 1}  t={f['t']}  {f['reason']}", fill='yellow')
        sheet.save(out / f'sheet-{s // per + 1}.jpg', quality=82)
    print(f'{len(frames)} frames → {out}/sheet-*.jpg')


if __name__ == '__main__':
    main()
