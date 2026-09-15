import * as THREE from "three";
import type { WaterSettings } from "@/lib/scene-config";

/**
 * A narrow stream of clear water leaving the nozzle.
 *
 * Lagrangian and lightweight: small "parcels" of water are emitted at the
 * outlet's world position with the outlet's world direction, then fall
 * under gravity (world −Y) on their own. The stream is a tube threaded
 * through them, rebuilt in place each frame in pre-allocated buffers.
 *
 * Because parcels keep their own positions once emitted, the stream stays
 * glued to the nozzle when the machine moves (the first point is always the
 * outlet itself) while the water already in the air carries on falling — it
 * never swings rigidly with the machine. Stopping the flow simply stops
 * emission, so the tail falls away naturally; starting it lets a thin head
 * of water drop from the nozzle.
 */

const VERTEX = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vPosV;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vNormalV = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPosV = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

// Clear water on a light ground reads through its edges (refraction darkens
// them), a bright specular line, and streaks travelling down with the flow.
const FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  uniform float uOrtho;
  varying vec3 vNormalV;
  varying vec3 vPosV;
  varying vec2 vUv;
  void main() {
    vec3 n = normalize(vNormalV);
    vec3 v = uOrtho > 0.5 ? vec3(0.0, 0.0, 1.0) : normalize(-vPosV);
    float facing = abs(dot(n, v));
    float rim = pow(1.0 - facing, 1.1);

    float s1 = sin(vUv.y * 46.0 + vUv.x * 6.2832) * 0.5 + 0.5;
    float s2 = sin(vUv.y * 19.0 - vUv.x * 12.566 + 1.7) * 0.5 + 0.5;
    float detail = s1 * s2;

    vec3 l = normalize(vec3(-0.55, 0.55, 0.65));
    float spec = pow(max(dot(reflect(-l, n), v), 0.0), 18.0);

    // A faintly cool, see-through body, darker refracted edges, a crisp highlight.
    vec3 core = vec3(0.80, 0.89, 0.94);
    vec3 edge = vec3(0.22, 0.33, 0.41);
    vec3 col = mix(core, edge, rim) + vec3(spec * 0.85 + detail * 0.06);
    float a = 0.18 + rim * 0.72 + spec * 0.5 + detail * 0.08;
    gl_FragColor = vec4(col, clamp(a, 0.0, 1.0) * uOpacity);
  }
`;

export class WaterStream {
  readonly mesh: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;

  private readonly s: WaterSettings;
  private readonly radial: number;
  private readonly max: number;

  // Parcel pool (ring buffer, newest at `start`).
  private readonly px: Float32Array;
  private readonly py: Float32Array;
  private readonly pz: Float32Array;
  private readonly vx: Float32Array;
  private readonly vy: Float32Array;
  private readonly vz: Float32Array;
  private readonly age: Float32Array;
  private readonly born: Float32Array;
  private readonly thick: Float32Array;
  /** 1 = the first parcel of a run of water: never joined to the older water below it. */
  private readonly brk: Uint8Array;
  private start = 0;
  private count = 0;

  // Centre line scratch (outlet + parcels), reused every frame.
  private readonly cx: Float32Array;
  private readonly cy: Float32Array;
  private readonly cz: Float32Array;
  private readonly cr: Float32Array;
  private readonly cv: Float32Array;
  private readonly cb: Uint8Array;
  private points = 0;

  private readonly positions: Float32Array;
  private readonly normals: Float32Array;
  private readonly uvs: Float32Array;

  private acc = 0;
  private level = 0;
  private time = 0;
  private emitting = false;
  private newRun = true;

  private readonly t = new THREE.Vector3();
  private readonly side = new THREE.Vector3();
  private readonly up = new THREE.Vector3();
  private readonly a = new THREE.Vector3();
  private readonly b = new THREE.Vector3();

  constructor(settings: WaterSettings, radialSegments: number, ortho: boolean) {
    this.s = settings;
    this.radial = radialSegments;
    this.max = settings.maxParcels;
    const m = this.max;
    this.px = new Float32Array(m);
    this.py = new Float32Array(m);
    this.pz = new Float32Array(m);
    this.vx = new Float32Array(m);
    this.vy = new Float32Array(m);
    this.vz = new Float32Array(m);
    this.age = new Float32Array(m);
    this.born = new Float32Array(m);
    this.thick = new Float32Array(m);
    this.brk = new Uint8Array(m);

    const pts = m + 1;
    this.cx = new Float32Array(pts);
    this.cy = new Float32Array(pts);
    this.cz = new Float32Array(pts);
    this.cr = new Float32Array(pts);
    this.cv = new Float32Array(pts);
    this.cb = new Uint8Array(pts);

    const verts = pts * radialSegments;
    this.positions = new Float32Array(verts * 3);
    this.normals = new Float32Array(verts * 3);
    this.uvs = new Float32Array(verts * 2);

    const index = new Uint32Array((pts - 1) * radialSegments * 6);
    let k = 0;
    for (let i = 0; i < pts - 1; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const j2 = (j + 1) % radialSegments;
        const a = i * radialSegments + j;
        const b = (i + 1) * radialSegments + j;
        const c = (i + 1) * radialSegments + j2;
        const d = i * radialSegments + j2;
        index[k++] = a;
        index[k++] = b;
        index[k++] = d;
        index[k++] = b;
        index[k++] = c;
        index[k++] = d;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute("normal", new THREE.BufferAttribute(this.normals, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute("uv", new THREE.BufferAttribute(this.uvs, 2).setUsage(THREE.DynamicDrawUsage));
    geometry.setIndex(new THREE.BufferAttribute(index, 1));
    geometry.setDrawRange(0, 0);

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: { uOpacity: { value: 1 }, uOrtho: { value: ortho ? 1 : 0 } },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 10;
    this.mesh.visible = false;
  }

  /** True while there is water on screen or still arriving. */
  get active(): boolean {
    return this.level > 0.001 || this.count > 0;
  }

  /** Number of points on the stream's centre line (the outlet counts as one). */
  get pointCount(): number {
    return this.points;
  }

  /** Centre-line point `i` (0 = at the nozzle while flowing). */
  pointAt(i: number, out: THREE.Vector3): THREE.Vector3 {
    return out.set(this.cx[i], this.cy[i], this.cz[i]);
  }

  /** Whether the tube is drawn between centre-line points `i` and `i + 1`. */
  joined(i: number): boolean {
    return this.cr[i] > 0 || this.cr[i + 1] > 0;
  }

  /**
   * The outlet has moved somewhere else at once — the stage switched to the
   * other product view. Stop emitting immediately, so the stream detaches
   * from the old nozzle and falls away; the next run starts fresh at the new
   * one and is never joined to the water still falling.
   */
  cut(): void {
    this.level = 0;
    this.emitting = false;
    this.acc = 0;
    this.newRun = true;
  }

  /** Remove all water — for a view switch while paused, when nothing may fall. */
  clear(): void {
    this.cut();
    this.count = 0;
    this.points = 0;
    this.mesh.visible = false;
    this.mesh.geometry.setDrawRange(0, 0);
  }

  /** While paused, keep the frozen stream on the nozzle by carrying it along. */
  translate(dx: number, dy: number, dz: number): void {
    for (let k = 0; k < this.count; k++) {
      const i = (this.start + k) % this.max;
      this.px[i] += dx;
      this.py[i] += dy;
      this.pz[i] += dz;
    }
  }

  /**
   * Advance by `dt` seconds and rebuild the tube.
   *
   * @param outlet        nozzle opening, world space
   * @param direction     emission direction, world space (unit)
   * @param worldPerMeter world units per metre at the current framing
   * @param target        0–1 desired flow
   * @param view          direction towards the viewer, world space (unit)
   * @param floorY        world Y below which water has left the stage
   */
  update(
    dt: number,
    outlet: THREE.Vector3,
    direction: THREE.Vector3,
    worldPerMeter: number,
    target: number,
    view: THREE.Vector3,
    floorY: number,
  ): void {
    const s = this.s;
    const max = this.max;
    const g = s.gravity * worldPerMeter;

    if (dt > 0) {
      this.time += dt;
      this.level += (target - this.level) * (1 - Math.exp(-dt / Math.max(0.01, s.fadeSeconds)));
      // Once switched off and below the emission threshold, the flow is simply off — so the loop can idle.
      if (target === 0 && this.level < 0.1) this.level = 0;

      // Everything already in the air falls under gravity, in world space.
      for (let k = 0; k < this.count; k++) {
        const i = (this.start + k) % max;
        this.vy[i] -= g * dt;
        this.px[i] += this.vx[i] * dt;
        this.py[i] += this.vy[i] * dt;
        this.pz[i] += this.vz[i] * dt;
        this.age[i] += dt;
      }

      // Emit new parcels at the nozzle, oldest of this frame first.
      // Below 10% the stream would be a hairline: stop emitting and let the tail fall away.
      this.emitting = this.level > 0.1;
      if (this.emitting) {
        this.acc += dt * s.parcelsPerSecond;
        const n = Math.floor(this.acc);
        this.acc -= n;
        const speed = s.exitSpeed * worldPerMeter;
        for (let m = n - 1; m >= 0; m--) {
          const sub = m / s.parcelsPerSecond;
          this.start = (this.start - 1 + max) % max;
          if (this.count < max) this.count++;
          const i = this.start;
          this.vx[i] = direction.x * speed;
          this.vy[i] = direction.y * speed - g * sub;
          this.vz[i] = direction.z * speed;
          this.px[i] = outlet.x + direction.x * speed * sub;
          this.py[i] = outlet.y + direction.y * speed * sub - 0.5 * g * sub * sub;
          this.pz[i] = outlet.z + direction.z * speed * sub;
          this.age[i] = sub;
          this.born[i] = this.time - sub;
          this.thick[i] = Math.min(1, this.level);
          this.brk[i] = this.newRun ? 1 : 0;
          this.newRun = false;
        }
      } else {
        this.acc = 0;
        this.newRun = true;
      }

      // Retire the oldest parcels once they have left the stage.
      while (this.count > 0) {
        const i = (this.start + this.count - 1) % max;
        if (this.age[i] > s.lifetime || this.py[i] < floorY) this.count--;
        else break;
      }
    }

    this.rebuild(outlet, worldPerMeter, view);
  }

  private rebuild(outlet: THREE.Vector3, worldPerMeter: number, view: THREE.Vector3): void {
    const s = this.s;
    const v0 = s.exitSpeed;
    let n = 0;

    if (this.emitting && this.count > 0) {
      const newest = this.start;
      this.cx[n] = outlet.x;
      this.cy[n] = outlet.y;
      this.cz[n] = outlet.z;
      this.cr[n] = this.thick[newest];
      this.cv[n] = this.time;
      this.cb[n] = 0;
      n++;
    }
    for (let k = 0; k < this.count; k++) {
      const i = (this.start + k) % this.max;
      this.cx[n] = this.px[i];
      this.cy[n] = this.py[i];
      this.cz[n] = this.pz[i];
      const speed = Math.hypot(this.vx[i], this.vy[i], this.vz[i]) / worldPerMeter;
      // Accelerating water thins out (continuity: r ∝ 1/√v).
      this.cr[n] = this.thick[i] * Math.sqrt(v0 / Math.max(v0, speed));
      this.cv[n] = this.born[i];
      this.cb[n] = this.brk[i];
      n++;
    }
    // Between two runs of water, taper both ends to nothing so no tube bridges the gap.
    for (let p = 0; p < n - 1; p++) {
      if (this.cb[p]) {
        this.cr[p] = 0;
        this.cr[p + 1] = 0;
      }
    }
    this.points = n;

    const geometry = this.mesh.geometry;
    if (n < 2) {
      this.mesh.visible = false;
      geometry.setDrawRange(0, 0);
      return;
    }

    const R = this.radial;
    const base = s.radius * worldPerMeter;
    for (let i = 0; i < n; i++) {
      const i0 = Math.max(0, i - 1);
      const i1 = Math.min(n - 1, i + 1);
      this.t.set(this.cx[i1] - this.cx[i0], this.cy[i1] - this.cy[i0], this.cz[i1] - this.cz[i0]);
      if (this.t.lengthSq() < 1e-12) this.t.set(0, -1, 0);
      this.t.normalize();
      this.side.crossVectors(this.t, view);
      if (this.side.lengthSq() < 1e-10) this.side.set(1, 0, 0);
      this.side.normalize();
      this.up.crossVectors(this.side, this.t).normalize();

      // Slight, travelling variation in thickness — tied to when the water left the nozzle.
      const born = this.cv[i];
      const wobble = 1 + 0.06 * Math.sin(born * 53) + 0.04 * Math.sin(born * 23 + 1.3);
      const r = base * this.cr[i] * wobble;

      for (let j = 0; j < R; j++) {
        const theta = (j / R) * Math.PI * 2;
        const c = Math.cos(theta);
        const sn = Math.sin(theta);
        this.a.copy(this.side).multiplyScalar(c);
        this.b.copy(this.up).multiplyScalar(sn);
        this.a.add(this.b);
        const o = (i * R + j) * 3;
        this.normals[o] = this.a.x;
        this.normals[o + 1] = this.a.y;
        this.normals[o + 2] = this.a.z;
        this.positions[o] = this.cx[i] + this.a.x * r;
        this.positions[o + 1] = this.cy[i] + this.a.y * r;
        this.positions[o + 2] = this.cz[i] + this.a.z * r;
        const u = (i * R + j) * 2;
        this.uvs[u] = j / R;
        this.uvs[u + 1] = born * 6;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.normal.needsUpdate = true;
    geometry.attributes.uv.needsUpdate = true;
    geometry.setDrawRange(0, (n - 1) * R * 6);
    this.mesh.visible = true;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
