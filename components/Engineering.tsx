import Image from "next/image";
import type { CSSProperties } from "react";
import { engineering } from "@/lib/content";
import factory from "@/public/images/factory-ceiling.jpg";
import { K8Screen } from "./K8Screen";

type MacroId = (typeof engineering.macro)[number]["id"];

/** Stand-ins for macro photography: honest drawings, each labelled "Illustration". */
function MacroArt({ id }: { id: MacroId }) {
  if (id === "plates")
    return (
      <div className="brushed flex h-full w-full items-stretch justify-center gap-[7%] px-[16%] py-[14%]">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="plate-metal block flex-1 rounded-[2px] opacity-90" />
        ))}
      </div>
    );
  if (id === "surface")
    return (
      <div className="relative h-full w-full bg-[radial-gradient(80%_70%_at_50%_30%,#123a52_0%,#08090b_100%)]">
        <svg viewBox="0 0 200 160" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <path
              key={i}
              d={`M-10 ${40 + i * 14} C 40 ${28 + i * 14}, 80 ${54 + i * 14}, 120 ${40 + i * 14} S 190 ${30 + i * 14}, 214 ${42 + i * 14}`}
              fill="none"
              stroke="#8fd3f5"
              strokeOpacity={0.12 + i * 0.06}
              strokeWidth="0.8"
            />
          ))}
        </svg>
      </div>
    );
  if (id === "panel")
    return (
      <div className="flex h-full w-full items-start justify-center overflow-hidden bg-[#0b0d10] pt-[12%]">
        <K8Screen decorative selected="9.5" className="w-[72%]" />
      </div>
    );
  return (
    <div className="h-full w-full bg-[radial-gradient(120%_90%_at_20%_10%,#ffffff_0%,#e8ecee_42%,#b9c1c6_100%)]">
      <div className="h-full w-full rounded-tl-[38%] bg-[linear-gradient(135deg,rgb(255_255_255/0.9)_0%,rgb(255_255_255/0)_45%)] shadow-[inset_18px_18px_40px_rgb(255_255_255/0.8)]" />
    </div>
  );
}

/**
 * The manufacturer, in the page's second dark room: who makes the K8, where,
 * details of its materials, the factory, and the management-system
 * certifications Enagic lists — with their scope stated, not overstated.
 */
export function Engineering() {
  return (
    <section id="engineering" aria-labelledby="engineering-title" className="on-dark isolate overflow-hidden bg-graphite text-on-dark">
      <div className="container-page pt-[var(--section-y)]">
        <p className="eyebrow text-on-dark-mute">{engineering.eyebrow}</p>
        <h2 id="engineering-title" className="type-display mt-5 text-white">
          {engineering.headline[0]}
          <span className="type-light text-ice">{engineering.headline[1]}</span>
        </h2>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="text-[clamp(1.35rem,2vw,1.75rem)] font-medium leading-snug tracking-[-0.02em] text-white">{engineering.lead}</p>
            {engineering.paragraphs.map((p) => (
              <p key={p} data-reveal className="lede mt-6 text-on-dark-mute">
                {p}
              </p>
            ))}
          </div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 self-end border-t border-white/15 pt-10 lg:col-span-5 lg:col-start-8">
            {engineering.facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.8125rem] text-on-dark-mute">{k}</dt>
                <dd className="mt-1 text-xl font-medium tracking-[-0.02em] text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="mt-20 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {engineering.macro.map((m, i) => (
            <li key={m.id} data-reveal style={{ "--reveal-i": i } as CSSProperties}>
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-sm)] bg-[#161a1e]">
                  <MacroArt id={m.id} />
                  <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.6875rem] font-medium text-on-dark backdrop-blur">
                    Illustration
                  </span>
                </div>
                <figcaption className="mt-4">
                  <span className="block text-[0.9375rem] font-medium text-white">{m.title}</span>
                  <span className="mt-1 block text-[0.8125rem] leading-snug text-on-dark-mute">{m.caption}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <figure className="relative mt-20 h-[min(56svh,520px)] overflow-hidden">
        <Image src={factory} alt={engineering.factory.alt} fill sizes="100vw" placeholder="blur" className="object-cover object-center opacity-70" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-graphite)_0%,rgb(16_19_22/0.2)_45%,rgb(16_19_22/0.88)_100%)]" />
        <figcaption className="container-page absolute inset-x-0 bottom-0 pb-10">
          <p className="text-[clamp(2.25rem,5vw,4.5rem)] font-bold uppercase leading-none tracking-[-0.04em] text-white">
            {engineering.factory.title}
          </p>
          <p className="mt-3 text-[0.8125rem] text-on-dark-mute">{engineering.factory.caption}</p>
        </figcaption>
      </figure>

      <div className="container-page pb-[var(--section-y)] pt-16">
        <ul className="border-t border-white/30">
          {engineering.certifications.map((c) => (
            <li key={c.name} className="grid gap-x-8 gap-y-1 border-b border-white/12 py-7 sm:grid-cols-[minmax(14rem,auto)_1fr] sm:items-baseline">
              <p className="text-[clamp(1.6rem,2.6vw,2.25rem)] font-medium leading-none tracking-[-0.035em] text-white">{c.name}</p>
              <p className="text-[0.9375rem] text-on-dark-mute">{c.scope}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-on-dark-mute">
          {engineering.certNote}{" "}
          <a href={engineering.certSource.href} rel="noopener" className="text-on-dark underline decoration-white/30 underline-offset-4 hover:decoration-white">
            {engineering.certSource.label}
          </a>
        </p>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/12 pt-6 text-sm leading-relaxed text-on-dark-mute sm:flex-row sm:items-baseline sm:justify-between">
          <p className="max-w-2xl">{engineering.independence}</p>
          <a
            href={engineering.officialSite.href}
            rel="noopener"
            className="shrink-0 font-medium text-on-dark underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            {engineering.officialSite.label}
          </a>
        </div>
      </div>
    </section>
  );
}
