import type { Metadata } from "next";
import Link from "next/link";
import { DiagramCatalog } from "@/components/catalog/diagram-catalog";
import { OIL_PAN_DIAGRAM, partsForDiagram } from "@/data/parts";

export const metadata: Metadata = {
  title: "Oil Pan · LancerParts",
};

export default function OilPanPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      <nav className="mb-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">Diagrams</Link> / Oil Pan
      </nav>
      <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">{OIL_PAN_DIAGRAM.title}</h1>
      <DiagramCatalog diagram={OIL_PAN_DIAGRAM} parts={partsForDiagram(OIL_PAN_DIAGRAM.id)} />
    </main>
  );
}
