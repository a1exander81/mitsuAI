import type { Part, SortKey } from "./types";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "price-asc", label: "Price: low → high" },
  { value: "newest", label: "Newest first" },
];

export function sortParts(parts: Part[], sort: SortKey): Part[] {
  const copy = [...parts];
  if (sort === "price-asc") {
    copy.sort((a, b) => a.estPricePhp.min - b.estPricePhp.min);
  } else {
    copy.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  }
  return copy;
}

export const formatPhp = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);
