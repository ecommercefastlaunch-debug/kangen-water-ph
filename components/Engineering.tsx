import { engineering } from "@/lib/content";

export function Engineering() {
  return (
    <section id="engineering" aria-labelledby="engineering-title" className="bg-paper">
      <div className="container-page section-y">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow text-glacier">{engineering.eyebrow}</p>
            <h2 id="engineering-title" className="type-display mt-5 text-ink">
              {engineering.headline[0]}
              <span className="type-light text-ink-soft">{engineering.headline[1]}</span>
            </h2>
          </div>
          <div className="space-y-6 self-end lg:col-span-5 lg:col-start-8">
            {engineering.paragraphs.map((paragraph) => (
              <p key={paragraph} data-reveal className="lede text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-sm leading-relaxed text-mute sm:flex-row sm:items-baseline sm:justify-between lg:mt-24">
          <p className="max-w-2xl">{engineering.independence}</p>
          <a
            href={engineering.officialSite.href}
            className="shrink-0 font-medium text-ink underline decoration-silver underline-offset-4 hover:decoration-ink"
            rel="noopener"
          >
            {engineering.officialSite.label}
          </a>
        </div>
      </div>
    </section>
  );
}
