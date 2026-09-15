/**
 * Every calibration value for the 3D product stage, in one place.
 *
 * Two renderers share this stage:
 *
 *   photo  — the approved K8 product photograph, drawn in the same WebGL
 *            canvas as the water. It is flat and never rotates. This is what
 *            production shows while no approved 3D model exists.
 *   model  — a real GLB/glTF K8, used automatically once `modelUrl` points
 *            at an approved file. Rotates gently (pose `yaw`).
 *
 * Both expose a `WaterOutlet` node, and the water stream is attached to its
 * world position and direction every frame.
 */

export type WaterSettings = {
  /** Speed of the water as it leaves the nozzle, m/s. A visual approximation, not the K8's rated output. */
  exitSpeed: number;
  /** m/s², downward in world space. */
  gravity: number;
  /** Stream radius at the nozzle, metres. Close to the pipe tip in the photograph (its opening measures ~2.3 mm radius). */
  radius: number;
  /** Parcels emitted per second — the stream's resolution along its length. */
  parcelsPerSecond: number;
  /** Seconds a parcel lives; long enough to fall out of the stage. */
  lifetime: number;
  /** Size of the parcel pool (fixed; nothing is allocated per frame). */
  maxParcels: number;
  /** Seconds for the flow to ease on or off when chapters change. */
  fadeSeconds: number;
  /** Delay after the scene is ready before the water starts, seconds. */
  startDelay: number;
};

export type QualityTier = { maxPixelRatio: number; radialSegments: number };

export const SCENE_CONFIG = {
  /**
   * Approved K8 model. Place the file at public/models/kangen-k8.glb and set
   * this to "/models/kangen-k8.glb". Until then it stays null and production
   * uses the photograph — no request is made for a file that doesn't exist.
   */
  modelUrl: null as string | null,

  model: {
    /** Real K8 height (operation manual, EN35): 34.5 cm. The model is scaled so its bounding box has this height. */
    heightMeters: 0.345,
    /** Name of the empty node at the nozzle opening. */
    outletNode: "WaterOutlet",
    /** The WaterOutlet node's local emission direction: its local −Y axis. */
    outletDirection: [0, -1, 0] as [number, number, number],
    /** Gentle key light, from the upper left. */
    keyLight: { intensity: 1.6, position: [-0.6, 1.1, 1.2] as [number, number, number] },
    environmentIntensity: 0.9,
    camera: { fov: 26 },
  },

  photo: {
    /**
     * The two photographs on the stage — square, on transparent grounds, and
     * framed so the machine's visible height, ground line and centre of mass
     * match (scripts/product-images/prepare-angle.py). The scene draws the
     * page's own <img> elements (components/experience/ProductImageFallback.tsx),
     * so there is no second download.
     *
     * `outlet` is the flexible pipe's nozzle opening, as fractions of the
     * image box (0,0 top-left): the lowest point of the pipe, measured from
     * each image's alpha channel.
     */
    views: {
      /** public/images/k8-stage-alpha.png (1254 px): the approved front photograph. */
      front: { outlet: { u: 0.0821, v: 0.8317 } },
      /** public/images/k8-angle-alpha.png (1314 px): the angled image, from assets/product-images/k8-angle-source.png. */
      angle: { outlet: { u: 0.1838, v: 0.8813 } },
    },
    /** The photographed machine is 34.5 cm tall and fills 84.1% of the box height (in both views). */
    boxMeters: 0.345 / 0.841,
    /** If the angled photograph arrives after its chapter has begun, it fades in over this long rather than popping in. */
    lateFadeSeconds: 0.35,
  },

  water: {
    exitSpeed: 1.0,
    gravity: 9.81,
    radius: 0.003,
    parcelsPerSecond: 150,
    lifetime: 0.9,
    maxParcels: 160,
    fadeSeconds: 0.45,
    startDelay: 0.35,
  } satisfies WaterSettings,

  quality: {
    high: { maxPixelRatio: 2, radialSegments: 10 },
    low: { maxPixelRatio: 1.5, radialSegments: 7 },
  } satisfies Record<string, QualityTier>,

  /**
   * Development only: render a labelled procedural stand-in (NOT the K8) to
   * exercise the model path — camera, yaw and water attachment — before an
   * approved model exists. Never set on Vercel.
   */
  devProxy: process.env.NEXT_PUBLIC_K8_DEV_PROXY === "1",
} as const;
