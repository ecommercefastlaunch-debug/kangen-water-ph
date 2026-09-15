"use client";

import { useEffect, useRef, useState } from "react";
import { SCENE_CONFIG } from "@/lib/scene-config";
import type { SceneHandle } from "./scene/KangenScene";

const REDUCE = "(prefers-reduced-motion: reduce)";

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function lowPower(): boolean {
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return window.matchMedia("(pointer: coarse)").matches || cores <= 4 || memory <= 4;
}

/**
 * Mounts the one WebGL canvas for the product stage, in the browser only.
 * Three.js is loaded on demand, after the page is interactive.
 *
 * The page image stays visible until the scene has drawn its first frame;
 * then the stage is marked `data-webgl="ready"` and CSS hides the image in
 * the same paint, so only one machine is ever on screen. Any failure —
 * no WebGL, a missing asset, a lost context — leaves the image in place.
 * Reduced motion never starts the scene.
 */
export function SceneMount() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<SceneHandle | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.closest<HTMLElement>("[data-story-pin]");
    const frame = stage?.querySelector<HTMLElement>("[data-scene-frame]");
    const front = stage?.querySelector<HTMLImageElement>('img[data-view="front"]');
    const angle = stage?.querySelector<HTMLImageElement>('img[data-view="angle"]') ?? null;
    if (!canvas || !stage || !frame || !front) return;

    const reduce = window.matchMedia(REDUCE);
    let cancelled = false;

    const stop = (state?: string) => {
      handleRef.current?.dispose();
      handleRef.current = null;
      if (state) stage.dataset.webgl = state;
      else delete stage.dataset.webgl;
    };

    const start = () => {
      if (reduce.matches || !webglAvailable()) return;
      stage.dataset.webgl = "loading";
      const quality = lowPower() ? SCENE_CONFIG.quality.low : SCENE_CONFIG.quality.high;
      import("./scene/KangenScene")
        .then(({ createKangenScene }) =>
          createKangenScene({
            canvas,
            stage,
            frame,
            images: { front, angle },
            quality,
            onReady(kind) {
              if (cancelled) return;
              stage.dataset.webgl = "ready";
              stage.dataset.subject = kind;
            },
            onFail() {
              stop("failed");
            },
          }),
        )
        .then((handle) => {
          if (cancelled) handle.dispose();
          else handleRef.current = handle;
        })
        .catch(() => stop("failed"));
    };

    const onMotionChange = () => {
      if (reduce.matches) stop();
      else if (!handleRef.current) start();
    };

    start();
    reduce.addEventListener("change", onMotionChange);
    return () => {
      cancelled = true;
      reduce.removeEventListener("change", onMotionChange);
      stop();
    };
  }, []);

  useEffect(() => {
    handleRef.current?.setPaused(paused);
  }, [paused]);

  return (
    <>
      <canvas ref={canvasRef} className="scene-canvas" aria-hidden="true" />
      <button type="button" className="scene-pause" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          {paused ? <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /> : <path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" />}
        </svg>
        {paused ? "Play water" : "Pause water"}
      </button>
      {SCENE_CONFIG.devProxy ? (
        <p className="scene-proxy-note">Development proxy — not the K8. Set a real model in lib/scene-config.ts.</p>
      ) : null}
    </>
  );
}
