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

export type Water = {
  id: string;
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

/* ─────────────────────────────── Control ──────────────────────────────── */

/** MAN EN9 — home screen layout, two columns by three rows. */
export const screenTiles = [
  { ph: "7.0", label: "Clean" },
  { ph: "9.5", label: "Kangen" },
  { ph: "6.0", label: "Beauty" },
  { ph: "9.0", label: "Kangen" },
  { ph: "2.5", label: "Strong Acidic" },
  { ph: "8.5", label: "Kangen" },
] as const;

export const control = {
  eyebrow: "Touch display",
  headline: ["Control at your", "fingertips."],
  features: [
    { title: "One home screen", body: "Six water buttons and a Setting menu, operated by touch." }, // MAN EN9
    { title: "Voice guidance", body: "Each selection, reminder and cleaning cycle is announced. Volume high, low or off." }, // MAN EN16, EN18, EN23
    { title: "Eight languages", body: "Display and voice guidance, including English." }, // PH (K8 page), MAN EN16
    { title: "Automatic cleaning", body: "A short rinse after longer use, and a fuller cycle after Strong Acidic Water or a day unused." }, // MAN EN23
    { title: "Filter reminders", body: "The K8 counts water and time, and tells you when a new filter is due." }, // MAN EN24
    { title: "Auto power-off", body: "The screen switches off after one to five minutes idle, and wakes at a touch or when water runs." }, // MAN EN17
  ],
  caption: "Illustration of the home-screen layout shown in the operation manual. Not a photograph of the display.",
} as const;

/* ─────────────────────────────── Engineering ──────────────────────────── */

export const engineering = {
  eyebrow: "The manufacturer",
  headline: ["Engineered", "in Japan."],
  paragraphs: [
    "The LeveLuk K8 is made by Enagic Co., Ltd., headquartered in Tokyo. Its factory in Katano City, Osaka, produces parts in-house — from pressed electrode plates and moulded components to filter cartridges.", // JP outline, JP manufacturing, JP spec sheet
    "Enagic states that its manufacturing sites are certified to ISO 9001:2015 for quality management and ISO 14001:2015 for environmental management. Those are certifications of how the factories are run — not approvals of the product, and not evidence of any health effect.", // JP ISO page
  ],
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

/* ─────────────────────────────── Everyday ─────────────────────────────── */

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
