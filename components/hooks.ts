"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCE = "(prefers-reduced-motion: reduce)";

function subscribeReduce(cb: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True when the visitor prefers reduced motion. False on the server. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false);
}

/**
 * Which of a list of blocks is crossing the middle of the viewport. Drives the
 * sticky sequences: the text scrolls, the visual beside it follows along.
 */
export function useActiveIndex(count: number) {
  const [active, setActive] = useState(0);
  const nodes = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = nodes.current.indexOf(e.target as HTMLElement);
          if (i !== -1) setActive(i);
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    nodes.current.slice(0, count).forEach((n) => n && io.observe(n));
    return () => io.disconnect();
  }, [count]);

  const register = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      nodes.current[i] = el;
    },
    [],
  );

  return { active, register };
}

/** Counts up every `ms` while `on` — stops under reduced motion. */
export function useTick(on: boolean, ms: number): number {
  const reduce = usePrefersReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on || reduce) return;
    const id = window.setInterval(() => setN((v) => v + 1), ms);
    return () => window.clearInterval(id);
  }, [on, ms, reduce]);
  return n;
}
