import Image from "next/image";
import { hero } from "@/lib/content";
import k8Front from "@/public/images/k8-front.png";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-[var(--header-h)]">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="container-page relative grid items-center gap-x-8 pb-10 pt-4 lg:min-h-[calc(100svh-var(--header-h)-7.5rem)] lg:grid-cols-12 lg:py-6">
        <div className="hero-copy order-2 lg:order-1 lg:col-span-6 xl:col-span-5">
          <p className="eyebrow text-glacier">{hero.label}</p>
          <h1 id="hero-title" className="type-display mt-5 text-ink">
            {hero.headline[0]}
            <span className="type-light text-ink-soft">{hero.headline[1]}</span>
          </h1>
          <p className="lede mt-7 max-w-[30rem] text-ink-soft">{hero.body}</p>
        </div>

        <div className="hero-product relative order-1 mx-auto w-full max-w-[26rem] mix-blend-multiply sm:max-w-[34rem] lg:order-2 lg:col-span-6 lg:max-w-none xl:col-span-7">
          <Image
            src={k8Front}
            alt="The Enagic LeveLuk K8, front view: a white countertop unit with a flexible outlet pipe on top and a tall touch display on its front panel."
            priority
            sizes="(min-width: 1280px) 50vw, (min-width: 1024px) 48vw, (min-width: 640px) 34rem, 92vw"
            className="product-feather h-auto w-full"
          />
        </div>
      </div>

      <div className="container-page relative">
        <dl className="grid grid-cols-2 border-t border-line sm:grid-cols-4">
          {hero.facts.map((fact, i) => (
            <div
              key={fact.label}
              className={`flex flex-col-reverse gap-2 py-6 sm:py-7 ${i % 2 === 1 ? "pl-5 sm:pl-6" : ""} ${i > 0 ? "sm:border-l sm:border-line sm:pl-6" : ""} ${i === 1 || i === 3 ? "border-l border-line" : ""}`}
            >
              <dt className="eyebrow text-mute">{fact.label}</dt>
              <dd className="text-[1.75rem] font-semibold leading-none tracking-[-0.03em] text-ink sm:text-[2.25rem]">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
