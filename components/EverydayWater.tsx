import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import { everydayCare, everydayDrinking, everydayIntro, type EverydayImage, type EverydayUse } from "@/lib/content";
import coffee from "@/public/lifestyle/water-for-coffee-and-tea.webp";
import cooking from "@/public/lifestyle/water-in-the-filipino-kitchen.webp";
import glass from "@/public/lifestyle/glass-of-water.webp";
import house from "@/public/lifestyle/cleaning-products-and-indoor-air.webp";
import kitchen from "@/public/lifestyle/ionizer-cleaning-cycles.webp";
import prep from "@/public/lifestyle/kitchen-water-use.webp";
import skin from "@/public/lifestyle/water-and-skin.webp";
import { DrinkLabel } from "./DrinkLabel";

const IMAGES: Record<EverydayImage, StaticImageData> = { glass, cooking, coffee, prep, skin, kitchen, house };

function Use({ item, frame, sizes, i = 0, position }: { item: EverydayUse; frame: string; sizes: string; i?: number; position?: string }) {
  return (
    <figure data-reveal style={{ "--reveal-i": i } as CSSProperties} className="flex h-full flex-col">
      <div className={`relative overflow-hidden rounded-[var(--radius-md)] bg-line ${frame}`}>
        <Image src={IMAGES[item.image]} alt={item.alt} fill sizes={sizes} className="object-cover" style={position ? { objectPosition: position } : undefined} />
      </div>
      <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span>
          <span className="block text-xl font-semibold tracking-[-0.02em] text-ink">{item.title}</span>
          <span className="mt-1 block text-[0.9375rem] text-ink-soft">{item.line}</span>
        </span>
        <span className="text-[0.8125rem] font-medium text-mute">{item.water}</span>
      </figcaption>
    </figure>
  );
}

/**
 * "More ways to use water." Two groups, set apart by a labelled rule, so a
 * cleaning water never reads as a drinking water.
 */
export function EverydayWater() {
  const [drink, cook, coffeeUse] = everydayDrinking;
  const [prepUse, beauty, kitchenUse, houseUse] = everydayCare;

  return (
    <section id="everyday-water" aria-labelledby="everyday-water-title" className="bg-white">
      <div className="container-page section-y">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-glacier">{everydayIntro.eyebrow}</p>
            <h2 id="everyday-water-title" className="type-display-md mt-5 text-ink">
              {everydayIntro.headline[0]}
              <span className="type-light text-ink-soft">{everydayIntro.headline[1]}</span>
            </h2>
          </div>
          <p className="lede max-w-md self-end text-ink-soft lg:col-span-4 lg:col-start-9">{everydayIntro.body}</p>
        </div>

        <div className="mt-16 flex items-center gap-4 lg:mt-20">
          <DrinkLabel drinkable />
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-12">
          <div className="md:col-span-5 md:row-span-2">
            <Use item={drink} frame="aspect-[4/5] md:aspect-auto md:h-full md:min-h-[520px]" sizes="(min-width: 768px) 40vw, 100vw" position="30% 50%" />
          </div>
          <div className="md:col-span-7">
            <Use item={cook} frame="aspect-[16/10]" sizes="(min-width: 768px) 56vw, 100vw" i={1} />
          </div>
          <div className="md:col-span-7">
            <Use item={coffeeUse} frame="aspect-[16/10]" sizes="(min-width: 768px) 56vw, 100vw" i={2} />
          </div>
        </div>

        <div className="mt-24 flex items-center gap-4">
          <DrinkLabel drinkable={false} />
          <span className="h-px flex-1 bg-line" />
          <span className="hidden text-[0.8125rem] text-mute sm:inline">{everydayIntro.careLabel}</span>
        </div>
        <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <Use item={prepUse} frame="aspect-[16/10]" sizes="(min-width: 768px) 56vw, 100vw" />
          </div>
          <div className="md:col-span-5 md:pt-24">
            <Use item={beauty} frame="aspect-[4/5]" sizes="(min-width: 768px) 40vw, 100vw" i={1} />
          </div>
          <div className="md:col-span-5">
            <Use item={kitchenUse} frame="aspect-[4/5]" sizes="(min-width: 768px) 40vw, 100vw" />
          </div>
          <div className="md:col-span-7 md:pt-32">
            <Use item={houseUse} frame="aspect-[16/10]" sizes="(min-width: 768px) 56vw, 100vw" i={1} />
          </div>
        </div>

        <p className="mt-16 max-w-[44rem] text-xs leading-relaxed text-mute">{everydayIntro.note}</p>
      </div>
    </section>
  );
}
