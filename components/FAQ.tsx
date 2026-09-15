import { faqs } from "@/lib/content";

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-white">
      <div className="container-page section-y grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
            <p className="eyebrow text-glacier">Questions</p>
            <h2 id="faq-title" className="type-display-md mt-5 text-ink">
              Asked
              <span className="type-light text-ink-soft">often.</span>
            </h2>
          </div>
        </div>

        <div className="border-t border-ink lg:col-span-8">
          {faqs.map((item) => (
            <details key={item.q} className="disclosure border-b border-line">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-5 text-left text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-lg">
                {item.q}
                <span className="disclosure-icon shrink-0 text-2xl font-light leading-none text-glacier" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="max-w-[44rem] space-y-4 pb-7 pr-8 text-[0.9875rem] leading-relaxed text-ink-soft">
                {item.a.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
