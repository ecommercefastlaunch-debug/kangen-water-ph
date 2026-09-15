# Upgrading the persistent K8 to real 3D

The story is built around one persistent product stage. Today that stage
renders a **photograph** (`components/experience/ProductImageFallback.tsx`,
`public/images/k8-stage.png`). It is not 3D: the scroll timeline only moves,
scales and relights it, and never rotates it, because the photograph has no
sides or back.

No accurate K8 model was available when this was built — a search of the
repository and the owner's files found no GLB, glTF, USDZ, OBJ, FBX, Blend
or STL file, and a single front view is not enough to reconstruct one
honestly.

## What an upgrade needs

1. **A model you are allowed to use** (owner-supplied or licensed from
   Enagic), as `public/models/k8.glb`, that matches the real machine:
   proportions, body shape, white finish, display position and framing,
   labels and logos, controls, flexible pipe and fittings. Not another
   LeveLuk model, and not a generic white box.
2. Draco- or Meshopt-compressed geometry and KTX2/WebP textures, ideally
   under ~3 MB.

## Where it plugs in

- **Poses** — `lib/experience-poses.ts`. Add camera fields to `Pose`
  (for example `yaw`, `pitch`, `distance`) and set them per chapter in
  `POSES`. `mixPose` interpolates every field; the timeline (`track`,
  `sceneAt`) and the scroll controller do not change.
- **Renderer** — add `components/experience/K8Model.tsx`: one React Three
  Fiber `<Canvas>` with one `useGLTF` instance, mounted once inside
  `PersistentProductStage` in place of `ProductImageFallback`. Read the
  current pose from a ref the controller writes to (never from React state
  per frame), apply it in `useFrame`, and render on demand
  (`frameloop="demand"`, invalidating on scroll) so nothing runs while idle.
- **Loading** — keep `ProductImageFallback` as the poster until the model's
  first frame is drawn, then remove it, so only one machine is ever visible.
  Keep it permanently for reduced motion, missing WebGL or a failed load.
- **Lighting** — one environment map and a key light; bake contact shadows
  into a plane rather than using real-time shadow maps.

Suggested dependencies at that point: `three`, `@react-three/fiber`,
`@react-three/drei`. They are not installed now because nothing would use
them.
