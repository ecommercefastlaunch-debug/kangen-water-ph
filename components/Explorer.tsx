"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";
import { explorerIntro, hotspots } from "@/lib/content";
import k8Front from "@/public/images/k8-front.png";

/**
 * "Take a closer look." Points on the machine, and a list beside it that says
 * the same thing in words. Either one drives the other, so the list is also
 * the keyboard and screen-reader route through the section. Positions are
 * indicative; the electrolysis cell is inside the machine and is marked, not
 * drawn — its point is dashed and its text says so.
 */
export function Explorer() {
  const [active, setActive] = useState(hotspots[0].id);

  return (
    <section id="explore" aria-labelledby="explore-title" className="bg-paper">
      <div className="container-page section-y grid items-center gap-y-12 lg:grid-cols-12 lg:gap-x-12">
        <div className="relative lg:col-span-7">
          <div className="relative mx-auto aspect-square w-full max-w-[680px] overflow-hidden rounded-[var(--radius-lg)] bg-white">
            <Image
              src={k8Front}
              alt="The LeveLuk K8, front view, with its parts numbered"
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="product-feather h-full w-full object-contain p-[4%] mix-blend-multiply"
            />
            <div className="absolute inset-[4%]">
              {hotspots.map((h, i) => {
                const on = h.id === active;
                return (
                  <button
                    key={h.id}
                    type="button"
                    aria-pressed={on}
                    aria-label={`${i + 1}. ${h.label}`}
                    onClick={() => setActive(h.id)}
                    className="group absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  >
                    {on && (
                      <span
                        aria-hidden="true"
                        className="absolute h-7 w-7 rounded-full border border-glacier"
                        style={{ animation: "kw-pulse 1.8s var(--ease-out) infinite" }}
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className={`relative grid h-[20px] w-[20px] place-items-center rounded-full text-[0.625rem] font-semibold text-white shadow-[0_2px_8px_rgb(10_30_45/0.3)] transition-[transform,background-color] duration-300 ${
                        on ? "scale-125 bg-glacier" : "bg-ink/75 group-hover:scale-110"
                      } ${h.illustrative ? "outline-1 outline-offset-2 outline-dashed outline-mute" : ""}`}
                    >
                      {i + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-[680px] text-xs leading-relaxed text-mute">{explorerIntro.caption}</p>
        </div>

        <div className="lg:col-span-5">
          <p className="eyebrow text-glacier">{explorerIntro.eyebrow}</p>
          <h2 id="explore-title" className="type-display-md mt-5 text-ink">
            {explorerIntro.headline[0]}
            <span className="type-light text-ink-soft">{explorerIntro.headline[1]}</span>
          </h2>
          <ol className="mt-10 border-t border-ink/15">
            {hotspots.map((h, i) => {
              const on = h.id === active;
              return (
                <li key={h.id} className="border-b border-ink/15">
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`part-${h.id}`}
                    onClick={() => setActive(h.id)}
                    className="flex min-h-14 w-full items-center gap-4 py-3 text-left"
                  >
                    <span className={`w-6 text-[0.8125rem] tabular-nums ${on ? "text-glacier" : "text-mute"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">{h.label}</span>
                    <Plus
                      aria-hidden="true"
                      size={16}
                      strokeWidth={1.6}
                      className={`text-mute transition-transform duration-300 ${on ? "rotate-45" : ""}`}
                    />
                  </button>
                  <div
                    id={`part-${h.id}`}
                    role="region"
                    aria-label={h.label}
                    hidden={!on}
                    className="pb-5 pl-10 pr-6 text-[0.9375rem] leading-relaxed text-ink-soft"
                  >
                    {h.body}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
