import type * as THREE from "three";
import type { Pose } from "@/lib/experience-poses";

/** The untransformed product box, in CSS pixels relative to the canvas. */
export type FrameRect = { cx: number; cy: number; size: number };

/**
 * What the scene needs from whatever renders the machine — the approved
 * photograph today, a real model later. Both expose a `WaterOutlet` node.
 */
export interface ProductSubject {
  readonly kind: "photo" | "model" | "dev-proxy";
  readonly object: THREE.Object3D;
  readonly camera: THREE.Camera;
  /** The nozzle opening. Its world position and direction feed the water. */
  readonly outlet: THREE.Object3D;
  /** The outlet's local emission direction (unit). */
  readonly outletDirection: THREE.Vector3;
  /** World units per metre at the current framing. */
  worldPerMeter: number;
  /** World Y below which water has left the stage. */
  floorY: number;
  /** Direction towards the viewer, world space. */
  readonly viewDirection: THREE.Vector3;
  /** Photo/ortho renders untonemapped so the photograph matches the page image exactly. */
  readonly toneMapped: boolean;
  resize(width: number, height: number, frame: FrameRect): void;
  applyPose(pose: Pose): void;
  dispose(): void;
}
