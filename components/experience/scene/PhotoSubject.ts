import * as THREE from "three";
import { poseOffset, viewLayers, type Pose } from "@/lib/experience-poses";
import { SCENE_CONFIG } from "@/lib/scene-config";
import type { FrameRect, ProductSubject } from "./types";

type ViewKey = keyof typeof SCENE_CONFIG.photo.views;

/**
 * Where a photograph's outlet sits for a given pose, in CSS pixels relative
 * to the canvas (y down). Pure, so it is unit-tested; the scene gets the
 * same point from the outlet node's world matrix.
 */
export function photoOutletPoint(
  frame: FrameRect,
  pose: Pose,
  outlet: { u: number; v: number } = SCENE_CONFIG.photo.views.front.outlet,
): { x: number; y: number } {
  const { tx, ty } = poseOffset(pose);
  const size = frame.size * pose.s;
  const cx = frame.cx + tx * frame.size;
  const cy = frame.cy + ty * frame.size;
  return { x: cx + (outlet.u - 0.5) * size, y: cy + (outlet.v - 0.5) * size };
}

/**
 * The K8 photographs, drawn flat in the scene exactly where the page images
 * sit (same box, same pose maths): the front view, and the angled view
 * layered above it once it has loaded. A `WaterOutlet` node sits at the
 * nozzle of whichever view is showing. They never rotate: photographs have
 * no sides — changing view is a crossfade between two stills.
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
  outletEpoch = 0;

  private frame: FrameRect = { cx: 0, cy: 0, size: 1 };
  private readonly geometry = new THREE.PlaneGeometry(1, 1);
  private readonly front: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private angle: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null = null;
  private outletView: ViewKey = "front";
  private view = 0;

  constructor(frontTexture: THREE.Texture) {
    this.front = this.layer(frontTexture, 1);
    this.outlet.name = SCENE_CONFIG.model.outletNode;
    this.object.add(this.outlet);
    this.placeOutlet("front");
  }

  get hasAngle(): boolean {
    return this.angle !== null;
  }

  /** Add the angled photograph once it has loaded. Until then the stage stays on the front view. */
  setAngle(texture: THREE.Texture): void {
    if (this.angle) return;
    this.angle = this.layer(texture, 2);
    this.setView(this.view);
  }

  setView(view: number): void {
    this.view = view;
    const v = this.angle ? view : 0;
    const layers = viewLayers(v);
    this.front.material.opacity = layers.front;
    this.front.visible = layers.front > 0.001;
    if (this.angle) {
      this.angle.material.opacity = layers.angle;
      this.angle.visible = layers.angle > 0.001;
    }
    // The water follows whichever photograph is the stronger one.
    const key: ViewKey = v >= 0.5 ? "angle" : "front";
    if (key !== this.outletView) {
      this.placeOutlet(key);
      this.outletEpoch++;
    }
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
    this.geometry.dispose();
    for (const mesh of [this.front, this.angle]) {
      if (!mesh) continue;
      mesh.material.map?.dispose();
      mesh.material.dispose();
    }
  }

  private layer(texture: THREE.Texture, renderOrder: number) {
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(this.geometry, material);
    mesh.renderOrder = renderOrder;
    this.object.add(mesh);
    return mesh;
  }

  private placeOutlet(key: ViewKey): void {
    const { u, v } = SCENE_CONFIG.photo.views[key].outlet;
    this.outlet.position.set(u - 0.5, 0.5 - v, 0);
    this.outletView = key;
  }
}
