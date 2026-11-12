"use client";

import { useMemo, useState } from "react";
import { sortParts } from "@/lib/sort";
import type { Diagram, Part, SortKey } from "@/lib/types";
import { InteractiveDiagram } from "./interactive-diagram";
import { PartDetailSheet } from "./part-detail-sheet";
import { PartsList } from "./parts-list";
import { SortControls } from "./sort-controls";

interface Props {
  diagram: Diagram;
  parts: Part[];
}

export function DiagramCatalog({ diagram, parts }: Props) {
  const [selected, setSelected] = useState<Part | null>(null);
  const [sort, setSort] = useState<SortKey>("price-asc");

  const sorted = useMemo(() => sortParts(parts, sort), [parts, sort]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section aria-label="Diagram">
        <InteractiveDiagram
          diagram={diagram}
          parts={parts}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
        />
        <p className="mt-2 text-xs text-muted-foreground">Tap a numbered part to see details and buy links.</p>
      </section>

      <section aria-label="Parts" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">Parts ({parts.length})</h2>
          <SortControls value={sort} onChange={setSort} />
        </div>
        <PartsList parts={sorted} selectedId={selected?.id ?? null} onSelect={setSelected} />
        <p className="text-xs text-muted-foreground">
          Prices are rough estimates until real listings are added.
        </p>
      </section>

      <PartDetailSheet part={selected} sort={sort} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
