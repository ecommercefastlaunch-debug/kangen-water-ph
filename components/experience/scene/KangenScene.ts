import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { clamp } from "@/lib/experience-poses";
import { SCENE_CONFIG, type QualityTier } from "@/lib/scene-config";
import { sceneState, subscribeScene } from "@/lib/scene-state";
import { buildDevProxy, loadK8Model, ModelSubject } from "./KangenModel";
import { PhotoSubject } from "./PhotoSubject";
import type { FrameRect, ProductSubject } from "./types";
import { WaterStream } from "./WaterStream";

export type SceneHandle = { setPaused(paused: boolean): void; dispose(): void };

/** The product photographs already on the page. The scene draws the same pixels. */
export type PageImages = { front: HTMLImageElement; angle: HTMLImageElement | null };

type Options = {
  canvas: HTMLCanvasElement;
  /** The pinned stage; rendering pauses while it is off screen. */
  stage: HTMLElement;
  /** An untransformed element with the product box's layout. */
  frame: HTMLElement;
  images: PageImages;
  quality: QualityTier;
  onReady(kind: ProductSubject["kind"]): void;
  onFail(reason: string): void;
};

// A model URL that failed once is not requested again during this visit.
let modelFailed = false;

/**
 * A texture from an image already on the page: the same file (served from
 * the cache, no second download), so exactly what the page image shows.
 * Rejects if the image fails to load.
 *
 * It decodes a fresh element for that file rather than using the page
 * image itself: a srcset image reports its size scaled by its density
 * (a 1080 px file chosen for a 900 px slot reports 900), while WebGL uploads
 * the file's real pixels — the mismatch would leave the texture empty.
 */
async function pageTexture(img: HTMLImageElement): Promise<THREE.Texture> {
  await img.decode();
  const source = new Image();
  source.src = img.currentSrc || img.src;
  await source.decode();
  const texture = new THREE.Texture(source);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

async function createSubject(images: PageImages): Promise<ProductSubject> {
  if (SCENE_CONFIG.modelUrl && !modelFailed) {
    try {
      return new ModelSubject(await loadK8Model(SCENE_CONFIG.modelUrl), "model");
    } catch {
      modelFailed = true;
    }
  }
  if (SCENE_CONFIG.devProxy) return new ModelSubject(buildDevProxy(), "dev-proxy");
  return new PhotoSubject(await pageTexture(images.front));
}

/**
 * The one WebGL canvas behind the story: the machine (photographs or model)
 * and the water, with its own frame loop.
 *
 * It renders only while the stage is on screen, the tab is visible, and
 * something is moving — water in the air, a late photograph fading in, or a
 * new pose from the scroll controller. Everything allocated here is released
 * in `dispose`.
 */
export async function createKangenScene(opts: Options): Promise<SceneHandle> {
  const { canvas, stage, frame, images, quality, onReady, onFail } = opts;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch {
    onFail("webgl-unavailable");
    return { setPaused() {}, dispose() {} };
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  let subject: ProductSubject;
  try {
    subject = await createSubject(images);
  } catch {
    renderer.dispose();
    onFail("asset-unavailable");
    return { setPaused() {}, dispose() {} };
  }
  const photo = subject instanceof PhotoSubject ? subject : null;

  const scene = new THREE.Scene();
  scene.add(subject.object);

  let pmrem: THREE.PMREMGenerator | null = null;
  let envTexture: THREE.Texture | null = null;
  if (subject.toneMapped) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    envTexture = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    scene.environment = envTexture;
    scene.environmentIntensity = SCENE_CONFIG.model.environmentIntensity;
    const key = new THREE.DirectionalLight(0xffffff, SCENE_CONFIG.model.keyLight.intensity);
    key.position.set(...SCENE_CONFIG.model.keyLight.position);
    scene.add(key);
  } else {
    renderer.toneMapping = THREE.NoToneMapping;
  }

  const water = new WaterStream(SCENE_CONFIG.water, quality.radialSegments, subject.kind === "photo");
  scene.add(water.mesh);
  const outletVisible = subject.outlet.visible;

  // ── State ───────────────────────────────────────────────────────────────
  const outletPos = new THREE.Vector3();
  const outletPrev = new THREE.Vector3();
  const outletDir = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  let raf = 0;
  let last = 0;
  let version = -1;
  let epoch = subject.outletEpoch;
  let paused = false;
  let onScreen = true;
  let startAt = 0;
  let ready = false;
  let disposed = false;
  /** When the angled photograph joined the scene (ms); −∞ = before the first frame; −1 = not yet. */
  let angleAt = -1;

  const visible = () => onScreen && document.visibilityState === "visible";
  const angleLevel = (now: number) => (angleAt === -1 ? 0 : clamp((now - angleAt) / (SCENE_CONFIG.photo.lateFadeSeconds * 1000)));

  // ── The angled photograph ───────────────────────────────────────────────
  // If the page already shows it, it joins before the first frame. If it
  // arrives later, it fades in over a moment instead of popping in. If it
  // never loads, the stage simply stays on the front view.
  if (photo && images.angle) {
    const img = images.angle;
    const addAngle = (texture: THREE.Texture, at: number) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      photo.setAngle(texture);
      angleAt = at;
      requestFrame();
    };
    if (img.complete && img.naturalWidth > 0) {
      try {
        addAngle(await pageTexture(img), -Infinity);
      } catch {}
    } else {
      pageTexture(img)
        .then((texture) => addAngle(texture, performance.now()))
        .catch(() => {});
    }
  }

  // ── Layout ──────────────────────────────────────────────────────────────
  const measure = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.maxPixelRatio));
    renderer.setSize(w, h, false);
    const c = canvas.getBoundingClientRect();
    const f = frame.getBoundingClientRect();
    const rect: FrameRect = { cx: f.left - c.left + f.width / 2, cy: f.top - c.top + f.height / 2, size: f.height };
    subject.resize(w, h, rect);
    subject.applyPose(sceneState.pose);
    requestFrame();
  };

  // ── Frame loop ──────────────────────────────────────────────────────────
  const render = (now: number) => {
    raf = 0;
    if (disposed) return;
    const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 0;
    last = now;

    if (version !== sceneState.version) {
      version = sceneState.version;
      subject.applyPose(sceneState.pose);
    }
    const level = angleLevel(now);
    const view = photo ? sceneState.view * level : 0;
    subject.setView(view);

    // The nozzle is now somewhere else: the stream breaks off rather than stretching across.
    const jumped = subject.outletEpoch !== epoch;
    if (jumped) {
      epoch = subject.outletEpoch;
      if (paused) water.clear();
      else water.cut();
    }

    subject.object.updateMatrixWorld(true);
    subject.outlet.getWorldPosition(outletPos);
    subject.outlet.getWorldQuaternion(quat);
    outletDir.copy(subject.outletDirection).applyQuaternion(quat).normalize();

    // Water flows only while one photograph is fully showing — never mid-crossfade.
    const started = now >= startAt;
    const settled = view <= 0.01 || view >= 0.99;
    const target = outletVisible && started && settled ? sceneState.flow : 0;
    if (paused) {
      if (!jumped) water.translate(outletPos.x - outletPrev.x, outletPos.y - outletPrev.y, outletPos.z - outletPrev.z);
      water.update(0, outletPos, outletDir, subject.worldPerMeter, target, subject.viewDirection, subject.floorY);
    } else {
      water.update(dt, outletPos, outletDir, subject.worldPerMeter, target, subject.viewDirection, subject.floorY);
    }
    outletPrev.copy(outletPos);

    renderer.render(scene, subject.camera);

    if (!ready) {
      ready = true;
      onReady(subject.kind);
    }
    // Keep going while water is moving (or about to start) or a photograph is fading in; otherwise wait for the next pose.
    const fading = angleAt !== -1 && level < 1;
    if (visible() && (fading || (!paused && (water.active || !started || target > 0)))) raf = requestAnimationFrame(render);
    else last = 0;
  };

  function requestFrame() {
    if (!raf && !disposed && visible()) raf = requestAnimationFrame(render);
  }

  // ── Lifecycle ───────────────────────────────────────────────────────────
  const unsubscribe = subscribeScene(requestFrame);
  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(canvas);
  resizeObserver.observe(frame);
  const io = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) requestFrame();
    },
    { threshold: 0 },
  );
  io.observe(stage);
  const onVisibility = () => {
    last = 0;
    requestFrame();
  };
  document.addEventListener("visibilitychange", onVisibility);
  const onContextLost = (e: Event) => {
    e.preventDefault();
    handle.dispose();
    onFail("context-lost");
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  startAt = performance.now() + SCENE_CONFIG.water.startDelay * 1000;
  measure();

  const handle: SceneHandle = {
    setPaused(next) {
      paused = next;
      last = 0;
      requestFrame();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      unsubscribe();
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      water.dispose();
      subject.dispose();
      envTexture?.dispose();
      pmrem?.dispose();
      renderer.dispose();
    },
  };
  return handle;
}
