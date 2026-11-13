import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES, TOTAL_DIAGRAMS } from "@/data/catalog";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight">LancerParts</h1>
      <p className="mt-1 text-muted-foreground">
        Mitsubishi Lancer CK2A · 4G15 1.5L — {CATEGORIES.length} categories, {TOTAL_DIAGRAMS} diagrams. Pick a
        category to explore it in 3D.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const ready = c.diagrams.filter((d) => d.partsDiagramId).length;
          return (
            <Link key={c.id} href={`/categories/${c.id}`} className="rounded-xl focus-visible:outline-2">
              <Card className="h-full transition-colors hover:bg-muted">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    {c.name}
                    {ready > 0 && <Badge>{ready} with parts</Badge>}
                  </CardTitle>
                  <CardDescription>
                    {c.diagrams.length} {c.diagrams.length === 1 ? "diagram" : "diagrams"} ·{" "}
                    {c.diagrams
                      .slice(0, 3)
                      .map((d) => d.name)
                      .join(", ")}
                    {c.diagrams.length > 3 ? "…" : ""}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
