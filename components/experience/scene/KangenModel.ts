import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { poseOffset, type Pose } from "@/lib/experience-poses";
import { SCENE_CONFIG } from "@/lib/scene-config";
import type { FrameRect, ProductSubject } from "./types";

const M = SCENE_CONFIG.model;
/** The model is framed like the photograph: the machine fills 84.1% of the product box height. */
const BOX_METERS = M.heightMeters / 0.841;

/** Loads the approved K8 model once. Meshopt compression is supported; Draco is not configured. */
export async function loadK8Model(url: string): Promise<THREE.Object3D> {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(url);
  return gltf.scene;
}

/**
 * DEVELOPMENT ONLY — a crude stand-in used to test camera framing, yaw and
 * water attachment before an approved model exists. It is NOT the K8 and is
 * never shown in production (SCENE_CONFIG.devProxy is off unless
 * NEXT_PUBLIC_K8_DEV_PROXY=1 at build time).
 */
export function buildDevProxy(): THREE.Object3D {
  const root = new THREE.Group();
  root.name = "K8 development proxy (not the product)";
  const white = new THREE.MeshStandardMaterial({ color: 0xf4f5f6, roughness: 0.35, metalness: 0 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0b0d10, roughness: 0.2, metalness: 0.1 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.33, 0.147), white);
  body.position.set(0, 0.015 + 0.165, 0);
  root.add(body);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.004), dark);
  panel.position.set(0.012, 0.23, 0.0755);
  root.add(panel);
  const connector = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.03, 20), white);
  connector.position.set(0, 0.36, 0);
  root.add(connector);

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.372, 0),
    new THREE.Vector3(-0.07, 0.4, 0.02),
    new THREE.Vector3(-0.15, 0.36, 0.05),
    new THREE.Vector3(-0.185, 0.24, 0.07),
    new THREE.Vector3(-0.19, 0.1, 0.075),
  ]);
  const hose = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.007, 12, false), white);
  root.add(hose);

  const outlet = new THREE.Object3D();
  outlet.name = M.outletNode;
  outlet.position.set(-0.19, 0.1, 0.075);
  root.add(outlet);
  return root;
}

/**
 * A real 3D K8 (or the dev proxy): normalised to the machine's real height,
 * centred on its bounding box, lit with a local room environment, and
 * framed so it occupies the same product box the photograph does. Its
 * materials are used as supplied.
 */
export class ModelSubject implements ProductSubject {
  readonly kind: "model" | "dev-proxy";
  readonly object = new THREE.Group();
  readonly camera: THREE.PerspectiveCamera;
  readonly outlet: THREE.Object3D;
  readonly outletDirection = new THREE.Vector3(...M.outletDirection).normalize();
  readonly viewDirection = new THREE.Vector3(0, 0, 1);
  readonly toneMapped = true;
  worldPerMeter = 1;
  floorY = -1;

  private readonly pivot = new THREE.Group();
  private frame: FrameRect = { cx: 0, cy: 0, size: 1 };
  private width = 1;
  private height = 1;

  constructor(root: THREE.Object3D, kind: "model" | "dev-proxy") {
    this.kind = kind;
    this.camera = new THREE.PerspectiveCamera(M.camera.fov, 1, 0.01, 20);

    // Normalise: real height, centred on the bounding box.
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const scale = size.y > 0 ? M.heightMeters / size.y : 1;
    root.scale.multiplyScalar(scale);
    box.setFromObject(root);
    const centre = box.getCenter(new THREE.Vector3());
    root.position.sub(centre);
    this.pivot.add(root);
    this.object.add(this.pivot);

    const named = root.getObjectByName(M.outletNode);
    if (named) {
      this.outlet = named;
    } else {
      // No WaterOutlet node: water can't be attached honestly, so it isn't shown.
      this.outlet = new THREE.Object3D();
      this.outlet.name = `${M.outletNode} (missing)`;
      this.outlet.visible = false;
      this.pivot.add(this.outlet);
    }
  }

  get hasOutlet(): boolean {
    return this.outlet.visible;
  }

  resize(width: number, height: number, frame: FrameRect): void {
    this.width = width;
    this.height = height;
    this.frame = frame;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  applyPose(pose: Pose): void {
    const { tx, ty } = poseOffset(pose);
    const f = this.frame;
    const tan = Math.tan(THREE.MathUtils.degToRad(M.camera.fov / 2));
    // Distance at which the product box spans f.size·s CSS pixels.
    const boxPx = Math.max(1, f.size * pose.s);
    const d = (BOX_METERS * this.height) / (2 * tan * boxPx);
    this.camera.position.set(0, 0, d);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateMatrixWorld();

    const pxPerMeter = this.height / (2 * d * tan);
    const x = f.cx + tx * f.size;
    const y = f.cy + ty * f.size;
    this.object.position.set((x - this.width / 2) / pxPerMeter, -(y - this.height / 2) / pxPerMeter, 0);
    this.object.rotation.set(0, pose.yaw, 0);
    this.floorY = -(this.height / 2) / pxPerMeter - 0.2;
    this.worldPerMeter = 1;
  }

  dispose(): void {
    this.object.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry.dispose();
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) {
        for (const value of Object.values(mat)) if (value instanceof THREE.Texture) value.dispose();
        mat.dispose();
      }
    });
  }
}
