/**
 * Product facts and copy used outside the story chapters (the chapters' own
 * copy lives in lib/experience-chapters.ts).
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

/* ─────────────────────────────── Five waters ──────────────────────────── */

export type WaterId = "kangen" | "clean" | "beauty" | "strong-acidic" | "strong-kangen";

export type Water = {
  id: WaterId;
  name: string;
  ph: string;
  /** The manual's pH setting(s). */
  phValues: number[];
  drinkable: boolean;
  summary: string;
  uses: string[];
  outlet: string;
  note?: string;
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
    uses: ["pH 8.5 — the manual's starting point", "pH 9.0 — for cooking", "pH 9.5 — everyday drinking, coffee and tea"],
    outlet: "Flows from the flexible pipe on top.",
    note: "The manual advises taking medicine with Clean Water, not Kangen Water.",
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
  },
];

/* ─────────────────────────────── Manufacturer ─────────────────────────── */

export const engineering = {
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

/* ─────────────────────────────── Specifications ───────────────────────── */

export const numbersNote =
  "*Warranty as listed for the K8 on Enagic Philippines' product price list (August 2026): limited and non-transferable, for the original purchaser, under Enagic's Consumer Limited Warranty terms.";

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
  "Specifications from the LeveLuk K8 operation manual (EN35) and Enagic's published K8 information; plate size from Enagic's K8 web page; language count and warranty from Enagic Philippines. Specifications may change without notice. Output rates are omitted because Enagic sources publish different figures.";

/* ─────────────────────────────── Booking ──────────────────────────────── */

export const booking = {
  eyebrow: "Presentation",
  headline: ["Request a", "presentation."],
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
      "Turn the diverter lever to the processed-water position, touch the water you want on the screen, and open the faucet. Your water flows from the flexible pipe on top; a second stream leaves through the secondary pipe to the sink. The screen wakes when you touch it or when water runs through the unit.",
      "Strong Acidic and Strong Kangen Water need the electrolysis enhancer tank fitted: Strong Acidic Water then leaves through the secondary pipe while Strong Kangen Water flows from the flexible pipe.",
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
    q: "Which languages does the display use?",
    a: [
      "Eight, for both the display and the voice guidance: Japanese, English, French, German, Chinese, Italian, Spanish and Portuguese.",
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
