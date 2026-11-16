# -*- coding: utf-8 -*-
"""FEI · HEL — build assets/hero-banner.jpg

    python3 tools/make_hero_banner.py

The lab's own banner artwork (assets/hero-silhouette.jpg) is the picture, unchanged:
lighthouse, hiker, birds, butterflies, photographer, cyclist, child, bear, ducks and
the watercolour-green texture stay pixel for pixel. On top of it this script stands
two more animals in the same flat paper white along the water line, so the scene
gains a reindeer and a fox without the drawing being redrawn.

The animal shapes are solid white silhouettes in tools/hero-animals/ (reindeer.png,
fox.png; white on black). Their alpha comes from luminance, they are recoloured to the
banner's paper white (#FAF9F5) and pasted with their feet on the water line.

Placement is in pixels of the 3200 × 1185 banner — change a row of PLACEMENTS to move
an animal, then run the script again.
"""
import os

import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

SOURCE = os.path.join(ROOT, "assets", "hero-silhouette.jpg")
OUTPUT = os.path.join(ROOT, "assets", "hero-banner.jpg")
PAPER = (250, 249, 245)   # the banner's white

# name, left x, baseline y (feet sit here), height in px
PLACEMENTS = [
    ("reindeer", 1100, 1082, 236),
    ("fox", 1448, 1082, 96),
]


def mask(name, height):
    """White-on-black silhouette -> alpha mask recoloured at PAPER, sized by height."""
    path = os.path.join(HERE, "hero-animals", name + ".png")
    lum = np.asarray(Image.open(path).convert("RGB")).astype(np.float32).mean(axis=2)
    alpha = Image.fromarray(np.clip((lum - 96) / 120.0 * 255.0, 0, 255).astype(np.uint8), "L")
    box = alpha.point(lambda v: 255 if v > 40 else 0).getbbox()
    alpha = alpha.crop(box)
    width = int(round(alpha.size[0] * height / alpha.size[1]))
    alpha = alpha.resize((width, height), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.5))
    return alpha


def main():
    scene = Image.open(SOURCE).convert("RGB").copy()

    for name, left, baseline, height in PLACEMENTS:
        alpha = mask(name, height)
        width = alpha.size[0]
        top = baseline - height
        scene.paste(Image.new("RGB", (width, height), PAPER), (left, top), alpha)
        print("%-8s %dx%d at x=%d, feet y=%d" % (name, width, height, left, baseline))

    scene.save(OUTPUT, quality=90, subsampling=0, optimize=True, progressive=True)
    print("wrote assets/hero-banner.jpg (%dx%d)" % scene.size)


if __name__ == "__main__":
    main()
