"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MapArea } from "react-img-mapper";
import { partNumber } from "@/data/parts";
import type { Diagram, Part } from "@/lib/types";
import { cn } from "@/lib/utils";

// react-img-mapper draws on <canvas> and reads image dimensions — client only.
const ImageMapper = dynamic(() => import("react-img-mapper"), {
  ssr: false,
  loading: () => <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-muted" />,
});

interface Props {
  diagram: Diagram;
  parts: Part[];
  selectedId: string | null;
  onSelect: (part: Part) => void;
}

export function InteractiveDiagram({ diagram, parts, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Track container width so hotspots scale with the image on any screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const areas: MapArea[] = useMemo(
    () =>
      parts.map((p) => ({
        id: p.id,
        shape: p.hotspot.shape,
        coords: p.hotspot.coords,
        active: p.id === selectedId,
        // Black-and-white drawing: hotspots stay invisible until hovered or selected.
        preFillColor: p.id === selectedId ? "rgba(0, 0, 0, 0.16)" : "rgba(0, 0, 0, 0)",
        fillColor: "rgba(0, 0, 0, 0.12)",
        strokeColor: p.id === selectedId ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0)",
        lineWidth: 2,
      })),
    [parts, selectedId],
  );

  const byId = useMemo(() => new Map(parts.map((p) => [p.id, p])), [parts]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg border bg-white"
      // Prevent the iOS grey tap flash on <area> elements.
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {width > 0 && (
        <ImageMapper
          name={diagram.id}
          src={diagram.src}
          areas={areas}
          responsive
          parentWidth={width}
          imgWidth={diagram.width}
          areaProps={{ style: { cursor: "pointer" } }}
          imgProps={{ alt: diagram.title }}
          onClick={(area) => {
            const part = byId.get(area.id);
            if (part) onSelect(part);
          }}
        />
      )}
      {/* Numbered callouts, drawn by the app so they stay sharp and match the parts list. */}
      {width > 0 &&
        parts.map((p) => (
          <span
            key={p.id}
            aria-hidden
            className={cn(
              "pointer-events-none absolute z-10 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black bg-white text-xs font-bold text-black sm:size-7 sm:text-sm",
              p.id === selectedId && "bg-black text-white",
            )}
            style={{
              left: `${(p.hotspot.label[0] / diagram.width) * 100}%`,
              top: `${(p.hotspot.label[1] / diagram.height) * 100}%`,
            }}
          >
            {partNumber(p)}
          </span>
        ))}
    </div>
  );
}
