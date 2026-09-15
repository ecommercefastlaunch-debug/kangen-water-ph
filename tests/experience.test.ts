import { describe, expect, it } from "vitest";
import { beatsFor, chapters, totalUnits } from "@/lib/experience-chapters";
import { HOLD, layout, POSES, poseTransform, sceneAt, textState, track } from "@/lib/experience-poses";

const wide = beatsFor(true);
const units = wide.map((b) => b.units);
const { starts, total } = layout(units);

describe("timeline layout", () => {
  it("lays chapters end to end", () => {
    expect(layout([1, 2, 3])).toEqual({ starts: [0, 1, 3], total: 6 });
    expect(total).toBeCloseTo(totalUnits(true));
    expect(chapters).toHaveLength(11);
  });
});

describe("poseTransform", () => {
  it("is the identity for the intro pose, so the first frame never jumps", () => {
    expect(poseTransform(POSES.intro.wide)).toBe("translate3d(0.000%, 0.000%, 0) scale(1.0000)");
    expect(poseTransform(POSES.intro.compact)).toBe("translate3d(0.000%, 0.000%, 0) scale(1.0000)");
  });

  it("places the focus point at the requested offset", () => {
    // Zooming ×2 on the point (0.75, 0.5) with no offset moves the box left by half its width.
    expect(poseTransform({ s: 2, fx: 0.75, fy: 0.5, ox: 0, oy: 0 })).toBe("translate3d(-50.000%, 0.000%, 0) scale(2.0000)");
  });
});

describe("sceneAt", () => {
  it("holds each chapter's pose during its hold window", () => {
    wide.forEach((beat, i) => {
      const mid = starts[i] + ((HOLD.start + HOLD.end) / 2) * beat.units;
      expect(sceneAt(mid, wide, starts).pose).toEqual(beat.pose);
    });
  });

  it("clamps before the story and after it", () => {
    expect(sceneAt(-5, wide, starts).pose).toEqual(wide[0].pose);
    expect(sceneAt(total + 5, wide, starts).pose).toEqual(wide[wide.length - 1].pose);
  });

  it("moves continuously between chapters (no jumps)", () => {
    let prev = sceneAt(0, wide, starts).pose.s;
    for (let T = 0; T <= total; T += 0.01) {
      const s = sceneAt(T, wide, starts).pose.s;
      expect(Math.abs(s - prev)).toBeLessThan(0.05);
      prev = s;
    }
  });

  it("is reversible: the same position always gives the same state", () => {
    const T = starts[8] + 0.9;
    expect(sceneAt(T, wide, starts)).toEqual(sceneAt(T, wide, starts));
  });
});

describe("textState", () => {
  it("shows the first chapter at the top and keeps the last at the end", () => {
    expect(textState(0, 0, units, starts).opacity).toBe(1);
    expect(textState(0, 1, units, starts).opacity).toBe(0);
    expect(textState(total + 1, units.length - 1, units, starts).opacity).toBe(1);
  });

  it("never shows two chapters at full strength at once", () => {
    for (let T = 0; T <= total; T += 0.005) {
      const strong = units.filter((_, i) => textState(T, i, units, starts).opacity > 0.5);
      expect(strong.length).toBeLessThanOrEqual(1);
    }
  });

  it("gives every chapter a full-strength reading moment", () => {
    units.forEach((u, i) => {
      const mid = starts[i] + 0.5 * u;
      expect(textState(mid, i, units, starts).opacity).toBe(1);
    });
  });
});

describe("track", () => {
  it("interpolates tuple values such as the pH band", () => {
    type Range = readonly [number, number];
    const ranges: Range[] = [
      [8.5, 9.5],
      [7, 7],
    ];
    const mix = (a: Range, b: Range, t: number): Range => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const u = [1, 1];
    const s = layout(u).starts;
    expect(track(0.5, u, s, ranges, mix)).toEqual([8.5, 9.5]);
    const mid = track(1.0, u, s, ranges, mix);
    expect(mid[0]).toBeLessThan(8.5);
    expect(mid[0]).toBeGreaterThan(7);
  });
});
