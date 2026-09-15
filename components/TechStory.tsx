"use client";

import Image from "next/image";
import { Plug, RefreshCw } from "lucide-react";
import { features, featuresIntro, languages, type FeatureVisual } from "@/lib/content";
import k8Front from "@/public/images/k8-front.png";
import { useActiveIndex, useTick } from "./hooks";
import { K8Screen } from "./K8Screen";

function Visual({ kind, active }: { kind: FeatureVisual; active: boolean }) {
  const tick = useTick(active && (kind === "wake" || kind === "languages"), 2200);

  switch (kind) {
    case "wake":
      return <K8Screen decorative mode={tick % 2 === 0 ? "sleep" : "home"} selected="9.5" className="w-[180px]" />;
    case "lcd":
      return <K8Screen decorative selected="9.5" running className="w-[180px]" />;
    case "filter":
      return <K8Screen decorative mode="filter" className="w-[180px]" />;
    case "languages":
      return <K8Screen decorative mode="languages" language={tick % languages.length} className="w-[180px]" />;
    case "voice":
      return (
        <div className="flex w-[220px] flex-col items-center text-center">
          <div aria-hidden="true" className="flex h-16 items-center gap-1.5">
            {Array.from({ length: 11 }, (_, i) => (
              <span
                key={i}
                className="block w-1.5 origin-center rounded-full bg-glacier"
                style={{
                  height: `${28 + ((i * 37) % 36)}px`,
                  animation: active ? `kw-wave 1.1s ${(i % 5) * 0.12}s var(--ease-in-out) infinite` : undefined,
                  transform: active ? undefined : "scaleY(0.35)",
                }}
              />
            ))}
          </div>
          <p className="mt-5 text-xl font-semibold tracking-[-0.02em] text-ink">&ldquo;Kangen water 9.5&rdquo;</p>
          <p className="mt-1 text-xs text-mute">Volume: high · low · off</p>
        </div>
      );
    case "voltage":
      return (
        <div className="w-[220px] text-center">
          <p className="text-[2.6rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-ink">100–240</p>
          <p className="mt-1 text-base text-mute">volts AC</p>
          <p className="mt-5 text-[1.6rem] font-semibold tracking-[-0.03em] tabular-nums text-ink">50 / 60 Hz</p>
          <p className="mt-3 text-xs text-mute">Interchangeable power cord</p>
        </div>
      );
    case "plug":
      return (
        <div className="flex w-[220px] flex-col items-center text-center">
          <Plug aria-hidden="true" size={56} strokeWidth={1.1} className="text-glacier" />
          <p className="mt-5 text-xl font-semibold tracking-[-0.02em] text-ink">No power switch</p>
          <p className="mt-1 text-xs text-mute">Running water is the signal</p>
        </div>
      );
    case "clean":
      return (
        <div className="flex w-[220px] flex-col items-center text-center">
          <RefreshCw
            aria-hidden="true"
            size={52}
            strokeWidth={1.1}
            className="text-glacier"
            style={{ animation: active ? "kw-spin 6s linear infinite" : undefined }}
          />
          <p className="mt-5 text-xl font-semibold tracking-[-0.02em] text-ink">Rinse, then drain</p>
          <p className="mt-1 text-xs text-mute">After use — automatically</p>
        </div>
      );
  }
}

/**
 * "Built to think for itself." Eight features, one at a time. On a desktop
 * the K8 stays pinned and a spotlight moves to the part each feature
 * concerns; on a phone each feature carries its own picture.
 */
export function TechStory() {
  const { active, register } = useActiveIndex(features.length);
  const f = features[active];

  return (
    <section id="features" aria-labelledby="features-title" className="bg-paper">
      <div className="container-page pt-[var(--section-y)]">
        <p className="eyebrow text-glacier">{featuresIntro.eyebrow}</p>
        <h2 id="features-title" className="type-display-md mt-5 text-ink">
          {featuresIntro.headline[0]}
          <span className="type-light text-ink-soft">{featuresIntro.headline[1]}</span>
        </h2>
      </div>

      <div className="container-page grid pb-[var(--section-y)] lg:grid-cols-12 lg:gap-x-10">
        <ol className="lg:col-span-5">
          {features.map((ft, i) => (
            <li
              key={ft.id}
              ref={register(i)}
              className="flex flex-col justify-center border-b border-line py-12 last:border-b-0 lg:min-h-[66svh] lg:border-b-0 lg:py-0"
            >
              <p className={`text-sm font-medium tabular-nums transition-colors duration-500 ${active === i ? "text-glacier" : "text-mute"}`}>
                {String(i + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")} — {ft.title}
              </p>
              <h3 className="mt-4 max-w-[16ch] text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
                {ft.statement}
              </h3>
              <p className="mt-5 max-w-[28rem] leading-relaxed text-ink-soft">{ft.detail}</p>
              <div className="mt-10 flex justify-center rounded-[var(--radius-md)] bg-ice-soft py-10 lg:hidden">
                <Visual kind={ft.visual} active />
              </div>
            </li>
          ))}
        </ol>

        <div className="hidden lg:col-span-7 lg:block" aria-hidden="true">
          <div className="sticky top-[calc(var(--header-h)+5svh)] flex h-[80svh] items-center gap-6 overflow-hidden rounded-[var(--radius-lg)] bg-[radial-gradient(70%_60%_at_38%_50%,#ffffff_0%,var(--color-ice-soft)_100%)] px-6">
            <div className="relative aspect-square w-[62%] shrink-0">
              <Image src={k8Front} alt="" sizes="40vw" className="product-feather h-full w-full object-contain mix-blend-multiply" />
              {/* The spotlight: everything outside the box is veiled. */}
              <div
                className="pointer-events-none absolute rounded-[14px] border border-glacier shadow-[0_0_0_2000px_rgb(238_245_248/0.66)] transition-all duration-[900ms] ease-[var(--ease-out)]"
                style={{ left: `${f.focus.x}%`, top: `${f.focus.y}%`, width: `${f.focus.w}%`, height: `${f.focus.h}%` }}
              />
            </div>
            <div className="relative flex h-full flex-1 items-center justify-center">
              {features.map((ft, i) => (
                <div
                  key={ft.id}
                  className={`absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-700 ease-[var(--ease-out)] ${
                    active === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                  }`}
                >
                  <Visual kind={ft.visual} active={active === i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
