"use client";

import { useEffect } from "react";

const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * Brings each technology item in as it reaches the reading position, and
 * marks the one being read so its panel can come forward.
 *
 * It only sets `data-visible` and `data-current`; the movement itself is a
 * CSS transition. Under reduced motion nothing is observed and the section
 * stays exactly as the server rendered it — every item already readable.
 */
export function TechnologyReveal() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-tech]");
    if (!root || window.matchMedia(REDUCE).matches) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-tech-item]"));
    if (!items.length) return;

    // Reveal: once an item has been seen it stays visible, so scrolling back never empties the page.
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.visible = "true";
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.15 },
    );

    // Current: the item nearest the middle of the screen owns the panel.
    const current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.dataset.current = "true";
          else delete el.dataset.current;
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    for (const item of items) {
      reveal.observe(item);
      current.observe(item);
    }
    return () => {
      reveal.disconnect();
      current.disconnect();
    };
  }, []);

  return null;
}
