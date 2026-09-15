/**
 * Poses for the persistent K8, and the pure maths that moves between them.
 *
 * Nothing here touches the DOM: the scroll controller passes in a timeline
 * position and writes the result to the page. That keeps this file
 * unit-tested and renderer-agnostic.
 *
 * A pose frames the product image: a scale `s`, and a focus point (`fx`,
 * `fy`, fractions of the image box) placed at an offset (`ox`, `oy`,
 * fractions of the box) from the stage anchor. The current renderer is a
 * flat product photograph, so poses only move and scale — they never rotate,
 * which would expose sides the photograph does not have. A future 3D
 * renderer can add camera fields here without changing the timeline
 * (docs/3d-model-upgrade.md).
 */

export type Pose = { s: number; fx: number; fy: number; ox: number; oy: number };
export type Rgb = readonly [number, number, number];
export type PoseKey = "intro" | "statement" | "waters" | "power" | "control" | "ownership" | "final";

const centre = { fx: 0.5, fy: 0.5 };

/** The touch display in the product image: centre of the dark panel. */
export const DISPLAY_FOCUS = { fx: 0.536, fy: 0.4 };

/**
 * `wide` is ≥1024px (product centred, copy in side columns); `compact` is
 * below that (product in the upper part of the screen, copy beneath).
 * The intro pose is the identity, so the server-rendered first frame and
 * the first animated frame are the same — nothing jumps on load.
 */
export const POSES: Record<PoseKey, { wide: Pose; compact: Pose }> = {
  intro: { wide: { s: 1, ...centre, ox: 0, oy: 0 }, compact: { s: 1, ...centre, ox: 0, oy: 0 } },
  statement: { wide: { s: 0.9, ...centre, ox: 0.03, oy: 0.03 }, compact: { s: 0.9, ...centre, ox: 0, oy: 0.03 } },
  waters: { wide: { s: 0.94, ...centre, ox: 0, oy: 0.02 }, compact: { s: 0.92, ...centre, ox: 0, oy: 0.02 } },
  power: { wide: { s: 1.16, fx: 0.5, fy: 0.56, ox: 0, oy: 0.02 }, compact: { s: 1.12, fx: 0.5, fy: 0.56, ox: 0, oy: 0.02 } },
  // Wide: 1.38× keeps the flexible pipe clear of the left column and the Enagic mark clear of the right one.
  control: { wide: { s: 1.38, ...DISPLAY_FOCUS, ox: 0.12, oy: -0.02 }, compact: { s: 1.5, ...DISPLAY_FOCUS, ox: 0, oy: -0.03 } },
  ownership: { wide: { s: 0.96, ...centre, ox: 0, oy: 0.02 }, compact: { s: 0.94, ...centre, ox: 0, oy: 0.02 } },
  final: { wide: { s: 1.04, ...centre, ox: 0, oy: 0.01 }, compact: { s: 1, ...centre, ox: 0, oy: 0 } },
};

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function mixPose(a: Pose, b: Pose, t: number): Pose {
  return {
    s: lerp(a.s, b.s, t),
    fx: lerp(a.fx, b.fx, t),
    fy: lerp(a.fy, b.fy, t),
    ox: lerp(a.ox, b.ox, t),
    oy: lerp(a.oy, b.oy, t),
  };
}

export function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/**
 * CSS transform for a pose, applied around the centre of the product box.
 * After `scale(s)` the focus point sits at s·(f − ½); translating by
 * o − s·(f − ½) moves it to the requested offset. Percentages in translate
 * are relative to the box, so this is resolution-independent.
 */
export function poseTransform(p: Pose): string {
  const tx = (p.ox - p.s * (p.fx - 0.5)) * 100;
  const ty = (p.oy - p.s * (p.fy - 0.5)) * 100;
  return `translate3d(${tx.toFixed(3)}%, ${ty.toFixed(3)}%, 0) scale(${p.s.toFixed(4)})`;
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
): V {
  const n = values.length;
  for (let i = 0; i < n; i++) {
    const holdStart = i === 0 ? -Infinity : starts[i] + HOLD.start * units[i];
    const holdEnd = i === n - 1 ? Infinity : starts[i] + HOLD.end * units[i];
    if (T > holdEnd) continue;
    if (T >= holdStart) return values[i];
    const prevEnd = starts[i - 1] + HOLD.end * units[i - 1];
    const t = easeInOut(clamp((T - prevEnd) / (holdStart - prevEnd)));
    return mix(values[i - 1], values[i], t);
  }
  return values[n - 1];
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
