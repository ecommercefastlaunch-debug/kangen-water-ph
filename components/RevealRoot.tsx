"use client";

import { useEffect } from "react";

/**
 * Subtle reveal-on-scroll for elements marked [data-reveal].
 *
 * Nothing is hidden until this runs: elements already on screen are marked
 * shown first, then <html data-motion="on"> enables the CSS that hides the
 * rest until they scroll into view. Without JavaScript, or with reduced
 * motion, everything is simply visible.
 */
export function RevealRoot() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const viewport = window.innerHeight;
    for (const el of items) {
      if (el.getBoundingClientRect().top < viewport * 0.92) el.dataset.shown = "";
    }
    document.documentElement.dataset.motion = "on";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = "";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    for (const el of items) if (!("shown" in el.dataset)) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return null;
}
