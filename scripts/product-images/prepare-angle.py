"""Prepare the angled K8 image for the product stage.

    python3 scripts/product-images/prepare-angle.py SOURCE MASK FRONT OUT [PREVIEW_DIR]

SOURCE  the original angled image (kept unchanged)
MASK    the soft subject mask from lift.swift
FRONT   the existing front-view cutout (public/images/k8-stage-alpha.png)
OUT     the prepared transparent image (public/images/k8-angle-alpha.png)

Steps — the machine's pixels are never scaled, warped, recoloured or redrawn:

  1. alpha:  the mask, very slightly tightened so edges stay crisp;
  2. colour: edge pixels are un-mixed from the local background colour, so
             no light halo from the original backdrop remains;
  3. frame:  the cutout is padded onto a square canvas sized so that, once
             both images fill the same stage box, the machine's visible
             height, ground line and centre of mass match the front view's.

Prints the placement and the flexible pipe's nozzle position (u, v as
fractions of the square) as JSON, for lib/scene-config.ts.
Requires Pillow and NumPy.
"""
import json
import sys

import numpy as np
from PIL import Image


def box_sum(a, r):
    """Sum over a (2r+1)² window at every pixel (zero outside), via an integral image."""
    k = 2 * r + 1
    pad = ((r + 1, r), (r + 1, r)) + ((0, 0),) * (a.ndim - 2)
    c = np.pad(a, pad).cumsum(0).cumsum(1)
    h, w = a.shape[:2]
    return c[k : k + h, k : k + w] - c[0:h, k : k + w] - c[k : k + h, 0:w] + c[0:h, 0:w]


def local_mean(rgb, weight, radii):
    """Average colour of the weighted pixels near each pixel, widening the window where there are none."""
    out = np.zeros_like(rgb)
    todo = np.ones(weight.shape, bool)
    for r in radii:
        n = box_sum(weight, r)
        s = box_sum(rgb * weight[..., None], r)
        ok = todo & (n > 0.5)
        out[ok] = s[ok] / n[ok][:, None]
        todo &= ~ok
    return out


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def bounds(alpha):
    ys, xs = np.where(alpha >= 0.5)
    solid = alpha >= 0.5
    return {
        "x0": int(xs.min()), "x1": int(xs.max()), "y0": int(ys.min()), "y1": int(ys.max()),
        "cx": float(np.nonzero(solid)[1].mean()), "cy": float(np.nonzero(solid)[0].mean()),
    }


def main(source, mask_path, front_path, out_path, preview=None):
    src = np.asarray(Image.open(source).convert("RGB")).astype(np.float64)
    m = np.asarray(Image.open(mask_path).convert("L")).astype(np.float64) / 255
    front = np.asarray(Image.open(front_path).convert("RGBA")).astype(np.float64)
    front_a = front[..., 3] / 255
    assert src.shape[:2] == m.shape, "mask and source sizes differ"

    # 1. Alpha.
    a = np.clip((m - 0.04) / 0.92, 0, 1)

    # 2. Colour: C = a·F + (1 − a)·B  →  F = (C − (1 − a)·B) / a, with B the nearby backdrop.
    backdrop = local_mean(src, (m < 0.02).astype(np.float64), (10, 30, 90))
    inside = local_mean(src, (m > 0.98).astype(np.float64), (6, 20, 60))
    unmixed = (src - (1 - a[..., None]) * backdrop) / np.maximum(a, 1e-3)[..., None]
    w = smoothstep(0.08, 0.5, a)[..., None]  # faint pixels lean on the nearby product colour
    rgb = np.where(a[..., None] >= 0.98, src, w * unmixed + (1 - w) * inside)
    rgb = np.clip(rgb, 0, 255)

    # 3. Frame, matched to the front view.
    fb, ab = bounds(front_a), bounds(a)
    fsize = front_a.shape[0]
    fh = fb["y1"] - fb["y0"] + 1
    ah = ab["y1"] - ab["y0"] + 1
    size = round(fsize * ah / fh)
    k = size / fsize  # front pixels → canvas pixels
    ox = round(fb["cx"] * k - ab["cx"])
    oy = round((fb["y1"] + 1) * k - (ab["y1"] + 1))  # same ground line

    h, w_ = a.shape
    canvas = np.zeros((size, size, 4))
    x0, y0 = max(0, ox), max(0, oy)
    sx0, sy0 = x0 - ox, y0 - oy
    x1, y1 = min(size, ox + w_), min(size, oy + h)
    sx1, sy1 = sx0 + (x1 - x0), sy0 + (y1 - y0)
    lost = a.sum() - a[sy0:sy1, sx0:sx1].sum()
    assert lost < 1, f"placement would crop the product ({lost:.1f} px of alpha)"
    canvas[y0:y1, x0:x1, :3] = rgb[sy0:sy1, sx0:sx1]
    canvas[y0:y1, x0:x1, 3] = a[sy0:sy1, sx0:sx1] * 255
    Image.fromarray(np.round(canvas).astype(np.uint8)).save(out_path, optimize=True)

    # The flexible pipe's nozzle: the lowest point of the pipe on the left of the machine.
    ca = canvas[..., 3] / 255
    left = ca[:, : int((ab["x0"] + ox) + 0.12 * size)]
    rows = np.where((left >= 0.5).any(1))[0]
    tip = rows.max()
    xs = np.where(left[tip - 3 : tip + 1] >= 0.5)[1]
    nozzle = {"u": round(float(xs.mean() + 0.5) / size, 4), "v": round(float(tip + 1) / size, 4)}

    cb = bounds(ca)
    report = {
        "source": {"size": [w_, h], "bounds": ab},
        "front": {"size": fsize, "bounds": fb},
        "canvas": size,
        "offset": [ox, oy],
        "bounds_in_box": {  # fractions of the square box: should match the front's
            "angle": [round(cb["x0"] / size, 4), round(cb["y0"] / size, 4), round((cb["x1"] + 1) / size, 4), round((cb["y1"] + 1) / size, 4)],
            "front": [round(fb["x0"] / fsize, 4), round(fb["y0"] / fsize, 4), round((fb["x1"] + 1) / fsize, 4), round((fb["y1"] + 1) / fsize, 4)],
            "angle_centroid_x": round(cb["cx"] / size, 4),
            "front_centroid_x": round(fb["cx"] / fsize, 4),
        },
        "nozzle": nozzle,
    }
    print(json.dumps(report, indent=1))

    if preview:
        out = np.round(canvas).astype(np.uint8)
        al = out[..., 3:4] / 255

        def over(bg):
            return Image.fromarray((out[..., :3] * al + np.array(bg) * (1 - al)).astype(np.uint8))

        tiles = [over(bg).resize((size // 2, size // 2)) for bg in ((24, 26, 30), (226, 237, 243), (243, 235, 222), (250, 249, 246))]
        sheet = Image.new("RGB", (size // 2 * 4, size // 2))
        for i, t in enumerate(tiles):
            sheet.paste(t, (i * size // 2, 0))
        sheet.save(f"{preview}/angle-sheet.png")
        # Onion skin: front (red) and angle (cyan) silhouettes in the same box.
        fr = np.asarray(Image.fromarray((front_a * 255).astype(np.uint8)).resize((size, size))) / 255
        onion = np.full((size, size, 3), 255.0)
        onion[..., 1] -= fr * 120
        onion[..., 2] -= fr * 120
        onion[..., 0] -= ca * 120
        Image.fromarray(onion.clip(0, 255).astype(np.uint8)).resize((size // 2, size // 2)).save(f"{preview}/onion.png")
        dark = over((24, 26, 30))
        crops = [(0.10, 0.70, 0.24, 0.90), (0.22, 0.78, 0.58, 0.92), (0.84, 0.52, 0.94, 0.86), (0.36, 0.02, 0.62, 0.16)]
        row = Image.new("RGB", (4 * 320, 320))
        for i, (a0, b0, a1, b1) in enumerate(crops):
            t = dark.crop((int(a0 * size), int(b0 * size), int(a1 * size), int(b1 * size)))
            t = t.resize((t.width * 2, t.height * 2))
            t.thumbnail((320, 320))
            row.paste(t, (i * 320, 0))
        row.save(f"{preview}/edges.png")


if __name__ == "__main__":
    main(*sys.argv[1:])
