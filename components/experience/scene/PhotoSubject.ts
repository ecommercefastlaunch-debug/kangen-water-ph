import * as THREE from "three";
import { poseOffset, type Pose } from "@/lib/experience-poses";
import { SCENE_CONFIG } from "@/lib/scene-config";
import type { FrameRect, ProductSubject } from "./types";

/**
 * Where the photograph's outlet sits for a given pose, in CSS pixels
 * relative to the canvas (y down). Pure, so it is unit-tested; the scene
 * gets the same point from the outlet node's world matrix.
 */
export function photoOutletPoint(frame: FrameRect, pose: Pose, outlet = SCENE_CONFIG.photo.outlet): { x: number; y: number } {
  const { tx, ty } = poseOffset(pose);
  const size = frame.size * pose.s;
  const cx = frame.cx + tx * frame.size;
  const cy = frame.cy + ty * frame.size;
  return { x: cx + (outlet.u - 0.5) * size, y: cy + (outlet.v - 0.5) * size };
}

/**
 * The approved K8 photograph, drawn flat in the scene exactly where the page
 * image sits (same box, same pose maths), with a `WaterOutlet` node at the
 * nozzle opening. It never rotates: a photograph has no sides.
 *
 * World units are CSS pixels, y up: the orthographic camera spans
 * x 0…width and y 0…−height.
 */
export class PhotoSubject implements ProductSubject {
  readonly kind = "photo" as const;
  readonly object = new THREE.Group();
  readonly camera = new THREE.OrthographicCamera(0, 1, 0, -1, -1000, 1000);
  readonly outlet = new THREE.Object3D();
  readonly outletDirection = new THREE.Vector3(0, -1, 0);
  readonly viewDirection = new THREE.Vector3(0, 0, 1);
  readonly toneMapped = false;
  worldPerMeter = 1;
  floorY = -1000;

  private frame: FrameRect = { cx: 0, cy: 0, size: 1 };
  private readonly mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

  constructor(texture: THREE.Texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    this.mesh.renderOrder = 1;
    this.object.add(this.mesh);

    const { u, v } = SCENE_CONFIG.photo.outlet;
    this.outlet.name = SCENE_CONFIG.model.outletNode;
    this.outlet.position.set(u - 0.5, 0.5 - v, 0);
    this.object.add(this.outlet);
  }

  resize(width: number, height: number, frame: FrameRect): void {
    this.camera.left = 0;
    this.camera.right = width;
    this.camera.top = 0;
    this.camera.bottom = -height;
    this.camera.updateProjectionMatrix();
    this.frame = frame;
    this.floorY = -height - 80;
  }

  applyPose(pose: Pose): void {
    const { tx, ty } = poseOffset(pose);
    const f = this.frame;
    this.object.position.set(f.cx + tx * f.size, -(f.cy + ty * f.size), 0);
    this.object.scale.setScalar(f.size * pose.s);
    this.worldPerMeter = (f.size * pose.s) / SCENE_CONFIG.photo.boxMeters;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.map?.dispose();
    this.mesh.material.dispose();
  }
}
