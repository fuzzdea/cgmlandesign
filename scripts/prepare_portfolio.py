from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path

from PIL import Image, ImageOps


SOURCE = Path(sys.argv[1]).resolve()
OUTPUT = Path(sys.argv[2]).resolve()
MANIFEST = Path(sys.argv[3]).resolve()
SUPPORTED = {'.jpg', '.jpeg', '.png', '.tif', '.tiff', '.bmp'}


def clean(value: str) -> str:
    value = value.replace('_', ' ').strip()
    return re.sub(r'\s+', ' ', value)


def slug(value: str) -> str:
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode()
    value = re.sub(r'[^a-zA-Z0-9]+', '-', value).strip('-').lower()
    return value[:70] or 'imagen'


files = sorted(
    (path for path in SOURCE.rglob('*') if path.is_file() and path.suffix.lower() in SUPPORTED),
    key=lambda path: str(path).lower(),
)
OUTPUT.mkdir(parents=True, exist_ok=True)
items = []

for index, source in enumerate(files, 1):
    relative = source.relative_to(SOURCE)
    parts = relative.parts
    section = parts[0] if len(parts) > 1 else ''
    if section == 'MASTER PLANS':
        category = 'masterplan'
        project = clean(parts[1]) if len(parts) > 2 else 'Master Plans'
    elif section.startswith('PAISAJISMOS'):
        category = 'landscape'
        project = clean(parts[1]) if len(parts) > 2 else 'Paisajismo'
    else:
        category = 'archive'
        project = 'CGM Landesign'

    filename = f'{index:04d}-{slug(project)}-{slug(source.stem)}.png'
    destination = OUTPUT / filename
    try:
        image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
        original_size = image.size
        image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
        image = image.quantize(
            colors=192,
            method=Image.Quantize.MEDIANCUT,
            dither=Image.Dither.FLOYDSTEINBERG,
        )
        image.save(destination, 'PNG', optimize=True)
    except Exception as error:
        print(f'SKIP {source}: {error}', flush=True)
        continue

    items.append({
        'id': index,
        'src': f'/gallery/{filename}',
        'title': project,
        'detail': clean(source.stem),
        'category': category,
        'originalWidth': original_size[0],
        'originalHeight': original_size[1],
    })
    if index % 100 == 0:
        print(f'{index}/{len(files)}', flush=True)

MANIFEST.write_text(json.dumps(items, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'DONE {len(items)} images', flush=True)
