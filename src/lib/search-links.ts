import { ebayUrl, lazadaUrl, shopeeUrl } from "./buy-links";

export interface SearchLink {
  id: "shopee" | "lazada" | "google" | "ebay";
  label: string;
  url: string;
}

/** Joins non-empty query parts into one search phrase, e.g. "Mitsubishi Lancer Evolution IX CT9A turbo kit". */
export function buildQuery(
  ...parts: (string | undefined | null | false)[]
): string {
  return parts
    .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function googleUrl(query: string): string {
  return `https://www.google.com/search?${new URLSearchParams({ q: query })}`;
}

/** Marketplace + web search links for a free-text query. Reuses the catalog's buy-link builders. */
export function searchLinks(query: string): SearchLink[] {
  return [
    { id: "shopee", label: "Shopee PH", url: shopeeUrl(query) },
    { id: "lazada", label: "Lazada PH", url: lazadaUrl(query) },
    { id: "google", label: "Google", url: googleUrl(query) },
    { id: "ebay", label: "eBay", url: ebayUrl(query, "us") },
  ];
}
