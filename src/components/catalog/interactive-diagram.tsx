"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MapArea } from "react-img-mapper";
import type { Diagram, Part } from "@/lib/types";

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
        preFillColor: "rgba(220, 38, 38, 0.08)",
        fillColor: "rgba(220, 38, 38, 0.30)",
        strokeColor: "rgba(220, 38, 38, 0.9)",
        lineWidth: 2,
      })),
    [parts, selectedId],
  );

  const byId = useMemo(() => new Map(parts.map((p) => [p.id, p])), [parts]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-lg border bg-white"
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
    </div>
  );
}
