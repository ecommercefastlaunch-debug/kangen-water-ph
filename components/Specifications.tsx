import type { CSSProperties } from "react";
import { numbers, numbersNote, specGroups, specNote } from "@/lib/content";

export function Specifications() {
  return (
    <section id="specifications" aria-labelledby="specs-title" className="bg-white">
      <div className="container-page section-y">
        <p className="eyebrow text-glacier">Specifications</p>
        <h2 id="specs-title" className="type-display-md mt-5 text-ink">
          K8 by
          <span className="type-light text-ink-soft">the numbers.</span>
        </h2>

        <dl className="mt-14 grid grid-cols-2 border-t border-ink lg:mt-20 lg:grid-cols-4">
          {numbers.map((item, i) => (
            <div
              key={item.label}
              data-reveal
              style={{ "--reveal-i": i } as CSSProperties}
              className={`flex flex-col-reverse gap-4 py-8 pr-4 lg:py-10 ${i % 2 === 1 ? "border-l border-line pl-5 sm:pl-8" : ""} ${i === 2 ? "border-t border-line lg:border-t-0 lg:border-l lg:pl-8" : ""} ${i === 3 ? "border-t border-line lg:border-t-0" : ""}`}
            >
              <dt className="eyebrow text-mute">{item.label}</dt>
              <dd className="flex items-baseline gap-2 text-ink">
                <span className="text-[clamp(4.5rem,11vw,9.5rem)] font-bold leading-[0.8] tracking-[-0.06em]">
                  {item.value}
                </span>
                {item.unit ? (
                  <span className="text-[clamp(1.25rem,2.2vw,2rem)] font-light tracking-[-0.02em] text-ink-soft">
                    {item.unit}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
        <p className="max-w-3xl pb-2 text-xs leading-relaxed text-mute">{numbersNote}</p>

        <details className="disclosure mt-6 border-y border-line">
          <summary className="flex min-h-16 items-center justify-between gap-4 py-5 text-lg font-semibold tracking-[-0.01em] text-ink">
            All specifications
            <span className="disclosure-icon text-2xl font-light leading-none" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="grid gap-x-12 gap-y-10 pb-10 pt-4 md:grid-cols-2">
            {specGroups.map((group) => (
              <div key={group.title}>
                <h3 className="eyebrow text-glacier">{group.title}</h3>
                <dl className="mt-4 divide-y divide-line border-t border-line">
                  {group.rows.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[minmax(7.5rem,40%)_1fr] gap-4 py-3 text-[0.9375rem]">
                      <dt className="text-mute">{label}</dt>
                      <dd className="text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            <p className="text-sm leading-relaxed text-mute md:col-span-2">{specNote}</p>
          </div>
        </details>
      </div>
    </section>
  );
}
