/**
 * Every product fact and line of copy on the page, in one place.
 *
 * Sources are recorded claim-by-claim in docs/content-sources.md. Short keys
 * used in comments here:
 *   MAN  LeveLuk K8 Operation Manual, English (page numbers as EN##)
 *   PH   Enagic Philippines, Inc. — enagicph.com and its published PDFs
 *   JP   Enagic Co., Ltd. — enagic.co.jp
 *   US   Enagic USA — enagic.com
 *
 * Rules: no health, medical, cure or detox claims. Every non-drinking water
 * is labelled in words wherever it appears. Where official sources disagree
 * (languages, output, filter model), the figure is omitted or the Philippine
 * source is used and the conflict is noted in docs/content-sources.md.
 *
 * Several sections (the connection diagram, the screen demonstration, the
 * feature story, the explorer and the everyday uses) were carried over from
 * the owner's earlier K8 page and re-checked against these rules.
 */

export const hero = {
  label: "LeveLuk K8",
  headline: ["Water,", "elevated."],
  body: "Enagic's eight-plate LeveLuk K8 — five types of water from one countertop machine, chosen on a touch display.",
  facts: [
    { value: "8", label: "Electrode plates" }, // MAN EN35, PH
    { value: "5", label: "Types of water" }, // MAN EN6
    { value: "7", label: "pH settings" }, // MAN EN6, EN35
    { value: "Japan", label: "Made in" }, // MAN back cover, JP
  ],
} as const;

export const statement = {
  lines: ["One machine.", "Five waters."],
  body: "Two for drinking. Three for the rest of the home. All from the same tap, one touch apart.",
} as const;

/* ─────────────────────────────── Five waters ──────────────────────────── */

export type WaterId = "kangen" | "clean" | "beauty" | "strong-acidic" | "strong-kangen";

export type Water = {
  id: WaterId;
  name: string;
  ph: string;
  /** Marker position(s) on the pH scale. */
  phValues: number[];
  drinkable: boolean;
  summary: string;
  uses: string[];
  outlet: string;
  note?: string;
  tint: string;
};

/** MAN EN6 (water table), EN18, EN20, EN35. pH values are the manual's approximate settings. */
export const waters: Water[] = [
  {
    id: "kangen",
    name: "Kangen Water",
    ph: "pH 8.5 · 9.0 · 9.5",
    phValues: [8.5, 9.0, 9.5],
    drinkable: true,
    summary: "The everyday setting, in three levels.",
    uses: [
      "pH 8.5 — the manual's starting point",
      "pH 9.0 — for cooking",
      "pH 9.5 — everyday drinking, coffee and tea",
    ],
    outlet: "Flows from the flexible pipe on top.",
    note: "The manual advises taking medicine with Clean Water, not Kangen Water.",
    tint: "#e4eff5",
  },
  {
    id: "clean",
    name: "Clean Water",
    ph: "pH 7.0",
    phValues: [7.0],
    drinkable: true,
    summary: "Filtered water at a neutral pH.",
    uses: ["Taking medicine", "Preparing baby formula", "Water you can drink every day"],
    outlet: "Flows from the flexible pipe on top.",
    tint: "#edf1f2",
  },
  {
    id: "beauty",
    name: "Beauty Water",
    ph: "pH 6.0",
    phValues: [6.0],
    drinkable: false,
    summary: "Mildly acidic water for external use.",
    uses: ["Skin care, as an astringent", "Bath water"],
    outlet: "Flows from the flexible pipe on top.",
    tint: "#f3ebe7",
  },
  {
    id: "strong-acidic",
    name: "Strong Acidic Water",
    ph: "pH 2.5",
    phValues: [2.5],
    drinkable: false,
    summary: "A cleaning water for the kitchen.",
    uses: ["Kitchen utensils, knives and cutting boards", "Keeping cups and saucers stain-free"],
    outlet: "Flows from the secondary pipe, with the electrolysis enhancer fitted.",
    note: "Keep the room ventilated while producing it, and store it away from metal.",
    tint: "#f3ede1",
  },
  {
    id: "strong-kangen",
    name: "Strong Kangen Water",
    ph: "pH 11.0",
    phValues: [11.0],
    drinkable: false,
    summary: "The strongest alkaline setting, for tougher jobs.",
    uses: ["Tough kitchen grease and floors", "Washing fish, meat and vegetables"],
    outlet: "Flows from the flexible pipe while Strong Acidic Water is being made.",
    tint: "#e5e9f2",
  },
];

export const watersIntro = {
  eyebrow: "Five types of water",
  headline: ["Two to drink.", "Three to use."],
  body: "Seven settings on one screen. Each water has a job, and the manual is clear about which ones you drink.",
  footnote:
    "Approximate pH settings from the LeveLuk K8 operation manual. Actual pH varies with local water and water pressure. Water from the secondary pipe, and water discharged during cleaning, is not for drinking.",
} as const;

/* ─────────────────────────────── Technology ───────────────────────────── */

export const technology = {
  eyebrow: "Electrolysis cell",
  headline: ["The power", "of eight."],
  body: "At the centre of the K8 is an electrolysis cell with eight electrode plates. Filtered tap water flows between them, and the current running through the cell sets the pH of the water you select.",
  points: [
    { title: "Eight plates", body: "Platinum-plated titanium, each about 135 × 75 mm." }, // MAN EN35, US (plate size)
    { title: "Continuous", body: "Water is electrolysed as it flows, with a built-in flow-rate sensor." }, // MAN EN35
    { title: "Adjustable", body: "The current can be fine-tuned in the pH setting menu for your local water." }, // MAN EN22
  ],
  caption: "Conceptual illustration of an eight-plate cell. Not an engineering drawing of the K8's interior.",
  cellCaption: "Illustration of the principle: filtered water in, two streams out. Not a drawing of the K8's internal parts.",
} as const;

/* ─────────────────────────────── How it works ─────────────────────────── */

export const steps = [
  {
    n: "01",
    title: "Set the diverter",
    body: "Turn the lever on the faucet diverter to the processed-water position.", // MAN EN6, EN13
  },
  {
    n: "02",
    title: "Touch a setting",
    body: "Choose a water on the home screen. The K8 shows your choice and says it aloud.", // MAN EN18
  },
  {
    n: "03",
    title: "Filter, then cell",
    body: "Tap water passes the built-in activated-charcoal filter, then the eight-plate cell.", // MAN EN8, EN35
  },
  {
    n: "04",
    title: "Two outlets",
    body: "Your water flows from the flexible pipe. The second stream leaves through the secondary pipe to the sink.", // MAN EN18
  },
] as const;

export const stepsNote =
  "Strong Acidic and Strong Kangen Water need the electrolysis enhancer tank fitted, and swap roles: Strong Acidic Water leaves through the secondary pipe while Strong Kangen Water flows from the flexible pipe.";

/** MAN EN10, EN13 — how the unit sits at the sink. */
export const connectCaption = "Illustration — diverter, supply hose and outlets";

/* ─────────────────────────────── Control ──────────────────────────────── */

export type ScreenIcon = "bottle" | "glass" | "face" | "pot" | "spray" | "cup";

export type ScreenTile = {
  id: string;
  ph: string;
  water: WaterId;
  label: string;
  /** What the K8 says when the button is touched (MAN EN18, EN20). */
  voice: string;
  icon: ScreenIcon;
  color: string;
};

/**
 * MAN EN9 — the home screen's six buttons, two columns by three rows. Strong
 * Kangen Water has no button of its own: it flows from the flexible pipe
 * while pH 2.5 is selected (EN20). Colours and icons are stylised.
 */
export const screenTiles: ScreenTile[] = [
  { id: "7.0", ph: "pH 7.0", water: "clean", label: "Clean Water", voice: "Clean water", icon: "bottle", color: "#3aa35b" },
  { id: "9.5", ph: "pH 9.5", water: "kangen", label: "Kangen Water 9.5", voice: "Kangen water 9.5", icon: "glass", color: "#4a55c8" },
  { id: "6.0", ph: "pH 6.0", water: "beauty", label: "Beauty Water", voice: "Beauty water", icon: "face", color: "#e39a2b" },
  { id: "9.0", ph: "pH 9.0", water: "kangen", label: "Kangen Water 9.0", voice: "Kangen water 9.0", icon: "pot", color: "#5a4fc0" },
  { id: "2.5", ph: "pH 2.5", water: "strong-acidic", label: "Strong Acidic Water", voice: "Strong acidic water", icon: "spray", color: "#d9573a" },
  { id: "8.5", ph: "pH 8.5", water: "kangen", label: "Kangen Water 8.5", voice: "Kangen water 8.5", icon: "cup", color: "#2f8fd0" },
];

/** MAN EN16 language screen; PH K8 page: "Eight languages display and voice prompt". */
export const languages: { name: string; native: string; lang: string }[] = [
  { name: "Japanese", native: "日本語", lang: "ja" },
  { name: "English", native: "English", lang: "en" },
  { name: "French", native: "Français", lang: "fr" },
  { name: "German", native: "Deutsch", lang: "de" },
  { name: "Chinese", native: "简体中文", lang: "zh" },
  { name: "Italian", native: "Italiano", lang: "it" },
  { name: "Spanish", native: "Español", lang: "es" },
  { name: "Portuguese", native: "Português", lang: "pt" },
];

export const control = {
  eyebrow: "Touch display",
  headline: ["Control at your", "fingertips."],
  body: "Advanced inside, simple outside. Every water sits on one home screen — touch one, open the tap.",
  points: [
    { title: "Touch display", body: "Six water buttons and a Setting menu on one screen." }, // MAN EN9
    { title: "One touch", body: "Choose a water, then open the tap." }, // MAN EN18
    { title: "Voice guidance", body: "Each choice is confirmed aloud. Volume high, low or off." }, // MAN EN16, EN18
    { title: "Eight languages", body: "On screen and in the voice, including English." }, // PH, MAN EN16
  ],
  demoLabel:
    "Interactive website demonstration, modelled on the home screen in the K8 operation manual. It isn't the machine's own software; colours and icons are stylised.",
} as const;

/* ─────────────────────────────── Feature story ───────────────────────── */

/** Regions of the front-view product image, as percentages of its square box. */
export type FocusRegion = { x: number; y: number; w: number; h: number };

const focus = {
  screen: { x: 45.4, y: 17.6, w: 16.6, h: 45 },
  base: { x: 27, y: 82, w: 54, h: 10 },
  body: { x: 22.5, y: 13.5, w: 62, h: 71 },
  filter: { x: 22.5, y: 14, w: 23.5, h: 48 },
} satisfies Record<string, FocusRegion>;

export type FeatureVisual = "wake" | "plug" | "clean" | "filter" | "voltage" | "lcd" | "voice" | "languages";

export type Feature = {
  id: string;
  title: string;
  statement: string;
  detail: string;
  focus: FocusRegion;
  visual: FeatureVisual;
};

export const featuresIntro = {
  eyebrow: "Everyday intelligence",
  headline: ["Built to think", "for itself."],
} as const;

export const features: Feature[] = [
  {
    id: "auto",
    title: "Auto on / off",
    statement: "It wakes when you need it.",
    detail:
      "Touch the screen or open the tap and the K8 comes on. Leave it, and the screen and power switch off by themselves — after one minute by default, or up to five.", // MAN EN17
    focus: focus.screen,
    visual: "wake",
  },
  {
    id: "plug",
    title: "Plug & play",
    statement: "No power switch to remember.",
    detail: "Plugged in and fed from the faucet diverter, the K8 is ready as soon as water runs through it.", // US, MAN EN17
    focus: focus.base,
    visual: "plug",
  },
  {
    id: "cleaning",
    title: "Automatic cleaning",
    statement: "It rinses itself after use.",
    detail:
      "After more than ten minutes of Kangen or Beauty Water, a short rinse runs when the tap closes; a fuller cycle follows Strong Acidic Water or a day unused. The water it discharges while cleaning is not for use.", // MAN EN23
    focus: focus.body,
    visual: "clean",
  },
  {
    id: "filter",
    title: "Filter reminders",
    statement: "It knows when the filter is due.",
    detail:
      "The K8 counts litres and days, and tells you on screen and aloud when a new filter is needed — as a guide, about 6,000 litres or a year, depending on your water.", // MAN EN16, EN24
    focus: focus.filter,
    visual: "filter",
  },
  {
    id: "voltage",
    title: "Multi-voltage",
    statement: "100–240 V. 50 or 60 Hz.",
    detail:
      "A multi-voltage supply with an interchangeable power cord. Philippine household supply falls within its rating; it needs a properly grounded outlet.", // MAN EN3, EN15
    focus: focus.base,
    visual: "voltage",
  },
  {
    id: "lcd",
    title: "Colour touch display",
    statement: "Everything on one screen.",
    detail: "A large colour touch display shows the water you've chosen, and what the machine is doing while water runs.", // MAN EN9, EN18
    focus: focus.screen,
    visual: "lcd",
  },
  {
    id: "voice",
    title: "Voice guidance",
    statement: "It tells you what it's making.",
    detail: "Selections are confirmed aloud, and so are reminders such as filter changes and cleaning. Volume high, low or off.", // MAN EN16, EN18, EN24
    focus: focus.screen,
    visual: "voice",
  },
  {
    id: "languages",
    title: "Eight languages",
    statement: "Eight languages. Display and voice.",
    detail: "Japanese, English, French, German, Chinese, Italian, Spanish and Portuguese.", // MAN EN16, PH
    focus: focus.screen,
    visual: "languages",
  },
];

/* ─────────────────────────────── Engineering ──────────────────────────── */

export const engineering = {
  eyebrow: "Japanese engineering",
  headline: ["Engineered", "in Japan."],
  lead: "Enagic was established in Japan in 1974, and the K8 is made in Japan.", // JP outline, MAN back cover
  paragraphs: [
    "The LeveLuk K8 is made by Enagic Co., Ltd., headquartered in Tokyo. Its factory in Katano City, Osaka, produces parts in-house — from pressed electrode plates and moulded components to filter cartridges.", // JP outline, JP manufacturing, JP spec sheet
  ],
  facts: [
    ["Established", "1974"],
    ["Made in", "Japan"],
    ["Plates", "Platinum-plated titanium"],
    ["Plate size", "135 × 75 mm"],
  ] as [string, string][],
  macro: [
    { id: "plates", title: "Eight plates", caption: "Platinum-plated titanium, each about 135 × 75 mm." },
    { id: "surface", title: "Water in motion", caption: "Filtered first, then divided into two streams." },
    { id: "panel", title: "The display", caption: "A colour touch screen set into the front." },
    { id: "finish", title: "The finish", caption: "A white body, about 28 × 34.5 × 14.7 cm." },
  ] as { id: "plates" | "surface" | "panel" | "finish"; title: string; caption: string }[],
  factory: {
    title: "Made in Japan.",
    caption: "Enagic's Okinawa factory, Japan — photographed on a factory visit.",
    alt: "The production floor of an Enagic factory in Japan, under long rows of ceiling lights",
  },
  certifications: [
    { name: "ISO 9001:2015", scope: "Quality management systems." },
    { name: "ISO 14001:2015", scope: "Environmental management systems." },
  ],
  certNote:
    "Enagic Japan lists its manufacturing sites as certified to these standards. They certify how the factories are run — they are not approvals of the product, and not evidence of any health effect.", // JP ISO page
  certSource: { label: "Enagic Japan — certifications (in Japanese)", href: "https://www.enagic.co.jp/equipment/iso/" },
  independence:
    "Kangen Water PH is an independent website. It is not Enagic's official site and is not operated by Enagic Philippines, Inc.",
  officialSite: { label: "Enagic Philippines — enagicph.com", href: "https://www.enagicph.com/" },
} as const;

/* ─────────────────────────────── Numbers ──────────────────────────────── */

export const numbers = [
  { value: "8", unit: "", label: "Electrode plates" },
  { value: "7", unit: "", label: "pH settings" },
  { value: "5", unit: "kg", label: "Total weight" },
  { value: "5", unit: "yrs", label: "Warranty, Philippines*" },
] as const;

export const numbersNote =
  "*As listed for the K8 on Enagic Philippines' product price list (August 2026). A limited, non-transferable warranty for the original purchaser, under Enagic's Consumer Limited Warranty terms.";

export const specGroups: { title: string; rows: [string, string][] }[] = [
  {
    title: "Electrolysis",
    rows: [
      ["Model", "LeveLuk K8 (A26-00)"],
      ["Electrode plates", "8, platinum-plated titanium"],
      ["Plate size", "Approx. 135 × 75 mm"],
      ["System", "Continuous, built-in flow-rate sensor"],
      ["Settings", "7 — Kangen 8.5 / 9.0 / 9.5, Clean 7.0, Beauty 6.0, Strong Acidic 2.5, Strong Kangen 11.0"],
    ],
  },
  {
    title: "Size & power",
    rows: [
      ["Dimensions", "Approx. H 34.5 × W 28.0 × D 14.7 cm"],
      ["Weight", "5 kg"],
      ["Rated supply", "100–240 V AC, 50/60 Hz"],
      ["Power consumption", "Approx. 230 W at high Kangen pH"],
    ],
  },
  {
    title: "Water & filter",
    rows: [
      ["Connection", "One-way faucet diverter"],
      ["Feed water", "Municipal tap water, 5–35 °C, 50–500 kPa"],
      ["Filter", "Granulated activated charcoal with calcium sulfite"],
      ["Filter replacement", "About 1 year or 6,000 L, varies with water quality"],
    ],
  },
  {
    title: "Interface & warranty",
    rows: [
      ["Display", "Touch display with voice guidance"],
      ["Languages", "8, display and voice"],
      ["Warranty", "5 years, per Enagic Philippines' price list*"],
    ],
  },
];

export const specNote =
  "Specifications from the LeveLuk K8 operation manual (EN35) and Enagic's published K8 information; plate size from Enagic's K8 web page; language count and warranty from Enagic Philippines. Specifications may change without notice. Output rates are omitted because Enagic sources publish different figures. *Warranty as listed on Enagic Philippines' product price list (August 2026); coverage is limited to the original purchaser and set by Enagic's Consumer Limited Warranty terms.";

/* ─────────────────────────────── Explorer ─────────────────────────────── */

export type Hotspot = {
  id: string;
  label: string;
  /** Position on the front-view product image, percent of its box. */
  x: number;
  y: number;
  body: string;
  /** Internal parts are marked, not shown. */
  illustrative?: boolean;
};

export const explorerIntro = {
  eyebrow: "Explore",
  headline: ["Take a", "closer look."],
  caption: "Positions are indicative. Internal parts are marked for orientation, not shown.",
} as const;

/** MAN EN8 (names of parts), EN9, EN13, EN24. */
export const hotspots: Hotspot[] = [
  {
    id: "lcd",
    label: "Touch display",
    x: 53.8,
    y: 29,
    body: "A colour touch screen: five waters across seven pH settings, each one touch away and confirmed on screen and aloud.",
  },
  {
    id: "settings",
    label: "Setting menu",
    x: 53.8,
    y: 47,
    body: "Language, voice volume, pH strength, E-Cleaning, brightness, sleep timer and filter check — all from the Setting button on the same screen.",
  },
  {
    id: "outlet",
    label: "Flexible pipe",
    x: 8.6,
    y: 79,
    body: "The outlet for your chosen water. Kangen, Clean and Beauty Water flow from this flexible pipe on top of the machine; it swings over a glass or the sink.",
  },
  {
    id: "filter",
    label: "Water filter",
    x: 33.5,
    y: 38,
    body: "An activated-charcoal filter sits behind the side cover. The K8 tracks its use and tells you when a new one is due.",
  },
  {
    id: "cell",
    label: "Electrolysis cell",
    x: 46,
    y: 69,
    body: "Inside: eight platinum-plated titanium plates. Marked here for orientation only — the cell's exact position isn't shown.",
    illustrative: true,
  },
  {
    id: "tank",
    label: "Tank compartment",
    x: 70.6,
    y: 77,
    body: "Behind the lower cover: the electrolysis enhancer tank used for Strong Acidic Water, and the place the cleaning tank goes for E-Cleaning.",
  },
  {
    id: "base",
    label: "Water in, water out",
    x: 50.2,
    y: 88.5,
    body: "Tap water arrives from the faucet diverter through a supply hose underneath. The secondary pipe, also at the base, carries the second stream to the sink.",
  },
];

/* ─────────────────────────────── Everyday water ───────────────────────── */

export type EverydayImage =
  | "glass"
  | "cooking"
  | "coffee"
  | "prep"
  | "skin"
  | "kitchen"
  | "house";

export type EverydayUse = {
  title: string;
  line: string;
  water: string;
  image: EverydayImage;
  alt: string;
};

export const everydayIntro = {
  eyebrow: "Everyday water",
  headline: ["More ways", "to use water."],
  body: "Two waters for drinking. Three for everything else — kept apart here, as they should be at home.",
  careLabel: "Food preparation, skin care and cleaning",
  note: "Uses follow the K8 operation manual and are for general product education. The photographs are illustrative scenes, not the K8 in use.",
} as const;

/** MAN EN6 water table. */
export const everydayDrinking: EverydayUse[] = [
  {
    title: "Drinking",
    line: "Your daily glass. The manual suggests starting at pH 8.5.",
    water: "Kangen Water · Clean Water",
    image: "glass",
    alt: "Water being poured into a clear glass",
  },
  {
    title: "Cooking",
    line: "Rice, soups and broths.",
    water: "Kangen Water · pH 9.0",
    image: "cooking",
    alt: "Rice being rinsed in a steel bowl beside a simmering pot",
  },
  {
    title: "Coffee & tea",
    line: "The water behind the morning cup.",
    water: "Kangen Water · pH 9.5",
    image: "coffee",
    alt: "A pour-over coffee set, teapot and kettle on a kitchen counter",
  },
];

export const everydayCare: EverydayUse[] = [
  {
    title: "Food preparation",
    line: "Washing fish, meat and vegetables.",
    water: "Strong Kangen Water",
    image: "prep",
    alt: "Leafy greens being washed in a bowl in the kitchen sink",
  },
  {
    title: "Skin care",
    line: "As an astringent, or added to bath water.",
    water: "Beauty Water",
    image: "skin",
    alt: "A glass of water and a folded towel on a bathroom counter",
  },
  {
    title: "Kitchen cleaning",
    line: "Knives, cutting boards and utensils.",
    water: "Strong Acidic Water",
    image: "kitchen",
    alt: "A clean kitchen sink with a bowl of water, a cloth and a brush",
  },
  {
    title: "Household cleaning",
    line: "Kitchen grease and floors.",
    water: "Strong Kangen Water",
    image: "house",
    alt: "Spray bottles and folded cloths on a bright windowsill",
  },
];

/* ─────────────────────────────── At home ──────────────────────────────── */

export const lifestyle = {
  eyebrow: "At home",
  headline: ["Designed for", "everyday life."],
  body: "A countertop machine fed from the kitchen faucet, with the flexible pipe swung over a glass or the sink.",
  moments: [
    { time: "Morning", text: "A glass of Kangen Water — the manual suggests starting at pH 8.5." },
    { time: "Cooking", text: "Rice, soups and broths at pH 9.0." },
    { time: "Afternoon", text: "Coffee and tea at pH 9.5." },
    { time: "Medicine", text: "Clean Water at pH 7.0, as the manual advises." },
  ],
  caption: "K8 units installed in homes. Photographs supplied by the site owner.",
} as const;

/* ─────────────────────────────── Booking ──────────────────────────────── */

export const booking = {
  eyebrow: "Presentation",
  headline: ["See the K8", "for yourself."],
  body: "Explore the water settings, understand how the machine works, and ask questions before deciding whether the LeveLuk K8 is right for your home.",
  expectations: [
    "Your request goes to the person who runs this site, who replies by mobile or email to arrange a time.",
    "The date and time you choose are a preference. Nothing is booked until you both agree.",
    "Sending a request doesn't commit you to anything. Nothing is sold on this website.",
  ],
} as const;

/* ─────────────────────────────── FAQ ──────────────────────────────────── */

export const faqs: { q: string; a: string[] }[] = [
  {
    q: "What is the LeveLuk K8?",
    a: [
      "A countertop water ionizer made by Enagic in Japan. It connects to your kitchen faucet through a diverter, filters the tap water, and uses an eight-plate electrolysis cell to produce five types of water across seven pH settings.",
    ],
  },
  {
    q: "Which of the five waters can I drink?",
    a: [
      "Kangen Water (pH 8.5, 9.0 and 9.5) and Clean Water (pH 7.0). Beauty Water, Strong Acidic Water and Strong Kangen Water are not for drinking — and neither is water from the secondary pipe or water discharged while the machine cleans itself.",
      "The manual also advises keeping drinking water at pH 9.5 or lower, taking medicine with Clean Water, and asking your physician first if you are under a doctor's care.",
    ],
  },
  {
    q: "How is it used day to day?",
    a: [
      "Turn the diverter lever to the processed-water position, touch the water you want on the screen, and open the faucet. Turn the faucet off when you're done. The screen wakes when you touch it or when water runs through the unit.",
    ],
  },
  {
    q: "Will it work with my faucet?",
    a: [
      "The K8 connects through a diverter fitted to the faucet. The manual lists faucets that can't take one — sensor faucets, square faucets, faucets with a very short nozzle, and some thread sizes. In those cases a dedicated faucet or a specific diverter is needed.",
      "It's designed for municipally treated tap water. Enagic Philippines notes that hard or deep-well water calls for more frequent E-Cleaning. A photo of your faucet is useful to have during the presentation.",
    ],
  },
  {
    q: "How often is the filter replaced?",
    a: [
      "As a guide, about once a year or every 6,000 litres, whichever comes first — sooner with harder water. The K8 tracks both and tells you on screen and by voice when it's due. Enagic Philippines currently lists the FC1 filter for replacement.",
    ],
  },
  {
    q: "How is it cleaned and maintained?",
    a: [
      "The K8 rinses its cell automatically: briefly after longer use, and more fully after Strong Acidic Water or a day unused. Don't use the water it discharges while cleaning.",
      "You also run an E-Cleaning cycle with Enagic's cleaning powder — about three hours, every one to two weeks. The manual recommends a deep cleaning at a qualified service centre about once a year, depending on water hardness.",
    ],
  },
  {
    q: "What electricity does it need?",
    a: [
      "It is rated for 100–240 V AC at 50/60 Hz, draws about 230 W at high Kangen settings, and needs a properly grounded outlet. Philippine household supply falls within that rating, though Enagic doesn't publish a Philippine-specific specification. Using an improper voltage voids the warranty.",
    ],
  },
  {
    q: "How much space does it take?",
    a: [
      "About 34.5 cm tall, 28.0 cm wide and 14.7 cm deep, weighing 5 kg. It sits on a flat, stable counter near the faucet, away from direct sunlight, steam and splashing water, with the secondary pipe kept lower than the machine.",
    ],
  },
  {
    q: "What warranty applies in the Philippines?",
    a: [
      "Enagic Philippines' product price list (August 2026) lists a five-year warranty for the K8. Enagic's warranties are limited and non-transferable, and cover the original purchaser under its Consumer Limited Warranty terms.",
      "The manual lists repairs that may be charged even within the warranty period, such as damage from improper voltage, water other than municipal drinking water, or missed maintenance.",
    ],
  },
  {
    q: "What happens after I send a presentation request?",
    a: [
      "Your request is sent to the person who runs this site. They reply by mobile or email to agree a date and time — the one you picked is treated as a preference until then. There's no charge for a presentation, and no obligation to buy.",
    ],
  },
  {
    q: "Is this Enagic's official website?",
    a: [
      "No. Kangen Water PH is an independent website about the LeveLuk K8. Enagic Philippines, Inc. publishes its own official information at enagicph.com.",
    ],
  },
];

/* ─────────────────────────────── Footer ───────────────────────────────── */

export const disclaimer =
  "Kangen Water PH is an independent website and is not affiliated with, endorsed by, or operated by Enagic Co., Ltd. or Enagic Philippines, Inc. Enagic, LeveLuk and Kangen Water are trademarks of Enagic. Product information is drawn from Enagic's published documentation and may change. Nothing on this site is medical advice: the LeveLuk K8 is a household water appliance.";
