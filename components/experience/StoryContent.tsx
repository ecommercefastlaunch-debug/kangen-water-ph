import type { ReactNode } from "react";
import { waters } from "@/lib/content";
import { chapters, storyCopy } from "@/lib/experience-chapters";
import { CellSchematic } from "../CellSchematic";
import { DrinkLabel } from "../DrinkLabel";

const MAIN = "lg:col-span-4";
const SIDE = "hidden lg:col-span-3 lg:col-start-10 lg:block";

const PH_MIN = 2;
const PH_MAX = 12;
const toPercent = (ph: number) => ((ph - PH_MIN) / (PH_MAX - PH_MIN)) * 100;

/**
 * One chapter's copy. Chapters are stacked in the same place on the pinned
 * stage and cross-faded by the scroll controller; all of them stay in the
 * document, in order, for screen readers and search engines.
 */
function Frame({ index, id, children }: { index: number; id: string; children: ReactNode }) {
  return (
    <div data-chapter={index} data-first={index === 0 ? "" : undefined} id={`chapter-${id}`} className="chapter">
      <div className="container-page w-full lg:grid lg:grid-cols-12 lg:items-center lg:gap-8">{children}</div>
    </div>
  );
}

function Headline({ as: Tag = "h2", lines, size = "story-display" }: { as?: "h1" | "h2"; lines: readonly string[]; size?: string }) {
  return (
    <Tag className={`${size} text-ink`}>
      {lines[0]}
      <span className="type-light text-ink-soft">{lines[1]}</span>
    </Tag>
  );
}

function SideList({ items, heading }: { items: readonly (readonly [string, string])[]; heading?: string }) {
  return (
    <dl className="border-t border-ink/15">
      {heading ? <p className="eyebrow pt-4 text-mute">{heading}</p> : null}
      {items.map(([title, body]) => (
        <div key={title} className="border-b border-ink/10 py-4">
          <dt className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink">{title}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Small horizontal pH bar for compact screens (the wide layout has one shared scale). */
function PhBar({ values }: { values: number[] }) {
  return (
    <div className="mt-4 lg:hidden" aria-hidden="true">
      <div className="ph-bar relative h-1.5 rounded-full">
        {values.map((ph) => (
          <span
            key={ph}
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink"
            style={{ left: `${toPercent(ph)}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[0.6875rem] text-mute">
        <span>pH 2 · acidic</span>
        <span>alkaline · 12</span>
      </div>
    </div>
  );
}

export function StoryContent() {
  const c = storyCopy;

  return (
    <div className="chapters">
      {chapters.map((chapter, index) => {
        switch (chapter.kind) {
          case "intro":
            return (
              <Frame key={chapter.id} index={index} id={chapter.id}>
                <div className={MAIN}>
                  <p className="eyebrow text-glacier">{c.intro.label}</p>
                  <div className="mt-4">
                    <Headline as="h1" lines={c.intro.headline} size="story-display story-display-xl" />
                  </div>
                  <p className="story-body mt-5">{c.intro.body}</p>
                </div>
                <dl className="hidden gap-x-6 gap-y-7 border-t border-ink/15 pt-6 lg:col-span-3 lg:col-start-10 lg:grid lg:grid-cols-2">
                  {c.intro.facts.map(([value, label]) => (
                    <div key={label} className="flex flex-col-reverse gap-1.5">
                      <dt className="eyebrow text-mute">{label}</dt>
                      <dd className="text-[1.9rem] font-semibold leading-none tracking-[-0.03em] text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Frame>
            );

          case "statement":
            return (
              <Frame key={chapter.id} index={index} id={chapter.id}>
                <div className={MAIN}>
                  <Headline lines={c.statement.headline} />
                  <p className="story-body mt-5">{c.statement.body}</p>
                </div>
                <div className={`${SIDE} space-y-5`}>
                  <div className="space-y-2">
                    <DrinkLabel drinkable />
                    <p className="text-sm text-ink-soft">{c.statement.drinking}</p>
                  </div>
                  <div className="space-y-2">
                    <DrinkLabel drinkable={false} />
                    <p className="text-sm text-ink-soft">{c.statement.notDrinking}</p>
                  </div>
                </div>
              </Frame>
            );

          case "water": {
            const w = waters.find((x) => x.id === chapter.waterId)!;
            const waterNumber = chapters.slice(0, index + 1).filter((c) => c.kind === "water").length;
            return (
              <Frame key={chapter.id} index={index} id={chapter.id}>
                <div className={MAIN}>
                  <p className="eyebrow text-mute">
                    {c.watersEyebrow} · <span className="tabular-nums">{String(waterNumber).padStart(2, "0")} / 05</span>
                  </p>
                  <h3 className="story-title mt-3 text-ink">{w.name}</h3>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="text-lg font-medium tabular-nums text-ink-soft">{w.ph}</span>
                    <DrinkLabel drinkable={w.drinkable} />
                  </div>
                  <p className="story-body mt-4">
                    {w.summary} <span className="lg:hidden">{w.uses.join(" · ")}.</span>
                  </p>
                  <ul className="mt-4 hidden border-t border-ink/10 lg:block">
                    {w.uses.map((use) => (
                      <li key={use} className="border-b border-ink/10 py-2.5 text-[0.9375rem] text-ink">
                        {use}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 hidden text-sm leading-relaxed text-mute lg:block">
                    {w.outlet}
                    {w.note ? <> {w.note}</> : null}
                  </p>
                  <PhBar values={w.phValues} />
                </div>
              </Frame>
            );
          }

          case "power":
            return (
              <Frame key={chapter.id} index={index} id={chapter.id}>
                <div className={MAIN}>
                  <p className="eyebrow text-glacier">{c.power.eyebrow}</p>
                  <div className="mt-4">
                    <Headline lines={c.power.headline} />
                  </div>
                  <p className="story-body mt-5">{c.power.body}</p>
                  <p className="mt-3 text-sm text-mute lg:hidden">{c.power.compact}</p>
                </div>
                <div className={SIDE}>
                  <SideList items={c.power.points} />
                  <figure className="mt-6 w-[11rem] rounded-[var(--radius-md)] bg-white/80 p-3">
                    <CellSchematic className="h-auto w-full" />
                    <figcaption className="mt-2 text-[0.6875rem] leading-snug text-mute">{c.power.caption}</figcaption>
                  </figure>
                </div>
              </Frame>
            );

          case "control":
            return (
              <Frame key={chapter.id} index={index} id={chapter.id}>
                <div className={MAIN}>
                  <p className="eyebrow text-glacier">{c.control.eyebrow}</p>
                  <div className="mt-4">
                    <Headline lines={c.control.headline} />
                  </div>
                  <p className="story-body mt-5">{c.control.body}</p>
                  <p className="mt-3 text-sm text-mute lg:hidden">{c.control.compact}</p>
                </div>
                <div className={SIDE}>
                  <SideList items={c.control.points} />
                  <p className="mt-4 text-[0.6875rem] leading-snug text-mute">{c.control.caption}</p>
                </div>
              </Frame>
            );

          case "ownership":
            return (
              <Frame key={chapter.id} index={index} id={chapter.id}>
                <div className={MAIN}>
                  <p className="eyebrow text-glacier">{c.ownership.eyebrow}</p>
                  <div className="mt-4">
                    <Headline lines={c.ownership.headline} />
                  </div>
                  <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 lg:mt-7 lg:block lg:border-t lg:border-ink/15">
                    {c.ownership.groups.slice(0, 2).map(([title, body]) => (
                      <div key={title} className="lg:border-b lg:border-ink/10 lg:py-4">
                        <dt className="text-[0.9375rem] font-semibold text-ink">{title}</dt>
                        <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className={SIDE}>
                  <SideList items={c.ownership.groups.slice(2)} />
                </div>
              </Frame>
            );

          case "final":
            return (
              <Frame key={chapter.id} index={index} id={chapter.id}>
                <div className={MAIN}>
                  <Headline lines={c.final.headline} />
                  <p className="story-body mt-5">{c.final.body}</p>
                </div>
              </Frame>
            );
        }
      })}

      {/* Compact screens: a soft backing so copy stays readable if the product is enlarged behind it. */}
      <div className="chapters-scrim" aria-hidden="true" />

      {/* Wide screens: one pH scale for all five waters; its band moves between settings. */}
      <div className="ph-layer" data-ph-scale aria-hidden="true">
        <div className="container-page grid h-full grid-cols-12 items-center gap-8">
          <div className="col-span-2 col-start-11 flex h-[50svh] gap-4">
            <div className="relative w-10">
              <div className="ph-scale absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 rounded-full" />
              {[2, 4, 7, 10, 12].map((ph) => (
                <span
                  key={ph}
                  className="absolute -left-1 translate-y-1/2 text-[0.6875rem] font-medium tabular-nums text-mute"
                  style={{ bottom: `${toPercent(ph)}%` }}
                >
                  {ph}
                </span>
              ))}
              <span data-ph-band className="ph-band absolute left-1/2 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-ink shadow-md" />
            </div>
            <div className="flex flex-col justify-between text-[0.6875rem] text-mute">
              <span>Alkaline</span>
              <span>Neutral</span>
              <span>Acidic</span>
            </div>
          </div>
        </div>
        <p className="container-page absolute inset-x-0 bottom-6 text-right text-[0.6875rem] text-mute">{c.watersFootnote}</p>
      </div>
    </div>
  );
}
