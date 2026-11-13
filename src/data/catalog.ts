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
    [
      "Fuel Tank",
      "Fuel Line & Vapor Gas Control",
      "Fuel Pump",
      ["Carburetor", "All (Assembly)"],
      "Engine Control",
    ],
  ],
  [
    "Cooling",
    [
      ["Radiator, Hose & Condenser Tank", "M/T"],
      "Water Pump",
      "Water Pipe & Thermostat",
    ],
  ],
  [
    "Intake & Exhaust",
    [
      "Air Cleaner",
      "Inlet Manifold",
      "Exhaust Manifold",
      "Exhaust Pipe & Muffler",
      ["Emission Control", "M/T"],
    ],
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
  [
    "Front Suspension",
    ["Front Susp Arm & Member", ["Front Susp Strut & Spring", "-9706.1"]],
  ],
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
const SEEDED: Record<
  string,
  Pick<CatalogDiagram, "partsDiagramId" | "href" | "models">
> = {
  starter: {
    partsDiagramId: "starter",
    models: [
      {
        label: "Generated",
        url: "/models/starter.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "alternator-vacuum-pump": {
    partsDiagramId: "alternator-vacuum-pump",
    models: [
      {
        label: "Generated",
        url: "/models/alternator-vacuum-pump.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  distributor: {
    partsDiagramId: "distributor",
    models: [
      {
        label: "Generated",
        url: "/models/distributor.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "spark-plug-cable-coil": {
    partsDiagramId: "spark-plug-cable-coil",
    models: [
      {
        label: "Generated",
        url: "/models/spark-plug-cable-coil.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "electrical-control": { partsDiagramId: "electrical-control" },
  "clutch-clutch-release": {
    partsDiagramId: "clutch-clutch-release",
    models: [
      {
        label: "Generated",
        url: "/models/clutch-clutch-release.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "clutch-control": {
    partsDiagramId: "clutch-control",
    models: [
      {
        label: "Generated",
        url: "/models/clutch-control.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "manual-transmission-assy": {
    partsDiagramId: "manual-transmission-assy",
    models: [
      {
        label: "Generated",
        url: "/models/manual-transmission-assy.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "m-t-case": {
    partsDiagramId: "m-t-case",
    models: [
      {
        label: "Generated",
        url: "/models/m-t-case.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "m-t-gear": {
    partsDiagramId: "m-t-gear",
    models: [
      {
        label: "Generated",
        url: "/models/m-t-gear.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "m-t-gearshift-control": {
    partsDiagramId: "m-t-gearshift-control",
    models: [
      {
        label: "Generated",
        url: "/models/m-t-gearshift-control.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "m-t-floor-shift-linkage": {
    partsDiagramId: "m-t-floor-shift-linkage",
    models: [
      {
        label: "Generated",
        url: "/models/m-t-floor-shift-linkage.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "rocker-cover": {
    partsDiagramId: "rocker-cover",
    models: [
      {
        label: "Generated",
        url: "/models/rocker-cover.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "cylinder-head": {
    partsDiagramId: "cylinder-head",
    models: [
      {
        label: "Generated",
        url: "/models/cylinder-head.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "cylinder-block": {
    partsDiagramId: "cylinder-block",
    models: [
      {
        label: "Generated",
        url: "/models/cylinder-block.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "piston-crankshaft": {
    partsDiagramId: "piston-crankshaft",
    models: [
      {
        label: "Generated",
        url: "/models/piston-crankshaft.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "camshaft-valve": {
    partsDiagramId: "camshaft-valve",
    models: [
      {
        label: "Generated",
        url: "/models/camshaft-valve.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "oil-press-switch-or-gauge-unit": {
    partsDiagramId: "oil-press-switch-or-gauge-unit",
    models: [
      {
        label: "Generated",
        url: "/models/oil-press-switch-or-gauge-unit.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "engine-mounting-support": {
    partsDiagramId: "engine-mounting-support",
    models: [
      {
        label: "Generated",
        url: "/models/engine-mounting-support.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "engine-assy": {
    partsDiagramId: "engine-assy",
    models: [
      {
        label: "Generated",
        url: "/models/engine-assy.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "short-engine-assy": {
    partsDiagramId: "short-engine-assy",
    models: [
      {
        label: "Generated",
        url: "/models/short-engine-assy.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "engine-overhaul-gasket-kit": {
    partsDiagramId: "engine-overhaul-gasket-kit",
  },
  "liquid-gasket": { partsDiagramId: "liquid-gasket" },
  "fuel-tank": {
    partsDiagramId: "fuel-tank",
    models: [
      {
        label: "Generated",
        url: "/models/fuel-tank.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "fuel-line-vapor-gas-control": {
    partsDiagramId: "fuel-line-vapor-gas-control",
    models: [
      {
        label: "Generated",
        url: "/models/fuel-line-vapor-gas-control.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "fuel-pump": {
    partsDiagramId: "fuel-pump",
    models: [
      {
        label: "Generated",
        url: "/models/fuel-pump.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  carburetor: {
    partsDiagramId: "carburetor",
    models: [
      {
        label: "Generated",
        url: "/models/carburetor.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "engine-control": {
    partsDiagramId: "engine-control",
    models: [
      {
        label: "Generated",
        url: "/models/engine-control.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "air-cleaner": {
    partsDiagramId: "air-cleaner",
    models: [
      {
        label: "Generated",
        url: "/models/air-cleaner.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "inlet-manifold": {
    partsDiagramId: "inlet-manifold",
    models: [
      {
        label: "Generated",
        url: "/models/inlet-manifold.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "exhaust-manifold": {
    partsDiagramId: "exhaust-manifold",
    models: [
      {
        label: "Generated",
        url: "/models/exhaust-manifold.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "exhaust-pipe-muffler": {
    partsDiagramId: "exhaust-pipe-muffler",
    models: [
      {
        label: "Generated",
        url: "/models/exhaust-pipe-muffler.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "emission-control": {
    partsDiagramId: "emission-control",
    models: [
      {
        label: "Generated",
        url: "/models/emission-control.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "oil-pump-oil-filter": {
    partsDiagramId: "oil-pump-oil-filter",
    models: [
      {
        label: "Generated",
        url: "/models/oil-pump-oil-filter.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "radiator-hose-condenser-tank": {
    partsDiagramId: "radiator-hose-condenser-tank",
    models: [
      {
        label: "Generated",
        url: "/models/radiator-hose-condenser-tank.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "water-pump": {
    partsDiagramId: "water-pump",
    models: [
      {
        label: "Generated",
        url: "/models/water-pump.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "water-pipe-thermostat": {
    partsDiagramId: "water-pipe-thermostat",
    models: [
      {
        label: "Generated",
        url: "/models/water-pipe-thermostat.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
    ],
  },
  "cover-rear-plate-oil-pan": {
    partsDiagramId: "oil-pan",
    href: "/diagrams/oil-pan",
    models: [
      {
        label: "Generated",
        url: "/models/cover-rear-plate-oil-pan.glb",
        ownMaterials: true,
        note: "3D model generated with Higgsfield (Tripo) from an AI studio image. Typical shape, not an exact copy of the CK2A part.",
      },
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
      return {
        id,
        number: ++counter,
        name: dName,
        variant,
        categoryId,
        indexInCategory,
        ...SEEDED[id],
      };
    }),
  };
});

export const TOTAL_DIAGRAMS = counter;

export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);
