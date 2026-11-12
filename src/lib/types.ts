// Mirrors the `parts` table in CLAUDE.md §5 so the JSON seed can move to Supabase later.

export type HotspotShape = "rect" | "circle" | "poly";

export interface Hotspot {
  shape: HotspotShape;
  /** Pixel coords in the diagram's natural size (see Diagram.width/height). */
  coords: number[];
}

export interface Part {
  id: string;
  /** null = not yet confirmed from the MegaZip CK2A 1500 catalog. */
  oemNumber: string | null;
  verified: boolean;
  name: string;
  description: string;
  category: "oil-pan" | "steering" | "suspension";
  diagramId: string;
  /** Callout code printed on the diagram (MegaZip PNC, e.g. "01500"). */
  callout: string;
  hotspot: Hotspot;
  imageUrl: string | null;
  notes?: string;
  /** Placeholder PHP price range until real listing data exists. */
  estPricePhp: { min: number; max: number };
  /** ISO date the entry was added — drives "Newest" sort until listings exist. */
  addedAt: string;
}

export interface Diagram {
  id: string;
  title: string;
  src: string;
  width: number;
  height: number;
}

export type SortKey = "price-asc" | "newest";
