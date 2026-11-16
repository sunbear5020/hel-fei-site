# -*- coding: utf-8 -*-
"""FEI · HEL — hero artwork (living SVG scene).

    python3 tools/build_hero_art.py

Writes assets/hero-art.svg and injects the same markup into index.html between
<!-- hero-art:start --> and <!-- hero-art:end -->.

The scene keeps the motifs of the old still image — contour lines, a lighthouse
with a sweeping beam, a hiker with a backpack, a photographer, a cyclist, a
child planting a seedling, ducks, flying birds, water and a small bear
(@sunbear) — drawn in the lab palette: deep charcoal, cream, sand and terracotta.
Motion lives in the <style> block inside the SVG (scoped by .hero-art); the
pointer and scroll parallax is driven from app.js on the .art-layer groups.
"""
import math
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

CREAM = "#FAF9F5"
CREAM_DEEP = "#F2F0E7"
SAND = "#F0EEE6"
SAND_DEEP = "#E7E3D6"
INK = "#141413"
CLAY = "#D97757"
CLAY_DEEP = "#C96442"

SKY_TOP = "#171715"
RIDGE_1 = "#2C2A24"
RIDGE_2 = "#26241F"
RIDGE_3 = "#1F1E1A"
TREE_FAR = "#34322A"
TREE_MID = "#2A2823"
WATER_TOP = "#232220"
WATER_BOTTOM = "#141312"

W, H = 1600, 600
HORIZON = 494

rng = random.Random(20261116)


# ---------------------------------------------------------------- path helper

def smooth(points):
    """Catmull-Rom through points → cubic Bézier path."""
    pts = [(float(x), float(y)) for x, y in points]
    if len(pts) < 2:
        return ""
    d = "M %.1f %.1f" % pts[0]
    last = len(pts) - 1
    for i in range(last):
        p0 = pts[i - 1] if i > 0 else pts[0]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 <= last else pts[last]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6.0, p1[1] + (p2[1] - p0[1]) / 6.0)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6.0, p2[1] - (p3[1] - p1[1]) / 6.0)
        d += " C %.1f %.1f %.1f %.1f %.1f %.1f" % (c1[0], c1[1], c2[0], c2[1], p2[0], p2[1])
    return d


def contour(y0, amp, phase, step=48, x0=-60, x1=W + 60):
    pts = []
    x = x0
    while x <= x1:
        y = (
            y0
            + amp * math.sin(x / 230.0 + phase)
            + amp * 0.34 * math.sin(x / 96.0 + phase * 1.7)
        )
        pts.append((x, y))
        x += step
    return smooth(pts)


def ridge(points, fill, opacity=1.0):
    top = smooth(points)
    body = "%s L %.1f 640 L %.1f 640 Z" % (top, points[-1][0], points[0][0])
    return '<path d="%s" fill="%s" fill-opacity="%s"/>' % (body, fill, opacity)


def conifer(x, base, h, w):
    out = []
    for hw, top, bot in ((0.34, 0.0, 0.52), (0.46, 0.3, 0.78), (0.5, 0.56, 1.0)):
        out.append(
            "M %.1f %.1f L %.1f %.1f L %.1f %.1f Z"
            % (
                x, base - h * top,
                x + w * hw, base - h * top + h * (bot - top) * 0.9,
                x - w * hw, base - h * top + h * (bot - top) * 0.9,
            )
        )
    return "".join(out)


def tree_row(count, x0, x1, base_fn, hmin, hmax, wmin, wmax):
    out = []
    for _ in range(count):
        x = rng.uniform(x0, x1)
        h = rng.uniform(hmin, hmax)
        w = rng.uniform(wmin, wmax)
        out.append(conifer(x, base_fn(x) + 1, h, w))
    return "".join(out)


def grass(x, y, s=1.0, blades=5, delay=0.0):
    out = []
    for i in range(blades):
        dx = (i - (blades - 1) / 2.0) * 2.7 * s
        h = (11 + rng.uniform(0, 10)) * s
        bend = rng.uniform(-5.0, 5.0) * s
        out.append(
            '<path d="M %.1f %.1f Q %.1f %.1f %.1f %.1f"/>'
            % (x + dx, y, x + dx * 1.25 + bend * 0.4, y - h * 0.55, x + dx * 1.6 + bend, y - h)
        )
    return (
        '<g class="art-grass" fill="none" stroke="%s" stroke-width="1.6" stroke-linecap="round" '
        'opacity=".72" style="animation-delay:%.2fs">%s</g>' % (CREAM, delay, "".join(out))
    )


def bird(x, y, s, delay, dur):
    d = ("M -10 0 C -7 -5.4 -3 -5.8 0 -1.4 C 3 -5.8 7 -5.4 10 0 "
         "C 6.2 -2.9 3 -1.1 0 2.2 C -3 -1.1 -6.2 -2.9 -10 0 Z")
    return (
        '<g class="art-bird" transform="translate(%d %d) scale(%.2f)">'
        '<g class="art-flap" style="animation-delay:%.2fs;animation-duration:%.2fs">'
        '<path d="%s" fill="%s" fill-opacity=".86"/></g></g>'
    ) % (x, y, s, delay, dur, d, CREAM)


# ------------------------------------------------------------------- figures

def figure_hiker(x, y, s=1.0):
    t = "translate(%.1f %.1f) scale(%.3f)" % (x, y, s)
    return (
        '<g class="art-figure" transform="%s" fill="%s" stroke="%s" stroke-linecap="round" '
        'stroke-linejoin="round">'
        '<rect x="-17" y="-76" width="15" height="31" rx="6" fill="%s" stroke="none"/>'
        '<path d="M -14 -62 h 9" stroke="%s" stroke-width="1.8" opacity=".5"/>'
        '<path d="M 1 -80 L 9 -82 L 12 -48 L -2 -46 Z" fill="%s" stroke="none"/>'
        '<circle cx="7" cy="-90" r="7.2" fill="%s" stroke="none"/>'
        '<path d="M 4 -47 L 12 -25 L 15 -2" stroke-width="6.4" fill="none"/>'
        '<path d="M 0 -46 L -7 -23 L -10 -2" stroke-width="6.4" fill="none"/>'
        '<path d="M 8 -72 L 17 -59 L 20 -52" stroke-width="5" fill="none"/>'
        "</g>"
    ) % (t, CREAM, CREAM, SAND_DEEP, INK, CREAM, CREAM)


def figure_photographer(x, y, s=1.0):
    t = "translate(%.1f %.1f) scale(%.3f)" % (x, y, s)
    return (
        '<g class="art-figure" transform="%s" fill="%s" stroke="%s" stroke-linecap="round" '
        'stroke-linejoin="round">'
        '<path d="M -3 -50 L -10 -25 L -12 -2" stroke-width="6.6" fill="none"/>'
        '<path d="M 3 -50 L 9 -25 L 11 -2" stroke-width="6.6" fill="none"/>'
        '<path d="M -7 -88 Q -9 -68 -6 -48 L 6 -48 Q 8 -68 6 -88 Z" fill="%s" stroke="none"/>'
        '<path d="M -5 -84 L -11 -109" stroke-width="4.6" fill="none"/>'
        '<path d="M 6 -84 L 11 -109" stroke-width="4.6" fill="none"/>'
        '<circle cx="0" cy="-96" r="7.2" fill="%s" stroke="none"/>'
        '<rect x="-12" y="-124" width="24" height="12" rx="2.6" fill="%s" stroke="none"/>'
        '<rect x="-4" y="-128" width="8" height="4" rx="1.4" fill="%s" stroke="none"/>'
        '<circle cx="8" cy="-118" r="3" fill="%s" stroke="%s" stroke-width="1.2"/>'
        "</g>"
    ) % (t, CREAM, CREAM, CREAM, CREAM, CREAM, CREAM, CREAM, INK)


def figure_cyclist(x, y, s=1.0):
    t = "translate(%.1f %.1f) scale(%.3f)" % (x, y, s)
    return (
        '<g class="art-figure" transform="%s" fill="none" stroke="%s" stroke-linecap="round" '
        'stroke-linejoin="round">'
        '<circle cx="-23" cy="-16" r="15.5" stroke-width="2.4"/>'
        '<circle cx="23" cy="-16" r="15.5" stroke-width="2.4"/>'
        '<path d="M -23 -16 L -4 -46 L 23 -16 M -23 -16 L 7 -16 M 23 -16 L 14 -42" stroke-width="2.8"/>'
        '<path d="M -3 -50 L 8 -32 L 1 -17" stroke-width="5.6"/>'
        '<path d="M -5 -52 L 9 -34" stroke-width="8.6"/>'
        '<path d="M 0 -55 L 13 -42" stroke-width="4.4"/>'
        '<circle cx="-4" cy="-61" r="6.4" fill="%s" stroke="none"/>'
        "</g>"
    ) % (t, CREAM, CREAM)


def figure_child(x, y, s=1.0):
    t = "translate(%.1f %.1f) scale(%.3f)" % (x, y, s)
    return (
        '<g class="art-figure" transform="%s" fill="none" stroke="%s" stroke-linecap="round" '
        'stroke-linejoin="round">'
        '<path d="M -2 -52 L 1 -26" stroke-width="10" stroke-linecap="round"/>'
        '<path d="M -1 -26 L -9 -2" stroke-width="6.2"/>'
        '<path d="M 1 -26 L 8 -2" stroke-width="6.2"/>'
        '<path d="M 1 -46 L 13 -30 L 18 -22" stroke-width="4.4"/>'
        '<circle cx="-2" cy="-60" r="6.8" fill="%s" stroke="none"/>'
        "</g>"
    ) % (t, CREAM, CREAM)


def seedling(x, y, s=1.0):
    t = "translate(%.1f %.1f) scale(%.3f)" % (x, y, s)
    return (
        '<g transform="%s" fill="none" stroke="%s" stroke-linecap="round">'
        '<path d="M 0 0 Q 1 -8 0 -17" stroke-width="1.8"/>'
        '<path d="M 0 -9 Q -8 -14 -7 -21 Q 0 -18 0 -10" stroke-width="1.5" fill="%s" fill-opacity=".9"/>'
        '<path d="M 0 -13 Q 8 -18 7 -25 Q 0 -22 0 -13" stroke-width="1.5" fill="%s" fill-opacity=".9"/>'
        "</g>"
    ) % (t, CREAM, CREAM, CREAM)


def bear(x, y, s=1.0):
    t = "translate(%.1f %.1f) scale(%.3f)" % (x, y, s)
    return (
        '<g transform="%s"><g class="art-bear">'
        '<circle cx="-10" cy="-57" r="5.6" fill="%s"/>'
        '<circle cx="10" cy="-57" r="5.6" fill="%s"/>'
        '<circle cx="-10" cy="-57" r="2.4" fill="%s" opacity=".5"/>'
        '<circle cx="10" cy="-57" r="2.4" fill="%s" opacity=".5"/>'
        '<circle cx="0" cy="-45" r="12.8" fill="%s"/>'
        '<ellipse cx="0" cy="-21" rx="12.6" ry="15.6" fill="%s"/>'
        '<path d="M -10 -31 Q -17 -21 -13 -9" stroke="%s" stroke-width="6.6" stroke-linecap="round" fill="none"/>'
        '<path d="M 10 -31 Q 17 -21 13 -9" stroke="%s" stroke-width="6.6" stroke-linecap="round" fill="none"/>'
        '<path d="M -6 -9 L -7 0" stroke="%s" stroke-width="7" stroke-linecap="round" fill="none"/>'
        '<path d="M 6 -9 L 7 0" stroke="%s" stroke-width="7" stroke-linecap="round" fill="none"/>'
        '<ellipse cx="4" cy="-41" rx="5.6" ry="4.4" fill="%s"/>'
        '<circle cx="6.4" cy="-42" r="1.7" fill="%s"/>'
        '<circle cx="1.4" cy="-50" r="1.5" fill="%s"/>'
        "</g></g>"
    ) % (t, CLAY, CLAY, SAND_DEEP, SAND_DEEP, CLAY, CLAY, CLAY, CLAY, CLAY, CLAY, CREAM, INK, INK)


def duck(x, y, s=1.0):
    t = "translate(%.1f %.1f) scale(%.3f)" % (x, y, s)
    return (
        '<g transform="%s" fill="%s">'
        '<ellipse cx="0" cy="-4" rx="9" ry="4.6"/>'
        '<circle cx="-7" cy="-10" r="3.6"/>'
        '<path d="M -10.4 -10.6 L -15 -9.4 L -10.4 -8.4 Z"/>'
        '<path d="M 8 -5 Q 13 -9 14 -3 Z" fill-opacity=".85"/>'
        "</g>"
    ) % (t, CREAM)


# --------------------------------------------------------------------- scene

def build():
    parts = []
    add = parts.append

    # ---- defs -------------------------------------------------------------
    add('<defs>')
    add(
        '<linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" stop-color="%s"/><stop offset=".62" stop-color="%s"/>'
        '<stop offset="1" stop-color="%s"/></linearGradient>' % (SKY_TOP, INK, WATER_TOP)
    )
    add(
        '<radialGradient id="heroGlow" cx=".5" cy=".5" r=".5">'
        '<stop offset="0" stop-color="%s" stop-opacity=".32"/>'
        '<stop offset=".5" stop-color="%s" stop-opacity=".13"/>'
        '<stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient>' % (CLAY, CLAY, CLAY)
    )
    add(
        '<radialGradient id="heroMist" cx=".5" cy=".5" r=".5">'
        '<stop offset="0" stop-color="%s" stop-opacity=".17"/>'
        '<stop offset=".55" stop-color="%s" stop-opacity=".08"/>'
        '<stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient>' % (CREAM, CREAM, CREAM)
    )
    add(
        '<linearGradient id="heroWater" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'
        % (WATER_TOP, WATER_BOTTOM)
    )
    add(
        '<linearGradient id="heroWaterHaze" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" stop-color="%s" stop-opacity=".1"/>'
        '<stop offset="1" stop-color="%s" stop-opacity="0"/></linearGradient>' % (CREAM, CREAM)
    )
    add(
        '<radialGradient id="heroBeamFade" gradientUnits="userSpaceOnUse" cx="126" cy="191" r="460">'
        '<stop offset=".08" stop-color="#fff" stop-opacity=".95"/>'
        '<stop offset=".42" stop-color="#fff" stop-opacity=".5"/>'
        '<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'
    )
    add('<mask id="heroBeamMask"><path d="M 126 191 L 600 158 L 600 224 Z" fill="url(#heroBeamFade)"/></mask>')
    add('<mask id="heroBeamMaskL"><path d="M 126 191 L -340 162 L -340 220 Z" fill="url(#heroBeamFade)"/></mask>')
    add(
        '<radialGradient id="heroLamp" cx=".5" cy=".5" r=".5">'
        '<stop offset="0" stop-color="#FFD9A8" stop-opacity=".95"/>'
        '<stop offset=".3" stop-color="%s" stop-opacity=".5"/>'
        '<stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient>' % (CLAY, CLAY)
    )
    add(
        '<radialGradient id="heroReflect" cx=".5" cy=".5" r=".5">'
        '<stop offset="0" stop-color="%s" stop-opacity=".3"/>'
        '<stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient>' % (CLAY, CLAY)
    )
    add('<clipPath id="heroTower"><path d="M 104 338 L 112 210 L 140 210 L 148 338 Z"/></clipPath>')
    add("</defs>")

    # ---- sky --------------------------------------------------------------
    add('<rect width="%d" height="%d" fill="url(#heroSky)"/>' % (W, H))

    add('<g class="art-layer" data-depth="0.18"><g class="art-glow">')
    add('<ellipse cx="330" cy="420" rx="470" ry="300" fill="url(#heroGlow)"/>')
    add("</g></g>")

    add('<g class="art-layer" data-depth="0.4">')
    add('<g class="art-contours" fill="none" stroke="%s" stroke-width="1.05">' % CREAM)
    add('<g class="art-drift-slow">')
    for i in range(11):
        y0 = 40 + i * 27 + math.sin(i * 1.3) * 6
        amp = 6 + (i % 4) * 3.2
        add('<path d="%s" opacity="%.3f"/>' % (contour(y0, amp, i * 0.9), 0.15 - i * 0.008))
    add("</g></g></g>")

    # ---- far ridges -------------------------------------------------------
    r1 = [(-40, 386), (120, 370), (260, 382), (400, 364), (560, 378), (700, 362),
          (860, 376), (1000, 358), (1140, 374), (1300, 364), (1460, 378), (1640, 366)]
    r2 = [(-40, 418), (140, 402), (300, 414), (460, 398), (620, 412), (780, 398),
          (940, 410), (1100, 396), (1260, 408), (1420, 398), (1640, 410)]
    r3 = [(-40, 456), (120, 444), (260, 454), (380, 442), (520, 452), (660, 440),
          (820, 454), (980, 446), (1120, 456), (1260, 448), (1400, 460), (1640, 452)]

    def r3y(x):
        for i in range(len(r3) - 1):
            x0, y0 = r3[i]
            x1, y1 = r3[i + 1]
            if x0 <= x <= x1:
                return y0 + (y1 - y0) * (x - x0) / float(x1 - x0)
        return 452

    add('<g class="art-layer" data-depth="0.62">')
    add(ridge(r1, RIDGE_1))
    add("</g>")

    add('<g class="art-layer" data-depth="0.82">')
    add(ridge(r2, RIDGE_2))
    add('<g fill="%s" opacity=".8">%s</g>' % (TREE_FAR, tree_row(30, -20, 1620, lambda x: 400 + (x % 9), 9, 17, 1.4, 2.1)))
    add("</g>")

    add('<g class="art-layer" data-depth="1.02">')
    add(ridge(r3, RIDGE_3))
    add('<g fill="%s">%s</g>' % (TREE_MID, tree_row(40, -20, 1620, r3y, 10, 20, 1.4, 2.2)))
    add("</g>")

    # ---- mist -------------------------------------------------------------
    add('<g class="art-layer" data-depth="1.2">')
    add('<g class="art-mist art-mist--a"><ellipse cx="300" cy="472" rx="380" ry="44" fill="url(#heroMist)"/></g>')
    add('<g class="art-mist art-mist--b"><ellipse cx="980" cy="468" rx="420" ry="38" fill="url(#heroMist)"/></g>')
    add('<g class="art-mist art-mist--c"><ellipse cx="1420" cy="466" rx="300" ry="34" fill="url(#heroMist)"/></g>')
    add("</g>")

    # ---- water ------------------------------------------------------------
    # far shore line, then the inlet between the two headlands
    near_bank = [(356, 520), (420, 528), (520, 535), (640, 539), (760, 541),
                 (880, 539), (1000, 535), (1100, 527), (1158, 519)]

    add('<g class="art-layer" data-depth="1.08">')
    add('<rect x="300" y="%d" width="900" height="%d" fill="url(#heroWater)"/>' % (HORIZON, H - HORIZON))
    add('<path d="M 300 %d H 1200" stroke="%s" stroke-width="1" opacity=".3"/>' % (HORIZON, CREAM))
    add('<rect x="300" y="%d" width="900" height="34" fill="url(#heroWaterHaze)"/>' % HORIZON)
    add('<ellipse cx="420" cy="512" rx="230" ry="20" fill="url(#heroReflect)"/>')
    add('<g class="art-water" stroke-linecap="round" fill="none">')
    ripples = [
        (368, 502, 92, 1.0, 0.34), (470, 512, 78, 1.0, 0.26), (560, 506, 120, 1.2, 0.4),
        (672, 516, 96, 1.0, 0.28), (788, 505, 130, 1.2, 0.42), (902, 518, 104, 1.0, 0.26),
        (1010, 508, 110, 1.1, 0.34), (1088, 520, 74, 1.0, 0.22), (1116, 526, 54, 1.0, 0.18),
        (430, 522, 64, 1.0, 0.2), (612, 528, 58, 1.0, 0.16), (864, 530, 52, 1.0, 0.15),
        (500, 534, 42, 1.0, 0.13), (1040, 532, 38, 1.0, 0.12),
    ]
    for i, (x, y, w, sw, op) in enumerate(ripples):
        add('<path class="art-ripple" d="M %d %d h %d" stroke="%s" stroke-width="%.1f" '
            'opacity="%.2f" style="animation-delay:%.1fs"/>'
            % (x, y, w, CLAY if i % 5 == 3 else CREAM, sw, op, i * 0.9))
    add("</g>")
    add(duck(1002, 516, 1.0) + duck(1038, 523, 0.86) + duck(966, 525, 0.76))
    add("</g>")

    # ---- shore ------------------------------------------------------------
    plateau = [(-40, 640), (-40, 340), (24, 334), (70, 338), (96, 330), (118, 326),
               (146, 330), (168, 322), (186, 334), (196, 348)]
    slope_l = [(210, 378), (222, 400), (232, 412), (244, 430), (256, 446), (268, 458),
               (282, 478), (296, 494), (308, 505), (322, 515), (334, 522), (342, 528)]
    slope_r = [(1180, 516), (1196, 508), (1210, 500), (1234, 486), (1250, 478), (1262, 472),
               (1292, 460), (1330, 450), (1380, 446), (1440, 443), (1520, 441), (1640, 439)]
    shore = plateau + slope_l + near_bank + slope_r

    add('<g class="art-layer" data-depth="1.5">')
    add('<g class="art-shore">')
    add('<path d="%s L 1640 640 Z" fill="%s"/>' % (smooth(shore), CREAM))
    add('<path d="%s" fill="none" stroke="%s" stroke-width="1.5" opacity=".5"/>'
        % (smooth(plateau[1:] + slope_l + near_bank + slope_r), CLAY))
    # a quiet sand fringe where the land meets the water
    add('<path d="%s" fill="none" stroke="%s" stroke-width="2.2" opacity=".55"/>'
        % (smooth(slope_l + near_bank + slope_r), SAND_DEEP))
    add('<g fill="%s" opacity=".55">' % SAND_DEEP)
    for i in range(16):
        x = 380 + i * 48 + rng.uniform(-9, 9)
        y = 528 + (i % 3) * 6 + rng.uniform(-2, 2)
        add('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f"/>' % (x, y, rng.uniform(1.6, 4.2), rng.uniform(1.0, 2.0)))
    add("</g>")
    add('<g fill="none" stroke="%s" stroke-width="1" opacity=".5">' % SAND_DEEP)
    for i in range(5):
        add('<path d="M %d %d Q %d %d %d %d"/>'
            % (430 + i * 40, 566 + i * 8, 560 + i * 30, 574 + i * 8, 700 + i * 20, 566 + i * 8))
    add("</g>")
    add('<g fill="%s" opacity=".5">' % SAND_DEEP)
    for i in range(9):
        x = rng.uniform(210, 340)
        y = 380 + (i * 17) % 120
        add('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f"/>' % (x, y, rng.uniform(1.4, 3.4), rng.uniform(0.9, 1.6)))
    add("</g>")

    # grass at the water's edge (cream blades against the dark water)
    add(grass(360, 534, 1.0, 6, 0.2))
    add(grass(340, 526, 0.9, 5, 1.1))
    add(grass(404, 546, 1.05, 6, 0.6))
    add(grass(1152, 528, 0.95, 5, 1.4))
    add(grass(1128, 522, 0.85, 5, 0.9))
    add('<g fill="%s" opacity=".85"><circle cx="326" cy="512" r="2"/><circle cx="336" cy="505" r="1.6"/>'
        '<circle cx="316" cy="518" r="1.5"/></g>' % CLAY)
    # treeline on the headlands, silhouetted against the dark sky
    add('<g fill="%s">%s</g>' % (CREAM, tree_row(6, 4, 150, lambda x: 332 + (x % 5), 22, 46, 1.7, 2.5)))
    add('<g fill="%s">%s</g>' % (CREAM, tree_row(5, 1400, 1620, lambda x: 441 + (x % 3), 16, 34, 1.6, 2.3)))
    add(grass(92, 330, 0.9, 5, 0.5) + grass(160, 324, 0.8, 4, 1.3))
    add(grass(1600, 440, 0.9, 5, 0.8))
    # near bank: grass against the water
    add(grass(700, 539, 1.0, 5, 1.0) + grass(944, 537, 1.0, 5, 0.7) + grass(760, 540, 0.9, 5, 0.3))
    add('<g fill="%s" opacity=".7"><circle cx="1112" cy="516" r="1.8"/><circle cx="1120" cy="510" r="1.4"/></g>' % CLAY)

    # lighthouse
    add('<g class="art-lighthouse">')
    add('<g class="art-beam" style="mix-blend-mode:screen">'
        '<path d="M 126 191 L 600 158 L 600 224 Z" fill="%s" fill-opacity=".2" mask="url(#heroBeamMask)"/>'
        '<path d="M 126 191 L 600 174 L 600 208 Z" fill="%s" fill-opacity=".14" mask="url(#heroBeamMask)"/>'
        '<path d="M 126 191 L -340 162 L -340 220 Z" fill="%s" fill-opacity=".12" mask="url(#heroBeamMaskL)"/></g>'
        % ("#FFE2CB", "#FFE2CB", "#FFE2CB"))
    add('<circle cx="126" cy="191" r="62" fill="url(#heroLamp)" class="art-lamp-glow"/>')
    add('<path d="M 104 338 L 112 210 L 140 210 L 148 338 Z" fill="%s"/>' % CREAM)
    add('<g clip-path="url(#heroTower)"><rect x="100" y="244" width="52" height="13" fill="%s" opacity=".92"/>'
        '<rect x="100" y="296" width="52" height="15" fill="%s" opacity=".92"/></g>' % (CLAY, CLAY))
    add('<rect x="106" y="204" width="40" height="7" rx="1.5" fill="%s"/>' % CREAM)
    add('<rect x="112" y="178" width="28" height="26" fill="%s"/>' % CREAM)
    add('<rect x="125" y="178" width="1.4" height="26" fill="%s" opacity=".25"/>' % INK)
    add('<rect x="110" y="172" width="32" height="6" rx="1.5" fill="%s"/>' % CREAM)
    add('<path d="M 112 172 L 126 150 L 140 172 Z" fill="%s"/>' % CREAM)
    add('<path d="M 126 150 L 126 140" stroke="%s" stroke-width="1.6"/>' % CREAM)
    add('<circle cx="126" cy="138" r="2.4" fill="%s"/>' % CREAM)
    add('<rect x="118" y="322" width="12" height="16" rx="5" fill="%s" opacity=".85"/>' % INK)
    add('<rect x="122" y="232" width="5" height="10" rx="2.5" fill="%s" opacity=".75"/>' % INK)
    add('<rect x="123" y="268" width="5" height="10" rx="2.5" fill="%s" opacity=".75"/>' % INK)
    add('<circle cx="126" cy="191" r="4.4" fill="%s"/>' % CLAY)
    add("</g>")

    # people, bear
    add(figure_hiker(262, 458, 1.0))
    add(figure_photographer(1330, 448, 1.0))
    add(figure_cyclist(1444, 443, 1.0))
    add(figure_child(1518, 441, 0.95))
    add(seedling(1538, 439, 1.0))
    add(bear(824, 543, 1.38))
    add("</g></g>")

    # ---- birds ------------------------------------------------------------
    add('<g class="art-layer" data-depth="1.32"><g class="art-birds">')
    flock = [(250, 148, 1.5, 0.0, 0.9), (300, 176, 1.0, 0.4, 1.1), (520, 106, 1.15, 0.2, 1.0),
             (604, 140, 0.9, 0.7, 1.2), (762, 84, 0.72, 0.5, 1.3), (978, 138, 1.0, 0.9, 0.95),
             (1078, 98, 0.82, 0.3, 1.15), (1186, 168, 1.05, 0.6, 1.05), (1418, 118, 0.9, 0.15, 1.2)]
    for x, y, s, delay, dur in flock:
        add(bird(x, y, s, delay, dur))
    add("</g></g>")

    style = """
<style>
.hero-art .art-layer { will-change: transform; }
.hero-art .art-drift-slow { animation: artDrift 96s ease-in-out infinite alternate; }
.hero-art .art-glow { animation: artGlow 20s ease-in-out infinite; transform-box: view-box; transform-origin: 330px 420px; }
.hero-art .art-mist--a { animation: artMistA 74s linear infinite; }
.hero-art .art-mist--b { animation: artMistB 92s linear infinite; }
.hero-art .art-mist--c { animation: artMistC 64s linear infinite; }
.hero-art .art-beam { animation: artBeam 18s ease-in-out infinite; transform-box: view-box; transform-origin: 126px 191px; }
.hero-art .art-lamp-glow { animation: artLamp 5.4s ease-in-out infinite; transform-box: view-box; transform-origin: 126px 191px; }
.hero-art .art-ripple { animation: artRipple 9s ease-in-out infinite; }
.hero-art .art-bird { animation: artBob 7.5s ease-in-out infinite; }
.hero-art .art-flap { animation: artFlap 1s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 50%; }
.hero-art .art-grass { animation: artSway 7s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
.hero-art .art-bear { animation: artBear 6s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
@keyframes artDrift { from { transform: translateX(-14px); } to { transform: translateX(14px); } }
@keyframes artGlow { 0%, 100% { opacity: .84; } 50% { opacity: 1; } }
@keyframes artMistA { 0% { transform: translateX(-60px); } 100% { transform: translateX(90px); } }
@keyframes artMistB { 0% { transform: translateX(40px); } 100% { transform: translateX(-70px); } }
@keyframes artMistC { 0% { transform: translateX(-40px); } 100% { transform: translateX(60px); } }
@keyframes artBeam { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
@keyframes artLamp { 0%, 100% { opacity: .55; } 45% { opacity: 1; } }
@keyframes artRipple { 0%, 100% { transform: translateX(-3px); opacity: .55; } 50% { transform: translateX(4px); opacity: 1; } }
@keyframes artBob { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(3px, -4px); } }
@keyframes artFlap { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(.55); } }
@keyframes artSway { 0%, 100% { transform: rotate(-1.2deg); } 50% { transform: rotate(1.2deg); } }
@keyframes artBear { 0%, 100% { transform: translateY(0) rotate(-.8deg); } 50% { transform: translateY(-1.5px) rotate(.8deg); } }
@media (prefers-reduced-motion: reduce) {
  .hero-art .art-glow, .hero-art .art-mist--a, .hero-art .art-mist--b, .hero-art .art-mist--c,
  .hero-art .art-beam, .hero-art .art-lamp-glow, .hero-art .art-ripple, .hero-art .art-bird,
  .hero-art .art-flap, .hero-art .art-grass, .hero-art .art-bear, .hero-art .art-drift-slow {
    animation: none !important;
  }
}
</style>
""".strip()

    head = (
        '<svg class="hero-art" viewBox="0 0 %d %d" preserveAspectRatio="xMidYMid slice" '
        'role="img" aria-label="등대와 배낭을 멘 하이커, 날아오르는 새, 사진을 찍는 사람과 자전거를 타는 사람, '
        '나무를 심는 아이, 그리고 물가를 걷는 작은 곰을 하나의 숲 지형 실루엣으로 겹쳐 놓은 아트워크" '
        'xmlns="http://www.w3.org/2000/svg">' % (W, H)
    )
    return head + "\n" + style + "\n" + "\n".join(parts) + "\n</svg>"


def main():
    svg = build()
    with open(os.path.join(ROOT, "assets", "hero-art.svg"), "w", encoding="utf-8") as fh:
        fh.write(svg + "\n")

    page_path = os.path.join(ROOT, "index.html")
    with open(page_path, encoding="utf-8") as fh:
        page = fh.read()
    start, end = "<!-- hero-art:start -->", "<!-- hero-art:end -->"
    if start not in page or end not in page:
        raise SystemExit("index.html has no hero-art markers")
    page = page.split(start)[0] + start + "\n" + svg + "\n" + end + page.split(end)[1]
    with open(page_path, "w", encoding="utf-8") as fh:
        fh.write(page)
    print("hero art written: assets/hero-art.svg (%d bytes) + index.html" % len(svg))


if __name__ == "__main__":
    main()
