import { engineering, numbersNote, specGroups, specNote } from "@/lib/content";

/**
 * Practical detail after the story: the full specification and the
 * manufacturer, as two disclosures. Text only — the product is shown once,
 * in the story above.
 */
export function ProductDetails() {
  return (
    <section id="details" aria-labelledby="details-title" className="bg-paper">
      <div className="container-page section-y">
        <p className="eyebrow text-glacier">Details</p>
        <h2 id="details-title" className="type-display-md mt-5 text-ink">
          Specifications
          <span className="type-light text-ink-soft">&amp; the maker.</span>
        </h2>

        <div className="mt-14 border-t border-ink lg:mt-16">
          <details className="disclosure border-b border-line">
            <summary className="flex min-h-16 items-center justify-between gap-4 py-5 text-lg font-semibold tracking-[-0.01em] text-ink">
              All specifications
              <span className="disclosure-icon text-2xl font-light leading-none text-glacier" aria-hidden="true">
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
              <div className="space-y-3 text-sm leading-relaxed text-mute md:col-span-2">
                <p>{specNote}</p>
                <p>{numbersNote}</p>
              </div>
            </div>
          </details>

          <details className="disclosure border-b border-line">
            <summary className="flex min-h-16 items-center justify-between gap-4 py-5 text-lg font-semibold tracking-[-0.01em] text-ink">
              The manufacturer
              <span className="disclosure-icon text-2xl font-light leading-none text-glacier" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="grid gap-10 pb-10 pt-4 lg:grid-cols-12">
              <div className="space-y-4 text-[0.9875rem] leading-relaxed text-ink-soft lg:col-span-7">
                <p className="font-medium text-ink">{engineering.lead}</p>
                {engineering.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <ul className="border-t border-line">
                  {engineering.certifications.map((cert) => (
                    <li key={cert.name} className="flex flex-wrap items-baseline justify-between gap-x-6 border-b border-line py-3">
                      <span className="font-semibold text-ink">{cert.name}</span>
                      <span className="text-sm text-mute">{cert.scope}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-mute">
                  {engineering.certNote}{" "}
                  <a href={engineering.certSource.href} rel="noopener" className="text-ink underline decoration-silver underline-offset-4 hover:decoration-ink">
                    {engineering.certSource.label}
                  </a>
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-6 self-start border-t border-line pt-6 lg:col-span-4 lg:col-start-9">
                {engineering.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[0.8125rem] text-mute">{k}</dt>
                    <dd className="mt-1 text-lg font-medium tracking-[-0.015em] text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </details>
        </div>

        <div className="mt-12 flex flex-col gap-3 text-sm leading-relaxed text-mute sm:flex-row sm:items-baseline sm:justify-between">
          <p className="max-w-2xl">{engineering.independence}</p>
          <a
            href={engineering.officialSite.href}
            rel="noopener"
            className="shrink-0 font-medium text-ink underline decoration-silver underline-offset-4 hover:decoration-ink"
          >
            {engineering.officialSite.label}
          </a>
        </div>
      </div>
    </section>
  );
}
