"use client";

import { useEffect } from "react";

const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * The section's heading rises into place, a line at a time, the first time it
 * is reached. Each line sits in a clipped box and starts just below it; this
 * only sets `data-visible`, and CSS moves them.
 *
 * Under reduced motion nothing is observed: the static rules already leave
 * the heading where it belongs.
 */
export function TechnologyReveal() {
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>("[data-tech-heading]");
    if (!heading || window.matchMedia(REDUCE).matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          heading.dataset.visible = "true";
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(heading);
    return () => io.disconnect();
  }, []);

  return null;
}
