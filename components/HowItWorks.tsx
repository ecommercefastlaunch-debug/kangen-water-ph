import type { CSSProperties } from "react";
import { connectCaption, steps, stepsNote } from "@/lib/content";
import { ConnectDiagram } from "./ConnectDiagram";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Simple line diagrams for each step — schematic, not product drawings. */
const icons = [
  // Diverter lever on a faucet
  <svg key="0" viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
    <path {...stroke} d="M8 14h20a6 6 0 0 1 6 6v4" />
    <rect {...stroke} x="28" y="24" width="12" height="10" rx="2" />
    <path {...stroke} d="M34 34v6M40 29h4" />
  </svg>,
  // Touch on a display
  <svg key="1" viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
    <rect {...stroke} x="14" y="5" width="20" height="36" rx="3" />
    <rect {...stroke} x="18" y="11" width="5" height="5" rx="1" />
    <rect {...stroke} x="25" y="11" width="5" height="5" rx="1" />
    <rect {...stroke} x="18" y="18" width="5" height="5" rx="1" />
    <rect {...stroke} x="25" y="18" width="5" height="5" rx="1" />
    <circle cx="27.5" cy="20.5" r="5.5" fill="currentColor" opacity="0.18" />
  </svg>,
  // Filter, then plates
  <svg key="2" viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
    <rect {...stroke} x="5" y="12" width="12" height="24" rx="6" />
    <path {...stroke} d="M17 24h6" />
    <path {...stroke} d="M26 14v20M30 14v20M34 14v20M38 14v20M42 14v20" />
  </svg>,
  // Two outlets
  <svg key="3" viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
    <path {...stroke} d="M24 6v14" />
    <path {...stroke} d="M24 20c0 8-12 8-12 18M24 20c0 8 12 8 12 18" />
    <path {...stroke} d="M8 38h8M32 38h8" />
  </svg>,
];

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="bg-paper">
      <div className="container-page section-y">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-glacier">How it works</p>
            <h2 id="how-title" className="type-display-md mt-5 text-ink">
              Four steps.
              <span className="type-light text-ink-soft">One faucet.</span>
            </h2>
          </div>
          <p className="lede max-w-md self-end text-ink-soft lg:col-span-4 lg:col-start-9">
            The K8 sits beside the sink and draws from your kitchen faucet. Choosing a water takes a lever and a touch.
          </p>
        </div>

        <figure data-reveal className="mt-14 rounded-[var(--radius-lg)] bg-ice-soft px-3 pb-6 pt-8 sm:px-10 sm:pb-8 sm:pt-12 lg:mt-20">
          <ConnectDiagram className="mx-auto h-auto w-full max-w-[860px]" />
          <figcaption className="mt-4 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink-soft">
            {connectCaption}
          </figcaption>
        </figure>

        <ol className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.n}
              data-reveal
              style={{ "--reveal-i": i } as CSSProperties}
              className="flex flex-col bg-paper p-7 sm:p-8 lg:pb-10"
            >
              <div className="flex items-start justify-between text-glacier">
                {icons[i]}
                <span className="text-sm font-medium tabular-nums text-mute">{step.n}</span>
              </div>
              <h3 className="mt-10 text-xl font-semibold tracking-[-0.02em] text-ink lg:mt-28">{step.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-mute">{stepsNote}</p>
      </div>
    </section>
  );
}
