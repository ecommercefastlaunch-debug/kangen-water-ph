"use client";

import { useEffect } from "react";
import { beatsFor, chapters } from "@/lib/experience-chapters";
import { layout, lerp, poseTransform, sceneAt, textState, track, viewAt, viewLayers } from "@/lib/experience-poses";
import { publishScene } from "@/lib/scene-state";

const WIDE = "(min-width: 1024px)";
const REDUCE = "(prefers-reduced-motion: reduce)";
const PH_MIN = 2;
const PH_MAX = 12;

type Range = readonly [number, number];

/**
 * The single owner of every animated property in the story.
 *
 * It reads the document's own scroll position — no scroll hijacking, no
 * snapping — converts it to a timeline position in viewport heights, and
 * writes the product transform, the crossfade between the front and angled
 * photographs, the stage colour, the chapter copy and the pH band straight
 * to the DOM. It also publishes the pose, the view and the water flow to the
 * WebGL scene (lib/scene-state.ts), which reads them in its own frame loop. React renders the story once; nothing re-renders while
 * scrolling. Every frame is computed from the absolute scroll position, so
 * reversing, fast scrolling, anchor jumps and reloading mid-page all land on
 * the right state.
 *
 * Under reduced motion it does nothing: CSS shows the static story instead.
 */
export function StoryController() {
  useEffect(() => {
    const story = document.querySelector<HTMLElement>("[data-story]");
    const pin = story?.querySelector<HTMLElement>("[data-story-pin]");
    const product = pin?.querySelector<HTMLElement>("[data-scene-product]");
    const light = pin?.querySelector<HTMLElement>("[data-scene-light]");
    const probe = pin?.querySelector<HTMLElement>("[data-vh-probe]");
    if (!story || !pin || !product || !light || !probe) return;

    const copy = Array.from(pin.querySelectorAll<HTMLElement>("[data-chapter]"));
    const phLayer = pin.querySelector<HTMLElement>("[data-ph-scale]");
    const phBand = pin.querySelector<HTMLElement>("[data-ph-band]");
    const frontImg = product.querySelector<HTMLElement>('[data-view="front"]');
    const angleImg = product.querySelector<HTMLImageElement>('img[data-view="angle"]');

    const reduce = window.matchMedia(REDUCE);
    const wide = window.matchMedia(WIDE);

    // The angled photograph joins the crossfade only once it has loaded; until then (or if it fails) the front one stays.
    let angleReady = false;

    const flows = chapters.map((c) => c.flow);
    const views = chapters.map((c) => c.view);
    const modes = [false, true].map((isWide) => {
      const beats = beatsFor(isWide);
      const units = beats.map((b) => b.units);
      return { beats, units, starts: layout(units).starts };
    });

    // Each chapter's pH range, carried forward/back into non-water chapters so the band never jumps.
    const firstWater = chapters.findIndex((c) => c.ph);
    const ranges: Range[] = [];
    let carry: Range = chapters[firstWater].ph!;
    for (const c of chapters) {
      if (c.ph) carry = c.ph;
      ranges.push(carry);
    }
    const waterIdx = chapters.flatMap((c, i) => (c.ph ? [i] : []));

    let vh = 1;
    let top = 0;
    let raf = 0;

    const measure = () => {
      vh = probe.offsetHeight || window.innerHeight;
      top = story.getBoundingClientRect().top + window.scrollY;
    };

    const write = (el: HTMLElement, prop: string, value: string) => {
      if (el.style.getPropertyValue(prop) !== value) el.style.setProperty(prop, value);
    };

    const clear = () => {
      for (const el of [product, light, ...copy]) {
        el.style.removeProperty("transform");
        el.style.removeProperty("opacity");
        el.style.removeProperty("pointer-events");
      }
      frontImg?.style.removeProperty("opacity");
      angleImg?.style.removeProperty("opacity");
      pin.style.removeProperty("--scene-bg");
      phLayer?.style.removeProperty("opacity");
      delete story.dataset.scene;
      delete pin.dataset.view;
    };

    const render = () => {
      raf = 0;
      if (reduce.matches) return;
      const { beats, units, starts } = modes[wide.matches ? 1 : 0];
      const T = (window.scrollY - top) / vh;

      const { pose, bg } = sceneAt(T, beats, starts);
      const transform = poseTransform(pose);
      write(product, "transform", transform);
      write(light, "transform", transform);
      write(pin, "--scene-bg", `rgb(${Math.round(bg[0])} ${Math.round(bg[1])} ${Math.round(bg[2])})`);

      const view = viewAt(T, units, starts, views);
      const layers = viewLayers(angleReady ? view : 0);
      if (frontImg) write(frontImg, "opacity", layers.front.toFixed(3));
      if (angleImg) write(angleImg, "opacity", layers.angle.toFixed(3));
      pin.dataset.view = view <= 0.001 ? "front" : view >= 0.999 ? "angle" : "mix";
      publishScene(pose, track(T, units, starts, flows, lerp), view);

      let phOpacity = 0;
      copy.forEach((el, i) => {
        const { opacity, shift } = textState(T, i, units, starts);
        write(el, "opacity", opacity.toFixed(3));
        write(el, "transform", shift ? `translate3d(0, ${(shift * 28).toFixed(1)}px, 0)` : "none");
        write(el, "pointer-events", opacity > 0.6 ? "auto" : "none");
        if (waterIdx.includes(i)) phOpacity = Math.max(phOpacity, opacity);
      });

      if (phLayer && phBand) {
        const [lo, hi] = track(T, units, starts, ranges, (a, b, t): Range => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]);
        const bottom = ((lo - PH_MIN) / (PH_MAX - PH_MIN)) * 100;
        const height = ((hi - lo) / (PH_MAX - PH_MIN)) * 100;
        write(phLayer, "opacity", phOpacity.toFixed(3));
        write(phBand, "bottom", `calc(${bottom.toFixed(2)}% - 8px)`);
        write(phBand, "height", `calc(${height.toFixed(2)}% + 16px)`);
      }

      story.dataset.scene = "live";
    };

    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(render);
    };
    const remeasure = () => {
      measure();
      schedule();
    };
    const onMotionChange = () => {
      if (reduce.matches) clear();
      remeasure();
    };
    const onAngleLoad = () => {
      angleReady = true;
      pin.dataset.angle = "ready";
      schedule();
    };
    const onAngleError = () => {
      pin.dataset.angle = "failed";
    };

    // An image already in the cache is complete before this runs, so check before listening.
    if (angleImg?.complete) {
      if (angleImg.naturalWidth > 0) onAngleLoad();
      else onAngleError();
    } else {
      angleImg?.addEventListener("load", onAngleLoad, { once: true });
      angleImg?.addEventListener("error", onAngleError, { once: true });
    }

    measure();
    render();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    wide.addEventListener("change", remeasure);
    reduce.addEventListener("change", onMotionChange);
    const ro = new ResizeObserver(remeasure);
    ro.observe(story);
    ro.observe(document.body);

    return () => {
      angleImg?.removeEventListener("load", onAngleLoad);
      angleImg?.removeEventListener("error", onAngleError);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      wide.removeEventListener("change", remeasure);
      reduce.removeEventListener("change", onMotionChange);
      ro.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
      clear();
    };
  }, []);

  return null;
}
