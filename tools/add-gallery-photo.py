#!/usr/bin/env python3
"""사진첩에 사진 한 장을 추가합니다.

    python3 tools/add-gallery-photo.py ~/Desktop/photo.jpg \
        --slug table-mountain \
        --caption "테이블마운틴에서" \
        --tag "케이프타운"

- assets/gallery/thumb/<slug>.jpg (720×720, 그리드용)
- assets/gallery/full/<slug>.jpg  (긴 변 1500px, 크게 보기용)
- gallery.json 끝에 항목 한 줄 추가

Pillow 가 필요합니다: python3 -m pip install pillow
"""

import argparse
import json
import os
import re
import sys

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GALLERY_JSON = os.path.join(ROOT, "gallery.json")
THUMB_DIR = os.path.join(ROOT, "assets", "gallery", "thumb")
FULL_DIR = os.path.join(ROOT, "assets", "gallery", "full")

THUMB = 720
FULL = 1500


def square(im, size):
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return im.crop((left, top, left + side, top + side)).resize((size, size), Image.LANCZOS)


def long_edge(im, size):
    w, h = im.size
    if max(w, h) <= size:
        return im
    scale = size / max(w, h)
    return im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("image")
    parser.add_argument("--slug", help="파일 이름 (영문·숫자·하이픈)")
    parser.add_argument("--caption", default="", help="사진 아래에 보일 설명")
    parser.add_argument("--tag", default="연구실", help="사진첩 필터에 쓸 묶음 이름")
    parser.add_argument("--alt", default="", help="화면 낭독기용 설명 (없으면 caption 사용)")
    args = parser.parse_args()

    if not os.path.exists(args.image):
        sys.exit(f"파일을 찾을 수 없습니다: {args.image}")

    slug = args.slug or re.sub(r"[^a-z0-9]+", "-", os.path.splitext(os.path.basename(args.image))[0].lower()).strip("-")
    if not slug:
        sys.exit("--slug 를 지정해 주세요.")

    os.makedirs(THUMB_DIR, exist_ok=True)
    os.makedirs(FULL_DIR, exist_ok=True)

    im = ImageOps.exif_transpose(Image.open(args.image)).convert("RGB")
    thumb_path = os.path.join(THUMB_DIR, f"{slug}.jpg")
    full_path = os.path.join(FULL_DIR, f"{slug}.jpg")
    square(im, THUMB).save(thumb_path, "JPEG", quality=80, optimize=True, progressive=True)
    long_edge(im, FULL).save(full_path, "JPEG", quality=82, optimize=True, progressive=True)

    with open(GALLERY_JSON, encoding="utf-8") as fh:
        data = json.load(fh)
    photos = data["photos"] if isinstance(data, dict) else data
    if any(p.get("thumb", "").endswith(f"/{slug}.jpg") for p in photos):
        sys.exit(f"같은 이름의 사진이 이미 있습니다: {slug}")

    entry = {
        "src": f"assets/gallery/full/{slug}.jpg",
        "thumb": f"assets/gallery/thumb/{slug}.jpg",
        "alt": args.alt or args.caption or slug,
        "caption": args.caption,
        "tag": args.tag,
    }
    photos.append(entry)
    with open(GALLERY_JSON, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")

    print(f"추가했습니다: {entry['thumb']}")
    print(f"사진 {len(photos)}장")


if __name__ == "__main__":
    main()
