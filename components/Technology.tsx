import type { CSSProperties } from "react";
import { technology } from "@/lib/content";

const PLATES = Array.from({ length: 8 }, (_, i) => i);

/**
 * Conceptual artwork: eight plates standing in a row, which draw apart when
 * the figure scrolls into view. Deliberately abstract — it is labelled as
 * not being an engineering drawing of the K8.
 */
function PlateStack() {
  return (
    <svg viewBox="0 0 720 560" className="h-auto w-full" role="img" aria-labelledby="plates-title">
      <title id="plates-title">Conceptual illustration of eight electrode plates standing side by side</title>
      <defs>
        <linearGradient id="plate-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f1f4f6" />
          <stop offset="45%" stopColor="#aeb7bf" />
          <stop offset="70%" stopColor="#dfe4e8" />
          <stop offset="100%" stopColor="#7f8a94" />
        </linearGradient>
        <linearGradient id="plate-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8d979f" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="cell-glow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#dcebf2" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#dcebf2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="380" cy="300" rx="340" ry="240" fill="url(#cell-glow)" />
      {PLATES.slice()
        .reverse()
        .map((i) => (
          <g key={i} className="plate" style={{ "--i": i } as CSSProperties}>
            <path d="M120 200 L270 140 L270 440 L120 500 Z" fill="url(#plate-face)" fillOpacity="0.92" />
            <path d="M270 140 L277 143 L277 443 L270 440 Z" fill="url(#plate-edge)" />
            <path d="M120 200 L270 140" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1" />
          </g>
        ))}
    </svg>
  );
}

export function Technology() {
  return (
    <section id="technology" aria-labelledby="tech-title" className="on-dark overflow-hidden bg-graphite text-on-dark">
      <div className="container-page section-y grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="eyebrow text-on-dark-mute">{technology.eyebrow}</p>
          <h2 id="tech-title" className="type-display-md mt-5 text-white">
            {technology.headline[0]}
            <span className="type-light text-ice">{technology.headline[1]}</span>
          </h2>
          <p className="lede mt-8 max-w-[30rem] text-on-dark-mute">{technology.body}</p>
          <dl className="mt-10 border-t border-white/15">
            {technology.points.map((point) => (
              <div key={point.title} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-white/15 py-5 sm:grid-cols-[10rem_1fr]">
                <dt className="text-[0.9375rem] font-semibold text-white">{point.title}</dt>
                <dd className="text-[0.9375rem] leading-relaxed text-on-dark-mute">{point.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure data-reveal className="lg:col-span-7">
          <PlateStack />
          <figcaption className="mt-4 text-center text-xs leading-relaxed text-on-dark-mute">
            {technology.caption}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
