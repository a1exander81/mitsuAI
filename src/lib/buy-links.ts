import type { Part, SortKey } from "./types";

export interface BuyLink {
  source: "shopee" | "lazada" | "facebook";
  label: string;
  url: string;
}

const VEHICLE = "Mitsubishi Lancer 4G15";

/** OEM number when known (most precise), otherwise a descriptive search. */
export function searchQuery(part: Pick<Part, "oemNumber" | "name">): string {
  return part.oemNumber ?? `${VEHICLE} ${part.name}`;
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
  const q = searchQuery(part);
  return [
    { source: "shopee", label: "Shopee", url: shopeeUrl(q, sort) },
    { source: "lazada", label: "Lazada", url: lazadaUrl(q, sort) },
    { source: "facebook", label: "FB Marketplace", url: facebookUrl(q, sort) },
  ];
}
