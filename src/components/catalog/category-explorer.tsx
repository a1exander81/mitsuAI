"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MEGAZIP_INDEX_URL, TOTAL_DIAGRAMS, type CatalogCategory, type CatalogDiagram } from "@/data/catalog";
import { diagramColor, MODELS } from "@/data/models";
import { DIAGRAMS, partsForDiagram } from "@/data/parts";
import { ebayUrl, facebookUrl, lazadaUrl, searchQuery, shopeeUrl } from "@/lib/buy-links";
import type { Part } from "@/lib/types";
import { cn } from "@/lib/utils";
import { InteractiveDiagram } from "./interactive-diagram";
import { PartDetailSheet } from "./part-detail-sheet";

// WebGL only exists in the browser.
const CategoryViewer3D = dynamic(() => import("./category-viewer-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[52dvh] min-h-80 items-center justify-center rounded-xl border bg-muted/40 text-sm text-muted-foreground lg:h-[68dvh]">
      Loading 3D model…
    </div>
  ),
});

export function CategoryExplorer({ category }: { category: CatalogCategory }) {
  // Open on the first diagram that has an illustration, so the page starts with something recognisable.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    const first = category.diagrams.find((d) => d.partsDiagramId && DIAGRAMS[d.partsDiagramId]);
    return first ? first.indexInCategory : null;
  });
  // Which view to show; kept when switching diagrams so a 3D user stays in 3D.
  const [viewKey, setViewKey] = useState("illustration");
  const [part, setPart] = useState<Part | null>(null);
  const selected = selectedIndex !== null ? category.diagrams[selectedIndex] : null;
  const illustration = selected?.partsDiagramId ? DIAGRAMS[selected.partsDiagramId] : undefined;
  const illustrationParts = useMemo(() => (illustration ? partsForDiagram(illustration.id) : []), [illustration]);

  // Views for the selected diagram: the black-and-white illustration, the category's 3D model
  // (with this diagram highlighted), then any generated or scripted 3D part models.
  const views = [
    ...(illustration ? [{ key: "illustration", label: "Illustration", model: null }] : []),
    { key: "3d", label: "3D", model: null },
    ...(selected?.models ?? []).map((m) => ({ key: `3d-${m.label}`, label: `3D · ${m.label}`, model: m })),
  ];
  const view = views.find((v) => v.key === viewKey) ?? views[0];
  const model = view.model;
  const showIllustration = view.key === "illustration";

  const select = (index: number | null) => {
    setSelectedIndex(index);
    setPart(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section aria-label="3D model">
        {showIllustration && illustration ? (
          <InteractiveDiagram
            diagram={illustration}
            parts={illustrationParts}
            selectedId={part?.id ?? null}
            onSelect={setPart}
          />
        ) : (
          <CategoryViewer3D
            pieces={MODELS[category.id] ?? []}
            diagrams={category.diagrams}
            selectedIndex={selectedIndex}
            onSelect={select}
            modelUrl={model?.url ?? null}
            ownMaterials={model?.ownMaterials}
          />
        )}
        {views.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="View">
            {views.map((v) => (
              <Button
                key={v.key}
                size="sm"
                variant={v === view ? "default" : "outline"}
                aria-pressed={v === view}
                onClick={() => setViewKey(v.key)}
              >
                {v.label}
              </Button>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          {showIllustration && illustration
            ? "Tap a numbered part to see its OEM number and buy links. Illustration shows typical part shapes."
            : model
            ? `${model.note} Deselect the diagram to return to the category view.`
            : "Drag to rotate, pinch or scroll to zoom, tap a part to select it. Simplified illustration — not to scale."}
        </p>
      </section>

      <section aria-label="Diagrams" className="flex flex-col gap-4">
        {selected ? (
          <DiagramDetail diagram={selected} categoryName={category.name} />
        ) : (
          <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Select a part of the model or a diagram below to see its data.
          </p>
        )}

        <div>
          <h2 className="mb-2 font-semibold">Diagrams ({category.diagrams.length})</h2>
          <ul className="flex flex-col gap-1.5">
            {category.diagrams.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  aria-pressed={d.indexInCategory === selectedIndex}
                  onClick={() => select(d.indexInCategory === selectedIndex ? null : d.indexInCategory)}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                    d.indexInCategory === selectedIndex && "border-foreground bg-muted",
                  )}
                >
                  <span
                    aria-hidden
                    className="size-3 shrink-0 rounded-full"
                    style={{ background: diagramColor(d.indexInCategory) }}
                  />
                  <span className="min-w-0 flex-1 font-medium">{d.name}</span>
                  {d.models && <Badge variant="secondary">3D model</Badge>}
                  {d.partsDiagramId && <Badge>Parts ready</Badge>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <PartDetailSheet part={part} sort="price-asc" onOpenChange={(open) => !open && setPart(null)} />
    </div>
  );
}

function DiagramDetail({ diagram, categoryName }: { diagram: CatalogDiagram; categoryName: string }) {
  const parts = diagram.partsDiagramId ? partsForDiagram(diagram.partsDiagramId) : [];
  const query = searchQuery(diagram.name, diagram.categoryId);
  const links = [
    { label: "Shopee", url: shopeeUrl(query) },
    { label: "Lazada", url: lazadaUrl(query) },
    { label: "FB Marketplace", url: facebookUrl(query) },
    { label: "eBay Philippines", url: ebayUrl(query, "ph") },
    { label: "eBay US", url: ebayUrl(query, "us") },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl border p-4" aria-live="polite">
      <div>
        <h3 className="text-lg font-semibold">{diagram.name}</h3>
        <dl className="mt-2 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Category</dt>
            <dd className="font-medium">{categoryName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Diagram</dt>
            <dd className="font-medium">
              {diagram.number} of {TOTAL_DIAGRAMS}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Variant shown on MegaZip</dt>
            <dd className="font-medium">{diagram.variant ?? "All"}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h4 className="mb-1.5 text-sm font-semibold">Parts</h4>
        {parts.length > 0 ? (
          <ul className="divide-y rounded-lg border text-sm">
            {parts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="min-w-0">{p.name}</span>
                <span className="shrink-0 font-mono">{p.oemNumber ?? "TBD"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            OEM numbers for this diagram haven&apos;t been added yet. Open it on MegaZip for the full parts list.
          </p>
        )}
        {diagram.href && (
          <Button asChild className="mt-2 h-11 w-full">
            <Link href={diagram.href}>Open interactive diagram</Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold">Search for these parts</h4>
        <p className="text-xs text-muted-foreground">Searches for “{query}”.</p>
        {links.map((l) => (
          <Button key={l.label} asChild variant="outline" className="h-11 justify-between">
            <a href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label}
              <ExternalLink className="size-4" />
            </a>
          </Button>
        ))}
        <a
          href={MEGAZIP_INDEX_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground underline underline-offset-2"
        >
          Source: MegaZip CK2A 1500 catalog — find “{diagram.name}” under {categoryName}
        </a>
      </div>
    </div>
  );
}
