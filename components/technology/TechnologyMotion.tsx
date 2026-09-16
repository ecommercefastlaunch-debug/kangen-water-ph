"use client";

import { useEffect } from "react";
import { screenHtml } from "@/lib/technology-markup";

const REDUCE = "(prefers-reduced-motion: reduce)";
/** How long each of the two moving screens holds before it changes. */
const CYCLE_MS = 2200;

/**
 * The section's behaviour, ported from the owner's export: the feature in
 * the middle of the screen becomes the current one — its number takes the
 * accent colour, the spotlight moves to the part of the machine it is about,
 * and the picture beside it changes — while each feature also rises in as it
 * arrives. Two of the pictures keep moving on their own: the display wakes
 * and sleeps, and the language list steps through the languages.
 *
 * Nothing here runs before it is needed: with JavaScript off the section is
 * simply all there, and under reduced motion the pictures stop cycling.
 */
export function TechnologyMotion() {
  useEffect(() => {
    const root = document.getElementById("technology");
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(".k8t-item"));
    const stageVisuals = Array.from(root.querySelectorAll<HTMLElement>(".k8t-stage .k8t-visual"));
    const spot = root.querySelector<HTMLElement>(".k8t-spot");
    if (!items.length) return;

    // Only now that this is running do the items start out of view and rise in.
    root.classList.add("k8t-js");

    const activate = (index: number) => {
      items.forEach((item, i) => item.classList.toggle("is-active", i === index));
      stageVisuals.forEach((visual, i) => visual.classList.toggle("is-active", i === index));
      const box = (items[index].dataset.spot || "").split(",");
      if (spot && box.length === 4) {
        spot.style.left = box[0];
        spot.style.top = box[1];
        spot.style.width = box[2];
        spot.style.height = box[3];
      }
    };

    const current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activate(items.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-inview");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const item of items) {
      current.observe(item);
      reveal.observe(item);
    }

    // The two pictures that keep moving while they are the one on show.
    let timer: number | undefined;
    if (!window.matchMedia(REDUCE).matches) {
      let asleep = true;
      let language = 0;
      timer = window.setInterval(() => {
        asleep = !asleep;
        language = (language + 1) % 8;
        for (const slot of root.querySelectorAll<HTMLElement>('[data-visual="wake"]')) {
          slot.innerHTML = screenHtml(asleep ? "sleep" : "home", false, 1);
        }
        for (const slot of root.querySelectorAll<HTMLElement>('[data-visual="languages"]')) {
          slot.innerHTML = screenHtml("languages", false, language);
        }
      }, CYCLE_MS);
    }

    return () => {
      current.disconnect();
      reveal.disconnect();
      if (timer) window.clearInterval(timer);
      root.classList.remove("k8t-js");
    };
  }, []);

  return null;
}
