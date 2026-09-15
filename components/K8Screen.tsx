import { Coffee, CookingPot, GlassWater, Milk, Sparkles, SprayCan } from "lucide-react";
import { languages, screenTiles, type ScreenIcon, type ScreenTile } from "@/lib/content";

const ICONS: Record<ScreenIcon, typeof Milk> = {
  bottle: Milk,
  glass: GlassWater,
  face: Sparkles,
  pot: CookingPot,
  spray: SprayCan,
  cup: Coffee,
};

export type ScreenMode = "home" | "sleep" | "languages" | "filter";

/**
 * A stylised K8 touch display, modelled on the home screen the operation
 * manual draws (EN9): the display section on top, six water buttons in two
 * columns, Setting beneath. A website illustration, not the machine's
 * software — every place it appears says so.
 *
 * Hook-free, so a Server Component can render it as a picture and a Client
 * Component can pass `onSelect` to make it a working control. Sized in
 * container units, so it reads the same at 180px wide as at 360px.
 */
export function K8Screen({
  mode = "home",
  selected,
  running = false,
  language = 1,
  onSelect,
  decorative = false,
  className = "",
}: {
  mode?: ScreenMode;
  selected?: string;
  running?: boolean;
  /** Index into `languages`, for the language screen. */
  language?: number;
  onSelect?: (tile: ScreenTile) => void;
  /** Purely pictorial — hidden from assistive technology. */
  decorative?: boolean;
  className?: string;
}) {
  const tile = screenTiles.find((t) => t.id === selected);
  const title = tile ? tile.label.toUpperCase() : "KANGEN WATER";

  return (
    // Two boxes on purpose: container units resolve against an ancestor
    // container, so the outer box is the container and the bezel is sized from it.
    <div
      className={`@container select-none ${className || "w-full"}`}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : "group"}
      aria-label={decorative ? undefined : "K8 touch display — website demonstration"}
    >
      <div className="relative aspect-[10/19] w-full rounded-[9cqw] bg-[#0a0c0f] p-[6.5cqw] shadow-[0_40px_80px_-40px_rgb(10_30_45/0.55),inset_0_0_0_1px_rgb(255_255_255/0.08)]">
        <p className="mb-[4cqw] text-center text-[5.2cqw] font-semibold tracking-[-0.02em] text-white/85">
          LeveLuk <span className="font-medium text-[#6fb8e6]">K8</span>
        </p>

        <div className="relative h-[82%] overflow-hidden rounded-[4cqw]">
          <div
            className={`absolute inset-0 flex flex-col bg-[linear-gradient(180deg,#0b1320_0%,#0e213d_52%,#1765b0_100%)] px-[6cqw] pb-[6cqw] pt-[7cqw] transition-opacity duration-500 ${
              mode === "sleep" ? "opacity-0" : "opacity-100"
            }`}
          >
            {mode === "home" && (
              <>
                <div className="min-h-[21cqw]">
                  <p className="text-center text-[6.4cqw] font-semibold leading-[1.1] tracking-[0.01em] text-white">{title}</p>
                  <p
                    aria-hidden="true"
                    className={`mt-[2cqw] text-center text-[5cqw] font-semibold tracking-[0.2em] text-[#8fd3f5] transition-opacity duration-300 ${
                      running ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {Array.from({ length: 8 }, (_, i) => (
                      <span
                        key={i}
                        className="inline-block"
                        style={running ? { animation: `kw-flow 1.2s ${i * 0.1}s var(--ease-in-out) infinite` } : undefined}
                      >
                        ›
                      </span>
                    ))}
                  </p>
                </div>

                <div className="mt-[4cqw] grid flex-1 grid-cols-2 content-start gap-[5cqw] px-[3cqw]">
                  {screenTiles.map((t) => {
                    const Icon = ICONS[t.icon];
                    const on = t.id === selected;
                    const face = (
                      <>
                        <Icon aria-hidden="true" strokeWidth={1.6} className="h-[42%] w-[42%] text-white" />
                        <span className="mt-[1.5cqw] text-[4.4cqw] font-semibold leading-none text-white">{t.ph}</span>
                      </>
                    );
                    const cls = `flex aspect-square flex-col items-center justify-center rounded-[4cqw] transition-[transform,box-shadow] duration-300 ${
                      on ? "scale-[1.04] shadow-[0_0_0_1.4cqw_rgb(255_255_255/0.92)]" : "shadow-[inset_0_0_0_0.5cqw_rgb(255_255_255/0.14)]"
                    }`;
                    const style = {
                      background: `linear-gradient(160deg, ${t.color} 0%, color-mix(in oklab, ${t.color} 70%, black) 100%)`,
                    };
                    return onSelect ? (
                      <button
                        key={t.id}
                        type="button"
                        aria-pressed={on}
                        aria-label={`${t.label}, ${t.ph}`}
                        onClick={() => onSelect(t)}
                        className={`${cls} cursor-pointer hover:scale-[1.03] focus-visible:outline-offset-2`}
                        style={style}
                      >
                        {face}
                      </button>
                    ) : (
                      <div key={t.id} className={cls} style={style}>
                        {face}
                      </div>
                    );
                  })}
                </div>

                <p className="mx-auto mt-[4cqw] rounded-full bg-[#1f4fa3] px-[5cqw] py-[1.4cqw] text-[4cqw] font-medium text-white">
                  Setting
                </p>
              </>
            )}

            {mode === "languages" && (
              <>
                <p className="text-[6cqw] font-semibold text-white">Language</p>
                <ul className="mt-[4cqw] flex flex-1 flex-col justify-between">
                  {languages.map((l, i) => (
                    <li
                      key={l.lang}
                      lang={l.lang}
                      className={`rounded-[2.4cqw] px-[3.5cqw] py-[1.4cqw] text-center text-[4.8cqw] transition-colors duration-300 ${
                        i === language ? "bg-white font-semibold text-[#0b1320]" : "text-white/85 shadow-[inset_0_0_0_0.4cqw_rgb(255_255_255/0.22)]"
                      }`}
                    >
                      {l.native}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {mode === "filter" && (
              <>
                <p className="text-[6cqw] font-semibold text-white">Filter check</p>
                <div className="mt-[8cqw] grid flex-1 grid-cols-2 gap-[8cqw] px-[4cqw]">
                  {[
                    { label: "Total quantity", note: "≈ 6,000 L", filled: 4 },
                    { label: "Total time", note: "≈ 1 year", filled: 3 },
                  ].map((g) => (
                    <div key={g.label} className="flex flex-col items-center">
                      <div className="flex w-full flex-1 flex-col-reverse gap-[2cqw]">
                        {Array.from({ length: 6 }, (_, i) => (
                          <span
                            key={i}
                            className={`block flex-1 rounded-[1.4cqw] ${
                              i < g.filled ? "bg-[#8fd3f5]" : "shadow-[inset_0_0_0_0.5cqw_rgb(255_255_255/0.3)]"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-[3cqw] text-center text-[4cqw] leading-tight text-white/85">{g.label}</p>
                      <p className="text-[4cqw] font-semibold text-white">{g.note}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Asleep: dark until touched or water runs. */}
          <div
            className={`absolute inset-0 flex items-end justify-center bg-[#050608] pb-[12cqw] transition-opacity duration-500 ${
              mode === "sleep" ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <p className="px-[8cqw] text-center text-[4.2cqw] leading-snug text-white/35">Touch the screen or open the tap</p>
          </div>
        </div>

        <p className="mt-[5cqw] text-center text-[4.4cqw] tracking-[0.08em] text-white/70">KANGEN 8</p>
      </div>
    </div>
  );
}
