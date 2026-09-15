import { POSES, type Pose } from "./experience-poses";

/**
 * The bridge between the scroll controller (the single owner of animated
 * values) and the WebGL scene. The controller writes here; the scene reads
 * it inside its own frame loop. A plain mutable object — no React state and
 * no allocation per frame.
 */
export const sceneState = {
  pose: { ...POSES.intro.wide } as Pose,
  /** 0–1: how much water should be flowing in the current chapter. */
  flow: 1,
  /** 0 = front photograph, 1 = angled photograph (see viewAt in lib/experience-poses.ts). */
  view: 0,
  version: 0,
};

type Listener = () => void;
const listeners = new Set<Listener>();

export function publishScene(pose: Pose, flow: number, view: number): void {
  const p = sceneState.pose;
  p.s = pose.s;
  p.fx = pose.fx;
  p.fy = pose.fy;
  p.ox = pose.ox;
  p.oy = pose.oy;
  p.yaw = pose.yaw;
  sceneState.flow = flow;
  sceneState.view = view;
  sceneState.version++;
  listeners.forEach((l) => l());
}

export function subscribeScene(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
