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
    /** The approved K8 photograph with a transparent ground (built from public/images/k8-stage.png). */
    src: "/images/k8-stage-alpha.png",
    /** Served through the Next.js image optimiser (quality must be in next.config's allowed list). */
    texture: "/_next/image?url=%2Fimages%2Fk8-stage-alpha.png&w=1920&q=75",
    /**
     * The flexible pipe's nozzle opening, as fractions of the image box
     * (0,0 top-left): the lowest point of the pipe, measured from the
     * image's alpha channel (x 0.0821, y 0.8317 of 1254 px).
     */
    outlet: { u: 0.0821, v: 0.8317 },
    /** The photographed machine is 34.5 cm tall and fills 84.1% of the box height. */
    boxMeters: 0.345 / 0.841,
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
