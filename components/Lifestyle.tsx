import Image from "next/image";
import type { CSSProperties } from "react";
import { lifestyle } from "@/lib/content";
import condo from "@/public/images/home-condo-portrait.jpg";
import marble from "@/public/images/home-marble-wide.jpg";
import wall from "@/public/images/home-wall-portrait.jpg";

export function Lifestyle() {
  return (
    <section id="everyday" aria-labelledby="everyday-title" className="bg-paper">
      <div className="container-page section-y">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-glacier">{lifestyle.eyebrow}</p>
            <h2 id="everyday-title" className="type-display-md mt-5 text-ink">
              {lifestyle.headline[0]}
              <span className="type-light text-ink-soft">{lifestyle.headline[1]}</span>
            </h2>
          </div>
          <p className="lede max-w-md self-end text-ink-soft lg:col-span-4 lg:col-start-9">{lifestyle.body}</p>
        </div>

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          <figure data-reveal className="lg:col-span-8">
            <Image
              src={marble}
              alt="A LeveLuk K8 on a marble kitchen counter beneath a window, its flexible pipe arched toward the sink and its cord plugged into the wall."
              sizes="(min-width: 1024px) 64vw, 100vw"
              placeholder="blur"
              className="aspect-[16/10] h-auto w-full rounded-[var(--radius-md)] object-cover"
            />
          </figure>
          <figure data-reveal style={{ "--reveal-i": 1 } as CSSProperties} className="lg:col-span-4 lg:self-end">
            <Image
              src={condo}
              alt="A LeveLuk K8 on a condominium kitchen counter by a window, water flowing from its flexible pipe into the sink."
              sizes="(min-width: 1024px) 30vw, 100vw"
              placeholder="blur"
              className="aspect-[4/5] h-auto w-full rounded-[var(--radius-md)] object-cover"
            />
          </figure>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-6">
          <ol className="grid gap-x-8 sm:grid-cols-2 lg:col-span-7">
            {lifestyle.moments.map((moment, i) => (
              <li
                key={moment.time}
                data-reveal
                style={{ "--reveal-i": i % 2 } as CSSProperties}
                className="border-t border-ink/15 py-6"
              >
                <p className="eyebrow text-mute">{moment.time}</p>
                <p className="mt-3 text-lg leading-snug tracking-[-0.01em] text-ink">{moment.text}</p>
              </li>
            ))}
          </ol>
          <figure data-reveal className="hidden lg:col-span-4 lg:col-start-9 lg:-mt-40 lg:block">
            <Image
              src={wall}
              alt="A LeveLuk K8 on a wall shelf beside a kitchen window, its flexible pipe pouring into a black sink."
              sizes="30vw"
              placeholder="blur"
              className="aspect-[3/4] h-auto w-full rounded-[var(--radius-md)] object-cover"
            />
          </figure>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-mute">{lifestyle.caption}</p>
      </div>
    </section>
  );
}
