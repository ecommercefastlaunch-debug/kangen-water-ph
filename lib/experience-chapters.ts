import { waters, type WaterId } from "./content";
import { POSES, type Beat, type PoseKey, type Rgb } from "./experience-poses";

/**
 * The story told around the one persistent K8. Chapters are states of the
 * same scene — each has a pose, a stage colour and a share of the scroll —
 * not separate sections. Their order here is their order on the page.
 *
 * Product facts: docs/content-sources.md. No health claims.
 */

export type ChapterKind = "intro" | "statement" | "water" | "power" | "control" | "ownership" | "final";

export type Chapter = {
  id: string;
  kind: ChapterKind;
  pose: PoseKey;
  /** Scroll length in viewport heights, on wide and on compact screens. */
  units: number;
  unitsCompact: number;
  /** Stage colour around the product. The product itself is never tinted. */
  bg: Rgb;
  /**
   * 1 = water flows from the flexible pipe in this chapter, 0 = it stops.
   * The demonstration is Kangen Water, a drinking water that the manual says
   * flows from the flexible pipe (EN18); Clean Water uses the same outlet.
   * It stops for the non-drinking waters — Strong Acidic Water comes from a
   * different pipe — and for the cell and display close-ups.
   */
  flow: number;
  waterId?: WaterId;
  /** The water's pH setting(s), for the scale beside the product. */
  ph?: readonly [number, number];
};

const hex = (h: string): Rgb => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

const WATER_BG: Record<WaterId, string> = {
  kangen: "#e2edf3",
  clean: "#ebeff1",
  beauty: "#f3eae5",
  "strong-acidic": "#f3ebde",
  "strong-kangen": "#e3e7f1",
};

/** Drinking waters from the flexible pipe (MAN EN6, EN18). */
const FLOWS_FROM_PIPE: WaterId[] = ["kangen", "clean"];

export const chapters: Chapter[] = [
  { id: "intro", kind: "intro", pose: "intro", units: 1, unitsCompact: 0.9, bg: hex("#faf9f6"), flow: 1 },
  { id: "statement", kind: "statement", pose: "statement", units: 1, unitsCompact: 0.85, bg: hex("#eef4f7"), flow: 1 },
  ...waters.map(
    (w): Chapter => ({
      id: `water-${w.id}`,
      kind: "water",
      pose: "waters",
      units: 0.8,
      unitsCompact: 0.75,
      bg: hex(WATER_BG[w.id]),
      flow: FLOWS_FROM_PIPE.includes(w.id) ? 1 : 0,
      waterId: w.id,
      ph: [Math.min(...w.phValues), Math.max(...w.phValues)],
    }),
  ),
  { id: "power", kind: "power", pose: "power", units: 1.1, unitsCompact: 0.95, bg: hex("#e7ebee"), flow: 0 },
  { id: "control", kind: "control", pose: "control", units: 1.2, unitsCompact: 1, bg: hex("#ecf1f4"), flow: 0 },
  { id: "ownership", kind: "ownership", pose: "ownership", units: 1.2, unitsCompact: 1, bg: hex("#f3f2ee"), flow: 1 },
  { id: "final", kind: "final", pose: "final", units: 1, unitsCompact: 0.9, bg: hex("#faf9f6"), flow: 1 },
];

export function beatsFor(wide: boolean): Beat[] {
  return chapters.map((c) => ({
    units: wide ? c.units : c.unitsCompact,
    pose: POSES[c.pose][wide ? "wide" : "compact"],
    bg: c.bg,
  }));
}

export function totalUnits(wide: boolean): number {
  return chapters.reduce((t, c) => t + (wide ? c.units : c.unitsCompact), 0);
}

export const storyCopy = {
  intro: {
    label: "LeveLuk K8",
    headline: ["Water,", "elevated."],
    body: "Enagic's eight-plate water ionizer. Five types of water from one countertop machine, chosen on a touch display.",
    facts: [
      ["8", "Electrode plates"],
      ["5", "Types of water"],
      ["7", "pH settings"],
      ["Japan", "Made in"],
    ] as [string, string][],
  },
  statement: {
    headline: ["One machine.", "Five waters."],
    body: "Two for drinking. Three for the rest of the home — all from the faucet you already have.",
    drinking: "Kangen Water · Clean Water",
    notDrinking: "Beauty · Strong Acidic · Strong Kangen",
  },
  watersEyebrow: "Five types of water",
  watersFootnote: "Approximate settings from the K8 operation manual. Actual pH varies with local water and pressure.",
  power: {
    eyebrow: "Electrolysis cell",
    headline: ["The power", "of eight."],
    body: "Inside the K8, filtered tap water flows between eight electrode plates. The current through them sets the pH of the water you choose.",
    points: [
      ["8 plates", "Platinum-plated titanium, each about 135 × 75 mm."],
      ["Continuous", "Water is electrolysed as it flows, with a built-in flow-rate sensor."],
      ["7 settings", "From pH 2.5 to pH 11.0, across five types of water."],
    ] as [string, string][],
    compact: "Eight platinum-plated titanium plates · continuous electrolysis · seven settings.",
    caption: "Conceptual illustration of the principle — not the K8's internal layout.",
  },
  control: {
    eyebrow: "Touch display",
    headline: ["Control at your", "fingertips."],
    body: "Six water buttons and a Setting menu, operated by touch. Choose a water, then open the tap.",
    points: [
      ["Voice guidance", "Each choice is confirmed aloud. Volume high, low or off."],
      ["Eight languages", "On screen and in the voice, including English."],
      ["Auto on / off", "Wakes at a touch or when water runs; sleeps after one to five idle minutes."],
      ["Filter check", "Tracks filter use and tells you when a new one is due."],
    ] as [string, string][],
    compact: "Voice guidance · eight languages · auto on/off · filter reminders.",
    caption: "Product image. On-screen details may differ slightly from the display you'll see in person.",
  },
  ownership: {
    eyebrow: "Everyday ownership",
    headline: ["Made for", "every day."],
    groups: [
      ["Using it", "Set the faucet diverter to processed water, touch a setting, open the tap."],
      ["Care", "It rinses its cell after use. Run an E-Cleaning cycle every one to two weeks."],
      ["Filter", "About a year or 6,000 litres, depending on your water. The K8 tells you when."],
      ["Size & power", "34.5 × 28.0 × 14.7 cm, 5 kg. 100–240 V AC, 50/60 Hz, grounded outlet."],
    ] as [string, string][],
  },
  final: {
    headline: ["See the K8", "for yourself."],
    body: "A presentation shows all five waters, the touch display and what installing it at your sink involves — before you decide anything.",
  },
} as const;
