import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { PhotoSubject, photoOutletPoint } from "@/components/experience/scene/PhotoSubject";
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

  it("breaks off cleanly when the nozzle jumps to the other view", () => {
    const stream = new WaterStream(SCENE_CONFIG.water, 8, true);
    const front = new THREE.Vector3(100, -600, 0);
    run(stream, 0.6, front);
    stream.cut();
    const angled = new THREE.Vector3(260, -640, 0);
    run(stream, 0.3, angled);
    // New water leaves the new nozzle…
    expect(stream.pointAt(0, new THREE.Vector3()).distanceTo(angled)).toBe(0);
    // …and no tube joins it to the old water still falling from where the old nozzle was.
    const p = new THREE.Vector3();
    const q = new THREE.Vector3();
    let gaps = 0;
    for (let i = 0; i < stream.pointCount - 1; i++) {
      stream.pointAt(i, p);
      stream.pointAt(i + 1, q);
      if (Math.abs(p.x - q.x) > 20) {
        gaps++;
        expect(stream.joined(i)).toBe(false);
      }
    }
    expect(gaps).toBe(1);
  });

  it("clears at once when the view switches while paused", () => {
    const stream = new WaterStream(SCENE_CONFIG.water, 8, true);
    run(stream, 0.6, new THREE.Vector3(0, 0, 0));
    stream.clear();
    stream.update(0, new THREE.Vector3(200, 0, 0), down, WPM, 1, view, FLOOR);
    expect(stream.pointCount).toBe(0);
    expect(stream.mesh.visible).toBe(false);
  });
});

describe("photo outlet calibration", () => {
  it("maps each nozzle to the same place the page image puts it", () => {
    const frame = { cx: 760, cy: 495, size: 490 };
    for (const { outlet } of Object.values(SCENE_CONFIG.photo.views)) {
      const p = photoOutletPoint(frame, POSES.intro.wide, outlet);
      expect(p.x).toBeCloseTo(760 + (outlet.u - 0.5) * 490, 5);
      expect(p.y).toBeCloseTo(495 + (outlet.v - 0.5) * 490, 5);
    }
  });

  it("attaches the water to whichever photograph is showing", () => {
    const { front, angle } = SCENE_CONFIG.photo.views;
    const subject = new PhotoSubject(new THREE.Texture());
    const at = () => subject.outlet.position;
    // No angled photograph yet: the front one stays, whatever the story asks for.
    subject.setView(1);
    expect(at().x).toBeCloseTo(front.outlet.u - 0.5);
    expect(subject.outletEpoch).toBe(0);

    subject.setAngle(new THREE.Texture());
    expect(at().x).toBeCloseTo(angle.outlet.u - 0.5);
    expect(at().y).toBeCloseTo(0.5 - angle.outlet.v);
    expect(subject.outletEpoch).toBe(1);

    subject.setView(0.3);
    expect(at().x).toBeCloseTo(front.outlet.u - 0.5);
    expect(subject.outletEpoch).toBe(2);
    subject.dispose();
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
