import { displayLanguages, displayTiles, type TechVisual } from "./content";

/**
 * The technology section's illustrations, ported from the owner's portable
 * export of their own section (exports/technology-section.html): the
 * machine's screen in four states, and three small cards.
 *
 * They are built as HTML strings so the same builder runs on the server —
 * so the pictures are there with JavaScript off — and again in the browser,
 * where the waking screen and the language list cycle.
 *
 * Stylised illustrations, not the machine's own software. The facts in them
 * (the six home-screen buttons, the eight languages, the filter's litres and
 * days) come from lib/content.ts, with sources in docs/content-sources.md.
 */

const GLYPH: Record<string, string> = {
  glass: '<path d="M6 3h12l-1.5 18h-9L6 3z"/>',
  pot: '<path d="M4 9h16v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9zM2 11h2M20 11h2"/>',
  cup: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8zM17 9h2a2 2 0 0 1 0 5h-2"/>',
  bottle: '<path d="M9 2h6v3l2 4v13H7V9l2-4V2z"/>',
  sparkle: '<path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z"/>',
  spray: '<path d="M9 8h6v13H9zM9 4h4v4H9zM16 3h3M16 6h3"/>',
};

/** One colour per water, matching the manual's home screen. */
const TONE: Record<string, string> = {
  clean: "#3aa35b",
  kangen: "#4a55c8",
  beauty: "#e39a2b",
  cook: "#5a4fc0",
  acid: "#d9573a",
  daily: "#2f8fd0",
};

const icon = (name: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GLYPH[name]}</svg>`;

export type ScreenMode = "sleep" | "home" | "filter" | "languages";

/** The machine's display: asleep, on its home screen, checking the filter, or listing languages. */
export function screenHtml(mode: ScreenMode, running: boolean, langIndex: number): string {
  let inner = "";

  if (mode === "languages") {
    const rows = displayLanguages
      .map((language, i) => `<li class="${i === langIndex ? "is-on" : ""}">${language}</li>`)
      .join("");
    inner = `<p class="k8t-mode" style="text-align:left">Language</p><ul class="k8t-list-screen" style="margin-top:8px">${rows}</ul>`;
  } else if (mode === "filter") {
    const gauges: [string, string, number][] = [
      ["Total quantity", "≈ 6,000 L", 4],
      ["Total time", "≈ 1 year", 3],
    ];
    inner =
      `<p class="k8t-mode" style="text-align:left">Filter check</p><div class="k8t-gauges">` +
      gauges
        .map(([label, value, filled]) => {
          let bars = "";
          for (let i = 0; i < 6; i++) bars += `<i class="${i < filled ? "is-on" : ""}"></i>`;
          return `<div class="k8t-gauge"><div class="k8t-bars">${bars}</div><small>${label}</small><b>${value}</b></div>`;
        })
        .join("") +
      `</div>`;
  } else {
    let chevrons = "";
    for (let i = 0; i < 8; i++) chevrons += `<span style="animation-delay:${i * 0.1}s">›</span>`;
    const tiles = displayTiles
      .map(
        (tile) =>
          `<div class="k8t-tile" style="background:linear-gradient(160deg,${TONE[tile.tone]} 0%, ${TONE[tile.tone]}bb 100%)">${icon(tile.icon)}<b>${tile.ph}</b></div>`,
      )
      .join("");
    inner =
      `<p class="k8t-mode">KANGEN WATER 9.5</p>` +
      `<p class="k8t-flow" style="visibility:${running ? "visible" : "hidden"}">${chevrons}</p>` +
      `<div class="k8t-tiles">${tiles}</div><p class="k8t-set">Setting</p>`;
  }

  return (
    `<div class="k8t-screen${mode === "sleep" ? " is-asleep" : ""}">` +
    `<p class="k8t-brand">LeveLuk <b>K8</b></p><div class="k8t-glass">` +
    `<div class="k8t-face">${inner}</div>` +
    `<div class="k8t-sleep">Touch the screen or open the tap</div></div></div>`
  );
}

const PLUG =
  '<svg class="k8t-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8zM12 17v5"/></svg>';

const CYCLE =
  '<svg class="k8t-icon k8t-spin" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6"/></svg>';

function wave(): string {
  let bars = "";
  for (let i = 0; i < 11; i++) {
    bars += `<span style="height:${28 + ((i * 37) % 36)}px;animation-delay:${(i % 5) * 0.12}s"></span>`;
  }
  return `<div class="k8t-card"><div class="k8t-wave">${bars}</div><h3>&ldquo;Kangen Water 9.5&rdquo;</h3><p>Volume: high · low · off</p></div>`;
}

/** The illustration for one item. */
export function visualHtml(kind: TechVisual): string {
  switch (kind) {
    case "wake":
      return screenHtml("sleep", false, 1);
    case "lcd":
      return screenHtml("home", true, 1);
    case "filter":
      return screenHtml("filter", false, 1);
    case "languages":
      return screenHtml("languages", false, 1);
    case "voice":
      return wave();
    case "plug":
      return `<div class="k8t-card">${PLUG}<h3>No power switch</h3><p>Water running through it is the signal</p></div>`;
    case "clean":
      return `<div class="k8t-card">${CYCLE}<h3>Rinse, then drain</h3><p>After use — automatically</p></div>`;
    case "voltage":
      return `<div class="k8t-card"><p class="k8t-big">100–240</p><p class="k8t-sub">volts AC</p><p class="k8t-mid">50 / 60 Hz</p><p style="margin-top:0.75rem">Interchangeable power cord</p></div>`;
  }
}
