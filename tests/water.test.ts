import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { photoOutletPoint } from "@/components/experience/scene/PhotoSubject";
import { WaterStream } from "@/components/experience/scene/WaterStream";
import { beatsFor, chapters } from "@/lib/experience-chapters";
import { POSES } from "@/lib/experience-poses";
import { SCENE_CONFIG } from "@/lib/scene-config";

const FPS = 60;
const view = new THREE.Vector3(0, 0, 1);
const down = new THREE.Vector3(0, -1, 0);
// Photo-mode units: CSS pixels, about 1200 px per metre at a 490 px product box.
const WPM = 1200;
const FLOOR = -2000;

function run(stream: WaterStream, seconds: number, outlet: THREE.Vector3, dir = down, target = 1) {
  for (let i = 0; i < Math.round(seconds * FPS); i++) stream.update(1 / FPS, outlet, dir, WPM, target, view, FLOOR);
}

describe("WaterStream", () => {
  it("starts exactly at the outlet opening and falls downward", () => {
    const stream = new WaterStream(SCENE_CONFIG.water, 8, true);
    const outlet = new THREE.Vector3(120, -640, 0);
    run(stream, 0.6, outlet);
    const p = new THREE.Vector3();
    expect(stream.pointCount).toBeGreaterThan(10);
    expect(stream.pointAt(0, p).distanceTo(outlet)).toBe(0);
    const last = stream.pointAt(stream.pointCount - 1, new THREE.Vector3());
    expect(last.y).toBeLessThan(outlet.y - 100);
    expect(stream.mesh.visible).toBe(true);
  });

  it("stays on the nozzle when the machine moves, without swinging rigidly", () => {
    const stream = new WaterStream(SCENE_CONFIG.water, 8, true);
    const outlet = new THREE.Vector3(120, -640, 0);
    run(stream, 0.6, outlet);
    const before = stream.pointAt(stream.pointCount - 1, new THREE.Vector3());
    outlet.x += 60; // the product shifts right between scroll poses
    stream.update(1 / FPS, outlet, down, WPM, 1, view, FLOOR);
    const head = stream.pointAt(0, new THREE.Vector3());
    const tail = stream.pointAt(stream.pointCount - 1, new THREE.Vector3());
    expect(head.x).toBe(outlet.x);
    // Water already in the air keeps its own path: the tail has not jumped 60 px sideways.
    expect(Math.abs(tail.x - before.x)).toBeLessThan(1);
  });

  it("keeps gravity pointing down in world space when the outlet tilts", () => {
    const stream = new WaterStream(SCENE_CONFIG.water, 8, true);
    const outlet = new THREE.Vector3(0, 0, 0);
    const tilted = new THREE.Vector3(1, -1, 0).normalize();
    run(stream, 0.6, outlet, tilted);
    const p = new THREE.Vector3();
    const n = stream.pointCount;
    // Horizontal travel is bounded by the exit speed; vertical travel keeps growing with gravity.
    stream.pointAt(Math.floor(n / 2), p);
    const mid = p.clone();
    stream.pointAt(n - 1, p);
    expect(p.y).toBeLessThan(mid.y);
    const slopeMid = Math.abs(mid.y) / Math.max(1, mid.x);
    const slopeEnd = Math.abs(p.y) / Math.max(1, p.x);
    expect(slopeEnd).toBeGreaterThan(slopeMid);
  });

  it("stops by letting the tail fall away", () => {
    const stream = new WaterStream(SCENE_CONFIG.water, 8, true);
    const outlet = new THREE.Vector3(0, 0, 0);
    run(stream, 0.6, outlet);
    run(stream, 0.25, outlet, down, 0);
    // Easing off: still attached, but thinner.
    expect(stream.pointAt(0, new THREE.Vector3()).y).toBe(0);
    run(stream, 1.1, outlet, down, 0);
    // Detached from the nozzle once flow has stopped…
    const head = stream.pointAt(0, new THREE.Vector3());
    expect(head.y).toBeLessThan(0);
    run(stream, 1.5, outlet, down, 0);
    // …and gone once it has left the stage.
    expect(stream.active).toBe(false);
    expect(stream.mesh.visible).toBe(false);
  });
});

describe("photo outlet calibration", () => {
  it("maps the nozzle to the same place the page image puts it", () => {
    const frame = { cx: 760, cy: 495, size: 490 };
    const p = photoOutletPoint(frame, POSES.intro.wide);
    expect(p.x).toBeCloseTo(760 + (SCENE_CONFIG.photo.outlet.u - 0.5) * 490, 5);
    expect(p.y).toBeCloseTo(495 + (SCENE_CONFIG.photo.outlet.v - 0.5) * 490, 5);
  });
});

describe("water-mode accuracy", () => {
  it("only flows in drinking-water chapters that use the flexible pipe", () => {
    const flowing = chapters.filter((c) => c.flow > 0).map((c) => c.id);
    expect(flowing).toEqual(["intro", "statement", "water-kangen", "water-clean", "ownership", "final"]);
    for (const id of ["water-beauty", "water-strong-acidic", "water-strong-kangen", "power", "control"]) {
      expect(chapters.find((c) => c.id === id)?.flow).toBe(0);
    }
    expect(beatsFor(true)).toHaveLength(chapters.length);
  });
});
