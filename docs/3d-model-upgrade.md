# 3D product stage — model and water

The story's product stage is one WebGL canvas (`components/experience/scene/`)
that draws the machine and a stream of water leaving the flexible pipe.

| Renderer | When | What it is |
| --- | --- | --- |
| **photo** | Now, in production | The approved K8 photograph (`public/images/k8-stage-alpha.png`), drawn flat in the canvas exactly where the page image sits. Not 3D: it moves and scales with the story but never rotates. |
| **model** | Once an approved model is supplied | A real GLB/glTF K8, lit with a local room environment, framed in the same box, turning gently between front and three-quarter views (`yaw`). |
| **dev-proxy** | Local development only (`NEXT_PUBLIC_K8_DEV_PROXY=1`) | A crude procedural stand-in, labelled on screen as *not the K8*, for testing the model path. Never deployed. |

In every mode the page image is shown first and stays as the fallback:
reduced motion, no WebGL, a failed download or a lost graphics context all
leave the photograph in place.

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
| Photo outlet (nozzle position in the photograph) | `lib/scene-config.ts` → `photo.outlet` (fractions of the image box) |
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
