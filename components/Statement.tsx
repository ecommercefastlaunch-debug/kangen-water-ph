import { statement } from "@/lib/content";

export function Statement() {
  return (
    <section aria-labelledby="statement-title" className="statement overflow-hidden">
      <div className="container-page pb-[clamp(2.5rem,5vw,4.5rem)] pt-[var(--section-y)]">
        <h2
          id="statement-title"
          className="text-[clamp(2.75rem,10.4vw,10.5rem)] font-bold uppercase leading-[0.86] tracking-[-0.05em] text-ink"
        >
          <span className="statement-line block">{statement.lines[0]}</span>
          <span className="statement-line block font-[250] tracking-[-0.04em] text-glacier sm:pl-[0.9em]">
            {statement.lines[1]}
          </span>
        </h2>
        <p data-reveal className="lede mt-10 max-w-md text-ink-soft sm:ml-auto sm:mt-14">
          {statement.body}
        </p>
      </div>
    </section>
  );
}
