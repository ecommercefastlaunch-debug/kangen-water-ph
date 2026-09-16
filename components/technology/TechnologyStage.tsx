"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { TechItem } from "@/lib/content";
import front from "@/public/images/k8-stage-alpha.png";
import { TechnologyPanel } from "./TechnologyPanel";

const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * The stage beside the technology list, on wide screens: the machine with a
 * lit rectangle over the part each item is about, and the item's own
 * illustration. It stays put while the list is read — the rectangle slides
 * and resizes to the next part, and the illustrations cross-fade.
 *
 * The item nearest the middle of the screen is the current one; it is marked
 * on the row too, so its number takes the accent colour. Under reduced
 * motion the stage is hidden by CSS and each row shows its own illustration,
 * so nothing here has to run.
 */
export function TechnologyStage({ items }: { items: TechItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia(REDUCE).matches) return;
    const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-tech-row]"));
    if (!rows.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.techRow);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const row of rows) io.observe(row);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>("[data-tech-row]");
    rows.forEach((row, i) => {
      if (i === active) row.dataset.current = "true";
      else delete row.dataset.current;
    });
  }, [active]);

  const spot = items[active]?.spotlight ?? items[0].spotlight;

  return (
    <div className="tech-stage" aria-hidden="true">
      <div className="tech-stage-inner">
        <div className="tech-photo">
          <Image src={front} alt="" sizes="40vw" className="h-full w-full object-contain" />
          <span className="tech-spot" style={{ left: spot.left, top: spot.top, width: spot.width, height: spot.height }} />
        </div>
        <div className="tech-layers">
          {items.map((item, i) => (
            <div key={item.id} className="tech-layer" data-active={i === active ? "true" : undefined}>
              <TechnologyPanel panel={item.panel} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
