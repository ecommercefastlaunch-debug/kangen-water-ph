"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { waters, watersIntro, type Water } from "@/lib/content";
import k8Front from "@/public/images/k8-front.png";
import { DrinkLabel } from "./DrinkLabel";

const PH_MIN = 2;
const PH_MAX = 12;
const toPercent = (ph: number) => ((ph - PH_MIN) / (PH_MAX - PH_MIN)) * 100;
const SCALE_LABELS = [2, 4, 7, 10, 12];

/** Horizontal scale for small screens, one per water. */
function PhBar({ water }: { water: Water }) {
  return (
    <div className="mt-7" aria-hidden="true">
      <div className="ph-bar relative h-1.5 rounded-full">
        {water.phValues.map((ph) => (
          <span
            key={ph}
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow"
            style={{ left: `${toPercent(ph)}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[0.6875rem] font-medium text-mute">
        <span>pH 2 · acidic</span>
        <span>7</span>
        <span>alkaline · 12</span>
      </div>
    </div>
  );
}

/** The pinned desktop visual: the K8, and a vertical pH scale with the active setting marked. */
function StickyVisual({ water }: { water: Water }) {
  return (
    <div className="sticky top-[calc(var(--header-h)+1.5rem)] flex h-[calc(100svh-var(--header-h)-3rem)] items-center">
      <div className="relative flex w-full items-stretch gap-8 rounded-[var(--radius-lg)] bg-white p-8 xl:p-10">
        <div className="relative w-14 shrink-0">
          <div className="ph-scale absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 rounded-full" />
          {SCALE_LABELS.map((ph) => (
            <span
              key={ph}
              className="absolute -left-1 translate-y-1/2 text-[0.6875rem] font-medium tabular-nums text-mute"
              style={{ bottom: `${toPercent(ph)}%` }}
            >
              {ph}
            </span>
          ))}
          {[0, 1, 2].map((slot) => {
            const ph = water.phValues[slot] ?? water.phValues[0];
            return (
              <span
                key={slot}
                className="ph-marker absolute left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white bg-ink shadow-md"
                style={{ bottom: `${toPercent(ph)}%`, opacity: slot < water.phValues.length ? 1 : 0 }}
              />
            );
          })}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative mx-auto w-full max-w-[26rem] flex-1">
            <Image
              src={k8Front}
              alt=""
              sizes="(min-width: 1280px) 28vw, 34vw"
              className="product-feather h-full w-full object-contain mix-blend-multiply"
            />
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
            <p className="text-lg font-semibold tracking-[-0.01em] text-ink" aria-live="polite">
              {water.name}
            </p>
            <p className="text-sm font-medium tabular-nums text-mute">{water.ph}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FiveWaters() {
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    panels.current.forEach((panel) => panel && observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  const current = waters[active];

  return (
    <section
      id="waters"
      aria-labelledby="waters-title"
      className="waters"
      style={{ "--water-tint": current.tint } as CSSProperties}
    >
      <div className="container-page section-y">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-glacier">{watersIntro.eyebrow}</p>
            <h2 id="waters-title" className="type-display-md mt-5 text-ink">
              {watersIntro.headline[0]}
              <span className="type-light text-ink-soft">{watersIntro.headline[1]}</span>
            </h2>
          </div>
          <p className="lede max-w-md self-end text-ink-soft lg:col-span-4 lg:col-start-9">{watersIntro.body}</p>
        </div>

        <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="hidden lg:col-span-6 lg:block" aria-hidden="true">
            <StickyVisual water={current} />
          </div>

          <ol className="lg:col-span-6">
            {waters.map((water, i) => (
              <li
                key={water.id}
                ref={(el) => {
                  panels.current[i] = el;
                }}
                data-index={i}
                data-active={i === active ? "" : undefined}
                className="water-panel border-t border-ink/15 py-10 sm:py-12 lg:flex lg:min-h-[76svh] lg:items-center lg:py-16"
              >
                <article aria-labelledby={`water-${water.id}`} className="w-full">
                  <p className="eyebrow tabular-nums text-mute">
                    {String(i + 1).padStart(2, "0")} / {String(waters.length).padStart(2, "0")}
                  </p>
                  <h3
                    id={`water-${water.id}`}
                    className="mt-4 text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1] tracking-[-0.035em] text-ink"
                  >
                    {water.name}
                  </h3>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="text-lg font-medium tabular-nums text-ink-soft">{water.ph}</span>
                    <DrinkLabel drinkable={water.drinkable} />
                  </div>
                  <p className="lede mt-6 max-w-[28rem] text-ink-soft">{water.summary}</p>
                  <ul className="mt-6 max-w-[28rem] divide-y divide-ink/10 border-y border-ink/10">
                    {water.uses.map((use) => (
                      <li key={use} className="py-3 text-[0.9375rem] text-ink">
                        {use}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 max-w-[28rem] text-sm leading-relaxed text-mute">
                    {water.outlet}
                    {water.note ? <> {water.note}</> : null}
                  </p>
                  <div className="lg:hidden">
                    <PhBar water={water} />
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-10 max-w-3xl border-t border-ink/15 pt-6 text-sm leading-relaxed text-mute">
          {watersIntro.footnote}
        </p>
      </div>
    </section>
  );
}
