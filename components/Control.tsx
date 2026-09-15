import type { CSSProperties } from "react";
import { control } from "@/lib/content";
import { ScreenDemo } from "./ScreenDemo";

/** "Control at your fingertips." — the words are server-rendered; only the demonstration is interactive. */
export function Control() {
  return (
    <section id="control" aria-labelledby="control-title" className="bg-white">
      <div className="container-page section-y">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-glacier">{control.eyebrow}</p>
            <h2 id="control-title" className="type-display-md mt-5 text-ink">
              {control.headline[0]}
              <span className="type-light text-ink-soft">{control.headline[1]}</span>
            </h2>
          </div>
          <p className="lede max-w-md self-end text-ink-soft lg:col-span-4 lg:col-start-9">{control.body}</p>
        </div>

        <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <dl className="border-t border-line lg:col-span-4">
            {control.points.map((point, i) => (
              <div key={point.title} data-reveal style={{ "--reveal-i": i } as CSSProperties} className="border-b border-line py-6">
                <dt className="text-lg font-semibold tracking-[-0.015em] text-ink">{point.title}</dt>
                <dd className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft">{point.body}</dd>
              </div>
            ))}
          </dl>
          <div className="lg:col-span-8">
            <ScreenDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
