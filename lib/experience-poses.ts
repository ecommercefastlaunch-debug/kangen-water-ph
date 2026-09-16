/**
 * Poses for the persistent K8, and the pure maths that moves between them.
 *
 * Nothing here touches the DOM: the scroll controller passes in a timeline
 * position and writes the result to the page (and to the WebGL scene via
 * lib/scene-state.ts). That keeps this file unit-tested and renderer-agnostic.
 *
 * A pose frames the product: a scale `s`, and a focus point (`fx`, `fy`,
 * fractions of the product box) placed at an offset (`ox`, `oy`, fractions
 * of the box) from the stage anchor. `yaw` (radians, positive turns the
 * pipe side towards the viewer) is used only by a real 3D model — the
 * photograph is flat and never rotates.
 */

export type Pose = { s: number; fx: number; fy: number; ox: number; oy: number; yaw: number };
export type Rgb = readonly [number, number, number];
export type PoseKey = "intro" | "statement" | "waters" | "power" | "control" | "ownership" | "final";

const centre = { fx: 0.5, fy: 0.5 };

/** The touch display in the product image: centre of the dark panel. */
export const DISPLAY_FOCUS = { fx: 0.536, fy: 0.4 };

/**
 * `wide` is ≥1024px (product centred, copy in side columns); `compact` is
 * below that (product in the upper part of the screen, copy beneath).
 * The intro framing is the identity, so the server-rendered first frame and
 * the first animated frame are the same — nothing jumps on load. Yaw stays
 * between front and a gentle three-quarter view; the display close-up is
 * nearly frontal.
 */
export const POSES: Record<PoseKey, { wide: Pose; compact: Pose }> = {
  intro: {
    wide: { s: 1, ...centre, ox: 0, oy: 0, yaw: 0.22 },
    compact: { s: 1, ...centre, ox: 0, oy: 0, yaw: 0.22 },
  },
  statement: {
    wide: { s: 0.9, ...centre, ox: 0.03, oy: 0.03, yaw: 0.34 },
    compact: { s: 0.9, ...centre, ox: 0, oy: 0.03, yaw: 0.3 },
  },
  waters: {
    wide: { s: 0.94, ...centre, ox: 0, oy: 0.02, yaw: 0.26 },
    compact: { s: 0.92, ...centre, ox: 0, oy: 0.02, yaw: 0.24 },
  },
  power: {
    wide: { s: 1.16, fx: 0.5, fy: 0.56, ox: 0, oy: 0.02, yaw: 0.42 },
    compact: { s: 1.12, fx: 0.5, fy: 0.56, ox: 0, oy: 0.02, yaw: 0.36 },
  },
  // Wide: 1.38× keeps the flexible pipe clear of the left column and the Enagic mark clear of the right one.
  control: {
    wide: { s: 1.38, ...DISPLAY_FOCUS, ox: 0.12, oy: -0.02, yaw: 0.06 },
    compact: { s: 1.5, ...DISPLAY_FOCUS, ox: 0, oy: -0.03, yaw: 0.04 },
  },
  ownership: {
    wide: { s: 0.96, ...centre, ox: 0, oy: 0.02, yaw: 0.3 },
    compact: { s: 0.94, ...centre, ox: 0, oy: 0.02, yaw: 0.26 },
  },
  final: {
    wide: { s: 1.04, ...centre, ox: 0, oy: 0.01, yaw: 0.2 },
    compact: { s: 1, ...centre, ox: 0, oy: 0, yaw: 0.2 },
  },
};

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function mixPose(a: Pose, b: Pose, t: number): Pose {
  return {
    s: lerp(a.s, b.s, t),
    fx: lerp(a.fx, b.fx, t),
    fy: lerp(a.fy, b.fy, t),
    ox: lerp(a.ox, b.ox, t),
    oy: lerp(a.oy, b.oy, t),
    yaw: lerp(a.yaw, b.yaw, t),
  };
}

export function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/**
 * Where the product box's centre moves, in fractions of the box. After
 * scaling by s around the centre, the focus point sits at s·(f − ½);
 * offsetting by o − s·(f − ½) moves it to the requested place. The CSS
 * transform and the WebGL scene both use this, so they always agree.
 */
export function poseOffset(p: Pose): { tx: number; ty: number } {
  return { tx: p.ox - p.s * (p.fx - 0.5), ty: p.oy - p.s * (p.fy - 0.5) };
}

/** CSS transform for a pose, applied around the centre of the product box. */
export function poseTransform(p: Pose): string {
  const { tx, ty } = poseOffset(p);
  return `translate3d(${(tx * 100).toFixed(3)}%, ${(ty * 100).toFixed(3)}%, 0) scale(${p.s.toFixed(4)})`;
}

/* ───────────────────────────── Timeline ───────────────────────────────── */

/** A chapter's share of the timeline, measured in viewport heights of scroll. */
export type Beat = { units: number; pose: Pose; bg: Rgb };

/** Within each chapter, the product holds still between these fractions. */
export const HOLD = { start: 0.2, end: 0.74 } as const;
/** Chapter copy fades in and out over these fractions of the chapter. */
export const TEXT = { inStart: 0.02, inEnd: 0.16, outStart: 0.8, outEnd: 0.94 } as const;

export function layout(units: readonly number[]): { starts: number[]; total: number } {
  let t = 0;
  const starts = units.map((u) => {
    const s = t;
    t += u;
    return s;
  });
  return { starts, total: t };
}

/**
 * The value of a keyframed property at timeline position `T`: each chapter
 * holds its own value during its hold window, and adjacent chapters are
 * eased between. Before the first hold and after the last, values clamp.
 */
export function track<V>(
  T: number,
  units: readonly number[],
  starts: readonly number[],
  values: readonly V[],
  mix: (a: V, b: V, t: number) => V,
  ease: (t: number) => number = easeInOut,
): V {
  const n = values.length;
  // A page with no layout — a hidden or zero-sized tab — has no timeline
  // position at all. Start the story at its beginning rather than failing.
  if (!Number.isFinite(T)) return values[0];
  for (let i = 0; i < n; i++) {
    const holdStart = i === 0 ? -Infinity : starts[i] + HOLD.start * units[i];
    const holdEnd = i === n - 1 ? Infinity : starts[i] + HOLD.end * units[i];
    if (T > holdEnd) continue;
    if (T >= holdStart) return values[i];
    const prevEnd = starts[i - 1] + HOLD.end * units[i - 1];
    const t = ease(clamp((T - prevEnd) / (holdStart - prevEnd)));
    return mix(values[i - 1], values[i], t);
  }
  return values[n - 1];
}

/* ─────────────────────────── Product viewpoints ───────────────────────── */

/**
 * The stage has two still photographs of the same K8 — front and angled —
 * layered in the same box. `view` runs from 0 (front) to 1 (angled).
 *
 * A change of view happens only in the middle of the move between two
 * chapters (this fraction of it), where both chapters' copy is faint and
 * the machine is already moving — never slowly across a whole section.
 */
export const VIEW_CROSSFADE = { start: 0.25, end: 0.75 } as const;

export const viewEase = (t: number) => smoothstep(VIEW_CROSSFADE.start, VIEW_CROSSFADE.end, t);

/** The view at timeline position `T`, given each chapter's view (0 or 1). */
export function viewAt(T: number, units: readonly number[], starts: readonly number[], views: readonly number[]): number {
  return track(T, units, starts, views, lerp, viewEase);
}

/**
 * Opacity of each layer for a view mix. The angled image is drawn on top
 * and comes in before the front one goes, so where the silhouettes overlap
 * the machine never turns see-through; the double image is limited to
 * their differing edges, for a short stretch of scroll.
 */
export function viewLayers(view: number): { front: number; angle: number } {
  return { front: 1 - smoothstep(0.4, 1, view), angle: smoothstep(0, 0.6, view) };
}

export function sceneAt(T: number, beats: readonly Beat[], starts: readonly number[]): { pose: Pose; bg: Rgb } {
  const units = beats.map((b) => b.units);
  return {
    pose: track(T, units, starts, beats.map((b) => b.pose), mixPose),
    bg: track(T, units, starts, beats.map((b) => b.bg), mixRgb),
  };
}

/**
 * Visibility of chapter `i`'s copy: it rises in from below, holds, then
 * lifts away. The first chapter is already visible at the top of the page
 * and the last one stays, so the story never starts or ends on empty copy.
 */
export function textState(
  T: number,
  i: number,
  units: readonly number[],
  starts: readonly number[],
): { opacity: number; shift: number } {
  const n = units.length;
  const l = (T - starts[i]) / units[i];
  if (!Number.isFinite(l)) return { opacity: i === 0 ? 1 : 0, shift: 0 };
  if (i > 0 && l < TEXT.inEnd) {
    const t = easeInOut(clamp((l - TEXT.inStart) / (TEXT.inEnd - TEXT.inStart)));
    return { opacity: t, shift: 1 - t };
  }
  if (i < n - 1 && l > TEXT.outStart) {
    const t = easeInOut(clamp((l - TEXT.outStart) / (TEXT.outEnd - TEXT.outStart)));
    return { opacity: 1 - t, shift: -t };
  }
  return { opacity: 1, shift: 0 };
}
