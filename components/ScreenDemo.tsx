"use client";

import { useState } from "react";
import { Droplet, Volume2 } from "lucide-react";
import { control, languages, screenTiles, waters, type ScreenTile } from "@/lib/content";
import { DrinkLabel } from "./DrinkLabel";
import { K8Screen } from "./K8Screen";

type View = "home" | "languages";

/** English, Japanese, Spanish, Chinese — indices into `languages`. */
const TRY_LANGUAGES = [1, 0, 6, 4];

/**
 * The interactive screen. Touch a water, run the tap, open the language list
 * — and read what the machine would say and where the water would come from.
 * Labelled as a website demonstration; voice lines and outlets follow the
 * manual (EN18, EN20).
 */
export function ScreenDemo() {
  const [selected, setSelected] = useState<ScreenTile>(screenTiles[1]);
  const [running, setRunning] = useState(false);
  const [view, setView] = useState<View>("home");
  const [language, setLanguage] = useState(1);
  const [spoken, setSpoken] = useState(0);

  const water = waters.find((w) => w.id === selected.water)!;
  const strongPair = selected.id === "2.5";

  const choose = (t: ScreenTile) => {
    setSelected(t);
    setView("home");
    setSpoken((n) => n + 1);
  };

  const pill = (on: boolean) =>
    `inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[0.875rem] font-medium transition-colors ${
      on ? "border-ink bg-ink text-paper" : "border-ink/25 bg-white text-ink hover:border-ink"
    }`;

  return (
    <div className="rounded-[var(--radius-lg)] bg-[linear-gradient(160deg,var(--color-ice-soft)_0%,var(--color-ice)_100%)] px-5 py-10 sm:px-10 sm:py-12">
      <p className="mx-auto w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-ink-soft">Website demonstration</p>

      <div className="mt-8 grid items-center gap-10 md:grid-cols-[minmax(0,280px)_1fr] md:gap-12">
        <div className="mx-auto w-[min(70vw,280px)]">
          <K8Screen mode={view} selected={selected.id} running={running} language={language} onSelect={choose} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Demonstration controls">
            <button
              type="button"
              aria-pressed={running}
              onClick={() => {
                setRunning((r) => !r);
                setView("home");
                setSpoken((n) => n + 1);
              }}
              className={pill(running)}
            >
              <Droplet aria-hidden="true" size={16} strokeWidth={1.6} />
              {running ? "Close the tap" : "Open the tap"}
            </button>
            <button
              type="button"
              aria-pressed={view === "languages"}
              onClick={() => setView((v) => (v === "languages" ? "home" : "languages"))}
              className={pill(view === "languages")}
            >
              {view === "languages" ? "Back to home screen" : "Language setting"}
            </button>
          </div>

          <div aria-live="polite" className="mt-8 min-h-[13rem]">
            {view === "home" ? (
              <div key={`home-${selected.id}-${running}-${spoken}`} className="kw-fade-in">
                <p className="flex items-center gap-2 text-[0.8125rem] text-mute">
                  <Volume2 aria-hidden="true" size={16} strokeWidth={1.6} className="text-glacier" />
                  The K8 says
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink">&ldquo;{selected.voice}&rdquo;</p>
                <p className="mt-5">
                  <DrinkLabel drinkable={water.drinkable} />
                </p>
                <p className="mt-4 max-w-[26rem] text-[0.9375rem] leading-relaxed text-ink-soft">
                  {strongPair
                    ? "Strong Acidic Water flows from the secondary pipe while Strong Kangen Water flows from the flexible pipe — neither is for drinking. The electrolysis enhancer tank must be fitted."
                    : running
                      ? `${water.name} is flowing from the flexible pipe on top of the machine.`
                      : `Open the tap and ${water.name} flows from the flexible pipe.`}
                </p>
              </div>
            ) : (
              <div key="languages" className="kw-fade-in">
                <p className="text-2xl font-semibold tracking-[-0.02em] text-ink">Eight languages, on screen and in the voice.</p>
                <p className="mt-3 text-[0.9375rem] text-mute">Try one:</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {TRY_LANGUAGES.map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      lang={languages[idx].lang}
                      aria-pressed={language === idx}
                      onClick={() => setLanguage(idx)}
                      className={`min-h-10 rounded-full px-3.5 text-[0.8125rem] font-medium transition-colors ${
                        language === idx ? "bg-ink text-paper" : "bg-white text-ink-soft hover:text-ink"
                      }`}
                    >
                      {languages[idx].native}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-[40rem] text-center text-xs leading-relaxed text-mute">{control.demoLabel}</p>
    </div>
  );
}
