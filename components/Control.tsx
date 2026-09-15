import type { CSSProperties } from "react";
import { control, screenTiles } from "@/lib/content";

/**
 * A live-HTML illustration of the home-screen layout from the operation
 * manual (EN9). It is labelled as an illustration; the real display's
 * colours, icons and graphics are not reproduced.
 */
function ScreenIllustration() {
  return (
    <div
      role="img"
      aria-label="Illustration of the K8 home screen layout: six water buttons in two columns — pH 7.0 Clean, pH 9.5 Kangen, pH 6.0 Beauty, pH 9.0 Kangen, pH 2.5 Strong Acidic and pH 8.5 Kangen — above a Setting button."
      className="mx-auto w-full max-w-[19rem] rounded-[2rem] bg-graphite p-4 shadow-[0_40px_80px_-40px_rgb(16_19_22_/_0.55)]"
    >
      <div className="flex aspect-[9/16] flex-col rounded-[1.25rem] bg-[linear-gradient(180deg,#1c2a36_0%,#0d1820_100%)] p-5">
        <p className="text-center text-[0.6875rem] font-semibold tracking-[0.24em] text-on-dark">KANGEN WATER</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {screenTiles.map((tile) => (
            <div
              key={tile.ph}
              className="flex aspect-[5/4] flex-col items-center justify-center rounded-xl border border-white/15 bg-white/[0.06]"
            >
              <span className="text-lg font-semibold tabular-nums text-white">{tile.ph}</span>
              <span className="mt-1 text-[0.625rem] font-medium uppercase tracking-[0.12em] text-on-dark-mute">
                {tile.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-auto rounded-lg border border-white/20 py-2.5 text-center text-[0.6875rem] font-medium tracking-[0.14em] text-on-dark-mute">
          SETTING
        </div>
      </div>
    </div>
  );
}

export function Control() {
  return (
    <section id="control" aria-labelledby="control-title" className="bg-white">
      <div className="container-page section-y grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <figure className="order-2 lg:order-1 lg:col-span-5">
          <div className="rounded-[var(--radius-lg)] bg-[linear-gradient(160deg,var(--color-ice-soft)_0%,var(--color-ice)_100%)] px-6 py-14 sm:py-16">
            <ScreenIllustration />
          </div>
          <figcaption className="mt-4 text-xs leading-relaxed text-mute">{control.caption}</figcaption>
        </figure>

        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          <p className="eyebrow text-glacier">{control.eyebrow}</p>
          <h2 id="control-title" className="type-display-md mt-5 text-ink">
            {control.headline[0]}
            <span className="type-light text-ink-soft">{control.headline[1]}</span>
          </h2>
          <dl className="mt-12 grid gap-x-10 sm:grid-cols-2">
            {control.features.map((feature, i) => (
              <div
                key={feature.title}
                data-reveal
                style={{ "--reveal-i": i % 2 } as CSSProperties}
                className="border-t border-line py-6"
              >
                <dt className="text-base font-semibold tracking-[-0.01em] text-ink">{feature.title}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{feature.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
