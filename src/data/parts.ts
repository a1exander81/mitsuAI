import type { Diagram, Part } from "@/lib/types";

/**
 * Seed data — Batch 1.
 *
 * OEM numbers: only MD030133 is confirmed (CLAUDE.md §11). Everything else is
 * `verified: false` or `oemNumber: null` and must be checked against the
 * MegaZip CK2A 1500 → Engine → "Cover, Rear Plate & Oil Pan" group.
 *
 * estPricePhp values are rough placeholders so sorting has something to work
 * with. Replace with real listing data (the `listings` table) in Batch 5.
 */

export const OIL_PAN_DIAGRAM: Diagram = {
  id: "oil-pan",
  title: "Oil Pan — 4G15 (CK2A 1500)",
  src: "/diagrams/oil-pan.svg",
  width: 800,
  height: 600,
};

export const PARTS: Part[] = [
  {
    id: "oil-pan-gasket",
    oemNumber: "MD030133",
    verified: true,
    name: "Oil pan gasket",
    description:
      "Seals the oil pan to the bottom of the cylinder block. Replace whenever the pan is removed or if you see oil seeping along the pan flange.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: 2,
    hotspot: { shape: "rect", coords: [110, 182, 690, 238] },
    imageUrl: null,
    notes: "Confirmed for CK2A 4G15.",
    estPricePhp: { min: 350, max: 900 },
    addedAt: "2026-11-01",
  },
  {
    id: "oil-pan",
    oemNumber: null,
    verified: false,
    name: "Oil pan",
    description:
      "Stamped steel sump that holds the engine oil. Check for dents or cracks near the drain boss after hitting road debris.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: 3,
    hotspot: {
      shape: "poly",
      coords: [120, 270, 680, 270, 640, 410, 520, 410, 520, 505, 280, 505, 280, 410, 160, 410],
    },
    imageUrl: null,
    notes: "OEM number TBD — pull from MegaZip CK2A 1500.",
    estPricePhp: { min: 1800, max: 4500 },
    addedAt: "2026-11-05",
  },
  {
    id: "oil-strainer",
    oemNumber: null,
    verified: false,
    name: "Oil strainer (pickup)",
    description:
      "Mesh pickup that feeds the oil pump. A clogged strainer starves the engine of oil pressure — inspect whenever the pan is off.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: 1,
    hotspot: { shape: "rect", coords: [250, 48, 450, 162] },
    imageUrl: null,
    notes: "OEM number TBD — pull from MegaZip CK2A 1500.",
    estPricePhp: { min: 600, max: 1500 },
    addedAt: "2026-11-08",
  },
  {
    id: "drain-plug-gasket",
    oemNumber: "MD050317",
    verified: false,
    name: "Drain plug gasket",
    description:
      "Crush washer for the oil drain plug. Single-use — replace at every oil change to prevent drips.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: 4,
    hotspot: { shape: "circle", coords: [600, 468, 24] },
    imageUrl: null,
    notes: "Number from earlier research; confirm against the diagram.",
    estPricePhp: { min: 20, max: 80 },
    addedAt: "2026-11-10",
  },
  {
    id: "drain-plug",
    oemNumber: "MD050316",
    verified: false,
    name: "Oil drain plug",
    description:
      "Threaded bolt at the lowest point of the oil pan. Replace if the hex is rounded or the threads are damaged.",
    category: "oil-pan",
    diagramId: "oil-pan",
    callout: 5,
    hotspot: { shape: "circle", coords: [690, 468, 32] },
    imageUrl: null,
    notes: "Common Mitsubishi drain bolt number; not yet confirmed in the CK2A 1500 catalog.",
    estPricePhp: { min: 120, max: 350 },
    addedAt: "2026-11-12",
  },
];

export const partsForDiagram = (diagramId: string) =>
  PARTS.filter((p) => p.diagramId === diagramId);
