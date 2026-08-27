from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path

from PIL import Image, ImageOps

source_root = Path(sys.argv[1]).resolve()
output = Path(sys.argv[2]).resolve()
manifest_path = Path(sys.argv[3]).resolve()
supported = {'.jpg', '.jpeg', '.png', '.tif', '.tiff', '.bmp'}


def clean(value: str) -> str:
    return re.sub(r'\s+', ' ', value.replace('_', ' ').strip())


def slug(value: str) -> str:
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-zA-Z0-9]+', '-', value).strip('-').lower()[:70] or 'imagen'


manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
existing = {(item['title'], item['detail']) for item in manifest}
next_id = max(item['id'] for item in manifest) + 1
added = 0

for source in sorted(source_root.rglob('*'), key=lambda path: str(path).lower()):
    if not source.is_file() or source.suffix.lower() not in supported:
        continue
    project = clean(source.parent.name)
    detail = clean(source.stem)
    if (project, detail) in existing:
        continue
    filename = f'{next_id:04d}-{slug(project)}-{slug(source.stem)}.png'
    image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    original_size = image.size
    image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
    image = image.quantize(colors=192, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
    image.save(output / filename, 'PNG', optimize=True)
    manifest.append({'id': next_id, 'src': f'/gallery/{filename}', 'title': project, 'detail': detail, 'category': 'archive', 'originalWidth': original_size[0], 'originalHeight': original_size[1]})
    existing.add((project, detail))
    next_id += 1
    added += 1

manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'DONE {added} images added; {len(manifest)} total')
