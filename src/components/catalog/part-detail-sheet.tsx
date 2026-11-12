"use client";

import { ExternalLink, ImageIcon, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { buildBuyLinks } from "@/lib/buy-links";
import { formatPhp } from "@/lib/sort";
import type { Part, SortKey } from "@/lib/types";

interface Props {
  part: Part | null;
  sort: SortKey;
  onOpenChange: (open: boolean) => void;
}

export function PartDetailSheet({ part, sort, onOpenChange }: Props) {
  // Bottom sheet on phones (thumb-reachable), side panel on tablet/desktop.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Sheet open={!!part} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className={isDesktop ? "w-full sm:max-w-md" : "max-h-[85dvh] rounded-t-2xl"}
      >
        {part && <PartDetail part={part} sort={sort} />}
      </SheetContent>
    </Sheet>
  );
}

function PartDetail({ part, sort }: { part: Part; sort: SortKey }) {
  const links = buildBuyLinks(part, sort);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-6">
      <SheetHeader className="px-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono">{part.callout}</Badge>
          <span className="font-mono text-lg font-semibold tracking-wide">
            {part.oemNumber ?? "OEM # TBD"}
          </span>
          {part.verified ? (
            <Badge>Verified</Badge>
          ) : (
            <Badge variant="outline" className="gap-1">
              <TriangleAlert className="size-3" /> Verify
            </Badge>
          )}
        </div>
        <SheetTitle className="text-xl">{part.name}</SheetTitle>
        <SheetDescription>{part.description}</SheetDescription>
      </SheetHeader>

      {/* Image placeholder — swap for Higgsfield-generated photo via part.imageUrl */}
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-dashed bg-muted text-muted-foreground">
        {part.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={part.imageUrl} alt={part.name} className="h-full w-full rounded-lg object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm">
            <ImageIcon className="size-8" />
            Image coming soon
          </div>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Est. price</dt>
          <dd className="font-medium">
            {formatPhp(part.estPricePhp.min)} – {formatPhp(part.estPricePhp.max)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Category</dt>
          <dd className="font-medium capitalize">{part.category.replace("-", " ")}</dd>
        </div>
      </dl>
      {part.notes && <p className="text-xs text-muted-foreground">{part.notes}</p>}

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Buy</h3>
        {links.map((l) => (
          <Button key={l.source} asChild variant="outline" size="lg" className="h-12 justify-between">
            <a href={l.url} target="_blank" rel="noopener noreferrer">
              Search on {l.label}
              <ExternalLink className="size-4" />
            </a>
          </Button>
        ))}
        <p className="text-xs text-muted-foreground">
          Links open marketplace search results{sort === "price-asc" ? " sorted by price" : sort === "newest" ? " sorted by newest where supported" : ""}.
        </p>
      </div>
    </div>
  );
}
