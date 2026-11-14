import { buildQuery, googleUrl } from "@/lib/search-links";

/**
 * Upgrade models, categories and a curated list of well-known aftermarket kits.
 *
 * Kit entries name real, widely sold product lines. To avoid publishing made-up numbers,
 * kits carry no prices, horsepower figures or product-page URLs: `link` is a web search for
 * the product, and fitment must be confirmed with the seller. Images are original
 * AI-generated, badge-free illustrations (see /public/hero and /public/upgrades).
 */

export type UpgradeCategory =
  | "body-kits"
  | "turbo-kits"
  | "engine-mods"
  | "exhaust"
  | "suspension"
  | "other";

export const UPGRADE_CATEGORIES: {
  id: UpgradeCategory;
  label: string;
  searchTerm: string;
}[] = [
  { id: "body-kits", label: "Body Kits", searchTerm: "body kit" },
  { id: "turbo-kits", label: "Turbo Kits", searchTerm: "turbo kit" },
  {
    id: "engine-mods",
    label: "Engine Mods",
    searchTerm: "engine upgrade cams fuel",
  },
  { id: "exhaust", label: "Exhaust", searchTerm: "exhaust" },
  { id: "suspension", label: "Suspension", searchTerm: "coilovers suspension" },
  { id: "other", label: "Other", searchTerm: "upgrade parts" },
];

export interface UpgradeModel {
  id: string;
  name: string;
  /** Mitsubishi chassis codes, used in searches because sellers list fitment by them. */
  chassis: string;
  years: string;
  engine: string;
  /** How sellers usually title listings, used to build search queries. */
  searchName: string;
  isEvo: boolean;
  /** Hero image for EVO cards. */
  image?: string;
}

export const UPGRADE_MODELS: UpgradeModel[] = [
  {
    id: "evo-1-3",
    name: "Lancer Evolution I–III",
    chassis: "CD9A / CE9A",
    years: "1992–1995",
    engine: "4G63T",
    searchName: "Lancer Evo 1 2 3",
    isEvo: true,
    image: "/hero/evo-style.webp",
  },
  {
    id: "evo-4-6",
    name: "Lancer Evolution IV–VI",
    chassis: "CN9A / CP9A",
    years: "1996–2001",
    engine: "4G63T",
    searchName: "Lancer Evo 4 5 6",
    isEvo: true,
    image: "/hero/evo-style.webp",
  },
  {
    id: "evo-7-9",
    name: "Lancer Evolution VII–IX",
    chassis: "CT9A",
    years: "2001–2007",
    engine: "4G63T",
    searchName: "Lancer Evo 7 8 9",
    isEvo: true,
    image: "/upgrades/evo-ct9a-style.webp",
  },
  {
    id: "evo-10",
    name: "Lancer Evolution X",
    chassis: "CZ4A",
    years: "2007–2016",
    engine: "4B11T",
    searchName: "Lancer Evo X",
    isEvo: true,
    image: "/upgrades/evo-cz4a-style.webp",
  },
  {
    id: "lancer-ck",
    name: "Lancer (CK) “Pizza”",
    chassis: "CK2A / CK4A",
    years: "1996–2002",
    engine: "4G15 / 4G93",
    searchName: "Lancer",
    isEvo: false,
  },
  {
    id: "lancer-cs",
    name: "Lancer / Cedia (CS)",
    chassis: "CS3A",
    years: "2000–2007",
    engine: "4G18 / 4G93",
    searchName: "Lancer Cedia",
    isEvo: false,
  },
  {
    id: "lancer-cy",
    name: "Lancer EX / GT (CY)",
    chassis: "CY4A",
    years: "2007–2017",
    engine: "4B11 / 4B12",
    searchName: "Lancer EX",
    isEvo: false,
  },
];

export interface UpgradeKit {
  id: string;
  name: string;
  brand: string;
  /** Model ids this kit is commonly sold for. */
  models: string[];
  category: UpgradeCategory;
  description: string;
  /** Web search for the product (not a vendor page, which changes often). */
  link: string;
  /** Optional, only filled in when a reliable figure is available. */
  powerGain?: string;
  priceRange?: string;
}

const EVO_4G63 = ["evo-1-3", "evo-4-6", "evo-7-9"];

function kit(k: Omit<UpgradeKit, "link"> & { search: string }): UpgradeKit {
  const { search, ...rest } = k;
  return { ...rest, link: googleUrl(search) };
}

export const UPGRADE_KITS: UpgradeKit[] = [
  kit({
    id: "varis-evo9",
    name: "Varis aero / body kit",
    brand: "Varis",
    models: ["evo-7-9"],
    category: "body-kits",
    description:
      "Japanese carbon and FRP aero parts — front bumpers, vented bonnets, canards and wings — for the CT9A.",
    search: "Varis Evo 9 CT9A body kit",
  }),
  kit({
    id: "varis-evo10",
    name: "Varis aero / body kit",
    brand: "Varis",
    models: ["evo-10"],
    category: "body-kits",
    description:
      "Carbon bonnets, front lips and widebody parts from Varis for the Evo X.",
    search: "Varis Evo X CZ4A body kit",
  }),
  kit({
    id: "voltex-wing",
    name: "Voltex GT wing",
    brand: "Voltex",
    models: ["evo-4-6", "evo-7-9", "evo-10"],
    category: "body-kits",
    description:
      "Time-attack style carbon rear wings, widely used on Evos for track downforce.",
    search: "Voltex GT wing Lancer Evolution",
  }),
  kit({
    id: "garrett-gtx-4g63",
    name: "Garrett G-Series / GTX turbo kit",
    brand: "Garrett",
    models: EVO_4G63,
    category: "turbo-kits",
    description:
      "Ball-bearing turbo upgrades for the 4G63, usually installed with an aftermarket manifold and supporting fuel mods.",
    search: "Garrett G25 GTX turbo kit 4G63 Evo",
  }),
  kit({
    id: "ets-evo10-turbo",
    name: "ETS turbo kit",
    brand: "ETS (Extreme Turbo Systems)",
    models: ["evo-10"],
    category: "turbo-kits",
    description:
      "Bolt-on turbo kits with manifold, downpipe and charge piping for the 4B11T.",
    search: "ETS turbo kit Evo X 4B11T",
  }),
  kit({
    id: "hks-gt-4g63",
    name: "HKS GT turbine kit",
    brand: "HKS",
    models: EVO_4G63,
    category: "turbo-kits",
    description:
      "Bolt-on HKS turbo kits for the 4G63, designed to fit the factory location.",
    search: "HKS GT turbine kit 4G63 Evolution",
  }),
  kit({
    id: "tomei-cams-4g63",
    name: "Poncam camshafts",
    brand: "Tomei",
    models: EVO_4G63,
    category: "engine-mods",
    description:
      "Drop-in performance camshafts for the 4G63 that work with stock or upgraded turbos.",
    search: "Tomei Poncam 4G63 camshaft",
  }),
  kit({
    id: "id-injectors",
    name: "ID1050x / ID1300x injectors",
    brand: "Injector Dynamics",
    models: ["evo-4-6", "evo-7-9", "evo-10"],
    category: "engine-mods",
    description:
      "High-flow fuel injectors for turbo upgrades and E85; check the adapter for your engine.",
    search: "Injector Dynamics ID1050x Evo",
  }),
  kit({
    id: "hks-forged-pistons",
    name: "Forged piston & stroker kits",
    brand: "HKS / Tomei",
    models: [...EVO_4G63, "evo-10"],
    category: "engine-mods",
    description:
      "Forged internals for high-boost builds on the 4G63 and 4B11T.",
    search: "4G63 forged piston kit HKS Tomei",
  }),
  kit({
    id: "hks-exhaust-evo",
    name: "Hi-Power / Legamax cat-back exhaust",
    brand: "HKS",
    models: ["evo-7-9", "evo-10"],
    category: "exhaust",
    description: "Stainless cat-back exhaust systems for the CT9A and CZ4A.",
    search: "HKS cat-back exhaust Lancer Evolution",
  }),
  kit({
    id: "invidia-exhaust",
    name: "Q300 / N1 cat-back exhaust",
    brand: "Invidia",
    models: ["evo-7-9", "evo-10", "lancer-cy"],
    category: "exhaust",
    description: "Popular stainless cat-back systems with tip options.",
    search: "Invidia Q300 exhaust Lancer Evolution",
  }),
  kit({
    id: "tein-flex",
    name: "Flex Z coilovers",
    brand: "Tein",
    models: [
      "evo-4-6",
      "evo-7-9",
      "evo-10",
      "lancer-ck",
      "lancer-cs",
      "lancer-cy",
    ],
    category: "suspension",
    description: "Height- and damping-adjustable street coilovers.",
    search: "Tein Flex Z coilovers Lancer",
  }),
  kit({
    id: "cusco-strut-bar",
    name: "Strut bars & roll bars",
    brand: "Cusco",
    models: ["evo-4-6", "evo-7-9", "evo-10", "lancer-ck"],
    category: "suspension",
    description:
      "Chassis braces and strut tower bars that stiffen the front end.",
    search: "Cusco strut bar Lancer Evolution",
  }),
  kit({
    id: "ohlins-dfv",
    name: "Road & Track coilovers",
    brand: "Öhlins",
    models: ["evo-7-9", "evo-10"],
    category: "suspension",
    description: "Premium DFV coilovers for fast road and track use.",
    search: "Ohlins Road and Track Evo",
  }),
  kit({
    id: "greddy-intercooler",
    name: "Front-mount intercooler",
    brand: "GReddy",
    models: ["evo-7-9", "evo-10"],
    category: "other",
    description:
      "Larger intercooler cores to keep intake temperatures down after turbo upgrades.",
    search: "GReddy intercooler Lancer Evolution",
  }),
  kit({
    id: "walbro-pump",
    name: "In-tank fuel pump upgrade",
    brand: "Walbro / AEM",
    models: ["evo-4-6", "evo-7-9", "evo-10"],
    category: "engine-mods",
    description:
      "Higher-flow fuel pumps — one of the first supporting mods for more boost.",
    search: "Walbro 255 fuel pump Evo",
  }),
  kit({
    id: "4g15-turbo-kit",
    name: "4G15 turbo conversion kits",
    brand: "Various",
    models: ["lancer-ck"],
    category: "turbo-kits",
    description:
      "Manifold, turbo and piping kits for the 4G15. Quality varies widely — check reviews and fitment.",
    search: "4G15 turbo kit Lancer",
  }),
  kit({
    id: "ck-body-kit",
    name: "CK Lancer body kits",
    brand: "Various",
    models: ["lancer-ck"],
    category: "body-kits",
    description:
      "Front lips, side skirts and Evo-style bumper conversions for the CK Lancer.",
    search: "Lancer CK2A body kit",
  }),
];

/** The query used for the "Search the internet" panel for a model + category. */
export function upgradeQuery(
  model: UpgradeModel,
  category: UpgradeCategory | "all",
): string {
  const term =
    category === "all"
      ? "upgrade"
      : UPGRADE_CATEGORIES.find((c) => c.id === category)?.searchTerm;
  const chassis = model.chassis.split(" / ")[0];
  return buildQuery("Mitsubishi", model.searchName, chassis, term);
}
