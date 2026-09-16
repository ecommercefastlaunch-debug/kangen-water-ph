# 3D product stage — model and water

The story's product stage is one WebGL canvas (`components/experience/scene/`)
that draws the machine and a stream of water leaving the flexible pipe.

| Renderer | When | What it is |
| --- | --- | --- |
| **photo** | Now, in production | Two still images of the K8 — the approved front photograph (`public/images/k8-stage-alpha.png`) and an angled view (`public/images/k8-angle-alpha.png`) — drawn flat in the canvas exactly where the page images sit, crossfading at two points in the story. Not 3D: they move, scale and crossfade but never rotate. |
| **model** | Once an approved model is supplied | A real GLB/glTF K8, lit with a local room environment, framed in the same box, turning gently between front and three-quarter views (`yaw`). |
| **dev-proxy** | Local development only (`NEXT_PUBLIC_K8_DEV_PROXY=1`) | A crude procedural stand-in, labelled on screen as *not the K8*, for testing the model path. Never deployed. |

In every mode the page image is shown first and stays as the fallback:
reduced motion, no WebGL, a failed download or a lost graphics context all
leave the photograph in place.

## Two views: front and angled

Both images sit in the one product box (`components/experience/ProductImageFallback.tsx`),
stacked exactly; the WebGL scene draws those same `<img>` elements, so there
is no second download.

| Chapters | View |
| --- | --- |
| Intro | front |
| One machine. Five waters. → the five waters → The power of eight | angled |
| Control at your fingertips (touch display) → Made for every day → final | front |

- **The crossfade** happens only in the middle of the move between two
  chapters (`VIEW_CROSSFADE` in `lib/experience-poses.ts`: 25–75 % of it,
  about a fifth of a screen of scroll), while both chapters' copy is faint.
  The angled layer comes in on top before the front one leaves
  (`viewLayers`), so the machine never turns see-through; only the edges
  where the silhouettes differ double up, briefly. It is tied to the scroll
  position, so reversing, fast scrolling, reloading and the booking link all
  land on the right view.
- **The water** follows the view that is showing: each image has its own
  nozzle position (`photo.views.*.outlet`). It pauses during the crossfade,
  breaks off from the old nozzle and restarts at the new one — it never
  stretches across.
- **Loading**: the angled image loads right after the front one, before its
  first use. If it arrives late it fades in (`photo.lateFadeSeconds`); if it
  fails, the front view stays for the whole story. Reduced motion and no-JS
  visitors see the front view only.
- **Accessibility**: the angled layer is decorative (`alt=""`,
  `aria-hidden`), so screen readers hear one product image.

### Preparing a view image

`scripts/product-images/` turns a product photo into a stage image without
scaling, warping, recolouring or redrawing the machine:

```bash
swift scripts/product-images/lift.swift assets/product-images/k8-angle-source.png /tmp/k8
python3 scripts/product-images/prepare-angle.py assets/product-images/k8-angle-source.png /tmp/k8/mask.png public/images/k8-stage-alpha.png public/images/k8-angle-alpha.png
```

1. `lift.swift` makes a soft subject mask with Apple Vision (on-device, macOS 14+).
2. `prepare-angle.py` paints out the areas listed in its `REMOVE` constant
   (filling them from the surrounding body), tightens the alpha slightly,
   un-mixes edge pixels from the original backdrop (no light halo), and pads
   the cutout onto a square canvas so the machine's visible height, ground
   line and centre of mass match the front image. It prints the nozzle
   position for `photo.views.angle.outlet`.

The original is kept unchanged in `assets/product-images/` (not served).

### Accuracy of the current angled image

The angled image was **AI-generated** from the owner's brief; it is not a
photograph of a real K8, and nothing visible in it is a source of product
facts. Compared with the authentic front photograph and the operation
manual, it differs in ways that matter:

- **Display**: its tiles read pH 7.0, 8.5, 9.0, 9.5, 2.5 and 11.5. The
  manual's home screen shows 7.0, 9.5, 9.0, 8.5, 6.0 (Beauty) and 2.5; there
  is no 11.5 setting (Strong Kangen is about 11.0). The icons and colours
  differ from the real display too. The display is only a few pixels tall in
  the angled chapters; the close-up (Control) uses the front photograph.
- **Label**: the image carried a gold "WQA" seal with "C … USA" marks and a
  paragraph claiming NSF/ANSI 42, 53, 58 and 372 certification and a
  "Japanese Patent US 8,497,413 B2". None of this is on the authentic
  photograph or in the verified sources, NSF/ANSI 58 is a reverse-osmosis
  standard, and the lettering is partly garbled. **The seal and its C / USA
  marks were painted out** at the owner's request (2026-09-16;
  `REMOVE` in `scripts/product-images/prepare-angle.py`) — it was the only
  part legible at stage size. The paragraph beside it is still in the image;
  it is unreadable on the stage, and the site makes no certification claim.
- **Secondary hose**: a second hose leaves the base and rises to an upright
  nozzle beside the machine. The manual (EN10) says the secondary pipe must
  be kept lower than the machine, running to the sink.
- Consistent with the authentic photograph: body shape and proportions, the
  top connector and flexible pipe with its nozzle, the Enagic mark and
  display placement, the grey window at the lower right, and the feet.

**Replace it with an authentic angled photograph as soon as one is
available**: put the original in `assets/product-images/`, rerun the two
scripts above, and update `photo.views.angle.outlet` with the printed nozzle
position.

## The missing asset

**No accurate K8 model exists yet.** None was found in the repository or
the owner's files. To enable real 3D:

1. Add the approved file at **`public/models/kangen-k8.glb`**.
2. Set `modelUrl: "/models/kangen-k8.glb"` in **`lib/scene-config.ts`**.
3. Rebuild. If the file fails to load, the site falls back to the
   photograph and does not request it again during that visit.

The model must match the real machine — proportions, body shape, white
housing, display placement and framing, labels and logos, controls, the
flexible pipe and its fittings. Not another LeveLuk model, not a generic
appliance. Materials are used as supplied. Aim for ≤ 5 MB; Meshopt
compression is supported out of the box (Draco is not configured — add a
`DRACOLoader` with locally hosted decoders if you use it).

### Outlet-node convention

The model must contain an empty node named **`WaterOutlet`**:

- **Position:** the centre of the opening at the end of the flexible pipe.
- **Orientation:** its **local −Y axis** is the direction water leaves the
  nozzle (straight down for the K8's pipe as photographed).

The water is attached to this node's world position and direction every
frame, after the machine's pose is applied. If the node is missing the
water is not shown (it would otherwise start from a guess).

Model units can be anything: the model is scaled so its bounding box is
34.5 cm tall (the K8's height, manual EN35) and centred on that box.

## Where to adjust things

| What | Where |
| --- | --- |
| Model path, outlet node name and direction, key light, environment, camera field of view | `lib/scene-config.ts` → `modelUrl`, `model` |
| Nozzle position in each view image | `lib/scene-config.ts` → `photo.views.front.outlet`, `photo.views.angle.outlet` (fractions of the image box) |
| Which chapters show the front or angled view | `lib/experience-chapters.ts` → each chapter's `view` |
| Where and how quickly the views crossfade | `lib/experience-poses.ts` → `VIEW_CROSSFADE`, `viewLayers` |
| Fade-in for an angled image that loads late | `lib/scene-config.ts` → `photo.lateFadeSeconds` |
| Water speed, thickness, gravity, resolution, fade, start delay | `lib/scene-config.ts` → `water` |
| Pixel ratio and tube detail per device tier | `lib/scene-config.ts` → `quality` |
| Machine size, framing and yaw per chapter | `lib/experience-poses.ts` → `POSES` (`s`, `fx`/`fy`, `ox`/`oy`, `yaw`) |
| Which chapters show water | `lib/experience-chapters.ts` → each chapter's `flow` |
| Product box size on screen | `app/globals.css` → `.scene-anchor` |

## Water-mode accuracy

The stream demonstrates Kangen Water, a drinking water that the manual says
flows from the flexible pipe (EN18); Clean Water uses the same outlet. It
stops for Beauty, Strong Acidic (which leaves through a different pipe) and
Strong Kangen Water, and for the cell and display close-ups. It is a visual
demonstration, not a simulation of output rate.
