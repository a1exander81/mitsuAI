/**
 * Full diagram index for the CK2A 1500 2WD Sedan (SNJL1C): 23 categories,
 * 123 diagrams. Names, order, category grouping and the first variant label of
 * each diagram were read from the MegaZip index page on 2026-11-13:
 * https://www.megazip.net/parts/mitsubishi/diagrams/lancer_china/ck2a-ge-1500_2wd_sedan-snjl1c
 *
 * Only the index was read. Part numbers for a diagram are added by hand as each
 * diagram is worked through (see src/data/parts.ts) — MegaZip's robots.txt
 * disallows automated crawling of its diagram pages.
 */

export const MEGAZIP_INDEX_URL =
  "https://www.megazip.net/parts/mitsubishi/diagrams/lancer_china/ck2a-ge-1500_2wd_sedan-snjl1c";

export interface PartModel {
  label: string;
  /** Path under /public. */
  url: string;
  /** Keep the GLB's own materials instead of the flat diagram colour. */
  ownMaterials?: boolean;
  note: string;
}

export interface CatalogDiagram {
  id: string;
  /** 1-based position in the MegaZip "All diagrams" list. */
  number: number;
  name: string;
  /** Variant / applicability label shown on the MegaZip card, if any. */
  variant: string | null;
  categoryId: string;
  /** Position within its category — the 3D models reference diagrams by this. */
  indexInCategory: number;
  /** Set when parts for this diagram are seeded in src/data/parts.ts. */
  partsDiagramId?: string;
  /** Set when a hotspot diagram page exists for it. */
  href?: string;
  /** GLB models of the diagram's main component; the first is shown by default. */
  models?: PartModel[];
}

export interface CatalogCategory {
  id: string;
  name: string;
  diagrams: CatalogDiagram[];
}

type RawDiagram = string | [name: string, variant: string];

const RAW: [category: string, diagrams: RawDiagram[]][] = [
  [
    "Engine",
    [
      "Engine Assy",
      "Short Engine Assy",
      "Engine Overhaul Gasket Kit",
      "Liquid Gasket",
      "Rocker Cover",
      "Cylinder Head",
      "Cylinder Block",
      ["Cover, Rear Plate & Oil Pan", "All (Timing Belt Cover)"],
      ["Piston & Crankshaft", "All (Table For Choosing Bearing)"],
      "Camshaft & Valve",
      "Oil Press Switch Or Gauge Unit",
      ["Engine Mounting & Support", "9906.1- (06.1999-)"],
    ],
  ],
  ["Lubrication", ["Oil Pump & Oil Filter"]],
  [
    "Fuel",
    ["Fuel Tank", "Fuel Line & Vapor Gas Control", "Fuel Pump", ["Carburetor", "All (Assembly)"], "Engine Control"],
  ],
  ["Cooling", [["Radiator, Hose & Condenser Tank", "M/T"], "Water Pump", "Water Pipe & Thermostat"]],
  [
    "Intake & Exhaust",
    ["Air Cleaner", "Inlet Manifold", "Exhaust Manifold", "Exhaust Pipe & Muffler", ["Emission Control", "M/T"]],
  ],
  [
    "Engine Electrical",
    [
      ["Starter", "-9906.3 (-06.1999)"],
      "Alternator & Vacuum Pump",
      "Distributor",
      "Spark Plug, Cable & Coil",
      "Electrical Control",
    ],
  ],
  ["Clutch", ["Clutch & Clutch Release", "Clutch Control"]],
  [
    "Manual Transmission",
    [
      "Manual Transmission Assy",
      ["M/T Case", "All (Clutch Housing)"],
      ["M/T Gear", "All (In/Shaft, O/Shaft)"],
      ["M/T Gearshift Control", "All (Control Shaft)"],
      "M/T Floor Shift Linkage",
    ],
  ],
  ["Front Axle", [["Front Axle Drive Shaft", "Rh"], "Front Axle Hub & Drum"]],
  ["Rear Axle", ["Rear Axle Hub & Drum"]],
  ["Wheel & Tire", [["Wheel, Tire & Cover", "Tire, Wheel Cover Etc."]]],
  ["Front Suspension", ["Front Susp Arm & Member", ["Front Susp Strut & Spring", "-9706.1"]]],
  ["Rear Suspension", [["Rear Susp", "Suspension Arm Etc."]]],
  [
    "Brake",
    [
      "Parking Brake Control",
      "Front Wheel Brake",
      "Rear Wheel Brake",
      "Power Brake Booster",
      ["Brake Line", "Front, exc. ABS"],
      ["Brake & Clutch Pedal", "M/T"],
      ["Brake Master Cylinder", "Exc. ABS"],
    ],
  ],
  [
    "Steering",
    [
      ["Steering Wheel", "W/Air Bag"],
      "Steering Column & Cover",
      ["Steering Gear", "P/S Installing Parts"],
      ["Power Steering Oil Pump", "Oil Pump Installing Parts"],
      ["Power Steering Oil Line", "9812.2- (12.1998-)"],
    ],
  ],
  [
    "Body",
    [
      ["Front Bumper & Support", "-9711.3 (-11.1997)"],
      "Rear Bumper & Support",
      ["Radiator Grille, Headlamp Bezel", "-9711.3 (-11.1997)"],
      "Hood & Lock",
      "Fender & Front End Cover",
      "Front End Panel",
      "Front Deck & Insulator",
      "Windshield Glass & Moulding",
      "Roof & Lid",
      "Side Structure",
      "Fuel Filler Lid & Lock",
      "Floor",
      "Rear End Structure",
      "Rear Window Glass & Moulding",
      "Trunk Lid & Lock",
      "Loose Panel",
      ["Plugs, Covers & Shield", "Splash Shield"],
      "Lock Cylinder & Key",
      "Plate & Label",
    ],
  ],
  [
    "Door",
    [
      "Front Door Panel & Glass",
      "Front Door Window Regulator",
      "Front Door Locking",
      "Front Door Trim & Pull Handle",
      "Rear Door Panel & Glass",
      "Rear Door Window Regulator",
      "Rear Door Locking",
      "Rear Door Trim & Pull Handle",
    ],
  ],
  [
    "Exterior",
    [
      "Front Garnish & Moulding",
      "Side Garnish & Moulding",
      "Rear Garnish & Moulding",
      "Ornament, Mark & Emblem",
      "Outside Rear View Mirror",
      "Mud Guard, Shield & Stone Guard",
    ],
  ],
  [
    "Interior",
    [
      ["I/Panel & Related Parts", "I/Panel Pad, Glovebox, Etc."],
      "Console",
      "Mirror, Grips & Sunvisor",
      "Headlining",
      "Interior Trim",
      ["Baggage Room Trim", "Rear Side & End Trim, Etc."],
      "Floor Mat",
      "Silencer",
    ],
  ],
  ["Seat", [["Front Seat", "Rh"], "Rear Seat", ["Seat Belt", "Front"]]],
  [
    "Chassis Electrical",
    [
      ["Headlamp", "-9711.3 (-11.1997)"],
      ["Front Exterior Lamp", "Turn Signal, Fog Lamp, -9711.3 (-11.1997)"],
      ["Rear Exterior Lamp", "Rr Combination, License Plate Lamp Etc."],
      "Room Lamp",
      ["Windshield Wiper & Washer", "Windshield Wiper"],
      ["Meter, Gauge & Clock", "Combination Meter"],
      ["Switch & Cigar Lighter", "Switch (Around I/Panel)"],
      ["Radio & Audio Accessories", "Radio & Attaching Parts"],
      "Speaker",
      "Antenna & Condenser",
      ["Horn & Buzzer", "-9711.3 (-11.1997)"],
      ["Relay, Flasher & Sensor", "Relay Etc."],
      "Battery Cable & Bracket",
      ["Wiring & Attaching Parts", "Wiring Harness"],
    ],
  ],
  [
    "Heater, A/C & Ventilation",
    [
      ["Heater Unit & Piping", "Heater Unit, Piping"],
      "Heater Control",
      "Defroster Nozzle & Duct",
      ["Ventilation & Duct", "Distribution Duct"],
      "A/C Unit",
      ["A/C Condenser, Piping", "A/C Condenser"],
    ],
  ],
  ["Tool", ["Standard Tool", "Owner's Guide"]],
];

/** Diagrams that already have seeded parts and/or a hotspot page. */
const SEEDED: Record<string, Pick<CatalogDiagram, "partsDiagramId" | "href" | "models">> = {
  "rocker-cover": { partsDiagramId: "rocker-cover" },
  "cylinder-head": { partsDiagramId: "cylinder-head" },
  "cylinder-block": { partsDiagramId: "cylinder-block" },
  "piston-crankshaft": { partsDiagramId: "piston-crankshaft" },
  "camshaft-valve": { partsDiagramId: "camshaft-valve" },
  "oil-press-switch-or-gauge-unit": { partsDiagramId: "oil-press-switch-or-gauge-unit" },
  "engine-mounting-support": { partsDiagramId: "engine-mounting-support" },
  "cover-rear-plate-oil-pan": {
    partsDiagramId: "oil-pan",
    href: "/diagrams/oil-pan",
    models: [
      {
        label: "Scripted",
        url: "/models/oil-pan.scripted.glb",
        ownMaterials: true,
        note: "Oil pan modelled in code (scripts/build-models.mjs). Typical shape, not measured from the CK2A part.",
      },
    ],
  },
  "wheel-tire-cover": {
    models: [
      {
        label: "AI-generated",
        url: "/models/wheel-tire-cover.glb",
        note: "Generated with Tripo text-to-3D. Generic shape, not an exact copy of the CK2A part.",
      },
      {
        label: "Scripted",
        url: "/models/wheel-tire-cover.scripted.glb",
        ownMaterials: true,
        note: "13-inch steel wheel and tire modelled in code (scripts/build-models.mjs). Typical shape, not measured from the CK2A part.",
      },
    ],
  },
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

let counter = 0;

export const CATEGORIES: CatalogCategory[] = RAW.map(([name, diagrams]) => {
  const categoryId = slug(name);
  return {
    id: categoryId,
    name,
    diagrams: diagrams.map((raw, indexInCategory) => {
      const [dName, variant] = typeof raw === "string" ? [raw, null] : raw;
      const id = slug(dName);
      return { id, number: ++counter, name: dName, variant, categoryId, indexInCategory, ...SEEDED[id] };
    }),
  };
});

export const TOTAL_DIAGRAMS = counter;

export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);
