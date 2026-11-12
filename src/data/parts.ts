import type { Diagram, Part } from "@/lib/types";

/**
 * Seed data for the "Cover, Rear Plate & Oil Pan" group.
 *
 * OEM numbers and callout codes were read from the MegaZip catalog for
 * CK2A 1500 2WD Sedan (SNJL1C), Mar 1996 – Sep 2000, on 2026-11-13:
 * https://www.megazip.net/parts/mitsubishi/diagrams/lancer_china/ck2a-ge-1500_2wd_sedan-snjl1c
 *
 * Exception: MD030133 (oil pan gasket) is a genuine Mitsubishi number but is
 * NOT in the CK2A diagram — the factory seals this pan with liquid gasket.
 * It stays `verified: false` until fit is confirmed on the car.
 *
 * estPricePhp values are rough placeholders so sorting has something to work
 * with. Replace with real listing data (the `listings` table) in Batch 5.
 */

export const OIL_PAN_DIAGRAM: Diagram = {
  id: "oil-pan",
  title: "Cover, Rear Plate & Oil Pan — 4G15 (CK2A 1500)",
  src: "/diagrams/oil-pan.svg",
  width: 800,
  height: 600,
};

export const PARTS: Part[] = [
  {
    id: "oil-pan-gasket",
    oemNumber: "MD030133",
    verified: false,
    name: "Oil pan gasket",
    description:
      "Formed gasket that seals the oil pan flange to the cylinder block. Used in place of (or with) liquid gasket when refitting the pan.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: "GASKET",
    hotspot: { shape: "rect", coords: [196, 334, 584, 364] },
    imageUrl: null,
    notes:
      "Genuine Mitsubishi number, but not listed in the CK2A 1500 catalog — the factory uses liquid gasket here and MegaZip lists this gasket for the Mirage C11A. Check fit before buying.",
    estPricePhp: { min: 350, max: 900 },
    addedAt: "2026-11-01",
  },
  {
    id: "oil-pan",
    oemNumber: "MD322857",
    verified: true,
    name: "Oil pan",
    description:
      "Stamped steel sump that holds the engine oil. Check for dents or cracks near the drain boss after hitting road debris.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: "01500",
    hotspot: {
      shape: "poly",
      coords: [208, 364, 572, 364, 545, 440, 400, 440, 390, 505, 260, 505, 250, 440, 232, 440],
    },
    imageUrl: null,
    estPricePhp: { min: 1800, max: 4500 },
    addedAt: "2026-11-05",
  },
  {
    id: "drain-plug",
    oemNumber: "MD050316",
    verified: true,
    name: "Oil pan drain plug",
    description:
      "Threaded plug at the lowest point of the oil pan. Replace if the hex is rounded or the threads are damaged.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: "01512",
    hotspot: { shape: "rect", coords: [64, 450, 134, 506] },
    imageUrl: null,
    estPricePhp: { min: 120, max: 350 },
    addedAt: "2026-11-12",
  },
  {
    id: "drain-plug-gasket",
    oemNumber: "MD050317",
    verified: true,
    name: "Drain plug gasket",
    description:
      "Crush washer for the oil drain plug (13.85 mm). Single-use — replace at every oil change to prevent drips.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: "01521",
    hotspot: { shape: "circle", coords: [190, 478, 24] },
    imageUrl: null,
    estPricePhp: { min: 20, max: 80 },
    addedAt: "2026-11-10",
  },
  {
    id: "oil-pan-bolt",
    oemNumber: "MD097012",
    verified: true,
    name: "Oil pan bolt",
    description:
      "6×10 mm flange bolt that holds the oil pan to the block. The engine uses 18 of them — replace any that are stretched or corroded.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: "01597",
    hotspot: { shape: "rect", coords: [592, 384, 648, 426] },
    imageUrl: null,
    notes: "18 pcs per engine.",
    estPricePhp: { min: 15, max: 60 },
    addedAt: "2026-11-13",
  },
  {
    id: "oil-strainer",
    oemNumber: "MD312334",
    verified: true,
    name: "Oil strainer (pickup)",
    description:
      "Mesh pickup that feeds the oil pump. A clogged strainer starves the engine of oil pressure — inspect whenever the pan is off.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: "04124",
    hotspot: { shape: "rect", coords: [290, 278, 392, 316] },
    imageUrl: null,
    estPricePhp: { min: 600, max: 1500 },
    addedAt: "2026-11-08",
  },
  {
    id: "oil-strainer-gasket",
    oemNumber: "MD183238",
    verified: true,
    name: "Oil strainer gasket",
    description:
      "Seals the strainer flange to the oil pump inlet. Replace whenever the strainer is removed so the pump doesn't draw air.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: "04161",
    hotspot: { shape: "rect", coords: [220, 254, 288, 290] },
    imageUrl: null,
    estPricePhp: { min: 50, max: 180 },
    addedAt: "2026-11-13",
  },
  {
    id: "rear-plate",
    oemNumber: "MD320869",
    verified: true,
    name: "Cylinder block rear plate",
    description:
      "Steel plate sandwiched between the engine block and the transmission bellhousing. Normally only replaced if bent or badly rusted.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: "02122",
    hotspot: { shape: "poly", coords: [520, 50, 640, 40, 665, 90, 660, 190, 560, 205, 515, 150] },
    imageUrl: null,
    notes: "MegaZip shows a replacement (superseding) number for this part — check before ordering.",
    estPricePhp: { min: 900, max: 2500 },
    addedAt: "2026-11-13",
  },
];

export const partsForDiagram = (diagramId: string) =>
  PARTS.filter((p) => p.diagramId === diagramId);
