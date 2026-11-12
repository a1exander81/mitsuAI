"use client";

import { ChevronRight } from "lucide-react";
import { formatPhp } from "@/lib/sort";
import type { Part } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  parts: Part[];
  selectedId: string | null;
  onSelect: (part: Part) => void;
}

/** Tappable list mirroring the hotspots — easier than tiny areas on a phone. */
export function PartsList({ parts, selectedId, onSelect }: Props) {
  return (
    <ul className="divide-y rounded-lg border">
      {parts.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            onClick={() => onSelect(p)}
            className={cn(
              "flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted",
              p.id === selectedId && "bg-muted",
            )}
          >
            <span className="flex h-7 w-16 shrink-0 items-center justify-center rounded-md border border-blue-700 font-mono text-[11px] font-bold text-blue-700">
              {p.callout}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{p.name}</span>
              <span className="block font-mono text-xs text-muted-foreground">
                {p.oemNumber ?? "OEM # TBD"}
              </span>
            </span>
            <span className="text-right text-sm tabular-nums">
              {formatPhp(p.estPricePhp.min)}+
            </span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        </li>
      ))}
    </ul>
  );
}
