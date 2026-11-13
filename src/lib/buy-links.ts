import type { Part, SortKey } from "./types";

export interface BuyLink {
  source: "shopee" | "lazada" | "facebook";
  label: string;
  /** Search by part name plus engine or car model — matches how sellers title listings. */
  url: string;
  /** Exact search by OEM number, when one is known. Fewer results, but precise. */
  oemUrl: string | null;
}

/** Added to engine-part searches: sellers list these by engine code. */
export const ENGINE_MODEL = "Mitsubishi 4G15";
/** Added to body/chassis-part searches. "Pizza" is the PH nickname for the 1997–2002 Lancer. */
export const CAR_MODEL = "Mitsubishi Lancer Pizza";

/** Catalog categories (and part categories) whose parts are engine-specific rather than car-specific. */
const ENGINE_CATEGORIES = new Set([
  "engine",
  "lubrication",
  "fuel",
  "cooling",
  "intake-exhaust",
  "engine-electrical",
  "clutch",
  "manual-transmission",
  "oil-pan",
]);

export const modelFor = (category: string) => (ENGINE_CATEGORIES.has(category) ? ENGINE_MODEL : CAR_MODEL);

/** "Oil strainer (pickup)" → "Oil strainer pickup"; "Cover, Rear Plate & Oil Pan" → "Cover Rear Plate Oil Pan". */
const plainName = (name: string) => name.replace(/[(),&/]/g, " ").replace(/\s+/g, " ").trim();

/** Descriptive search: engine or car model + part name, e.g. "Mitsubishi 4G15 Oil pan". */
export function searchQuery(name: string, category: string): string {
  return `${modelFor(category)} ${plainName(name)}`;
}

export function shopeeUrl(query: string, sort?: SortKey): string {
  const p = new URLSearchParams({ keyword: query });
  if (sort === "price-asc") {
    p.set("sortBy", "price");
    p.set("order", "asc");
  } else if (sort === "newest") {
    p.set("sortBy", "ctime");
  }
  return `https://shopee.ph/search?${p}`;
}

export function lazadaUrl(query: string, sort?: SortKey): string {
  const p = new URLSearchParams({ q: query });
  // Lazada has no public "newest" sort param; it falls back to best match.
  if (sort === "price-asc") p.set("sort", "priceasc");
  return `https://www.lazada.com.ph/catalog/?${p}`;
}

export function facebookUrl(query: string, sort?: SortKey): string {
  const p = new URLSearchParams({ query });
  if (sort === "price-asc") p.set("sortBy", "price_ascend");
  else if (sort === "newest") p.set("sortBy", "creation_time_descend");
  return `https://www.facebook.com/marketplace/search/?${p}`;
}

export function buildBuyLinks(part: Part, sort?: SortKey): BuyLink[] {
  const q = searchQuery(part.name, part.category);
  const oem = part.oemNumber;
  return [
    { source: "shopee", label: "Shopee", url: shopeeUrl(q, sort), oemUrl: oem && shopeeUrl(oem, sort) },
    { source: "lazada", label: "Lazada", url: lazadaUrl(q, sort), oemUrl: oem && lazadaUrl(oem, sort) },
    { source: "facebook", label: "FB Marketplace", url: facebookUrl(q, sort), oemUrl: oem && facebookUrl(oem, sort) },
  ];
}
